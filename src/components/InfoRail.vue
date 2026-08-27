<script setup lang="ts">
defineProps<{
  number: string
  sectionName: string
  isOpen: boolean
  isLight?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
const arrows = 10;
</script>

<template>
  <button
    class="info-rail"
    :class="{
      'info-rail--open': isOpen,
      'info-rail--light': isLight,
    }"
    type="button"
    :data-info-rail="sectionName"
    :aria-label="`${isOpen ? 'Close' : 'Open'} ${sectionName} information`"
    :aria-expanded="isOpen"
    aria-controls="info-drawer-panel"
    @click="emit('toggle')"
  >
    <span class="info-rail__content" aria-hidden="true">
      <span class="info-rail__number">[ {{ number }} ]</span>
      <span class="info-rail__label">INFO</span>
      <span class="info-rail__arrow">«</span>
      <div class="info-rail__arrows_container">
        <span
          v-for="n in arrows"
          :key="n"
          class="info-rail__accent-arrow"
        >
          {{ isOpen ? '-' : '+' }}
        </span>
      </div>
    </span>
  </button>
</template>

<style scoped>
.info-rail {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: 10;
  width: var(--drawer-rail-w);
  height: 100%;
  display: block;
  padding: 0;
  color: var(--c-white);
  background: var(--c-surface);
  border: 0;
  border-left: 1px solid var(--c-border);
  border-right: 1px solid var(--c-border);
  border-radius: 0;
  cursor: pointer;
  font: inherit;
  text-align: center;
  overflow: hidden;
}

.info-rail::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('@/assets/textures/bg_tex_2.png') repeat;
  opacity: 0.025;
  pointer-events: none;
}

.info-rail--light {
  color: var(--c-surface-2);
  background: var(--c-light-surface);
  border-color: var(--c-light-border);
}

.info-rail__content {
  position: absolute;
  top: 60px;
  inset-inline: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-rail__number,
.info-rail__label {
  font-size: 9px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.info-rail__number {
  opacity: 0.65;
}

.info-rail__arrow {
  margin-top: 3px;
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  --arrow-rotate: 0deg;
  --arrow-translate: 0px;
  transform: rotate(var(--arrow-rotate)) translateX(var(--arrow-translate));
  transition: transform 500ms ease;
}

.info-rail:hover .info-rail__arrow,
.info-rail:focus-visible .info-rail__arrow {
  --arrow-translate: -3px;
}

.info-rail--open .info-rail__arrow {
  --arrow-rotate: 180deg;
}

.info-rail--open:hover .info-rail__arrow,
.info-rail--open:focus-visible .info-rail__arrow {
  --arrow-translate: -3px;
}

.info-rail:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: -4px;
}

@media (max-width: 768px) {
  .info-rail__content {
    top: 6vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-rail__arrow {
    transition-duration: 1ms;
  }
}

.info-rail__arrows_container {
  padding-top: 5.2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6vh;
}

.info-rail__accent-arrow {
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  opacity: 0.0;
  transition: all 240ms ease var(--arrow-delay-out, 0ms);
}

.info-rail:hover .info-rail__accent-arrow,
.info-rail:focus-visible .info-rail__accent-arrow {
  opacity: 0.35;
  transition: all 240ms ease var(--arrow-delay, 0ms);
}

.info-rail__accent-arrow:nth-child(1) { --arrow-delay: 0ms; }
.info-rail__accent-arrow:nth-child(2) { --arrow-delay: 20ms; }
.info-rail__accent-arrow:nth-child(3) { --arrow-delay: 40ms; }
.info-rail__accent-arrow:nth-child(4) { --arrow-delay: 60ms; }
.info-rail__accent-arrow:nth-child(5) { --arrow-delay: 80ms; }
.info-rail__accent-arrow:nth-child(6) { --arrow-delay: 100ms; }
.info-rail__accent-arrow:nth-child(7) { --arrow-delay: 120ms; }
.info-rail__accent-arrow:nth-child(8) { --arrow-delay: 140ms; }
.info-rail__accent-arrow:nth-child(9) { --arrow-delay: 160ms; }
.info-rail__accent-arrow:nth-child(10) { --arrow-delay: 180ms; }

.info-rail__accent-arrow:nth-child(10) { --arrow-delay-out: 0ms; }
.info-rail__accent-arrow:nth-child(9) { --arrow-delay-out: 20ms; }
.info-rail__accent-arrow:nth-child(8) { --arrow-delay-out: 40ms; }
.info-rail__accent-arrow:nth-child(7) { --arrow-delay-out: 60ms; }
.info-rail__accent-arrow:nth-child(6) { --arrow-delay-out: 80ms; }
.info-rail__accent-arrow:nth-child(5) { --arrow-delay-out: 100ms; }
.info-rail__accent-arrow:nth-child(4) { --arrow-delay-out: 120ms; }
.info-rail__accent-arrow:nth-child(3) { --arrow-delay-out: 140ms; }
.info-rail__accent-arrow:nth-child(2) { --arrow-delay-out: 160ms; }
.info-rail__accent-arrow:nth-child(1) { --arrow-delay-out: 180ms; }

</style>
