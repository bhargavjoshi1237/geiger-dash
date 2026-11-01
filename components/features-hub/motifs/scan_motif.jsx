"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileDown, Printer, ScanLine, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, PhoneFrame, RouteHeader, Select, StatStrip } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, QrGlyph, Show } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const GUESTS = [
  { name: "Maya Chen", ticket: "Full pass", company: "Brightloop" },
  { name: "Marcus Whitfield", ticket: "Day pass — Thursday", company: "Orbital Freight" },
  { name: "Amara Okafor", ticket: "Full pass", company: "Fieldnote" },
  { name: "Tomas Marek", ticket: "Student pass", company: "Cobalt Retail" },
];

// Counts completed loops of a scene, so each pass plays a new guest.
function useRound(step) {
  const [round, setRound] = useState(0);
  const [previous, setPrevious] = useState(step);
  if (previous !== step) {
    setPrevious(step);
    if (step === 0) setRound(round + 1);
  }
  return round;
}

const CHECKIN_SCENE = [1500, 3200];

function Viewfinder({ seed, width, height, frame, caught }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-neutral-950" style={{ width, height }}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgb(255_255_255/0.12),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-[12px] bg-neutral-800 p-1.5 shadow-2xl shadow-black/60" style={{ width: frame * 0.72 }}>
        <div className="rounded-[8px] bg-white p-1.5 text-black">
          <QrGlyph seed={seed} className="block w-full" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn("rounded-xl border-2 shadow-[0_0_0_9999px_rgb(0_0_0/0.35)] transition-colors duration-200", caught ? "border-emerald-400" : "border-white/70")} style={{ width: frame, height: frame }} />
      </div>
      {caught ? null : (
        <span
          className={cn("absolute h-0.5 rounded-full bg-emerald-400", styles.sweep)}
          style={{ top: (height - frame) / 2 + 10, left: (width - frame) / 2 + 10, width: frame - 20, "--sweep": `${frame - 20}px` }}
        />
      )}
    </div>
  );
}

function AdmittedRow({ guest }) {
  return (
    <div className={cn("flex h-11 items-center gap-2.5 border-b pr-4 pl-3", LINE)}>
      <Avatar name={guest.name} size={22} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-foreground/90">{guest.name}</div>
        <div className="truncate text-[11px] text-muted-foreground">{guest.ticket}</div>
      </div>
      <span className="text-[11px] text-muted-foreground">Gate A</span>
    </div>
  );
}

// The gate's phone scans a ticket and admits the guest; the live list and count catch up beside it.
function CheckIn({ seed, running }) {
  const step = useScene(CHECKIN_SCENE, running);
  const round = useRound(step);
  const caught = step === 1;
  const guest = GUESTS[round % GUESTS.length];
  const admitted = 612 + round + (caught ? 1 : 0);

  return (
    <div className="relative h-[330px] w-[480px]">
      <PhoneFrame className="absolute top-0 left-0 z-[2] h-[372px] w-[222px]">
        <RouteHeader compact title={EVENT.short} subtitle="Gate A crew" count={admitted} />
        <div className="flex flex-col gap-2 p-2.5">
          <Select className="h-7 text-[11px]">Gate A — Harbour Street</Select>
          <div className="relative">
            <Viewfinder seed={`${seed}-${round}`} width={184} height={170} frame={112} caught={caught} />
            <Show when={caught} className="absolute inset-x-1.5 bottom-1.5">
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-2 py-1.5 text-[11px] font-medium text-white shadow-lg shadow-black/40">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span className="truncate">Admitted {guest.name}</span>
              </div>
            </Show>
          </div>
        </div>
      </PhoneFrame>
      <Window className="absolute top-[26px] left-[186px] w-[294px]">
        <div className="pl-[44px]">
          <div className={cn("flex h-12 items-center gap-2 border-b px-3", LINE)}>
            <ScanLine className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Check-in</span>
            <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">{admitted} of 1,164</span>
          </div>
          <Expand when={caught}>
            <AdmittedRow guest={guest} />
          </Expand>
          {[1, 2, 3, 4].map((back) => (
            <AdmittedRow key={back} guest={GUESTS[(round + GUESTS.length * 2 - back) % GUESTS.length]} />
          ))}
        </div>
      </Window>
    </div>
  );
}

const BADGE_SCENE = [700, 800, 220, 1700, 3200];

function BadgeFace({ guest, seed }) {
  return (
    <div className="w-[176px] overflow-hidden rounded-xl border border-foreground/[0.14] bg-surface-card shadow-xl shadow-black/25 dark:bg-surface-dialog">
      <div className="bg-foreground px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-background uppercase">{EVENT.short}</div>
      <div className="px-3 pt-3 pb-3.5">
        <div className="text-[17px] leading-tight font-semibold tracking-[-0.02em]">{guest.name}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">{guest.company}</div>
        <div className="mt-3 flex items-end justify-between">
          <span className="rounded border border-foreground/[0.14] px-1.5 py-0.5 text-[10px] text-foreground/80">{guest.ticket}</span>
          <QrGlyph seed={seed} className="size-11 shrink-0" />
        </div>
      </div>
    </div>
  );
}

