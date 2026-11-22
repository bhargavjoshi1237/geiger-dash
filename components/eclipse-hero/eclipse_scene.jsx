"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "@geiger/ui/logo";
import { CAPTURE } from "@/components/eclipse-hero/scene_config";

// Resolves any CSS colour (oklch, hex, rgb) to 0-255 RGB by painting it onto a 1px canvas.
function resolveRgb(color) {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = color || "#000";
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
}

// Backlit Geiger mark: a worker lights the bars with radiance cascades (WebGPU, else WebGL2) over a static capture.
// `?eclipse=webgpu|webgl|static` forces a backend; `?eclipse=capture&theme=dark|light` renders the fallback frame.
export function EclipseScene() {
  const rootRef = useRef(null);
  const surfaceRef = useRef(null);
  const markRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    const svg = markRef.current?.querySelector("svg");
    if (!root || !surface || !svg) return;

    const params = new URLSearchParams(window.location.search);
    const requested = params.get("eclipse");
    const capture = requested === "capture" ? (params.get("theme") === "light" ? "light" : "dark") : null;
    if (capture) root.dataset.capture = capture;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (requested === "static" || (reducedMotion && !capture)) return;

    // A fresh canvas per mount: a canvas can only hand its control to one worker, ever.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 size-full";
    if (typeof canvas.transferControlToOffscreen !== "function") return;
    surface.appendChild(canvas);

    const worker = new Worker(new URL("./eclipse.worker.js", import.meta.url), { type: "module" });
    const fail = () => {
      setLive(false);
      worker.terminate();
    };
    worker.onmessage = ({ data }) => {
      if (data.type === "ready") setLive(true);
      if (data.type === "unavailable") fail();
    };
    worker.onerror = fail;

    const offscreen = canvas.transferControlToOffscreen();
    const viewBox = svg.viewBox.baseVal;
    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        backend: requested === "webgpu" || requested === "webgl" ? requested : null,
        paths: Array.from(svg.querySelectorAll("path"), (path) => path.getAttribute("d")),
        viewBox: [viewBox.width, viewBox.height],
        hover: window.matchMedia("(hover: hover)").matches,
        capture: Boolean(capture),
      },
      [offscreen],
    );

    const sendLayout = () => {
      const box = canvas.getBoundingClientRect();
      const mark = svg.getBoundingClientRect();
      if (!box.width || !box.height) return;
      worker.postMessage({
        type: "layout",
        width: box.width,
        height: box.height,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        mark: { x: mark.left - box.left, y: mark.top - box.top, w: mark.width, h: mark.height },
      });
    };
    const resizeObserver = new ResizeObserver(sendLayout);
    resizeObserver.observe(canvas);
    resizeObserver.observe(svg);

    // Follows next-themes through the <html> class, re-reading --background after each swap.
    const html = document.documentElement;
    const sendTheme = () => {
      const theme = capture ?? (html.classList.contains("dark") ? "dark" : "light");
      const background = capture
        ? CAPTURE.backgrounds[capture]
        : resolveRgb(getComputedStyle(html).getPropertyValue("--background").trim());
      worker.postMessage({ type: "theme", theme, background });
    };
    sendTheme();
    const themeObserver = new MutationObserver(sendTheme);
    themeObserver.observe(html, { attributes: true, attributeFilter: ["class", "style"] });

    // Hover pointers only; touch devices get the idle drift instead of a light that jumps to each tap.
    let inside = false;
    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const within = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
      if (within) worker.postMessage({ type: "pointer", x, y });
      else if (inside) worker.postMessage({ type: "pointer", x: null });
      inside = within;
    };
    const onPointerLeave = () => {
      inside = false;
      worker.postMessage({ type: "pointer", x: null });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    html.addEventListener("pointerleave", onPointerLeave);

    // Only render while the hero is on screen and the tab is visible.
    let onScreen = false;
    const syncRunning = () => worker.postMessage({ type: "run", running: onScreen && !document.hidden });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncRunning();
    });
    visibilityObserver.observe(canvas);
    document.addEventListener("visibilitychange", syncRunning);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      html.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", syncRunning);
      worker.terminate();
      canvas.remove();
      setLive(false);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden data-[capture]:fixed data-[capture]:z-[100] data-[capture]:[--eclipse-mark:300px] data-[capture=dark]:bg-[#161616] data-[capture=light]:bg-white"
    >
      {/* Captured from the live scene at 4 mark widths across (1200×800 around a 300px mark); its edges are the page colour. */}
      <div className="absolute top-1/2 left-1/2 aspect-[3/2] w-[calc(var(--eclipse-mark)*4)] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/images/eclipse/eclipse-dark.webp"
          alt=""
          width={1200}
          height={800}
          loading="eager"
          sizes="(min-width: 1280px) 1280px, 176vw"
          className="hidden size-full dark:block"
        />
        <Image
          src="/images/eclipse/eclipse-light.webp"
          alt=""
          width={1200}
          height={800}
          loading="eager"
          sizes="(min-width: 1280px) 1280px, 176vw"
          className="size-full dark:hidden"
        />
      </div>
      <div
        ref={surfaceRef}
        className={`absolute inset-0 transition-opacity duration-700 ease-linear in-data-[capture]:transition-none ${live ? "opacity-100" : "opacity-0"}`}
      />
      <div ref={markRef} className="absolute top-1/2 left-1/2 w-(--eclipse-mark) -translate-x-1/2 -translate-y-1/2 text-black">
        <Logo className="block h-auto w-full" />
      </div>
    </div>
  );
}

export default EclipseScene;
