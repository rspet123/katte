<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
</script>

<template>
  <HeroSection />
</template>

<style>
/* ── GLOBAL RESET & BASE ─────────────────────────────── */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #0a0a0a;
  color: #ffffff;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Scrolling is handled entirely by .scroll-root inside the app.
     Locking overflow here prevents a double scrollbar. */
  overflow: hidden;
}

/* Inter via Google Fonts — weight 300 and 800 only */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;800&display=swap');
</style>

