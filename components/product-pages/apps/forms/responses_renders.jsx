import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookmarkPlus,
  BookTemplate,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  ClipboardCheck,
  CreditCard,
  Download,
  FileJson,
  FileText,
  FlaskConical,
  Gauge,
  Inbox,
  Kanban,
  LayoutDashboard,
  MoreHorizontal,
  PlugZap,
  Plus,
  Printer,
  Route,
  Search,
  SendHorizontal,
  ShieldCheck,
  SquarePen,
  Table2,
  Tag as TagIcon,
  Timer,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { APPLICATIONS, BrightloopMark, CARD, Input, POPOVER, ScoreBadge, Segmented, Select, StatusDot, Tag, Toggle } from "@/components/product-pages/apps/forms/forms_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Forms response renders: Brightloop's Spring Grants applications in the inbox, through approvals and automations, and in analytics.

const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: SquarePen, label: "Form Builder" },
  {
    icon: Inbox,
    label: "Responses",
    open: true,
    children: ["Response Inbox", "Data Tables & Views", "Bulk Actions", "Partial / Abandoned", "Export & Sync", "Retention & GDPR"],
  },
  { icon: BarChart3, label: "Analytics" },
  { icon: PlugZap, label: "Integrations" },
  { icon: Users, label: "Collaboration" },
  { icon: ShieldCheck, label: "Security & Compliance" },
  { icon: BookTemplate, label: "Templates & Admin" },
];

