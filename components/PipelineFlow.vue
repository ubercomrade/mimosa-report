<script setup>
import Card from './Card.vue'
import Callout from './Callout.vue'
import BadgeRow from './BadgeRow.vue'
</script>

<template>
  <div class="pipeline-flow">
    <div class="badge-row pipeline-legend">
      <span class="model-pill pwm">PWM motif model</span>
      <span class="model-pill alt">Alternative motif model</span>
    </div>

    <div class="pipeline-flow-row">
      <Card>
        <h3>1 &middot; Experimental data</h3>
        <Callout>Read-to-sequence preprocessing.</Callout>
        <h3>In vitro</h3>
        <BadgeRow :items="['HT-SELEX', 'DAP-seq']" />
        <h3>In vivo</h3>
        <BadgeRow :items="['ChIP-seq', 'CUT&amp;Tag']" />
      </Card>

      <div class="pipeline-arrow">
        <span class="pipeline-arrow-label">sequences</span>
        <span class="arrow">&rarr;</span>
      </div>

      <Card>
        <h3>2 &middot; <em>de novo</em> motif discovery</h3>
        <Callout type="warn">Search for overrepresented sequence patterns.</Callout>
        <h3>Tools</h3>
        <div class="badge-row">
          <span class="model-pill pwm">STREME</span>
          <span class="model-pill pwm">MEME</span>
          <span class="model-pill pwm">HOMER</span>
          <span class="model-pill alt">BaMM</span>
          <span class="model-pill alt">Slim</span>
          <span class="model-pill alt">DIMONT</span>
          <span class="model-pill alt">SiteGA</span>
        </div>
      </Card>

      <div class="pipeline-arrow">
        <span class="pipeline-arrow-label">motifs</span>
        <span class="arrow">&rarr;</span>
      </div>

      <Card>
        <h3>3 &middot; Annotation</h3>
        <Callout type="good">Match the <em>de novo</em> motif to known motifs from HOCOMOCO, JASPAR or CIS-BP.</Callout>
        <h3>Established tools</h3>
        <div class="badge-row">
          <span class="model-pill pwm">Tomtom</span>
          <span class="model-pill pwm">STAMP</span>
          <span class="model-pill pwm">MACRO-APE</span>
        </div>
      </Card>
    </div>

    <Callout type="hot">
      <strong>Key point:</strong> annotation tools exist for PWM motif models, but not for alternative motif models.
    </Callout>
  </div>
</template>