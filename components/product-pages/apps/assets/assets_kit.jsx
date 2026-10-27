import {
  Archive,
  Aperture,
  BadgeCheck,
  Box,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  GalleryHorizontalEnd,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  MessagesSquare,
  Music,
  Plug,
  Rocket,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, LINE } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Shared pieces for the Geiger Assets tour: Cobalt Retail's Autumn lookbook, tinted placeholder photos, status marks and the app sidebar.

// Placeholder photographs drawn in foreground tints; every scene crops cleanly to any box.
export function Photo({ scene = "plinth", className }) {
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <Scene scene={scene} />
    </svg>
  );
}

function Scene({ scene }) {
  if (scene === "skyline") return <Skyline />;
  if (scene === "portrait") return <Portrait />;
  if (scene === "coat") return <Coat />;
  if (scene === "fabric") return <Fabric />;
  if (scene === "coast") return <Coast />;
  if (scene === "dusk") return <Skyline dusk />;
  return <Plinth />;
}

// A tan tote on a studio plinth, lit from above.
function Plinth() {
  return (
    <>
      <defs>
        <linearGradient id="ga-plinth-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="ga-plinth-spot" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#ga-plinth-wall)" />
      <rect width="300" height="300" fill="url(#ga-plinth-spot)" />
      <rect y="214" width="300" height="86" fill="currentColor" fillOpacity="0.08" />
      <ellipse cx="150" cy="248" rx="74" ry="8" fill="currentColor" fillOpacity="0.16" />
      <rect x="96" y="178" width="108" height="70" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="150" cy="178" rx="54" ry="9" fill="currentColor" fillOpacity="0.3" />
      <ellipse cx="150" cy="174" rx="36" ry="4" fill="currentColor" fillOpacity="0.2" />
      <path d="M116 174 L124 116 H176 L184 174 Z" fill="currentColor" fillOpacity="0.42" />
      <path d="M124 116 H176 L172 138 H128 Z" fill="currentColor" fillOpacity="0.52" />
      <path d="M134 117 C134 84 166 84 166 117" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="5" />
      <rect x="146" y="134" width="8" height="7" rx="1.5" fill="currentColor" fillOpacity="0.75" />
    </>
  );
}

const TOWERS = [
  [0, 46, 92],
  [40, 34, 128],
  [70, 42, 74],
  [108, 30, 150],
  [134, 48, 104],
  [178, 26, 168],
  [200, 44, 86],
  [240, 32, 122],
  [268, 40, 70],
];

// A city skyline over water; `dusk` dims the sky and lights the windows.
function Skyline({ dusk = false }) {
  const id = dusk ? "ga-sky-dusk" : "ga-sky-day";
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity={dusk ? 0.07 : 0.2} />
          <stop offset="1" stopColor="currentColor" stopOpacity={dusk ? 0.16 : 0.04} />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill={`url(#${id})`} />
      <circle cx={dusk ? 70 : 214} cy={dusk ? 150 : 84} r="24" fill="currentColor" fillOpacity={dusk ? 0.2 : 0.15} />
      {TOWERS.map(([x, width, height], index) => (
        <g key={x}>
          <rect x={x} y={222 - height} width={width - 3} height={height} fill="currentColor" fillOpacity={0.2 + (index % 3) * 0.06} />
          {Array.from({ length: Math.floor(height / 18) }, (_, row) =>
            Array.from({ length: Math.floor((width - 9) / 9) }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={x + 5 + col * 9}
                y={222 - height + 8 + row * 18}
                width="4"
                height="6"
                fill="currentColor"
                fillOpacity={dusk ? ((row + col + index) % 3 === 0 ? 0.6 : 0.12) : 0.14}
              />
            )),
          )}
        </g>
      ))}
      <rect y="222" width="300" height="78" fill="currentColor" fillOpacity="0.07" />
      {[236, 252, 270, 288].map((y, index) => (
        <path key={y} d={`M${20 + index * 14} ${y} h${170 - index * 30} M${210 - index * 8} ${y + 4} h${60 + index * 6}`} stroke="currentColor" strokeOpacity="0.14" strokeWidth="2" />
      ))}
    </>
  );
}

