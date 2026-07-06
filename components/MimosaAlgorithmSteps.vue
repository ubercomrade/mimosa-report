<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
})

const s = computed(() => Math.min(Math.max(Number(props.step) || 1, 1), 5))

const scanSequence = ['A', 'T', 'G', 'C', 'T', 'A', 'G', 'C', 'A', 'T', 'G', 'C', 'T', 'A']
const scanModels = [
  { id: 'm1', label: 'Motif 1', length: 4, y: 104, modelY: 38, scores: [2.1, 3.4, 2.7, 4.6, 3.2, 2.8, 4.1, 3.6, 2.9, 3.8, 2.5] },
  { id: 'm2', label: 'Motif 2', length: 6, y: 204, modelY: 292, scores: [1.9, 2.8, 4.2, 3.1, 4.9, 3.7, 2.6, 4.4, 3.3] },
]
const scanBaseX = 174
const scanBaseWidth = 34
const scanModelWidth = 166
const scanPos = ref(0)
let scanTimer = null

const scanCycleLength = computed(() => scanSequence.length - scanModels[0].length + 1)

function scanPositionFor(model) {
  return Math.min(scanPos.value, scanSequence.length - model.length)
}

function passedScanPositions(model) {
  return Array.from({ length: scanPositionFor(model) + 1 }, (_, i) => i)
}

function scoreForScan(model, pos) {
  return model.scores[pos]?.toFixed(1) ?? ''
}

function windowSeqForScan(model, pos) {
  return scanSequence.slice(pos, pos + model.length).join('')
}

function startScanLoop() {
  if (scanTimer !== null) {
    return
  }

  scanTimer = setInterval(() => {
    scanPos.value = (scanPos.value + 1) % scanCycleLength.value
  }, 1400)
}

function stopScanLoop() {
  if (scanTimer !== null) {
    clearInterval(scanTimer)
    scanTimer = null
  }
}

watch(s, (step) => {
  if (step === 1) {
    startScanLoop()
  } else {
    stopScanLoop()
  }
}, { immediate: true })

onMounted(() => {
  if (s.value === 1) {
    startScanLoop()
  }
})

onBeforeUnmount(() => {
  stopScanLoop()
})

// Shared x-coordinates for the 20 profile positions.
const xs = Array.from({ length: 20 }, (_, i) => 120 + i * 28)

// Jagged raw profiles with larger local swings.
const m1Raw = [
  { y: 152 }, { y: 128 }, { y: 158 }, { y: 132 }, { y: 165 },
  { y: 105 }, { y: 170 }, { y: 145 }, { y: 152 }, { y: 138 },
  { y: 168 }, { y: 110 }, { y: 158 }, { y: 135 }, { y: 162 },
  { y: 130 }, { y: 155 }, { y: 120 }, { y: 160 }, { y: 138 },
]

// Calibrated: baseline high, strong peaks well above threshold.
const m1Cal = [
  { y: 172 }, { y: 170 }, { y: 174 }, { y: 171 }, { y: 173 },
  { y: 92 }, { y: 175 }, { y: 172 }, { y: 171 }, { y: 174 },
  { y: 92 }, { y: 173 }, { y: 175 }, { y: 171 }, { y: 174 },
  { y: 172 }, { y: 170 }, { y: 173 }, { y: 171 }, { y: 174 },
]

const m2Raw = [
  { y: 250 }, { y: 222 }, { y: 255 }, { y: 228 }, { y: 260 },
  { y: 220 }, { y: 265 }, { y: 232 }, { y: 250 }, { y: 240 },
  { y: 262 }, { y: 218 }, { y: 255 }, { y: 230 }, { y: 258 },
  { y: 225 }, { y: 252 }, { y: 220 }, { y: 256 }, { y: 235 },
]

const m2Cal = [
  { y: 272 }, { y: 268 }, { y: 270 }, { y: 269 }, { y: 271 },
  { y: 190 }, { y: 272 }, { y: 270 }, { y: 268 }, { y: 271 },
  { y: 190 }, { y: 269 }, { y: 272 }, { y: 268 }, { y: 270 },
  { y: 269 }, { y: 268 }, { y: 270 }, { y: 269 }, { y: 271 },
]

const m1Points = computed(() => xs.map((x, i) => ({ x, y: (s.value >= 3 ? m1Cal : m1Raw)[i].y })))
const m2Points = computed(() => xs.map((x, i) => ({ x, y: (s.value >= 3 ? m2Cal : m2Raw)[i].y })))

