<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

import burstlineRaw  from '../assets/svg/micrographics/long_burstline.svg?raw'
import reticle1Raw   from '../assets/svg/micrographics/target_circle.svg?raw'
import reticle2Raw   from '../assets/svg/micrographics/target_circle_2.svg?raw'
import reticle3Raw   from '../assets/svg/micrographics/target_circle_3.svg?raw'

import PanelHero    from './PanelHero.vue'
import PanelWork    from './PanelWork.vue'
import PanelAbout   from './PanelAbout.vue'
import PanelContact from './PanelContact.vue'

import AppDrawer    from './AppDrawer.vue'
import DrawerWork   from './DrawerWork.vue'
import DrawerAbout  from './DrawerAbout.vue'
import DrawerContact from './DrawerContact.vue'

import { generateClipPath } from '../utils/clip_path_gen'
import { rand } from '../utils/glitch'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')

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
const texRef          = ref<HTMLElement | null>(null)

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

// Maps panel index → drawer name (null = no drawer for this panel)
const PANEL_DRAWER_NAMES: (string | null)[] = [null, 'work', 'about', 'contact']

// ── Swipe-to-open gesture ──────────────────────────────────────────────────
const SWIPE_EDGE_PX   = 40  // touch must start within this many px of the right edge
const SWIPE_MIN_PX    = 50  // minimum horizontal travel to count as a swipe
const SWIPE_MAX_VERT  = 60  // maximum vertical drift before we ignore the swipe

let touchStartX = 0
let touchStartY = 0
let swipeTracking = false

const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  // Only track swipes that begin near the right edge
  swipeTracking = touchStartX >= window.innerWidth - SWIPE_EDGE_PX
}

const onTouchEnd = (e: TouchEvent) => {
  if (!swipeTracking) return
  swipeTracking = false

  const touch = e.changedTouches[0]
  if (!touch) return
  const dx = touchStartX - touch.clientX  // positive = moved left
  const dy = Math.abs(touch.clientY - touchStartY)

  if (dx >= SWIPE_MIN_PX && dy <= SWIPE_MAX_VERT && activeDrawer.value === null) {
    const drawerName = PANEL_DRAWER_NAMES[activePanel.value] ?? null
    if (drawerName) activeDrawer.value = drawerName
  }
}

// 'about' is panel--dark, so its drawer should be light; others are light panels → dark drawer
const LIGHT_DRAWER_PANELS = new Set(['about'])
const drawerIsLight = computed(() => LIGHT_DRAWER_PANELS.has(activeDrawer.value ?? ''))

const onScroll = () => {
  const y = scrollRootRef.value?.scrollTop ?? 0
  if (texRef.value) texRef.value.style.transform = `translateY(${y * 0.12}px)`
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })

  // ── Texture parallax ───────────────────────────────────────────────────
  scrollRootRef.value?.addEventListener('scroll', onScroll, { passive: true })

  panelObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const idx = panelElements.indexOf(entry.target as HTMLElement)
        if (idx === -1 || idx === activePanel.value) continue
        // Hero panel (0): just update state and fire logo glitch on re-entry
        if (idx === 0) {
          activePanel.value = 0
          heroPanelRef.value?.triggerGlitch()
          continue
        }
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
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  scrollRootRef.value?.removeEventListener('scroll', onScroll)
  panelObserver?.disconnect()
})
</script>

<template>
  <div class="tex-overlay" ref="texRef" aria-hidden="true" />

  <div
    ref="reticleRef"
    class="reticle"
    :class="{ 'reticle--visible': activePanel > 0 }"
    v-html="reticleSvg"
    aria-hidden="true"
  />

  <!-- ── SIDE DRAWER ──────────────────────────────────────────────────── -->
  <AppDrawer
    :is-open="activeDrawer !== null"
    :is-light="drawerIsLight"
    :label="activeDrawer ? `${activeDrawer} details` : undefined"
    @close="activeDrawer = null"
  >
    <DrawerWork    v-if="activeDrawer === 'work'" />
    <DrawerAbout   v-else-if="activeDrawer === 'about'" />
    <DrawerContact v-else-if="activeDrawer === 'contact'" />
  </AppDrawer>

  <!-- ── SCROLL ROOT ────────────────────────────────────────────────────── -->
  <div class="scroll-root" ref="scrollRootRef" :class="{ 'scroll-root--pushed': activeDrawer !== null }">

    <PanelHero
      ref="heroPanelRef"
      :isActive="false"
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
  --drawer-w: 50vw;
}
</style>

<style scoped>
/* ── TEXTURE OVERLAY ──────────────────────────────────────────────────── */

.tex-overlay {
  position: fixed;
  top: -50vh;
  left: 0;
  right: 0;
  height: 200vh;
  background: url('@/assets/bgs/bg2.jpg') center center / cover;
  opacity: 0.03;
  pointer-events: none;
  z-index: 5;
  will-change: transform;
}

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

.scroll-root--pushed::-webkit-scrollbar { width: 0; }
.scroll-root--pushed { scrollbar-width: none; }

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
  top: .25vh;
  position: relative;
  overflow: visible;
  z-index: 20;
  mix-blend-mode: difference;
}

.bridge-mark {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 105%;
  pointer-events: none;
}

.bridge-mark :deep(svg) { width: 100%; height: 100%; fill: #ffffff; }

.bridge-mark--flipped { right: 50%; transform: translate(-50%, -50%) scaleX(-1); }

</style>
