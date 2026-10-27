"use client";

import { useMemo, useRef } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { lerp, progress, swift } from "@/components/film/ease";
import { BRAND, EVENT } from "@/components/film/events/events_kit";
import { BANDS, CANVAS, CENTER, RING, SECTIONS, SECTION_BY_NAME, isSold } from "@/components/film/events/arena";
import { BRANDED, Cover } from "@/components/film/events/page_layouts";

// The buyer's checkout dialog on the branded page (public_page/checkout in geiger-events), in the imported brand.

export const INK = { text: BRAND.text, muted: BRAND.muted, border: BRAND.border, surface: BRAND.surface, raised: "#202024", brand: BRAND.brand };

export function CheckoutDialog({ title, step, steps = 3, next, width, height, className, style, children }) {
  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-[22px] border shadow-[0_30px_80px_-24px_rgb(0_0_0/0.5),0_80px_160px_-60px_rgb(0_0_0/0.45)]", className)}
      style={{ width, height, background: INK.surface, borderColor: INK.border, color: INK.text, ...style }}
    >
      <div className="flex shrink-0 items-center gap-4 border-b px-7 py-5" style={{ borderColor: INK.border }}>
        <Cover palette={BRANDED} numeral={60} className="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.muted }}>
            {EVENT.name}
          </div>
          <div className="text-[23px] leading-tight font-semibold tracking-[-0.01em]">{title}</div>
          <div className="mt-1 flex items-center gap-4 text-[12px]" style={{ color: INK.muted }}>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> {EVENT.date} · {EVENT.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {EVENT.venue}, {EVENT.city}
            </span>
          </div>
        </div>
        {step ? (
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: INK.muted }}>
              Step {step} of {steps}
            </span>
            <span className="text-[13px]" style={{ color: INK.muted }}>
              Next: <span className="font-semibold" style={{ color: INK.text }}>{next}</span>
            </span>
            <span className="flex gap-1.5">
              {Array.from({ length: steps }, (_, index) => (
                <span key={index} className="h-1 w-8 rounded-full" style={{ background: index < step ? INK.brand : "rgb(255 255 255 / 0.15)" }} />
              ))}
            </span>
          </div>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

const SEAT_COLORS = { available: "#6e6e6e", sold: "#2a2a2a", selected: "#3b82f6" };

// The buyer's seat map, always on a dark backdrop: sections tinted by price band, every seat drawn, picks in blue.
export function BuyerMap({ picks = [], className }) {
  const seats = useMemo(
    () =>
      SECTIONS.flatMap((section) =>
        section.seats.map((seat, index) => ({ key: `${section.name}-${seat.row}${seat.number}`, x: seat.x, y: seat.y, sold: isSold(section, seat, index) })),
      ),
    [],
  );
  return (
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} className={cn("overflow-visible", className)} aria-hidden="true">
      <rect x={CENTER.x - RING / 2} y={CENTER.y - RING / 2} width={RING} height={RING} rx={10} fill="#232326" stroke="#2f2f33" />
      <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="3.2" fill="#71717a">
        RING
      </text>
      {SECTIONS.map((section) => (
        <rect key={section.name} x={section.x - 2} y={section.y - 2} width={section.width + 4} height={section.height + 4} rx={5} fill={BANDS[section.band].color} fillOpacity="0.1" stroke={BANDS[section.band].color} strokeOpacity="0.28" />
      ))}
      {seats.map((seat) => (
        <circle key={seat.key} cx={seat.x} cy={seat.y} r={1.45} fill={seat.sold ? SEAT_COLORS.sold : SEAT_COLORS.available} />
      ))}
      {picks.map((pick) => (
        <PickedSeat key={pick.id} {...pick} />
      ))}
    </svg>
  );
}

function PickedSeat({ x, y, at }) {
  const dot = useRef(null);
  const halo = useRef(null);
  useFrame((local) => {
    const on = progress(local, at, 0.25, swift);
    if (dot.current) {
      dot.current.setAttribute("r", String(lerp(1.45, 2.1, on)));
      dot.current.setAttribute("fill", on > 0.01 ? SEAT_COLORS.selected : SEAT_COLORS.available);
    }
    if (halo.current) {
      const ring = progress(local, at, 0.6, swift);
      halo.current.setAttribute("r", String(lerp(2, 6, ring)));
      halo.current.setAttribute("opacity", String(on * (0.55 - ring * 0.25)));
    }
  });
  return (
    <>
      <circle ref={halo} cx={x} cy={y} r={2} fill={SEAT_COLORS.selected} opacity="0" />
      <circle ref={dot} cx={x} cy={y} r={1.45} fill={SEAT_COLORS.available} />
    </>
  );
}

export const SEAT = (section, row, number) => SECTION_BY_NAME[section].seats.find((seat) => seat.row === row && seat.number === number);

// A countdown from 10:00 started `at`, in the hold timer's mm:ss.
export function HoldTimer({ at, className }) {
  const ref = useRef(null);
  useFrame((local) => {
    const left = Math.max(0, 600 - Math.max(0, local - at));
    if (ref.current) ref.current.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(Math.floor(left % 60)).padStart(2, "0")}`;
  });
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      10:00
    </span>
  );
}
