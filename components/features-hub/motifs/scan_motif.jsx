"use client";

import { CheckCircle2, Printer, Star } from "lucide-react";
import { Fit, useTicker } from "@/components/features-hub/motion";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const PEOPLE = [
  ["Maya Rodrigues", "Northwind"],
  ["Leo Okafor", "Acme Labs"],
  ["Priya Nair", "Lumen"],
  ["Tom Becker", "Fieldnote"],
  ["Ana Lima", "Brightline"],
  ["Sam Whitfield", "Orbit"],
];

const VARIANTS = {
  checkin: { base: 1284, total: 1500, label: "checked in", toast: "Checked in" },
  badge: { base: 642, total: 900, label: "badges printed", toast: "Printing" },
  lead: { base: 37, total: 60, label: "leads today", toast: "Lead captured" },
};

const initials = (name) => name.split(" ").map((part) => part[0]).join("");

function Viewfinder({ seed }) {
  return (
    <div className="relative size-[168px] shrink-0">
      {["top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl", "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl"].map((corner) => (
        <span key={corner} className={`absolute size-7 border-(--ink) ${corner}`} />
      ))}
      <div className="absolute inset-4 rounded-lg bg-foreground p-2.5">
        <QrGlyph seed={seed} size={25} className="size-full text-background" />
      </div>
      <span className={`absolute inset-x-2 h-0.5 rounded-full bg-(--ink) shadow-[0_0_14px_2px_color-mix(in_oklab,var(--ink)_40%,transparent)] ${styles.sweep}`} />
    </div>
  );
}

function Toast({ person, variant, config }) {
  const [name, company] = person;
  return (
    <div className={`w-[200px] rounded-xl border border-border bg-surface-card p-3 shadow-xl shadow-black/10 ${styles.popIn}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-(--ink)">
        <CheckCircle2 className="size-3.5" /> {config.toast}
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-(--ink)/15 text-[11px] font-semibold text-foreground">{initials(name)}</span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{variant === "lead" ? company : "General admission"}</p>
        </div>
      </div>
      {variant === "lead" ? (
        <div className="mt-2 flex gap-0.5">
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} className={`size-3 ${star < 4 ? "fill-(--ink) text-(--ink)" : "text-muted-foreground/40"}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PrintedBadge({ person, seed }) {
  const [name, company] = person;
  return (
    <div className="w-[200px]">
      <div className="relative z-10 flex h-7 items-center justify-between rounded-lg border border-border bg-surface-strong px-2.5 text-[10px] text-muted-foreground">
        <Printer className="size-3.5" />
        <span className="h-1 w-24 rounded-full bg-foreground/30" />
      </div>
      <div className="mx-3 -mt-1 h-[132px] overflow-hidden">
        <div className={`rounded-b-xl border border-t-0 border-border bg-surface-card p-3 shadow-lg ${styles.printOut}`}>
          <span className="block h-1.5 w-full rounded-full bg-(--ink)" />
          <p className="mt-3 text-sm font-semibold text-foreground">{name}</p>
          <p className="text-[11px] text-muted-foreground">{company}</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="rounded bg-(--ink)/15 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-foreground">SPEAKER</span>
            <QrGlyph seed={`${seed}-${name}`} size={21} className="size-10 text-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

// A door scanner: the beam sweeps the code, then the next attendee lands with the running count.
export function ScanMotif({ variant, seed, running }) {
  const config = VARIANTS[variant] || VARIANTS.checkin;
  const tick = useTicker(2400, running);
  const person = PEOPLE[tick % PEOPLE.length];
  const count = Math.min(config.total, config.base + tick);

  return (
    <Fit width={440} height={250}>
      <div className="flex size-full items-center justify-center gap-8">
        <Viewfinder seed={seed} />
        <div className="flex flex-col gap-3">
          {variant === "badge" ? <PrintedBadge key={tick} person={person} seed={seed} /> : <Toast key={tick} person={person} variant={variant} config={config} />}
          <div className="w-[200px]">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="font-mono font-semibold text-foreground tabular-nums">{count.toLocaleString("en-US")}</span>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/10">
              <span className="block h-full rounded-full bg-(--ink) transition-[width] duration-700" style={{ width: `${(count / config.total) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Fit>
  );
}
