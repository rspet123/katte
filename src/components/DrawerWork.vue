<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import detail2Raw from '../assets/svg/micrographics/detail/detail_2.svg?raw'

const projects: ExpandGroup[] = [
  { label: 'AI',         items: ['LLM Applications', 'Agentic Systems', 'RAG Pipelines'] },
  { label: 'Agents',     items: ['Autonomous Agents', 'Multi-Agent Workflows', 'Tool Use'] },
  { label: 'Data',       items: ['Pipelines', 'Dashboards', 'Analytics'] },
  { label: 'Dashboards', items: ['Real-time', 'Reporting', 'Visualisation'] },
]

const experience: ExpandGroup[] = [
  { label: 'EZOIC // SWE II', meta: '[ 2022 - CURRENT ]', 
    items: ['LLM Applications', 'Agentic Systems', 'RAG Pipelines', 'Autonomous Agents', 'Multi-Agent Workflows'] 
  },
  { label: 'FREELANCE // SWE', meta: '[ 2021 - CURRENT ]', 
    items: ['E-Sports', 'Data Analysis', 'Dashboards', 'Computer Vision'] 
  },
]
</script>

<template>
  <div class="drawer__title-row">
    <div>
      <p class="drawer__eyebrow">OUTPUT //</p>
      <h3 class="drawer__title">experience.</h3>
    </div>
    <span class="drawer__detail" aria-hidden="true">
      <span class="drawer__detail-inner" v-html="detail2Raw" />
    </span>
  </div>
  <ExpandList :groups="experience" />
  <h3 class="drawer__title">projects.</h3>
  <ExpandList :groups="projects" />
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
  transform: scale(3) translate(-40%, 30%);
}

.drawer__detail-inner :deep(svg) {
  width: 100%;
  height: auto;
}
</style>
