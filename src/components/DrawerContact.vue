<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import detail3Raw from '../assets/svg/micrographics/detail/detail_3.svg?raw'

const groups: ExpandGroup[] = [
  { label: 'LinkedIn', items: ['linkedin.com/in/...'] },
  { label: 'GitHub',   items: ['github.com/...'] },
  { label: 'Resume',   items: ['Download PDF'] },
]
</script>

<template>
  <div class="drawer__title-row">
    <div>
      <p class="drawer__eyebrow">links //</p>
      <h3 class="drawer__title">connect.</h3>
    </div>
    <span class="drawer__detail" aria-hidden="true">
      <span class="drawer__detail-inner" v-html="detail3Raw" />
    </span>
  </div>
  <ExpandList :groups="groups" />
</template>

<style scoped>
.drawer__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.drawer__detail {
  display: block;
  flex-shrink: 0;
  width: 80px;
  opacity: 1;
  margin-top: 20px;
}

.drawer__detail-inner {
  display: block;
  filter: brightness(0) invert(1);
  transform: scale(4) translate(-40%, 5%);
}

.drawer__detail-inner :deep(svg) {
  width: 100%;
  height: auto;
}
</style>
