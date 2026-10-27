"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { easeInCubic, glide, progress, swift } from "@/components/film/ease";
import styles from "@/components/film/film.module.css";

// Set pieces shared by the film's shots: the bare stage, the Geiger mark and a bloom of light.

export function Stage({ className }) {
  return <div className={cn(styles.stage, className)} />;
}

// The three slashes of the suite header's logo (public/logo1.svg), one path per stroke, left to right.
export const STROKES = [
  "M218.309 1.31216L224 1.15608L193.641 50.3271L170.178 91.0997L136.561 149.51L124.008 172.428L103.37 206.726L77.2097 251.035L57.3197 283.677L6.18221 283.433L0 284.156L22.4687 244.331L54.6016 189.816L75.3213 152.467L94.3273 119.376L144.096 31L161 1.15608L218.309 1.31216Z",
  "M344.758 0L345.096 0.735049C326.643 33.9528 307.753 66.9251 288.428 99.6433C284.236 106.683 278.484 114.061 274.613 121.064C265.581 137.399 256.332 153.496 247.097 169.697L208.592 236.882C199.377 253.009 192.444 267.92 180.666 282.525C163.285 284.093 142.445 282.6 123.432 284L123.098 283.728C123.005 282.163 127.788 276.233 129.062 273.917C135.826 261.605 142.61 249.297 149.637 237.134L240.526 79.7429C249.025 64.9272 257.723 50.1984 266.187 35.3414C268.992 30.4177 277.596 15 285.096 0.735052C305.596 0.735046 325.596 0.735049 344.131 0.1168L344.758 0Z",
  "M427.054 1.17427C431.046 1.15338 464.984 0.670938 466.079 1.40804C466.298 4.01125 464.421 3.92073 463.267 6.18971C450.436 31.3381 435.978 55.3181 422.003 79.8289L339.669 223C327.843 243.287 317.065 263.871 304.413 283.952L285.161 283.494C273.521 283.311 254.97 282.561 244.096 284C255.18 269.451 265.622 246.845 275.646 231.004C280.056 224.033 284.971 216.613 289.146 209.596C302.879 186.047 316.389 162.368 329.675 138.564C346.203 109.513 363.065 80.653 380.256 51.9898C390.11 35.4483 398.71 17.3651 409.366 1.55774C415.08 1.29513 421.301 1.29165 427.054 1.17427Z",
];

// The mark builds stroke by stroke, each sliding up its own diagonal into place; `out` sends it back down.
export function GeigerMark({ at = 0, out = Infinity, stagger = 0.09, height = 140, className }) {
  const refs = useRef([]);
  useFrame((local) => {
    refs.current.forEach((node, index) => {
      if (!node) return;
      const enter = progress(local, at + index * stagger, 0.75, swift);
      const leave = progress(local, out + index * stagger * 0.5, 0.4, easeInCubic);
      const travel = (1 - enter) * 120 + leave * 60;
      node.style.opacity = enter * (1 - leave);
      node.style.transform = `translate(${-travel * 0.79}px, ${travel}px)`;
    });
  });
  return (
    <svg viewBox="0 0 467 285" style={{ height }} className={cn("overflow-visible text-foreground", className)} aria-hidden="true">
      {STROKES.map((path, index) => (
        <path
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          d={path}
          fill="currentColor"
          opacity="0"
        />
      ))}
    </svg>
  );
}

// A soft bloom that swells and settles, for the moment something important lands.
export function Bloom({ at = 0, size = 900, strength = 0.22, color = "var(--foreground)", className }) {
  const ref = useRef(null);
  useFrame((local) => {
    const swell = progress(local, at, 0.35, glide);
    const settle = progress(local, at + 0.35, 1.8, glide);
    if (ref.current) {
      ref.current.style.opacity = swell * (1 - settle * 0.55);
      ref.current.style.transform = `translate(-50%, -50%) scale(${0.7 + swell * 0.3 + settle * 0.15})`;
    }
  });
  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute top-1/2 left-1/2 rounded-full opacity-0", className)}
      style={{ width: size, height: size, background: `radial-gradient(closest-side, color-mix(in oklab, ${color} ${strength * 100}%, transparent), transparent)` }}
    />
  );
}

// Blacks out the frame from `at` (a cut to black on the beat), optionally lifting again at `until`.
export function Blackout({ at, until = Infinity }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.style.opacity = local >= at && local < until ? 1 : 0;
  });
  return <div ref={ref} className="absolute inset-0 z-[800] bg-black opacity-0" />;
}
