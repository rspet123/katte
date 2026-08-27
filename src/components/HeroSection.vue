<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'

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
type DrawerName = 'work' | 'about' | 'contact'

interface DrawerSection {
  name: DrawerName
  number: string
  isLight: boolean
}

const PANEL_DRAWERS: (DrawerSection | null)[] = [
  null,
  { name: 'work', number: '01', isLight: false },
  { name: 'about', number: '02', isLight: true },
  { name: 'contact', number: '03', isLight: false },
]

const activeDrawer = ref<DrawerName | null>(null)
const renderedDrawer = ref<DrawerName | null>(null)
const workDrawerRef = ref<InstanceType<typeof DrawerWork> | null>(null)
const drawerTrackOffset = ref(0)
let drawerCloseTimer: ReturnType<typeof setTimeout> | null = null
const getDrawerTransitionDuration = () => (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400
)

const currentDrawer = computed(() => PANEL_DRAWERS[activePanel.value] ?? null)
const renderedDrawerMeta = computed(() => {
  const name = activeDrawer.value ?? renderedDrawer.value
  if (name) return PANEL_DRAWERS.find((entry) => entry?.name === name) ?? null
  return currentDrawer.value
})

const openDrawer = (name?: DrawerName) => {
  const section = name
    ? PANEL_DRAWERS.find((entry) => entry?.name === name) ?? null
    : currentDrawer.value
  if (!section) return
  if (drawerCloseTimer) clearTimeout(drawerCloseTimer)
  renderedDrawer.value = section.name
  activeDrawer.value = section.name
}

const toggleDrawer = (name: DrawerName) => {
  if (activeDrawer.value === name) closeDrawer()
  else openDrawer(name)
}

const closeDrawer = (restoreFocus = true) => {
  if (!activeDrawer.value) return
  const closingDrawer = activeDrawer.value
  if (activeDrawer.value === 'work') workDrawerRef.value?.resetDetail()
  activeDrawer.value = null
  if (restoreFocus) {
    nextTick(() => {
      scrollRootRef.value
        ?.querySelector<HTMLButtonElement>(`[data-info-rail="${closingDrawer}"]`)
        ?.focus()
    })
  }
  if (drawerCloseTimer) clearTimeout(drawerCloseTimer)
  drawerCloseTimer = setTimeout(() => {
    renderedDrawer.value = null
  }, getDrawerTransitionDuration())
}

const stepBack = () => {
  if (activeDrawer.value === 'work' && workDrawerRef.value?.hasActiveDetail()) {
    workDrawerRef.value.backToList()
    return
  }
  closeDrawer()
}

const handleDrawerBoundaryScroll = (delta: number) => {
  // The drawer has reached the top or bottom of its own content. Continue in
  // the page's snap scroller so the rail and drawer section advance together.
  if (activeDrawer.value === 'work' && workDrawerRef.value?.hasActiveDetail()) return
  scrollRootRef.value?.scrollBy({ top: delta, behavior: 'smooth' })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activeDrawer.value) stepBack()
}

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

  if (dx >= SWIPE_MIN_PX && dy <= SWIPE_MAX_VERT && activeDrawer.value === null) openDrawer()
}

const onScroll = () => {
  const y = scrollRootRef.value?.scrollTop ?? 0
  if (texRef.value) texRef.value.style.transform = `translateY(${y * 0.12}px)`

  // The first viewport is the hero, which has no drawer. From Work onward,
  // move the drawer's three-section track by exactly the same number of
  // pixels as the page sequence.
  const viewportHeight = scrollRootRef.value?.clientHeight ?? window.innerHeight
  drawerTrackOffset.value = Math.min(
    Math.max(y - viewportHeight, 0),
    viewportHeight * (PANEL_DRAWERS.length - 2),
  )
}

