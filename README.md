# MIMOSA — BGRS/SB-2026 Presentation

Slidev deck for the BGRS/SB-2026 presentation about MIMOSA:
model-independent comparison of transcription factor motif models.

## Quick start

```fish
pnpm install
pnpm run dev
```

Then visit <http://localhost:3030>.

## Build / Export

```fish
pnpm run build      # → dist/
pnpm run export     # → MIMOSA_BGRS_2026_slidev.pdf
```

## Structure

- `slides.md` — deck entry point (34 slides).
- `components/` — Vue components used by the deck.
- `styles/index.css` — global presentation styling.
- `global-bottom.vue` — persistent footer with conference label and slide count.
- `assets/` — presentation images (GIF, PNG).
- `plots/` — benchmark and case-study figures.

Edit [slides.md](./slides.md) to see changes.
Learn more about Slidev at the [documentation](https://sli.dev/).