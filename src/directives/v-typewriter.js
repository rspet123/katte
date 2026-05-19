export default {
  beforeMount(el, binding) {
    startWatching(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value?.text === binding.oldValue?.text) return;
    if (el._typewriterCancel) el._typewriterCancel();
    if (el._typewriterObserver) el._typewriterObserver.disconnect();
    startWatching(el, binding.value);
  },
  unmounted(el) {
    if (el._typewriterCancel) el._typewriterCancel();
    if (el._typewriterObserver) el._typewriterObserver.disconnect();
  },
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS  = '0123456789';

function randomChar(original) {
  if (/[0-9]/.test(original)) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  const pool = /[A-Z]/.test(original) ? LETTERS.slice(26) : LETTERS.slice(0, 26);
  return pool[Math.floor(Math.random() * pool.length)];
}

function startWatching(el, options) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      startTyping(el, options);
    },
    { threshold: 0.1 },
  );
  el._typewriterObserver = observer;
  observer.observe(el);
}

function startTyping(el, { text, seconds }) {
  const scrambleFramesPerChar = 5;
  const stepDuration = (seconds * 1000) / (text.length * scrambleFramesPerChar);
  let step = 0;
  let cancelled = false;
  let timeoutId = null;

  // Measure each character's width (including letter-spacing / kerning) by
  // diffing cumulative widths of text.slice(0, i+1) − text.slice(0, i).
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;';
  el.appendChild(probe);
  const cumWidths = [];
  for (let i = 0; i <= text.length; i++) {
    probe.textContent = text.slice(0, i).replace(/ /g, '\u00A0');
    cumWidths.push(probe.getBoundingClientRect().width);
  }
  const charWidths = text.split('').map((_, i) => Math.max(cumWidths[i + 1] - cumWidths[i], 0));
  probe.remove();

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

    let html = '';
    for (let i = 0; i < text.length; i++) {
      const w = charWidths[i];
      let char, glow = '';
      if (i < settledCount || !/[a-zA-Z0-9]/.test(text[i])) {
        char = text[i] === ' ' ? '&nbsp;' : text[i];
      } else {
        char = randomChar(text[i]);
      }
      if (i === settledCount) {
        glow = 'text-shadow:0 0 6px currentColor,0 0 16px currentColor;';
      }
      html += `<span style="display:inline-block;width:${w}px;text-align:center;${glow}">${char}</span>`;
    }

    el.innerHTML = html;
    step++;
    timeoutId = setTimeout(update, stepDuration);
  }

  update();
}