// Timing helpers for the film: every value on screen is a pure function of time, so a frame always renders the same.

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from, to, amount) => from + (to - from) * amount;

export const linear = (x) => x;
export const easeOutCubic = (x) => 1 - (1 - x) ** 3;
export const easeInCubic = (x) => x ** 3;
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
export const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const easeOutBack = (x) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;

// CSS-style cubic-bezier, solved for x by Newton's method with a bisection fallback.
export function bezier(x1, y1, x2, y2) {
  const curve = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  const slope = (a, b, t) => 3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t ** 2;
  return (x) => {
    if (x <= 0 || x >= 1) return clamp(x);
    let t = x;
    for (let step = 0; step < 6; step++) {
      const d = slope(x1, x2, t);
      if (Math.abs(d) < 1e-6) break;
      t -= (curve(x1, x2, t) - x) / d;
    }
    if (t < 0 || t > 1 || Math.abs(curve(x1, x2, t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      for (let step = 0; step < 30; step++) {
        t = (lo + hi) / 2;
        if (curve(x1, x2, t) < x) lo = t;
        else hi = t;
      }
    }
    return curve(y1, y2, t);
  };
}

// The house curve: a long, soft settle like Linear's camera moves.
export const glide = bezier(0.22, 0.61, 0.18, 1);
export const swift = bezier(0.65, 0, 0.2, 1);

// 0 → 1 over [start, start + duration], eased.
export const progress = (time, start, duration, ease = easeOutCubic) => ease(clamp((time - start) / duration));

// In, hold, out: 0 → 1 → 0 for an element that appears at `start` and leaves at `end`.
export function presence(time, start, end, fadeIn = 0.5, fadeOut = 0.4) {
  return Math.min(progress(time, start, fadeIn), 1 - progress(time, end, fadeOut, easeInCubic));
}

// Samples numeric keyframes `[{ t, ...values, ease? }]`; each key's `ease` shapes the segment that ends on it.
export function sample(keys, time) {
  if (time <= keys[0].t) return keys[0];
  const last = keys[keys.length - 1];
  if (time >= last.t) return last;
  let index = 1;
  while (keys[index].t < time) index++;
  const from = keys[index - 1];
  const to = keys[index];
  const amount = (to.ease ?? glide)((time - from.t) / (to.t - from.t));
  const out = {};
  for (const key of Object.keys(to)) {
    if (key === "t" || key === "ease") continue;
    out[key] = lerp(from[key] ?? to[key], to[key], amount);
  }
  return out;
}

// Deterministic pseudo-random numbers, so scattered layouts land in the same place on every render.
export function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
