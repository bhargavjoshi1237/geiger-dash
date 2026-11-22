import { CAPTURE, FRAME_FLOATS, IGNITION, LIGHT, MARK, RC, RIM, THEMES, packFrame, rcSize } from "./scene_config.js";
import { createWebGLRenderer } from "./renderer_webgl.js";
import { createWebGPURenderer } from "./renderer_webgpu.js";

// Owns the eclipse canvas: picks a backend, rasterises the mark and animates ignition, pointer light and idle drift.

const state = {
  canvas: null,
  renderer: null,
  paths: [],
  viewBox: [467, 285],
  hover: true,
  capture: false,
  layout: null,
  geometry: null,
  theme: "dark",
  background: [22, 22, 22],
  pointer: null,
  pointerAt: -Infinity,
  running: false,
  light: null,
  start: 0,
  last: 0,
  ready: false,
  scheduled: false,
  failed: false,
};
const frame = new Float32Array(FRAME_FLOATS);

function fail() {
  if (state.failed) return;
  state.failed = true;
  state.running = false;
  state.renderer?.destroy();
  state.renderer = null;
  self.postMessage({ type: "unavailable" });
}

async function pickRenderer(canvas, backend) {
  if (backend !== "webgl") {
    const gpu = await createWebGPURenderer(canvas, { onLost: fail }).catch(() => null);
    if (gpu || backend === "webgpu") return gpu;
  }
  return createWebGLRenderer(canvas, { onLost: fail });
}

// Bars filled red (occluder), with a green LED band stroked around them; `rect` is in CSS px, `scale` maps it to target px.
function rasterMark(width, height, rect, scale, rimPx) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const [vw, vh] = state.viewBox;
  const s = Math.min((rect.w * scale) / vw, (rect.h * scale) / vh);
  const ox = rect.x * scale + (rect.w * scale - vw * s) / 2;
  const oy = rect.y * scale + (rect.h * scale - vh * s) / 2;
  const paths = state.paths.map((d) => new Path2D(d));
  ctx.setTransform(s, 0, 0, s, ox, oy);
  ctx.lineJoin = "round";
  ctx.lineWidth = (rimPx * 2) / s;
  ctx.strokeStyle = "#00ff00";
  for (const path of paths) ctx.stroke(path);
  ctx.fillStyle = "#ff0000";
  for (const path of paths) ctx.fill(path);
  return canvas.transferToImageBitmap();
}

function applyLayout() {
  const { renderer, layout } = state;
  if (!renderer || !layout) return;
  const { width, height, dpr, mark } = layout;
  const canvasWidth = Math.max(1, Math.round(width * dpr));
  const canvasHeight = Math.max(1, Math.round(height * dpr));
  const [rcWidth, rcHeight] = rcSize(width, height);
  renderer.resize({ width: canvasWidth, height: canvasHeight, rcWidth, rcHeight });
  renderer.setMark(
    rasterMark(canvasWidth, canvasHeight, mark, dpr, MARK.rimCss * dpr),
    rasterMark(rcWidth, rcHeight, mark, RC.scale, Math.max(MARK.rimCss * RC.scale, MARK.minRimRc)),
  );
  const [vw, vh] = state.viewBox;
  state.geometry = {
    canvasWidth,
    canvasHeight,
    rcWidth,
    rcHeight,
    dpr,
    centerX: mark.x + mark.w / 2,
    centerY: mark.y + mark.h / 2,
    markWidth: Math.min(mark.w, (mark.h * vw) / vh),
  };
}

function ignition(t) {
  let level = 0;
  for (const [at, value] of IGNITION.keys) if (t >= at) level = value;
  return level;
}

function idlePoint(t, g) {
  return {
    x: g.centerX + Math.sin(t * LIGHT.idleSpeed[0]) * LIGHT.idleRadius[0] * g.markWidth,
    y: g.centerY + Math.sin(t * LIGHT.idleSpeed[1] + 1.1) * LIGHT.idleRadius[1] * g.markWidth,
  };
}

function draw(now) {
  const g = state.geometry;
  const t = state.capture ? CAPTURE.time : (now - state.start) / 1000;
  const dt = Math.min(0.05, Math.max(0, (now - state.last) / 1000));
  state.last = now;

  const idle =
    state.capture || !state.hover || !state.pointer || now - state.pointerAt > LIGHT.idleAfter * 1000;
  const target = idle ? idlePoint(t, g) : state.pointer;
  if (!state.light || state.capture) state.light = { ...target };
  else {
    const k = 1 - Math.exp(-dt / LIGHT.smoothing);
    state.light.x += (target.x - state.light.x) * k;
    state.light.y += (target.y - state.light.y) * k;
  }

  const look = THEMES[state.theme] || THEMES.dark;
  const lightLevel = Math.min(1, Math.max(0, (t - IGNITION.lightDelay) / LIGHT.fadeIn));
  const breathe = 1 + RIM.breathe * Math.sin(t * RIM.breatheSpeed);
  packFrame(
    {
      width: g.canvasWidth,
      height: g.canvasHeight,
      rcWidth: g.rcWidth,
      rcHeight: g.rcHeight,
      markX: g.centerX * g.dpr,
      markY: g.centerY * g.dpr,
      markWidth: g.markWidth * g.dpr,
      contrast: look.contrast,
      lightX: state.light.x * g.dpr,
      lightY: state.light.y * g.dpr,
      lightRadius: LIGHT.radiusCss * g.dpr,
      lightIntensity: state.capture ? 0 : LIGHT.intensity * lightLevel,
      rimIntensity: RIM.intensity * ignition(t) * breathe,
      exposure: look.exposure,
      grain: look.grain,
      grainSeed: state.capture ? 1 : Math.floor(t * 24) % 97,
      background: state.background.map((c) => c / 255),
      ring: look.ring,
      ringStrength: look.ringStrength,
      ringInner: look.ringInner,
      ringOuter: look.ringOuter,
      rcScale: RC.scale / g.dpr,
    },
    frame,
  );
  state.renderer.render(frame);
  if (!state.ready) {
    state.ready = true;
    self.postMessage({ type: "ready" });
  }
}

const nextFrame = self.requestAnimationFrame
  ? (fn) => self.requestAnimationFrame(fn)
  : (fn) => setTimeout(() => fn(performance.now()), 16);

function tick(now) {
  state.scheduled = false;
  if (!state.running || !state.renderer || !state.geometry) return;
  draw(now);
  schedule();
}

function schedule() {
  if (state.scheduled || !state.running || !state.renderer || !state.geometry) return;
  state.scheduled = true;
  nextFrame(tick);
}

self.onmessage = async ({ data }) => {
  switch (data.type) {
    case "init": {
      Object.assign(state, {
        canvas: data.canvas,
        paths: data.paths,
        viewBox: data.viewBox,
        hover: data.hover,
        capture: data.capture,
      });
      state.renderer = await pickRenderer(data.canvas, data.backend);
      if (!state.renderer) return fail();
      state.start = performance.now();
      state.last = state.start;
      applyLayout();
      schedule();
      break;
    }
    case "layout":
      state.layout = data;
      applyLayout();
      schedule();
      break;
    case "theme":
      state.theme = data.theme;
      state.background = data.background;
      break;
    case "pointer":
      state.pointer = data.x === null ? null : { x: data.x, y: data.y };
      state.pointerAt = performance.now();
      break;
    case "run":
      state.running = data.running;
      schedule();
      break;
  }
};
