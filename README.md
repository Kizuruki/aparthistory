# AP Art History review

A static review site for the 250 required works, with two tabs:

- **Identifier review**: pick units or type work numbers (like `1-60, 75, 100-110`), then identify each work from its image or its title, by typing the identifiers or by multiple choice. Missed works keep coming back until every one has been answered right once. In typed mode, identifiers you already got stay filled in (click to reveal) and you only redo the ones you missed.
- **Image review**: same work selection, but you're shown a picture of the work (often a detail or another view) and name it, by typing the title or by multiple choice. "One at a time" shows a different image each time a missed work comes back; "Every image" asks about every picture separately.

**Browse these works** shows the selected works with their identifiers; "See all images" opens a gallery with every image of a work.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The page |
| `styles.css` | Styles |
| `works.js` | The 250 works and their identifiers, the main image for each, and date leniency |
| `images.js` | Extra images per work from Smarthistory |
| `grading.js` | Checks typed answers |
| `app.js` | Everything else |

## Put it on GitHub Pages

In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`. You can also open `index.html` straight from your computer.

## Editing identifiers

All works live in `works.js`, one line per work:

```
number | title | artist | culture | location | date | material
```

Leave a field empty when the CED doesn't list it. Extra accepted answers go after `~`; the first value is the one shown. For example:

```
34|Doryphoros (Spear Bearer)~Doryphoros~Spear Bearer|Polykleitos|||Original 450–440 BCE|Roman copy (marble) of Greek original (bronze)~Marble
```

To drop an extra image you don't like, delete its line in `images.js`.

## Notes

- Identifiers follow the list of required works in the College Board AP Art History Course and Exam Description (effective fall 2020).
- The main image for each work comes from the Knowt set "ap art history 250 (identifiers only)". Extra images and their captions come from Smarthistory's AP Art History guide (https://smarthistory.org/curated-guide/ap-art-history/), matched by work number including the guide's sub-articles (for example 17a, 17b, 17c), and kept only when the caption shows the work itself. Images load from those sites, so the site needs an internet connection.
- Typed answers are checked leniently by default: small typos, short names (e.g. "Vienna Genesis"), a surname, or part of a location count. If the checker marks something wrong that you know is right, use **Count mine as right**.
- Typed dates in lenient checking get AP-style year leniency: a year counts if it falls within that many years of one of the work's CED dates (c. 1450–1540 with ±50 accepts 1400 to 1590), and the era (BCE vs. CE) must be right. The values come from AP Art History FRQ scoring guides (2021–2025) where available and are listed in `DATE_LENIENCY` in `works.js`; other works use a default by era: before 1000 BCE ±1000, 1000 BCE–1399 CE ±100, 1400–1899 ±50, 1900–1949 ±25, 1950 on ±10. **Browse these works** shows each work's leniency. Strict checking and multiple choice don't use it.
- Settings and in-progress reviews are saved in your browser's local storage, separately for each tab.
