"use client";

import { useRef } from "react";
import { RotateCw } from "lucide-react";
import { useFrame } from "@/components/film/clock";
import { Camera } from "@/components/film/camera";
import { glide, lerp, progress, swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { Count, Words } from "@/components/film/kinetic";
import { AppWindow, EVENT, Headline, Phone, StatusPill } from "@/components/film/events/events_kit";
import { PassScreen, ScannerScreen } from "@/components/film/events/pass";

// Act three: the ticket on the buyer's phone, the staff scanner admitting guests, and the attendance hitting capacity.

const PASS_CAMERA = [
  { t: 0, x: 260, y: 70, ry: 30, rx: 10, rz: -5, s: 0.92 },
  { t: 2.4, x: 230, y: 0, ry: -8, rx: 3, rz: 1, s: 1.0, ease: glide },
  { t: 4.1, x: 222, y: -8, ry: -12, rx: 2.5, rz: 1.5, s: 1.02 },
];

export function DoorPass() {
  return (
    <>
      <Stage />
      <Camera keys={PASS_CAMERA} width={400} height={846} perspective={1800}>
        <Phone>
          <PassScreen brightAt={0.7} />
        </Phone>
      </Camera>
      <Headline kicker="Run the door" text={"Tickets in\ntheir pocket."} at={0.1} className="top-[360px]" />
    </>
  );
}
DoorPass.cues = [
  { at: 0, sound: "whoosh", gain: 0.45 },
  { at: 0.7, sound: "chime", gain: 0.3, pitch: 2 },
];

const SCANS = [1.05, 2.05, 3.05, 4.05, 5.05];
const LIVE_FROM = 2914;
const LIVE_TO = 3968;
const liveCount = (local) => lerp(LIVE_FROM, LIVE_TO, progress(local, 0.2, 5.8, (x) => x ** 1.15));

// The buyer's phone leans in to show its code, then steps away after the first admit.
function BuyerPhone() {
  const ref = useRef(null);
  useFrame((local) => {
    const enter = progress(local, -0.2, 1.0, swift);
    const leave = progress(local, SCANS[0] + 0.45, 0.8, swift);
    if (!ref.current) return;
    ref.current.style.transform = `translate3d(${lerp(-260, 0, enter) - leave * 900}px, ${lerp(80, 0, enter) + leave * 260}px, 0) rotateY(${lerp(55, 38, enter)}deg) rotateZ(${lerp(-8, -3, enter) - leave * 10}deg)`;
    ref.current.style.opacity = 1 - leave;
  });
  return (
    <div className="absolute top-[290px] left-[620px]" style={{ perspective: 1600 }}>
      <div ref={ref} style={{ transformStyle: "preserve-3d" }}>
        <Phone width={360} height={760}>
          <PassScreen brightAt={-1} />
        </Phone>
      </div>
    </div>
  );
}

export function DoorScan() {
  return (
    <>
      <Stage />
      <BuyerPhone />
      <Camera keys={[{ t: 0, x: 330, y: 40, ry: -14, rx: 4, s: 1 }, { t: 6.1, x: 310, y: 20, ry: -9, rx: 3, s: 1.04 }]} width={400} height={846} perspective={2000}>
        <Phone dark={false}>
          <ScannerScreen scans={SCANS} count={liveCount} />
        </Phone>
      </Camera>
      <Headline kicker="Run the door" text={"Scan them in\nfrom any phone."} at={0.1} />
    </>
  );
}
DoorScan.cues = SCANS.flatMap((at, index) => [
  { at, sound: "scan", gain: index ? 0.45 : 0.6 },
  { at: at + 0.06, sound: "success", gain: index ? 0.22 : 0.4 },
]);

// Real-time Attendance as the last gates close: the night's row fills to capacity, then "Full house."
const FULL_AT = 1.9;

function AttendanceRow() {
  const bar = useRef(null);
  const count = useRef(null);
  useFrame((local) => {
    const fill = progress(local, 0, FULL_AT, glide);
    const value = Math.round(lerp(LIVE_TO, EVENT.capacity, fill));
    if (count.current) count.current.textContent = value.toLocaleString("en-US");
    if (bar.current) bar.current.style.transform = `scaleX(${value / EVENT.capacity})`;
  });
  return (
    <div className="grid grid-cols-[1.5fr_120px_170px_1fr_1.3fr] items-center gap-4 border-t border-foreground/[0.07] px-5 py-4">
      <div>
        <div className="text-[15px] font-semibold">{EVENT.name}</div>
        <div className="text-[13px] text-muted-foreground">{EVENT.date}, 2026</div>
      </div>
      <StatusPill status="Live" />
      <div className="text-[15px]">
        <span ref={count} className="font-bold tabular-nums">
          {LIVE_TO.toLocaleString("en-US")}
        </span>
        <span className="text-muted-foreground"> / {EVENT.capacity.toLocaleString("en-US")}</span>
      </div>
      <span className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
        <span ref={bar} className="block h-full origin-left rounded-full bg-emerald-400" />
      </span>
      <div className="flex gap-2 text-[12px]">
        <span className="rounded-full border border-foreground/[0.1] bg-surface-subtle px-2.5 py-1">📍 North Gate 2,140</span>
        <span className="rounded-full border border-foreground/[0.1] bg-surface-subtle px-2.5 py-1">📍 South Gate 1,892</span>
      </div>
    </div>
  );
}

function AttendanceScreen() {
  return (
    <div className="absolute inset-0 flex flex-col gap-6 px-9 pt-7">
      <div className="flex items-end justify-between border-b border-foreground/[0.08] pb-6">
        <div>
          <div className="text-[24px] font-bold tracking-[-0.02em]">Real-time Attendance</div>
          <div className="max-w-[640px] text-[14px] text-muted-foreground">Live check-in counts across every event, refreshed automatically. Watch arrivals build as your doors open.</div>
        </div>
        <span className="flex h-9 items-center gap-2 rounded-lg border border-foreground/[0.12] px-3.5 text-[14px] font-medium">
          <RotateCw className="size-4" /> Refresh
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-foreground/[0.08] rounded-xl border border-foreground/[0.08] bg-surface-subtle">
        {[
          ["Checked in now", <Count key="in" from={LIVE_TO} to={EVENT.capacity} at={0} duration={FULL_AT} />, "Across all events"],
          ["Live events", "1", "With attendees on site"],
          ["Overall arrival", <Count key="rate" from={98} to={100} at={0} duration={FULL_AT} format={(value) => `${Math.round(value)}%`} />, "Checked in vs expected"],
        ].map(([label, value, footer]) => (
          <div key={label} className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[11px] font-medium tracking-[0.06em] text-text-tertiary uppercase">{label}</span>
            <span className="text-[28px] leading-tight font-bold">{value}</span>
            <span className="text-[11px] text-text-tertiary">{footer}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-foreground/[0.08]">
        <div className="grid grid-cols-[1.5fr_120px_170px_1fr_1.3fr] gap-4 px-5 py-3 text-[12px] font-medium text-text-tertiary">
          <span>Event</span>
          <span>Status</span>
          <span>Checked in</span>
          <span>Arrival</span>
          <span>Gates & sessions</span>
        </div>
        <AttendanceRow />
        {[
          ["Harbour Jazz Weekend", "Dec 5, 2026", "1,200"],
          ["Indie Film Screening", "Dec 12, 2026", "240"],
          ["Lisbon Design Summit", "Jan 14, 2027", "600"],
        ].map(([name, date, capacity]) => (
          <div key={name} className="grid grid-cols-[1.5fr_120px_170px_1fr_1.3fr] items-center gap-4 border-t border-foreground/[0.07] px-5 py-4 text-muted-foreground">
            <div>
              <div className="text-[15px] font-semibold text-foreground">{name}</div>
              <div className="text-[13px]">{date}</div>
            </div>
            <span className="flex items-center gap-1.5 text-[12px]">
              <span className="size-1.5 rounded-full bg-foreground/30" /> No arrivals
            </span>
            <span className="text-[15px]">0 / {capacity}</span>
            <span className="h-2 w-full rounded-full bg-foreground/[0.08]" />
            <span className="text-[13px]">—</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Over the full table, the frame fades back and the line lands in the middle.
function FullHouse() {
  const veil = useRef(null);
  useFrame((local) => {
    if (veil.current) veil.current.style.opacity = 0.78 * progress(local, FULL_AT + 0.05, 0.6, glide);
  });
  return (
    <>
      <div ref={veil} className="absolute inset-0 z-30 bg-background opacity-0" />
      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <Words text="Full house." at={FULL_AT + 0.12} duration={0.8} stagger={0.08} className="text-[180px] leading-none font-semibold tracking-[-0.055em]" />
      </div>
    </>
  );
}

export function DoorFull() {
  return (
    <>
      <Stage />
      <Camera keys={[{ t: 0, s: 0.92, y: 40, rx: 4 }, { t: 4.1, s: 1.04, y: 10, rx: 1.5, ease: glide }]} width={1560} height={680} perspective={2600}>
        <AppWindow width={1560} height={680}>
          <AttendanceScreen />
        </AppWindow>
      </Camera>
      <FullHouse />
    </>
  );
}
DoorFull.cues = [
  { at: 0, sound: "hit", gain: 0.35 },
  { at: FULL_AT, sound: "impact", gain: 0.6 },
];

export const DOOR_SHOTS = { door_pass: DoorPass, door_scan: DoorScan, door_full: DoorFull };
