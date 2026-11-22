# Eclipse Hero Implementation Plan

> **For agentic workers:** executed inline in the session that wrote it (the user asked to implement straight after approving the spec). Shader code lives in the files, not here; this plan pins the interfaces, the algorithm and the order of work.

**Goal:** Replace the fluted-glass hero on `/landing-v2` with the Geiger mark lit by 2D global illumination (radiance cascades), per `docs/superpowers/specs/2026-11-22-eclipse-hero-design.md`.

**Architecture:** A server hero renders copy plus a client `EclipseScene`. The scene shows a static capture, then hands an `OffscreenCanvas` to a module worker that renders with WebGPU, falling back to WebGL2. Both backends run the same passes from one shared parameter file and one packed uniform layout.

**Tech Stack:** Next 16 (Turbopack module workers via `new Worker(new URL(..., import.meta.url))`), WebGPU/WGSL, WebGL2/GLSL ES 3.0, OffscreenCanvas 2D `Path2D` for the mark, Tailwind.

## Global Constraints

- `/landing-v2` only; `/` untouched. Monochrome only.
- Mark path data comes from the rendered `@geiger/ui` `<Logo />` (`path[d]`), never a second copy.
- `prefers-reduced-motion: reduce` → static image, worker never starts.
- `?eclipse=webgpu|webgl|static|capture` overrides the backend.
- Single-line comments, snake_case filenames in `components/eclipse-hero/`.

---

## Shared contract

**Uniform block `Frame`** (std140 == WGSL uniform layout, 8 × vec4 = 128 bytes), packed by `packFrame(frame) → Float32Array(32)` in `scene_config.js`:

| vec4 | x | y | z | w |
| --- | --- | --- | --- | --- |
| `size` | canvas w | canvas h | rc w | rc h |
| `mark` | centre x | centre y | width | rim contrast |
| `light` | x | y | radius | intensity |
| `look` | rim intensity | rim exposure | grain | grain seed |
| `background` | r | g | b | — |
| `ring` | r | g | b | strength |
| `fade` | ring inner (mark widths) | ring outer (mark widths) | edge (fraction) | rc scale (rc px per canvas px) |
| `lamp` | pointer exposure | pointer contrast | — | — |

Rim light travels in the R channel and the pointer light in G, so the composite curves them separately: tight for the rims, gentle for the pointer so its shadows reach.

All positions are canvas pixels; colours are 0–1 linear-ish sRGB.

**Renderer interface** (both backends):

```js
const r = await createWebGPURenderer(canvas, { onLost, preserve })  // or createWebGLRenderer; null when unavailable
r.resize({ width, height, rcWidth, rcHeight })   // canvas px, rc px (rc dims are multiples of 2^cascades)
r.setMark(hi, lo)                                // ImageBitmaps: R = bar fill, G = rim band; hi at canvas px, lo at rc px
r.render(frameArray)                             // Float32Array(28) from packFrame
r.destroy()
```

**Worker messages** (main → worker): `init {canvas, backend, paths, viewBox, hover, capture}`, `layout {width, height, dpr, mark: {x, y, w, h}}` (CSS px, relative to canvas), `theme {theme, background}`, `pointer {x, y} | {x: null}`, `run {running}`. Worker → main: `ready` (first frame drawn), `unavailable`.

**Passes per frame** (rc = half CSS resolution, rounded up to a multiple of 2^5):

1. Scene (rc): R = bars + LED band × flicker (the whole bar emits so the rim can't alias into gaps), G = pointer disc, A = solid.
2. JFA seed (rc, rg32float): solid texel → own centre, else sentinel.
3. JFA steps (rc): step = 2^k … 1, nine taps, keep nearest seed.
4. Cascades 4 → 0 (rc, rgba16float, direction-first layout): cascade i has block side d = 2^(i+1), d² rays, interval [2·(4^i − 1)/3, 2·(4^(i+1) − 1)/3]; sphere-trace against the seed distance; on a miss add the bilinear average of the 4 child rays from cascade i + 1.
5. Composite (canvas): manual bilinear over cascade 0 that skips probes inside a bar → fluence (R, G); base = mix(background, ring, radial ring mask capped to the canvas); lit = screen(1 − e^(−(R + crisp rim)^c·e), 1 − e^(−G^c'·e')); colour = mix(base, white, lit) + mid-tone grain; edge fade; bars black.

---

### Task 1: Config, hero layout and page swap

**Files:** Create `components/eclipse-hero/scene_config.js`, `components/eclipse-hero/eclipse_hero.jsx`, `components/eclipse-hero/eclipse_scene.jsx` (DOM mark + static slot only). Modify `app/landing-v2/page.js` (hero section → `<EclipseHero />`, drop `GlassBackdrop` import).

- [ ] Write `scene_config.js` (RC, MARK, LIGHT, RIM, IGNITION, THEMES, FADE, CAPTURE, `packFrame`, `rcSize`).
- [ ] Write the hero: copy left, scene centre, three lines right at `xl`; stacked below `xl`; `--eclipse-mark` sizes the mark.
- [ ] Load `/landing-v2` on the dev server and screenshot at 1440×900 and 390×844 via the CDP script; the layout holds with the bare mark.

### Task 2: Worker + WebGL2 backend + client wiring

**Files:** Create `components/eclipse-hero/eclipse.worker.js`, `components/eclipse-hero/renderer_webgl.js`; complete `eclipse_scene.jsx`.

- [ ] Worker: backend choice, mark rasterisation (`Path2D`, rim stroke then fill), animation state (ignition, pointer smoothing, idle Lissajous), loop with `requestAnimationFrame` (fallback `setTimeout`).
- [ ] WebGL2 renderer implementing the five passes; require `EXT_color_buffer_float`; context loss → `onLost`.
- [ ] Client: transfer canvas, observers (resize, theme, visibility, intersection), pointer forwarding, fade-in on `ready`, static on `unavailable`.
- [ ] Screenshot `?eclipse=webgl` dark and light; tune `scene_config.js` until the rims, gap glow and shadows read.

### Task 3: WebGPU backend

**Files:** Create `components/eclipse-hero/renderer_webgpu.js`.

- [ ] Same passes in WGSL with render pipelines; adapter/device requested before `getContext("webgpu")` so WebGL2 can still take the canvas on failure; `device.lost` → `onLost`.
- [ ] Screenshot `?eclipse=webgpu` (headless with `--enable-unsafe-webgpu`) and compare with the WebGL2 capture.

### Task 4: Static fallback

**Files:** Create `public/images/eclipse/eclipse-dark.webp`, `public/images/eclipse/eclipse-light.webp`; wire into `eclipse_scene.jsx`.

- [ ] `?eclipse=capture&theme=dark|light` renders a fixed 1200×800 scene (mark 300px, light parked, no copy); screenshot via CDP, convert with ffmpeg.
- [ ] Show the matching image under the canvas; check `?eclipse=static` and reduced motion.

### Task 5: Verify

- [ ] `pnpm lint` on the new files.
- [ ] `pnpm build` — the worker chunk is emitted and `/landing-v2` stays static.
- [ ] Final screenshots: dark, light, phone width, reduced motion.
