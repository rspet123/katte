<script setup lang="ts">
import { computed, ref } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import resistorRaw from '../assets/svg/micrographics/resistor.svg?raw'
import vTypewriter from '../directives/v-typewriter.js'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))
const resistor = computed(() => fixStrokes(resistorRaw).replace('<svg ', '<svg fill="currentColor" '))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
const currentYear = new Date().getFullYear()

defineExpose({ panelRef })
</script>

<template>
  <section class="panel panel--light" id="work" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ KATTE // LABS ]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow">01 / 03 · Selected Works // xx19–xx{{currentYear.toString().slice(-2)}}</p>
      <span class="micrographic" v-html="resistor" />
      <h2 class="section-title">w<em>o</em>rk.</h2>
    </div>

    <p class="scroll-hint">Scroll</p>

    <a class="scroll-cue scroll-cue--dark" href="#about" aria-label="Scroll to About">
      <span class="eyebrow">About</span>
      <span class="scroll-cue__arrow" v-html="angArrow" />
    </a>

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
