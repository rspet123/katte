<script setup lang="ts">
import { computed, ref } from 'vue'
import resistorRaw from '../assets/svg/micrographics/resistor.svg?raw'
import InfoRail from './InfoRail.vue'
import vTypewriter from '../directives/v-typewriter.js'
import { useTextGlitch } from '../utils/useTextGlitch'

const fixStrokes = (svg: string) => svg.replace(/stroke:#000/g, 'stroke:currentColor')
const resistor = computed(() => fixStrokes(resistorRaw).replace('<svg ', '<svg fill="currentColor" '))

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const panelRef = ref<HTMLElement | null>(null)
defineExpose({ panelRef })

// ── Eyebrow text glitch ───────────────────────────────────────────────────
const findMeRef = ref<HTMLElement | null>(null)
const { text: findMeText } = useTextGlitch({
  primary:    'FIND ME // HERE',
  alternates: ["WHERE CAN YOU FIND ME?", 'WHERE AM I?'],
  el: findMeRef,
})
</script>

<template>
  <section class="panel panel--light panel--with-rail" id="contact" ref="panelRef">
    <p class="eyebrow corner-label" v-typewriter="{text: '[ 33° 39′ 26″ N // 117° 44′ 47″ W ]', seconds: 2.5}"></p>

    <div class="panel-inner">
      <p class="eyebrow" ref="findMeRef">03 / 03 · {{ findMeText }}</p>
      <span class="micrographic" v-html="resistor" />
      <h2 class="section-title">c<em>o</em>ntact.</h2>
    </div>

    <InfoRail
      number="03"
      section-name="contact"
      :is-open="isActive"
      @toggle="emit('toggle')"
    />

  </section>
</template>
