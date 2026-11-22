# Eclipse hero — `/landing-v2`

**Date:** 2026-11-22
**Status:** Approved, implementing

A Vercel-style backlit-mark hero for the landing preview: the Geiger mark's three bars sit
black in front of light computed with 2D global illumination (radiance cascades), with the
pointer acting as a second light whose soft shadows sweep across the hero. Replaces the
fluted-glass hero on `/landing-v2` only; `/` is untouched.

---

## 1. Layout

- Desktop (`lg`+): scene fills the hero behind the copy. Left: "Built to Manage. Designed to
  Create" + the existing `Log in to Start` / `Why Geiger` CTAs. Centre: the mark (~300px wide).
  Right: three lines, "One sign-in / One team / One bill". Hero is near full viewport height
  (`min(100svh, 1000px)`); the suite header overlays it as today.
- Mobile: the scene block sits on top (~60% of the visual height), copy stacks below.
- The scene is `aria-hidden`; the `h1` and CTAs stay real DOM.

## 2. Look

- Each bar's outline is an LED emitter; the bar fills are black occluders. Light radiates,
  falls off softly and is blocked by the bars; the two gaps glow brightest (two facing rims).
- Grain is weighted by brightness so dark areas stay clean.
- Dark theme: fluence maps from the page background (`#161616`, read from `--background`) to
  white; edges fade into the page with no visible box.
- Light theme: page-white field, a soft grey falloff ring around the mark, pure-white halo at
  the rims; edges fade to page white.
- Monochrome only, per `/pallet`.

## 3. Motion & interaction

- Ignition: the rims switch on with a short neon-start flicker (~900ms).
- Pointer: a soft disc light follows the pointer (eased) while it is over the hero; the bars
  cast soft shadows from it.
- Idle / touch: after ~3s without pointer movement, or on devices without hover, the light
  drifts on a slow Lissajous path around the mark.
- `prefers-reduced-motion`: the static image only; the worker never starts.
- Paused while the hero is off screen or the tab is hidden.

## 4. Architecture

- `eclipse_scene.jsx` (client): renders the static fallback image (dark/light), rasterises
  the `<Logo />` SVG into an `ImageBitmap` at canvas resolution, transfers the canvas to an
  `OffscreenCanvas` worker, and forwards resize / pointer / theme / visibility messages. The
  canvas fades in over the image when the worker reports its first frame.
- `eclipse.worker.js`: picks a backend (WebGPU → WebGL2 → reports "unavailable"), owns the
  frame loop and the animated state (pointer smoothing, ignition, idle path).
- Backends implement the same passes, in WGSL (`renderer_webgpu.js`) and GLSL ES 3.0
  (`renderer_webgl.js`):
  1. **Scene**: emission (rims + pointer disc) in RGB, occlusion (bar fills) in A.
  2. **Distance field**: jump-flood seed → log2 passes → distance to nearest occluder/emitter.
  3. **Radiance cascades**: N cascades at half resolution, raymarched against the distance
     field, merged top-down into per-pixel fluence.
  4. **Composite**: theme ramp, edge fade, brightness-weighted grain, black bars on top.
- `scene_config.js` holds every shared parameter (cascade count, base interval, rim width,
  light sizes, ramps, timings) so the two backends cannot drift.
- `?eclipse=webgpu|webgl|static` forces a backend for testing.
- Context loss or a backend error drops back to the static image.

## 5. Static fallback

`public/images/eclipse/eclipse-dark.webp` and `eclipse-light.webp`, captured from the real
renderer (idle light parked at a fixed position, no copy) via `?eclipse=capture`, so the
fallback matches the live scene. Shown on first paint, under reduced motion, and when no
GPU backend is available.

## 6. Files

| File | Role |
| --- | --- |
| `components/eclipse-hero/eclipse_hero.jsx` | Server: layout, copy, CTAs |
| `components/eclipse-hero/eclipse_scene.jsx` | Client: fallback, canvas, worker, events |
| `components/eclipse-hero/eclipse.worker.js` | Worker: backend choice, loop, animation state |
| `components/eclipse-hero/renderer_webgpu.js` | WGSL passes |
| `components/eclipse-hero/renderer_webgl.js` | GLSL passes |
| `components/eclipse-hero/scene_config.js` | Shared parameters |
| `public/images/eclipse/*.webp` | Static fallback |

## 7. Verification

`/landing-v2` in dark and light, with each `?eclipse=` backend, with reduced motion emulated,
and at phone width; a production build to confirm the worker chunk is emitted.

## Out of scope

Drag-and-drop on the mark, click effects, moving the component into `@geiger/ui`, shipping it
on `/`.