const m2Shift = computed(() => (s.value >= 5 ? -112 : 0))

const showScan = computed(() => s.value === 1)
const showProfiles = computed(() => s.value >= 2)
const showRawTitle = computed(() => s.value === 2)
const showCalTitle = computed(() => s.value >= 3)
const showThresholds = computed(() => s.value >= 4)
const showWindows = computed(() => s.value >= 4)
const showResult = computed(() => s.value >= 5)
</script>

<template>
  <section class="card mimosa-method-figure">
    <figure class="mimosa-steps" aria-label="Stepwise schematic of MIMOSA recognition-profile comparison">
      <svg viewBox="0 0 760 340" role="img">
        <!-- Scanning step -->
        <g v-show="showScan" class="scan-layer">
          <g
            v-for="model in scanModels"
            :key="`scan-track-${model.id}`"
            :class="[`scan-track-${model.id}`]"
          >
            <g :transform="`translate(58, ${model.modelY})`">
              <rect
                class="model"
                :class="model.id === 'm1' ? 'model-a' : 'model-b'"
                x="0"
                y="0"
                :width="scanModelWidth"
                height="34"
                rx="12"
              />
              <text class="model-text" :x="scanModelWidth / 2" y="22" text-anchor="middle">
                {{ model.label }}, Length = {{ model.length }}
              </text>
            </g>

            <rect
              class="sequence-pill"
              :x="scanBaseX - 14"
              :y="model.y - 18"
              :width="scanSequence.length * scanBaseWidth + 28"
              height="44"
              rx="14"
            />

            <text
              v-for="(base, i) in scanSequence"
              :key="`${model.id}-base-${i}`"
              class="base-letter scan-base-letter"
              :x="scanBaseX + i * scanBaseWidth"
              :y="model.y + 9"
              text-anchor="middle"
            >{{ base }}</text>

            <g
              class="scan-window-group"
              :style="{ transform: `translateX(${scanPositionFor(model) * scanBaseWidth}px)` }"
            >
              <rect
                class="scanner-window"
                :class="model.id === 'm1' ? 'scanner-window-a' : 'scanner-window-b'"
                :x="scanBaseX - 14"
                :y="model.y - 24"
                :width="model.length * scanBaseWidth"
                height="56"
                rx="8"
              />
              <text
                class="scan-window-label"
                :x="scanBaseX - 14 + model.length * scanBaseWidth / 2"
                :y="model.y - 31"
                text-anchor="middle"
              >{{ windowSeqForScan(model, scanPositionFor(model)) }}</text>
            </g>

            <g class="scan-score-rows">
              <text class="scan-row-label" x="92" :y="model.y + 54">scores</text>
              <text class="scan-row-label" x="92" :y="model.y + 76">position</text>
              <g
                v-for="pos in passedScanPositions(model)"
                :key="`${model.id}-score-${pos}`"
                class="scan-history-column"
                :class="{ active: pos === scanPositionFor(model) }"
              >
                <text
                  class="scan-history-score"
                  :x="scanBaseX + pos * scanBaseWidth"
                  :y="model.y + 54"
                  text-anchor="middle"
                >{{ scoreForScan(model, pos) }}</text>
                <text
                  class="scan-history-position"
                  :x="scanBaseX + pos * scanBaseWidth"
                  :y="model.y + 76"
                  text-anchor="middle"
                >{{ pos + 1 }}</text>
              </g>
            </g>
          </g>
        </g>

        <!-- Profiles -->
        <g v-show="showProfiles" class="profile-layer">
          <text v-show="showRawTitle" class="axis-title" x="120" y="46">raw score profiles: M1 and M2</text>
          <text v-show="showCalTitle" class="axis-title" x="120" y="46">calibrated recognition profiles: -log10(ERR)</text>

          <!-- M1 profile -->
          <text class="profile-label model-a-text" x="70" y="108">M1</text>
          <g class="profile-points">
            <line
              v-for="i in m1Points.length - 1"
              :key="`m1-seg-${i}`"
              class="profile-segment profile-a"
              :x1="m1Points[i - 1].x"
              :y1="m1Points[i - 1].y"
              :x2="m1Points[i].x"
              :y2="m1Points[i].y"
            />
            <circle
              v-for="(p, i) in m1Points"
              :key="`m1-pt-${i}`"
              class="profile-point profile-a-fill"
              :cx="p.x"
              :cy="p.y"
              r="3.5"
            />
          </g>

          <!-- M2 profile (shifted on step 5) -->
          <g class="m2-profile-layer" :style="{ transform: `translateX(${m2Shift}px)` }">
            <text class="profile-label model-b-text" x="70" y="236">M2</text>
            <g class="profile-points">
              <line
                v-for="i in m2Points.length - 1"
                :key="`m2-seg-${i}`"
                class="profile-segment profile-b"
                :x1="m2Points[i - 1].x"
                :y1="m2Points[i - 1].y"
                :x2="m2Points[i].x"
                :y2="m2Points[i].y"
              />
              <circle
                v-for="(p, i) in m2Points"
                :key="`m2-pt-${i}`"
                class="profile-point profile-b-fill"
                :cx="p.x"
                :cy="p.y"
                r="3.5"
              />
            </g>
          </g>

          <!-- Threshold lines -->
          <g v-show="showThresholds">
            <line class="threshold-line" x1="110" y1="130" x2="660" y2="130" />
            <line class="threshold-line" x1="110" y1="222" x2="660" y2="222" />
          </g>

          <!-- Windows around M1 anchors only -->
          <g v-show="showWindows">
            <rect class="window" x="230" y="74" width="60" height="80" rx="8" />
            <rect class="window" x="370" y="74" width="60" height="80" rx="8" />

            <circle class="anchor" cx="260" cy="92" r="6" />
            <circle class="anchor secondary" cx="400" cy="92" r="5" />
          </g>

          <!-- Result badge -->
          <g v-show="showResult" class="result-badge">
            <rect x="430" y="262" width="230" height="26" rx="12" />
            <text x="545" y="280" text-anchor="middle">max similarity over strand and shift</text>
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
  overflow: visible;
}

