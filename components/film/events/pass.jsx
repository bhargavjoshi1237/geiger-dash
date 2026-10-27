"use client";

import { useRef } from "react";
import { Activity, CircleCheck, Search, Sun, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { clamp, progress } from "@/components/film/ease";
import { BUYER, EVENT, TicketQr } from "@/components/film/events/events_kit";

// The buyer app's full-screen pass (mobile/src/app/pass/[id].tsx): a white paper ticket on the dark app, and the
// staff scanner at /checkin/<event>, which follows the light theme.

export function PassScreen({ brightAt = 0.6 }) {
  const dim = useRef(null);
  const sun = useRef(null);
  useFrame((local) => {
    const bright = progress(local, brightAt, 0.45);
    if (dim.current) dim.current.style.opacity = 0.32 * (1 - bright);
    if (sun.current) sun.current.style.opacity = bright;
  });
  return (
    <div className="absolute inset-0 bg-[#161616] p-2 pt-[54px]">
      <div className="relative flex h-full flex-col items-center rounded-[40px] bg-white px-6 pt-5 text-[#161616]">
        <span className="flex size-9 items-center justify-center self-start rounded-full bg-[#f3f4f6]">
          <X className="size-4 text-[#525252]" />
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#737373] uppercase">
          <Sun ref={sun} className="size-3.5 opacity-0" /> Present at entrance
        </span>
        <span className="mt-2 text-center text-[21px] leading-tight font-semibold tracking-[-0.01em]">{EVENT.name}</span>
        <span className="mt-1.5 text-[13px] text-[#525252]">Lower bowl front × 2 · {EVENT.venue}</span>
        <TicketQr size={236} className="mt-5 p-0" />
        <span className="mt-3 font-mono text-[20px] font-semibold tracking-[0.12em]">FN12-7Q4K</span>
        <div className="relative mt-5 w-[calc(100%+48px)] border-t-2 border-dashed border-[#d4d4d4]">
          <span className="absolute -top-[13px] -left-[13px] size-6 rounded-full bg-[#161616]" />
          <span className="absolute -top-[13px] -right-[13px] size-6 rounded-full bg-[#161616]" />
        </div>
        <div className="mt-4 flex w-full items-center justify-between text-[12px]">
          <span className="font-semibold tracking-[0.14em] text-[#737373]">ADMIT ONE</span>
          <span className="flex items-center gap-1 text-[#525252]">
            <Users className="size-3.5" /> 2 passes
          </span>
        </div>
        <div className="mt-3 grid w-full grid-cols-[84px_1fr] gap-y-2 text-[13px]">
          {[
            ["Attendee", BUYER.name],
            ["Doors", EVENT.doors],
            ["Paid", "$382.50"],
            ["Issued by", EVENT.host],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <span className="text-[#737373]">{label}</span>
              <span className="truncate font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div ref={dim} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0.32 }} />
    </div>
  );
}

const ADMITTED = [BUYER.name, "Priya Natarajan", "Tomás Ferreira", "Aiko Tanaka", "Sam Okafor", "Lea Dubois"];

// The scanner: header with the live "in" count, gate pickers, the camera square and the result banner.
export function ScannerScreen({ scans, count }) {
  const counter = useRef(null);
  const frame = useRef(null);
  const banners = useRef([]);
  const codes = useRef([]);
  useFrame((local) => {
    const done = scans.filter((at) => local >= at).length;
    if (counter.current) counter.current.textContent = `${Math.round(count(local)).toLocaleString("en-US")} / ${EVENT.capacity.toLocaleString("en-US")} in`;
    const flash = Math.max(0, ...scans.map((at) => (local >= at ? 1 - (local - at) / 0.45 : 0)));
    if (frame.current) frame.current.style.borderColor = `color-mix(in oklab, #34d399 ${(flash * 100).toFixed(0)}%, rgb(255 255 255 / 0.7))`;
    banners.current.forEach((node, index) => {
      if (!node) return;
      const shown = index === done - 1;
      const enter = shown ? progress(local, scans[index], 0.25) : 0;
      node.style.opacity = enter;
      node.style.transform = `translateY(${(1 - enter) * 8}px)`;
    });
    codes.current.forEach((node, index) => {
      if (!node) return;
      // Each guest's code slides into the square a beat before its scan, and out after it.
      const start = index ? scans[index - 1] + 0.35 : -1;
      const enter = progress(local, start, 0.45);
      const leave = progress(local, scans[index] + 0.3, 0.35);
      node.style.opacity = clamp(enter * 1.4) * (1 - leave);
      node.style.transform = `translate(-50%, -50%) translate(${(1 - enter) * 120 - leave * 160}px, ${Math.sin(local * 3 + index) * 3}px) rotate(${(1 - enter) * 8 - 3 + index}deg) scale(${0.9 + enter * 0.1})`;
    });
  });
  return (
    <div className="absolute inset-0 flex flex-col bg-background pt-[50px]">
      <div className="flex items-center gap-2 border-b border-foreground/[0.08] px-4 py-3">
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[14px] font-semibold">{EVENT.name}</div>
          <div className="text-[12px] text-muted-foreground">Scanning as Door staff</div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 tabular-nums">
          <Activity className="size-3" />
          <span ref={counter} />
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2 text-[13px]">
          {["North Gate", "Any zone"].map((value) => (
            <span key={value} className="flex h-9 items-center rounded-lg border border-foreground/[0.12] px-3">
              {value}
            </span>
          ))}
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_40%_40%,#3a3a40,#0c0c0e)] blur-[2px]" />
          {ADMITTED.map((name, index) => (
            <div
              key={name}
              ref={(node) => {
                codes.current[index] = node;
              }}
              className="absolute top-1/2 left-1/2 opacity-0"
            >
              <TicketQr seed={`guest-${index}`} size={176} className="rounded-xl p-2.5 shadow-[0_10px_30px_rgb(0_0_0/0.5)]" />
            </div>
          ))}
          <div className="absolute inset-0 shadow-[inset_0_0_0_60px_rgb(0_0_0/0.35)]" />
          <span ref={frame} className="absolute top-1/2 left-1/2 size-[224px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border-2 border-white/70" />
        </div>
        <div className="relative h-12">
          {ADMITTED.map((name, index) => (
            <div
              key={name}
              ref={(node) => {
                banners.current[index] = node;
              }}
              className="absolute inset-0 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3.5 text-[14px] font-medium text-emerald-800 opacity-0"
            >
              <CircleCheck className="size-4.5" /> Admitted {name}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <span className={cn("flex h-10 flex-1 items-center gap-2 rounded-lg border border-foreground/[0.12] px-3 text-[13px] text-muted-foreground")}>
            <Search className="size-3.5" /> Search name, email, or ticket #
          </span>
          <span className="flex h-10 items-center rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground">Search</span>
        </div>
      </div>
    </div>
  );
}
