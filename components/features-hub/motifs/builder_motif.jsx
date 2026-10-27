import { Lock, MousePointer2, ShieldCheck } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import { Lines } from "@/components/features-hub/motifs/motif_kit";
import styles from "@/components/features-hub/features_hub.module.css";

const URLS = {
  page: "geiger.events/summer-sessions",
  domain: "tickets.yourbrand.com",
  storefront: "geiger.events/northwind",
};

function Block({ d, className = "", children }) {
  return (
    <div className={`${styles.blockIn} ${className}`} style={{ "--d": `${d}s` }}>
      {children}
    </div>
  );
}

function PageBody({ branded }) {
  return (
    <div className="space-y-2.5 p-3">
      <Block d={0} className="flex h-[62px] items-end justify-between rounded-lg bg-linear-to-br from-(--ink)/45 to-(--ink)/10 p-2.5">
        {branded ? (
          <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[10px] font-bold text-background">YB</span>
        ) : (
          <Lines widths={["96px", "60px"]} />
        )}
        <span className="rounded-md bg-(--ink) px-2 py-1 text-[10px] font-semibold text-(--ink-fg)">Get tickets</span>
      </Block>
      <div className="grid grid-cols-3 gap-2">
        {[0.25, 0.4, 0.55].map((d) => (
          <Block key={d} d={d} className="rounded-lg border border-border p-2">
            <span className="block h-7 rounded-md bg-foreground/[0.06]" />
            <Lines widths={["90%", "60%"]} className="mt-2" />
          </Block>
        ))}
      </div>
      <Block d={0.7} className="flex items-center justify-between rounded-lg border border-border p-2">
        <Lines widths={["120px"]} />
        <span className="h-4 w-14 rounded-md bg-foreground/10" />
      </Block>
    </div>
  );
}

function StorefrontBody() {
  return (
    <div className="p-3">
      <Block d={0} className="flex items-center gap-2">
        <span className="size-7 rounded-full bg-linear-to-br from-(--ink) to-(--ink)/40" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-foreground">Northwind Live</p>
          <p className="text-[10px] text-muted-foreground">8 upcoming events</p>
        </div>
        <span className="rounded-full bg-(--ink) px-2.5 py-1 text-[10px] font-semibold text-(--ink-fg)">Follow</span>
      </Block>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {["Aug 14", "Aug 21", "Sep 02", "Sep 18"].map((date, index) => (
          <Block key={date} d={0.2 + index * 0.15} className="flex gap-2 rounded-lg border border-border p-2">
            <span className="flex w-9 shrink-0 flex-col items-center justify-center rounded-md bg-(--ink)/15 font-mono text-[9px] leading-tight text-foreground">
              {date.split(" ").map((part) => (
                <span key={part}>{part}</span>
              ))}
            </span>
            <Lines widths={["100%", "65%"]} className="flex-1 self-center" />
          </Block>
        ))}
      </div>
    </div>
  );
}

// A browser window building itself: the URL types out, blocks settle into place and the cursor clicks through.
export function BuilderMotif({ variant }) {
  const url = URLS[variant] || URLS.page;
  const isDomain = variant === "domain";

  return (
    <Fit width={420} height={250}>
      <div className="absolute inset-x-[30px] top-[6px] h-[238px] overflow-hidden rounded-xl border border-border bg-surface-card shadow-2xl shadow-black/10">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2 rounded-full bg-foreground/15" />
            ))}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-[10px] text-muted-foreground">
            <Lock className={`size-2.5 shrink-0 ${isDomain ? "text-emerald-500" : ""}`} />
            <span
              className={`overflow-hidden whitespace-nowrap ${styles.typing}`}
              style={{ "--chars": url.length, animationTimingFunction: `steps(${url.length}, end)` }}
            >
              {url}
            </span>
            <span className="h-3 w-px shrink-0 animate-suite-caret bg-foreground/60" />
          </span>
        </div>
        {variant === "storefront" ? <StorefrontBody /> : <PageBody branded={isDomain} />}
      </div>
      {isDomain ? (
        <span className={`absolute top-[46px] right-0 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-surface-card px-2.5 py-1 text-[10px] font-medium text-emerald-600 shadow-md dark:text-emerald-400 ${styles.grant}`}>
          <ShieldCheck className="size-3" /> SSL active
        </span>
      ) : null}
      <MousePointer2 className={`absolute top-0 left-0 size-5 fill-foreground text-background drop-shadow ${styles.cursor}`} />
    </Fit>
  );
}
