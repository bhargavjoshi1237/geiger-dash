"use client";

import { createContext, useContext, useLayoutEffect, useRef } from "react";

// The film clock: one global time, per-frame callbacks that write straight to the DOM, and CSS animations seeked to match.

const callbacks = new Set();
let now = 0;

export const ShotContext = createContext({ id: "root", start: 0, end: Infinity });

export const useShot = () => useContext(ShotContext);

// Runs `callback(local, global)` on every seek while mounted, with `local` measured from the shot's start.
export function useFrame(callback) {
  const shot = useContext(ShotContext);
  const latest = useRef(callback);
  useLayoutEffect(() => {
    latest.current = callback;
  });
  useLayoutEffect(() => {
    const entry = (time) => latest.current(time - shot.start, time);
    callbacks.add(entry);
    entry(now);
    return () => callbacks.delete(entry);
  }, [shot]);
}

export function runFrame(time) {
  now = time;
  for (const callback of callbacks) callback(time);
}

// The area-page renders animate in CSS; pause each one and set its time from the nearest [data-clock] start.
export function seekAnimations(time) {
  for (const animation of document.getAnimations()) {
    try {
      if (typeof CSSTransition !== "undefined" && animation instanceof CSSTransition) {
        animation.finish();
        continue;
      }
      const target = animation.effect?.target;
      const clock = target?.closest?.("[data-clock]");
      const start = clock ? Number(clock.dataset.clock) : 0;
      animation.pause();
      animation.currentTime = Math.max(0, (time - start) * 1000);
    } catch {
      // Scroll-driven timelines don't take a time; the film never scrolls, so they are left alone.
    }
  }
}
