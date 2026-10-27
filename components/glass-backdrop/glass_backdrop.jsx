"use client";

import { useEffect, useRef, useState } from "react";
import { createGlassRenderer, GLASS_PALETTES } from "./glass_renderer";

// Raycast-style edge treatment: fade the last stretch of the bottom and a thin band on each side into the page.
const EDGE_FADE =
  "linear-gradient(to bottom, #000 72%, transparent), linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

// Resolves any CSS colour (oklch, hex, rgb) to 0-255 RGB by painting it onto a 1px canvas.
function resolveRgb(color) {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = color || "#000";
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
}

// Fluted-glass hero artifact, the animated alternative to GridBackdrop. Position it behind the hero (`absolute inset-0 -z-10`
// inside an `isolate` parent); it stays invisible until WebGL paints and simply never appears without it.
// `?glass=<palette>` previews another palette without a deploy.
export function GlassBackdrop({ palette = "ember", className = "" }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = createGlassRenderer(canvas, { reducedMotion, onFirstFrame: () => setReady(true) });
    if (!renderer) return;

    // Follows next-themes by watching the <html> class, so the scene re-reads --background after the swap, not before.
    const requested = new URLSearchParams(window.location.search).get("glass");
    const ramps = GLASS_PALETTES[requested] || GLASS_PALETTES[palette] || GLASS_PALETTES.ember;
    const root = document.documentElement;
    const applyTheme = () => {
      renderer.setPalette(root.classList.contains("dark") ? ramps.dark : ramps.light);
      renderer.setBackground(resolveRgb(getComputedStyle(root).getPropertyValue("--background").trim()));
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class", "style"] });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resizeObserver = new ResizeObserver(([entry]) => {
      renderer.resize(entry.contentRect.width * dpr, entry.contentRect.height * dpr);
    });
    resizeObserver.observe(canvas);

    // Only animate while the hero is on screen and the tab is visible.
    let onScreen = false;
    const syncLoop = () => (onScreen && !document.hidden ? renderer.start() : renderer.stop());
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncLoop();
    });
    visibilityObserver.observe(canvas);
    document.addEventListener("visibilitychange", syncLoop);

    const onPointerMove = (event) =>
      renderer.setPointer((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      themeObserver.disconnect();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.destroy();
    };
  }, [palette]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default GlassBackdrop;
