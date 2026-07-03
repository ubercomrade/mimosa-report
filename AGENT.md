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

`pnpm run dev` starts the browser presentation. `pnpm run build` writes the static build to `dist/`. `pnpm run export` writes `MIMOSA_BGRS_2026_slidev.pdf`.

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

- `slides.md`: Slidev deck entry point (34 slides).
- `components/`: small Vue components used by the deck
  (`BadgeRow`, `Callout`, `Card`, `CardGrid`, `Eyebrow`, `FigurePanel`, `ListCard`, `MetricGrid`, `Note`, `PipeFlow`, `PipelineFlow`).
- `styles/index.css`: global presentation styling.
- `global-bottom.vue`: persistent footer with conference label and slide count.
- `assets/` and `plots/`: only image files referenced by `slides.md`.
- `package.json` and `pnpm-lock.yaml`: local Slidev tooling.
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

## Validation

After substantive edits:

```fish
pnpm run build
```

Also check that Slidev still parses 34 slides unless the slide count was intentionally changed.

## Files Not to Treat as Primary Sources

- Generated builds and exported PDFs are historical outputs only.
- The parent `report/` directory (one level up) contains the previous non-Slidev working copy and its `package-lock.json`; it is a historical reference unless the user explicitly asks to compare or recover content from it.