// Head-and-shoulders portrait against a soft backdrop.
function Portrait() {
  return (
    <>
      <defs>
        <radialGradient id="ga-portrait-bg" cx="0.5" cy="0.38" r="0.62">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#ga-portrait-bg)" />
      <path d="M58 300 C62 238 104 214 150 214 C196 214 238 238 242 300 Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M118 220 L150 266 L182 220" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="3" />
      <rect x="136" y="170" width="28" height="50" rx="10" fill="currentColor" fillOpacity="0.26" />
      <ellipse cx="150" cy="138" rx="36" ry="44" fill="currentColor" fillOpacity="0.34" />
      <path d="M113 140 C108 96 130 84 150 84 C172 84 194 98 188 142 C182 118 168 106 150 106 C132 106 118 118 113 140 Z" fill="currentColor" fillOpacity="0.5" />
    </>
  );
}

// A full-length look: a belted overcoat on a studio sweep.
function Coat() {
  return (
    <>
      <defs>
        <linearGradient id="ga-coat-sweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="0.75" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.11" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#ga-coat-sweep)" />
      <ellipse cx="150" cy="284" rx="62" ry="7" fill="currentColor" fillOpacity="0.16" />
      <rect x="133" y="232" width="13" height="50" rx="4" fill="currentColor" fillOpacity="0.4" />
      <rect x="154" y="232" width="13" height="50" rx="4" fill="currentColor" fillOpacity="0.4" />
      <path d="M121 92 L104 176 L113 179 L128 104 Z M179 92 L196 176 L187 179 L172 104 Z" fill="currentColor" fillOpacity="0.44" />
      <path d="M122 88 C126 80 174 80 178 88 L196 238 C170 246 130 246 104 238 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M137 84 L150 132 L163 84" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.5" />
      <path d="M112 156 H188" stroke="currentColor" strokeOpacity="0.55" strokeWidth="4" />
      <rect x="143" y="70" width="14" height="14" rx="4" fill="currentColor" fillOpacity="0.32" />
      <circle cx="150" cy="58" r="17" fill="currentColor" fillOpacity="0.38" />
    </>
  );
}

// A close crop of wool twill with a soft fold across it.
function Fabric() {
  return (
    <>
      <defs>
        <pattern id="ga-twill" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <rect width="8" height="8" fill="currentColor" fillOpacity="0.16" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        </pattern>
        <linearGradient id="ga-fold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#ga-twill)" />
      <path d="M-20 120 C 80 60, 180 220, 320 150 L320 230 C 200 290, 90 150, -20 210 Z" fill="url(#ga-fold)" />
      <path d="M40 300 C 70 250, 90 240, 120 300" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 5" />
    </>
  );
}

// A lighthouse on a headland at golden hour: Hana Ito's "Harbour light" series.
function Coast() {
  return (
    <>
      <defs>
        <linearGradient id="ga-coast-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#ga-coast-sky)" />
      <circle cx="84" cy="118" r="22" fill="currentColor" fillOpacity="0.15" />
      <path d="M245 62 L40 20 L40 104 Z" fill="currentColor" fillOpacity="0.06" />
      <rect y="170" width="300" height="130" fill="currentColor" fillOpacity="0.1" />
      {[188, 210, 236, 266].map((y, index) => (
        <path key={y} d={`M${10 + index * 6} ${y} q 20 -5 40 0 t 40 0 t 40 0`} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
      ))}
      <path d="M168 300 C 176 214, 200 170, 236 150 C 260 138, 282 140, 300 146 V300 Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M234 150 L240 74 H252 L258 150 Z" fill="currentColor" fillOpacity="0.42" />
      <rect x="238" y="94" width="16" height="9" fill="currentColor" fillOpacity="0.62" />
      <rect x="236" y="118" width="20" height="9" fill="currentColor" fillOpacity="0.62" />
      <rect x="238" y="60" width="16" height="14" rx="2" fill="currentColor" fillOpacity="0.55" />
      <path d="M234 61 L246 48 L258 61 Z" fill="currentColor" fillOpacity="0.6" />
    </>
  );
}

const FILE_GLYPHS = { PDF: FileText, Document: FileText, "3D Model": Box, Raw: Aperture, Archive: Archive, Audio: Music };

