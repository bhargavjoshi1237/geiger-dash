import { Box, CalendarRange, Check, Flag, Plus, Repeat, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, StatusIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import { Health, ISSUES, IssueRow, ProgressRing } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Flow's planning views: the Initiatives roadmap, a cycle's burn-up, division health, goals and milestones.

// Day offsets from 1 June across a six-month window (Jun–Nov, 183 days).
const MONTH_START = { Jun: 0, Jul: 30, Aug: 61, Sep: 92, Oct: 122, Nov: 153 };
const SPAN = 183;
const at = (month, day) => ((MONTH_START[month] + day - 1) / SPAN) * 100;

const ROADMAP = [
  { kind: "cycle", title: "Cycle 1 - Foundations", detail: "Jun 8 – Jun 21", from: ["Jun", 8], to: ["Jun", 21], progress: 100 },
  { kind: "division", title: "Ship Geiger Notes 1.0 to general availability", detail: "Danielle Reyes · On track", from: ["Jun", 10], to: ["Oct", 20], progress: 72 },
  { kind: "cycle", title: "Cycle 2 - Editor Core", detail: "Jun 22 – Jul 5", from: ["Jun", 22], to: ["Jul", 5], progress: 100 },
  { kind: "cycle", title: "Cycle 3 - Collaboration", detail: "Jul 6 – Jul 19", from: ["Jul", 6], to: ["Jul", 19], progress: 100 },
  { kind: "division", title: "Earn enterprise trust", detail: "Aisha Bennett · At risk", from: ["Jul", 15], to: ["Nov", 30], progress: 54 },
  { kind: "cycle", title: "Cycle 4 - Search & Structure", detail: "Jul 20 – Aug 2", from: ["Jul", 20], to: ["Aug", 2], progress: 100 },
  { kind: "cycle", title: "Cycle 5 - Sharing & Permissions", detail: "Aug 3 – Aug 16", from: ["Aug", 3], to: ["Aug", 16], progress: 100 },
  { kind: "cycle", title: "Cycle 6 - Offline & Mobile", detail: "Aug 31 – Sep 13", from: ["Aug", 31], to: ["Sep", 13], progress: 100 },
  { kind: "cycle", title: "Cycle 7 - GA Hardening", detail: "Sep 14 – Sep 27", from: ["Sep", 14], to: ["Sep", 27], progress: 8, current: true },
];

const TODAY = at("Sep", 20);

function RoadmapRow({ row, labelWidth }) {
  const left = at(...row.from);
  const width = at(...row.to) - left;
  const Icon = row.kind === "division" ? Box : Repeat;
  return (
    <div className={cn("flex border-b", LINE)}>
      <div className={cn("flex shrink-0 items-center gap-2.5 border-r px-4 py-2.5", LINE)} style={{ width: labelWidth }}>
        <Icon className={cn("size-3.5 shrink-0", row.kind === "division" ? "text-foreground/70" : "text-amber-500")} strokeWidth={2} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] text-foreground/90">{row.title}</span>
          <span className="block truncate text-[11px] text-muted-foreground">{row.detail}</span>
        </span>
        <ProgressRing value={row.progress} className={row.progress === 100 ? "text-emerald-500" : "text-foreground/70"} />
      </div>
      <div className="relative flex-1 py-3.5">
        <div
          className={cn("relative h-5 overflow-hidden rounded-full border", row.current ? "border-foreground/40 bg-foreground/[0.08]" : "border-foreground/[0.14] bg-foreground/[0.05]")}
          style={{ marginLeft: `${left}%`, width: `${width}%` }}
        >
          <span className={cn("absolute inset-y-0 left-0", row.progress === 100 ? "bg-foreground/20" : "bg-foreground/35")} style={{ width: `${row.progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function MonthScale({ labelWidth, months }) {
  return (
    <div className={cn("flex h-9 border-b", LINE)}>
      <div className={cn("shrink-0 border-r", LINE)} style={{ width: labelWidth }} />
      <div className="relative flex-1">
        {months.map((month) => (
          <span key={month} className={cn("absolute top-0 flex h-9 items-center border-l pl-2 text-[11px] text-muted-foreground", LINE)} style={{ left: `${at(month, 1)}%` }}>
            {month}
          </span>
        ))}
      </div>
    </div>
  );
}

function MonthLines({ labelWidth, months }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0" style={{ left: labelWidth }}>
      {months.map((month) => (
        <span key={month} className={cn("absolute inset-y-0 border-l", LINE)} style={{ left: `${at(month, 1)}%` }} />
      ))}
      <span className="absolute inset-y-0 w-px bg-foreground/70" style={{ left: `${TODAY}%` }}>
        <span className="absolute -top-px left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground" />
      </span>
    </div>
  );
}

// The hero's tilted plane: six months of divisions and cycles, with a new cycle being named.
export function RoadmapWindow() {
  const labelWidth = 300;
  const months = Object.keys(MONTH_START);
  return (
    <Window className="h-[720px] w-[1180px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Target className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Initiatives</span>
        <span className="ml-auto flex gap-1 text-[12px]">
          {["3m", "6m", "12m"].map((range) => (
            <span key={range} className={cn("rounded-md px-2 py-0.5", range === "6m" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {range}
            </span>
          ))}
        </span>
      </div>
      <div className="relative">
        <MonthScale labelWidth={labelWidth} months={months} />
        <div className="relative">
          {ROADMAP.map((row) => (
            <RoadmapRow key={row.title} row={row} labelWidth={labelWidth} />
          ))}
          <MonthLines labelWidth={labelWidth} months={months} />
        </div>
        <div className="absolute top-[300px] left-[600px] z-[2] w-[360px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Repeat className="size-3.5 text-amber-500" strokeWidth={2} /> New cycle
          </div>
          <div className="mt-3 rounded-lg border border-foreground/[0.14] px-3 py-2.5 text-[15px] font-medium">
            <Typed text="Cycle 8 - Launch week" delay={1.6} />
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
            <CalendarRange className="size-3.5" /> Sep 28 – Oct 11
            <span className="ml-auto flex h-7 items-center rounded-md bg-foreground px-2.5 font-medium text-background">Create cycle</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

// Three fortnights of the seeded project: two finished cycles and the active one, a point a day on each burn-up.
const CYCLES = [
  {
    title: "Cycle 5 - Sharing & Permissions",
    from: "Aug 3",
    to: "Aug 16",
    tab: "Completed",
    description: "Public share links, per-note roles, an audit trail and the SSO groundwork.",
    progress: 100,
    scope: [[0, 8], [3, 8], [3, 10], [6, 10], [6, 11], [13, 11]],
    completed: [[0, 0], [1.6, 0], [2.4, 1], [4, 2], [5.5, 4], [7, 5], [8.5, 7], [10, 8], [11.5, 10], [12.6, 11], [13, 11]],
    stats: { scope: 11, started: 0, completed: 11, points: 68 },
    issues: [
      { id: "GEIG-45", title: "Per-note roles: owner, editor, commenter, viewer", status: "done", priority: "urgent", assignee: "Marcus Whitfield" },
      { id: "GEIG-48", title: "Expired share links still resolve for five minutes", status: "done", priority: "urgent", assignee: "Aisha Bennett" },
      { id: "GEIG-52", title: "Revoke access propagates to open sessions", status: "done", priority: "high", assignee: "Tyler Brennan" },
      { id: "GEIG-47", title: "Share dialog redesign", status: "done", priority: "medium", assignee: "Grace Donnelly" },
    ],
  },
  {
    title: "Cycle 6 - Offline & Mobile",
    from: "Aug 31",
    to: "Sep 13",
    tab: "Completed",
    description: "Offline-first sync, conflict resolution and the installable mobile app.",
    progress: 100,
    scope: [[0, 7], [2, 7], [2, 9], [5, 9], [5, 10], [13, 10]],
    completed: [[0, 0], [2.6, 0], [3.4, 1], [5, 2], [6.5, 3], [8, 5], [9.5, 6], [11, 8], [12.4, 10], [13, 10]],
    stats: { scope: 10, started: 0, completed: 10, points: 44 },
    issues: [
      { id: "GEIG-55", title: "Offline-first sync engine", status: "done", priority: "urgent", assignee: "Aisha Bennett" },
      { id: "GEIG-56", title: "Conflict resolution UI for divergent edits", status: "done", priority: "urgent", assignee: "Ethan Caldwell" },
      { id: "GEIG-59", title: "Sync queue stalls after a long offline window", status: "done", priority: "urgent", assignee: "Aisha Bennett" },
      { id: "GEIG-57", title: "Installable PWA with a service worker", status: "done", priority: "high", assignee: "Tyler Brennan" },
    ],
  },
  {
    title: "Cycle 7 - GA Hardening",
    from: "Sep 14",
    to: "Sep 27",
    tab: "Active",
    description: "Rehearse the rollback, lock the release checklist and clear every urgent issue before GA.",
    progress: 8,
    today: 6,
    scope: [[0, 9], [2, 9], [2, 11], [4, 11], [4, 12], [6, 12]],
    completed: [[0, 0], [4.6, 0], [5.4, 1], [6, 1]],
    stats: { scope: 12, started: 7, completed: 1, points: 36 },
    issues: ["GEIG-70", "GEIG-71", "GEIG-69", "GEIG-77"].map((id) => ISSUES.find((issue) => issue.id === id)),
  },
];

// Burn-up of scope against completed; an active cycle hatches the days still to come and projects its scope forward.
function BurnUp({ cycle, width = 420, height = 150 }) {
  const days = 13;
  const max = Math.max(...cycle.scope.map(([, value]) => value));
  const x = (day) => (day / days) * width;
  const y = (value) => height - (value / max) * (height - 12);
  const end = cycle.today ?? days;
  const scopeNow = cycle.scope.at(-1)[1];
  const doneNow = cycle.completed.at(-1)[1];
  const line = (points) => points.map(([day, value], index) => `${index ? "L" : "M"}${x(day).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height + 22} viewBox={`0 0 ${width} ${height + 22}`} className="overflow-visible">
      {cycle.today != null ? (
        <defs>
          <pattern id="plan-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          </pattern>
        </defs>
      ) : null}
      {Array.from({ length: days + 1 }, (_, day) => (
        <line key={day} x1={x(day)} x2={x(day)} y1="0" y2={height} stroke="currentColor" strokeOpacity="0.06" />
      ))}
      {cycle.today != null ? (
        <>
          <rect x={x(end)} y="0" width={width - x(end)} height={height} fill="url(#plan-hatch)" className="text-foreground" />
          <path d={`M${x(end)} ${y(scopeNow)} L${x(days)} ${y(scopeNow)}`} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 4" className="text-foreground" />
        </>
      ) : null}
      <path d={line(cycle.scope)} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" className="text-foreground" />
      <path d={`${line(cycle.completed)} L${x(end)} ${height} L0 ${height} Z`} className="fill-emerald-500/15" />
      <path d={line(cycle.completed)} fill="none" strokeWidth="1.75" className="stroke-emerald-500" />
      {cycle.today != null ? <line x1={x(end)} x2={x(end)} y1="0" y2={height} stroke="currentColor" strokeOpacity="0.55" className="text-foreground" /> : null}
      <circle cx={x(end)} cy={y(scopeNow)} r="3" className="fill-foreground/70" />
      <circle cx={x(end)} cy={y(doneNow)} r="3" className="fill-emerald-500" />
      <line x1="0" x2={width} y1={height} y2={height} stroke="currentColor" strokeOpacity="0.15" className="text-foreground" />
      <text x="0" y={height + 16} className="fill-muted-foreground text-[11px]">
        {cycle.from}
      </text>
      <text x={width} y={height + 16} textAnchor="end" className="fill-muted-foreground text-[11px]">
        {cycle.to}
      </text>
    </svg>
  );
}

// Flow's stat tile: label, value, then the unit on its own line so it never crowds the number.
function StatTile({ label, value, hint, className }) {
  return (
    <div className={cn("flex flex-col px-4 py-3", className)}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="mt-1 text-[20px] leading-7 font-medium tracking-[-0.01em] tabular-nums">{value}</span>
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

function CycleStats({ stats }) {
  const tiles = [
    { label: "Scope", value: stats.scope, hint: "issues" },
    { label: "Started", value: stats.started },
    { label: "Completed", value: stats.completed },
    { label: "Points", value: stats.points, hint: "estimated" },
  ];
  return (
    <div className={cn("grid h-fit w-[208px] shrink-0 grid-cols-2 overflow-hidden rounded-lg border", LINE)}>
      {tiles.map((tile, index) => (
        <StatTile key={tile.label} {...tile} className={cn(LINE, index % 2 && "border-l", index > 1 && "border-t")} />
      ))}
    </div>
  );
}

function CycleTabs({ active }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
      <Repeat className="size-4 text-muted-foreground" strokeWidth={1.75} />
      <span className="font-medium">Cycles</span>
      <span className="ml-3 flex gap-1 text-[12px]">
        {["Active", "Upcoming", "Completed"].map((tab) => (
          <span key={tab} className={cn("rounded-md px-2 py-0.5", tab === active ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
            {tab}
          </span>
        ))}
      </span>
      <span className="ml-auto flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
        <Plus className="size-3.5" /> New cycle
      </span>
    </div>
  );
}

// One cycle as Flow shows it: header, burn-up and stat tiles, then the cycle's issues; `dim` fades a cycle sitting behind.
function CycleWindow({ cycle, dim, className }) {
  return (
    <Window className={className}>
      {dim ? <span className="pointer-events-none absolute inset-0 z-[1] bg-background" style={{ opacity: dim }} /> : null}
      <CycleTabs active={cycle.tab} />
      <div className={cn("flex gap-6 border-b px-6 py-6", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ProgressRing value={cycle.progress} size={16} className="text-emerald-500" />
            <span className="truncate text-[15px] font-medium">{cycle.title}</span>
            <span className="shrink-0 text-[12px] text-muted-foreground">
              {cycle.from} – {cycle.to}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">{cycle.description}</p>
          <div className="mt-5">
            <BurnUp cycle={cycle} />
          </div>
          <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-[2px] w-3 bg-emerald-500" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[2px] w-3 bg-foreground/45" /> Scope
            </span>
          </div>
        </div>
        <CycleStats stats={cycle.stats} />
      </div>
      {cycle.issues.map((issue) => (
        <IssueRow key={issue.id} issue={issue} compact />
      ))}
    </Window>
  );
}

// Section stage: the active cycle in front, the two finished cycles stacked behind it.
export function CycleStage() {
  const [fifth, sixth, active] = CYCLES;
  return (
    <div className="relative h-[620px] w-[1000px]">
      <CycleWindow cycle={fifth} dim={0.5} className="absolute top-[72px] left-0 z-0 h-[680px] w-[710px]" />
      <CycleWindow cycle={sixth} dim={0.3} className="absolute top-[36px] left-[150px] z-[1] h-[680px] w-[710px]" />
      <CycleWindow cycle={active} className="absolute top-0 left-[290px] z-[2] h-[680px] w-[710px]" />
    </div>
  );
}

// Cell: the roadmap in focus over three months, today marked.
export function RoadmapRender() {
  const labelWidth = 170;
  const rows = ROADMAP.filter((row) => ["Cycle 6 - Offline & Mobile", "Cycle 7 - GA Hardening", "Ship Geiger Notes 1.0 to general availability", "Earn enterprise trust"].includes(row.title));
  const months = ["Aug", "Sep", "Oct", "Nov"];
  const from = MONTH_START.Aug;
  const span = SPAN - from;
  const local = (month, day) => ((MONTH_START[month] + day - 1 - from) / span) * 100;
  const today = local("Sep", 20);
  return (
    <div className="mx-auto w-[480px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex h-8 border-b", LINE)}>
        <div className={cn("shrink-0 border-r", LINE)} style={{ width: labelWidth }} />
        <div className="relative flex-1">
          {months.map((month) => (
            <span key={month} className={cn("absolute top-0 flex h-8 items-center border-l pl-1.5 text-[11px] text-muted-foreground", LINE)} style={{ left: `${local(month, 1)}%` }}>
              {month}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        {rows.map((row) => {
          const left = Math.max(0, local(...row.from));
          const width = local(...row.to) - left;
          const Icon = row.kind === "division" ? Box : Repeat;
          return (
            <div key={row.title} className={cn("flex border-b last:border-b-0", LINE)}>
              <div className={cn("flex shrink-0 items-center gap-2 border-r px-3 py-3", LINE)} style={{ width: labelWidth }}>
                <Icon className={cn("size-3.5 shrink-0", row.kind === "division" ? "text-foreground/70" : "text-amber-500")} strokeWidth={2} />
                <span className="truncate text-foreground/90">{row.title.replace(" to general availability", "")}</span>
              </div>
              <div className="relative flex-1 py-3.5">
                <div className={cn("relative h-4 overflow-hidden rounded-full border", row.current ? "border-foreground/40" : "border-foreground/[0.14]", "bg-foreground/[0.05]")} style={{ marginLeft: `${left}%`, width: `${width}%` }}>
                  <span className={cn("absolute inset-y-0 left-0", styles.fill, row.progress === 100 ? "bg-foreground/20" : "bg-foreground/35")} style={{ width: `${row.progress}%`, transformOrigin: "left" }} />
                </div>
              </div>
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-y-0 right-0" style={{ left: labelWidth }}>
          <span className="absolute inset-y-0 w-px bg-foreground/70" style={{ left: `${today}%` }} />
        </div>
      </div>
    </div>
  );
}

const DIVISIONS = [
  { title: "Ship Geiger Notes 1.0 to general availability", health: "on", lead: "Danielle Reyes", progress: 72, target: "Oct 20" },
  { title: "Earn enterprise trust", health: "risk", lead: "Aisha Bennett", progress: 54, target: "Nov 30" },
];

export function DivisionsRender() {
  return (
    <div className="mx-auto w-[470px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("grid h-9 grid-cols-[1fr_84px_64px_56px] items-center gap-3 border-b px-4 text-[11px] text-muted-foreground", LINE)}>
        <span>Division</span>
        <span>Health</span>
        <span>Lead</span>
        <span className="text-right">Progress</span>
      </div>
      {DIVISIONS.map((division) => (
        <div key={division.title} className={cn("grid grid-cols-[1fr_84px_64px_56px] items-center gap-3 border-b px-4 py-3.5", LINE)}>
          <span className="flex min-w-0 items-center gap-2">
            <Box className="size-3.5 shrink-0 text-foreground/70" strokeWidth={2} />
            <span className="line-clamp-2 leading-[1.35] text-foreground/90">{division.title}</span>
          </span>
          <Health value={division.health} />
          <Avatar name={division.lead} size={18} />
          <span className="flex items-center justify-end gap-1.5 tabular-nums text-foreground/80">
            <ProgressRing value={division.progress} className={division.health === "on" ? "text-emerald-500" : "text-amber-500"} />
            {division.progress}%
          </span>
        </div>
      ))}
      <div className="grid grid-cols-[1fr_84px_64px_56px] items-center gap-3 px-4 py-3.5 opacity-40">
        <span className="h-2 w-3/4 rounded-full bg-foreground/15" />
        <Health value="backlog" />
        <span className="size-[18px] rounded-full border border-dashed border-foreground/40" />
        <span className="ml-auto h-2 w-8 rounded-full bg-foreground/15" />
      </div>
    </div>
  );
}

const KEY_RESULTS = [
  { title: "IdP metadata exchange", value: 60 },
  { title: "Just-in-time provisioning", value: 30 },
];

export function GoalRender() {
  return (
    <div className="mx-auto w-[420px] rounded-xl border border-foreground/[0.09] bg-surface-card p-5 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
          <Target className="size-4 text-foreground/80" strokeWidth={1.75} />
        </span>
        <span className="text-[15px] font-medium">Land SAML SSO</span>
        <Health value="risk" className="ml-auto" />
      </div>
      <div className="mt-4 flex items-center gap-3 text-[12px] text-muted-foreground">
        <Avatar name="Marcus Whitfield" size={18} />
        Marcus Whitfield
        <span className="ml-auto tabular-nums text-foreground/85">32%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
        <span className={cn("block h-full w-[32%] rounded-full bg-amber-500", styles.fill)} style={{ transformOrigin: "left" }} />
      </div>
      <div className="mt-5 text-[11px] font-medium text-muted-foreground">Key results</div>
      <div className="mt-2 flex flex-col gap-2.5">
        {KEY_RESULTS.map((result, index) => (
          <div key={result.title} className="rounded-lg border border-foreground/[0.08] px-3 py-2.5">
            <div className="flex items-center gap-2 text-[12px]">
              <Flag className="size-3.5 text-muted-foreground" />
              <span className="text-foreground/90">{result.title}</span>
              <span className="ml-auto tabular-nums text-muted-foreground">{result.value}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("block h-full rounded-full bg-foreground/50", styles.fill)} style={{ width: `${result.value}%`, transformOrigin: "left", "--fill-delay": `${0.6 + index * 0.2}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MILESTONE_TASKS = [
  { title: "Freeze the token contract", state: "Done", status: "done" },
  { title: "Migrate the workspace shell", state: "In Progress", status: "progress" },
  { title: "Publish the beta package", state: "To Do", status: "todo" },
  { title: "Accessibility sweep", state: "To Do", status: "todo" },
];

export function MilestoneRender() {
  return (
    <div className="mx-auto w-[420px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="flex items-center gap-2">
          <span className="flex size-5 rotate-45 items-center justify-center rounded-[4px] border border-foreground/30">
            <Check className="size-3 -rotate-45 text-foreground/70" strokeWidth={2.5} />
          </span>
          <span className="font-medium">Design system v2 — beta</span>
          <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">1 / 4</span>
        </div>
        <div className="mt-1.5 pl-7 text-[12px] text-muted-foreground">Apollo Platform Redesign</div>
      </div>
      {MILESTONE_TASKS.map((task, index) => (
        <div key={task.title} className={cn("flex items-center gap-3 border-b px-5 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <StatusIcon status={task.status} />
          <span className={cn("flex-1", task.status === "done" ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90")}>{task.title}</span>
          <span className="text-[11px] text-muted-foreground">{task.state}</span>
        </div>
      ))}
    </div>
  );
}
