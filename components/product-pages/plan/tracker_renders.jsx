import {
  ArrowDown,
  ArrowUp,
  Box,
  Calendar,
  Check,
  ChevronDown,
  CircleDot,
  Inbox,
  LayoutList,
  Kanban,
  MoreHorizontal,
  Paperclip,
  Repeat,
  Search,
  SlidersHorizontal,
  SquarePen,
  SquareStack,
  Star,
  Target,
  Triangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Kbd, LINE, PriorityIcon, StatusIcon, Window } from "@/components/product-pages/mock_kit";
import { GroupHeader, ISSUES, IssueRow, Points } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Flow's tracker: the issue list, an issue open beside it, triage, the command palette, display options and saved views.

function ListWindow({ className }) {
  const groups = ["progress", "review", "todo"];
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Box className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">Geiger Notes</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Issues</span>
        <div className="ml-4 flex gap-1 text-[12px]">
          {["All issues", "Active", "Backlog"].map((tab, index) => (
            <span key={tab} className={cn("rounded-md border px-2 py-0.5", index === 1 ? "border-foreground/[0.12] bg-foreground/[0.06] text-foreground" : "border-transparent text-muted-foreground")}>
              {tab}
            </span>
          ))}
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2 py-1 text-[12px] text-muted-foreground">
          <SlidersHorizontal className="size-3.5" /> Display
        </span>
      </div>
      {groups.map((status) => {
        const rows = ISSUES.filter((issue) => issue.status === status);
        return (
          <div key={status}>
            <GroupHeader status={status} count={rows.length} />
            {rows.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        );
      })}
    </Window>
  );
}

function Property({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-[7px]">
      <span className="w-[76px] shrink-0 text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-2 text-foreground/90">{children}</span>
    </div>
  );
}

function ActivityLine({ name, children, time }) {
  return (
    <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
      <Avatar name={name} size={16} />
      <span>
        <span className="font-medium text-foreground/80">{name}</span> {children}
      </span>
      <span>· {time}</span>
    </div>
  );
}

function DetailWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5 text-[12px]", LINE)}>
        <StatusIcon status="progress" />
        <span className="font-medium text-foreground/90">GEIG-71</span>
        <span className="truncate text-foreground/80">Large workspaces take eight seconds to first paint</span>
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        <MoreHorizontal className="size-4 text-muted-foreground" />
        <span className="ml-auto flex items-center gap-3 text-muted-foreground">
          <span>
            <span className="text-foreground/80">2</span> / 7
          </span>
          <ArrowUp className="size-3.5" />
          <ArrowDown className="size-3.5" />
        </span>
      </div>
      <div className="flex flex-1">
        <div className="min-w-0 flex-1 px-8 py-7">
          <h4 className="text-[19px] font-medium tracking-[-0.01em]">Large workspaces take eight seconds to first paint</h4>
          <p className="mt-3 max-w-[30rem] leading-6 text-muted-foreground">
            Workspaces with a couple of thousand pages sit on a blank screen before the sidebar loads. Move the page tree query off the critical path and measure first paint again.
          </p>
          <div className="mt-7 text-[14px] font-medium">Activity</div>
          <div className="mt-4 flex flex-col gap-3.5">
            <ActivityLine name="Marcus Whitfield" time="3d ago">
              created the issue
            </ActivityLine>
            <ActivityLine name="Marcus Whitfield" time="3d ago">
              set the priority to Urgent
            </ActivityLine>
            <ActivityLine name="Ethan Caldwell" time="1d ago">
              moved from Todo to In Progress
            </ActivityLine>
          </div>
          <div className="mt-5 rounded-xl border border-foreground/[0.08] px-4 py-3.5">
            <div className="flex items-center gap-2 text-[12px]">
              <Avatar name="Ethan Caldwell" size={18} />
              <span className="font-medium">Ethan Caldwell</span>
              <span className="text-muted-foreground">2h ago</span>
            </div>
            <p className="mt-2 leading-6 text-foreground/85">The page tree query blocks render. Splitting it out and streaming the sidebar in after first paint.</p>
          </div>
          <div className="mt-3 flex items-center rounded-xl border border-foreground/[0.08] px-4 py-3 text-muted-foreground">
            Leave a comment...
            <Paperclip className="ml-auto size-3.5" />
          </div>
        </div>
        <div className={cn("w-[236px] shrink-0 border-l px-5 py-6 text-[12px]", LINE)}>
          <Property label="Status">
            <StatusIcon status="progress" /> In Progress
          </Property>
          <Property label="Priority">
            <PriorityIcon level="urgent" /> Urgent
          </Property>
          <Property label="Assignees">
            <Avatar name="Ethan Caldwell" size={16} /> Ethan Caldwell
          </Property>
          <Property label="Labels">
            <Chip dot="neutral" className="h-5 px-2 text-[11px]">
              performance
            </Chip>
          </Property>
          <Property label="Division">
            <Box className="size-3.5 text-muted-foreground" /> <span className="truncate">Ship Geiger Notes 1.0</span>
          </Property>
          <Property label="Cycle">
            <Repeat className="size-3.5 text-muted-foreground" /> <span className="truncate">Cycle 7 - GA Hardening</span>
          </Property>
          <Property label="Estimate">
            <Points value="8" /> points
          </Property>
          <Property label="Due date">
            <Calendar className="size-3.5 text-muted-foreground" /> Sep 26
          </Property>
        </div>
      </div>
    </Window>
  );
}

