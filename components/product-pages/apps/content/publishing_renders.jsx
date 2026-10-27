import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  Eye,
  GitCompareArrows,
  History,
  ListChecks,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Undo2,
  UserCog,
  Users,
  FileClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  ContentSidebar,
  GhostButton,
  Input,
  PrimaryButton,
  ScreenHead,
  Select,
  STATUS_TONES,
  StatsRow,
  StatusLabel,
  StatusPill,
} from "@/components/product-pages/apps/content/content_kit";
import { ChangeBadge } from "@/components/product-pages/apps/content/modelling_renders";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Content publishing renders: Atlas Coffee's queue, statuses, version snapshots and rollback, roles, the audit log and the cache.

const QUEUE = [
  { title: "Autumn menu launch", slug: "autumn-menu-launch", type: "Store page", status: "Scheduled", date: "Nov 3, 2026" },
  { title: "Kenya Nyeri — Washed", slug: "kenya-nyeri-washed", type: "Origin", status: "Scheduled", date: "Nov 6, 2026" },
  { title: "Holiday gift guide", slug: "holiday-gift-guide", type: "Article", status: "Scheduled", date: "Nov 17, 2026", active: true },
  { title: "Ethiopia Guji — Natural", slug: "ethiopia-guji-natural", type: "Origin", status: "In review", date: "Oct 26, 2026" },
  { title: "Flat white at home", slug: "flat-white-at-home", type: "Recipe", status: "In review", date: "Oct 24, 2026" },
  { title: "Decaf, done properly", slug: "decaf-done-properly", type: "Article", status: "Published", date: "Oct 27, 2026" },
  { title: "Brewing a better pour-over", slug: "brewing-a-better-pour-over", type: "Article", status: "Published", date: "Oct 27, 2026" },
  { title: "Colombia Huila — Honey", slug: "colombia-huila-honey", type: "Origin", status: "Published", date: "Oct 21, 2026" },
  { title: "Store screens — morning menu", slug: "store-screens-morning", type: "Store page", status: "Published", date: "Oct 20, 2026" },
  { title: "Harbour Roastery", slug: "harbour-roastery", type: "Roastery", status: "Published", date: "Oct 2, 2026" },
];

function QueueRow({ row }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_120px_120px_24px] items-center gap-4 border-b px-4 py-2.5", LINE, row.active && "bg-foreground/[0.05]")}>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground/90">{row.title}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          /{row.slug} · {row.type}
        </div>
      </div>
      <StatusPill status={row.status} className="justify-self-start" />
      <span className="text-[12px] whitespace-nowrap text-muted-foreground">{row.date}</span>
      <MoreHorizontal className="size-4 justify-self-end text-muted-foreground" />
    </div>
  );
}

function VisibilityCard({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Eye className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Visibility</span>
        <span className="truncate text-muted-foreground">Holiday gift guide</span>
      </div>
      <div className="grid gap-3 px-4 py-4">
        <Select label="Status">
          <span className="flex items-center gap-2">
            <Dot tone="strong" /> Scheduled
          </span>
        </Select>
        <Input label="Scheduled date" hint="Used by the Scheduled view.">
          <Calendar className="size-3.5 text-muted-foreground" />
          <Typed text="17/11/2026" delay={1.4} />
        </Input>
      </div>
      <div className={cn("flex justify-end border-t px-4 py-3", LINE)}>
        <PrimaryButton>Save Changes</PrimaryButton>
      </div>
    </div>
  );
}

