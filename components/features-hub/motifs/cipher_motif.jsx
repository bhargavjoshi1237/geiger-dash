"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, TicketPercent } from "lucide-react";
import { SCRAMBLE_GLYPHS } from "@/components/features-hub/random";
import styles from "@/components/features-hub/features_hub.module.css";

const FIELD_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-=/@#%";
const CODES = ["EARLYBIRD", "VIP-50OFF", "TEAM-15", "SPRING24"];

const pick = (glyphs) => glyphs[Math.floor(Math.random() * glyphs.length)];

// Fixed pseudo-noise per cell so the hole's edge is ragged but doesn't shimmer.
function cellNoise(index) {
  const value = 43758.5453 * Math.sin(12.9898 * index);
  return 2 * (value - Math.floor(value)) - 1;
}

// Linear's Security canvas: a field of monospace glyphs that keep mutating, with a soft hole for the emblem.
function GlyphField({ hole, running, reducedMotion }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrap || !context) return undefined;

    let cols = 0;
    let rows = 0;
    let cell = 12;
    let cells = [];
    let lastMutation = 0;
    let frame = 0;
    let color = "";

    const resize = (width, height) => {
      cell = Math.min(Math.max(9, Math.min(16, Math.floor(width / 40))), Math.max(9, Math.min(16, Math.floor(height / 18))));
      cols = Math.max(8, Math.floor(width / cell));
      rows = Math.max(6, Math.floor(height / cell));
      cells = Array.from({ length: cols * rows }, () => pick(FIELD_GLYPHS));
      const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = `${cell}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      context.textBaseline = "top";
    };

    const draw = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      const feather = Math.max(8, Math.floor(1.25 * cell));
      const inner = hole - feather;
      const jitter = Math.min(10, Math.floor(0.6 * cell));
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const glyph = cells[index];
          index += 1;
          const x = col * cell;
          const y = row * cell;
          const distance = Math.hypot(width / 2 - (x + cell / 2), height / 2 - (y + cell / 2)) + cellNoise(index) * jitter;
          if (distance < inner) continue;
          context.globalAlpha = distance < hole ? (distance - inner) / feather : 1;
          context.fillText(glyph, x, y);
        }
      }
      context.globalAlpha = 1;
    };

    const tick = (now) => {
      if (now - lastMutation >= 45) {
        lastMutation = now;
        color = getComputedStyle(wrap).color;
        const count = Math.max(1, Math.floor(cells.length * 0.03));
        for (let i = 0; i < count; i += 1) cells[Math.floor(Math.random() * cells.length)] = pick(FIELD_GLYPHS);
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width, entry.contentRect.height);
      color = getComputedStyle(wrap).color;
      draw();
    });
    observer.observe(wrap);
    if (running && !reducedMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [hole, running, reducedMotion]);

  return (
    <div ref={wrapRef} className="absolute inset-0 text-muted-foreground/45">
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </div>
  );
}

// Cycles through promo codes, decoding each one out of noise.
function DecodingCode({ running, reducedMotion }) {
  const [text, setText] = useState(CODES[0]);

  useEffect(() => {
    if (!running || reducedMotion) return undefined;
    let word = 0;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      if (frame === 60) {
        word = (word + 1) % CODES.length;
        frame = 0;
      }
      const target = CODES[word];
      const settled = Math.floor(frame / 2);
      setText(target.split("").map((char, index) => (index < settled || char === "-" ? char : pick(SCRAMBLE_GLYPHS))).join("").toUpperCase());
    }, 50);
    return () => clearInterval(id);
  }, [running, reducedMotion]);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-card px-3.5 py-2 shadow-sm">
      <TicketPercent className="size-4 text-(--ink)" />
      <span className="w-[9ch] font-mono text-sm font-semibold tracking-[0.12em] text-foreground">{text}</span>
    </div>
  );
}

export function CipherMotif({ variant, running, reducedMotion }) {
  const isCode = variant === "code";
  return (
    <div className={`absolute inset-0 ${styles.radialFade}`}>
      <GlyphField hole={isCode ? 96 : 66} running={running} reducedMotion={reducedMotion} />
      <div className="absolute inset-0 flex items-center justify-center">
        {isCode ? (
          <DecodingCode running={running} reducedMotion={reducedMotion} />
        ) : (
          <ShieldCheck className="size-14 text-foreground drop-shadow-[0_0_18px_color-mix(in_oklab,var(--ink)_40%,transparent)]" strokeWidth={1.4} />
        )}
      </div>
    </div>
  );
}
