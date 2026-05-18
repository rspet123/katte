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
const yy = new Date().getFullYear().toString().slice(-2)

defineExpose({ panelRef })

// ── Eyebrow text glitch ───────────────────────────────────────────────────
const workEyebrowRef = ref<HTMLElement | null>(null)
const { text: workText } = useTextGlitch({
  primary:    `Work Experience // xx22–xx${yy}`,
  alternates: [
    `Selected Works // xx19–xx${yy}`,
    'Passion Projects // now–∞',
  ],
  el: workEyebrowRef,
})
</script>

<template>
  <section class="panel panel--light" id="work" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ KATTE // LABS ]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow" ref="workEyebrowRef">01 / 03 · {{ workText }}</p>
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
