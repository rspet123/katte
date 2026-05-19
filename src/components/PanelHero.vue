<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import globeRaw    from '../assets/svg/micrographics/globe.svg?raw'
import resistorRaw   from '../assets/svg/micrographics/resistor.svg?raw'
import logoRaw from '../assets/svg/logo/main_logo.svg?raw'
import { generateClipPath } from '../utils/clip_path_gen'
import { rand } from '../utils/glitch'
import vTypewriter from '../directives/v-typewriter.js'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))
const globeSvg  = computed(() => fixStrokes(globeRaw))
const resistorSvg  = computed(() => fixStrokes(resistorRaw))
const logoSvg  = computed(() => logoRaw)


// ── Props / Emits ───────────────────────────────────────────────────────────
defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

// ── Expose panel element for the IntersectionObserver in the parent ─────────
const panelRef = ref<HTMLElement | null>(null)


// ── Glitch effect ───────────────────────────────────────────────────────────
const heroLogoRef = ref<HTMLElement | null>(null)
let glitchTimeout: ReturnType<typeof setTimeout> | null = null

const runGlitch = () => {
  const el = heroLogoRef.value
  if (!el) return

  const flashCount = rand(2, 4)
  let cursor = 0

  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(40, 120)
    const gap           = rand(20, 60)
    const applyAt  = cursor
    const clearAt  = cursor + flashDuration
    cursor = clearAt + gap

    const path = generateClipPath()
    const caR  = rand(3, 8)
    const caC  = rand(3, 8)
    const blur = rand(3, 12) / 10

    setTimeout(() => {
      el.style.clipPath = path
      el.style.setProperty('--ca-r-x',  `-${caR}px`)
      el.style.setProperty('--ca-c-x',  `${caC}px`)
      el.style.setProperty('--ca-blur', `${blur}px`)
      el.classList.add('is-glitching')
    }, applyAt)
    setTimeout(() => {
      el.style.clipPath = ''
      el.style.removeProperty('--ca-r-x')
      el.style.removeProperty('--ca-c-x')
      el.style.removeProperty('--ca-blur')
      el.classList.remove('is-glitching')
    }, clearAt)
  }
}

const scheduleGlitch = () => {
  const delay = rand(5000, 10_000)
  glitchTimeout = setTimeout(() => { runGlitch(); scheduleGlitch() }, delay)
}

defineExpose({ panelRef, triggerGlitch: runGlitch })

onMounted(() => scheduleGlitch())
onUnmounted(() => { if (glitchTimeout) clearTimeout(glitchTimeout) })
</script>

<template>
  <section class="panel panel--dark" id="hero" ref="panelRef">
    <div class="topo-texture" aria-hidden="true" />

    <p class="eyebrow corner-label" v-typewriter="{text: '[ VER. // 0.0.1-beta ]', seconds: 2.5}"></p>

    <div class="hero-logo" ref="heroLogoRef" v-html="logoSvg" aria-hidden="true" />

    <div class="panel-inner">
      <p class="eyebrow portfolio-label">
        p o r t f o l i o //
        <span class="portfolio-globe" v-html="globeSvg" aria-hidden="true" />
      </p>
      <p class="eyebrow">[ BUILDING // BETTER ]</p>
    </div>

    <p class="scroll-hint">Scroll</p>

    <a class="scroll-cue" href="#work" aria-label="Scroll to Work">
      <span class="eyebrow">Work</span>
      <span class="scroll-cue__arrow" v-html="angArrow" />
    </a>

  </section>
</template>

<!-- @property must be global — scoped blocks cannot contain at-rules that
     apply outside the component's shadow DOM. -->
<style>
@property --wave-r {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}
</style>

<style scoped>
/* ── TOPO TEXTURE ─────────────────────────────────────────────────────────── */

.topo-texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  mask-image: repeating-radial-gradient(
    circle at 100% 0%,
    rgba(0, 0, 0, 0.85) var(--wave-r),
    rgba(0, 0, 0, 0.03) calc(var(--wave-r) + 600px),
    rgba(0, 0, 0, 0.85) calc(var(--wave-r) + 1200px)
  );
  -webkit-mask-image: repeating-radial-gradient(
    circle at 100% 0%,
    rgba(0, 0, 0, 0.85) var(--wave-r),
    rgba(0, 0, 0, 0.03) calc(var(--wave-r) + 600px),
    rgba(0, 0, 0, 0.85) calc(var(--wave-r) + 1200px)
  );
  animation: dotWave 14s linear infinite;
}

@keyframes dotWave {
  to { --wave-r: 1200px; }
}

/* ── HERO LOGO ────────────────────────────────────────────────────────────── */

.hero-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(500px, 70vw, 1000px);
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 50;
}

.hero-logo :deep(svg) {
  width: 100%;
  height: auto;
  fill: #ffffff;
  display: block;
}

.hero-logo.is-glitching {
  filter:
    blur(var(--ca-blur, 0.6px))
    drop-shadow(var(--ca-r-x, -4px) 0 0 rgba(255, 20, 80, 0.9))
    drop-shadow(var(--ca-c-x,  4px) 0 0 rgba(0, 220, 255, 0.9));
}

@media (max-width: 768px) {
  .hero-logo {
    transform: translate(-50%, -50%) scale(0.75);
  }
}

/* ── HERO COPY ────────────────────────────────────────────────────────────── */

.portfolio-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.portfolio-globe {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3vh;
  height: 3vh;
  line-height: 0;
}

.portfolio-globe :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-sub {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1.75;
}
</style>
