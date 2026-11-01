"use client";

import { CalendarClock, CalendarRange, Check, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Segmented, Select, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const ROOMS = ["Main Stage", "Studio 2", "The Loft"];
const TIMES = ["09:30", "11:00", "14:00"];

const SESSIONS = [
  { title: "Opening keynote", speaker: "Grace Donnelly", status: "Confirmed", room: 0, time: 0 },
  { title: "Colour at scale", speaker: "Tomas Marek", status: "Confirmed", room: 2, time: 0 },
  { title: "Grids that bend", speaker: "Kofi Asante", status: "Confirmed", room: 0, time: 1 },
  { title: "Portfolio clinic", speaker: "Maya Chen", status: "Invited", room: 2, time: 2 },
  { title: "Designing in public", speaker: "Aisha Bennett", status: "Confirmed", room: 0, time: 2 },
];

// Pixels in the composition: the time gutter, column and row pitch, and the card's height.
const ROOM_X = [52, 192, 332];
const SLOT_W = 134;
const TIME_Y = [32, 102, 172];
const SLOT_H = 62;
const BAR_H = 48;

const AGENDA_SCENE = [500, 800, 260, 1000, 900, 3400];

// The agenda's speaker states: Confirmed or Invited, on the session's card.
function SessionCard({ title, speaker, status, className }) {
  return (
    <div className={cn("flex flex-col justify-center gap-1.5 rounded-lg border border-foreground/[0.09] bg-surface-card px-2.5 shadow-sm shadow-black/5 dark:bg-foreground/[0.03]", className)} style={{ height: SLOT_H, width: SLOT_W }}>
      <p className="truncate text-[12px] leading-4 font-medium text-foreground/90">{title}</p>
      <span className="flex items-center gap-1.5 text-[11px] text-foreground/85">
        <Avatar name={speaker} size={15} />
        <Dot tone={status === "Confirmed" ? "emerald" : "amber"} />
        {status}
      </span>
    </div>
  );
}

// Agenda Builder's grid: the cursor drags a session into its open slot and the speaker confirms.
function Agenda({ running }) {
  const step = useScene(AGENDA_SCENE, running);
  const placed = step >= 3;
  const lifted = step === 2 || step === 3;
  const y = placed ? TIME_Y[1] : TIME_Y[2];

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="Agenda Builder" icon={CalendarRange} meta="Thu 19 Nov" className="h-[330px] w-[480px]" actions={<Segmented options={["Grid", "List"]} active="Grid" className="text-[11px]" />}>
        <div className="relative flex-1">
          <div className={cn("absolute inset-x-0 top-0 flex h-[26px] border-b", LINE)}>
            {ROOMS.map((room, index) => (
              <span key={room} className="absolute text-[11px] leading-[26px] font-medium text-foreground/80" style={{ left: ROOM_X[index] + 2 }}>
                {room}
              </span>
            ))}
          </div>
          {TIMES.map((time, index) => (
            <span key={time} className="absolute left-3 text-[11px] text-muted-foreground tabular-nums" style={{ top: TIME_Y[index] + 4 }}>
              {time}
            </span>
          ))}
          {SESSIONS.map((session) => (
            <div key={session.title} className="absolute" style={{ left: ROOM_X[session.room], top: TIME_Y[session.time] }}>
              <SessionCard {...session} />
            </div>
          ))}
          <div className={cn("absolute rounded-lg border border-dashed transition-colors duration-300", step === 3 ? "border-foreground/40 bg-foreground/[0.04]" : "border-foreground/[0.12]")} style={{ left: ROOM_X[1], top: TIME_Y[1], width: SLOT_W, height: SLOT_H }} />
          <div className="absolute rounded-lg border border-dashed border-foreground/[0.12]" style={{ left: ROOM_X[1], top: TIME_Y[2], width: SLOT_W, height: SLOT_H }} />
          <div className="absolute rounded-lg border border-dashed border-foreground/[0.12]" style={{ left: ROOM_X[1], top: TIME_Y[0], width: SLOT_W, height: SLOT_H }} />
          <div className="absolute rounded-lg border border-dashed border-foreground/[0.12]" style={{ left: ROOM_X[2], top: TIME_Y[1], width: SLOT_W, height: SLOT_H }} />
          <div
            className="absolute top-0 z-10"
            style={{
              left: ROOM_X[1],
              translate: `0 ${y}px`,
              rotate: lifted ? "-2deg" : "0deg",
              scale: lifted ? 1.03 : 1,
              transition: "translate 0.7s cubic-bezier(0.65, 0, 0.35, 1), rotate 0.2s ease-out, scale 0.2s ease-out",
            }}
          >
            <SessionCard title="Type in motion" speaker="Amara Okafor" status={step === 5 ? "Confirmed" : "Invited"} className={cn("transition-shadow duration-200 dark:bg-surface-dialog", lifted ? "border-foreground/30 shadow-xl shadow-black/30" : "border-foreground/25 shadow-md shadow-black/15")} />
          </div>
        </div>
      </Window>
      <Cursor at={[ROOM_X[1] + 100, BAR_H + y + 38]} down={lifted} hidden={step === 0 || step === 5} />
    </div>
  );
}

