#!/usr/bin/env node
// Creates one branch per workshop team (team-01, team-02, …), each with a starter playground, branched from main.
//
// Usage:
//   npm run workshop:branches                   create team-01 … team-14 locally
//   npm run workshop:branches -- --push         …and push them (each one publishes to its own URL)
//   npm run workshop:branches -- --reset --push recreate every team branch from main, e.g. after a dry run
//   npm run workshop:branches -- --count 10     a different number of teams
import { execFileSync } from "node:child_process";
import { createPlayground } from "./playgrounds.mjs";

const args = process.argv.slice(2);
const push = args.includes("--push");
const reset = args.includes("--reset");
const countIndex = args.indexOf("--count");
const count = countIndex >= 0 ? Number(args[countIndex + 1]) : 14;

if (!Number.isInteger(count) || count < 1 || count > 99) {
  console.error("--count must be a whole number between 1 and 99.");
  process.exit(1);
}

const git = (...gitArgs) => execFileSync("git", gitArgs, { encoding: "utf8" }).trim();
const branchExists = (name) => git("branch", "--list", name) !== "";

if (git("status", "--porcelain") !== "") {
  console.error("Commit or stash your changes first; the working tree must be clean.");
  process.exit(1);
}
if (git("rev-parse", "--abbrev-ref", "HEAD") !== "main") {
  console.error("Switch to main first (git switch main). Team branches are created from it.");
  process.exit(1);
}

const created = [];
for (let n = 1; n <= count; n++) {
  const team = String(n).padStart(2, "0");
  const branch = `team-${team}`;

  if (branchExists(branch) && !reset) {
    console.log(`Skipped ${branch} (already exists; use --reset to recreate it)`);
    continue;
  }

  git("switch", "--quiet", "-C", branch, "main");
  const { file } = createPlayground(`Team ${team}`);
  git("add", file);
  git("commit", "--quiet", "-m", `Add Team ${team} starter playground`);
  git("switch", "--quiet", "main");
  created.push(branch);
  console.log(`Created ${branch} with ${file}`);
}

if (push && created.length > 0) {
  console.log(`\nPushing ${created.length} branches…`);
  git("push", ...(reset ? ["--force"] : []), "-u", "origin", ...created);
  console.log("Pushed. Each branch publishes to https://<branch>.<project>.pages.dev in about a minute.");
} else if (created.length > 0) {
  console.log("\nRun again with --push to publish them.");
}
