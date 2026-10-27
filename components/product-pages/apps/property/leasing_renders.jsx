import {
  BookOpen,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  CreditCard,
  DoorClosed,
  FileSignature,
  FileText,
  History,
  Home,
  LayoutDashboard,
  Link2,
  LogIn,
  LogOut,
  MapPin,
  PawPrint,
  PiggyBank,
  Plus,
  Repeat,
  ShieldAlert,
  StickyNote,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  AppShell,
  Card,
  Cell2,
  EditorHead,
  Facade,
  Field,
  GhostButton,
  HeadRow,
  Interior,
  Kitchen,
  Pill,
  PrimaryButton,
  Row,
  ScreenHead,
  SearchBox,
  SectionNav,
  StatStrip,
  StatusPill,
  Tick,
  ViewTabs,
  usd,
} from "@/components/product-pages/apps/property/property_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Property leasing renders for Elmwood Residences: listings, prospects, applications, the lease and move-in day.

const LEASES = [
  { name: "The Foundry Lofts · FL-3B — Leah Mensah", term: "Sep 1, 2026 – Aug 31, 2027", tenant: "Leah Mensah", unit: "FL-3B", status: "Active", ends: "Aug 31, 2027", rent: 2150 },
  { name: "Harbour View · HV-12 — Zara Patel", term: "Dec 21, 2025 – Dec 20, 2026", tenant: "Zara Patel", unit: "HV-12", status: "Expiring soon", ends: "Dec 20, 2026 · 54d", tone: "amber", rent: 2240 },
  { name: "Harbour View · HV-15 — Grace Donnelly", term: "Nov 15, 2026 – Nov 14, 2027", tenant: "Grace Donnelly", unit: "HV-15", status: "Pending", ends: "Nov 14, 2027", rent: 2310 },
  { name: "Elmwood Court · EC-101 — Theo Lindqvist", term: "Mar 1, 2025 – Feb 28, 2027", tenant: "Theo Lindqvist", unit: "EC-101", status: "Notice given", ends: "Moving out Nov 30, 2026", tone: "amber", rent: 1650 },
  { name: "The Foundry Lofts · FL-2A — Kofi Asante", term: "Apr 1, 2026 – Mar 31, 2027", tenant: "Kofi Asante", unit: "FL-2A", status: "Active", ends: "Mar 31, 2027", rent: 2050 },
  { name: "Elmwood Court · EC-310 — Ravi Menon", term: "Jan 15, 2027 – Jan 14, 2028", tenant: "Ravi Menon", unit: "EC-310", status: "Draft", ends: "Jan 14, 2028", rent: 1790 },
  { name: "Harbour View · HV-07 — Hana Ito", term: "Sep 1, 2025 – Aug 31, 2026", tenant: "Hana Ito", unit: "HV-07", status: "Renewed", ends: "Aug 31, 2026", rent: 2180 },
  { name: "Elmwood Court · EC-212 — Elena Rossi", term: "Jul 1, 2026 – Jun 30, 2027", tenant: "Elena Rossi", unit: "EC-212", status: "Active", ends: "Jun 30, 2027", rent: 1725 },
  { name: "The Foundry Lofts · FL-5C — Ines Duarte", term: "Nov 1, 2026 – Oct 31, 2027", tenant: "Ines Duarte", unit: "FL-5C", status: "Pending", ends: "Oct 31, 2027", rent: 2390 },
];

const LEASE_COLS = "minmax(0,2.3fr) minmax(0,1fr) 116px 150px 84px";

