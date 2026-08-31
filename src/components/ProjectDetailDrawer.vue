<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import type { ProjectDetailData } from '../types/projects'
import { generateClipPath } from '../utils/clip_path_gen'
import { rand } from '../utils/glitch'

defineProps<{ data: ProjectDetailData }>()
const emit = defineEmits<{ back: [] }>()

const glyphMap = import.meta.glob('../assets/svg/glyph/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const getGlyph = (name: string): string | null => {
  const key = Object.keys(glyphMap).find((path) => path.endsWith(`/${name}.svg`))
  return key ? (glyphMap[key] ?? null) : null
}

const redactedEl = ref<HTMLElement | null>(null)
let redactedTimer: ReturnType<typeof setTimeout> | null = null

const applyRedactedFlash = () => {
  const element = redactedEl.value
  if (!element) return

  const redOffset = rand(3, 8)
  const cyanOffset = rand(3, 8)
  element.style.clipPath = generateClipPath(8)
  element.style.textShadow = [
    `-${redOffset}px 0 0 rgba(255, 20, 80, 0.9)`,
    `${cyanOffset}px 0 0 rgba(0, 220, 255, 0.9)`,
  ].join(', ')
}

const clearRedactedFlash = () => {
  const element = redactedEl.value
  if (!element) return
  element.style.clipPath = ''
  element.style.textShadow = ''
}

const onRedactedEnter = () => {
  if (redactedTimer) clearTimeout(redactedTimer)

  let cursor = 0
  const count = rand(4, 7)
  for (let index = 0; index < count; index += 1) {
    const duration = rand(30, 80)
    const gap = rand(20, 55)
    setTimeout(applyRedactedFlash, cursor)
    setTimeout(clearRedactedFlash, cursor + duration)
    cursor += duration + gap
  }
  redactedTimer = setTimeout(clearRedactedFlash, cursor + 50)
}

const onRedactedLeave = () => {
  if (redactedTimer) clearTimeout(redactedTimer)
  clearRedactedFlash()
}

onUnmounted(() => {
  if (redactedTimer) clearTimeout(redactedTimer)
})
</script>

<template>
  <article class="project-detail drawer-panel scrollbar-thin" :aria-label="data.title">
    <button
      class="project-detail__back"
      type="button"
      data-detail-back
      @click="emit('back')"
    >
      « BACK
    </button>

    <header class="project-detail__meta">
      <span class="eyebrow">[ {{ data.ref ? `REF - ${data.ref}` : data.category ?? 'PROJECT' }} ]</span>
      <span v-if="data.dates" class="eyebrow">[ {{ data.dates }} ]</span>
    </header>

    <div class="project-detail__title-row">
      <h2 class="project-detail__title">{{ data.title }}</h2>
      <div v-if="data.glyphs?.length" class="project-detail__glyphs" aria-hidden="true">
        <span
          v-for="glyph in data.glyphs"
          :key="glyph"
          class="project-detail__glyph"
          v-html="getGlyph(glyph)"
        />
      </div>
    </div>

    <div class="project-detail__rule" aria-hidden="true" />

    <section class="project-detail__section">
      <p class="project-detail__section-label eyebrow">OVERVIEW »</p>
      <p class="project-detail__body">{{ data.overview }}</p>
    </section>

    <section v-if="data.stack?.length" class="project-detail__section">
      <p class="project-detail__section-label eyebrow">STACK »</p>
      <p class="project-detail__stack">
        <template v-for="(technology, index) in data.stack ?? []" :key="technology">
          <span>{{ technology }}</span>
          <span v-if="index < (data.stack?.length ?? 0) - 1" class="project-detail__stack-separator" aria-hidden="true"> // </span>
        </template>
      </p>
    </section>

    <section v-if="data.status" class="project-detail__section project-detail__section--inline">
      <p class="project-detail__section-label eyebrow">STATUS »</p>
      <span class="project-detail__status eyebrow">[ {{ data.status }} ]</span>
    </section>

    <footer v-if="data.github || data.isPrivate" class="project-detail__footer">
      <p class="project-detail__section-label eyebrow">LINK »</p>

      <span
        v-if="data.isPrivate"
        class="project-detail__redacted"
        @mouseenter="onRedactedEnter"
        @mouseleave="onRedactedLeave"
      >
        <span class="project-detail__redacted-label eyebrow" aria-hidden="true">[ REDACTED ]</span>
        <span
          ref="redactedEl"
          class="project-detail__redacted-blocks eyebrow"
          aria-label="Source redacted"
        >█████████</span>
      </span>

      <a
        v-else
        :href="data.github"
        target="_blank"
        rel="noopener noreferrer"
        class="project-detail__link eyebrow"
      >[ GITHUB ↗ ]</a>
    </footer>
  </article>
