"use client";

import { Armchair, Building2, CalendarPlus, Clock, Plus, Store, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Input, Select, StatStrip, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene, useTicker } from "@/components/features-hub/motion";
import { seededRandom } from "@/components/features-hub/random";
import { Cursor, Expand, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const THEATRE_SCENE = [800, 900, 240, 800, 240, 3400];

const SEAT = 11;

// Stalls rows that widen away from the stage and curl their ends towards it, in the map's own coordinates.
function theatreSeats(seed) {
  const random = seededRandom(`${seed}-seats`);
  const seats = [];
  for (let row = 0; row < 8; row += 1) {
    const count = 11 + row;
    const width = 176 + row * 16;
    for (let index = 0; index < count; index += 1) {
      const u = (index / (count - 1)) * 2 - 1;
      seats.push({ key: `${row}-${index}`, row, index, x: 150 + (u * width) / 2 - SEAT / 2, y: 34 + row * 19 - 9 * u * u, sold: random() < 0.42 });
    }
  }
  return seats;
}

const pickedKeys = ["5-7", "5-8"];
const MAP_LEFT = 2;
const MAP_TOP = 52;

function HoldClock({ running }) {
  const tick = useTicker(1000, running);
  const left = 598 - tick;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-700 tabular-nums dark:text-amber-300">
      <Clock className="size-3" /> Held {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
    </span>
  );
}

// Reserved seating: the buyer clicks two free seats, they turn theirs and a hold starts counting down.
function Theatre({ seed, running }) {
  const step = useScene(THEATRE_SCENE, running);
  const seats = theatreSeats(seed);
  const [first, second] = pickedKeys.map((key) => seats.find((seat) => seat.key === key));
  const picks = (step >= 3 ? 1 : 0) + (step === 5 ? 1 : 0);
  const target = step >= 3 ? second : first;
  const held = picks > 0;
  const total = picks * 320;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="Opening keynote · Main Stage" icon={Armchair} meta="Choose your seats" className="h-[330px] w-[480px]">
        <div className="flex min-h-0 flex-1">
          <div className="relative w-[306px] shrink-0">
            <svg viewBox="0 0 300 200" width="300" height="200" className="absolute top-2 left-[6px] overflow-visible text-foreground">
              <rect x="80" y="4" width="140" height="15" rx="7.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.16" />
              <text x="150" y="14.5" textAnchor="middle" className="fill-muted-foreground font-mono text-[7.5px] tracking-[0.3em]">
                STAGE
              </text>
              {seats.map((seat) => {
                const pickIndex = pickedKeys.indexOf(seat.key);
                if (pickIndex !== -1 && pickIndex < picks) {
                  return (
                    <g key={seat.key}>
                      <rect x={seat.x - 2} y={seat.y - 2} width={SEAT + 4} height={SEAT + 4} rx="4" fill="none" stroke="var(--color-emerald-500)" strokeWidth="1.25" />
                      <rect x={seat.x} y={seat.y} width={SEAT} height={SEAT} rx="3" fill="var(--color-emerald-500)" />
                    </g>
                  );
                }
                if (seat.sold && pickIndex === -1) {
                  return <rect key={seat.key} x={seat.x + 0.5} y={seat.y + 0.5} width={SEAT - 1} height={SEAT - 1} rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.18" />;
                }
                return <rect key={seat.key} x={seat.x} y={seat.y} width={SEAT} height={SEAT} rx="3" fill="currentColor" fillOpacity={seat.row < 3 ? 0.6 : 0.38} />;
              })}
            </svg>
          </div>
          <div className={cn("flex min-w-0 flex-1 flex-col gap-3 border-l p-3.5 text-[12px]", LINE)}>
            <div>
              <MonoLabel className="text-[10px]">Section</MonoLabel>
              <div className="mt-0.5 truncate font-medium">Centre stalls</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Row", "F"],
                ["Seats", picks === 2 ? "7, 8" : picks === 1 ? "7" : "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <MonoLabel className="text-[10px]">{label}</MonoLabel>
                  <div className="mt-0.5 truncate font-medium tabular-nums">{value}</div>
                </div>
              ))}
            </div>
            <div>
              <MonoLabel className="text-[10px]">Total</MonoLabel>
              <div className="mt-0.5 text-[15px] font-medium tabular-nums">{total ? `$${total}` : "—"}</div>
            </div>
            <Show when={held}>{held ? <HoldClock running={running} /> : <span className="block h-6" />}</Show>
            <Button className="w-full" variant={picks === 2 ? "primary" : "ghost"}>
              Reserve seats
            </Button>
          </div>
        </div>
      </Window>
      <Cursor at={[target.x + MAP_LEFT + 6, target.y + MAP_TOP + 6]} down={step === 2 || step === 4} hidden={step === 0 || step === 5} />
    </div>
  );
}

