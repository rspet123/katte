<script setup lang="ts">
import ExpandList from './ExpandList.vue'
import type { ExpandGroup } from './ExpandList.vue'

const groups: ExpandGroup[] = [
  { label: 'LinkedIn', items: ['linkedin.com/in/...'] },
  { label: 'GitHub',   items: ['github.com/...'] },
  { label: 'Resume',   items: ['Download PDF'] },
]
</script>

<template>
  <p class="drawer__eyebrow">links //</p>
  <h3 class="drawer__title">connect.</h3>
  <ExpandList :groups="groups" />
</template>
