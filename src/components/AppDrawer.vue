<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import scaleRaw from '../assets/svg/micrographics/scale.svg?raw'

const props = defineProps<{
  isOpen: boolean
  isLight?: boolean
  label?: string
}>()

const emit = defineEmits<{
  close: []
  'swipe-right': []
  'boundary-scroll': [delta: number]
}>()

const shellRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const panelId = 'info-drawer-panel'

const getFocusable = () => {
  if (!shellRef.value) return []

  return Array.from(
    shellRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => (
    element.getAttribute('aria-hidden') !== 'true'
    && !element.closest('[inert]')
    && !element.closest('[aria-hidden="true"]')
  ))
}

const onShellKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen || event.key !== 'Tab') return

  const focusable = getFocusable()
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.isOpen,
  async (isOpen) => {
    await nextTick()

    if (isOpen) {
      const initialTarget = contentRef.value?.querySelector<HTMLElement>(
        '[data-drawer-autofocus], button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      initialTarget?.focus()
    }
  },
)

const SWIPE_MIN_PX = 50
const SWIPE_MAX_VERT = 60
const VERTICAL_SWIPE_MIN_PX = 48
const SCROLL_EDGE_PX = 1

let touchStartX = 0
let touchStartY = 0
let touchScrollable: HTMLElement | null = null
let backdropTouchY = 0
let backdropDidScroll = false

const getScrollablePanel = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null
  return target.closest<HTMLElement>('.drawer-panel')
}

const isAtScrollStart = (element: HTMLElement) => element.scrollTop <= SCROLL_EDGE_PX
const isAtScrollEnd = (element: HTMLElement) => (
  element.scrollTop + element.clientHeight >= element.scrollHeight - SCROLL_EDGE_PX
)

const onWheel = (event: WheelEvent) => {
  if (!props.isOpen || !event.deltaY) return

  const scrollable = getScrollablePanel(event.target)
  if (!scrollable) return

  const isLeavingAtStart = event.deltaY < 0 && isAtScrollStart(scrollable)
  const isLeavingAtEnd = event.deltaY > 0 && isAtScrollEnd(scrollable)
  if (!isLeavingAtStart && !isLeavingAtEnd) return

  // At an inner drawer boundary, keep scrolling through the shared page flow.
  event.preventDefault()
  emit('boundary-scroll', event.deltaY)
}

const onBackdropWheel = (event: WheelEvent) => {
  if (!event.deltaY) return
  event.preventDefault()
  emit('boundary-scroll', event.deltaY)
}

const onBackdropTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  backdropTouchY = touch.clientY
  backdropDidScroll = false
}

const onBackdropTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches[0]
  if (!touch) return
  const delta = backdropTouchY - touch.clientY
  if (Math.abs(delta) < VERTICAL_SWIPE_MIN_PX) return
  backdropDidScroll = true
  emit('boundary-scroll', delta)
}

const onBackdropClick = () => {
  if (backdropDidScroll) {
    backdropDidScroll = false
    return
  }
  emit('close')
}

const onTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  touchScrollable = getScrollablePanel(event.target)
}

