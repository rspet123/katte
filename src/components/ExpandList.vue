<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectModalData } from './ProjectModal.vue'

export type ExpandItem = string | { label: string; meta?: string; modal?: ProjectModalData; href?: string }

export interface ExpandGroup {
  label: string
  meta?: string
  items: ExpandItem[]
}

const normalize = (item: ExpandItem) =>
  typeof item === 'string' ? { label: item, meta: '', modal: undefined } : item

const props = defineProps<{ groups: ExpandGroup[] }>()
const emit = defineEmits<{ 'item-click': [modal: ProjectModalData] }>()

const openIndex = ref<number | null>(null)
const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}

const handleItemClick = (item: ExpandItem, e: MouseEvent) => {
  const n = normalize(item)
  if (n.modal) {
    e.stopPropagation()
    emit('item-click', n.modal)
  }
}
</script>

<template>
  <ul class="drawer__list">
    <li
      v-for="(group, i) in props.groups"
      :key="group.label"
      class="skill-row"
      :class="{ 'skill-row--open': openIndex === i }"
      @click="toggle(i)"
    >
      <div class="skill-row__header">
        <span class="skill-row__label">{{ group.label }}</span>
        <span v-if="group.meta" class="skill-row__meta">{{ group.meta }}</span>
        <span class="skill-row__indicator" aria-hidden="true" />
      </div>
      <div class="skill-row__expand">
        <ul class="skill-row__inner skill-sublist">
          <li
            v-for="item in group.items"
            :key="normalize(item).label"
            :class="{ 'skill-sublist-item--clickable': normalize(item).modal || normalize(item).href }"
            @click="handleItemClick(item, $event)"
          >
            <a
              v-if="normalize(item).href"
              :href="normalize(item).href"
              target="_blank"
              rel="noopener noreferrer"
              class="skill-item__link"
              @click.stop
            >{{ normalize(item).label }}</a>
            <span v-else class="skill-item__label">{{ normalize(item).label }}</span>
            <span v-if="normalize(item).modal" class="skill-item__meta skill-item__meta--trigger"
            >[<span class="trigger__plus"> + </span><span class="trigger__more"> // MORE</span>]</span>
            <span v-else-if="normalize(item).meta" class="skill-item__meta">{{ normalize(item).meta }}</span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style scoped>
/* ── ROW ──────────────────────────────────────────────────────────────── */

.skill-row {
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.skill-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
}

/* ── +/− INDICATOR ────────────────────────────────────────────────────── */

.skill-row__indicator {
  position: relative;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  opacity: 0.35;
  transition: all 200ms ease;
}

.skill-row__indicator::before,
.skill-row__indicator::after {
  content: '';
  position: absolute;
  background: currentColor;
  border-radius: 1px;
  transition: transform 280ms ease, opacity 280ms ease;
}

/* horizontal bar */
.skill-row__indicator::before {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

/* vertical bar */
.skill-row__indicator::after {
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.skill-row--open .skill-row__indicator {
  opacity: 0.7;
}

/* collapse vertical bar to form − */
.skill-row--open .skill-row__indicator::after {
  transform: translateX(-50%) scaleY(0) rotate(180deg);
  opacity: 0;
}

/* ── EXPAND (CSS grid trick) ──────────────────────────────────────────── */

.skill-row__expand {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease;
}

.skill-row--open .skill-row__expand {
  grid-template-rows: 1fr;
}

.skill-row__inner {
  overflow: hidden;
}

/* ── SUB-LIST ─────────────────────────────────────────────────────────── */

.skill-sublist {
  list-style: none;
  margin: 0;
  padding: 0 0 6px 0;
}

.skill-sublist li {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: currentColor;
  opacity: 0.9;
  padding: 7px 0 7px 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  position: relative;
  transition: opacity 200ms ease;
  cursor: default;
}

.skill-sublist li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}

.skill-sublist li:last-child {
  border-bottom: none;
}

.skill-row:hover .skill-sublist li {
  opacity: 1;
}

.skill-row__label {
  white-space: pre;
}

.skill-row__meta {
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.6;
  white-space: nowrap;
  margin-left: auto;
  padding-right: 12px;
}

.skill-item__label {
  min-width: 0;
}

.skill-item__meta {
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.6;
  white-space: nowrap;
}

/* ── CLICKABLE ITEMS ──────────────────────────────────────────────────── */

.skill-sublist-item--clickable {
  cursor: pointer;
}

.skill-sublist-item--clickable:hover {
  opacity: 1;
}

.skill-item__meta--trigger {
  color: var(--c-accent);
  opacity: 0.5;
  transition: opacity 180ms ease;
  display: inline-flex;
  align-items: center;
}

.trigger__plus,
.trigger__more {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 1s cubic-bezier(0.075, 0.82, 0.165, 1),
              opacity    200ms ease;
}

.trigger__plus {
  max-width: 2em;
  opacity: 1;
}

.trigger__more {
  max-width: 0;
  opacity: 0;
}

.skill-sublist-item--clickable:hover .skill-item__meta--trigger {
  opacity: 1;
}

.skill-sublist-item--clickable:hover .trigger__plus {
  max-width: 0;
  opacity: 0;
}

.skill-sublist-item--clickable:hover .trigger__more {
  max-width: 5em;
  opacity: 1;
}

/* ── LINK ITEMS ───────────────────────────────────────────────────────── */

.skill-item__link {
  color: inherit;
  text-decoration: none;
  letter-spacing: inherit;
  transition: opacity 180ms ease;
}

.skill-item__link:hover {
  opacity: 0.7;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
