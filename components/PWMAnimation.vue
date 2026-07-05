<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
})

const sequences = [
  'ACGTA',
  'ACCTA',
  'ATGTT',
  'ACGTT',
  'GCGTA',
  'ACGTA',
  'ACATA',
]

const nucs = ['A', 'C', 'G', 'T']
const positions = sequences[0].split('').map((_, index) => index)
const query = 'GCTACGTACGT'
const motifLength = sequences[0].length
const stepMarks = [0, 1, 2, 3, 4]

const cyclePositions = query.length - motifLength + 1
const STEP_DURATION = 1500
const scanPos = ref(0)
let scanTimer = null

const currentStep = computed(() => {
  const value = Number(props.step ?? 0)

  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(value, 0), 4)
})

const stageTitle = computed(() => [
  'Aligned binding sites',
  'Count each column',
  'Normalize to probabilities',
  'Convert to weights',
  'Scan a candidate window',
][currentStep.value])

const matrixTitle = computed(() => {
  if (currentStep.value === 1) {
    return 'Counts'
  }

  if (currentStep.value === 2) {
    return 'Probabilities'
  }

  return 'Log-odds weights'
})

const buildColumn = computed(() => {
  if (currentStep.value !== 1) {
    return -1
  }

  return scanPos.value % positions.length
})

const scanStart = computed(() => {
  if (currentStep.value >= 4) {
    return scanPos.value
  }

  return -1
})

const windowSeq = computed(() => {
  if (scanStart.value < 0) {
    return ''
  }

  return query.slice(scanStart.value, scanStart.value + motifLength)
})

function scoreForWindow(start) {
  return query
    .slice(start, start + motifLength)
    .split('')
    .reduce((sum, nuc, pos) => sum + weightAt(pos, nuc), 0)
}

const liveScore = computed(() => {
  if (currentStep.value !== 4) {
    return null
  }

  return scoreForWindow(scanPos.value)
})

const liveScoreText = computed(() => (
  liveScore.value === null ? '' : liveScore.value.toFixed(2)
))

const formulaTex = {
  1: 'c_{i,b} = \\sum_{k=1}^{N} \\mathbb{1}[s_k[i] = b]',
  2: 'p_{i,b} = \\dfrac{c_{i,b} + \\alpha}{N + 4\\alpha}',
  3: 'w_{i,b} = \\log_2 \\dfrac{p_{i,b}}{b_g}',
  4: 'S_{\\text{window}} = \\sum_{i=1}^{L} w_{i, q_i}',
}

const formulaHtml = computed(() => {
  const tex = formulaTex[currentStep.value]

  if (!tex) {
    return ''
  }

  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: false })
  } catch (err) {
    return tex
  }
})

function countAt(pos, nuc) {
  return sequences.filter(sequence => sequence[pos] === nuc).length
}

function probabilityAt(pos, nuc) {
  return countAt(pos, nuc) / sequences.length
}

function weightAt(pos, nuc) {
  const pseudoCount = 0.25
  const background = 0.25
  const probability = (countAt(pos, nuc) + pseudoCount)
    / (sequences.length + pseudoCount * nucs.length)

  return Math.log2(probability / background)
}

function cellValue(pos, nuc) {
  if (currentStep.value === 1) {
    return countAt(pos, nuc)
  }

  if (currentStep.value === 2) {
    return probabilityAt(pos, nuc).toFixed(2)
  }

  return weightAt(pos, nuc).toFixed(2)
}

function isWindowIndex(index) {
  if (scanStart.value < 0) {
    return false
  }

  return index >= scanStart.value && index < scanStart.value + motifLength
}

function startScanLoop() {
  if (scanTimer !== null) {
    return
  }

  scanTimer = setInterval(() => {
    if (currentStep.value === 1) {
      scanPos.value = (scanPos.value + 1) % positions.length
    } else if (currentStep.value === 4) {
      scanPos.value = (scanPos.value + 1) % cyclePositions
    }
  }, STEP_DURATION)
}

