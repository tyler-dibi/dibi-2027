#!/usr/bin/env node
// Switches a local workshop laptop to a team's branch and opens its playground. See docs/local-setup.md.
//
// Usage:
//   npm run workshop:team -- 03            switch to team-03, pull its latest work and start the preview
//   npm run workshop:team -- 03 --no-dev   switch without starting the preview (e.g. it's already running)
//   npm run workshop:team -- --check       is everything on this laptop published? (run before handing back)
import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";

const PROJECT = "carbon-playground";
const args = process.argv.slice(2);

const git = (...gitArgs) =>
  execFileSync("git", gitArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const tryGit = (...gitArgs) => {
  try {
    return git(...gitArgs);
  } catch {
    return undefined;
  }
};
const fail = (message) => {
  console.error(`\n${message}\n`);
  process.exit(1);
};

const liveUrl = (branch) => `https://${branch}.${PROJECT}.pages.dev/playground/${branch}`;

function unpublishedWork() {
  const problems = [];
  if (git("status", "--porcelain", "--untracked-files=normal", "--", "src") !== "") {
    problems.push("there are changes that haven't been saved to Git yet");
  }
  const branch = git("rev-parse", "--abbrev-ref", "HEAD");
  if (/^team-\d{2}$/.test(branch)) {
    tryGit("fetch", "--quiet", "origin", branch);
    const ahead = tryGit("rev-list", "--count", `origin/${branch}..HEAD`);
    if (ahead === undefined) problems.push(`${branch} has never been pushed to GitHub`);
    else if (ahead !== "0") problems.push(`${ahead} change(s) on ${branch} haven't been pushed to GitHub`);
  }
  return { branch, problems };
}

if (args.includes("--check")) {
  const { branch, problems } = unpublishedWork();
  if (problems.length > 0) {
    fail(
      `Not ready: ${problems.join(", and ")}.\n` +
        'Ask the agent: "Run npm run check, commit our changes and push them to our team branch", then check again.',
    );
  }
  console.log(`\nEverything on ${branch} is published.`);
  if (/^team-\d{2}$/.test(branch)) {
    console.log(`Live (about a minute after the last push): ${liveUrl(branch)}`);
    console.log(`To carry on with Cloud Agents: cursor.com/agents > dibi-2027 repo > branch ${branch}.\n`);
  }
  process.exit(0);
}

const number = args.find((a) => /^\d{1,2}$/.test(a));
if (!number) fail("Say which team, e.g. npm run workshop:team -- 03");
const branch = `team-${number.padStart(2, "0")}`;

const { branch: current, problems } = unpublishedWork();
if (problems.length > 0 && current !== branch) {
  fail(
    `This laptop is still on ${current} and ${problems.join(", and ")}.\n` +
      "Publish that team's work first so nothing is lost, then switch.",
  );
}

console.log(`Getting the latest ${branch} from GitHub…`);
if (tryGit("fetch", "--quiet", "origin", branch) === undefined) {
  fail(`Couldn't find ${branch} on GitHub. Check the team number and the internet connection.`);
}

if (current !== branch) {
  const localExists = tryGit("rev-parse", "--verify", "--quiet", `refs/heads/${branch}`) !== undefined;
  if (localExists && git("rev-list", "--count", `origin/${branch}..${branch}`) !== "0") {
    fail(`The local copy of ${branch} has changes that aren't on GitHub. Switch to it and push them first.`);
  }
  git("switch", "--quiet", "-C", branch, "--track", `origin/${branch}`);
} else if (problems.length === 0) {
  git("merge", "--quiet", "--ff-only", `origin/${branch}`);
}
console.log(`On ${branch} with its latest work.`);

if (!existsSync("node_modules")) {
  console.log("Installing dependencies (first time only, about a minute)…");
  execFileSync("npm", ["install", "--no-audit", "--no-fund"], { stdio: "inherit" });
}

console.log(`Live URL: ${liveUrl(branch)}`);
if (args.includes("--no-dev")) process.exit(0);

console.log("Starting the preview. Leave this running; press Ctrl+C to stop it.\n");
spawn("npx", ["vite", "--open", `/playground/${branch}`], { stdio: "inherit" }).on("exit", (code) =>
  process.exit(code ?? 0),
);
