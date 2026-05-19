<script setup lang="ts">
import { ref } from 'vue'
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import ProjectModal from './ProjectModal.vue'
import type { ProjectModalData } from './ProjectModal.vue'
import detail2Raw from '../assets/svg/micrographics/detail/detail_2.svg?raw'

const activeModal = ref<ProjectModalData | null>(null)

const projects: ExpandGroup[] = [
  {
    label: 'ESPORTS',
    items: [
      {
        label: 'Apex Legends Analysis Platform',
        modal: {
          ref: '001',
          title: 'Apex Analysis Platform',
          dates: '2025',
          overview: 'Developed an automated match analysis & data gathering tool for Apex Legends, utilizing OpenCV, MySQL and sklearn, allowing coaches to reduce time spent gathering data by over 95%. Currently in use by an Apex Pro League coach.',
          stack: ['Python', 'OpenCV', 'PostgreSQL', 'SKLearn', 'Flask'],
          status: 'PRODUCTION',
          isPrivate: true,
          glyphs: ['eye', 'apex', 'sunburst'],
        },
      },
      {
        label: 'CS2 Map Control Analysis',
        modal: {
          ref: '002',
          title: 'CS2 Positional Analysis',
          dates: '2025 - CURRENT',
          overview: 'A tool that ingests CS2 match demos, extracts player positional data, reconstructs map control using vision cones and provides informational statistics on player and team-level map control. Breaks down a complex idea into a set of actionable metrics for coaches and analysts.',
          stack: ['Python', 'Redis', 'SKLearn', 'MySQL'],
          status: 'IN DEVELOPMENT',
          glyphs: ['spray', 'cs', 'form'],
        },
      },
      {
        label: 'Overwatch Atlas',
        modal: {
          ref: '003',
          title: 'Overwatch Atlas',
          dates: '2021 - 2022',
          overview: 'A matchmaking platform for the Overwatch 2 Beta. Provided skill-based matchmaking, player statistics and a competitive ladder system. Built with Vue.js frontend and a Python backend. Used by 100+ users during the beta, retired with the release of Overwatch 2\'s official matchmaking system.',
          stack: ['Python', 'Vue.js', 'MongoDB'],
          status: 'RETIRED',
          glyphs: ['person', 'overwatch', 'inter'],
          github: 'https://github.com/rspet123/Atlas'
        },
      },
      {
        label: 'CS:GO Collegiate Recruitment Tool',
        modal: {
          ref: '004',
          title: 'CS:GO Collegiate Recruitment Tool',
          dates: '2020 - 2021',
          overview: 'A recruitment tool for collegiate CS:GO players. Parses CS:GO demos from Collegiate tryouts, extracts information and clusters players into playstyle archetypes using SKLearn. Greatly sped up the recruitment process for coaches by providing actionable insights on player strengths and weaknesses, playstyle and potential fit with the team.',
          stack: ['Python', 'Plotly.js', 'MongoDB'],
          status: 'RETIRED',
          glyphs: ['person', 'cs', 'stack'],
          github: 'https://github.com/rspet123/CS-GO-Stats-Analysis'
        },
      },
    ],
  }
]

const experience: ExpandGroup[] = [
  {
    label: 'EZOIC // SWE II', meta: '[ 2022 - CURRENT ]',
    items: [
      {
        label: 'Agentic Incident Triage System',
        modal: {
          ref: '001',
          title: 'Agentic Incident Triage System',
          dates: '2025 - Current',
          overview: 'Designed, built and maintained an internal tool that acts upon AWS Cloudwatch alerts by autonomously gathering information, determining the severity of the incident and either resolving it or escalating to a human on-call engineer. Built with Golang, Weaviate, and Anthropic API.',
          stack: ['Golang', 'Weaviate', 'Anthropic', 'AWS'],
          status: 'PRODUCTION',
          glyphs: ['anthropic', 'ai', 'ezoic'],
          isPrivate: true,
        },
      },
      {
        label: 'Developer MCP Server',
        modal: {
          ref: '002',
          title: 'Developer MCP Server',
          dates: '2025 - Current',
          overview: 'Designed, built and maintained a development MCP server in Golang for Engineers, providing schema-aware tooling for LLM/code agents, speeding up the development process. Adopted by 100% of the development team.',
          stack: ['Golang', 'MCP'],
          status: 'PRODUCTION',
          glyphs: ['stack', 'ezoic', 'person'],
          isPrivate: true,
        },
      },
      {
        label: 'Customer RAG Assistant',
        modal: {
          ref: '003',
          title: 'Customer RAG Assistant',
          dates: '2022 - Current',
          overview: 'Collaborated on the design and implementation of a RAG based assistant utilizing Golang and OpenAI APIs to assist the helpdesk, saving over 4500 person/days in employee time. Redesigned the Golang API for our support platform, reducing load time on core staff workflows by over 90%.',
          stack: ['Golang', 'OpenAI', 'RAG', 'OpenSearch'],
          status: 'PRODUCTION',
          glyphs: ['inter', 'openai', 'ezoic'],
          isPrivate: true,
        },
      },
      {
        label: 'Domain Verification // Transfer Tool',
        modal: {
          ref: '004',
          title: 'Domain Verification & Transfer Tool',
          dates: '2023',
          overview: 'Designed and built the Golang backend for a domain verification and transfer tool, contributing to over $8 million in revenue from transferred domains.',
          stack: ['Golang'],
          status: 'PRODUCTION',
          glyphs: ['flag', 'ezoic', 'person'],
          isPrivate: true,
        },
      }
    ]
  }
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
  <ExpandList :groups="experience" @item-click="activeModal = $event" />
  <h3 class="drawer__title">projects.</h3>
  <ExpandList :groups="projects" @item-click="activeModal = $event" />

  <Transition name="modal-fade">
    <ProjectModal v-if="activeModal" :data="activeModal" @close="activeModal = null" />
  </Transition>
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

@media (max-width: 768px) {
  .drawer__detail {
    position: absolute;
    top: -55%;
    left: 60%;
    width: 100%;
    margin-top: 0;
    opacity: 0.6;
  }

  .drawer__detail-inner {
    transform: scale(1.5) translate(-40%, 30%);
  }
}

/* ── MODAL TRANSITION ─────────────────────────────────────────────────── */

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
