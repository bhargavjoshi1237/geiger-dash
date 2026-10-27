"use client";

import { ArrowUpRight, CalendarDays, ChevronDown, ChevronRight, MapPin, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, EVENT } from "@/components/film/events/events_kit";

// The public event page in six of its layouts, drawn from public_page/layouts in geiger-events. Each takes a palette,
// so the same page renders in Geiger's standard look or in the brand imported from the promoter's site.

export const STANDARD = {
  background: "var(--background)",
  surface: "var(--surface-subtle)",
  text: "var(--foreground)",
  muted: "var(--muted-foreground)",
  border: "var(--border)",
  brand: "var(--primary)",
  onBrand: "var(--primary-foreground)",
  glow: "rgb(255 255 255 / 0.2)",
};

export const BRANDED = { ...BRAND, glow: "rgb(255 77 46 / 0.6)" };

export const TIERS = [
  { name: "Ringside", price: "$480", note: "Wave 2 on sale · 18 left in this wave" },
  { name: "Lower bowl front", price: "$250", note: "Early bird · 15% off" },
  { name: "Lower bowl", price: "$165", note: "Wave 1 on sale" },
  { name: "Upper tier", price: "$95", note: "Wave 1 on sale · 34 left in this wave" },
];

// Cover art: a dark arena shot drawn in gradients, lit white by default and in the brand colour once imported.
export function Cover({ palette, numeral = 200, className, children }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#0f0f11]", className)}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(55% 75% at 70% 12%, ${palette.glow}, transparent 70%)` }} />
      <div className="absolute inset-0 opacity-60" style={{ background: "repeating-linear-gradient(105deg, transparent 0 70px, rgb(255 255 255 / 0.05) 70px 72px)" }} />
      <svg viewBox="0 0 200 200" className="absolute top-1/2 right-[8%] h-[78%] -translate-y-1/2 text-white/20" fill="none" aria-hidden="true">
        <path d="M70 10h60l50 50v80l-50 50H70L20 140V60z" stroke="currentColor" strokeWidth="2" />
        <path d="M78 30h44l38 38v64l-38 38H78L40 132V68z" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-0 left-0 font-black leading-[0.8] tracking-[-0.06em] text-white/[0.07]" style={{ fontSize: numeral }}>
        12
      </div>
      {children}
    </div>
  );
}

function TicketRail({ palette, className }) {
  return (
    <div className={cn("relative flex flex-col gap-3 rounded-2xl border p-5", className)} style={{ borderColor: palette.border, background: palette.surface }}>
      <div className="text-[15px] font-semibold">Tickets</div>
      {TIERS.map((tier, index) => (
        <div key={tier.name} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: palette.border }}>
          <span className="size-4 shrink-0 rounded-full border-2" style={{ borderColor: index === 1 ? palette.brand : palette.border, background: index === 1 ? palette.brand : "transparent" }} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium">{tier.name}</div>
            <div className="truncate text-[11px]" style={{ color: palette.muted }}>
              {tier.note}
            </div>
          </div>
          <div className="text-[13px] font-semibold tabular-nums">{tier.price}</div>
        </div>
      ))}
      <div className="mt-1 flex h-11 items-center justify-center gap-1 rounded-xl text-[14px] font-semibold" style={{ background: palette.brand, color: palette.onBrand }}>
        Get Tickets <ChevronRight className="size-4" />
      </div>
    </div>
  );
}

function Facts({ palette }) {
  return (
    <div className="flex items-center gap-5 text-[13px]" style={{ color: palette.muted }}>
      <span className="flex items-center gap-1.5">
        <CalendarDays className="size-4" /> {EVENT.date} · {EVENT.time}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="size-4" /> {EVENT.venue}, {EVENT.city}
      </span>
    </div>
  );
}

function Copy({ palette, lines = 4, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <span key={index} className="block h-2 rounded-full opacity-15" style={{ background: palette.text, width: `${[94, 88, 97, 62, 90, 74][index % 6]}%` }} />
      ))}
    </div>
  );
}

function Page({ palette, className, children }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ background: palette.background, color: palette.text }}>
      {children}
    </div>
  );
}

