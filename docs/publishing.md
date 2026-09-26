# Publishing the playground (one-time setup)

Every branch in this repo is published to its own URL on **Cloudflare Pages**, and the URL updates each time someone
pushes to that branch. `main` is published as the blank template and is locked.

| Branch | URL |
| --- | --- |
| `main` (blank template) | `https://<project>.pages.dev` |
| `team-03` | `https://team-03.<project>.pages.dev` |

Builds run on **GitHub Actions** (`.github/workflows/deploy.yml`), not Cloudflare's build system. GitHub runs up to
20 builds at once, so many people can push at the same time and each sees their update in about a minute. A newer
push to the same branch replaces a build that hasn't finished.

Total cost: £0. On a public repo, GitHub Actions minutes are free and unlimited, and Cloudflare Pages is free. You
need a free Cloudflare account and admin access to this GitHub repo.

## 1. Create the Cloudflare Pages project

In a terminal in this repo, run the following, replacing `carbon-playground` with any name you like:

```bash
npx wrangler pages project create carbon-playground --production-branch=main
```

It opens a browser to sign in to Cloudflare the first time. The name becomes your URL: `carbon-playground.pages.dev`.
If the name is taken, Cloudflare adds a suffix; the command prints the real URL.

Don't connect the project to Git in the Cloudflare dashboard. GitHub Actions does the building and uploading.

## 2. Give GitHub access to Cloudflare

1. In Cloudflare, go to **My Profile > API Tokens > Create Token > Create Custom Token**. Give it the permission
   **Account > Cloudflare Pages > Edit** and create it. Copy the token.
2. Find your **Account ID** on the Cloudflare dashboard (**Workers & Pages** overview, right-hand side).
3. In GitHub, go to **Settings > Secrets and variables > Actions**:
   - **Secrets** tab: add `CLOUDFLARE_API_TOKEN` (the token) and `CLOUDFLARE_ACCOUNT_ID`.
   - **Variables** tab: add `CLOUDFLARE_PROJECT_NAME` (e.g. `carbon-playground`).
4. Push any branch. In the repo's **Actions** tab, the **Deploy** run shows the live URL when it finishes.

## 3. Lock `main`

1. Make the repo public: **Settings > General > Danger Zone > Change visibility**. Branch rules are free on
   public repos (on private ones they need a paid GitHub plan).
2. Go to **Settings > Rules > Rulesets > New ruleset > New branch ruleset**:
   - **Name:** Lock main
   - **Enforcement status:** Active
   - **Bypass list:** add **Repository admin** (you), so you can still update the tool.
   - **Target branches:** Add target > Include default branch.
   - **Rules:** tick **Restrict updates**, **Restrict deletions** and **Block force pushes**.
3. Select **Create**.

Nobody except you can now push to `main` or merge a pull request into it.

If the repo has to stay private, `.github/workflows/protect-main.yml` is a free fallback: it undoes any change to
`main` by anyone other than you, within about a minute. It needs **Settings > Actions > General > Workflow
permissions > Read and write permissions**. Once the ruleset is active, you can delete that workflow.

## 4. Optional: require sign-in to view prototypes

Branch URLs are public by default. To require a sign-in (free for up to 50 people), go to the Pages project in
Cloudflare and choose **Settings > General > Enable access policy**, then choose who's allowed in
**Zero Trust > Access > Applications**. For a public workshop this usually isn't needed.

## Workshop checklist

Each table is a team with one device, one brief and one branch (`team-01` … `team-14`). Everyone uses a shared
Cursor account on the web with Cloud Agents, so nobody installs anything or needs a GitHub account.

**Before the day**

1. Create a GitHub account for the event (e.g. `dibi-2027-workshop`) and give it **Write** access to this repo
   (**Settings > Collaborators**). Don't use your own account: its login will be shared.
2. Create a Cursor account for the event on a paid plan, connect it to that GitHub account, and install the Cursor
   GitHub app on this repo only. Set a spend limit.
3. Confirm with Cursor (hi@cursor.com) that one account can be used on about 14 devices at once.
4. Create and publish the team branches from an up-to-date `main`:

   ```bash
   git switch main && git pull
   npm run workshop:branches -- --push
   ```

5. Dry run with 2 or 3 laptops. Check each team can choose its own branch at cursor.com/agents and that its URL
   updates. Then reset every team branch to blank:

   ```bash
   npm run workshop:branches -- --reset --push
   ```

**On the day**

- Each table signs in at cursor.com/agents, picks this repo and its `team-NN` branch, and starts prompting.
- Their prototype is live at `https://team-NN.<project>.pages.dev`.
- Keep one laptop running the playground locally (`npm run dev`) as a backup.

**Afterwards**

- Change the shared Cursor password and remove the event GitHub account's access to the repo.
- Delete the team branches when you no longer need them: `git push origin --delete team-01 team-02 …`.

## Limits

- Branch URLs use at most 28 characters of the branch name.
- A push that fails the Carbon checks isn't published, so the URL keeps showing the last version that passed.
- If the repo is private, GitHub Actions includes 2,000 free minutes a month. Each build takes one to two minutes.
