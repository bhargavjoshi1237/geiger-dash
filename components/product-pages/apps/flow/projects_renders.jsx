import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Cpu,
  Database,
  DatabaseZap,
  Gauge,
  GripVertical,
  MoreHorizontal,
  Network,
  Plus,
  Route,
  Search,
  Smartphone,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS, Pill, POPOVER, ProjectRail, ScreenTitle, StatStrip, Toggle } from "@/components/product-pages/apps/flow/flow_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Flow's project screens for Orbital Freight: the overview, tasks and the work queue, goals, milestones, people, budget and logs.

const TASK_STATUS = { todo: ["To Do", "neutral"], progress: ["In Progress", "amber"], blocked: ["Blocked", "red"], done: ["Done", "emerald"] };
const SEVERITY = { critical: ["Critical", "red"], high: ["High", "strong"], medium: ["Medium", "neutral"], low: ["Low", "neutral"] };

function Status({ value, className }) {
  const [label, tone] = TASK_STATUS[value];
  return (
    <Pill tone={tone} className={className}>
      {label}
    </Pill>
  );
}

function Severity({ value, className }) {
  const [label, tone] = SEVERITY[value];
  return (
    <Pill tone={tone} className={className}>
      {label}
    </Pill>
  );
}

function Select({ value, open = false, className }) {
  return (
    <span className={cn("flex h-8 items-center justify-between gap-2 rounded-md border bg-foreground/[0.02] px-2.5 text-[12px] text-foreground/90", open ? "border-foreground/30 ring-2 ring-foreground/10" : "border-foreground/[0.12]", className)}>
      <span className="truncate">{value}</span>
      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
    </span>
  );
}

function FieldLabel({ children }) {
  return <div className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{children}</div>;
}

