<script setup lang="ts">
import { computed, ref } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
defineExpose({ panelRef })
</script>

<template>
  <section class="panel panel--light" id="contact" ref="panelRef">
    <div class="panel-inner">
      <p class="eyebrow">03 / 03 · Contact</p>
      <h2 class="section-title">Contact.</h2>
    </div>

    <button
      class="section-tab section-tab--light"
      :class="{ 'section-tab--active': isActive }"
      @click="emit('toggle')"
      aria-label="More info"
    >
      <span class="section-tab__icon" v-html="angArrow" />
    </button>
  </section>
</template>
