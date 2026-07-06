<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
    step: {
        type: Number,
        default: 1,
    },
});

const s = computed(() => Math.min(Math.max(Number(props.step) || 1, 1), 5));

const scanSequence = [
    "A",
    "T",
    "G",
    "C",
    "T",
    "A",
    "G",
    "C",
    "A",
    "T",
    "G",
    "C",
    "T",
    "A",
    "C",
    "G",
    "T",
];
const scanModels = [
    {
        id: "m1",
        label: "Motif 1",
        length: 4,
        y: 76,
        scores: [
            2.1, 3.4, 2.7, 4.6, 3.2, 2.8, 4.1, 3.6, 2.9, 3.8, 2.5, 4.3, 3.1,
            2.7,
        ],
    },
    {
        id: "m2",
        label: "Motif 2",
        length: 6,
        y: 222,
        scores: [1.9, 2.8, 4.2, 3.1, 4.9, 3.7, 2.6, 4.4, 3.3, 4.7, 3.0, 3.9],
    },
];
const scanBaseX = 112;
const scanBaseWidth = 36;
const scanLabelX = scanBaseX - 18;
const scanCenterX = scanBaseX + ((scanSequence.length - 1) * scanBaseWidth) / 2;
const scanStepDuration = 200;
const scanFinishPause = 2000;
const scanPos = ref(0);
let scanTimer = null;

const scanCycleLength = computed(
    () => scanSequence.length - scanModels[0].length + 1,
);
const scanFinished = computed(
    () => scanPos.value === scanCycleLength.value - 1,
);

function scanPositionFor(model) {
    return Math.min(scanPos.value, scanSequence.length - model.length);
}

function passedScanPositions(model) {
    return Array.from({ length: scanPositionFor(model) + 1 }, (_, i) => i);
}

function lastScanPositionFor(model) {
    return scanSequence.length - model.length;
}

function scoreForScan(model, pos) {
    return model.scores[pos]?.toFixed(1) ?? "";
}

function startScanLoop() {
    if (scanTimer !== null) {
        return;
    }

    const delay = scanFinished.value ? scanFinishPause : scanStepDuration;

    scanTimer = setTimeout(() => {
        scanPos.value = (scanPos.value + 1) % scanCycleLength.value;
        scanTimer = null;

        if (s.value === 1) {
            startScanLoop();
        }
    }, delay);
}

function stopScanLoop() {
    if (scanTimer !== null) {
        clearTimeout(scanTimer);
        scanTimer = null;
    }
}

watch(
    s,
    (step) => {
        if (step === 1) {
            startScanLoop();
        } else {
            stopScanLoop();
        }
    },
    { immediate: true },
);

onMounted(() => {
    if (s.value === 1) {
        startScanLoop();
    }
});

onBeforeUnmount(() => {
    stopScanLoop();
});

// Shared x-coordinates for the 20 profile positions.
const xs = Array.from({ length: 20 }, (_, i) => 120 + i * 28);

// Jagged raw profiles with larger local swings.
const m1Raw = [
    { y: 152 },
    { y: 128 },
    { y: 158 },
    { y: 132 },
    { y: 165 },
    { y: 105 },
    { y: 170 },
    { y: 145 },
    { y: 152 },
    { y: 138 },
    { y: 168 },
    { y: 110 },
    { y: 158 },
    { y: 135 },
    { y: 162 },
    { y: 130 },
    { y: 155 },
    { y: 120 },
    { y: 160 },
    { y: 138 },
];

// Calibrated: baseline high, strong peaks well above threshold.
const m1Cal = [
    { y: 172 },
    { y: 170 },
    { y: 174 },
    { y: 171 },
    { y: 173 },
    { y: 92 },
    { y: 175 },
    { y: 172 },
    { y: 171 },
    { y: 174 },
    { y: 92 },
    { y: 173 },
    { y: 175 },
    { y: 171 },
    { y: 174 },
    { y: 172 },
    { y: 170 },
    { y: 173 },
    { y: 171 },
    { y: 174 },
];

const m2Raw = [
    { y: 250 },
    { y: 222 },
    { y: 255 },
    { y: 228 },
    { y: 260 },
    { y: 220 },
    { y: 265 },
    { y: 232 },
    { y: 250 },
    { y: 240 },
    { y: 262 },
    { y: 218 },
    { y: 255 },
    { y: 230 },
    { y: 258 },
    { y: 225 },
    { y: 252 },
    { y: 220 },
    { y: 256 },
    { y: 235 },
];