.sequence-pill {
  fill: var(--surface-soft);
  stroke: var(--line);
  stroke-width: 2;
}

.base-letter {
  fill: var(--muted);
  font-family: "Courier New", monospace;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.55;
}

.model,
.scanner-window {
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

.scanner-window {
  fill: var(--primary-tint);
  stroke: var(--primary);
}

.scanner-window-a {
  fill: rgba(52, 117, 146, 0.14);
  stroke: var(--pwm);
}

.scanner-window-b {
  fill: rgba(154, 79, 72, 0.14);
  stroke: var(--alt);
}

.scan-window-group {
  transition: transform 650ms ease;
}

.model-text,
.small-title,
.profile-label,
.axis-title,
.scan-window-label {
  fill: var(--ink);
  font-family: var(--body-font);
  font-weight: 700;
}

.model-text,
.small-title,
.profile-label {
  font-size: 15px;
}

.scan-window-label {
  font-size: 10px;
  fill: var(--primary-deep);
}

.scan-base-letter {
  fill: var(--ink);
  font-size: 14px;
  opacity: 0.78;
}

.axis-title {
  fill: var(--muted);
  font-size: 14px;
}

.model-a-text {
  fill: var(--pwm-deep);
}

.model-b-text {
  fill: var(--alt-deep);
}

.scan-row-label,
.scan-history-score,
.scan-history-position {
  fill: var(--muted);
  font-family: var(--body-font);
  font-weight: 800;
}

.scan-row-label {
  font-size: 11px;
  text-anchor: end;
}

.scan-history-score {
  fill: var(--primary-deep);
  font-size: 11px;
}

.scan-history-position {
  fill: var(--muted);
  font-size: 10px;
}

.scan-history-column.active .scan-history-score {
  animation: scan-score-pulse 1400ms ease-in-out infinite;
}

@keyframes scan-score-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.68; }
}

.profile-points {
  transition: opacity 300ms ease;
}

.profile-segment {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
  transition: x1 650ms ease, y1 650ms ease, x2 650ms ease, y2 650ms ease;
}

.profile-point {
  stroke: var(--surface);
  stroke-width: 2;
  transition: cx 650ms ease, cy 650ms ease;
}

.profile-a {
  stroke: var(--pwm);
}

.profile-a-fill {
  fill: var(--pwm);
}

.profile-b {
  stroke: var(--alt);
}

.profile-b-fill {
  fill: var(--alt);
}

.m2-profile-layer {
  transition: transform 650ms ease;
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
  font-size: 12px;
  font-weight: 800;
}
</style>
