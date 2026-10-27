"use client";

import { useRef } from "react";
import { Accessibility, CalendarDays, Check, ChevronRight, Flame, Lock, Mail, RotateCw, Ticket, TrendingDown, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { Camera } from "@/components/film/camera";
import { glide, lerp, progress, sample, swift } from "@/components/film/ease";
import { Bloom, Stage } from "@/components/film/film_kit";
import { Count, Cursor, Fade, Grow, TypeOn, typingTime } from "@/components/film/kinetic";
import { AppWindow, BUYER, EVENT, GeigerGlyph, Headline, StatusPill } from "@/components/film/events/events_kit";
import { BuyerMap, CheckoutDialog, HoldTimer, INK, SEAT } from "@/components/film/events/checkout_kit";
import { BANDS, CANVAS, SEAT_COUNT } from "@/components/film/events/arena";

// Act two: a buyer picks two seats, an early-bird and a code come off at checkout, the tickets arrive, the night sells out.

const ticks = (at, text, speed = 1, gain = 0.15) =>
  Array.from({ length: Math.floor((typingTime(text, speed) / 0.1) * 0.9) }, (_, index) => ({ at: Number((at + 0.05 + index * 0.1).toFixed(3)), sound: "tick", gain }));

// Seat picking: the map zooms into section 104, two seats in row C are tapped, then it eases back out.
const DIALOG = { left: 440, top: 290, width: 1380, height: 760 };
const MAP = { left: DIALOG.left + 24, top: DIALOG.top + 129, width: 960, height: 505 };
const FIT = Math.min((MAP.width - 40) / CANVAS.width, (MAP.height - 30) / CANVAS.height);
const C7 = SEAT("104", "C", 7);
const C8 = SEAT("104", "C", 8);
const PICK_7 = 1.35;
const PICK_8 = 1.8;
const RESERVE_AT = 4.35;

const ZOOM = [
  { t: 0, z: 1, fx: 450, fy: 280 },
  { t: 1.05, z: 2.7, fx: 598, fy: 214, ease: swift },
  { t: 2.35, z: 2.7, fx: 598, fy: 214 },
  { t: 3.3, z: 1.35, fx: 560, fy: 250, ease: swift },
];

// Where a canvas point lands in the frame at time t, so the cursor can tap the seat the zoom is showing.
function mapPoint(time, point) {
  const { z, fx, fy } = sample(ZOOM, time);
  return { x: MAP.left + MAP.width / 2 + (point.x - fx) * FIT * z, y: MAP.top + MAP.height / 2 + (point.y - fy) * FIT * z };
}

function ZoomedMap() {
  const ref = useRef(null);
  useFrame((local) => {
    const { z, fx, fy } = sample(ZOOM, local);
    if (ref.current) ref.current.style.transform = `translate(${MAP.width / 2 - fx * FIT * z}px, ${MAP.height / 2 - fy * FIT * z}px) scale(${FIT * z})`;
  });
  return (
    <div ref={ref} className="absolute top-0 left-0 origin-top-left" style={{ width: CANVAS.width, height: CANVAS.height }}>
      <BuyerMap
        className="size-full"
        picks={[
          { id: "C7", x: C7.x, y: C7.y, at: PICK_7 },
          { id: "C8", x: C8.x, y: C8.y, at: PICK_8 },
        ]}
      />
    </div>
  );
}

function RowsPanel() {
  const sections = [
    ["104", "front", [["Row C", "Prime", 9], ["Row D", "Great view", 12]]],
    ["101", "ringside", [["Row F", "Great view", 4]]],
    ["201", "lower", [["Row B", "Good view", 14]]],
  ];
  return (
    <div className="flex flex-col gap-4 text-[13px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.muted }}>
          Rows on sale
        </span>
        <span className="flex items-center gap-1.5 text-[12px]" style={{ color: INK.muted }}>
          <Accessibility className="size-3.5" /> Accessible
        </span>
      </div>
      <span className="flex h-10 items-center rounded-lg border px-3" style={{ borderColor: INK.border, background: INK.raised }}>
        2 seats together
      </span>
      <div className="flex rounded-lg border p-1 text-[12px]" style={{ borderColor: INK.border }}>
        {["Best seats", "Lowest price", "Section"].map((tab, index) => (
          <span key={tab} className="flex-1 rounded-md py-1.5 text-center" style={index ? { color: INK.muted } : { background: INK.raised, fontWeight: 600 }}>
            {tab}
          </span>
        ))}
      </div>
      <div className="rounded-xl border p-3.5" style={{ borderColor: INK.brand, background: "rgb(255 77 46 / 0.08)" }}>
        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.brand }}>
          Best available
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[15px] font-semibold">Sec 104 · Row C</span>
          <span className="font-semibold tabular-nums">$250</span>
        </div>
        <div style={{ color: INK.muted }}>2 together · 9 open</div>
      </div>
      {sections.map(([name, band, rows]) => (
        <div key={name} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: BANDS[band].color }} />
            <span className="font-semibold">Sec {name}</span>
            <span style={{ color: INK.muted }}>{BANDS[band].name}</span>
            <span className="ml-auto" style={{ color: INK.muted }}>
              from ${BANDS[band].price}
            </span>
          </div>
          {rows.map(([row, view, open]) => (
            <div key={row} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: INK.raised }}>
              <span>{row}</span>
              <span className="rounded px-1.5 text-[10px] font-medium" style={{ background: "rgb(255 255 255 / 0.08)", color: INK.muted }}>
                {view}
              </span>
              <span className="ml-auto text-[12px]" style={{ color: INK.muted }}>
                {open} open
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SeatsBar() {
  const empty = useRef(null);
  const held = useRef(null);
  const bar = useRef(null);
  const button = useRef(null);
  useFrame((local) => {
    const swap = progress(local, PICK_8 + 0.1, 0.35, glide);
    if (empty.current) empty.current.style.opacity = 1 - swap;
    if (held.current) {
      held.current.style.opacity = swap;
      held.current.style.transform = `translateY(${(1 - swap) * 10}px)`;
    }
    if (bar.current) bar.current.style.transform = `scaleX(${1 - Math.max(0, local - PICK_8) / 600})`;
    if (button.current) {
      const press = Math.max(0, 1 - Math.abs(local - RESERVE_AT) / 0.12);
      button.current.style.transform = `scale(${1 - press * 0.04})`;
    }
  });
  return (
    <div className="absolute inset-x-6 bottom-5 h-[84px] overflow-hidden rounded-2xl border" style={{ borderColor: INK.border, background: INK.raised }}>
      <div ref={empty} className="absolute inset-0 flex items-center gap-6 px-6 text-[13px]" style={{ color: INK.muted }}>
        {Object.values(BANDS).map((band) => (
          <span key={band.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: band.color }} /> {band.name} · ${band.price}
          </span>
        ))}
        <span className="ml-auto">Tap a seat on the map, or pick a row from the list.</span>
      </div>
      <div ref={held} className="absolute inset-0 flex items-center gap-6 px-6 opacity-0">
        <div className="leading-tight">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.muted }}>
            Sec 104 / Row C
          </div>
          <div className="mt-1 flex gap-1.5">
            {["C7", "C8"].map((seat) => (
              <span key={seat} className="rounded-md px-2 py-0.5 text-[13px] font-semibold" style={{ background: "rgb(59 130 246 / 0.2)", color: "#93c5fd" }}>
                {seat}
              </span>
            ))}
            <span className="flex items-center gap-1 px-1 text-[12px]" style={{ color: INK.muted }}>
              <X className="size-3" /> Clear
            </span>
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.muted }}>
            Total
          </div>
          <div className="text-[22px] font-bold tabular-nums">$500</div>
        </div>
        <span className="h-12 border-l border-dashed" style={{ borderColor: "rgb(255 255 255 / 0.2)" }} />
        <span className="flex items-center gap-2 text-[15px] font-semibold text-amber-400">
          ⏱ Held <HoldTimer at={PICK_8} />
        </span>
        <span ref={button} className="ml-auto flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold" style={{ background: INK.brand, color: "#fff" }}>
          Reserve seats
        </span>
        <span ref={bar} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-amber-400" />
      </div>
    </div>
  );
}

