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

// ── Drawer state ─────────────────────────────────────────────────────────────
const activeDrawer = ref<string | null>(null)
const toggleDrawer = (section: string) => {
  activeDrawer.value = activeDrawer.value === section ? null : section
}
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') activeDrawer.value = null
}

const runHoverGlitch = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const flashCount = rand(2, 4)
  let cursor = 0
  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(25, 90)
    const gap           = rand(10, 50)
    const applyAt       = cursor
    const clearAt       = cursor + flashDuration
    cursor = clearAt + gap
    const path = generateClipPath(10)
    const caR  = rand(3, 8)
    const caC  = rand(3, 8)
    const blur = (rand(3, 12) / 10)
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

// ── Glitch effect ───────────────────────────────────────────────────────────
const heroLogoRef = ref<HTMLElement | null>(null)
let glitchTimeout: ReturnType<typeof setTimeout> | null = null

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const runGlitch = () => {
  const el = heroLogoRef.value
  if (!el) return

  const flashCount = rand(2, 4)
  let cursor = 0

  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(40, 120)   // how long each clip-path stays on
    const gap           = rand(20, 60)    // pause between flashes

    const applyAt  = cursor
    const clearAt  = cursor + flashDuration
    cursor = clearAt + gap

    const path  = generateClipPath()
    const caR   = rand(3, 8)          // red channel offset (px)
    const caC   = rand(3, 8)          // cyan channel offset (px)
    const blur  = (rand(3, 12) / 10)  // fuzz blur 0.3–1.2 px

    setTimeout(() => {
      el.style.clipPath = path
      el.style.setProperty('--ca-r-x',   `-${caR}px`)
      el.style.setProperty('--ca-c-x',   `${caC}px`)
      el.style.setProperty('--ca-blur',  `${blur}px`)
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
  glitchTimeout = setTimeout(() => {
    runGlitch()
    scheduleGlitch()
  }, delay)
}

onMounted(() => {
  scheduleGlitch()
  window.addEventListener('keydown', handleKeydown)
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
  window.removeEventListener('keydown', handleKeydown)
  heroObserver?.disconnect()
})
</script>

<template>
  <div
    class="reticle"
    :class="{ 'reticle--visible': !heroInView }"
    v-html="targetCircle"
    aria-hidden="true"
  />

  <!-- ── SIDE DRAWER ──────────────────────────────────────────────────── -->
  <Transition name="fade">
    <div
      v-if="activeDrawer !== null"
      class="drawer-backdrop"
      @click="activeDrawer = null"
      aria-hidden="true"
    />
  </Transition>
  <Transition name="drawer-slide">
    <aside
      v-if="activeDrawer !== null"
      class="drawer"
      role="complementary"
      :aria-label="`${activeDrawer} details`"
    >
      <div class="drawer__header">
        <button class="drawer__close" @click="activeDrawer = null" aria-label="Close panel">
          <span class="drawer__close-icon" v-html="angArrow" />
        </button>
      </div>
      <div class="drawer__body">
        <template v-if="activeDrawer === 'hero'">
          <p class="drawer__eyebrow">Introduction</p>
          <h3 class="drawer__title">Hello.</h3>
          <p class="drawer__text">Designer and developer focused on minimal, typographic interfaces. Available for select projects.</p>
        </template>
        <template v-else-if="activeDrawer === 'work'">
          <p class="drawer__eyebrow">Browse</p>
          <h3 class="drawer__title">Works.</h3>
          <ul class="drawer__list">
            <li>All</li>
            <li>Branding</li>
            <li>Digital</li>
            <li>Print</li>
          </ul>
        </template>
        <template v-else-if="activeDrawer === 'about'">
          <p class="drawer__eyebrow">Capabilities</p>
          <h3 class="drawer__title">Skills.</h3>
          <ul class="drawer__list">
            <li>Typography</li>
            <li>Motion Design</li>
            <li>Web Development</li>
            <li>Brand Systems</li>
          </ul>
        </template>
        <template v-else-if="activeDrawer === 'contact'">
          <p class="drawer__eyebrow">Links</p>
          <h3 class="drawer__title">Connect.</h3>
          <ul class="drawer__list">
            <li>Email</li>
            <li>LinkedIn</li>
            <li>GitHub</li>
            <li>Instagram</li>
          </ul>
        </template>
      </div>
    </aside>
  </Transition>

  <!-- ── SCROLL ROOT ────────────────────────────────────────────────────── -->
  <!-- scroll-snap-type: y mandatory — each panel is a distinct frame.       -->
  <!-- scroll-snap-stop defaults to `normal` on each child, which lets       -->
  <!-- momentum carry past snap points — this is the "soft snap" behaviour.  -->
  <div class="scroll-root" ref="scrollRootRef" :class="{ 'scroll-root--pushed': activeDrawer !== null }">

    <!-- ── Panel 1: Hero ──────────────────────────────────────────── -->
    <section class="panel panel--dark" id="hero" ref="heroRef">
      <div class="topo-texture" aria-hidden="true" />

      <!-- Logo centred in the panel — position:absolute keeps it in the
           panel's scroll flow, so it exits naturally as section scrolls up.
           The glitch (clip-path) and difference blend live on this element. -->
      <div class="hero-logo" ref="heroLogoRef" v-html="logoSvg" aria-hidden="true" />

      <div class="panel-inner">
        <p class="eyebrow">p o r t f o l i o</p>
        <p class="hero-sub">
          RESTRAINT IS A CREATIVE POSITION
        </p>
      </div>

      <a class="scroll-cue" href="#work" aria-label="Scroll to Work">
        <span class="eyebrow">Work</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>

      <button
        class="section-tab"
        :class="{ 'section-tab--active': activeDrawer === 'hero' }"
        @click="toggleDrawer('hero')"
        @mouseenter="runHoverGlitch"
        aria-label="More info"
      >
        <span class="section-tab__icon" v-html="angArrow" />
      </button>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <!-- height: 0 — not a snap point, no contribution to scroll height. -->
    <!-- The bridge-mark straddles the boundary via translate(-50%,-50%): -->
    <!--   upper half visible at the bottom of section above,             -->
    <!--   lower half visible at the top of section below.                -->
    <!-- Panel overflow:hidden doesn't clip it — the mark is a sibling,  -->
    <!-- not a child, of any panel.                                       -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <!-- ── Panel 2: Work ──────────────────────────────────────────── -->
    <section class="panel panel--light" id="work">
      <div class="panel-inner">
        <p class="eyebrow">01 / 03 · Selected Works / xx19–xx26</p>
        <h2 class="section-title">Work.</h2>
      </div>

      <a class="scroll-cue scroll-cue--dark" href="#about" aria-label="Scroll to About">
        <span class="eyebrow">About</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>

      <button
        class="section-tab section-tab--light"
        :class="{ 'section-tab--active': activeDrawer === 'work' }"
        @click="toggleDrawer('work')"
        @mouseenter="runHoverGlitch"
        aria-label="More info"
      >
        <span class="section-tab__icon" v-html="angArrow" />
      </button>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--flipped" v-html="burstline" />
    </div>

    <!-- ── Panel 3: About ─────────────────────────────────────────── -->
    <section class="panel panel--dark" id="about">
      <div class="panel-inner">
        <p class="eyebrow">02 / 03 · Who am I.</p>
        <h2 class="section-title">About.</h2>
      </div>

      <a class="scroll-cue" href="#contact" aria-label="Scroll to Contact">
        <span class="eyebrow">Contact</span>
        <span class="scroll-cue__arrow" v-html="angArrow" />
      </a>

      <button
        class="section-tab"
        :class="{ 'section-tab--active': activeDrawer === 'about' }"
        @click="toggleDrawer('about')"
        @mouseenter="runHoverGlitch"
        aria-label="More info"
      >
        <span class="section-tab__icon" v-html="angArrow" />
      </button>
    </section>

    <!-- ── Bridge ────────────────────────────────────────────────── -->
    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <!-- ── Panel 4: Contact ───────────────────────────────────────── -->
    <section class="panel panel--light" id="contact">
      <div class="panel-inner">
        <p class="eyebrow">03 / 03 · Contact</p>
        <h2 class="section-title">Contact.</h2>
      </div>

      <button
        class="section-tab section-tab--light"
        :class="{ 'section-tab--active': activeDrawer === 'contact' }"
        @click="toggleDrawer('contact')"
        @mouseenter="runHoverGlitch"
        aria-label="More info"
      >
        <span class="section-tab__icon" v-html="angArrow" />
      </button>
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

:root {
  --drawer-w: 380px;
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
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 135, 128, 0.35) transparent;
}

.scroll-root--pushed {
  transform: translateX(calc(-1 * var(--drawer-w)));
}

/* ── SCROLLBAR ─────────────────────────────────────────────────────────── */

.scroll-root::-webkit-scrollbar {
  width: 3px;
}

.scroll-root::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-root::-webkit-scrollbar-thumb {
  background: rgba(136, 135, 128, 0.35);
  border-radius: 0;
  transition: background 250ms ease;
}

.scroll-root::-webkit-scrollbar-thumb:hover {
  background: #ff2d78;
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

/* Chromatic aberration + fuzz — active only during glitch flashes */
.hero-logo.is-glitching {
  filter:
    blur(var(--ca-blur, 0.6px))
    drop-shadow(var(--ca-r-x, -4px) 0 0 rgba(255, 20, 80, 0.9))
    drop-shadow(var(--ca-c-x,  4px) 0 0 rgba(0, 220, 255, 0.9));
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

/* Reset the heading-context bottom margin so the eyebrow aligns with the arrow. */
.scroll-cue .eyebrow    { margin: 0; }

.scroll-cue__arrow {
  display: flex;
  width: 18px;
  height: 18px;
  transform: rotate(90deg);
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
  /* Blend bridge's white burstline against the panel backdrop.            */
  /* difference + white = inversion of whatever is visually behind.        */
  /* Panels are in scroll-root's stacking context; .bridge composites      */
  /* into that same context, so they are the backdrop.                     */
  mix-blend-mode: difference;
}

.bridge-mark {
  position: absolute;
  top: 0;
  left: 33%;
  /* -50% X centres the mark on the anchor point                            */
  /* -50% Y = half above boundary (section A bottom)                        */
  /*          half below boundary (section B top)                           */
  transform: translate(-50%, -50%);
  width: 320px;
  height: 80px;
  pointer-events: none;
}

/* Fill white — difference(white, backdrop) = invert(backdrop).           */
/* The shape has no independent colour; it is a transparent inversion.    */
.bridge-mark :deep(svg) { width: 100%; height: 100%; fill: #ffffff; }

.bridge-mark--flipped  { left: 70%; transform: translate(-50%, -50%) scaleX(-1); }

/* ── ANIMATIONS ────────────────────────────────────────────────────────── */

@keyframes dotWave {
  to { --wave-r: 1200px; }
}

/* ── SECTION TAB ───────────────────────────────────────────────────────── */
/* Floating right-edge trigger — matches the scroll-cue visual language.   */

.section-tab {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255);
  transition: color 250ms ease;
  z-index: 30;
}

.section-tab:hover {
  color: rgba(255, 255, 255);
}

.section-tab--light {
  color: rgba(0, 0, 0);
}

.section-tab--light:hover {
  color: rgba(0, 0, 0);
}

.section-tab__icon {
  display: flex;
  width: 10vh;
  height: 10vh;
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(45deg);
}

.section-tab__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.section-tab--active .section-tab__icon {
  transform: rotate(225deg);
}

.section-tab.is-glitching {
  filter:
    blur(var(--ca-blur, 0.6px))
    drop-shadow(var(--ca-r-x, -4px) 0 0 rgba(255, 20, 80, 0.9))
    drop-shadow(var(--ca-c-x,  4px) 0 0 rgba(0, 220, 255, 0.9));
}

/* ── DRAWER BACKDROP ───────────────────────────────────────────────────── */

/* Invisible click-to-close zone over the pushed page — no visual dim.    */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  right: var(--drawer-w);
  z-index: 150;
  background: transparent;
  cursor: pointer;
}

/* ── DRAWER ────────────────────────────────────────────────────────────── */

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--drawer-w);
  background: #0d0d0d;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 60px 40px;
  overflow-y: auto;
}

.drawer__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 48px;
}

.drawer__close {
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 200ms ease;
}

.drawer__close:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.drawer__close-icon {
  display: flex;
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.5);
  transform: rotate(180deg);
  transition: color 200ms ease;
}

.drawer__close:hover .drawer__close-icon {
  color: rgba(255, 255, 255, 0.9);
}

.drawer__close-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.drawer__eyebrow {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 16px;
}

.drawer__title {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 32px;
  line-height: 1.05;
}

.drawer__text {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.75;
  margin: 0;
}

.drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.drawer__list li {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  cursor: default;
  transition: color 200ms ease;
}

.drawer__list li:last-child {
  border-bottom: none;
}

.drawer__list li:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* ── TRANSITIONS ───────────────────────────────────────────────────────── */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 380ms cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