function stopScanLoop() {
  if (scanTimer !== null) {
    clearInterval(scanTimer)
    scanTimer = null
  }
}

watch(currentStep, (step) => {
  if (step === 1 || step === 4) {
    startScanLoop()
  } else {
    stopScanLoop()
  }
}, { immediate: true })

onMounted(() => {
  if (currentStep.value === 1 || currentStep.value === 4) {
    startScanLoop()
  }
})

onBeforeUnmount(() => {
  stopScanLoop()
})
</script>

<template>
  <div class="pwm-animation">
    <header class="pwm-animation-header">
      <div>
        <span class="pwm-kicker">PWM construction</span>
        <strong>{{ stageTitle }}</strong>
      </div>
      <div class="pwm-step-track" aria-hidden="true">
        <span
          v-for="mark in stepMarks"
          :key="mark"
          :class="{ passed: mark <= currentStep }"
        />
      </div>
    </header>

    <div class="pwm-animation-body">
      <section class="pwm-panel pwm-alignment-panel">
        <div class="pwm-panel-label">
          Known binding sites
        </div>
        <div class="pwm-alignment">
          <div
            v-for="sequence in sequences"
            :key="sequence"
            class="pwm-sequence"
          >
            <span
              v-for="(base, index) in sequence"
              :key="`${sequence}-${index}`"
              class="pwm-base"
              :class="[`base-${base}`, { active: index === buildColumn }]"
            >
              {{ base }}
            </span>
          </div>
        </div>
      </section>

      <section
        class="pwm-panel pwm-matrix-panel"
        :class="{ muted: currentStep === 0 }"
      >
        <div class="pwm-panel-label">
          {{ currentStep === 0 ? 'PWM matrix' : matrixTitle }}
        </div>

        <table
          v-if="currentStep >= 1"
          class="pwm-matrix"
          aria-label="Position weight matrix"
        >
          <thead>
            <tr>
              <th scope="col">
                nt
              </th>
              <th
                v-for="pos in positions"
                :key="pos"
                scope="col"
              >
                {{ pos + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="nuc in nucs"
              :key="nuc"
            >
              <th scope="row" :class="`pwm-row-${nuc}`">
                {{ nuc }}
              </th>
              <td
                v-for="pos in positions"
                :key="`${nuc}-${pos}`"
                :class="[
                  `nuc-${nuc}`,
                  {
                    active: pos === buildColumn,
                    matched: currentStep >= 4 && windowSeq[pos] === nuc,
                  },
                ]"
              >
                <span
                  class="pwm-cell-bar"
                  :style="{
                    transform: `scaleX(${probabilityAt(pos, nuc)})`,
                  }"
                />
                <Transition name="cell-flip" mode="out-in">
                  <span
                    :key="`${pos}-${nuc}-${currentStep}`"
                    class="pwm-cell-value"
                  >
                    {{ cellValue(pos, nuc) }}
                  </span>
                </Transition>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-else
          class="pwm-placeholder"
        >
          counts &rarr; probabilities &rarr; weights
        </div>

        <div
          v-if="currentStep >= 1"
          class="pwm-formula-bar"
        >
          <div class="pwm-formula">
            <Transition name="cell-flip" mode="out-in">
              <span :key="currentStep" v-html="formulaHtml" />
            </Transition>
          </div>
        </div>
      </section>

      <section
        class="pwm-panel pwm-scan-panel"
        :class="{ visible: currentStep >= 4 }"
      >
        <div class="pwm-panel-label">
          New sequence
        </div>
        <div class="pwm-query">
          <span
            v-for="(base, index) in query"
            :key="`${base}-${index}`"
            class="pwm-base"
            :class="[`base-${base}`, { active: isWindowIndex(index) }]"
          >
            {{ base }}
          </span>
        </div>

        <div
          v-if="currentStep === 4"
          class="pwm-score pwm-score-live"
        >
          <span>window {{ windowSeq }} (pos {{ scanPos + 1 }} / {{ cyclePositions }})</span>
          <strong>score = {{ liveScoreText }}</strong>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pwm-animation {
  background:
    radial-gradient(circle at 12% 8%, rgba(11, 127, 131, 0.12), transparent 30%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(233, 239, 237, 0.86));
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 16px 34px var(--shadow);
  display: grid;
  gap: 10px;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
}

