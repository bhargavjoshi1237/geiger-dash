"use client";

import { Check, Handshake, MapPin, Plus, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import { Button } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const VARIANTS = {
  venues: {
    icon: MapPin,
    title: "Venue Sourcing",
    meta: "Lisbon · 400+ guests",
    columns: ["Shortlisted", "Quoted", "Booked"],
    moving: { name: "Harbour Hall", metas: ["Lisbon · Seats 600", "Quote $8,200", "Booked · Nov 19–21"] },
    cards: [
      [{ name: "Riverside Loft", meta: "Lisbon · Seats 220" }, { name: "Pier 9", meta: "Almada · Seats 450" }],
      [{ name: "Atrium 12", meta: "Quote $6,400" }, { name: "Glasshouse", meta: "Quote $9,150" }],
      [{ name: "Oak Barn", meta: "Booked · Sep 4" }],
    ],
  },
  papers: {
    icon: ScrollText,
    title: "Call for Papers",
    meta: "Accept rate 28%",
    columns: ["Submitted", "Under review", "Accepted"],
    moving: { name: "Type in motion", metas: ["Amara Okafor · Workshop", "Score 4.6", "Score 4.6 · Workshop"] },
    cards: [
      [{ name: "Grids that bend", meta: "Tomas Marek · Talk" }, { name: "Colour at scale", meta: "Grace Donnelly · Talk" }],
      [{ name: "Portfolio clinic", meta: "Score 4.1" }, { name: "Designing in public", meta: "Score 3.8" }],
      [{ name: "Opening keynote", meta: "Score 4.8 · Keynote" }],
    ],
  },
};

// Pixels in the 480-wide composition: column pitch, slot pitch and where the first card sits.
const COL_X = [12, 168, 324];
const CARD_W = 144;
const SLOT_Y = 92;
const SLOT_H = 58;
const SLOT_GAP = 8;

const SCENE = [500, 800, 260, 1000, 500, 260, 1000, 3400];

function BoardCard({ card, className, children }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.09] bg-surface-card px-2.5 shadow-sm shadow-black/5 dark:bg-foreground/[0.03]", className)} style={{ height: SLOT_H }}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-foreground/90">{card.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{card.meta}</p>
      </div>
      {children}
    </div>
  );
}

// A pipeline board: the cursor picks a card up and walks it column by column until it lands and ticks off.
function Pipeline({ variant, running }) {
  const config = VARIANTS[variant] || VARIANTS.papers;
  const step = useScene(SCENE, running);
  const Icon = config.icon;

  const column = step < 3 ? 0 : step < 6 ? 1 : 2;
  const lifted = step === 2 || step === 5;
  const grabbing = step >= 1 && step <= 6;
  const landed = step === 7;
  const x = COL_X[column];
  const slotY = SLOT_Y + SLOT_H + SLOT_GAP;

  return (
    <>
      <Window title={config.title} icon={Icon} meta={config.meta} className="h-[330px] w-[480px]" actions={<Avatar name="Maya Chen" size={20} />}>
        <div className="relative flex-1">
          {config.columns.map((name, index) => (
            <div key={name} className="absolute top-0 bottom-0" style={{ left: COL_X[index], width: CARD_W }}>
              <div className="flex h-10 items-center gap-1.5 px-1 text-[12px]">
                <Dot tone={index === 2 ? "emerald" : index === 1 ? "strong" : "neutral"} />
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground tabular-nums">{config.cards[index].length + (column === index ? 1 : 0)}</span>
              </div>
              <BoardCard card={config.cards[index][0]} />
              <div className="mt-2 rounded-lg border border-dashed border-foreground/[0.1]" style={{ height: SLOT_H }} />
              {config.cards[index][1] ? <BoardCard card={config.cards[index][1]} className="mt-2" /> : null}
            </div>
          ))}
          <div className={cn("absolute inset-x-0 top-10 border-t", LINE)} />
          <div
            className="absolute top-0 left-0 z-10"
            style={{
              width: CARD_W,
              translate: `${x}px ${slotY - 48}px`,
              rotate: lifted ? "-2deg" : "0deg",
              scale: lifted ? 1.03 : 1,
              transition: "translate 0.7s cubic-bezier(0.65, 0, 0.35, 1), rotate 0.2s ease-out, scale 0.2s ease-out",
            }}
          >
            <BoardCard
              card={{ name: config.moving.name, meta: config.moving.metas[column] }}
              className={cn("border-foreground/25 transition-shadow duration-200 dark:bg-surface-dialog", lifted ? "shadow-xl shadow-black/30" : "shadow-md shadow-black/15")}
            >
              <Show when={landed} className="shrink-0">
                <span className="flex size-[18px] items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              </Show>
            </BoardCard>
          </div>
          <Cursor at={[x + 110, slotY - 48 + 34]} down={lifted} hidden={!grabbing} />
        </div>
      </Window>
    </>
  );
}

