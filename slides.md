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

- Transcription factors (TFs) bind specific DNA sites and interact with the transcriptional complex
- TFs control gene expression programs.
- One TF can bind to a range of similar DNA sequences.
- A **motif** captures the allowed variation within them.


::right::

<Callout>
Motifs let us predict transcription factor binding sites (TFBS) in the genome, which makes it possible to study transcription regulation.
</Callout>

---
routeAlias: pwm-standard
clicks: 6
---

## Position weight matrix: the standard motif model

<div class="pwm-standard-grid">
  <section class="card pwm-standard-copy">
    <ul class="pwm-theses">
      <li>A PWM is built from aligned binding sites and scores candidate sites as a sum of position-specific contributions</li>
      <li v-click="4">PWM remains the de facto standard for motif representation and analysis</li>
      <li v-click="5">However, real TF binding can involve dependencies between motif positions, so some binding sites may be poorly captured by PWM alone</li>
    </ul>
  </section>

   <PWMAnimation :step="$clicks" /> 

  <Note v-click="6" class="pwm-standard-note">
      <span v-mark="{ at: 6, type: 'underline', color: '#9a4f48', iterations: 3 }">The position-independence assumption may not always be valid</span>
  </Note>
</div>

---
routeAlias: beyond-independent-positions
---

## Nature of dependency positions

<CardGrid :columns="3" class="card-grid-size-45-28-28 card-grid-bottom-media">
    <Card title="Dimerization" text="A partner TF can influence binding affinity at TFBSs.">
        <img class="card-media" :src="'assets/dimerization.svg'" alt="Dimerization schematic" />
    </Card>
    <Card title="Flanks" text="Flanking regions can either increase or decrease affinity for the same binding site.">
        <img class="card-media" :src="'assets/context.svg'" alt="Flanking sequence context schematic" />
    </Card>
    <Card title="Conformation" text="Some TFs can bind sites that differ substantially from the canonical motif.">
        <img class="card-media" :src="'assets/conformation.svg'" alt="Conformation-dependent binding schematic" />
    </Card>
</CardGrid>

<Note>
Models such as BaMM, Slim and DIMONT try to preserve this extra structure instead of flattening it into one matrix.
</Note>

---
routeAlias: binding-to-annotation
---

## From binding data to TF annotation

<div class="pipeline-flow">
  <div class="pipeline-flow-row">
    <section v-click="1" class="card" data-id="card-1">
      <h3>1 &middot; Experimental data</h3>
      <div class="callout">Read-to-sequence preprocessing</div>
      <p class="pipeline-subhead">In vitro</p>
      <div class="badge-row">
        <span class="badge">HT-SELEX</span>
        <span class="badge">DAP-seq</span>
      </div>
      <p class="pipeline-subhead">In vivo</p>
      <div class="badge-row">
        <span class="badge">ChIP-seq</span>
        <span class="badge">CUT&amp;Tag</span>
      </div>
    </section>
    <section v-click="2" class="card" data-id="card-2">
      <h3>2 &middot; <em>de novo</em> motif discovery</h3>
      <div class="callout">Search for overrepresented sequence patterns</div>
      <p class="pipeline-subhead">Tools</p>
      <div class="badge-row">
        <span class="model-pill pwm">STREME</span>
        <span class="model-pill pwm">MEME</span>
        <span class="model-pill pwm">HOMER</span>
      </div>
      <div class="badge-row">
        <span class="model-pill alt">BaMM</span>
        <span class="model-pill alt">Slim</span>
        <span class="model-pill alt">DIMONT</span>
        <span class="model-pill alt">SiteGA</span>
      </div>
    </section>
    <section
      v-click="3"
      v-mark="{ at: 4, type: 'box', color: 'var(--hot)' }"
      class="card"
      data-id="card-3"
    >
      <h3>3 &middot; Annotation</h3>
      <div class="callout">Match the <em>de novo</em> motif to known motifs from HOCOMOCO, JASPAR or CIS-BP</div>
      <p class="pipeline-subhead">Tools</p>
      <div class="badge-row">
        <span class="model-pill pwm">Tomtom</span>
        <span class="model-pill pwm">STAMP</span>
        <span class="model-pill pwm">MACRO-APE</span>
      </div>
    </section>
    <div v-click="2" class="badge-row pipeline-legend pipeline-legend-below">
      <span class="model-pill pwm">PWM motif model</span>
      <span class="model-pill alt">Alternative motif model</span>
    </div>
  </div>
</div>

<FancyArrow
  v-click="2"
  from="[data-id=card-1]@(170,0)"
  to="[data-id=card-2]@(160,0)"
  color="var(--primary)"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="0.2"
  :duration="500"
>
  <span class="arrow-label">sequences</span>
</FancyArrow>

<FancyArrow
  v-click="3"
  from="[data-id=card-2]@top"
  to="[data-id=card-3]@top"
  color="var(--primary)"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="0.2"
  :duration="500"
>
  <span class="arrow-label">motifs</span>
</FancyArrow>

<FancyArrow
  v-click="5"
  from="[data-id=card-3]@bottom"
  to="[data-id=bottleneck-note]@(800,0)"
  color="var(--primary)"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="-0.2"
  :duration="600"
/>


<Note v-click="5" data-id="bottleneck-note">
  <span v-mark="{ at: 5, type: 'underline', color: '#9a4f48', iterations: 3 }">Annotation tools exist only for PWM motif models, but not for alternative motif models.</span> Non-PWM models often have to be converted before annotation.
</Note>


<!--After de novo discovery we still need to know:

- Which known TF motif is closest?
- Are two discovered models equivalent?
- Do different tools recover the same signal?-->

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

---
routeAlias: recognition-profile-comparison
clicks: 5
---

## Recognition-profile comparison

<div class="mimosa-method-grid">
  <section class="card mimosa-method-copy">
    <ol class="mimosa-method-steps">
      <li>Scan a profile sequence set with both models.</li>
      <li v-click="1">Read out raw row-score profiles M1 and M2.</li>
      <li v-click="2">Calibrate each profile to <code>-log10(ERR)</code>.</li>
      <li v-click="3">Mark anchors above the threshold on M1 and extract local windows.</li>
      <li v-click="4">Shift M2 to match M1 shape and report the best similarity.</li>
    </ol>
  </section>

  <MimosaAlgorithmSteps :step="Math.min($clicks + 1, 5)" />
</div>

<Note v-click="5" class="mimosa-method-note">
Similarity is the best local agreement between calibrated recognition profiles, not between motif parameters.
</Note>

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

<Eyebrow>Benchmark against established tools</Eyebrow>

# Does it work as a retrieval method?

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
  src="assets/compare_tools_by_metrics.svg"
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

## Conclusion

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
