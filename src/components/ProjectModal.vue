<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { generateClipPath } from '@/utils/clip_path_gen'
import { rand } from '@/utils/glitch'

const glyphMap = import.meta.glob('../assets/svg/glyph/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const getGlyph = (name: string): string | null => {
  const key = Object.keys(glyphMap).find(k => k.endsWith(`/${name}.svg`))
  return key ? (glyphMap[key] ?? null) : null
}

export interface ProjectModalData {
  /** Short reference code, e.g. "001" */
  ref?: string
  /** Project title in all-caps, e.g. "LLM APPLICATION TITLE" */
  title: string
  /** Date range label, e.g. "2023 - CURRENT" */
  dates?: string
  /** One or two sentence overview — precise, no fluff. */
  overview: string
  /** Technology stack items, rendered as Tech  //  Tech  //  Tech */
  stack: string[]
  /** Status label, e.g. "PRODUCTION", "IN DEVELOPMENT", "ARCHIVED" */
  status?: string
  /** Optional GitHub URL */
  github?: string
  /** If true, renders [ REDACTED ] in place of a source link */
  isPrivate?: boolean
  /** Glyph keys to display alongside the title, e.g. ['sunburst', 'cs'] */
  glyphs?: string[]
}

const props = defineProps<{ data: ProjectModalData }>()
const emit = defineEmits<{ close: [] }>()

const closing = ref(false)
const CLOSE_DURATION = 220

const close = () => {
  if (closing.value) return
  closing.value = true
  setTimeout(() => emit('close'), CLOSE_DURATION)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

// ── REDACTED GLITCH ──────────────────────────────────────────
const redactedEl = ref<HTMLElement | null>(null)
let redactedTimer: ReturnType<typeof setTimeout> | null = null

const applyRedactedFlash = () => {
  const el = redactedEl.value
  if (!el) return
  const caR = rand(3, 8)
  const caC = rand(3, 8)
  el.style.clipPath = generateClipPath(8)
  el.style.textShadow = [
    `-${caR}px 0 0 rgba(255, 20, 80, 0.9)`,
    `${caC}px 0 0 rgba(0, 220, 255, 0.9)`,
  ].join(', ')
}

const clearRedactedFlash = () => {
  const el = redactedEl.value
  if (!el) return
  el.style.clipPath = ''
  el.style.textShadow = ''
}

const onRedactedEnter = () => {
  if (redactedTimer) clearTimeout(redactedTimer)
  const el = redactedEl.value
  if (!el) return
  let cursor = 0
  const count = rand(4, 7)
  for (let i = 0; i < count; i++) {
    const dur = rand(30, 80)
    const gap = rand(20, 55)
    setTimeout(applyRedactedFlash, cursor)
    setTimeout(clearRedactedFlash, cursor + dur)
    cursor += dur + gap
  }
  redactedTimer = setTimeout(clearRedactedFlash, cursor + 50)
}

const onRedactedLeave = () => {
  if (redactedTimer) clearTimeout(redactedTimer)
  clearRedactedFlash()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  if (redactedTimer) clearTimeout(redactedTimer)
})
</script>

<template>
  <Teleport to="body">
    <svg width="0" height="0" style="position:absolute;pointer-events:none" aria-hidden="true">
      <defs>
        <filter id="h-blur">
          <feGaussianBlur stdDeviation="8 0" />
        </filter>
      </defs>
    </svg>
    <div class="modal-backdrop" :class="{ 'is-closing': closing }" @click.self="close" role="dialog" aria-modal="true" :aria-label="data.title">
      <div class="modal">
        <div class="modal__tex" aria-hidden="true" />
        <!-- ── HEADER ─────────────────────────────────────────── -->
        <header class="modal__header">
          <span class="modal__ref eyebrow" v-if="data.ref">[ REF - {{ data.ref }} ]</span>
          <span class="modal__ref eyebrow" v-else>[ PROJECT ]</span>
          <div class="modal__header-right">
            <span v-if="data.dates" class="modal__dates eyebrow">[ {{ data.dates }} ]</span>
            <button class="modal__close eyebrow" @click="close" aria-label="Close">[ X ]</button>
          </div>
        </header>

        <!-- ── TITLE ──────────────────────────────────────────── -->
        <div class="modal__title-row">
          <h2 class="modal__title">{{ data.title }}</h2>
          <div v-if="data.glyphs?.length" class="modal__glyphs">
            <span
              v-for="g in data.glyphs"
              :key="g"
              class="modal__glyph"
              v-html="getGlyph(g)"
            />
          </div>
        </div>
        <div class="modal__rule" aria-hidden="true" />

        <!-- ── OVERVIEW ───────────────────────────────────────── -->
        <section class="modal__section">
          <p class="modal__section-label eyebrow">OVERVIEW //</p>
          <p class="modal__body">{{ data.overview }}</p>
        </section>

        <!-- ── STACK ──────────────────────────────────────────── -->
        <section class="modal__section">
          <p class="modal__section-label eyebrow">STACK //</p>
          <p class="modal__stack">
            <template v-for="(tech, i) in data.stack" :key="tech">
              <span class="modal__stack-item">{{ tech }}</span>
              <span v-if="i < data.stack.length - 1" class="modal__stack-sep" aria-hidden="true"> // </span>
            </template>
          </p>
        </section>

        <!-- ── STATUS ─────────────────────────────────────────── -->
        <section v-if="data.status" class="modal__section modal__section--inline">
          <p class="modal__section-label eyebrow">STATUS //</p>
          <span class="modal__status-tag eyebrow">[ {{ data.status }} ]</span>
        </section>

        <!-- ── FOOTER LINK ────────────────────────────────────── -->
        <footer v-if="data.github || data.isPrivate" class="modal__footer">
        <span class="modal__section-label eyebrow"> LINK //</span>
          <span
            v-if="data.isPrivate"
            class="modal__redacted-wrap"
            @mouseenter="onRedactedEnter"
            @mouseleave="onRedactedLeave"
          >
            <span class="modal__redacted-label eyebrow" aria-hidden="true">[ REDACTED ]</span>
            <span
              ref="redactedEl"
              class="modal__redacted-blocks eyebrow"
              aria-label="Source redacted"
            >▓▓▓▓▓▓▓▓▓</span>
          </span>
          <a
            v-else
            :href="data.github"
            target="_blank"
            rel="noopener noreferrer"
            class="modal__github eyebrow"
          >[ GITHUB ↗ ]</a>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── BACKDROP ─────────────────────────────────────────────────────────── */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: var(--c-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: url('#h-blur');
  animation: backdrop-in 400ms ease both;
}
/* ── MODAL CARD ───────────────────────────────────────────────────────── */

