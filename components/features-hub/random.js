// Deterministic randomness for the features hub, so server and client draw the same "random" layout.

// FNV-1a: a small, stable 32-bit hash of a string.
export function hashString(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// mulberry32: returns a () => [0, 1) generator seeded from a number or string.
export function seededRandom(seed) {
  let state = typeof seed === "string" ? hashString(seed) : seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SCRAMBLE_GLYPHS = "abdfghijklmnopqstvwxyz0123456789*&^%$#@!*()";

// A resting scrambled version of `text`, the same on every render for a given seed.
export function scrambleText(text, seed) {
  const random = seededRandom(seed);
  return text
    .split("")
    .map(() => SCRAMBLE_GLYPHS[Math.floor(random() * SCRAMBLE_GLYPHS.length)])
    .join("");
}
