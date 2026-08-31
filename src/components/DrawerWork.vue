<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'
import StaticList from './StaticList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import ProjectDetailDrawer from './ProjectDetailDrawer.vue'
import type { ProjectDetailData } from '../types/projects'
import detail2Raw from '../assets/svg/micrographics/detail/detail_2.svg?raw'

const TRANSITION_MS = 380
const rootRef = ref<HTMLElement | null>(null)
const activeDetail = ref<ProjectDetailData | null>(null)
const detailIsOpen = ref(false)
const lastTrigger = ref<HTMLElement | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null
const getTransitionDuration = () => (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TRANSITION_MS
)

const afterPaint = () => new Promise<void>((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
})

const openDetail = async (detail: ProjectDetailData, trigger: HTMLElement) => {
  if (closeTimer) clearTimeout(closeTimer)
  activeDetail.value = detail
  lastTrigger.value = trigger
  await nextTick()
  await afterPaint()
  detailIsOpen.value = true
  await nextTick()
  rootRef.value
    ?.querySelector<HTMLElement>('[data-detail-back]')
    ?.focus({ preventScroll: true })
}

const backToList = () => {
  if (!activeDetail.value) return
  detailIsOpen.value = false
  nextTick(() => lastTrigger.value?.focus({ preventScroll: true }))
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    activeDetail.value = null
  }, getTransitionDuration())
}

const hasActiveDetail = () => detailIsOpen.value

const resetDetail = () => {
  if (closeTimer) clearTimeout(closeTimer)
  detailIsOpen.value = false
  activeDetail.value = null
  lastTrigger.value = null
}

defineExpose({ backToList, hasActiveDetail, resetDetail })

onUnmounted(() => {
  if (closeTimer) clearTimeout(closeTimer)
})

const projects: ExpandGroup[] = [
  {
    label: 'ESPORTS',
    items: [
      {
        label: 'Apex Legends Analysis Platform',
        detail: {
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
        detail: {
          ref: '002',
          title: 'CS2 Positional Analysis',
          dates: '2025 - CURRENT',
          overview: 'A tool that ingests CS2 match demos, extracts player positional data, reconstructs map control using vision cones and provides informational statistics on player and team-level map control. Breaks down a complex idea into a set of actionable metrics for coaches and analysts.',
          stack: ['Python', 'SKLearn', 'MySQL'],
          status: 'IN DEVELOPMENT',
          glyphs: ['spray', 'cs', 'form'],
          github: 'https://github.com/rspet123/cs-map-control'
        },
      },
      {
        label: 'Overwatch Atlas',
        detail: {
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
        detail: {
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
    label: 'EZOIC » SWE II', meta: '[ 2022 - CURRENT ]',
    items: [
      {
        label: 'Agentic Incident Triage System',
        detail: {
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
        detail: {
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
        detail: {
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
        label: 'Domain Verification » Transfer Tool',
        detail: {
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
  <div ref="rootRef" class="work-drawer">
    <div
      class="work-drawer__track"
      :class="{ 'work-drawer__track--detail': detailIsOpen }"
    >
      <section
        class="work-drawer__stage work-drawer__stage--list"
        :aria-hidden="detailIsOpen"
        :inert="detailIsOpen"
      >
        <div class="drawer-panel scrollbar-thin">
          <div class="drawer__sections">
            <div class="drawer__section">
              <div class="drawer__title-row">
                <div>
                  <p class="drawer__eyebrow">OUTPUT ¬</p>
                  <h3 class="drawer__title">experience.</h3>
                </div>
                <span class="drawer__detail" aria-hidden="true">
                  <span class="drawer__detail-inner" v-html="detail2Raw" />
                </span>
              </div>
              <StaticList :groups="experience" @detail-select="openDetail" />
            </div>

            <div class="drawer__section">
              <div class="drawer__title-row">
                <h3 class="drawer__title">projects.</h3>
              </div>
              <StaticList :groups="projects" @detail-select="openDetail" />
            </div>
          </div>
        </div>
      </section>

      <div
        class="work-drawer__stage work-drawer__stage--detail"
        :aria-hidden="!detailIsOpen"
        :inert="!detailIsOpen"
      >
        <ProjectDetailDrawer
          v-if="activeDetail"
          :data="activeDetail"
          @back="backToList"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-drawer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.work-drawer__track {
  position: relative;
  width: 200%;
  height: 100%;
  display: flex;
  transform: translate3d(0, 0, 0);
  transition: transform 380ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.work-drawer__track--detail {
  transform: translate3d(-50%, 0, 0);
}

.work-drawer__stage {
  position: relative;
  flex: 0 0 50%;
  width: 50%;
  max-width: 50%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  backface-visibility: hidden;
}

.drawer__sections {
  min-height: 100%;
}

.drawer__section {
  margin-bottom: 64px;
}

.drawer__section:last-child {
  margin-bottom: 48px;
}

.drawer__detail-inner {
  transform: scale(3) translate(-40%, 30%);
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


@media (prefers-reduced-motion: reduce) {
  .work-drawer__track {
    transition-duration: 1ms;
  }
}
</style>
