<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'
import detail3Raw from '../assets/svg/micrographics/detail/detail_3.svg?raw'

const groups: ExpandGroup[] = [
  {
    label: 'Links', items: [
      { label: 'LINKEDIN //', href: 'https://www.linkedin.com/in/robert-spencer-aa0102207/' },
      { label: 'RESUME //', href: '/resume.pdf' },
      { label: 'GITHUB //', href: 'https://github.com/rspet123' }
      ]
  },
  {
    label: 'Me', items: [
      { label: 'R. Spencer, Software Engineer, with a focus on backend development, AI, and systems engineering.' },
      { label: 'I have a passion for building efficient, scalable systems and leveraging AI to solve complex problems.' }
    ]
  }
]
</script>

<template>
  <div class="drawer__title-row">
    <div>
      <p class="drawer__eyebrow">me //</p>
      <h3 class="drawer__title">connect.</h3>
    </div>
    <span class="drawer__detail" aria-hidden="true">
      <span class="drawer__detail-inner" v-html="detail3Raw" />
    </span>
  </div>
  <ExpandList :groups="groups" />
</template>

<style scoped>
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
</style>
