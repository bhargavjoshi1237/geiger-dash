import { Fit } from "@/components/features-hub/motion";
import { seededRandom } from "@/components/features-hub/random";
import styles from "@/components/features-hub/features_hub.module.css";

const W = 440;
const H = 250;
const CYCLE = 10;

// Theatre rows that widen away from the stage and curl their ends towards it.
function theatreSeats() {
  const seats = [];
  for (let row = 0; row < 7; row += 1) {
    const count = 12 + row * 2;
    const width = 200 + row * 34;
    for (let i = 0; i < count; i += 1) {
      const u = (i / (count - 1)) * 2 - 1;
      seats.push({ x: W / 2 + (u * width) / 2 - 6, y: 52 + row * 25 - 16 * u * u, w: 12, h: 10, r: 3, row, i });
    }
  }
  return seats;
}

// Two blocks of exhibitor booths either side of a centre aisle.
function floorSeats() {
  const seats = [];
  for (const [left, top] of [[38, 60], [244, 60]]) {
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) seats.push({ x: left + col * 40, y: top + row * 34, w: 34, h: 26, r: 5, row, i: col });
    }
  }
  return seats;
}

// Round banquet tables, each ringed by eight chairs.
function tableSeats() {
  const seats = [];
  const tables = [];
  [[90, 82], [220, 82], [350, 82], [155, 182], [285, 182]].forEach(([cx, cy], table) => {
    tables.push({ cx, cy });
    for (let chair = 0; chair < 8; chair += 1) {
      const angle = (chair / 8) * Math.PI * 2;
      seats.push({ x: cx + Math.cos(angle) * 33 - 5, y: cy + Math.sin(angle) * 33 - 5, w: 10, h: 10, r: 5, row: table, i: chair });
    }
  });
  return { seats, tables };
}

const LAYOUTS = {
  theatre: () => ({ seats: theatreSeats(), tables: [], label: "Row F · Seat 12", price: "$64", pick: 91 }),
  floor: () => ({ seats: floorSeats(), tables: [], label: "Booth B6 · 3×3 m", price: "$1,200", pick: 21 }),
  tables: () => ({ ...tableSeats(), label: "Table 3 · Seat 5", price: "$140", pick: 20 }),
};

// A live seat map: seats sell and free up on their own clock while one stays picked and pulsing.
export function SeatsMotif({ variant, seed }) {
  const layout = (LAYOUTS[variant] || LAYOUTS.theatre)();
  const random = seededRandom(`${seed}-seats`);
  const picked = layout.seats[layout.pick];

  return (
    <Fit width={W} height={H}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible text-foreground">
        {variant === "floor" || variant === "tables" ? null : (
          <g>
            <rect x={W / 2 - 92} y="8" width="184" height="18" rx="9" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" />
            <text x={W / 2} y="21" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px] tracking-[0.3em]">
              STAGE
            </text>
          </g>
        )}
        {variant === "floor" ? (
          <text x={W / 2} y="40" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px] tracking-[0.3em]">
            MAIN AISLE
          </text>
        ) : null}
        {layout.tables.map((table) => (
          <circle key={`${table.cx}-${table.cy}`} cx={table.cx} cy={table.cy} r="19" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.18" />
        ))}
        {layout.seats.map((seat, index) =>
          seat === picked ? null : (
            <rect
              key={index}
              x={seat.x}
              y={seat.y}
              width={seat.w}
              height={seat.h}
              rx={seat.r}
              stroke="currentColor"
              strokeOpacity="0.22"
              className={styles.seat}
              style={{ "--dur": `${CYCLE}s`, "--d": `${(-random() * CYCLE).toFixed(2)}s` }}
            />
          ),
        )}
        <rect x={picked.x} y={picked.y} width={picked.w} height={picked.h} rx={picked.r} fill="var(--ink)" stroke="var(--ink)" className={styles.ping} />
        <rect x={picked.x} y={picked.y} width={picked.w} height={picked.h} rx={picked.r} fill="var(--ink)" stroke="var(--ink)" />
      </svg>
      <div
        className="absolute flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-lg border border-border bg-surface-card px-2.5 py-1.5 text-[11px] whitespace-nowrap shadow-lg shadow-black/10"
        style={{ left: picked.x + picked.w / 2, top: picked.y - 8 }}
      >
        <span className="text-muted-foreground">{layout.label}</span>
        <span className="font-semibold text-foreground">{layout.price}</span>
      </div>
    </Fit>
  );
}
