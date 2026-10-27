import {
  AlertTriangle,
  CalendarRange,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  DoorOpen,
  Image as ImageIcon,
  Kanban,
  LayoutGrid,
  LayoutList,
  Link2,
  MessageSquare,
  Minus,
  Monitor,
  Package,
  Plus,
  ScanLine,
  Search,
  Type,
  UserCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { Chip, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, Field, Input, PhoneFrame, Radio, RouteHeader, Segmented, Select, Status, TabletFrame, Toggle } from "@/components/product-pages/apps/events/events_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Events check-in renders for Northside Design Week 2026: the staff routes, the venue's screens and the day's work.

const FEEDBACK = {
  success: { icon: CheckCircle2, className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" },
  already: { icon: AlertTriangle, className: "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-200" },
  error: { icon: XCircle, className: "border-red-500/30 bg-red-500/15 text-red-800 dark:text-red-200" },
};

function ScanFeedback({ kind, delay = 0.8, compact = false, className, children }) {
  const { icon: Icon, className: tone } = FEEDBACK[kind];
  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl border font-medium", compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-[13px]", tone, styles.popIn, className)} style={{ "--pop-delay": `${delay}s` }}>
      <Icon className={cn("shrink-0", compact ? "size-4" : "size-5")} />
      {children}
    </div>
  );
}

// The camera view: a ticket's QR held up inside the scan frame, with the scan line sweeping it.
function Viewfinder({ width, height, frame, seed, className }) {
  const top = (height - frame) / 2;
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-2xl bg-neutral-950", className)} style={{ width, height }}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgb(255_255_255/0.12),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-[16px] bg-neutral-800 p-2 shadow-2xl shadow-black/60" style={{ width: frame * 0.7 }}>
        <div className="rounded-[10px] bg-white p-2 text-black">
          <QrGlyph seed={seed} className="block w-full" />
        </div>
        <div className="mt-1.5 text-center font-mono text-[8px] tracking-wider text-neutral-400">NSDW-8QF4TZ</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border-2 border-white/70 shadow-[0_0_0_9999px_rgb(0_0_0/0.35)]" style={{ width: frame, height: frame }} />
      </div>
      <span
        className={cn("absolute top-0 left-0 h-0.5 rounded-full bg-emerald-400", styles.travel)}
        style={{ width: frame - 28, offsetPath: `path("M ${width / 2} ${top + 14} V ${top + frame - 14}")`, offsetRotate: "0deg", "--travel-duration": "2.4s" }}
      />
    </div>
  );
}

function ResultRow({ name, email, code, admitted, delay, compact = false }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-foreground/[0.08] bg-foreground/[0.025]", compact ? "p-2.5" : "p-3.5", styles.popIn)} style={{ "--pop-delay": `${delay}s` }}>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{name}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {email} · <span className="font-mono">{code}</span>
        </div>
      </div>
      {admitted ? (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5" /> In
        </span>
      ) : (
        <Button icon={UserCheck} className="h-9">
          Admit
        </Button>
      )}
    </div>
  );
}

const RESULTS = [
  { name: "Maya Chen", email: "maya@brightloop.io", code: "NSDW-2M8KQA", admitted: true },
  { name: "Marcus Whitfield", email: "marcus@orbitalfreight.com", code: "NSDW-K7P2QX" },
  { name: "Amara Okafor", email: "amara@fieldnote.app", code: "NSDW-3HD9WM" },
  { name: "Tomas Marek", email: "tomas@cobaltretail.com", code: "NSDW-9VT4LE" },
];

