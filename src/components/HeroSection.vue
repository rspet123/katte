<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

import targetCircleRaw from '../assets/svg/micrographics/target_circle.svg?raw'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import burstlineRaw from '../assets/svg/micrographics/burstline.svg?raw'
import logoRaw from '../assets/svg/logo/main_logo.svg?raw'
import { generateClipPath } from '../utils/clip_path_gen.js'

// Both SVGs use hardcoded stroke:#000 — replace with currentColor so the
// parent's `color` property controls rendering in both light and dark contexts.
const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')

const targetCircle = computed(() => fixStrokes(targetCircleRaw))
const angArrow = computed(() => fixStrokes(angArrowRaw))
const burstline = computed(() => fixStrokes(burstlineRaw))
const logoSvg = computed(() => logoRaw)

// ── Hero ↔ reticle swap ───────────────────────────────────────────────────
const heroRef       = ref<HTMLElement | null>(null)
const scrollRootRef = ref<HTMLElement | null>(null)
const heroInView    = ref(true)
let   heroObserver: IntersectionObserver | null = null

// ── Glitch effect ───────────────────────────────────────────────────────────
const heroLogoRef = ref<HTMLElement | null>(null)
let glitchTimeout: ReturnType<typeof setTimeout> | null = null

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const runGlitch = () => {
  const el = heroLogoRef.value
  if (!el) return

  const flashCount = rand(1, 3)
  let cursor = 0

  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(40, 120)   // how long each clip-path stays on
    const gap           = rand(20, 60)    // pause between flashes

    const applyAt  = cursor
    const clearAt  = cursor + flashDuration
    cursor = clearAt + gap

    const path = generateClipPath()
    setTimeout(() => { el.style.clipPath = path }, applyAt)
    setTimeout(() => { el.style.clipPath = ''   }, clearAt)
  }
}

const scheduleGlitch = () => {
  const delay = rand(10_000, 20_000)
  glitchTimeout = setTimeout(() => {
    runGlitch()
    scheduleGlitch()
  }, delay)
}

onMounted(() => {
  scheduleGlitch()
  // Observe hero panel against the scroll container as root so that
  // intersection is measured within the snapping viewport, not the document.
  heroObserver = new IntersectionObserver(
    ([entry]) => { heroInView.value = entry.isIntersecting },
    { root: scrollRootRef.value, threshold: 0.5 },
  )
  if (heroRef.value) heroObserver.observe(heroRef.value)
})
onUnmounted(() => {
  if (glitchTimeout) clearTimeout(glitchTimeout)
  heroObserver?.disconnect()
})
</script>

<template>
  <!-- Fixed reticle — hidden on panel 1, fades in once hero exits view -->
  <div
    class="reticle"
    :class="{ 'reticle--visible': !heroInView }"
    v-html="targetCircle"
    aria-hidden="true"
  />

  <!-- ── SCROLL ROOT ────────────────────────────────────────────────────── -->
  <!-- scroll-snap-type: y mandatory — each panel is a distinct frame.       -->
  <!-- scroll-snap-stop defaults to `normal` on each child, which lets       -->
  <!-- momentum carry past snap points — this is the "soft snap" behaviour.  -->
  <div class="scroll-root" ref="scrollRootRef">

    <!-- ── Panel 1: Hero ──────────────────────────────────────────── -->
    <section class="panel panel--dark" id="hero" ref="heroRef">
      <div class="topo-texture" aria-hidden="true" />

      <!-- Logo centred in the panel — position:absolute keeps it in the
           panel's scroll flow, so it exits naturally as section scrolls up.
           The glitch (clip-path) and difference blend live on this element. -->
      <div class="hero-logo" ref="heroLogoRef" v-html="logoSvg" aria-hidden="true" />

      <div class="panel-inner">
        <p class="eyebrow">Selected Works · 2019–2024</p>
        <p class="hero-sub">
          RESTRAINT IS A CREATIVE POSITION
        </p>
      </div>

      <a class="scroll-cue" href="#work" aria-label="Scroll to Work">
        <span class="eyebrow">Work</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <!-- height: 0 — not a snap point, no contribution to scroll height. -->
    <!-- The bridge-mark straddles the boundary via translate(-50%,-50%): -->
    <!--   upper half visible at the bottom of section above,             -->
    <!--   lower half visible at the top of section below.                -->
    <!-- Panel overflow:hidden doesn't clip it — the mark is a sibling,  -->
    <!-- not a child, of any panel.                                       -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--on-dark" v-html="burstline" />
    </div>

    <!-- ── Panel 2: Work ──────────────────────────────────────────── -->
    <section class="panel panel--light" id="work">
      <div class="panel-inner">
        <p class="eyebrow">01 / 03 · Selected Works</p>
        <h2 class="section-title">Work.</h2>
      </div>

      <a class="scroll-cue scroll-cue--dark" href="#about" aria-label="Scroll to About">
        <span class="eyebrow">About</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--on-light bridge-mark--flipped" v-html="burstline" />
    </div>

    <!-- ── Panel 3: About ─────────────────────────────────────────── -->
    <section class="panel panel--dark" id="about">
      <div class="panel-inner">
        <p class="eyebrow">02 / 03 · About</p>
        <h2 class="section-title">About.</h2>
      </div>

      <a class="scroll-cue" href="#contact" aria-label="Scroll to Contact">
        <span class="eyebrow">Contact</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--on-dark" v-html="burstline" />
    </div>

    <!-- ── Panel 4: Contact ───────────────────────────────────────── -->
    <section class="panel panel--light" id="contact">
      <div class="panel-inner">
        <p class="eyebrow">03 / 03 · Contact</p>
        <h2 class="section-title">Contact.</h2>
      </div>
    </section>

  </div>
