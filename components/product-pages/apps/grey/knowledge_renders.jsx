import {
  Activity,
  AlertTriangle,
  Check,
  ChevronDown,
  Database,
  Download,
  Ellipsis,
  Eye,
  FileStack,
  Files,
  Globe,
  Layers,
  ListChecks,
  Loader,
  MessageSquare,
  Package,
  Pause,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Chip, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  Badge,
  Card,
  Checkbox,
  EditorHeader,
  Field,
  FRESHNESS,
  GhostButton,
  GreySidebar,
  KindTile,
  PANEL,
  PrimaryButton,
  RUN_STATUS,
  Segmented,
  SOURCE_STATUS,
  SOURCES,
  StatusText,
  Toggle,
} from "@/components/product-pages/apps/grey/grey_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Grey's knowledge bases for Kestrel Aero: sources from every origin, ingestion settings and jobs, and the knowledge graph.

const KB_TABS = [
  { label: "Sources", icon: Files },
  { label: "Chunks", icon: Layers },
  { label: "Ingestion settings", icon: SlidersHorizontal },
  { label: "Activity", icon: Activity },
  { label: "Danger zone", icon: AlertTriangle },
];

function FilterButton({ children, className }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-foreground/[0.1] bg-background/40 px-3 text-[12px] text-foreground/80 dark:bg-foreground/[0.02]", className)}>
      {children}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}

function SearchBox({ children = "Search sources…", className }) {
  return (
    <span className={cn("flex h-8 items-center gap-2 rounded-lg border border-foreground/[0.1] bg-background/40 px-3 text-[12px] text-muted-foreground dark:bg-foreground/[0.02]", className)}>
      <Search className="size-3.5" />
      {children}
    </span>
  );
}

function SourceCell({ source }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <KindTile kind={source.kind} size={30} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground/90">{source.name}</span>
        <span className="block text-[11px] text-muted-foreground">{source.origin}</span>
      </span>
    </span>
  );
}

function AddUrlDialog({ className }) {
  return (
    <div className={cn(PANEL, "p-4 text-[12px]", className)}>
      <div className="text-[14px] font-medium">Add sources</div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Field label="Knowledge base" select>
          Maintenance manuals
        </Field>
        <Field label="Ingestion preset" select>
          Balanced
        </Field>
      </div>
      <Segmented options={["Upload", "Import", "Add URL"]} value="Add URL" className="mt-3.5 flex w-full" itemClassName="flex-1" />
      <Field label="URL" hint="Grey fetches the page and indexes its main content." mono className="mt-3.5" boxClassName="border-foreground/25">
        <Typed text="https://kestrelaero.example/bulletins" delay={1.6} />
      </Field>
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="px-2.5 text-muted-foreground">Cancel</span>
        <PrimaryButton icon={Globe}>Add URL</PrimaryButton>
      </div>
    </div>
  );
}

