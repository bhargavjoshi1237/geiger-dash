import {
  BadgeCheck,
  BookUser,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  MailCheck,
  MapPin,
  Activity,
  Palette,
  ScanLine,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  SquarePen,
  Ticket,
  UserCheck,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Dot, LINE } from "@/components/product-pages/mock_kit";

// Shared pieces for the Geiger Events tour pages: the Northside Design Week sample event, its cover, status dots and form bits.

export const EVENT = {
  name: "Northside Design Week 2026",
  short: "Northside Design Week",
  venue: "Harbour Hall",
  dates: "Thu 19 – Sat 21 Nov 2026",
};

// Statuses keep the app's labels; the dot carries the meaning (emerald done, amber pending, red needs action).
const STATUS_TONES = {
  "On Sale": "emerald",
  "Sold out": "strong",
  Scheduled: "amber",
  Draft: "neutral",
  Ended: "neutral",
  Paid: "emerald",
  "Partially refunded": "amber",
  Refunded: "neutral",
  Cancelled: "neutral",
  Disputed: "red",
  "Needs response": "amber",
  "Under review": "strong",
  Won: "emerald",
  Lost: "neutral",
  Confirmed: "emerald",
  Pending: "amber",
  Waitlisted: "neutral",
  "Checked-in": "strong",
  Declined: "red",
  Lead: "amber",
  Active: "emerald",
  Inactive: "neutral",
  VIP: "strong",
  Archived: "neutral",
  New: "neutral",
  "In progress": "amber",
  "In Progress": "amber",
  Complete: "emerald",
  Completed: "emerald",
  Rejected: "neutral",
  Published: "emerald",
  Live: "emerald",
  Open: "emerald",
  Closed: "neutral",
};

export function Status({ status, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap text-foreground/85", className)}>
      <Dot tone={STATUS_TONES[status] ?? "neutral"} />
      {status}
    </span>
  );
}

// The event's cover: a design-week grid of circles, squares and quarter-rounds in foreground tints.
export function DesignCover({ className, title = true }) {
  const shapes = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const kind = (row * 5 + col * 3) % 6;
      const x = 112 + col * 26;
      const y = 4 + row * 26;
      const opacity = 0.06 + ((row + col * 2) % 5) * 0.045;
      shapes.push({ key: `${row}-${col}`, kind, x, y, opacity });
    }
  }
  return (
    <div className={cn("relative overflow-hidden bg-foreground/[0.05]", className)}>
      <svg viewBox="0 0 340 134" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full text-foreground" aria-hidden="true">
        {shapes.map(({ key, kind, x, y, opacity }) => {
          if (kind === 0) return <circle key={key} cx={x + 11} cy={y + 11} r="11" fill="currentColor" fillOpacity={opacity} />;
          if (kind === 1) return <rect key={key} x={x} y={y} width="22" height="22" rx="2" fill="currentColor" fillOpacity={opacity} />;
          if (kind === 2) return <path key={key} d={`M${x} ${y + 22}V${y}a22 22 0 0 1 22 22z`} fill="currentColor" fillOpacity={opacity} />;
          if (kind === 3) return <circle key={key} cx={x + 11} cy={y + 11} r="9.5" fill="none" stroke="currentColor" strokeOpacity={opacity + 0.06} strokeWidth="2" />;
          if (kind === 4) return <path key={key} d={`M${x} ${y + 11}a11 11 0 0 1 22 0z`} fill="currentColor" fillOpacity={opacity} />;
          return <rect key={key} x={x + 5} y={y + 5} width="12" height="12" fill="currentColor" fillOpacity={opacity} transform={`rotate(45 ${x + 11} ${y + 11})`} />;
        })}
      </svg>
      <div className="absolute inset-0 bg-linear-to-r from-surface-card via-surface-card/70 to-transparent dark:from-surface-subtle dark:via-surface-subtle/70" />
      {title ? (
        <div className="absolute bottom-5 left-6">
          <div className="font-mono text-[11px] tracking-[0.12em] text-foreground/60 uppercase">{EVENT.venue} · Nov 19–21</div>
          <div className="mt-1 max-w-[15ch] text-[26px] leading-[1.05] font-semibold tracking-[-0.02em]">{EVENT.name}</div>
        </div>
      ) : null}
    </div>
  );
}

