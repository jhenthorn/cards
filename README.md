# Flagrant Disco Cards

A browsable gallery of the Flagrant Magazine Discord's Disco League trading cards. Click any card to flip it over and read the back.

Live at [cards.akymmustwin.com](https://cards.akymmustwin.com).

## Structure

Plain static site, no build step:

- `index.html`, `styles.css`, `app.js` — the gallery.
- `assets/cards/card-NN-front.webp` / `card-NN-back.webp` — card images.
- `scripts/extract-cards.sh` — regenerates `assets/cards/` from a source PDF.

## Adding new cards

If you get an updated PDF (same format: page 1 = card 1 front, page 2 = card 1 back, page 3 = card 2 front, ...):

```bash
scripts/extract-cards.sh /path/to/NewCards.pdf
```

Requires [poppler](https://poppler.freedesktop.org/) (`pdfinfo`, `pdftoppm`) and `cwebp` (from `webp`):

```bash
brew install poppler webp
```

Then update `CARD_COUNT` in `app.js` if the number of cards changed.

## Local preview

```bash
python3 -m http.server
```
