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
const eyebrowRef = ref<HTMLElement | null>(null)
const { text: whoText } = useTextGlitch({
  primary:    'WHO AM I.',
  alternates: ['WHO AM I?', 'WHO ARE YOU?', 'WHY ARE YOU HERE?', "WHAT AM I?", "WHAT I DO."],
  el: eyebrowRef,
})
</script>

<template>
  <section class="panel panel--dark" id="about" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ EST // MCMXCIX → FUTURE]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow" ref="eyebrowRef">02 / 03 · {{ whoText }}</p>
      <span class="micrographic" v-html="resistor" />
      <h2 class="section-title">ab<em>o</em>ut.</h2>
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
