<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import Card from './Card.vue'
import Callout from './Callout.vue'
import BadgeRow from './BadgeRow.vue'

const { clicks } = useNav()
const highlightAnnotation = computed(() => clicks.value >= 1)
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
        <p class="pipeline-subhead">In vitro</p>
        <BadgeRow :items="['HT-SELEX', 'DAP-seq']" />
        <p class="pipeline-subhead">In vivo</p>
        <BadgeRow :items="['ChIP-seq', 'CUT&amp;Tag']" />
      </Card>

      <div class="pipeline-arrow">
        <span class="pipeline-arrow-label">sequences</span>
        <span class="arrow">&rarr;</span>
      </div>

      <Card>
        <h3>2 &middot; <em>de novo</em> motif discovery</h3>
        <Callout>Search for overrepresented sequence patterns.</Callout>
        <p class="pipeline-subhead">Tools</p>
        <BadgeRow
          variant="pwm"
          :items="['STREME', 'MEME', 'HOMER']"
        />
        <BadgeRow
          variant="alt"
          :items="['BaMM', 'Slim', 'DIMONT', 'SiteGA']"
        />
      </Card>

      <div class="pipeline-arrow">
        <span class="pipeline-arrow-label">motifs</span>
        <span class="arrow">&rarr;</span>
      </div>

      <Card
        data-id="annotation-card"
        :class="{ 'annotation-highlight': highlightAnnotation }"
      >
        <h3>3 &middot; Annotation</h3>
        <Callout>Match the <em>de novo</em> motif to known motifs from HOCOMOCO, JASPAR or CIS-BP.</Callout>
        <p class="pipeline-subhead">Established tools</p>
        <BadgeRow
          variant="pwm"
          :items="['Tomtom', 'STAMP', 'MACRO-APE']"
        />
      </Card>
    </div>
  </div>
</template>