// Badge Printing: a guest is picked from the live list, Print is pressed and their badge feeds out.
function Badge({ seed, running }) {
  const step = useScene(BADGE_SCENE, running);
  const round = useRound(step);
  const active = round % GUESTS.length;
  const guest = GUESTS[active];
  const printing = step >= 3;
  const cursor = step === 0 ? [150, 96 + active * 40] : [434, 34];

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <Printer className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Badge Printing</span>
          <Button icon={Printer} className={cn("ml-auto h-7 transition-[scale] duration-150", step === 2 && "scale-95")}>
            Print / PDF
          </Button>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className={cn("w-[214px] shrink-0 border-r py-1.5", LINE)}>
            {GUESTS.map((item, index) => (
              <div key={item.name} className={cn("mx-1.5 flex h-[40px] items-center gap-2.5 rounded-md px-2.5 transition-colors duration-300", index === active && "bg-foreground/[0.07]")}>
                <Avatar name={item.name} size={22} />
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-medium text-foreground/90">{item.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{item.ticket}</div>
                </div>
              </div>
            ))}
            <div className={cn("mx-4 mt-2 flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground", LINE)}>
              <FileDown className="size-3.5" /> ZIP of all passes
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center bg-foreground/[0.02]">
            <div className="z-10 mt-4 h-2 w-[200px] rounded-full bg-foreground/15 shadow-inner" />
            <div className="-mt-1 h-[230px] w-[200px] overflow-hidden px-3">
              {printing ? (
                <div key={round} className={styles.printOut}>
                  <BadgeFace guest={guest} seed={`${seed}-${active}`} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Window>
      <Cursor at={cursor} down={step === 2} hidden={step >= 4} />
    </div>
  );
}

const LEADS = [
  { name: "Maya Chen", company: "Brightloop", by: "Fieldnote", when: "2m ago" },
  { name: "Kofi Asante", company: "Lumen Health", by: "Orbital Freight", when: "9m ago" },
  { name: "Grace Donnelly", company: "Atlas Coffee", by: "Fieldnote", when: "14m ago" },
  { name: "Tomas Marek", company: "Cobalt Retail", by: "Orbital Freight", when: "21m ago" },
  { name: "Aisha Bennett", company: "Kestrel Aero", by: "Fieldnote", when: "33m ago" },
];

const LEAD_SCENE = [800, 800, 1400, 800, 220, 3400];

// Lead Retrieval: the organiser narrows the table to one exhibitor, then exports their leads as a CSV.
function Lead({ running }) {
  const step = useScene(LEAD_SCENE, running);
  const filtered = step >= 2;
  const cursor = step <= 1 ? [158, 124] : [430, 34];

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Lead Retrieval</span>
          <Button variant="ghost" icon={Download} className={cn("ml-auto h-7 transition-[scale] duration-150", step === 4 && "scale-95")}>
            Export CSV
          </Button>
        </div>
        <div className="px-4 pt-3">
          <StatStrip
            stats={[
              { label: "Leads captured", value: "37" },
              { label: "Exhibitors", value: "6" },
              { label: "Showing", value: filtered ? "3" : "37" },
            ]}
          />
          <Select className="mt-2.5 h-7 w-[176px] border-foreground/20 text-[11px]">{filtered ? "Fieldnote" : "All exhibitors"}</Select>
        </div>
        <div className={cn("mt-2.5 grid grid-cols-[1.25fr_1fr_0.9fr_0.55fr] gap-2 border-y px-5 py-1.5 text-[11px] text-muted-foreground", LINE)}>
          <span>Attendee</span>
          <span>Company</span>
          <span>Captured by</span>
          <span className="text-right">When</span>
        </div>
        {LEADS.map((lead) => (
          <Expand key={lead.name} when={!filtered || lead.by === "Fieldnote"}>
            <div className={cn("grid h-9 grid-cols-[1.25fr_1fr_0.9fr_0.55fr] items-center gap-2 border-b px-5 text-[12px]", LINE)}>
              <span className="flex min-w-0 items-center gap-2">
                <Avatar name={lead.name} size={18} />
                <span className="truncate text-foreground/90">{lead.name}</span>
              </span>
              <span className="truncate text-muted-foreground">{lead.company}</span>
              <span className="truncate text-muted-foreground">{lead.by}</span>
              <span className="text-right text-[11px] text-muted-foreground">{lead.when}</span>
            </div>
          </Expand>
        ))}
      </Window>
      <Cursor at={cursor} down={step === 4} hidden={step === 5} />
    </div>
  );
}

const VARIANTS = { checkin: CheckIn, badge: Badge, lead: Lead };

export function ScanMotif({ variant, seed, running }) {
  const View = VARIANTS[variant] || CheckIn;
  return (
    <Fit>
      <View seed={seed} running={running} />
    </Fit>
  );
}
