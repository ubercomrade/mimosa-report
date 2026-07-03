<script setup>
import Callout from './Callout.vue'
</script>

<template>
  <div class="pipeline-content">
    <div class="badge-row">
      <span class="model-pill pwm">PWM motif model</span>
      <span class="model-pill alt">Alternative motif model</span>
    </div>

    <div class="stage-flow">
      <section class="stage">
        <header class="stage-head">
          <span class="stage-number">1</span>
          <span class="stage-title">Experimental data</span>
        </header>
        <Callout>Read-to-sequence preprocessing.</Callout>
        <h3>In vitro</h3>
        <div class="pill-row">
          <span class="pill">HT-SELEX</span>
          <span class="pill">DAP-seq</span>
        </div>
        <h3>In vivo</h3>
        <div class="pill-row">
          <span class="pill">ChIP-seq</span>
          <span class="pill">CUT&amp;Tag</span>
        </div>
      </section>

      <div class="arrow-cell">
        <span class="arrow-label">sequences</span>
        <span class="arrow">&rarr;</span>
      </div>

      <section class="stage discovery">
        <header class="stage-head">
          <span class="stage-number">2</span>
          <span class="stage-title"><em>de novo</em> motif discovery</span>
        </header>
        <Callout type="warn">Search for overrepresented sequence patterns.</Callout>
        <h3>Tools</h3>
        <div class="model-row">
          <span class="model-pill pwm">STREME</span>
          <span class="model-pill pwm">MEME</span>
          <span class="model-pill pwm">HOMER</span>
          <span class="model-pill alt">BaMM</span>
          <span class="model-pill alt">Slim</span>
          <span class="model-pill alt">DIMONT</span>
          <span class="model-pill alt">SiteGA</span>
        </div>
      </section>

      <div class="arrow-cell">
        <span class="arrow-label">motifs</span>
        <span class="arrow">&rarr;</span>
      </div>

      <section class="stage annotation">
        <header class="stage-head">
          <span class="stage-number">3</span>
          <span class="stage-title">Annotation</span>
        </header>
        <Callout type="good">Match the <em>de novo</em> motif to known motifs from HOCOMOCO, JASPAR or CIS-BP.</Callout>
        <h3>Established tools</h3>
        <div class="model-row">
          <span class="model-pill pwm">Tomtom</span>
          <span class="model-pill pwm">STAMP</span>
          <span class="model-pill pwm">MACRO-APE</span>
        </div>
      </section>
    </div>

    <Callout type="hot">
      <strong>Key point:</strong> annotation tools exist for PWM motif models, but not for alternative motif models.
    </Callout>
  </div>
</template>
