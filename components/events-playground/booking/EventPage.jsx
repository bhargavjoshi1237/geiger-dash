"use client";

import { Progress } from "@geiger/ui";
import { DEMO_EVENT } from "./event-booking-data";

// One micro-label style, used for every structural label on the page.
const LABEL = "text-[10px] font-medium uppercase tracking-[0.16em] text-text-tertiary";

function Detail({ label, value, sub }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <p className="mt-1.5 text-sm text-foreground">{value}</p>
      {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

// The public page a guest lands on from a shared /e/<id> link.
export default function EventPage() {
  return (
    <div className="min-w-0 lg:overflow-y-auto">
      <div className="relative flex h-36 items-end border-b border-border bg-rose-500/10 px-5 pb-4 sm:h-44">
        <p className="absolute right-5 top-4 flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {DEMO_EVENT.status}
        </p>

        <div className="flex items-end gap-4">
          <p className="text-5xl font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-6xl">
            {DEMO_EVENT.day}
          </p>
          <div className="pb-1">
            <p className={LABEL}>{DEMO_EVENT.month}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {DEMO_EVENT.weekday}, {DEMO_EVENT.doors}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <h4 className="text-2xl font-semibold tracking-tight text-foreground">
          {DEMO_EVENT.name}
        </h4>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {DEMO_EVENT.summary}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-5">
          <Detail label="Venue" value={DEMO_EVENT.venue} sub={DEMO_EVENT.address} />
          <Detail label="Time" value={DEMO_EVENT.timeLabel} sub={DEMO_EVENT.dateLabel} />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className={LABEL}>Line-up</p>
          <dl className="mt-3">
            {DEMO_EVENT.agenda.map((slot) => (
              <div
                key={slot.time}
                className="flex gap-5 border-b border-border py-2.5 last:border-0"
              >
                <dt className="w-12 shrink-0 text-sm text-text-tertiary tabular-nums">
                  {slot.time}
                </dt>
                <dd className="min-w-0 truncate text-sm text-foreground">{slot.title}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-sm text-foreground">{DEMO_EVENT.host}</p>
          <p className="text-sm text-muted-foreground">{DEMO_EVENT.hostRole}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <p className={LABEL}>Sold</p>
            <p className="text-sm text-text-secondary tabular-nums">
              {DEMO_EVENT.sold} of {DEMO_EVENT.capacity}
            </p>
          </div>
          <Progress
            value={(DEMO_EVENT.sold / DEMO_EVENT.capacity) * 100}
            className="mt-2 h-[3px]"
          />
        </div>
      </div>
    </div>
  );
}
