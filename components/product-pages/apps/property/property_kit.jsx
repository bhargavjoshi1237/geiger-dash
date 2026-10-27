import {
  ArrowLeft,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  FileSignature,
  Files,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  Search,
  Settings,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Dot, LINE, Window } from "@/components/product-pages/mock_kit";

// Shared pieces for the Geiger Property tour: the workspace shell, status pills in the app's own vocabulary, and drawn photos.

// The app's sidebar, trimmed to the groups the tour visits; titles match Property's own nav.
const NAV = [
  { title: "Overview", icon: LayoutDashboard },
  { title: "Property", icon: Building2, items: ["Properties", "Units", "Buildings", "Portfolios"] },
  { title: "Marketing & Leads", icon: Megaphone, items: ["Listings", "Prospects", "Showings", "Applications", "Waitlist"] },
  { title: "Leasing", icon: FileSignature, items: ["Leases", "Renewals", "Move-ins & Move-outs", "Inspections", "Security Deposits", "Notices & Violations"] },
  { title: "People", icon: Users, items: ["Tenants", "Owners", "Vendors"] },
  { title: "Maintenance", icon: Wrench, items: ["Work Orders", "Preventive & Recurring", "Unit Turns", "Inventory & Parts"] },
  {
    title: "Accounting",
    icon: Wallet,
    items: ["Rent Collection", "Online Payments", "Transactions", "Bills & Payables", "Chart of Accounts", "Budgets", "Bank Accounts", "General Ledger", "Bank Reconciliation"],
  },
  { title: "Communications", icon: MessagesSquare },
  { title: "Documents", icon: Files },
  { title: "Reports", icon: BarChart3, items: ["Rent Roll", "Delinquency", "Owner Statements", "Trial Balance", "1099 Summary"] },
  { title: "Settings", icon: Settings },
];

