"use client";

import { Bell, CalendarDays, CircleHelp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { LINE } from "@/components/product-pages/mock_kit";
import { STROKES } from "@/components/film/film_kit";
import { Fade, Words } from "@/components/film/kinetic";

// The Events film's cast and props: one fictional fight night, the brand it imports, and the app chrome around each shot.

export const EVENT = {
  name: "Fight Night 12: Reyes vs Moreau",
  short: "Fight Night 12",
  date: "Sat, Nov 21",
  time: "7:30 PM",
  doors: "Sat, Nov 21 · 6:30 PM",
  venue: "Harbour Arena",
  city: "Lisbon",
  host: "Harbour Arena Promotions",
  summary: "Twelve fights, one night. Reyes and Moreau settle it in Lisbon.",
  capacity: 4032,
};

export const BUYER = { name: "Jordan Lee", email: "jordan@northwind.co" };

// The brand the page imports from the promoter's site: a dark page with one hot accent.
export const BRAND = {
  site: "fightnight12.live",
  name: "Fight Night",
  brand: "#ff4d2e",
  background: "#0d0d0f",
  surface: "#18181b",
  text: "#f5f5f4",
  muted: "#a1a1aa",
  border: "#2a2a2e",
  onBrand: "#ffffff",
};

// The line each shot opens on, top left: a rose-dotted kicker naming the act, then the headline rising word by word.
export function Headline({ kicker, text, at = 0.15, out = Infinity, className, textClassName }) {
  return (
    <div className={cn("absolute top-[88px] left-[120px] z-40", className)}>
      {kicker ? (
        <Fade at={at} out={out} y={8} duration={0.5} className="mb-5 flex items-center gap-3 font-mono text-[19px] tracking-[0.16em] text-foreground/55 uppercase">
          <span className="size-2 rounded-full bg-rose-500" />
          {kicker}
        </Fade>
      ) : null}
      <Words text={text} at={at + 0.08} out={out} stagger={0.05} duration={0.7} className={cn("block text-[72px] leading-[1.02] font-medium tracking-[-0.042em] text-foreground", textClassName)} />
    </div>
  );
}

// The Geiger mark from public/logo1.svg at icon size, for the app's top bar.
export function GeigerGlyph({ className }) {
  return (
    <svg viewBox="0 0 467 285" className={cn("h-[13px] text-foreground", className)} aria-hidden="true">
      {STROKES.map((path) => (
        <path key={path} d={path} fill="currentColor" />
      ))}
    </svg>
  );
}

// The Events workspace frame: the suite top bar over whatever the shot puts inside.
export function AppWindow({ width, height, className, children }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[14px] border border-foreground/[0.1] bg-background text-[14px] text-foreground shadow-[0_2px_6px_rgb(0_0_0/0.05),0_24px_60px_-18px_rgb(0_0_0/0.22),0_60px_120px_-40px_rgb(0_0_0/0.18)]",
        className,
      )}
      style={{ width, height }}
    >
      <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b bg-background/60 px-5", LINE)}>
        <GeigerGlyph />
        <span className="h-4 w-px bg-foreground/15" />
        <span className="text-[14px] font-semibold">Events</span>
        <div className="ml-auto flex items-center gap-4 text-muted-foreground">
          <div className="flex h-8 w-[240px] items-center gap-2 rounded-lg border border-foreground/[0.1] bg-surface-subtle px-3 text-[13px]">
            <Search className="size-3.5" />
            Search Events...
            <span className="ml-auto flex gap-1 font-mono text-[10px]">
              <span className="rounded border border-foreground/[0.12] px-1">⌘</span>
              <span className="rounded border border-foreground/[0.12] px-1">K</span>
            </span>
          </div>
          <CircleHelp className="size-4" />
          <Bell className="size-4" />
          <span className="size-7 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/15" />
        </div>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

// A browser window for the public pages buyers see.
export function BrowserWindow({ width, height, dark = false, title = EVENT.name, className, style, children }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[14px] border shadow-[0_2px_6px_rgb(0_0_0/0.05),0_24px_60px_-18px_rgb(0_0_0/0.25),0_60px_120px_-40px_rgb(0_0_0/0.2)]",
        dark ? "border-white/10" : "border-foreground/[0.1] bg-background",
        className,
      )}
      style={{ width, height, ...style }}
    >
      <div className={cn("flex h-11 shrink-0 items-center gap-3 border-b px-4", dark ? "border-white/[0.08] bg-[#141416]" : cn("bg-surface-subtle", LINE))}>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className={cn("size-3 rounded-full", dark ? "bg-white/15" : "bg-foreground/15")} />
          ))}
        </span>
        <span className={cn("mx-auto flex h-7 w-[420px] items-center justify-center gap-2 truncate rounded-md text-[12px]", dark ? "bg-white/[0.06] text-white/60" : "bg-background text-muted-foreground")}>
          <CalendarDays className="size-3.5" />
          {title}
        </span>
        <span className="w-[52px]" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

// A phone with a dark or light screen; the buyer app is dark, the staff scanner follows the light theme.
export function Phone({ width = 400, height = 846, dark = true, className, style, children }) {
  return (
    <div
      className={cn("relative rounded-[64px] bg-[#0b0b0c] p-[12px] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.45),0_80px_140px_-50px_rgb(0_0_0/0.35)] ring-1 ring-black/40", className)}
      style={{ width, height, ...style }}
    >
      <div className={cn("relative h-full overflow-hidden rounded-[52px]", dark ? "bg-[#161616] text-white" : "bg-background text-foreground")}>
        <div className="absolute top-3 left-1/2 z-20 h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

export function StatusPill({ status, className }) {
  const dot = { "On Sale": "bg-emerald-500", "Sold out": "bg-sky-500", Draft: "bg-foreground/35", Live: "bg-emerald-500" }[status];
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.1] bg-surface-subtle px-2.5 text-[12px] font-medium whitespace-nowrap text-foreground/80", className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {status}
    </span>
  );
}

// A ticket QR, plain modules on white, the way the ticket route draws them.
export function TicketQr({ seed = "FN12-7Q4K", size = 220, className }) {
  return (
    <div className={cn("rounded-2xl bg-white p-3", className)} style={{ width: size, height: size }}>
      <QrGlyph seed={seed} size={25} className="size-full text-[#111111]" />
    </div>
  );
}