// The hero's tilted plane: the /checkin route at Gate A, a ticket in the frame and a name search beside it.
export function ScannerWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <RouteHeader subtitle="Scanning as Gate A crew" count="612 / 1,164" />
      <div className="grid min-h-0 flex-1 grid-cols-[600px_minmax(0,1fr)] gap-8 px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Select className="h-10 text-[13px]">Gate A — Harbour Street</Select>
            <Select className="h-10 text-[13px]">Any zone</Select>
            <Select className="h-10 text-[13px]">Whole event</Select>
          </div>
          <Viewfinder width={600} height={470} frame={240} seed="nsdw-gate-a" />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ScanFeedback kind="success" delay={0.9}>
            Admitted Maya Chen
          </ScanFeedback>
          <div className="flex gap-2">
            <Input className="h-11 flex-1 border-foreground/25 text-[13px]">
              <Search className="size-4 text-muted-foreground" />
              <Typed text="Ma" delay={1.6} />
            </Input>
            <Button className="h-11 px-4 text-[13px]">Search</Button>
          </div>
          <div className="flex flex-col gap-2">
            {RESULTS.map((result, index) => (
              <ResultRow key={result.name} {...result} delay={2.1 + index * 0.12} />
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

const ABILITIES = [
  { title: "Scan & admit", body: "Open the scanner and check attendees in.", on: true },
  { title: "Sell at the door", body: "Take walk-in door sales (requires Door Sales enabled).", on: true },
  { title: "Override warnings", body: "Admit despite a duplicate or invalid-ticket warning.", on: false },
];

function ScopeChip({ on, children }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px]", on ? "border-foreground/35 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
      {on ? <Check className="size-3" strokeWidth={2.5} /> : null}
      {children}
    </span>
  );
}

function Card({ title, body, children, className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]", className)}>
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="text-[13px] font-medium">{title}</div>
        {body ? <div className="mt-0.5 text-[11px] text-muted-foreground">{body}</div> : null}
      </div>
      {children}
    </div>
  );
}

function RoleWindow({ className }) {
  return (
    <Window className={cn("w-[640px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <span className="text-muted-foreground">Staff Scanning Roles</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Gate B crew</span>
        <Chip className="ml-1 h-5 px-2 text-[11px]">Staff</Chip>
        <Button className="ml-auto">Save</Button>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <Card title="Abilities" body="What staff with this role can do on the check-in routes.">
          {ABILITIES.map((ability) => (
            <div key={ability.title} className={cn("flex items-center gap-4 border-b px-4 py-3 last:border-b-0", LINE)}>
              <div className="min-w-0 flex-1">
                <div className="text-foreground/90">{ability.title}</div>
                <div className="text-[11px] text-muted-foreground">{ability.body}</div>
              </div>
              <Toggle on={ability.on} />
            </div>
          ))}
        </Card>
        <Card title="Scope" body="Which gates and zones this role may work. None selected = all areas.">
          <div className="flex flex-col gap-3 px-4 py-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <MonoLabel className="mr-2 w-12">Gates</MonoLabel>
              <ScopeChip>Gate A — Harbour Street</ScopeChip>
              <ScopeChip on>Gate B — Quayside</ScopeChip>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <MonoLabel className="mr-2 w-12">Zones</MonoLabel>
              <ScopeChip>Expo floor</ScopeChip>
              <ScopeChip on>Workshop rooms</ScopeChip>
              <ScopeChip>Main Stage</ScopeChip>
            </div>
          </div>
        </Card>
        <Card title="Access code" body="Staff enter this PIN to open the check-in routes for their shift.">
          <div className="flex items-center gap-2 px-4 py-3.5">
            {["7", "7", "3", "0"].map((digit, index) => (
              <span key={index} className="flex size-11 items-center justify-center rounded-lg border border-foreground/[0.14] bg-background/50 font-mono text-[20px] font-medium">
                {digit}
              </span>
            ))}
            <Button variant="ghost" icon={Copy} className="ml-3">
              Copy
            </Button>
          </div>
        </Card>
      </div>
    </Window>
  );
}

function PhoneScanner({ className }) {
  return (
    <PhoneFrame className={cn("h-[600px] w-[300px]", className)}>
      <RouteHeader compact subtitle="Scanning as Gate B crew" count="348" />
      <div className="flex flex-col gap-2.5 p-3">
        <Select className="h-8 text-[11px]">Gate B — Quayside</Select>
        <div className="grid grid-cols-2 gap-2">
          <Select className="h-8 text-[11px]">Workshop rooms</Select>
          <Select className="h-8 text-[11px]">Type in motion</Select>
        </div>
        <Viewfinder width={258} height={250} frame={150} seed="nsdw-gate-b" className="rounded-xl" />
        <ScanFeedback kind="already" compact delay={1}>
          Kofi Asante is already checked in
        </ScanFeedback>
        <Input className="h-9 text-[11px] text-muted-foreground/70">
          <Search className="size-3.5" /> Search name, email, or ticket #
        </Input>
      </div>
    </PhoneFrame>
  );
}

// Section stage: a crew's role with its abilities, scope and access code, and that crew's phone at the workshop doors.
export function GateCrewStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <RoleWindow className="absolute top-0 left-0 opacity-90" />
      <div className={cn("absolute top-[24px] left-[660px] z-[2]", styles.float)}>
        <PhoneScanner />
      </div>
    </div>
  );
}

