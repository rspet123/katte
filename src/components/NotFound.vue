<script setup lang="ts">
import logoRaw from '../assets/svg/logo/main_logo.svg?raw'

const logoSvg = logoRaw
</script>

<template>
  <main class="not-found">
    <div class="not-found__content">
      <div class="not-found__logo" v-html="logoSvg" aria-label="KATTE" role="img" />
      <p>Nothing Here...</p>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: 2rem;
  background: var(--c-bg);
}

.not-found__content {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
}

.not-found__logo {
  width: min(70vw, 780px);
}

.not-found__logo :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  fill: var(--c-white);
}

.not-found p {
  color: var(--c-text-body);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 300;
  letter-spacing: 0.08em;
}
</style>
