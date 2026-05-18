<script setup lang="ts">
import { computed } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))

defineProps<{
  isOpen: boolean
  isLight?: boolean
  label?: string
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="drawer-backdrop"
      @click="emit('close')"
      aria-hidden="true"
    />
  </Transition>
  <Transition name="drawer-slide">
    <aside
      v-if="isOpen"
      class="drawer"
      :class="{ 'drawer--light': isLight }"
      role="complementary"
      :aria-label="label"
    >
      <div class="drawer__tex" aria-hidden="true" />
      <div class="drawer__header">
        <button class="drawer__close" @click="emit('close')" aria-label="Close panel">
          <span class="drawer__close-icon" v-html="angArrow" />
        </button>
      </div>
      <div class="drawer__body">
        <slot />
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
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

.drawer__tex {
  position: absolute;
  inset: 0;
  background: url('@/assets/svg/textures/bg_tex_2.png') repeat;
  opacity: 0.045;
  pointer-events: none;
  z-index: 0;
}

.drawer__header,
.drawer__body {
  position: relative;
  z-index: 1;
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

/* ── SLOTTED CONTENT STYLES ───────────────────────────────────────────── */

:deep(.drawer__eyebrow) {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 16px;
}

:deep(.drawer__title) {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 32px;
  line-height: 1.05;
}

:deep(.drawer__text) {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.75;
  margin: 0;
}

:deep(.drawer__list) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.drawer__list li) {
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

:deep(.drawer__list li:last-child) {
  border-bottom: none;
}

:deep(.drawer__list li:hover) {
  color: rgba(255, 255, 255, 0.9);
}

/* ── DRAWER LIGHT THEME ────────────────────────────────────────────────── */

.drawer--light {
  background: #f0efea;
  border-left-color: rgba(0, 0, 0, 0.08);
}

.drawer--light .drawer__close {
  border-color: rgba(0, 0, 0, 0.15);
}

.drawer--light .drawer__close:hover {
  border-color: rgba(0, 0, 0, 0.4);
}

.drawer--light .drawer__close-icon {
  color: rgba(0, 0, 0, 0.5);
}

.drawer--light .drawer__close:hover .drawer__close-icon {
  color: rgba(0, 0, 0, 0.9);
}

.drawer--light :deep(.drawer__eyebrow) {
  color: rgba(0, 0, 0, 0.4);
}

.drawer--light :deep(.drawer__title) {
  color: #0d0d0d;
}

.drawer--light :deep(.drawer__list li) {
  color: rgba(0, 0, 0, 0.45);
  border-bottom-color: rgba(0, 0, 0, 0.07);
}

.drawer--light :deep(.drawer__list li:hover) {
  color: rgba(0, 0, 0, 0.9);
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
