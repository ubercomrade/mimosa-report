<script setup>
import { computed } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
})

const activeStep = computed(() => Math.min(Math.max(Number(props.step) || 1, 1), 5))
const show = (step) => activeStep.value >= step
</script>

<template>
  <section class="card mimosa-method-figure">
    <figure class="mimosa-steps" aria-label="Stepwise schematic of MIMOSA recognition-profile comparison">
      <svg viewBox="0 0 700 280" role="img">
        <g v-show="show(1)" class="scan-layer">
          <rect class="model model-a" x="48" y="18" width="64" height="30" rx="12" />
          <text class="model-text" x="80" y="38" text-anchor="middle">M1</text>
          <rect class="model model-b" x="48" y="58" width="64" height="30" rx="12" />
          <text class="model-text" x="80" y="78" text-anchor="middle">M2</text>
          <path class="thin-line" d="M 116 33 C 150 33, 158 50, 188 50" />
          <path class="thin-line" d="M 116 73 C 150 73, 158 54, 188 54" />
          <rect class="sequence-pill" x="192" y="30" width="320" height="46" rx="16" />
          <text class="small-title" x="352" y="58" text-anchor="middle">shared sequences</text>
          <text class="sequence-subtitle" x="528" y="58">same rows, same positions</text>
        </g>

        <g v-show="show(2) || show(3) || show(4) || show(5)" class="profile-layer">
          <text
            v-show="show(2)"
            class="axis-title"
            x="100"
            y="104"
          >raw row scores</text>
          <text
            v-show="show(3) || show(4) || show(5)"
            class="axis-title"
            x="100"
            y="104"
          >calibrated recognition profiles: -log10(ERR)</text>

          <text class="profile-label model-a-text" x="58" y="164">M1</text>
          <polyline
            v-show="show(2)"
            class="profile profile-a profile-raw"
            points="104,162 132,156 160,164 188,154 216,160 244,142 272,165 300,170 328,156 356,161 384,142 412,168 440,170 468,156 496,164 524,170 552,158 580,166 608,154 636,162"
          />
          <polyline
            v-show="show(3) || show(4) || show(5)"
            class="profile profile-a profile-cal"
            points="104,162 132,160 160,165 188,158 216,163 244,120 272,160 300,166 328,158 356,162 384,120 412,165 440,170 468,158 496,162 524,168 552,160 580,164 608,159 636,161"
          />

          <g class="m2-profile-layer" :class="{ aligned: show(5) }">
            <text class="profile-label model-b-text" x="58" y="234">M2</text>
            <polyline
              v-show="show(2)"
              class="profile profile-b profile-raw"
              points="104,234 132,228 160,236 188,232 216,238 244,232 272,228 300,236 328,242 356,212 384,232 412,238 440,229 468,212 496,234 524,238 552,229 580,236 608,228 636,233"
            />
            <polyline
              v-show="show(3) || show(4) || show(5)"
              class="profile profile-b profile-cal"
              points="104,232 132,229 160,234 188,230 216,236 244,231 272,228 300,234 328,240 356,190 384,232 412,238 440,229 468,190 496,232 524,238 552,229 580,234 608,228 636,231"
            />

            <g v-show="show(3) || show(4) || show(5)">
              <circle class="anchor" cx="356" cy="190" r="6" />
              <circle class="anchor secondary" cx="468" cy="190" r="5" />
            </g>

            <g v-show="show(4) || show(5)">
              <rect class="window window-b" x="326" y="178" width="60" height="62" rx="8" />
            </g>
          </g>

          <g v-show="show(3) || show(4) || show(5)">
            <line class="threshold-line" x1="100" y1="144" x2="660" y2="144" />
            <line class="threshold-line" x1="100" y1="216" x2="660" y2="216" />
            <circle class="anchor" cx="244" cy="120" r="6" />
            <circle class="anchor secondary" cx="384" cy="120" r="5" />
          </g>

          <g v-show="show(4) || show(5)">
            <rect class="window" x="214" y="108" width="60" height="62" rx="8" />
          </g>

          <g v-show="show(5)" class="result-badge">
            <rect x="460" y="82" width="200" height="28" rx="12" />
            <text x="560" y="101" text-anchor="middle">max over strand and shift</text>
          </g>
        </g>
      </svg>
    </figure>
  </section>
</template>

<style scoped>
.mimosa-method-figure {
  display: flex;
  padding: 16px 18px;
}

.mimosa-steps {
  margin: 0;
  width: 100%;
}

.mimosa-steps svg {
  display: block;
  width: 100%;
}

.sequence-pill {
  fill: var(--surface-soft);
  stroke: var(--line);
  stroke-width: 2;
}

.model {
  stroke-width: 2;
}

.model-a {
  fill: var(--pwm-tint);
  stroke: var(--pwm-tint-border);
}

.model-b {
  fill: var(--alt-tint);
  stroke: var(--alt-tint-border);
}

.model-text,
.small-title,
.profile-label,
.axis-title {
  fill: var(--ink);
  font-family: var(--body-font);
  font-weight: 700;
}

.model-text,
.small-title,
.profile-label {
  font-size: 15px;
}

.axis-title {
  fill: var(--muted);
  font-size: 14px;
}

.sequence-subtitle {
  fill: var(--muted);
  font-family: var(--body-font);
  font-size: 12px;
  font-weight: 700;
}

.model-a-text {
  fill: var(--pwm-deep);
}

.model-b-text {
  fill: var(--alt-deep);
}

.thin-line {
  fill: none;
  stroke: var(--primary);
  stroke-linecap: round;
  stroke-width: 3;
}

.profile {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.profile-a {
  stroke: var(--pwm);
}

.profile-b {
  stroke: var(--alt);
}

.m2-profile-layer {
  transition: transform 650ms ease;
}

.m2-profile-layer.aligned {
  transform: translate(-112px, 0);
}

.threshold-line {
  stroke: var(--warn);
  stroke-dasharray: 8 7;
  stroke-width: 1.8;
}

.anchor {
  fill: var(--hot);
  stroke: var(--surface);
  stroke-width: 2;
}

.anchor.secondary {
  opacity: 0.72;
}

.window {
  fill: var(--warn-tint);
  stroke: var(--warn);
  stroke-dasharray: 8 5;
  stroke-width: 1.8;
}

.result-badge rect {
  fill: var(--surface);
  stroke: var(--primary-tint-border);
  stroke-width: 2;
}

.result-badge text {
  fill: var(--primary-deep);
  font-family: var(--body-font);
  font-size: 13px;
  font-weight: 800;
}
</style>
