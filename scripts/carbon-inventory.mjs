#!/usr/bin/env node
// Reads carbon-react's type definitions and lists every public component export,
// flagging anything Carbon has marked @deprecated. Writes docs/carbon-components.md
// (the reference the Cursor agent uses) and docs/carbon-components.json.
//
// Run after upgrading carbon-react:  npm run carbon:inventory
import { mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const carbonLib = join(root, "node_modules/carbon-react/lib");
const componentsDir = join(carbonLib, "components");
const version = JSON.parse(readFileSync(join(root, "node_modules/carbon-react/package.json"), "utf8")).version;

// Folders with a public "__next__" entry point (a newer implementation of the component).
const nextEntries = readdirSync(componentsDir).filter((f) =>
  existsSync(join(componentsDir, f, "__next__", "package.json")),
);

const entryFiles = [];
for (const folder of readdirSync(componentsDir).sort()) {
  const index = join(componentsDir, folder, "index.d.ts");
  if (existsSync(index)) entryFiles.push({ folder, importPath: `carbon-react/lib/components/${folder}`, file: index });
  if (nextEntries.includes(folder)) {
    entryFiles.push({
      folder,
      importPath: `carbon-react/lib/components/${folder}/__next__`,
      file: join(componentsDir, folder, "__next__", "index.d.ts"),
      next: true,
    });
  }
}

const program = ts.createProgram(
  entryFiles.map((e) => e.file),
  { allowJs: false, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX },
);
const checker = program.getTypeChecker();

const deprecationOf = (symbol) => {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  for (const decl of target.declarations ?? []) {
    const tags = ts.getJSDocTags(decl.kind === ts.SyntaxKind.VariableDeclaration ? decl.parent.parent : decl);
    const dep = tags.find((t) => t.tagName.text === "deprecated");
    if (dep) return (ts.getTextOfJSDocComment(dep.comment) ?? "Deprecated").replace(/\s+/g, " ").trim();
  }
  return undefined;
};

// Deprecated by Carbon at runtime (console warning) but not annotated in the type definitions.
const RUNTIME_DEPRECATIONS = {
  "carbon-react/lib/components/accordion#AccordionGroup":
    "AccordionGroup has been deprecated. Stack Accordion components directly instead.",
};

const isComponentLike = (name) => /^[A-Z]/.test(name) && !/Props$|Handle$|Event$|Type$|Types$/.test(name);

const inventory = [];
for (const entry of entryFiles) {
  const source = program.getSourceFile(entry.file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;
  const exports = checker.getExportsOfModule(moduleSymbol);
  const items = [];
  for (const sym of exports) {
    const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
    if (!(target.flags & (ts.SymbolFlags.Value | ts.SymbolFlags.Function | ts.SymbolFlags.Class))) continue;
    let name = sym.getName();
    if (name === "default") name = target.getName() === "default" ? "default" : target.getName();
    if (!isComponentLike(name) && sym.getName() !== "default") continue;
    const deprecated = deprecationOf(sym) ?? RUNTIME_DEPRECATIONS[`${entry.importPath}#${name}`];
    items.push({ name, isDefault: sym.getName() === "default", deprecated });
  }
  if (items.length) inventory.push({ ...entry, file: undefined, exports: items });
}

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/carbon-components.json"), JSON.stringify({ version, inventory }, null, 2));

const lines = [
  `# Carbon by Sage component reference`,
  ``,
  `Generated from \`carbon-react@${version}\` by \`npm run carbon:inventory\`. Do not edit by hand.`,
  ``,
  `- Import each component from the path shown. There is no root \`carbon-react\` entry point.`,
  `- **Never use anything marked DEPRECATED.** Use the suggested replacement (often the \`__next__\` entry point).`,
  `- Props: read \`node_modules/carbon-react/lib/components/<folder>/<folder>.component.d.ts\` (or \`__next__/\`).`,
  `  Props marked \`@deprecated\` there must not be used either — the linter will fail on them.`,
  `- Storybook: https://carbon.sage.com/`,
  ``,
  `| Import path | Export | Import statement | Status |`,
  `| --- | --- | --- | --- |`,
];
for (const e of inventory) {
  for (const x of e.exports) {
    const stmt = x.isDefault ? `import ${x.name} from "${e.importPath}";` : `import { ${x.name} } from "${e.importPath}";`;
    const status = x.deprecated ? `DEPRECATED — ${x.deprecated.replace(/\|/g, "\\|")}` : "✅ current";
    lines.push(`| \`${e.importPath}\` | ${x.name} | \`${stmt}\` | ${status} |`);
  }
}
writeFileSync(join(root, "docs/carbon-components.md"), lines.join("\n") + "\n");

const deprecated = inventory.flatMap((e) => e.exports.filter((x) => x.deprecated).map((x) => `${x.name} (${e.importPath})`));
console.log(`carbon-react@${version}: ${inventory.length} entry points, ${inventory.reduce((n, e) => n + e.exports.length, 0)} exports`);
console.log(`Deprecated (${deprecated.length}):\n  ${deprecated.join("\n  ")}`);
