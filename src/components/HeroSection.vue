<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

import angArrowRaw   from '../assets/svg/micrographics/ang_arrow.svg?raw'
import burstlineRaw  from '../assets/svg/micrographics/burstline.svg?raw'
import reticle1Raw   from '../assets/svg/micrographics/target_circle.svg?raw'
import reticle2Raw   from '../assets/svg/micrographics/target_circle_2.svg?raw'
import reticle3Raw   from '../assets/svg/micrographics/target_circle_3.svg?raw'

import PanelHero    from './PanelHero.vue'
import PanelWork    from './PanelWork.vue'
import PanelAbout   from './PanelAbout.vue'
import PanelContact from './PanelContact.vue'

import { generateClipPath } from '../utils/clip_path_gen'
import { rand } from '../utils/glitch'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')

const angArrow  = computed(() => fixStrokes(angArrowRaw))
const burstline = computed(() => fixStrokes(burstlineRaw))

// ── Reticle variants — one entry per panel (index 0 = hero, hidden).
// Add more SVG imports and push to this array to support additional panels.
const RETICLE_SVGS = [
  null,        // panel 0: hero — reticle is hidden
  reticle1Raw, // panel 1: work
  reticle2Raw, // panel 2: about
  reticle3Raw, // panel 3: contact
]

// ── Reticle state ─────────────────────────────────────────────────────────
const activePanel = ref(0)
const reticleRef  = ref<HTMLElement | null>(null)

const reticleSvg = computed(() => {
  // Panel 0 (hero) is null → no reticle. Beyond the array → repeat last.
  const idx = Math.min(activePanel.value, RETICLE_SVGS.length - 1)
  const raw = RETICLE_SVGS[idx]
  return raw ? fixStrokes(raw) : ''
})

// Two clip-path flashes; SVG swaps at the start of the second flash so the
// glitch appears to "reveal" the new variant.
const runReticleGlitch = (onSwap: () => void) => {
  const el = reticleRef.value
  if (!el) { onSwap(); return }

  const t1 = rand(60, 100)
  const g1 = rand(20, 40)
  const t2 = rand(50, 80)

  el.style.clipPath = generateClipPath(8)
  el.classList.add('reticle--glitching')
  setTimeout(() => {
    el.style.clipPath = ''
    el.classList.remove('reticle--glitching')
    setTimeout(() => {
      onSwap()
      el.style.clipPath = generateClipPath(8)
      el.classList.add('reticle--glitching')
      setTimeout(() => {
        el.style.clipPath = ''
        el.classList.remove('reticle--glitching')
      }, t2)
    }, g1)
  }, t1)
}

// ── Panel refs ────────────────────────────────────────────────────────────
const heroPanelRef    = ref<InstanceType<typeof PanelHero>    | null>(null)
const workPanelRef    = ref<InstanceType<typeof PanelWork>    | null>(null)
const aboutPanelRef   = ref<InstanceType<typeof PanelAbout>   | null>(null)
const contactPanelRef = ref<InstanceType<typeof PanelContact> | null>(null)
const scrollRootRef   = ref<HTMLElement | null>(null)

let panelObserver: IntersectionObserver | null = null
let panelElements: HTMLElement[] = []

// ── Drawer state ──────────────────────────────────────────────────────────
const activeDrawer = ref<string | null>(null)
const toggleDrawer = (section: string) => {
  activeDrawer.value = activeDrawer.value === section ? null : section
}
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') activeDrawer.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  panelObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const idx = panelElements.indexOf(entry.target as HTMLElement)
        if (idx === -1 || idx === activePanel.value) continue
        // Hero panel (0): just update state — reticle is invisible anyway
        if (idx === 0) { activePanel.value = 0; continue }
        runReticleGlitch(() => { activePanel.value = idx })
      }
    },
    { root: scrollRootRef.value, threshold: 0.5 },
  )

  // Order must match RETICLE_SVGS index
  panelElements = [
    heroPanelRef.value?.panelRef,
    workPanelRef.value?.panelRef,
    aboutPanelRef.value?.panelRef,
    contactPanelRef.value?.panelRef,
  ].filter((el): el is HTMLElement => el != null)

  panelElements.forEach(el => panelObserver!.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  panelObserver?.disconnect()
})
</script>

<template>
  <div
    ref="reticleRef"
    class="reticle"
    :class="{ 'reticle--visible': activePanel > 0 }"
    v-html="reticleSvg"
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
  <div class="scroll-root" ref="scrollRootRef" :class="{ 'scroll-root--pushed': activeDrawer !== null }">

    <PanelHero
      ref="heroPanelRef"
      :isActive="activeDrawer === 'hero'"
      @toggle="toggleDrawer('hero')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <PanelWork
      ref="workPanelRef"
      :isActive="activeDrawer === 'work'"
      @toggle="toggleDrawer('work')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--flipped" v-html="burstline" />
    </div>

    <PanelAbout
      ref="aboutPanelRef"
      :isActive="activeDrawer === 'about'"
      @toggle="toggleDrawer('about')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <PanelContact
      ref="contactPanelRef"
      :isActive="activeDrawer === 'contact'"
      @toggle="toggleDrawer('contact')"
    />

  </div>
</template>

<style>
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
  height: 240px;
  width: auto;
  color: #ffffff;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0ms;
}

.reticle--visible {
  opacity: 1;
  transition: opacity 500ms ease;
}

.reticle--glitching {
  filter:
    blur(0.4px)
    drop-shadow(-3px 0 0 rgba(255, 20, 80, 0.75))
    drop-shadow( 3px 0 0 rgba(0, 220, 255, 0.75));
}

.reticle :deep(svg) {
  height: 100%;
  width: auto;
  display: block;
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

/* ── BRIDGE ────────────────────────────────────────────────────────────── */
/* Zero height — not a snap point. overflow:visible lets the mark extend   */
/* into adjacent panels without being clipped by panel overflow:hidden.    */

.bridge {
  height: 0;
  position: relative;
  overflow: visible;
  z-index: 20;
  mix-blend-mode: difference;
}

.bridge-mark {
  position: absolute;
  top: 0;
  left: 33%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 80px;
  pointer-events: none;
}

.bridge-mark :deep(svg) { width: 100%; height: 100%; fill: #ffffff; }

.bridge-mark--flipped { left: 70%; transform: translate(-50%, -50%) scaleX(-1); }

/* ── DRAWER BACKDROP ───────────────────────────────────────────────────── */

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
