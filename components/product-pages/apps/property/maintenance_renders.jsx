import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Camera,
  ChevronDown,
  CircleCheckBig,
  ClipboardCheck,
  Clock,
  Clock3,
  DollarSign,
  FileSpreadsheet,
  FileText,
  HardHat,
  History,
  Home,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  MessagesSquare,
  Package,
  PawPrint,
  Plus,
  Receipt,
  ShieldCheck,
  SquarePen,
  Star,
  UserRound,
  Wallet,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Chip, LINE, PriorityIcon, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  AppShell,
  Card,
  Cell2,
  EditorHead,
  Field,
  FilterChip,
  GhostButton,
  HeadRow,
  Pill,
  PrimaryButton,
  Row,
  ScreenHead,
  SearchBox,
  SectionNav,
  StatStrip,
  StatusPill,
  ViewTabs,
  usd,
} from "@/components/product-pages/apps/property/property_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Property maintenance renders for Elmwood Residences: work orders, the people behind them and the portals.

const PRIORITY_LEVEL = { Low: "low", Medium: "medium", High: "high", Urgent: "urgent" };

function Priority({ value }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px]", value === "Urgent" ? "text-red-600 dark:text-red-400" : "text-foreground/80")}>
      <PriorityIcon level={PRIORITY_LEVEL[value]} />
      {value}
    </span>
  );
}

const WORK_ORDERS = [
  { name: "No heat in living room", where: "Harbour View · HV-12 · HVAC", kind: "Work order", status: "In progress", priority: "Urgent", due: "Oct 27", who: "Northwind HVAC", cost: 380, live: true },
  { name: "Leaking shower valve", where: "The Foundry Lofts · FL-3B · Plumbing", kind: "Work order", status: "Scheduled", priority: "High", due: "Oct 29", who: "Brightline Plumbing" },
  { name: "Dishwasher not draining", where: "Elmwood Court · EC-118 · Appliance", kind: "Work order", status: "On hold", priority: "Medium", due: "Oct 24", overdue: true, who: "Ashgrove Appliance", cost: 145 },
  { name: "Hallway light out, third floor", where: "The Foundry Lofts · Electrical", kind: "Work order", status: "Open", priority: "Low", due: "Nov 3", who: "Marcus Whitfield" },
  { name: "Boiler annual service", where: "Harbour View · HVAC", kind: "Work order", field: true, status: "Scheduled", priority: "Medium", due: "Nov 6", who: "Northwind HVAC", cost: 1240 },
  { name: "Front door lock sticking", where: "Harbour View · HV-07 · General", kind: "Request", status: "In review", priority: "Medium", due: "—", who: "" },
  { name: "Gutters cleared before winter", where: "Elmwood Court · Landscaping", kind: "Work order", status: "Completed", priority: "Low", due: "Oct 20", who: "Greenway Grounds", cost: 420 },
  { name: "Mice in the bike storage room", where: "Elmwood Court · Pest control", kind: "Work order", status: "Completed", priority: "High", due: "Oct 18", who: "Fieldnote Pest Control", cost: 260 },
];

const WO_COLS = "minmax(0,2fr) 104px 104px 88px 70px minmax(0,1.1fr) 62px";