function Sidebar({ open, active }) {
  return (
    <div className={cn("flex w-[214px] shrink-0 flex-col border-r px-3 py-3.5", LINE)}>
      <div className="flex items-center gap-2 px-2 py-1">
        <AppMark id="property" size={22} />
        <span className="truncate font-medium">Elmwood Residences</span>
        <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
      </div>
      <div className="mt-2.5 flex items-center gap-2 rounded-md border border-foreground/[0.08] px-2.5 py-1.5 text-[12px] text-muted-foreground">
        <Search className="size-3.5" /> Search
        <span className="ml-auto font-mono text-[10px]">⌘K</span>
      </div>
      <div className="mt-3 flex flex-col gap-px">
        {NAV.map(({ title, icon: Icon, items }) => {
          const expanded = title === open;
          return (
            <div key={title}>
              <div className={cn("flex items-center gap-2.5 rounded-md px-2 py-[5px]", expanded ? "text-foreground" : "text-foreground/70")}>
                <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <span className="truncate">{title}</span>
                {items ? <ChevronDown className={cn("ml-auto size-3 text-muted-foreground", !expanded && "-rotate-90")} /> : null}
              </div>
              {expanded && items ? (
                <div className={cn("my-0.5 ml-[17px] flex flex-col gap-px border-l pl-2", LINE)}>
                  {items.map((item) => (
                    <span key={item} className={cn("truncate rounded-md px-2 py-[4px] text-[12px]", item === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// The workspace: Property's sidebar with one group open, and a screen beside it.
export function AppShell({ open, active, className, children }) {
  return (
    <Window className={className}>
      <div className="flex h-full min-h-0">
        <Sidebar open={open} active={active} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </Window>
  );
}

export function PrimaryButton({ icon: Icon, children, className }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium whitespace-nowrap text-background", className)}>
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

export function GhostButton({ icon: Icon, children, className }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-3 text-[12px] whitespace-nowrap text-foreground/80", className)}>
      {Icon ? <Icon className="size-3.5 text-muted-foreground" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

// ScreenHeader: title and description over a hairline, the primary action on the right.
export function ScreenHead({ title, description, actions, className }) {
  return (
    <div className={cn("flex items-start gap-6 border-b px-6 pt-5 pb-4", LINE, className)}>
      <div className="min-w-0 flex-1">
        <div className="text-[20px] leading-tight font-semibold tracking-[-0.02em]">{title}</div>
        {description ? <p className="mt-1 max-w-[34rem] text-[12px] leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

// StatsBar: one card, divider-separated tiles.
export function StatStrip({ stats, className }) {
  return (
    <div className={cn("grid divide-x overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] [&>*]:border-foreground/[0.07]", className)} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 px-4 py-3">
          <div className="truncate text-[11px] text-muted-foreground">{stat.label}</div>
          <div className={cn("mt-1 text-[19px] leading-tight font-semibold tracking-[-0.02em] tabular-nums", stat.className)}>{stat.value}</div>
          {stat.footer ? <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{stat.footer}</div> : null}
        </div>
      ))}
    </div>
  );
}

// The view switcher above a list (All, In force, Drafts…).
export function ViewTabs({ tabs, active = 0, className }) {
  return (
    <div className={cn("flex items-center gap-1 text-[12px]", className)}>
      {tabs.map((tab, index) => (
        <span key={tab} className={cn("rounded-md px-2.5 py-1 whitespace-nowrap", index === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
          {tab}
        </span>
      ))}
    </div>
  );
}

export function SearchBox({ children, className }) {
  return (
    <span className={cn("flex h-8 items-center gap-2 rounded-md border border-foreground/[0.1] bg-foreground/[0.02] px-2.5 text-[12px] text-muted-foreground", className)}>
      <Search className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}

export function FilterChip({ children, className }) {
  return (
    <span className={cn("inline-flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] whitespace-nowrap text-foreground/80", className)}>
      {children}
      <ChevronDown className="size-3 text-muted-foreground" />
    </span>
  );
}

const PILL_TONES = {
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  red: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  strong: "border-foreground/[0.16] bg-foreground/[0.07] text-foreground",
  neutral: "border-foreground/[0.1] bg-foreground/[0.03] text-foreground/70",
};

// StatusPill's shape: a tinted badge with an optional dot.
export function Pill({ tone = "neutral", dot = true, className, children }) {
  return (
    <span className={cn("inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium whitespace-nowrap", PILL_TONES[tone], className)}>
      {dot ? <Dot tone={tone} /> : null}
      {children}
    </span>
  );
}

// Each area's status set, coloured by meaning: emerald done, amber in motion or at risk, red failed or overdue.
const TONES = {
  lease: { Draft: "neutral", Pending: "strong", Active: "emerald", "Expiring soon": "amber", "Notice given": "amber", Eviction: "red", Renewed: "neutral", Terminated: "neutral", Ended: "neutral" },
  listing: { Draft: "neutral", Active: "emerald", Paused: "amber", Leased: "neutral", Archived: "neutral" },
  prospect: { New: "strong", Contacted: "neutral", "Showing scheduled": "amber", Toured: "amber", Applied: "amber", Converted: "emerald", Lost: "neutral" },
  showing: { Scheduled: "neutral", Confirmed: "strong", Completed: "emerald", "No-show": "amber", Cancelled: "neutral" },
  application: { Submitted: "strong", Screening: "amber", Approved: "emerald", "Conditionally approved": "amber", Denied: "red", Withdrawn: "neutral", "Lease created": "emerald" },
  renewal: { "Not started": "neutral", "Offer sent": "strong", Negotiating: "amber", Accepted: "emerald", Declined: "red", "Moving out": "amber" },
  notice: { Draft: "neutral", Served: "strong", Received: "strong", Cured: "emerald", Escalated: "red", Closed: "neutral" },
  deposit: { Pending: "neutral", Held: "strong", "Awaiting disposition": "amber", "Partially returned": "amber", Returned: "emerald", Forfeited: "neutral" },
  inspection: { Scheduled: "neutral", "In progress": "amber", Complete: "emerald", Failed: "red" },
  work: { Open: "strong", Scheduled: "neutral", "In progress": "amber", "On hold": "amber", Completed: "emerald", Cancelled: "neutral", Submitted: "strong", "In review": "amber" },
  tenant: { Applicant: "neutral", Future: "strong", Current: "emerald", Late: "red", "On notice": "amber", Past: "neutral" },
  vendor: { Active: "emerald", Onboarding: "neutral", Preferred: "strong", Inactive: "neutral", "Do not use": "red" },
  owner: { Active: "emerald", Onboarding: "neutral", Inactive: "neutral" },
  compliance: { Compliant: "emerald", "Expiring soon": "amber", Expired: "red", Missing: "red" },
  portal: { "Not invited": "neutral", Invited: "strong", Active: "emerald" },
  payment: { "Link sent": "strong", Pending: "neutral", Processing: "amber", Paid: "emerald", "Partly refunded": "neutral", Refunded: "neutral", Failed: "red", Returned: "red" },
  bill: { Draft: "neutral", Open: "strong", "Partially paid": "amber", Paid: "emerald", Void: "neutral", "Pending approval": "amber" },
  entry: { Posted: "emerald", Void: "neutral", Reversal: "amber" },
  unit: { Occupied: "emerald", Vacant: "neutral", Notice: "amber", "Make-ready": "strong" },
  event: { Processed: "emerald", Received: "strong", Failed: "red", Ignored: "neutral" },
};

// A status in its area's colour, e.g. <StatusPill area="lease" status="Expiring soon" />.
export function StatusPill({ area, status, className }) {
  return (
    <Pill tone={TONES[area]?.[status] ?? "neutral"} className={className}>
      {status}
    </Pill>
  );
}

// A list's column header row; `cols` is a grid-template-columns string shared with its rows, `right` the right-aligned columns.
export function HeadRow({ cols, labels, right = [], className }) {
  return (
    <div className={cn("grid items-center gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE, className)} style={{ gridTemplateColumns: cols }}>
      {labels.map((label, index) => (
        <span key={`${label}-${index}`} className={cn("truncate", right.includes(index) && "text-right")}>
          {label}
        </span>
      ))}
    </div>
  );
}

export function Row({ cols, className, style, children }) {
  return (
    <div className={cn("grid items-center gap-3 border-b px-5 py-2.5", LINE, className)} style={{ gridTemplateColumns: cols, ...style }}>
      {children}
    </div>
  );
}

// Two-line cell: a strong first line and a muted second.
export function Cell2({ top, bottom, className }) {
  return (
    <span className={cn("flex min-w-0 flex-col", className)}>
      <span className="truncate font-medium text-foreground/90">{top}</span>
      {bottom ? <span className="truncate text-[11px] text-muted-foreground">{bottom}</span> : null}
    </span>
  );
}

// EditorHeader: a back link, the record's title and status, and its meta line.
export function EditorHead({ back, title, area, status, meta, actions, className }) {
  return (
    <div className={cn("border-b px-6 pt-4 pb-4", LINE, className)}>
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <ArrowLeft className="size-3.5" /> {back}
      </div>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="truncate text-[19px] leading-tight font-semibold tracking-[-0.02em]">{title}</span>
            {status ? <StatusPill area={area} status={status} /> : null}
          </div>
          {meta ? <div className="mt-1 truncate text-[12px] text-muted-foreground">{meta}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

// The editor's grouped section nav (Overview, then General, Money, Lifecycle…).
export function SectionNav({ groups, active, className }) {
  return (
    <div className={cn("flex w-[188px] shrink-0 flex-col gap-3 border-r px-3 py-4 text-[12px]", LINE, className)}>
      {groups.map((group) => (
        <div key={group.group ?? "top"}>
          {group.group ? <div className="mb-1 px-2 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">{group.group}</div> : null}
          {group.items.map(({ label, icon: Icon }) => (
            <div key={label} className={cn("flex items-center gap-2 rounded-md px-2 py-[5px]", label === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
              {Icon ? <Icon className="size-3.5 shrink-0" strokeWidth={1.75} /> : null}
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// SectionCard: a titled, bordered block inside an editor.
export function Card({ title, aside, className, bodyClassName, children }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]", className)}>
      {title ? (
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <span className="text-[13px] font-medium">{title}</span>
          {aside ? <span className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">{aside}</span> : null}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

// A read-only form field: label above, the value in a control-shaped box.
export function Field({ label, children, className, boxClassName }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1 text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("flex h-8 items-center gap-2 rounded-md border border-foreground/[0.1] bg-foreground/[0.02] px-2.5 text-[12px] text-foreground/90", boxClassName)}>{children}</div>
    </div>
  );
}

export function Tick({ done, className }) {
  return done ? (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-foreground text-background", className)}>
      <Check className="size-3" strokeWidth={3} />
    </span>
  ) : (
    <span className={cn("size-4 shrink-0 rounded-[4px] border border-foreground/25", className)} />
  );
}

export const usd = (value, cents = false) =>
  `${value < 0 ? "−" : ""}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })}`;

// A building's street front drawn in the palette's greys, with a few windows lit.
export function Facade({ className, lit = [2, 5, 9, 14] }) {
  const windows = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 5; col += 1) windows.push([92 + col * 30, 46 + row * 30, row * 5 + col]);
  }
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="320" height="200" fill="currentColor" fillOpacity="0.05" />
      <circle cx="262" cy="46" r="22" fill="currentColor" fillOpacity="0.1" />
      <rect x="78" y="30" width="164" height="150" fill="currentColor" fillOpacity="0.14" />
      <rect x="72" y="24" width="176" height="8" fill="currentColor" fillOpacity="0.22" />
      {windows.map(([x, y, index]) => (
        <rect key={index} x={x} y={y} width="18" height="20" rx="1.5" fill="currentColor" fillOpacity={lit.includes(index) ? 0.42 : 0.1} />
      ))}
      <rect x="146" y="150" width="28" height="30" rx="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="44" cy="146" r="26" fill="currentColor" fillOpacity="0.12" />
      <rect x="42" y="160" width="4" height="22" fill="currentColor" fillOpacity="0.18" />
      <rect y="180" width="320" height="20" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

// An empty living room with daylight falling across the floor.
export function Interior({ className }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="320" height="200" fill="currentColor" fillOpacity="0.06" />
      <path d="M0 138 L320 138 L320 200 L0 200 Z" fill="currentColor" fillOpacity="0.12" />
      <rect x="186" y="30" width="92" height="96" rx="2" fill="currentColor" fillOpacity="0.2" />
      <path d="M232 30 V126 M186 78 H278" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3" />
      <path d="M186 138 L278 138 L318 200 L150 200 Z" fill="currentColor" fillOpacity="0.1" />
      <rect x="34" y="104" width="104" height="34" rx="6" fill="currentColor" fillOpacity="0.2" />
      <rect x="40" y="88" width="92" height="22" rx="6" fill="currentColor" fillOpacity="0.15" />
      <circle cx="160" cy="98" r="12" fill="currentColor" fillOpacity="0.16" />
      <rect x="157" y="108" width="6" height="30" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

// A galley kitchen: wall cabinets, a counter and two pendants.
export function Kitchen({ className }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="320" height="200" fill="currentColor" fillOpacity="0.07" />
      {[0, 1, 2, 3].map((index) => (
        <rect key={index} x={30 + index * 66} y="30" width="58" height="44" rx="2" fill="currentColor" fillOpacity="0.14" />
      ))}
      <rect x="20" y="112" width="280" height="10" fill="currentColor" fillOpacity="0.28" />
      <rect x="20" y="122" width="280" height="58" fill="currentColor" fillOpacity="0.15" />
      {[0, 1, 2, 3].map((index) => (
        <rect key={index} x={30 + index * 70} y="132" width="60" height="40" rx="2" fill="currentColor" fillOpacity="0.08" />
      ))}
      <path d="M120 0 V86 M200 0 V86" stroke="currentColor" strokeOpacity="0.2" />
      <path d="M108 96 a12 10 0 0 1 24 0 Z M188 96 a12 10 0 0 1 24 0 Z" fill="currentColor" fillOpacity="0.32" />
      <rect y="180" width="320" height="20" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}
