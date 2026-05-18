/**
 * Generates a random polygon clip-path string.
 * Returns a value suitable for `element.style.clipPath`.
 */
export const generateClipPath = () => {
  const number = Math.max(3, Math.floor(Math.random() * 60));
  const points = [];
  let x = 0;
  let y = 0;

  for (let i = 0; i < number; i++) {
    if (i % 2) {
      x = Math.floor(Math.random() * 100);
    } else {
      y = Math.floor(Math.random() * 100);
    }
    points.push(`${x}% ${y}%`);
  }

  return `polygon(${points.join(", ")})`;
};