// Cell: the /door till selling two Friday passes for cash and checking the buyer in.
export function WalkInRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="mx-auto w-[420px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
        <RouteHeader compact subtitle="Selling as Gate A crew" />
        <div className="flex flex-col gap-2 p-3">
          {[
            { name: "Day pass — Friday", price: "$140", on: true },
            { name: "Full pass", price: "$320" },
          ].map((ticket) => (
            <div key={ticket.name} className={cn("flex h-9 items-center gap-3 rounded-lg border px-3", ticket.on ? "border-foreground/30 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
              <Radio on={ticket.on} />
              <span className="flex-1 text-foreground/90">{ticket.name}</span>
              <span className="tabular-nums text-muted-foreground">{ticket.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg border border-foreground/[0.08] px-3 py-2">
            <span className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.12] text-muted-foreground">
                <Minus className="size-3.5" />
              </span>
              <span className="w-4 text-center text-[14px] font-semibold tabular-nums">2</span>
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.12]">
                <Plus className="size-3.5" />
              </span>
            </span>
            <Segmented options={["Cash", "Card", "Comp"]} active="Cash" />
          </div>
        </div>
        <div className={cn("flex items-center gap-3 border-t px-3 py-2.5", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] text-muted-foreground">2× Day pass — Friday (cash)</div>
            <div className="text-[17px] font-bold tabular-nums">$280.00</div>
          </div>
          <Button icon={CheckCircle2} className="h-9">
            Sell &amp; check in
          </Button>
        </div>
      </div>
      <div className={cn("absolute top-[-6px] right-0 z-[2] rounded-xl bg-surface-card shadow-lg shadow-black/15 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "1.2s" }}>
        <ScanFeedback kind="success" compact delay={1.2}>
          Sold &amp; checked in
        </ScanFeedback>
      </div>
    </div>
  );
}

// Cell: the kiosk's welcome screen behind, its two ways in on the screen in front.
export function KioskRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <TabletFrame className="absolute top-0 left-0 h-[170px] w-[260px] opacity-80">
        <div className="flex h-full flex-col gap-1 bg-[radial-gradient(80%_70%_at_30%_10%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent_70%)] px-4 pt-3.5">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">{EVENT.name}</span>
          <span className="text-[11px] text-muted-foreground">Tap anywhere to begin</span>
        </div>
      </TabletFrame>
      <TabletFrame className={cn("absolute top-[70px] left-[110px] z-[2] h-[220px] w-[340px]", styles.popIn)}>
        <div className="flex h-full flex-col p-4">
          <div className="text-[14px] font-semibold">{EVENT.name}</div>
          <div className="text-[11px] text-muted-foreground">Choose how you&apos;d like to continue</div>
          <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5">
            {[
              { icon: ScanLine, label: "Check in", body: "Already have a ticket" },
              { icon: UserPlus, label: "Register", body: "Sign up on the spot" },
            ].map(({ icon: Icon, label, body }, index) => (
              <div key={label} className={cn("flex flex-col justify-end gap-1 rounded-xl border p-3", index === 0 ? "border-foreground/30 bg-foreground/[0.06]" : "border-foreground/[0.1]")}>
                <Icon className="mb-auto size-5 text-foreground/80" strokeWidth={1.75} />
                <span className="text-[13px] font-medium">{label}</span>
                <span className="text-[11px] text-muted-foreground">{body}</span>
              </div>
            ))}
          </div>
        </div>
      </TabletFrame>
    </div>
  );
}

const GATES = [
  { name: "Gate A — Harbour Street", on: true },
  { name: "Gate B — Quayside", on: true },
];

const ZONES = [
  { name: "Expo floor", on: true },
  { name: "Workshop rooms", on: true },
  { name: "Main Stage", on: true },
  { name: "Speaker lounge", on: false },
];

// Cell: the event's gates, zones and sessions, as the editor's Check-in group sets them up.
export function GatesZonesRender() {
  return (
    <div className="mx-auto w-[450px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="text-[13px] font-medium">Gates &amp; zones</div>
        <div className="text-[11px] text-muted-foreground">These apply to this event only.</div>
      </div>
      <div className="grid grid-cols-2">
        {[
          { label: "Gates", rows: GATES },
          { label: "Zones", rows: ZONES },
        ].map((column, columnIndex) => (
          <div key={column.label} className={cn("flex flex-col gap-2 px-4 py-3", columnIndex === 1 && cn("border-l", LINE))}>
            <MonoLabel>{column.label}</MonoLabel>
            {column.rows.map((row) => (
              <div key={row.name} className="flex items-center gap-2">
                <span className={cn("min-w-0 flex-1 truncate", row.on ? "text-foreground/90" : "text-muted-foreground")}>{row.name}</span>
                <Toggle on={row.on} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={cn("flex flex-wrap items-center gap-1.5 border-t px-4 py-3", LINE)}>
        <MonoLabel className="mr-1.5">Sessions</MonoLabel>
        {["Opening keynote", "Type in motion", "Portfolio clinic"].map((session, index) => (
          <span key={session} className={styles.popIn} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
            <Chip className="h-6 text-[11px]">{session}</Chip>
          </span>
        ))}
        <Chip dashed className="h-6 text-[11px] text-muted-foreground">
          <Plus className="size-3" /> Add
        </Chip>
      </div>
    </div>
  );
}

const ENTITLEMENTS = [
  { item: "Lanyard — Full pass", detail: "1 of 1 collected", done: true },
  { item: "Tote bag", detail: "0 of 1 collected" },
  { item: "Workshop kit — Type in motion", detail: "0 of 1 collected" },
];

// Cell: the /issue desk with a guest's lanyard handed over and two items still to collect.
export function IssueDeskRender() {
  return (
    <div className="mx-auto w-[420px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <RouteHeader compact subtitle="Issuing · Merch desk" />
      <div className="flex flex-col gap-2 p-3">
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.025] px-3.5 py-2.5">
          <div className="text-[14px] font-semibold">Leah Mensah</div>
          <div className="text-[11px] text-muted-foreground">
            leah@kestrelaero.com · <span className="font-mono">NSDW-8QF4TZ</span> · Full pass
          </div>
        </div>
        {ENTITLEMENTS.map((entitlement, index) => (
          <div key={entitlement.item} className={cn("flex items-center gap-3 rounded-xl border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
              <Package className="size-4 text-muted-foreground" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-foreground/90">{entitlement.item}</span>
              <span className="block text-[11px] text-muted-foreground">{entitlement.detail}</span>
            </span>
            {entitlement.done ? (
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Button className="h-8">Issue</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const NOW = [
  { title: "Type in motion", meta: "Studio 2 · Ravi Menon", time: "14:00 – 14:45", progress: 27 },
  { title: "Designing for slow cities", meta: "Main Stage · Zara Patel", time: "13:45 – 14:30", progress: 60 },
];

const NEXT = [
  { time: "14:30", title: "Portfolio clinic", room: "The Loft" },
  { time: "14:45", title: "Colour systems at scale", room: "Main Stage" },
  { time: "15:00", title: "Wayfinding for small towns", room: "Studio 2" },
  { time: "15:30", title: "Studio Night drinks", room: "Expo floor" },
];

// The lobby screen in the Midnight theme, on its Now & Next slide.
function NowNextScreen({ className }) {
  return (
    <div className={cn("rounded-xl bg-neutral-950 p-2 shadow-2xl shadow-black/40 ring-1 ring-foreground/10", className)}>
      <div className="flex h-full flex-col rounded-lg bg-[radial-gradient(90%_70%_at_20%_0%,rgb(255_255_255/0.08),transparent_70%)] px-9 py-7 text-neutral-100">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-neutral-400 uppercase">
          <span>
            {EVENT.short} · {EVENT.venue}
          </span>
          <span className="tabular-nums">Fri 20 Nov · 14:12</span>
        </div>
        <div className="mt-7 grid flex-1 grid-cols-[1.3fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-emerald-400 uppercase">
              <span className={cn("size-1.5 rounded-full bg-emerald-400 text-emerald-400", styles.pulse)} /> Happening now
            </div>
            <div className="mt-4 flex flex-col gap-6">
              {NOW.map((session, index) => (
                <div key={session.title}>
                  <div className={cn("leading-tight font-semibold tracking-[-0.02em]", index === 0 ? "text-[30px]" : "text-[21px] text-neutral-200")}>{session.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[13px] text-neutral-400">
                    <span>{session.meta}</span>
                    <span className="tabular-nums">{session.time}</span>
                  </div>
                  <span className="mt-2.5 block h-1 overflow-hidden rounded-full bg-white/10">
                    <span className={cn("block h-full origin-left rounded-full bg-emerald-400", styles.fill)} style={{ width: `${session.progress}%`, "--fill-delay": `${0.4 + index * 0.3}s` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l border-white/10 pl-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-neutral-400 uppercase">Up next</div>
            <div className="mt-4 flex flex-col">
              {NEXT.map((session) => (
                <div key={session.title} className="flex gap-4 border-b border-white/10 py-3 last:border-b-0">
                  <span className="w-11 text-[13px] text-neutral-400 tabular-nums">{session.time}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] text-neutral-100">{session.title}</span>
                    <span className="block text-[12px] text-neutral-500">{session.room}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <span key={dot} className={cn("h-1 rounded-full", dot === 1 ? "w-5 bg-neutral-200" : "w-1.5 bg-neutral-600")} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { icon: Type, label: "Title card", seconds: 8 },
  { icon: Clock, label: "Now & Next", seconds: 12, active: true },
  { icon: LayoutGrid, label: "Full day grid", seconds: 15 },
  { icon: DoorOpen, label: "Up next by room", seconds: 12 },
  { icon: MessageSquare, label: "Message", seconds: 8 },
  { icon: ImageIcon, label: "Image", seconds: 8 },
];

function BoardBuilderPanel({ className }) {
  return (
    <Window className={cn("w-[300px]", className)}>
      <div className={cn("border-b px-4 py-3", LINE)}>
        <div className="flex items-center gap-2">
          <Monitor className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Harbour Hall lobby</span>
          <Status status="Published" className="ml-auto" />
        </div>
        <div className="mt-0.5 pl-6 text-[11px] text-muted-foreground">{EVENT.short} · 6 slides</div>
      </div>
      <div className="flex flex-col gap-0.5 p-1.5">
        {SLIDES.map(({ icon: Icon, label, seconds, active }, index) => (
          <div key={label} className={cn("flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12px]", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <span className="w-3 font-mono text-[10px] text-muted-foreground">{index + 1}</span>
            <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{seconds}s</span>
          </div>
        ))}
      </div>
      <div className={cn("flex flex-col gap-3 border-t px-4 py-3.5", LINE)}>
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <Field label="On screen for" hint="Seconds">
            <Input className="tabular-nums">12</Input>
          </Field>
          <Field label="How many to preview">
            <Input className="tabular-nums">4</Input>
          </Field>
        </div>
        <Field label="Heading">
          <Input>Happening now</Input>
        </Field>
        <Button variant="ghost" icon={Link2} className="w-full">
          Copy live URL
        </Button>
      </div>
    </Window>
  );
}

// Section stage: the lobby screen playing Now & Next, with the board's slide queue and inspector over it.
export function BoardStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NowNextScreen className="absolute top-0 left-0 h-[430px] w-[764px]" />
      <div className="absolute top-[430px] left-[362px] h-6 w-10 bg-linear-to-b from-foreground/20 to-transparent" />
      <div className={cn("absolute top-[70px] left-[700px] z-[2]", styles.float)}>
        <BoardBuilderPanel />
      </div>
    </div>
  );
}

const ROOMS = ["Main Stage", "Studio 2", "The Loft"];
const AGENDA = [
  { room: 0, start: 0, span: 2, title: "Opening keynote", speaker: "Elena Rossi", time: "09:30 – 10:30", status: "Scheduled" },
  { room: 0, start: 3, span: 2, title: "Designing for slow cities", speaker: "Zara Patel", time: "11:00 – 12:00", status: "Live" },
  { room: 1, start: 1, span: 3, title: "Type in motion", speaker: "Ravi Menon", time: "10:00 – 11:30", status: "Scheduled" },
  { room: 2, start: 0, span: 1.5, title: "Portfolio clinic", speaker: "Hana Ito", time: "09:30 – 10:15", status: "Scheduled" },
  { room: 2, start: 4, span: 2, title: "Colour systems at scale", speaker: "Theo Lindqvist", time: "11:30 – 12:30", status: "Draft" },
];
const SLOT = 30;

// Cell: the Agenda Builder's grid for Friday, one column per room.
export function AgendaRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <CalendarRange className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Agenda Builder</span>
        <span className="ml-auto inline-flex rounded-lg border border-foreground/[0.1] p-0.5">
          <span className="flex items-center gap-1 rounded-md bg-foreground/[0.1] px-2 py-0.5 font-medium">
            <CalendarRange className="size-3" /> Grid
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 text-muted-foreground">
            <LayoutList className="size-3" /> List
          </span>
        </span>
      </div>
      <div className={cn("flex gap-4 border-b px-4 py-2 text-[11px]", LINE)}>
        {["Thu 19 Nov", "Fri 20 Nov", "Sat 21 Nov"].map((day) => (
          <span key={day} className={day === "Fri 20 Nov" ? "font-medium text-foreground" : "text-muted-foreground"}>
            {day}
          </span>
        ))}
      </div>
      <div className={cn("grid grid-cols-[44px_repeat(3,minmax(0,1fr))] border-b text-[11px] text-muted-foreground", LINE)}>
        <span />
        {ROOMS.map((room) => (
          <span key={room} className={cn("border-l px-2 py-1.5", LINE)}>
            {room}
          </span>
        ))}
      </div>
      <div className="relative h-[188px]">
        {["09:30", "10:30", "11:30"].map((time, index) => (
          <span key={time} className={cn("absolute left-0 w-full border-t text-[10px] text-muted-foreground tabular-nums", LINE)} style={{ top: index * SLOT * 2 }}>
            <span className="ml-2">{time}</span>
          </span>
        ))}
        {AGENDA.map((session, index) => (
          <div
            key={session.title}
            className={cn("absolute overflow-hidden rounded-md border px-2 py-1.5", session.status === "Live" ? "border-emerald-500/30 bg-emerald-500/[0.08]" : "border-foreground/[0.1] bg-foreground/[0.04]", session.status === "Draft" && "border-dashed", styles.popIn)}
            style={{
              left: `calc(44px + ${session.room} * ((100% - 44px) / 3) + 4px)`,
              width: "calc((100% - 44px) / 3 - 8px)",
              top: session.start * SLOT + 3,
              height: session.span * SLOT - 6,
              "--pop-delay": `${0.2 + index * 0.1}s`,
            }}
          >
            <div className="truncate font-medium text-foreground/90">{session.title}</div>
            <div className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-muted-foreground">
              {session.status === "Live" ? <span className={cn("size-1.5 shrink-0 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> : null}
              {session.speaker}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const THEMES = [
  { name: "Midnight", className: "bg-neutral-950 text-neutral-100", muted: "text-neutral-400", line: "border-white/10" },
  { name: "Slate", className: "bg-neutral-800 text-neutral-100", muted: "text-neutral-400", line: "border-white/10" },
  { name: "Paper", className: "bg-neutral-100 text-neutral-900", muted: "text-neutral-500", line: "border-black/10" },
  { name: "Ink", className: "bg-black text-white", muted: "text-neutral-400", line: "border-white/15" },
];

// Cell: the same Up next by room slide in each of the four board themes.
export function ThemesRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-x-3 gap-y-2">
      {THEMES.map((theme, index) => (
        <div key={theme.name} className={cn(styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <div className={cn("h-[112px] rounded-lg p-3 ring-1", theme.className, index === 0 ? "ring-2 ring-foreground/40" : "ring-foreground/10")}>
            <div className={cn("font-mono text-[8px] tracking-[0.14em] uppercase", theme.muted)}>The Loft · Up next</div>
            {[
              ["14:30", "Portfolio clinic"],
              ["15:30", "Zines and small press"],
              ["16:30", "Closing drinks"],
            ].map(([time, title]) => (
              <div key={time} className={cn("mt-1.5 flex gap-2 border-b pb-1.5 text-[10px] last:border-b-0", theme.line)}>
                <span className={cn("tabular-nums", theme.muted)}>{time}</span>
                <span className="truncate">{title}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 text-center text-[11px] text-muted-foreground">{theme.name}</div>
        </div>
      ))}
    </div>
  );
}

const OPS_COLUMNS = [
  {
    state: "New",
    cards: [
      { item: "Hearing loop — The Loft", quantity: 1 },
      { item: "Clicker batteries", quantity: 24 },
      { item: "Spare HDMI adapters", quantity: 6 },
    ],
  },
  {
    state: "In progress",
    cards: [
      { item: "Lapel mics — Main Stage", quantity: 6, open: true },
      { item: "Projector — Studio 2", quantity: 1 },
    ],
  },
  {
    state: "Complete",
    cards: [
      { item: "Stage monitors — Main Stage", quantity: 2, checked: true },
      { item: "Signage — Gate B", quantity: 12, checked: true },
      { item: "Wi-Fi survey — Expo floor", quantity: 1, checked: true },
    ],
  },
];

function OperationsWindow({ className }) {
  return (
    <Window className={cn("h-[600px] w-[700px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <ClipboardList className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">{EVENT.name}</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Operations workspace</span>
      </div>
      <div className={cn("flex items-center gap-1 border-b px-5 py-2.5 text-[12px]", LINE)}>
        {["Speaker preparation", "Equipment checks", "Resources", "People"].map((tab) => (
          <span key={tab} className={cn("rounded-md px-2.5 py-1", tab === "Equipment checks" ? "bg-foreground/[0.08] font-medium text-foreground" : "text-muted-foreground")}>
            {tab}
          </span>
        ))}
        <span className="ml-auto inline-flex rounded-lg border border-foreground/[0.1] p-0.5">
          <span className="flex items-center gap-1 px-2 py-0.5 text-muted-foreground">
            <LayoutList className="size-3" /> Table
          </span>
          <span className="flex items-center gap-1 rounded-md bg-foreground/[0.1] px-2 py-0.5 font-medium">
            <Kanban className="size-3" /> Board
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3 p-4">
        {OPS_COLUMNS.map((column, columnIndex) => (
          <div key={column.state} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2">
            <div className="flex items-center gap-2 px-1.5 pt-1 text-[12px]">
              <Status status={column.state} className="font-medium" />
              <span className="text-muted-foreground">{column.cards.length}</span>
            </div>
            {column.cards.map((card, index) => (
              <div
                key={card.item}
                className={cn("rounded-lg border bg-surface-card p-3 text-[12px] shadow-sm shadow-black/5 dark:bg-foreground/[0.04]", card.open ? "border-foreground/30" : "border-foreground/[0.09]", styles.popIn)}
                style={{ "--pop-delay": `${0.2 + columnIndex * 0.15 + index * 0.08}s` }}
              >
                <div className="leading-[1.35] text-foreground/90">{card.item}</div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="tabular-nums">Quantity {card.quantity}</span>
                  {card.checked ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" strokeWidth={2.5} /> Checked
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
}

function RecordPanel({ className }) {
  return (
    <Window className={cn("w-[320px]", className)}>
      <div className={cn("border-b px-5 py-3.5", LINE)}>
        <div className="text-[11px] text-muted-foreground">Equipment checks</div>
        <div className="mt-0.5 text-[15px] font-medium tracking-[-0.01em]">Lapel mics — Main Stage</div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <Field label="Item">
          <Input>Lapel mics — Main Stage</Input>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity">
            <Input className="tabular-nums">6</Input>
          </Field>
          <Field label="Checked">
            <span className="flex h-8 items-center">
              <Toggle />
            </span>
          </Field>
        </div>
        <Field label="State">
          <span className="flex items-center gap-1.5 text-[11px]">
            {["New", "In progress", "Complete"].map((state, index) => (
              <span key={state} className="flex items-center gap-1.5">
                {index > 0 ? <span className="h-px w-3 bg-foreground/20" /> : null}
                <span className={cn("rounded-full border px-2 py-0.5", state === "In progress" ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200" : "border-foreground/[0.1] text-muted-foreground")}>{state}</span>
              </span>
            ))}
          </span>
        </Field>
        <Button className={cn("mt-1 w-full", styles.popIn)}>Move to Complete</Button>
      </div>
    </Window>
  );
}

// Section stage: the event's equipment checks on a board, with one record open to move it on.
export function OperationsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <OperationsWindow className="absolute top-0 left-0" />
      <div className={cn("absolute top-[120px] left-[660px] z-[2]", styles.float)}>
        <RecordPanel />
      </div>
    </div>
  );
}

const KPIS = [
  { label: "Registrations", value: "1,412" },
  { label: "Ticket Revenue", value: "$263,920" },
  { label: "Check-ins", value: "612", live: true },
  { label: "New RSVPs", value: "38" },
];

const TREND = [12, 18, 15, 26, 31, 28, 40, 46, 44, 58, 66, 72, 70, 88];

// Cell: the Overview's KPIs on the day, with registrations over time beneath.
export function LiveKpisRender() {
  const width = 428;
  const height = 64;
  const max = 92;
  const points = TREND.map((value, index) => [(index / (TREND.length - 1)) * width, height - (value / max) * height]);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.08] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="grid grid-cols-2 gap-2">
        {KPIS.map((kpi, index) => (
          <div key={kpi.label} className={cn("rounded-lg border border-foreground/[0.08] px-3 py-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
            <div className="flex items-center gap-1.5 truncate font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
              {kpi.live ? <span className={cn("size-1.5 shrink-0 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> : null}
              {kpi.label}
            </div>
            <div className="mt-0.5 text-[18px] font-semibold tracking-[-0.01em] tabular-nums">{kpi.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 text-[12px] font-medium">Registrations Over Time</div>
      <svg width={width} height={height + 16} viewBox={`0 0 ${width} ${height + 16}`} className="mt-2 overflow-visible text-foreground">
        {[0, 0.5, 1].map((tick) => (
          <line key={tick} x1="0" x2={width} y1={tick * height} y2={tick * height} stroke="currentColor" strokeOpacity="0.07" />
        ))}
        <path d={`${line} L${width} ${height} L0 ${height} Z`} fill="currentColor" fillOpacity="0.07" />
        <path d={line} fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.75" />
        <circle cx={points.at(-1)[0]} cy={points.at(-1)[1]} r="3" className="fill-emerald-500" />
        <text x="0" y={height + 14} className="fill-muted-foreground text-[10px]">
          Oct 14
        </text>
        <text x={width} y={height + 14} textAnchor="end" className="fill-muted-foreground text-[10px]">
          Today
        </text>
      </svg>
    </div>
  );
}

function Gauge({ title, subtitle, value, caption, footnote, delay }) {
  const radius = 64;
  const length = Math.PI * radius;
  return (
    <div className="flex flex-col rounded-xl border border-foreground/[0.08] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="font-medium">{title}</div>
      <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      <div className={cn("relative mx-auto mt-4", styles.popIn)} style={{ "--pop-delay": `${delay}s` }}>
        <svg width="160" height="88" viewBox="0 0 160 88" className="text-foreground">
          <path d={`M16 80 A${radius} ${radius} 0 0 1 144 80`} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="12" strokeLinecap="round" />
          <path
            d={`M16 80 A${radius} ${radius} 0 0 1 144 80`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(length * value) / 100} ${length}`}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="text-[22px] leading-none font-semibold tracking-[-0.02em] tabular-nums">{value}%</div>
          <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">{caption}</div>
        </div>
      </div>
      <div className="mt-3 text-center text-[11px] text-muted-foreground tabular-nums">{footnote}</div>
    </div>
  );
}

// Cell: sell-through and attendance as the Overview's two gauges.
export function GaugesRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-3">
      <Gauge title="Sell-Through Rate" subtitle="Seats sold vs. capacity." value={73} caption="Sold" footnote="1,164 of 1,600 Seats" delay={0.3} />
      <Gauge title="Attendance Rate" subtitle="Checked in vs. registered." value={53} caption="Checked In" footnote="612 of 1,164 Showed Up" delay={0.5} />
    </div>
  );
}
