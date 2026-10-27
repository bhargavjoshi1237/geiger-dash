import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Crop,
  Download,
  FolderOpen,
  Globe,
  Hand,
  HardDrive,
  History,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  List,
  Lock,
  MousePointer2,
  Paintbrush,
  Pipette,
  Plus,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Square,
  SquarePen,
  Tag,
  Terminal,
  Type,
  Upload,
  UploadCloud,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  AssetStatus,
  AssetsSidebar,
  EditorNav,
  FieldBox,
  LOOKBOOK,
  Photo,
  Segmented,
  StatCell,
  StatsRow,
  Thumb,
  Toggle,
} from "@/components/product-pages/apps/assets/assets_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Assets library tour: Cobalt Retail's Autumn lookbook in the library, the image editor, delivery URLs and the REST API.

function GridTile({ asset, selected }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-foreground/[0.02]", selected ? "border-foreground/40 ring-2 ring-foreground/15" : "border-foreground/[0.08]")}>
      <Thumb asset={asset} className="h-[112px] w-full" />
      <div className="px-2.5 py-2">
        <div className="truncate text-[12px] font-medium text-foreground/90">{asset.name}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <AssetStatus status={asset.status} className="text-[11px]" />
          <span className="text-[11px] text-muted-foreground">{asset.type}</span>
        </div>
      </div>
    </div>
  );
}