const FLOOR_SCENE = [700, 800, 900, 700, 240, 1000, 3200];

const BOOTHS = [
  ...["A1", "A2", "A3", "A4", "A5"].map((code, index) => ({ code, x: 12 + index * 48, y: 12, w: 42, h: 30 })),
  ...["B1", "B2", "B3", "B4"].map((code, index) => ({ code, x: 12 + index * 48, y: 72, w: 42, h: 30 })),
  ...["C1", "C2", "C3", "C4"].map((code, index) => ({ code, x: 12 + index * 48, y: 104, w: 42, h: 30 })),
  { code: "D1", x: 212, y: 72, w: 90, h: 62 },
];

const BOOTH_STATUS = { A1: "Occupied", A3: "Occupied", A4: "Reserved", B2: "Occupied", C1: "Reserved", C3: "Occupied", D1: "Occupied" };

const STATUS_FILL = { Available: "bg-foreground/[0.04]", Reserved: "bg-foreground/[0.16]", Occupied: "bg-foreground/[0.34]" };

// Pixels in the 480-wide composition: the hall's top-left, the tray slot and the free spot the new booth lands on.
const TRAY = [352, 176];
const SPOT = [270, 149];

function BoothTile({ code, status = "Available", style, className }) {
  return (
    <span
      className={cn("flex items-center justify-center rounded-[5px] border border-foreground/20 font-mono text-[10px] text-muted-foreground", status === "Occupied" && "text-foreground", STATUS_FILL[status], className)}
      style={style}
    >
      {code}
    </span>
  );
}

// Floor plan: the organiser adds a booth, it waits in the tray, then gets dragged onto a free spot on the hall.
function Floor({ running }) {
  const step = useScene(FLOOR_SCENE, running);
  const added = step >= 2;
  const dragging = step === 4 || step === 5;
  const placed = step === 6;
  const moved = step >= 5;

  const cursor = { 1: [430, 24], 2: [430, 24], 3: [TRAY[0] + 34, TRAY[1] + 20], 4: [TRAY[0] + 34, TRAY[1] + 20], 5: [SPOT[0] + 26, SPOT[1] + 20] }[step];

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window
        title="Floor Plan & Booths"
        icon={Store}
        className="h-[330px] w-[480px]"
        actions={
          <Button className={cn("h-7 px-2.5 text-[11px] transition-transform duration-150", step === 2 && "scale-95")} icon={Plus}>
            Add booth
          </Button>
        }
      >
        <StatStrip
          className="mx-4 mt-3 [&>div]:px-3 [&>div]:py-2"
          stats={[
            { label: "Booths", value: added ? "15" : "14" },
            { label: "Placed", value: placed ? "15" : "14" },
            { label: "Occupied", value: "5" },
            { label: "Floor value", value: "$27,600" },
          ]}
        />
        <div className="relative mx-4 mt-3 h-[174px] w-[316px] rounded-lg border border-foreground/[0.14] bg-foreground/[0.015]">
          {BOOTHS.map((booth) => (
            <BoothTile key={booth.code} code={booth.code} status={BOOTH_STATUS[booth.code]} className="absolute" style={{ left: booth.x, top: booth.y, width: booth.w, height: booth.h }} />
          ))}
          <span className="absolute rounded-[5px] border border-dashed border-foreground/25" style={{ left: 252, top: 12, width: 42, height: 30 }} />
        </div>
        <div className="absolute top-[138px] right-4 w-[112px] text-[11px]">
          <div className="font-medium text-muted-foreground">In tray</div>
          <div className="mt-1.5 flex h-[50px] items-center justify-center rounded-lg border border-dashed border-foreground/[0.14] text-muted-foreground/70">{added && !moved ? "" : "Empty"}</div>
          <div className="mt-2 flex flex-col gap-1">
            {["Available", "Reserved", "Occupied"].map((status) => (
              <span key={status} className="flex items-center gap-1.5 text-muted-foreground">
                <span className={cn("size-2.5 rounded-[3px] border border-foreground/20", STATUS_FILL[status])} />
                {status}
              </span>
            ))}
          </div>
        </div>
      </Window>
      <div
        className="absolute top-0 left-0 z-10"
        style={{
          translate: `${moved ? SPOT[0] : TRAY[0]}px ${moved ? SPOT[1] : TRAY[1]}px`,
          scale: dragging ? 1.08 : 1,
          opacity: added ? 1 : 0,
          transition: "translate 0.8s cubic-bezier(0.65, 0, 0.35, 1), scale 0.2s ease-out, opacity 0.3s ease-out",
        }}
      >
        <BoothTile code="A6" className={cn("h-[30px] w-[42px] bg-surface-card dark:bg-surface-dialog", dragging && "border-foreground/40 shadow-xl shadow-black/30")} />
      </div>
      <Cursor at={cursor ?? [430, 24]} down={step === 2 || dragging} hidden={!cursor} />
    </div>
  );
}

