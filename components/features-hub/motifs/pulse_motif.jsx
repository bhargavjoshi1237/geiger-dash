import { BadgeCheck, Nfc } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

// A wristband swings in, taps the reader, the field ripples out and the gate grants access, every 3s.
export function PulseMotif() {
  return (
    <Fit width={420} height={250}>
      <div className="absolute top-1/2 left-[250px] size-24 -translate-x-1/2 -translate-y-1/2">
        {[0, 0.22, 0.44].map((delay) => (
          <span key={delay} className={`absolute inset-0 rounded-full border-2 border-(--ink)/60 ${styles.ripple}`} style={{ "--d": `${delay}s` }} />
        ))}
        <span className={`relative flex size-full items-center justify-center rounded-full border border-border bg-surface-card shadow-xl shadow-black/10 ${styles.readerFlash}`}>
          <Nfc className="size-9 text-(--ink)" strokeWidth={1.6} />
        </span>
      </div>

      <div className={`absolute top-[104px] left-[86px] ${styles.tapIn}`}>
        <div className="relative flex h-[42px] w-[104px] items-center justify-end rounded-full border border-border bg-linear-to-r from-surface-strong to-surface-card pr-2 shadow-lg">
          <span className="absolute inset-y-2 left-3 w-10 rounded-full bg-foreground/10" />
          <span className="flex size-7 items-center justify-center rounded-full bg-(--ink)/20 ring-1 ring-(--ink)/50">
            <span className="size-2.5 rounded-full bg-(--ink)" />
          </span>
        </div>
      </div>

      <div className="absolute top-[186px] left-[250px] -translate-x-1/2">
        <span className={`flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-emerald-600 dark:text-emerald-400 ${styles.grant}`}>
          <BadgeCheck className="size-3.5" /> Access granted · Zone A
        </span>
      </div>
    </Fit>
  );
}