function WorkspaceNav({ className }) {
  return (
    <div className={cn("flex flex-col gap-0.5 px-3 py-3 text-[12px]", className)}>
      <div className="mb-2 flex items-center gap-2 px-2 py-1">
        <BrightloopMark size={22} />
        <span className="text-[13px] font-semibold">Brightloop</span>
        <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
      </div>
      {NAV.map(({ icon: Icon, label, open, children }) => (
        <div key={label}>
          <div className="flex h-8 items-center gap-2.5 rounded-md px-2 text-foreground/80">
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
            {label}
            {children ? <ChevronDown className="ml-auto size-3.5 text-muted-foreground" /> : null}
          </div>
          {open
            ? children.map((child, index) => (
                <div key={child} className={cn("ml-[17px] flex h-7 items-center border-l pl-4", LINE, index === 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                  <span className={cn("-ml-2 rounded-md px-2 py-1", index === 0 && "bg-foreground/[0.07]")}>{child}</span>
                </div>
              ))
            : null}
        </div>
      ))}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, hint }) {
  return (
    <div className={cn("p-3", CARD)}>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        {label}
        <Icon className="size-3.5" strokeWidth={1.75} />
      </div>
      <div className="mt-1.5 text-[20px] font-medium tracking-[-0.01em] tabular-nums">{value}</div>
      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Checkbox({ checked = false }) {
  return (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", checked ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

function ToolButton({ icon: Icon, children, active = false, className }) {
  return (
    <span className={cn("flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2 text-[12px] whitespace-nowrap", active ? "border-foreground/30 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground", className)}>
      {Icon ? <Icon className="size-3.5" strokeWidth={1.75} /> : null}
      {children}
    </span>
  );
}

const INBOX_ROWS = [
  ...APPLICATIONS.slice(0, 4).map((row) => ({ ...row, form: "Spring Grants 2026" })),
  { name: "Grace Donnelly", email: "grace@donnelly.ie", form: "Studio membership", status: "Awaiting payment", priority: "Low", score: null, tags: ["yearly"], assignee: "", time: "6h" },
  ...APPLICATIONS.slice(4, 7).map((row) => ({ ...row, form: "Spring Grants 2026" })),
];

const INBOX_COLUMNS = "grid-cols-[22px_1.7fr_1fr_0.9fr_1fr_1fr_0.5fr]";

// The hero's tilted plane: the response inbox across Brightloop's forms, with a new saved view being named.
export function InboxWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <WorkspaceNav className={cn("w-[220px] shrink-0 border-r", LINE)} />
        <div className="relative min-w-0 flex-1 px-6 pt-5">
          <div className="text-[18px] font-semibold tracking-[-0.01em]">Responses</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">Triage incoming submissions across every form — review, assign, approve and export.</div>
          <div className="mt-4 grid grid-cols-5 gap-2.5">
            <StatTile icon={Inbox} label="Total" value="312" hint="All live submissions" />
            <StatTile icon={Timer} label="Needs review" value="18" hint="6% of inbox" />
            <StatTile icon={ShieldCheck} label="Pending approval" value="9" hint="In an approval chain" />
            <StatTile icon={CreditCard} label="Awaiting payment" value="4" hint="Checkout not completed" />
            <StatTile icon={Gauge} label="Avg score" value="31.4" hint="268 scored responses" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <ToolButton>
              All responses <ChevronDown className="size-3" />
            </ToolButton>
            <ToolButton>
              All forms <ChevronDown className="size-3" />
            </ToolButton>
            <ToolButton>
              All statuses <ChevronDown className="size-3" />
            </ToolButton>
            <ToolButton>
              Priority: High <ChevronDown className="size-3" />
            </ToolButton>
            <span className="ml-auto flex h-7 w-[170px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
              <Search className="size-3.5" /> Search responses…
            </span>
            <ToolButton icon={BookmarkPlus} active />
            <Segmented options={["Table", "Kanban"]} />
          </div>
          <div className={cn("mt-3 overflow-hidden", CARD)}>
            <div className={cn("grid items-center gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", INBOX_COLUMNS, LINE)}>
              <Checkbox />
              <span>Respondent</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Tags</span>
              <span>Assignee</span>
              <span className="text-right">Submitted</span>
            </div>
            {INBOX_ROWS.map((row, index) => (
              <div
                key={row.name}
                className={cn("grid items-center gap-3 border-b px-4 py-2.5 last:border-b-0", INBOX_COLUMNS, LINE, index === 0 && cn("bg-foreground/[0.03]", styles.popIn))}
                style={index === 0 ? { "--pop-delay": "1s" } : undefined}
              >
                <Checkbox />
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={row.name} size={24} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{row.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">{row.form}</span>
                  </span>
                </span>
                <StatusDot status={row.status} />
                <span className="flex items-center gap-1.5">
                  <StatusDot status={row.priority} />
                  {row.score != null ? <ScoreBadge score={row.score} /> : null}
                </span>
                <span className="flex min-w-0 gap-1 overflow-hidden">
                  {row.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </span>
                <span className="flex min-w-0 items-center gap-1.5 text-[12px] text-foreground/80">
                  {row.assignee ? (
                    <>
                      <Avatar name={row.assignee} size={18} />
                      <span className="truncate">{row.assignee}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </span>
                <span className="text-right text-[11px] text-muted-foreground">{index === 0 ? "now" : row.time}</span>
              </div>
            ))}
          </div>
          <div className={cn("absolute top-[226px] right-[186px] z-[2] w-[288px] p-4", POPOVER)}>
            <div className="font-medium">Save filters &amp; layout</div>
            <div className="mt-1 text-[11px] leading-4 text-muted-foreground">Keeps the current filters, sort and table layout as a saved view.</div>
            <Input className="mt-3 border-foreground/25">
              <Typed text="High priority, panel shortlist" delay={1.4} />
            </Input>
            <span className="mt-3 flex h-8 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">Save</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

const FORM_ROWS = APPLICATIONS.slice(0, 7).map((row, index) => ({ ...row, amount: ["$8,500", "$4,200", "$6,750", "$3,900", "$5,600", "$2,800", "$4,950"][index] }));

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-[5px] text-[12px]">
      <span className="w-[110px] shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-foreground/90">{children}</span>
    </div>
  );
}

function DrawerHeader({ row }) {
  return (
    <div className={cn("flex items-start gap-3 border-b px-5 py-4", LINE)}>
      <Avatar name={row.name} size={36} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold tracking-[-0.01em]">{row.name}</div>
        <div className="truncate text-[12px] text-muted-foreground">{row.email}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Spring Grants 2026 · {row.time} · #8f2c1a90</div>
      </div>
      <X className="size-4 text-muted-foreground" />
    </div>
  );
}

function DrawerTabs({ active }) {
  return (
    <div className={cn("flex gap-4 border-b px-5 text-[12px]", LINE)}>
      {["Answers", "Activity", "Approvals", "Payment", "Details", "Access"].map((tab) => (
        <span key={tab} className={cn("flex items-center gap-1.5 border-b-2 py-2.5", tab === active ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground")}>
          {tab}
          {tab === "Approvals" ? <Dot tone="amber" /> : null}
        </span>
      ))}
    </div>
  );
}

// Section stage: one form's responses with their answers as columns, and Kofi's response open in the drawer.
export function InboxStage() {
  const kofi = APPLICATIONS[1];
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Spring Grants 2026 — Application" icon={Inbox} meta="268 responses" className="absolute top-0 left-0 h-[640px] w-[640px]">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <ToolButton>
            Panel shortlist <ChevronDown className="size-3" />
          </ToolButton>
          <ToolButton>
            All statuses <ChevronDown className="size-3" />
          </ToolButton>
          <span className="ml-auto flex items-center rounded-md border border-foreground/10 p-0.5 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
              <Table2 className="size-3.5" /> Table
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5">
              <Kanban className="size-3.5" /> Kanban
            </span>
          </span>
        </div>
        <div className={cn("grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Respondent</span>
          <span>Project title</span>
          <span>Amount requested</span>
          <span>Status</span>
        </div>
        {FORM_ROWS.map((row) => (
          <div key={row.name} className={cn("grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr] items-center gap-3 border-b px-4 py-2.5", LINE, row.name === kofi.name && "bg-foreground/[0.05]")}>
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name={row.name} size={22} />
              <span className="truncate font-medium">{row.name}</span>
            </span>
            <span className="truncate text-[12px] text-muted-foreground">{row.project}</span>
            <span className="text-[12px] text-foreground/85 tabular-nums">{row.amount}</span>
            <StatusDot status={row.status} className="text-[12px]" />
          </div>
        ))}
      </Window>
      <div className={cn("absolute top-[24px] left-[560px] z-[2] w-[440px] overflow-hidden text-[13px]", POPOVER, styles.float)}>
        <DrawerHeader row={kofi} />
        <div className={cn("flex flex-col border-b px-5 py-2.5 text-[12px]", LINE)}>
          <DetailRow label="Status">
            <StatusDot status="Pending" />
          </DetailRow>
          <DetailRow label="Priority">
            <span className="flex items-center gap-2">
              <StatusDot status="High" />
              <span className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[11px] tabular-nums">Score 41</span>
            </span>
          </DetailRow>
          <DetailRow label="Assignee">
            <span className="flex items-center gap-1.5">
              <Avatar name="Ravi Menon" size={16} /> Ravi Menon
            </span>
          </DetailRow>
        </div>
        <div className={cn("flex items-center gap-2 border-b px-5 py-2.5", LINE)}>
          <ToolButton icon={Printer}>Print / PDF</ToolButton>
          <MoreHorizontal className="ml-auto size-4 text-muted-foreground" />
        </div>
        <DrawerTabs active="Details" />
        <div className="px-5 py-3">
          <MonoLabel>Submission</MonoLabel>
          <div className="mt-1">
            <DetailRow label="Submitted">27 Oct 2026, 09:14</DetailRow>
            <DetailRow label="Completion time">11m 32s</DetailRow>
            <DetailRow label="Score">41</DetailRow>
            <DetailRow label="A/B variant">Variant B</DetailRow>
          </div>
          <MonoLabel className="mt-3 block">Source</MonoLabel>
          <div className="mt-1">
            <DetailRow label="Device">Mobile</DetailRow>
            <DetailRow label="UTM source">newsletter</DetailRow>
            <DetailRow label="UTM medium">email</DetailRow>
            <DetailRow label="UTM campaign">spring-grants-2026</DetailRow>
          </div>
        </div>
      </div>
    </div>
  );
}

const BOARD = [
  { status: "Needs review", rows: [APPLICATIONS[0], APPLICATIONS[7]] },
  { status: "Pending", rows: [APPLICATIONS[1], APPLICATIONS[2]] },
  { status: "Approved", rows: [APPLICATIONS[3], APPLICATIONS[6]] },
];

// Cell: the same responses as a Kanban board, one column per status.
export function KanbanRender() {
  return (
    <div className={cn("mx-auto grid h-[300px] w-[460px] grid-cols-3 gap-2.5 text-[12px]", styles.fadeBottom)}>
      {BOARD.map((column, columnIndex) => (
        <div key={column.status} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2">
          <div className="flex items-center gap-1.5 px-1 pt-0.5">
            <StatusDot status={column.status} className="font-medium text-foreground" />
            <span className="text-muted-foreground">{column.rows.length + [16, 7, 21][columnIndex]}</span>
          </div>
          {column.rows.map((row, index) => (
            <div key={row.name} className={cn("rounded-lg border border-foreground/[0.09] bg-surface-card p-2.5 shadow-sm shadow-black/5 dark:bg-foreground/[0.03]", styles.popIn)} style={{ "--pop-delay": `${0.15 + (columnIndex * 2 + index) * 0.08}s` }}>
              <div className="flex items-center gap-1.5">
                <span className="truncate font-medium">{row.name}</span>
                <span className="ml-auto">{row.assignee ? <Avatar name={row.assignee} size={16} /> : null}</span>
              </div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-[1.35] text-muted-foreground">{row.project}</div>
              <div className="mt-2 flex items-center gap-1.5">
                <StatusDot status={row.priority} className="text-[11px]" />
                <ScoreBadge score={row.score} className="ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const STATUSES = ["Complete", "Needs review", "Pending", "In progress", "Approved", "Rejected", "Awaiting payment", "Spam"];

const BULK_BUTTON = "gap-1 px-1.5 text-[11px]";

// Cell: three responses selected, with the bulk bar's status menu open.
export function BulkRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[480px] text-[13px]">
      <div className={cn("flex items-center gap-1.5 px-2.5 py-2", CARD, "border-foreground/20")}>
        <span className="px-1 text-[12px] font-medium whitespace-nowrap">3 selected</span>
        <span className="h-4 w-px shrink-0 bg-foreground/10" />
        <ToolButton icon={CircleDot} active className={BULK_BUTTON}>
          Status
        </ToolButton>
        <ToolButton icon={Zap} className={BULK_BUTTON}>
          Priority
        </ToolButton>
        <ToolButton icon={TagIcon} className={BULK_BUTTON}>
          Tags
        </ToolButton>
        <ToolButton icon={UserPlus} className={BULK_BUTTON}>
          Assign
        </ToolButton>
        <ToolButton icon={Download} className={BULK_BUTTON}>
          Export
        </ToolButton>
        <X className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </div>
      <div className={cn("mt-2 overflow-hidden", CARD)}>
        {APPLICATIONS.slice(0, 5).map((row, index) => (
          <div key={row.name} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE, index < 3 && "bg-foreground/[0.04]")}>
            <Checkbox checked={index < 3} />
            <Avatar name={row.name} size={20} />
            <span className="w-[110px] truncate font-medium">{row.name}</span>
            <StatusDot status={row.status} className="ml-auto text-[12px]" />
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[44px] left-[66px] z-[2] w-[176px] p-1 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        {STATUSES.map((status) => (
          <div key={status} className={cn("flex items-center rounded-md px-2.5 py-[5px]", status === "Approved" && "bg-foreground/[0.07]")}>
            <StatusDot status={status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Cell: the team's comments on a response, with a teammate being @mentioned.
export function CommentsRender() {
  return (
    <div className={cn("relative mx-auto h-[300px] w-[460px] overflow-hidden text-[13px]", CARD)}>
      <DrawerTabs active="Activity" />
      <div className="flex flex-col gap-3.5 px-4 pt-4">
        <div className="flex gap-2.5">
          <Avatar name="Mia Johansson" size={24} />
          <div className="min-w-0">
            <div className="text-[12px]">
              <span className="font-medium">Mia Johansson</span> <span className="text-muted-foreground">2h</span>
            </div>
            <p className="mt-0.5 leading-5 text-foreground/85">
              The venue quote is attached and the budget adds up. <span className="font-medium text-foreground">@Ravi Menon</span> ready for the panel?
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Avatar name="Ravi Menon" size={24} />
          <div className="min-w-0">
            <div className="text-[12px]">
              <span className="font-medium">Ravi Menon</span> <span className="text-muted-foreground">1h</span>
            </div>
            <p className="mt-0.5 leading-5 text-foreground/85">Agreed. Approving the programme review now.</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex gap-2">
        <Input className="h-9 flex-1 text-[13px]">
          <Typed text="Can you check the quotes, @Noah" delay={1.3} />
        </Input>
        <span className="flex h-9 w-10 items-center justify-center rounded-md bg-foreground text-background">
          <SendHorizontal className="size-3.5" />
        </span>
      </div>
      <div className={cn("absolute bottom-[58px] left-[190px] z-[2] w-[170px] p-1 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "2.8s" }}>
        <div className="flex items-center gap-2 rounded-md bg-foreground/[0.07] px-2 py-1.5">
          <Avatar name="Noah Fischer" size={18} /> Noah Fischer
        </div>
      </div>
    </div>
  );
}

// Cell: the Export menu over a response printed with the form's document template.
export function ExportRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[13px]">
      <div className="absolute top-0 left-0 h-[330px] w-[236px] rounded-sm border border-neutral-300 bg-neutral-50 px-5 py-5 text-neutral-900 shadow-xl shadow-black/20">
        <div className="text-[13px] font-semibold">Spring Grants 2026 — Zara Patel</div>
        <div className="mt-0.5 text-[10px] text-neutral-500">Submitted 27 Oct 2026, 08:51</div>
        {[
          ["Project title", "Murals for the Eastside underpass"],
          ["Amount requested", "$8,500.00"],
          ["Total requested", "$8,450.00"],
        ].map(([question, answer]) => (
          <div key={question} className="mt-3">
            <div className="text-[10px] text-neutral-500">{question}</div>
            <div className="text-[11px]">{answer}</div>
          </div>
        ))}
        <svg viewBox="0 0 160 40" className="mt-4 h-9 w-[150px] text-neutral-800" fill="none" aria-hidden="true">
          <path d="M4 30c10-18 18-24 22-16s-8 18-2 14 14-22 20-18-4 16 4 14 12-12 18-10 2 10 10 8 22-10 34-12 18 2 30-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div className="border-t border-neutral-300 pt-1 text-[9px] text-neutral-500">Signed by Zara Patel</div>
      </div>
      <div className="absolute top-[24px] left-[262px] flex flex-col gap-2">
        <ToolButton icon={Download} active className="self-start">
          Export
        </ToolButton>
        <div className={cn("w-[198px] p-1 text-[12px]", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
          <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Selected responses</div>
          <div className="flex items-center gap-2 rounded-md bg-foreground/[0.07] px-2.5 py-1.5">
            <FileText className="size-3.5 text-muted-foreground" /> CSV (Excel-ready)
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-foreground/85">
            <FileJson className="size-3.5 text-muted-foreground" /> JSON
          </div>
          <div className="mx-1 my-1 h-px bg-foreground/10" />
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-foreground/85">
            <Printer className="size-3.5 text-muted-foreground" /> Print / PDF
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { name: "Programme review", approvers: ["ravi@brightloop.org"] },
  { name: "Finance check", approvers: ["noah@brightloop.org"] },
  { name: "Panel decision", approvers: ["elena@brightloop.org", "mia@brightloop.org"] },
];

const CHAIN = [
  { name: "Programme review", who: "ravi@brightloop.org", state: "done" },
  { name: "Finance check", who: "noah@brightloop.org", state: "current" },
  { name: "Panel decision", who: "elena@brightloop.org, mia@brightloop.org", state: "waiting" },
];

function SectionCard({ title, description, action, children, className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.09] bg-foreground/[0.015]", className)}>
      <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          {description ? <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{description}</div> : null}
        </div>
        {action ? <span className="ml-auto shrink-0">{action}</span> : null}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

// Section stage: Spring Grants' three approval steps, and Kofi's response waiting on the second of them.
export function ApprovalStage() {
  const kofi = APPLICATIONS[1];
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Approvals" icon={ClipboardCheck} meta="Spring Grants 2026 — Application" className="absolute top-0 left-0 h-[640px] w-[580px]">
        <div className="flex flex-col gap-3 p-5">
          <SectionCard title="Approval routing" description="Responses wait as “Pending” until every step approves, in order. Any rejection closes the request.">
            <div className="flex items-center justify-between text-[12px]">
              Require approval
              <Toggle />
            </div>
          </SectionCard>
          <SectionCard title="Steps" action={<ToolButton icon={Plus}>Add step</ToolButton>}>
            <div className="flex flex-col gap-2.5">
              {STEPS.map((step, index) => (
                <div key={step.name} className="rounded-lg border border-foreground/[0.08] p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.08] text-[10px] font-semibold">{index + 1}</span>
                    <span className="text-[11px] text-muted-foreground">Step name</span>
                    <span className="ml-auto flex items-center gap-2 text-muted-foreground">
                      <ArrowUp className={cn("size-3.5", index === 0 && "opacity-30")} />
                      <ArrowDown className={cn("size-3.5", index === STEPS.length - 1 && "opacity-30")} />
                      <Trash2 className="size-3.5" />
                    </span>
                  </div>
                  <Input className="mt-1.5">{step.name}</Input>
                  <div className="mt-2 text-[11px] text-muted-foreground">Approvers</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {step.approvers.map((email) => (
                      <span key={email} className="rounded-md border border-foreground/[0.12] bg-foreground/[0.04] px-2 py-0.5 text-[11px]">
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </Window>
      <div className={cn("absolute top-[16px] left-[564px] z-[2] w-[436px] overflow-hidden text-[13px]", POPOVER, styles.float)}>
        <DrawerHeader row={kofi} />
        <DrawerTabs active="Approvals" />
        <div className="flex flex-col gap-3 px-5 py-4">
          <div className="rounded-lg border border-foreground/[0.08] p-3">
            <div className="flex items-center justify-between text-[12px] font-medium">
              Approval chain
              <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-normal text-amber-700 dark:text-amber-300">Pending</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-2.5">
              {CHAIN.map((step) => {
                const Icon = step.state === "done" ? CheckCircle2 : step.state === "current" ? CircleDot : Circle;
                return (
                  <div key={step.name} className="flex items-start gap-2.5">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", step.state === "done" ? "text-emerald-500" : step.state === "current" ? "text-amber-500" : "text-muted-foreground/60")} />
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium">{step.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{step.who}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-foreground/[0.08] p-3">
            <div className="text-[12px] font-medium">Decision · Finance check</div>
            <div className="mt-2 h-[52px] rounded-md border border-foreground/[0.12] px-2.5 py-2 text-[12px]">
              <Typed text="Quotes match the budget lines." delay={1.4} />
            </div>
            <div className="mt-2.5 flex gap-2 text-[12px] font-medium">
              <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-500 text-white">
                <CheckCircle2 className="size-3.5" /> Approve
              </span>
              <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">Reject</span>
            </div>
          </div>
          <div className={cn("rounded-lg border border-foreground/[0.08] p-3", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
            <div className="text-[12px] font-medium">History</div>
            <div className="mt-2 flex gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div className="text-[12px]">
                <span className="font-medium">Ravi Menon</span> <span className="text-muted-foreground">approved Programme review</span>
                <div className="mt-0.5 text-muted-foreground">“A strong case for the teens programme.”</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIONS = [
  ["Set priority", "High"],
  ["Assign to", "ravi@brightloop.org"],
  ["Add tag", "large-grant"],
  ["Call webhook URL", "https://hooks.brightloop.org/grants"],
];

// Cell: an automation that routes large requests the moment they arrive.
export function AutomationRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-3">
        <Toggle />
        <Input className="flex-1 text-[13px] font-medium">Route large requests to Ravi</Input>
      </div>
      <div className="mt-3.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">When</span>
        <Segmented options={["All match", "Any matches"]} className="text-[11px]" />
      </div>
      <div className="mt-2 grid grid-cols-[1fr_120px_76px] gap-2">
        <Select>Amount requested</Select>
        <Select>Greater than</Select>
        <Input className="h-7 font-mono text-[11px]">5000</Input>
      </div>
      <div className="mt-3.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Then</div>
      <div className="mt-2 flex flex-col gap-2">
        {ACTIONS.map(([action, value], index) => (
          <div key={action} className={cn("grid grid-cols-[156px_1fr] gap-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <Select>{action}</Select>
            {action === "Set priority" ? <Select>{value}</Select> : <Input className="h-7 truncate text-[11px]">{value}</Input>}
          </div>
        ))}
      </div>
    </div>
  );
}

const SIGNATURE = "M20 62c17-36 31-48 39-31s-14 36-3 28 25-42 36-34-8 31 8 25 22-22 34-17 3 17 20 14 42-20 64-22 36 6 59-8";

// Cell: Ravi countersigns an approved application, stamping his name and the time onto its PDF.
export function CountersignRender() {
  return (
    <div className={cn("mx-auto w-[440px] p-5 text-[13px]", POPOVER)}>
      <div className="text-[15px] font-semibold tracking-[-0.01em]">Countersign response</div>
      <p className="mt-1 text-[12px] leading-[1.45] text-muted-foreground">Your signature, name and the time are stamped onto this response and its PDF.</p>
      <div className="relative mt-3 h-[96px] rounded-lg border border-dashed border-foreground/20 bg-foreground/[0.02]">
        <div className="absolute top-2 left-6 h-[80px] w-[320px]">
          <svg width="320" height="80" viewBox="0 0 320 80" className="text-foreground/85" fill="none" aria-hidden="true">
            <path d={SIGNATURE} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={cn("absolute top-0 left-0 size-2 rounded-full bg-foreground", styles.travel)} style={{ offsetPath: `path("${SIGNATURE}")`, offsetDistance: "100%", "--travel-duration": "3.6s" }} />
        </div>
        <span className="absolute right-3 bottom-2 text-[11px] text-muted-foreground">Clear</span>
      </div>
      <div className="mt-3 text-[11px] font-medium text-foreground/80">Full name</div>
      <Input className="mt-1.5">Ravi Menon</Input>
      <div className="mt-4 flex justify-end gap-2 text-[12px]">
        <span className="flex h-8 items-center px-3 text-muted-foreground">Cancel</span>
        <span className="flex h-8 items-center rounded-md bg-foreground px-3 font-medium text-background">Countersign</span>
      </div>
    </div>
  );
}

const KPIS = [
  { label: "New Responses", value: "794", delta: "+18%", footer: "VS Last Period" },
  { label: "Form Views", value: "1,860", delta: "+9%", footer: "VS Last Period" },
  { label: "Completion Rate", value: "64%", delta: "+4%", footer: "VS Last Period" },
  { label: "Avg. Completion Time", value: "7m 40s", footer: "Last 30 Days" },
];

// Thirty days of views, starts and submissions, as smooth series for the trend chart.
const SERIES = {
  views: [44, 52, 48, 61, 58, 70, 66, 74, 69, 80, 77, 72, 84, 90, 86, 95, 88, 92, 99, 94, 102, 97, 108, 104, 98, 110, 106, 114, 109, 118],
  starts: [30, 34, 33, 40, 38, 47, 44, 49, 46, 54, 51, 48, 56, 61, 58, 63, 59, 62, 66, 63, 69, 65, 72, 70, 66, 74, 71, 77, 73, 79],
  submits: [19, 22, 21, 26, 24, 30, 28, 31, 29, 34, 33, 31, 36, 39, 37, 40, 38, 40, 42, 40, 44, 42, 46, 45, 42, 47, 45, 49, 47, 51],
};

function Trend({ width = 640, height = 190 }) {
  const max = 125;
  const x = (index) => (index / 29) * width;
  const y = (value) => height - (value / max) * height;
  const line = (values) => values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");
  const area = (values) => `${line(values)} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-foreground" aria-hidden="true">
      {[0.25, 0.5, 0.75].map((share) => (
        <line key={share} x1="0" x2={width} y1={height * share} y2={height * share} stroke="currentColor" strokeOpacity="0.06" />
      ))}
      <path d={area(SERIES.views)} fill="currentColor" fillOpacity="0.05" />
      <path d={line(SERIES.views)} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d={area(SERIES.starts)} fill="currentColor" fillOpacity="0.06" />
      <path d={line(SERIES.starts)} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d={area(SERIES.submits)} className="fill-emerald-500/15" />
      <path d={line(SERIES.submits)} fill="none" strokeWidth="1.75" className="stroke-emerald-500" />
    </svg>
  );
}

const RINGS = [
  { label: "Form views", value: "1,860", share: 100, radius: 70, tone: "text-foreground/30" },
  { label: "Started filling", value: "1,240", share: 67, radius: 54, tone: "text-foreground/60" },
  { label: "Submitted", value: "794", share: 43, radius: 38, tone: "text-emerald-500" },
];

// Section stage: the Overview dashboard for the last 30 days, with the completion funnel beside it.
export function AnalyticsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Overview" icon={LayoutDashboard} meta="Brightloop" className="absolute top-0 left-0 h-[640px] w-[700px]" barClassName="pr-4" actions={<Select className="text-foreground">Last 30 days</Select>}>
        <div className="flex flex-col gap-4 p-5">
          <div className={cn("grid grid-cols-4 divide-x divide-foreground/[0.07] overflow-hidden", CARD)}>
            {KPIS.map((kpi, index) => (
              <div key={kpi.label} className="px-4 py-3.5">
                <div className="text-[11px] text-muted-foreground">{kpi.label}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[22px] font-medium tracking-[-0.02em] tabular-nums">{kpi.value}</span>
                  {kpi.delta ? (
                    <span className={cn("flex items-center gap-0.5 text-[11px] text-emerald-600 dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.1}s` }}>
                      <TrendingUp className="size-3" /> {kpi.delta}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">{kpi.footer}</div>
              </div>
            ))}
          </div>
          <div className={cn("p-4", CARD)}>
            <div className="flex items-start">
              <div>
                <div className="font-semibold">Responses Over Time</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Daily views, starts and submissions.</div>
              </div>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-[2px] w-3 bg-emerald-500" /> Submissions
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-[2px] w-3 bg-foreground/50" /> Starts
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-[2px] w-3 bg-foreground/25" /> Views
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Trend width={618} />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>28 Sep</span>
              <span>12 Oct</span>
              <span>27 Oct</span>
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[150px] left-[620px] z-[2] w-[360px] p-5 text-[13px]", POPOVER, styles.float)}>
        <div className="font-semibold">Completion Funnel</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Share of views reaching each step, from opening to submitting.</div>
        <div className="mt-4 flex items-center gap-5">
          <svg viewBox="0 0 160 160" className="size-[150px] shrink-0 -rotate-90" aria-hidden="true">
            {RINGS.map((ring) => {
              const circumference = 2 * Math.PI * ring.radius;
              return (
                <g key={ring.label} className={ring.tone}>
                  <circle cx="80" cy="80" r={ring.radius} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="11" />
                  <circle cx="80" cy="80" r={ring.radius} fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(circumference * ring.share) / 100} ${circumference}`} />
                </g>
              );
            })}
          </svg>
          <div className="flex flex-col gap-3">
            {RINGS.map((ring) => (
              <div key={ring.label}>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={cn("size-2 rounded-full bg-current", ring.tone)} />
                  {ring.label}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-[16px] font-medium tabular-nums">{ring.value}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{ring.share}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SOURCES = [
  { source: "newsletter", views: 640, submits: 312 },
  { source: "(direct)", views: 410, submits: 196 },
  { source: "instagram", views: 520, submits: 148 },
  { source: "partner-site", views: 290, submits: 138 },
];

// Cell: which links and campaigns brought applicants in, grouped by UTM source.
export function AttributionRender() {
  return (
    <div className={cn("mx-auto w-[460px] overflow-hidden text-[13px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Route className="size-4 text-muted-foreground" />
        <span className="font-semibold">Source &amp; Attribution</span>
        <Segmented options={["Source", "Medium", "Campaign", "Referrer"]} className="ml-auto text-[11px]" />
      </div>
      <div className={cn("grid grid-cols-[1fr_52px_1.3fr_64px] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Source</span>
        <span className="text-right">Views</span>
        <span>Submissions</span>
        <span className="text-right">Conversion</span>
      </div>
      {SOURCES.map((row, index) => (
        <div key={row.source} className={cn("grid grid-cols-[1fr_52px_1.3fr_64px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
          <span className="truncate font-mono text-[12px]">{row.source}</span>
          <span className="text-right text-[12px] text-muted-foreground tabular-nums">{row.views}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
              <span className={cn("block h-full origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${(row.submits / 312) * 100}%`, "--fill-delay": `${0.3 + index * 0.12}s` }} />
            </span>
            <span className="w-7 text-right text-[12px] tabular-nums">{row.submits}</span>
          </span>
          <span className="text-right text-[12px] tabular-nums">{((row.submits / row.views) * 100).toFixed(1)}%</span>
        </div>
      ))}
      <div className="px-4 py-2.5 text-[11px] text-muted-foreground">Tag links with utm_source, utm_medium and utm_campaign.</div>
    </div>
  );
}

const VARIANTS = [
  { name: "Control", title: "Spring Grants 2026", views: 930, submits: 372, conversion: 40.0, control: true },
  { name: "Variant B", title: "Fund your next community project", views: 930, submits: 422, conversion: 45.4, lift: "+13.4%" },
];

// Cell: two titles for the same form, split evenly, with the winner marked by a significance test.
export function AbTestRender() {
  return (
    <div className={cn("mx-auto w-[460px] p-4 text-[13px]", CARD)}>
      <div className="flex items-center gap-2">
        <FlaskConical className="size-4 text-muted-foreground" />
        <span className="font-semibold">A/B Testing</span>
        <Select className="ml-auto">Spring Grants 2026 — Application</Select>
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {VARIANTS.map((variant, index) => (
          <div key={variant.name} className={cn("rounded-lg border p-3", variant.control ? "border-foreground/[0.09]" : "border-emerald-500/25 bg-emerald-500/[0.04]")}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{variant.name}</span>
              {variant.control ? (
                <span className="rounded-md bg-foreground/[0.07] px-1.5 text-[11px] leading-5">Control</span>
              ) : (
                <span className={cn("rounded-md bg-emerald-500/15 px-1.5 text-[11px] leading-5 text-emerald-700 dark:text-emerald-300", styles.popIn)} style={{ "--pop-delay": "1.2s" }}>
                  Winning · p=0.019
                </span>
              )}
              {variant.lift ? <span className="ml-auto text-[12px] text-emerald-600 tabular-nums dark:text-emerald-400">{variant.lift}</span> : null}
            </div>
            <div className="mt-1 truncate text-[12px] text-muted-foreground">Title: “{variant.title}”</div>
            <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
              <span>{variant.views} views</span>
              <span>{variant.submits} submissions</span>
              <span className="ml-auto flex w-[130px] items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                  <span
                    className={cn("block h-full origin-left rounded-full", styles.fill, variant.control ? "bg-foreground/45" : "bg-emerald-500")}
                    style={{ width: `${variant.conversion * 2}%`, "--fill-delay": `${0.3 + index * 0.25}s` }}
                  />
                </span>
                <span className="text-foreground/90">{variant.conversion.toFixed(1)}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
