"use client";

import { useEffect, useRef } from "react";
import {
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleCheck,
  FilePenLine,
  FileStack,
  GalleryVerticalEnd,
  Image as ImageIcon,
  Megaphone,
  MessagesSquare,
  Network,
  Workflow,
} from "lucide-react";
import Logo from "@geiger/ui/logo";
import { cn } from "@/lib/utils";
import { LOGIN_PATTERNS } from "./pattern-catalog";
import { PATTERNS } from "./pattern-engine";

// Whole class strings so Tailwind sees them.
const SUITE = [
  { icon: Workflow, accent: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/20" },
  { icon: FileStack, accent: "bg-amber-500/10 text-amber-600 ring-amber-500/20" },
  { icon: ImageIcon, accent: "bg-violet-500/10 text-violet-600 ring-violet-500/20" },
  { icon: BrainCircuit, accent: "bg-sky-500/10 text-sky-600 ring-sky-500/20" },
  { icon: BriefcaseBusiness, accent: "bg-teal-500/10 text-teal-600 ring-teal-500/20" },
  { icon: CircleCheck, accent: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" },
  { icon: CalendarDays, accent: "bg-rose-500/10 text-rose-600 ring-rose-500/20" },
  { icon: GalleryVerticalEnd, accent: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20" },
  { icon: Megaphone, accent: "bg-orange-500/10 text-orange-600 ring-orange-500/20" },
  { icon: Network, accent: "bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/20" },
  { icon: MessagesSquare, accent: "bg-blue-500/10 text-blue-600 ring-blue-500/20" },
  { icon: FilePenLine, accent: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20" },
  { icon: Building2, accent: "bg-slate-400/10 text-slate-600 ring-slate-400/20" },
];

const COLS = 9;
const ROWS = 11;
const MID_C = 4;
const MID_R = 5;
// 64px tiles on a 76px pitch, minus the trailing gap.
const GRID_W = COLS * 76 - 12;
const GRID_H = ROWS * 76 - 12;
const BASE_SIZES = { "--tile": "64px", "--gap": "12px", "--icon": "26px", "--logo": "30px" };

const TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    id: i,
    isCenter: c === MID_C && r === MID_R,
    app: SUITE[(c * 4 + r * 7) % SUITE.length],
    delay: Math.round(Math.hypot(c - MID_C, r - MID_R) * 240),
  };
});

// Suite grid: app tiles light up in rings spreading from the Geiger tile.
function TileField() {
  const gridRef = useRef(null);

  // Grows the tiles to cover larger panels, in whole-pixel layout sizes.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const observer = new ResizeObserver(() => {
      const k = Math.max(1, grid.clientWidth / GRID_W, grid.clientHeight / GRID_H);
      grid.style.setProperty("--tile", `${Math.ceil(64 * k)}px`);
      grid.style.setProperty("--gap", `${Math.round(12 * k)}px`);
      grid.style.setProperty("--icon", `${Math.round(26 * k)}px`);
      grid.style.setProperty("--logo", `${Math.round(30 * k)}px`);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        style={BASE_SIZES}
        className="absolute inset-0 grid grid-cols-[repeat(9,var(--tile))] place-content-center gap-[var(--gap)]"
      >
        {TILES.map(({ id, isCenter, app, delay }) => {
          const Icon = app.icon;
          const timing = { animationDelay: `${delay}ms` };
          return (
            // No transform animation on the tile: Chrome resamples the cached layer, which visibly softens the icons.
            <div
              key={id}
              className="relative flex size-[var(--tile)] items-center justify-center rounded-[calc(var(--tile)*0.22)] bg-white ring-1 ring-zinc-200"
            >
              {isCenter ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-zinc-950 text-white">
                  <Logo size={30} className="size-[var(--logo)]" />
                </div>
              ) : (
                <>
                  <Icon className="size-[var(--icon)] text-zinc-300" strokeWidth={1.5} />
                  <div
                    style={timing}
                    className={cn(
                      "absolute inset-0 flex animate-login-tile-tint items-center justify-center rounded-[inherit] opacity-0 ring-1 motion-reduce:animate-none",
                      app.accent,
                    )}
                  >
                    <Icon className="size-[var(--icon)]" strokeWidth={1.5} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_50%,rgba(255,255,255,0.94)_100%)]" />
    </>
  );
}

// Runs one canvas pattern: looped normally, a single still frame under reduced motion.
function CanvasField({ kind }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const pattern = PATTERNS[kind];
    if (!ctx || !pattern) return undefined;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const env = { fontFamily: getComputedStyle(canvas).fontFamily };
    let width = 0;
    let height = 0;
    let state = null;
    let disposed = false;
    // Starts at 3s so every pattern opens mid-motion rather than empty.
    let time = still ? (pattern.stillTime ?? 3) : 3;

    const render = () => {
      // Zero-sized while the panel is hidden below the lg breakpoint.
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (w !== width || h !== height || !state) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        width = w;
        height = h;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        state = pattern.init(w, h, env);
        if (still) {
          for (let i = 0; i < (pattern.settleFrames || 0); i += 1) {
            pattern.draw(ctx, w, h, time + i / 30, state);
          }
        }
      }
      pattern.draw(ctx, w, h, time, state);
    };

    let raf = 0;
    let last = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (last) time += Math.min(0.1, (now - last) / 1000);
      last = now;
      render();
    };

    const observer = still ? new ResizeObserver(render) : null;
    if (still) observer.observe(canvas);
    else raf = requestAnimationFrame(frame);

    if (pattern.usesFonts) {
      document.fonts?.ready.then(() => {
        if (disposed) return;
        state = null;
        if (still) render();
      });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [kind]);

  return <canvas ref={canvasRef} className="absolute inset-0 block size-full" />;
}

// The login screen's right-hand panel: one looping pattern, chosen per page load by the server.
export function PatternShowcase({ kind, className }) {
  const dark = LOGIN_PATTERNS.find((pattern) => pattern.kind === kind)?.dark ?? true;

  return (
    <aside
      aria-hidden="true"
      data-pattern={kind}
      className={cn(
        "relative overflow-hidden rounded-2xl border",
        dark ? "border-border bg-background" : "border-zinc-200 bg-white",
        className,
      )}
    >
      {kind === "tiles" ? <TileField /> : <CanvasField kind={kind} />}
    </aside>
  );
}

export default PatternShowcase;