function QuickView() {
  const asset = LOOKBOOK[0];
  return (
    <div className={cn("flex w-[290px] shrink-0 flex-col gap-4 border-l p-5", LINE)}>
      <div className="overflow-hidden rounded-lg border border-foreground/[0.08]">
        <Photo scene="coat" className="block h-[220px] w-full" />
      </div>
      <div>
        <div className="truncate text-[15px] font-medium tracking-[-0.01em]">{asset.name}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">Autumn lookbook · Image · {asset.size}</div>
      </div>
      <div className="flex flex-col gap-2 text-[12px]">
        {[
          ["Status", <AssetStatus key="status" status="review" />],
          ["Dimensions", asset.dims],
          ["Modified", asset.modified],
          ["Downloads", "18"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground/85 tabular-nums">{value}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="text-[11px] text-muted-foreground">Tags</div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-foreground/[0.12] p-2">
          {["aw26", "lookbook", "look-07"].map((tag) => (
            <Chip key={tag} className="h-5 px-2 text-[11px]">
              {tag}
            </Chip>
          ))}
          <span className="px-1 text-[12px] text-foreground">
            <Typed text="outerwear" delay={1.5} />
          </span>
        </div>
      </div>
      <div className="mt-auto flex gap-2">
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-foreground/[0.1] py-1.5 text-[12px] text-foreground/80">
          <Download className="size-3.5" /> Download
        </span>
        <span className="flex flex-1 items-center justify-center rounded-md bg-foreground py-1.5 text-[12px] font-medium text-background">Open asset</span>
      </div>
    </div>
  );
}

// Hero: the Asset Library on the Autumn lookbook folder, one look selected and a tag being typed.
export function LibraryWindow() {
  return (
    <Window className="relative h-[700px] w-[1180px]">
      <div className="flex h-full">
        <AssetsSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <FolderOpen className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="text-muted-foreground">Asset Library</span>
            <span className="text-muted-foreground/60">›</span>
            <span className="font-medium">Autumn lookbook</span>
            <span className="ml-auto flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
              <Upload className="size-3.5" /> Upload
            </span>
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
              <StatsRow>
                <StatCell label="Total assets" value="1,284" footer="in this library" />
                <StatCell label="Storage used" value="46.2 GB" footer="Across all assets" />
                <StatCell label="Approved" value="912" footer="Ready to use" />
                <StatCell label="Processing" value="3" footer="In queue" />
              </StatsRow>
              <div className="flex items-center gap-2">
                {["All Types", "All Statuses", "Last Modified"].map((filter) => (
                  <span key={filter} className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
                    {filter} <ChevronDown className="size-3 text-muted-foreground" />
                  </span>
                ))}
                <span className="ml-auto flex h-7 w-[170px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
                  <Search className="size-3.5" /> Search assets…
                </span>
                <span className="flex h-7 items-center gap-0.5 rounded-md border border-foreground/[0.1] p-0.5">
                  <span className="flex size-6 items-center justify-center rounded bg-foreground/[0.08]">
                    <LayoutGrid className="size-3.5" />
                  </span>
                  <span className="flex size-6 items-center justify-center text-muted-foreground">
                    <List className="size-3.5" />
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {LOOKBOOK.map((asset, index) => (
                  <GridTile key={asset.name} asset={asset} selected={index === 0} />
                ))}
              </div>
            </div>
            <QuickView />
          </div>
        </div>
      </div>
      <div
        className={cn("absolute bottom-6 left-[470px] z-[2] w-[300px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3.5 shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.9s" }}
      >
        <div className="flex items-center gap-2 text-[12px]">
          <UploadCloud className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Uploading to Autumn lookbook</span>
          <span className="ml-auto text-muted-foreground tabular-nums">9 of 12</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
          <span className={cn("block h-full w-[75%] origin-left rounded-full bg-amber-500", styles.fill)} style={{ "--fill-delay": "1.1s", "--fill-duration": "3s" }} />
        </div>
        <div className="mt-2 truncate text-[11px] text-muted-foreground">look-12-overcoat.jpg · direct to storage</div>
      </div>
    </Window>
  );
}

const LIST_ROWS = LOOKBOOK.slice(0, 9);

function LibraryList({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <FolderOpen className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Asset Library</span>
        <span className="text-muted-foreground">Autumn lookbook</span>
        <span className="ml-auto flex items-center gap-0.5 rounded-md border border-foreground/[0.1] p-0.5 text-muted-foreground">
          <span className="flex size-6 items-center justify-center">
            <LayoutGrid className="size-3.5" />
          </span>
          <span className="flex size-6 items-center justify-center rounded bg-foreground/[0.08] text-foreground">
            <List className="size-3.5" />
          </span>
        </span>
      </div>
      <div className={cn("grid h-9 grid-cols-[1fr_96px_72px_88px] items-center gap-3 border-b px-5 text-[11px] text-muted-foreground", LINE)}>
        <span>Asset</span>
        <span>Status</span>
        <span>Type</span>
        <span className="text-right">Modified</span>
      </div>
      {LIST_ROWS.map((asset, index) => (
        <div key={asset.name} className={cn("grid h-[52px] grid-cols-[1fr_96px_72px_88px] items-center gap-3 border-b px-5", LINE, index === 0 && "bg-foreground/[0.04]")}>
          <span className="flex min-w-0 items-center gap-3">
            <span className="size-9 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
              <Thumb asset={asset} compact className="size-full" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-foreground/90">{asset.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {asset.size} · {asset.dims}
              </span>
            </span>
          </span>
          <AssetStatus status={asset.status} />
          <span className="text-[12px] text-muted-foreground">{asset.type}</span>
          <span className="text-right text-[12px] text-muted-foreground">{asset.modified}</span>
        </div>
      ))}
    </Window>
  );
}

const DETAIL_NAV = [
  { items: [{ label: "Overview", icon: LayoutDashboard }] },
  {
    title: "Manage",
    items: [
      { label: "Asset details", icon: SquarePen },
      { label: "Relationships", icon: Share2 },
      { label: "Versions", icon: History },
      { label: "Delivery", icon: Rocket },
      { label: "Technical", icon: Wrench },
    ],
  },
];

const RELATIONS = [
  { relation: "Source", name: "look-07.cr3", meta: "Raw · 52.3 MB", asset: { name: "look-07.cr3", type: "Raw" } },
  { relation: "Variant", name: "look-07-overcoat-4x5.jpg", meta: "Image · 4000 × 5000", asset: { name: "x.jpg", scene: "coat" } },
  { relation: "Derived", name: "look-07-overcoat-web.jpg", meta: "Image · 1600 × 2000", asset: { name: "x.jpg", scene: "coat" } },
  { relation: "Campaign", name: "Autumn lookbook", meta: "Named record" },
  { relation: "Product", name: "Wool overcoat, camel", meta: "Named record" },
];

function AssetDetailWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <ArrowLeft className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Asset Library</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="truncate font-medium">look-07-overcoat.jpg</span>
        <AssetStatus status="review" className="ml-1" />
        <span className="ml-auto flex items-center gap-2">
          <Download className="size-4 text-muted-foreground" />
          <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Save</span>
        </span>
      </div>
      <div className="flex flex-1">
        <EditorNav groups={DETAIL_NAV} active="Relationships" />
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-medium tracking-[-0.01em]">Relationships</div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">Originals, derivatives, variants, and related records.</div>
            </div>
            <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
              <Plus className="size-3.5" /> Add relationship
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {RELATIONS.map((row, index) => (
              <div
                key={row.name}
                className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2.5", styles.popIn)}
                style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}
              >
                <span className="size-10 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
                  {row.asset ? (
                    <Thumb asset={row.asset} compact className="size-full" />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-foreground/[0.04]">
                      <Tag className="size-4 text-muted-foreground" strokeWidth={1.75} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground/90">{row.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{row.meta}</span>
                </span>
                <Chip className="h-5 px-2 text-[11px]">{row.relation}</Chip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

const RELATION_TYPES = ["Parent", "Child", "Derived", "Variant", "Source", "Campaign", "Product"];

// Section stage: the lookbook as a list behind, look 07 open on its relationships, and a relation being added.
export function LibraryStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <LibraryList className="absolute top-0 left-0 h-[600px] w-[600px] opacity-85" />
      <AssetDetailWindow className="absolute top-[56px] left-[300px] z-[2] h-[600px] w-[700px]" />
      <div className={cn("absolute top-[236px] left-[36px] z-[3] w-[290px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="font-medium">Add relationship</div>
        <div className="mt-3 text-[11px] text-muted-foreground">Relation</div>
        <div className="mt-1.5 rounded-lg border border-foreground/[0.1] p-1">
          {RELATION_TYPES.map((type) => (
            <div key={type} className={cn("flex items-center rounded-md px-2 py-1 text-[12px]", type === "Variant" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
              {type}
              {type === "Variant" ? <Check className="ml-auto size-3.5" /> : null}
            </div>
          ))}
        </div>
        <FieldBox label="Asset" className="mt-3">
          <span className="truncate">look-07-overcoat-4x5.jpg</span>
        </FieldBox>
      </div>
    </div>
  );
}

const JOBS = [
  { name: "look-12-overcoat.jpg", size: "22.4 MB", state: "Uploading", progress: 64 },
  { name: "look-12-detail.jpg", size: "8.1 MB", state: "Processing", progress: 100 },
  { name: "look-09-portrait.cr3", size: "49.6 MB", state: "Completed", progress: 100 },
  { name: "look-10-tote.jpg", size: "10.2 MB", state: "Queued", progress: 0 },
];

const JOB_TONE = { Uploading: "bg-amber-500", Processing: "bg-foreground/45", Completed: "bg-emerald-500", Queued: "bg-foreground/20" };

// Cell: the Upload Center taking a folder of looks, each file with its own progress.
export function UploadRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <UploadCloud className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Upload Center</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Autumn lookbook</span>
      </div>
      <div className="px-4 pt-3.5">
        <div className="flex h-[52px] items-center justify-center gap-2.5 rounded-lg border border-dashed border-foreground/20 bg-foreground/[0.02] text-[12px] text-muted-foreground">
          <Upload className="size-4" /> Drop files here, or browse
        </div>
      </div>
      <div className="flex flex-col px-4 py-2">
        {JOBS.map((job, index) => (
          <div key={job.name} className={cn("flex items-center gap-3 border-b py-2.5 last:border-b-0", LINE)}>
            <span className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="truncate text-[12px] text-foreground/90">{job.name}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{job.size}</span>
            </span>
            <span className="relative h-1.5 w-[96px] shrink-0 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span
                className={cn("absolute inset-y-0 left-0 origin-left rounded-full", JOB_TONE[job.state], styles.fill)}
                style={{ width: `${job.progress}%`, "--fill-delay": `${0.3 + index * 0.15}s` }}
              />
            </span>
            <span className="w-[96px] text-right text-[11px] whitespace-nowrap text-muted-foreground">{job.state === "Uploading" ? `${job.state} ${job.progress}%` : job.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DRIVE_FILES = [
  { name: "look-13-overcoat.jpg", picked: true },
  { name: "look-13-detail.jpg", picked: true },
  { name: "look-14-knit.jpg", picked: true },
  { name: "casting-notes.pdf", picked: false },
  { name: "look-14-portrait.jpg", picked: true },
];

// Cell: picking files from Google Drive and importing them into a folder.
export function DriveRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[290px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <HardDrive className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Google Drive</span>
          <span className="text-muted-foreground">› AW26 selects</span>
        </div>
        {DRIVE_FILES.map((file) => (
          <div key={file.name} className={cn("flex items-center gap-2.5 border-b px-3.5 py-2 last:border-b-0", LINE, file.picked && "bg-foreground/[0.03]")}>
            <span className={cn("flex size-4 items-center justify-center rounded border", file.picked ? "border-foreground bg-foreground text-background" : "border-foreground/30")}>
              {file.picked ? <Check className="size-3" strokeWidth={3} /> : null}
            </span>
            <span className={cn("truncate", file.picked ? "text-foreground/90" : "text-muted-foreground")}>{file.name}</span>
          </div>
        ))}
      </div>
      <div
        className={cn("absolute top-[118px] right-0 w-[210px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3.5 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.5s" }}
      >
        <div className="font-medium text-[13px]">Import 4 files</div>
        <div className="mt-1 text-muted-foreground">Into Autumn lookbook</div>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-foreground/[0.04] px-2.5 py-2 text-[11px] leading-4 text-muted-foreground">
          <Lock className="mt-px size-3 shrink-0" /> Only the files you pick, never your whole Drive.
        </div>
        <span className="mt-3 flex h-7 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">Import</span>
      </div>
    </div>
  );
}

const TYPE_COUNTS = [
  ["Image", 1046],
  ["Video", 38],
  ["Audio", 6],
  ["Document", 41],
  ["PDF", 72],
  ["3D Model", 14],
  ["Raw", 49],
  ["Archive", 18],
];

const STATUS_COUNTS = [
  ["approved", 912],
  ["review", 64],
  ["draft", 288],
  ["processing", 3],
  ["archived", 17],
];

// Cell: the type filter open beside the library's count by status.
export function FiltersRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <span className="absolute top-0 left-0 flex h-7 items-center gap-1.5 rounded-md border border-foreground/30 bg-foreground/[0.04] px-2.5 text-[12px] text-foreground">
        Image <ChevronDown className="size-3 text-muted-foreground" />
      </span>
      <div className="absolute top-[36px] left-0 w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        <div className="rounded-md px-2.5 py-1 text-foreground/75">All Types</div>
        {TYPE_COUNTS.map(([type, count]) => (
          <div key={type} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1", type === "Image" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            {type}
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{count}</span>
            {type === "Image" ? <Check className="size-3.5" /> : null}
          </div>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-[230px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
        <MonoLabel>By status</MonoLabel>
        <div className="mt-3 flex flex-col gap-2.5">
          {STATUS_COUNTS.map(([status, count], index) => (
            <div key={status}>
              <div className="flex items-center justify-between">
                <AssetStatus status={status} />
                <span className="text-muted-foreground tabular-nums">{count}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                <span
                  className={cn("block h-full origin-left rounded-full bg-foreground/35", styles.fill)}
                  style={{ width: `${Math.max(2, (count / 912) * 100)}%`, "--fill-delay": `${0.3 + index * 0.1}s` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={cn("mt-4 flex items-center justify-between border-t pt-3 text-muted-foreground", LINE)}>
          Sort
          <span className="text-foreground/85">Most Downloaded</span>
        </div>
      </div>
    </div>
  );
}

const VERSIONS = [
  { tag: "v3", label: "Final retouch", meta: "21.6 MB · Oct 27, 2026", current: true },
  { tag: "v2", label: "Sleeve crease removed", meta: "21.4 MB · Oct 26, 2026" },
  { tag: "v1", label: "Version 1", meta: "20.9 MB · Oct 24, 2026" },
];

// Cell: look 07's version history, with the final retouch current.
export function VersionsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="font-medium">Version Control</div>
          <div className="text-[12px] text-muted-foreground">An inspectable history of every revision.</div>
        </div>
        <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <Upload className="size-3.5" /> Replace file
        </span>
      </div>
      {VERSIONS.map((version, index) => (
        <div key={version.tag} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg border text-[12px] font-semibold tabular-nums",
              version.current ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-foreground/[0.1] text-muted-foreground",
            )}
          >
            {version.tag}
          </span>
          <span className="size-9 shrink-0 overflow-hidden rounded-md border border-foreground/[0.08]">
            <Photo scene="coat" className="block size-full" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate font-medium text-foreground/90">{version.label}</span>
              {version.current ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                  <Check className="size-2.5" /> Current
                </span>
              ) : null}
            </span>
            <span className="block text-[11px] text-muted-foreground">{version.meta}</span>
          </span>
          {!version.current ? <span className="text-[12px] text-muted-foreground">Restore</span> : null}
        </div>
      ))}
    </div>
  );
}

const TOOLS = [MousePointer2, Hand, Crop, Type, Square, Paintbrush, Pipette];

const SLIDERS = [
  { group: "Light", label: "Exposure", value: 8 },
  { group: "Light", label: "Contrast", value: 12 },
  { group: "Color", label: "Saturation", value: -6 },
  { group: "Color", label: "Temperature", value: 14 },
  { group: "Detail", label: "Sharpen", value: 20, min: 0 },
];

function Slider({ label, value, min = -100 }) {
  const span = 100 - min;
  const zero = ((0 - min) / span) * 100;
  const at = ((value - min) / span) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-foreground/80">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="relative mt-2 h-1 rounded-full bg-foreground/[0.1]">
        <span className="absolute inset-y-0 rounded-full bg-foreground/50" style={{ left: `${Math.min(zero, at)}%`, width: `${Math.abs(at - zero)}%` }} />
        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/30 bg-surface-card shadow-sm dark:bg-foreground" style={{ left: `${at}%` }} />
      </div>
    </div>
  );
}

function ImageEditor({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
        <ArrowLeft className="size-4 text-muted-foreground" />
        <span>
          <span className="block text-[13px] leading-4 font-medium">look-07-overcoat.jpg</span>
          <span className="block text-[10px] leading-3 text-amber-700 dark:text-amber-400">Unsaved changes</span>
        </span>
        <span className="ml-auto flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="tabular-nums">62%</span>
          <span>Compare</span>
          <span className="flex h-7 items-center rounded-md bg-foreground px-3 font-medium text-background">Save</span>
        </span>
      </div>
      <div className="flex flex-1">
        <div className={cn("flex w-12 shrink-0 flex-col items-center gap-1.5 border-r py-3", LINE)}>
          {TOOLS.map((Icon, index) => (
            <span key={index} className={cn("flex size-8 items-center justify-center rounded-md", index === 2 ? "bg-foreground/[0.09] text-foreground" : "text-muted-foreground")}>
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-10 items-center gap-1 border-b px-3 text-[12px]", LINE)}>
            <span className="mr-2 text-muted-foreground">Crop</span>
            {["Free", "Original", "1:1", "4:5", "3:2", "16:9", "9:16"].map((ratio) => (
              <span key={ratio} className={cn("rounded-md px-2 py-0.5", ratio === "4:5" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
                {ratio}
              </span>
            ))}
          </div>
          <div className="relative flex flex-1 items-center justify-center bg-foreground/[0.03]">
            <div className="relative h-[410px] w-[360px] overflow-hidden rounded-sm">
              <Photo scene="coat" className="absolute inset-0 size-full" />
              <span className="absolute inset-y-0 left-0 w-[44px] bg-background/60" />
              <span className="absolute inset-y-0 right-0 w-[8px] bg-background/60" />
              <span className="absolute top-[18px] right-[8px] left-[44px] h-[374px] border-2 border-foreground/80">
                <span className="absolute inset-y-0 left-1/3 border-l border-foreground/30" />
                <span className="absolute inset-y-0 left-2/3 border-l border-foreground/30" />
                <span className="absolute inset-x-0 top-1/3 border-t border-foreground/30" />
                <span className="absolute inset-x-0 top-2/3 border-t border-foreground/30" />
                {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((corner) => (
                  <span key={corner} className={cn("absolute size-2.5 bg-foreground", corner)} />
                ))}
              </span>
              <span className="absolute inset-x-0 top-0 h-[18px] bg-background/60" />
              <span className="absolute inset-x-0 bottom-0 h-[18px] bg-background/60" />
            </div>
          </div>
        </div>
        <div className={cn("flex w-[214px] shrink-0 flex-col border-l", LINE)}>
          <div className="p-3">
            <Segmented items={["Adjust", "Looks", "Canvas"]} active="Adjust" className="flex w-full [&>span]:flex-1 [&>span]:text-center" />
          </div>
          <div className="flex flex-col gap-4 px-4 py-2">
            {SLIDERS.map((slider, index) => (
              <div key={slider.label}>
                {index === 0 || SLIDERS[index - 1].group !== slider.group ? <MonoLabel className="mb-2 block text-[10px]">{slider.group}</MonoLabel> : null}
                <Slider {...slider} />
              </div>
            ))}
          </div>
          <p className="mt-auto px-4 pb-4 text-[11px] leading-4 text-muted-foreground">Double-click a slider to reset it. Adjustments are non-destructive.</p>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the image editor cropping look 07 to 4:5, with the save dialog sending it back as a new version.
export function EditorStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ImageEditor className="absolute top-0 left-0 h-[600px] w-[740px]" />
      <div className={cn("absolute top-[96px] left-[636px] z-[2] w-[364px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="text-[15px] font-medium">Save image</div>
        <div className="mt-0.5 text-[12px] text-muted-foreground">Export the edit as a delivery-ready file.</div>
        <div className="mt-4 text-[11px] text-muted-foreground">Save as</div>
        <Segmented items={["New asset", "New version", "Download"]} active="New version" className="mt-1.5 flex w-full [&>span]:flex-1 [&>span]:text-center" />
        <div className="mt-3 text-[11px] text-muted-foreground">Format</div>
        <Segmented items={["WebP", "JPEG", "PNG"]} active="JPEG" className="mt-1.5 flex w-full [&>span]:flex-1 [&>span]:text-center" />
        <div className="mt-3 flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">Quality</span>
          <span className="tabular-nums">90%</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-foreground/[0.1]">
          <span className={cn("block h-full w-[89%] origin-left rounded-full bg-foreground/50", styles.fill)} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-8 flex-1 items-center rounded-md border border-foreground/[0.1] px-2.5 font-mono text-[12px]">3,740</span>
          <Link2 className="size-3.5 text-muted-foreground" />
          <span className="flex h-8 flex-1 items-center rounded-md border border-foreground/[0.1] px-2.5 font-mono text-[12px]">4,675</span>
        </div>
        <p className="mt-3 rounded-lg bg-foreground/[0.04] px-3 py-2 text-[11px] leading-4 text-muted-foreground">
          Uploads this edit as the current version of “look-07-overcoat.jpg”. The previous file stays in its version history.
        </p>
        <div className="mt-4 flex justify-end gap-2 text-[12px]">
          <span className="flex h-8 items-center px-3 text-muted-foreground">Cancel</span>
          <span className="flex h-8 items-center rounded-md bg-foreground px-3 font-medium text-background">Save version</span>
        </div>
      </div>
    </div>
  );
}

const TRANSFORM = [
  ["Width", "1200"],
  ["Height", "1500"],
  ["Crop", "Fill"],
  ["Format", "AVIF"],
  ["Quality", "80"],
  ["Effect", "None"],
];

// Cell: delivery transforms in a URL and the rendered result.
export function DeliveryRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="flex gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2.5 gap-y-2">
          {TRANSFORM.map(([label, value]) => (
            <FieldBox key={label} label={label} valueClassName="h-7">
              {value}
            </FieldBox>
          ))}
        </div>
        <div className="relative w-[150px] shrink-0">
          <div className="overflow-hidden rounded-lg border border-foreground/[0.08]">
            <Photo scene="coat" className="block h-[176px] w-full" />
          </div>
          <span
            className={cn("absolute right-2 bottom-2 rounded-md border whitespace-nowrap border-foreground/[0.12] bg-surface-card/95 px-1.5 py-0.5 font-mono text-[10px] dark:bg-surface-dialog/95", styles.popIn)}
            style={{ "--pop-delay": "0.7s" }}
          >
            1200×1500 · AVIF
          </span>
        </div>
      </div>
      <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-foreground/[0.1] bg-foreground/[0.02] px-3 py-2.5">
        <code className="min-w-0 flex-1 font-mono text-[11px] leading-[1.55] break-all text-foreground/85">
          /d/cobalt-aw26/7f3a91c2/<span className="text-foreground">w_1200,h_1500,c_fill,f_avif,q_80</span>/look-07-overcoat.jpg
        </code>
        <Copy className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
}

// Cell: signed delivery URLs and the referrer allowlist, with one request let in and one turned away.
export function AccessRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="font-medium">Access</div>
        <div className="text-[12px] text-muted-foreground">Control who can load delivery URLs.</div>
      </div>
      <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
        <ShieldCheck className="mt-0.5 size-4 text-muted-foreground" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px]">Require signed URLs</div>
          <div className="text-[11px] leading-4 text-muted-foreground">/d/ URLs need a valid signature minted through the delivery API.</div>
        </div>
        <Toggle on />
      </div>
      <div className="flex items-start gap-3 px-4 py-3">
        <Globe className="mt-0.5 size-4 text-muted-foreground" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px]">Referrer allowlist</div>
          <div className="mt-2 rounded-md border border-foreground/[0.1] bg-foreground/[0.02] px-2.5 py-1.5 font-mono text-[11px] leading-5 text-foreground/85">
            cobaltretail.com
            <br />
            shop.cobaltretail.com
          </div>
          <div className="mt-2.5 flex flex-col gap-1 font-mono text-[11px]">
            <span className={cn("flex items-center gap-2", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
              <span className="text-emerald-600 dark:text-emerald-400">200</span>
              <span className="truncate text-muted-foreground">shop.cobaltretail.com → look-07…?sig=9c41…</span>
            </span>
            <span className={cn("flex items-center gap-2", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
              <span className="text-red-600 dark:text-red-400">403</span>
              <span className="truncate text-muted-foreground">another-site.example → look-07…</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const KEYS = [
  { name: "Storefront build", prefix: "gk_live_3f9a", scopes: ["assets:read", "delivery:read"], status: "Active", used: "4 min ago", expires: "Never" },
  { name: "Lookbook ingest", prefix: "gk_live_b81c", scopes: ["upload:write", "assets:write"], status: "Active", used: "2h ago", expires: "Jan 31, 2027" },
  { name: "Collections export", prefix: "gk_live_70de", scopes: ["collections:read"], status: "Active", used: "Yesterday", expires: "Never" },
  { name: "Press portal", prefix: "gk_live_5e17", scopes: ["assets:read", "collections:read"], status: "Active", used: "3 days ago", expires: "Dec 31, 2026" },
  { name: "Retouch upload", prefix: "gk_live_94b0", scopes: ["upload:write"], status: "Expired", used: "Sep 30", expires: "Oct 1, 2026" },
  { name: "Old CMS sync", prefix: "gk_live_c2a4", scopes: ["assets:read"], status: "Revoked", used: "Aug 12", expires: "—" },
];

function ApiKeysWindow({ className }) {
  return (
    <Window title="API Keys" icon={KeyRound} meta="Read and write the library with scoped API keys." className={className} actions={<span className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background"><Plus className="size-3.5" /> Create key</span>}>
      <div className={cn("grid h-9 grid-cols-[1.3fr_1.4fr_70px_80px] items-center gap-3 border-b px-5 text-[11px] text-muted-foreground", LINE)}>
        <span>Key</span>
        <span>Permissions</span>
        <span>Status</span>
        <span>Last used</span>
      </div>
      {KEYS.map((key) => (
        <div key={key.name} className={cn("grid grid-cols-[1.3fr_1.4fr_70px_80px] items-center gap-3 border-b px-5 py-3", LINE, key.status !== "Active" && "opacity-60")}>
          <span className="min-w-0">
            <span className="block truncate text-foreground/90">{key.name}</span>
            <span className="block truncate font-mono text-[11px] text-muted-foreground">{key.prefix}…</span>
          </span>
          <span className="flex flex-wrap gap-1">
            {key.scopes.map((scope) => (
              <span key={scope} className="rounded border border-foreground/[0.1] bg-foreground/[0.03] px-1.5 font-mono text-[10px] leading-5 text-foreground/80">
                {scope}
              </span>
            ))}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px]">
            <span className={cn("size-1.5 rounded-full", { Active: "bg-emerald-500", Expired: "bg-amber-500", Revoked: "bg-red-500" }[key.status])} />
            {key.status}
          </span>
          <span className="text-[12px] text-muted-foreground">{key.used}</span>
        </div>
      ))}
    </Window>
  );
}

// Section stage: the project's API keys behind, a request with one of them and the page of assets it returns.
export function ApiStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ApiKeysWindow className="absolute top-0 left-0 h-[520px] w-[620px] opacity-85" />
      <Window className="absolute top-[70px] left-[380px] z-[2] w-[620px]">
        <div className={cn("flex h-11 shrink-0 items-center gap-2 border-b px-4 text-[12px]", LINE)}>
          <Terminal className="size-3.5 text-muted-foreground" />
          <span className="font-medium">List assets</span>
          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 font-mono text-[10px] leading-5 text-emerald-700 dark:text-emerald-400">GET</span>
          <span className="font-mono text-muted-foreground">assets:read</span>
          <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
            <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> 200 OK · 138 ms
          </span>
        </div>
        <div className={cn("border-b px-4 py-3.5 font-mono text-[12px] leading-6", LINE)}>
          <div className="text-foreground">
            <span className="text-muted-foreground">$ </span>
            <Typed text='curl "/api/v1/assets?status=approved&tag=aw26&limit=25"' delay={1.2} />
          </div>
          <div className="pl-4 text-muted-foreground">-H &quot;Authorization: Bearer gk_live_3f9a…&quot;</div>
        </div>
        <pre className="px-4 py-3.5 font-mono text-[12px] leading-[1.65] text-muted-foreground">
          {"{\n  "}
          <span className="text-foreground/85">&quot;data&quot;</span>
          {": [\n    {\n      "}
          <span className="text-foreground/85">&quot;id&quot;</span>
          {': "7f3a91c2-…",\n      '}
          <span className="text-foreground/85">&quot;name&quot;</span>
          {": "}
          <span className="text-foreground">&quot;look-07-overcoat.jpg&quot;</span>
          {",\n      "}
          <span className="text-foreground/85">&quot;type&quot;</span>
          {': "image",\n      '}
          <span className="text-foreground/85">&quot;status&quot;</span>
          {": "}
          <span className="text-emerald-600 dark:text-emerald-400">&quot;approved&quot;</span>
          {",\n      "}
          <span className="text-foreground/85">&quot;dimensions&quot;</span>
          {': "4000 × 5000",\n      '}
          <span className="text-foreground/85">&quot;tags&quot;</span>
          {': ["aw26", "lookbook", "outerwear"],\n      '}
          <span className="text-foreground/85">&quot;deliveryEnabled&quot;</span>
          {": true\n    },\n    { … 24 more }\n  ],\n  "}
          <span className="text-foreground/85">&quot;pagination&quot;</span>
          {': { "nextCursor": "MjU", "limit": 25 }\n}'}
        </pre>
      </Window>
    </div>
  );
}

const SCOPE_ROWS = [
  ["Assets", true, false],
  ["Collections", true, false],
  ["Folders", false, false],
  ["Tags", true, null],
  ["Upload", null, false],
  ["Delivery", true, false],
];

function CheckCell({ on }) {
  if (on === null) return <span className="mx-auto block h-px w-3 bg-foreground/20" />;
  return (
    <span className={cn("mx-auto flex size-4 items-center justify-center rounded border", on ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
      {on ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

// Cell: a new API key's read and write permissions, resource by resource.
export function ScopesRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
      <div className="flex items-center gap-3">
        <span className="font-medium">Create API key</span>
        <span className="ml-auto flex h-7 w-[200px] items-center rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/90">Storefront build</span>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-foreground/[0.1] text-[12px]">
        <div className={cn("grid grid-cols-[1fr_56px_56px] border-b bg-foreground/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground", LINE)}>
          <span>Permissions</span>
          <span className="text-center">Read</span>
          <span className="text-center">Write</span>
        </div>
        {SCOPE_ROWS.map(([resource, read, write]) => (
          <div key={resource} className={cn("grid h-7 grid-cols-[1fr_56px_56px] items-center border-b px-3 last:border-b-0", LINE)}>
            <span className="text-foreground/85">{resource}</span>
            <CheckCell on={read} />
            <CheckCell on={write} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">Expires · Never expires</span>
        <span className="flex h-7 items-center rounded-md bg-foreground px-3 font-medium text-background">Create key</span>
      </div>
    </div>
  );
}

const UPLOAD_STEPS = [
  { method: "POST", path: "/api/v1/upload", note: "Presign: returns an upload URL and a key", scope: "upload:write" },
  { method: "PUT", path: "storage · look-15-overcoat.jpg", note: "The file goes straight to storage, not through the API", scope: "direct" },
  { method: "POST", path: "/api/v1/upload/commit", note: "Attach the finished upload to an asset record", scope: "upload:write" },
];

// Cell: presign, upload straight to storage, then commit.
export function UploadFlowRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <svg className="absolute top-[30px] left-[29px] h-[152px] w-4 overflow-visible text-foreground" aria-hidden="true">
        <path d="M2 0 V152" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" className={styles.flow} />
      </svg>
      <span className={cn("absolute top-0 left-0 size-2.5 rounded-full bg-emerald-500", styles.travel)} style={{ offsetPath: "path('M31 30 V182')", "--travel-duration": "3.6s" }} />
      <div className="flex flex-col gap-4">
        {UPLOAD_STEPS.map((step, index) => (
          <div key={step.path} className="relative flex items-center gap-4">
            <span className="z-[1] flex size-[60px] shrink-0 flex-col items-center justify-center rounded-xl border border-foreground/[0.1] bg-surface-card dark:bg-surface-subtle">
              <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
              <span className="font-mono text-[11px] font-medium">{step.method}</span>
            </span>
            <div className="min-w-0 flex-1 rounded-xl border border-foreground/[0.09] bg-surface-card px-3.5 py-2.5 dark:bg-surface-subtle">
              <div className="flex items-center gap-2">
                <span className="truncate font-mono text-[12px] text-foreground/90">{step.path}</span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">{step.scope}</span>
              </div>
              <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{step.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 ml-[76px] flex items-center gap-2 text-[12px] text-muted-foreground", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
        <span className="size-1.5 rounded-full bg-emerald-500" /> look-15-overcoat.jpg lands as a Draft asset
      </div>
    </div>
  );
}
