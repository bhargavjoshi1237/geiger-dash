import {
  AlignLeft,
  ArrowUp,
  Banknote,
  Box,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  Database,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Fingerprint,
  GitBranch,
  Globe,
  Inbox,
  Kanban,
  Key,
  Link2,
  ListChecks,
  ListTodo,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  PenLine,
  Plus,
  Presentation,
  Repeat,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  SquareStack,
  Table2,
  Tag,
  Terminal,
  TrendingUp,
  TriangleAlert,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  Webhook,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Bar, Chip, Dot, Kbd, LINE, MonoLabel, PriorityIcon, StatusIcon, Typed, TypingDots, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Kestrel Aero's operations desk: requests in Geiger Forms, the work in Geiger Flow, answers in Geiger Grey and shared keys in Flow's vault.

const POPOVER = "rounded-xl border border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";
const CARD = "rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle";


const REQUEST_TONES = { Complete: "emerald", Approved: "emerald", "Needs review": "amber", Pending: "amber", "In progress": "strong", Rejected: "red" };

function RequestStatus({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground/85">
      <Dot tone={REQUEST_TONES[status]} />
      {status}
    </span>
  );
}

function RequestPriority({ level }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground/80">
      <PriorityIcon level={level.toLowerCase()} />
      {level}
    </span>
  );
}

const IT_REQUESTS = [
  { name: "Kofi Asante", team: "Line maintenance", request: "Crew rostering · read and write", status: "Pending", priority: "High", owner: "Samuel Okoro", time: "4m", fresh: true },
  { name: "Hana Ito", team: "Cabin crew training", request: "Training portal admin", status: "Needs review", priority: "Medium", owner: "Elena Rossi", time: "22m" },
  { name: "Ravi Menon", team: "Ground operations", request: "Hangar 7 airside badge", status: "Approved", priority: "High", owner: "Samuel Okoro", time: "1h" },
  { name: "Theo Lindqvist", team: "Flight operations", request: "Re-enrol a flight-ops tablet", status: "In progress", priority: "Medium", owner: "Samuel Okoro", time: "3h" },
  { name: "Ines Duarte", team: "Finance", request: "Finance shared drive", status: "Complete", priority: "Low", owner: "Elena Rossi", time: "5h" },
  { name: "Noah Fischer", team: "Engineering", request: "Maintenance log write access", status: "Pending", priority: "High", owner: "", time: "1d" },
  { name: "Clara Vidal", team: "Crew scheduling", request: "VPN for remote rostering", status: "Rejected", priority: "Low", owner: "Elena Rossi", time: "1d" },
  { name: "Mia Johansson", team: "Cargo", request: "Cargo office printer queue", status: "Complete", priority: "Low", owner: "Amara Okafor", time: "2d" },
  { name: "Maya Chen", team: "Customer service", request: "Shared inbox for the help desk", status: "Complete", priority: "Medium", owner: "Amara Okafor", time: "2d" },
];

const INBOX_STATS = [
  { label: "Total", value: "248", hint: "All live submissions", icon: Inbox },
  { label: "Needs review", value: "12", hint: "5% of inbox", icon: Clock },
  { label: "Pending approval", value: "5", hint: "In an approval chain", icon: ShieldCheck },
];

const SAVED_VIEWS = ["All responses", "Needs review", "Airside access", "My queue"];

function InboxBar({ form }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
      <AppMark id="forms" size={22} />
      <span className="font-medium">Response Inbox</span>
      <span className="truncate text-muted-foreground">{form}</span>
      <span className="ml-auto flex items-center rounded-md border border-foreground/10 p-0.5 text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
          <Table2 className="size-3.5" /> Table
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5">
          <Kanban className="size-3.5" /> Kanban
        </span>
      </span>
    </div>
  );
}

