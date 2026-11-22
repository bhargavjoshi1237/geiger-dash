// Shared tuning for the eclipse hero; the worker and both GPU backends read it so the renderers cannot drift.

// Radiance cascades run at half CSS resolution; five cascades reach ~680 rc px, well past the hero's faded edges.
export const RC = { scale: 0.5, cascades: 5, interval0: 2, maxSteps: 24 };

// LED band stroked around each bar (CSS px); the rc copy never drops under 1.5 rc px so rays can't slip past it.
export const MARK = { rimCss: 2.5, minRimRc: 1.5 };

export const RIM = { intensity: 2.4, breathe: 0.05, breatheSpeed: 0.9 };

// Pointer light: a soft disc that eases toward the pointer, or wanders a slow Lissajous path when idle. It travels in its
// own channel with a gentler curve than the rims, so its light (and the bars' shadows) reach past the tight rim glow.
export const LIGHT = {
  radiusCss: 18,
  intensity: 1.1,
  exposure: 1.6,
  contrast: 1.25,
  smoothing: 0.12,
  idleAfter: 3,
  idleRadius: [0.9, 0.55],
  idleSpeed: [0.17, 0.23],
  fadeIn: 0.8,
};

// Neon-start ignition as [seconds, level] steps, each held until the next key; the pointer light follows after `lightDelay`.
export const IGNITION = {
  keys: [
    [0, 0],
    [0.12, 0.55],
    [0.2, 0.05],
    [0.34, 0.8],
    [0.42, 0.15],
    [0.6, 1],
  ],
  lightDelay: 0.7,
};

// `ring` is the pool behind the mark (a darker well on dark pages, a grey falloff on light ones); `contrast` steepens
// the 2D falloff, which is only ~1/r on its own, so the glow hugs the mark instead of greying the whole hero.
// Ring radii are in mark widths.
export const THEMES = {
  dark: { ring: [0, 0, 0], ringStrength: 0.75, ringInner: 0.7, ringOuter: 2.6, exposure: 0.3, contrast: 2.3, grain: 0.08 },
  light: { ring: [0.8, 0.8, 0.81], ringStrength: 1, ringInner: 0.3, ringOuter: 1.35, exposure: 0.9, contrast: 2.3, grain: 0.05 },
};

// Share of the canvas' shorter side faded into the page at its edges.
export const FADE = { edge: 0.1 };

// `?eclipse=capture` frame for the static fallback: fixed size, ignition finished, pointer light off.
export const CAPTURE = {
  width: 1200,
  height: 800,
  mark: 300,
  time: 4.2,
  backgrounds: { dark: [22, 22, 22], light: [255, 255, 255] },
};

export const FRAME_FLOATS = 32;

// Rounds the rc grid up so every cascade's direction blocks tile it exactly.
export function rcSize(cssWidth, cssHeight) {
  const block = 2 ** RC.cascades;
  return [
    Math.max(block, Math.ceil((cssWidth * RC.scale) / block) * block),
    Math.max(block, Math.ceil((cssHeight * RC.scale) / block) * block),
  ];
}

// Packs the `Frame` uniform block (8 × vec4, std140 == WGSL layout) shared by both backends.
export function packFrame(f, out = new Float32Array(FRAME_FLOATS)) {
  out.set([
    f.width, f.height, f.rcWidth, f.rcHeight,
    f.markX, f.markY, f.markWidth, f.contrast,
    f.lightX, f.lightY, f.lightRadius, f.lightIntensity,
    f.rimIntensity, f.exposure, f.grain, f.grainSeed,
    f.background[0], f.background[1], f.background[2], 0,
    f.ring[0], f.ring[1], f.ring[2], f.ringStrength,
    f.ringInner, f.ringOuter, FADE.edge, f.rcScale,
    LIGHT.exposure, LIGHT.contrast, 0, 0,
  ]);
  return out;
}
