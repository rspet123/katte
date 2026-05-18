<script setup lang="ts">
import { computed, ref } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import { runHoverGlitch } from '../utils/glitch'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
defineExpose({ panelRef })
</script>

<template>
  <section class="panel panel--light" id="work" ref="panelRef">
    <div class="panel-inner">
      <p class="eyebrow">01 / 03 · Selected Works / xx19–xx26</p>
      <h2 class="section-title">Work.</h2>
    </div>

    <a class="scroll-cue scroll-cue--dark" href="#about" aria-label="Scroll to About">
      <span class="eyebrow">About</span>
      <span class="scroll-cue__arrow" v-html="angArrow" />
    </a>

    <button
      class="section-tab section-tab--light"
      :class="{ 'section-tab--active': isActive }"
      @click="emit('toggle')"
      @mouseenter="runHoverGlitch"
      aria-label="More info"
    >
      <span class="section-tab__icon" v-html="angArrow" />
    </button>
  </section>
</template>