export function Toggle({ on = false, className }) {
  return (
    <span className={cn("flex h-[18px] w-8 shrink-0 items-center rounded-full p-0.5", on ? "bg-foreground" : "bg-foreground/15", className)}>
      <span className={cn("size-[14px] rounded-full bg-background", on && "ml-auto")} />
    </span>
  );
}

export function Checkbox({ on = false, className }) {
  return (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", on ? "border-foreground bg-foreground text-background" : "border-foreground/30", className)}>
      {on ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

export function Radio({ on = false }) {
  return (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full border", on ? "border-foreground" : "border-foreground/30")}>
      {on ? <span className="size-2 rounded-full bg-foreground" /> : null}
    </span>
  );
}

export function Field({ label, hint, className, children }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="text-[11px] leading-4 text-muted-foreground/80">{hint}</span> : null}
    </div>
  );
}

export function Input({ className, children }) {
  return <div className={cn("flex h-8 min-w-0 items-center gap-2 rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 text-[12px] text-foreground/90", className)}>{children}</div>;
}

export function Select({ className, children }) {
  return (
    <Input className={className}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
    </Input>
  );
}

export function Button({ icon: Icon, variant = "primary", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] font-medium whitespace-nowrap",
        variant === "primary" ? "bg-foreground text-background" : "border border-foreground/[0.12] text-foreground/80",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

// A two- or three-way switch, like the payment method picker at the door.
export function Segmented({ options, active, className }) {
  return (
    <span className={cn("inline-flex rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] p-0.5 text-[12px]", className)}>
      {options.map((option) => (
        <span key={option} className={cn("rounded-md px-2.5 py-1", option === active ? "bg-foreground/[0.1] font-medium text-foreground" : "text-muted-foreground")}>
          {option}
        </span>
      ))}
    </span>
  );
}

// A screen's title block, as the app's ScreenHeader draws it.
export function ScreenTitle({ title, description, actions, className }) {
  return (
    <div className={cn("flex items-start gap-6", className)}>
      <div className="min-w-0 flex-1">
        <div className="text-[19px] font-medium tracking-[-0.02em]">{title}</div>
        {description ? <p className="mt-1 max-w-[34rem] text-[12px] leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

// The divider-separated KPI card the app puts under a screen title.
export function StatStrip({ stats, className }) {
  return (
    <div className={cn("grid overflow-hidden rounded-lg border border-foreground/[0.08]", className)} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={cn("px-4 py-3", index > 0 && cn("border-l", LINE))}>
          <div className="text-[11px] text-muted-foreground">{stat.label}</div>
          <div className="mt-0.5 text-[18px] font-medium tracking-[-0.01em] tabular-nums">{stat.value}</div>
          {stat.footer ? <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{stat.footer}</div> : null}
        </div>
      ))}
    </div>
  );
}

const EDITOR_GROUPS = [
  { name: "General", icon: SquarePen },
  { name: "Operations", icon: ClipboardList },
  { name: "Design", icon: Palette },
  { name: "Page", icon: FileText },
  { name: "Location", icon: MapPin },
  { name: "Tickets", icon: Ticket },
  { name: "Sponsorship", icon: Handshake },
  { name: "Registration", icon: UserCheck },
  { name: "Check-in", icon: ScanLine },
  { name: "Communication", icon: MailCheck },
  { name: "Sharing", icon: Share2 },
  { name: "Team", icon: UserCog },
  { name: "Settings", icon: SlidersHorizontal },
];

// The event editor's left nav: thirteen groups, one of them open on its sections.
export function EditorNav({ open, items = [], active, className }) {
  return (
    <div className={cn("flex flex-col gap-px border-r px-2 py-3 text-[12.5px]", LINE, className)}>
      {EDITOR_GROUPS.map(({ name, icon: Icon }) => {
        const isOpen = name === open;
        return (
          <div key={name}>
            <div className={cn("flex h-7 items-center gap-2 rounded-md px-2", isOpen ? "text-foreground" : "text-foreground/70")}>
              <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="flex-1 truncate">{name}</span>
              {isOpen ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground/60" />}
            </div>
            {isOpen
              ? items.map((item) => (
                  <div key={item} className={cn("ml-[15px] flex h-[26px] items-center border-l pl-3 text-[12px]", item === active ? "border-foreground/60 font-medium text-foreground" : "border-foreground/[0.08] text-muted-foreground")}>
                    <span className={cn("-ml-1.5 truncate rounded px-1.5 py-0.5", item === active && "bg-foreground/[0.07]")}>{item}</span>
                  </div>
                ))
              : null}
          </div>
        );
      })}
    </div>
  );
}

const WORKSPACE_NAV = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Events", icon: CalendarDays },
  { name: "Registrations", icon: UserCheck },
  { name: "Guests", icon: BookUser, items: ["Contact Book", "Guest List", "Segments", "Tags", "Notes", "Data Requests"] },
  { name: "Tickets", icon: Ticket },
  { name: "Orders", icon: ShoppingBag },
  { name: "Memberships", icon: BadgeCheck },
  { name: "Check-in", icon: ScanLine },
];

// The workspace sidebar, trimmed to the areas these pages show, with one group open.
export function WorkspaceNav({ active, className }) {
  return (
    <div className={cn("flex flex-col border-r px-2 py-3 text-[12.5px]", LINE, className)}>
      <div className="mb-3 flex items-center gap-2 px-2">
        <AppMark id="events" size={22} />
        <span className="min-w-0">
          <span className="block truncate font-medium">Geiger Events</span>
          <span className="block truncate text-[11px] text-muted-foreground">Northside</span>
        </span>
      </div>
      {WORKSPACE_NAV.map(({ name, icon: Icon, items }) => (
        <div key={name}>
          <div className={cn("flex h-7 items-center gap-2 rounded-md px-2", items ? "text-foreground" : "text-foreground/70")}>
            <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span className="flex-1 truncate">{name}</span>
            {items ? <ChevronDown className="size-3 text-muted-foreground" /> : null}
          </div>
          {items
            ? items.map((item) => (
                <div key={item} className={cn("ml-[15px] flex h-[26px] items-center border-l pl-3 text-[12px]", item === active ? "border-foreground/60 font-medium text-foreground" : "border-foreground/[0.08] text-muted-foreground")}>
                  <span className={cn("-ml-1.5 truncate rounded px-1.5 py-0.5", item === active && "bg-foreground/[0.07]")}>{item}</span>
                </div>
              ))
            : null}
        </div>
      ))}
    </div>
  );
}

// The header every staff route shares: the event, who is signed in, the live count and Exit.
export function RouteHeader({ title = EVENT.name, subtitle, count, compact = false, className }) {
  return (
    <div className={cn("flex shrink-0 items-center gap-3 border-b", compact ? "px-3.5 py-2.5" : "px-6 py-3.5", LINE, className)}>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate font-semibold", compact ? "text-[12px]" : "text-[14px]")}>{title}</div>
        {subtitle ? <div className={cn("truncate text-muted-foreground", compact ? "text-[10px]" : "text-[12px]")}>{subtitle}</div> : null}
      </div>
      {count ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-700 tabular-nums dark:text-emerald-300",
            compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[12px]",
          )}
        >
          <Activity className={compact ? "size-3" : "size-3.5"} />
          {count} in
        </span>
      ) : null}
      {compact ? null : (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-3 text-[12px] text-muted-foreground">
          <LogOut className="size-3.5" /> Exit
        </span>
      )}
    </div>
  );
}

// A phone held up at the door, for the staff routes.
export function PhoneFrame({ className, children }) {
  return (
    <div className={cn("rounded-[30px] border border-foreground/[0.12] bg-surface-card p-2 shadow-2xl shadow-black/25 dark:bg-surface-subtle", className)}>
      <div className="flex h-full flex-col overflow-hidden rounded-[23px] border border-foreground/[0.06] bg-background/40 text-[12px]">{children}</div>
    </div>
  );
}

// A tablet in landscape, for the kiosk and the venue screens.
export function TabletFrame({ className, children }) {
  return (
    <div className={cn("rounded-[22px] border border-foreground/[0.12] bg-surface-card p-2 shadow-xl shadow-black/20 dark:bg-surface-subtle", className)}>
      <div className="h-full overflow-hidden rounded-[15px] border border-foreground/[0.06] bg-background/40">{children}</div>
    </div>
  );
}