const SEATS_CAMERA = [
  { t: 0, s: 1.03, x: -10, y: 6, rx: 2 },
  { t: 6.1, s: 0.99, x: 0, y: 0, rx: 0 },
];

export function SellSeats() {
  const tap7 = mapPoint(PICK_7, C7);
  const tap8 = mapPoint(PICK_8, C8);
  return (
    <>
      <Stage />
      <Camera keys={SEATS_CAMERA} width={1920} height={1080} perspective={3000}>
        <CheckoutDialog title="Get Tickets" step={1} next="Details" className="absolute" style={DIALOG}>
          <div className="absolute overflow-hidden rounded-2xl bg-[#161616]" style={{ left: 24, top: 24, width: MAP.width, height: MAP.height }}>
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_55%,rgb(0_0_0/0.5))]" />
            <ZoomedMap />
            <span className="absolute top-3 left-4 rounded-md bg-black/40 px-2 py-1 text-[11px] text-white/55">Drag to pan · scroll to zoom</span>
          </div>
          <div className="absolute top-6 right-6 w-[352px]">
            <RowsPanel />
          </div>
          <SeatsBar />
        </CheckoutDialog>
        <Cursor
          keys={[
            { t: 0.55, x: tap7.x + 140, y: tap7.y + 160 },
            { t: PICK_7 - 0.04, x: tap7.x - 3, y: tap7.y - 3, ease: swift },
            { t: PICK_8 - 0.04, x: tap8.x - 3, y: tap8.y - 3, ease: swift },
            { t: 3.4, x: 1500, y: 930 },
            { t: RESERVE_AT - 0.04, x: 1700, y: 984, ease: swift },
            { t: 5.6, x: 1690, y: 990 },
          ]}
          clicks={[PICK_7, PICK_8, RESERVE_AT]}
        />
      </Camera>
      <Headline kicker="Sell" text="Sell every seat." at={0.1} />
      <Fade at={0.7} y={10} duration={0.6} className="absolute top-[236px] left-[124px] text-[28px] tracking-[-0.02em] text-foreground/55">
        Buyers pick theirs on your map. Held while they pay.
      </Fade>
    </>
  );
}
SellSeats.cues = [
  { at: 0, sound: "hit", gain: 0.4 },
  { at: 0.15, sound: "whoosh", gain: 0.3 },
  { at: PICK_7, sound: "pop", gain: 0.45 },
  { at: PICK_8, sound: "pop", gain: 0.45, pitch: 1 },
  { at: RESERVE_AT, sound: "click", gain: 0.55 },
];

