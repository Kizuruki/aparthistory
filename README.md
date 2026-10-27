# AP Art History identifier review

A static review site for the 250 required works. Pick units or type work numbers (like `1-60, 75, 100-110`), then identify each work from its image or its title, by typing the identifiers or by multiple choice. Missed works keep coming back until every one has been answered right once. In typed mode, identifiers you already got stay filled in (click to reveal) and you only redo the ones you missed.

## Put it on GitHub Pages

1. Create a new public repository on GitHub.
2. Upload these five files to the root of the repository: `index.html`, `styles.css`, `works.js`, `grading.js`, `app.js` (this README is optional).
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

You can also open `index.html` straight from your computer; it works without a server.

## Editing identifiers

All works live in `works.js`, one line per work:

```
number | title | artist | culture | location | date | material
```

Leave a field empty when the CED doesn't list it. Extra accepted answers go after `~`; the first value is the one shown. For example:

```
34|Doryphoros (Spear Bearer)~Doryphoros~Spear Bearer|Polykleitos|||Original 450–440 B.C.E.|Roman copy (marble) of Greek original (bronze)~Marble
```

## Notes

- Identifiers follow Appendix A of the College Board AP Art History Course and Exam Description.
- Images come from the Knowt set "ap art history 250 (identifiers only)" and load from Knowt's servers, so the site needs an internet connection. No. 163 (Bandolier bag) has no image in that set and is always shown by its title.
- Typed answers are checked leniently by default: small typos, short names (e.g. "Vienna Genesis"), a surname, or part of a location count. Dates must match the CED numbers and era (B.C.E. vs. C.E.); "More options" has a date leeway setting and a strict mode. If the checker marks something wrong that you know is right, use **Count mine as right**.
- Settings and in-progress reviews are saved in your browser's local storage.