function InboxStats() {
  return (
    <div className={cn("grid grid-cols-3 border-b", LINE)}>
      {INBOX_STATS.map(({ label, value, hint, icon: Icon }, index) => (
        <div key={label} className={cn("px-5 py-3.5", index > 0 && "border-l", LINE)}>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Icon className="size-3.5" strokeWidth={1.75} />
            {label}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[22px] font-medium tracking-[-0.02em] tabular-nums">{value}</span>
            <span className="truncate text-[11px] text-muted-foreground">{hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ViewsBar() {
  return (
    <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
      {SAVED_VIEWS.map((view, index) => (
        <span key={view} className={cn("rounded-full px-2.5 py-1 whitespace-nowrap", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
          {view}
        </span>
      ))}
      <span className="ml-auto flex h-7 w-[150px] items-center gap-1.5 rounded-md border border-foreground/[0.09] px-2 text-muted-foreground">
        <Search className="size-3.5" /> Search responses
      </span>
    </div>
  );
}

const ROW_GRID = { hero: "grid-cols-[1.45fr_1.55fr_1fr_0.8fr_24px_30px]", stage: "grid-cols-[1.4fr_1.6fr_1fr_0.85fr_24px]" };

function InboxTable({ rows, variant = "stage" }) {
  const grid = ROW_GRID[variant];
  return (
    <>
      <div className={cn("grid gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", grid, LINE)}>
        <span>Respondent</span>
        <span>Access needed</span>
        <span>Status</span>
        <span>Priority</span>
        <span className="text-right">Owner</span>
        {variant === "hero" ? <span className="text-right">When</span> : null}
      </div>
      {rows.map((row, index) => (
        <div
          key={row.name}
          className={cn("grid items-center gap-3 border-b px-5 py-2.5", grid, LINE, row.fresh && cn("bg-foreground/[0.04]", styles.popIn))}
          style={row.fresh ? { "--pop-delay": "0.5s" } : undefined}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={row.name} size={22} />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 truncate font-medium">
                {row.name}
                {row.fresh ? <span className={cn("size-1.5 shrink-0 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> : null}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">{row.team}</span>
            </span>
          </span>
          <span className="truncate text-foreground/85">{row.request}</span>
          <RequestStatus status={row.status} />
          <RequestPriority level={row.priority} />
          <span className="flex justify-end">{row.owner ? <Avatar name={row.owner} size={20} /> : <span className="size-5 rounded-full border border-dashed border-foreground/30" />}</span>
          {variant === "hero" ? <span className="text-right text-[11px] text-muted-foreground tabular-nums">{index === 0 ? "now" : row.time}</span> : null}
        </div>
      ))}
    </>
  );
}


const OPS_TRIAGE = [
  { id: "OPS-231", title: "Hangar 7 door B badge reader rejects valid cards", labels: ["facilities"], priority: "urgent", time: "6m" },
  { id: "OPS-230", title: "Rostering access for three new dispatchers", labels: ["access"], priority: "high", time: "40m" },
  { id: "OPS-229", title: "Ice machine leaking in the Terminal 2 staff lounge", labels: ["facilities"], priority: "medium", time: "2h" },
  { id: "OPS-228", title: "Projector in Briefing C won't find the laptop", labels: ["it"], priority: "low", time: "3h" },
  { id: "OPS-227", title: "Re-enrol two flight-ops tablets after the update", labels: ["devices"], priority: "medium", time: "5h" },
  { id: "OPS-226", title: "Wi-Fi drops in the cargo office after 18:00", labels: ["network"], priority: "high", time: "1d" },
  { id: "OPS-225", title: "Repaint the bay markings in Hangar 7", labels: ["facilities"], priority: "low", time: "1d" },
  { id: "OPS-224", title: "Replace the badge printer ribbon at security", labels: ["facilities"], priority: "medium", time: "2d" },
  { id: "OPS-223", title: "New starter laptop for a crew scheduler", labels: ["devices"], priority: "medium", time: "2d" },
  { id: "OPS-222", title: "Door closer squeaks on the cargo office fire exit", labels: ["facilities"], priority: "low", time: "3d" },
  { id: "OPS-221", title: "Shared mailbox for the line maintenance team", labels: ["access"], priority: "low", time: "3d" },
  { id: "OPS-220", title: "Blinds stuck in the dispatch room", labels: ["facilities"], priority: "low", time: "4d" },
];

function TriageRow({ issue, selected, compact = false }) {
  return (
    <div className={cn("flex items-center gap-3 border-b px-5 py-2.5", LINE, selected && "bg-foreground/[0.045]")}>
      <PriorityIcon level={issue.priority} />
      <span className="w-[58px] shrink-0 font-mono text-[11px] text-muted-foreground">{issue.id}</span>
      <StatusIcon status="triage" />
      <span className="min-w-0 flex-1 truncate text-foreground/90">{issue.title}</span>
      {!compact
        ? issue.labels.map((label) => (
            <Chip key={label} dot="neutral" className="h-5 px-2 text-[11px]">
              {label}
            </Chip>
          ))
        : null}
      <span className="w-7 shrink-0 text-right text-[11px] text-muted-foreground">{issue.time}</span>
    </div>
  );
}

// The hero plane: Kestrel's IT access inbox in Geiger Forms, with the team's Flow triage open beside it on the same account.
export function OpsDeskWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[700px] w-[800px]">
        <InboxBar form="IT access request" />
        <InboxStats />
        <ViewsBar />
        <InboxTable rows={IT_REQUESTS} variant="hero" />
      </Window>
      <Window className="absolute top-[70px] left-[730px] z-[2] h-[630px] w-[450px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <AppMark id="flow" size={22} />
          <span className="font-medium">Triage</span>
          <span className="text-muted-foreground">Facilities &amp; IT</span>
          <span className="ml-auto text-[12px] text-muted-foreground">8 to triage</span>
        </div>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="rounded-lg border border-foreground/[0.14] px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <StatusIcon status="todo" /> New issue · Kestrel Ops
            </div>
            <div className="mt-1.5 text-[14px] font-medium">
              <Typed text="Rostering access for Kofi Asante" delay={1.5} />
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <Chip className="h-5 px-2 text-[11px]">
                <PriorityIcon level="high" /> High
              </Chip>
              <Chip className="h-5 px-2 text-[11px]">
                <Avatar name="Samuel Okoro" size={14} /> Samuel Okoro
              </Chip>
              <span className="ml-auto flex h-6 items-center rounded-md bg-foreground px-2 text-[11px] font-medium text-background">Create issue</span>
            </div>
          </div>
        </div>
        {OPS_TRIAGE.slice(0, 9).map((issue, index) => (
          <TriageRow key={issue.id} issue={issue} selected={index === 0} compact />
        ))}
      </Window>
    </div>
  );
}


function Answer({ label, children }) {
  return (
    <div className="py-1.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-foreground/90">{children}</div>
    </div>
  );
}

function Mention({ children }) {
  return <span className="rounded bg-foreground/[0.08] px-1 text-foreground">{children}</span>;
}

function RequestDetail({ className }) {
  return (
    <Window className={cn("w-[380px]", className)}>
      <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
        <Avatar name="Kofi Asante" size={32} />
        <div className="min-w-0">
          <div className="font-medium">Kofi Asante</div>
          <div className="text-[12px] text-muted-foreground">Line maintenance · 4 minutes ago</div>
        </div>
        <span className="ml-auto">
          <RequestStatus status="Pending" />
        </span>
      </div>
      <div className={cn("grid grid-cols-2 gap-x-4 border-b px-5 py-2", LINE)}>
        <Answer label="Access needed">Crew rostering</Answer>
        <Answer label="Level">Read and write</Answer>
        <Answer label="Start date">Mon 3 Nov</Answer>
        <Answer label="Line manager">Nathan Okafor</Answer>
      </div>
      <div className={cn("flex flex-col gap-2 border-b px-5 py-3.5 text-[12px]", LINE)}>
        <MonoLabel>Approval · step 2 of 2</MonoLabel>
        <div className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-2.5" strokeWidth={3.5} />
          </span>
          <span className="text-foreground/90">Line manager</span>
          <span className="text-muted-foreground">Nathan Okafor</span>
          <span className="ml-auto text-emerald-700 dark:text-emerald-400">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white">
            <Clock className="size-2.5" strokeWidth={3} />
          </span>
          <span className="text-foreground/90">IT security</span>
          <span className="text-muted-foreground">Elena Rossi</span>
          <span className="ml-auto text-amber-700 dark:text-amber-300">Waiting</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MessageSquare className="size-3" /> Comments
        </div>
        <div className="flex gap-2.5">
          <Avatar name="Samuel Okoro" size={22} />
          <p className="leading-5 text-foreground/85">
            <span className="font-medium text-foreground">Samuel Okoro</span> <Mention>@Elena Rossi</Mention> his night shift starts Monday. Can you sign this off today?
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-foreground/[0.12] px-3 py-2">
          <Avatar name="Elena Rossi" size={18} />
          <span className="min-w-0 flex-1 truncate text-foreground/90">
            <Typed text="Signed off, access from Sunday night" delay={1.4} />
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground text-[12px] font-medium text-background">
            <Check className="size-3.5" /> Approve
          </span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-foreground/10 text-[12px] text-muted-foreground">Reject</span>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the IT access inbox with its stats and saved views, and one request open for approval.
export function RequestsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[700px]">
        <InboxBar form="IT access request" />
        <InboxStats />
        <ViewsBar />
        <InboxTable rows={IT_REQUESTS.slice(0, 7)} />
      </Window>
      <RequestDetail className={cn("absolute top-[78px] left-[620px] z-[2]", styles.float)} />
    </div>
  );
}

function FormField({ label, children, hint }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium text-foreground/80">{label}</div>
      {children}
      {hint ? <div className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

function Signature({ className }) {
  return (
    <svg viewBox="0 0 120 36" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <path
        d="M4 26c6-14 12-20 15-15s-5 17 0 15 9-17 13-14-2 13 2 12 7-10 11-9 1 8 5 8 8-7 12-7 4 5 8 5 9-4 14-5M70 22c8-3 20-4 30-2"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FIELD_TYPES = [
  [AlignLeft, "Short text"],
  [ListChecks, "Dropdown"],
  [Paperclip, "File upload"],
  [PenLine, "Signature"],
  [CalendarClock, "Date & time"],
  [MapPin, "Address"],
  [Repeat, "Repeating group"],
];

// Cell: the facilities request as staff fill it in, with the builder's field palette alongside.
export function FacilitiesFormRender() {
  return (
    <div className="relative mx-auto h-[330px] w-[460px]">
      <div className="absolute top-0 left-0 w-[292px] overflow-hidden rounded-2xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="text-[14px] font-medium tracking-[-0.01em]">Facilities request</div>
          <div className="text-[11px] text-muted-foreground">Kestrel Aero · Facilities and IT</div>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <FormField
            label="Location"
            hint={
              <>
                <GitBranch className="size-3" /> Airside locations also ask for an escort
              </>
            }
          >
            <span className="flex h-8 items-center justify-between rounded-md border border-foreground/[0.12] px-2.5 text-foreground/90">
              Hangar 7 · Bay 2 <ChevronDown className="size-3.5 text-muted-foreground" />
            </span>
          </FormField>
          <FormField label="Photo of the problem">
            <span className="flex h-9 items-center gap-2 rounded-md border border-foreground/[0.12] px-2.5">
              <Paperclip className="size-3.5 text-muted-foreground" />
              <span className="text-foreground/90">door-b-sensor.jpg</span>
              <span className="text-muted-foreground">2.4 MB</span>
              <Check className="ml-auto size-3.5 text-emerald-600 dark:text-emerald-400" />
            </span>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-foreground/[0.07]">
              <span className={cn("block h-full w-full origin-left rounded-full bg-emerald-500", styles.fill)} />
            </span>
          </FormField>
          <FormField label="Sign to confirm">
            <span className="flex h-12 items-center rounded-md border border-dashed border-foreground/20 px-2">
              <Signature className="h-9 w-[120px]" />
              <span className="ml-auto self-end pb-1 text-[10.5px] text-muted-foreground">Amara Okafor</span>
            </span>
          </FormField>
        </div>
      </div>
      <div className={cn("absolute top-[34px] right-0 w-[170px] p-1.5 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.35s" }}>
        <div className="px-2 pt-1 pb-1.5">
          <MonoLabel>36 field types</MonoLabel>
        </div>
        {FIELD_TYPES.map(([Icon, label]) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", label === "File upload" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

const ROUTE = [
  { step: "Line manager", who: "Nathan Okafor", time: "09:12" },
  { step: "IT security", who: "Elena Rossi", time: "09:40" },
];

// Cell: a badge request routed through two approvers, then countersigned.
export function ApprovalRouteRender() {
  return (
    <div className={cn("mx-auto w-[440px] text-[13px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Approval route</span>
        <span className="truncate text-muted-foreground">Hangar 7 airside badge</span>
        <Chip className="ml-auto h-5 px-2 text-[11px]">In order</Chip>
      </div>
      <div className="relative flex flex-col gap-3.5 px-4 py-4">
        <span className="absolute top-6 bottom-6 left-[25px] border-l border-dashed border-foreground/20" />
        {ROUTE.map((step, index) => (
          <div key={step.step} className={cn("relative flex items-start gap-3", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.18}s` }}>
            <span className="mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-surface-card bg-emerald-500 text-white dark:border-surface-subtle">
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-foreground/90">
                Step {index + 1} · {step.step}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Approved by {step.who} · {step.time}
              </div>
            </div>
            <Avatar name={step.who} size={20} />
          </div>
        ))}
      </div>
      <div className={cn("mx-4 mb-4 flex items-center gap-3 rounded-lg border border-foreground/[0.1] px-3 py-2.5", styles.popIn)} style={{ "--pop-delay": "0.65s" }}>
        <Signature className="h-9 w-[110px] shrink-0" />
        <div className="min-w-0 flex-1 text-[12px]">
          <div className="text-foreground/90">Countersigned by Samuel Okoro</div>
          <div className="text-[11px] text-muted-foreground">27 Oct, 09:44</div>
        </div>
        <RequestStatus status="Approved" />
      </div>
    </div>
  );
}

const RULE_ACTIONS = [
  [Tag, "Set status", "Needs review"],
  [Tag, "Set priority", "High"],
  [Tag, "Add tag", "airside"],
  [UserPlus, "Assign to", "Samuel Okoro"],
  [Mail, "Send email to", "security@kestrelaero.com"],
  [Webhook, "Call webhook URL", "https://…/hooks/badges"],
];

// Cell: an automation that sorts every airside badge request the moment it arrives.
export function RequestRuleRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-2">
        <span className="font-medium">Airside badge requests</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
          <Dot tone="emerald" /> On
        </span>
      </div>
      <div className="mt-3.5 flex items-start gap-3">
        <span className="w-12 shrink-0 pt-1 text-muted-foreground">When</span>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <Chip>Access needed</Chip>
          <span className="text-[12px] text-muted-foreground">Equals</span>
          <Chip>Airside badge</Chip>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="w-12 shrink-0 pt-1.5 text-muted-foreground">Then</span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {RULE_ACTIONS.map(([Icon, action, value], index) => (
            <div key={action} className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-1.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
              <Icon className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="shrink-0 text-muted-foreground">{action}</span>
              <span className="ml-auto truncate text-foreground/90">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ACCESS_LOG = [
  { who: "Elena Rossi", action: "Revealed", what: "Passport number", time: "10:42" },
  { who: "Samuel Okoro", action: "Viewed", what: "Ravi Menon's response", time: "10:31" },
  { who: "Nathan Okafor", action: "Exported", what: "48 responses", time: "Yesterday" },
  { who: "Amara Okafor", action: "Printed", what: "Hana Ito's response", time: "Mon" },
];

// Cell: a sensitive answer masked in the inbox, and the access log that records who revealed it.
export function SealedFieldRender() {
  return (
    <div className={cn("mx-auto w-[440px] text-[13px]", CARD)}>
      <div className={cn("border-b px-4 py-3.5", LINE)}>
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-muted-foreground" />
          <span className="text-[12px] text-muted-foreground">Passport number</span>
          <Chip className="ml-auto h-5 px-2 font-mono text-[10.5px]">AES-256-GCM</Chip>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="font-mono text-[15px] tracking-[0.2em] text-foreground/80">••••••••</span>
          <span className="ml-auto flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2.5 text-[12px] text-foreground/90">Reveal</span>
        </div>
      </div>
      <div className="px-4 pt-3 pb-1.5">
        <MonoLabel>Access log</MonoLabel>
      </div>
      {ACCESS_LOG.map((entry, index) => (
        <div key={entry.who} className={cn("flex items-center gap-2.5 border-t px-4 py-2.5 text-[12px]", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <Avatar name={entry.who} size={18} />
          <span className="shrink-0 text-foreground/90">{entry.who}</span>
          <span
            className={cn(
              "shrink-0 rounded-full border px-1.5 text-[10.5px] leading-[18px]",
              entry.action === "Revealed" ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-foreground/[0.1] text-muted-foreground",
            )}
          >
            {entry.action}
          </span>
          <span className="min-w-0 flex-1 truncate text-muted-foreground">{entry.what}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">{entry.time}</span>
        </div>
      ))}
    </div>
  );
}


function NavItem({ icon: Icon, label, count, active = false, indent = false }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", indent && "pl-3", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
      {Icon ? <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} /> : null}
      <span className="truncate">{label}</span>
      {count ? <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{count}</span> : null}
    </div>
  );
}

function FlowSidebar() {
  return (
    <div className={cn("flex w-[190px] shrink-0 flex-col gap-0.5 border-r px-2.5 py-3 text-[12px]", LINE)}>
      <div className="mb-2 flex items-center gap-2 px-2">
        <AppMark id="flow" size={20} />
        <span className="font-medium">Kestrel Ops</span>
      </div>
      <div className="mb-2 flex items-center gap-2 rounded-md border border-foreground/[0.08] px-2 py-1.5 text-muted-foreground">
        <Search className="size-3.5" /> Search
        <span className="ml-auto">
          <Kbd>⌘K</Kbd>
        </span>
      </div>
      <NavItem icon={Inbox} label="Inbox" count="3" />
      <NavItem icon={ListTodo} label="My Issues" />
      <div className="mt-3 mb-1 px-2 text-[11px] text-muted-foreground">Facilities &amp; IT</div>
      <NavItem label="Issues" indent />
      <NavItem label="Triage" count="8" indent active />
      <div className="mt-3 mb-1 px-2 text-[11px] text-muted-foreground">Views</div>
      {[
        ["Active", "23"],
        ["Urgent & high", "6"],
        ["Unassigned", "3"],
        ["Overdue", "2"],
      ].map(([label, count]) => (
        <NavItem key={label} icon={SquareStack} label={label} count={count} />
      ))}
    </div>
  );
}

function PropertyRow({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-[72px] shrink-0 text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-foreground/90">{children}</span>
    </div>
  );
}

const MEMBERS = ["Samuel Okoro", "Elena Rossi", "Amara Okafor"];

function AcceptPanel({ className }) {
  return (
    <div className={className}>
      <Window className="w-[330px]">
        <div className={cn("border-b px-5 py-4", LINE)}>
          <div className="font-mono text-[11px] text-muted-foreground">OPS-231</div>
          <div className="mt-1 leading-5 font-medium">Hangar 7 door B badge reader rejects valid cards</div>
        </div>
        <div className="relative px-5 py-3 text-[12px]">
          <PropertyRow label="Status">
            <StatusIcon status="todo" /> Todo
          </PropertyRow>
          <PropertyRow label="Priority">
            <PriorityIcon level="urgent" /> Urgent
          </PropertyRow>
          <PropertyRow label="Assignee">
            <Avatar name="Samuel Okoro" size={16} /> Samuel Okoro <ChevronDown className="size-3 text-muted-foreground" />
          </PropertyRow>
          <PropertyRow label="Labels">
            <Chip dot="neutral" className="h-5 px-2 text-[11px]">
              facilities
            </Chip>
            <Chip dot="neutral" className="h-5 px-2 text-[11px]">
              hangar-7
            </Chip>
          </PropertyRow>
          <PropertyRow label="Due date">
            <CalendarClock className="size-3.5 text-muted-foreground" /> Fri 31 Oct
          </PropertyRow>
          <PropertyRow label="Team">
            <Users className="size-3.5 text-muted-foreground" /> Facilities &amp; IT
          </PropertyRow>
          <div className={cn("absolute top-[92px] left-[96px] z-[2] w-[190px] p-1", POPOVER)}>
            {MEMBERS.map((name, index) => (
              <div key={name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
                <Avatar name={name} size={16} />
                {name}
                {index === 0 ? <Check className="ml-auto size-3.5" /> : null}
              </div>
            ))}
          </div>
        </div>
        <div className={cn("flex items-center gap-2.5 border-t bg-foreground/[0.03] px-5 py-3 text-[12px]", LINE, styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          <Mail className="size-3.5 text-muted-foreground" />
          <span className="text-foreground/90">Samuel Okoro was emailed about OPS-231</span>
        </div>
      </Window>
    </div>
  );
}

// Section stage: Flow's triage queue for the facilities and IT team, with an issue being accepted and assigned.
export function OpsTriageStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[780px]">
        <div className="flex h-full w-full">
          <FlowSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
              <span className="font-medium">Triage</span>
              <span className="text-muted-foreground">8 to triage</span>
              <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> New issues land here first
              </span>
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
            {OPS_TRIAGE.map((issue, index) => (
              <TriageRow key={issue.id} issue={issue} selected={index === 0} />
            ))}
          </div>
        </div>
      </Window>
      <AcceptPanel className={cn("absolute top-[150px] left-[670px] z-[2]", styles.float)} />
    </div>
  );
}

const URGENT_VIEW = [
  { id: "OPS-231", title: "Hangar 7 door B badge reader rejects valid cards", status: "progress", priority: "urgent", owner: "Samuel Okoro", due: "Today" },
  { id: "OPS-205", title: "Renew the hangar fire panel service contract", status: "todo", priority: "urgent", owner: "Nathan Okafor", due: "24 Oct", late: true },
  { id: "OPS-230", title: "Rostering access for three new dispatchers", status: "todo", priority: "high", owner: "Elena Rossi", due: "Fri" },
  { id: "OPS-226", title: "Wi-Fi drops in the cargo office after 18:00", status: "review", priority: "high", owner: "Elena Rossi", due: "Thu" },
  { id: "OPS-219", title: "Replace the lights in crew room 2", status: "progress", priority: "high", owner: "Amara Okafor", due: "26 Oct", late: true },
];

const OPS_VIEWS = [
  { name: "Active", count: 23 },
  { name: "Urgent & high", count: 6, active: true },
  { name: "Unassigned", count: 3 },
  { name: "Overdue", count: 2 },
];

// Cell: the ready-made views, with Urgent & high open and two overdue jobs in red.
export function OpsViewsRender() {
  return (
    <div className="mx-auto flex w-[460px] gap-3">
      <div className="w-[150px] shrink-0 rounded-xl border border-foreground/[0.09] bg-surface-card p-1.5 text-[12px] dark:bg-surface-subtle">
        <div className="px-2 pt-1.5 pb-1 text-[11px] text-muted-foreground">Views</div>
        {OPS_VIEWS.map((view) => (
          <div key={view.name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", view.active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <SquareStack className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate">{view.name}</span>
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{view.count}</span>
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex h-9 items-center gap-1.5 border-b px-3 font-medium", LINE)}>
          Urgent &amp; high <span className="font-normal text-muted-foreground">· 6</span>
        </div>
        {URGENT_VIEW.map((issue, index) => (
          <div key={issue.id} className={cn("flex h-10 items-center gap-2 border-b px-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
            <PriorityIcon level={issue.priority} />
            <StatusIcon status={issue.status} />
            <span className="min-w-0 flex-1 truncate text-foreground/85">{issue.title}</span>
            <span className={cn("shrink-0 text-[11px] tabular-nums", issue.late ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{issue.due}</span>
            <Avatar name={issue.owner} size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

const STAGE_TONES = {
  "To Do": ["neutral", "text-muted-foreground"],
  "In Progress": ["amber", "text-amber-700 dark:text-amber-300"],
  Blocked: ["red", "text-red-600 dark:text-red-400"],
  Done: ["emerald", "text-emerald-700 dark:text-emerald-400"],
};

const QUEUE = [
  { title: "Fit badge readers on doors A to D", stage: "In Progress", owner: "Samuel Okoro", due: "Today" },
  { title: "Fire panel inspection sign-off", stage: "Blocked", owner: "Nathan Okafor", due: "Yesterday", late: true },
  { title: "Run power to the bay 2 cable trays", stage: "To Do", owner: "Amara Okafor", due: "Today" },
  { title: "Strip the old cable trays", stage: "Done", owner: "Amara Okafor", due: "Mon" },
];

// Cell: the Work Queue for the Hangar 7 refit, counted into queued, due today and overdue.
export function WorkQueueRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <ClipboardList className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Work Queue</span>
        <span className="text-muted-foreground">Hangar 7 refit</span>
      </div>
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          ["Queued", "14", ""],
          ["Due today", "3", ""],
          ["Overdue", "1", "text-red-600 dark:text-red-400"],
        ].map(([label, value, tone], index) => (
          <div key={label} className={cn("px-4 py-2.5", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className={cn("mt-0.5 text-[18px] font-medium tracking-[-0.02em] tabular-nums", tone)}>{value}</div>
          </div>
        ))}
      </div>
      {QUEUE.map((task) => {
        const [tone, text] = STAGE_TONES[task.stage];
        return (
          <div key={task.title} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
            <span className={cn("min-w-0 flex-1 truncate", task.stage === "Done" ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90")}>{task.title}</span>
            <span className={cn("inline-flex w-[84px] shrink-0 items-center gap-1.5 text-[11px]", text)}>
              <Dot tone={tone} /> {task.stage}
            </span>
            <span className={cn("w-[58px] shrink-0 text-right text-[11px]", task.late ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{task.due}</span>
            <Avatar name={task.owner} size={16} />
          </div>
        );
      })}
    </div>
  );
}

const RESOURCE_REQUESTS = [
  { request: "Two electricians for the Hangar 7 refit", requester: "Nathan Okafor", target: "Hangar 7 refit · 3 weeks", status: "Pending" },
  { request: "Night-shift IT cover, 4 to 8 Nov", requester: "Samuel Okoro", target: "Service desk", status: "Approved" },
  { request: "Extra facilities desk staff for the audit", requester: "Amara Okafor", target: "Facilities desk", status: "Denied" },
];

const REQUEST_STATE = {
  Pending: ["amber", "text-amber-700 dark:text-amber-300"],
  Approved: ["emerald", "text-emerald-700 dark:text-emerald-400"],
  Denied: ["red", "text-red-600 dark:text-red-400"],
};

// Cell: resource requests waiting on a manager, with Approve and Deny on the pending one.
export function ResourceRequestsRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-1 border-b px-3 py-2.5", LINE)}>
        <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground">
          <Users className="size-3.5" /> Allocations
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-foreground/[0.07] px-2 py-1 text-foreground">
          <ClipboardList className="size-3.5" /> Requests
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">1 pending request</span>
      </div>
      {RESOURCE_REQUESTS.map((item, index) => {
        const [tone, text] = REQUEST_STATE[item.status];
        return (
          <div key={item.request} className={cn("border-b px-4 py-3 last:border-b-0", LINE, index === 0 && "bg-foreground/[0.03]")}>
            <div className="flex items-center gap-2.5">
              <Avatar name={item.requester} size={20} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] text-foreground/90">{item.request}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {item.requester} · {item.target}
                </div>
              </div>
              <span className={cn("inline-flex shrink-0 items-center gap-1.5 text-[11px]", text)}>
                <Dot tone={tone} /> {item.status}
              </span>
            </div>
            {index === 0 ? (
              <div className={cn("mt-2.5 flex gap-2 pl-[30px]", styles.popIn)} style={{ "--pop-delay": "0.45s" }}>
                <span className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">
                  <Check className="size-3.5" /> Approve
                </span>
                <span className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/10 px-3 text-[12px] text-muted-foreground">
                  <X className="size-3.5" /> Deny
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const BUDGET_LINES = [
  { name: "Electrical contractor", amount: 14200 },
  { name: "Badge readers × 12", amount: 9600 },
  { name: "Fire panel service", amount: 4900 },
  { name: "Cable trays and fixings", amount: 3480 },
  { name: "Bay marking paint", amount: 1900 },
];

const money = (value) => `$${value.toLocaleString("en-US")}`;

// Cell: the refit's budget, committed spend against forecast, with the vendor lines behind it.
export function BudgetRender() {
  const max = BUDGET_LINES[0].amount;
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <Banknote className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Budget</span>
        <span className="text-muted-foreground">Hangar 7 refit · October</span>
      </div>
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          { label: "Budget used", value: "71%", detail: "$34,080 of $48,000", icon: Banknote },
          { label: "Forecast", value: "$45.2k", detail: "94% of monthly budget", icon: TrendingUp },
          { label: "Variance", value: "−$2.8k", detail: "Under current plan", icon: TriangleAlert, good: true },
        ].map(({ label, value, detail, icon: Icon, good }, index) => (
          <div key={label} className={cn("px-4 py-2.5", index > 0 && "border-l", LINE)}>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Icon className="size-3" /> {label}
            </div>
            <div className={cn("mt-0.5 text-[18px] font-medium tracking-[-0.02em] tabular-nums", good && "text-emerald-700 dark:text-emerald-400")}>{value}</div>
            <div className="truncate text-[10.5px] text-muted-foreground">{detail}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        {BUDGET_LINES.map((line, index) => (
          <div key={line.name} className="flex items-center gap-3">
            <span className="w-[140px] shrink-0 truncate text-foreground/85">{line.name}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
              <span
                className={cn("block h-full origin-left rounded-full bg-foreground/45", styles.fill)}
                style={{ width: `${(line.amount / max) * 100}%`, "--fill-delay": `${0.3 + index * 0.12}s` }}
              />
            </span>
            <span className="w-[56px] shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">{money(line.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


const KIND_ICONS = { PDF: FileText, DOCX: FileText, XLSX: FileSpreadsheet, Slides: Presentation, Video: FileVideo, "Web page": Globe };

const FRESHNESS = {
  Verified: ["emerald", "text-emerald-700 dark:text-emerald-400"],
  "Review due": ["amber", "text-amber-700 dark:text-amber-300"],
  Stale: ["red", "text-red-600 dark:text-red-400"],
};

const HANDBOOK = [
  { name: "Hangar access procedure.pdf", kind: "PDF", chunks: 64, freshness: "Verified" },
  { name: "Fleet maintenance schedule.xlsx", kind: "XLSX", chunks: 27, freshness: "Review due" },
  { name: "Leave policy 2024.pdf", kind: "PDF", chunks: 52, freshness: "Stale" },
  { name: "Travel and expenses policy 2026.pdf", kind: "PDF", chunks: 112, freshness: "Verified" },
  { name: "IT onboarding checklist.docx", kind: "DOCX", chunks: 38, freshness: "Verified" },
  { name: "New starter induction.pptx", kind: "Slides", chunks: 45, freshness: "Verified" },
  { name: "Fire safety briefing.mp4", kind: "Video", chunks: 88, freshness: "Verified" },
  { name: "Facilities intranet page", kind: "Web page", chunks: 19, freshness: "Verified" },
];

function Cite({ n, active = false }) {
  return (
    <span
      className={cn(
        "mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-[4px] px-1 align-middle font-mono text-[10px] leading-none",
        active ? "bg-foreground text-background" : "bg-foreground/[0.09] text-foreground/80",
      )}
    >
      {n}
    </span>
  );
}

function HandbookWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <AppMark id="grey" size={22} />
        <span className="font-medium">Kestrel Ops Handbook</span>
        <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Upload className="size-3.5" /> Add sources
        </span>
      </div>
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          ["Sources", "186"],
          ["Chunks", "7,412"],
          ["Review due", "9"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-5 py-3", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[18px] font-medium tracking-tight tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1fr_96px_64px] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Source</span>
        <span>Freshness</span>
        <span>Chunks</span>
      </div>
      {HANDBOOK.map((source) => {
        const Icon = KIND_ICONS[source.kind];
        const [tone, text] = FRESHNESS[source.freshness];
        return (
          <div key={source.name} className={cn("grid grid-cols-[1fr_96px_64px] items-center gap-3 border-b px-5 py-2.5", LINE)}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03]">
                <Icon className="size-3.5 text-muted-foreground" />
              </span>
              <span className="truncate text-foreground/90">{source.name}</span>
            </span>
            <span className={cn("flex items-center gap-1.5 text-[12px]", text)}>
              <Dot tone={tone} /> {source.freshness}
            </span>
            <span className="font-mono text-[12px] text-muted-foreground">{source.chunks}</span>
          </div>
        );
      })}
    </Window>
  );
}

const ANSWER_SOURCES = [
  { n: 1, name: "Hangar access procedure.pdf", where: "p. 4", kind: "PDF" },
  { n: 2, name: "Facilities intranet page", where: "Web page", kind: "Web page" },
  { n: 3, name: "Fire safety briefing.mp4", where: "06:40", kind: "Video" },
];

// Section stage: the handbook knowledge base behind, a cited answer in the playground, and the passage citation 1 points at.
export function HandbookStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <div className="absolute top-[60px] left-0 opacity-90">
        <HandbookWindow className="w-[560px]" />
      </div>
      <Window className="absolute top-0 left-[452px] z-[2] w-[548px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <span className="font-medium">Playground Chat</span>
          <span className="text-muted-foreground">Ops answers</span>
        </div>
        <div className="flex flex-col gap-5 px-5 py-5">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-foreground/[0.07] px-3.5 py-2.5 leading-5 text-foreground/90">Can a contractor get an airside badge for a weekend shift?</div>
          </div>
          <div className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/[0.1] bg-foreground/[0.04]">
              <Sparkles className="size-3.5 text-foreground/80" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 text-[11px] text-muted-foreground">Retrieved 6 chunks · 1.2s</div>
              <p className="leading-6 text-foreground/90">
                Yes, if a Kestrel employee sponsors the request and IT security approves it by Thursday
                <Cite n={1} active />. Weekend badges expire at 23:59 on the Sunday
                <Cite n={1} />, and contractors in Hangar 7 need an escort while the refit is under way
                <Cite n={2} />.
              </p>
            </div>
          </div>
          <div className="ml-10 flex flex-col gap-1.5">
            {ANSWER_SOURCES.map((source) => {
              const Icon = KIND_ICONS[source.kind];
              return (
                <div key={source.n} className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2", source.n === 1 ? "border-foreground/20 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
                  <Cite n={source.n} active={source.n === 1} />
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-foreground/90">{source.name}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{source.where}</span>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-foreground/[0.1] bg-background/40 px-3.5 pt-3 pb-2.5 dark:bg-foreground/[0.02]">
            <div className="min-h-6 leading-6">
              <Typed text="Who signs off a weekend badge?" delay={1.4} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px]">
                <Database className="size-3" /> Kestrel Ops Handbook
              </span>
              <span className="ml-auto flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowUp className="size-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[350px] left-[50px] z-[3] w-[350px] p-4 text-[12px]", POPOVER, styles.float)}>
        <div className="flex items-center gap-2">
          <Cite n={1} active />
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="font-medium text-foreground">Hangar access procedure.pdf</span>
          <span className="ml-auto text-muted-foreground">Page 4</span>
        </div>
        <p className="mt-3 leading-5 text-muted-foreground">
          2.3 Contractors.{" "}
          <mark className="rounded-[3px] bg-foreground/[0.12] px-0.5 text-foreground">A sponsored contractor may hold a weekend airside badge once IT security has approved the request.</mark> Requests received after
          Thursday are handled the following week…
        </p>
      </div>
    </div>
  );
}

const INGEST = [
  { name: "Hangar access procedure.pdf", kind: "PDF", note: "Text layer", status: "Ready" },
  { name: "IT onboarding checklist.docx", kind: "DOCX", note: "Word", status: "Ready" },
  { name: "Fleet maintenance schedule.xlsx", kind: "XLSX", note: "Spreadsheet", status: "Ready" },
  { name: "New starter induction.pptx", kind: "Slides", note: "Slides", status: "Ready" },
  { name: "staff.kestrelaero.com/facilities", kind: "Web page", note: "Web page", status: "Ready" },
  { name: "Fire safety briefing.mp4", kind: "Video", note: "Transcribed", status: "Processing" },
];

// Cell: policies, manuals, schedules, slides, a web page and a briefing video going into the knowledge base.
export function HandbookSourcesRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <Upload className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Add sources</span>
        <span className="text-muted-foreground">Kestrel Ops Handbook</span>
      </div>
      {INGEST.map((source, index) => {
        const Icon = KIND_ICONS[source.kind];
        const ready = source.status === "Ready";
        return (
          <div key={source.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03]">
              <Icon className="size-3.5 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-foreground/90">{source.name}</div>
              {ready ? null : (
                <span className="mt-1 block h-1 w-[160px] overflow-hidden rounded-full bg-foreground/[0.07]">
                  <span className={cn("block h-full w-[64%] origin-left rounded-full bg-amber-500", styles.fill)} style={{ "--fill-duration": "3s" }} />
                </span>
              )}
            </div>
            <span className="w-[74px] shrink-0 text-[11px] text-muted-foreground">{source.note}</span>
            <span className={cn("inline-flex w-[78px] shrink-0 items-center gap-1.5 text-[11px]", ready ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-300")}>
              <Dot tone={ready ? "emerald" : "amber"} /> {source.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Cell: the staff intranet with Grey's chat widget streaming a cited answer.
export function IntranetWidgetRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[470px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 text-[12px]", LINE)}>
        <span className="font-medium text-foreground/90">Kestrel Staff Hub</span>
        <span className="ml-3 flex gap-3 text-muted-foreground">
          <span>Rosters</span>
          <span>Policies</span>
          <span>Facilities</span>
        </span>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <Bar className="h-3 w-40 bg-foreground/[0.12]" />
        <Bar className="w-64" />
        <Bar className="w-56" />
        <div className="mt-3 grid w-[180px] grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((tile) => (
            <span key={tile} className="h-12 rounded-lg border border-foreground/[0.06] bg-foreground/[0.03]" />
          ))}
        </div>
      </div>
      <div className={cn("absolute right-4 bottom-4 w-[256px] rounded-2xl text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <Sparkles className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Ask Ops</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Answering
          </span>
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-foreground/[0.07] px-2.5 py-1.5">Can I claim a hotel after a diversion?</span>
          <span className="leading-[1.5] text-foreground/90">
            Yes. Book the nearest partner hotel and claim the night within 30 days
            <Cite n={1} />. Keep the receipt
            <TypingDots className="ml-1.5 text-muted-foreground" />
          </span>
        </div>
      </div>
    </div>
  );
}


const VAULT_TYPE_ICONS = { Password: Key, "API Key": Key, Database, "SSH Key": Terminal, SMTP: Mail, Certificate: Server, OAuth: Link2, Other: Box };
const UNLOCK_ICONS = { PIN: LockKeyhole, Password: Key, Passkey: Fingerprint };

const VAULT_ITEMS = [
  { name: "Hangar 7 door controller", type: "Password", access: "Managers only", unlock: "PIN" },
  { name: "Rostering system API", type: "API Key", access: "Specific people", unlock: "Passkey" },
  { name: "Maintenance log database", type: "Database", access: "Managers only", unlock: "Password" },
  { name: "Ground power unit", type: "SSH Key", access: "Everyone", unlock: "PIN" },
  { name: "Facilities mailbox", type: "SMTP", access: "Everyone", unlock: "Password" },
  { name: "Staff Wi-Fi certificate", type: "Certificate", access: "Managers only", unlock: "Passkey" },
  { name: "Payroll provider", type: "OAuth", access: "Specific people", unlock: "Passkey" },
  { name: "Fuel supplier portal", type: "Other", access: "Everyone", unlock: "PIN" },
];

// Showcase: the team's vault, with the hangar door controller asking for its PIN.
export function VaultRender() {
  return (
    <div className="relative h-[440px] w-[680px]">
      <Window className="absolute top-0 left-0 w-[600px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <AppMark id="flow" size={22} />
          <span className="font-medium">Vault</span>
          <span className="text-muted-foreground">Kestrel Ops</span>
          <span className="ml-auto flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
            <Plus className="size-3.5" /> Add secret
          </span>
        </div>
        <div className={cn("grid grid-cols-[1fr_96px_112px_80px] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Secret</span>
          <span>Type</span>
          <span>Who can open</span>
          <span>Unlock</span>
        </div>
        {VAULT_ITEMS.map((item, index) => {
          const TypeIcon = VAULT_TYPE_ICONS[item.type];
          const UnlockIcon = UNLOCK_ICONS[item.unlock];
          return (
            <div key={item.name} className={cn("grid grid-cols-[1fr_96px_112px_80px] items-center gap-3 border-b px-5 py-2.5 last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03]">
                  <TypeIcon className="size-3.5 text-muted-foreground" />
                </span>
                <span className="truncate text-foreground/90">{item.name}</span>
              </span>
              <span className="truncate text-[12px] text-muted-foreground">{item.type}</span>
              <span className="truncate text-[12px] text-foreground/80">{item.access}</span>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <UnlockIcon className="size-3.5" /> {item.unlock}
              </span>
            </div>
          );
        })}
      </Window>
      <div className={cn("absolute top-[200px] left-[370px] z-[2] w-[300px] p-4 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
            <LockKeyhole className="size-3.5 text-foreground/80" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">Hangar 7 door controller</div>
            <div className="text-[11px] text-muted-foreground">Enter the PIN to open it</div>
          </div>
        </div>
        <div className="mt-3.5 flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((slot) => (
            <span
              key={slot}
              className={cn("flex h-9 flex-1 items-center justify-center rounded-md border text-[16px]", slot === 4 ? "border-foreground/50" : "border-foreground/[0.12]")}
            >
              {slot < 4 ? "•" : slot === 4 ? <span className={cn("h-4 w-px bg-foreground", styles.caret)} /> : null}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
          <TriangleAlert className="size-3" /> 4 tries left, then it locks for 15 minutes
        </div>
        <div className="mt-3.5 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-foreground/10 text-muted-foreground">Cancel</span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-md bg-foreground font-medium text-background">Open</span>
        </div>
      </div>
    </div>
  );
}

const ACCESS_MODES = [
  { icon: Users, label: "Everyone in the project", body: "Anyone in the project who passes the secret's check" },
  { icon: ShieldCheck, label: "Managers only", body: "Whoever added it, the project's creator and organisation owners", active: true },
  { icon: UserCheck, label: "Specific people", body: "Managers, plus the people you list by email" },
];

// Cell: who may open a secret, and how they prove it's them.
export function VaultAccessRender() {
  return (
    <div className="mx-auto w-[440px] text-[12px]">
      <div className="flex flex-col gap-2">
        {ACCESS_MODES.map(({ icon: Icon, label, body, active }) => (
          <div
            key={label}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-3.5 py-3",
              active ? "border-foreground/30 bg-foreground/[0.05] shadow-lg shadow-black/10" : "border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle",
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-foreground">{label}</div>
              <div className="mt-0.5 text-muted-foreground">{body}</div>
            </div>
            <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border", active ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
              {active ? <Check className="size-2.5" strokeWidth={3} /> : null}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-3">
        <span className="text-muted-foreground">Unlock with</span>
        <span className="ml-auto grid grid-cols-3 gap-1 rounded-lg bg-foreground/[0.05] p-1">
          {Object.entries(UNLOCK_ICONS).map(([label, Icon]) => (
            <span key={label} className={cn("flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1", label === "Passkey" ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
              <Icon className="size-3.5" /> {label}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

const VAULT_HISTORY = [
  { who: "Samuel Okoro", outcome: "Opened", tone: "emerald", time: "09:02" },
  { who: "Amara Okafor", outcome: "Failed attempt", tone: "amber", time: "08:47" },
  { who: "Ravi Menon", outcome: "Locked for 15 minutes after 5 failed attempts", tone: "red", time: "Yesterday" },
  { who: "Nathan Okafor", outcome: "Opened", tone: "emerald", time: "Yesterday" },
  { who: "Elena Rossi", outcome: "Opened", tone: "emerald", time: "Mon" },
];

// Cell: the ground power unit's access history, every open, failed try and lockout on the record.
export function VaultHistoryRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <Terminal className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Ground power unit</span>
        <span className="text-muted-foreground">Access history</span>
      </div>
      {VAULT_HISTORY.map((entry, index) => (
        <div key={`${entry.who}-${index}`} className={cn("flex items-center gap-2.5 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <Avatar name={entry.who} size={18} />
          <span className="shrink-0 text-foreground/90">{entry.who}</span>
          <span
            className={cn(
              "inline-flex min-w-0 items-center gap-1.5 truncate",
              entry.tone === "red" ? "text-red-600 dark:text-red-400" : entry.tone === "amber" ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground",
            )}
          >
            <Dot tone={entry.tone} />
            <span className="truncate">{entry.outcome}</span>
          </span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{entry.time}</span>
        </div>
      ))}
    </div>
  );
}