const VENUE_SCENE = [800, 800, 1500, 800, 800, 3400];

const VENUES = [
  { name: "Harbour Hall", city: "Lisbon", type: "Indoor", capacity: "1,600", status: "Active" },
  { name: "Riverside Loft", city: "Lisbon", type: "Indoor", capacity: "220", status: "Active" },
  { name: "Quayside Gardens", city: "Almada", type: "Outdoor", capacity: "900", status: "Active" },
  { name: "Atrium 12", city: "Porto", type: "Hybrid", capacity: "450", status: "Inactive" },
];

const COLUMNS = "grid-cols-[minmax(0,1fr)_62px_60px_72px]";

const AMENITIES = ["Wi-Fi", "Parking", "Step-free", "Catering", "AV"];

const FILLED = [
  ["City", "Lisbon"],
  ["Seated capacity", "1,600"],
  ["Timezone", "Europe/Lisbon"],
];

// Venues: open a saved venue and its details, then pick it on a new event and watch the fields fill themselves.
function Venues({ running }) {
  const step = useScene(VENUE_SCENE, running);
  const details = step === 2;
  const form = step >= 3;
  const filled = step === 5;
  const cursor = { 1: [130, 174], 2: [130, 174], 3: [336, 140], 4: [336, 140] }[step];

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="Venues" icon={Building2} className="h-[330px] w-[480px]" actions={<Button variant="ghost" className="h-7 px-2.5 text-[11px]" icon={Plus}>Add venue</Button>}>
        <StatStrip
          className="mx-4 mt-3 [&>div]:px-3 [&>div]:py-2"
          stats={[
            { label: "Total venues", value: "4" },
            { label: "Total capacity", value: "3,170" },
          ]}
        />
        <div className={cn("mt-3 grid h-7 items-center gap-2 border-y px-5 text-[11px] text-muted-foreground", COLUMNS, LINE)}>
          <span>Venue</span>
          <span>Type</span>
          <span className="text-right">Capacity</span>
          <span className="text-right">Status</span>
        </div>
        {VENUES.map((venue, index) => (
          <div key={venue.name} className={cn("grid h-10 items-center gap-2 border-b px-5 transition-colors duration-300", COLUMNS, LINE, index === 0 && step >= 1 && "bg-foreground/[0.05]")}>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-medium text-foreground/90">{venue.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{venue.city}</span>
            </span>
            <span className="text-[12px] text-foreground/80">{venue.type}</span>
            <span className="text-right text-[12px] text-foreground/80 tabular-nums">{venue.capacity}</span>
            <Status status={venue.status} className="justify-end" />
          </div>
        ))}
      </Window>

      <Show when={details} className="absolute top-[56px] right-3 z-10 w-[238px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="text-[13px] font-medium">Harbour Hall</div>
        <MonoLabel className="mt-2.5 block text-[10px]">Details</MonoLabel>
        <div className="mt-1 text-muted-foreground">Quayside events hall in central Lisbon, with four rooms.</div>
        <MonoLabel className="mt-2.5 block text-[10px]">Capacity &amp; amenities</MonoLabel>
        <div className="mt-1 flex items-center gap-1.5 text-foreground/85 tabular-nums">
          <Users className="size-3.5 text-muted-foreground" /> 1,600 seated · 4 rooms
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {AMENITIES.map((amenity) => (
            <span key={amenity} className="rounded border border-foreground/[0.1] px-1.5 text-[11px] leading-5 text-muted-foreground">
              {amenity}
            </span>
          ))}
        </div>
      </Show>

      <Show when={form} className="absolute top-[56px] right-3 z-10 w-[264px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <CalendarPlus className="size-4 text-muted-foreground" strokeWidth={1.75} /> New event
        </div>
        <Field label="Venue" className="mt-3">
          <Select className={cn("transition-colors duration-300", step === 4 && "border-foreground/30")}>{filled ? "Harbour Hall" : "Pick a saved venue"}</Select>
        </Field>
        <Expand when={filled}>
          <div className="mt-2.5 flex flex-col gap-2">
            {FILLED.map(([label, value]) => (
              <Field key={label} label={label}>
                <Input className="tabular-nums">
                  <Dot tone="emerald" />
                  {value}
                </Input>
              </Field>
            ))}
          </div>
        </Expand>
      </Show>

      <Cursor at={cursor ?? [336, 140]} down={step === 2 || step === 4} hidden={!cursor} />
    </div>
  );
}

export function SeatsMotif({ variant, seed, running }) {
  return (
    <Fit>
      {variant === "floor" ? <Floor running={running} /> : variant === "tables" ? <Venues running={running} /> : <Theatre seed={seed} running={running} />}
    </Fit>
  );
}
