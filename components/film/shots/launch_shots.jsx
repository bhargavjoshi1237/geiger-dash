"use client";

import { useRef } from "react";
import { Check, Globe, ScanLine, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, LINE, Window } from "@/components/product-pages/mock_kit";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { ContentStage } from "@/components/product-pages/launch/content_renders";
import { AssetDetail } from "@/components/product-pages/launch/assets_renders";
import { TerminalWindow } from "@/components/product-pages/launch/pods_renders";
import { Camera } from "@/components/film/camera";
import { useFrame } from "@/components/film/clock";
import { clamp, glide, lerp, progress, swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { ActTitle, Caption, Clock, Count, Fade, Words } from "@/components/film/kinetic";
import { BAR } from "@/components/film/timeline";

// Act four, Launch: Fight Night 12 sells out in Events, the group walks in at the door, then Content, Assets and Pods on the beat.

const TIERS = [
  { name: "Category 1 — Cageside centre", price: 3974, total: 60, from: 0.93 },
  { name: "Category 3 — Floor ringside", price: 1450, total: 180, from: 0.86 },
  { name: "Category 5 — Lower bowl front", price: 707, total: 420, from: 0.78 },
  { name: "Category 6 — Lower bowl", price: 389, total: 380, from: 0.81 },
  { name: "Category 7 — Upper tier centre", price: 216, total: 400, from: 0.74 },
  { name: "Category 8 — Upper tier ends", price: 135, total: 270, from: 0.97 },
];

const SELL_START = 3.0;
const SELL_END = 6.1;

// Each tier fills on its own curve, so they sell out one after another rather than all at once.
const soldShare = (tier, index, local) => lerp(tier.from, 1, progress(local, SELL_START + index * 0.12, SELL_END - SELL_START - 0.7 - (1 - tier.from) * 0.6, glide));

const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;

function TierRow({ tier, index }) {
  const bar = useRef(null);
  const count = useRef(null);
  const chips = useRef([]);
  useFrame((local) => {
    const share = soldShare(tier, index, local);
    const sold = Math.round(share * tier.total);
    const left = tier.total - sold;
    if (bar.current) bar.current.style.width = `${share * 100}%`;
    if (count.current) count.current.textContent = `${sold.toLocaleString("en-US")} / ${tier.total.toLocaleString("en-US")}`;
    const state = left === 0 ? 2 : left <= tier.total * 0.08 ? 1 : 0;
    chips.current.forEach((node, chip) => {
      if (!node) return;
      node.style.display = chip === state ? "inline-flex" : "none";
      if (chip === 1) node.lastChild.textContent = `Last ${left}`;
    });
  });
  return (
    <div className={cn("grid grid-cols-[1.9fr_0.6fr_1.7fr_0.8fr] items-center gap-6 border-b px-7 py-4", LINE)}>
      <span className="truncate text-foreground/90">{tier.name}</span>
      <span className="text-muted-foreground tabular-nums">{money(tier.price)}</span>
      <span className="flex items-center gap-4">
        <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
          <span ref={bar} className="absolute inset-y-0 left-0 rounded-full bg-foreground/60" />
        </span>
        <span ref={count} className="w-[96px] text-right text-[14px] text-muted-foreground tabular-nums" />
      </span>
      <span className="flex justify-end">
        {["On sale", "Last", "Sold out"].map((label, chip) => (
          <span
            key={label}
            ref={(node) => {
              chips.current[chip] = node;
            }}
            className={cn(
              "h-7 items-center gap-2 rounded-full border px-3 text-[13px] whitespace-nowrap",
              chip === 0 && "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              chip === 1 && "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
              chip === 2 && "border-foreground/15 bg-foreground/[0.06] text-foreground",
            )}
            style={{ display: "none" }}
          >
            <span className={cn("size-1.5 rounded-full", chip === 0 && "bg-emerald-500", chip === 1 && "bg-amber-500", chip === 2 && "bg-foreground/70")} />
            <span>{label}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

const TOTAL = TIERS.reduce((sum, tier) => sum + tier.total, 0);
const REVENUE = TIERS.reduce((sum, tier) => sum + tier.total * tier.price, 0);
const START_SOLD = TIERS.reduce((sum, tier) => sum + Math.round(tier.from * tier.total), 0);
const START_REVENUE = TIERS.reduce((sum, tier) => sum + Math.round(tier.from * tier.total) * tier.price, 0);

function Kpi({ label, children }) {
  return (
    <div className="px-7 py-5">
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-1 text-[34px] font-medium tracking-[-0.02em]">{children}</div>
    </div>
  );
}

function TicketsWindow() {
  return (
    <Window className="w-[1440px] text-[16px]">
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b px-7", LINE)}>
        <Ticket className="size-4 text-muted-foreground" />
        <span className="font-medium">Fight Night 12: Reyes vs Moreau</span>
        <span className="text-muted-foreground">Tickets</span>
        <span className="ml-auto flex items-center gap-2 text-[13px] text-muted-foreground">
          <Globe className="size-4" /> Harbour Arena, Lisbon · 14 November
        </span>
      </div>
      <div className={cn("grid grid-cols-4 divide-x border-b", LINE, "divide-foreground/[0.07]")}>
        <Kpi label="Tickets sold">
          <Count from={START_SOLD} to={TOTAL} at={SELL_START} duration={SELL_END - SELL_START} />
        </Kpi>
        <Kpi label="Ticket revenue">
          <Count from={START_REVENUE} to={REVENUE} at={SELL_START} duration={SELL_END - SELL_START} format={money} />
        </Kpi>
        <Kpi label="Sell-through">
          <Count from={(START_SOLD / TOTAL) * 100} to={100} at={SELL_START} duration={SELL_END - SELL_START} format={(value) => `${Math.round(value)}%`} />
        </Kpi>
        <Kpi label="Days to go">12</Kpi>
      </div>
      <div className={cn("grid grid-cols-[1.9fr_0.6fr_1.7fr_0.8fr] gap-6 border-b px-7 py-3 text-[13px] text-muted-foreground", LINE)}>
        <span>Ticket type</span>
        <span>Price</span>
        <span>Sold</span>
        <span className="text-right">Status</span>
      </div>
      {TIERS.map((tier, index) => (
        <TierRow key={tier.name} tier={tier} index={index} />
      ))}
    </Window>
  );
}

export function LaunchTickets() {
  return (
    <>
      <Stage />
      <Camera
        width={1440}
        height={720}
        keys={[
          { t: 0, z: -640, rx: 22, ry: 12, rz: -4, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 2.4, z: -580, rx: 21, ry: 11, rz: -4, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 3.0, z: 150, s: 1.15, rx: 12, ry: 8, rz: -2, x: 60, y: 40, blur: 5, fr: 58, fx: 50, fy: 50, o: 1, ease: swift },
          { t: 6.5, z: 280, s: 1.15, rx: 9, ry: 5, rz: -1.2, x: 0, y: 20, blur: 5, fr: 58, fx: 52, fy: 52, o: 1 },
        ]}
      >
        <TicketsWindow />
      </Camera>
      <ActTitle index="04" label="Launch" title={"Ship it to the\npeople it's for."} at={0.1} out={2.3} />
      <Caption app="events" name="Events" text="Event pages, tickets and checkout" at={3.1} out={6.1} />
    </>
  );
}
LaunchTickets.cues = [
  { at: 0.1, sound: "whoosh", gain: 0.5 },
  { at: 2.5, sound: "whoosh", gain: 0.35 },
  ...TIERS.map((_, index) => ({ at: SELL_END - 0.9 + index * 0.12, sound: "tick", gain: 0.4 })),
];

// The group's ticket on a phone, scanned at the gate.
function Door() {
  const scan = useRef(null);
  const codes = useRef([]);
  useFrame((local) => {
    if (scan.current) {
      const sweep = clamp((local - 0.2) / 0.9);
      scan.current.style.opacity = sweep > 0 && sweep < 1 ? 1 : 0;
      scan.current.style.transform = `translateY(${sweep * 176}px)`;
    }
    // The code rotates every few seconds, so a screenshot of a ticket won't get anyone in.
    const showing = Math.floor(local / 1.6) % 2;
    codes.current.forEach((node, index) => {
      if (node) node.style.opacity = index === showing ? 1 : 0;
    });
  });
  return (
    <div className="relative h-[620px] w-[1200px]">
      <div className="absolute top-[20px] left-[60px] h-[600px] w-[300px] rounded-[44px] border border-foreground/[0.14] bg-surface-subtle p-3.5 shadow-[0_50px_100px_-30px_rgb(0_0_0/0.85)]">
        <div className="flex h-full flex-col items-center rounded-[32px] border border-foreground/[0.06] px-6 pt-9">
          <div className="font-mono text-[13px] tracking-[0.14em] text-muted-foreground uppercase">Fight Night 12</div>
          <div className="mt-2 text-center text-[18px] leading-6 font-medium">Category 5 — Lower bowl front</div>
          <div className="mt-1 text-[14px] text-muted-foreground">Northwind group · Block F</div>
          <div className="relative mt-7 size-[208px] overflow-hidden rounded-2xl bg-white p-4 text-black">
            {["fn12-group-a", "fn12-group-b"].map((seed, index) => (
              <div
                key={seed}
                ref={(node) => {
                  codes.current[index] = node;
                }}
                className="absolute inset-4"
              >
                <QrGlyph seed={seed} className="size-[176px]" />
              </div>
            ))}
            <div ref={scan} className="absolute inset-x-2 top-4 h-0.5 bg-emerald-500 shadow-[0_0_14px_3px] shadow-emerald-500/60" />
          </div>
          <div className="mt-5 inline-flex items-center gap-2 text-[14px] text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" /> Rotating code
          </div>
        </div>
      </div>
      <Fade at={1.15} y={16} scale={0.94} duration={0.45} className="absolute top-[110px] left-[420px] w-[400px] rounded-2xl border border-emerald-500/30 bg-surface-subtle p-6 text-[17px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-5" strokeWidth={3} />
          </span>
          <span className="text-[20px] font-medium">Checked in</span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Avatar name="Jordan Lee" size={40} />
          <div>
            <div className="text-foreground">Jordan Lee · Northwind</div>
            <div className="text-[15px] text-muted-foreground">
              Gate B · <Count from={1} to={40} at={1.3} duration={1.4} /> of 40 tickets
            </div>
          </div>
        </div>
      </Fade>
      <Fade at={0.4} y={12} duration={0.6} className="absolute top-[330px] left-[420px] w-[720px] rounded-2xl border border-foreground/[0.1] bg-surface-subtle p-6 text-[16px]">
        <div className="flex items-baseline justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <ScanLine className="size-4" /> Checked in tonight
          </span>
          <span className="text-[30px] font-medium tracking-tight">
            <Count from={1628} to={1668} at={1.3} duration={1.6} /> <span className="text-[18px] text-muted-foreground">/ 1,710</span>
          </span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-4">
          {[
            ["Gate A", 0.96],
            ["Gate B", 0.98],
            ["Gate C", 0.94],
            ["Gate D", 0.97],
          ].map(([gate, share]) => (
            <div key={gate}>
              <div className="mb-2 text-[13px] text-muted-foreground">{gate}</div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.08]">
                <div className="h-full rounded-full bg-emerald-500/80" style={{ width: `${share * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Fade>
    </div>
  );
}

export function LaunchDoor() {
  return (
    <>
      <Stage />
      <Camera
        width={1200}
        height={620}
        keys={[
          { t: 0, z: 120, s: 1.12, rx: 10, ry: -14, rz: 2, x: 40, y: -20, blur: 5, fr: 58, fx: 44, fy: 42 },
          { t: 4, z: 280, s: 1.12, rx: 7, ry: -9, rz: 1, x: -20, y: -30, blur: 5, fr: 58, fx: 48, fy: 42 },
        ]}
      >
        <Door />
      </Camera>
      <Caption app="events" name="Events" text="QR check-in, kiosks and the door" at={0.4} out={3.6} />
    </>
  );
}
LaunchDoor.cues = [
  { at: 0.25, sound: "scan" },
  { at: 1.15, sound: "success" },
];

// One beat of the montage: an app on screen for a bar, with a single word over it.
function Beat({ app, name, word, from, to, keys, width, height, children }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.style.visibility = local >= from && local < to ? "visible" : "hidden";
  });
  return (
    <div ref={ref} className="absolute inset-0" style={{ visibility: "hidden" }}>
      <Stage />
      <Clock at={from}>
        <Camera width={width} height={height} keys={keys.map((key) => ({ ...key, t: key.t + from }))}>
          {children}
        </Camera>
      </Clock>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background)_6%,transparent_55%)]" />
      <div className="absolute bottom-[120px] left-[128px]">
        <Fade at={from + 0.02} out={to - 0.2} y={10} duration={0.35} exit={0.2} className="mb-4 flex items-center gap-3 text-[26px] text-foreground/70">
          <AppMark id={app} size={40} className="rounded-[10px] bg-foreground/[0.08]" />
          {name}
        </Fade>
        <Words text={word} at={from + 0.06} out={to - 0.22} duration={0.5} stagger={0} className="block text-[176px] leading-[0.9] font-medium tracking-[-0.05em]" />
      </div>
    </div>
  );
}

export function LaunchMontage() {
  return (
    <>
      <Beat
        app="content"
        name="Content"
        word="Publish."
        from={0}
        to={BAR}
        width={1000}
        height={620}
        keys={[
          { t: 0, z: 160, s: 1.3, rx: 16, ry: 16, rz: -3, x: 300, y: -60, blur: 5, fr: 56, fx: 60, fy: 40 },
          { t: BAR, z: 300, s: 1.3, rx: 12, ry: 10, rz: -2, x: 240, y: -80, blur: 5, fr: 56, fx: 60, fy: 40, ease: (x) => x },
        ]}
      >
        <ContentStage />
      </Beat>
      <Beat
        app="assets"
        name="Assets"
        word="Approve."
        from={BAR}
        to={BAR * 2}
        width={680}
        height={520}
        keys={[
          { t: 0, z: 220, s: 1.55, rx: 14, ry: -18, rz: 3, x: 330, y: -40, blur: 5, fr: 58, fx: 62, fy: 42 },
          { t: BAR, z: 340, s: 1.55, rx: 10, ry: -12, rz: 2, x: 280, y: -60, blur: 5, fr: 58, fx: 62, fy: 42, ease: (x) => x },
        ]}
      >
        <AssetDetail />
      </Beat>
      <Beat
        app="pods"
        name="Pods"
        word="Deploy."
        from={BAR * 2}
        to={BAR * 3}
        width={1180}
        height={640}
        keys={[
          { t: 0, z: 120, s: 1.2, rx: 14, ry: 14, rz: -2, x: 280, y: -40, blur: 5, fr: 58, fx: 62, fy: 46 },
          { t: BAR, z: 260, s: 1.2, rx: 10, ry: 9, rz: -1, x: 230, y: -60, blur: 5, fr: 58, fx: 62, fy: 48, ease: (x) => x },
        ]}
      >
        <Clock at={BAR * 2 - 0.9}>
          <TerminalWindow typed="pods deploy --api fight-night --stage prod" />
        </Clock>
      </Beat>
    </>
  );
}
LaunchMontage.cues = [0, 1, 2].map((index) => ({ at: index * BAR, sound: "hit", gain: 0.8 }));

export const LAUNCH_SHOTS = { launch_tickets: LaunchTickets, launch_door: LaunchDoor, launch_montage: LaunchMontage };
