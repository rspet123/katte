<script setup lang="ts">
import { computed, ref } from 'vue'
import angArrowRaw from '../assets/svg/micrographics/ang_arrow.svg?raw'
import resistorRaw from '../assets/svg/micrographics/resistor.svg?raw'
import vTypewriter from '../directives/v-typewriter.js'
import { useTextGlitch } from '../utils/useTextGlitch'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const angArrow = computed(() => fixStrokes(angArrowRaw))
const resistor = computed(() => fixStrokes(resistorRaw).replace('<svg ', '<svg fill="currentColor" '))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
defineExpose({ panelRef })

// ── Eyebrow text glitch ───────────────────────────────────────────────────
const findMeRef = ref<HTMLElement | null>(null)
const { text: findMeText } = useTextGlitch({
  primary:    'FIND ME // HERE',
  alternates: ['FIND ME!', "I'M HERE", 'WHERE AM I?'],
  el: findMeRef,
})
</script>

<template>
  <section class="panel panel--light" id="contact" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ 33° 39′ 26″ N // 117° 44′ 47″ W ]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow" ref="findMeRef">03 / 03 · {{ findMeText }}</p>
      <span class="micrographic" v-html="resistor" />
      <h2 class="section-title">c<em>o</em>ntact.</h2>
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
