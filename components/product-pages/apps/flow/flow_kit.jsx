import {
  Activity,
  Banknote,
  BriefcaseBusiness,
  Box,
  ChevronDown,
  CircleDot,
  Database,
  FileImage,
  Flag,
  GitBranch,
  Hash,
  Inbox,
  Key,
  LayoutDashboard,
  LayoutGrid,
  SquareCheck,
  MessageSquare,
  Network,
  Paperclip,
  Phone,
  Radio,
  Search,
  Settings,
  SquareStack,
  Target,
  Users,
  UsersRound,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd, LINE } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

export { CANVAS_DOTS, Health, Points, ProgressRing } from "@/components/product-pages/plan/plan_kit";

// Shared pieces for the Geiger Flow tour: Orbital Freight's tracker, project and chat rails, pills and KPI strips.

function RailItem({ icon: Icon, label, count, active = false, indent = false, kbd }) {
  return (
    <div className={cn("flex h-[30px] items-center gap-2 rounded-md px-2", indent && "pl-[30px]", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
      {Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} /> : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count ? <span className="text-[11px] text-muted-foreground tabular-nums">{count}</span> : null}
      {kbd ? <Kbd>{kbd}</Kbd> : null}
    </div>
  );
}

function RailLabel({ children }) {
  return <div className="px-2 pt-4 pb-1 text-[11px] font-medium text-muted-foreground">{children}</div>;
}

// The tracker's left rail: workspace switcher, Inbox and My Issues, the Workspace section and the ORB team tree.
export function TrackerRail({ active = "Issues", className }) {
  return (
    <div className={cn("flex w-[220px] shrink-0 flex-col border-r px-2.5 py-2.5 text-[12.5px]", LINE, className)}>
      <div className="flex items-center gap-2 px-1.5 py-1.5">
        <span className="flex size-5 items-center justify-center rounded-[5px] bg-foreground text-[10px] font-semibold text-background">O</span>
        <span className="flex-1 truncate font-medium">Orbital Freight</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </div>
      <div className="mt-2 flex flex-col gap-px">
        <RailItem icon={Search} label="Search" kbd="⌘K" />
        <RailItem icon={Inbox} label="Inbox" count="4" active={active === "Inbox"} />
        <RailItem icon={CircleDot} label="My Issues" count="6" active={active === "My Issues"} />
      </div>
      <RailLabel>Workspace</RailLabel>
      <div className="flex flex-col gap-px">
        <RailItem icon={Target} label="Initiatives" active={active === "Initiatives"} />
        <RailItem icon={Box} label="Divisions" active={active === "Divisions"} />
        <RailItem icon={LayoutGrid} label="Views" active={active === "Views"} />
        <RailItem icon={Users} label="Members" active={active === "Members"} />
      </div>
      <RailLabel>Your teams</RailLabel>
      <div className="flex h-[30px] items-center gap-2 px-2 text-foreground/80">
        <ChevronDown className="size-3.5 text-muted-foreground" />
        <span className="flex size-4 items-center justify-center rounded-[3px] bg-foreground/15 text-[9px] font-semibold">O</span>
        ORB
      </div>
      <div className="flex flex-col gap-px">
        {[
          ["Issues", null],
          ["Triage", "7"],
          ["Cycles", null],
          ["Divisions", null],
          ["Views", null],
        ].map(([label, count]) => (
          <RailItem key={label} icon={SquareStack} label={label} count={count} indent active={active === `team:${label}` || (label === "Issues" && active === "Issues")} />
        ))}
      </div>
      <div className="mt-auto">
        <RailItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
}

const PROJECT_NAV = [
  [LayoutDashboard, "Overview"],
  [GitBranch, "Issues"],
  [SquareCheck, "Tasks"],
  [BriefcaseBusiness, "Work Queue"],
  [Radio, "Grounding"],
  [Waypoints, "Planning"],
  [Flag, "Milestones"],
  [Target, "Goals"],
  [Database, "Objectives"],
  [FileImage, "Assets"],
  [Activity, "Logs"],
  [UsersRound, "Resource Allocation"],
  [Key, "Vault"],
];

const PROJECT_ADDONS = [
  [Banknote, "Budget"],
  [Network, "System Architecture"],
];

// Flow's project sidebar, trimmed to the screens this tour shows.
export function ProjectRail({ active = "Overview", className }) {
  return (
    <div className={cn("flex w-[220px] shrink-0 flex-col border-r px-2.5 py-3 text-[12.5px]", LINE, className)}>
      <div className="flex items-center gap-2 px-1.5 pb-3">
        <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">O</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">Orbital Freight</span>
          <span className="block truncate text-[11px] text-muted-foreground">Geiger Flow</span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-px">
        {PROJECT_NAV.map(([Icon, label]) => (
          <RailItem key={label} icon={Icon} label={label} active={active === label} />
        ))}
      </div>
      <RailLabel>Add-ons</RailLabel>
      <div className="flex flex-col gap-px">
        {PROJECT_ADDONS.map(([Icon, label]) => (
          <RailItem key={label} icon={Icon} label={label} active={active === label} />
        ))}
      </div>
      <div className="mt-auto">
        <RailItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
}

const CHAT_NAV = [
  [MessageSquare, "Messages"],
  [Hash, "Channels"],
  [Users, "Contacts"],
  [Phone, "Calls"],
  [Paperclip, "Files"],
  [Inbox, "Inbox"],
  [Settings, "Settings"],
];

// Grounding's own navigation rail: Messages, Channels, Contacts, Calls, Files, Inbox and Settings.
export function ChatRail({ active = "Messages", inbox, className }) {
  return (
    <div className={cn("flex w-[172px] shrink-0 flex-col gap-px border-r px-2.5 py-3 text-[12.5px]", LINE, className)}>
      <div className="flex items-center gap-2 px-1.5 pb-3">
        <Radio className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Grounding</span>
      </div>
      {CHAT_NAV.map(([Icon, label]) => (
        <RailItem key={label} icon={Icon} label={label} active={active === label} count={label === "Inbox" ? inbox : null} />
      ))}
    </div>
  );
}

const PILL_TONES = {
  neutral: ["border-foreground/[0.1] bg-foreground/[0.04] text-foreground/75", "bg-foreground/40"],
  strong: ["border-foreground/20 bg-foreground/[0.08] text-foreground", "bg-foreground/70"],
  emerald: ["border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", "bg-emerald-500"],
  amber: ["border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300", "bg-amber-500"],
  red: ["border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400", "bg-red-500"],
};

// Flow's StatusPill: a dot and a label on a tinted capsule.
export function Pill({ tone = "neutral", dot = true, className, style, children }) {
  const [pill, dotClass] = PILL_TONES[tone];
  return (
    <span className={cn("inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-full border px-2 text-[11px] whitespace-nowrap", pill, className)} style={style}>
      {dot ? <span className={cn("size-1.5 rounded-full", dotClass)} /> : null}
      {children}
    </span>
  );
}

// Flow's StatsBar: one card of divider-separated KPIs, each with a footer line.
export function StatStrip({ stats, className }) {
  return (
    <div className={cn("grid divide-x overflow-hidden rounded-xl border bg-foreground/[0.02] [&>*]:border-foreground/[0.07]", LINE, className)} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={cn("px-4 py-3", styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
          <div className="text-[11px] text-muted-foreground">{stat.label}</div>
          <div className={cn("mt-1 text-[20px] font-medium tracking-[-0.01em] tabular-nums", stat.tone)}>{stat.value}</div>
          {stat.footer ? <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{stat.footer}</div> : null}
        </div>
      ))}
    </div>
  );
}

// A screen title over its one-line description, as Flow's ScreenHeader draws it.
export function ScreenTitle({ title, description, action, className }) {
  return (
    <div className={cn("flex items-start gap-4 border-b pb-4", LINE, className)}>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-semibold tracking-[-0.02em]">{title}</div>
        {description ? <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{description}</div> : null}
      </div>
      {action ? <span className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">{action}</span> : null}
    </div>
  );
}

// A switch drawn on or off.
export function Toggle({ on = false, className }) {
  return (
    <span className={cn("relative inline-flex h-[18px] w-8 shrink-0 rounded-full transition-colors", on ? "bg-foreground" : "bg-foreground/15", className)}>
      <span className={cn("absolute top-[2px] size-[14px] rounded-full bg-background shadow-sm", on ? "left-[16px]" : "left-[2px]")} />
    </span>
  );
}

// A checkbox drawn checked or empty.
export function Checkbox({ checked = false, className }) {
  return (
    <span className={cn("flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border", checked ? "border-foreground bg-foreground" : "border-foreground/30", className)}>
      {checked ? (
        <svg viewBox="0 0 12 12" className="size-2.5 text-background" fill="none">
          <path d="m2.5 6.2 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

// A floating menu surface, for pickers, popovers and dialogs drawn over a window.
export const POPOVER = "rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog";