const m2Cal = [
    { y: 272 },
    { y: 268 },
    { y: 270 },
    { y: 269 },
    { y: 271 },
    { y: 190 },
    { y: 272 },
    { y: 270 },
    { y: 268 },
    { y: 271 },
    { y: 190 },
    { y: 269 },
    { y: 272 },
    { y: 268 },
    { y: 270 },
    { y: 269 },
    { y: 268 },
    { y: 270 },
    { y: 269 },
    { y: 271 },
];

const m1Points = computed(() =>
    xs.map((x, i) => ({ x, y: (s.value >= 3 ? m1Cal : m1Raw)[i].y })),
);
const m2Points = computed(() =>
    xs.map((x, i) => ({ x, y: (s.value >= 3 ? m2Cal : m2Raw)[i].y })),
);

const m2Shift = computed(() => (s.value >= 5 ? -112 : 0));

const showScan = computed(() => s.value === 1);
const showProfiles = computed(() => s.value >= 2);
const showRawTitle = computed(() => s.value === 2);
const showCalTitle = computed(() => s.value >= 3);
const showThresholds = computed(() => s.value >= 4);
const showWindows = computed(() => s.value >= 4);
const showResult = computed(() => s.value >= 5);
</script>

<template>
    <section class="card mimosa-method-figure">
        <figure
            class="mimosa-steps"
            aria-label="Stepwise schematic of MIMOSA recognition-profile comparison"
        >
            <svg viewBox="0 0 760 380" role="img">
                <!-- Scanning step -->
                <g
                    v-show="showScan"
                    class="scan-layer"
                    transform="translate(0, -4)"
                >
                    <g
                        v-for="model in scanModels"
                        :key="`scan-track-${model.id}`"
                        :class="[`scan-track-${model.id}`]"
                    >
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
                        >
                            {{ base }}
                        </text>

                        <g
                            class="scan-window-group"
                            :style="{
                                transform: `translateX(${scanPositionFor(model) * scanBaseWidth}px)`,
                            }"
                        >
                            <text
                                class="moving-motif-label"
                                :class="
                                    model.id === 'm1'
                                        ? 'moving-motif-label-a'
                                        : 'moving-motif-label-b'
                                "
                                :x="
                                    scanBaseX -
                                    14 +
                                    (model.length * scanBaseWidth) / 2
                                "
                                :y="model.y - 34"
                                text-anchor="middle"
                            >
                                {{ model.label }}
                            </text>
                            <rect
                                class="scanner-window"
                                :class="
                                    model.id === 'm1'
                                        ? 'scanner-window-a'
                                        : 'scanner-window-b'
                                "
                                :x="scanBaseX - 14"
                                :y="model.y - 24"
                                :width="model.length * scanBaseWidth"
                                height="56"
                                rx="8"
                            />
                        </g>

                        <g class="scan-score-rows">
                            <text
                                class="scan-row-label"
                                :x="scanLabelX"
                                :y="model.y + 54"
                            >
                                position
                            </text>
                            <text
                                class="scan-row-label"
                                :x="scanLabelX"
                                :y="model.y + 76"
                            >
                                scores
                            </text>
                            <g
                                v-for="pos in passedScanPositions(model)"
                                :key="`${model.id}-score-${pos}`"
                                class="scan-history-column"
                                :class="{
                                    active: pos === scanPositionFor(model),
                                }"
                            >
                                <text
                                    class="scan-history-position"
                                    :x="scanBaseX + pos * scanBaseWidth"
                                    :y="model.y + 54"
                                    text-anchor="middle"
                                >
                                    {{ pos + 1 }}
                                </text>
                                <text
                                    class="scan-history-score"
                                    :x="scanBaseX + pos * scanBaseWidth"
                                    :y="model.y + 76"
                                    text-anchor="middle"
                                >
                                    {{ scoreForScan(model, pos) }}
                                </text>
                            </g>
                            <line
                                v-show="scanFinished"
                                class="score-profile-underline"
                                :x1="scanBaseX - 16"
                                :x2="
                                    scanBaseX +
                                    lastScanPositionFor(model) * scanBaseWidth +
                                    16
                                "
                                :y1="model.y + 84"
                                :y2="model.y + 84"
                                pathLength="1"
                            />
                            <g
                                v-if="model.id === 'm2'"
                                v-show="scanFinished"
                                class="score-profile-badge"
                                :transform="`translate(${scanCenterX - 86}, ${model.y + 118})`"
                            >
                                <rect
                                    class="score-profile-badge-box"
                                    x="0"
                                    y="0"
                                    width="172"
                                    height="38"
                                    rx="12"
                                />
                                <line
                                    class="score-profile-badge-accent"
                                    x1="13"
                                    y1="8"
                                    x2="13"
                                    y2="30"
                                />
                                <text
                                    class="score-profile-label"
                                    x="96"
                                    y="25"
                                    text-anchor="middle"
                                >
                                    Score profile
                                </text>
                            </g>
                        </g>
                    </g>
                </g>

                <!-- Profiles -->
                <g v-show="showProfiles" class="profile-layer">
                    <text
                        v-show="showRawTitle"
                        class="axis-title"
                        x="120"
                        y="46"
                    >
                        raw score profiles: M1 and M2
                    </text>
                    <text
                        v-show="showCalTitle"
                        class="axis-title"
                        x="120"
                        y="46"
                    >
                        calibrated recognition profiles: -log10(ERR)
                    </text>

                    <!-- M1 profile -->
                    <text class="profile-label model-a-text" x="70" y="108">
                        M1
                    </text>
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
                    <g
                        class="m2-profile-layer"
                        :style="{ transform: `translateX(${m2Shift}px)` }"
                    >
                        <text class="profile-label model-b-text" x="70" y="236">
                            M2
                        </text>
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
                        <line
                            class="threshold-line"
                            x1="110"
                            y1="130"
                            x2="660"
                            y2="130"
                        />
                        <line
                            class="threshold-line"
                            x1="110"
                            y1="222"
                            x2="660"
                            y2="222"
                        />
                    </g>

                    <!-- Windows around M1 anchors only -->
                    <g v-show="showWindows">
                        <rect
                            class="window"
                            x="230"
                            y="74"
                            width="60"
                            height="80"
                            rx="8"
                        />
                        <rect
                            class="window"
                            x="370"
                            y="74"
                            width="60"
                            height="80"
                            rx="8"
                        />

                        <circle class="anchor" cx="260" cy="92" r="6" />
                        <circle
                            class="anchor secondary"
                            cx="400"
                            cy="92"
                            r="5"
                        />
                    </g>

                    <!-- Result badge -->
                    <g v-show="showResult" class="result-badge">
                        <rect x="430" y="262" width="230" height="26" rx="12" />
                        <text x="545" y="280" text-anchor="middle">
                            max similarity over strand and shift
                        </text>
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