watch(activePanel, (panelIndex) => {
  if (!activeDrawer.value) return

  const nextSection = PANEL_DRAWERS[panelIndex]
  if (!nextSection) {
    closeDrawer(false)
    return
  }

  if (activeDrawer.value === nextSection.name) return
  if (activeDrawer.value === 'work') workDrawerRef.value?.resetDetail()

  // The split stays fixed on desktop, while its content follows the same
  // snap sequence as the visible rail and page.
  renderedDrawer.value = nextSection.name
  activeDrawer.value = nextSection.name
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })

  // ── Texture parallax ───────────────────────────────────────────────────
  scrollRootRef.value?.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

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
  if (drawerCloseTimer) clearTimeout(drawerCloseTimer)
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
    :label="renderedDrawerMeta ? `${renderedDrawerMeta.name} information` : undefined"
    @close="closeDrawer"
    @swipe-right="stepBack"
    @boundary-scroll="handleDrawerBoundaryScroll"
  >
    <div
      class="drawer-sequence"
      :style="{ transform: `translate3d(0, -${drawerTrackOffset}px, 0)` }"
    >
      <section
        class="drawer-sequence__section drawer-sequence__section--dark"
        :aria-hidden="activeDrawer !== 'work'"
      >
        <DrawerWork ref="workDrawerRef" />
      </section>
      <section
        class="drawer-sequence__section drawer-sequence__section--light"
        :aria-hidden="activeDrawer !== 'about'"
      >
        <DrawerAbout />
      </section>
      <section
        class="drawer-sequence__section drawer-sequence__section--dark"
        :aria-hidden="activeDrawer !== 'contact'"
      >
        <DrawerContact />
      </section>
    </div>
  </AppDrawer>

  <!-- ── SCROLL ROOT ────────────────────────────────────────────────────── -->
  <div
    class="scroll-root scrollbar-thin"
    ref="scrollRootRef"
    :class="{ 'scroll-root--pushed': activeDrawer !== null }"
  >

    <PanelHero ref="heroPanelRef" :isActive="false" />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <PanelWork
      ref="workPanelRef"
      :is-active="activeDrawer === 'work'"
      @toggle="toggleDrawer('work')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark bridge-mark--flipped" v-html="burstline" />
    </div>

    <PanelAbout
      ref="aboutPanelRef"
      :is-active="activeDrawer === 'about'"
      @toggle="toggleDrawer('about')"
    />

    <div class="bridge" aria-hidden="true">
      <div class="bridge-mark" v-html="burstline" />
    </div>

    <PanelContact
      ref="contactPanelRef"
      :is-active="activeDrawer === 'contact'"
      @toggle="toggleDrawer('contact')"
    />

  </div>
</template>

<style scoped>
/* ── TEXTURE OVERLAY ──────────────────────────────────────────────────── */

.tex-overlay {
  position: fixed;
  top: -50vh;
  left: 0;
  right: 0;
  height: 200vh;
  background: url('@/assets/bgs/bg2.jpg') center center / cover;
  opacity: 0.06;
  pointer-events: none;
  z-index: 5;
  will-change: transform;
}

@media (max-width: 768px) {
  .tex-overlay {
    opacity: 0.1;
  }
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
}

.scroll-root--pushed {
  transform: translateX(calc(var(--drawer-rail-w) - var(--drawer-w)));
}

/* ── SCROLLBAR ─────────────────────────────────────────────────────────── */

.scroll-root--pushed::-webkit-scrollbar { width: 0; }
.scroll-root--pushed { scrollbar-width: none; }

/* ── DRAWER SCROLL SEQUENCE ───────────────────────────────────────────── */

.drawer-sequence {
  width: 100%;
  height: 300%;
  will-change: transform;
}

.drawer-sequence__section {
  position: relative;
  width: 100%;
  height: calc(100% / 3);
  min-height: 0;
  overflow: hidden;
}

.drawer-sequence__section::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  background: url('@/assets/textures/bg_tex_2.png') repeat;
  opacity: 0.015;
  pointer-events: none;
}

.drawer-sequence__section--dark {
  --drawer-list-text: var(--c-text-mid);
  --drawer-list-hover: var(--c-text-strong);
  --drawer-list-rule: var(--c-ghost);
  color: var(--c-white);
  background: var(--c-surface);
}

.drawer-sequence__section--light {
  --drawer-list-text: var(--c-light-text-body);
  --drawer-list-hover: var(--c-light-text-strong);
  --drawer-list-rule: var(--c-light-rule);
  color: var(--c-surface-2);
  background: var(--c-light-surface);
}

.drawer-sequence__section--light :deep(.drawer__eyebrow) {
  color: var(--c-light-text-muted);
}

.drawer-sequence__section--light :deep(.drawer__title) {
  color: var(--c-surface-2);
}

.drawer-sequence__section--light :deep(.drawer__detail-inner) {
  filter: brightness(0);
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

@media (prefers-reduced-motion: reduce) {
  .scroll-root,
  .reticle,
  .reticle--visible {
    transition-duration: 1ms;
  }
}

</style>
