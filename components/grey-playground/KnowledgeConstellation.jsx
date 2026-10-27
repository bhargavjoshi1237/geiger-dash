"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LINKS, NODES, SHAPE_BY_TYPE } from "./knowledge-data";
import { aimAt, drawFrame, layoutGraph, makeDust, shortestTurn } from "./constellation";

const DEGREE = LINKS.reduce((counts, [a, b]) => counts.set(a, (counts.get(a) || 0) + 1).set(b, (counts.get(b) || 0) + 1), new Map());

let layout = null;
const getLayout = () => (layout ??= layoutGraph(NODES, LINKS));

// Any CSS colour (oklch included) to [r, g, b], by painting one pixel and reading it back.
function toRgb(value) {
  const swatch = document.createElement("canvas");
  swatch.width = swatch.height = 1;
  const ctx = swatch.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#808080";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

// Reads the theme off hidden probe elements, so the canvas follows the foreground and background tokens in light and dark.
function resolveColors(root) {
  const read = (selector) => toRgb(getComputedStyle(root.querySelector(selector)).color);
  return { fg: read('[data-role="fg"]'), bg: read('[data-role="bg"]') };
}

// Grey's knowledge graph as a slowly turning 3D constellation: drag to spin, hover for names, click a node to ask about it.
export function KnowledgeConstellation({ focusIds, selectedId, pulsesRef, onSelect, onInteract, className }) {
  const canvasRef = useRef(null);
  const probesRef = useRef(null);
  const engineRef = useRef(null);
  const liveRef = useRef({ focus: null, selectedId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const positions = getLayout();
    const dust = makeDust(220);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const font = getComputedStyle(canvas).fontFamily;
    const engine = { yaw: 0.6, pitch: 0.28, spin: 0, tilt: 0, target: null, drag: null, hoverId: null, projected: [], idleUntil: 0, width: 0, height: 0, dpr: 1 };
    engineRef.current = engine;

    let colors = resolveColors(probesRef.current);
    const recolor = () => {
      colors = resolveColors(probesRef.current);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      engine.dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.width = rect.width;
      engine.height = rect.height;
      canvas.width = Math.round(rect.width * engine.dpr);
      canvas.height = Math.round(rect.height * engine.dpr);
    };
    resize();

    let frameId = 0;
    let last = 0;
    const tick = (now) => {
      const dt = Math.min(48, now - last || 16);
      last = now;
      const { focus, selectedId: selected } = liveRef.current;

      if (engine.target) {
        const ease = reduceMotion.matches ? 1 : 1 - Math.pow(0.9, dt / 16);
        engine.yaw += shortestTurn(engine.yaw, engine.target.yaw) * ease;
        engine.pitch += (engine.target.pitch - engine.pitch) * ease;
      } else if (!engine.drag) {
        engine.yaw += engine.spin;
        engine.pitch += engine.tilt;
        engine.spin *= 0.94;
        engine.tilt *= 0.94;
        if (!reduceMotion.matches && !focus && now > engine.idleUntil) engine.yaw += 0.00011 * dt;
      }
      engine.pitch = Math.max(-1.3, Math.min(1.3, engine.pitch));

      pulsesRef.current = pulsesRef.current.filter((pulse) => now - pulse.start < 1700);

      ctx.setTransform(engine.dpr, 0, 0, engine.dpr, 0, 0);
      engine.projected = drawFrame(ctx, {
        width: engine.width,
        height: engine.height,
        yaw: engine.yaw,
        pitch: engine.pitch,
        positions,
        nodes: NODES,
        links: LINKS,
        dust,
        degree: DEGREE,
        shapes: SHAPE_BY_TYPE,
        colors,
        focus,
        selectedId: selected,
        hoverId: engine.hoverId,
        pulses: pulsesRef.current,
        now,
        font,
      });
      frameId = requestAnimationFrame(tick);
    };

    // Only animate while the frame is on screen.
    let running = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        frameId = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frameId);
      }
    });
    visibility.observe(canvas);

    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);
    const theme = new MutationObserver(recolor);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    darkScheme.addEventListener("change", recolor);

    return () => {
      cancelAnimationFrame(frameId);
      visibility.disconnect();
      sizing.disconnect();
      theme.disconnect();
      darkScheme.removeEventListener("change", recolor);
    };
  }, [pulsesRef]);

  // Mirror the props into the loop and turn the camera toward whatever is in focus.
  useEffect(() => {
    liveRef.current = { focus: focusIds?.length ? new Set(focusIds) : null, selectedId };
    const engine = engineRef.current;
    if (!engine) return;
    if (!focusIds?.length) {
      engine.target = null;
      return;
    }
    const positions = getLayout();
    const centre = focusIds.reduce(
      (sum, id) => {
        const point = positions.get(id);
        return point ? { x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z } : sum;
      },
      { x: 0, y: 0, z: 0 },
    );
    engine.target = Math.hypot(centre.x, centre.y, centre.z) > 0.001 ? aimAt(centre) : null;
  }, [focusIds, selectedId]);

  const pointer = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const hitTest = ({ x, y }) => {
    const list = engineRef.current?.projected || [];
    for (let i = list.length - 1; i >= 0; i -= 1) {
      const p = list[i];
      if (Math.hypot(p.x - x, p.y - y) <= (p.radius || 4) + 7) return p.node.id;
    }
    return null;
  };

  const handlePointerDown = (event) => {
    const engine = engineRef.current;
    if (!engine) return;
    const point = pointer(event);
    engine.drag = { id: event.pointerId, x: point.x, y: point.y, startX: point.x, startY: point.y, moved: false };
    engine.spin = 0;
    engine.tilt = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    onInteract?.();
  };

  const handlePointerMove = (event) => {
    const engine = engineRef.current;
    if (!engine) return;
    const point = pointer(event);
    const drag = engine.drag;
    if (drag && drag.id === event.pointerId) {
      const dx = point.x - drag.x;
      const dy = point.y - drag.y;
      if (Math.hypot(point.x - drag.startX, point.y - drag.startY) > 4) {
        drag.moved = true;
        engine.target = null;
      }
      if (drag.moved) {
        engine.yaw += dx * 0.006;
        engine.pitch += dy * 0.006;
        engine.spin = dx * 0.006;
        engine.tilt = dy * 0.006;
      }
      drag.x = point.x;
      drag.y = point.y;
      return;
    }
    engine.hoverId = hitTest(point);
    event.currentTarget.style.cursor = engine.hoverId ? "pointer" : "grab";
  };

  const endDrag = (event, cancelled = false) => {
    const engine = engineRef.current;
    const drag = engine?.drag;
    if (!drag || drag.id !== event.pointerId) return;
    engine.drag = null;
    engine.idleUntil = performance.now() + 2500;
    if (!drag.moved && !cancelled) onSelect?.(hitTest(pointer(event)));
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Kestrel Aero's knowledge graph. Drag to spin it, or click a node to ask Grey about it."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event)}
        onPointerCancel={(event) => endDrag(event, true)}
        onPointerLeave={() => {
          if (engineRef.current) engineRef.current.hoverId = null;
        }}
        className={cn("block h-full w-full cursor-grab touch-pan-y select-none", className)}
      />
      <div ref={probesRef} className="hidden" aria-hidden="true">
        <span data-role="fg" className="text-foreground" />
        <span data-role="bg" className="text-background" />
      </div>
    </>
  );
}
