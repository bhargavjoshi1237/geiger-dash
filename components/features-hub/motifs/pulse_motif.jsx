"use client";

import { Nfc } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import { useScene } from "@/components/features-hub/motion";
import { Expand, Fit } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const SCENE = [900, 600, 1600, 3200];

const FILTERS = ["All taps", "Pending", "Settled", "Void"];

const TAPS = [
  { time: "14:02", name: "Kofi Asante", point: "Workshop door", amount: "$25", status: "Settled" },
  { time: "13:58", name: "Grace Donnelly", point: "Workshop door", amount: "$25", status: "Pending" },
  { time: "13:51", name: "Tomas Marek", point: "Main Stage", amount: "—", status: "Free" },
  { time: "13:47", name: "Aisha Bennett", point: "Workshop door", amount: "$25", status: "Settled" },
];

const BINDINGS = [
  { uid: "04:A2:1F:7C", name: "Maya Chen" },
  { uid: "04:6B:E9:30", name: "Kofi Asante" },
  { uid: "04:D1:58:2A", name: "Grace Donnelly" },
];

const STATUS_TONES = { Settled: "emerald", Pending: "amber", Free: "neutral" };

function TapRow({ tap }) {
  return (
    <div className={cn("grid h-[42px] grid-cols-[34px_minmax(0,1fr)_34px_62px] items-center gap-2 border-b px-3.5 text-[11px]", LINE)}>
      <span className="text-muted-foreground tabular-nums">{tap.time}</span>
      <span className="flex min-w-0 items-center gap-2">
        <Avatar name={tap.name} size={18} />
        <span className="min-w-0">
          <span className="block truncate text-[12px] text-foreground/90">{tap.name}</span>
          <span className="block truncate text-muted-foreground">{tap.point}</span>
        </span>
      </span>
      <span className="text-right text-foreground/85 tabular-nums">{tap.amount}</span>
      <span className="flex items-center justify-end gap-1.5 text-foreground/85">
        <Dot tone={STATUS_TONES[tap.status]} />
        {tap.status}
      </span>
    </div>
  );
}

// RFID / NFC: a wristband taps the entry point's reader, the field ripples, and the tap lands on the attendee's bill.
export function PulseMotif({ running }) {
  const step = useScene(SCENE, running);
  const atReader = step === 1 || step === 2;
  const landed = step >= 2;

  return (
    <Fit>
      <Window title="RFID / NFC" icon={Nfc} meta="Workshop door · $25 per tap" className="h-[330px] w-[480px]">
        <div className="flex min-h-0 flex-1">
          <div className={cn("w-[172px] shrink-0 border-r", LINE)}>
            <div className={cn("relative h-[112px] overflow-hidden border-b", LINE)}>
              <div className="absolute top-1/2 left-[112px] size-14 -translate-x-1/2 -translate-y-1/2">
                {step === 2
                  ? [0, 0.2, 0.4].map((delay) => <span key={delay} className={cn("absolute inset-0 rounded-full border-2 border-foreground/50", styles.ripple)} style={{ "--d": `${delay}s` }} />)
                  : null}
                <span className={cn("relative flex size-full items-center justify-center rounded-full border bg-surface-card shadow-lg shadow-black/15 transition-colors duration-200 dark:bg-surface-dialog", step === 2 ? "border-emerald-500/60" : "border-foreground/[0.14]")}>
                  <Nfc className={cn("size-6 transition-colors duration-200", step === 2 ? "text-emerald-500" : "text-muted-foreground")} strokeWidth={1.75} />
                </span>
              </div>
              <div
                className="absolute top-1/2 left-0 z-10 flex h-7 w-[74px] -translate-y-1/2 items-center justify-end rounded-full border border-foreground/[0.14] bg-surface-card pr-1 shadow-md shadow-black/20 dark:bg-surface-dialog"
                style={{ translate: atReader ? "20px -50%" : "-48px -50%", rotate: atReader ? "-3deg" : "-14deg", transition: "translate 0.55s cubic-bezier(0.65, 0, 0.35, 1), rotate 0.55s cubic-bezier(0.65, 0, 0.35, 1)" }}
              >
                <span className="mr-auto ml-2 font-mono text-[9px] text-muted-foreground">NSDW</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-foreground/10">
                  <span className="size-2 rounded-full bg-foreground/70" />
                </span>
              </div>
            </div>
            <div className="px-3.5 pt-2.5 pb-1 text-[11px] font-medium text-muted-foreground">Wristband bindings</div>
            {BINDINGS.map((binding) => (
              <div key={binding.uid} className="px-3.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-foreground/85">{binding.uid}</span>
                  <Dot tone="emerald" className="ml-auto" />
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{binding.name} · Active</div>
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className={cn("flex h-10 items-center gap-1 border-b px-3 text-[11px]", LINE)}>
              {FILTERS.map((filter, index) => (
                <span key={filter} className={cn("rounded-full px-2 py-0.5", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
                  {filter}
                </span>
              ))}
            </div>
            <Expand when={landed}>
              <div className={landed && step === 2 ? "bg-foreground/[0.05] transition-colors duration-700" : "transition-colors duration-700"}>
                <TapRow tap={{ time: "14:06", name: "Maya Chen", point: "Workshop door", amount: "$25", status: "Pending" }} />
              </div>
            </Expand>
            {TAPS.map((tap) => (
              <TapRow key={tap.time} tap={tap} />
            ))}
          </div>
        </div>
      </Window>
    </Fit>
  );
}