const SPONSORS = [
  { name: "Brightloop", contact: "Maya Chen", amount: "$12,000" },
  { name: "Atlas Coffee", contact: "Grace Donnelly", amount: "$6,000", booth: "C2" },
  { name: "Fieldnote", contact: "Amara Okafor", amount: "$6,000", booth: "A1" },
];

// Booth letters read left to right; `taken` starts occupied, B3 is the one the scene assigns.
const BOOTHS = [
  { id: "A1", taken: true },
  { id: "A2" },
  { id: "A3", taken: true },
  { id: "A4" },
  { id: "B1" },
  { id: "B2", taken: true },
  { id: "B3", assign: true },
  { id: "B4" },
  { id: "C1" },
  { id: "C2", taken: true },
  { id: "C3" },
  { id: "C4" },
];

const BOOTH_TONES = {
  Available: "border-foreground/[0.1] text-muted-foreground",
  Reserved: "border-foreground/40 bg-foreground/[0.1] text-foreground",
  Occupied: "border-foreground/25 bg-foreground/25 text-foreground",
};

const SPONSOR_SCENE = [600, 800, 220, 1100, 3400];

// Sponsors beside Expo Booths: the cursor reserves a booth and the sponsor's row picks it up as it's occupied.
function Sponsors({ running }) {
  const step = useScene(SPONSOR_SCENE, running);
  const state = step < 3 ? "Available" : step === 3 ? "Reserved" : "Occupied";

  return (
    <>
      <Window title="Sponsors" icon={Handshake} meta="$24,000 committed" className="h-[330px] w-[480px]" actions={<Button icon={Plus} className="h-7">Add sponsor</Button>}>
        <div className={cn("grid grid-cols-[1fr_1fr_0.7fr_0.5fr] gap-2 border-b px-5 py-1.5 text-[11px] text-muted-foreground", LINE)}>
          <span>Sponsor</span>
          <span>Contact</span>
          <span>Amount</span>
          <span className="text-right">Booth</span>
        </div>
        {SPONSORS.map((sponsor, index) => (
          <div key={sponsor.name} className={cn("grid h-9 grid-cols-[1fr_1fr_0.7fr_0.5fr] items-center gap-2 border-b px-5 text-[12px]", LINE, index === 0 && step >= 3 && "bg-foreground/[0.04]")}>
            <span className="truncate font-medium text-foreground/90">{sponsor.name}</span>
            <span className="truncate text-muted-foreground">{sponsor.contact}</span>
            <span className="text-foreground/80 tabular-nums">{sponsor.amount}</span>
            <span className="text-right font-mono text-[11px] text-muted-foreground">{index === 0 ? (step >= 4 ? "B3" : "—") : sponsor.booth}</span>
          </div>
        ))}
        <div className="px-5 pt-3">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/90">Expo Booths</span>
            {Object.keys(BOOTH_TONES).map((name) => (
              <span key={name} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-[3px] border", BOOTH_TONES[name])} />
                {name}
              </span>
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {BOOTHS.map((booth) => {
              const tone = booth.assign ? state : booth.taken ? "Occupied" : "Available";
              return (
                <span key={booth.id} className={cn("flex h-9 items-center justify-center rounded-md border font-mono text-[11px] transition-colors duration-300", BOOTH_TONES[tone])}>
                  {booth.id}
                </span>
              );
            })}
          </div>
        </div>
      </Window>
      <Cursor at={[296, 272]} down={step === 2} hidden={step === 0 || step === 4} />
    </>
  );
}

export function BoardMotif({ variant, running }) {
  return (
    <Fit>{variant === "sponsors" ? <Sponsors running={running} /> : <Pipeline variant={variant} running={running} />}</Fit>
  );
}
