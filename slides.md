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
      <li>Scan a sequences with both motifs (<i>Motif 1</i>, <i>Motif 2</i>)</li>
      <li v-click="1">Get score profiles Profile 1 and Profile 2</li>
      <li v-click="2">Calibrate each profile to -log<sub>10</sub>(ERR)</li>
      <li v-click="3">Find anchor positions above the threshold on <i>Profile 1</i> and extract local windows</li>
      <li v-click="4">Shift <i>Profile 2</i> relative to <i>Profile 1</i> and compute a similarity score within each window.</li>
    </ol>
  </section>

  <MimosaAlgorithmSteps :step="Math.min($clicks + 1, 5)" />
</div>

<Note v-click="5" class="mimosa-method-note">
MIMOSA reports the strand and shift where the
<span v-mark="{ at: 5, type: 'underline', color: '#9a4f48', iterations: 3 }">similarity score is maximized</span>
across local profile windows
</Note>

---
routeAlias: formula-view
---

## Similarity metrics used in MIMOSA

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

<Callout>
Does the method rank the corresponding TF motif near the top?
</Callout>

::right::

- HOCOMOCO v14 mouse motifs
- Matching _in vitro_ and _in vivo_ motif collections only for common TFs
- Correct hit = same TF annotation
- Metric evaluate on each Wingender class independetly (at lest 10 motifs in class)
- Number of common motifs for each collections = 1115 
- Metrics: MMR, Recall@k
- Tools: TomTom, Stamp, MACRO-APE, MoSBAT

<style>
.two-cols-header {
  display: flex;
  flex-direction: column;
}
</style>

---
routeAlias: metrics
---

## Metrics for tool comparison

<CardGrid :columns="2" style="margin-bottom: 24px">
  <Card title="MRR">

  $$
  \mathrm{MRR}=\frac{1}{|Q|}\sum_{q \in Q}\frac{1}{r_q}
  $$

  Mean reciprocal rank: rewards placing the first correct motif as high as possible.

  </Card>
  <Card title="Recall@k">

  $$
  \mathrm{Recall@}k=\frac{1}{|Q|}\sum_{q \in Q}\mathbf{1}\{r_q \le k\}
  $$

  Fraction of queries where a correct motif appears within the top $k$ results.

  </Card>
</CardGrid>

$Q$ is the query motif set; $r_q$ is the rank of the first target motif annotated to the same TF as query $q$.


---
routeAlias: benchmark-result
clicks: 4
---

## Benchmark result

<FigurePanel
  src="assets/compare_tools_by_metrics.svg"
  alt="Benchmark metrics comparing MIMOSA with established motif-comparison tools"
  variant="wide"
/>

<div
  v-if="$clicks === 1"
  class="absolute"
  style="left: 620px; top: 290px; width: 20px; height: 20px;"
  v-mark="{ at: 1, type: 'circle', color: '#f87171', strokeWidth: 3, padding: 0 }"
></div>

<FancyArrow
  v-if="$clicks === 1"
  from="(770, 380)"
  to="(645,300)"
  color="red"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="-0.2"
  :duration="600"
/>

<div
  v-if="$clicks === 1"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 770px;
    top: 380px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    One TF class
</div>


<div
  class="absolute"
  style="left: 176px; top: 183px; width: 198px; height: 80px;"
  v-mark="{ at: 2, type: 'box', color: '#f87171', strokeWidth: 3, padding: 0 }"
></div>

<div
  v-click="2"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 90px;
    top: 150px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    MIMOSA matches base-line tools in MRR
</div>

<div
  class="absolute"
  style="left: 710px; top: 153px; width: 198px; height: 80px;"
  v-mark="{ at: 3, type: 'box', color: '#f87171', strokeWidth: 3, padding: 0 }"
></div>

<div
  v-click="3"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 604px;
    top: 120px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    MIMOSA matches base-line tools in Recall@5
</div>

<Note v-click="4">
MIMOSA provides motif annotation quality comparable to established PWM-oriented tools, while also supporting non-PWM motif models
</Note>

---
layout: section
class: section-divider
routeAlias: where-mimosa-helps
---

<Eyebrow>ATF3 case study</Eyebrow>

# Analisys of motifs from one ChIP-seq experiment

---
layout: two-cols-header
routeAlias: atf3-case
---

## Data

::left::

- _M.musculus_ ATF3 ChIP-seq: **GTRD PEAKS037311**.
- Top **2,000** MACS2 peaks
- _de novo_ discovery tools:
    1. STREME
    2. BaMM
    3. DIMONT 
    4. Slim

::right::

