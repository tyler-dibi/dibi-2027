#!/usr/bin/env node
// Generates printable table cards for a workshop: one card per team, two per A4 page.
// Each card has the shared Cursor login, the team's branch, its live URL (with a QR code) and example prompts.
//
// Usage: npm run workshop:cards
// Reads workshop.config.json (git-ignored, because it holds the shared password) and writes workshop-cards.html
// (also git-ignored). Open that file in a browser and print it.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const configPath = resolve(root, "workshop.config.json");
const examplePath = resolve(root, "workshop.config.example.json");
const outputPath = resolve(root, "workshop-cards.html");

if (!existsSync(configPath)) {
  copyFileSync(examplePath, configPath);
  console.log("Created workshop.config.json. Fill in your details, then run this again.");
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
const required = [
  "event",
  "teams",
  "cloudflareProject",
  "repo",
  "cursorEmail",
  "cursorPassword",
  "siteUsername",
  "sitePassword",
];
const missing = required.filter((key) => !config[key] || String(config[key]).startsWith("REPLACE"));
if (missing.length) {
  console.error(`Fill in these fields in workshop.config.json: ${missing.join(", ")}`);
  process.exit(1);
}

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// QR codes are drawn by a free public service when the page loads, so print while online.
const qr = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(url)}`;

const card = (n) => {
  const team = String(n).padStart(2, "0");
  const branch = `team-${team}`;
  const url = `https://${branch}.${config.cloudflareProject}.pages.dev`;
  const prompts = (config.prompts ?? []).map((p) => p.replaceAll("{team}", `Team ${team}`));

  return `
  <section class="card">
    <header>
      <div>
        <p class="eyebrow">${escape(config.event)} · Carbon Playground</p>
        <h1>Team ${team}</h1>
      </div>
      <p class="branch">Branch <strong>${branch}</strong></p>
    </header>

    <div class="body">
      <ol class="steps">
        <li>
          <h2>Sign in</h2>
          <p>Go to <strong>cursor.com/agents</strong> and sign in with:</p>
          <dl>
            <dt>Email</dt><dd>${escape(config.cursorEmail)}</dd>
            <dt>Password</dt><dd>${escape(config.cursorPassword)}</dd>
          </dl>
          ${config.loginNote ? `<p class="note">${escape(config.loginNote)}</p>` : ""}
        </li>
        <li>
          <h2>Pick your project</h2>
          <p>Choose the repo <strong>${escape(config.repo)}</strong> and the branch <strong>${branch}</strong>.</p>
        </li>
        <li>
          <h2>Describe what you want</h2>
          <p>Try prompts like:</p>
          <ul class="prompts">${prompts.map((p) => `<li>“${escape(p)}”</li>`).join("")}</ul>
        </li>
      </ol>

      <aside class="live">
        <img src="${qr(url)}" alt="QR code for ${escape(url)}" />
        <h2>Your live prototype</h2>
        <p class="url">${escape(url)}</p>
        ${
          config.siteUsername
            ? `<p class="note">Log in with <strong>${escape(config.siteUsername)}</strong> / <strong>${escape(config.sitePassword)}</strong></p>`
            : ""
        }
        <p class="note">Updates about a minute after each change. Share it, or present from it.</p>
      </aside>
    </div>

    <footer>Only Carbon by Sage components. If something isn't possible, the agent suggests the closest Carbon pattern.</footer>
  </section>`;
};

const cards = Array.from({ length: Number(config.teams) }, (_, i) => card(i + 1)).join("\n");

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<title>${escape(config.event)} table cards</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #000; background: #e6ebed; }
  .card {
    width: 210mm; height: 148.5mm; padding: 10mm 12mm; margin: 0 auto 6mm; background: #fff;
    display: flex; flex-direction: column; gap: 5mm; break-inside: avoid; page-break-inside: avoid;
  }
  @media print {
    body { background: #fff; }
    .card { margin: 0; border-bottom: 1px dashed #99adb7; }
    .card:nth-of-type(2n) { border-bottom: none; break-after: page; page-break-after: always; }
    .hint { display: none; }
  }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #00815d; padding-bottom: 3mm; }
  h1 { margin: 0; font-size: 30pt; line-height: 1; }
  h2 { margin: 0 0 1mm; font-size: 11pt; }
  p { margin: 0 0 1.5mm; font-size: 9.5pt; line-height: 1.35; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 8pt; color: #335b70; margin-bottom: 1.5mm; }
  .branch { font-size: 12pt; margin: 0; }
  .branch strong { font-family: ui-monospace, Menlo, monospace; background: #e6ebed; padding: 1mm 2.5mm; border-radius: 1.5mm; }
  .body { flex: 1; display: grid; grid-template-columns: 1fr 58mm; gap: 8mm; min-height: 0; }
  .steps { margin: 0; padding-left: 5mm; display: flex; flex-direction: column; gap: 3mm; }
  .steps > li { font-weight: 700; font-size: 11pt; }
  .steps > li > * { font-weight: 400; }
  .steps > li > h2 { font-weight: 700; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 1mm 3mm; margin: 1mm 0; font-size: 10.5pt; }
  dt { color: #335b70; }
  dd { margin: 0; font-family: ui-monospace, Menlo, monospace; font-weight: 700; }
  .prompts { margin: 0; padding-left: 4mm; font-size: 9pt; line-height: 1.35; font-weight: 400; }
  .prompts li { margin-bottom: 1mm; }
  .live { display: flex; flex-direction: column; align-items: center; text-align: center; background: #f2f5f6; border-radius: 3mm; padding: 5mm 4mm; }
  .live img { width: 38mm; height: 38mm; margin-bottom: 3mm; }
  .url { font-family: ui-monospace, Menlo, monospace; font-size: 8.5pt; font-weight: 700; word-break: break-all; }
  .note { font-size: 8pt; color: #335b70; }
  footer { font-size: 8pt; color: #335b70; }
  .hint { max-width: 210mm; margin: 6mm auto; font-size: 10pt; }
</style>
</head>
<body>
<p class="hint">${escape(config.teams)} cards, two per A4 page. Print with margins set to <strong>None</strong> and background graphics on. Cut along the dashed lines.</p>
${cards}
</body>
</html>
`;

writeFileSync(outputPath, html, "utf8");
console.log(`Wrote workshop-cards.html (${config.teams} cards). Open it in a browser and print.`);
