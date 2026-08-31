<script setup lang="ts">
import { onMounted, ref } from 'vue'

import textureBackground from '../assets/bgs/bg2.jpg'
import GlitchLogo from './GlitchLogo.vue'
import { useTextGlitch } from '../utils/useTextGlitch'

const textureRef = ref<HTMLImageElement | null>(null)
const textureLoaded = ref(false)
const messageRef = ref<HTMLElement | null>(null)
const { text: message } = useTextGlitch({
  primary: 'Nothing Here',
  alternates: ['Keep Looking', '404?', 'No Signal', 'What are you trying to find?'],
  el: messageRef,
})

const revealTexture = () => {
  textureLoaded.value = true
}

onMounted(() => {
  if (textureRef.value?.complete) revealTexture()
})
</script>

<template>
  <main class="not-found">
    <img
      ref="textureRef"
      class="not-found__texture"
      :class="{ 'not-found__texture--loaded': textureLoaded }"
      :src="textureBackground"
      alt=""
      aria-hidden="true"
      @load="revealTexture"
    >
    <div class="not-found__content">
      <GlitchLogo class="not-found__logo" />
      <p ref="messageRef" class="not-found__message">{{ message }}</p>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: 2rem;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--c-bg);
}

.not-found__texture {
  position: fixed;
  top: -50vh;
  left: 0;
  width: 100%;
  height: 200vh;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity 1.5s ease;
}

.not-found__texture--loaded {
  opacity: 0.06;
}

.not-found__content {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.not-found__logo {
  width: min(70vw, 780px);
}

.not-found__message {
  color: var(--c-muted);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .not-found__texture--loaded {
    opacity: 0.1;
  }
}
</style>
