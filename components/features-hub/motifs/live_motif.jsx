"use client";

import { Heart, Mic, Users } from "lucide-react";
import { Fit, useTicker } from "@/components/features-hub/motion";
import { Lines } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const BARS = [0.1, 0.5, 0.25, 0.8, 0.35, 0.65, 0.15, 0.9, 0.45, 0.3, 0.7, 0.2, 0.55, 0.05];
const HEARTS = [
  { x: 0, d: 0 },
  { x: 14, d: 0.9 },
  { x: -10, d: 1.7 },
  { x: 8, d: 2.4 },
];

// A webinar room on air: the speaker's audio pulses, reactions float up and the audience keeps growing.
export function LiveMotif({ running }) {
  const tick = useTicker(1300, running);

  return (
    <Fit width={440} height={250}>
      <div className="absolute top-[30px] left-[16px] h-[180px] w-[300px] overflow-hidden rounded-xl border border-border bg-linear-to-b from-surface-strong to-background shadow-2xl shadow-black/20">
        <span className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,var(--ink),transparent_70%)] opacity-15" />
        <span className="absolute top-[46px] left-1/2 size-12 -translate-x-1/2 rounded-full bg-foreground/25" />
        <span className="absolute top-[100px] left-1/2 h-24 w-28 -translate-x-1/2 rounded-t-[48px] bg-foreground/15" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white">
            <span className={`size-1.5 rounded-full bg-white ${styles.blink}`} /> LIVE
          </span>
          <span className="flex items-center gap-1 rounded-md bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground tabular-nums">
            <Users className="size-2.5" /> {(1284 + tick * 7).toLocaleString("en-US")}
          </span>
        </div>
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between">
          <span className="flex items-center gap-1 rounded-md bg-background/70 px-1.5 py-1 text-[10px] text-foreground">
            <Mic className="size-2.5" /> Dr. Ana Lima
          </span>
          <span className="flex h-6 items-end gap-[3px]">
            {BARS.map((delay, index) => (
              <span key={index} className={`w-[3px] rounded-full bg-foreground/80 ${styles.eq}`} style={{ "--d": `${-delay}s`, height: "100%" }} />
            ))}
          </span>
        </div>
        {HEARTS.map((heart) => (
          <Heart
            key={heart.d}
            className={`absolute right-6 bottom-10 size-4 fill-(--ink) text-(--ink) ${styles.floatUp}`}
            style={{ "--x": `${heart.x}px`, "--d": `${heart.d}s` }}
          />
        ))}
      </div>
      <div className="absolute top-[30px] right-[12px] flex h-[180px] w-[104px] flex-col justify-end gap-2 overflow-hidden">
        {[0, 1, 2].map((row) => (
          <div key={`${tick}-${row}`} className={`rounded-lg border border-border bg-surface-card p-2 ${row === 2 ? styles.popIn : ""}`}>
            <span className="mb-1.5 flex items-center gap-1">
              <span className="size-3 rounded-full bg-(--ink)/40" />
              <span className="h-1 w-8 rounded-full bg-foreground/20" />
            </span>
            <Lines widths={[`${70 + ((tick + row) % 3) * 10}%`]} />
          </div>
        ))}
      </div>
    </Fit>
  );
}
