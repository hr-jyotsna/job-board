# Startup Jobs Board

A single-page website that shows open (and closed) job postings, pulled live
from a Google Sheet. No database, no backend, no build step — it's plain
HTML/CSS/JS hosted for free on GitHub Pages.

**How it works:** your friend edits a Google Sheet. The website reads that
sheet's published CSV every time someone loads the page. She never touches
GitHub, code, or this repo again after the one-time setup below.

---

## What's in this folder

```
job-board/
  index.html          the page itself
  css/style.css        all styling (the "modern startup" theme)
  js/app.js            fetches the sheet data and renders the page
  js/config.js         <- the ONLY file you edit after setup (2 links)
  js/vendor/           a small CSV-parsing library, bundled locally
  data/                sample CSV files used only for local preview
```

---

## Part 1 — Try it on your own computer first (no GitHub needed)

1. Make sure you have Python installed (most Macs/Linux machines already do).
2. Open a terminal, `cd` into this `job-board` folder.
3. Run: `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser.

You should see the demo job board with sample jobs (Nimbus AI, Sprout
Commerce, PayLoop). This is exactly what it will look like once it's live —
it's just reading `data/sample-jobs.csv` and `data/sample-profile.csv`
instead of a real Google Sheet for now.

---

## Part 2 — Put it on GitHub Pages (public, free hosting)

You said you'll create a fresh GitHub account for her and upload the code
yourself, so here's the no-command-line path using GitHub's website:

1. **Create the account** (if not already done): go to github.com → Sign up.
2. **Create a new repository**:
   - Click the `+` in the top right → "New repository"
   - Name it something like `job-board` (the name shows up in the URL)
   - Set it to **Public**
   - Don't add a README/gitignore/license — leave it empty
   - Click "Create repository"
3. **Upload the files**:
   - On the new repo's page, click "uploading an existing file"
   - Drag the entire contents of this `job-board` folder in (all files and
     subfolders: `index.html`, `css/`, `js/`, `data/`, `README.md`)
   - Commit the upload (the default message is fine)
4. **Turn on GitHub Pages**:
   - Go to the repo's **Settings** tab → **Pages** (left sidebar)
   - Under "Build and deployment" → Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → **Save**
   - GitHub will show a green box a minute later with the live URL, in the
     form `https://<username>.github.io/job-board/`

That URL is the one you send to candidates and use yourself. It updates
automatically every time the Google Sheet changes — no re-uploading needed.

*(If you'd rather use git/command line instead of the web upload, this is a
completely normal static repo: `git init`, `git add .`, `git commit`,
`git remote add origin <repo-url>`, `git push -u origin main` works exactly
as expected.)*

---

## Part 3 — Connect her real Google Sheet

Two Google Sheets already exist as a working example (created in the
session that built this): **"Job Openings"** and **"Recruiter Profile"**,
inside a Drive folder called **"Freelance Recruiter Job Board"**. Replace
them with hers, or just edit these directly — the columns are what matter,
not the specific file.

**Column structure — Job Openings sheet:**

| Column | Notes |
|---|---|
| Job Title | required |
| Company | which startup the role is for |
| Location | e.g. "Bangalore", "Remote", "Bangalore / Remote" |
| Job Type | Full-time / Part-time / Internship / Contract |
| Status | **Open** or **Closed** — this drives the filter and badge |
| Date Posted | any date format, e.g. 2026-08-20 — used for sorting (newest first) |
| Start Date | free text, e.g. "Immediate" or "September 2026" |
| Experience Level | e.g. Entry-level / Mid / Senior |
| Description | 1-3 sentences shown on the card |
| Apply Link | a `mailto:someone@company.com` link, or a URL to a form/job post |
| Salary Range | free text, e.g. "₹15-20 LPA" — leave blank to hide it |

**Column structure — Recruiter Profile sheet** (single row, her info):

| Column | Notes |
|---|---|
| Name | shown as the page heading |
| Title | her tagline, e.g. "Freelance Recruiter — Startup Hiring Specialist" |
| Bio | 1-2 sentence intro |
| Email | plain address, e.g. `hello@example.com` |
| Phone | optional, shown as a tap-to-call link if no WhatsApp link is set |
| LinkedIn | full profile URL |
| WhatsApp | a `https://wa.me/91XXXXXXXXXX` link (recommended over Phone) |
| Location | e.g. "Bangalore, India" |
| Photo URL | optional — a public image link for her avatar; leave blank to show her initials instead |

Once her sheet has the right columns and at least one row of real data:

1. **File → Share → Publish to web** (in Google Sheets' menu)
2. Choose the specific tab (not "Entire document") and format
   **"Comma-separated values (.csv)"**
3. Click **Publish**, confirm the dialog, then copy the link shown
4. Repeat for the second sheet
5. Open `js/config.js` in this repo and paste the two links into
   `JOBS_CSV_URL` and `PROFILE_CSV_URL`
6. Re-upload just that one file to GitHub (or commit/push it) — that's the
   only code change ever required after this point

From then on, she opens **only the Google Sheet** — adds a row for a new
opening, changes `Status` to `Closed` when a role is filled, edits her
contact info — and the website reflects it automatically within a minute or
two, with zero further changes to GitHub.

---

## Customizing

- **Colors/branding**: all colors are CSS variables at the top of
  `css/style.css` (the `:root { ... }` block) — change `--accent-1` and
  `--accent-2` for a different gradient.
- **Site title**: `SITE_TITLE` in `js/config.js` and the `<title>` tag in
  `index.html`.
- **Custom domain** (optional): GitHub Pages supports pointing a domain you
  own at the site via Settings → Pages → Custom domain — not required, the
  free `github.io` URL works fine on its own.

## Troubleshooting

- **"Couldn't load the jobs sheet" message on the live site**: almost always
  means the sheet isn't published to the web yet, or the wrong tab/link was
  copied. Re-check Part 3.
- **Changes in the sheet aren't showing up**: the published CSV can take a
  minute or two to refresh after Google's own caching; also hard-refresh the
  browser tab (Ctrl/Cmd+Shift+R).
- **A row isn't appearing at all**: make sure the `Job Title` cell for that
  row isn't empty — empty titles are skipped so a half-finished row doesn't
  show up by accident.
