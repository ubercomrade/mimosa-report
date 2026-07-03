---
theme: default
title: Representation-independent comparison of transcription factor motifs
author: Anton V. Tsukanov
info: |
  BGRS/SB-2026 presentation about MIMOSA: model-independent comparison of transcription factor motif models.
htmlAttrs:
  lang: en
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
routerMode: hash
transition: slide-left
comark: true
layout: cover
class: title-slide
routeAlias: title
fonts:
  provider: none
  sans: Verdana
  serif: Georgia
  mono: Courier New
drawings:
  enabled: false
exportFilename: MIMOSA_BGRS_2026_slidev
download: false
---

<Eyebrow>BGRS/SB-2026 / MIMOSA</Eyebrow>

# Representation-independent comparison of transcription factor motifs

Anton V. Tsukanov &middot; Victor G. Levitsky

---
layout: two-cols-header
routeAlias: why-motifs-matter
---

## Why transcription factor motifs matter

::left::

- Transcription factors control gene expression programs.
- TFs bind specific DNA sites and interact with the transcriptional complex.
- The same TF tolerates sequence variation.
- A **motif** summarizes this tolerated variation.

::right::

<Callout>
Motifs let us predict transcription factor binding sites in the genome, which makes it possible to study transcription regulation.
</Callout>

---
routeAlias: binding-to-annotation
class: compact-pipeline
---

## From binding data to TF annotation

<PipelineFlow />

<!--
The pipeline starts with binding experiments, moves through de novo discovery, and ends with annotation against known databases. The bottleneck is the last step for non-PWM models.
-->

---
routeAlias: pwm-standard
---

## PWM: the standard model

<CardGrid :columns="2">
  <ListCard
    title="Position weight matrix"
    :items="[
      'One column per motif position.',
      'Weights for A/C/G/T.',
      'Simple score for each candidate site.',
    ]"
  />
  <ListCard
    title="Why it became standard"
    :items="[
      'Interpretable.',
      'Fast to scan.',
      'Supported by mature tools.',
    ]"
  />
</CardGrid>

<Note>
PWM assumes that motif positions contribute independently.
</Note>

---
routeAlias: beyond-independent-positions
---

## Beyond independent positions

<CardGrid :columns="3">
  <Card title="Dependencies" text="Neighboring nucleotides can interact in real TFBSs." />
  <Card title="Spacer variants" text="The same motif family may allow different half-site spacing." />
  <Card title="Site classes" text="One experiment may contain several related binding-site groups." />
</CardGrid>

<Note>
Models such as BaMM, Slim and DIMONT try to preserve this extra structure instead of flattening it into one matrix.
</Note>

---
layout: two-cols-header
routeAlias: annotation-bottleneck
---

## Annotation is the bottleneck

::left::

After de novo discovery we still need to know:

- Which known TF motif is closest?
- Are two discovered models equivalent?
- Do different tools recover the same signal?

::right::

<Note>
Most established comparison tools are PWM/PFM-centered. Non-PWM models often have to be converted before annotation.
</Note>

---
routeAlias: conversion-can-mislead
---

## Why conversion can mislead

<PipeFlow />

<Note>
We need a comparison method that does not require every motif model to pretend to be a PWM.
</Note>

---
layout: section
class: section-divider
routeAlias: mimosa-idea
---

<Eyebrow>MIMOSA idea</Eyebrow>

# Compare model **behavior**, not model parameters

The shared object is a recognition profile over the same sequences.

---
layout: two-cols-header
routeAlias: recognition-profile-comparison
---

## Recognition-profile comparison

::left::

1. Score a shared set of profile sequences.
2. Calibrate scores as `-log10(ERR)`.
3. Align strand and shift.
4. Compare the best-matched local profiles.

::right::

<FigurePanel
  src="assets/mimosa_algorithm_animation.gif"
  alt="Animated schematic of the MIMOSA algorithm"
  variant="compact"
  caption="Slidev keeps the GIF animation in the browser presentation."
/>

---
routeAlias: mimosa-returns
---

## What MIMOSA returns

<CardGrid :columns="2">
  <ListCard
    title="Similarity score"
    :items="[
      '<strong>Cosine</strong>: profile shape agreement.',
      '<strong>Dice</strong>: overlap of profile signal.',
      'Both range from 0 to 1.',
    ]"
  />
  <ListCard
    title="Statistical support"
    :items="[
      'Empirical null from shuffled motifs.',
      'P-values from the tail distribution.',
      'FDR correction for graph edges.',
    ]"
  />
</CardGrid>

<Note>
Interpretation: high score plus significant edge means similar recognition behavior, not necessarily identical parameters.
</Note>