.modal {
  position: relative;
  background: var(--c-surface);
  width: 100%;
  max-width: 600px;
  padding: 36px 40px 40px;
  /* Chamfered top-right corner */
  animation: modal-in 520ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.modal__tex {
  position: absolute;
  inset: 0;
  background: url('@/assets/textures/bg_tex.png') repeat;
  opacity: 0.01;
  pointer-events: none;
  z-index: 0;
}

.modal__neutron {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 5vh;
  height: 5vh;
  opacity: 0.55;
  pointer-events: none;
  display: flex;
  z-index: 0;
  filter: brightness(0) invert(1);
}

.modal__neutron :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes backdrop-out {
  to { opacity: 0; }
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes modal-out {
  to { opacity: 0; transform: translateY(8px); }
}

.is-closing {
  animation: backdrop-out 220ms ease forwards;
}

.is-closing .modal {
  animation: modal-out 180ms ease forwards;
}

/* ── HEADER ROW ───────────────────────────────────────────────────────── */

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.modal__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal__ref {
  color: var(--c-text-muted);
}

.modal__dates {
  color: var(--c-text-muted);
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-text-muted);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0;
  line-height: 1;
  transition: color 180ms ease;
}

.modal__close:hover {
  color: var(--c-accent);
}

/* ── TITLE ────────────────────────────────────────────────────────────── */

.modal__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin: 0 0 20px;
}

.modal__title {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--c-white);
  margin: 0;
  line-height: 1.1;
  flex: 1;
}

/* ── GLYPHS ──────────────────────────────────────────────────── */

.modal__glyphs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-end;
  flex-shrink: 0;
  padding-top: 2px;
}

.modal__glyph {
  display: flex;
  width: 28px;
  height: 28px;
  opacity: 0.55;
  filter: brightness(0) invert(1);
}

.modal__glyph :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── RULE ─────────────────────────────────────────────────────────────── */

.modal__rule {
  height: 0.5px;
  background: var(--c-rule);
  margin-bottom: 28px;
}

/* ── SECTIONS ─────────────────────────────────────────────────────────── */

.modal__section {
  margin-bottom: 24px;
}

.modal__section--inline {
  display: flex;
  align-items: center;
  gap: 24px;
}

.modal__section-label {
  color: var(--c-text-dim);
  margin-bottom: 8px;
}

.modal__section--inline .modal__section-label {
  margin-bottom: 0;
}

.modal__body {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.7;
  color: var(--c-text-body);
}

/* ── STACK ────────────────────────────────────────────────────────────── */

.modal__stack {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-text-body);
  line-height: 1.6;
}

.modal__stack-sep {
  color: var(--c-text-ghost);
}

/* ── STATUS TAG ───────────────────────────────────────────────────────── */

.modal__status-tag {
  color: var(--c-accent);
  border: 0.5px solid var(--c-accent-border);
  padding: 4px 10px;
  letter-spacing: 0.2em;
}

/* ── FOOTER / GITHUB LINK ─────────────────────────────────────────────── */

.modal__footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 0.5px solid var(--c-ghost);
}

.modal__github {
  display: inline-block;
  color: var(--c-text-mid);
  text-decoration: none;
  padding: 8px 14px;
  letter-spacing: 0.2em;
  transition: color 180ms ease, border-color 180ms ease;
}

.modal__github:hover {
  color: var(--c-accent);
  border-color: var(--c-accent-border);
}

.modal__redacted-wrap {
  position: relative;
  display: inline-block;
  cursor: not-allowed;
  user-select: none;
}

/* Layer 1 (behind): real text — never touched by glitch JS */
.modal__redacted-label {
  position: absolute;
  inset: 0;
  padding: 8px 14px;
  color: var(--c-text-dim);
  pointer-events: none;
  white-space: nowrap;
}

/* Layer 2 (front): block chars — receives clip-path + filter */
.modal__redacted-blocks {
  display: block;
  padding: 8px 14px;
  color: var(--c-text-dim);
  background: var(--c-surface);
  position: relative;
  z-index: 1;
}



/* ── EYEBROW UTILITY ──────────────────────────────────────────────────── */

.eyebrow {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: inline-block;
  margin: 0;
  line-height: 1;
}
</style>
