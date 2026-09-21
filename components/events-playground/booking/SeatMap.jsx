"use client";

import { cn } from "@/lib/utils";
import { SEAT_ROWS, ZONE_LABELS, isSeatTaken } from "./event-booking-data";

const LABEL = "text-[10px] font-medium uppercase tracking-[0.16em] text-text-tertiary";

const LEGEND = [
  { label: "Free", className: "bg-surface-strong" },
  { label: "Yours", className: "bg-rose-500" },
  { label: "Gone", className: "ring-1 ring-inset ring-border" },
];

// Picks `capacity` seats from the rows belonging to the chosen tier's zone.
export default function SeatMap({ zone, capacity, selected, onToggle }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className={LABEL}>Stage</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4 space-y-2">
        {SEAT_ROWS.map((row, rowIndex) => {
          const inZone = row.zone === zone;

          return (
            <div key={row.id} className="flex items-center gap-2">
              <span className="w-3 shrink-0 text-[11px] text-text-tertiary">{row.id}</span>
              <div className="flex flex-1 justify-center gap-1">
                {Array.from({ length: row.seats }, (_, seatIndex) => {
                  const id = `${row.id}${seatIndex + 1}`;
                  const taken = isSeatTaken(rowIndex, seatIndex);
                  const isSelected = selected.includes(id);
                  const full = selected.length >= capacity && !isSelected;

                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={!inZone || taken || full}
                      aria-label={`Seat ${id}`}
                      aria-pressed={isSelected}
                      onClick={() => onToggle(id)}
                      className={cn(
                        "aspect-square w-full max-w-[15px] rounded-[2px] transition-colors",
                        !inZone && "bg-surface-subtle opacity-40",
                        inZone && isSelected && "bg-rose-500",
                        inZone && !isSelected && taken && "ring-1 ring-inset ring-border",
                        inZone &&
                          !isSelected &&
                          !taken &&
                          "bg-surface-strong hover:bg-rose-500/50",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
            <span className={cn("h-2 w-2 rounded-[2px]", item.className)} />
            {item.label}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-text-tertiary">{ZONE_LABELS[zone]}</span>
      </div>
    </div>
  );
}
