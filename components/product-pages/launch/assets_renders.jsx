import { Check, Clock, Copy, Download, Eye, Image as ImageIcon, Link2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Assets renders: versions, an approval pipeline, a share link and a gallery storefront. Names come from the playground seed.

// A meadow drawn in the palette's greys; `sky` swaps the sky for the "Sky replaced" version.
export function Meadow({ sky = "clear", className }) {
  return (
    <svg viewBox="0 0 380 250" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`meadow-sky-${sky}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity={sky === "clear" ? 0.2 : 0.07} />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect width="380" height="250" fill={`url(#meadow-sky-${sky})`} />
      {sky === "clear" ? <circle cx="292" cy="72" r="26" fill="currentColor" fillOpacity="0.16" /> : null}
      {sky === "cloud" ? (
        <g fill="currentColor" fillOpacity="0.1">
          <ellipse cx="110" cy="64" rx="56" ry="16" />
          <ellipse cx="250" cy="48" rx="70" ry="18" />
        </g>
      ) : null}
      <path d="M0 150 C 70 112 140 120 200 140 S 320 108 380 128 V250 H0Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M0 178 C 90 150 170 160 240 176 S 340 160 380 166 V250 H0Z" fill="currentColor" fillOpacity="0.17" />
      <path d="M0 208 C 110 188 220 196 380 200 V250 H0Z" fill="currentColor" fillOpacity="0.26" />
      {[30, 64, 92, 140, 176, 214, 252, 290, 330, 356].map((x, index) => (
        <circle key={x} cx={x} cy={218 + (index % 3) * 9} r="2.2" fill="currentColor" fillOpacity="0.45" />
      ))}
    </svg>
  );
}

const VERSIONS = [
  { tag: "v1", note: "Initial grade", sky: "flat" },
  { tag: "v2", note: "Sky replaced", sky: "cloud" },
  { tag: "v3", note: "Final retouch", sky: "clear", current: true },
];

const STAGES = [
  { name: "Internal QA", who: "Danielle Reyes", state: "Approved" },
  { name: "Account review", who: "Marco Silva", state: "Approved" },
  { name: "Client sign-off", who: "Northwind", state: "In Review", due: "Due in 31h" },
];

export function AssetDetail() {
  return (
    <Window title="Spring hero — meadow.jpg" icon={ImageIcon} meta="Client delivery" className="w-[680px]">
      <div className="flex">
        <div className={cn("flex w-[400px] shrink-0 flex-col gap-3 border-r p-4", LINE)}>
          <div className="overflow-hidden rounded-lg border border-foreground/[0.08]">
            <Meadow className="block h-[220px] w-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {VERSIONS.map((version) => (
              <div key={version.tag} className={cn("rounded-lg border p-1.5", version.current ? "border-foreground/30 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
                <Meadow sky={version.sky} className="block h-[54px] w-full rounded-[5px]" />
                <div className="mt-1.5 flex items-center gap-1 px-0.5 text-[11px]">
                  <span className="font-mono text-foreground/85">{version.tag}</span>
                  {version.current ? <span className="ml-auto text-emerald-600 dark:text-emerald-400">Current</span> : null}
                </div>
                <div className="truncate px-0.5 text-[11px] text-muted-foreground">{version.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">Approval pipeline</div>
            <div className="mt-0.5 font-medium">Client delivery · Sequential</div>
          </div>
          <div className="relative flex flex-col gap-3">
            <span className="absolute top-3 bottom-3 left-[9px] border-l border-dashed border-foreground/20" />
            {STAGES.map((stage) => (
              <div key={stage.name} className="relative flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-surface-card dark:border-surface-subtle",
                    stage.state === "Approved" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white",
                  )}
                >
                  {stage.state === "Approved" ? <Check className="size-2.5" strokeWidth={3.5} /> : <Clock className="size-2.5" strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground/90">{stage.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {stage.state} · {stage.who}
                    {stage.due ? <span className="text-amber-700 dark:text-amber-300"> · {stage.due}</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex gap-2">
            <span className="flex-1 rounded-md border border-foreground/[0.1] py-1.5 text-center text-[12px] text-muted-foreground">Request changes</span>
            <span className="flex-1 rounded-md bg-foreground py-1.5 text-center text-[12px] font-medium text-background">Approve</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

const VIEW_BARS = [18, 26, 22, 34, 30, 48, 40, 56, 44, 62, 58, 74, 66, 80];

export function ShareLinkRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Link2 className="size-4 text-muted-foreground" />
        <span className="font-medium">Press kit 2026</span>
        <Chip dot="emerald" className="ml-auto h-5 text-[11px]">
          Active
        </Chip>
      </div>
      <div className="flex flex-col gap-3 px-4 py-3.5">
        <div className="flex items-center gap-2 rounded-lg border border-foreground/[0.09] px-3 py-2">
          <span className="truncate font-mono text-[12px] text-foreground/85">/s/press-kit-2026</span>
          <Copy className="ml-auto size-3.5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          {[
            ["Access", "Public"],
            ["Expires", "In 60 days"],
            ["Password", "Off"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-foreground/[0.04] px-2.5 py-2">
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="mt-0.5 text-foreground/90">{value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1.5 text-[12px]">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Eye className="size-3.5" /> <span className="font-medium text-foreground tabular-nums">866</span> views
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Download className="size-3.5" /> <span className="font-medium text-foreground tabular-nums">204</span> downloads
            </span>
          </div>
          <div className="flex h-12 flex-1 items-end gap-1">
            {VIEW_BARS.map((height, index) => (
              <span key={index} className={cn("flex-1 origin-bottom rounded-sm bg-foreground/25", styles.popIn)} style={{ height: `${height}%`, "--pop-delay": `${index * 0.04}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TILES = [
  { sky: "clear", height: "h-[118px]" },
  { sky: "cloud", height: "h-[78px]" },
  { sky: "flat", height: "h-[92px]" },
  { sky: "cloud", height: "h-[104px]" },
  { sky: "clear", height: "h-[70px]" },
  { sky: "flat", height: "h-[120px]" },
];

export function StorefrontRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[290px]">
        <div className="mb-2 flex items-center gap-2 text-[12px]">
          <span className="font-medium">Spring 2026</span>
          <span className="text-muted-foreground">Gallery · Published</span>
        </div>
        <div className="columns-3 gap-1.5">
          {TILES.map((tile, index) => (
            <div key={index} className="mb-1.5 overflow-hidden rounded-md border border-foreground/[0.06]">
              <Meadow sky={tile.sky} className={cn("block w-full", tile.height)} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5">
          {["Masonry", "Grid", "Justified", "Slideshow"].map((layout, index) => (
            <span key={layout} className={cn("rounded-md px-1.5 py-0.5 text-[10px]", index === 0 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {layout}
            </span>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[56px] right-0 w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="overflow-hidden rounded-lg">
          <Meadow className="block h-[92px] w-full" />
        </div>
        <div className="mt-2.5 font-medium">Spring hero — print set</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Digital download · 3 files</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">$48</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
            <ShoppingBag className="size-3" /> Add to cart
          </span>
        </div>
      </div>
      <div className="absolute right-[12px] bottom-0 flex w-[176px] items-center gap-2 rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2 text-[11px] dark:bg-surface-subtle">
        <Avatar name="Northwind" size={18} />
        <span className="min-w-0 flex-1 truncate text-foreground/85">Order #1042 · Paid</span>
        <Dot tone="emerald" />
      </div>
    </div>
  );
}