</template>

<style scoped>
.project-detail {
  min-width: 0;
  max-width: 100%;
  color: var(--c-text-body);
  font-family: inherit;
}

.project-detail__back {
  position: absolute;
  top: 2vh;
  left: 2vw;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  color: var(--c-white);
  background: none;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.project-detail__back:hover,
.project-detail__back:focus-visible {
  color: var(--c-accent);
}

.project-detail__back:focus-visible,
.project-detail__link:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 4px;
}

.project-detail__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  color: var(--c-text-muted);
}

.project-detail__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.project-detail__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--c-white);
  font-size: 22px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.project-detail__glyphs {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.project-detail__glyph {
  width: 28px;
  height: 28px;
  display: flex;
  opacity: 0.55;
  filter: brightness(0) invert(1);
}

.project-detail__glyph :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.project-detail__rule {
  height: 1px;
  margin-bottom: 34px;
  background: var(--c-rule);
}

.project-detail__section {
  margin-bottom: 30px;
}

.project-detail__section--inline {
  display: flex;
  align-items: center;
  gap: 24px;
}

.project-detail__section-label {
  margin: 0 0 9px;
  color: var(--c-text-dim);
}

.project-detail__section--inline .project-detail__section-label {
  margin-bottom: 0;
}

.project-detail__body {
  margin: 0;
  color: var(--c-text-body);
  font-size: 13px;
  font-weight: 300;
  line-height: 1.7;
  letter-spacing: 0.03em;
  overflow-wrap: anywhere;
}

.project-detail__stack {
  margin: 0;
  color: var(--c-text-body);
  font-size: 11px;
  font-weight: 300;
  line-height: 1.6;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.project-detail__stack-separator {
  color: var(--c-text-ghost);
}

.project-detail__status {
  padding: 4px 10px;
  color: var(--c-accent);
  border: 1px solid var(--c-accent-border);
}

.project-detail__footer {
  margin-top: 44px;
  padding-top: 20px;
  padding-bottom: 48px;
  border-top: 1px solid var(--c-ghost);
}

.project-detail__link {
  display: inline-block;
  padding: 8px 0;
  color: var(--c-text-mid);
  text-decoration: none;
  transition: color 180ms ease;
}

.project-detail__link:hover,
.project-detail__link:focus-visible {
  color: var(--c-white);
}

.project-detail__redacted {
  position: relative;
  display: inline-block;
  cursor: not-allowed;
  user-select: none;
}

.project-detail__redacted-label {
  position: absolute;
  inset: 0;
  padding: 8px 0;
  color: var(--c-text-dim);
  pointer-events: none;
  white-space: nowrap;
}

.project-detail__redacted-blocks {
  position: relative;
  z-index: 1;
  display: block;
  padding: 8px 0;
  color: var(--c-text-dim);
  background: var(--c-surface);
}

.eyebrow {
  display: inline-block;
  margin: 0;
  font-size: 10px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .project-detail__back {
    top: 4vw;
    left: 4vw;
  }

  .project-detail__meta,
  .project-detail__title-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .project-detail__glyphs {
    justify-content: flex-start;
  }
}
</style>
