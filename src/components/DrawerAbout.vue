<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import detail4Raw from '../assets/svg/micrographics/filled_x.svg?raw'

const groups: ExpandGroup[] = [
  {
    label: 'Education', items: [
      { label: 'University of North Carolina - Charlotte', meta: '[ 2018 - 2022 ]' },
    ]
  },
  { label: 'Languages', items: [
    { label: 'Golang',         meta: '[ 4 years ]' },
    { label: 'Python',     meta: '[ 6 years ]' },
    { label: 'JavaScript // Vue.js', meta: '[ 4 years ]' },
    { label: 'MySQL // Postgres',        meta: '[ 5 years ]' },
  ]},
  { label: 'Development', items: [
        { label: 'Agentic Development', meta: '[ 2 years ]' },
        { label: 'Prompt Engineering', meta: '[ 2 years ]' },
        { label: 'Test-Driven Development', meta: '[ 5 years ]' },
  ]},
    { label: 'Platforms',               items: [
    { label: 'Linux/WSL',       meta: '[ 5 years ]' },
    { label: 'AWS',         meta: '[ 4 years ]' },
  ] },
  { label: 'Tools',                   items: [
     { label: 'Docker',     meta: '[ 4 years ]' },
    { label: 'Git',        meta: '[ 6 years ]' },
    { label: 'SQL',      meta: '[ 5 years ]' },
    { label: 'MongoDB',  meta: '[ 5 years ]' },  
    { label: 'Redis',       meta: '[ 3 years ]' },
    { label: 'OpenSearch',  meta: '[ 2 years ]' },    
    { label: 'Weaviate',  meta: '[ 2 years ]' },  
    { label: 'SKLearn',  meta: '[ 5 years ]' },  
  ] },
  { label: 'AI', items: [
    { label: 'LLMs',        meta: '[ Production   ]' },
    { label: 'Agents',      meta: '[ Production   ]' },
    { label: 'Multi-Agent Workflows', meta: '[ Production   ]' },
    { label: 'MCP Servers',    meta: '[ Production   ]' },
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
.drawer__detail-inner {
  transform: scale(2) translate(-30%, 30%);
}

@media (max-width: 768px) {
  .drawer__detail {
    visibility: hidden;
  }
}
</style>