</template>

<style>
/* @property must be global — also avoids tokenizer misreading <length> as an HTML tag */
@property --wave-r {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}
</style>

<style scoped>
/* ── RETICLE ───────────────────────────────────────────────────────────── */

.reticle {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 480px;
  color: #ffffff;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 100;
  /* Invisible on hero panel; fades in once hero scrolls away */
  opacity: 0;
  transition: opacity 500ms ease;
}

.reticle--visible { opacity: 1; }

.reticle :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ── SCROLL ROOT ───────────────────────────────────────────────────────── */

.scroll-root {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

/* ── PANELS ────────────────────────────────────────────────────────────── */

.panel {
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px;
}

.panel--dark  { background: #0a0a0a; color: #ffffff; }
.panel--light { background: #f0ede5; color: #111111; }

/* ── TOPO TEXTURE (hero panel only) ───────────────────────────────────── */

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

/* ── HERO LOGO ─────────────────────────────────────────────────────────── */
/* Centred absolutely inside panel 1 — scrolls away with the section.      */
/* mix-blend-mode: difference + fill: white = inversion against background. */
/* clip-path glitch applied via JS on a random timer (see script).          */

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

/* ── PANEL CONTENT ─────────────────────────────────────────────────────── */

.panel-inner {
  position: relative;
  z-index: 10;
  max-width: 640px;
}

.eyebrow {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 16px;
  line-height: 1;
}

.panel--dark  .eyebrow { color: #888780; }
.panel--light .eyebrow { color: rgba(0, 0, 0, 0.45); }

.hero-name {
  font-size: clamp(38px, 6vw, 72px);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 24px;
  line-height: 1.05;
}

.hero-sub {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1.75;
}

.section-title {
  font-size: clamp(38px, 6vw, 72px);
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.05;
}

/* ── SCROLL CUE ────────────────────────────────────────────────────────── */
/* ang_arrow as directional nav element, bottom-right of each panel.       */

.scroll-cue {
  position: absolute;
  bottom: 60px;
  right: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.4);
  transition: color 250ms ease;
  z-index: 10;
}

.scroll-cue:hover       { color: rgba(255, 255, 255, 0.9); }
.scroll-cue--dark       { color: rgba(0, 0, 0, 0.3); }
.scroll-cue--dark:hover { color: rgba(0, 0, 0, 0.7); }

/* ang_arrow points ↙ by default; rotate 135° CW → ↓ */
.scroll-cue__arrow {
  display: flex;
  width: 18px;
  height: 18px;
  transform: rotate(135deg);
  flex-shrink: 0;
}

.scroll-cue__arrow :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ── BRIDGE ────────────────────────────────────────────────────────────── */
/* Zero height — not a snap point.                                         */
/* overflow: visible — lets the mark extend into adjacent panels.          */
/* The mark is a sibling of panels, never a child, so panel               */
/* overflow:hidden cannot clip it.                                         */

.bridge {
  height: 0;
  position: relative;
  overflow: visible;
  z-index: 20;
}

.bridge-mark {
  position: absolute;
  top: 0;
  left: 50%;
  /* -50% X = horizontal center                                             */
  /* -50% Y = half above boundary (section A bottom)                        */
  /*          half below boundary (section B top)                           */
  transform: translate(-50%, -50%);
  width: 320px;
  height: 80px;
  pointer-events: none;
}

.bridge-mark :deep(svg) { width: 100%; height: 100%; }

.bridge-mark--on-dark  { color: rgba(255, 255, 255, 0.25); }
.bridge-mark--on-light { color: rgba(0,   0,   0,   0.18); }
.bridge-mark--flipped  { transform: translate(-50%, -50%) scaleX(-1); }

/* ── ANIMATIONS ────────────────────────────────────────────────────────── */

@keyframes dotWave {
  to { --wave-r: 1200px; }
}
</style>
