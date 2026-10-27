import {
  Box,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Inbox,
  Kanban,
  LayoutList,
  Plus,
  Repeat,
  Search,
  SlidersHorizontal,
  SquareStack,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Chip, Kbd, LINE, PriorityIcon, StatusIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import { Checkbox, Health, Pill, POPOVER, ProgressRing, Toggle, TrackerRail } from "@/components/product-pages/apps/flow/flow_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Flow's issue tracker for Orbital Freight's product team: the list, an open issue, triage, cycles and the roadmap.

const STATE_LABEL = { progress: "In Progress", review: "In Review", todo: "Todo", backlog: "Backlog", done: "Done" };

const ISSUES = [
  { id: "ORB-118", title: "Turn-by-turn voice cuts out in tunnels", status: "progress", priority: "urgent", assignee: "Priya Nair", labels: ["bug", "navigation"], division: "Driver app", due: "Oct 29" },
  { id: "ORB-112", title: "Offline route sheets for dead zones", status: "progress", priority: "high", assignee: "Nathan Okafor", labels: ["offline"], division: "Driver app", due: "Nov 1" },
  { id: "ORB-126", title: "Live ETA drift on the dispatch map", status: "progress", priority: "medium", assignee: "Danielle Reyes", labels: ["realtime"], division: "Dispatch console", due: "Nov 4" },
  { id: "ORB-121", title: "Proof-of-delivery photo retries on reconnect", status: "review", priority: "high", assignee: "Tyler Brennan", labels: ["bug"], division: "Driver app", due: "Oct 28" },
  { id: "ORB-124", title: "Reassign a stop between two drivers", status: "review", priority: "medium", assignee: "Marcus Whitfield", labels: ["feature"], division: "Dispatch console" },
  { id: "ORB-127", title: "Reorder stops by dragging the route list", status: "todo", priority: "medium", assignee: "Nathan Okafor", labels: ["feature"], division: "Driver app", due: "Nov 6" },
  { id: "ORB-133", title: "Shift summary before clock-out", status: "todo", priority: "high", assignee: null, labels: ["feature"], division: "Driver app" },
  { id: "ORB-130", title: "Fuel card receipts on the shift report", status: "todo", priority: "low", assignee: "Priya Nair", labels: ["billing"], division: "Billing", due: "Nov 12" },
  { id: "ORB-135", title: "Depot gate codes on the stop card", status: "todo", priority: "medium", assignee: "Tyler Brennan", labels: [], division: "Driver app" },
  { id: "ORB-138", title: "Night mode for the route map", status: "backlog", priority: "low", assignee: null, labels: ["design"], division: "Driver app" },
  { id: "ORB-139", title: "Monthly CSV export for fleet clients", status: "backlog", priority: "none", assignee: null, labels: ["billing"], division: "Billing" },
];

const byId = (id) => ISSUES.find((issue) => issue.id === id);

function GroupRow({ status, count, className }) {
  return (
    <div className={cn("flex h-9 items-center gap-2 border-b bg-foreground/[0.025] px-5 text-[12px]", LINE, className)}>
      <StatusIcon status={status} />
      <span className="font-medium text-foreground/90">{STATE_LABEL[status]}</span>
      <span className="text-muted-foreground tabular-nums">{count}</span>
      <Plus className="ml-auto size-3.5 text-muted-foreground" />
    </div>
  );
}

// One row of the tracker list with Flow's default properties: priority, ID, status, title, labels, division, due date and assignee.
function TrackerRow({ issue, focused = false, compact = false }) {
  return (
    <div className={cn("relative flex h-10 items-center gap-3 border-b px-5 text-[13px]", LINE, focused && "bg-foreground/[0.045]")}>
      {focused ? <span className="absolute inset-y-0 left-0 w-[2px] bg-foreground/70" /> : null}
      <PriorityIcon level={issue.priority} />
      <span className="w-[58px] shrink-0 text-[12px] text-muted-foreground tabular-nums">{issue.id}</span>
      <StatusIcon status={issue.status} />
      <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
      {!compact
        ? issue.labels.map((label) => (
            <Chip key={label} dot="neutral" className="h-5 px-2 text-[11px] text-muted-foreground">
              {label}
            </Chip>
          ))
        : null}
      {!compact ? (
        <span className="inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border border-foreground/[0.1] px-2 text-[11px] text-muted-foreground">
          <Box className="size-3" strokeWidth={2} />
          {issue.division}
        </span>
      ) : null}
      {issue.due ? <span className="w-[42px] shrink-0 text-right text-[12px] text-muted-foreground tabular-nums">{issue.due}</span> : <span className="w-[42px] shrink-0" />}
      {issue.assignee ? <Avatar name={issue.assignee} size={18} /> : <span className="size-[18px] shrink-0 rounded-full border border-dashed border-foreground/30" />}
    </div>
  );
}

function ViewTabs({ tabs, active }) {
  return (
    <span className="flex gap-1 text-[12px]">
      {tabs.map((tab) => (
        <span key={tab} className={cn("rounded-md border px-2 py-0.5", tab === active ? "border-foreground/[0.12] bg-foreground/[0.06] text-foreground" : "border-transparent text-muted-foreground")}>
          {tab}
        </span>
      ))}
    </span>
  );
}

function DisplayButton() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2 py-1 text-[12px] text-muted-foreground">
      <SlidersHorizontal className="size-3.5" /> Display
    </span>
  );
}