.pwm-animation-header {
  align-items: center;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  padding-bottom: 11px;
}

.pwm-animation-header strong {
  color: var(--ink);
  display: block;
  font-size: 14pt;
  line-height: 1.1;
}

.pwm-kicker,
.pwm-panel-label {
  color: var(--muted);
  display: block;
  font-size: 9pt;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.pwm-step-track {
  display: flex;
  gap: 5px;
}

.pwm-step-track span {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 999px;
  height: 8px;
  transition: background 220ms ease, border-color 220ms ease, transform 220ms ease;
  width: 18px;
}

.pwm-step-track span.passed {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.pwm-animation-body {
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 0.43fr) minmax(0, 0.57fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 100px);
  min-height: 0;
}

.pwm-panel {
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(22, 37, 43, 0.10);
  border-radius: 16px;
  padding: 9px 10px;
}

.pwm-alignment-panel,
.pwm-matrix-panel {
  min-height: 0;
}

.pwm-alignment {
  align-items: center;
  display: grid;
  gap: 4px;
  justify-content: stretch;
  justify-items: center;
  place-content: center;
}

.pwm-sequence,
.pwm-query {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.pwm-base {
  align-items: center;
  border: 1px solid rgba(22, 37, 43, 0.14);
  border-radius: 9px;
  color: var(--ink);
  display: inline-flex;
  font-family: "Courier New", monospace;
  font-size: 12pt;
  font-weight: 800;
  height: 26px;
  justify-content: center;
  line-height: 1;
  transition: background 260ms ease, border-color 260ms ease, transform 260ms ease, box-shadow 260ms ease;
  width: 29px;
}

.base-A {
  --base-color: rgba(58, 122, 89, 0.20);
  --base-color-active: rgba(58, 122, 89, 0.65);
  --base-color-active-border: #2a5c43;
  --base-color-active-shadow: rgba(58, 122, 89, 0.35);
  background: var(--base-color);
}

.base-C {
  --base-color: rgba(37, 99, 168, 0.20);
  --base-color-active: rgba(37, 99, 168, 0.65);
  --base-color-active-border: #1c4a82;
  --base-color-active-shadow: rgba(37, 99, 168, 0.35);
  background: var(--base-color);
}

.base-G {
  --base-color: rgba(138, 99, 40, 0.22);
  --base-color-active: rgba(138, 99, 40, 0.70);
  --base-color-active-border: #7a5520;
  --base-color-active-shadow: rgba(138, 99, 40, 0.40);
  background: var(--base-color);
}

.base-T {
  --base-color: rgba(154, 79, 72, 0.22);
  --base-color-active: rgba(154, 79, 72, 0.70);
  --base-color-active-border: #7a3a35;
  --base-color-active-shadow: rgba(154, 79, 72, 0.40);
  background: var(--base-color);
}

.pwm-base.active {
  background: var(--base-color-active);
  border-color: var(--base-color-active-border);
  box-shadow: 0 8px 18px var(--base-color-active-shadow);
  color: #1a1f24;
  transform: scale(1.18);
  z-index: 2;
}

.pwm-matrix-panel {
  animation: pwm-enter 260ms ease both;
}

.pwm-matrix-panel.muted {
  color: var(--muted);
}

.pwm-matrix {
  border-collapse: collapse;
  color: var(--ink);
  font-size: 9.5pt;
  table-layout: fixed;
  width: 100%;
}

.pwm-matrix th,
.pwm-matrix td {
  border: 1px solid rgba(22, 37, 43, 0.12);
  height: 24px;
  padding: 0;
  position: relative;
  text-align: center;
}

.pwm-matrix th {
  color: var(--primary-deep);
  font-weight: 800;
}

.pwm-matrix td {
  background: rgba(255, 255, 255, 0.62);
  font-family: "Courier New", monospace;
  font-weight: 800;
  overflow: hidden;
}

.pwm-matrix td.active {
  background: rgba(11, 127, 131, 0.50);
  outline: 2px solid rgba(11, 127, 131, 0.75);
  outline-offset: -2px;
}

.pwm-matrix td.matched {
  background: rgba(11, 127, 131, 0.45);
  box-shadow: inset 0 0 0 1px var(--primary-deep);
  color: #063d40;
}

.pwm-matrix th.pwm-row-A {
  background: rgba(58, 122, 89, 0.55);
  color: #1c3d2c;
}

.pwm-matrix th.pwm-row-C {
  background: rgba(37, 99, 168, 0.55);
  color: #142d4d;
}

.pwm-matrix th.pwm-row-G {
  background: rgba(138, 99, 40, 0.60);
  color: #4a3514;
}

.pwm-matrix th.pwm-row-T {
  background: rgba(154, 79, 72, 0.60);
  color: #4a2520;
}

.pwm-matrix td.nuc-A {
  border-left: 3px solid rgba(58, 122, 89, 0.85);
}

.pwm-matrix td.nuc-C {
  border-left: 3px solid rgba(37, 99, 168, 0.85);
}

.pwm-matrix td.nuc-G {
  border-left: 3px solid rgba(138, 99, 40, 0.90);
}

.pwm-matrix td.nuc-T {
  border-left: 3px solid rgba(154, 79, 72, 0.90);
}

.pwm-cell-bar {
  background: rgba(11, 127, 131, 0.20);
  inset: 0;
  position: absolute;
  transform-origin: left center;
  transition: transform 260ms ease;
}

.pwm-cell-value {
  position: relative;
  z-index: 1;
}

.cell-flip-enter-active,
.cell-flip-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.cell-flip-enter-from {
  opacity: 0;
  transform: translateY(4px) scale(0.9);
}

.cell-flip-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.9);
}

