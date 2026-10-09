# AGENTS.md - how to work in this repo

Instructions for any AI assistant or human working on this repository.
Read this fully before making changes.

## What this repo is

Single-page portfolio site for Imran Ahmed, live at https://imran.mvp.bd
via GitHub Pages. Plain HTML, CSS and JavaScript. No framework, no build
step. Repo name is `OmniTx/omnitx.github.io` (user site repo).

## Absolute rules

- Never add AI attribution to commits. No `Co-authored-by` trailers, no
  "generated with" notes. Commits must look fully human-written.
- No emojis and no em dashes anywhere: not in code, not in copy, not in
  commit messages, not in the README. Use hyphens, commas or colons
  instead. Date ranges use hyphens ("Jan 2019 - Present").
- Commit messages are short, lowercase-ish and human: "Fix hero spacing",
  "Replace NeonIndex with Notify with GOWA plugin". One blank line then a
  short body only if the change needs explanation.
- Never commit private files (resumes, documents, licensed fonts) and
  never merge the dev branch into main. Dev holds personal files.
- Do not commit, push or deploy unless the owner asked for it. When the
  owner says "make it live" or "ship it", that means: commit, push both
  branches, deploy, verify.
- Do not touch `.commandcode/`, do not modify `.gitignore` rules for it.
- Do not delete the GitHub repository. Repo deletion can only be done by
  the owner in the browser.

## Branches

- `main` - the site source. This is what gets deployed.
- `dev` - personal branch. Contains private files that must never reach
  main or the live site. Site changes get cherry-picked into it so it
  stays current.

Flow for a site change: commit on `main`, push, then
`git checkout dev && git cherry-pick main && git push origin dev && git
checkout main`. If you started on dev instead, commit there, push, then
cherry-pick that commit onto main. Never `git merge dev` into main.

## Deploying (the only way the site updates)

Deployment is manual. Pushing does not update the site.

1. Make sure main is pushed and correct.
2. Run the deploy: GitHub UI > Actions tab > "Deploy site" > Run workflow
   > pick the branch in the dropdown (this chooses what goes live) > Run.
   Or via API: `POST /repos/OmniTx/omnitx.github.io/actions/workflows/deploy.yml/dispatches`
   with body `{"ref":"main"}` using a token with repo scope.
3. Poll the run until it is completed with conclusion success.
4. Verify: `GET /repos/OmniTx/omnitx.github.io/pages` should report
   `status: built`, and the live site should show the change. The CDN can
   return a 503 for a minute right after a deploy; wait and retry with a
   cache-busting query string before assuming failure.

The workflow (`.github/workflows/deploy.yml`) strips `.git` and all
`*.docx` files from the artifact before upload. That is a safety net, not
permission to commit private files.

## Files map

- `index.html` - the whole page (hero, marquee, skills, projects,
  experience, education, GitHub stats, contact, footer)
- `style.css` - all styling, theme variables for light/dark
- `script.js` - theme toggle, GitHub stats fetch, custom cursor, year
- `404.html` - not-found page
- `robots.txt`, `sitemap.xml`, `CNAME` - SEO and domain (imran.mvp.bd)
- `.github/workflows/deploy.yml` - manual Pages deploy
- `assets/` - favicon.svg, b_logo-2.png, w_logo-2.png (og:image uses
  w_logo-2.png)

## Content conventions

- Project cards follow this shape: number + category ("05 · Open Source"),
  name, one-line type, two or three sentence description, tags. Cards link
  out with `target="_blank" rel="noopener"`. The grid is 6 cards in 3
  columns; keep it balanced.
- The WordPress plugin card links to the wordpress.org listing
  (https://wordpress.org/plugins/notify-with-gowa/), not GitHub.
- Keep copy concrete and modest. No marketing fluff, no "seamless", no
  "cutting-edge".
- Test changes in a browser before deploying when the change is visual.

## Environment notes

- Windows machine. CRLF warnings from git are normal and harmless.
- GitHub Actions builds Pages (build_type: workflow). Classic branch
  deploys are off. Actions minutes are free on this public repo.
- To roll back the live site, re-run an older successful deploy run from
  the Actions tab.
