<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import logoRaw from '../assets/svg/logo/main_logo.svg?raw'
import { generateClipPath } from '../utils/clip_path_gen'
import { rand } from '../utils/glitch'

const logoRef = ref<HTMLElement | null>(null)
let glitchTimeout: ReturnType<typeof setTimeout> | null = null

const triggerGlitch = () => {
  const el = logoRef.value
  if (!el) return

  const flashCount = rand(2, 4)
  let cursor = 0

  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(40, 120)
    const gap = rand(20, 60)
    const applyAt = cursor
    const clearAt = cursor + flashDuration
    cursor = clearAt + gap

    const path = generateClipPath()
    const caR = rand(3, 8)
    const caC = rand(3, 8)
    const blur = rand(3, 12) / 10

    setTimeout(() => {
      el.style.clipPath = path
      el.style.setProperty('--ca-r-x', `-${caR}px`)
      el.style.setProperty('--ca-c-x', `${caC}px`)
      el.style.setProperty('--ca-blur', `${blur}px`)
      el.classList.add('is-glitching')
    }, applyAt)
    setTimeout(() => {
      el.style.clipPath = ''
      el.style.removeProperty('--ca-r-x')
      el.style.removeProperty('--ca-c-x')
      el.style.removeProperty('--ca-blur')
      el.classList.remove('is-glitching')
    }, clearAt)
  }
}

const scheduleGlitch = () => {
  const delay = rand(5000, 10_000)
  glitchTimeout = setTimeout(() => { triggerGlitch(); scheduleGlitch() }, delay)
}

defineExpose({ triggerGlitch })

onMounted(scheduleGlitch)
onUnmounted(() => { if (glitchTimeout) clearTimeout(glitchTimeout) })
</script>

<template>
  <div ref="logoRef" class="glitch-logo" v-html="logoRaw" aria-hidden="true" />
</template>

<style scoped>
.glitch-logo {
  width: 100%;
  pointer-events: none;
}

.glitch-logo :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  fill: #ffffff;
}

.glitch-logo.is-glitching {
  filter:
    blur(var(--ca-blur, 0.6px))
    drop-shadow(var(--ca-r-x, -4px) 0 0 rgba(255, 20, 80, 0.9))
    drop-shadow(var(--ca-c-x, 4px) 0 0 rgba(0, 220, 255, 0.9));
}
</style>