.scanner-window {
    stroke-width: 2.6;
}

.scanner-window {
    fill: var(--primary-tint);
    stroke: var(--primary);
}

.scanner-window-a {
    fill: rgba(37, 99, 168, 0.24);
    stroke: var(--pwm-deep);
}

.scanner-window-b {
    fill: rgba(154, 79, 72, 0.24);
    stroke: var(--alt-deep);
}

.scan-window-group {
    transition: transform 420ms ease;
}

.small-title,
.profile-label,
.axis-title,
.moving-motif-label {
    fill: var(--ink);
    font-family: var(--body-font);
    font-weight: 700;
}

.small-title,
.profile-label {
    font-size: 15px;
}

.moving-motif-label {
    font-size: 13px;
    font-weight: 900;
}

.moving-motif-label-a {
    fill: var(--pwm-deep);
}

.moving-motif-label-b {
    fill: var(--alt-deep);
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
    font-size: 11px;
}

.scan-track-m1 .scan-history-score {
    fill: var(--pwm-deep);
}

.scan-track-m2 .scan-history-score {
    fill: var(--alt-deep);
}

.scan-history-position {
    fill: var(--ink);
    font-size: 10px;
}

.scan-history-column.active .scan-history-score {
    animation: scan-score-pulse 850ms ease-in-out infinite;
}

.score-profile-underline {
    animation: score-underline-draw 650ms ease-out both;
    stroke: var(--primary-deep);
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    stroke-linecap: round;
    stroke-width: 3.2;
}

.score-profile-badge {
    animation: score-profile-badge-enter 360ms ease-out both;
}

.score-profile-badge-box {
    fill: var(--surface);
    stroke: var(--primary);
    stroke-width: 2;
}

.score-profile-badge-accent {
    stroke: var(--primary);
    stroke-linecap: round;
    stroke-width: 5;
}

.score-profile-label {
    fill: var(--primary-deep);
    font-family: var(--body-font);
    font-size: 17px;
    font-weight: 700;
}

@keyframes score-underline-draw {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes score-profile-badge-enter {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scan-score-pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.68;
    }
}

.profile-points {
    transition: opacity 300ms ease;
}

.profile-segment {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3.5;
    transition:
        x1 650ms ease,
        y1 650ms ease,
        x2 650ms ease,
        y2 650ms ease;
}

.profile-point {
    stroke: var(--surface);
    stroke-width: 2;
    transition:
        cx 650ms ease,
        cy 650ms ease;
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
