import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const PLAYGROUNDS_DIR = resolve(import.meta.dirname, "../src/playgrounds");

/** @param {string} title */
export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** @param {string} title */
function toComponentName(title) {
  const pascal = title
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return /^[A-Z]/.test(pascal) ? `${pascal}Playground` : `Playground${pascal}`;
}

/** @param {string} title */
function template(title) {
  const safeTitle = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const name = toComponentName(title);
  return `import Box from "carbon-react/lib/components/box";
import Typography from "carbon-react/lib/components/typography";

export const meta = {
  title: "${safeTitle}",
};

/**
 * Playground: ${title.replace(/\*\//g, "")}
 *
 * Build this page ONLY with components from Carbon by Sage
 * (imports from "carbon-react/lib/components/*"). See AGENTS.md.
 */
export default function ${name}() {
  return (
    <Box p={4}>
      <Typography variant="h1">${safeTitle}</Typography>
      <Typography>
        This is a blank playground. Ask the Cursor agent to start designing here.
      </Typography>
    </Box>
  );
}
`;
}

/**
 * Creates a new playground file and returns its slug.
 * @param {string} rawTitle
 */
export function createPlayground(rawTitle) {
  const title = (rawTitle || "").trim() || "Untitled playground";
  const base = slugify(title) || "untitled-playground";
  mkdirSync(PLAYGROUNDS_DIR, { recursive: true });

  let slug = base;
  let i = 2;
  while (existsSync(resolve(PLAYGROUNDS_DIR, `${slug}.tsx`))) {
    slug = `${base}-${i++}`;
  }

  const file = resolve(PLAYGROUNDS_DIR, `${slug}.tsx`);
  writeFileSync(file, template(title), "utf8");
  return { slug, title, file: `src/playgrounds/${slug}.tsx` };
}