// The details step: name, email, a code, and the credits it applies, then on to Stripe.
const NAME_AT = 0.2;
const EMAIL_AT = 0.8;
const CODE_AT = 1.75;
const APPLY_AT = 2.4;
const CONTINUE_AT = 3.85;

function Label({ children }) {
  return <span className="text-[13px] font-medium" style={{ color: INK.muted }}>{children}</span>;
}

function DarkInput({ className, children }) {
  return <div className={cn("flex h-12 items-center rounded-xl border px-4 text-[16px]", className)} style={{ borderColor: INK.border, background: INK.raised }}>{children}</div>;
}

function CodeField() {
  const field = useRef(null);
  const chip = useRef(null);
  useFrame((local) => {
    const swap = progress(local, APPLY_AT + 0.08, 0.3, glide);
    if (field.current) field.current.style.opacity = 1 - swap;
    if (chip.current) {
      chip.current.style.opacity = swap;
      chip.current.style.transform = `scale(${lerp(0.96, 1, swap)})`;
    }
  });
  return (
    <div className="relative h-12">
      <div ref={field} className="absolute inset-0 flex gap-2">
        <DarkInput className="flex-1 font-mono tracking-[0.08em] uppercase">
          <TypeOn text="FIGHTCLUB" at={CODE_AT} speed={1.6} caretUntil={APPLY_AT} />
        </DarkInput>
        <span className="flex h-12 items-center rounded-xl border px-5 text-[15px] font-semibold" style={{ borderColor: INK.border }}>
          Apply
        </span>
      </div>
      <div ref={chip} className="absolute inset-0 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 text-[15px] text-emerald-300 opacity-0">
        <Check className="size-4" strokeWidth={2.5} />
        <span className="font-mono font-semibold tracking-[0.06em]">FIGHTCLUB</span> applied
        <span className="ml-auto text-[13px]" style={{ color: INK.muted }}>
          Remove
        </span>
      </div>
    </div>
  );
}

