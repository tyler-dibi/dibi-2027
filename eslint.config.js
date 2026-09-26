import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/*
 * CARBON-ONLY GUARDRAILS
 *
 * This playground exists to design with Carbon by Sage (carbon-react) and nothing else.
 * These rules fail `npm run lint`, `npm run build` and show an overlay in the browser
 * during `npm run dev` whenever a file reaches outside the design system.
 */

const CARBON_ONLY_MESSAGE =
  "Only Carbon by Sage is allowed. Import components from 'carbon-react/lib/components/<name>'. See AGENTS.md.";

// Everything is forbidden unless it matches one of these allowed module prefixes.
const BASE_ALLOWED = ["react$", "carbon-react/lib/components/", "carbon-react/lib/hooks/"];

const allowOnly = (extraAllowed = []) => [
  {
    regex: `^(?!(${[...BASE_ALLOWED, ...extraAllowed].join("|")}))`,
    message: CARBON_ONLY_MESSAGE,
  },
  {
    regex: "^(?!carbon-react/).*\\.(css|scss|sass|less)$",
    message: "No custom CSS. Style with Carbon component props and Box spacing/layout props.",
  },
];

const DEPRECATED_CARBON = [
  { name: "carbon-react/lib/components/modal", message: "Modal is deprecated in Carbon. Use Dialog." },
  { name: "carbon-react/lib/components/hr", message: "Hr is deprecated in Carbon. Use Divider." },
  {
    name: "carbon-react/lib/components/vertical-divider",
    message: 'VerticalDivider is deprecated in Carbon. Use Divider with type="vertical".',
  },
  {
    name: "carbon-react/lib/components/accordion",
    importNames: ["AccordionGroup"],
    message: "AccordionGroup is deprecated in Carbon. Just stack Accordions.",
  },
];

// Raw HTML elements have a Carbon equivalent; point designers at it.
const FORBIDDEN_ELEMENTS = [
  ["div", "Box"],
  ["span", "Box or Typography"],
  ["section", "Box"],
  ["article", "Box"],
  ["header", "Box or GlobalHeader"],
  ["footer", "Box"],
  ["main", "Box"],
  ["aside", "Box, Drawer or Sidebar"],
  ["nav", "NavigationBar, Menu or VerticalMenu"],
  ["p", 'Typography variant="p"'],
  ["h1", 'Typography variant="h1" or Heading'],
  ["h2", 'Typography variant="h2"'],
  ["h3", 'Typography variant="h3"'],
  ["h4", 'Typography variant="h4"'],
  ["h5", 'Typography variant="h5"'],
  ["h6", "Typography"],
  ["strong", 'Typography variant="strong"'],
  ["em", 'Typography variant="em"'],
  ["small", 'Typography variant="small"'],
  ["label", "the label prop on Carbon inputs"],
  ["button", "Button, ButtonMinor or IconButton"],
  ["a", "Link"],
  ["input", "Textbox, Checkbox, RadioButton, Switch, Number, Decimal, DateInput…"],
  ["textarea", "Textarea"],
  ["select", "Select, FilterableSelect or MultiSelect"],
  ["option", "Option"],
  ["form", "Form"],
  ["fieldset", "Fieldset"],
  ["table", "FlatTable"],
  ["thead", "FlatTableHead"],
  ["tbody", "FlatTableBody"],
  ["tr", "FlatTableRow"],
  ["th", "FlatTableHeader"],
  ["td", "FlatTableCell"],
  ["ul", "List"],
  ["ol", "List"],
  ["li", "ListItem"],
  ["dl", "Dl"],
  ["dt", "Dt"],
  ["dd", "Dd"],
  ["img", "Image"],
  ["svg", "Icon"],
  ["i", "Icon"],
  ["hr", "Divider"],
  ["style", "Carbon component props"],
  ["iframe", "Carbon components"],
  ["video", "Carbon components"],
  ["canvas", "Carbon components"],
].map(([element, alternative]) => ({
  element,
  message: `Raw <${element}> is not allowed. Use Carbon's ${alternative} instead.`,
}));

const noCustomStyling = {
  "react/forbid-dom-props": ["error", { forbid: ["style", "className"] }],
  "react/forbid-component-props": [
    "error",
    {
      forbid: [
        { propName: "style", message: "No inline styles. Use Carbon props (Box spacing/layout, variants)." },
        { propName: "className", message: "No custom classes. Use Carbon props (Box spacing/layout, variants)." },
        { propName: "css", message: "No custom CSS. Use Carbon props." },
        { propName: "sx", message: "No custom CSS. Use Carbon props." },
      ],
    },
  ],
  "no-restricted-syntax": [
    "error",
    {
      selector: "TaggedTemplateExpression[tag.name=/^(styled|css|createGlobalStyle|keyframes)$/]",
      message: "No styled-components. Use Carbon components and props.",
    },
    {
      selector: "CallExpression[callee.object.name='styled']",
      message: "No styled-components. Use Carbon components and props.",
    },
    {
      selector: "TaggedTemplateExpression[tag.callee.name='styled']",
      message: "No styled-components. Use Carbon components and props.",
    },
    {
      selector: "TaggedTemplateExpression[tag.object.name='styled']",
      message: "No styled-components. Use Carbon components and props.",
    },
    {
      selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
      message: "Raw HTML is not allowed. Use Carbon components.",
    },
  ],
};

export default tseslint.config(
  { ignores: ["dist", "node_modules", "scripts", "*.config.*"] },

  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "18" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Catches Carbon components *and props* marked @deprecated in carbon-react's type definitions.
      "@typescript-eslint/no-deprecated": "warn",
    },
  },

  // App shell (the tool itself): Carbon plus the router, nothing else.
  {
    files: ["src/app/**", "src/pages/**", "src/catalog/**", "src/main.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: allowOnly([
            "react-dom/client$",
            "react-router-dom$",
            "carbon-react/lib/style/",
            "\\.\\.?/",
          ]),
        },
      ],
    },
  },

  // Playgrounds (what designers and the agent build): strictly Carbon components.
  {
    files: ["src/playgrounds/**/*.{ts,tsx}"],
    rules: {
      // Same-folder imports (./) are allowed so a playground can be split into files; they're linted too.
      "no-restricted-imports": ["error", { paths: DEPRECATED_CARBON, patterns: allowOnly(["\\./"]) }],
      "react/forbid-elements": ["error", { forbid: FORBIDDEN_ELEMENTS }],
      "@typescript-eslint/no-deprecated": "error",
      ...noCustomStyling,
    },
  },
);
