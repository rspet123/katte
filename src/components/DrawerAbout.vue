<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import detail4Raw from '../assets/svg/micrographics/detail/detail_4.svg?raw'

const groups: ExpandGroup[] = [
  { label: 'Languages', items: [
    { label: 'Go',         meta: '[ 4 years ]' },
    { label: 'Python',     meta: '[ 6 years ]' },
    { label: 'JavaScript // Vue.js', meta: '[ 4 years ]' },
    { label: 'MySQL // Postgres',        meta: '[ 5 years ]' },
  ]},
  { label: 'Strategies', items: [
        { label: 'Agentic Development', meta: '[ 2 years ]' },
        { label: 'Prompt Engineering', meta: '[ 2 years ]' },
  ]},
  { label: 'Tools',                   items: [
     { label: 'Docker',     meta: '[ 4 years ]' },
    { label: 'Git',        meta: '[ 6 years ]' },
    { label: 'MySQL',      meta: '[ 5 years ]' },
    { label: 'Postgres',      meta: '[ 5 years ]' },
    { label: 'MongoDB',  meta: '[ 5 years ]' },  
    { label: 'Redis',       meta: '[ 4 years ]' },
    { label: 'OpenSearch',  meta: '[ 2 years ]' },    
    { label: 'Weaviate',  meta: '[ 2 years ]' },  
  ] },
  { label: 'Platforms',               items: [
    { label: 'Linux/WSL',       meta: '[ 5 years ]' },
    { label: 'AWS',         meta: '[ 4 years ]' },
  ] },
  { label: 'Artificial Intelligence', items: [
    { label: 'LLMs',        meta: '[ Production   ]' },
    { label: 'Agents',      meta: '[ Production   ]' },
    { label: 'Multi-Agent Workflows', meta: '[ Production   ]' },
    { label: 'RAG',         meta: '[ Production   ]' },
    { label: 'Embeddings',  meta: '[ Production   ]' }
  ] },
]

const education: ExpandGroup[] = [
{ label: 'University of North Carolina - Charlotte', meta: '[ 2018 - 2022 ]', items: []}]
</script>

<template>
  <div class="drawer__title-row">
    <div>
      <p class="drawer__eyebrow">capabilities //</p>
      <h3 class="drawer__title">backend & ai</h3>
      <h3 class="drawer__title">systems engineer.</h3>
    </div>
    <span class="drawer__detail" aria-hidden="true">
      <span class="drawer__detail-inner" v-html="detail4Raw" />
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
  transform: scale(5) translate(-40%, 60%);
}

.drawer__detail-inner :deep(svg) {
  width: 100%;
  height: auto;
}
</style>