function Line({ label, value, tone, className }) {
  return (
    <div className={cn("flex items-center justify-between text-[15px]", className)}>
      <span style={{ color: tone === "credit" ? "#6ee7b7" : INK.muted }}>{label}</span>
      <span className="tabular-nums" style={{ color: tone === "credit" ? "#6ee7b7" : INK.text }}>
        {value}
      </span>
    </div>
  );
}

const money = (value) => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function SellCheckout() {
  return (
    <>
      <Stage />
      <Camera keys={[{ t: 0, s: 1.02, rx: 1.5 }, { t: 5.1, s: 1.0, rx: 0 }]} width={1920} height={1080} perspective={3000}>
        <CheckoutDialog title="Get Tickets" step={2} next="Payment" className="absolute" style={{ left: 560, top: 290, width: 1260, height: 740 }}>
          <div className="absolute inset-0 grid grid-cols-2 gap-10 p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 rounded-2xl border p-4" style={{ borderColor: INK.border, background: INK.raised }}>
                <span className="flex size-11 items-center justify-center rounded-xl" style={{ background: "rgb(251 191 36 / 0.15)", color: "#fbbf24" }}>
                  <Ticket className="size-5" />
                </span>
                <div className="flex-1">
                  <div className="text-[16px] font-semibold">Lower bowl front</div>
                  <div className="text-[13px]" style={{ color: INK.muted }}>
                    Sec 104 · Row C · Seats 7, 8
                  </div>
                </div>
                <span className="text-[13px]" style={{ color: INK.muted }}>
                  Quantity <span className="ml-1 font-semibold text-white">2</span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Discount code</Label>
                <CodeField />
              </div>
              <div className="mt-1 flex flex-col gap-2.5 border-t pt-5" style={{ borderColor: INK.border }}>
                <Line label="Lower bowl front × 2" value="$500.00" />
                <Line label="Early bird (15% off)" value="−$75.00" tone="credit" />
                <Grow at={APPLY_AT + 0.12} height={28}>
                  <Line label="Discount (FIGHTCLUB)" value="−$42.50" tone="credit" className="pt-1" />
                </Grow>
                <div className="mt-2 flex items-center justify-between border-t pt-4 text-[20px] font-bold" style={{ borderColor: INK.border }}>
                  Total
                  <Count from={425} to={382.5} at={APPLY_AT + 0.15} duration={0.6} format={money} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Full name</Label>
                <DarkInput>
                  <TypeOn text={BUYER.name} at={NAME_AT} speed={1.7} caretUntil={EMAIL_AT} />
                </DarkInput>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <DarkInput>
                  <TypeOn text={BUYER.email} at={EMAIL_AT} speed={1.9} caretUntil={CODE_AT} />
                </DarkInput>
              </div>
              <ContinueButton />
              <span className="flex items-center justify-center gap-2 text-[13px]" style={{ color: INK.muted }}>
                <Lock className="size-3.5" /> Payments are securely processed by Stripe.
              </span>
            </div>
          </div>
        </CheckoutDialog>
        <Cursor
          keys={[
            { t: 1.9, x: 1250, y: 700 },
            { t: APPLY_AT - 0.04, x: 1128, y: 573, ease: swift },
            { t: 3.0, x: 1350, y: 700 },
            { t: CONTINUE_AT - 0.04, x: 1499, y: 651, ease: swift },
            { t: 5.1, x: 1508, y: 660 },
          ]}
          clicks={[APPLY_AT, CONTINUE_AT]}
        />
      </Camera>
      <Headline kicker="Checkout" text={"Early-birds\nand codes,\napplied at\ncheckout."} at={0.1} />
    </>
  );
}
SellCheckout.cues = [
  ...ticks(NAME_AT, BUYER.name, 1.7),
  ...ticks(EMAIL_AT, BUYER.email, 1.9),
  ...ticks(CODE_AT, "FIGHTCLUB", 1.6),
  { at: APPLY_AT, sound: "click", gain: 0.55 },
  { at: APPLY_AT + 0.12, sound: "success", gain: 0.4 },
  { at: CONTINUE_AT, sound: "click", gain: 0.55 },
  { at: CONTINUE_AT + 0.1, sound: "send", gain: 0.4 },
];

