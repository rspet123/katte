<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'

const projects: ExpandGroup[] = [
  { label: 'AI',         items: ['LLM Applications', 'Agentic Systems', 'RAG Pipelines'] },
  { label: 'Agents',     items: ['Autonomous Agents', 'Multi-Agent Workflows', 'Tool Use'] },
  { label: 'Data',       items: ['Pipelines', 'Dashboards', 'Analytics'] },
  { label: 'Dashboards', items: ['Real-time', 'Reporting', 'Visualisation'] },
]

const experience: ExpandGroup[] = [
  { label: 'EZOIC // SWE II', meta: '[ 2022 - CURRENT ]', 
    items: ['LLM Applications', 'Agentic Systems', 'RAG Pipelines', 'Autonomous Agents', 'Multi-Agent Workflows', 'Tool Use'] 
  },
  { label: 'FREELANCE // SWE', meta: '[ 2021 - CURRENT ]', 
    items: ['E-Sports', 'Data Analysis', 'Dashboards', 'Computer Vision'] 
  },
]
</script>

<template>
  <p class="drawer__eyebrow">Background //</p>
  <h3 class="drawer__title">experience.</h3>
  <ExpandList :groups="experience" />
  <h3 class="drawer__title">projects.</h3>
  <ExpandList :groups="projects" />
</template>
