export default {
  beforeMount(el, binding) {
    startTyping(el, binding.value);
  },
  updated(el, binding) {
    if (el._typewriterCancel) el._typewriterCancel();
    startTyping(el, binding.value);
  },
  unmounted(el) {
    if (el._typewriterCancel) el._typewriterCancel();
  },
};

const CHARS = 'abcdefghijklmnopqrstuvwxyz';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function startTyping(el, { text, seconds }) {
  const scrambleFramesPerChar = 5;
  const stepDuration = (seconds * 1000) / (text.length * scrambleFramesPerChar);
  let step = 0;
  let cancelled = false;
  let timeoutId = null;

  el._typewriterCancel = () => {
    cancelled = true;
    if (timeoutId !== null) clearTimeout(timeoutId);
  };

  el.innerHTML = '';

  function update() {
    if (cancelled) return;

    const settledCount = Math.floor(step / scrambleFramesPerChar);

    if (settledCount >= text.length) {
      el.innerHTML = text;
      return;
    }

    let display = text.slice(0, settledCount);
    for (let i = settledCount; i < text.length; i++) {
      display += text[i] === ' ' ? ' ' : randomChar();
    }

    el.innerHTML = display;
    step++;
    timeoutId = setTimeout(update, stepDuration);
  }

  update();
}