function ContinueButton() {
  const ref = useRef(null);
  const spinner = useRef(null);
  useFrame((local) => {
    const press = Math.max(0, 1 - Math.abs(local - CONTINUE_AT) / 0.12);
    if (ref.current) ref.current.style.transform = `scale(${1 - press * 0.04})`;
    if (spinner.current) {
      spinner.current.style.opacity = local > CONTINUE_AT + 0.1 ? 1 : 0;
      spinner.current.style.transform = `rotate(${local * 540}deg)`;
    }
  });
  return (
    <span ref={ref} className="mt-2 flex h-14 items-center justify-center gap-2 rounded-xl text-[17px] font-semibold" style={{ background: INK.brand, color: "#fff" }}>
      Continue To Payment <ChevronRight className="size-5" />
      <span ref={spinner} className="ml-1 size-4 rounded-full border-2 border-white/30 border-t-white opacity-0" />
    </span>
  );
}

// The done step and the ticket email it sends (ticket-purchase-confirmation in dash's mails).
function SentBanner() {
  const sending = useRef(null);
  const sent = useRef(null);
  useFrame((local) => {
    const swap = progress(local, 1.0, 0.35, glide);
    if (sending.current) sending.current.style.opacity = 1 - swap;
    if (sent.current) sent.current.style.opacity = swap;
  });
  return (
    <div className="relative h-[74px] rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08]">
      <div ref={sending} className="absolute inset-0 flex items-center gap-3 px-4 text-[14px] text-emerald-200">
        <Mail className="size-4" /> Emailing your tickets to {BUYER.email}…
      </div>
      <div ref={sent} className="absolute inset-0 flex items-center gap-3 px-4 opacity-0">
        <Mail className="size-4 text-emerald-300" />
        <div className="flex-1 leading-snug">
          <div className="text-[14px] font-semibold text-emerald-200">Tickets sent to {BUYER.email}</div>
          <div className="text-[12px] text-emerald-200/60">Check your inbox — and your spam folder if they aren&apos;t there in a few minutes.</div>
        </div>
        <span className="flex items-center gap-1.5 text-[13px] text-emerald-200/80">
          <RotateCw className="size-3.5" /> Resend
        </span>
      </div>
    </div>
  );
}