// The hero plane: the Maintenance manuals knowledge base with its sources, and a web page being added.
export function KnowledgeBaseWindow() {
  const rows = SOURCES.filter((source) => source.kb === "Maintenance manuals");
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="relative flex h-full">
        <GreySidebar open="Knowledge Bases" active="All Knowledge Bases" />
        <div className="flex min-w-0 flex-1 flex-col">
          <EditorHeader back="All Knowledge Bases" title="Maintenance manuals" status={<Badge tone="emerald">Active</Badge>} meta="Manuals, procedures and briefings for line and base maintenance">
            <Chip icon={SlidersHorizontal}>Balanced</Chip>
            <Chip icon={Database}>Voyage 3.5</Chip>
          </EditorHeader>
          <div className={cn("flex gap-6 border-b px-6 text-[12px]", LINE)}>
            {KB_TABS.map(({ label, icon: Icon }) => (
              <span key={label} className={cn("flex items-center gap-1.5 py-2.5", label === "Sources" ? "border-b border-foreground font-medium text-foreground" : "text-muted-foreground")}>
                <Icon className="size-3.5" strokeWidth={1.75} />
                {label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 px-6 py-3">
            <FilterButton>All kinds</FilterButton>
            <FilterButton>All origins</FilterButton>
            <SearchBox className="ml-auto w-[220px]" />
            <PrimaryButton icon={Plus} className="h-8">
              Upload
            </PrimaryButton>
          </div>
          <div className="mx-6 overflow-hidden rounded-xl border border-foreground/[0.08]">
            <div className={cn("grid grid-cols-[300px_104px_112px_minmax(0,1fr)_96px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
              <span>Source</span>
              <span>Status</span>
              <span>Freshness</span>
              <span>Size</span>
              <span className="text-right">Added</span>
            </div>
            {rows.map((source) => (
              <div key={source.name} className={cn("grid grid-cols-[300px_104px_112px_minmax(0,1fr)_96px] items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE)}>
                <SourceCell source={source} />
                <StatusText label={source.status} tone={SOURCE_STATUS[source.status]} live={source.status === "Processing"} />
                <Badge tone={FRESHNESS[source.freshness]} className="w-fit">
                  {source.freshness}
                </Badge>
                <span className="text-[12px] text-muted-foreground tabular-nums">{source.size}</span>
                <span className="text-right text-[11px] text-muted-foreground">{source.added}</span>
              </div>
            ))}
          </div>
        </div>
        <AddUrlDialog className="absolute top-[236px] right-[14px] z-[2] w-[368px]" />
      </div>
    </Window>
  );
}

// A paused frame from the ramp briefing: an A320 nose-on at the stand, with the player's scrubber.
function RampFrame({ className }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-foreground/[0.08] bg-foreground/[0.06]", className)}>
      <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-foreground" aria-hidden="true">
        <defs>
          <linearGradient id="grey-ramp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <rect width="400" height="180" fill="url(#grey-ramp-sky)" />
        <rect y="118" width="400" height="62" fill="currentColor" fillOpacity="0.09" />
        <path d="M200 180 V124" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M120 180 L170 124 M280 180 L230 124" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
        <path d="M200 66 V26" stroke="currentColor" strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" />
        <path d="M58 98 L176 90 M224 90 L342 98" stroke="currentColor" strokeOpacity="0.32" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="88" r="25" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.4" />
        <circle cx="140" cy="106" r="11" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="260" cy="106" r="11" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M200 113 V124 M186 106 V124 M214 106 V124" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M318 120 v-34 l14 -8 v42" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.25" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-linear-to-t from-background/80 to-transparent px-3 pt-6 pb-2.5 text-[11px] text-foreground/85">
        <Pause className="size-3.5" />
        <span className="tabular-nums">08:14 / 24:18</span>
        <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/20">
          <span className={cn("absolute inset-y-0 left-0 w-[34%] origin-left rounded-full bg-foreground", styles.fill)} />
        </span>
      </div>
    </div>
  );
}

function MetaRow({ label, children }) {
  return (
    <div className={cn("flex items-center justify-between border-b py-1.5 last:border-b-0", LINE)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/90 tabular-nums">{children}</span>
    </div>
  );
}

const MENTIONED = ["Post de-icing check", "Stand 14", "Type II fluid", "Elena Rossi", "Pushback"];

function SourceSheet({ className }) {
  const source = SOURCES.find((row) => row.name === "Ramp safety briefing.mp4");
  return (
    <div className={cn(PANEL, "flex flex-col overflow-hidden text-[12px]", className)}>
      <div className={cn("border-b px-4 py-3.5", LINE)}>
        <div className="flex items-center gap-3">
          <KindTile kind={source.kind} size={36} />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium">{source.name}</div>
            <div className="text-muted-foreground">Video · Assets</div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusText label="Ready" tone="emerald" />
          <Badge tone="emerald">Verified</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-3.5 p-4">
        <div>
          <MonoLabel>Video</MonoLabel>
          <RampFrame className="mt-1.5 h-[150px]" />
        </div>
        <div>
          <MonoLabel>Metadata</MonoLabel>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 rounded-lg border border-foreground/[0.08] px-3">
            <MetaRow label="Size">24:18</MetaRow>
            <MetaRow label="Chunks">38</MetaRow>
            <MetaRow label="Tokens">6,912</MetaRow>
            <MetaRow label="Review due">12 Jan 2027</MetaRow>
          </div>
        </div>
        <div>
          <MonoLabel>Mentioned entities</MonoLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MENTIONED.map((entity, index) => (
              <Badge key={entity} className={styles.popIn} style={{ "--pop-delay": `${0.5 + index * 0.1}s` }}>
                {entity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("flex items-center gap-1.5 border-t px-4 py-3", LINE)}>
        <GhostButton icon={Download}>Download</GhostButton>
        <GhostButton icon={RotateCw}>Re-ingest</GhostButton>
        <GhostButton icon={ShieldCheck}>Mark verified</GhostButton>
      </div>
    </div>
  );
}

// Section stage: every source across the knowledge bases, with the ramp briefing open in its sheet.
export function SourcesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 w-[620px] opacity-90">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <FileStack className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Sources</span>
          <span className="text-muted-foreground">Kestrel Aero</span>
          <PrimaryButton icon={Plus} className="ml-auto">
            Upload
          </PrimaryButton>
        </div>
        <div className="flex items-center gap-2 px-5 py-3">
          <FilterButton>All kinds</FilterButton>
          <FilterButton>All origins</FilterButton>
          <FilterButton>All knowledge bases</FilterButton>
        </div>
        <div className={cn("grid grid-cols-[minmax(0,1fr)_96px_104px_132px] gap-3 border-y bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Source</span>
          <span>Status</span>
          <span>Freshness</span>
          <span>Knowledge base</span>
        </div>
        {SOURCES.map((source) => (
          <div key={source.name} className={cn("grid grid-cols-[minmax(0,1fr)_96px_104px_132px] items-center gap-3 border-b px-5 py-2 last:border-b-0", LINE, source.kind === "Video" && "bg-foreground/[0.04]")}>
            <SourceCell source={source} />
            <StatusText label={source.status} tone={SOURCE_STATUS[source.status]} live={source.status === "Processing"} />
            <StatusText label={source.freshness} tone={FRESHNESS[source.freshness]} />
            <span className="truncate text-[12px] text-muted-foreground">{source.kb}</span>
          </div>
        ))}
      </Window>
      <SourceSheet className={cn("absolute top-[20px] left-[540px] z-[2] w-[440px]", styles.float)} />
    </div>
  );
}

const IMPORTS = [
  {
    app: "assets",
    title: "Assets",
    items: [
      ["Ramp safety briefing.mp4", true, 1],
      ["Hangar 2 layout.png", true, 2],
      ["Cabin layout A320.pdf", false, 3],
    ],
  },
  {
    app: "notes",
    title: "Notes",
    items: [
      ["Engine run-up checklist", true, 4],
      ["Winter operations board", false, 5],
    ],
  },
];

// Cell: the Import tab, with files from Geiger Assets and boards from Geiger Notes ticked for ingestion.
export function ImportRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[440px] p-4 text-[12px]")}>
      <Segmented options={["Upload", "Import", "Add URL"]} value="Import" className="flex w-full" itemClassName="flex-1" />
      <div className="mt-3.5 flex flex-col gap-3">
        {IMPORTS.map((group) => (
          <div key={group.title}>
            <div className="mb-1.5 flex items-center gap-2 font-medium text-foreground/85">
              <AppMark id={group.app} size={18} />
              {group.title}
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map(([name, checked, order]) => (
                <span
                  key={name}
                  className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-1", checked ? "border-foreground/[0.14] bg-foreground/[0.04]" : "border-foreground/[0.07]", styles.popIn)}
                  style={{ "--pop-delay": `${0.2 + order * 0.1}s` }}
                >
                  <Checkbox checked={checked} />
                  <span className={checked ? "text-foreground/90" : "text-muted-foreground"}>{name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex items-center justify-between">
        <span className="text-muted-foreground">3 selected</span>
        <PrimaryButton icon={Package}>Import selected</PrimaryButton>
      </div>
    </div>
  );
}

const UPLOADS = [
  { name: "APU fault isolation.pdf", kind: "Document", detail: "6.1 MB · Document · 64 pages" },
  { name: "Borescope inspection.mp4", kind: "Video", detail: "148 MB · Video · 12:40" },
  { name: "Wheel and brake change.pptx", kind: "Document", detail: "9.4 MB · Document · 22 pages" },
];

// Cell: the Upload tab sizing up each file (its kind, pages or running time) before ingestion starts.
export function UploadRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[440px] p-4 text-[12px]")}>
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-foreground/20 px-4 py-4 text-center">
        <Upload className="size-4 text-muted-foreground" />
        <span className="font-medium text-foreground/85">Drag files here or click to browse</span>
        <span className="text-[11px] text-muted-foreground">PDF, images, audio, video, text, or office documents.</span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {UPLOADS.map((file, index) => (
          <div key={file.name} className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
            <KindTile kind={file.kind} size={26} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground/90">{file.name}</div>
              <div className="text-[11px] text-muted-foreground">{file.detail}</div>
            </div>
          </div>
        ))}
        <div className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": "0.65s" }}>
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-lg border border-foreground/[0.08]">
            <Loader className="size-3.5 text-muted-foreground" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-foreground/90">Tyre pressure log.xlsx</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              4.2 MB · Analyzing…
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className={cn("absolute inset-y-0 left-0 w-[64%] origin-left rounded-full bg-foreground/60", styles.fill)} style={{ "--fill-delay": "0.8s" }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deterministic waveform heights for a forty-minute recording.
const WAVE = Array.from({ length: 64 }, (_, index) => 0.25 + Math.abs(Math.sin(index * 0.7) * 0.5 + Math.sin(index * 0.23) * 0.25));

const TRANSCRIPT = [
  { at: "00:00 – 00:45", text: "Handover for the night shift. Stand 14 is still waiting on the left landing light, the part is due at six." },
  { at: "00:45 – 01:30", text: "The APU on the second aircraft faulted on start and cleared on the second attempt. It's written up in the tech log.", active: true },
  { at: "01:30 – 02:15", text: "De-icing rig two is back in service. Elena signed off the hose repair this afternoon." },
];

// Cell: a shift handover recording, transcribed into time-stamped passages.
export function TranscriptRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.08] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2.5">
        <KindTile kind="Audio" size={28} />
        <span className="font-medium">Night shift handover.m4a</span>
        <span className="ml-auto text-muted-foreground tabular-nums">41:05</span>
      </div>
      <div className="mt-3 flex h-8 items-center gap-[2px]">
        {WAVE.map((height, index) => (
          <span key={index} className={cn("flex-1 rounded-full", index < 22 ? "bg-foreground/60" : "bg-foreground/15")} style={{ height: `${Math.min(1, height) * 100}%` }} />
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {TRANSCRIPT.map((line, index) => (
          <div
            key={line.at}
            className={cn("rounded-lg border px-3 py-2", line.active ? "border-foreground/20 bg-foreground/[0.05]" : "border-foreground/[0.07]", styles.popIn)}
            style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}
          >
            <span className="font-mono text-[10.5px] text-muted-foreground">{line.at}</span>
            <p className="mt-0.5 leading-[1.45] text-foreground/85">{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// A floor plan of Hangar 2: two bays with aircraft outlines, the tool crib and the office.
function HangarPlan({ className }) {
  const aircraft = (x) => (
    <g transform={`translate(${x} 70)`} fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.4">
      <rect x="-4" y="0" width="8" height="70" rx="4" />
      <path d="M-4 30 L-34 42 L-34 46 L-4 42 Z M4 30 L34 42 L34 46 L4 42 Z M-3 62 L-12 68 L-12 70 L-3 68 Z M3 62 L12 68 L12 70 L3 68 Z" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 180" className={cn("text-foreground", className)} aria-hidden="true">
      <rect x="6" y="6" width="188" height="168" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
      <rect x="6" y="6" width="58" height="34" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="146" y="6" width="48" height="34" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M100 48 V174" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="4 4" />
      <path d="M30 174 H170" stroke="var(--background)" strokeWidth="3" />
      <path d="M30 174 H170" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 3" />
      {aircraft(53)}
      {aircraft(147)}
      <text x="35" y="27" textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="8" fontFamily="var(--font-mono, monospace)">
        CRIB
      </text>
      <text x="170" y="27" textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="8" fontFamily="var(--font-mono, monospace)">
        OFFICE
      </text>
      <text x="53" y="60" textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="8" fontFamily="var(--font-mono, monospace)">
        BAY 1
      </text>
      <text x="147" y="60" textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="8" fontFamily="var(--font-mono, monospace)">
        BAY 2
      </text>
    </svg>
  );
}

// Cell: an image source and the caption Grey wrote for it, which is what search reads.
export function CaptionRender() {
  return (
    <div className="mx-auto flex w-[460px] items-start gap-4">
      <div className="w-[190px] shrink-0">
        <div className="rounded-xl border border-foreground/[0.08] bg-surface-card p-2 dark:bg-surface-subtle">
          <HangarPlan className="h-auto w-full" />
        </div>
        <div className="mt-2 flex items-center gap-2 px-1 text-[12px]">
          <KindTile kind="Image" size={22} />
          <span className="truncate text-foreground/85">Hangar 2 layout.png</span>
        </div>
      </div>
      <div className={cn(PANEL, "mt-6 min-w-0 flex-1 p-3.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="flex items-center justify-between">
          <MonoLabel>Chunk 1 · Caption</MonoLabel>
          <span className="text-[11px] text-muted-foreground tabular-nums">58 tokens</span>
        </div>
        <p className="mt-2 leading-[1.5] text-foreground/90">
          Floor plan of Hangar 2: two aircraft bays side by side, a tool crib in the north-west corner, an office in the north-east corner and the main doors along the south wall.
        </p>
        <div className={cn("mt-3 flex items-center gap-1.5 border-t pt-2.5 text-[11px] text-muted-foreground", LINE)}>
          <Search className="size-3" /> Found by “where is the tool crib in hangar 2”
        </div>
      </div>
    </div>
  );
}

const JOBS = [
  { source: "Fleet schedule Q4.xlsx", tier: "Balanced", stage: "Embed", progress: 72, status: "Running" },
  { source: "Service bulletin index", tier: "Balanced", stage: "Parse", progress: 0, status: "Queued" },
  { source: "Night shift handover.m4a", tier: "Balanced", stage: "Graph", progress: 100, status: "Succeeded" },
  { source: "De-icing procedure.docx", tier: "Custom", stage: "Graph", progress: 100, status: "Succeeded" },
  { source: "Supplier catalogue", tier: "Fast", stage: "Parse", progress: 12, status: "Failed" },
  { source: "A320 line maintenance manual.pdf", tier: "Balanced", stage: "Graph", progress: 100, status: "Succeeded" },
];

function JobsWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Ingestion Jobs</span>
      </div>
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          ["Queued", "1"],
          ["Running", "1"],
          ["Failed (7d)", "1"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-5 py-3", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[18px] font-medium tracking-[-0.01em] tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1fr)_92px_52px_96px_76px] gap-3 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Source</span>
        <span>Status</span>
        <span>Stage</span>
        <span>Progress</span>
        <span>Preset tier</span>
      </div>
      {JOBS.map((job) => (
        <div key={job.source} className={cn("grid grid-cols-[minmax(0,1fr)_92px_52px_96px_76px] items-center gap-3 border-b px-5 py-2.5 text-[12px] last:border-b-0", LINE)}>
          <span className="truncate text-foreground/90">{job.source}</span>
          <StatusText label={job.status} tone={RUN_STATUS[job.status]} live={job.status === "Running"} />
          <span className="text-muted-foreground">{job.stage}</span>
          <span className="flex items-center gap-2">
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span
                className={cn("absolute inset-y-0 left-0 origin-left rounded-full", job.status === "Failed" ? "bg-red-500" : job.status === "Running" ? "bg-amber-500" : "bg-foreground/40", styles.fill)}
                style={{ width: `${job.progress}%` }}
              />
            </span>
            <span className="w-7 text-right text-[11px] text-muted-foreground tabular-nums">{job.progress}%</span>
          </span>
          <span className="text-muted-foreground">{job.tier}</span>
        </div>
      ))}
    </Window>
  );
}

const PRESET_CARDS = [
  { name: "Fast", body: "The quickest tier, plain text extraction." },
  { name: "Balanced", body: "Good for most documents. The default.", active: true },
  { name: "Auto", body: "Picks the right tier for each file." },
  { name: "Manuals by page", body: "Your own ingestion settings.", custom: true },
];

function SettingLine({ title, body, on }) {
  return (
    <div className={cn("flex items-center gap-3 border-b py-2.5 last:border-b-0", LINE)}>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-foreground/90">{title}</div>
        <div className="truncate text-[11px] text-muted-foreground">{body}</div>
      </div>
      <Toggle on={on} />
    </div>
  );
}

function IngestionSettingsWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Database className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Maintenance manuals</span>
        <span className="text-muted-foreground">Ingestion settings</span>
        <span className="ml-auto flex items-center gap-2">
          <GhostButton icon={RefreshCcw}>Re-ingest all</GhostButton>
          <PrimaryButton>Save</PrimaryButton>
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <Card title="Preset" description="Pick a tier, then fine-tune under Advanced." bodyClassName="p-2.5">
          <div className="grid grid-cols-4 gap-2">
            {PRESET_CARDS.map((preset) => (
              <div key={preset.name} className={cn("rounded-lg border px-2.5 py-2", preset.active ? "border-foreground/40 bg-foreground/[0.05]" : "border-foreground/[0.08]")}>
                <div className="truncate text-[12px] font-medium">{preset.name}</div>
                <div className="mt-0.5 line-clamp-2 text-[10.5px] leading-[1.35] text-muted-foreground">{preset.body}</div>
                {preset.custom ? <Badge className="mt-1.5">Custom</Badge> : null}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Settings" description="Chunking, media and graph options, under Advanced.">
          <div className="grid grid-cols-3 gap-2.5">
            <Field label="Strategy" select boxClassName="border-foreground/25">
              Recursive
            </Field>
            <Field label="Chunk size (tokens)">512</Field>
            <Field label="Overlap (tokens)">64</Field>
          </div>
          <div className="mt-1.5">
            <SettingLine title="Heading breadcrumbs" body="Prefix each chunk with its section heading trail." on />
            <SettingLine title="Transcribe" body="Generate a transcript for audio and video sources." on />
            <SettingLine title="Extract entities and relations" body="Feed this knowledge base into the project's knowledge graph." on />
          </div>
        </Card>
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11.5px] leading-[1.45] text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-px size-3.5 shrink-0" />
          Unsaved changes only apply to sources ingested after you save. Use “Re-ingest all” to apply them to existing sources.
        </div>
      </div>
    </Window>
  );
}

// Section stage: the job queue behind, a knowledge base's preset and chunking settings in front.
export function IngestionStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <JobsWindow className="absolute top-[48px] left-0 w-[600px] opacity-90" />
      <IngestionSettingsWindow className={cn("absolute top-0 left-[440px] z-[2] w-[560px]", styles.float)} />
    </div>
  );
}

// One manual page, its lines laid out as headings and paragraphs, cut into overlapping chunks.
const PAGE_LINES = [
  { y: 16, w: 58, heading: true },
  { y: 34, w: 92 },
  { y: 44, w: 88 },
  { y: 54, w: 95 },
  { y: 64, w: 70 },
  { y: 84, w: 46, heading: true },
  { y: 102, w: 90 },
  { y: 112, w: 94 },
  { y: 122, w: 82 },
  { y: 132, w: 91 },
  { y: 142, w: 60 },
  { y: 162, w: 52, heading: true },
  { y: 180, w: 93 },
  { y: 190, w: 86 },
  { y: 200, w: 74 },
];

const CHUNKS = [
  { top: 8, height: 66, label: "Chunk 40", tokens: 506, crumb: "12 Servicing › 12-30 Cold weather" },
  { top: 58, height: 96, label: "Chunk 41", tokens: 498, crumb: "12-30 Cold weather › De-icing", active: true },
  { top: 138, height: 74, label: "Chunk 42", tokens: 471, crumb: "12-30 Cold weather › Post de-icing check" },
];

// Cell: the four chunking strategies, with one page cut into overlapping chunks and their heading trails.
export function ChunkingRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <Segmented options={["Recursive", "Fixed size", "Semantic", "Page"]} value="Recursive" className="flex w-full" itemClassName="flex-1" />
      <div className="mt-3.5 flex gap-4">
        <div className="relative h-[220px] w-[170px] shrink-0 rounded-lg border border-foreground/[0.1] bg-surface-card px-3 dark:bg-surface-subtle">
          {PAGE_LINES.map((line) => (
            <span key={line.y} className={cn("absolute left-3 h-[5px] rounded-full", line.heading ? "bg-foreground/40" : "bg-foreground/[0.12]")} style={{ top: line.y, width: `${line.w * 1.46}px` }} />
          ))}
          {CHUNKS.map((chunk, index) => (
            <span
              key={chunk.label}
              className={cn("absolute inset-x-1 rounded-md border", chunk.active ? "border-foreground/60 bg-foreground/[0.06]" : "border-dashed border-foreground/30", styles.popIn)}
              style={{ top: chunk.top, height: chunk.height, "--pop-delay": `${0.3 + index * 0.2}s` }}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {CHUNKS.map((chunk, index) => (
            <div
              key={chunk.label}
              className={cn("rounded-lg border px-3 py-2", chunk.active ? "border-foreground/25 bg-foreground/[0.05]" : "border-foreground/[0.08]", styles.popIn)}
              style={{ "--pop-delay": `${0.3 + index * 0.2}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground/90">{chunk.label}</span>
                <span className="text-[11px] text-muted-foreground tabular-nums">{chunk.tokens} tokens</span>
              </div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{chunk.crumb}</div>
            </div>
          ))}
          <div className="mt-auto font-mono text-[11px] text-muted-foreground">512 tokens · 64 overlap</div>
        </div>
      </div>
    </div>
  );
}

const REVIEW_ROWS = [
  { name: "A320 line maintenance manual.pdf", kind: "Document", freshness: "Verified", note: "Verified 3 weeks ago" },
  { name: "Crew rostering policy", kind: "Web page", freshness: "Stale", note: "Review was due 2 weeks ago", open: true },
  { name: "De-icing procedure.docx", kind: "Document", freshness: "Review due", note: "Review due in 5 days" },
  { name: "Engine run-up checklist", kind: "Note", freshness: "Not verified", note: "Never verified" },
];

const ROW_ACTIONS = [
  { label: "Open", icon: Eye },
  { label: "Re-ingest", icon: RotateCw },
  { label: "Mark verified", icon: ShieldCheck, active: true },
  { label: "Owner & review date", icon: Pencil },
  { label: "Download", icon: Download },
];

// Cell: freshness on every source, with the row menu open on a stale page to mark it verified.
export function FreshnessReviewRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[12px]">
      <div className="flex flex-col gap-1.5">
        {REVIEW_ROWS.map((row) => (
          <div key={row.name} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2", row.open ? "border-foreground/20 bg-foreground/[0.04]" : "border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle")}>
            <KindTile kind={row.kind} size={26} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground/90">{row.name}</div>
              <div className="text-[11px] text-muted-foreground">{row.note}</div>
            </div>
            <Badge tone={FRESHNESS[row.freshness]}>{row.freshness}</Badge>
            <Ellipsis className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className={cn(PANEL, "absolute top-[104px] right-[6px] z-[2] w-[200px] p-1.5", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        {ROW_ACTIONS.map(({ label, icon: Icon, active }) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <Icon className="size-3.5 text-muted-foreground" />
            {label}
          </div>
        ))}
        <div className={cn("my-1 border-t", LINE)} />
        <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-red-600 dark:text-red-400">
          <Trash2 className="size-3.5" />
          Delete
        </div>
      </div>
    </div>
  );
}

// Entity glyphs: one inner mark per type, so the graph reads without colour.
function TypeGlyph({ type, x, y, r, opacity = 0.8 }) {
  const s = Math.max(3, r * 0.42);
  if (type === "Person") return <circle cx={x} cy={y} r={s} fill="currentColor" fillOpacity={opacity} />;
  if (type === "Organization") return <rect x={x - s} y={y - s} width={s * 2} height={s * 2} rx="1.5" fill="currentColor" fillOpacity={opacity} />;
  if (type === "Product") return <path d={`M${x} ${y - s * 1.2} L${x + s * 1.2} ${y} L${x} ${y + s * 1.2} L${x - s * 1.2} ${y} Z`} fill="currentColor" fillOpacity={opacity} />;
  if (type === "Location") return <circle cx={x} cy={y} r={s} fill="none" stroke="currentColor" strokeOpacity={opacity} strokeWidth="1.75" />;
  if (type === "Document")
    return <path d={`M${x - s} ${y - s * 0.55} H${x + s} M${x - s} ${y} H${x + s} M${x - s} ${y + s * 0.55} H${x + s * 0.4}`} stroke="currentColor" strokeOpacity={opacity} strokeWidth="1.5" strokeLinecap="round" />;
  return <circle cx={x} cy={y} r={s} fill="currentColor" fillOpacity={opacity * 0.5} />;
}

const LEGEND = ["Person", "Organization", "Product", "Location", "Concept", "Document"];

const GRAPH_NODES = [
  { id: "check", x: 300, y: 250, r: 27, type: "Concept", label: "Post de-icing check", focus: true },
  { id: "deicing", x: 160, y: 160, r: 20, type: "Concept", label: "De-icing" },
  { id: "proc", x: 440, y: 130, r: 17, type: "Document", label: "De-icing procedure.docx" },
  { id: "brief", x: 470, y: 330, r: 16, type: "Document", label: "Ramp safety briefing.mp4" },
  { id: "manual", x: 540, y: 220, r: 15, type: "Document", label: "A320 line maintenance manual" },
  { id: "stand", x: 130, y: 370, r: 15, type: "Location", label: "Stand 14" },
  { id: "fluid", x: 60, y: 240, r: 13, type: "Product", label: "Type II fluid" },
  { id: "elena", x: 320, y: 430, r: 15, type: "Person", label: "Elena Rossi" },
  { id: "line", x: 170, y: 490, r: 17, type: "Organization", label: "Line maintenance" },
  { id: "nathan", x: 40, y: 430, r: 12, type: "Person", label: "Nathan Okafor" },
  { id: "a320", x: 560, y: 450, r: 14, type: "Product", label: "A320" },
  { id: "hangar", x: 40, y: 110, r: 11, type: "Location", label: "Hangar 2" },
  { id: "n1", x: 280, y: 60, r: 9, type: "Concept" },
  { id: "n2", x: 600, y: 90, r: 9, type: "Document" },
  { id: "n3", x: 470, y: 520, r: 8, type: "Person" },
  { id: "n4", x: 380, y: 560, r: 8, type: "Concept" },
  { id: "n5", x: 620, y: 330, r: 8, type: "Location" },
  { id: "n6", x: 30, y: 540, r: 8, type: "Person" },
];

const GRAPH_EDGES = [
  ["check", "deicing", "part_of", 0.5],
  ["check", "proc", "mentions", 0.5],
  ["check", "brief", "mentions", 0.62],
  ["check", "manual", "mentions", 0.5],
  ["check", "stand", "located_in", 0.62],
  ["deicing", "fluid"],
  ["deicing", "proc"],
  ["deicing", "hangar"],
  ["elena", "line"],
  ["nathan", "line"],
  ["elena", "proc"],
  ["stand", "line"],
  ["manual", "a320"],
  ["brief", "a320"],
  ["deicing", "n1"],
  ["proc", "n2"],
  ["a320", "n3"],
  ["elena", "n4"],
  ["manual", "n5"],
  ["line", "n6"],
];

const GRAPH_BY_ID = Object.fromEntries(GRAPH_NODES.map((node) => [node.id, node]));

function KestrelGraph() {
  return (
    <svg viewBox="0 0 660 590" className="h-[590px] w-[660px] overflow-visible text-foreground" aria-hidden="true">
      {GRAPH_EDGES.map(([from, to, label]) => {
        const a = GRAPH_BY_ID[from];
        const b = GRAPH_BY_ID[to];
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            strokeOpacity={label ? 0.4 : 0.13}
            strokeWidth={label ? 1.25 : 1}
            className={label ? styles.flow : undefined}
          />
        );
      })}
      {GRAPH_EDGES.filter(([, , label]) => label).map(([from, to, label, t]) => {
        const a = GRAPH_BY_ID[from];
        const b = GRAPH_BY_ID[to];
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        return (
          <g key={`label-${from}-${to}`}>
            <rect x={x - label.length * 3.1 - 5} y={y - 8} width={label.length * 6.2 + 10} height="16" rx="4" fill="var(--background)" stroke="currentColor" strokeOpacity="0.15" />
            <text x={x} y={y + 3.5} textAnchor="middle" fill="currentColor" fillOpacity="0.7" fontSize="10" fontFamily="var(--font-mono, monospace)">
              {label}
            </text>
          </g>
        );
      })}
      {GRAPH_NODES.map((node) => (
        <g key={node.id}>
          {node.focus ? <circle cx={node.x} cy={node.y} r={node.r + 14} fill="currentColor" fillOpacity="0.07" /> : null}
          <circle cx={node.x} cy={node.y} r={node.r} fill="var(--background)" stroke="currentColor" strokeOpacity={node.focus ? 0.9 : 0.3} strokeWidth={node.focus ? 1.5 : 1} />
          <TypeGlyph type={node.type} x={node.x} y={node.y} r={node.r} opacity={node.focus ? 0.9 : node.label ? 0.55 : 0.3} />
          {node.label ? (
            <text x={node.x} y={node.y + node.r + 15} textAnchor="middle" fill="currentColor" fillOpacity={node.focus ? 0.95 : 0.62} fontSize={node.focus ? 13 : 11.5} fontWeight={node.focus ? 500 : 400}>
              {node.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

const ENTITY_RELATIONS = [
  ["→", "part_of", "De-icing"],
  ["→", "located_in", "Stand 14"],
  ["←", "mentions", "De-icing procedure.docx"],
  ["←", "mentions", "Ramp safety briefing.mp4"],
];

const ENTITY_MENTIONS = [
  ["De-icing procedure.docx", "Document"],
  ["Ramp safety briefing.mp4", "Video"],
  ["A320 line maintenance manual.pdf", "Document"],
];

function EntitySheet({ className }) {
  return (
    <div className={cn("flex flex-col text-[12px]", className)}>
      <div className={cn("border-b px-4 py-3.5", LINE)}>
        <div className="flex items-center gap-2">
          <span className="truncate text-[15px] font-medium tracking-[-0.01em]">Post de-icing check</span>
          <Badge>Concept</Badge>
        </div>
        <p className="mt-1 leading-[1.45] text-muted-foreground">The walk-round of the wings, tail and engine intakes after de-icing, signed off before the aircraft is dispatched.</p>
      </div>
      <div className="flex flex-col gap-3.5 px-4 py-3.5">
        <div>
          <MonoLabel>Aliases</MonoLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge>Post-de-icing inspection</Badge>
            <Badge>Clean aircraft check</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Badge>Grey</Badge>
          Confidence 92%
        </div>
        <div>
          <MonoLabel>Relations</MonoLabel>
          <div className="mt-1.5 flex flex-col gap-1">
            {ENTITY_RELATIONS.map(([arrow, type, target], index) => (
              <div key={target} className={cn("truncate rounded-lg border border-foreground/[0.08] px-2.5 py-1.5", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
                <span className="text-muted-foreground">
                  {arrow} {type}
                </span>{" "}
                <span className="text-foreground/90">{target}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <MonoLabel>Mentioned in</MonoLabel>
          <div className="mt-1.5 flex flex-col gap-1">
            {ENTITY_MENTIONS.map(([name, kind]) => (
              <div key={name} className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-1.5">
                <KindTile kind={kind} size={20} className="rounded-md" />
                <span className="truncate text-foreground/85">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("mt-auto flex items-center justify-between border-t px-4 py-3", LINE)}>
        <GhostButton icon={MessageSquare}>Ask about this</GhostButton>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Pencil className="size-3.5" /> Edit
        </span>
      </div>
    </div>
  );
}

// Section stage: the Graph Explorer over Kestrel's sources, one entity open with its relations and mentions.
export function GraphExplorerStage() {
  return (
    <Window className="h-[640px] w-[1000px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <Waypoints className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Graph Explorer</span>
        <span className="text-muted-foreground">218 entities · 342 relations</span>
        <span className="ml-auto flex items-center gap-2">
          <Segmented options={["2D", "3D"]} value="2D" />
          <FilterButton className="h-7">All knowledge bases</FilterButton>
          <SearchBox className="h-7 w-[170px]">Search entities…</SearchBox>
        </span>
      </div>
      <div className="relative flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 overflow-hidden" style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1.2px)", backgroundSize: "18px 18px" }}>
          <div className="absolute top-3 left-4">
            <KestrelGraph />
          </div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-x-3.5 gap-y-1.5 rounded-lg border border-foreground/[0.08] bg-background/80 px-3 py-2 text-[11px] text-muted-foreground backdrop-blur">
            {LEGEND.map((type) => (
              <span key={type} className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="size-3.5 text-foreground" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeOpacity="0.3" />
                  <TypeGlyph type={type} x={8} y={8} r={7} opacity={0.75} />
                </svg>
                {type}
              </span>
            ))}
          </div>
        </div>
        <EntitySheet className={cn("w-[320px] shrink-0 border-l bg-surface-card dark:bg-surface-subtle", LINE)} />
      </div>
    </Window>
  );
}

const DUPLICATES = [
  { name: "Hangar 2", aka: "", keep: true },
  { name: "Hangar Two", aka: "" },
  { name: "Hgr 2", aka: "aka Hangar No. 2" },
];

// Cell: three names for one hangar, merged into the one that stays.
export function MergeRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[440px] p-4 text-[12px]")}>
      <div className="text-[14px] font-medium">Merge duplicates</div>
      <p className="mt-1 leading-[1.45] text-muted-foreground">Choose which entity stays. The others are merged into it: their names become aliases, and their relations and mentions move over.</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {DUPLICATES.map((entity) => (
          <div key={entity.name} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2", entity.keep ? "border-foreground/40 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground/90">{entity.name}</div>
              {entity.aka ? <div className="text-[11px] text-muted-foreground">{entity.aka}</div> : null}
            </div>
            {entity.keep ? (
              <Badge tone="emerald">
                <Check className="size-3" strokeWidth={2.5} /> Keep
              </Badge>
            ) : null}
          </div>
        ))}
      </div>
      <div className={cn("mt-3 rounded-lg border border-foreground/[0.08] p-2.5", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <MonoLabel>Aliases after merge</MonoLabel>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {["Hangar Two", "Hgr 2", "Hangar No. 2"].map((alias) => (
            <Badge key={alias}>{alias}</Badge>
          ))}
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-end gap-2">
        <span className="px-2.5 text-muted-foreground">Cancel</span>
        <PrimaryButton>Merge 2 into Hangar 2</PrimaryButton>
      </div>
    </div>
  );
}

const ENTITY_TYPES = [
  ["Person", 64],
  ["Organization", 12],
  ["Product", 41],
  ["Location", 37],
  ["Concept", 96],
  ["Document", 214],
];

const RELATION_TYPES = [
  ["works_at", 58],
  ["part_of", 133],
  ["mentions", 402],
  ["related_to", 187],
  ["located_in", 46],
  ["created", 29],
];

// Cell: the ontology's entity and relation types, with a new type being added.
export function OntologyRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-3 text-[12px]">
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card p-1.5 dark:bg-surface-subtle">
        <div className="px-2.5 pt-1.5 pb-1">
          <MonoLabel>Entity types</MonoLabel>
        </div>
        {ENTITY_TYPES.map(([type, count]) => (
          <div key={type} className="flex items-center gap-2 rounded-md px-2.5 py-1.5">
            <svg viewBox="0 0 16 16" className="size-3.5 text-foreground" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeOpacity="0.3" />
              <TypeGlyph type={type} x={8} y={8} r={7} opacity={0.75} />
            </svg>
            <span className="text-foreground/85">{type}</span>
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{count}</span>
          </div>
        ))}
        <div className="mx-1 mt-1 flex h-7 items-center gap-2 rounded-md border border-foreground/25 px-2">
          <Plus className="size-3.5 text-muted-foreground" />
          <Typed text="Aircraft" delay={1.4} className="text-foreground" />
        </div>
      </div>
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card p-1.5 dark:bg-surface-subtle">
        <div className="px-2.5 pt-1.5 pb-1">
          <MonoLabel>Relation types</MonoLabel>
        </div>
        {RELATION_TYPES.map(([type, count], index) => (
          <div key={type} className="flex items-center gap-2 rounded-md px-2.5 py-1.5">
            <span className="h-px w-3.5 bg-foreground/50" />
            <span className="font-mono text-[11.5px] text-foreground/85">{type}</span>
            <span className="relative ml-auto h-1 w-10 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("absolute inset-y-0 left-0 origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${Math.min(100, (count / 402) * 100)}%`, "--fill-delay": `${0.3 + index * 0.1}s` }} />
            </span>
            <span className="w-7 text-right text-[11px] text-muted-foreground tabular-nums">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
