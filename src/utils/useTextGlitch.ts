import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { generateClipPath } from './clip_path_gen'
import { rand } from './glitch'

export interface TextGlitchOptions {
  /** The canonical text shown at rest. */
  primary: string
  /** Pool of alternate strings to flash at random. */
  alternates: string[]
  /** The element to apply the clip-path glitch on. */
  el: Ref<HTMLElement | null>
  /** Minimum ms between glitch triggers (default 5 000). */
  minInterval?: number
  /** Maximum ms between glitch triggers (default 10 000). */
  maxInterval?: number
  /** How long (ms) the alternate text is held before snapping back (default 300–600, randomised). */
  holdMin?: number
  holdMax?: number
}

/**
 * Randomly flashes an element between `primary` text and a random entry from
 * `alternates`, using clip-path flashes to mask the swap — matching the style
 * of the reticle / logo glitch effects.
 *
 * Returns a reactive `text` ref to bind in the template.
 */
export function useTextGlitch({
  primary,
  alternates,
  el,
  minInterval = 5_000,
  maxInterval = 10_000,
  holdMin = 300,
  holdMax = 600,
}: TextGlitchOptions) {
  const text = ref(primary)
  let timeout: ReturnType<typeof setTimeout> | null = null

  const applyFlash = (element: HTMLElement) => {
    const caR  = rand(3, 8)
    const caC  = rand(3, 8)
    const blur = rand(3, 12) / 10
    element.style.clipPath = generateClipPath(8)
    element.style.filter   = [
      `blur(${blur}px)`,
      `drop-shadow(-${caR}px 0 0 rgba(255,20,80,0.9))`,
      `drop-shadow(${caC}px 0 0 rgba(0,220,255,0.9))`,
    ].join(' ')
  }

  const clearFlash = (element: HTMLElement) => {
    element.style.clipPath = ''
    element.style.filter   = ''
  }

  const runGlitch = () => {
    const element = el.value
    if (!element || alternates.length === 0) return

    const alternate = alternates[rand(0, alternates.length - 1)]
    if (!alternate) return

    // ── Phase 1: rapid pre-swap flicker on the primary text ──────────────
    const flickerCount = rand(2, 4)
    let cursor = 0

    for (let i = 0; i < flickerCount; i++) {
      const flashDur = rand(30, 80)
      const gap      = rand(15, 50)
      const applyAt  = cursor
      const clearAt  = cursor + flashDur
      cursor = clearAt + gap

      setTimeout(() => applyFlash(element), applyAt)
      setTimeout(() => clearFlash(element), clearAt)
    }

    // ── Phase 2: one swap-in flash → reveal alternate ─────────────────────
    const swapInFlash = rand(40, 70)
    setTimeout(() => {
      applyFlash(element)
      setTimeout(() => {
        text.value = alternate
        clearFlash(element)

        // ── Phase 3: hold → swap-out flash → restore primary ─────────────
        const hold = rand(holdMin, holdMax)
        setTimeout(() => {
          applyFlash(element)
          setTimeout(() => {
            text.value = primary
            clearFlash(element)
          }, rand(40, 70))
        }, hold)
      }, swapInFlash)
    }, cursor)
  }

  const schedule = () => {
    const delay = rand(minInterval, maxInterval)
    timeout = setTimeout(() => { runGlitch(); schedule() }, delay)
  }

  onMounted(() => schedule())
  onUnmounted(() => { if (timeout) clearTimeout(timeout) })

  return { text }
}