function Confirmed() {
  return (
    <div className="absolute inset-0 flex flex-col gap-5 p-8">
      <div className="flex items-center gap-4">
        <Fade at={0.05} scale={0.6} y={0} duration={0.45} className="flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-7" strokeWidth={3} />
        </Fade>
        <div>
          <div className="text-[28px] font-bold tracking-[-0.02em]">You&apos;re going!</div>
          <div className="text-[15px]" style={{ color: INK.muted }}>
            You&apos;re all set for {EVENT.name}.
          </div>
        </div>
      </div>
      <SentBanner />
      <div className="grid grid-cols-[110px_1fr] gap-y-3 text-[15px]">
        {[
          ["Ticket", "2 × Lower bowl front"],
          ["Seats", "Sec 104 · Row C · 7, 8"],
          ["When", `${EVENT.date} · ${EVENT.time}`],
          ["Where", `${EVENT.venue}, ${EVENT.city}`],
          ["Order", "#7c2e91a4"],
        ].map(([label, value]) => (
          <div key={label} className="contents">
            <span style={{ color: INK.muted }}>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketEmail() {
  return (
    <div className="w-[600px] overflow-hidden rounded-2xl bg-white text-[#111] shadow-[0_2px_8px_rgb(0_0_0/0.08),0_40px_90px_-30px_rgb(0_0_0/0.45)]">
      <div className="flex items-center gap-3 border-b border-black/[0.08] px-6 py-4 text-[13px]">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#161616] text-white">
          <GeigerGlyph className="h-[9px] text-white" />
        </span>
        <div className="leading-tight">
          <div className="font-semibold">Your tickets for {EVENT.name}</div>
          <div className="text-black/50">Geiger Events · to {BUYER.email}</div>
        </div>
      </div>
      <div className="bg-[#161616] px-8 pt-8 pb-9 text-white">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em]">
          <GeigerGlyph className="h-[10px] text-white" /> GEIGER EVENTS
        </div>
        <div className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-white/50">ORDER CONFIRMED</div>
        <div className="mt-2 text-[34px] leading-[1.1] font-bold tracking-[-0.02em]">
          You&apos;re in, Jordan.
          <br />
          Your tickets are yours.
        </div>
        <div className="mt-6 flex gap-3 text-[12px] font-semibold tracking-[0.1em]">
          <span className="bg-white px-4 py-2.5 text-black">VIEW MY TICKETS</span>
          <span className="border border-white/40 px-4 py-2.5">Add to calendar</span>
        </div>
      </div>
      <div className="flex justify-between bg-[#212121] px-8 py-3 font-mono text-[11px] tracking-[0.12em] text-white/60">
        <span>ORDER GE-48192</span>
        <span>PAID 26 OCT 2026</span>
      </div>
      <div className="flex flex-col gap-2 px-8 py-6 text-[14px]">
        <div className="text-[11px] font-semibold tracking-[0.16em] text-black/45">EVENT DETAILS</div>
        <div className="text-[16px] font-semibold">{EVENT.name}</div>
        {[
          ["Date", "Saturday, November 21, 2026"],
          ["Ticket holder", BUYER.name],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-black/[0.06] py-1.5">
            <span className="text-black/50">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailArrival() {
  const ref = useRef(null);
  useFrame((local) => {
    const enter = progress(local, 1.9, 0.9, swift);
    if (!ref.current) return;
    ref.current.style.opacity = Math.min(1, enter * 1.6);
    ref.current.style.transform = `translate3d(${(1 - enter) * 340}px, ${(1 - enter) * 60}px, 0) rotate(${lerp(6, 2.5, enter)}deg)`;
  });
  return (
    <div ref={ref} className="absolute top-[250px] left-[1180px] opacity-0">
      <TicketEmail />
    </div>
  );
}

export function SellConfirmed() {
  return (
    <>
      <Stage />
      <Camera keys={[{ t: 0, s: 1.0 }, { t: 5.1, s: 1.035, x: -20 }]} width={1920} height={1080}>
        <CheckoutDialog title="Order confirmed" className="absolute" style={{ left: 300, top: 330, width: 900, height: 620 }}>
          <Confirmed />
        </CheckoutDialog>
        <EmailArrival />
      </Camera>
      <Headline kicker="Sell" text={"Tickets land\nin their inbox."} at={0.1} />
    </>
  );
}
SellConfirmed.cues = [
  { at: 0.05, sound: "success", gain: 0.55 },
  { at: 1.0, sound: "send", gain: 0.35 },
  { at: 1.95, sound: "whoosh", gain: 0.35 },
];

// The Overview at the peak: sales roll in, the night's row fills and flips to Sold out.
const SOLD_AT = 3.55;
const EVENTS = [
  { name: EVENT.name, date: "Nov 21", capacity: SEAT_COUNT, from: 3120, to: SEAT_COUNT, revenue: [728400, 941860], momentum: "Selling fast" },
  { name: "Harbour Jazz Weekend", date: "Dec 5", capacity: 1200, from: 812, to: 846, revenue: [40620, 42300], momentum: "On track" },
  { name: "Lisbon Design Summit", date: "Jan 14", capacity: 600, from: 388, to: 395, revenue: [69840, 71100], momentum: "On track" },
  { name: "Indie Film Screening", date: "Dec 12", capacity: 240, from: 92, to: 94, revenue: [1380, 1410], momentum: "Slow" },
];

function SoldRow({ event, index }) {
  const bar = useRef(null);
  const count = useRef(null);
  const onSale = useRef(null);
  const soldOut = useRef(null);
  const row = useRef(null);
  useFrame((local) => {
    const fill = progress(local, 0.1, SOLD_AT - 0.1, (x) => 1 - (1 - x) ** 2.2);
    const value = Math.round(lerp(event.from, event.to, fill));
    if (count.current) count.current.textContent = `${value.toLocaleString("en-US")} / ${event.capacity.toLocaleString("en-US")} seats`;
    if (bar.current) bar.current.style.transform = `scaleX(${value / event.capacity})`;
    const flip = index === 0 && local >= SOLD_AT;
    if (onSale.current) onSale.current.style.display = flip ? "none" : "";
    if (soldOut.current) soldOut.current.style.display = flip ? "" : "none";
    if (row.current && index === 0) row.current.style.background = `color-mix(in oklab, var(--color-sky-500) ${Math.max(0, 1 - Math.abs(local - SOLD_AT - 0.2) / 0.9) * 10}%, transparent)`;
  });
  const Momentum = event.momentum === "Slow" ? TrendingDown : event.momentum === "On track" ? TrendingUp : Flame;
  const tone = { "Selling fast": "text-emerald-600", "On track": "text-sky-600", Slow: "text-amber-600" }[event.momentum];
  return (
    <div ref={row} className="grid grid-cols-[1.6fr_130px_1fr_150px_150px] items-center gap-4 border-t border-foreground/[0.07] px-5 py-4">
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold">{event.name}</div>
        <div ref={count} className="text-[13px] text-muted-foreground tabular-nums" />
      </div>
      <div>
        <span ref={onSale}>
          <StatusPill status="On Sale" />
        </span>
        <span ref={soldOut} style={{ display: "none" }}>
          <StatusPill status="Sold out" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
          <span ref={bar} className="block h-full origin-left rounded-full bg-foreground" />
        </span>
      </div>
      <div className="text-[15px] font-semibold tabular-nums">
        <Count from={event.revenue[0]} to={event.revenue[1]} at={0.1} duration={SOLD_AT - 0.1} format={(value) => `$${Math.round(value).toLocaleString("en-US")}`} />
      </div>
      <span className={cn("flex items-center gap-1.5 text-[13px] font-medium", tone)}>
        <Momentum className="size-4" /> {event.momentum}
      </span>
    </div>
  );
}

function Gauge() {
  const arc = useRef(null);
  const label = useRef(null);
  const radius = 92;
  const length = 2 * Math.PI * radius;
  useFrame((local) => {
    const value = lerp(0.79, 0.86, progress(local, 0.1, SOLD_AT, glide));
    if (arc.current) arc.current.style.strokeDashoffset = String(length * (1 - value));
    if (label.current) label.current.textContent = `${Math.round(value * 100)}%`;
  });
  return (
    <div className="relative mx-auto size-[220px]">
      <svg viewBox="0 0 220 220" className="size-full -rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="var(--surface-strong)" strokeWidth="16" />
        <circle ref={arc} cx="110" cy="110" r={radius} fill="none" stroke="var(--foreground)" strokeWidth="16" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span ref={label} className="text-[40px] leading-none font-bold tabular-nums">
          79%
        </span>
        <span className="mt-1 text-[13px] text-muted-foreground">Sold</span>
      </div>
    </div>
  );
}

function TrendChart() {
  const ref = useRef(null);
  const points = [12, 18, 16, 26, 31, 29, 42, 48, 55, 61, 74, 92];
  const path = points.map((value, index) => `${index ? "L" : "M"}${(index / (points.length - 1)) * 640} ${180 - value * 1.8}`).join(" ");
  useFrame((local) => {
    if (ref.current) ref.current.style.strokeDashoffset = String(1000 * (1 - progress(local, 0, 2.6, glide)));
  });
  return (
    <svg viewBox="-10 -10 660 210" className="h-[200px] w-full overflow-visible">
      {[0, 60, 120, 180].map((y) => (
        <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="var(--border)" strokeDasharray="4 6" />
      ))}
      <path ref={ref} d={path} fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinejoin="round" pathLength="1000" strokeDasharray="1000" strokeDashoffset="1000" />
    </svg>
  );
}

function OverviewScreen() {
  const stats = [
    ["Registrations", 4120, 5912, "+38.4%", true],
    ["Ticket Revenue", 912400, 1284610, "+41.2%", true],
    ["Check-ins", 1880, 1880, "+5.1%", true],
    ["New RSVPs", 141, 148, "−3.4%", false],
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-6 px-9 pt-7">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[24px] font-bold tracking-[-0.02em]">Events Overview</div>
          <div className="text-[14px] text-muted-foreground">Track registrations, ticket sales, check-ins, and revenue across all your events.</div>
        </div>
        <div className="flex divide-x divide-foreground/[0.1]">
          {[
            ["Events", "24"],
            ["Upcoming", "6"],
          ].map(([label, value]) => (
            <div key={label} className="px-5 text-right">
              <div className="text-[10px] font-semibold tracking-[0.1em] text-text-tertiary uppercase">{label}</div>
              <div className="text-[22px] font-bold">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-foreground/[0.08] rounded-xl border border-foreground/[0.08] bg-surface-subtle">
        {stats.map(([label, from, to, delta, up]) => (
          <div key={label} className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[11px] font-medium tracking-[0.06em] text-text-tertiary uppercase">{label}</span>
            <span className="text-[26px] leading-tight font-bold">
              <Count from={from} to={to} at={0.05} duration={SOLD_AT} format={(value) => `${label === "Ticket Revenue" ? "$" : ""}${Math.round(value).toLocaleString("en-US")}`} />
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
              <span className={up ? "text-emerald-600" : "text-red-600"}>{delta}</span> Vs Last Period
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl border border-foreground/[0.08] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold">Registrations Over Time</div>
              <div className="text-[13px] text-muted-foreground">Tickets sold across your events.</div>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-2.5 py-1 text-[12px] text-text-secondary">
              <CalendarDays className="size-3.5" /> All
            </span>
          </div>
          <TrendChart />
        </div>
        <div className="rounded-xl border border-foreground/[0.08] p-5">
          <div className="text-[15px] font-semibold">Sell-Through Rate</div>
          <div className="mb-2 text-[13px] text-muted-foreground">Seats sold vs. capacity.</div>
          <Gauge />
        </div>
      </div>
      <div className="rounded-xl border border-foreground/[0.08]">
        <div className="px-5 py-4">
          <div className="text-[15px] font-semibold">Top Performing Events</div>
          <div className="text-[13px] text-muted-foreground">Ranked by sales momentum and sell-through.</div>
        </div>
        {EVENTS.map((event, index) => (
          <SoldRow key={event.name} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}

// The window is 1560 × 1000; the Fight Night row sits around (600, 760), where the camera ends up.
const OVERVIEW_CAMERA = [
  { t: 0, x: 250, y: 160, s: 0.78, ry: -6, rx: 4 },
  { t: 2.6, x: 235, y: 120, s: 0.83, ry: -5, rx: 3.5 },
  { t: SOLD_AT - 0.1, x: 110, y: -60, s: 1.0, ry: -3, rx: 2, ease: swift },
  { t: 6.1, x: 30, y: -175, s: 1.16, ry: -2, rx: 1.5, ease: glide },
];

export function SalesOverview() {
  return (
    <>
      <Stage />
      <Camera keys={OVERVIEW_CAMERA} width={1560} height={1000} perspective={2600}>
        <AppWindow width={1560} height={1000}>
          <OverviewScreen />
        </AppWindow>
      </Camera>
      <Bloom at={SOLD_AT} size={1300} strength={0.12} color="var(--color-rose-500)" className="top-[62%] left-[58%]" />
      <Headline kicker="Overview" text={"Watch it\nsell out."} at={0.1} out={2.8} />
    </>
  );
}
SalesOverview.cues = [
  { at: 0, sound: "impact", gain: 0.55 },
  ...Array.from({ length: 14 }, (_, index) => ({ at: Number((0.2 + index * 0.24).toFixed(2)), sound: "tick", gain: 0.12 })),
  { at: SOLD_AT, sound: "success", gain: 0.6 },
  { at: SOLD_AT, sound: "hit", gain: 0.45 },
];

export const SELL_SHOTS = { sell_seats: SellSeats, sell_checkout: SellCheckout, sell_confirmed: SellConfirmed, sales_overview: SalesOverview };
