"use client";

import { Fragment, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { AppMark } from "@/components/product-pages/mock_kit";
import { useFrame, useShot } from "@/components/film/clock";
import { clamp, easeInCubic, easeOutBack, glide, lerp, presence, progress, sample, seeded } from "@/components/film/ease";

// On-screen type and small actors (typing, counters, a cursor) for the film. All of them read the film clock.

// Words rise out of a blur one after another; `\n` breaks a line. `out` sends them away the same way.
export function Words({ text, at = 0, out = Infinity, stagger = 0.06, duration = 0.9, rise = 0.34, blur = 14, className, wordClassName }) {
  const refs = useRef([]);
  const lines = useMemo(() => {
    const slots = [];
    for (const line of text.split("\n")) slots.push(line.split(" ").map((word, position) => ({ word, slot: slots.flat().length + position })));
    return slots;
  }, [text]);

  useFrame((local) => {
    refs.current.forEach((node, index) => {
      if (!node) return;
      const enter = progress(local, at + index * stagger, duration, glide);
      const exit = progress(local, out + index * stagger * 0.5, 0.45, easeInCubic);
      const amount = enter * (1 - exit);
      const softness = (1 - enter) * blur + exit * blur * 0.6;
      node.style.opacity = amount;
      node.style.transform = `translateY(${((1 - enter) * rise - exit * rise * 0.4).toFixed(4)}em)`;
      node.style.filter = softness > 0.05 ? `blur(${softness.toFixed(2)}px)` : "none";
    });
  });

  return (
    <span className={className}>
      {lines.map((words, line) => (
        <span key={line} className="block">
          {words.map(({ word, slot }, position) => (
            <Fragment key={position}>
              <span
                ref={(node) => {
                  refs.current[slot] = node;
                }}
                className={cn("inline-block opacity-0", wordClassName)}
              >
                {word}
              </span>
              {position < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </span>
  );
}

// Fades and lifts any element in at `at` and out at `out`, optionally from a scale and a blur.
export function Fade({ at = 0, out = Infinity, duration = 0.7, exit = 0.45, y = 16, scale = 1, blur = 0, ease = glide, className, style, children }) {
  const ref = useRef(null);
  useFrame((local) => {
    const node = ref.current;
    if (!node) return;
    const enter = progress(local, at, duration, ease);
    const leave = progress(local, out, exit, easeInCubic);
    node.style.opacity = enter * (1 - leave);
    node.style.transform = `translateY(${(1 - enter) * y - leave * y * 0.5}px) scale(${lerp(scale, 1, enter)})`;
    const softness = (1 - enter) * blur + leave * blur;
    node.style.filter = softness > 0.05 ? `blur(${softness}px)` : "none";
  });
  return (
    <div ref={ref} className={cn("opacity-0", className)} style={style}>
      {children}
    </div>
  );
}

// An act opener in the lower left: a mono index line, then the area's headline from its page on the site.
export function ActTitle({ index, label, title, at = 0, out = 3.2, className }) {
  return (
    <div className={cn("absolute bottom-[132px] left-[128px] max-w-[1100px]", className)}>
      <Fade at={at} out={out} y={10} duration={0.6} className="mb-7 flex items-center gap-4 font-mono text-[22px] tracking-[0.14em] text-foreground/60 uppercase">
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-14 bg-foreground/30" />
        <span>{label}</span>
      </Fade>
      <Words text={title} at={at + 0.15} out={out} className="block text-[104px] leading-[1.02] font-medium tracking-[-0.038em] text-foreground" />
    </div>
  );
}

// The lower-third that names the app on screen.
export function Caption({ app, name, text, at = 0, out = Infinity, className }) {
  return (
    <Fade at={at} out={out} y={12} blur={6} className={cn("absolute bottom-[96px] left-[128px] flex items-center gap-4", className)}>
      <AppMark id={app} size={44} className="rounded-[11px] bg-foreground/[0.08]" />
      <div className="text-[26px] leading-tight tracking-[-0.01em]">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-foreground/55"> · {text}</span>
      </div>
    </Fade>
  );
}

// Types `text` from `at` with a human rhythm: small jitter per key and a beat after spaces and punctuation.
export function TypeOn({ text, at = 0, speed = 1, caret = true, caretUntil = Infinity, className, caretClassName }) {
  const textRef = useRef(null);
  const caretRef = useRef(null);
  const times = useMemo(() => {
    const random = seeded(text.length * 7919 + text.charCodeAt(0));
    const out = [];
    for (const char of text) out.push((out.at(-1) ?? 0) + (0.045 + random() * 0.035 + (char === " " ? 0.03 : 0) + (/[,.?!]/.test(char) ? 0.12 : 0)) / speed);
    return out;
  }, [text, speed]);

  useFrame((local) => {
    const elapsed = local - at;
    let count = 0;
    while (count < times.length && times[count] <= elapsed) count++;
    if (textRef.current) textRef.current.textContent = text.slice(0, count);
    if (caretRef.current) {
      const typing = elapsed >= 0 && count < text.length;
      const blink = Math.floor((local - at) * 1.9) % 2 === 0;
      const visible = caret && local >= at - 0.6 && local < caretUntil && (typing || blink);
      caretRef.current.style.opacity = visible ? 1 : 0;
    }
  });

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      <span ref={textRef} />
      <span ref={caretRef} className={cn("ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.15em] bg-current opacity-0", caretClassName)} />
    </span>
  );
}

// Seconds needed to type `text` with TypeOn at a given speed, for timing what follows a sentence.
export function typingTime(text, speed = 1) {
  return (text.length * 0.065 + (text.split(" ").length - 1) * 0.03) / speed;
}

// A number that counts from `from` to `to`, formatted like the product formats it.
export function Count({ from = 0, to, at = 0, duration = 2, format = (value) => Math.round(value).toLocaleString("en-US"), className }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.textContent = format(lerp(from, to, progress(local, at, duration, glide)));
  });
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(from)}
    </span>
  );
}

// A pointer that glides between keyframed positions and dips on each click, with a soft ring where it pressed.
export function Cursor({ keys, clicks = [], className }) {
  const ref = useRef(null);
  const ring = useRef(null);
  useFrame((local) => {
    const point = sample(keys, local);
    const visible = presence(local, keys[0].t - 0.3, keys[keys.length - 1].t + 0.8, 0.3, 0.4);
    const press = Math.max(0, ...clicks.map((click) => 1 - Math.abs(local - click) / 0.12));
    const recent = clicks.filter((click) => local >= click).at(-1);
    if (ref.current) {
      ref.current.style.opacity = visible;
      ref.current.style.transform = `translate(${point.x}px, ${point.y}px) scale(${1 - press * 0.14})`;
    }
    if (ring.current) {
      const age = recent === undefined ? 1 : clamp((local - recent) / 0.5);
      ring.current.style.opacity = recent === undefined ? 0 : (1 - age) * 0.5;
      ring.current.style.transform = `translate(-50%, -50%) scale(${0.4 + age * 1.1})`;
    }
  });
  return (
    <div ref={ref} className={cn("pointer-events-none absolute top-0 left-0 z-50 opacity-0", className)} style={{ transformOrigin: "4px 4px" }}>
      <span ref={ring} className="absolute top-[4px] left-[4px] size-10 rounded-full border-2 border-foreground/70 opacity-0" />
      <svg width="26" height="30" viewBox="0 0 26 30" className="drop-shadow-[0_4px_10px_rgb(0_0_0/0.45)]">
        <path d="M3 2.5v21.6l5.6-5.2 3.7 8.6 3.9-1.7-3.7-8.5h7.8z" fill="white" stroke="black" strokeOpacity="0.75" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Re-bases the CSS animations inside an area-page render so they start `at` seconds into the shot.
export function Clock({ at = 0, children }) {
  const shot = useShot();
  return (
    <div data-clock={shot.start + at} className="contents">
      {children}
    </div>
  );
}

// Grows from 0 to its full height (and back), for rows that slide into a list.
export function Grow({ at = 0, height, duration = 0.55, className, children }) {
  const ref = useRef(null);
  useFrame((local) => {
    const node = ref.current;
    if (!node) return;
    const amount = progress(local, at, duration, easeOutBack);
    node.style.height = `${Math.max(0, amount) * height}px`;
    node.style.opacity = clamp(amount * 1.6);
  });
  return (
    <div ref={ref} className={cn("overflow-hidden", className)} style={{ height: 0 }}>
      {children}
    </div>
  );
}
