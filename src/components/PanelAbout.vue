<script setup lang="ts">
import { computed, ref } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import vTypewriter from '../directives/v-typewriter.js'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
defineExpose({ panelRef })
</script>

<template>
  <section class="panel panel--dark" id="about" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ 33.6572133 // -117.7463182 ]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow">02 / 03 · WHO AM I.</p>
      <h2 class="section-title">about.</h2>
    </div>
    <p class="scroll-hint">Scroll</p>
    <a class="scroll-cue" href="#contact" aria-label="Scroll to Contact">
      <span class="eyebrow">Contact</span>
      <span class="scroll-cue__arrow" v-html="angArrow" />
    </a>

    <button
      class="section-tab"
      :class="{ 'section-tab--active': isActive }"
      @click="emit('toggle')"
      aria-label="More info"
    >
      <span class="section-tab__icon" v-html="angArrow" />
    </button>
  </section>
</template>
