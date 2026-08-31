<script setup lang="ts">
import { nextTick, ref } from 'vue'
import StaticList from './StaticList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import ProjectDetailDrawer from './ProjectDetailDrawer.vue'
import type { ProjectDetailData } from '../types/projects'
import detail3Raw from '../assets/svg/micrographics/detail/detail_3.svg?raw'

const groups: ExpandGroup[] = [
  {
    label: 'Links', items: [
      { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/robert-spencer-aa0102207/' },
      { label: 'RESUME', href: '/resume.pdf' },
      { label: 'GITHUB', href: 'https://github.com/rspet123' }
      ]
  }
]

const aboutMe: ProjectDetailData = {
  category: 'CONTACT',
  title: 'R. SPENCER',
  overview: 'I\'m a software engineer with a focus on backend development, AI, and systems engineering. I have a passion for building efficient, scalable systems and leveraging AI to solve complex problems. I love finding innovative solutions and continuously learning new technologies. I\'m a big stats nerd, I love analyzing data and representing complex concepts as understandable metrics. In my spare time, I enjoy programming, Counter-Strike, cats & esports.',
  glyphs: ['person', 'cs', 'eye'],
}

const rootRef = ref<HTMLElement | null>(null)
const infoIsOpen = ref(false)
const lastTrigger = ref<HTMLElement | null>(null)

const afterPaint = () => new Promise<void>((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
})

const openInfo = async (event: MouseEvent) => {
  lastTrigger.value = event.currentTarget as HTMLElement
  await nextTick()
  await afterPaint()
  infoIsOpen.value = true
  await nextTick()
  rootRef.value
    ?.querySelector<HTMLElement>('[data-contact-detail-back]')
    ?.focus({ preventScroll: true })
}

const backToList = () => {
  if (!infoIsOpen.value) return
  infoIsOpen.value = false
  nextTick(() => lastTrigger.value?.focus({ preventScroll: true }))
}

const hasActiveDetail = () => infoIsOpen.value

const resetDetail = () => {
  infoIsOpen.value = false
  lastTrigger.value = null
}

defineExpose({ backToList, hasActiveDetail, resetDetail })
</script>

<template>
  <div ref="rootRef" class="contact-drawer">
    <div
      class="contact-drawer__track"
      :class="{ 'contact-drawer__track--detail': infoIsOpen }"
    >
      <section
        class="contact-drawer__stage"
        :aria-hidden="infoIsOpen"
        :inert="infoIsOpen"
      >
        <div class="drawer-panel scrollbar-thin">
          <div class="drawer__title-row">
            <div>
              <p class="drawer__eyebrow">me ¬</p>
              <h3 class="drawer__title">connect.</h3>
            </div>
            <span class="drawer__detail" aria-hidden="true">
              <span class="drawer__detail-inner" v-html="detail3Raw" />
            </span>
          </div>
          <StaticList :groups="groups" />
          <button class="contact-drawer__me" type="button" @click="openInfo">
            <span>ME</span>
            <span class="contact-drawer__me-meta" aria-hidden="true">[ VIEW ]</span>
          </button>
        </div>
      </section>

      <section
        class="contact-drawer__stage"
        :aria-hidden="!infoIsOpen"
        :inert="!infoIsOpen"
      >
        <ProjectDetailDrawer :data="aboutMe" @back="backToList" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.contact-drawer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.contact-drawer__track {
  width: 200%;
  height: 100%;
  display: flex;
  transform: translate3d(0, 0, 0);
  transition: transform 380ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.contact-drawer__track--detail {
  transform: translate3d(-50%, 0, 0);
}

.contact-drawer__stage {
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

.contact-drawer__me {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding: 14px 0;
  color: var(--drawer-list-text, var(--c-text-mid));
  background: none;
  border: 0;
  border-top: 1px solid var(--drawer-list-rule, var(--c-ghost));
  border-bottom: 1px solid var(--drawer-list-rule, var(--c-ghost));
  border-radius: 0;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-align: left;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.contact-drawer__me:hover,
.contact-drawer__me:focus-visible {
  color: var(--drawer-list-hover, var(--c-text-strong));
}

.contact-drawer__me:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 3px;
}

.contact-drawer__me-meta {
  color: var(--c-accent);
  font-size: 9px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0.7;
}

.drawer__detail-inner {
  transform: scale(4) translate(-40%, 5%);
}

@media (max-width: 768px) {
  .drawer__detail {
    position: absolute;
    top: -20%;
    left: 66%;
    width: 50%;
    margin-top: 0;
    opacity: 0.6;
  }

  .drawer__detail-inner {
    transform: scale(2) translate(-40%, 5%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-drawer__track {
    transition-duration: 1ms;
  }
}
</style>