// A file that has no picture of its own: the type's glyph over a quiet tile.
export function FileGlyph({ type, ext, compact = false, className }) {
  const Icon = FILE_GLYPHS[type] ?? FileText;
  if (compact) {
    return (
      <div className={cn("flex items-center justify-center bg-foreground/[0.05]", className)}>
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 bg-foreground/[0.05]", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl border border-foreground/[0.1] bg-foreground/[0.04]">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </span>
      {ext ? <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">{ext}</span> : null}
    </div>
  );
}

// An asset's picture: a placeholder photo, or its type's glyph.
export function Thumb({ asset, compact = false, className }) {
  if (asset.scene) return <Photo scene={asset.scene} className={cn("block", className)} />;
  return <FileGlyph type={asset.type} ext={asset.name.split(".").pop()} compact={compact} className={className} />;
}

const ASSET_STATUS = {
  approved: { label: "Approved", tone: "emerald" },
  review: { label: "In Review", tone: "amber" },
  draft: { label: "Draft", tone: "neutral" },
  processing: { label: "Processing", tone: "strong" },
  archived: { label: "Archived", tone: "neutral" },
};

// The library's five statuses, as a dot and a label.
export function AssetStatus({ status = "draft", className }) {
  const meta = ASSET_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap text-foreground/80", className)}>
      {status === "processing" ? <span className={cn("size-1.5 rounded-full bg-foreground/60 text-foreground/60", styles.pulse)} /> : <Dot tone={meta.tone} />}
      {meta.label}
    </span>
  );
}

const REVIEW_STATUS = {
  "In Review": { tone: "amber", text: "text-foreground/85" },
  "Changes Requested": { tone: "amber", text: "text-amber-700 dark:text-amber-300" },
  Approved: { tone: "emerald", text: "text-emerald-700 dark:text-emerald-400" },
  Rejected: { tone: "red", text: "text-red-600 dark:text-red-400" },
  Cancelled: { tone: "neutral", text: "text-muted-foreground" },
};

// A review's status: In Review, Changes Requested, Approved, Rejected or Cancelled.
export function ReviewStatus({ status, className }) {
  const meta = REVIEW_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap", meta.text, className)}>
      <Dot tone={meta.tone} />
      {status}
    </span>
  );
}

// The Autumn lookbook folder in Cobalt Retail's library.
export const LOOKBOOK = [
  { name: "look-07-overcoat.jpg", scene: "coat", type: "Image", status: "review", size: "21.6 MB", dims: "4000 × 5000", modified: "12 min ago", downloads: 18 },
  { name: "aw26-hero-skyline.jpg", scene: "skyline", type: "Image", status: "approved", size: "18.4 MB", dims: "6000 × 4000", modified: "2h ago", downloads: 46 },
  { name: "tote-tan-plinth.jpg", scene: "plinth", type: "Image", status: "approved", size: "9.8 MB", dims: "4000 × 4000", modified: "3h ago", downloads: 31 },
  { name: "look-03-portrait.cr3", scene: "portrait", type: "Raw", status: "draft", size: "48.1 MB", dims: "6960 × 4640", modified: "Yesterday", downloads: 2 },
  { name: "fabric-wool-detail.jpg", scene: "fabric", type: "Image", status: "approved", size: "6.2 MB", dims: "3000 × 3000", modified: "Yesterday", downloads: 12 },
  { name: "look-11-overcoat.jpg", scene: "coat", type: "Image", status: "processing", size: "22.0 MB", dims: "4000 × 5000", modified: "Just now", downloads: 0 },
  { name: "aw26-lookbook.pdf", type: "PDF", status: "review", size: "32.7 MB", dims: "24 pages", modified: "Yesterday", downloads: 9 },
  { name: "aw26-hero-dusk.jpg", scene: "dusk", type: "Image", status: "approved", size: "17.9 MB", dims: "6000 × 4000", modified: "2 days ago", downloads: 27 },
  { name: "tote-tan.glb", type: "3D Model", status: "draft", size: "14.3 MB", dims: "Mesh", modified: "3 days ago", downloads: 4 },
  { name: "look-03-portrait.jpg", scene: "portrait", type: "Image", status: "approved", size: "11.4 MB", dims: "4640 × 5800", modified: "3 days ago", downloads: 22 },
  { name: "moodboard-v1.zip", type: "Archive", status: "archived", size: "212 MB", dims: "86 files", modified: "Sep 30", downloads: 6 },
  { name: "harbour-light-04.jpg", scene: "coast", type: "Image", status: "approved", size: "15.2 MB", dims: "5000 × 4000", modified: "Oct 2", downloads: 14 },
];

