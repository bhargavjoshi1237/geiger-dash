import { Repeat } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

const TRACKS = [
  { name: "Main stage", sessions: [[0, 30, "Opening keynote"], [34, 26, "Product roadmap"], [64, 34, "Fireside chat"]] },
  { name: "Room B", sessions: [[8, 36, "Design systems"], [50, 22, "Panel"], [76, 22, "Q&A"]] },
  { name: "Workshops", sessions: [[0, 22, "Hands-on lab"], [26, 40, "Build a ticket flow"], [70, 28, "Office hours"]] },
];

const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00"];

function Sessions({ live }) {
  return TRACKS.map((track, row) =>
    track.sessions.map(([left, width, title]) => (
      <span
        key={`${row}-${title}`}
        className={`absolute flex h-[42px] items-center gap-1.5 overflow-hidden rounded-lg border px-2 text-[11px] whitespace-nowrap ${
          live ? "border-(--ink)/50 bg-(--ink)/20 text-foreground" : "border-border bg-surface-card text-muted-foreground"
        }`}
        style={{ left: `${left}%`, width: `${width}%`, top: row * 52 }}
      >
        <span className={`size-4 shrink-0 rounded-full ${live ? "bg-(--ink)" : "bg-foreground/10"}`} />
        <span className="truncate">{title}</span>
      </span>
    )),
  );
}

// Conference agenda: a playhead sweeps the day and lights each session as it passes.
function Agenda() {
  return (
    <div className="flex size-full flex-col justify-center gap-2.5">
      <div className="ml-[92px] flex justify-between font-mono text-[10px] text-text-tertiary">
        {HOURS.map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="flex w-20 flex-col gap-[10px] text-[11px] text-muted-foreground">
          {TRACKS.map((track) => (
            <span key={track.name} className="flex h-[42px] items-center justify-end truncate">
              {track.name}
            </span>
          ))}
        </div>
        <div className="relative h-[146px] flex-1">
          <Sessions />
          <div className={`absolute inset-0 ${styles.reveal}`}>
            <Sessions live />
          </div>
          <span className={`absolute -top-2 -bottom-2 w-px bg-(--ink) ${styles.playhead}`}>
            <span className="absolute -top-1 -left-[3.5px] size-2 rounded-full bg-(--ink) shadow-[0_0_10px_color-mix(in_oklab,var(--ink)_40%,transparent)]" />
          </span>
        </div>
      </div>
    </div>
  );
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// Recurring series: the same two weekday slots pop into each week down the calendar.
function Series() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, index) => (
          <span key={index} className="text-center font-mono text-[10px] text-text-tertiary">
            {day}
          </span>
        ))}
        {Array.from({ length: 28 }, (_, cell) => {
          const week = Math.floor(cell / 7);
          const day = cell % 7;
          const recurring = day === 1 || day === 3;
          return (
            <span key={cell} className="relative h-7 w-11 rounded-md border border-border bg-surface-card">
              {recurring ? (
                <span
                  className={`absolute inset-1 rounded-[5px] bg-(--ink)/55 ${styles.seriesPop}`}
                  style={{ "--d": `${week * 0.45 + (day === 3 ? 0.2 : 0)}s` }}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm">
        <Repeat className="size-3 text-(--ink)" /> Every Tue & Thu · 7:00 PM · 8 sessions
      </span>
    </div>
  );
}

export function TimelineMotif({ variant }) {
  return (
    <Fit width={variant === "series" ? 400 : 480} height={250}>
      {variant === "series" ? <Series /> : <Agenda />}
    </Fit>
  );
}