export function ClassicLayout({ palette }) {
  return (
    <Page palette={palette}>
      <Cover palette={palette} className="h-[230px]" />
      <div className="grid grid-cols-[1fr_340px] gap-10 px-12 pt-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-[34px] leading-tight font-bold tracking-[-0.025em]">{EVENT.name}</h2>
          <Facts palette={palette} />
          <div className="flex gap-6 border-b pb-3 text-[13px]" style={{ borderColor: palette.border }}>
            {["About", "What to Expect", "Schedule", "Location", "FAQ"].map((tab, index) => (
              <span key={tab} style={{ color: index ? palette.muted : palette.text }} className={index ? "" : "font-semibold"}>
                {tab}
              </span>
            ))}
          </div>
          <Copy palette={palette} lines={5} />
        </div>
        <TicketRail palette={palette} className="-mt-24" />
      </div>
    </Page>
  );
}

export function LumaLayout({ palette }) {
  return (
    <Page palette={palette}>
      <div className="mx-auto grid w-[920px] grid-cols-[300px_1fr] gap-10 pt-10">
        <div className="flex flex-col gap-4">
          <Cover palette={palette} numeral={150} className="aspect-[4/5] rounded-xl" />
          <div className="text-[11px] font-medium" style={{ color: palette.muted }}>
            Presented by
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <span className="size-6 rounded-full" style={{ background: palette.brand }} /> {EVENT.host}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: palette.surface, color: palette.muted }}>
            Featured in {EVENT.city}
          </span>
          <h2 className="text-[42px] leading-[1.05] font-bold tracking-[-0.03em]">{EVENT.name}</h2>
          <div className="flex items-center gap-3">
            <span className="flex size-11 flex-col items-center justify-center rounded-lg border text-center leading-none" style={{ borderColor: palette.border }}>
              <span className="text-[9px] font-semibold uppercase" style={{ color: palette.muted }}>
                Nov
              </span>
              <span className="text-[17px] font-semibold">21</span>
            </span>
            <div className="text-[14px]">
              <div className="font-semibold">Saturday, November 21</div>
              <div style={{ color: palette.muted }}>7:30 PM – 11:30 PM</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg border" style={{ borderColor: palette.border }}>
              <MapPin className="size-4" />
            </span>
            <div className="text-[14px]">
              <div className="flex items-center gap-1 font-semibold">
                {EVENT.venue} <ArrowUpRight className="size-3.5" />
              </div>
              <div style={{ color: palette.muted }}>{EVENT.city}, Portugal</div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: palette.border }}>
            <div className="px-4 py-2.5 text-[13px] font-medium" style={{ background: palette.surface, color: palette.muted }}>
              Get Tickets
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="text-[14px]">Welcome! To join the event, please get your ticket below.</div>
              <div className="flex h-10 items-center justify-center rounded-lg text-[14px] font-semibold" style={{ background: palette.brand, color: palette.onBrand }}>
                Get Tickets
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function BentoLayout({ palette }) {
  const tile = "rounded-2xl border";
  return (
    <Page palette={palette}>
      <div className="grid h-full grid-cols-6 grid-rows-[200px_200px_120px_1fr] gap-4 p-8">
        <Cover palette={palette} className={cn(tile, "col-span-4 row-span-2 border-transparent")}>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-7 pt-24 text-white">
            <h2 className="max-w-[560px] text-[36px] leading-[1.05] font-bold tracking-[-0.03em]">{EVENT.name}</h2>
            <div className="mt-3 flex gap-2 text-[12px]">
              {["Boxing", "Live", "18+"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Cover>
        <div className={cn(tile, "col-span-2 row-span-2 flex flex-col gap-3 p-5")} style={{ borderColor: palette.border, background: palette.surface }}>
          <div className="text-[15px] font-semibold">Tickets</div>
          {TIERS.slice(0, 3).map((tier) => (
            <div key={tier.name} className="flex items-center justify-between text-[13px]">
              <span>{tier.name}</span>
              <span className="font-semibold tabular-nums">{tier.price}</span>
            </div>
          ))}
          <div className="mt-auto flex h-11 items-center justify-center rounded-xl text-[14px] font-semibold" style={{ background: palette.brand, color: palette.onBrand }}>
            Get Tickets
          </div>
        </div>
        {[
          ["Date", `${EVENT.date}, ${EVENT.time}`],
          ["Venue", EVENT.venue],
          ["Tickets", "From $95"],
        ].map(([label, value]) => (
          <div key={label} className={cn(tile, "col-span-2 flex flex-col justify-center gap-1 px-5")} style={{ borderColor: palette.border, background: palette.surface }}>
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: palette.muted }}>
              {label}
            </span>
            <span className="text-[18px] font-semibold">{value}</span>
          </div>
        ))}
        <div className={cn(tile, "col-span-3 p-5")} style={{ borderColor: palette.border }}>
          <Copy palette={palette} lines={4} />
        </div>
        <div className={cn(tile, "col-span-3 p-5")} style={{ borderColor: palette.border }}>
          <Copy palette={palette} lines={4} />
        </div>
      </div>
    </Page>
  );
}