<Callout>
How similar are the ATF3 motifs recovered by different models?
</Callout>

---
routeAlias: same-data-different-outputs
clicks: 6
---

## Discovered motifs in DepLogo view

<CardGrid :columns="5" class="motif-output-grid">
  <Card title="PWM-1">
    <img src="./assets/PWM-1_PEAKS037311_ATF3_Q60765_MACS2.svg" alt="PWM-1 motif" />
    <p><code>TGAnTCA</code></p>
  </Card>

  <Card title="PWM-2">
    <img src="./assets/PWM-2_PEAKS037311_ATF3_Q60765_MACS2.svg" alt="PWM-2 motif" />
    <p><code>TGAnnTCA</code></p>
  </Card>

  <Card title="BaMM">
    <img
      v-if="$clicks < 6"
      src="./assets/BaMM_PEAKS037311_ATF3_Q60765_MACS2.svg"
      alt="BaMM motif"
    />
    <img
      v-else
      src="./assets/BaMM_PEAKS037311_ATF3_Q60765_MACS2partitions.svg"
      alt="BaMM motif partitions"
    />
  </Card>

  <Card title="Slim">
    <img
      v-if="$clicks < 6"
      src="./assets/Slim_PEAKS037311_ATF3_Q60765_MACS2.svg"
      alt="Slim motif"
    />
    <img
      v-else
      src="./assets/Slim_PEAKS037311_ATF3_Q60765_MACS2partitions.svg"
      alt="Slim motif partitions"
    />
  </Card>

  <Card title="DIMONT">
    <img
      v-if="$clicks < 6"
      src="./assets/Dimont_PEAKS037311_ATF3_Q60765_MACS2.svg"
      alt="DIMONT motif"
    />
    <img
      v-else
      src="./assets/Dimont_PEAKS037311_ATF3_Q60765_MACS2partitions.svg"
      alt="DIMONT motif partitions"
    />
  </Card>
</CardGrid>


<div
  v-if="$clicks === 1"
  class="absolute"
  style="left: 560px; top: 230px; width: 160px; height: 90px;"
  v-mark="{ at: 1, type: 'box', color: '#000000', strokeWidth: 3, padding: 0 }"
></div>

<FancyArrow
  v-if="$clicks === 1"
  from="(700, 190)"
  to="(645,225)"
  color="black"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="-0.2"
  :duration="600"
/>

<div
  v-if="$clicks === 1"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 705px;
    top: 177px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    pairwise positional dependencies
</div>


<div
  v-if="$clicks === 2"
  class="absolute"
  style="left: 560px; top: 325px; width: 160px; height: 90px;"
  v-mark="{ at: 1, type: 'box', color: '#000000', strokeWidth: 3, padding: 0 }"
></div>

<FancyArrow
  v-if="$clicks === 2"
  from="(700, 190)"
  to="(645,320)"
  color="black"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="-0.2"
  :duration="600"
/>

<div
  v-if="$clicks === 2"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 705px;
    top: 177px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    site block representation
</div>


<div
  v-if="$clicks === 3"
  class="absolute"
  style="left: 560px; top: 400px; width: 160px; height: 50px;"
  v-mark="{ at: 1, type: 'box', color: '#000000', strokeWidth: 3, padding: 0 }"
></div>

<FancyArrow
  v-if="$clicks === 3"
  from="(700, 195)"
  to="(645,390)"
  color="black"
  :width="3"
  :head-size="22"
  :roughness="1"
  :arc="-0.2"
  :duration="600"
/>

<div
  v-if="$clicks === 3"
  class="absolute text-xs font-semibold rounded-full px-3 py-1"
  style="
    left: 705px;
    top: 177px;
    color: #f87171;
    background: #000000;
    font-size: 16px;
  "
>
    logo
</div>


<div
  v-if="$clicks === 5"
  class="absolute"
  style="left: 582px; top: 345px; width: 134px; height: 21px;"
  v-mark="{ at: 1, type: 'box', color: '#000000', strokeWidth: 2, padding: 0 }"
></div>

<div
  v-if="$clicks === 5"
  class="absolute"
  style="left: 582px; top: 370px; width: 119px; height: 32px;"
  v-mark="{ at: 1, type: 'box', color: '#723EC3', strokeWidth: 2, padding: 0 }"
></div>



<Note>
Different motif models recover related AP-1/CRE-like signals, but represent site heterogeneity differently.
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

Software: [github.com/ubercomrade/mimosa](https://github.com/ubercomrade/mimosa)

---
layout: section
class: section-divider
routeAlias: backup
---

<Eyebrow>Backup</Eyebrow>

# Additional details


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
