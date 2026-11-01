"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SCRAMBLE_GLYPHS } from "@/components/features-hub/random";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// null until observed, then whether the element is near the viewport; motifs pause their loops off-screen.
export function useInView(ref, rootMargin = "160px") {
  const [inView, setInView] = useState(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(REDUCED_MOTION);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

// Counts up every `ms` while `running`; drives the open-ended loops (live counters, feeds).
export function useTicker(ms, running) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setTick((value) => value + 1), ms);
    return () => clearInterval(id);
  }, [ms, running]);
  return tick;
}

// Walks a scripted scene while `running`, one duration per step. It rests on the last step, the finished frame, so a still,
// paused or reduced-motion card still reads complete, and starts the story soon after the card first comes into view.
const FIRST_HOLD = 900;

export function useScene(durations, running) {
  const last = durations.length - 1;
  const [step, setStep] = useState(last);
  const played = useRef(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => {
      played.current = true;
      setStep((value) => (value + 1) % durations.length);
    }, played.current ? durations[step] : FIRST_HOLD);
    return () => clearTimeout(id);
  }, [durations, running, step]);

  return step;
}

const randomGlyph = () => SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];

// Linear's decode: while `decoded`, glyphs resolve left to right into `target`; otherwise they
// flicker back right to left into the resting `scrambled` string.
export function useScramble(target, scrambled, decoded) {
  const [text, setText] = useState(scrambled);
  const textRef = useRef(scrambled);

  useEffect(() => {
    const goal = decoded ? target : scrambled;
    if (textRef.current === goal) return undefined;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2);
      const next = goal
        .split("")
        .map((char, index) => {
          const order = decoded ? index : goal.length - 1 - index;
          if (order < settled) return char;
          if (decoded || order === settled) return randomGlyph();
          return textRef.current[index];
        })
        .join("");
      textRef.current = next;
      setText(next);
      if (next === goal) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [decoded, target, scrambled]);

  return text;
}