// The hero plane: the Leases list across all three buildings, with a new lease being drafted for an approved applicant.
export function LeasesWindow() {
  return (
    <AppShell open="Leasing" active="Leases" className="relative h-[700px] w-[1180px]">
      <ScreenHead
        title="Leases"
        description="Every lease across your portfolio — draft, active, and ending."
        actions={<PrimaryButton icon={Plus}>New Lease</PrimaryButton>}
      />
      <div className="flex flex-col gap-4 px-6 pt-4">
        <StatStrip
          stats={[
            { label: "Leases in force", value: "131", footer: "152 total" },
            { label: "Monthly rent", value: "$262,480", footer: "Leases in force" },
            { label: "In progress", value: "4", footer: "Drafts and pending" },
            { label: "Ending ≤60 days", value: "9", footer: "3 on notice" },
          ]}
        />
        <div className="flex items-center gap-3">
          <ViewTabs tabs={["All", "In force", "Drafts", "Ending soon", "Notice & move-out", "Month-to-month", "Closed"]} />
          <SearchBox className="ml-auto w-[200px]">Search leases…</SearchBox>
        </div>
      </div>
      <div className={cn("mx-6 mt-3 overflow-hidden rounded-xl border", LINE)}>
        <HeadRow cols={LEASE_COLS} labels={["Lease", "Tenant · Unit", "Status", "Ends", "Rent"]} right={[4]} />
        {LEASES.map((lease) => (
          <Row key={lease.name} cols={LEASE_COLS}>
            <Cell2 top={lease.name} bottom={lease.term} />
            <Cell2 top={<span className="font-normal">{lease.tenant}</span>} bottom={lease.unit} />
            <span>
              <StatusPill area="lease" status={lease.status} />
            </span>
            <span className={cn("truncate text-[12px]", lease.tone === "amber" ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground")}>{lease.ends}</span>
            <span className="text-right font-semibold tabular-nums">
              {usd(lease.rent)}
              <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
            </span>
          </Row>
        ))}
      </div>
      <div className="absolute top-[318px] left-[640px] z-[2] w-[400px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
        <div className="text-[15px] font-semibold tracking-[-0.01em]">New Lease</div>
        <div className="mt-0.5 text-[12px] text-muted-foreground">Starts as a draft. Rent and deposit come from the unit.</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <div className="mb-1 text-[11px] text-muted-foreground">Lease name</div>
            <div className="flex h-9 items-center rounded-md border border-foreground/30 px-2.5 text-[13px]">
              <Typed text="Elmwood Court · EC-204 — Samuel Okoro" delay={1.5} />
            </div>
          </div>
          <Field label="Unit" className="col-span-2">
            EC-204 — $1,875 <ChevronDown className="ml-auto size-3 text-muted-foreground" />
          </Field>
          <Field label="Primary tenant">
            <Avatar name="Samuel Okoro" size={16} /> Samuel Okoro
          </Field>
          <Field label="Lease template">Residential 12-month</Field>
          <Field label="Term start">Dec 1, 2026</Field>
          <Field label="Term end">Nov 30, 2027</Field>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <span className="px-3 text-[12px] text-muted-foreground">Cancel</span>
          <PrimaryButton>Create Lease</PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}

const PROSPECTS = [
  { name: "Samuel Okoro", stage: "Applied", source: "Website", unit: "EC-204", follow: "Oct 28", budget: "$1,900" },
  { name: "Clara Vidal", stage: "Toured", source: "Walk-in", unit: "EC-204", follow: "Oct 29", budget: "$1,850" },
  { name: "Kofi Asante", stage: "Showing scheduled", source: "Referral", unit: "FL-2B", follow: "Oct 30", budget: "$2,200" },
  { name: "Maya Chen", stage: "Contacted", source: "Phone call", unit: "HV-09", follow: "Nov 2", budget: "$2,400" },
  { name: "Mia Johansson", stage: "Lost", source: "Signage", unit: "EC-204", follow: "—", budget: "$1,600", dim: true },
];

const PROSPECT_COLS = "minmax(0,1fr) 128px 62px 50px";

// A listing's photos, drawn in tints: the building front large, two rooms beside it.
function ListingPhotos({ className }) {
  const tile = "relative overflow-hidden rounded-lg border border-foreground/[0.08]";
  return (
    <div className={cn("grid grid-cols-[1.7fr_1fr] gap-1.5", className)}>
      <div className={tile}>
        <Facade className="absolute inset-0 h-full w-full" />
      </div>
      <div className="grid grid-rows-2 gap-1.5">
        <div className={tile}>
          <Interior className="absolute inset-0 h-full w-full" />
        </div>
        <div className={tile}>
          <Kitchen className="absolute inset-0 h-full w-full" />
          <span className="absolute right-1.5 bottom-1.5 inline-flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground/80">
            <Camera className="size-3" /> 14
          </span>
        </div>
      </div>
    </div>
  );
}

// Section stage: the EC-204 listing with its photos and terms, the prospects pipeline floating beside it.
export function ListingStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[660px] w-[640px]">
        <EditorHead back="Listings" title="Corner one-bed with bay windows" area="listing" status="Active" meta="Elmwood Court · EC-204 · 1 bd · 1 ba · 640 sq ft · Available Dec 1, 2026" />
        <div className="flex flex-col gap-4 px-6 py-5">
          <ListingPhotos className="h-[210px]" />
          <div className="grid grid-cols-4 gap-2.5">
            {[
              ["Asking rent", "$1,875/mo"],
              ["Deposit", "$1,875"],
              ["Lease terms", "12 or 6 months"],
              ["Pet policy", "Cats only"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-foreground/[0.04] px-3 py-2">
                <div className="text-[11px] text-muted-foreground">{label}</div>
                <div className="mt-0.5 font-medium">{value}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Hardwood floors", "Dishwasher", "In-unit laundry", "Bike storage", "Package lockers"].map((feature) => (
              <Chip key={feature} className="h-6 text-[11px]">
                {feature}
              </Chip>
            ))}
          </div>
          <Card title="Funnel" aside="Since first published · 12 days">
            <div className="grid grid-cols-3 divide-x divide-foreground/[0.07]">
              {[
                ["Leads", 14, 100],
                ["Showings", 6, 43],
                ["Applications", 2, 14],
              ].map(([label, value, share], index) => (
                <div key={label} className="px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-[18px] font-semibold tabular-nums">{value}</div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                    <span className={cn("block h-full origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${share}%`, "--fill-delay": `${0.3 + index * 0.2}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Window>
      <div className={cn("absolute top-[96px] left-[520px] z-[2] w-[480px]", styles.float)}>
        <Window className="shadow-2xl shadow-black/30">
          <div className={cn("flex h-11 items-center gap-2 border-b px-4", LINE)}>
            <span className="font-medium">Prospects</span>
            <span className="text-muted-foreground">Active pipeline</span>
            <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">23</span>
          </div>
          <HeadRow cols={PROSPECT_COLS} labels={["Prospect", "Stage", "Source", "Budget"]} right={[3]} className="px-4" />
          <Row cols={PROSPECT_COLS} className={cn("px-4 bg-foreground/[0.03]", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name="Priya Nair" size={20} />
              <Cell2 top="Priya Nair" bottom="FL-3C · Follow up today" />
            </span>
            <span>
              <StatusPill area="prospect" status="New" />
            </span>
            <span className="truncate text-[12px] text-muted-foreground">Website</span>
            <span className="text-right text-[12px] tabular-nums">$2,300</span>
          </Row>
          {PROSPECTS.map((prospect) => (
            <Row key={prospect.name} cols={PROSPECT_COLS} className={cn("px-4", prospect.dim && "opacity-55")}>
              <span className="flex min-w-0 items-center gap-2">
                <Avatar name={prospect.name} size={20} />
                <Cell2 top={prospect.name} bottom={`${prospect.unit} · Follow up ${prospect.follow}`} />
              </span>
              <span>
                <StatusPill area="prospect" status={prospect.stage} />
              </span>
              <span className="truncate text-[12px] text-muted-foreground">{prospect.source}</span>
              <span className="text-right text-[12px] tabular-nums">{prospect.budget}</span>
            </Row>
          ))}
        </Window>
      </div>
    </div>
  );
}

const SHOWINGS = [
  { time: "9:00", who: "Clara Vidal", unit: "EC-204", type: "In-person", status: "Completed", agent: "Aisha Bennett", outcome: "Will apply" },
  { time: "11:30", who: "Kofi Asante", unit: "FL-2B", type: "In-person", status: "Confirmed", agent: "Aisha Bennett" },
  { time: "14:00", who: "Maya Chen", unit: "HV-09", type: "Virtual", status: "Scheduled", agent: "Marcus Whitfield" },
  { time: "16:30", who: "Priya Nair", unit: "FL-3C", type: "Self-guided", status: "Scheduled" },
];

const TYPE_ICON = { "In-person": MapPin, Virtual: Video, "Self-guided": DoorClosed };

// Cell: today's showings, one just finished with its outcome logged.
export function ShowingsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <ViewTabs tabs={["Upcoming", "Today", "Needs outcome", "Self-guided"]} active={1} />
      </div>
      {SHOWINGS.map((showing, index) => {
        const Icon = TYPE_ICON[showing.type];
        return (
          <div key={showing.time} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
            <span className="w-10 shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{showing.time}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-foreground/90">
                {showing.unit} · {showing.who}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="size-3" /> {showing.type}
                {showing.agent ? <span>· {showing.agent}</span> : <span>· No agent</span>}
              </div>
            </div>
            {showing.outcome ? (
              <span className={cn("inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": `${0.5 + index * 0.1}s` }}>
                {showing.outcome}
              </span>
            ) : null}
            <StatusPill area="showing" status={showing.status} />
          </div>
        );
      })}
    </div>
  );
}

// Cell: Samuel Okoro's application for EC-204, income checked against the 3× criteria.
export function ApplicationRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-3 border-b px-4 py-3", LINE)}>
        <Avatar name="Samuel Okoro" size={30} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium">Samuel Okoro</div>
          <div className="text-[11px] text-muted-foreground">Elmwood Court · EC-204 · Applied Oct 24</div>
        </div>
        <StatusPill area="application" status="Screening" />
      </div>
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Income ÷ rent</span>
          <span className="inline-flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Criteria 3×</span>
            <Pill tone="emerald" dot={false} className="tabular-nums">
              3.4×
            </Pill>
          </span>
        </div>
        <div className="relative mt-2.5 h-1.5 rounded-full bg-foreground/[0.08]">
          <span className={cn("absolute inset-y-0 left-0 w-[85%] origin-left rounded-full bg-emerald-500", styles.fill)} />
          <span className="absolute -top-1 left-[75%] h-3.5 w-px bg-foreground/60" />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground tabular-nums">
          <span>$6,375 / month gross</span>
          <span>Rent $1,875</span>
        </div>
      </div>
      {[
        ["Household", "2 occupants · 1 cat"],
        ["Rental history", "Verified with landlord"],
        ["References", "2 of 2 verified"],
        ["Application fee", "Settled"],
      ].map(([label, value], index) => (
        <div key={label} className={cn("flex items-center justify-between border-b px-4 py-2 last:border-b-0", LINE)}>
          <span className="text-muted-foreground">{label}</span>
          <span className={cn("inline-flex items-center gap-1.5", index > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-foreground/90")}>
            {index > 0 ? <Check className="size-3" strokeWidth={2.5} /> : null}
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

const STAGES = ["New", "Contacted", "Showing scheduled", "Toured", "Applied", "Converted"];

const HISTORY = [
  { stage: "Applied", when: "Oct 24", who: "Aisha Bennett", note: "Application for EC-204" },
  { stage: "Toured", when: "Oct 21", who: "Aisha Bennett", note: "Will apply" },
  { stage: "Showing scheduled", when: "Oct 18", who: "Aisha Bennett" },
  { stage: "Contacted", when: "Oct 17", who: "Marcus Whitfield" },
];

// Cell: a prospect's stage bar and the history of every move.
export function PipelineRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.09] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <Avatar name="Samuel Okoro" size={20} />
        <span className="text-[13px] font-medium">Samuel Okoro</span>
        <span className="ml-auto text-muted-foreground">In this stage 3 days</span>
      </div>
      <div className="mt-3 flex gap-1">
        {STAGES.map((stage, index) => (
          <div key={stage} className="min-w-0 flex-1">
            <span className={cn("block h-1.5 rounded-full", index < 4 ? "bg-foreground/45" : index === 4 ? "bg-amber-500" : "bg-foreground/[0.08]")} />
            <span className={cn("mt-1.5 block text-[10px] leading-tight", index === 4 ? "font-medium text-foreground" : "text-muted-foreground")}>{stage}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <History className="size-3" /> Stage history
      </div>
      <div className="relative mt-2 flex flex-col gap-2.5">
        <span className="absolute top-2 bottom-2 left-[3px] border-l border-dashed border-foreground/20" />
        {HISTORY.map((entry, index) => (
          <div key={entry.stage} className={cn("relative flex items-center gap-2.5 pl-4", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <span className={cn("absolute left-0 size-[7px] rounded-full", index === 0 ? "bg-amber-500" : "bg-foreground/40")} />
            <span className="w-[112px] shrink-0 truncate text-foreground/90">{entry.stage}</span>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {entry.who}
              {entry.note ? ` · ${entry.note}` : ""}
            </span>
            <span className="shrink-0 text-muted-foreground tabular-nums">{entry.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cell: recording the decision, with conditions attached.
export function DecisionRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[330px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        <div className="text-[14px] font-semibold">Record decision</div>
        <div className="mt-3 flex flex-col gap-1">
          {["Approve", "Approve with conditions", "Deny"].map((option, index) => (
            <span key={option} className={cn("flex items-center gap-2.5 rounded-md border px-2.5 py-1.5", index === 1 ? "border-foreground/30 bg-foreground/[0.05] text-foreground" : "border-transparent text-muted-foreground")}>
              <span className={cn("flex size-3.5 items-center justify-center rounded-full border", index === 1 ? "border-foreground" : "border-foreground/30")}>
                {index === 1 ? <span className="size-1.5 rounded-full bg-foreground" /> : null}
              </span>
              {option}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Field label="Additional deposit">$500</Field>
          <Field label="Rent adjustment">None</Field>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-foreground/85">Cosigner / guarantor required</span>
          <span className="flex h-5 w-9 items-center rounded-full bg-foreground/15 p-0.5">
            <span className="size-4 rounded-full bg-background" />
          </span>
        </div>
      </div>
      <div className={cn("absolute top-[150px] left-[226px] w-[230px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] shadow-lg shadow-black/10 dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
        <div className="text-[11px] text-muted-foreground">Application · EC-204</div>
        <div className="mt-1.5 flex items-center gap-2">
          <Avatar name="Samuel Okoro" size={20} />
          <span className="font-medium">Samuel Okoro</span>
        </div>
        <StatusPill area="application" status="Conditionally approved" className="mt-2.5" />
        <div className="mt-2.5 flex items-center gap-1.5 text-muted-foreground">
          <FileSignature className="size-3.5" /> Next: create the lease
        </div>
      </div>
    </div>
  );
}

const LEASE_NAV = [
  { group: null, items: [{ label: "Overview", icon: LayoutDashboard }] },
  { group: "General", items: [{ label: "Terms", icon: FileSignature }, { label: "Unit & Premises", icon: Home }] },
  { group: "Money", items: [{ label: "Ledger", icon: BookOpen }, { label: "Online Payments", icon: CreditCard }, { label: "Rent & Escalations", icon: Wallet }, { label: "Deposits", icon: PiggyBank }] },
  { group: "People", items: [{ label: "People", icon: Users }, { label: "Pets", icon: PawPrint }] },
  { group: "Lifecycle", items: [{ label: "Move-in", icon: LogIn }, { label: "Renewal", icon: Repeat }, { label: "Notices & Violations", icon: ShieldAlert }, { label: "Move-out", icon: LogOut }] },
  { group: "Files & history", items: [{ label: "Documents", icon: FileText }, { label: "Notes", icon: StickyNote }, { label: "Activity", icon: Clock }] },
];

const READINESS = ["Link the unit", "Add the tenants", "Set the term dates", "Set the rent", "Record the deposit", "Pick a lease template", "Generate the lease document"];

const LEASE_STATUSES = ["Draft", "Pending", "Active", "Expiring soon", "Notice given", "Eviction", "Renewed", "Terminated", "Ended"];

// Section stage: Leah Mensah's lease open on its overview, the status menu dropped down beside it.
export function LeaseStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[680px] w-[770px]">
        <EditorHead
          back="Leases"
          title="The Foundry Lofts · FL-3B — Leah Mensah"
          area="lease"
          status="Active"
          meta="Leah Mensah · FL-3B · Sep 1, 2026 – Aug 31, 2027 · $2,150/mo"
          actions={<GhostButton icon={ChevronDown}>Actions</GhostButton>}
        />
        <div className="flex min-h-0 flex-1">
          <SectionNav groups={LEASE_NAV} active="Overview" />
          <div className="flex min-w-0 flex-1 flex-col gap-4 px-5 py-5">
            <div className="grid grid-cols-4 gap-2.5">
              {[
                ["Monthly rent", "$2,150", "Base rent"],
                ["Days remaining", "308", "Ends Aug 31, 2027"],
                ["Status", "Active", "In force"],
                ["Parties", "2", "1 tenant"],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-lg border border-foreground/[0.08] px-3 py-2.5">
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-[17px] font-semibold tracking-[-0.01em] tabular-nums">{value}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{hint}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.15fr_1fr] gap-3">
              <Card title="Readiness" aside="7 of 7">
                <div className="flex flex-col gap-2 px-4 py-3">
                  {READINESS.map((step, index) => (
                    <div key={step} className={cn("flex items-center gap-2.5", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.08}s` }}>
                      <Tick done />
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex flex-col gap-3">
                <Card title="Key dates">
                  {[
                    ["Signed", "Aug 18, 2026"],
                    ["Move-in", "Sep 1, 2026"],
                    ["Term start", "Sep 1, 2026"],
                    ["Term end", "Aug 31, 2027"],
                  ].map(([label, value]) => (
                    <div key={label} className={cn("flex items-center justify-between border-b px-4 py-2 text-[12px] last:border-b-0", LINE)}>
                      <span className="text-muted-foreground">{label}</span>
                      <span className="tabular-nums">{value}</span>
                    </div>
                  ))}
                </Card>
                <Card title="People on this lease">
                  {[
                    ["Leah Mensah", "Tenant"],
                    ["Tyler Brennan", "Co-signer"],
                  ].map(([name, role]) => (
                    <div key={name} className={cn("flex items-center gap-2.5 border-b px-4 py-2 text-[12px] last:border-b-0", LINE)}>
                      <Avatar name={name} size={18} />
                      <span className="flex-1 truncate">{name}</span>
                      <span className="text-muted-foreground">{role}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[76px] left-[744px] z-[2] w-[230px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.float)}>
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] text-muted-foreground">Status</div>
        {LEASE_STATUSES.map((status) => (
          <div key={status} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", status === "Active" ? "bg-foreground/[0.07]" : "")}>
            <StatusPill area="lease" status={status} />
            {status === "Active" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const RENEWAL_STEPS = ["Not started", "Offer sent", "Negotiating", "Accepted"];

// Cell: a renewal offer on an expiring lease, the proposed rent against today's.
export function RenewalRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <Repeat className="size-4 text-muted-foreground" />
          <span className="text-[13px] font-medium">Harbour View · HV-12 — Zara Patel</span>
          <StatusPill area="renewal" status="Offer sent" className="ml-auto" />
        </div>
        <div className="grid grid-cols-3 divide-x divide-foreground/[0.07]">
          {[
            ["Current rent", "$2,240"],
            ["Proposed", "$2,310"],
            ["Change", "+3.1%"],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-3">
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="mt-0.5 text-[17px] font-semibold tabular-nums">{value}</div>
            </div>
          ))}
        </div>
        <div className={cn("flex items-center gap-2 border-t px-4 py-2.5 text-muted-foreground", LINE)}>
          <Calendar className="size-3.5" /> 12 months from Dec 21, 2026 · lease ends in 54 days
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {RENEWAL_STEPS.map((step, index) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className={cn("rounded-full border px-2.5 py-1 text-[11px]", index === 1 ? "border-foreground/30 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>{step}</span>
            {index < RENEWAL_STEPS.length - 1 ? <span className="h-px w-3 bg-foreground/20" /> : null}
          </span>
        ))}
      </div>
      <div className={cn("mt-3 flex items-center gap-2 rounded-lg border border-dashed border-foreground/15 px-3 py-2 text-muted-foreground", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <FileSignature className="size-3.5" /> Accepting the offer creates the renewed lease
      </div>
    </div>
  );
}

const NOTICES = [
  { type: "Notice to vacate", lease: "EC-101 · Theo Lindqvist", how: "Received from tenant", status: "Received", date: "Oct 24" },
  { type: "Entry notice", lease: "FL-2A · Kofi Asante", how: "Portal", status: "Served", date: "Oct 26" },
  { type: "Late rent", lease: "HV-03 · Noah Fischer", how: "Hand delivered", status: "Served", date: "Cure by Oct 25", overdue: true },
  { type: "Lease violation", lease: "EC-118 · Ravi Menon", how: "Certified mail", status: "Cured", date: "Oct 12" },
];

// Cell: notices served and received, one past its cure-by date.
export function NoticesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <ShieldAlert className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Notices &amp; Violations</span>
        <span className="ml-auto text-muted-foreground">1 past cure-by</span>
      </div>
      {NOTICES.map((notice) => (
        <div key={notice.type} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, notice.overdue && "bg-red-500/[0.04]")}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-foreground/90">{notice.type}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {notice.lease} · {notice.how}
            </div>
          </div>
          <span className={cn("shrink-0 text-[11px] tabular-nums", notice.overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{notice.date}</span>
          <StatusPill area="notice" status={notice.status} />
        </div>
      ))}
    </div>
  );
}

const CONDITION_TONE = {
  New: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Good: "border-foreground/[0.16] bg-foreground/[0.06] text-foreground",
  Fair: "border-foreground/[0.1] bg-foreground/[0.03] text-foreground/70",
  Poor: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};
const SCORE = { New: 5, Good: 4, Fair: 3, Poor: 2 };

const ROOMS = [
  {
    name: "Kitchen",
    items: [
      ["Refrigerator", "Good", 2],
      ["Stove / oven", "New", 1],
      ["Dishwasher", "Good", 1],
      ["Countertops", "Fair", 2, "Hairline scratch by the sink"],
      ["Cabinets", "Good", 0],
    ],
  },
  {
    name: "Bathroom",
    items: [
      ["Tub / shower", "Good", 1],
      ["Sink & vanity", "Poor", 2, "Chipped enamel, front left"],
      ["Exhaust fan", "", 0],
    ],
  },
];

function ConditionSelect({ value }) {
  if (!value) {
    return (
      <span className="inline-flex h-6 w-[92px] items-center justify-between rounded-md border border-dashed border-foreground/25 px-2 text-[11px] text-muted-foreground">
        Rate <ChevronDown className="size-3" />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex h-6 w-[92px] items-center justify-between rounded-md border px-2 text-[11px]", CONDITION_TONE[value])}>
      {SCORE[value]} · {value} <ChevronDown className="size-3 opacity-60" />
    </span>
  );
}

const MOVE_IN = [
  ["Lease signed by all parties", true],
  ["Security deposit received", true],
  ["First month's rent received", true],
  ["Renters insurance proof on file", true],
  ["Utilities transferred to tenant", true],
  ["Move-in inspection completed", false],
  ["Keys and access codes handed over", false],
  ["Portal invitation sent", true, true],
];

// Section stage: the FL-5C move-in inspection being rated room by room, the move-in checklist floating over it.
export function MoveInStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[680px] w-[720px]">
        <EditorHead back="Inspections" title="FL-5C — Move-in" area="inspection" status="In progress" meta="The Foundry Lofts · FL-5C · Ines Duarte · Inspector Aisha Bennett · Nov 1, 2026" />
        <div className="flex min-h-0 flex-1">
          <SectionNav
            groups={[
              { group: null, items: [{ label: "Overview", icon: LayoutDashboard }, { label: "Links", icon: Link2 }] },
              { group: "Report", items: [{ label: "Rooms & Items", icon: DoorClosed }, { label: "Summary Notes", icon: StickyNote }] },
              { group: "Files & history", items: [{ label: "Documents", icon: FileText }, { label: "Activity", icon: Clock }] },
            ]}
            active="Rooms & Items"
            className="w-[168px]"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <ClipboardCheck className="size-3.5" /> 31 of 36 items rated across 5 rooms · 14 photos
            </div>
            {ROOMS.map((room) => (
              <Card key={room.name} title={room.name} aside={`${room.items.filter((item) => item[1]).length}/${room.items.length} rated`}>
                {room.items.map(([item, condition, photos, note]) => (
                  <div key={item} className={cn("border-b px-4 py-2 last:border-b-0", LINE)}>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="min-w-0 flex-1 truncate text-foreground/90">{item}</span>
                      <ConditionSelect value={condition} />
                      <span className="flex w-[68px] justify-end gap-1">
                        {Array.from({ length: photos }, (_, index) => (
                          <span key={index} className="relative h-5 w-7 overflow-hidden rounded-[3px] border border-foreground/[0.08]">
                            {index % 2 ? <Kitchen className="absolute inset-0 h-full w-full" /> : <Interior className="absolute inset-0 h-full w-full" />}
                          </span>
                        ))}
                        {photos ? null : <Camera className="size-3.5 text-muted-foreground/60" />}
                      </span>
                    </div>
                    {note ? <div className="mt-1 text-[11px] text-muted-foreground">{note}</div> : null}
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[60px] left-[660px] z-[2] w-[320px]", styles.float)}>
        <Window className="shadow-2xl shadow-black/30">
          <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
            <LogIn className="size-4 text-muted-foreground" />
            <span className="font-medium">Move-in</span>
            <span className="text-muted-foreground">Ines Duarte</span>
            <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">6 of 8</span>
          </div>
          <div className="px-4 pt-3">
            <div className="h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("block h-full w-[75%] origin-left rounded-full bg-foreground/60", styles.fill)} />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 px-4 py-3.5 text-[12px]">
            {MOVE_IN.map(([label, done, late]) => (
              <div key={label} className={cn("flex items-center gap-2.5", late && styles.popIn)} style={late ? { "--pop-delay": "1.1s" } : undefined}>
                <Tick done={done} />
                <span className={done ? "text-muted-foreground" : "text-foreground"}>{label}</span>
              </div>
            ))}
          </div>
          <div className={cn("grid grid-cols-2 gap-2.5 border-t px-4 py-3", LINE)}>
            <Field label="Move-in date">Nov 1, 2026</Field>
            <Field label="Keys issued">2</Field>
          </div>
        </Window>
      </div>
    </div>
  );
}

const DEPOSITS = [
  { name: "FL-5C — Security deposit", amount: 2390, status: "Held", note: "Received Oct 20 · Bank (ACH)" },
  { name: "FL-5C — Pet deposit", amount: 300, status: "Held", note: "Received Oct 20 · Card" },
  { name: "EC-101 — Security deposit", amount: 1650, status: "Awaiting disposition", note: "Return by Dec 30, 2026" },
];

const DEPOSIT_STATES = ["Pending", "Held", "Awaiting disposition", "Partially returned", "Returned", "Forfeited"];

// Cell: deposits held against leases, and the states a deposit moves through.
export function DepositRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <PiggyBank className="size-4 text-muted-foreground" />
          <span className="text-[13px] font-medium">Security Deposits</span>
          <span className="ml-auto text-muted-foreground tabular-nums">$248,310 held</span>
        </div>
        {DEPOSITS.map((deposit, index) => (
          <div key={deposit.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-foreground/90">{deposit.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{deposit.note}</div>
            </div>
            <StatusPill area="deposit" status={deposit.status} />
            <span className="w-[54px] text-right font-medium tabular-nums">{usd(deposit.amount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {DEPOSIT_STATES.map((state) => (
          <span key={state} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">
            <Dot tone={state === "Returned" ? "emerald" : state.includes("disposition") || state.includes("Partially") ? "amber" : state === "Held" ? "strong" : "neutral"} />
            {state}
          </span>
        ))}
      </div>
    </div>
  );
}

const BREAKDOWN = [
  { label: "5 · New", count: 9, bar: "bg-emerald-500" },
  { label: "4 · Good", count: 18, bar: "bg-foreground/50" },
  { label: "3 · Fair", count: 3, bar: "bg-foreground/30" },
  { label: "2 · Poor", count: 1, bar: "bg-amber-500" },
  { label: "1 · Damaged", count: 0, bar: "bg-red-500" },
];

// Cell: the inspection's condition breakdown, New to Damaged.
export function ConditionRender() {
  return (
    <div className="mx-auto w-[440px] text-[12px]">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Rooms", "5", "36 items"],
          ["Rated", "86%", "31 of 36"],
          ["Poor / damaged", "1", "Needs attention"],
        ].map(([label, value, hint]) => (
          <div key={label} className="rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2.5 dark:bg-surface-subtle">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[18px] font-semibold tabular-nums">{value}</div>
            <div className="text-[11px] text-muted-foreground">{hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3.5 dark:bg-surface-subtle">
        <MonoLabel>Condition breakdown</MonoLabel>
        <div className="mt-3 flex flex-col gap-2.5">
          {BREAKDOWN.map((row, index) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-[86px] shrink-0 text-foreground/85">{row.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                <span className={cn("block h-full origin-left rounded-full", row.bar, styles.fill)} style={{ width: `${(row.count / 18) * 100}%`, "--fill-delay": `${0.3 + index * 0.1}s` }} />
              </span>
              <span className="w-5 text-right text-muted-foreground tabular-nums">{row.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
