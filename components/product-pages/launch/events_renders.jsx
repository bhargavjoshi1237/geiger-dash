import { Check, Globe, MapPin, Minus, Plus, ScanLine, Ticket, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { Avatar, Chip, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Events renders: the public page, checkout, releases, the seat map and the door. Prices follow the event seeds; the event itself is fictional.

const TIERS = [
  { name: "Category 1 — Cageside centre", price: "$3,974", note: "18 left", quantity: 0 },
  { name: "Category 5 — Lower bowl front", price: "$707", note: "General on-sale", quantity: 2 },
  { name: "Category 7 — Upper tier centre", price: "$216", note: "Fight-week release", quantity: 0 },
  { name: "Category 8 — Upper tier ends", price: "$135", note: "Sold out", quantity: 0, soldOut: true },
];

function Stepper({ quantity, disabled }) {
  return (
    <span className={cn("flex items-center gap-2.5", disabled && "opacity-40")}>
      <span className="flex size-6 items-center justify-center rounded-md border border-foreground/[0.1] text-muted-foreground">
        <Minus className="size-3" />
      </span>
      <span className={cn("w-3 text-center tabular-nums", quantity ? "font-medium text-foreground" : "text-muted-foreground")}>{quantity}</span>
      <span className="flex size-6 items-center justify-center rounded-md border border-foreground/[0.1] text-foreground/80">
        <Plus className="size-3" />
      </span>
    </span>
  );
}

function EventCover({ className }) {
  return (
    <div className={cn("relative overflow-hidden bg-foreground/[0.06]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_70%_10%,color-mix(in_oklab,var(--foreground)_22%,transparent),transparent_70%)]" />
      <svg viewBox="0 0 200 200" className="absolute top-1/2 right-10 size-56 -translate-y-1/2 text-foreground/15" fill="none" aria-hidden="true">
        <path d="M70 10h60l50 50v80l-50 50H70L20 140V60z" stroke="currentColor" strokeWidth="2" />
        <path d="M78 30h44l38 38v64l-38 38H78L40 132V68z" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="absolute bottom-5 left-6">
        <div className="font-mono text-[11px] tracking-[0.12em] text-foreground/60 uppercase">Fight Night 12</div>
        <div className="mt-1 text-[26px] leading-tight font-semibold tracking-[-0.02em]">Reyes vs Moreau</div>
      </div>
    </div>
  );
}

export function EventPageWindow({ className }) {
  return (
    <Window title="Fight Night 12: Reyes vs Moreau" icon={Globe} meta="Public page" className={cn("w-[560px]", className)}>
      <EventCover className="h-[210px]" />
      <div className="flex flex-col gap-5 px-6 py-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-3.5" /> Harbour Arena, Lisbon
        </div>
        <div className={cn("flex gap-5 border-b pb-3 text-[12px]", LINE)}>
          {["About", "What to expect", "Schedule", "Location & directions", "FAQ"].map((tab, index) => (
            <span key={tab} className={index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
              {tab}
            </span>
          ))}
        </div>
        <p className="leading-6 text-foreground/80">
          The featherweight title headlines a full card at Harbour Arena. Doors open with the prelims, and the Record Lounge runs pre-fight hospitality.
        </p>
        <div className="flex items-center justify-between rounded-xl border border-foreground/[0.08] px-4 py-3">
          <div>
            <div className="text-[12px] text-muted-foreground">Tickets from</div>
            <div className="text-[15px] font-semibold">$135</div>
          </div>
          <span className="rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background">Get tickets</span>
        </div>
      </div>
    </Window>
  );
}

export function CheckoutPanel({ className }) {
  return (
    <Window className={cn("w-[440px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-4", LINE)}>
        <Ticket className="size-4 text-muted-foreground" />
        <span className="font-medium">Choose tickets</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">
          <Zap className="size-3" /> Express Lane
        </span>
      </div>
      <div className="flex flex-col">
        {TIERS.map((tier) => (
          <div key={tier.name} className={cn("flex items-center gap-4 border-b px-5 py-3.5", LINE, tier.quantity && "bg-foreground/[0.03]")}>
            <div className="min-w-0 flex-1">
              <div className={cn("truncate", tier.soldOut ? "text-muted-foreground" : "text-foreground/90")}>{tier.name}</div>
              <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground/80">{tier.price}</span>· {tier.note}
              </div>
            </div>
            <Stepper quantity={tier.quantity} disabled={tier.soldOut} />
          </div>
        ))}
        <div className={cn("flex items-center gap-3 border-b px-5 py-3.5", LINE)}>
          <span className="flex size-4 items-center justify-center rounded border border-foreground/30" />
          <span className="flex-1 text-foreground/85">Record Lounge — pre-fight hospitality</span>
          <span className="text-muted-foreground">$163</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 py-2">
          <span className="font-mono text-[12px] tracking-wider">RECORD10</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <Check className="size-3" /> Applied
          </span>
          <span className="ml-auto text-[12px] text-muted-foreground">10% off</span>
        </div>
        <div className="flex flex-col gap-1.5 text-[12px] text-muted-foreground">
          <div className="flex justify-between">
            <span>2 × Category 5</span>
            <span>$1,414.00</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>−$141.40</span>
          </div>
          <div className="flex justify-between text-[13px] font-medium text-foreground">
            <span>Total</span>
            <span>$1,272.60</span>
          </div>
        </div>
        <span className="flex h-10 items-center justify-center rounded-lg bg-foreground text-[13px] font-medium text-background">Pay $1,272.60</span>
        <span className="text-center text-[11px] text-muted-foreground">Card payments by Stripe · Two clicks with Express Lane</span>
      </div>
    </Window>
  );
}

// Section stage: the public page behind, checkout in front with a code applied.
export function EventsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <div className="absolute top-0 left-[20px] opacity-80">
        <EventPageWindow />
      </div>
      <div className="absolute top-[56px] left-[540px] z-[2]">
        <CheckoutPanel />
      </div>
    </div>
  );
}

const RELEASES = [
  { name: "General on-sale — 17 August", mode: "On a date", sold: 1710, total: 1710, state: "Sold out" },
  { name: "Fight-week release", mode: "After a sell-out", sold: 12, total: 50, state: "On sale" },
];

export function ReleasesRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("flex items-center justify-between border-b px-4 py-3", LINE)}>
          <span className="font-medium">Category 7 — Upper tier centre</span>
          <span className="text-muted-foreground">$216</span>
        </div>
        {RELEASES.map((release, index) => (
          <div key={release.name} className={cn("px-4 py-3.5", index === 0 && cn("border-b", LINE))}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
              <span className="truncate text-foreground/90">{release.name}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Dot tone={release.state === "On sale" ? "emerald" : "strong"} />
                {release.state}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span
                  className={cn("absolute inset-y-0 left-0 origin-left rounded-full", index === 0 ? "bg-foreground/45" : "bg-emerald-500", styles.fill)}
                  style={{ width: `${(release.sold / release.total) * 100}%`, "--fill-delay": `${0.3 + index * 0.4}s` }}
                />
              </span>
              <span className="w-[86px] text-right text-[12px] text-muted-foreground tabular-nums">
                {release.sold.toLocaleString("en-US")} / {release.total.toLocaleString("en-US")}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">Starts: {release.mode}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["On Sale now", "On a date", "After a sell-out", "Manual release"].map((mode) => (
          <Chip key={mode} className={cn("h-6 text-[11px]", mode === "After a sell-out" && "border-foreground/30 text-foreground")}>
            {mode}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const BANDS = [
  { name: "Category 1", price: "$3,974", opacity: 0.9, from: 58, to: 68 },
  { name: "Category 5", price: "$707", opacity: 0.55, from: 80, to: 98 },
  { name: "Category 7", price: "$216", opacity: 0.32, from: 110, to: 128 },
  { name: "Category 8", price: "$135", opacity: 0.16, from: 138, to: 146 },
];

// Seats laid out in elliptical rings around the cage, with four aisles cut through every ring.
function seatsFor(band) {
  const seats = [];
  for (let radius = band.from; radius <= band.to; radius += 9) {
    const count = Math.floor((2 * Math.PI * radius) / 9.5);
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const inAisle = [0.25, 0.75, 1.25, 1.75].some((aisle) => Math.abs(angle / Math.PI - aisle) < 0.035);
      if (inAisle) continue;
      seats.push([150 + Math.cos(angle) * radius * 0.98, 150 + Math.sin(angle) * radius * 0.92]);
    }
  }
  return seats;
}

const PICKED = [
  [150 + Math.cos(1.62) * 80 * 0.98, 150 + Math.sin(1.62) * 80 * 0.92],
  [150 + Math.cos(1.52) * 80 * 0.98, 150 + Math.sin(1.52) * 80 * 0.92],
];

export function SeatMapRender() {
  return (
    <div className="mx-auto flex w-[460px] items-center gap-4">
      <svg viewBox="0 0 300 300" className="size-[300px] shrink-0 text-foreground" aria-hidden="true">
        <path d="M134 112h32l22 22v32l-22 22h-32l-22-22v-32z" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
        <path d="M137 120h26l17 17v26l-17 17h-26l-17-17v-26z" fill="currentColor" fillOpacity="0.05" />
        {BANDS.map((band) =>
          seatsFor(band).map(([x, y], index) => <circle key={`${band.name}-${index}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.6" fill="currentColor" fillOpacity={band.opacity} />),
        )}
        {PICKED.map(([x, y], index) => (
          <g key={index}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="5.5" fill="none" stroke="var(--color-emerald-500)" strokeWidth="1.5" />
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.6" fill="var(--color-emerald-500)" />
          </g>
        ))}
      </svg>
      <div className="flex flex-1 flex-col gap-2.5 text-[12px]">
        {BANDS.map((band) => (
          <div key={band.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-foreground" style={{ opacity: band.opacity }} />
            <span className="flex-1 text-foreground/85">{band.name}</span>
            <span className="text-muted-foreground tabular-nums">{band.price}</span>
          </div>
        ))}
        <div className={cn("mt-2 flex items-center gap-2 border-t pt-3", LINE)}>
          <span className="size-2.5 rounded-full bg-emerald-500" />
          <span className="flex-1 text-foreground/85">Your seats</span>
          <span className="text-muted-foreground">Row F</span>
        </div>
      </div>
    </div>
  );
}

export function DoorRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] [mask-image:linear-gradient(to_bottom,#000_74%,transparent)]">
      <div className="absolute top-0 left-[24px] h-[330px] w-[190px] rounded-[28px] border border-foreground/[0.12] bg-surface-card p-2.5 shadow-xl shadow-black/15 dark:bg-surface-subtle">
        <div className="flex h-full flex-col items-center rounded-[20px] border border-foreground/[0.06] px-4 pt-5">
          <div className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Fight Night 12</div>
          <div className="mt-1 text-center text-[12px] leading-4 font-medium">Category 5 — Lower bowl front</div>
          <div className="relative mt-4 size-[124px] rounded-xl bg-white p-2.5 text-black">
            <QrGlyph seed="ufc-333-a" className={cn("absolute inset-2.5 size-[104px]", styles.cycle)} />
            <QrGlyph seed="ufc-333-b" className={cn("absolute inset-2.5 size-[104px]", styles.cycle)} />
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("size-1.5 rounded-full bg-emerald-500", styles.pulse)} /> Rotating code
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[46px] left-[236px] w-[214px] rounded-xl border border-emerald-500/30 bg-surface-card p-3.5 text-[13px] shadow-lg shadow-black/10 dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span className="font-medium">Checked in</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <Avatar name="Aisha Bennett" size={22} />
          <div>
            <div className="text-foreground/90">Aisha Bennett</div>
            <div className="text-[11px] text-muted-foreground">Gate B · 2 of 2 tickets</div>
          </div>
        </div>
      </div>
      <div className="absolute top-[176px] left-[236px] flex w-[214px] flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
          <ScanLine className="size-3.5" /> Kiosk Mode
        </div>
        {["Self check-in", "On-site registration", "Buy a ticket"].map((mode, index) => (
          <span key={mode} className={cn("rounded-lg border px-3 py-2 text-[12px]", index === 0 ? "border-foreground/25 bg-foreground/[0.05] text-foreground" : "border-foreground/[0.08] text-muted-foreground")}>
            {mode}
          </span>
        ))}
      </div>
    </div>
  );
}

const TEMPLATES = ["Title card", "Now & Next", "Full day grid", "Up next by room"];

export function DisplayBoardRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className="rounded-xl bg-neutral-950 p-1.5 shadow-xl shadow-black/25 ring-1 ring-foreground/10">
        <div className="flex h-[226px] flex-col rounded-lg bg-[radial-gradient(90%_70%_at_20%_0%,rgb(255_255_255/0.08),transparent_70%)] px-6 py-5 text-neutral-100">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono tracking-[0.12em] uppercase">Fight Night 12 · Harbour Arena</span>
            <span className="tabular-nums">21:14</span>
          </div>
          <div className="mt-5 font-mono text-[10px] tracking-[0.14em] text-emerald-400 uppercase">Now</div>
          <div className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">Prelims · Bout 4 of 6</div>
          <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-3">
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-neutral-400 uppercase">Next</div>
              <div className="mt-1 text-[14px] text-neutral-200">Main card walkouts</div>
            </div>
            <span className="text-[14px] text-neutral-400 tabular-nums">22:00</span>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-16 bg-linear-to-b from-foreground/20 to-transparent" />
      <div className="mt-1 flex flex-wrap justify-center gap-1.5">
        {TEMPLATES.map((template) => (
          <Chip key={template} className={cn("h-6 text-[11px]", template === "Now & Next" && "border-foreground/30 text-foreground")}>
            {template}
          </Chip>
        ))}
      </div>
    </div>
  );
}
