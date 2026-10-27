import { cn } from "@/lib/utils";
import { Avatar, LINE, PriorityIcon, StatusIcon } from "@/components/product-pages/mock_kit";

// Shared pieces for the /plan renders: Flow's seeded "Geiger Notes" project, progress rings and health chips.

export const ISSUES = [
  { id: "GEIG-70", title: "1.0 release checklist and rollback rehearsal", status: "progress", priority: "urgent", assignee: "Marcus Whitfield", points: 1, labels: ["release"] },
  { id: "GEIG-71", title: "Large workspaces take eight seconds to first paint", status: "progress", priority: "urgent", assignee: "Ethan Caldwell", points: 8, labels: ["performance"] },
  { id: "GEIG-77", title: "Release-candidate smoke suite", status: "progress", priority: "high", assignee: "Nathan Okafor", points: 2 },
  { id: "GEIG-69", title: "Workspace migration tool with dry-run", status: "review", priority: "urgent", assignee: "Aisha Bennett", points: 3 },
  { id: "GEIG-72", title: "Keyboard trap in the share dialog", status: "review", priority: "high", assignee: "Grace Donnelly", points: 1, labels: ["a11y", "bug"] },
  { id: "GEIG-67", title: "Performance budget enforced in CI", status: "todo", priority: "high", assignee: "Marcus Whitfield", points: 8 },
  { id: "GEIG-74", title: "Background sync drains battery on Android", status: "todo", priority: "high", assignee: "Ethan Caldwell", points: 5, labels: ["mobile", "performance"] },
];

export const STATUS_LABEL = { progress: "In Progress", review: "In Review", todo: "Todo", backlog: "Backlog", done: "Done" };

// Flow's ProgressRing: a thin track with the completed share drawn over it.
export function ProgressRing({ value, size = 14, className }) {
  const radius = size / 2 - 1.5;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("shrink-0 -rotate-90", className)}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.75" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
      />
    </svg>
  );
}

const HEALTH = {
  on: { label: "On track", className: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  risk: { label: "At risk", className: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  off: { label: "Off track", className: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  backlog: { label: "Backlog", className: "text-muted-foreground", dot: "bg-foreground/35" },
  done: { label: "Completed", className: "text-muted-foreground", dot: "bg-foreground/60" },
};

export function Health({ value = "on", label, className }) {
  const health = HEALTH[value];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap", health.className, className)}>
      <span className={cn("size-1.5 rounded-full", health.dot)} />
      {label ?? health.label}
    </span>
  );
}

export function Points({ value }) {
  return <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-foreground/[0.1] px-1 text-[11px] text-muted-foreground">{value}</span>;
}

// One line of Flow's issue list: priority, identifier, status, title, then labels, estimate and assignee.
export function IssueRow({ issue, compact = false, className }) {
  return (
    <div className={cn("flex h-10 items-center gap-3 border-b px-5 text-[13px]", LINE, className)}>
      <PriorityIcon level={issue.priority} />
      <span className="w-[62px] shrink-0 text-[12px] text-muted-foreground tabular-nums">{issue.id}</span>
      <StatusIcon status={issue.status} />
      <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
      {!compact && issue.labels
        ? issue.labels.map((label) => (
            <span key={label} className="hidden shrink-0 items-center gap-1.5 rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground sm:inline-flex">
              <span className="size-1.5 rounded-full bg-foreground/40" />
              {label}
            </span>
          ))
        : null}
      {!compact ? <Points value={issue.points} /> : null}
      {issue.assignee ? <Avatar name={issue.assignee} size={18} /> : <span className="size-[18px] rounded-full border border-dashed border-foreground/30" />}
    </div>
  );
}

export function GroupHeader({ status, count }) {
  return (
    <div className={cn("flex h-9 items-center gap-2 border-b bg-foreground/[0.025] px-5 text-[12px]", LINE)}>
      <StatusIcon status={status} />
      <span className="font-medium text-foreground/90">{STATUS_LABEL[status]}</span>
      <span className="text-muted-foreground">{count}</span>
    </div>
  );
}

// The dotted ground Notes boards sit on.
export const CANVAS_DOTS = {
  backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 13%, transparent) 1px, transparent 1.2px)",
  backgroundSize: "18px 18px",
};