const SIDEBAR = [
  { title: "Assets", icon: FolderOpen, items: ["Asset Library", "Upload Center", "External Uploads", "Collections", "Folders"] },
  { title: "Media", icon: ImageIcon, items: ["Images", "Image Editing"] },
  { title: "Collaboration", icon: MessagesSquare, items: ["Shared Links", "Approvals", "Approval Pipelines"] },
  { title: "Workflows", icon: Workflow, items: ["All Workflows", "Run History"] },
  { title: "Delivery", icon: Rocket, items: ["Dynamic Images"] },
  { title: "Galleries", icon: GalleryHorizontalEnd, items: ["Gallery Builder", "Storefront", "Digital Downloads", "Orders & Invoices"] },
  { title: "Licensing", icon: BadgeCheck, items: ["Rights Inventory", "License Templates", "Issued Licenses", "Expirations & Renewals", "Revenue & Royalties"] },
  { title: "Platform", icon: Plug, items: ["Integrations", "API"] },
];

// The Assets sidebar with one domain open and one screen active.
export function AssetsSidebar({ open = "Assets", active = "Asset Library", workspace = "Cobalt Retail", className }) {
  return (
    <div className={cn("flex w-[220px] shrink-0 flex-col border-r bg-foreground/[0.015] text-[13px]", LINE, className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
        <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">{workspace.slice(0, 1)}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-4 font-medium">{workspace}</span>
          <span className="block truncate text-[11px] leading-4 text-muted-foreground">Geiger Assets</span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        {[
          ["Overview", LayoutDashboard],
          ["All Media", LayoutGrid],
        ].map(([title, Icon]) => (
          <span key={title} className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-1.5", active === title ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
            {title}
          </span>
        ))}
        {SIDEBAR.map((domain) => {
          const Icon = domain.icon;
          const isOpen = domain.title === open;
          return (
            <div key={domain.title}>
              <span className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-foreground/75">
                <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                <span className="flex-1">{domain.title}</span>
                {isOpen ? <ChevronDown className="size-3.5 text-muted-foreground" /> : <ChevronRight className="size-3.5 text-muted-foreground/70" />}
              </span>
              {isOpen ? (
                <div className={cn("my-0.5 ml-[18px] flex flex-col gap-0.5 border-l pl-2.5", LINE)}>
                  {domain.items.map((item) => (
                    <span key={item} className={cn("truncate rounded-md px-2.5 py-1.5", item === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/70")}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// A switch drawn on or off.
export function Toggle({ on = true, className }) {
  return (
    <span className={cn("relative inline-flex h-[18px] w-[30px] shrink-0 items-center rounded-full", on ? "bg-emerald-500" : "bg-foreground/15", className)}>
      <span className={cn("absolute size-[14px] rounded-full bg-white shadow-sm", on ? "left-[14px]" : "left-[2px]")} />
    </span>
  );
}

// A segmented control with one option chosen.
export function Segmented({ items, active, className }) {
  return (
    <span className={cn("inline-flex gap-0.5 rounded-lg bg-foreground/[0.05] p-0.5 text-[12px]", className)}>
      {items.map((item) => (
        <span key={item} className={cn("rounded-md px-2.5 py-1 whitespace-nowrap", item === active ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
          {item}
        </span>
      ))}
    </span>
  );
}

// A labelled form control: the label over a bordered value.
export function FieldBox({ label, children, className, valueClassName }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("flex h-8 items-center gap-2 rounded-md border border-foreground/[0.1] bg-foreground/[0.02] px-2.5 text-[12px] text-foreground/90", valueClassName)}>{children}</span>
    </div>
  );
}

// The section rail of an Assets editor screen, with one section open.
export function EditorNav({ groups, active, className }) {
  return (
    <div className={cn("flex w-[188px] shrink-0 flex-col gap-3 border-r p-3 text-[12px]", LINE, className)}>
      {groups.map((group) => (
        <div key={group.title ?? "top"} className="flex flex-col gap-0.5">
          {group.title ? <span className="px-2 pb-1 text-[11px] text-muted-foreground">{group.title}</span> : null}
          {group.items.map(({ label, icon: Icon }) => (
            <span key={label} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", label === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/75")}>
              {Icon ? <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} /> : null}
              <span className="truncate">{label}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// One KPI tile in a divided stats bar.
export function StatCell({ label, value, footer, className, children }) {
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col px-4 py-3", className)}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="mt-1 flex items-center gap-2 text-[20px] leading-7 font-medium tracking-[-0.01em] tabular-nums">
        {value}
        {children}
      </span>
      {footer ? <span className="truncate text-[11px] text-muted-foreground">{footer}</span> : null}
    </div>
  );
}

// A row of KPI tiles divided by hairlines.
export function StatsRow({ className, children }) {
  return <div className={cn("flex divide-x divide-foreground/[0.07] overflow-hidden rounded-xl border bg-foreground/[0.015]", LINE, className)}>{children}</div>;
}
