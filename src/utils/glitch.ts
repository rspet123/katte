import { generateClipPath } from './clip_path_gen'

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const runHoverGlitch = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const flashCount = rand(2, 4)
  let cursor = 0
  for (let i = 0; i < flashCount; i++) {
    const flashDuration = rand(25, 90)
    const gap           = rand(10, 50)
    const applyAt       = cursor
    const clearAt       = cursor + flashDuration
    cursor = clearAt + gap
    const path = generateClipPath(10)
    const caR  = rand(3, 8)
    const caC  = rand(3, 8)
    const blur = rand(3, 12) / 10
    setTimeout(() => {
      el.style.clipPath = path
      el.style.setProperty('--ca-r-x',  `-${caR}px`)
      el.style.setProperty('--ca-c-x',  `${caC}px`)
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
