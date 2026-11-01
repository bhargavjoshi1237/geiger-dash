"use client";

import { useEffect, useRef } from "react";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, Segmented } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Fit } from "@/components/features-hub/motifs/motif_kit";

const W = 448;
const H = 150;

const toY = (value) => H - 14 - value * (H - 40);

// Catmull-Rom through the points, emitted as cubic Béziers, so the line reads as a smooth trend.
function smoothPath(values) {
  const points = values.map((value, index) => [(index / (values.length - 1)) * W, toY(value)]);
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [p0, p1, p2, p3] = [points[i - 1] || points[i], points[i], points[i + 1], points[i + 2] || points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const valueAt = (values, pct) => {
  const position = (pct / 100) * (values.length - 1);
  const low = Math.floor(position);
  const high = Math.min(values.length - 1, low + 1);
  return values[low] + (values[high] - values[low]) * (position - low);
};

// Linear's Building card: the chart is clipped to the pointer and two dots ride the lines with it; `stop` lets a scene drive it when no pointer is on the card.
function TrackedChart({ id, mainPath, ghostPath, chipValue, chipLabel, onScrub, stop, inView, cardRef, reducedMotion, children }) {
  const svgRef = useRef(null);
  const dotRefs = useRef([]);
  const chipRef = useRef(null);
  const valueRef = useRef(null);
  const latest = useRef({});
  const motion = useRef({ current: 100, target: 100, frame: 0, drawn: false, hovering: false });

  useEffect(() => {
    latest.current = { chipValue, onScrub };
    motion.current.paint?.();
  });

  useEffect(() => {
    const state = motion.current;
    state.paint = () => {
      const pct = state.current;
      if (svgRef.current) svgRef.current.style.clipPath = `inset(-40px ${100 - pct}% -40px -10px)`;
      dotRefs.current.forEach((dot) => dot && (dot.style.offsetDistance = `${pct}%`));
      if (chipRef.current) {
        chipRef.current.style.offsetDistance = `${pct}%`;
        // Slide the chip from right-of-dot to left-of-dot so it never hangs off either end.
        chipRef.current.style.translate = `${50 - pct}% -24px`;
      }
      if (valueRef.current && latest.current.chipValue) valueRef.current.textContent = latest.current.chipValue(pct);
      latest.current.onScrub?.(pct);
    };
    const step = () => {
      state.current += (state.target - state.current) * (state.target === 100 ? 0.06 : 0.16);
      if (Math.abs(state.target - state.current) < 0.05) state.current = state.target;
      state.paint();
      state.frame = state.current === state.target ? 0 : requestAnimationFrame(step);
    };
    state.goTo = (target) => {
      state.target = target;
      if (reducedMotion) {
        state.current = target;
        state.paint();
      } else if (!state.frame) {
        state.frame = requestAnimationFrame(step);
      }
    };
    state.paint();
    return () => cancelAnimationFrame(state.frame);
  }, [reducedMotion]);

  // Draw the line in the first time the card scrolls into view.
  useEffect(() => {
    const state = motion.current;
    if (!inView || state.drawn) return;
    state.drawn = true;
    if (reducedMotion) return;
    state.current = 0;
    state.goTo(stop ?? 100);
  }, [inView, reducedMotion, stop]);

  // A scene's next stop, unless the viewer has the line under their pointer.
  useEffect(() => {
    const state = motion.current;
    if (stop === undefined || !state.drawn || state.hovering) return;
    state.goTo?.(stop);
  }, [stop]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const onMove = (event) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect || event.clientX < rect.left) return;
      motion.current.hovering = true;
      motion.current.goTo?.(Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    };
    const onLeave = () => {
      motion.current.hovering = false;
      motion.current.goTo?.(100);
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [cardRef]);

  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 overflow-visible text-foreground">
        {[0.25, 0.5, 0.75].map((row) => (
          <line key={row} x1="0" x2={W} y1={H * row} y2={H * row} stroke="currentColor" strokeOpacity="0.07" strokeDasharray="3 5" />
        ))}
        {children}
      </svg>
      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 overflow-visible text-foreground">
        <defs>
          <linearGradient id={`chart-main-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="var(--foreground)" stopOpacity="0.22" />
            <stop offset="0.85" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path style={{ d: `path("${mainPath} L${W} ${H} L0 ${H} Z")`, transition: "d 0.5s ease-out" }} fill={`url(#chart-main-${id})`} />
        <path style={{ d: `path("${ghostPath}")` }} stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
        <path style={{ d: `path("${mainPath}")`, transition: "d 0.5s ease-out" }} stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {[ghostPath, mainPath].map((path, index) => (
        <span
          key={index}
          ref={(node) => {
            dotRefs.current[index] = node;
          }}
          className={cn("absolute top-0 left-0 rounded-full", index ? "size-2.5 bg-foreground ring-4 ring-foreground/15" : "size-2 bg-foreground/45")}
          style={{ offsetPath: `path("${path}")`, offsetDistance: "100%" }}
        />
      ))}
      <span
        ref={chipRef}
        className="absolute top-0 left-0 z-10 flex items-baseline gap-1.5 rounded-full border border-foreground/[0.12] bg-surface-card px-2.5 py-1 text-[11px] whitespace-nowrap shadow-sm dark:bg-surface-dialog"
        style={{ offsetPath: `path("${mainPath}")`, offsetDistance: "100%", offsetRotate: "0deg", translate: "-50% -24px" }}
      >
        <span ref={valueRef} className="font-medium tabular-nums">
          {chipValue(100)}
        </span>
        <span className="text-muted-foreground">{chipLabel}</span>
      </span>
    </div>
  );
}

const REVENUE = [0.08, 0.14, 0.19, 0.27, 0.33, 0.38, 0.47, 0.55, 0.61, 0.7, 0.82, 1];
const SOLD = [0.05, 0.09, 0.14, 0.2, 0.24, 0.31, 0.37, 0.42, 0.5, 0.57, 0.66, 0.78];
const SALES_SCENE = [1500, 1500, 1500, 3400];
const SALES_STOPS = [36, 62, 84, 100];

const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;
const REVENUE_TOTAL = 263920;
const SOLD_TOTAL = 1164;

function StatCell({ label, valueRef, value, className }) {
  return (
    <div className={cn("min-w-0 flex-1 px-3.5 py-2.5", className)}>
      <div className="truncate text-[11px] text-muted-foreground">{label}</div>
      <div ref={valueRef} className="mt-0.5 text-[17px] font-medium tracking-[-0.01em] tabular-nums">
        {value}
      </div>
    </div>
  );
}

// Sales: revenue over time plays forward through the on-sale, with the totals counting alongside it; hover scrubs it by hand.
function Sales({ inView, running, cardRef, reducedMotion }) {
  const step = useScene(SALES_SCENE, running);
  const revenueRef = useRef(null);
  const soldRef = useRef(null);
  const mainPath = smoothPath(REVENUE);
  const ghostPath = smoothPath(SOLD);

  const onScrub = (pct) => {
    const ratio = valueAt(REVENUE, pct);
    if (revenueRef.current) revenueRef.current.textContent = money(ratio * REVENUE_TOTAL);
    if (soldRef.current) soldRef.current.textContent = Math.round(ratio * SOLD_TOTAL).toLocaleString("en-US");
  };

  return (
    <Window title="Sales" icon={BarChart3} meta={EVENT.short} className="h-[330px] w-[480px]" actions={<Button variant="ghost" icon={Download} className="h-7">Export</Button>}>
      <div className={cn("flex border-b", LINE)}>
        <StatCell label="Total revenue" valueRef={revenueRef} value={money(REVENUE_TOTAL)} />
        <StatCell label="Tickets sold" valueRef={soldRef} value={SOLD_TOTAL.toLocaleString("en-US")} className={cn("border-l", LINE)} />
        <StatCell label="Avg order value" value="$226.74" className={cn("border-l", LINE)} />
        <StatCell label="Refund rate" value="1.2%" className={cn("border-l", LINE)} />
      </div>
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium">Revenue over time</span>
          <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-foreground" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-foreground/30" /> Tickets sold
            </span>
          </span>
        </div>
        <div className="mt-7">
          <TrackedChart
            id="sales"
            mainPath={mainPath}
            ghostPath={ghostPath}
            chipValue={(pct) => money(valueAt(REVENUE, pct) * REVENUE_TOTAL)}
            chipLabel="revenue"
            onScrub={onScrub}
            stop={SALES_STOPS[step]}
            inView={inView}
            cardRef={cardRef}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </Window>
  );
}

const BASE_PRICE = 320;
const CEILING = 400;
const PRICE_FLOOR = 280;
const PRICE_TOP = 410;
const priceY = (price) => toY((price - PRICE_FLOOR) / (PRICE_TOP - PRICE_FLOOR));

// One sell-through step: the base price until the trigger, then the changed price, held under the ceiling.
function pricePath(trigger, change) {
  const x = (trigger / 100) * W;
  const raised = Math.min(CEILING, BASE_PRICE + change);
  return `M0 ${priceY(BASE_PRICE)} L${x.toFixed(1)} ${priceY(BASE_PRICE)} L${x.toFixed(1)} ${priceY(raised).toFixed(1)} L${W} ${priceY(raised).toFixed(1)}`;
}

const PRICING_SCENE = [700, 800, 1200, 800, 1200, 3400];

function RuleCell({ label, value, editing, className }) {
  return (
    <div className={cn("min-w-0 flex-1 rounded-md border px-2.5 py-1.5 transition-colors duration-300", editing ? "border-foreground/35 bg-foreground/[0.06]" : "border-foreground/[0.09]", className)}>
      <div className="truncate text-[10.5px] text-muted-foreground">{label}</div>
      <div className="mt-px text-[14px] font-medium tabular-nums">{value}</div>
    </div>
  );
}

// Dynamic Pricing: the rule's trigger and price change are edited, and the preview redraws its step under the ceiling.
function DynamicPricing({ inView, cardRef, reducedMotion, running }) {
  const step = useScene(PRICING_SCENE, running);
  const trigger = step >= 2 ? 60 : 40;
  const change = step >= 4 ? 60 : 40;
  const cursorAt = step <= 2 ? [78, 118] : [226, 118];
  const flat = `M0 ${priceY(BASE_PRICE)} L${W} ${priceY(BASE_PRICE)}`;

  return (
    <>
      <Window title="Dynamic Pricing" icon={TrendingUp} meta="Full pass" className="h-[330px] w-[480px]">
        <div className="flex flex-col gap-2.5 px-4 pt-3">
          <Segmented options={["Sell-through rule", "Date & time rule", "Quantity rule"]} active="Sell-through rule" className="self-start text-[11.5px]" />
          <div className="flex gap-2">
            <RuleCell label="Trigger at" value={`${trigger}% sold`} editing={step === 1 || step === 2} />
            <RuleCell label="Price change" value={`+$${change}`} editing={step === 3 || step === 4} />
            <RuleCell label="Price ceiling" value={`$${CEILING}`} />
          </div>
          <div className="flex items-center justify-between">
            <MonoLabel>Guardrails · Preview</MonoLabel>
            <span className="text-[11px] text-muted-foreground">Price by % sold</span>
          </div>
        </div>
        <div className="mt-6 px-4">
          <TrackedChart
            id="pricing"
            mainPath={pricePath(trigger, change)}
            ghostPath={flat}
            chipValue={(pct) => `$${pct >= trigger ? Math.min(CEILING, BASE_PRICE + change) : BASE_PRICE}`}
            chipLabel="preview"
            inView={inView}
            cardRef={cardRef}
            reducedMotion={reducedMotion}
          >
            <line x1="0" x2={W} y1={priceY(CEILING)} y2={priceY(CEILING)} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="5 4" />
            <text x="0" y={priceY(CEILING) - 5} className="fill-muted-foreground text-[10px]">
              Price ceiling
            </text>
          </TrackedChart>
        </div>
      </Window>
      <Cursor at={cursorAt} down={step === 2 || step === 4} hidden={step === 0 || step === 5} />
    </>
  );
}

export function ChartMotif({ variant, inView, cardRef, reducedMotion, running }) {
  const View = variant === "pricing" ? DynamicPricing : Sales;
  return (
    <Fit>
      <View inView={inView} cardRef={cardRef} reducedMotion={reducedMotion} running={running} />
    </Fit>
  );
}