export function TrackerStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ListWindow className="absolute top-0 left-0 h-[560px] w-[620px] opacity-85" />
      <DetailWindow className="absolute top-[64px] left-[300px] z-[2] h-[640px] w-[700px]" />
    </div>
  );
}

function BoardCard({ issue }) {
  return (
    <div className="rounded-lg border border-foreground/[0.09] bg-surface-card p-2.5 text-[12px] shadow-sm shadow-black/5 dark:bg-foreground/[0.03]">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {issue.id}
        <span className="ml-auto">{issue.assignee ? <Avatar name={issue.assignee} size={16} /> : null}</span>
      </div>
      <div className="mt-1 flex gap-1.5 leading-[1.35] text-foreground/90">
        <StatusIcon status={issue.status} className="mt-px" />
        <span className="line-clamp-2">{issue.title}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <PriorityIcon level={issue.priority} />
        <Points value={issue.points} />
      </div>
    </div>
  );
}

export function BoardRender() {
  const columns = ["todo", "progress", "review"];
  const titles = { todo: "Todo", progress: "In Progress", review: "In Review" };
  return (
    <div className={cn("mx-auto grid h-[300px] w-[480px] grid-cols-3 gap-2.5", styles.fadeBottom)}>
      {columns.map((status) => {
        const cards = ISSUES.filter((issue) => issue.status === status);
        return (
          <div key={status} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2">
            <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px]">
              <StatusIcon status={status} />
              <span className="font-medium">{titles[status]}</span>
              <span className="text-muted-foreground">{cards.length}</span>
            </div>
            {cards.map((issue, index) => (
              <div key={issue.id} className={styles.popIn} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
                <BoardCard issue={issue} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const PALETTE = [
  { icon: Repeat, label: "Go to Cycles", keys: ["G", "C"], active: true },
  { icon: Inbox, label: "Go to Triage", keys: ["G", "T"] },
  { icon: Target, label: "Go to Initiatives", keys: ["G", "R"] },
  { icon: CircleDot, label: "Go to My Issues", keys: ["G", "M"] },
  { icon: SquarePen, label: "Create issue", keys: ["C"] },
];

export function CommandRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[13px] shadow-2xl shadow-black/25 dark:bg-surface-dialog">
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3.5", LINE)}>
        <Search className="size-4 text-muted-foreground" />
        <span className="text-foreground">cyc</span>
        <span className={cn("-ml-2", styles.caret)} />
        <span className="ml-auto">
          <Kbd>⌘K</Kbd>
        </span>
      </div>
      <div className="p-1.5">
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] text-muted-foreground">Navigation</div>
        {PALETTE.map(({ icon: Icon, label, keys, active }) => (
          <div key={label} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
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
  );
}

const GROUPINGS = ["Status", "Assignee", "Priority", "Division", "Cycle", "Label"];

export function DisplayRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[290px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-foreground/[0.05] p-1">
          <span className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-muted-foreground">
            <LayoutList className="size-3.5" /> List
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-md bg-surface-card py-1.5 font-medium shadow-sm dark:bg-foreground/[0.1]">
            <Kanban className="size-3.5" /> Board
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-muted-foreground">Grouping</span>
          <span className="flex items-center gap-1 rounded-md border border-foreground/[0.12] px-2 py-1 text-foreground">
            Priority <ChevronDown className="size-3" />
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted-foreground">Ordering</span>
          <span className="flex items-center gap-1 rounded-md border border-foreground/[0.1] px-2 py-1 text-foreground/80">
            Due date <ChevronDown className="size-3" />
          </span>
        </div>
      </div>
      <div className="absolute top-[92px] left-[178px] w-[180px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog">
        {GROUPINGS.map((option) => (
          <div key={option} className={cn("flex items-center rounded-md px-2.5 py-1.5", option === "Priority" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            {option}
            {option === "Priority" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const VIEWS = [
  { name: "Active", count: 18 },
  { name: "Urgent & high", count: 7, active: true },
  { name: "Unassigned", count: 4 },
  { name: "Overdue", count: 2 },
  { name: "Needs estimate", count: 5 },
  { name: "Recently completed", count: 12 },
];

export function ViewsRender() {
  return (
    <div className="mx-auto flex w-[460px] gap-3">
      <div className="w-[190px] shrink-0 rounded-xl border border-foreground/[0.09] bg-surface-card p-1.5 text-[13px] dark:bg-surface-subtle">
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] text-muted-foreground">Views</div>
        {VIEWS.map((view) => (
          <div key={view.name} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", view.active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <SquareStack className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate">{view.name}</span>
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{view.count}</span>
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex h-9 items-center gap-1.5 border-b px-3 font-medium", LINE)}>
          <Triangle className="size-3 fill-current text-muted-foreground" /> Urgent &amp; high
        </div>
        {ISSUES.filter((issue) => issue.priority === "urgent").map((issue) => (
          <div key={issue.id} className={cn("flex h-9 items-center gap-2 border-b px-3", LINE)}>
            <PriorityIcon level={issue.priority} />
            <StatusIcon status={issue.status} />
            <span className="truncate text-foreground/85">{issue.title}</span>
          </div>
        ))}
        {ISSUES.filter((issue) => issue.priority === "high")
          .slice(0, 3)
          .map((issue) => (
            <div key={issue.id} className={cn("flex h-9 items-center gap-2 border-b px-3 opacity-60", LINE)}>
              <PriorityIcon level={issue.priority} />
              <StatusIcon status={issue.status} />
              <span className="truncate text-foreground/85">{issue.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