---
layout: section
class: section-divider
routeAlias: retrieval-question
---

<Eyebrow>Retrieval benchmark</Eyebrow>

# Does it work as a retrieval method?

Benchmark against established PWM-oriented tools.

---
layout: two-cols-header
routeAlias: benchmark-design
---

## Benchmark design

::left::

- HOCOMOCO v14 mouse motifs.
- **in vitro** motifs used as queries.
- **in vivo** motifs used as targets.
- Correct hit = same TF annotation.

::right::

<Callout>
Retrieval question: does the method rank the corresponding TF motif near the top?
</Callout>

---
routeAlias: benchmark-result
---

## Benchmark result

<FigurePanel
  src="plots/Compare/compare_tools_by_metrics.png"
  alt="Benchmark metrics comparing MIMOSA with established motif-comparison tools"
  variant="wide"
/>

<MetricGrid
  :items="[
    { value: '0.833', label: 'Tomtom MRR' },
    { value: '0.826', label: 'MIMOSA-cosine MRR' },
    { value: '0.825', label: 'MIMOSA-Dice MRR' },
    { value: '0.946', label: 'MIMOSA Recall@10' },
  ]"
/>

---
routeAlias: benchmark-message
---

## Benchmark message

<CardGrid :columns="2">
  <Callout type="good">
  MIMOSA is competitive with the strongest matrix-oriented methods.
  </Callout>
  <ListCard
    :items="[
      'Tomtom keeps a small lead in mean MRR and Recall@1.',
      'MIMOSA is close: Recall@1 is approximately 0.766.',
      'MACRO-APE has the highest Recall@10: 0.954.',
      'STAMP is clearly lower in this benchmark.',
    ]"
  />
</CardGrid>

<Note>
The point is not "MIMOSA beats everyone"; it is "profile comparison keeps accuracy while allowing cross-model comparison".
</Note>

---
layout: section
class: section-divider
routeAlias: where-mimosa-helps
---

<Eyebrow>ATF3 case study</Eyebrow>

# Where MIMOSA helps

Interpreting heterogeneous motifs from one ATF3 ChIP-seq experiment.

---
layout: two-cols-header
routeAlias: atf3-case
---

## ATF3 case study

::left::

- Mouse ATF3 ChIP-seq: **GTRD PEAKS037311**.
- Top **2,000** MACS2 peaks.
- De novo discovery with STREME, BaMM, DIMONT and Slim.

::right::

<Callout>
Question: are these outputs different motifs, or different representations of the same AP-1/CRE-like signal?
</Callout>

---
routeAlias: same-data-different-outputs
---

## Same data, different outputs

<CardGrid :columns="2">
  <ListCard
    title="STREME PWMs"
    :items="[
      '<strong>PWM-1:</strong> <code>TGAnTCA</code>.',
      '<strong>PWM-2:</strong> <code>TGAnnTCA</code>.',
      'One nucleotide difference in spacer length.',
    ]"
  />
  <ListCard
    title="Flexible models"
    :items="[
      '<strong>BaMM</strong> and <strong>Slim</strong> capture both variants in one model.',
      '<strong>DIMONT</strong> is more divergent.',
    ]"
  />
</CardGrid>

<Note>
This is exactly the case where forcing everything through one PFM can hide the story.
</Note>

---
routeAlias: database-annotation-check
---

## Database annotation check

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/annotation_summary_tf_level.png"
  alt="TF-level annotation summary for ATF3 motifs"
  variant="wide"
/>

<Note>
PWM-1, PWM-2, BaMM and Slim fall into AP-1/CRE-like, ATF3-compatible specificity; DIMONT is less aligned with the main cluster.
</Note>

---
routeAlias: pairwise-profile-graph
---

## Pairwise profile graph

<CardGrid :columns="2">
  <ListCard
    :badges="['cosine', 'FDR \u003c 0.05']"
    :items="[
      'BaMM-PWM-1: <strong>0.88</strong>.',
      'BaMM-PWM-2: <strong>0.86</strong>.',
      'Slim-PWM-1: <strong>0.82</strong>.',
      'Slim-PWM-2: <strong>0.77</strong>.',
      'BaMM-Slim: <strong>0.89</strong>.',
    ]"
  />
  <FigurePanel
    src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/graph_cosine.svg"
    alt="Pairwise profile graph for ATF3 motifs by cosine similarity"
    variant="compact"
  />
</CardGrid>

<Note>
No direct PWM-1/PWM-2 edge: the two PWM motifs behave like separate spacer variants.
</Note>

---
routeAlias: site-level-support
---