const SEARCH_RESULTS = [
  { id: "ORB-118", title: "Turn-by-turn voice cuts out in tunnels", status: "progress" },
  { id: "ORB-151", title: "Map tiles fail to load inside tunnels", status: "backlog" },
  { id: "ORB-143", title: "Hold the last GPS fix through a tunnel", status: "todo" },
];

// The hero's tilted plane: the ORB team's issues grouped by status, with ⌘K searching across them.
export function TrackerWindow() {
  const groups = ["progress", "review", "todo", "backlog"];
  return (
    <Window className="h-[700px] w-[1180px] flex-row">
      <div className="flex h-full w-full">
        <TrackerRail active="Issues" />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <SquareStack className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="text-muted-foreground">ORB</span>
            <span className="text-muted-foreground/60">›</span>
            <span className="font-medium">Issues</span>
            <span className="ml-4">
              <ViewTabs tabs={["All issues", "Active", "Backlog"]} active="All issues" />
            </span>
            <span className="ml-auto flex items-center gap-2">
              <DisplayButton />
              <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
                <Plus className="size-3.5" /> New issue
              </span>
            </span>
          </div>
          <div className={cn("flex h-10 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <Chip dashed icon={Plus} className="h-6 text-[11px] text-muted-foreground">
              Filter
            </Chip>
            <span className="ml-auto text-[12px] text-muted-foreground">11 issues</span>
          </div>
          {groups.map((status) => {
            const rows = ISSUES.filter((issue) => issue.status === status);
            return (
              <div key={status}>
                <GroupRow status={status} count={rows.length} />
                {rows.map((issue) => (
                  <TrackerRow key={issue.id} issue={issue} focused={issue.id === "ORB-118"} />
                ))}
              </div>
            );
          })}
          <div className={cn("absolute top-[104px] left-[400px] z-[2] w-[480px] overflow-hidden", POPOVER)}>
            <div className={cn("flex items-center gap-2.5 border-b px-4 py-3.5", LINE)}>
              <Search className="size-4 text-muted-foreground" />
              <Typed text="tunnel" delay={1.4} className="text-foreground" />
              <span className="ml-auto">
                <Kbd>⌘K</Kbd>
              </span>
            </div>
            <div className="p-1.5">
              <div className="px-2.5 pt-1.5 pb-1 text-[11px] text-muted-foreground">Issues</div>
              {SEARCH_RESULTS.map((result, index) => (
                <div
                  key={result.id}
                  className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80", styles.popIn)}
                  style={{ "--pop-delay": `${1.9 + index * 0.1}s` }}
                >
                  <StatusIcon status={result.status} />
                  <span className="w-[58px] shrink-0 text-[12px] text-muted-foreground tabular-nums">{result.id}</span>
                  <span className="truncate">{result.title}</span>
                  {index === 0 ? (
                    <span className="ml-auto">
                      <Kbd>↵</Kbd>
                    </span>
                  ) : null}
                </div>
              ))}
              <div className={cn("mt-1 border-t px-2.5 pt-2 pb-1 text-[11px] text-muted-foreground", LINE)}>Navigate</div>
              {[
                [Inbox, "Triage", ["G", "T"]],
                [Repeat, "Cycles", ["G", "C"]],
              ].map(([Icon, label, keys]) => (
                <div key={label} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-foreground/70">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {label}
                  <span className="ml-auto flex gap-1">
                    {keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

function Property({ label, active = false, children }) {
  return (
    <div className="flex items-center gap-3 py-[5px]">
      <span className="w-[72px] shrink-0 text-muted-foreground">{label}</span>
      <span className={cn("-mx-1.5 flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-foreground/90", active && "bg-foreground/[0.07] ring-1 ring-foreground/15")}>{children}</span>
    </div>
  );
}

function Comment({ name, time, children, className, style }) {
  return (
    <div className={cn("flex gap-2.5", className)} style={style}>
      <Avatar name={name} size={24} className="mt-0.5" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 text-[12px]">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
        <p className="mt-1 leading-6 text-foreground/85">{children}</p>
      </div>
    </div>
  );
}

const PEOPLE = ["Priya Nair", "Nathan Okafor", "Tyler Brennan", "Marcus Whitfield", "Danielle Reyes"];

// Section stage: ORB-118 open with its comments and property rail, and the assignee picker dropped over it.
export function IssueStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-[16px] left-0 h-[660px] w-[820px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5 text-[13px]", LINE)}>
          <span className="text-muted-foreground">Issues</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium">ORB-118</span>
          <span className="ml-auto flex items-center gap-3 text-muted-foreground">
            <span className="text-[12px] tabular-nums">
              <span className="text-foreground/80">1</span> / 11
            </span>
            <ChevronUp className="size-4" />
            <ChevronDown className="size-4" />
            <span className="tracking-widest">•••</span>
            <X className="size-4" />
          </span>
        </div>
        <div className="flex flex-1">
          <div className="min-w-0 flex-1 px-9 py-8">
            <h4 className="text-[22px] font-medium tracking-[-0.01em]">Turn-by-turn voice cuts out in tunnels</h4>
            <p className="mt-3 max-w-[30rem] text-[14px] leading-relaxed text-muted-foreground">
              When the phone loses GPS in a tunnel, the next instruction never plays. Drivers on the Harbour route miss the exit straight after the long tunnel. Queue the instruction from the last known fix instead.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Comment name="Danielle Reyes" time="2d">
                Three drivers reported it this week, all on the Harbour route. Recording attached in the thread.
              </Comment>
              <Comment name="Nathan Okafor" time="3h" className={styles.popIn} style={{ "--pop-delay": "0.5s" }}>
                It shares a cause with ORB-143. Priya, can you take this one? I&apos;ll hold the GPS fix side.
              </Comment>
            </div>
            <div className="mt-6 rounded-xl border border-foreground/[0.1]">
              <div className="px-3.5 pt-3 pb-8 text-muted-foreground">Leave a comment...</div>
              <div className="flex justify-end px-2 pb-2">
                <span className="flex h-7 items-center rounded-md bg-foreground/15 px-3 text-[12px] text-foreground/60">Comment</span>
              </div>
            </div>
          </div>
          <div className={cn("w-[268px] shrink-0 border-l px-5 py-5 text-[12px]", LINE)}>
            <Property label="Status">
              <StatusIcon status="progress" /> In Progress
            </Property>
            <Property label="Priority">
              <PriorityIcon level="urgent" /> Urgent
            </Property>
            <Property label="Assignees" active>
              <Avatar name="Priya Nair" size={16} /> Priya Nair
            </Property>
            <Property label="Labels">
              <Chip dot="neutral" className="h-5 px-2 text-[11px]">
                bug
              </Chip>
              <Chip dot="neutral" className="h-5 px-2 text-[11px]">
                navigation
              </Chip>
            </Property>
            <Property label="Division">
              <Box className="size-3.5 text-muted-foreground" /> Driver app
            </Property>
            <Property label="Cycle">
              <Repeat className="size-3.5 text-muted-foreground" /> <span className="truncate">Cycle 14 — Route planner</span>
            </Property>
            <Property label="Estimate">
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-foreground/[0.1] px-1 text-[11px] text-muted-foreground">3</span> points
            </Property>
            <Property label="Due date">
              <Calendar className="size-3.5 text-muted-foreground" /> Oct 29
            </Property>
            <div className={cn("my-4 border-t", LINE)} />
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
              <span>Created Oct 25 by Danielle Reyes</span>
              <span>Updated just now</span>
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[176px] left-[735px] z-[3] w-[255px]", styles.float)}>
        <div className={cn("overflow-hidden", POPOVER)}>
          <div className={cn("flex items-center border-b px-3.5 py-3 text-muted-foreground", LINE)}>
            <span className={cn("text-foreground", styles.caret)} />
            <span className="ml-1">Assign to...</span>
          </div>
          <div className="p-1.5 text-[13px]">
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-foreground/70">
              <User className="size-4 text-muted-foreground" /> No assignee
            </div>
            {PEOPLE.map((name, index) => (
              <div key={name} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
                <Avatar name={name} size={18} />
                {name}
                {index === 0 ? <Check className={cn("ml-auto size-4", styles.popIn)} style={{ "--pop-delay": "0.9s" }} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const GOTO = [
  ["I", "Inbox"],
  ["M", "My Issues"],
  ["A", "All issues"],
  ["T", "Triage"],
  ["C", "Cycles"],
  ["D", "Divisions"],
  ["V", "Views"],
  ["R", "Initiatives"],
  ["S", "Settings"],
];

function Key({ children, pressed = false, className }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md border text-[12px] font-medium",
        pressed ? "border-foreground bg-foreground text-background" : "border-foreground/[0.14] bg-foreground/[0.04] text-foreground/85 shadow-[0_1px_0_0_rgb(0_0_0/0.15)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Cell: G then a letter, and the nine screens it reaches.
export function GotoRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
        <Key pressed>G</Key>
        then
        <span className="h-px flex-1 bg-foreground/[0.1]" />
        <span className="text-[12px]">go to</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {GOTO.map(([key, label], index) => (
          <div
            key={key}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px]",
              key === "T" ? "border-foreground/25 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.08] bg-surface-card text-foreground/80 dark:bg-surface-subtle",
              styles.popIn,
            )}
            style={{ "--pop-delay": `${0.15 + index * 0.06}s` }}
          >
            <Key className="size-6 text-[11px]">{key}</Key>
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
      <div className={cn("mt-4 flex items-center gap-5 border-t pt-4 text-[12px] text-muted-foreground", LINE)}>
        <span className="flex items-center gap-2">
          <Kbd>C</Kbd> New issue
        </span>
        <span className="flex items-center gap-2">
          <Kbd>⌘K</Kbd> Search and commands
        </span>
      </div>
    </div>
  );
}

// Cell: J and K walk the list, X selects, and the bulk bar acts on the selection.
export function SelectRender() {
  const rows = ["ORB-133", "ORB-127", "ORB-135", "ORB-130"].map(byId);
  const selected = ["ORB-127", "ORB-135"];
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Kbd>J</Kbd>
          <Kbd>K</Kbd> move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>X</Kbd> select
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> open
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <GroupRow status="todo" count={4} className="px-4" />
        {rows.map((issue) => {
          const isSelected = selected.includes(issue.id);
          const focused = issue.id === "ORB-135";
          return (
            <div key={issue.id} className={cn("relative flex h-10 items-center gap-2.5 border-b px-4 text-[13px] last:border-b-0", LINE, isSelected && "bg-foreground/[0.04]")}>
              {focused ? <span className="absolute inset-y-0 left-0 w-[2px] bg-foreground/70" /> : null}
              <Checkbox checked={isSelected} />
              <PriorityIcon level={issue.priority} />
              <span className="w-[56px] shrink-0 text-[12px] text-muted-foreground tabular-nums">{issue.id}</span>
              <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
              {issue.assignee ? <Avatar name={issue.assignee} size={18} /> : <span className="size-[18px] rounded-full border border-dashed border-foreground/30" />}
            </div>
          );
        })}
      </div>
      <div
        className={cn("absolute bottom-[14px] left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg p-1 text-[12px] whitespace-nowrap", POPOVER, styles.popIn)}
        style={{ "--pop-delay": "0.7s" }}
      >
        <span className="px-2 text-muted-foreground">2 selected</span>
        <span className="flex items-center gap-1.5 rounded-md px-2 py-1">
          <StatusIcon status="todo" /> Status
        </span>
        <span className="flex items-center gap-1.5 rounded-md px-2 py-1">
          <PriorityIcon level="medium" /> Priority
        </span>
        <span className="rounded-md px-2 py-1">Assignee</span>
        <span className="rounded-md px-2 py-1">Labels</span>
        <span className="flex items-center gap-1 rounded-md px-2 py-1 text-red-600 dark:text-red-400">
          <Trash2 className="size-3.5" /> Delete
        </span>
        <X className="mx-1 size-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}

const PRESET_VIEWS = [
  { name: "Active", description: "Everything in progress or in review", count: 5 },
  { name: "Urgent & high", description: "Top-priority work across the project", count: 4 },
  { name: "Unassigned", description: "Open issues with nobody on them", count: 3 },
  { name: "Overdue", description: "Past their due date and still open", count: 2, active: true },
  { name: "Needs estimate", description: "Open issues without story points", count: 6 },
];

// Cell: the ready-made views, each a filter one click away.
export function PresetViewsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex h-10 items-center gap-2 border-b px-4 font-medium", LINE)}>
        <SquareStack className="size-3.5 text-muted-foreground" /> Views
      </div>
      {PRESET_VIEWS.map((view, index) => (
        <div
          key={view.name}
          className={cn("flex items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, view.active && "bg-foreground/[0.045]", styles.popIn)}
          style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-foreground/[0.12]">
            <SquareStack className="size-3.5 text-muted-foreground" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-foreground/90">{view.name}</span>
            <span className="block truncate text-[12px] text-muted-foreground">{view.description}</span>
          </span>
          <span className={cn("text-[12px] tabular-nums", view.active ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{view.count}</span>
        </div>
      ))}
    </div>
  );
}

const EMAIL_ROWS = [
  ["Issue", "Turn-by-turn voice cuts out in tunnels"],
  ["Project", "Orbital Freight"],
  ["Priority", "Urgent"],
  ["Due", "Oct 29, 2026"],
  ["Assigned by", "Marcus Whitfield"],
];

// Cell: the email an assignee gets the moment they are added to an issue.
export function AssignEmailRender() {
  return (
    <div className="relative mx-auto h-[350px] w-[460px]">
      <div className={cn("absolute inset-x-[30px] top-0 overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card shadow-xl shadow-black/15 dark:bg-surface-subtle", styles.popIn)}>
        <div className={cn("flex items-center gap-2.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
          <AppMark id="flow" size={22} />
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-foreground/90">Geiger Flow</span>
            <span className="block truncate text-muted-foreground">You were assigned: Turn-by-turn voice cuts out in tunnels</span>
          </span>
        </div>
        <div className="px-5 pt-4 pb-5">
          <div className="text-[16px] font-medium tracking-[-0.01em]">New issue assigned to you</div>
          <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">Hi Priya, Marcus Whitfield assigned you an issue in Orbital Freight.</p>
          <div className="mt-3 rounded-lg border border-foreground/[0.08] bg-foreground/[0.025] px-3 py-1.5 text-[12px]">
            {EMAIL_ROWS.map(([label, value]) => (
              <div key={label} className="flex items-center gap-3 py-[3px]">
                <span className="w-[76px] shrink-0 text-muted-foreground">{label}</span>
                <span className={cn("truncate text-foreground/90", label === "Priority" && "text-red-600 dark:text-red-400")}>{value}</span>
              </div>
            ))}
          </div>
          <span className="mt-3.5 inline-flex h-8 items-center rounded-md bg-foreground px-3.5 text-[12px] font-medium text-background">View issue</span>
        </div>
      </div>
    </div>
  );
}

const TRIAGE_GROUPS = [
  {
    level: "urgent",
    label: "Urgent",
    rows: [{ id: "ORB-152", title: "App freezes when a stop has no geocode", labels: ["bug", "crash"], time: "12m" }],
  },
  {
    level: "high",
    label: "High",
    rows: [
      { id: "ORB-149", title: "Proof-of-delivery photo saves twice on retry", labels: ["bug"], time: "1h" },
      { id: "ORB-155", title: "Route list jumps when a stop is reordered", labels: ["bug"], time: "3h" },
    ],
  },
  {
    level: "medium",
    label: "Medium",
    rows: [
      { id: "ORB-153", title: "Show the depot's opening hours on arrival", labels: ["feature"], time: "5h" },
      { id: "ORB-158", title: "Dispatchers want a printable day sheet", labels: ["feature"], time: "1d" },
    ],
  },
  {
    level: "none",
    label: "No priority",
    rows: [
      { id: "ORB-159", title: "Delivery photo uploaded two times", labels: [], time: "20m", selected: true },
      { id: "ORB-160", title: "Typo on the clock-out screen", labels: ["copy"], time: "2d" },
    ],
  },
];

const STATES = [
  ["backlog", "Backlog"],
  ["todo", "Todo"],
  ["progress", "In Progress"],
  ["review", "In Review"],
  ["done", "Done"],
  ["canceled", "Canceled"],
  ["duplicate", "Duplicate"],
];

function DuplicateIcon() {
  return (
    <svg viewBox="0 0 14 14" className="size-3.5 shrink-0 text-muted-foreground">
      <circle cx="7" cy="7" r="7" fill="currentColor" />
      <path d="M4.5 7h5M7 4.5v5" stroke="var(--background)" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 7 7)" />
    </svg>
  );
}

// Section stage: Triage grouped by priority, a duplicate report selected, and the status picker open on it.
export function TriageQueueStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[860px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <Inbox className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Triage</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="text-[12px] text-muted-foreground">7 to triage</span>
            <DisplayButton />
          </span>
        </div>
        <div className={cn("flex h-10 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <Chip dashed icon={Plus} className="h-6 text-[11px] text-muted-foreground">
            Filter
          </Chip>
          <span className="ml-auto text-[12px] text-muted-foreground">Grouped by priority · Last created</span>
        </div>
        <div className="flex-1">
          {TRIAGE_GROUPS.map((group) => (
            <div key={group.label}>
              <div className={cn("flex h-9 items-center gap-2 border-b bg-foreground/[0.025] px-5 text-[12px]", LINE)}>
                <PriorityIcon level={group.level} />
                <span className="font-medium text-foreground/90">{group.label}</span>
                <span className="text-muted-foreground tabular-nums">{group.rows.length}</span>
              </div>
              {group.rows.map((row) => (
                <div key={row.id} className={cn("flex h-10 items-center gap-3 border-b px-5 text-[13px]", LINE, row.selected && "bg-foreground/[0.05]")}>
                  <Checkbox checked={row.selected} />
                  <PriorityIcon level={group.level} />
                  <span className="w-[58px] shrink-0 text-[12px] text-muted-foreground tabular-nums">{row.id}</span>
                  <StatusIcon status="backlog" />
                  <span className="min-w-0 flex-1 truncate text-foreground/90">{row.title}</span>
                  {row.labels.map((label) => (
                    <Chip key={label} dot="neutral" className="h-5 px-2 text-[11px] text-muted-foreground">
                      {label}
                    </Chip>
                  ))}
                  <span className="w-8 text-right text-[11px] text-muted-foreground">{row.time}</span>
                  <span className="size-[18px] rounded-full border border-dashed border-foreground/30" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={cn("flex h-11 shrink-0 items-center gap-2 border-t px-5 text-[12px]", LINE)}>
          <span className="text-muted-foreground">Bulk triage</span>
          <span className="rounded-md border border-foreground/[0.14] px-2 py-1 text-foreground/80">Accept all into Todo</span>
          <span className="rounded-md border border-foreground/[0.14] px-2 py-1 text-red-600 dark:text-red-400">Decline all</span>
        </div>
      </Window>
      <div className={cn("absolute top-[150px] left-[560px] z-[3] w-[420px]", styles.float)}>
        <div className={cn("ml-[26px] w-[230px] overflow-hidden", POPOVER)}>
          <div className={cn("border-b px-3.5 py-2.5 text-muted-foreground", LINE)}>Change status...</div>
          <div className="p-1.5">
            {STATES.map(([status, label]) => (
              <div key={status} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-[7px]", status === "duplicate" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/75")}>
                {status === "duplicate" ? <DuplicateIcon /> : <StatusIcon status={status} />}
                {label}
                {status === "backlog" ? <Check className="ml-auto size-3.5 text-muted-foreground" /> : null}
              </div>
            ))}
          </div>
        </div>
        <div className={cn("mt-2 flex w-fit items-center gap-0.5 rounded-lg p-1 text-[12px] whitespace-nowrap", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
          <span className="px-2 text-muted-foreground">1 selected</span>
          <span className="flex items-center gap-1.5 rounded-md bg-foreground/[0.08] px-2 py-1">
            <StatusIcon status="todo" /> Status
          </span>
          <span className="flex items-center gap-1.5 rounded-md px-2 py-1">
            <PriorityIcon level="medium" /> Priority
          </span>
          <span className="rounded-md px-2 py-1">Assignee</span>
          <span className="rounded-md px-2 py-1">Labels</span>
          <span className="flex items-center gap-1 rounded-md px-2 py-1 text-red-600 dark:text-red-400">
            <Trash2 className="size-3.5" /> Delete
          </span>
        </div>
      </div>
    </div>
  );
}

// Burn-up for Cycle 14: scope against completed, with the days still to come hatched.
function CycleBurnUp({ width = 220, height = 104 }) {
  const days = 13;
  const max = 24;
  const today = 7;
  const x = (day) => (day / days) * width;
  const y = (value) => height - (value / max) * (height - 8);
  const scope = [
    [0, 18],
    [3, 18],
    [3, 21],
    [5, 21],
    [5, 23],
    [today, 23],
  ];
  const completed = [
    [0, 0],
    [2, 0],
    [3, 2],
    [4, 4],
    [5, 5],
    [6, 7],
    [today, 9],
  ];
  const line = (points) => points.map(([day, value], index) => `${index ? "L" : "M"}${x(day).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height + 18} viewBox={`0 0 ${width} ${height + 18}`} className="overflow-visible text-foreground">
      <defs>
        <pattern id="flow-cycle-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect x={x(today)} y="0" width={width - x(today)} height={height} fill="url(#flow-cycle-hatch)" />
      <path d={`${line(scope)} L${x(days)} ${y(23)}`} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 4" />
      <path d={line(scope)} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
      <path d={`${line(completed)} L${x(today)} ${height} L0 ${height} Z`} className="fill-emerald-500/15" />
      <path d={line(completed)} fill="none" strokeWidth="1.75" className="stroke-emerald-500" />
      <line x1={x(today)} x2={x(today)} y1="0" y2={height} stroke="currentColor" strokeOpacity="0.5" />
      <circle cx={x(today)} cy={y(9)} r="3" className="fill-emerald-500" />
      <line x1="0" x2={width} y1={height} y2={height} stroke="currentColor" strokeOpacity="0.15" />
      <text x="0" y={height + 14} className="fill-muted-foreground text-[10px]">
        Oct 20
      </text>
      <text x={width} y={height + 14} textAnchor="end" className="fill-muted-foreground text-[10px]">
        Nov 2
      </text>
    </svg>
  );
}

// Cell: the active cycle with its burn-up and the four numbers beside it.
export function CycleRender() {
  const tiles = [
    ["Scope", "23", "issues"],
    ["Started", "8", null],
    ["Completed", "9", null],
    ["Points", "61", "estimated"],
  ];
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex h-10 items-center gap-2 border-b px-4", LINE)}>
        <Repeat className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Cycles</span>
        <span className="ml-2">
          <ViewTabs tabs={["Active", "Upcoming 2", "Completed 13"]} active="Active" />
        </span>
      </div>
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center gap-2">
          <ProgressRing value={39} size={16} className="text-emerald-500" />
          <span className="font-medium">Cycle 14 — Route planner</span>
          <span className="text-[12px] text-muted-foreground">Oct 20 – Nov 2</span>
        </div>
        <div className="mt-3 flex items-start gap-4">
          <CycleBurnUp />
          <div className={cn("grid flex-1 grid-cols-2 divide-x divide-y overflow-hidden rounded-lg border [&>*]:border-foreground/[0.07]", LINE)}>
            {tiles.map(([label, value, hint], index) => (
              <div key={label} className={cn("px-2.5 py-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
                <div className="text-[10px] text-muted-foreground">{label}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-[17px] font-medium tabular-nums">{value}</span>
                  {hint ? <span className="text-[10px] text-muted-foreground">{hint}</span> : null}
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}

const DISPLAY_PROPERTIES = [
  ["Priority", true],
  ["ID", true],
  ["Status", true],
  ["Labels", true],
  ["Division", true],
  ["Cycle", false],
  ["Due date", true],
  ["Estimate", false],
  ["Links", true],
  ["Created", false],
  ["Assignee", true],
];

function MiniCard({ issue }) {
  return (
    <div className="rounded-md border border-foreground/[0.09] bg-surface-card p-2 text-[11px] dark:bg-foreground/[0.03]">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {issue.id}
        <PriorityIcon level={issue.priority} className="ml-auto" />
      </div>
      <div className="mt-1 line-clamp-2 leading-[1.35] text-foreground/85">{issue.title}</div>
    </div>
  );
}

// Cell: the Display menu switched to a board grouped by assignee, with the board behind it.
export function LayoutRender() {
  const columns = [
    ["Priya Nair", ["ORB-118", "ORB-130"]],
    ["Nathan Okafor", ["ORB-112", "ORB-127"]],
  ];
  return (
    <div className="relative mx-auto h-[320px] w-[460px]">
      <div className={cn("absolute top-[18px] left-0 grid w-[280px] grid-cols-2 gap-2 opacity-75", styles.fadeBottom)}>
        {columns.map(([name, ids]) => (
          <div key={name} className="flex flex-col gap-1.5 rounded-lg bg-foreground/[0.03] p-1.5">
            <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[11px]">
              <Avatar name={name} size={14} />
              <span className="truncate font-medium">{name.split(" ")[0]}</span>
              <span className="text-muted-foreground">{ids.length}</span>
            </div>
            {ids.map((id) => (
              <MiniCard key={id} issue={byId(id)} />
            ))}
          </div>
        ))}
      </div>
      <div className={cn("absolute top-0 right-0 w-[262px] p-3 text-[12px]", POPOVER)}>
        <div className="grid grid-cols-2 gap-1.5">
          <span className="flex items-center justify-center gap-1.5 rounded-md border border-foreground/[0.12] py-1.5 text-muted-foreground">
            <LayoutList className="size-3.5" /> List
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-md border border-foreground/40 bg-foreground/[0.07] py-1.5 font-medium">
            <Kanban className="size-3.5" /> Board
          </span>
        </div>
        {[
          ["Grouping", "Assignee"],
          ["Ordering", "Priority"],
        ].map(([label, value]) => (
          <div key={label} className="mt-2.5 flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="flex items-center gap-1 rounded-md border border-foreground/[0.12] px-2 py-1 text-foreground">
              {value} <ChevronDown className="size-3" />
            </span>
          </div>
        ))}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-foreground/80">Show sub-issues</span>
          <Toggle on />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-foreground/80">Show completed</span>
          <Toggle />
        </div>
        <div className={cn("mt-3 border-t pt-2.5 text-[11px] text-muted-foreground", LINE)}>Display properties</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {DISPLAY_PROPERTIES.map(([label, on]) => (
            <span key={label} className={cn("rounded-[5px] border px-1.5 py-0.5 text-[11px]", on ? "border-foreground/25 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Day offsets from 1 September across Flow's six-month window (Sep–Feb, 181 days).
const MONTH_START = { Sep: 0, Oct: 30, Nov: 61, Dec: 91, Jan: 122, Feb: 153 };
const SPAN = 181;
const at = (month, day) => ((MONTH_START[month] + day - 1) / SPAN) * 100;
const TODAY = at("Oct", 27);

const ROADMAP = [
  { kind: "division", title: "Billing", detail: "23/28 issues", from: ["Sep", 1], to: ["Oct", 20], progress: 82, overdue: true },
  { kind: "division", title: "Driver app", detail: "18/28 issues", from: ["Sep", 1], to: ["Dec", 15], progress: 64 },
  { kind: "cycle", title: "Cycle 11 — Depot check-in", detail: "12/12 issues", from: ["Sep", 8], to: ["Sep", 21], progress: 100 },
  { kind: "division", title: "Dispatch console", detail: "9/24 issues", from: ["Sep", 15], to: ["Jan", 31], progress: 38 },
  { kind: "cycle", title: "Cycle 12 — Offline mode", detail: "14/14 issues", from: ["Sep", 22], to: ["Oct", 5], progress: 100 },
  { kind: "cycle", title: "Cycle 13 — Proof of delivery", detail: "16/16 issues", from: ["Oct", 6], to: ["Oct", 19], progress: 100 },
  { kind: "cycle", title: "Cycle 14 — Route planner", detail: "9/23 issues", from: ["Oct", 20], to: ["Nov", 2], progress: 39 },
  { kind: "cycle", title: "Cycle 15 — Shift tools", detail: "0/12 issues", from: ["Nov", 3], to: ["Nov", 16], progress: 0 },
  { kind: "division", title: "Customer portal", detail: "0/9 issues", from: ["Nov", 16], to: ["Feb", 27], progress: 0 },
];

// Section stage: Initiatives over six months, a slipped division in red, and the Driver app division opened over it.
export function RoadmapStage() {
  const labelWidth = 250;
  const months = Object.keys(MONTH_START);
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[560px] w-[940px]">
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
        <div className={cn("flex h-8 border-b", LINE)}>
          <div className={cn("shrink-0 border-r", LINE)} style={{ width: labelWidth }} />
          <div className="relative flex-1">
            {months.map((month) => (
              <span key={month} className={cn("absolute top-0 flex h-8 items-center border-l pl-2 text-[11px] text-muted-foreground", LINE)} style={{ left: `${at(month, 1)}%` }}>
                {month}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          {ROADMAP.map((row, index) => {
            const left = at(...row.from);
            const width = at(...row.to) - left;
            const Icon = row.kind === "division" ? Box : Repeat;
            return (
              <div key={row.title} className={cn("flex border-b", LINE)}>
                <div className={cn("flex shrink-0 items-center gap-2.5 border-r px-4 py-2", LINE)} style={{ width: labelWidth }}>
                  <Icon className={cn("size-3.5 shrink-0", row.kind === "division" ? "text-foreground/70" : "text-amber-500")} strokeWidth={2} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-foreground/90">{row.title}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">{row.detail}</span>
                  </span>
                  <ProgressRing value={row.progress} className={row.progress === 100 ? "text-emerald-500" : "text-foreground/70"} />
                </div>
                <div className="relative flex-1 py-3">
                  <div
                    className={cn("relative h-5 overflow-hidden rounded-full border", row.overdue ? "border-red-500/50 bg-red-500/10" : "border-foreground/[0.14] bg-foreground/[0.05]")}
                    style={{ marginLeft: `${left}%`, width: `${width}%` }}
                  >
                    <span
                      className={cn("absolute inset-y-0 left-0 origin-left", row.overdue ? "bg-red-500/30" : row.progress === 100 ? "bg-foreground/20" : "bg-foreground/35", styles.fill)}
                      style={{ width: `${row.progress}%`, "--fill-delay": `${0.2 + index * 0.08}s` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="pointer-events-none absolute inset-y-0 right-0" style={{ left: labelWidth }}>
            {months.map((month) => (
              <span key={month} className={cn("absolute inset-y-0 border-l", LINE)} style={{ left: `${at(month, 1)}%` }} />
            ))}
            <span className="absolute inset-y-0 w-px bg-foreground/70" style={{ left: `${TODAY}%` }}>
              <span className={cn("absolute -top-px left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground text-foreground", styles.pulse)} />
            </span>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[318px] left-[520px] z-[2] w-[470px]", styles.float)}>
        <Window>
          <div className={cn("border-b px-5 py-4", LINE)}>
            <div className="flex items-start gap-3">
              <ProgressRing value={64} size={20} className="mt-0.5 text-emerald-500" />
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-medium">Driver app</div>
                <p className="mt-1 text-[12px] leading-5 text-muted-foreground">Everything a driver touches on the road: routes, stops, proof of delivery and shifts.</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="inline-flex h-[22px] items-center rounded-full border border-foreground/[0.12] px-2">
                    <Health value="on" className="text-[11px]" />
                  </span>
                  <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full border border-foreground/[0.12] px-2 text-foreground/80">
                    <Avatar name="Priya Nair" size={14} /> Priya Nair
                  </span>
                  <span className="inline-flex h-[22px] items-center rounded-full border border-foreground/[0.12] px-2 text-foreground/80">Target Dec 15</span>
                  <span className="text-muted-foreground tabular-nums">18/28 issues · 64%</span>
                </div>
              </div>
            </div>
          </div>
          {["ORB-118", "ORB-121", "ORB-133"].map((id) => (
            <TrackerRow key={id} issue={byId(id)} compact />
          ))}
        </Window>
      </div>
    </div>
  );
}

const DIVISIONS = [
  { title: "Driver app", summary: "Routes, stops, proof of delivery and shifts", health: "on", progress: 64, target: "Dec 15" },
  { title: "Dispatch console", summary: "The live map and the dispatcher's day", health: "risk", progress: 38, target: "Jan 31" },
  { title: "Billing", summary: "Fuel cards, invoices and client exports", health: "risk", progress: 82, target: "Oct 20", late: true },
  { title: "Customer portal", summary: "Delivery tracking for fleet clients", health: "backlog", progress: 0, target: "Feb 27" },
];

// Cell: every division with its health, progress and target date, a missed target in red.
export function DivisionsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex h-8 items-center gap-3 border-b px-4 text-[11px] text-muted-foreground", LINE)}>
        <span className="flex-1">Division</span>
        <span className="w-[78px]">Health</span>
        <span className="w-[92px]">Progress</span>
        <span className="w-[46px] text-right">Target</span>
      </div>
      {DIVISIONS.map((division, index) => (
        <div key={division.title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
          <Box className="size-3.5 shrink-0 text-foreground/70" strokeWidth={2} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] text-foreground/90">{division.title}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{division.summary}</span>
          </span>
          <span className="w-[78px] shrink-0">
            <Health value={division.health} className="text-[11px]" />
          </span>
          <span className="flex w-[92px] shrink-0 items-center gap-2">
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("block h-full origin-left rounded-full bg-foreground/55", styles.fill)} style={{ width: `${division.progress}%`, "--fill-delay": `${0.3 + index * 0.15}s` }} />
            </span>
            <span className="w-7 text-right text-[11px] text-muted-foreground tabular-nums">{division.progress}%</span>
          </span>
          <span className={cn("w-[46px] shrink-0 text-right tabular-nums", division.late ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{division.target}</span>
        </div>
      ))}
    </div>
  );
}

const BOARD = [
  {
    title: "Open",
    cards: [
      { title: "Fuel card scan rejects folded receipts", type: "Bug", priority: ["Critical", "red"], points: 3, due: "Oct 26", late: true, assignee: "Tyler Brennan" },
      { title: "Bulk edit of delivery windows", type: "Feature", priority: ["Medium", "neutral"], points: 8, due: "Nov 14", assignee: "Danielle Reyes" },
      { title: "Rename depots in settings", type: "Chore", priority: ["Low", "neutral"], points: 1, assignee: "Marcus Whitfield" },
    ],
  },
  {
    title: "In Progress",
    cards: [
      { title: "Faster stop search on long routes", type: "Improvement", priority: ["High", "strong"], points: 5, due: "Nov 3", assignee: "Nathan Okafor" },
      { title: "Signature pad on handover", type: "Task", priority: ["Medium", "neutral"], points: 2, due: "Nov 7", assignee: "Priya Nair" },
    ],
  },
  {
    title: "Resolved",
    cards: [
      { title: "Clock-out button hidden on small phones", type: "Bug", priority: ["High", "strong"], points: 2, assignee: "Tyler Brennan" },
      { title: "Depot list sorts by distance", type: "Improvement", priority: ["Low", "neutral"], points: 3, assignee: "Nathan Okafor" },
    ],
  },
];

// Cell: a project's own Issues board with types, priorities and point estimates.
export function ProjectBoardRender() {
  return (
    <div className={cn("mx-auto h-[300px] w-[480px]", styles.fadeBottom)}>
      <div className="mb-2.5 flex items-center gap-2 text-[13px]">
        <span className="font-medium">Issues</span>
        <span className="ml-auto grid grid-cols-2 gap-0.5 rounded-md bg-foreground/[0.05] p-0.5 text-[11px]">
          <span className="flex items-center gap-1 rounded px-2 py-0.5 text-muted-foreground">
            <LayoutList className="size-3" /> List
          </span>
          <span className="flex items-center gap-1 rounded bg-surface-card px-2 py-0.5 font-medium shadow-sm dark:bg-foreground/[0.1]">
            <Kanban className="size-3" /> Board
          </span>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {BOARD.map((column) => (
          <div key={column.title} className="flex flex-col gap-1.5 rounded-xl bg-foreground/[0.03] p-1.5">
            <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px]">
              <span className="font-medium">{column.title}</span>
              <span className="text-muted-foreground">{column.cards.length}</span>
            </div>
            {column.cards.map((card, index) => (
              <div
                key={card.title}
                className={cn("rounded-lg border border-foreground/[0.09] bg-surface-card p-2 text-[11px] dark:bg-foreground/[0.03]", styles.popIn)}
                style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}
              >
                <div className="line-clamp-2 text-[12px] leading-[1.35] text-foreground/90">{card.title}</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  <span className={cn("rounded border px-1 text-[10px]", card.type === "Bug" ? "border-red-500/25 text-red-600 dark:text-red-400" : "border-foreground/[0.12] text-muted-foreground")}>{card.type}</span>
                  <Pill tone={card.priority[1]} className="h-[18px] px-1.5 text-[10px]">
                    {card.priority[0]}
                  </Pill>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="rounded border border-foreground/[0.1] px-1 tabular-nums">{card.points} PTS</span>
                  {card.due ? <span className={cn("tabular-nums", card.late && "text-red-600 dark:text-red-400")}>{card.due}</span> : null}
                  <span className="ml-auto">
                    <Avatar name={card.assignee} size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
