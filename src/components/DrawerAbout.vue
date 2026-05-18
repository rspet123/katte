<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'

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
</script>

<template>
  <p class="drawer__eyebrow">capabilities //</p>
  <h3 class="drawer__title">backend &</h3>
  <h3 class="drawer__title">ai systems.</h3>
  <ExpandList :groups="groups" />
</template>

