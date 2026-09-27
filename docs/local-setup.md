# Local workshop laptops

A few laptops running the playground locally, as a backup to Cloud Agents. The preview updates within seconds of
each change instead of a couple of minutes, and they keep working if Cloud Agents are slow or unavailable.

Each team's work always lives on its `team-NN` branch on GitHub. A team can move from Cloud Agents to a laptop and
back as often as needed, as long as the work is pushed before they move.

## Checklist (one per laptop)

**Before the day**

- [ ] Cursor desktop installed and signed in with the DIBI Cursor account
- [ ] Default agent model set to the same one the Cloud Agents use (e.g. Composer 2.5 or Grok 4.7)
- [ ] Commands allowed to run without asking, or at least `npm run check`, `npm run workshop:team` and `git`
      (Cursor Settings > Agents), so teams aren't stopped by approval prompts
- [ ] Repo cloned and set up by the agent: open an empty Cursor window and paste the prompt below
- [ ] Test push works (the agent does this as part of setup)
- [ ] Power, sleep and screen lock off (System Settings > Lock Screen), charger packed

Setup prompt to paste into the agent:

> Set up this laptop as a local workshop machine for the dibi-2027 repo by following docs/local-setup.md in
> https://github.com/tyler-dibi/dibi-2027. Clone it into ~/Documents/dibi-2027 first.

**On the day, handing the laptop to a team**

1. In the Cursor terminal: `npm run workshop:team -- 03` (their team number). It pulls their latest work and opens
   their playground in the browser.
2. Start a new agent chat and tell them to begin with "We're Team 03".
3. Their live URL keeps updating after each change, the same as with Cloud Agents.

**Moving back to Cloud Agents**

1. `npm run workshop:team -- --check`. If it says anything isn't published, ask the agent to publish it, then check
   again.
2. The team opens cursor.com/agents, picks the dibi-2027 repo and their `team-NN` branch, and carries on.

## Agent instructions: setting up this laptop

Follow these steps in order. Stop and tell the person if a step fails; don't work around it. Run long-running
commands (the preview) in the background.

1. **Tools.** Check `git --version` and `node --version` (needs 20 or later; 22 is recommended). If Node is
   missing or too old, ask the person to install the LTS version from https://nodejs.org and reopen Cursor.
2. **Code.** If `~/Documents/dibi-2027` doesn't exist, run
   `git clone https://github.com/tyler-dibi/dibi-2027.git ~/Documents/dibi-2027`. Then open that folder in Cursor
   (File > Open Folder) so these rules apply, and run `npm install` inside it.
3. **GitHub sign-in, so the laptop can publish.** Check `gh auth status`.
   - If `gh` isn't installed, use `brew install gh` when Homebrew is available. Otherwise download the macOS zip from
     https://github.com/cli/cli/releases/latest, unzip it and put the `gh` binary in `~/.local/bin`.
   - Sign in with `gh auth login --hostname github.com --git-protocol https --web`. It prints a one-time code: show
     it to the person in your reply, and ask them to sign in to GitHub as the **DIBI workshop account** (not their
     own) at https://github.com/login/device and enter it.
   - Then run `gh auth setup-git`.
4. **Check it works.** Run `npm run workshop:team -- 01 --no-dev`, then `npm run check` (must pass), then
   `git push --dry-run origin HEAD:team-01`. It should say "Everything up-to-date". The dry run doesn't change
   anything; it only proves the sign-in can publish.
5. **Get ready.** Start the preview in the background with `npm run dev` and confirm
   http://localhost:5173/playground/team-01 loads.
6. **Report back** in plain language: what's set up, and anything the person still needs to do from the checklist
   above (model, command approvals, sleep settings).

## Agent instructions: switching team or handing back

- **Switch team:** `npm run workshop:team -- NN --no-dev`. The preview picks up the new branch by itself if it's
  already running; otherwise start it with `npm run dev` in the background. If the command refuses because work
  isn't published, publish it first (below), never discard it.
- **Publish:** `npm run check`, commit with a short message, then `git push origin HEAD:team-NN`. If the push is
  rejected because a Cloud Agent pushed in the meantime, run `git pull --rebase origin team-NN` and push again.
- **Hand back to Cloud Agents:** publish, then `npm run workshop:team -- --check`. Tell the team it's safe to
  continue at cursor.com/agents on their branch.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Preview is blank or shows an error overlay | The overlay says what's wrong; ask the agent to fix it. Refresh the browser. |
| Port 5173 is in use | A preview is already running. Use that tab, or stop the other one with Ctrl+C. |
| Push asks for a password or says permission denied | Redo step 3 (GitHub sign-in) with the DIBI workshop account. |
| The laptop's Wi-Fi is down | Use a phone hotspot. The agent needs the internet; the preview doesn't. |
| Anything else on the laptop | Move the team back to Cloud Agents: `--check`, then carry on at cursor.com/agents. |