export function PosterLayout({ palette }) {
  return (
    <Page palette={palette}>
      <div className="grid grid-cols-[1fr_320px] gap-10 px-12 pt-10">
        <div>
          <div className="font-mono text-[13px] tracking-[0.14em] uppercase" style={{ color: palette.muted }}>
            Lisbon / Nov 21
          </div>
          <h2 className="mt-3 text-[88px] leading-[0.92] font-black tracking-[-0.05em] uppercase">
            Reyes
            <br />
            vs Moreau
          </h2>
          <div className="mt-6 grid grid-cols-[110px_1fr] gap-y-1.5 border-t pt-4 font-mono text-[13px]" style={{ borderColor: palette.border }}>
            {[
              ["DATE", `${EVENT.date} · ${EVENT.time}`],
              ["VENUE", `${EVENT.venue}, ${EVENT.city}`],
              ["CARD", "12 fights"],
            ].map(([label, value]) => (
              <div key={label} className="contents">
                <span style={{ color: palette.muted }}>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Cover palette={palette} numeral={120} className="aspect-[3/2] border" />
          <TicketRail palette={palette} className="rounded-none" />
        </div>
      </div>
    </Page>
  );
}

export function BoxOfficeLayout({ palette }) {
  return (
    <Page palette={palette}>
      <div className="grid grid-cols-[1fr_440px] items-center gap-10 px-12 pt-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-[46px] leading-[1.02] font-bold tracking-[-0.035em]">{EVENT.name}</h2>
          <Facts palette={palette} />
        </div>
        <Cover palette={palette} className="aspect-[4/3] rounded-2xl" />
      </div>
      <div className="mt-8 px-12 py-7" style={{ background: palette.surface }}>
        <div className="mb-4 text-[18px] font-semibold">Choose your ticket</div>
        <div className="grid grid-cols-4 gap-4">
          {TIERS.map((tier, index) => (
            <div key={tier.name} className="flex flex-col gap-1.5 rounded-xl border p-4" style={{ borderColor: index === 1 ? palette.brand : palette.border, background: palette.background }}>
              <span className="text-[13px] font-medium">{tier.name}</span>
              <span className="text-[30px] leading-tight font-bold tabular-nums">{tier.price}</span>
              <span className="truncate text-[11px]" style={{ color: palette.muted }}>
                {tier.note}
              </span>
              <span
                className="mt-2 flex h-9 items-center justify-center rounded-lg border text-[13px] font-semibold"
                style={index === 1 ? { background: palette.brand, color: palette.onBrand, borderColor: palette.brand } : { borderColor: palette.border }}
              >
                {index === 1 ? "✓ Continue" : "Choose"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export function SpotlightLayout({ palette }) {
  return (
    <Page palette={palette}>
      <Cover palette={palette} numeral={560} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-14 left-12 text-white">
          <div className="mb-3 flex items-center gap-2 text-[14px] text-white/70">
            <Ticket className="size-4" /> {EVENT.date} · {EVENT.venue}, {EVENT.city}
          </div>
          <h2 className="max-w-[760px] text-[60px] leading-[1] font-bold tracking-[-0.035em]">{EVENT.name}</h2>
          <div className="mt-7 flex items-center gap-5">
            <span className="flex h-13 items-center rounded-xl px-7 text-[16px] font-semibold" style={{ background: palette.brand === STANDARD.brand ? "#ffffff" : palette.brand, color: palette.brand === STANDARD.brand ? "#111111" : palette.onBrand }}>
              Get tickets
            </span>
            <span className="text-[15px] text-white/70">From $95</span>
          </div>
        </div>
        <ChevronDown className="absolute bottom-5 left-1/2 size-6 -translate-x-1/2 text-white/60" />
      </Cover>
    </Page>
  );
}

export const LAYOUTS = [
  { id: "classic", name: "Classic", Component: ClassicLayout },
  { id: "luma", name: "Luma", Component: LumaLayout },
  { id: "bento", name: "Bento grid", Component: BentoLayout },
  { id: "poster", name: "Poster", Component: PosterLayout },
  { id: "boxoffice", name: "Box office", Component: BoxOfficeLayout },
  { id: "spotlight", name: "Spotlight", Component: SpotlightLayout },
];
