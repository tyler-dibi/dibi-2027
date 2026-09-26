# Carbon Playground

Design in the browser with real [Carbon by Sage](https://carbon.sage.com/) components. Describe a screen to the
Cursor agent and it builds it as a live, interactive page, using only Carbon components.

## Get started

You need [Node.js](https://nodejs.org/) 20 or later (`nvm use` picks up the right version).

```bash
git checkout -b <your-name>-<idea>          # your own branch, e.g. tyler-invoices
npm install
npm run dev                                 # opens http://localhost:5173
```

Then, in the app:

1. **Components** shows every Carbon component live. Hit **Copy** on a card to copy its name.
2. **New playground** creates a blank page (a file in `src/playgrounds/`) and adds it to the left nav.
3. In Cursor, open the agent and describe what you want, for example:
   _"In the invoice-list playground, use FlatTable to show 10 invoices with a status Pill and a Search above it."_
   The page updates as the agent edits it.

## Publish your prototype

Every branch is published automatically to its own URL, and it updates each time you push:

```bash
git add -A && git commit -m "Invoice list prototype"
git push -u origin tyler-invoices           # first push; afterwards just `git push`
```

About a minute later it's live at `https://tyler-invoices.<project>.pages.dev`.
The app header shows which branch you're looking at.

- **Keep branch names short and lowercase**, e.g. `tyler-invoices`. Only the first 28 characters appear in the URL.
- **Never merge into `main`** or open a pull request. `main` is the blank template everyone starts from, and any
  change to it is undone automatically.
- **Get the latest tool updates** by running `git merge origin/main` on your branch.
- A push that breaks the Carbon rules fails to build, and your URL keeps showing the last working version.
- **New playground** only works when running locally. On published URLs it's hidden.

Setting up hosting for the first time? See `docs/publishing.md`.

## The one rule

Only Carbon by Sage components are allowed: no other design systems (including Carbon by IBM), no raw HTML and no
custom CSS. This is enforced by ESLint (`eslint.config.js`), shown as an overlay in the browser, and the build fails if
it's broken. Deprecated Carbon components and props are blocked too. See `AGENTS.md` for the full rules the agent follows.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app at http://localhost:5173 |
| `npm run new-playground -- "Name"` | Create a new playground from the terminal |
| `npm run check` | Lint and type-check (must pass with no warnings) |
| `npm run build` | Check, then build a static version into `dist/` |
| `npm run carbon:inventory` | Refresh `docs/carbon-components.*` after upgrading `carbon-react` |

## Project layout

- `src/playgrounds/`: your designs, one file per playground
- `src/catalog/`: the Components page and its live previews
- `src/app/`, `src/pages/`: the playground shell (top nav, side nav, pages)
- `docs/carbon-components.md`: every Carbon export, its import statement and whether it's deprecated
- `AGENTS.md`, `.cursor/rules/`: instructions for the Cursor agent
