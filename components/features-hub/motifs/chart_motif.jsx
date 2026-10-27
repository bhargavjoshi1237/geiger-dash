"use client";

import { useEffect, useRef } from "react";
import { Fit } from "@/components/features-hub/motion";

const W = 520;
const H = 250;

const SERIES = {
  analytics: {
    main: [0.16, 0.24, 0.21, 0.32, 0.36, 0.34, 0.47, 0.55, 0.51, 0.64, 0.74, 0.9],
    ghost: [0.1, 0.14, 0.19, 0.21, 0.26, 0.3, 0.32, 0.37, 0.41, 0.45, 0.49, 0.55],
    label: "registrations",
    format: (v) => Math.round(180 + v * 1460).toLocaleString("en-US"),
  },
  pricing: {
    main: [0.2, 0.2, 0.26, 0.26, 0.34, 0.42, 0.42, 0.55, 0.61, 0.61, 0.76, 0.84],
    ghost: [0.62, 0.58, 0.55, 0.5, 0.47, 0.41, 0.37, 0.31, 0.26, 0.22, 0.17, 0.12],
    label: "ticket price",
    format: (v) => `$${Math.round(32 + v * 52)}`,
  },
};

const toPoint = (value, index, list) => [(index / (list.length - 1)) * W, H - 18 - value * (H - 44)];

// Catmull-Rom through the points, emitted as cubic Béziers, so the line reads as a smooth trend.
function smoothPath(values) {
  const points = values.map(toPoint);
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [p0, p1, p2, p3] = [points[i - 1] || points[i], points[i], points[i + 1], points[i + 2] || points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const valueAt = (values, pct) => {
  const position = (pct / 100) * (values.length - 1);
  const low = Math.floor(position);
  const high = Math.min(values.length - 1, low + 1);
  return values[low] + (values[high] - values[low]) * (position - low);
};

// Linear's Building card: the chart is clipped to the pointer and two dots ride the lines with it.
export function ChartMotif({ variant, inView, cardRef, reducedMotion }) {
  const series = SERIES[variant] || SERIES.analytics;
  const mainPath = smoothPath(series.main);
  const ghostPath = smoothPath(series.ghost);
  const svgRef = useRef(null);
  const dotRefs = useRef([]);
  const chipRef = useRef(null);
  const valueRef = useRef(null);
  const motion = useRef({ current: 100, target: 100, frame: 0, drawn: false });

  useEffect(() => {
    const state = motion.current;
    const paint = () => {
      const pct = state.current;
      if (svgRef.current) svgRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      dotRefs.current.forEach((dot) => dot && (dot.style.offsetDistance = `${pct}%`));
      if (chipRef.current) {
        chipRef.current.style.offsetDistance = `${pct}%`;
        // Slide the chip from right-of-dot to left-of-dot so it never hangs off either end.
        chipRef.current.style.translate = `${50 - pct}% -32px`;
      }
      if (valueRef.current) valueRef.current.textContent = series.format(valueAt(series.main, pct));
    };
    const step = () => {
      state.current += (state.target - state.current) * (state.target === 100 ? 0.06 : 0.16);
      if (Math.abs(state.target - state.current) < 0.05) state.current = state.target;
      paint();
      state.frame = state.current === state.target ? 0 : requestAnimationFrame(step);
    };
    state.goTo = (target) => {
      state.target = target;
      if (reducedMotion) {
        state.current = target;
        paint();
      } else if (!state.frame) {
        state.frame = requestAnimationFrame(step);
      }
    };
    paint();
    return () => cancelAnimationFrame(state.frame);
  }, [series, reducedMotion]);

  // Draw the line in the first time the card scrolls into view.
  useEffect(() => {
    const state = motion.current;
    if (!inView || state.drawn) return;
    state.drawn = true;
    if (reducedMotion) return;
    state.current = 0;
    state.goTo(100);
  }, [inView, reducedMotion]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const onMove = (event) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect || event.clientX < rect.left) return;
      motion.current.goTo?.(Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    };
    const onLeave = () => motion.current.goTo?.(100);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [cardRef]);

  return (
    <Fit width={W} height={H}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 overflow-visible text-foreground">
        {[0.25, 0.5, 0.75].map((row) => (
          <line key={row} x1="0" x2={W} y1={H * row} y2={H * row} stroke="currentColor" strokeOpacity="0.07" strokeDasharray="3 5" />
        ))}
      </svg>
      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 overflow-visible text-foreground">
        <defs>
          <linearGradient id={`chart-ghost-${variant}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="0.75" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`chart-main-${variant}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="var(--ink)" stopOpacity="0.28" />
            <stop offset="0.8" stopColor="var(--ink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${ghostPath} L${W} ${H} L0 ${H} Z`} fill={`url(#chart-ghost-${variant})`} />
        <path d={ghostPath} stroke="currentColor" strokeOpacity="0.22" strokeWidth="2.5" />
        <path d={`${mainPath} L${W} ${H} L0 ${H} Z`} fill={`url(#chart-main-${variant})`} />
        <path d={mainPath} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {[ghostPath, mainPath].map((path, index) => (
        <span
          key={path}
          ref={(node) => {
            dotRefs.current[index] = node;
          }}
          className={`absolute top-0 left-0 size-3 rounded-full ${index ? "bg-(--ink) ring-4 ring-(--ink)/20" : "bg-surface-strong"}`}
          style={{ offsetPath: `path("${path}")`, offsetDistance: "100%" }}
        />
      ))}
      <span
        ref={chipRef}
        className="absolute top-0 left-0 flex items-baseline gap-1.5 rounded-full border border-border bg-surface-card px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-foreground shadow-sm"
        style={{ offsetPath: `path("${mainPath}")`, offsetDistance: "100%", offsetRotate: "0deg", translate: "-50% -32px" }}
      >
        <span ref={valueRef} className="font-semibold">
          {series.format(series.main.at(-1))}
        </span>
        <span className="text-muted-foreground">{series.label}</span>
      </span>
    </Fit>
  );
}