function WorkOrderRow({ order, className, style }) {
  return (
    <Row cols={WO_COLS} className={className} style={style}>
      <Cell2 top={order.name} bottom={order.where} />
      <span className="flex items-center gap-1">
        <Pill tone="neutral" dot={false}>
          {order.kind}
        </Pill>
        {order.field ? (
          <Pill tone="neutral" dot={false}>
            Field
          </Pill>
        ) : null}
      </span>
      <span className="flex items-center gap-1.5">
        <StatusPill area="work" status={order.status} />
        {order.live ? <span className={cn("size-1.5 rounded-full bg-amber-500 text-amber-500", styles.pulse)} /> : null}
      </span>
      <Priority value={order.priority} />
      <span className={cn("text-[12px] tabular-nums", order.overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{order.due}</span>
      <span className="truncate text-[12px] text-muted-foreground">{order.who || "Unassigned"}</span>
      <span className="text-right tabular-nums">{order.cost ? usd(order.cost) : "—"}</span>
    </Row>
  );
}

// The hero plane: Work Orders across the three buildings, a resident's new request landing and the urgent job's field report being written.
export function WorkOrdersWindow() {
  return (
    <AppShell open="Maintenance" active="Work Orders" className="relative h-[700px] w-[1180px]">
      <ScreenHead
        title="Work Orders"
        description="Every maintenance job in one place — work orders, tenant requests, and field visits."
        actions={<PrimaryButton icon={Plus}>New Work Order</PrimaryButton>}
      />
      <div className="flex flex-col gap-4 px-6 pt-4">
        <StatStrip
          stats={[
            { label: "Open", value: "23", footer: "61 total" },
            { label: "Overdue", value: "3", footer: "Open past their due date", className: "text-red-600 dark:text-red-400" },
            { label: "Awaiting approval", value: "2", footer: "Owner sign-off pending" },
            { label: "Cost MTD", value: "$8,460", footer: "Avg 2.4 days to complete" },
          ]}
        />
        <div className="flex items-center gap-2">
          <ViewTabs tabs={["All", "Work orders", "Requests", "Field", "Open", "Overdue", "Awaiting approval"]} />
          <FilterChip className="ml-auto">Priorities</FilterChip>
          <FilterChip>Vendors</FilterChip>
          <SearchBox className="w-[150px]">Search…</SearchBox>
        </div>
      </div>
      <div className={cn("mx-6 mt-3 overflow-hidden rounded-xl border", LINE)}>
        <HeadRow cols={WO_COLS} labels={["Work order", "Type", "Status", "Priority", "Due", "Assignee", "Cost"]} right={[6]} />
        <WorkOrderRow
          order={{ name: "Bathroom fan stopped working", where: "Elmwood Court · EC-204 · HVAC", kind: "Request", status: "Submitted", priority: "Medium", due: "—", who: "" }}
          className={cn("bg-foreground/[0.03]", styles.popIn)}
          style={{ "--pop-delay": "1s" }}
        />
        {WORK_ORDERS.map((order) => (
          <WorkOrderRow key={order.name} order={order} />
        ))}
      </div>
      <div className="absolute top-[300px] left-[690px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className={cn("border-b px-4 py-3.5", LINE)}>
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">No heat in living room</span>
            <StatusPill area="work" status="In progress" className="ml-auto" />
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground">Work order · Harbour View · HV-12 · Urgent priority</div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-4 py-3 text-[12px]">
          {[
            ["Vendor", "Northwind HVAC"],
            ["Technician", "Nathan Okafor"],
            ["Scheduled", "Today, 9:00–11:00"],
            ["Entry", "Call first"],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="mt-0.5 truncate">{value}</div>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <FileText className="size-3" /> Field Report
          </div>
          <div className="min-h-[64px] rounded-lg border border-foreground/30 px-3 py-2.5 leading-5">
            <Typed text="Thermostat wire loose at the wall plate." delay={1.4} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const WO_NAV = [
  { group: null, items: [{ label: "Overview", icon: LayoutDashboard }] },
  { group: "Work order", items: [{ label: "Details", icon: SquarePen }, { label: "Location", icon: MapPin }, { label: "Entry & Access", icon: KeyRound }] },
  { group: "Dispatch", items: [{ label: "Assignment & Schedule", icon: HardHat }, { label: "Dispatch History", icon: ClipboardCheck }, { label: "Owner Approval", icon: BadgeCheck }] },
  { group: "Money", items: [{ label: "Estimates", icon: FileSpreadsheet }, { label: "Costs", icon: DollarSign }, { label: "Billing", icon: Receipt }] },
  { group: "On site", items: [{ label: "Checklist", icon: ListChecks }, { label: "Time Log", icon: Clock3 }, { label: "Materials Used", icon: Package }, { label: "Photos", icon: Camera }] },
  { group: "Close-out", items: [{ label: "Completion", icon: CircleCheckBig }, { label: "Tenant Feedback", icon: Star }] },
  { group: "Files & history", items: [{ label: "Timeline", icon: History }, { label: "Documents", icon: FileText }] },
];

const TIMELINE = [
  { status: "Scheduled", who: "Marcus Whitfield", note: "Oct 29, 9:00–11:00", when: "Oct 26, 14:12", current: true },
  { status: "Open", who: "Marcus Whitfield", note: "Converted from the request", when: "Oct 26, 9:40" },
  { status: "In review", who: "Marcus Whitfield", note: "Shower valve drips when off", when: "Oct 25, 18:05" },
  { status: "Submitted", who: "Leah Mensah", note: "Resident portal", when: "Oct 25, 17:51" },
];

// Section stage: the FL-3B work order on Assignment & Schedule, its timeline floating alongside.
export function WorkOrderStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[680px] w-[760px]">
        <EditorHead
          back="Work Orders"
          title="Leaking shower valve"
          area="work"
          status="Scheduled"
          meta="Work order · The Foundry Lofts · FL-3B · High priority · Brightline Plumbing · Due Oct 29"
          actions={<GhostButton icon={ChevronDown}>Actions</GhostButton>}
        />
        <div className="flex min-h-0 flex-1">
          <SectionNav groups={WO_NAV} active="Assignment & Schedule" className="w-[204px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4 text-[12px]">
            <Card title="Assignment" bodyClassName="grid grid-cols-2 gap-3 p-4">
              <Field label="Vendor">
                <Avatar name="Brightline Plumbing" size={16} /> Brightline Plumbing
              </Field>
              <Field label="Technician">Nathan Okafor</Field>
              <Field label="Dispatched via">
                Vendor portal <ChevronDown className="ml-auto size-3 text-muted-foreground" />
              </Field>
              <Field label="Dispatched on">Oct 26, 2026</Field>
              <div className="col-span-2 flex items-center justify-between rounded-md bg-foreground/[0.03] px-3 py-2">
                <span className="text-foreground/85">Vendor accepted</span>
                <span className="flex h-5 w-9 items-center rounded-full bg-foreground p-0.5">
                  <span className="ml-auto size-4 rounded-full bg-background" />
                </span>
              </div>
            </Card>
            <Card title="Schedule" bodyClassName="grid grid-cols-3 gap-3 p-4">
              <Field label="Scheduled date">Oct 29, 2026</Field>
              <Field label="Window start">9:00</Field>
              <Field label="Window end">11:00</Field>
              <Field label="Estimated hours">2</Field>
              <Field label="PO number">PO-1042</Field>
              <Field label="Not-to-exceed">$600</Field>
            </Card>
            <Card title="Instructions for the vendor" bodyClassName="px-4 py-3 leading-5 text-foreground/85">
              Valve drips with the tap off. Cat in the unit, so keep the bathroom door closed. Call Leah 30 minutes before arriving.
            </Card>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[120px] left-[690px] z-[2] w-[300px]", styles.float)}>
        <Window className="shadow-2xl shadow-black/30">
          <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
            <History className="size-4 text-muted-foreground" />
            <span className="font-medium">Timeline</span>
            <span className="ml-auto text-[12px] text-muted-foreground">4 changes</span>
          </div>
          <div className="relative flex flex-col gap-4 px-4 py-4 text-[12px]">
            <span className="absolute top-6 bottom-6 left-[19px] border-l border-dashed border-foreground/20" />
            {TIMELINE.map((entry, index) => (
              <div key={entry.status} className={cn("relative flex gap-3", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
                <span className={cn("mt-1 size-[7px] shrink-0 rounded-full", entry.current ? cn("bg-emerald-500 text-emerald-500", styles.pulse) : "bg-foreground/40")} />
                <div className="min-w-0 flex-1">
                  <StatusPill area="work" status={entry.status} />
                  <div className="mt-1 truncate text-foreground/85">
                    {entry.who} · {entry.note}
                  </div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">{entry.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  );
}

const ENTRY_OPTIONS = ["Entry allowed", "Call first", "Resident must be present"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Early morning", "Morning", "Midday", "Afternoon", "Evening"];

// Cell: Entry & Access, how and when the technician can get in.
export function EntryRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="mb-1.5 text-[11px] text-muted-foreground">Entry permission</div>
      <div className="flex gap-1 rounded-lg bg-foreground/[0.05] p-1 text-center">
        {ENTRY_OPTIONS.map((option, index) => (
          <span key={option} className={cn("flex-auto rounded-md px-2 py-1.5 whitespace-nowrap", index === 1 ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
            {option}
          </span>
        ))}
      </div>
      <div className="mt-3.5 mb-1.5 text-[11px] text-muted-foreground">Preferred days</div>
      <div className="flex gap-1">
        {DAYS.map((day) => (
          <span key={day} className={cn("flex-1 rounded-md border py-1 text-center", ["Tue", "Thu"].includes(day) ? "border-foreground/30 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.08] text-muted-foreground")}>
            {day}
          </span>
        ))}
      </div>
      <div className="mt-3.5 mb-1.5 text-[11px] text-muted-foreground">Preferred times</div>
      <div className="flex flex-wrap gap-1">
        {TIMES.map((time) => (
          <Chip key={time} className={cn("h-6 text-[11px]", time === "Morning" && "border-foreground/30 text-foreground")}>
            {time}
          </Chip>
        ))}
      </div>
      <div className={cn("mt-3.5 flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <PawPrint className="size-3.5 text-muted-foreground" />
        <span className="text-foreground/85">Pets present · 1 cat, will be secured</span>
      </div>
    </div>
  );
}

const HOLD_REASONS = ["Waiting on parts", "Waiting on approval", "Waiting on tenant access", "Waiting on vendor", "Weather", "Other"];

// Cell: putting a job on hold, with the reason chosen from the list.
export function HoldRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[12px]">
      <div className="absolute inset-x-0 top-0 rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3 dark:bg-surface-subtle">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">Dishwasher not draining</span>
          <StatusPill area="work" status="On hold" />
        </div>
        <div className="mt-0.5 text-muted-foreground">Elmwood Court · EC-118 · Ashgrove Appliance</div>
        <div className="mt-2.5 flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <Clock className="size-3.5" /> Waiting on parts · drain pump due Nov 2
        </div>
      </div>
      <div className="absolute top-[96px] left-[24px] w-[250px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 shadow-xl shadow-black/20 dark:bg-surface-dialog">
        <div className="px-2.5 pt-1 pb-1 text-[11px] text-muted-foreground">Hold reason</div>
        {HOLD_REASONS.map((reason) => (
          <div key={reason} className={cn("flex items-center rounded-md px-2.5 py-[5px]", reason === "Waiting on parts" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            {reason}
            {reason === "Waiting on parts" ? <BadgeCheck className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[150px] right-0 w-[170px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 shadow-lg shadow-black/10 dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <div className="text-[11px] text-muted-foreground">Overdue</div>
        <div className="mt-0.5 text-[17px] font-semibold text-red-600 tabular-nums dark:text-red-400">3 days</div>
        <div className="mt-1 text-muted-foreground">Due Oct 24</div>
      </div>
    </div>
  );
}

const ESTIMATES = [
  { scope: "Circulator pump", vendor: "Northwind HVAC", amount: 1240, status: "Accepted", tone: "emerald", valid: "Valid to Nov 20" },
  { scope: "Circulator pump", vendor: "Ridgeway Heating", amount: 1410, status: "Received", tone: "strong", valid: "Valid to Nov 12" },
  { scope: "Pump and expansion tank", vendor: "Brightline Plumbing", amount: 1980, status: "Declined", tone: "red", valid: "Received Oct 21" },
];

// Cell: three vendor quotes for the same job, one accepted.
export function EstimatesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <FileSpreadsheet className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Estimates</span>
        <span className="ml-auto text-muted-foreground">Boiler service · Harbour View</span>
      </div>
      {ESTIMATES.map((estimate, index) => (
        <div key={estimate.vendor} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, index === 0 && "bg-emerald-500/[0.04]", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.15}s` }}>
          <Avatar name={estimate.vendor} size={24} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-foreground/90">{estimate.vendor}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {estimate.scope} · {estimate.valid}
            </div>
          </div>
          <Pill tone={estimate.tone}>{estimate.status}</Pill>
          <span className="w-[54px] text-right font-medium tabular-nums">{usd(estimate.amount)}</span>
        </div>
      ))}
    </div>
  );
}

const LINE_ITEMS = [
  { type: "Labor", what: "Diagnose and replace valve", qty: "2 h × $95", amount: "$190.00" },
  { type: "Material", what: "Cartridge valve · +10% markup", qty: "1 × $64", amount: "$70.40" },
  { type: "Trip charge", what: "Call-out", qty: "1 × $45", amount: "$45.00" },
];

// Cell: a job's line items rolled up into labour, materials, trips and the chargeback.
export function CostsRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {[
          ["Labor", "$190"],
          ["Materials", "$70"],
          ["Trip & other", "$45"],
          ["Total cost", "$305"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-3 py-2.5", index > 0 && "border-l border-foreground/[0.07]")}>
            <div className="truncate text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[16px] font-semibold tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>Line items · Leaking shower valve</div>
        {LINE_ITEMS.map((item, index) => (
          <div key={item.type} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <Pill tone="neutral" dot={false} className="w-[74px] justify-center">
              {item.type}
            </Pill>
            <span className="min-w-0 flex-1 truncate text-foreground/85">{item.what}</span>
            <span className="text-muted-foreground tabular-nums">{item.qty}</span>
            <span className="w-[56px] text-right tabular-nums">{item.amount}</span>
          </div>
        ))}
        <div className={cn("flex items-center justify-between border-t bg-foreground/[0.02] px-4 py-2.5", LINE)}>
          <span className="text-muted-foreground">Tenant chargeback</span>
          <span className="tabular-nums">$0.00 · none billable</span>
        </div>
      </div>
    </div>
  );
}

const TENANTS = [
  { name: "Leah Mensah", email: "leah.mensah@example.com", status: "Current", unit: "FL-3B", end: "Aug 31, 2027", insurance: "Compliant", portal: "Active", balance: 0 },
  { name: "Zara Patel", email: "zara.patel@example.com", status: "Current", unit: "HV-12", end: "Dec 20, 2026", insurance: "Expiring soon", portal: "Active", balance: 0 },
  { name: "Noah Fischer", email: "noah.f@example.com", status: "Late", unit: "HV-03", end: "May 31, 2027", insurance: "Missing", portal: "Invited", balance: 1925 },
  { name: "Theo Lindqvist", email: "theo.l@example.com", status: "On notice", unit: "EC-101", end: "Nov 30, 2026", insurance: "Compliant", portal: "Active", balance: 0 },
  { name: "Grace Donnelly", email: "grace.d@example.com", status: "Future", unit: "HV-15", end: "Nov 14, 2027", insurance: "Compliant", portal: "Invited", balance: 0 },
  { name: "Kofi Asante", email: "kofi.asante@example.com", status: "Current", unit: "FL-2A", end: "Mar 31, 2027", insurance: "Compliant", portal: "Active", balance: 0 },
  { name: "Samuel Okoro", email: "samuel.okoro@example.com", status: "Applicant", unit: "EC-204", end: "—", insurance: "", portal: "Not invited", balance: 0 },
];

const TENANT_COLS = "minmax(0,1.6fr) 84px 54px 92px 104px 82px 60px";

// Section stage: the Tenants list, a vendor's record floating over it.
export function PeopleStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[760px]">
        <ScreenHead title="Tenants" description="Residents across Elmwood Court, The Foundry Lofts and Harbour View." actions={<PrimaryButton icon={Plus}>New Tenant</PrimaryButton>} />
        <div className="flex items-center gap-2 px-5 py-3">
          <ViewTabs tabs={["All", "Current", "Applicants", "Insurance gaps"]} active={1} />
          <SearchBox className="ml-auto w-[170px]">Search tenants…</SearchBox>
        </div>
        <HeadRow cols={TENANT_COLS} labels={["Tenant", "Status", "Unit", "Lease end", "Insurance", "Portal", "Balance"]} right={[6]} className={cn("border-t", LINE)} />
        {TENANTS.map((tenant) => (
          <Row key={tenant.name} cols={TENANT_COLS}>
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar name={tenant.name} size={24} />
              <Cell2 top={tenant.name} bottom={tenant.email} />
            </span>
            <span>
              <StatusPill area="tenant" status={tenant.status} />
            </span>
            <span className="text-[12px] text-muted-foreground">{tenant.unit}</span>
            <span className="text-[12px] text-muted-foreground tabular-nums">{tenant.end}</span>
            <span>{tenant.insurance ? <StatusPill area="compliance" status={tenant.insurance} /> : <span className="text-muted-foreground">—</span>}</span>
            <span>
              <StatusPill area="portal" status={tenant.portal} />
            </span>
            <span className={cn("text-right font-semibold tabular-nums", tenant.balance > 0 && "text-red-600 dark:text-red-400")}>{usd(tenant.balance)}</span>
          </Row>
        ))}
      </Window>
      <div className={cn("absolute top-[150px] left-[650px] z-[2] w-[340px]", styles.float)}>
        <Window className="shadow-2xl shadow-black/30">
          <div className={cn("flex items-center gap-3 border-b px-4 py-3.5", LINE)}>
            <Avatar name="Brightline Plumbing" size={34} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold">Brightline Plumbing</div>
              <div className="text-[11px] text-muted-foreground">Vendor · since 2023</div>
            </div>
            <StatusPill area="vendor" status="Preferred" />
          </div>
          <div className="flex flex-col gap-2.5 px-4 py-3.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trades</span>
              <span className="flex gap-1">
                <Pill tone="neutral" dot={false}>
                  Plumbing
                </Pill>
                <Pill tone="neutral" dot={false}>
                  General contractor
                </Pill>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Compliance</span>
              <span className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">COI to Mar 31, 2027</span>
                <StatusPill area="compliance" status="Compliant" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>$95/hr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-semibold tabular-nums">4.8 ★</span>
            </div>
          </div>
          <div className={cn("border-t px-4 py-3 text-[12px]", LINE)}>
            <div className="mb-2 text-[11px] text-muted-foreground">Open work orders · 3</div>
            {[
              ["Leaking shower valve", "Scheduled"],
              ["Water heater pressure check", "Open"],
            ].map(([name, status]) => (
              <div key={name} className="flex items-center gap-2 py-1">
                <Wrench className="size-3.5 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-foreground/85">{name}</span>
                <StatusPill area="work" status={status} />
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  );
}

const OWNERS = [
  { name: "Harbour View Partners LLC", status: "Active", properties: "Harbour View", payout: "ACH", w9: "On file", fee: "8%" },
  { name: "Elena Rossi", status: "Active", properties: "Elmwood Court", payout: "ACH", w9: "On file", fee: "7%" },
  { name: "Foundry Lofts Holdings LLC", status: "Active", properties: "The Foundry Lofts", payout: "Check", w9: "On file", fee: "8%" },
  { name: "Okafor Family Trust", status: "Onboarding", properties: "None linked", payout: "No payout set", w9: "Missing", fee: "6%" },
];

const OWNER_COLS = "minmax(0,1fr) 92px 66px 36px";

// Cell: owners with their properties, payout method, W-9 and management fee.
export function OwnersRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <HeadRow cols={OWNER_COLS} labels={["Owner", "Status", "W-9", "Fee"]} right={[3]} className="px-4" />
      {OWNERS.map((owner) => (
        <Row key={owner.name} cols={OWNER_COLS} className="px-4">
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={owner.name} size={22} />
            <Cell2 top={owner.name} bottom={`${owner.properties} · ${owner.payout}`} />
          </span>
          <span>
            <StatusPill area="owner" status={owner.status} />
          </span>
          <span>
            <Pill tone={owner.w9 === "On file" ? "emerald" : "red"} dot={false}>
              {owner.w9}
            </Pill>
          </span>
          <span className="text-right tabular-nums">{owner.fee}</span>
        </Row>
      ))}
    </div>
  );
}

const VENDORS = [
  { name: "Brightline Plumbing", trade: "Plumbing", state: "Compliant", coi: "COI to Mar 31, 2027", rating: "4.8" },
  { name: "Northwind HVAC", trade: "HVAC", state: "Expiring soon", coi: "COI to Nov 15, 2026", rating: "4.6" },
  { name: "Ashgrove Appliance", trade: "Appliance repair", state: "Expired", coi: "COI to Sep 30, 2026", rating: "4.1" },
  { name: "Greenway Grounds", trade: "Landscaping", state: "Compliant", coi: "COI to Jun 30, 2027", rating: "4.7" },
];

// Cell: vendors by trade with their insurance certificates and ratings.
export function VendorsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Vendors</span>
        <span className="ml-auto text-muted-foreground">1 expired · 1 expiring</span>
      </div>
      {VENDORS.map((vendor, index) => (
        <div key={vendor.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <Avatar name={vendor.name} size={24} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-foreground/90">{vendor.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {vendor.trade} · {vendor.coi}
            </div>
          </div>
          <StatusPill area="compliance" status={vendor.state} />
          <span className="w-[38px] text-right font-semibold tabular-nums">{vendor.rating} ★</span>
        </div>
      ))}
    </div>
  );
}

const RESIDENT_NAV = [
  { group: null, items: [{ label: "Home", icon: Home }] },
  { group: "My home", items: [{ label: "Payments", icon: Wallet }, { label: "Maintenance", icon: Wrench }, { label: "Lease & documents", icon: FileText }, { label: "Renters insurance", icon: ShieldCheck }] },
  { group: "Community", items: [{ label: "Announcements", icon: Bell }, { label: "Messages", icon: MessagesSquare }] },
  { group: "Account", items: [{ label: "Profile", icon: UserRound }] },
];

// Showcase: the resident portal's Maintenance screen, a new request being written over it.
export function ResidentPortalRender() {
  return (
    <div className="relative h-[460px] w-[680px]">
      <Window className="absolute top-0 left-0 h-[440px] w-[600px]">
        <div className="flex h-full">
          <div className={cn("flex w-[160px] shrink-0 flex-col border-r", LINE)}>
            <div className={cn("flex items-center gap-2 border-b px-3.5 py-3", LINE)}>
              <AppMark id="property" size={20} />
              <span className="truncate text-[12px] font-medium">Elmwood Residences</span>
            </div>
            <SectionNav groups={RESIDENT_NAV} active="Maintenance" className="w-full border-r-0 px-2 py-3" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("flex items-start gap-3 border-b px-5 py-4", LINE)}>
              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-semibold tracking-[-0.02em]">Maintenance</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Submit requests, add photos, and follow each one from report to repair.</div>
              </div>
              <PrimaryButton icon={Plus}>New Request</PrimaryButton>
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              {[
                ["Leaking shower valve", "Plumbing · Bathroom", "Scheduled", "Oct 29"],
                ["Window latch loose", "General · Bedroom", "In progress", "Oct 22"],
                ["Kitchen tap dripping", "Plumbing · Kitchen", "Completed", "Sep 14"],
              ].map(([name, meta, status, date]) => (
                <div key={name} className="flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3.5 py-2.5 text-[12px]">
                  <Wrench className="size-3.5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-foreground/90">{name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {meta} · {date}
                    </div>
                  </div>
                  <StatusPill area="work" status={status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Window>
      <div className="absolute top-[150px] left-[296px] z-[2] w-[380px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="text-[14px] font-semibold">New Maintenance Request</div>
        <div className="mt-0.5 text-muted-foreground">Tell us what&apos;s wrong — photos help us send the right technician.</div>
        <div className="mt-3">
          <div className="mb-1 text-[11px] text-muted-foreground">What&apos;s the problem?</div>
          <div className="flex h-8 items-center rounded-md border border-foreground/30 px-2.5 text-[13px]">
            <Typed text="Bathroom fan stopped working" delay={1.3} />
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          <Field label="Category">HVAC</Field>
          <Field label="Where">Bathroom</Field>
          <Field label="Entry permission">Call first</Field>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md bg-foreground/[0.03] px-3 py-2">
          <span className="text-foreground/85">This is an emergency</span>
          <span className="flex h-5 w-9 items-center rounded-full bg-foreground/15 p-0.5">
            <span className="size-4 rounded-full bg-background" />
          </span>
        </div>
        <div className="mt-3 flex justify-end">
          <PrimaryButton>Submit Request</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const CODE = ["4", "8", "2", "9", "1", "6"];

// Cell: portal sign-in, a link or a six-digit code from the email.
export function SignInRender() {
  return (
    <div className="mx-auto flex w-[460px] gap-4 text-[12px]">
      <div className="w-[250px] shrink-0 rounded-2xl border border-foreground/[0.1] bg-surface-card px-5 py-5 shadow-xl shadow-black/15 dark:bg-surface-subtle">
        <AppMark id="property" size={22} />
        <div className="mt-4 text-[19px] leading-[1.15] font-bold tracking-[-0.02em]">
          Your home,
          <br />
          one sign-in away.
        </div>
        <p className="mt-2.5 leading-5 text-muted-foreground">
          We sent a link to <span className="text-foreground">leah.mensah@example.com</span>. Open it, or enter the code from the email.
        </p>
        <div className="mt-3.5 flex gap-1.5">
          {CODE.map((digit, index) => (
            <span key={index} className={cn("flex h-9 flex-1 items-center justify-center rounded-md border border-foreground/[0.14] text-[15px] font-medium tabular-nums", styles.popIn)} style={{ "--pop-delay": `${0.5 + index * 0.12}s` }}>
              {digit}
            </span>
          ))}
        </div>
        <span className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-foreground font-medium text-background">
          Sign in <ArrowRight className="size-3.5" />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
        {[
          ["Resident", "Payments, maintenance, lease"],
          ["Owner", "Statements and approvals"],
          ["Vendor", "Jobs, invoices, compliance"],
        ].map(([role, what]) => (
          <div key={role} className="rounded-lg border border-foreground/[0.08] px-3 py-2">
            <div className="font-medium">{role}</div>
            <div className="truncate text-[11px] text-muted-foreground">{what}</div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
          <Mail className="size-3" /> No password to set or reset
        </div>
      </div>
    </div>
  );
}

// Cell: the owner portal's approval queue, a job above the approval limit waiting on a decision.
export function OwnerApprovalRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] text-[12px]">
      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="text-[13px] font-medium">Waiting for your approval</div>
          <div className="text-[11px] text-muted-foreground">Harbour View Partners LLC · Owner portal</div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground/90">Replace boiler circulator pump</span>
            <Pill tone="amber">Awaiting approval</Pill>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              ["Vendor", "Northwind HVAC"],
              ["Priority", "High"],
              ["Amount for approval", "$1,240"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-md bg-foreground/[0.04] px-2.5 py-1.5">
                <div className="truncate text-[10px] text-muted-foreground">{label}</div>
                <div className="truncate">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <GhostButton>Reject</GhostButton>
            <PrimaryButton>Approve</PrimaryButton>
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[200px] left-[24px] flex w-[300px] items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-surface-card px-3.5 py-3 shadow-lg shadow-black/10 dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <BadgeCheck className="size-3" strokeWidth={2.5} />
        </span>
        <div>
          <div className="font-medium text-emerald-700 dark:text-emerald-400">Approved</div>
          <div className="text-[11px] text-muted-foreground">Logged in the work order&apos;s approval history</div>
        </div>
      </div>
    </div>
  );
}
