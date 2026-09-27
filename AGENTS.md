# Carbon Playground: agent instructions

This repo is a design-in-the-browser tool. Designers describe screens and the agent builds them as
**playgrounds**: React pages made **only** from [Carbon by Sage](https://carbon.sage.com/) components
(`carbon-react`). Follow these rules exactly. The linter enforces them and the build fails if they are broken.

## The one rule: Carbon by Sage only

- Only import UI from `carbon-react/lib/components/<folder>` (or `carbon-react/lib/hooks/<name>`).
  There is no root `carbon-react` entry point, so always use the deep path.
- **Never** use any other design system or UI library. That includes Carbon by IBM (`@carbon/react`,
  `carbon-components-react`), MUI, Chakra, Ant Design, Radix, shadcn, Tailwind, Bootstrap and icon packs.
  "Carbon" in this repo always means Carbon by **Sage**.
- **No raw HTML elements** (`div`, `span`, `p`, `h1`, `button`, `input`, `table`, `ul`, `img`, `a`, …).
  Use `Box` for layout, `Typography` for text, `Button`, `Link`, `FlatTable`, `Image`, `Icon` and so on.
- **No custom styling.** No `style`, `className`, `css` or `sx` props, no styled-components, no CSS files and
  no `dangerouslySetInnerHTML`. Style only through Carbon props: `Box` spacing, layout, colour and shadow
  props, and each component's variants and sizes.
- Use Carbon design tokens for colours, e.g. `bg="var(--colorsUtilityMajor010)"`. Don't use hex values.
- **Never use deprecated components or props.** Where a component has a `__next__` entry point, use it:
  - `Button` → `carbon-react/lib/components/button/__next__` (`variant`, `variantType`, `size`)
  - `Loader` → `carbon-react/lib/components/loader/__next__`
  - `Tabs`, `TabList`, `Tab`, `TabPanel` → `carbon-react/lib/components/tabs/__next__`
  - `Modal` → `Dialog`; `Hr` and `VerticalDivider` → `Divider`; `Heading` → `Typography`;
    `Pod`, `Content` and `Detail` → `Box`/`Tile`/`Card` plus `Typography`; `Alert`/`Confirm` → `Dialog`;
    `Toast` → `Message`; `Tooltip` → `Help`.
- If something **can't be built with Carbon**, say so plainly and suggest the closest Carbon pattern.
  Never work around it with custom markup or CSS.

## Where to look things up

1. `docs/carbon-components.md` lists every Carbon export with its exact import statement and deprecation
   status. Check it before using any component.
2. Props are in `node_modules/carbon-react/lib/components/<folder>/<folder>.component.d.ts`
   (or the `__next__/` folder). Props marked `@deprecated` there are banned.
3. The running app's **Components** page (http://localhost:5173/components) has a live example of every
   component. Its source is in `src/catalog/previews/*.tsx`, which is a good reference for working usage.
4. Storybook: https://carbon.sage.com/

## Playgrounds

- Each playground is a single file in `src/playgrounds/<slug>.tsx` and appears in the left nav automatically.
- Create a new one with `npm run new-playground -- "Invoice list"`, or use the **New playground** button in
  the app. Don't create the files by hand.
- Each file exports `meta = { title }` and a default React component. Keep that shape.
- A playground may import Carbon, `react`, and other files in the same folder (`./`). Nothing else.
- To share pieces between playgrounds, put them in a file starting with `_`, e.g.
  `src/playgrounds/_invoice-data.tsx`. Those files are helpers and don't appear in the nav.
- Use realistic, UK-English content (currency £, UK date formats) unless asked otherwise.
- Use `useState` for interactivity (open dialogs, selected rows, form values) so prototypes feel real.

## Publishing

- Every branch is published automatically to `https://<branch>.carbon-playground.pages.dev` when it's pushed. To publish,
  run `npm run check`, commit, then `git push` (use `git push -u origin <branch>` the first time).
- **Never commit to, merge into, or open pull requests against `main`** unless the repo owner explicitly asks for a
  change to the tool itself. It's the blank template, and other people's changes to it are undone automatically.
  If the designer is on `main`, create a short lowercase branch first
  (e.g. `git checkout -b tyler-invoices`). Only the first 28 characters appear in the URL.
- To pull in tool updates, run `git merge origin/main` on the designer's branch.

## Workshop teams

At workshops, each table is a team with its own branch (`team-01`, `team-02`, …) and a starter playground at
`src/playgrounds/team-NN.tsx`. Participants are designers, often new to Cursor. Follow these rules on top of
everything above:

- **Work out the team first.** Use the current branch if it's `team-NN`. If you're on another branch (e.g. a
  `cursor/…` branch created for a Cloud Agent), use the team named in the prompt or the branch you started from.
  If it's still unclear, ask which team they are before changing anything.
- **Only edit that team's files:** `src/playgrounds/team-NN.tsx`, plus any helper files named
  `src/playgrounds/_team-NN-*.tsx`. Never touch other teams' playgrounds, the shell or the config.
- **Publish after every change:** run `npm run check`, commit with a short message, then push to the team branch
  with `git push origin HEAD:team-NN`. If the push is rejected because the branch has moved on, run
  `git pull --rebase origin team-NN` and push again.
- **Tell them where to look:** end each reply with the live URL, `https://team-NN.carbon-playground.pages.dev`, and note
  that it updates about a minute after each push.
- **Never open a pull request,** merge, push to `main` or force-push, even if asked.
- **Local workshop laptops:** if asked to set up this machine for the workshop, switch it to another team, or hand
  a team back to Cloud Agents, follow `docs/local-setup.md`. If you're running in Cursor desktop on a participant's
  own laptop (not a Cloud Agent), follow its "participant's own laptop" section before making changes.
- Explain what you built in plain, friendly language. Avoid Git jargon.

## Useful Carbon patterns

- Page layout: `<Box p={4} display="flex" flexDirection="column" gap={3}>`.
- Grid: `<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>`.
- Surfaces: `Tile` (use `orientation="vertical"` for stacked content), `Card`, or
  `Box bg="var(--colorsUtilityYang100)" borderRadius="borderRadius100" boxShadow="boxShadow050"`.
- Text: `Typography variant="h1" | "h2" | "h3" | "p" | "strong" | "small"`, with `color="subtle"` for secondary text.
- Status: `Pill variant="green" | "orange" | "red" | "grey" | "blue"`; `Message variant="info" | "success" | "warning" | "error"`.
- `Box` has no border props; use `Divider`, `Tile` or `Card` for separation.
- `GlobalHeader` is always fixed to the top of the viewport. Offset content below it with `pt="40px"`.

## Before you finish

Run `npm run check` (ESLint plus TypeScript). It must pass with **zero errors and zero warnings**.
The dev server also shows lint and type errors as an overlay in the browser.

## Don't touch

- `src/app`, `src/pages` and `src/catalog` are the playground shell. Only change them if the user asks for
  changes to the tool itself.
- Don't weaken `eslint.config.js`, add dependencies, or upgrade `carbon-react` unless the user asks.
  After an upgrade, run `npm run carbon:inventory` to refresh `docs/carbon-components.*`.
