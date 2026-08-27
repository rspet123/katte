<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectDetailData } from '../types/projects'

export type ExpandItem = string | {
  label: string
  meta?: string
  detail?: ProjectDetailData
  href?: string
}

export interface ExpandGroup {
  label: string
  meta?: string
  items: ExpandItem[]
}

const normalize = (item: ExpandItem) =>
  typeof item === 'string'
    ? { label: item, meta: '', detail: undefined, href: undefined }
    : item

const props = defineProps<{ groups: ExpandGroup[] }>()
const emit = defineEmits<{
  'detail-select': [detail: ProjectDetailData, trigger: HTMLElement]
}>()

const openIndex = ref<number | null>(null)
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const selectDetail = (item: ExpandItem, event: MouseEvent) => {
  const normalized = normalize(item)
  if (!normalized.detail) return
  emit('detail-select', normalized.detail, event.currentTarget as HTMLElement)
}
</script>

<template>
  <ul class="drawer__list">
    <li
      v-for="(group, index) in props.groups"
      :key="group.label"
      class="skill-row"
      :class="{ 'skill-row--open': openIndex === index }"
    >
      <button
        class="skill-row__header"
        type="button"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
      >
        <span class="skill-row__label">{{ group.label }}</span>
        <span v-if="group.meta" class="skill-row__meta">{{ group.meta }}</span>
        <span class="skill-row__indicator" aria-hidden="true" />
      </button>

      <div class="skill-row__expand">
        <ul class="skill-row__inner skill-sublist">
          <li v-for="item in group.items" :key="normalize(item).label">
            <a
              v-if="normalize(item).href"
              :href="normalize(item).href"
              target="_blank"
              rel="noopener noreferrer"
              class="skill-item skill-item--interactive"
            >
              <span class="skill-item__label">{{ normalize(item).label }}</span>
              <span class="skill-item__meta" aria-hidden="true">[ ↗ ]</span>
            </a>

            <button
              v-else-if="normalize(item).detail"
              class="skill-item skill-item--interactive"
              type="button"
              @click="selectDetail(item, $event)"
            >
              <span class="skill-item__label">{{ normalize(item).label }}</span>
              <span class="skill-item__meta skill-item__meta--trigger" aria-hidden="true">
                [<span class="trigger__plus"> + </span><span class="trigger__more"> // VIEW</span>]
              </span>
            </button>

            <span v-else class="skill-item">
              <span class="skill-item__label">{{ normalize(item).label }}</span>
              <span v-if="normalize(item).meta" class="skill-item__meta">{{ normalize(item).meta }}</span>
            </span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.skill-row {
  display: flex;
  flex-direction: column;
  padding: 0;
  border-bottom: 1px solid var(--drawer-list-rule, var(--c-ghost));
}

.skill-row:last-child {
  border-bottom: 0;
}

.skill-row__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  color: var(--drawer-list-text, var(--c-text-mid));
  background: none;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-align: left;
  text-transform: uppercase;
  transition: color 200ms ease;
}

.skill-row__header:hover,
.skill-row__header:focus-visible {
  color: var(--drawer-list-hover, var(--c-text-strong));
}

.skill-row__header:focus-visible,
.skill-item--interactive:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 3px;
}

.skill-row__indicator {
  position: relative;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  opacity: 0.35;
  transition: opacity 200ms ease;
}

.skill-row__indicator::before,
.skill-row__indicator::after {
  content: '';
  position: absolute;
  background: currentColor;
  transition: transform 280ms ease, opacity 280ms ease;
}

.skill-row__indicator::before {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

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

.skill-row--open .skill-row__indicator::after {
  transform: translateX(-50%) scaleY(0);
  opacity: 0;
}

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

.skill-sublist {
  margin: 0;
  padding: 0 0 6px;
  list-style: none;
}

.skill-sublist li {
  position: relative;
  padding-left: 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
}

.skill-sublist li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 45%;
  width: 1%;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}

.skill-sublist li:last-child {
  border-bottom: 0;
}

.skill-item {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 7px 0;
  color: currentColor;
  background: none;
  border: 0;
  border-radius: 0;
  font: inherit;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.14em;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  opacity: 0.9;
  transition: opacity 180ms ease;
}

.skill-item--interactive {
  cursor: pointer;
}

.skill-item--interactive:hover,
.skill-item--interactive:focus-visible {
  opacity: 1;
}

.skill-row__label {
  white-space: pre;
}

.skill-row__meta,
.skill-item__meta {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0.6;
}

.skill-row__meta {
  padding-right: 12px;
}

.skill-item__label {
  min-width: 0;
}

.skill-item__meta--trigger {
  display: inline-flex;
  align-items: center;
  color: var(--c-accent);
  opacity: 0.6;
  transition: opacity 180ms ease;
}

.trigger__plus,
.trigger__more {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease;
}

.trigger__plus {
  max-width: 2em;
  opacity: 1;
}

.trigger__more {
  max-width: 0;
  opacity: 0;
}

.skill-item--interactive:hover .skill-item__meta--trigger,
.skill-item--interactive:focus-visible .skill-item__meta--trigger {
  opacity: 1;
}

.skill-item--interactive:hover .trigger__plus,
.skill-item--interactive:focus-visible .trigger__plus {
  max-width: 0;
  opacity: 0;
}

.skill-item--interactive:hover .trigger__more,
.skill-item--interactive:focus-visible .trigger__more {
  max-width: 5em;
  opacity: 1;
}

@media (max-width: 768px) {
  .skill-row__header {
    flex-wrap: wrap;
  }

  .skill-row__label {
    flex: 1;
    order: 1;
  }

  .skill-row__indicator {
    order: 2;
  }

  .skill-row__meta {
    order: 3;
    flex-basis: 100%;
    margin-left: 0;
    padding-right: 0;
    padding-bottom: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-row__indicator::before,
  .skill-row__indicator::after,
  .skill-row__expand,
  .trigger__plus,
  .trigger__more {
    transition-duration: 1ms;
  }
}
</style>
