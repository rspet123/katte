<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

import targetCircleRaw from '../assets/svg/micrographics/target_circle.svg?raw'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import burstlineRaw from '../assets/svg/micrographics/burstline.svg?raw'

import PanelHero    from './PanelHero.vue'
import PanelWork    from './PanelWork.vue'
import PanelAbout   from './PanelAbout.vue'
import PanelContact from './PanelContact.vue'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')

const targetCircle = computed(() => fixStrokes(targetCircleRaw))
const angArrow     = computed(() => fixStrokes(angArrowRaw))
const burstline    = computed(() => fixStrokes(burstlineRaw))

// ── Hero ↔ reticle swap ───────────────────────────────────────────────────
const heroPanelRef  = ref<InstanceType<typeof PanelHero> | null>(null)
const scrollRootRef = ref<HTMLElement | null>(null)
const heroInView    = ref(true)
let   heroObserver: IntersectionObserver | null = null

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
  // Observe the hero panel against the scroll container as root so
  // intersection is measured within the snapping viewport, not the document.
  heroObserver = new IntersectionObserver(
    (entries) => { if (entries[0]) heroInView.value = entries[0].isIntersecting },
    { root: scrollRootRef.value, threshold: 0.5 },
  )
  const el = heroPanelRef.value?.panelRef
  if (el) heroObserver.observe(el)
})
onUnmounted(() => {
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
      :isActive="activeDrawer === 'work'"
      @toggle="toggleDrawer('work')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--flipped" v-html="burstline" />
    </div>

    <PanelAbout
      :isActive="activeDrawer === 'about'"
      @toggle="toggleDrawer('about')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <PanelContact
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
  width: 480px;
  height: 480px;
  color: #ffffff;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 100;
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
