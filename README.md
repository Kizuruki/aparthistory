# AP Art History Study Site

A single self-contained file: **`index.html`**. All 250 required works, their
identifiers (culture/period/artist, date, medium), a study/quiz mode, and a
chronological timeline are built in — there's nothing else to upload and
nothing to configure.

## Deploy to GitHub Pages (2 minutes)

1. Create a new GitHub repo (or use an existing one).
2. Upload `index.html` to the **root** of the repo (drag-and-drop on
   github.com works fine, or `git add index.html && git commit -m "site" && git push`).
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch
   `main`, folder `/ (root)`. Save.
5. Wait ~1 minute, then visit the URL GitHub gives you
   (`https://<your-username>.github.io/<repo-name>/`).

That's it — no build step, no dependencies, no server.

## About the images

I didn't scrape or rehost images from Quizlet (or anywhere else) into this
repo — pulling a bulk set of someone else's hosted flashcard images and
redistributing them would run into their terms of service, and it would also
leave you with a folder of images to manage and keep in sync.

Instead, **the page fetches each artwork's image live from Wikipedia's public
API** the moment it's needed (client-side, right in the visitor's browser via
`fetch()` to `en.wikipedia.org`). This has a few advantages:

- No images to download, host, or upload — the repo is one HTML file.
- Every image request happens fresh, so if Wikipedia's photo for a work
  improves, yours does too.
- It's lazy-loaded (timeline thumbnails only fetch once scrolled into view),
  so it stays fast even with 250 works on screen.
- If a piece doesn't have a great match on Wikipedia, you'll see a small
  "No image found" placeholder instead of a broken image — the quiz still
  works fine either way since the artwork's name is always shown.

If you ever want to swap in your own hand-picked images instead, open
`index.html`, search for `fetchImage(`, and point it at your own image URLs
or a local `/images/<num>.jpg` folder — the rest of the app doesn't care
where the image comes from.

## How the quiz works

- Pick a unit (or "All Units") and how many questions you want.
- You're shown the artwork's **name** and image (name always given, per your
  spec — it doesn't count as one of the identifiers).
- You type in as many of **culture/period/artist**, **date**, and
  **medium** as you remember (only the fields that actually apply to that
  work are shown).
- Grading is deliberately lenient — it looks for matching keywords and years
  within ~30 years, not exact strings — and you can always click
  "I actually got this right" to self-correct if it misjudges you.
- You need **at least 2 identifiers right** (or both, if only 2 apply) to
  have the question count as correct, exactly as you asked.
- At the end you get a score and a list of what to review, with a one-click
  "redo missed" option.

## How the timeline works

- Go to the **Timeline** tab, or click "Timeline" on any unit card on the
  home screen.
- The dropdown filters between "All Units" (all 250 works, true
  chronological order across every culture/region — nice for seeing what was
  happening simultaneously around the world) and any single unit's own
  timeline.
- Works are spaced evenly left-to-right in chronological order (dates span
  25,000 BCE to 2011 CE, so true-to-scale spacing would make the Paleolithic
  works and the 20th-century works impossible to see on the same screen).
  Each item shows its real date underneath.
- Click any work to open a detail card with the full-size image and all its
  identifiers.

## Data source

Work list, units, and identifiers are drawn from the AP Art History Course &
Exam Description's 250 required works. A handful of multi-image entries in
the source material (e.g. the Acropolis complex, the Palace of Versailles,
San Vitale's mosaics) were consolidated to one entry per official numbered
work, matching how they're tested on the exam.