const onTouchEnd = (event: TouchEvent) => {
  if (!props.isOpen) return

  const touch = event.changedTouches[0]
  if (!touch) return

  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  const absDy = Math.abs(dy)
  if (dx >= SWIPE_MIN_PX && absDy <= SWIPE_MAX_VERT) {
    emit('swipe-right')
    touchScrollable = null
    return
  }

  if (touchScrollable && absDy >= VERTICAL_SWIPE_MIN_PX && Math.abs(dx) <= SWIPE_MAX_VERT) {
    const isLeavingAtStart = dy > 0 && isAtScrollStart(touchScrollable)
    const isLeavingAtEnd = dy < 0 && isAtScrollEnd(touchScrollable)
    if (isLeavingAtStart || isLeavingAtEnd) {
      emit('boundary-scroll', dy < 0 ? window.innerHeight * 0.75 : -window.innerHeight * 0.75)
    }
  }

  touchScrollable = null
}
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isOpen"
      class="drawer-backdrop"
      type="button"
      tabindex="-1"
      aria-label="Close information drawer"
      @click="onBackdropClick"
      @wheel="onBackdropWheel"
      @touchstart.passive="onBackdropTouchStart"
      @touchend.passive="onBackdropTouchEnd"
    />
  </Transition>

  <div
    ref="shellRef"
    class="drawer-shell"
    :class="{
      'drawer-shell--open': isOpen,
      'drawer-shell--light': isLight,
    }"
    @keydown="onShellKeydown"
    @wheel="onWheel"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <aside
      :id="panelId"
      class="drawer__surface"
      :class="{ 'drawer__surface--open': isOpen }"
      :role="isOpen ? 'dialog' : undefined"
      :aria-modal="isOpen ? 'true' : undefined"
      :aria-label="label"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
    >
      <div class="drawer__tex" aria-hidden="true" />
      <div ref="contentRef" class="drawer__body">
        <slot />
      </div>
      <div class="drawer__scale" aria-hidden="true" v-html="scaleRaw" />
    </aside>
  </div>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0 var(--drawer-w) 0 0;
  z-index: 150;
  display: block;
  width: auto;
  height: auto;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.drawer-shell {
  --drawer-list-text: var(--c-text-mid);
  --drawer-list-hover: var(--c-text-strong);
  --drawer-list-rule: var(--c-ghost);
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 200;
  width: calc(var(--drawer-w) - var(--drawer-rail-w));
  height: 100dvh;
  display: block;
  color: var(--c-white);
  background: var(--c-surface);
  font-family: var(--font-sans);
  transform: translateX(100%);
  transition: transform 380ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0ms;
  will-change: transform;
}

.drawer-shell :deep(button),
.drawer-shell :deep(input),
.drawer-shell :deep(select),
.drawer-shell :deep(textarea) {
  font-family: inherit;
}

.drawer-shell--open {
  transform: translateX(0);
}

.drawer-shell--light {
  --drawer-list-text: var(--c-light-text-body);
  --drawer-list-hover: var(--c-light-text-strong);
  --drawer-list-rule: var(--c-light-rule);
  color: var(--c-surface-2);
  background: var(--c-light-surface);
}

.drawer__surface {
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: inherit;
  visibility: hidden;
  transition: visibility 0ms 380ms;
}

.drawer__surface--open {
  visibility: visible;
  transition-delay: 0ms;
}

.drawer__tex {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('@/assets/textures/bg_tex_2.png') repeat;
  opacity: 0.015;
  pointer-events: none;
}

.drawer__body {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.drawer__scale {
  position: absolute;
  z-index: 1;
  right: 40px;
  bottom: 3vh;
  left: 40px;
  display: block;
  filter: invert(1);
  line-height: 0;
  pointer-events: none;
}

.drawer__scale :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.drawer-shell--light .drawer__scale {
  filter: none;
}

:deep(.drawer-panel) {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 60px 40px;
}

:deep(.drawer__title-row) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

:deep(.drawer__detail) {
  display: block;
  flex-shrink: 0;
  width: 80px;
  opacity: 1;
  margin-top: 20px;
}

:deep(.drawer__detail-inner) {
  display: block;
  filter: brightness(0) invert(1);
}

:deep(.drawer__detail-inner svg) {
  width: 100%;
  height: auto;
}

:deep(.drawer__eyebrow) {
  margin: 0 0 16px;
  color: var(--c-text-dim);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

:deep(.drawer__title) {
  margin: 0 0 32px;
  color: var(--c-white);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

:deep(.drawer__text) {
  margin: 0;
  color: var(--c-text-mid);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.03em;
}

:deep(.drawer__list) {
  margin: 0;
  padding: 0;
  list-style: none;
}

.drawer-shell--light :deep(.drawer__eyebrow) {
  color: var(--c-light-text-muted);
}

.drawer-shell--light :deep(.drawer__title) {
  color: var(--c-surface-2);
}

.drawer-shell--light :deep(.drawer__detail-inner) {
  filter: brightness(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .drawer__scale {
    right: 6vw;
    left: 6vw;
  }

  :deep(.drawer-panel) {
    padding: 8vw 6vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-shell,
  .drawer__surface,
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 1ms;
  }

  .drawer__surface {
    transition-delay: 1ms;
  }
}
</style>
