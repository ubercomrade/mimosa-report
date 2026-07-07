# MIMOSA — BGRS/SB-2026 Presentation

Slidev deck for the BGRS/SB-2026 presentation about MIMOSA:
model-independent comparison of transcription factor motif models.

Online version: <https://ubercomrade.github.io/mimosa-report/>.

## Quick start

```fish
pnpm install
pnpm run dev
```

Then visit <http://localhost:3030>.

## Build / Export

```fish
pnpm run build      # -> dist/
pnpm run export     # -> MIMOSA_BGRS_2026_slidev.pdf
```

For GitHub Pages, build with the repository base path:

```fish
pnpm run build:pages
```

The deploy workflow in `.github/workflows/deploy.yml` does this automatically on
push to `main`. It uses pnpm, `pnpm-lock.yaml`, and uploads `dist/` to GitHub
Pages.

Slidev is built with the hash router (`routerMode: hash`). On GitHub Pages,
`/mimosa-report/` is the site base path and the slide route must stay after
`#`. Use links such as `/mimosa-report/#/` and `/mimosa-report/#/2`.
Do not duplicate the repository path inside the hash route, for example
`/mimosa-report/#/mimosa-report/2` is invalid.

## Structure

- `slides.md` — deck entry point (27 slides).
- `components/` — Vue components used by the deck.
- `styles/index.css` — global presentation styling.
- `global-bottom.vue` — persistent footer with conference label and slide count.
- `assets/` — presentation images (GIF, PNG).
- `plots/` — benchmark and case-study figures.

Edit [slides.md](./slides.md) to see changes.
Learn more about Slidev at the [documentation](https://sli.dev/).