function Card({ title, description, action, className, children }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-foreground/[0.015]", LINE, className)}>
      {title ? (
        <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold">{title}</div>
            {description ? <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{description}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

// A soft area sparkline drawn from a list of values.
function Spark({ values, width = 250, height = 52, className }) {
  const max = Math.max(...values) * 1.1;
  const step = width / (values.length - 1);
  const points = values.map((value, index) => [index * step, height - (value / max) * height]);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={cn("text-foreground", className)}>
      <path d={`${line} L${width} ${height} L0 ${height} Z`} fill="currentColor" fillOpacity="0.07" />
      <path d={line} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const METRICS = [
  { label: "Tasks completed", value: "48", trend: "↑ 18%", up: true, values: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8] },
  { label: "Issues closed", value: "31", trend: "↑ 9%", up: true, values: [3, 2, 3, 3, 2, 4, 3, 3, 4, 3, 5, 4] },
  { label: "Activity", value: "412", trend: "↓ 4%", up: false, values: [40, 36, 42, 38, 35, 37, 33, 36, 31, 34, 30, 32] },
];

const BREAKOUT = [
  ["To Do", 9, "bg-foreground/35"],
  ["In Progress", 7, "bg-amber-500"],
  ["Blocked", 2, "bg-red-500"],
  ["Done", 14, "bg-emerald-500"],
];

const TOP_ISSUES = [
  { title: "Fuel card scan rejects folded receipts", severity: "critical", meta: "Open · Due Oct 26" },
  { title: "Faster stop search on long routes", severity: "high", meta: "In Progress · Due Nov 3" },
  { title: "Clock-out button hidden on small phones", severity: "high", meta: "In Progress · Due Oct 30" },
  { title: "Bulk edit of delivery windows", severity: "medium", meta: "Open · Due Nov 14" },
];

// The hero's tilted plane: the Orbital Freight project's overview, with a new task being written over it.
export function ProjectWindow() {
  return (
    <Window className="h-[700px] w-[1180px] flex-row">
      <div className="flex h-full w-full">
        <ProjectRail active="Overview" />
        <div className="relative flex min-w-0 flex-1 flex-col gap-5 px-8 py-7">
          <div className="flex items-start gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[24px] font-semibold tracking-[-0.02em]">Orbital Freight</span>
                <Pill tone="emerald">Active</Pill>
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">The driver app, the dispatch console and billing for the Orbital Freight fleet.</div>
            </div>
            <div className="flex items-center">
              {[
                ["Members", "12"],
                ["Goals", "4"],
                ["Milestones", "6"],
              ].map(([label, value], index) => (
                <div key={label} className={cn("min-w-[92px] px-5 text-center", index > 0 && "border-l border-foreground/[0.08]")}>
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                  <div className="text-[20px] font-medium tabular-nums">{value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Select value="Last 1 month" className="w-[150px]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {METRICS.map((metric, index) => (
              <div key={metric.label} className={cn("rounded-xl border bg-foreground/[0.015] p-4", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className={metric.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>{metric.trend}</span>
                </div>
                <div className="mt-1 text-[26px] font-medium tracking-[-0.02em] tabular-nums">{metric.value}</div>
                <Spark values={metric.values} className="mt-2" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_1.15fr] gap-4">
            <Card title="Task Breakout by Status" description="Current project status mix">
              <div className="px-4 py-4">
                <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                  {BREAKOUT.map(([label, count, tone]) => (
                    <span key={label} className={tone} style={{ flexGrow: count }} />
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-3 text-[12px]">
                  {BREAKOUT.map(([label, count, tone], index) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className={cn("size-2 rounded-full", tone)} />
                      <span className="w-[76px] text-foreground/85">{label}</span>
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                        <span className={cn("block h-full origin-left rounded-full", tone, styles.fill)} style={{ width: `${(count / 14) * 100}%`, "--fill-delay": `${0.4 + index * 0.12}s` }} />
                      </span>
                      <span className="w-5 text-right text-muted-foreground tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card title="Top Issues" description="Issues that need attention first." action={<span className="text-[12px] text-muted-foreground">View all</span>}>
              {TOP_ISSUES.map((issue) => (
                <div key={issue.title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
                  <Severity value={issue.severity} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-foreground/90">{issue.title}</span>
                    <span className={cn("block text-[11px] text-muted-foreground", issue.severity === "critical" && "text-red-600 dark:text-red-400")}>{issue.meta}</span>
                  </span>
                </div>
              ))}
            </Card>
          </div>
          <div className={cn("absolute top-[220px] left-[470px] z-[2] w-[400px] p-5", POPOVER)}>
            <div className="text-[15px] font-semibold">Create New Task</div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">Configure core attributes for this task.</div>
            <div className="mt-4">
              <FieldLabel>Title</FieldLabel>
              <div className="flex h-9 items-center rounded-md border border-foreground/30 px-3 text-[13px] ring-2 ring-foreground/10">
                <Typed text="Shift summary before clock-out" delay={1.5} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Type", "Feature"],
                ["Status", "To Do"],
                ["Priority", "High"],
                ["Stage", "Planning"],
              ].map(([label, value]) => (
                <div key={label}>
                  <FieldLabel>{label}</FieldLabel>
                  <Select value={value} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2 text-[12px]">
              <span className="flex h-8 items-center rounded-md px-3 text-muted-foreground">Cancel</span>
              <span className="flex h-8 items-center rounded-md bg-foreground px-3 font-medium text-background">Create Task</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const TASKS = [
  { title: "Offline route cache", detail: "Keep the day's stops on the phone", status: "progress", priority: "high", people: ["Nathan Okafor", "Priya Nair"], due: "Oct 31", progress: 60 },
  { title: "Proof-of-delivery photo flow", detail: "Photo, retry and confirm in one step", status: "done", priority: "high", people: ["Tyler Brennan"], due: "Oct 22", progress: 100 },
  { title: "Driver shift summary", detail: "Stops, miles and receipts before clock-out", status: "todo", priority: "medium", people: ["Danielle Reyes"], due: "Nov 8", progress: 0 },
  { title: "Depot geofence alerts", detail: "Tell dispatch when a van reaches the gate", status: "blocked", priority: "critical", people: ["Marcus Whitfield"], due: "Oct 24", late: true, progress: 35 },
  { title: "Reroute around road closures", detail: "Pull closures into the route planner", status: "progress", priority: "medium", people: ["Priya Nair"], due: "Nov 5", progress: 40 },
  { title: "Fuel card receipt scan", detail: "Read the amount and the station", status: "todo", priority: "low", people: ["Nathan Okafor"], due: "Nov 19", progress: 0 },
];

const STAGES = [
  ["Backlog"],
  ["Planning"],
  ["Execution"],
  ["Testing"],
  ["Deployment", true],
  ["Merge", true],
  ["Review"],
  ["Completed"],
];

// Section stage: the Tasks screen with its KPIs, and one task's detail sheet open on the stage picker.
export function TasksStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[720px] opacity-90">
        <div className="flex flex-col gap-4 px-6 py-5">
          <ScreenTitle title="Tasks" description="Create, track and manage project tasks." action={<><Plus className="size-3.5" /> Create Task</>} />
          <StatStrip
            stats={[
              { label: "Total tasks", value: "32", footer: "11 done" },
              { label: "In progress", value: "9", footer: "Actively being worked" },
              { label: "Overdue", value: "2", footer: "Past the due date" },
              { label: "Completion", value: "34%", footer: "Share of tasks done" },
            ]}
          />
          <div className="flex items-center gap-2">
            <Select value="All statuses" className="w-[128px]" />
            <Select value="All priorities" className="w-[132px]" />
            <span className="ml-auto flex h-8 w-[190px] items-center gap-2 rounded-md border border-foreground/[0.12] px-2.5 text-[12px] text-muted-foreground">
              <Search className="size-3.5" /> Search tasks…
            </span>
          </div>
        </div>
        <div className={cn("grid grid-cols-[1fr_92px_70px_64px_52px_76px] items-center gap-3 border-y bg-foreground/[0.02] px-6 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Task</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Assignees</span>
          <span>Due</span>
          <span>Progress</span>
        </div>
        {TASKS.map((task) => (
          <div key={task.title} className={cn("grid grid-cols-[1fr_92px_70px_64px_52px_76px] items-center gap-3 border-b px-6 py-2.5", LINE)}>
            <span className="min-w-0">
              <span className="block truncate font-medium">{task.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{task.detail}</span>
            </span>
            <Status value={task.status} />
            <Severity value={task.priority} />
            <AvatarStack names={task.people} size={20} />
            <span className={cn("text-[12px] tabular-nums", task.late ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{task.due}</span>
            <span>
              <span className="block h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className="block h-full rounded-full bg-foreground/60" style={{ width: `${task.progress}%` }} />
              </span>
              <span className="mt-1 block text-[10px] text-muted-foreground tabular-nums">{task.progress}%</span>
            </span>
          </div>
        ))}
      </Window>
      <Window className="absolute top-[24px] left-[548px] z-[2] h-[640px] w-[452px]">
        <div className="px-6 pt-6">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.12] bg-foreground/[0.04]">
              <Zap className="size-[18px] text-foreground/80" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <div className="text-[19px] font-semibold tracking-[-0.01em]">Offline route cache</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">Opened Oct 14</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <Status value="progress" />
            <Severity value="high" />
            <Pill dot={false}>
              <Zap className="size-3" /> Feature
            </Pill>
            <Pill dot={false} tone="strong" className={styles.popIn} style={{ "--pop-delay": "1.2s" }}>
              Deploy · Running
            </Pill>
            <Pill dot={false}>
              <Gauge className="size-3" /> 60%
            </Pill>
          </div>
        </div>
        <div className={cn("mt-5 flex border-y bg-foreground/[0.02] px-6 text-[12px]", LINE)}>
          <span className="border-b-2 border-foreground px-1 py-2.5 font-medium">Details</span>
          <span className="px-3 py-2.5 text-muted-foreground">Comments 3</span>
        </div>
        <div className="px-6 py-5">
          <div className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Core</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select value="In Progress" />
            </div>
            <div>
              <FieldLabel>Stage</FieldLabel>
              <Select value="Deploy · Running" open />
            </div>
            <div>
              <FieldLabel>Priority</FieldLabel>
              <Select value="High" />
            </div>
            <div>
              <FieldLabel>Type</FieldLabel>
              <Select value="Feature" />
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[290px] left-[662px] z-[3] h-[260px] w-[314px]", styles.float)}>
        <div className={cn("absolute top-0 left-[136px] w-[178px] p-1", POPOVER)}>
          {STAGES.map(([label, group]) => (
            <div key={label} className={cn("flex items-center rounded-md px-2.5 py-1.5 text-[12px]", label === "Deployment" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
              {label}
              {group ? <ChevronRight className="ml-auto size-3.5 text-muted-foreground" /> : null}
            </div>
          ))}
        </div>
        <div className={cn("absolute top-[112px] left-0 w-[132px] p-1", POPOVER)}>
          {["Pending", "Running"].map((label) => (
            <div key={label} className={cn("flex items-center rounded-md px-2.5 py-1.5 text-[12px]", label === "Running" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
              {label}
              {label === "Running" ? <Check className="ml-auto size-3.5" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const QUEUE = [
  { title: "Driver shift summary", type: "feature", status: "progress", owner: "Danielle Reyes", due: "Today", today: true },
  { title: "Depot geofence alerts", type: "task", status: "blocked", owner: "Marcus Whitfield", due: "Oct 24", late: true },
  { title: "Retest photo upload on 3G", type: "bug", status: "todo", owner: "Tyler Brennan", due: "Today", today: true },
  { title: "Reroute around road closures", type: "feature", status: "progress", owner: "Priya Nair", due: "Nov 5" },
];

// Cell: the Work Queue's four numbers over the day's ordered work.
export function WorkQueueRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <StatStrip
        className="[&>div]:px-3 [&>div]:py-2.5"
        stats={[
          { label: "Queued", value: "14" },
          { label: "Due today", value: "3" },
          { label: "Overdue", value: "1", tone: "text-red-600 dark:text-red-400" },
          { label: "Progress", value: "46%" },
        ]}
      />
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {QUEUE.map((item, index) => (
          <div key={item.title} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.1}s` }}>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate font-medium">{item.title}</span>
                <span className="shrink-0 rounded border border-foreground/[0.12] px-1 text-[10px] text-muted-foreground capitalize">{item.type}</span>
              </span>
            </span>
            <Status value={item.status} />
            <Avatar name={item.owner} size={18} />
            <span className={cn("w-[42px] text-right text-[12px] tabular-nums", item.late ? "text-red-600 dark:text-red-400" : item.today ? "text-foreground" : "text-muted-foreground")}>{item.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cell: a queued item's actions, moving it on without opening it.
export function QueueActionsRender() {
  return (
    <div className="relative mx-auto h-[240px] w-[460px] text-[13px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {QUEUE.slice(2, 4).map((item, index) => (
          <div key={item.title} className={cn("flex items-center gap-3 border-b px-3.5 py-3 last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.title}</span>
              <span className="block text-[11px] text-muted-foreground">{item.owner}</span>
            </span>
            <Status value={item.status} />
            <span className={cn("flex size-7 items-center justify-center rounded-md", index === 0 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              <MoreHorizontal className="size-4" />
            </span>
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[56px] right-[8px] w-[220px] p-1", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.3s" }}>
        {[
          [Circle, "Mark in progress", true],
          [CheckCircle2, "Mark done"],
          [ArrowLeft, "Move back to to do"],
        ].map(([Icon, label, active]) => (
          <div key={label} className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-2", active ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
            <Icon className="size-3.5 text-muted-foreground" />
            {label}
          </div>
        ))}
        <div className={cn("my-1 border-t", LINE)} />
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-red-600 dark:text-red-400">
          <Trash2 className="size-3.5" /> Delete
        </div>
      </div>
    </div>
  );
}

const COLUMNS = [
  { key: "not_started", label: "Not Started", icon: Circle, accent: "border-t-foreground/35" },
  { key: "on_track", label: "On Track", icon: TrendingUp, accent: "border-t-emerald-500" },
  { key: "at_risk", label: "At Risk", icon: AlertTriangle, accent: "border-t-amber-500" },
  { key: "waiting", label: "Waiting on data", icon: null, accent: "border-t-foreground/60" },
  { key: "completed", label: "Completed", icon: CheckCircle2, accent: "border-t-foreground/60" },
];

const GOALS = {
  not_started: [{ title: "Self-serve depot onboarding", description: "Depots add their own gates and hours", results: "0/3", progress: 0, owner: "Marcus Whitfield", date: "Jan 30" }],
  on_track: [
    { title: "Cut failed deliveries by 20%", description: "Proof of delivery on every drop", results: "2/3", progress: 67, owner: "Danielle Reyes", date: "Dec 1" },
    { title: "Routes that survive dead zones", description: "Offline sheets and a held GPS fix", results: "1/2", progress: 50, owner: "Nathan Okafor", date: "Nov 30" },
  ],
  at_risk: [{ title: "Dispatch sees every ETA live", description: "Drift under two minutes on the map", results: "1/4", progress: 25, owner: "Priya Nair", date: "Nov 15" }],
  waiting: [{ title: "Fuel spend per route", description: "Needs the card provider's export", results: "0/2", progress: 10, owner: "Tyler Brennan", date: "Dec 20" }],
  completed: [{ title: "Drivers sign in once a shift", description: "One sign-in, kept until clock-out", results: "3/3", progress: 100, owner: "Priya Nair", date: "Oct 10" }],
};

function GoalCard({ goal, className, style }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.09] bg-surface-card p-3 text-[12px] dark:bg-foreground/[0.03]", className)} style={style}>
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] leading-[1.35] font-medium">{goal.title}</div>
          <div className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{goal.description}</div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Target className="size-3" /> {goal.results} key results
        </span>
        <span className="tabular-nums">{goal.progress}%</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
        <span className={cn("block h-full origin-left rounded-full", goal.progress === 100 ? "bg-emerald-500" : "bg-foreground/55", styles.fill)} style={{ width: `${goal.progress}%` }} />
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" /> {goal.date}
        </span>
        <Avatar name={goal.owner} size={16} />
      </div>
    </div>
  );
}

// Section stage: an objective's goals on a board with a custom column, one card mid-drag and a new column being named.
export function ObjectivesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[1000px]">
        <div className={cn("flex items-center gap-3 border-b px-6 py-4", LINE)}>
          <ArrowLeft className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Objectives</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-[15px] font-semibold">Launch the route planner</span>
          <Pill tone="emerald">On Track</Pill>
          <span className="ml-auto flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className="block h-full w-[48%] rounded-full bg-foreground/60" />
              </span>
              48%
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" /> Dec 15
            </span>
            <Avatar name="Priya Nair" size={20} />
          </span>
        </div>
        <div className="flex gap-2.5 px-5 py-5">
          {COLUMNS.map((column) => {
            const Icon = column.icon;
            const goals = GOALS[column.key];
            return (
              <div key={column.key} className={cn("flex w-[160px] shrink-0 flex-col gap-2 rounded-xl border-t-2 bg-foreground/[0.025] p-2", column.accent)}>
                <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px]">
                  {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : <span className="size-2 rounded-full bg-foreground/50" />}
                  <span className="truncate font-medium">{column.label}</span>
                  <span className="text-muted-foreground">{goals.length}</span>
                  <Plus className="ml-auto size-3.5 text-muted-foreground" />
                </div>
                {goals.map((goal) => (
                  <GoalCard key={goal.title} goal={goal} className={column.key === "at_risk" ? "opacity-40" : undefined} />
                ))}
              </div>
            );
          })}
          <div className="flex w-[120px] shrink-0 flex-col gap-2">
            <div className="rounded-xl border border-foreground/30 bg-foreground/[0.03] p-2 text-[12px] ring-2 ring-foreground/10">
              <Typed text="Needs sign-off" delay={1.6} />
            </div>
            <span className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-foreground/20 py-2 text-[12px] text-muted-foreground">
              <Plus className="size-3.5" /> New Column
            </span>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[232px] left-[452px] z-[2] w-[160px] rotate-[3deg]", styles.float)}>
        <GoalCard goal={GOALS.at_risk[0]} className="border-foreground/25 bg-surface-card shadow-2xl shadow-black/40 dark:bg-surface-dialog" />
      </div>
    </div>
  );
}

const KEY_RESULTS = [
  ["Photo proof on every drop", true],
  ["Retry uploads after reconnecting", true],
  ["Signature on handover", false],
];

// Cell: one goal with its key results ticked off by the tasks behind them.
export function KeyResultsRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.09] bg-surface-card p-5 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
          <Target className="size-4 text-foreground/80" strokeWidth={1.75} />
        </span>
        <span className="text-[15px] font-medium">Cut failed deliveries by 20%</span>
        <Pill tone="emerald" className="ml-auto">
          On Track
        </Pill>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[12px] text-muted-foreground">
        <Avatar name="Danielle Reyes" size={18} />
        Danielle Reyes
        <span className="mx-1">·</span>
        Target Dec 1
        <span className="ml-auto text-foreground/85 tabular-nums">67%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
        <span className={cn("block h-full w-[67%] origin-left rounded-full bg-emerald-500", styles.fill)} />
      </div>
      <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-medium">Key results</span>
        <span className="tabular-nums">2/3</span>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        {KEY_RESULTS.map(([label, done], index) => (
          <div key={label} className={cn("flex items-center gap-2.5 rounded-lg border border-foreground/[0.08] px-3 py-2 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.12}s` }}>
            {done ? <CheckCircle2 className="size-4 text-emerald-500" strokeWidth={2} /> : <Circle className="size-4 text-muted-foreground" strokeWidth={1.75} />}
            <span className={done ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90"}>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-1.5 text-[11px] text-muted-foreground">
        <span className="rounded-md border border-foreground/[0.1] px-2 py-0.5">Track: Tasks count</span>
        <span className="rounded-md border border-foreground/[0.1] px-2 py-0.5">Target: Dynamic</span>
      </div>
    </div>
  );
}

const MILESTONES = [
  { title: "Route planner beta", tasks: "7/9 tasks", status: ["On Track", "emerald"], progress: 78, date: "Nov 8" },
  { title: "Proof of delivery 2.0", tasks: "12/12 tasks", status: ["Completed", "strong"], progress: 100, date: "Oct 18" },
  { title: "Dispatch map refresh", tasks: "3/8 tasks", status: ["At Risk", "amber"], progress: 38, date: "Oct 25", overdue: true },
];

// Cell: milestones as collections of tasks, with their completion and the one that is overdue.
export function MilestonesRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <StatStrip
        className="[&>div]:px-3 [&>div]:py-2.5"
        stats={[
          { label: "Total milestones", value: "6" },
          { label: "Task completion", value: "58%" },
          { label: "Overdue", value: "1", tone: "text-red-600 dark:text-red-400" },
          { label: "Tasks in scope", value: "41" },
        ]}
      />
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {MILESTONES.map((milestone, index) => (
          <div key={milestone.title} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE)}>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{milestone.title}</span>
              <span className="block text-[11px] text-muted-foreground">{milestone.tasks}</span>
            </span>
            {milestone.overdue ? <Pill tone="red">Overdue</Pill> : <Pill tone={milestone.status[1]}>{milestone.status[0]}</Pill>}
            <span className="flex w-[78px] items-center gap-1.5">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className={cn("block h-full origin-left rounded-full bg-foreground/55", styles.fill)} style={{ width: `${milestone.progress}%`, "--fill-delay": `${0.4 + index * 0.15}s` }} />
              </span>
              <span className="w-7 text-right text-[10px] text-muted-foreground tabular-nums">{milestone.progress}%</span>
            </span>
            <span className={cn("w-[42px] text-right text-[12px] tabular-nums", milestone.overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{milestone.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const INFRA = [
  {
    category: "Backend",
    total: "$5,900",
    items: [
      ["API Gateway", "$1,200"],
      ["Routing API", "$2,400"],
      ["Worker", "$2,300"],
    ],
  },
  {
    category: "Data",
    total: "$4,340",
    items: [
      ["Primary DB", "$3,100"],
      ["Cache", "$640"],
      ["Object Storage", "$600"],
    ],
  },
];

const BUDGET_METRICS = [
  { label: "Budget used", value: "80%", detail: "$38,580 of $48,000 committed" },
  { label: "Forecast", value: "$44.1k", detail: "92% of monthly budget" },
  { label: "Variance", value: "−$3.9k", detail: "Under current plan", tone: "text-emerald-600 dark:text-emerald-400" },
  { label: "Watch items", value: "2", detail: "$463k annual run-rate", tone: "text-red-600 dark:text-red-400" },
];

const NODES = [
  { id: "app", label: "Driver App", meta: "Mobile App", icon: Smartphone, x: 10, y: 16 },
  { id: "gateway", label: "API Gateway", meta: "Backend", icon: Network, x: 10, y: 98 },
  { id: "routing", label: "Routing API", meta: "Microservice", icon: Route, x: 128, y: 98, selected: true },
  { id: "cache", label: "Cache", meta: "Data", icon: DatabaseZap, x: 10, y: 190 },
  { id: "db", label: "Primary DB", meta: "Transactional", icon: Database, x: 128, y: 190 },
];

// Section stage: the Budget Tracker's numbers and infrastructure rollup, with a costed node open on the architecture canvas.
export function BudgetStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-[40px] left-0 h-[640px] w-[720px] opacity-95">
        <div className="flex flex-col gap-4 px-6 py-5">
          <ScreenTitle
            title="Budget Tracker"
            description="Set the monthly project budget, track actual spend, forecast run-rate, and roll System Architecture nodes into infrastructure expense."
            action={
              <>
                <Plus className="size-3.5" /> Add cost line
              </>
            }
          />
          <div className="grid grid-cols-[220px_1fr] gap-3">
            <Card title="Monthly budget" description="Planning guardrail for current scope">
              <div className="px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Approved monthly budget</div>
                <div className="mt-1 flex h-8 items-center rounded-md border border-foreground/[0.12] px-2.5 text-[13px] tabular-nums">$48,000</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
                  <span className={cn("block h-full w-[80%] origin-left rounded-full bg-emerald-500", styles.fill)} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg border border-foreground/[0.08] px-2.5 py-2">
                    <div className="text-muted-foreground">Remaining</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">$9,420</div>
                  </div>
                  <div className="rounded-lg border border-foreground/[0.08] px-2.5 py-2">
                    <div className="text-muted-foreground">Health</div>
                    <div className="mt-0.5 text-[13px] font-semibold">Healthy</div>
                  </div>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {BUDGET_METRICS.map((metric, index) => (
                <div key={metric.label} className={cn("rounded-xl border bg-foreground/[0.015] px-4 py-3", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
                  <div className="text-[11px] text-muted-foreground">{metric.label}</div>
                  <div className={cn("mt-1 text-[22px] font-medium tracking-[-0.01em] tabular-nums", metric.tone)}>{metric.value}</div>
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{metric.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <Card
            title="Infrastructure expense"
            description="A single budget rollup generated from every costed System Architecture node."
            action={
              <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2 text-[12px] tabular-nums">
                <ChevronDown className="size-3.5" /> $12,640
              </span>
            }
          >
            <div className={cn("grid grid-cols-3 gap-3 border-b px-4 py-3", LINE)}>
              {[
                ["Monthly infra", "$12,640"],
                ["Costed nodes", "9"],
                ["Annual run-rate", "$151.7k"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-foreground/[0.08] px-3 py-2">
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-[16px] font-semibold tabular-nums">{value}</div>
                </div>
              ))}
            </div>
            {INFRA.map((group) => (
              <div key={group.category}>
                <div className="flex items-center justify-between bg-foreground/[0.025] px-4 py-1.5 text-[11px]">
                  <span className="font-semibold tracking-wide text-muted-foreground uppercase">{group.category}</span>
                  <span className="text-muted-foreground tabular-nums">{group.total} / mo</span>
                </div>
                {group.items.map(([label, cost]) => (
                  <div key={label} className={cn("flex items-center gap-3 border-t px-4 py-2 text-[12px]", LINE, label === "Routing API" && "bg-foreground/[0.04]")}>
                    <Cpu className="size-3.5 text-muted-foreground" />
                    <span className="flex-1">{label}</span>
                    <span className="text-[11px] text-muted-foreground">Canvas</span>
                    <span className="w-[60px] text-right tabular-nums">{cost}</span>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </div>
      </Window>
      <Window title="System Architecture" icon={Network} className={cn("absolute top-0 left-[576px] z-[2] h-[340px] w-[420px]", styles.float)}>
        <div className="flex flex-1">
          <div className="relative flex-1" style={CANVAS_DOTS}>
            <svg className="absolute inset-0 size-full text-foreground" fill="none" aria-hidden="true">
              <path d="M64 60 V98" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" className={styles.flow} />
              <path d="M118 120 H128" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" className={styles.flow} />
              <path d="M182 142 V190" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" className={styles.flow} />
              <path d="M150 142 C 130 164, 76 166, 64 190" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" className={styles.flow} />
            </svg>
            {NODES.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className={cn("absolute w-[108px] rounded-lg border bg-surface-card px-2 py-1.5 text-[11px] dark:bg-surface-dialog", node.selected ? "border-foreground/50 ring-2 ring-foreground/15" : "border-foreground/[0.14]")}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span className="truncate font-medium">{node.label}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{node.meta}</div>
                </div>
              );
            })}
          </div>
          <div className={cn("w-[166px] shrink-0 border-l px-3.5 py-3.5 text-[12px]", LINE)}>
            <div className="font-semibold">Routing API</div>
            <div className="text-[11px] text-muted-foreground">Microservice</div>
            <div className="mt-3 flex items-start gap-2">
              <span className="min-w-0 flex-1 text-[11px] leading-4 font-semibold">Track as infrastructure expense</span>
              <Toggle on />
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">Monthly infrastructure cost</div>
            <div className="mt-1.5 grid grid-cols-2 gap-0.5 rounded-md bg-foreground/[0.05] p-0.5 text-[11px]">
              <span className="rounded bg-surface-card py-0.5 text-center font-medium shadow-sm dark:bg-foreground/[0.1]">Month</span>
              <span className="py-0.5 text-center text-muted-foreground">Year</span>
            </div>
            <div className="mt-2 flex h-8 items-center rounded-md border border-foreground/[0.12] px-2.5 tabular-nums">$2,400</div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              <div className="rounded-lg border border-foreground/[0.08] px-2 py-1.5">
                <div className="text-[10px] text-muted-foreground">Monthly</div>
                <div className="text-[11px] font-semibold tabular-nums">$2,400</div>
              </div>
              <div className="rounded-lg border border-foreground/[0.08] px-2 py-1.5">
                <div className="text-[10px] text-muted-foreground">Annual</div>
                <div className="text-[11px] font-semibold tabular-nums">$28,800</div>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}

const REQUESTS = [
  { request: "A second QA tester for the route planner", meta: "Danielle Reyes · QA · Requested Oct 22", status: ["Pending", "amber"], open: true },
  { request: "Device lab time for older Android phones", meta: "Tyler Brennan · QA tooling · Requested Oct 19", status: ["Approved", "emerald"] },
  { request: "A contract designer for the dispatch map", meta: "Priya Nair · Designer · Requested Oct 12", status: ["Denied", "red"] },
];

function Tabs({ tabs, active }) {
  return (
    <div className="grid w-fit grid-flow-col gap-0.5 rounded-lg bg-foreground/[0.05] p-0.5 text-[12px]">
      {tabs.map((tab) => (
        <span key={tab} className={cn("rounded-md px-3 py-1", tab === active ? "bg-surface-card font-medium shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
          {tab}
        </span>
      ))}
    </div>
  );
}

// Cell: resource requests waiting on a decision, with Approve and Deny on the pending one.
export function RequestsRender() {
  return (
    <div className="relative mx-auto h-[240px] w-[460px] text-[13px]">
      <Tabs tabs={["Allocations", "Requests"]} active="Requests" />
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {REQUESTS.map((item) => (
          <div key={item.request} className={cn("flex items-center gap-3 border-b px-3.5 py-3 last:border-b-0", LINE, item.open && "bg-foreground/[0.04]")}>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.request}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{item.meta}</span>
            </span>
            <Pill tone={item.status[1]}>{item.status[0]}</Pill>
            <MoreHorizontal className={cn("size-4", item.open ? "text-foreground" : "text-muted-foreground")} />
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[96px] right-[6px] w-[170px] p-1", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="flex items-center gap-2.5 rounded-md bg-foreground/[0.08] px-2.5 py-2 text-foreground">
          <Check className="size-3.5 text-emerald-500" /> Approve
        </div>
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-foreground/80">
          <X className="size-3.5 text-muted-foreground" /> Deny
        </div>
        <div className={cn("my-1 border-t", LINE)} />
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-red-600 dark:text-red-400">
          <Trash2 className="size-3.5" /> Delete
        </div>
      </div>
    </div>
  );
}

const ALLOCATIONS = [
  { member: "Nathan Okafor", role: "Mobile engineer", status: ["Active", "emerald"], load: 90, dates: "Oct 1 – Dec 15" },
  { member: "Priya Nair", role: "Tech lead", status: ["Active", "emerald"], load: 70, dates: "Sep 1 – Dec 15" },
  { member: "Tyler Brennan", role: "QA", status: ["Planned", "neutral"], load: 50, dates: "Nov 3 – Dec 15" },
  { member: "Marcus Whitfield", role: "Backend engineer", status: ["Completed", "strong"], load: 40, dates: "Aug 4 – Oct 10" },
];

// Cell: who is on the project, how loaded they are, and when.
export function AllocationsRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className="flex items-center gap-3">
        <Tabs tabs={["Allocations", "Requests"]} active="Allocations" />
        <span className="ml-auto text-[12px] text-muted-foreground">
          Total load <span className="font-medium text-foreground tabular-nums">250%</span> · 1 over 80%
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {ALLOCATIONS.map((row, index) => {
          const high = row.load > 80 && row.status[0] !== "Completed";
          return (
            <div key={row.member} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE)}>
              <Avatar name={row.member} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{row.member}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {row.role} · {row.dates}
                </span>
              </span>
              <Pill tone={row.status[1]}>{row.status[0]}</Pill>
              <span className="w-[70px]">
                <span className="block h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                  <span className={cn("block h-full origin-left rounded-full", high ? "bg-red-500" : "bg-foreground/55", styles.fill)} style={{ width: `${row.load}%`, "--fill-delay": `${0.3 + index * 0.12}s` }} />
                </span>
                <span className={cn("mt-1 block text-[10px] tabular-nums", high ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{row.load}%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LOGS = [
  ["info", 'Created task "Driver shift summary"', "tasks", "10:42"],
  ["info", "Updated issue status → Resolved", "issues", "10:31"],
  ["warning", 'Deleted milestone "Depot pilot"', "milestones", "09:58"],
  ["info", 'Created goal "Fuel spend per route"', "goals", "09:20"],
  ["info", "Updated task stage → Testing", "tasks", "Yesterday"],
];

const LEVEL_TONE = { info: ["Info", "neutral"], warning: ["Warning", "amber"] };

// Cell: the log Flow writes as work is created, changed and deleted.
export function LogsRender() {
  return (
    <div className="relative mx-auto h-[260px] w-[460px] text-[12px]">
      <div className="flex items-center gap-2">
        <Select value="All levels" className="w-[120px]" />
        <span className="flex h-8 flex-1 items-center gap-2 rounded-md border border-foreground/[0.12] px-2.5 text-muted-foreground">
          <Search className="size-3.5" /> Search logs…
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {LOGS.map(([level, message, source, time], index) => (
          <div key={message} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
            <Pill tone={LEVEL_TONE[level][1]} className="w-[74px] justify-center">
              {LEVEL_TONE[level][0]}
            </Pill>
            <span className="min-w-0 flex-1 truncate text-foreground/90">{message}</span>
            <span className="rounded border border-foreground/[0.1] px-1.5 text-[10px] text-muted-foreground">{source}</span>
            <span className="w-[54px] text-right text-[11px] text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STORAGE = [
  ["Image", 46, "1.9 GB", "bg-foreground/70"],
  ["Video", 18, "1.4 GB", "bg-foreground/45"],
  ["Document", 63, "820 MB", "bg-foreground/30"],
  ["Archive", 7, "410 MB", "bg-foreground/18"],
];

// Cell: the project's files, split by type, with the sort menu open.
export function AssetsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[12px]">
      <div className="rounded-xl border border-foreground/[0.09] bg-surface-card p-4 dark:bg-surface-subtle">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Storage by type</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">4.5 GB total</span>
        </div>
        <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
          {[
            ["Image", 1.9],
            ["Video", 1.4],
            ["Document", 0.82],
            ["Archive", 0.41],
          ].map(([label, size], index) => (
            <span key={label} className={cn("origin-left", STORAGE[index][3], styles.fill)} style={{ flexGrow: size, "--fill-delay": `${0.2 + index * 0.1}s` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
          {STORAGE.map(([label, count, size, tone]) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className={cn("size-2 rounded-full", tone)} />
              <span className="font-medium text-foreground/85">{label}</span>
              <span className="tabular-nums">
                {count} · {size}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-muted-foreground">131 assets</span>
        <Select value="Largest first" open className="ml-auto w-[140px]" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["harbour-tunnel-ride.mp4", "412 MB"],
          ["depot-gates-north.zip", "180 MB"],
          ["route-planner-flows.pdf", "24 MB"],
        ].map(([name, size]) => (
          <div key={name} className="overflow-hidden rounded-lg border border-foreground/[0.09]">
            <div className="h-[46px] bg-[radial-gradient(80%_100%_at_30%_0%,color-mix(in_oklab,var(--foreground)_16%,transparent),transparent_70%)] bg-foreground/[0.05]" />
            <div className="px-2 py-1.5">
              <div className="truncate text-[11px]">{name}</div>
              <div className="text-[10px] text-muted-foreground tabular-nums">{size}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[170px] right-0 w-[150px] p-1", POPOVER)}>
        {["Newest first", "Oldest first", "Largest first", "Name A–Z"].map((label) => (
          <div key={label} className={cn("flex items-center rounded-md px-2.5 py-1.5", label === "Largest first" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
            {label}
            {label === "Largest first" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
