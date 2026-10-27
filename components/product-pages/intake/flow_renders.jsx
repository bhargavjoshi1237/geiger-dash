import { Check, Inbox, Layers, ListTodo, Search, Target, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Kbd, LINE, PriorityIcon, StatusIcon, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Flow's tracker on its Triage view: new, unassigned issues waiting for a decision.

const TRIAGE = [
  { id: "GEIG-91", title: "Background sync drains battery on Android", labels: ["mobile", "performance"], priority: "high", time: "4m" },
  { id: "GEIG-92", title: "Share dialog loses focus after inviting a member", labels: ["a11y", "bug"], priority: "high", time: "18m" },
  { id: "GEIG-93", title: "Board export to PDF cuts off the last column", labels: ["bug"], priority: "medium", time: "1h" },
  { id: "GEIG-94", title: "Let admins pin a board for the whole team", labels: ["feature"], priority: "low", time: "3h" },
  { id: "GEIG-95", title: "Typo in the workspace invite email", labels: ["copy"], priority: "none", time: "5h" },
  { id: "GEIG-96", title: "Comments vanish after switching boards offline", labels: ["bug", "sync"], priority: "urgent", time: "6h" },
  { id: "GEIG-97", title: "Show who is presenting on the video stage", labels: ["feature"], priority: "medium", time: "1d" },
  { id: "GEIG-98", title: "Mirror cards ignore the source board's colours", labels: ["bug"], priority: "low", time: "2d" },
];

function NavItem({ icon: Icon, label, count, active = false, indent = false }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", indent && "pl-6", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
      {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : <span className="size-3.5" />}
      <span className="truncate">{label}</span>
      {count ? <span className="ml-auto text-[11px] text-muted-foreground">{count}</span> : null}
    </div>
  );
}

function TrackerSidebar() {
  return (
    <div className={cn("flex w-[200px] shrink-0 flex-col gap-0.5 border-r px-2.5 py-3 text-[12px]", LINE)}>
      <div className="mb-2 flex items-center gap-2 px-2">
        <span className="flex size-5 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">G</span>
        <span className="font-medium">Geiger Notes</span>
      </div>
      <div className="mb-2 flex items-center gap-2 rounded-md border border-foreground/[0.08] px-2 py-1.5 text-muted-foreground">
        <Search className="size-3.5" /> Search <span className="ml-auto"><Kbd>⌘K</Kbd></span>
      </div>
      <NavItem icon={Inbox} label="Inbox" count="5" />
      <NavItem icon={ListTodo} label="My Issues" />
      <div className="mt-3 mb-1 px-2 text-[11px] text-muted-foreground">Workspace</div>
      <NavItem icon={Target} label="Initiatives" />
      <NavItem icon={Layers} label="Divisions" />
      <NavItem icon={Users} label="Members" />
      <div className="mt-3 mb-1 px-2 text-[11px] text-muted-foreground">Your teams</div>
      <NavItem label="Issues" indent />
      <NavItem label="Triage" count="8" indent active />
      <NavItem label="Cycles" indent />
    </div>
  );
}

function TriageRow({ issue, selected }) {
  return (
    <div className={cn("group flex items-center gap-3 border-b px-5 py-2.5", LINE, selected && "bg-foreground/[0.045]")}>
      <PriorityIcon level={issue.priority} />
      <span className="w-16 shrink-0 font-mono text-[11px] text-muted-foreground">{issue.id}</span>
      <StatusIcon status="backlog" />
      <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
      <span className="flex shrink-0 gap-1">
        {issue.labels.map((label) => (
          <Chip key={label} dot="neutral" className="h-5 px-2 text-[11px]">
            {label}
          </Chip>
        ))}
      </span>
      {selected ? (
        <span className="flex shrink-0 items-center gap-1">
          <span className="flex h-6 items-center gap-1 rounded-md bg-foreground px-2 text-[11px] font-medium text-background">
            <Check className="size-3" /> Accept
          </span>
          <span className="flex h-6 items-center gap-1 rounded-md border border-foreground/10 px-2 text-[11px] text-muted-foreground">
            <X className="size-3" /> Decline
          </span>
        </span>
      ) : (
        <span className="w-8 shrink-0 text-right text-[11px] text-muted-foreground">{issue.time}</span>
      )}
    </div>
  );
}

function PropertyRow({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-foreground/90">{children}</span>
    </div>
  );
}

function IssueProperties({ className }) {
  return (
    <Window className={cn("w-[300px]", className)}>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="font-mono text-[11px] text-muted-foreground">GEIG-91</div>
        <div className="mt-1 leading-5 font-medium">Background sync drains battery on Android</div>
      </div>
      <div className="px-5 py-3 text-[12px]">
        <PropertyRow label="Status">
          <StatusIcon status="todo" /> Todo
        </PropertyRow>
        <PropertyRow label="Priority">
          <PriorityIcon level="high" /> High
        </PropertyRow>
        <PropertyRow label="Assignee">
          <Avatar name="Nathan Okafor" size={16} /> Nathan Okafor
        </PropertyRow>
        <PropertyRow label="Labels">
          <Chip dot="neutral" className="h-5 px-2 text-[11px]">
            mobile
          </Chip>
          <Chip dot="neutral" className="h-5 px-2 text-[11px]">
            performance
          </Chip>
        </PropertyRow>
        <PropertyRow label="Cycle">Cycle 7 - GA Hardening</PropertyRow>
        <PropertyRow label="Estimate">3 points</PropertyRow>
      </div>
    </Window>
  );
}

export function TriageStage() {
  return (
    <div className="relative h-[560px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[860px] flex-row">
        <div className="flex h-full w-full">
          <TrackerSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
              <span className="font-medium">Triage</span>
              <span className="text-muted-foreground">8 to triage</span>
            </div>
            <div className={cn("flex items-center gap-3 border-b bg-foreground/[0.025] px-5 py-2 text-[12px]", LINE)}>
              <span className="text-muted-foreground">Bulk triage</span>
              <span className="ml-auto flex h-7 items-center gap-1.5 rounded-md border border-foreground/10 px-2.5">
                <Check className="size-3.5" /> Accept all into Todo
              </span>
              <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/10 px-2.5 text-muted-foreground">
                <X className="size-3.5" /> Decline all
              </span>
            </div>
            {TRIAGE.map((issue, index) => (
              <TriageRow key={issue.id} issue={issue} selected={index === 0} />
            ))}
          </div>
        </div>
      </Window>
      <IssueProperties className={cn("absolute top-[150px] left-[700px] z-[2]", styles.float)} />
    </div>
  );
}
