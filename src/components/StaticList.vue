<script setup lang="ts">
import type { ExpandGroup, ExpandItem } from './ExpandList.vue'
import type { ProjectDetailData } from '../types/projects'

const normalize = (item: ExpandItem) => (
  typeof item === 'string'
    ? { label: item, meta: '', detail: undefined, href: undefined }
    : item
)

const props = defineProps<{ groups: ExpandGroup[] }>()
const emit = defineEmits<{
  'detail-select': [detail: ProjectDetailData, trigger: HTMLElement]
}>()

const selectDetail = (item: ExpandItem, event: MouseEvent) => {
  const normalized = normalize(item)
  if (!normalized.detail) return
  emit('detail-select', normalized.detail, event.currentTarget as HTMLElement)
}
</script>

<template>
  <ul class="drawer__list static-list">
    <li v-for="group in props.groups" :key="group.label" class="static-list__group">
      <div class="static-list__header">
        <span class="static-list__label">{{ group.label }}</span>
        <span v-if="group.meta" class="static-list__meta">{{ group.meta }}</span>
      </div>

      <ul class="static-list__items">
        <li v-for="item in group.items" :key="normalize(item).label">
          <a
            v-if="normalize(item).href"
            :href="normalize(item).href"
            target="_blank"
            rel="noopener noreferrer"
            class="static-list__item static-list__item--interactive"
          >
            <span>{{ normalize(item).label }}</span>
            <span class="static-list__item-meta" aria-hidden="true">[ ↗ ]</span>
          </a>

          <button
            v-else-if="normalize(item).detail"
            class="static-list__item static-list__item--interactive"
            type="button"
            @click="selectDetail(item, $event)"
          >
            <span>{{ normalize(item).label }}</span>
            <span class="static-list__item-meta static-list__item-meta--trigger" aria-hidden="true">
              [<span class="static-list__plus"> + </span><span class="static-list__view"> // VIEW</span>]
            </span>
          </button>

          <span v-else class="static-list__item">
            <span>{{ normalize(item).label }}</span>
            <span v-if="normalize(item).meta" class="static-list__item-meta">{{ normalize(item).meta }}</span>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.static-list__group {
  padding: 0 0 14px;
  border-bottom: 1px solid var(--drawer-list-rule, var(--c-ghost));
}

.static-list__group + .static-list__group {
  margin-top: 20px;
}

.static-list__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 0 8px;
  color: var(--drawer-list-text, var(--c-text-mid));
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.static-list__label {
  min-width: 0;
}

.static-list__meta,
.static-list__item-meta {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0.6;
}

.static-list__items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.static-list__items li {
  position: relative;
  padding-left: 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
}

.static-list__items li::before {
  position: absolute;
  top: 45%;
  left: 0;
  width: 1%;
  height: 1px;
  background: currentColor;
  content: '';
  opacity: 0.5;
}

.static-list__items li:last-child {
  border-bottom: 0;
}

.static-list__item {
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

.static-list__item--interactive {
  cursor: pointer;
}

.static-list__item--interactive:hover,
.static-list__item--interactive:focus-visible {
  opacity: 1;
}

.static-list__item--interactive:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 3px;
}

.static-list__item-meta--trigger {
  display: inline-flex;
  align-items: center;
  color: var(--c-accent);
  transition: opacity 180ms ease;
}

.static-list__plus,
.static-list__view {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease;
}

.static-list__plus {
  max-width: 2em;
}

.static-list__view {
  max-width: 0;
  opacity: 0;
}

.static-list__item--interactive:hover .static-list__plus,
.static-list__item--interactive:focus-visible .static-list__plus {
  max-width: 0;
  opacity: 0;
}

.static-list__item--interactive:hover .static-list__view,
.static-list__item--interactive:focus-visible .static-list__view {
  max-width: 5em;
  opacity: 1;
}

@media (max-width: 768px) {
  .static-list__header {
    flex-wrap: wrap;
  }

  .static-list__label {
    flex: 1;
  }

  .static-list__meta {
    flex-basis: 100%;
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .static-list__plus,
  .static-list__view {
    transition-duration: 1ms;
  }
}
</style>
