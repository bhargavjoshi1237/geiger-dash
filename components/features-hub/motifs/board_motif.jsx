import { Check, GripVertical } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import { Lines } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const VARIANTS = {
  venues: {
    columns: ["Shortlist", "Quoted", "Booked"],
    moving: ["The Grand Hall", "400 cap · $8.2k"],
    cards: [["Riverside Loft", "Pier 9"], ["Atrium 12", "Glasshouse"], ["Oak Barn"]],
  },
  papers: {
    columns: ["Submitted", "In review", "Accepted"],
    moving: ["Designing for scale", "L. Okafor · Talk"],
    cards: [["Edge caching 101", "Zero to launch"], ["Data contracts", "On-call calm"], ["Keynote: Craft"]],
  },
  sponsors: {
    columns: ["Prospect", "Pitched", "Signed"],
    moving: ["Acme Labs", "Gold · $12,000"],
    cards: [["Brightline", "Fieldnote"], ["Lumen", "Orbit"], ["Northwind"]],
  },
};

const COL = 148;
const SLOT = 58;

function StaticCard({ title }) {
  return (
    <div className="flex h-[50px] flex-col justify-center gap-1.5 rounded-lg border border-border bg-surface-card px-2.5">
      <p className="truncate text-[11px] font-medium text-foreground">{title}</p>
      <Lines widths={["55%"]} />
    </div>
  );
}

// A pipeline board: one card lifts and travels column to column until it lands and ticks off.
export function BoardMotif({ variant }) {
  const config = VARIANTS[variant] || VARIANTS.papers;

  return (
    <Fit width={436} height={250}>
      <div className="absolute inset-x-0 top-[14px] flex gap-[12px]">
        {config.columns.map((column, index) => (
          <div key={column} className="w-[136px] shrink-0">
            <div className="mb-2 flex h-4 items-center justify-between px-0.5 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className={`size-1.5 rounded-full ${index === 2 ? "bg-emerald-500" : index === 1 ? "bg-(--ink)" : "bg-foreground/30"}`} />
                {column}
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">{config.cards[index].length + 1}</span>
            </div>
            <div className="space-y-2">
              <StaticCard title={config.cards[index][0]} />
              <div className="h-[50px] rounded-lg border border-dashed border-border" />
              {config.cards[index][1] ? <StaticCard title={config.cards[index][1]} /> : null}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`absolute left-0 flex h-[50px] w-[136px] items-center gap-2 rounded-lg border border-(--ink)/50 bg-surface-card px-2 ${styles.boardMove}`}
        style={{ "--col": `${COL}px`, top: 14 + 24 + SLOT }}
      >
        <GripVertical className="size-3.5 shrink-0 text-text-tertiary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-foreground">{config.moving[0]}</p>
          <p className="truncate text-[10px] text-muted-foreground">{config.moving[1]}</p>
        </div>
        <span className={`flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white ${styles.boardDone}`}>
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      </div>
    </Fit>
  );
}