const DATES = ["Thu 5 Nov 2026", "Thu 3 Dec 2026", "Thu 7 Jan 2027"];

const EDITIONS = [
  { name: "Northside Talks — October", status: "Ended" },
  { name: "Northside Talks — September", status: "Ended" },
];

const SERIES_SCENE = [500, 800, 700, 600, 600, 700, 280, 3400];

function SeriesFact({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-foreground/90">{children}</span>
    </div>
  );
}

// Event Series: a cadence is picked, its upcoming dates preview and the rule is saved on the series.
function Series({ running }) {
  const step = useScene(SERIES_SCENE, running);
  const monthly = step >= 2;
  const saved = step === 7;
  const onSave = step === 5 || step === 6;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="Event Series" icon={Repeat} meta="1 series" className="h-[330px] w-[480px]" actions={<Button variant="ghost" className="h-7 text-[11px]">New series</Button>}>
        <div className="flex min-h-0 flex-1">
          <div className={cn("w-[222px] shrink-0 border-r px-4 py-3.5", LINE)}>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[14px] font-medium">Northside Talks</span>
              <Status status="Active" />
            </div>
            <div className={cn("mt-2.5 border-y py-1", LINE)}>
              <SeriesFact label="Cadence">
                <span className="inline-flex items-center gap-1.5">
                  {saved ? <Check className="size-3 text-emerald-600 dark:text-emerald-400" strokeWidth={3} /> : null}
                  {saved ? "Monthly" : "Weekly"}
                </span>
              </SeriesFact>
              <SeriesFact label="Next event">{saved ? "Thu 5 Nov" : "Thu 12 Nov"}</SeriesFact>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">In this series</div>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {EDITIONS.map((edition) => (
                <div key={edition.name} className="rounded-lg border border-foreground/[0.08] px-2.5 py-2">
                  <div className="truncate text-[12px] text-foreground/90">{edition.name}</div>
                  <Status status={edition.status} className="mt-1 text-[11px] text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 px-4 py-3.5">
            <Field label="Cadence">
              <Select className={cn("transition-colors duration-300", step === 1 ? "border-foreground/40" : "")}>{monthly ? "Monthly" : "Weekly"}</Select>
            </Field>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <CalendarClock className="size-3" /> Upcoming dates
            </div>
            <div className="mt-1.5 flex flex-col">
              {DATES.map((date, index) => (
                <Expand key={date} when={step >= 2 + index}>
                  <div className={cn("flex h-[26px] items-center gap-2 border-b text-[12px] text-foreground/90 tabular-nums", LINE)}>
                    <span className="size-1 rounded-full bg-foreground/40" />
                    {date}
                  </div>
                </Expand>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Button className={cn("h-7 text-[11px] transition-[scale] duration-150", step === 6 ? "scale-95" : "")}>Save cadence</Button>
              <Show when={saved}>
                <Chip className="h-5 px-2 text-[11px]" dot="emerald">
                  Saved
                </Chip>
              </Show>
            </div>
          </div>
        </div>
      </Window>
      <Cursor at={onSave ? [300, 262] : [420, 112]} down={step === 6} hidden={step === 0 || saved || step === 2 || step === 3} />
    </div>
  );
}

export function TimelineMotif({ variant, running }) {
  return <Fit>{variant === "series" ? <Series running={running} /> : <Agenda running={running} />}</Fit>;
}