## Site-level support

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/supervenn.png"
  alt="Supervenn site-overlap plot for ATF3 motif models"
  variant="wide"
/>

<MetricGrid
  :items="[
    { value: '8,641', label: 'BaMM sites' },
    { value: '6,554', label: 'PWM-1 sites' },
    { value: '5,726', label: 'Slim sites' },
    { value: '4,622', label: 'PWM-2 sites' },
  ]"
/>

<Note>
DIMONT: 4,136 sites. PWM-1 and PWM-2 form no strand-matched overlap clusters; BaMM overlaps both.
</Note>

---
routeAlias: interpretation
---

## Interpretation

<CardGrid :columns="2">
  <Card title="What the PWMs show" text="Two AP-1/CRE-like spacer variants are separated into two motifs." />
  <Card title="What BaMM/Slim show" text="A flexible model can recognize both variants as one broader specificity." />
</CardGrid>

<Note>
MIMOSA makes this visible without first flattening each model into a single PWM.
</Note>

---
routeAlias: take-home
---

## Take-home

1. MIMOSA compares **recognition profiles**, not motif parameters.
2. It stays close to strong established tools in a HOCOMOCO retrieval benchmark.
3. In the ATF3 case, it separates "two PWM spacer variants" from "one flexible model recognizing both".

<Callout type="warn">
Limitations to remember: profile sequence set, ERR calibration, recognition threshold, and empirical null model.
</Callout>

---
layout: end
class: thank-you
routeAlias: thank-you
---

# Thank you

Questions?

Software: [github.com/ubercomrade/mimosa](https://github.com/ubercomrade/mimosa)

---
layout: section
class: section-divider
routeAlias: backup
---

<Eyebrow>Backup</Eyebrow>

# Additional details

---
routeAlias: static-workflow
---

## Static workflow

<FigurePanel
  src="assets/article_fig1_workflow.png"
  alt="Static workflow of the MIMOSA analysis"
  variant="wide"
/>

---
routeAlias: formula-view
---

## Formula view

<CardGrid :columns="2">
  <Card title="Cosine">

  $$
  S_{\cos}(x,y)=\frac{x \cdot y}{||x||\,||y||}
  $$

  Compares profile shape.

  </Card>
  <Card title="Dice">

  $$
  S_{\mathrm{Dice}}(x,y)=\frac{2\sum_i \min(x_i,y_i)}{\sum_i x_i+\sum_i y_i}
  $$

  Compares profile overlap.

  </Card>
</CardGrid>

---
routeAlias: err-calibration-null
---

## ERR calibration and null

- ERR estimates how often a model produces a score at least this high.
- `-log10(ERR)` puts different score scales into one coordinate system.
- Shuffled HOCOMOCO motifs define empirical background similarity.
- FDR controls multiple testing in benchmark and case-study comparisons.

---
routeAlias: ranking-concordance
---

## Ranking concordance

<FigurePanel
  src="plots/Compare/Kendall_heatmap.png"
  alt="Kendall concordance heatmap for motif-comparison rankings"
  variant="tall"
/>

<Note>
Different tools rank the full target list differently, even when retrieval accuracy is close.
</Note>

---
routeAlias: atf3-motif-logos
---

## ATF3 motif logos

<FigurePanel
  src="assets/article_fig4_atf3_logos.png"
  alt="ATF3 motif logos from different motif discovery tools"
  variant="tall"
/>

---
routeAlias: annotation-details-rr
---

## Annotation details: reciprocal rank

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/annotation_rr_tf_level.png"
  alt="Reciprocal-rank annotation details at TF level"
  variant="tall"
/>

---
routeAlias: annotation-details-significance
---

## Annotation details: significance

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/annotation_significance_tf_level.png"
  alt="Significance annotation details at TF level"
  variant="tall"
/>

---
routeAlias: alignment-pwm1-pwm2
---

## Profile alignment: PWM-1 vs PWM-2

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/compare_profiles_PWM-1_vs_PWM-2.png"
  alt="Profile alignment comparing PWM-1 and PWM-2"
  variant="wide"
/>

---
routeAlias: alignment-pwm1-bamm
---

## Profile alignment: PWM-1 vs BaMM

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/compare_profiles_PWM-1_vs_BaMM.png"
  alt="Profile alignment comparing PWM-1 and BaMM"
  variant="wide"
/>

---
routeAlias: alignment-pwm2-bamm
---

## Profile alignment: PWM-2 vs BaMM

<FigurePanel
  src="plots/example_PEAKS037311_ATF3_Q60765_MACS2/compare_profiles_PWM-2_vs_BaMM.png"
  alt="Profile alignment comparing PWM-2 and BaMM"
  variant="wide"
/>