.pwm-formula-bar {
  align-items: center;
  border-top: 1px dashed rgba(22, 37, 43, 0.18);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 8px;
  min-height: 44px;
  padding-top: 8px;
}

.pwm-formula {
  align-items: center;
  color: var(--ink);
  display: flex;
  flex: 1 1 auto;
  font-size: 14pt;
  font-weight: 700;
  justify-content: center;
  min-width: 0;
  text-align: center;
}

.pwm-formula :deep(.katex) {
  font-size: 22pt;
}

.pwm-formula :deep(.katex-display) {
  margin: 0;
}

.pwm-placeholder {
  align-items: center;
  border: 1px dashed rgba(22, 37, 43, 0.18);
  border-radius: 12px;
  color: var(--muted);
  display: flex;
  font-size: 11pt;
  font-weight: 800;
  height: calc(100% - 21px);
  justify-content: center;
  line-height: 1.2;
  padding: 12px;
  text-align: center;
}

.pwm-scan-panel {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  justify-content: center;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 260ms ease;
}

.pwm-scan-panel.visible {
  opacity: 1;
  pointer-events: auto;
}

.pwm-scan-panel .pwm-panel-label {
  flex: 0 0 auto;
}

.pwm-query {
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.pwm-scan-panel .pwm-base {
  font-size: 10pt;
  height: 22px;
  width: 25px;
}

.pwm-score {
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 10pt;
  font-weight: 800;
  gap: 12px;
  justify-content: center;
  text-align: center;
}

.pwm-score strong {
  color: var(--primary-deep);
  font-size: 12pt;
}

.pwm-score-live strong {
  animation: pwm-pulse 1200ms ease-in-out infinite;
  text-shadow: 0 0 6px rgba(11, 127, 131, 0.30);
}

@keyframes pwm-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}

@keyframes pwm-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