function PublishedToast({ title, detail, className, delay = "1s" }) {
  return (
    <div
      className={cn("flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-surface-card px-4 py-3 text-[13px] shadow-xl shadow-black/25 dark:bg-surface-dialog", styles.popIn, className)}
      style={{ "--pop-delay": delay }}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium">{title}</div>
        <div className="truncate text-[12px] text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

// The hero's tilted plane: the Publishing Queue, with a release date being set and a publish landing.
export function QueueWindow() {
  return (
    <Window className="relative h-[700px] w-[1180px]">
      <div className="flex h-full">
        <ContentSidebar open="Publishing" active="Publishing Queue" />
        <div className="min-w-0 flex-1">
          <ScreenHead title="Publishing Queue" description="Entries waiting to go live — scheduled, in review, and currently published." />
          <div className="flex flex-col gap-4 px-6 py-4">
            <StatsRow
              stats={[
                { label: "In queue", value: "14", footer: "Across three statuses" },
                { label: "Scheduled", value: "5", footer: "Has a go-live date" },
                { label: "In review", value: "4", footer: "Awaiting approval" },
                { label: "Published", value: "5", footer: "Live in delivery" },
              ]}
            />
            <div className="flex items-center gap-2">
              <Chip>
                All Statuses <ChevronDown className="size-3 text-muted-foreground" />
              </Chip>
              <span className="ml-auto flex h-8 w-[240px] items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 text-[12px] text-muted-foreground">
                <Search className="size-3.5" /> Search queued entries…
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
              <div className={cn("grid grid-cols-[minmax(0,1fr)_120px_120px_24px] gap-4 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
                <span>Entry</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {QUEUE.map((row) => (
                <QueueRow key={row.slug} row={row} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <PublishedToast title="Published “Decaf, done properly”" detail="Snapshot v3 saved · now in delivery" className="absolute top-[236px] left-[770px] z-[2] w-[330px]" />
      <VisibilityCard className="absolute top-[330px] left-[700px] z-[2] w-[340px]" />
    </Window>
  );
}

const ALL_CONTENT = [
  { title: "Holiday gift guide", slug: "holiday-gift-guide", type: "Article", status: "Scheduled", updated: "4m", active: true },
  { title: "Ethiopia Guji — Natural", slug: "ethiopia-guji-natural", type: "Origin", status: "In review", updated: "40m" },
  { title: "Cold brew concentrate", slug: "cold-brew-concentrate", type: "Recipe", status: "Draft", updated: "1h" },
  { title: "Brewing a better pour-over", slug: "brewing-a-better-pour-over", type: "Article", status: "Published", updated: "2h" },
  { title: "Store screens — morning menu", slug: "store-screens-morning", type: "Store page", status: "Published", updated: "1d" },
  { title: "Kenya Nyeri — Washed", slug: "kenya-nyeri-washed", type: "Origin", status: "Scheduled", updated: "2d" },
  { title: "Summer menu 2026", slug: "summer-menu-2026", type: "Store page", status: "Archived", updated: "3w" },
];

function AllContentWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="All Content" description="Every entry in your workspace — drafts, in review, and published." actions={<PrimaryButton icon={Plus}>Create content</PrimaryButton>} />
      <div className="flex flex-col gap-4 px-5 py-4">
        <StatsRow
          stats={[
            { label: "Entries", value: "38", footer: "18 published" },
            { label: "Published", value: "18", footer: "Live in delivery" },
            { label: "In review", value: "4", footer: "Awaiting approval" },
            { label: "Drafts", value: "9", footer: "Not yet submitted" },
          ]}
        />
        <div className="flex items-center gap-2">
          <Chip>
            All Statuses <ChevronDown className="size-3 text-muted-foreground" />
          </Chip>
          <Chip>
            All Types <ChevronDown className="size-3 text-muted-foreground" />
          </Chip>
        </div>
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          {ALL_CONTENT.map((row) => (
            <div key={row.slug} className={cn("grid grid-cols-[minmax(0,1fr)_96px_36px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, row.active && "bg-foreground/[0.05]")}>
              <div className="min-w-0">
                <div className="truncate text-foreground/90">{row.title}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  /{row.slug} · {row.type}
                </div>
              </div>
              <StatusLabel status={row.status} />
              <span className="text-right text-[11px] text-muted-foreground">{row.updated}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

function StatusMenu({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      {["Published", "In review", "Draft", "Scheduled", "Archived"].map((status, index) => (
        <div
          key={status}
          className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", status === "Scheduled" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75", styles.popIn)}
          style={{ "--pop-delay": `${0.3 + index * 0.06}s` }}
        >
          <Dot tone={STATUS_TONES[status]} />
          {status}
          {status === "Scheduled" ? <Check className="ml-auto size-3.5" /> : null}
        </div>
      ))}
    </div>
  );
}

function VisibilityPanel({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3", LINE)}>
        <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
          <ChevronLeft className="size-3.5" /> All Content
        </span>
        <span className="mx-1 h-4 w-px bg-foreground/[0.1]" />
        <span className="truncate font-medium">Holiday gift guide</span>
        <StatusPill status="Scheduled" className="ml-auto h-5 text-[11px]" />
      </div>
      <div className="px-5 py-4">
        <div className="font-medium">Visibility</div>
        <div className="text-[12px] text-muted-foreground">Status and delivery state.</div>
        <div className="relative mt-4">
          <Select label="Status">
            <span className="flex items-center gap-2">
              <Dot tone="strong" /> Scheduled
            </span>
          </Select>
          <StatusMenu className="absolute top-[64px] left-0 z-[3] w-[220px]" />
        </div>
        <Input label="Scheduled date" hint="Used by the Scheduled view." className="mt-3">
          <Calendar className="size-3.5 text-muted-foreground" /> 17/11/2026
        </Input>
      </div>
      <div className={cn("flex justify-end gap-2 border-t px-5 py-3", LINE)}>
        <PrimaryButton>Save Changes</PrimaryButton>
      </div>
    </Window>
  );
}

// Section stage: every entry with its status behind, an entry's Visibility section in front with the five statuses open.
export function StatusStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <AllContentWindow className="absolute top-0 left-0 w-[600px] opacity-90" />
      <VisibilityPanel className={cn("absolute top-[60px] left-[560px] z-[2] w-[420px]", styles.float)} />
    </div>
  );
}

const SCHEDULED = [
  { month: "Nov", day: "03", title: "Autumn menu launch", meta: "/autumn-menu-launch · Store page", who: "Clara Vidal" },
  { month: "Nov", day: "06", title: "Kenya Nyeri — Washed", meta: "/kenya-nyeri-washed · Origin", who: "Theo Lindqvist" },
  { month: "Nov", day: "17", title: "Holiday gift guide", meta: "/holiday-gift-guide · Article", who: "Mia Johansson" },
];

// Cell: the Scheduled screen, everything with a date in date order.
export function ScheduledRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <span className="font-medium">Scheduled</span>
        <span className="text-[12px] text-muted-foreground">3 have a date</span>
        <PrimaryButton icon={Plus} className="ml-auto h-7 px-2.5">
          Schedule content
        </PrimaryButton>
      </div>
      {SCHEDULED.map((row, index) => (
        <div key={row.title} className={cn("flex items-center gap-3.5 border-b px-4 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span className="flex w-11 shrink-0 flex-col items-center rounded-lg border border-foreground/[0.1] py-1">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">{row.month}</span>
            <span className="text-[15px] leading-tight font-medium tabular-nums">{row.day}</span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-foreground/90">{row.title}</div>
            <div className="truncate text-[11px] text-muted-foreground">{row.meta}</div>
          </div>
          <Avatar name={row.who} size={20} />
        </div>
      ))}
    </div>
  );
}

const ARCHIVED = [
  { title: "Summer menu 2026", type: "Store page" },
  { title: "Iced latte at home", type: "Recipe" },
  { title: "Brazil Cerrado — Natural", type: "Origin" },
  { title: "Spring open day", type: "Article" },
];

// Cell: the Archived screen with an entry's menu open on Restore as draft.
export function ArchivedRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[400px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <span className="font-medium">Archived</span>
          <span className="text-[12px] text-muted-foreground">Out of delivery</span>
        </div>
        {ARCHIVED.map((row, index) => (
          <div key={row.title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
            <div className="min-w-0 flex-1">
              <div className="truncate text-foreground/90">{row.title}</div>
              <div className="text-[11px] text-muted-foreground">{row.type}</div>
            </div>
            <StatusLabel status="Archived" />
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[48px] left-[250px] z-[2] w-[200px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        {[
          [Pencil, "Edit"],
          [Copy, "Duplicate"],
          [RotateCcw, "Restore as draft", true],
        ].map(([Icon, label, active]) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <Icon className="size-3.5 text-muted-foreground" /> {label}
          </div>
        ))}
        <div className="my-1 h-px bg-foreground/[0.08]" />
        <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-red-600 dark:text-red-400">
          <Trash2 className="size-3.5" /> Delete
        </div>
      </div>
    </div>
  );
}

const VERSIONS = [
  { v: "v6", at: "Oct 27, 2026 · 09:42", title: "Autumn menu launch" },
  { v: "v5", at: "Oct 26, 2026 · 17:10", title: "Autumn menu launch" },
  { v: "v4", at: "Oct 22, 2026 · 16:05", title: "Autumn menu — draft two", active: true },
  { v: "v3", at: "Oct 20, 2026 · 11:30", title: "Autumn menu — draft" },
  { v: "v2", at: "Oct 18, 2026 · 14:02", title: "Autumn menu" },
  { v: "v1", at: "Oct 15, 2026 · 10:18", title: "Autumn menu" },
];

function VersionHistoryWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <History className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Version History</span>
        <span className="truncate text-muted-foreground">Autumn menu launch</span>
      </div>
      <div className={cn("grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Version</span>
        <span>Snapshotted</span>
      </div>
      {VERSIONS.map((row) => (
        <div key={row.v} className={cn("grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 border-b px-5 py-2.5", LINE, row.active && "bg-foreground/[0.05]")}>
          <span className="font-mono text-[12px] text-foreground/85">{row.v}</span>
          <div className="min-w-0">
            <div className="truncate text-[12px] text-foreground/85">{row.at}</div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">{row.title}</div>
          </div>
        </div>
      ))}
    </Window>
  );
}

const ROLLBACK_DIFF = [
  { path: "title", change: "Changed", before: '"Autumn menu — draft two"', after: '"Autumn menu launch"' },
  { path: "data.hero_heading", change: "Changed", before: '"Autumn is back"', after: '"Maple season is here"' },
  { path: "data.featured_origins", change: "Added", before: "—", after: '["kenya-nyeri-washed"]' },
  { path: "data.promo_code", change: "Removed", before: '"AUTUMN10"', after: "—" },
];

function CompareWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <GitCompareArrows className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Compare &amp; Rollback</span>
        <span className="truncate text-muted-foreground">Autumn menu launch</span>
        <PrimaryButton icon={Undo2} className="ml-auto h-7 px-2.5">
          Restore v4
        </PrimaryButton>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3", LINE)}>
        <GhostButton className="h-7">
          v4 <ChevronDown className="size-3 text-muted-foreground" />
        </GhostButton>
        <span className="text-muted-foreground">→</span>
        <GhostButton className="h-7">
          v6 <ChevronDown className="size-3 text-muted-foreground" />
        </GhostButton>
        <span className="ml-auto text-[12px] text-muted-foreground">Left is the baseline; rollback restores it.</span>
      </div>
      <div className={cn("grid grid-cols-[150px_74px_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Path</span>
        <span>Change</span>
        <span>v4</span>
        <span>v6</span>
      </div>
      {ROLLBACK_DIFF.map((row) => (
        <div key={row.path} className={cn("grid grid-cols-[150px_74px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b px-5 py-2.5 last:border-b-0", LINE)}>
          <span className="truncate font-mono text-[12px] text-foreground/85">{row.path}</span>
          <ChangeBadge change={row.change} />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{row.before}</span>
          <span className="truncate font-mono text-[11px] text-foreground/85">{row.after}</span>
        </div>
      ))}
    </Window>
  );
}

function RestoreDialog({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/40 dark:bg-surface-dialog", className)}>
      <div className="text-[15px] font-medium tracking-[-0.01em]">Restore v4?</div>
      <p className="mt-1.5 leading-5 text-muted-foreground">This overwrites the live entry&apos;s title, slug, excerpt, body, and data with the snapshot. The current state is not snapshotted first.</p>
      <div className="mt-5 flex justify-end gap-2">
        <span className="inline-flex h-8 items-center rounded-lg px-3 text-[12px] text-muted-foreground">Cancel</span>
        <PrimaryButton icon={Undo2}>Restore</PrimaryButton>
      </div>
    </div>
  );
}

// Section stage: an entry's snapshots behind, two of them diffed in the middle and the restore confirmation in front.
export function VersionsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <VersionHistoryWindow className="absolute top-0 left-0 w-[300px] opacity-80" />
      <CompareWindow className="absolute top-[48px] left-[220px] z-[2] w-[680px]" />
      <div className="absolute top-[48px] left-[220px] z-[3] h-[300px] w-[680px] rounded-xl bg-background/40" />
      <RestoreDialog className={cn("absolute top-[230px] left-[480px] z-[4] w-[400px]", styles.popIn)} />
    </div>
  );
}

const HISTORY = [
  { when: "Oct 27 · 09:42", entry: "Autumn menu launch", v: "v6" },
  { when: "Oct 27 · 08:10", entry: "Brewing a better pour-over", v: "v4" },
  { when: "Oct 21 · 15:22", entry: "Colombia Huila — Honey", v: "v3", active: true },
  { when: "Oct 20 · 07:30", entry: "Store screens — morning menu", v: "v2" },
  { when: "Oct 2 · 12:05", entry: "Harbour Roastery", v: "v1" },
];

// Cell: Publishing History, every publish snapshot with Restore as draft on the row menu.
export function PublishHistoryRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <FileClock className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Publishing History</span>
          <span className="ml-auto text-[12px] text-muted-foreground">32 snapshots</span>
        </div>
        {HISTORY.map((row) => (
          <div key={row.when} className={cn("grid grid-cols-[104px_minmax(0,1fr)_28px_16px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, row.active && "bg-foreground/[0.04]")}>
            <span className="text-[12px] text-muted-foreground tabular-nums">{row.when}</span>
            <span className="truncate text-foreground/90">{row.entry}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{row.v}</span>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[160px] left-[262px] z-[2] flex w-[180px] items-center gap-2 rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <span className="flex w-full items-center gap-2 rounded-md bg-foreground/[0.07] px-2.5 py-1.5 text-foreground">
          <Undo2 className="size-3.5 text-muted-foreground" /> Restore as draft
        </span>
      </div>
    </div>
  );
}

// Cell: a live entry unpublished from the queue and back in Draft.
export function UnpublishRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Publishing Queue</span>
          <span className="ml-auto text-[12px] text-muted-foreground">Published</span>
        </div>
        {[
          ["Store screens — morning menu", "Store page", true],
          ["Colombia Huila — Honey", "Origin"],
          ["Brewing a better pour-over", "Article"],
        ].map(([title, type, active]) => (
          <div key={title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, active && "bg-foreground/[0.04]")}>
            <div className="min-w-0 flex-1">
              <div className="truncate text-foreground/90">{title}</div>
              <div className="text-[11px] text-muted-foreground">{type}</div>
            </div>
            <StatusLabel status="Published" />
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className="absolute top-[70px] left-[296px] z-[2] w-[150px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <span className="flex items-center gap-2 rounded-md bg-foreground/[0.07] px-2.5 py-1.5 text-foreground">
          <Undo2 className="size-3.5 text-muted-foreground" /> Unpublish
        </span>
      </div>
      <div
        className={cn("absolute top-[208px] left-[30px] z-[3] flex w-[400px] items-center gap-3 rounded-xl border border-foreground/[0.14] bg-surface-card px-4 py-3 text-[13px] shadow-xl shadow-black/25 dark:bg-surface-dialog", styles.popIn)}
        style={{ "--pop-delay": "0.9s" }}
      >
        <Undo2 className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <div className="truncate font-medium">Store screens — morning menu</div>
          <div className="text-[12px] text-muted-foreground">Unpublished and back in Draft</div>
        </div>
        <StatusPill status="Draft" className="ml-auto" />
      </div>
    </div>
  );
}

const ROLES = [
  { name: "Owner", description: "Full access to everything.", keys: "Full access (*)", type: "System", updated: "Sep 2" },
  { name: "Admin", description: "Manage the workspace, team and roles.", keys: "25 keys", type: "System", updated: "Sep 2" },
  { name: "Editor", description: "Write, review, approve and publish content.", keys: "16 keys", type: "System", updated: "Sep 2" },
  { name: "Writer", description: "Day-to-day drafting access to the workspace.", keys: "5 keys", type: "System", updated: "Sep 2" },
  { name: "Viewer", description: "Read-only access to content and reports.", keys: "2 keys", type: "System", updated: "Sep 2" },
  { name: "Shop editor", description: "Edits and publishes the store pages.", keys: "8 keys", type: "Custom", updated: "Oct 25", active: true },
];

function RolesWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="Roles" description="System roles from the catalog plus your custom roles." actions={<PrimaryButton icon={Plus}>Create role</PrimaryButton>} />
      <div className="flex flex-col gap-4 px-5 py-4">
        <StatsRow
          stats={[
            { label: "Total roles", value: "6", footer: "5 system" },
            { label: "Custom roles", value: "1", footer: "Defined here" },
            { label: "Permission keys", value: "32", footer: "In the catalog" },
          ]}
        />
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          <div className={cn("grid grid-cols-[minmax(0,1fr)_104px_64px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
            <span>Role</span>
            <span>Permissions</span>
            <span>Type</span>
          </div>
          {ROLES.map((role) => (
            <div key={role.name} className={cn("grid grid-cols-[minmax(0,1fr)_104px_64px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, role.active && "bg-foreground/[0.05]")}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-medium text-foreground/90">
                  <UserCog className="size-3.5 text-muted-foreground" strokeWidth={1.75} /> {role.name}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{role.description}</div>
              </div>
              <span className="text-[12px] text-foreground/80">{role.keys}</span>
              <span className="text-[12px] text-muted-foreground">{role.type}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

const ROLE_KEYS = [
  { group: "Content", items: [["Edit an entry or page", "content.entry.edit", true], ["Publish an entry or page", "content.entry.publish", true], ["Delete an entry or page", "content.entry.delete"]] },
  { group: "Architecture", items: [["Manage content types, fields and blocks", "content.type.manage"]] },
  { group: "Developers", items: [["Create and revoke delivery tokens", "content.token.manage"]] },
];

function Checkbox({ checked }) {
  return (
    <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border", checked ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

function EditRoleDialog({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className="text-[15px] font-medium tracking-[-0.01em]">Edit role</div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">Rename the role or change which permission keys it carries.</div>
      <Input label="Name" className="mt-4">
        Shop editor
      </Input>
      <div className="mt-3 mb-1.5 text-[11px] font-medium text-muted-foreground">Permissions · 8 selected</div>
      <div className="flex flex-col gap-3 rounded-lg border border-foreground/[0.1] bg-foreground/[0.02] p-3">
        {ROLE_KEYS.map((group) => (
          <div key={group.group} className="flex flex-col gap-2">
            <MonoLabel className="text-[10px]">{group.group}</MonoLabel>
            {group.items.map(([label, key, checked]) => (
              <div key={key} className="flex items-start gap-2">
                <Checkbox checked={checked} />
                <span className="min-w-0 text-[12px] leading-5">
                  <span className="text-foreground/90">{label}</span> <span className="font-mono text-[11px] text-muted-foreground">{key}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <span className="inline-flex h-8 items-center rounded-lg px-3 text-[12px] text-muted-foreground">Cancel</span>
        <PrimaryButton>Save role</PrimaryButton>
      </div>
    </div>
  );
}

// Section stage: the Roles list behind, a custom role's permission keys being chosen in front.
export function AccessStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <RolesWindow className="absolute top-0 left-0 w-[600px] opacity-90" />
      <EditRoleDialog className={cn("absolute top-[40px] left-[520px] z-[2] w-[460px]", styles.float)} />
    </div>
  );
}

const AUDIT = [
  { when: "09:42", who: "Clara Vidal", action: "Publish", entity: "Entries", record: "Autumn menu launch" },
  { when: "09:40", who: "Clara Vidal", action: "Update", entity: "Entries", record: "Autumn menu launch" },
  { when: "09:12", who: "Theo Lindqvist", action: "Update", entity: "Entries", record: "Brewing a better pour-over" },
  { when: "08:55", who: "Mia Johansson", action: "Create", entity: "Assets", record: "guji-drying-beds.jpg" },
  { when: "08:31", who: "Samuel Okoro", action: "Delete", entity: "Slots", record: "winter_banner" },
];

const ACTION_TONES = {
  Create: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Update: "border-foreground/[0.12] bg-foreground/[0.04] text-foreground/80",
  Delete: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  Publish: "border-foreground/25 bg-foreground/[0.08] text-foreground",
};

// Cell: the append-only audit log, who did what to which record.
export function AuditRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Audit Logs</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Today</span>
      </div>
      {AUDIT.map((row, index) => (
        <div key={`${row.when}-${row.record}`} className={cn("grid grid-cols-[38px_18px_62px_minmax(0,1fr)] items-center gap-2.5 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
          <span className="text-[11px] text-muted-foreground tabular-nums">{row.when}</span>
          <Avatar name={row.who} size={18} />
          <span className={cn("inline-flex h-5 items-center justify-center rounded-md border px-1.5 text-[11px]", ACTION_TONES[row.action])}>{row.action}</span>
          <span className="min-w-0 truncate text-foreground/85">
            <span className="text-muted-foreground">{row.entity} · </span>
            {row.record}
          </span>
        </div>
      ))}
    </div>
  );
}

// Cell: Cache Invalidation, one published entry expired on demand and logged.
export function CacheRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="font-medium">Invalidate an entry</div>
      <div className="mt-0.5 text-[12px] leading-5 text-muted-foreground">Expires the entry and project delivery data caches so the next read fetches fresh content.</div>
      <div className="mt-3 flex items-end gap-2">
        <Select label="Published entry" className="flex-1">
          Autumn menu launch
        </Select>
        <PrimaryButton icon={RefreshCcw} className="h-9">
          Invalidate cache
        </PrimaryButton>
      </div>
      <div className={cn("mt-4 border-t pt-3", LINE)}>
        <MonoLabel className="text-[10px]">Invalidation history</MonoLabel>
        {[
          ["/c/8f3a…c21e", "now", true],
          ["/c/41d0…9b7a", "Oct 24 · 18:02"],
        ].map(([path, when, fresh]) => (
          <div key={path} className={cn("mt-2 flex items-center gap-3 text-[12px]", fresh && styles.popIn)} style={fresh ? { "--pop-delay": "1s" } : undefined}>
            <span className="font-mono text-foreground/85">{path}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Dot tone={fresh ? "emerald" : "neutral"} /> Requested
            </span>
            <span className="ml-auto text-muted-foreground">{when}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] leading-4 text-muted-foreground">Logged to the audit log. External CDNs may hold a copy for up to 60 seconds.</div>
    </div>
  );
}

// Cell: the read-only permission tester, one user's grants checked against one key.
export function TesterRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="font-medium">Permission tester</div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">Evaluate one user&apos;s grants against one capability via the database.</div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2.5">
        <Input label="User id" mono>
          <span className="truncate">5d2e9c41-8b07-…-7a0f</span>
        </Input>
        <Select label="Permission">
          <span className="font-mono text-[12px]">content.entry.publish</span>
        </Select>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Avatar name="Mia Johansson" size={16} /> Mia Johansson · Writer
        <GhostButton className="ml-auto h-7">Evaluate</GhostButton>
      </div>
      <div
        className={cn("mt-3 flex items-center gap-3 rounded-lg border border-red-500/25 bg-red-500/[0.06] px-3.5 py-3", styles.popIn)}
        style={{ "--pop-delay": "0.6s" }}
      >
        <span className="font-mono text-[12px] text-foreground/85">content.entry.publish</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600 dark:text-red-400">
          <Dot tone="red" /> Denied
        </span>
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground">Read-only — nothing is granted or changed.</div>
    </div>
  );
}

const MEMBERS = [
  { name: "Clara Vidal", role: "Owner", status: "Active" },
  { name: "Samuel Okoro", role: "Editor", status: "Active" },
  { name: "Theo Lindqvist", role: "Writer", status: "Active" },
  { name: "Mia Johansson", role: "Writer", status: "Active" },
  { name: "Ines Duarte", role: "Shop editor", status: "Invited" },
];

// Cell: Team & Members, who holds which role.
export function TeamRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Team &amp; Members</span>
        <span className="ml-auto text-[12px] text-muted-foreground">5 members · 4 roles in use</span>
      </div>
      {MEMBERS.map((member) => (
        <div key={member.name} className={cn("grid grid-cols-[minmax(0,1fr)_104px_72px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={member.name} size={22} />
            <span className="truncate text-foreground/90">{member.name}</span>
          </span>
          <span className="inline-flex h-6 items-center gap-1.5 justify-self-start rounded-md border border-foreground/[0.1] px-2 text-[12px] text-foreground/85">
            {member.role}
            <ChevronDown className="size-3 text-muted-foreground" />
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Dot tone={member.status === "Active" ? "emerald" : "neutral"} /> {member.status}
          </span>
        </div>
      ))}
    </div>
  );
}

