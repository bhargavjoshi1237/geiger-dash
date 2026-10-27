import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock,
  Filter,
  Flag,
  Goal,
  Inbox,
  LayoutList,
  Milestone,
  Search,
  TriangleAlert,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, AvatarStack, Chip, Dot, LINE, MonoLabel, PriorityIcon, StatusIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Brightwater Labs on Geiger: Nadia Petrova, head of delivery, reads every project's health, the goals and milestones, who has capacity and where the money goes.

const POPOVER = "rounded-xl border border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";
const CARD = "rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle";

const HEALTH = {
  "On track": { tone: "emerald", bar: "bg-emerald-500", pill: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  "At risk": { tone: "amber", bar: "bg-amber-500", pill: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  "Off track": { tone: "red", bar: "bg-red-500", pill: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300" },
};

function HealthPill({ health, className }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] whitespace-nowrap", HEALTH[health].pill, className)}>
      <Dot tone={HEALTH[health].tone} />
      {health}
    </span>
  );
}

function Progress({ value, health = "On track", delay = 0.4, className }) {
  return (
    <span className={cn("block h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]", className)}>
      <span className={cn("block h-full origin-left rounded-full", HEALTH[health].bar, styles.fill)} style={{ width: `${value}%`, "--fill-delay": `${delay}s` }} />
    </span>
  );
}

const PROJECTS = [
  { name: "Self-serve billing", team: "Payments", lead: "Isla Morgan", health: "At risk", progress: 58, target: "Jan 30", open: 34, members: ["Isla Morgan", "Raj Patel", "Chloe Dubois", "Lucas Brandt"] },
  { name: "Mobile app 3.0", team: "Mobile", lead: "Kenji Watanabe", health: "On track", progress: 72, target: "Dec 12", open: 21, members: ["Kenji Watanabe", "Ama Owusu", "Leo Rossi"] },
  { name: "Data warehouse move", team: "Data", lead: "Sofia Lindqvist", health: "Off track", progress: 31, target: "Nov 28", open: 47, members: ["Sofia Lindqvist", "Arjun Mehta"] },
  { name: "Help centre rebuild", team: "Support", lead: "Femi Adeyemi", health: "On track", progress: 86, target: "Nov 21", open: 8, members: ["Femi Adeyemi", "Nora Kelly"] },
  { name: "SSO for enterprise", team: "Platform", lead: "Mateo García", health: "On track", progress: 64, target: "Feb 6", open: 19, members: ["Mateo García", "Hana Kim", "Tariq Aziz"] },
  { name: "Onboarding emails", team: "Growth", lead: "Ella Byrne", health: "At risk", progress: 42, target: "Dec 5", open: 15, members: ["Ella Byrne", "Sam Okafor"] },
];

const PORTFOLIO_STATS = [
  { label: "Projects", value: "6", hint: "Across 6 teams" },
  { label: "On track", value: "3", hint: "50% of the portfolio", tone: "emerald" },
  { label: "At risk", value: "2", hint: "Need a decision", tone: "amber" },
  { label: "Off track", value: "1", hint: "Past its plan", tone: "red" },
];

function PortfolioTable({ highlight }) {
  return (
    <>
      <div className={cn("grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_76px_64px_92px] items-center gap-4 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Project</span>
        <span>Health</span>
        <span>Progress</span>
        <span>Target</span>
        <span className="text-right">Open</span>
        <span>Team</span>
      </div>
      {PROJECTS.map((project, index) => (
        <div
          key={project.name}
          className={cn("grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_76px_64px_92px] items-center gap-4 border-b px-5 py-3 last:border-b-0", LINE, project.name === highlight && "bg-foreground/[0.04]")}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={project.lead} size={24} />
            <div className="min-w-0">
              <div className="truncate font-medium">{project.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {project.team} · led by {project.lead}
              </div>
            </div>
          </div>
          <HealthPill health={project.health} className="justify-self-start" />
          <div className="flex items-center gap-2.5">
            <Progress value={project.progress} health={project.health} delay={0.5 + index * 0.12} className="flex-1" />
            <span className="w-8 text-right text-[11.5px] text-muted-foreground tabular-nums">{project.progress}%</span>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] text-foreground/80">
            <Calendar className="size-3.5 text-muted-foreground" />
            {project.target}
          </span>
          <span className="text-right text-[12px] text-foreground/80 tabular-nums">{project.open}</span>
          <AvatarStack names={project.members.slice(0, 3)} size={20} />
        </div>
      ))}
    </>
  );
}

function PortfolioHead() {
  return (
    <>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <AppMark id="flow" size={22} />
        <span className="font-medium">Projects</span>
        <span className="text-muted-foreground">Brightwater Labs</span>
        <span className="ml-auto flex items-center gap-2 text-[12px]">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-muted-foreground">
            <Filter className="size-3.5" /> Health
          </span>
          <span className="flex h-7 w-[170px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-muted-foreground">
            <Search className="size-3.5" /> Search projects
          </span>
        </span>
      </div>
      <div className={cn("grid grid-cols-4 border-b", LINE)}>
        {PORTFOLIO_STATS.map((stat, index) => (
          <div key={stat.label} className={cn("px-5 py-3", index > 0 && "border-l", LINE)}>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {stat.tone ? <Dot tone={stat.tone} /> : <LayoutList className="size-3.5" strokeWidth={1.75} />}
              {stat.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[22px] font-medium tracking-[-0.02em] tabular-nums">{stat.value}</span>
              <span className="truncate text-[11px] text-muted-foreground">{stat.hint}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Hero: Brightwater's portfolio of projects with health and progress, the at-risk billing project's update open beside it.
export function PortfolioHeroWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[1000px]">
        <PortfolioHead />
        <PortfolioTable highlight="Self-serve billing" />
      </Window>
      <ProjectUpdateCard className={cn("absolute top-[150px] left-[790px] z-[2] w-[370px]", styles.float)} />
    </div>
  );
}

// The latest project update: the lead's note on why the project is at risk and the decision it needs.
function ProjectUpdateCard({ className }) {
  return (
    <div className={cn(POPOVER, "overflow-hidden text-[12.5px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <span className="font-medium">Self-serve billing</span>
        <HealthPill health="At risk" className="ml-auto" />
      </div>
      <div className="flex flex-col gap-3 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Avatar name="Isla Morgan" size={22} />
          <span className="font-medium">Isla Morgan</span>
          <span className="text-[11px] text-muted-foreground">Weekly update · today</span>
        </div>
        <p className="leading-[1.5] text-foreground/85">Tax handling for EU invoices is bigger than we sized. We can hold Jan 30 if we borrow one engineer from Platform for three weeks.</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Done", "41"],
            ["In progress", "12"],
            ["To do", "22"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-2.5 py-2">
              <div className="text-[16px] font-medium tabular-nums">{value}</div>
              <div className="text-[10.5px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <div className={cn("flex items-center gap-2 rounded-lg border border-dashed border-foreground/20 px-3 py-2 text-[12px]", styles.popIn)} style={{ "--pop-delay": "1.4s" }}>
          <UserPlus className="size-3.5 text-muted-foreground" />
          Resource request: 1 engineer, 3 weeks
          <span className="ml-auto rounded-md bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">Review</span>
        </div>
      </div>
    </div>
  );
}

// Section stage: the portfolio with one project's update open, so the at-risk work and the decision it needs sit on one screen.
export function PortfolioStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[560px] w-[1000px]">
        <PortfolioHead />
        <PortfolioTable highlight="Data warehouse move" />
      </Window>
      <div className={cn(POPOVER, "absolute top-[296px] left-[226px] z-[2] w-[330px] p-3.5 text-[12.5px]", styles.popIn)} style={{ "--pop-delay": "1s" }}>
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4 text-red-500" strokeWidth={2} />
          <span className="font-medium">Data warehouse move</span>
        </div>
        <p className="mt-1.5 leading-[1.45] text-muted-foreground">31% done with two weeks to go. 47 issues open, 9 of them blocked on the vendor export.</p>
        <div className="mt-2.5 flex items-center gap-2">
          <Avatar name="Sofia Lindqvist" size={20} />
          <span className="text-[12px] text-foreground/85">
            <Typed text="Moving the date to Dec 19." delay={1.8} />
          </span>
        </div>
      </div>
    </div>
  );
}

const SAVED_VIEWS = [
  { name: "Active", count: 96, icon: CircleDot },
  { name: "Urgent & high", count: 14, icon: TriangleAlert },
  { name: "Unassigned", count: 9, icon: Users },
  { name: "Overdue", count: 5, icon: Clock },
];

const URGENT = [
  { id: "BIL-212", title: "EU VAT on credit notes", priority: "urgent", status: "progress", who: "Raj Patel" },
  { id: "DWH-88", title: "Vendor export times out after 2m", priority: "urgent", status: "todo", who: "Arjun Mehta" },
  { id: "MOB-341", title: "Crash on resume with an expired token", priority: "high", status: "review", who: "Ama Owusu" },
  { id: "SSO-57", title: "SAML metadata upload for any identity provider", priority: "high", status: "progress", who: "Hana Kim" },
];

// Cell: the views a manager checks every morning, Urgent & high open across every team.
export function MorningViewsRender() {
  return (
    <div className={cn(CARD, "w-[470px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-1 border-b px-3 py-2", LINE)}>
        {SAVED_VIEWS.map((view) => {
          const Icon = view.icon;
          return (
            <span key={view.name} className={cn("flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px]", view.name === "Urgent & high" ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
              <Icon className="size-3.5" strokeWidth={1.75} />
              {view.name}
              <span className="text-[11px] text-muted-foreground tabular-nums">{view.count}</span>
            </span>
          );
        })}
      </div>
      {URGENT.map((issue, index) => (
        <div key={issue.id} className={cn("flex items-center gap-2.5 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
          <PriorityIcon level={issue.priority} />
          <span className="w-[58px] shrink-0 font-mono text-[11px] text-muted-foreground">{issue.id}</span>
          <StatusIcon status={issue.status} />
          <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
          <Avatar name={issue.who} size={20} />
        </div>
      ))}
    </div>
  );
}

const TEAM_PROJECTS = [
  { name: "Payments", apps: ["flow", "forms", "grey"], members: 9 },
  { name: "Mobile", apps: ["flow", "notes"], members: 7 },
  { name: "Data", apps: ["flow", "grey"], members: 5 },
  { name: "Support", apps: ["flow", "forms", "content"], members: 6 },
];

// Cell: the organisation's projects, one per team, each with the apps it works in and how many people are on it.
export function TeamProjectsRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[12px] font-semibold text-background">B</span>
        <span className="font-medium">Brightwater Labs</span>
        <span className="ml-auto text-[11.5px] text-muted-foreground">6 projects · 41 people</span>
      </div>
      {TEAM_PROJECTS.map((team, index) => (
        <div key={team.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span className="flex size-8 items-center justify-center rounded-lg border border-foreground/[0.12] bg-foreground/[0.05] font-semibold text-foreground/80">{team.name[0]}</span>
          <div className="w-[96px] min-w-0">
            <div className="truncate font-medium">{team.name}</div>
            <div className="text-[11px] text-muted-foreground">{team.members} members</div>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {team.apps.map((id) => (
              <AppMark key={id} id={id} size={24} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const MILESTONES = [
  { name: "Pricing page live", date: "Oct 24", state: "done" },
  { name: "Checkout with saved cards", date: "Nov 21", state: "progress" },
  { name: "Invoices and credit notes", date: "Dec 19", state: "progress" },
  { name: "Self-serve plan changes", date: "Jan 30", state: "todo" },
];

// Callout centrepiece: the quarter's goal with its milestones, the progress ring filling from the work underneath.
export function GoalRender() {
  const value = 58;
  const circumference = 2 * Math.PI * 34;
  return (
    <div className={cn(CARD, "w-[520px] overflow-hidden text-[12.5px] shadow-xl shadow-black/15")}>
      <div className={cn("flex items-center gap-4 border-b px-5 py-4", LINE)}>
        <svg viewBox="0 0 80 80" className="size-[72px] shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="7" className="text-foreground" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-amber-500" strokeDasharray={`${(circumference * value) / 100} ${circumference}`} />
        </svg>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Goal className="size-3.5" strokeWidth={1.75} /> Q1 goal
          </div>
          <div className="mt-0.5 text-[16px] font-medium tracking-[-0.01em]">Customers change their own plan</div>
          <div className="mt-1 flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <Avatar name="Isla Morgan" size={16} /> Isla Morgan · due Jan 30 · <span className="text-foreground/85 tabular-nums">{value}%</span>
          </div>
        </div>
        <HealthPill health="At risk" />
      </div>
      <div className="px-5 pt-3 pb-1">
        <MonoLabel className="text-[10px]">Milestones</MonoLabel>
      </div>
      <div className="flex flex-col px-5 pb-4">
        {MILESTONES.map((milestone, index) => (
          <div key={milestone.name} className={cn("flex items-center gap-3 border-b py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.18}s` }}>
            {milestone.state === "done" ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : (
              <Milestone className={cn("size-4", milestone.state === "progress" ? "text-amber-500" : "text-muted-foreground")} strokeWidth={1.75} />
            )}
            <span className={cn("min-w-0 flex-1 truncate", milestone.state === "done" ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90")}>{milestone.name}</span>
            <span className="text-[11.5px] text-muted-foreground tabular-nums">{milestone.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const ROADMAP = [
  { name: "Self-serve billing", start: 0, span: 4, health: "At risk", done: 58 },
  { name: "Mobile app 3.0", start: 0.5, span: 2.4, health: "On track", done: 72 },
  { name: "Data warehouse move", start: 0, span: 2.6, health: "Off track", done: 31 },
  { name: "SSO for enterprise", start: 1.2, span: 3.2, health: "On track", done: 64 },
  { name: "Usage-based pricing", start: 3.4, span: 2.4, health: "On track", done: 0 },
];

// Cell: the roadmap across two quarters, each project a bar coloured by health with today marked.
export function RoadmapRender() {
  const column = 64;
  return (
    <div className={cn(CARD, "w-[470px] overflow-hidden text-[12px]")}>
      <div className={cn("flex border-b", LINE)}>
        <span className="w-[86px] shrink-0" />
        {MONTHS.map((month) => (
          <span key={month} className={cn("border-l py-2 text-center text-[11px] text-muted-foreground", LINE)} style={{ width: column }}>
            {month}
          </span>
        ))}
      </div>
      <div className="relative">
        <span className="absolute top-0 bottom-0 z-[1] w-px bg-red-500/70" style={{ left: 86 + column * 0.9 }}>
          <span className="absolute -top-0 -left-[3px] size-[7px] rounded-full bg-red-500" />
        </span>
        {ROADMAP.map((row, index) => (
          <div key={row.name} className={cn("flex h-11 items-center border-b last:border-b-0", LINE)}>
            <span className="w-[86px] shrink-0 truncate px-3 text-[11px] text-foreground/85">{row.name}</span>
            <div className="relative h-full flex-1">
              <span
                className={cn("absolute top-1/2 flex h-6 -translate-y-1/2 items-center overflow-hidden rounded-md border border-foreground/[0.1] bg-foreground/[0.05]", styles.popIn)}
                style={{ left: row.start * column + 4, width: row.span * column, "--pop-delay": `${0.2 + index * 0.15}s` }}
              >
                <span className={cn("block h-full origin-left opacity-70", HEALTH[row.health].bar, styles.fill)} style={{ width: `${row.done}%`, "--fill-delay": `${0.6 + index * 0.15}s` }} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCOPE = "M0 70 L40 66 L80 60 L120 58 L160 52 L200 50 L240 48 L280 48";
const DONE = "M0 118 L40 108 L80 96 L120 90 L160 76 L200 70 L240 62 L280 58";
const IDEAL = "M0 118 L280 48";

// Cell: the current cycle's scope against completed work, the gap closing as the two lines meet.
export function CycleRender() {
  return (
    <div className={cn(CARD, "w-[460px] px-4 py-3.5 text-[12px]")}>
      <div className="flex items-center gap-2">
        <span className="font-medium">Cycle 14</span>
        <span className="text-muted-foreground">Payments · Nov 3 to Nov 16</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
          <ArrowUpRight className="size-3.5" /> 82% done
        </span>
      </div>
      <svg viewBox="0 0 280 128" className="mt-3 h-[150px] w-full text-foreground" aria-hidden="true" preserveAspectRatio="none">
        {[30, 60, 90, 120].map((y) => (
          <line key={y} x1="0" x2="280" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" />
        ))}
        <path d={IDEAL} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 4" strokeWidth="1.2" />
        <path d={SCOPE} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.8" />
        <path d={`${DONE} L280 128 L0 128 Z`} className="fill-emerald-500/10" />
        <path d={DONE} fill="none" className="stroke-emerald-500" strokeWidth="2" />
        <circle cx="280" cy="58" r="3.5" className={cn("fill-emerald-500 text-emerald-500", styles.pulse)} />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-foreground/55" /> Scope 61
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-emerald-500" /> Completed 50
        </span>
        <span className="ml-auto">3 days left</span>
      </div>
    </div>
  );
}

const ASSIGNEES = [
  { name: "Raj Patel", team: "Payments", todo: 4, progress: 3, review: 1, load: 92 },
  { name: "Arjun Mehta", team: "Data", todo: 6, progress: 2, review: 0, load: 100 },
  { name: "Ama Owusu", team: "Mobile", todo: 2, progress: 2, review: 2, load: 70 },
  { name: "Hana Kim", team: "Platform", todo: 1, progress: 1, review: 1, load: 42 },
  { name: "Nora Kelly", team: "Support", todo: 1, progress: 1, review: 0, load: 30 },
  { name: "Tariq Aziz", team: "Platform", todo: 2, progress: 0, review: 1, load: 38 },
];

const QUEUE_STATS = [
  { label: "Queued", value: "58", icon: Inbox },
  { label: "Due today", value: "7", icon: Calendar },
  { label: "Overdue", value: "4", icon: Clock, tone: "red" },
];

const REQUESTS = [
  { who: "Isla Morgan", project: "Self-serve billing", ask: "1 backend engineer · 3 weeks", state: "Pending" },
  { who: "Sofia Lindqvist", project: "Data warehouse move", ask: "Contractor with dbt · 6 weeks", state: "Pending" },
  { who: "Kenji Watanabe", project: "Mobile app 3.0", ask: "QA tester · 2 weeks", state: "Approved" },
];

// Section stage: the work queue grouped by person across teams, two people full and one with room, and the resource requests waiting for a decision.
export function CapacityStage() {
  return (
    <Window className="h-[620px] w-[1000px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <AppMark id="flow" size={22} />
        <span className="font-medium">Work Queue</span>
        <span className="text-muted-foreground">Grouped by assignee</span>
        <span className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          All teams <ChevronDown className="size-3.5" />
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <div className={cn("grid grid-cols-3 border-b", LINE)}>
            {QUEUE_STATS.map(({ label, value, icon: Icon, tone }, index) => (
              <div key={label} className={cn("px-5 py-3", index > 0 && "border-l", LINE)}>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Icon className="size-3.5" strokeWidth={1.75} />
                  {label}
                </div>
                <div className={cn("mt-1 text-[22px] font-medium tracking-[-0.02em] tabular-nums", tone === "red" && "text-red-600 dark:text-red-400")}>{value}</div>
              </div>
            ))}
          </div>
          <div className={cn("grid grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] gap-4 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
            <span>Assignee</span>
            <span>To do · In progress · Review</span>
            <span>Load this cycle</span>
          </div>
          {ASSIGNEES.map((person, index) => (
            <div key={person.name} className={cn("grid grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-3", LINE, person.load >= 100 && "bg-red-500/[0.04]")}>
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={person.name} size={26} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{person.name}</div>
                  <div className="text-[11px] text-muted-foreground">{person.team}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[12px] tabular-nums">
                <span className="flex items-center gap-1">
                  <StatusIcon status="todo" /> {person.todo}
                </span>
                <span className="flex items-center gap-1">
                  <StatusIcon status="progress" /> {person.progress}
                </span>
                <span className="flex items-center gap-1">
                  <StatusIcon status="review" /> {person.review}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="block h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                  <span
                    className={cn("block h-full origin-left rounded-full", person.load >= 100 ? "bg-red-500" : person.load >= 85 ? "bg-amber-500" : "bg-emerald-500", styles.fill)}
                    style={{ width: `${person.load}%`, "--fill-delay": `${0.4 + index * 0.12}s` }}
                  />
                </span>
                <span className="w-9 text-right text-[11.5px] text-muted-foreground tabular-nums">{person.load}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className={cn("w-[300px] shrink-0 border-l bg-foreground/[0.015]", LINE)}>
          <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
            <UserPlus className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Resource requests</span>
            <span className="ml-auto rounded-full bg-foreground/[0.07] px-2 text-[11px] leading-5 text-muted-foreground tabular-nums">2</span>
          </div>
          {REQUESTS.map((request, index) => (
            <div key={request.project} className={cn("border-b px-4 py-3", LINE)}>
              <div className="flex items-center gap-2">
                <Avatar name={request.who} size={20} />
                <span className="truncate font-medium">{request.project}</span>
              </div>
              <div className="mt-1 pl-7 text-[12px] text-foreground/80">{request.ask}</div>
              <div className="mt-2 flex items-center gap-1.5 pl-7">
                {request.state === "Approved" ? (
                  <span className="inline-flex items-center gap-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" /> Approved by Nadia Petrova
                  </span>
                ) : index === 0 ? (
                  <span className={cn("inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11.5px] text-emerald-700 dark:text-emerald-300", styles.popIn)} style={{ "--pop-delay": "2s" }}>
                    <CheckCircle2 className="size-3.5" /> Approved · Tariq Aziz assigned
                  </span>
                ) : (
                  <>
                    <span className="rounded-md bg-foreground px-2.5 py-0.5 text-[11.5px] font-medium text-background">Approve</span>
                    <span className="rounded-md border border-foreground/[0.1] px-2.5 py-0.5 text-[11.5px] text-muted-foreground">Deny</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

// Cell: a resource request from a project lead, what it asks for and why, with the manager's decision buttons.
export function ResourceRequestRender() {
  return (
    <div className="relative h-[290px] w-[460px]">
      <div className={cn(POPOVER, "absolute top-0 left-0 w-[360px] overflow-hidden text-[12.5px]")}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <UserPlus className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Resource request</span>
          <Chip dot="amber" className="ml-auto h-5 px-2 text-[11px]">
            Pending
          </Chip>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-4 py-3.5">
          {[
            ["Project", "Data warehouse move"],
            ["Requested by", "Sofia Lindqvist"],
            ["Role", "Contractor with dbt"],
            ["For", "6 weeks from Nov 17"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="truncate text-foreground/90">{value}</div>
            </div>
          ))}
          <div className="col-span-2">
            <div className="text-[11px] text-muted-foreground">Reason</div>
            <div className="leading-[1.45] text-foreground/85">The vendor export rewrite needs someone who has done a dbt migration before.</div>
          </div>
        </div>
        <div className={cn("flex items-center justify-end gap-2 border-t px-4 py-2.5", LINE)}>
          <span className="rounded-md border border-foreground/[0.1] px-3 py-1.5 text-muted-foreground">Deny</span>
          <span className="rounded-md bg-foreground px-3 py-1.5 font-medium text-background">Approve</span>
        </div>
      </div>
      <div className={cn(POPOVER, "absolute right-0 bottom-2 z-[2] w-[220px] px-3.5 py-3 text-[12px]", styles.float)}>
        <div className="flex items-center gap-2">
          <Avatar name="Nadia Petrova" size={20} />
          <span className="font-medium">Nadia Petrova</span>
        </div>
        <p className="mt-1.5 leading-[1.4] text-foreground/85">
          <Typed text="Approved, budget it under Data." delay={1.2} />
        </p>
      </div>
    </div>
  );
}

const DUE = [
  { id: "BIL-198", title: "Proration for mid-cycle upgrades", due: "Today", who: "Raj Patel", status: "progress" },
  { id: "HC-64", title: "Redirects from the old help centre", due: "Today", who: "Nora Kelly", status: "review" },
  { id: "DWH-71", title: "Backfill October events", due: "2 days late", who: "Arjun Mehta", status: "todo", late: true },
  { id: "MOB-322", title: "Push opt-in copy", due: "1 day late", who: "Leo Rossi", status: "progress", late: true },
];

// Cell: what's due today and what's slipped, across every team, from the work queue.
export function DueTodayRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Calendar className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Due today and overdue</span>
        <span className="ml-auto text-[11.5px] text-muted-foreground">All teams</span>
      </div>
      {DUE.map((issue, index) => (
        <div key={issue.id} className={cn("flex items-center gap-2.5 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
          <StatusIcon status={issue.status} />
          <span className="w-[58px] shrink-0 font-mono text-[11px] text-muted-foreground">{issue.id}</span>
          <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
          <span className={cn("shrink-0 text-[11.5px]", issue.late ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{issue.due}</span>
          <Avatar name={issue.who} size={20} />
        </div>
      ))}
    </div>
  );
}

const BUDGET_LINES = [
  { name: "Cloud hosting", budget: 18400, committed: 17250, forecast: 19100 },
  { name: "Contractors", budget: 24000, committed: 19800, forecast: 23600 },
  { name: "Software licences", budget: 6200, committed: 5940, forecast: 6050 },
  { name: "Data pipeline", budget: 4800, committed: 5300, forecast: 5650 },
  { name: "Observability", budget: 3100, committed: 2280, forecast: 2700 },
];

const money = (value) => `£${value.toLocaleString("en-GB")}`;

// SplitShowcase render: the month's budget tracker, committed spend against budget line by line, with the forecast and the variance it leaves.
export function BudgetRender() {
  const totals = BUDGET_LINES.reduce((sum, line) => ({ budget: sum.budget + line.budget, committed: sum.committed + line.committed, forecast: sum.forecast + line.forecast }), { budget: 0, committed: 0, forecast: 0 });
  return (
    <Window className="h-[460px] w-[680px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <AppMark id="flow" size={22} />
        <span className="font-medium">Budget</span>
        <span className="text-muted-foreground">November</span>
        <Chip className="ml-auto h-6">Engineering</Chip>
      </div>
      <div className={cn("grid grid-cols-4 border-b", LINE)}>
        {[
          ["Monthly budget", money(totals.budget)],
          ["Committed", money(totals.committed)],
          ["Forecast", money(totals.forecast)],
          ["Variance", `+${money(totals.forecast - totals.budget)}`],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-4 py-3", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className={cn("mt-1 text-[18px] font-medium tracking-[-0.02em] tabular-nums", index === 3 && "text-amber-600 dark:text-amber-400")}>{value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_80px_80px] gap-4 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Line</span>
        <span>Committed of budget</span>
        <span className="text-right">Forecast</span>
        <span className="text-right">Variance</span>
      </div>
      {BUDGET_LINES.map((line, index) => {
        const share = Math.min(line.committed / line.budget, 1);
        const over = line.forecast > line.budget;
        const variance = line.forecast - line.budget;
        return (
          <div key={line.name} className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_80px_80px] items-center gap-4 border-b px-5 py-3 last:border-b-0", LINE)}>
            <span className="truncate text-foreground/90">{line.name}</span>
            <div>
              <span className="block h-2 overflow-hidden rounded-full bg-foreground/[0.07]">
                <span
                  className={cn("block h-full origin-left rounded-full", line.committed > line.budget ? "bg-red-500" : over ? "bg-amber-500" : "bg-foreground/60", styles.fill)}
                  style={{ width: `${share * 100}%`, "--fill-delay": `${0.4 + index * 0.12}s` }}
                />
              </span>
              <div className="mt-1 text-[10.5px] text-muted-foreground tabular-nums">
                {money(line.committed)} of {money(line.budget)}
              </div>
            </div>
            <span className="text-right text-[12px] text-foreground/85 tabular-nums">{money(line.forecast)}</span>
            <span className={cn("inline-flex items-center justify-end gap-0.5 text-right text-[12px] tabular-nums", over ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
              {over ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {money(Math.abs(variance))}
            </span>
          </div>
        );
      })}
    </Window>
  );
}

const SPEND = [62, 58, 66, 71, 64, 78];
const SPEND_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

// Cell: six months of spend against the budget line, the latest month's forecast tipping over.
export function SpendTrendRender() {
  const points = SPEND.map((value, index) => [20 + index * 52, 120 - value]);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <div className={cn(CARD, "w-[460px] px-4 py-3.5 text-[12px]")}>
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Spend against budget</span>
        <span className="ml-auto text-[11.5px] text-muted-foreground">Last 6 months</span>
      </div>
      <svg viewBox="0 0 300 130" className="mt-3 h-[150px] w-full text-foreground" aria-hidden="true" preserveAspectRatio="none">
        {[30, 60, 90].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" />
        ))}
        <line x1="0" x2="300" y1="50" y2="50" className="stroke-amber-500" strokeOpacity="0.8" strokeDasharray="5 4" strokeWidth="1.4" />
        <path d={`${line} L280 130 L20 130 Z`} fill="currentColor" fillOpacity="0.05" />
        <path d={line} fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeLinejoin="round" />
        {points.map(([x, y], index) => (
          <circle key={x} cx={x} cy={y} r={index === points.length - 1 ? 4 : 2.5} className={index === points.length - 1 ? cn("fill-amber-500 text-amber-500", styles.pulse) : "fill-foreground/70"} />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-[10px] text-[10.5px] text-muted-foreground">
        {SPEND_MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-foreground/70" /> Committed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-amber-500" /> Budget
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Flag className="size-3" /> November forecast over by £600
        </span>
      </div>
    </div>
  );
}

const PLAN_USAGE = [
  { label: "Collaborators", used: 41, total: 50, unit: "" },
  { label: "Active Projects", used: 6, total: 10, unit: "" },
  { label: "Storage", used: 214, total: 500, unit: "GB" },
  { label: "AI Credits", used: 7800, total: 10000, unit: "" },
];

// Cell: the organisation's own usage of the suite this month, seats and credits against the plan.
export function PlanUsageRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[12px] font-semibold text-background">B</span>
        <span className="font-medium">Usage</span>
        <span className="text-muted-foreground">this billing month</span>
        <Chip className="ml-auto h-6">Pro plan</Chip>
      </div>
      <div className="flex flex-col gap-3 px-4 py-3.5">
        {PLAN_USAGE.map((row, index) => {
          const share = row.used / row.total;
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-foreground/85">{row.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {row.used.toLocaleString("en-GB")} / {row.total.toLocaleString("en-GB")} {row.unit}
                </span>
              </div>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                <span
                  className={cn("block h-full origin-left rounded-full", share > 0.75 ? "bg-amber-500" : "bg-foreground/65", styles.fill)}
                  style={{ width: `${share * 100}%`, "--fill-delay": `${0.4 + index * 0.15}s` }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
