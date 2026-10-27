"use client";

import { useRef } from "react";
import {
  Armchair,
  ArrowLeft,
  BellRing,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  IdCard,
  Image,
  Layers,
  Layers3,
  LayoutDashboard,
  Map,
  MapPin,
  Palette,
  Plus,
  Sparkles,
  SquarePen,
  Ticket,
  UploadCloud,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { Camera } from "@/components/film/camera";
import { easeInCubic, glide, lerp, progress, swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { Count, Cursor, Fade, TypeOn, typingTime } from "@/components/film/kinetic";
import { AppWindow, BRAND, BrowserWindow, EVENT, Headline, StatusPill } from "@/components/film/events/events_kit";
import { BRANDED, BoxOfficeLayout, LAYOUTS, STANDARD } from "@/components/film/events/page_layouts";
import { CANVAS, CENTER, RING, ROWS, SEATS, SECTIONS, SECTION_BY_NAME, SEAT_COUNT } from "@/components/film/events/arena";
import { BEAT } from "@/components/film/events/timeline";

// Act one: an event is named, its page is designed and re-branded, and its venue is built seat by seat.

const typingTicks = (at, text, speed = 1, gain = 0.16) => {
  const count = Math.floor((typingTime(text, speed) / 0.1) * 0.9);
  return Array.from({ length: count }, (_, index) => ({ at: Number((at + 0.05 + index * 0.1).toFixed(3)), sound: "tick", gain }));
};

function Field({ label, hint, className, children }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-[14px] font-medium text-text-secondary">{label}</span>
      {children}
      {hint ? <span className="text-[12px] text-text-tertiary">{hint}</span> : null}
    </div>
  );
}

function Input({ className, children }) {
  return <div className={cn("flex h-11 items-center rounded-lg border border-foreground/[0.12] bg-surface-card px-3.5 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)]", className)}>{children}</div>;
}

const RAIL = [
  { items: [["Overview", LayoutDashboard], ["Alerts", BellRing]] },
  { label: "General", items: [["Event details", SquarePen]] },
  { label: "Operations", items: [["Operations workspace", Layers3]] },
  { label: "Design", items: [["Page design", Palette]] },
  { label: "Page", items: [["Cover Media", Image], ["Rich Description", FileText], ["Schedule", Clock], ["FAQ", HelpCircle]] },
  { label: "Location", items: [["Location & Time", MapPin], ["Map & Directions", Map]] },
  { label: "Tickets", items: [["Tickets", Ticket], ["Seating", Armchair], ["Express Lane", Zap], ["Batched Releases", Layers]] },
];

function SectionRail({ active }) {
  return (
    <div className="flex flex-col gap-5">
      {RAIL.map((group, index) => (
        <div key={index} className="flex flex-col gap-0.5">
          {group.label ? <span className="mb-1 px-3 text-[10px] font-semibold tracking-[0.12em] text-text-tertiary uppercase">{group.label}</span> : null}
          {group.items.map(([label, Icon]) => (
            <span key={label} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px]", label === active ? "bg-surface-hover font-medium text-foreground" : "text-text-secondary")}>
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// The swap from "nothing set yet" to the event's date and venue, under the title.
function MetaLine({ at }) {
  const before = useRef(null);
  const after = useRef(null);
  useFrame((local) => {
    const swap = progress(local, at, 0.4, glide);
    if (before.current) before.current.style.opacity = 1 - swap;
    if (after.current) {
      after.current.style.opacity = swap;
      after.current.style.transform = `translateY(${(1 - swap) * 6}px)`;
    }
  });
  return (
    <div className="relative h-5 min-w-[420px] text-[14px] whitespace-nowrap text-muted-foreground">
      <span ref={before} className="absolute inset-0">
        No date or venue set yet
      </span>
      <span ref={after} className="absolute inset-0 opacity-0">
        {EVENT.date} · {EVENT.time} · {EVENT.venue}
      </span>
    </div>
  );
}

const TITLE_AT = 0.45;
const SUMMARY_AT = 3.0;

function EditorScreen() {
  return (
    <div className="absolute inset-0 px-12 pt-8">
      <div className="flex items-start justify-between border-b border-foreground/[0.08] pb-6">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-[14px] text-text-secondary">
            <ArrowLeft className="size-4" /> All Events
          </span>
          <div className="flex h-[38px] items-center gap-3">
            <h1 className="text-[30px] font-semibold tracking-[-0.025em]">
              <TypeOn text={EVENT.name} at={TITLE_AT} caret={false} />
            </h1>
            <StatusPill status="Draft" />
          </div>
          <MetaLine at={3.3} />
        </div>
        <div className="flex items-center gap-2 pt-7">
          {[IdCard, ExternalLink].map((Icon, index) => (
            <span key={index} className="flex size-9 items-center justify-center rounded-lg border border-foreground/[0.12] text-text-secondary">
              <Icon className="size-4" />
            </span>
          ))}
          <span className="flex h-9 items-center rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground">Save Changes</span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_260px] gap-8 pt-8">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-[18px] font-semibold">Event details</div>
            <div className="text-[14px] text-muted-foreground">The basics buyers see first, on the page and in listings.</div>
          </div>
          <Field label="Event name">
            <Input className="border-foreground/30 ring-4 ring-foreground/[0.06]">
              <TypeOn text={EVENT.name} at={TITLE_AT} caretUntil={2.9} />
            </Input>
          </Field>
          <Field label="Organizer" hint="Shown as “Hosted by” on your event page.">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-strong text-[14px] font-semibold text-text-secondary">HA</span>
              <Input className="flex-1">
                <Fade at={2.9} y={4} duration={0.35}>
                  {EVENT.host}
                </Fade>
              </Input>
              <span className="flex h-11 items-center gap-2 rounded-lg border border-foreground/[0.12] px-4 text-[14px] font-medium">
                <UploadCloud className="size-4" /> Add Photo
              </span>
            </div>
          </Field>
          <Field label="Short summary" hint="Shown in listings and social previews.">
            <div className="h-[92px] rounded-lg border border-foreground/[0.12] bg-surface-card px-3.5 py-3 text-[15px]">
              <TypeOn text={EVENT.summary} at={SUMMARY_AT} speed={2.6} caretUntil={4.6} />
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["Format", "In-person", 3.35],
              ["Date", "November 21st, 2026", 3.45],
              ["Start time", "19:30", 3.55],
            ].map(([label, value, at]) => (
              <Field key={label} label={label}>
                <Input className="gap-2">
                  {label === "Date" ? <CalendarDays className="size-4 text-muted-foreground" /> : null}
                  <Fade at={at} y={4} duration={0.35}>
                    {value}
                  </Fade>
                </Input>
              </Field>
            ))}
          </div>
        </div>
        <SectionRail active="Event details" />
      </div>
    </div>
  );
}

// Start close on the title and name field (around (300, 260) of the 1500 × 880 window), then pull back to make room for the line.
const OPEN_CAMERA = [
  { t: 0, x: 790, y: 318, s: 1.74, o: 0 },
  { t: 0.35, o: 1, ease: glide },
  { t: 2.55, x: 735, y: 300, s: 1.64 },
  { t: 4.3, x: 380, y: 60, s: 0.82, ry: -9, rx: 3, ease: swift },
  { t: 6.1, x: 360, y: 52, s: 0.8, ry: -11, rx: 3.5 },
];

export function OpenEditor() {
  return (
    <>
      <Stage />
      <Camera keys={OPEN_CAMERA} width={1500} height={880} perspective={2600}>
        <AppWindow width={1500} height={880}>
          <EditorScreen />
        </AppWindow>
      </Camera>
      <Headline kicker="Geiger Events" text={"Every sold-out\nnight starts\nwith a page."} at={3.55} className="top-[300px]" />
    </>
  );
}
OpenEditor.cues = [...typingTicks(TITLE_AT, EVENT.name), { at: 2.6, sound: "whoosh", gain: 0.4 }, { at: 3.35, sound: "pop", gain: 0.35 }];

// Thumbnails drawn as wireframes in the layout gallery's style, one per layout.
function Thumb({ id }) {
  const ink = "bg-foreground/45";
  const soft = "bg-foreground/15";
  const shapes = {
    classic: (
      <>
        <span className={cn("col-span-6 h-5", soft)} />
        <span className="col-span-4 flex flex-col gap-1">
          <span className={cn("h-1.5 w-3/4", ink)} />
          <span className={cn("h-1 w-full", soft)} />
          <span className={cn("h-1 w-5/6", soft)} />
        </span>
        <span className={cn("col-span-2 h-9 rounded-sm", soft)} />
      </>
    ),
    luma: (
      <>
        <span className={cn("col-span-2 h-12 rounded-sm", soft)} />
        <span className="col-span-4 flex flex-col gap-1">
          <span className={cn("h-1.5 w-2/3", ink)} />
          <span className={cn("h-1 w-1/2", soft)} />
          <span className={cn("mt-1 h-4 w-full rounded-sm", soft)} />
        </span>
      </>
    ),
    bento: (
      <>
        <span className={cn("col-span-4 row-span-2 h-9 rounded-sm", ink)} />
        <span className={cn("col-span-2 h-9 rounded-sm", soft)} />
        <span className={cn("col-span-2 h-3 rounded-sm", soft)} />
        <span className={cn("col-span-2 h-3 rounded-sm", soft)} />
        <span className={cn("col-span-2 h-3 rounded-sm", soft)} />
      </>
    ),
    poster: (
      <>
        <span className="col-span-4 flex flex-col gap-1">
          <span className={cn("h-3 w-full", ink)} />
          <span className={cn("h-3 w-4/5", ink)} />
          <span className={cn("h-1 w-1/2", soft)} />
        </span>
        <span className={cn("col-span-2 h-9", soft)} />
      </>
    ),
    spotlight: <span className={cn("col-span-6 h-13 rounded-sm", ink)} />,
    boxoffice: (
      <>
        <span className={cn("col-span-3 mt-2 h-2", ink)} />
        <span className={cn("col-span-3 h-6 rounded-sm", soft)} />
        {[0, 1, 2].map((index) => (
          <span key={index} className={cn("col-span-2 h-4 rounded-sm", soft)} />
        ))}
      </>
    ),
  };
  return <div className="grid aspect-[16/10] grid-cols-6 content-start gap-1 overflow-hidden rounded-md bg-surface-subtle p-2">{shapes[id]}</div>;
}

const STEP = BEAT * 2;

function LayoutCard({ layout, index }) {
  const ref = useRef(null);
  const check = useRef(null);
  useFrame((local) => {
    const on = local >= index * STEP && local < (index + 1) * STEP;
    if (ref.current) {
      ref.current.style.borderColor = on ? "var(--primary)" : "";
      ref.current.style.background = on ? "color-mix(in oklab, var(--primary) 6%, var(--background))" : "";
    }
    if (check.current) check.current.style.opacity = on ? 1 : 0;
  });
  return (
    <div ref={ref} className="flex flex-col gap-2.5 rounded-xl border border-foreground/[0.1] bg-background p-3">
      <Thumb id={layout.id} />
      <div className="flex items-center gap-1.5 text-[14px] font-medium">
        {layout.name}
        <Check ref={check} className="size-4 opacity-0" strokeWidth={2.5} />
      </div>
    </div>
  );
}

// Each layout cuts in on its beat with a short blur-rise, over the one before it.
function LayoutSwitcher({ layouts, palette, start = 0 }) {
  const refs = useRef([]);
  useFrame((local) => {
    refs.current.forEach((node, index) => {
      if (!node) return;
      const at = start + index * STEP;
      const enter = progress(local, at, 0.24, glide);
      const visible = local >= at && (index === layouts.length - 1 || local < at + STEP + 0.24);
      node.style.visibility = visible ? "visible" : "hidden";
      node.style.opacity = index === 0 ? 1 : enter;
      node.style.transform = `translateY(${index === 0 ? 0 : (1 - enter) * 22}px) scale(${index === 0 ? 1 : lerp(0.985, 1, enter)})`;
      node.style.filter = index && enter < 0.98 ? `blur(${((1 - enter) * 8).toFixed(1)}px)` : "none";
    });
  });
  return layouts.map(({ id, Component }, index) => (
    <div
      key={id}
      ref={(node) => {
        refs.current[index] = node;
      }}
      className="absolute inset-0"
      style={{ zIndex: index, visibility: "hidden" }}
    >
      <Component palette={palette} />
    </div>
  ));
}

// The order the gallery steps through, ending on Box office, which the next shot re-brands.
const SEQUENCE = ["classic", "luma", "bento", "poster", "spotlight", "boxoffice"].map((id) => LAYOUTS.find((layout) => layout.id === id));

// Card centres in the gallery panel: a 2-column grid from (144, 444), 200 × 164 cards on a 12px gap.
const CARD_POINTS = SEQUENCE.map((_, index) => ({ x: 244 + (index % 2) * 212, y: 526 + Math.floor(index / 2) * 176 }));

const DESIGN_CAMERA = [
  { t: 0, s: 1.04, rx: 4, y: 14 },
  { t: 6.1, s: 0.995, rx: 0, y: 0 },
];

export function DesignLayouts() {
  return (
    <>
      <Stage />
      <Camera keys={DESIGN_CAMERA} width={1920} height={1080} perspective={3000}>
        <div className="absolute top-[318px] left-[120px] flex h-[700px] w-[460px] flex-col gap-4 rounded-2xl border border-foreground/[0.1] bg-background p-6 shadow-[0_2px_6px_rgb(0_0_0/0.05),0_30px_70px_-24px_rgb(0_0_0/0.22)]">
          <div>
            <div className="text-[17px] font-semibold">Page layout</div>
            <div className="text-[13px] text-muted-foreground">Pick an arrangement, then make it yours.</div>
          </div>
          <div className="flex gap-2 text-[12px]">
            {["All 19", "Live & music", "Classic"].map((chip, index) => (
              <span key={chip} className={cn("rounded-full border px-3 py-1", index ? "border-foreground/[0.1] text-text-secondary" : "border-foreground/80 bg-foreground text-background")}>
                {chip}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SEQUENCE.map((layout, index) => (
              <LayoutCard key={layout.id} layout={layout} index={index} />
            ))}
          </div>
        </div>
        <BrowserWindow width={1180} height={760} className="absolute top-[288px] left-[640px]">
          <LayoutSwitcher layouts={SEQUENCE} palette={STANDARD} />
        </BrowserWindow>
        <Cursor
          keys={[
            { t: -0.3, x: CARD_POINTS[0].x + 60, y: CARD_POINTS[0].y + 80 },
            ...CARD_POINTS.slice(1).flatMap((point, index) => [
              { t: (index + 1) * STEP - 0.42, x: CARD_POINTS[index].x + 6, y: CARD_POINTS[index].y + 4 },
              { t: (index + 1) * STEP - 0.06, x: point.x, y: point.y, ease: swift },
            ]),
            { t: 6.2, x: CARD_POINTS[5].x + 8, y: CARD_POINTS[5].y + 6 },
          ]}
          clicks={SEQUENCE.slice(1).map((_, index) => (index + 1) * STEP - 0.03)}
        />
      </Camera>
      <Headline kicker="Design" text={"Nineteen layouts."} at={0.1} />
      <Fade at={0.75} y={10} duration={0.6} className="absolute top-[236px] left-[124px] text-[30px] tracking-[-0.02em] text-foreground/55">
        Switch the whole page in one click.
      </Fade>
    </>
  );
}
DesignLayouts.cues = [{ at: 0, sound: "hit", gain: 0.45 }, ...SEQUENCE.slice(1).map((_, index) => ({ at: Number(((index + 1) * STEP - 0.03).toFixed(3)), sound: "click", gain: 0.55 }))];

// The brand import dialog, from brand_import.jsx: read a site, then pick what to apply.
const URL_AT = 0.2;
const READ_AT = 1.05;
const RESULTS_AT = 1.55;
const APPLY_AT = 2.8;

function Spinner({ at, until }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (!ref.current) return;
    ref.current.style.opacity = local >= at && local < until ? 1 : 0;
    ref.current.style.transform = `rotate(${local * 540}deg)`;
  });
  return <span ref={ref} className="size-5 rounded-full border-2 border-foreground/15 border-t-foreground/70 opacity-0" />;
}

function Swatch({ color, label, at }) {
  return (
    <Fade at={at} y={8} scale={0.9} duration={0.35} className="flex flex-col gap-1.5">
      <span className="h-10 rounded-lg border border-foreground/[0.1]" style={{ background: color }} />
      <span className="text-center text-[11px] text-muted-foreground">{label}</span>
    </Fade>
  );
}

function BrandLogo({ variant }) {
  if (variant === 0)
    return (
      <span className="text-[19px] leading-none font-black tracking-[-0.04em] text-white italic">
        FIGHT<span style={{ color: BRAND.brand }}>NIGHT</span>
      </span>
    );
  if (variant === 1) return <span className="text-[26px] leading-none font-black italic" style={{ color: BRAND.brand }}>FN</span>;
  if (variant === 2) return <span className="text-[13px] font-bold tracking-[0.3em] text-white">FIGHT NIGHT</span>;
  if (variant === 3) return <span className="size-8 rotate-45 rounded-md border-[3px]" style={{ borderColor: BRAND.brand }} />;
  return <span className="text-[11px] font-semibold tracking-[0.2em] text-white/70">FN·12</span>;
}

function ImportDialog() {
  return (
    <div className="flex w-[680px] flex-col gap-5 rounded-2xl border border-foreground/[0.1] bg-background p-7 shadow-[0_2px_8px_rgb(0_0_0/0.08),0_40px_90px_-30px_rgb(0_0_0/0.4)]">
      <div>
        <div className="text-[19px] font-semibold tracking-[-0.01em]">Import a brand from a website</div>
        <div className="mt-1 text-[14px] text-muted-foreground">We&apos;ll read the page and pull its logo, colors, fonts, and shape. Everything stays editable afterwards.</div>
      </div>
      <Field label="Website address">
        <div className="flex gap-2">
          <Input className="flex-1 border-foreground/30 ring-4 ring-foreground/[0.06]">
            <TypeOn text={BRAND.site} at={URL_AT} speed={1.5} caretUntil={READ_AT} />
          </Input>
          <span className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground">
            <Sparkles className="size-4" /> Read site
          </span>
        </div>
      </Field>
      <div className="relative h-[330px]">
        <Fade at={READ_AT + 0.05} out={RESULTS_AT} exit={0.15} y={0} duration={0.15} className="absolute inset-x-0 top-0 flex h-16 items-center gap-3 rounded-xl border border-foreground/[0.1] px-4 text-[14px] text-text-secondary">
          <Spinner at={READ_AT} until={RESULTS_AT} />
          Reading {BRAND.site}
        </Fade>
        <div className="absolute inset-0 flex flex-col gap-4">
          <Fade at={RESULTS_AT} y={6} duration={0.3} className="flex items-center gap-2 text-[14px]">
            <Globe className="size-4 text-muted-foreground" />
            <span className="font-semibold">{BRAND.name}</span>
            <span className="text-muted-foreground">· {BRAND.site}</span>
          </Fade>
          <div className="flex flex-col gap-2">
            <Fade at={RESULTS_AT + 0.05} y={4} duration={0.3} className="text-[13px] font-medium text-text-secondary">
              Logo — pick the right one
            </Fade>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((variant) => (
                <Fade key={variant} at={RESULTS_AT + 0.1 + variant * 0.05} y={8} scale={0.94} duration={0.35} className={cn("relative flex h-[68px] items-center justify-center rounded-lg border", variant ? "border-foreground/[0.1]" : "border-foreground ring-2 ring-foreground/10")} style={{ background: BRAND.background }}>
                  <BrandLogo variant={variant} />
                  {variant === 0 ? (
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  ) : null}
                </Fade>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Fade at={RESULTS_AT + 0.3} y={4} duration={0.3} className="text-[13px] font-medium text-text-secondary">
              Colors — dark theme
            </Fade>
            <div className="grid grid-cols-7 gap-2">
              {[
                [BRAND.brand, "Brand"],
                [BRAND.background, "Background"],
                [BRAND.surface, "Surface"],
                [BRAND.text, "Text"],
                [BRAND.muted, "Muted"],
                [BRAND.border, "Border"],
                [BRAND.onBrand, "On brand"],
              ].map(([color, label], index) => (
                <Swatch key={label} color={color} label={label} at={RESULTS_AT + 0.35 + index * 0.04} />
              ))}
            </div>
          </div>
          <Fade at={RESULTS_AT + 0.65} y={6} duration={0.35} className="flex flex-wrap gap-2 text-[12px] text-text-secondary">
            {["Headings: Archivo Black", "Body: Inter", "Corners: 6px", "Buttons: solid", "Shadow: subtle"].map((chip) => (
              <span key={chip} className="rounded-md border border-foreground/[0.1] px-2 py-1">
                {chip}
              </span>
            ))}
          </Fade>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-foreground/[0.08] pt-5">
        <span className="flex h-10 items-center rounded-lg px-4 text-[14px] font-medium text-text-secondary">Cancel</span>
        <span className="flex h-10 items-center rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground">Apply to page</span>
      </div>
    </div>
  );
}

// The branded page wipes in left to right behind the closing dialog, with a seam of the brand colour at its edge.
function BrandWipe({ at }) {
  const ref = useRef(null);
  const seam = useRef(null);
  useFrame((local) => {
    const wipe = progress(local, at, 0.7, swift);
    if (ref.current) ref.current.style.clipPath = `inset(0 ${(100 - wipe * 100).toFixed(2)}% 0 0)`;
    if (seam.current) {
      seam.current.style.left = `${wipe * 100}%`;
      seam.current.style.opacity = wipe > 0 && wipe < 1 ? 1 : 0;
    }
  });
  return (
    <>
      <div ref={ref} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
        <BoxOfficeLayout palette={BRANDED} />
      </div>
      <span ref={seam} className="absolute inset-y-0 w-[3px] -translate-x-1/2 opacity-0" style={{ background: BRAND.brand, boxShadow: `0 0 40px 10px ${BRAND.brand}` }} />
    </>
  );
}

function DialogLayer() {
  const scrim = useRef(null);
  const dialog = useRef(null);
  useFrame((local) => {
    const enter = progress(local, -0.1, 0.3, glide);
    const leave = progress(local, APPLY_AT + 0.12, 0.3, easeInCubic);
    if (scrim.current) scrim.current.style.opacity = 0.32 * enter * (1 - leave);
    if (dialog.current) {
      dialog.current.style.opacity = enter * (1 - leave);
      dialog.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.97, 1, enter) - leave * 0.03})`;
    }
  });
  return (
    <>
      <div ref={scrim} className="absolute inset-0 rounded-[14px] bg-black" />
      <div ref={dialog} className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
        <ImportDialog />
      </div>
    </>
  );
}

const IMPORT_CAMERA = [
  { t: 0, s: 1.02, x: 0 },
  { t: 2.6, s: 1.06, x: -10 },
  { t: 3.4, s: 0.96, x: 0, ease: swift },
  { t: 4.1, s: 0.95 },
];

export function DesignImport() {
  return (
    <>
      <Stage />
      <Camera keys={IMPORT_CAMERA} width={1920} height={1080}>
        <BrowserWindow width={1180} height={760} className="absolute top-[288px] left-[640px]">
          <BoxOfficeLayout palette={STANDARD} />
          <BrandWipe at={APPLY_AT + 0.25} />
        </BrowserWindow>
        <div className="absolute top-[288px] left-[640px] h-[760px] w-[1180px]">
          <DialogLayer />
        </div>
        <Cursor
          keys={[
            { t: 0.6, x: 1500, y: 800 },
            { t: READ_AT - 0.05, x: 1484, y: 514, ease: swift },
            { t: 2.2, x: 1500, y: 560 },
            { t: APPLY_AT - 0.05, x: 1484, y: 946, ease: swift },
            { t: 3.6, x: 1600, y: 1000 },
          ]}
          clicks={[READ_AT, APPLY_AT]}
        />
      </Camera>
      <Headline kicker="Design" text={"Or import\nyour brand."} at={0.1} />
      <Fade at={0.7} y={10} duration={0.6} className="absolute top-[326px] left-[124px] w-[440px] text-[28px] leading-[1.25] tracking-[-0.02em] text-foreground/55">
        Logo, colours and fonts, read straight from your site.
      </Fade>
    </>
  );
}
DesignImport.cues = [
  ...typingTicks(URL_AT, BRAND.site, 1.5),
  { at: READ_AT, sound: "click", gain: 0.55 },
  { at: RESULTS_AT, sound: "pop", gain: 0.4 },
  { at: APPLY_AT, sound: "click", gain: 0.55 },
  { at: APPLY_AT + 0.25, sound: "whoosh", gain: 0.55 },
];

// The seat map editor building the bowl: the generator closes, sections land one by one, then one opens to its seats.
const GENERATE_AT = 0.7;
const BUILD_AT = 0.95;
const PICK_AT = 2.55;
const PICKED = SECTION_BY_NAME["104"];

function SectionBox({ section, index }) {
  const ref = useRef(null);
  useFrame((local) => {
    const node = ref.current;
    if (!node) return;
    const land = progress(local, BUILD_AT + index * 0.045, 0.32, glide);
    node.style.opacity = land;
    node.style.transform = `scale(${lerp(0.7, 1, land)})`;
    const picked = section === PICKED && local >= PICK_AT;
    node.style.boxShadow = picked ? "0 0 0 2px var(--primary)" : "none";
  });
  return (
    <div
      ref={ref}
      className="absolute rounded-[5px] border border-sky-400/40 bg-sky-400/[0.12] opacity-0"
      style={{ left: section.x, top: section.y, width: section.width, height: section.height }}
    >
      <span className="absolute top-1 left-1.5 text-[9px] font-semibold tracking-[0.04em] text-sky-700/80 uppercase">{section.name}</span>
      <span className="absolute top-1 right-1.5 text-[9px] text-sky-700/60 tabular-nums">{ROWS * SEATS}</span>
    </div>
  );
}

function PickedSeats() {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.style.opacity = progress(local, PICK_AT + 0.1, 0.5, glide);
  });
  return (
    <svg ref={ref} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} className="pointer-events-none absolute inset-0 opacity-0">
      {PICKED.seats.map((seat) => (
        <circle key={`${seat.row}${seat.number}`} cx={seat.x} cy={seat.y} r={1.5} fill={seat.row === "A" && seat.number <= 2 ? "#38bdf8" : "#6b7280"} />
      ))}
    </svg>
  );
}

function BowlMiniature() {
  return (
    <div className="relative h-[150px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-subtle">
      <div className="absolute top-1/2 left-1/2" style={{ width: CANVAS.width, height: CANVAS.height, transform: "translate(-50%, -50%) scale(0.28)" }}>
        <span className="absolute rounded-md bg-[#e4e4e7]" style={{ left: CENTER.x - RING / 2, top: CENTER.y - RING / 2, width: RING, height: RING }} />
        {SECTIONS.map((section) => (
          <span key={section.name} className="absolute rounded-[4px] bg-sky-400/50" style={{ left: section.x, top: section.y, width: section.width, height: section.height }} />
        ))}
      </div>
    </div>
  );
}

function BowlDialog() {
  const ref = useRef(null);
  useFrame((local) => {
    const leave = progress(local, GENERATE_AT + 0.08, 0.3, easeInCubic);
    if (ref.current) {
      ref.current.style.opacity = 1 - leave;
      ref.current.style.transform = `translate(-50%, -50%) scale(${1 - leave * 0.04})`;
    }
  });
  return (
    <div ref={ref} className="absolute top-1/2 left-1/2 z-10 flex w-[500px] flex-col gap-4 rounded-2xl border border-foreground/[0.1] bg-background p-6 shadow-[0_30px_80px_-24px_rgb(0_0_0/0.4)]" style={{ transform: "translate(-50%, -50%)" }}>
      <div className="text-[18px] font-semibold">Generate the bowl</div>
      <BowlMiniature />
      <div className="grid grid-cols-2 gap-2 text-[13px]">
        {["Oval stadium", "Rectangular arena", "Theatre horseshoe", "Banquet rounds"].map((shape) => (
          <span key={shape} className={cn("rounded-lg border px-3 py-2", shape === "Rectangular arena" ? "border-foreground font-medium" : "border-foreground/[0.1] text-text-secondary")}>
            {shape}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[
          ["Tiers", 2],
          ["Per side", 3],
          ["Tier depth %", 10],
          ["Rows", ROWS],
          ["Seats / row", SEATS],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="truncate text-[11px] text-text-secondary">{label}</span>
            <span className="flex h-9 items-center rounded-md border border-foreground/[0.12] px-2.5 text-[14px] tabular-nums">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-foreground/[0.08] pt-4">
        <span className="text-[13px] text-text-secondary tabular-nums">
          {SECTIONS.length} sections · {SEAT_COUNT.toLocaleString("en-US")} seats
        </span>
        <span className="flex h-9 items-center rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground">Generate</span>
      </div>
    </div>
  );
}

function SidePanel() {
  return (
    <div className="relative">
      <Fade out={PICK_AT + 0.05} exit={0.15} duration={0.01} y={0} className="absolute inset-0 flex flex-col gap-4 rounded-xl border border-foreground/[0.1] p-5">
        <div className="text-[15px] font-semibold">Floor</div>
        <div className="text-[13px] text-text-secondary">Pick a section on the floor to edit its rows and seats, or set the room up here.</div>
        {[
          ["Canvas shape", "Wide (16:10)"],
          ["Central feature", "Ring"],
          ["Label", "Main event"],
        ].map(([label, value]) => (
          <Field key={label} label={label}>
            <Input className="h-10 text-[14px]">{value}</Input>
          </Field>
        ))}
      </Fade>
      <Fade at={PICK_AT + 0.08} y={8} duration={0.35} className="absolute inset-0 flex flex-col gap-4 rounded-xl border border-foreground/[0.1] p-5">
        <div className="text-[15px] font-semibold">Section {PICKED.name}</div>
        {[
          ["Name", PICKED.name],
          ["Type", "Seated (individual chairs)"],
        ].map(([label, value]) => (
          <Field key={label} label={label}>
            <Input className="h-10 text-[14px]">{value}</Input>
          </Field>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rows">
            <Input className="h-10 text-[14px]">{ROWS}</Input>
          </Field>
          <Field label="Seats per row">
            <Input className="h-10 text-[14px]">{SEATS}</Input>
          </Field>
        </div>
        <span className="text-[13px] text-text-secondary">{ROWS * SEATS} seats</span>
      </Fade>
    </div>
  );
}

function SeatMapScreen() {
  const stats = [
    ["Seats", SEAT_COUNT, `${SECTIONS.length} sections`],
    ["GA capacity", 0, "0 zones"],
    ["Accessible", 48, "Wheelchair + companion"],
    ["Total capacity", SEAT_COUNT, "Seated + standing"],
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-5 px-8 pt-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[14px] text-text-secondary">
          <ArrowLeft className="size-4" /> All configurations
        </span>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span className="flex h-9 items-center rounded-lg bg-surface-hover px-3.5">Generate bowl</span>
          <span className="flex h-9 items-center rounded-lg px-3.5 text-text-secondary">Import CSV</span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-primary-foreground">
            <Plus className="size-4" /> Add section
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-foreground/[0.08] rounded-xl border border-foreground/[0.08] bg-surface-subtle">
        {stats.map(([label, value, footer]) => (
          <div key={label} className="flex flex-col gap-1 px-5 py-3.5">
            <span className="text-[11px] font-medium tracking-[0.06em] text-text-tertiary uppercase">{label}</span>
            <span className="text-[24px] leading-tight font-bold">
              <Count to={value} at={BUILD_AT} duration={1.2} />
            </span>
            <span className="text-[11px] text-text-tertiary">{footer}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="relative overflow-hidden rounded-xl border border-foreground/[0.08] bg-background" style={{ height: CANVAS.height }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: CANVAS.width, height: CANVAS.height }}>
            <span className="absolute flex items-center justify-center rounded-lg border border-[#d4d4d8] bg-[#e4e4e7] text-[11px] font-semibold tracking-[0.3em] text-[#71717a]" style={{ left: CENTER.x - RING / 2, top: CENTER.y - RING / 2, width: RING, height: RING }}>
              RING
            </span>
            {SECTIONS.map((section, index) => (
              <SectionBox key={section.name} section={section} index={index} />
            ))}
            <PickedSeats />
          </div>
          <BowlDialog />
        </div>
        <SidePanel />
      </div>
    </div>
  );
}

// Section 104 sits at (779, 456) of the 1600 × 880 window; the camera eases in on it once it opens.
const BOWL_CAMERA = [
  { t: 0, x: 250, y: 120, s: 0.82, ry: -7, rx: 3 },
  { t: PICK_AT - 0.1, x: 236, y: 112, s: 0.84, ry: -6, rx: 3 },
  { t: 4.1, x: 190, y: 60, s: 1.1, ry: -3, rx: 2, ease: glide },
];

export function VenueBowl() {
  return (
    <>
      <Stage />
      <Camera keys={BOWL_CAMERA} width={1600} height={880} perspective={2600}>
        <AppWindow width={1600} height={880}>
          <SeatMapScreen />
        </AppWindow>
        <Cursor
          keys={[
            { t: 0.1, x: 980, y: 760 },
            { t: GENERATE_AT - 0.05, x: 798, y: 724, ease: swift },
            { t: 1.8, x: 1000, y: 520 },
            { t: PICK_AT - 0.05, x: 779, y: 456, ease: swift },
            { t: 4.1, x: 790, y: 468 },
          ]}
          clicks={[GENERATE_AT, PICK_AT]}
        />
      </Camera>
      <Headline kicker="Venues" text={"Build the room,\nseat by seat."} at={0.1} out={2.25} />
    </>
  );
}
VenueBowl.cues = [
  { at: GENERATE_AT, sound: "click", gain: 0.55 },
  ...SECTIONS.filter((_, index) => index % 2 === 0).map((_, index) => ({ at: Number((BUILD_AT + index * 0.09).toFixed(3)), sound: "tick", gain: 0.22 })),
  { at: PICK_AT, sound: "click", gain: 0.5 },
  { at: PICK_AT + 0.1, sound: "pop", gain: 0.3 },
];

export const CREATE_SHOTS = { open_editor: OpenEditor, design_layouts: DesignLayouts, design_import: DesignImport, venue_bowl: VenueBowl };
