# Project Instructions

## Project Purpose

This directory contains the Slidev version of the BGRS/SB-2026 presentation about MIMOSA: model-independent comparison of transcription factor motif models.

The main presentation file is:

- `slides.md`

Use this directory as the working root for Slidev commands and presentation-specific edits.

## Terminal Environment

Run terminal commands through `fish` where possible.

This project uses **pnpm** (not npm). The lockfile is `pnpm-lock.yaml`; `pnpm-workspace.yaml` configures shamefully-hoist and the Playwright build-script allowlist for `slidev export`.

Useful commands:

```fish
pnpm install
pnpm run dev
pnpm run build
pnpm run export
```

`pnpm run dev` starts the browser presentation. `pnpm run build` writes the static build to `dist/`. `pnpm run build:pages` builds with `--base /mimosa-report/` for GitHub Pages (used by `.github/workflows/deploy.yml`). `pnpm run export` writes `MIMOSA_BGRS_2026_slidev.pdf`.

### Slidev version pin (52.15.2)

`@slidev/cli` is pinned to **52.15.2** in `package.json`. Slidev 52.16.0 shipped a regression (PR slidevjs/slidev#2562) where `getSlidePath` prepends `import.meta.env.BASE_URL` to the route path even though `vue-router` is already created with that base via `createWebHashHistory(BASE_URL)`. The base is therefore applied twice, so on a subdirectory deploy (e.g. `/mimosa-report/`) paging from `#/presenter/12` produces `#/mimosa-report/presenter/13` (or, with the previous `--base ./` workaround, `#/presenter/presenter/13` because the relative `./presenter/13` path resolves against the current route) and Slidev renders its 404 page. The bug affects both `routerMode: history` and `routerMode: hash`, and both the play view and the presenter view.

The upstream fix (PR slidevjs/slidev#2630, "keep slide paths relative to router base") was merged on 2026-07-03 but is **not released on npm yet** (latest as of 2026-07-07 is 52.16.0). When a release newer than 52.16.0 ships, unpin `@slidev/cli` back to `^52.x` (or the latest) and re-test `pnpm run build:pages` end-to-end on a subdirectory deploy, paging through both the play view (`/mimosa-report/#/12` → `#/13`) and the presenter view (`/mimosa-report/#/presenter/12` → `#/presenter/13`) to confirm the regression is gone.

Do **not** switch `build:pages` back to `--base ./`. The relative base relies on the browser resolving `./` against the current document URL, which combined with vue-router's `resolveRelativePath` produces `/presenter/presenter/N` from inside presenter mode. The absolute `--base /mimosa-report/` is what the Slidev hosting docs recommend for GitHub Pages and is what Slidev's own build step uses to write `dist/_redirects`.

## Source of Truth

The main scientific content, terminology, data interpretation, benchmark design, and case-study conclusions should be taken from the manuscript in the parent workspace:

- `../../MDPI/article.tex`

Use the article as the primary source for:

- biological motivation and terminology;
- MIMOSA method description;
- profile similarity metrics and statistical support;
- cross-database benchmark interpretation;
- ATF3 ChIP-seq case-study interpretation;
- discussion of limitations and future work.

Do not change scientific claims in the slides unless they remain consistent with `../../MDPI/article.tex` or the user explicitly requests a conceptual change.

## Core Scientific Message

The presentation should communicate the following ideas:

- TF motifs summarize variable transcription factor binding sites.
- PWM motif models are standard and widely supported by annotation tools.
- Alternative motif models can capture dependencies, spacer variants, and heterogeneous site classes.
- Existing annotation tools are mainly designed for PWM/PFM representations.
- Converting alternative motif models to PWM/PFM can lose biologically relevant information.
- MIMOSA compares motif models through recognition profiles rather than internal parameters.
- This allows motif comparison across PWM and alternative motif model architectures.
- Benchmark results show that MIMOSA is competitive with established PWM-oriented comparison tools.
- The ATF3 case study shows how profile-based comparison can reveal shared recognition behavior across different motif model types.

## Project Structure

- `slides.md`: Slidev deck entry point (27 slides).
- `components/`: small Vue components used by the deck
  (`BadgeRow`, `Callout`, `Card`, `CardGrid`, `Eyebrow`, `FigurePanel`, `ListCard`, `MetricGrid`, `Note`, `PipeFlow`, `PipelineFlow`).
  Components are thin wrappers with a `<slot/>`; `v-click`, `v-mark`, `class`, and `data-id` pass through to the root element.
- `styles/index.css`: global presentation styling. Defines the color tokens (`:root` variables: `--primary`, `--hot`, `--pwm`, `--alt`, …), layout classes (`.slidev-layout`, `.grid-2/3`, `.grid-60/45`), card/pipeline classes (`.card`, `.card-grid`, `.pipeline-flow`, `.pipeline-flow-row`, `.pipeline-legend`, `.pipeline-legend-below`), and `.note`/`.callout`/`.badge`/`.model-pill` styling.
- `global-bottom.vue`: persistent footer with conference label and slide count.
- `assets/` and `plots/`: only image files referenced by `slides.md`.
- `package.json` and `pnpm-lock.yaml`: local Slidev tooling. Notable add-ons: `slidev-addon-fancy-arrow` (provides `FancyArrow`).
- `pnpm-workspace.yaml`: pnpm configuration (shamefully-hoist, Playwright build-script allowlist).
- `netlify.toml`, `vercel.json`, `.gitignore`: deployment and VCS configuration.
- `README.md`: project overview.

Generated directories such as `node_modules/`, `dist/`, and `.slidev/` should not be committed.

## Figures and Assets

Keep image paths relative to `slides.md`.

Only presentation-used figures are stored in this directory. If a new slide needs an additional figure from the parent workspace, copy only that file into the matching local path under `assets/` or `plots/`; do not copy whole data directories.

After changing image references, verify that all referenced images exist:

```fish
node -e "const fs=require('fs'); const p=require('path'); const md=fs.readFileSync('slides.md','utf8'); const refs=[...md.matchAll(/\\bsrc=\"([^\"]+)\"/g)].map(m=>m[1]); const missing=refs.filter(x=>!x.startsWith('/')&&!fs.existsSync(p.join(process.cwd(),x))); console.log({refs:refs.length, missing}); if(missing.length) process.exit(1)"
```

## Slidev Editing Guidelines

- Prefer Markdown and Slidev layouts over raw HTML in `slides.md`.
- Keep repeated visual patterns in `components/` instead of expanding large HTML blocks in the deck.
- Use `Card`, `ListCard`, `Callout`, `FigurePanel`, `MetricGrid`, and `PipelineFlow` for existing visual patterns.
- Keep slide text concise and conference-oriented.
- Preserve the current visual style unless the user asks for a redesign.
- Use consistent terminology: `PWM motif model` and `Alternative motif model`.
- Keep speaker notes synchronized with visible slide content when the meaning changes.

### Directives and add-ons

- `v-click` (built-in): controls element visibility by click index. Apply as `v-click="N"` where N is the 1-based click index on the slide. Hidden elements use `visibility:hidden` (layout preserved, `FancyArrow` snap targets keep their geometry).
- `v-mark` (`@slidev/client` built-in directive, backed by `@slidev/rough-notation`): draws rough-notation over an element. Usage: `v-mark="{ at: N, type: 'box'|'underline'|'highlight'|'circle'|'strike-through'|'crossed-off'|'bracket', color: '#hex', strokeWidth, padding, iterations, animate, animationDuration, delay, opacity, multiline, rtl, brackets }"`. `at` is the click index (same scheme as `v-click`); `true` shows immediately, `false` hides. Color must be an explicit hex/CSS value — CSS variables like `var(--hot)` are **not** resolved by rough-notation, use the literal hex (e.g. `#9a4f48` for `--hot`). Modifiers exist: `v-mark.box="N"`, `v-mark.red`, `v-mark.delay300`, `v-mark.op50`. Prefer the object form in this project.
- `FancyArrow` (from `slidev-addon-fancy-arrow`): draws an animated rough arrow between two snap targets. Key props: `from`, `to` (selectors with anchor suffix: `[data-id=foo]@top|bottom|left|right|topleft|topright|bottomleft|bottomright`, or `@(x,y)` pixel offset on that edge), `color` (CSS variable like `var(--primary)` works here, or hex), `width`, `head-type="polygon"|"line"`, `head-size`, `roughness`, `arc` (signed; sign flips the side of the bow, magnitude 0–1 sets curvature), `duration`. Use `v-click="N"` on the component to reveal on click. The arrow SVG is `position: absolute` overlay — it does **not** take up flow space; do not rely on it for layout.

### Pipeline slide conventions (`binding-to-annotation`)

The three-card pipeline on the `binding-to-annotation` slide uses a dedicated structure:

- `.pipeline-flow` (flex column) wraps `.pipeline-flow-row` (a 3-column grid, `repeat(3, minmax(0,1fr))`, with separate `column-gap` (48px) and `row-gap` (12px) — the row-gap leaves room for the legend on row 2).
- Three `<section class="card" data-id="card-N">` cards are grid children. A legend `<div class="badge-row pipeline-legend pipeline-legend-below">` is a 4th grid child with `grid-column: 2; grid-row: 2;` so it sits strictly under card-2.
- Cards appear via `v-click`: card-1 on click 1, card-2 on click 2 (with the legend), card-3 on click 3.
- `FancyArrow` connectors between cards use `@top → @top` anchors and a positive `arc`; the `arrow-label` slot holds the caption. Arrows appear on the same click as their destination card.
- `v-mark` highlights card-3 with a `box` (click 4) and underlines text inside the `<Note>` (click 5). Keep `v-mark` `at` ≥ the element's `v-click` index so the annotation draws on a visible element.
- `.pipeline-flow { margin-top: 48px }` keeps arrow bows clear of the slide `h2` heading.

## Validation

After substantive edits:

```fish
pnpm run build
```

Also check that Slidev still parses 27 slides unless the slide count was intentionally changed:

```fish
node -e "const fs=require('fs'); const {parseSync}=require('@slidev/parser'); const md=fs.readFileSync('slides.md','utf8'); console.log(parseSync(md,'slides.md').slides.length)"
```

For visual / click-animation changes, run `pnpm run dev` and step through the affected slides (especially `binding-to-annotation`) to verify click ordering, arrow anchors, and `v-mark` reveal timing.

## Files Not to Treat as Primary Sources

- Generated builds and exported PDFs are historical outputs only.
- The parent `report/` directory (one level up) contains the previous non-Slidev working copy and its `package-lock.json`; it is a historical reference unless the user explicitly asks to compare or recover content from it.
