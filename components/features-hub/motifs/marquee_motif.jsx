import { Bell, Cloud, Code2, CreditCard, Database, Mail, MessageSquare, Share2, Sheet, Webhook, Zap, CalendarDays } from "lucide-react";
import styles from "@/components/features-hub/features_hub.module.css";

const TILES = [Database, Mail, CreditCard, CalendarDays, MessageSquare, Sheet, Zap, Cloud, Share2, Bell, Code2];

const ROWS = [
  { duration: 22, start: "0%", offset: 0 },
  { duration: 16, start: "12%", offset: 4 },
  { duration: 26, start: "6%", offset: 7 },
];

// A pocket-sized copy of the hero: rows of connected tools sliding past the gateway in the middle.
export function MarqueeMotif() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`flex w-full flex-col gap-3 ${styles.heroRows}`}>
        {ROWS.map((row) => {
          const tiles = TILES.slice(row.offset).concat(TILES.slice(0, row.offset)).slice(0, 8);
          return (
            <div key={row.start} className="flex justify-center overflow-hidden">
              {[0, 1, 2, 3].map((copy) => (
                <div key={copy} className={`flex shrink-0 ${styles.track}`} style={{ "--duration": `${row.duration}s`, "--start": row.start }}>
                  {tiles.map((Icon, index) => (
                    <span
                      key={index}
                      className="mr-3 flex size-13 items-center justify-center rounded-2xl border border-border bg-surface-card bg-linear-to-b from-foreground/[0.04] to-transparent"
                    >
                      <Icon className="size-5 text-muted-foreground" strokeWidth={1.75} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className={`absolute inset-0 m-auto size-20 ${styles.markHalo}`}>
        <span className="flex size-full items-center justify-center rounded-[22px] border border-border bg-surface-card shadow-lg shadow-black/10">
          <Webhook className="size-8 text-(--ink)" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}
