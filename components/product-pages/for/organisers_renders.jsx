import {
  Activity,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Columns3,
  CornerDownLeft,
  FileText,
  Image,
  Kanban,
  LayoutGrid,
  ListTodo,
  LogOut,
  MapPin,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  ScanLine,
  Search,
  Sparkles,
  StickyNote,
  Table,
  Table2,
  Tag,
  Ticket,
  Upload,
  UserCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QrGlyph } from "@/components/features-hub/motifs/motif_kit";
import { AppMark, Avatar, AvatarStack, Chip, Dot, Kbd, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Harbourlight Comedy across the suite: the November night's board in Notes, act and volunteer forms, then tickets, the door and the regulars in Events.

const EVENT = "Harbourlight Live — November";

function EventsMark() {
  return <AppMark id="events" size={20} />;
}

function NotesMark() {
  return <AppMark id="notes" size={20} />;
}

function FormsMark() {
  return <AppMark id="forms" size={20} />;
}

// The count pill the check-in, door and kiosk screens keep in their header.
function InCount({ value = "168 / 212", className }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 text-[11px] font-medium text-emerald-700 tabular-nums dark:text-emerald-300", className)}>
      <Activity className="size-3" strokeWidth={2} /> {value} in
    </span>
  );
}

function SelectBox({ children, className }) {
  return (
    <span className={cn("flex h-9 items-center justify-between rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-3 text-[12px] text-foreground/85", className)}>
      {children}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}

// A camera viewfinder with a guest's ticket held up to it.
function Viewfinder({ seed, className }) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl bg-foreground/[0.07]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_75%)]" />
      {["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2", "bottom-4 left-4 border-b-2 border-l-2", "right-4 bottom-4 border-r-2 border-b-2"].map((corner) => (
        <span key={corner} className={cn("absolute size-6 rounded-[3px] border-foreground/60", corner)} />
      ))}
      <div className="relative rotate-[-4deg] rounded-xl bg-white p-2 text-black shadow-lg shadow-black/20">
        <QrGlyph seed={seed} className="size-[88px]" />
      </div>
      <span className="absolute inset-x-8 top-1/2 h-px bg-emerald-500/70 shadow-[0_0_10px_1px] shadow-emerald-500/40" />
    </div>
  );
}

function Flash({ tone = "emerald", children, delay = "0.8s" }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
  const Icon = tone === "amber" ? AlertTriangle : CheckCircle2;
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[12px] font-medium", toneClass, styles.popIn)} style={{ "--pop-delay": delay }}>
      <Icon className="size-4 shrink-0" strokeWidth={2} />
      {children}
    </div>
  );
}

function ResultRow({ name, detail, admitted }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{name}</div>
        <div className="truncate text-[11px] text-muted-foreground">{detail}</div>
      </div>
      {admitted ? (
        <span className="inline-flex h-7 items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5" /> In
        </span>
      ) : (
        <span className="inline-flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-[11px] font-medium text-background">
          <UserCheck className="size-3.5" /> Admit
        </span>
      )}
    </div>
  );
}

const KPIS = [
  { label: "Registrations", value: "212", delta: "+14.2%" },
  { label: "Ticket Revenue", value: "£3,148", delta: "+9.6%" },
  { label: "Check-ins", value: "168", delta: "+21.0%" },
  { label: "New RSVPs", value: "24", delta: "−3.1%", down: true },
];

const ARRIVALS = [
  { name: "Maya Chen", ticket: "Front tables", gate: "Gate A", time: "Just now" },
  { name: "Priya Nair", ticket: "General admission", gate: "Gate B", time: "1m" },
  { name: "Ravi Menon", ticket: "Early bird", gate: "Gate A", time: "2m" },
  { name: "Elena Rossi", ticket: "Front tables", gate: "Gate A", time: "2m" },
  { name: "Noah Fischer", ticket: "Walk-in · Cash", gate: "Door", time: "4m" },
];

const GATES = [
  { name: "Gate A · Pier Road", value: 96, share: 57 },
  { name: "Gate B · Bar door", value: 61, share: 36 },
  { name: "Walk-ins at the door", value: 11, share: 7 },
];

const TIERS_SOLD = [
  { name: "Early bird", sold: 60, total: 60 },
  { name: "General admission", sold: 104, total: 220 },
  { name: "Front tables", sold: 34, total: 48 },
];

// The hero's tilted plane: the night's Overview counting guests in, with the door scanner held up beside it.
export function HarbourlightHeroWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[700px] w-[940px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <EventsMark />
          <span className="text-muted-foreground">Harbourlight Comedy</span>
          <span className="text-muted-foreground/60">›</span>
          <span className="font-medium">{EVENT}</span>
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
            <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Live
          </span>
          <span className="ml-auto text-[12px] text-muted-foreground">Fri 14 Nov · The Harbourlight Rooms</span>
        </div>
        <div className={cn("flex h-10 shrink-0 items-end gap-5 border-b px-5 text-[12px]", LINE)}>
          {["Overview", "Tickets", "Orders", "Registrations", "Check-in", "Display boards", "Guests"].map((tab, index) => (
            <span key={tab} className={cn("pb-2.5", index === 0 ? "border-b-2 border-foreground font-medium text-foreground" : "text-muted-foreground")}>
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className={cn("grid grid-cols-4 divide-x overflow-hidden rounded-xl border bg-foreground/[0.02] [&>*]:border-foreground/[0.07]", LINE)}>
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="px-5 py-4">
                <div className="text-[12px] text-muted-foreground">{kpi.label}</div>
                <div className="mt-1 text-[26px] leading-tight font-medium tracking-[-0.02em] tabular-nums">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                  <span className={kpi.down ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>{kpi.delta}</span>
                  <span className="text-muted-foreground uppercase">vs last period</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_1.1fr] gap-4">
            <div className={cn("rounded-xl border p-5", LINE)}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Check-in</span>
                <MonoLabel>Live</MonoLabel>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[30px] leading-none font-medium tracking-[-0.02em] tabular-nums">168</span>
                <span className="text-muted-foreground">of 212 checked in</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className={cn("block h-full w-[79%] origin-left rounded-full bg-emerald-500", styles.fill)} style={{ "--fill-delay": "0.6s" }} />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {GATES.map((gate, index) => (
                  <div key={gate.name} className="flex items-center gap-3 text-[12px]">
                    <span className="w-[150px] truncate text-foreground/85">{gate.name}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                      <span className={cn("block h-full origin-left rounded-full bg-foreground/40", styles.fill)} style={{ width: `${gate.share}%`, "--fill-delay": `${0.8 + index * 0.15}s` }} />
                    </span>
                    <span className="w-6 text-right text-muted-foreground tabular-nums">{gate.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={cn("overflow-hidden rounded-xl border", LINE)}>
              <div className={cn("flex items-center justify-between border-b px-4 py-3", LINE)}>
                <span className="font-medium">Recent check-ins</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Updating
                </span>
              </div>
              {ARRIVALS.map((arrival, index) => (
                <div key={arrival.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.3 + (ARRIVALS.length - index) * 0.12}s` }}>
                  <Avatar name={arrival.name} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{arrival.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {arrival.ticket} · {arrival.gate}
                    </span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{arrival.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={cn("rounded-xl border px-5 py-4", LINE)}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Tickets</span>
              <span className="text-[12px] text-muted-foreground">198 of 328 sold</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-5">
              {TIERS_SOLD.map((tier, index) => (
                <div key={tier.name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="truncate text-foreground/85">{tier.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {tier.sold}/{tier.total}
                    </span>
                  </div>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-foreground/[0.06]">
                    <span
                      className={cn("block h-full origin-left rounded-full", tier.sold === tier.total ? "bg-foreground/45" : "bg-emerald-500", styles.fill)}
                      style={{ width: `${(tier.sold / tier.total) * 100}%`, "--fill-delay": `${1 + index * 0.15}s` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Window>

      <div className="absolute top-[56px] left-[868px] z-[2] h-[620px] w-[300px] rounded-[36px] border border-foreground/[0.12] bg-surface-card p-2.5 shadow-2xl shadow-black/30 dark:bg-surface-subtle">
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-foreground/[0.07] text-[12px]">
          <div className={cn("flex items-center gap-2 border-b px-4 pt-5 pb-3", LINE)}>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{EVENT}</div>
              <div className="truncate text-[11px] text-muted-foreground">Scanning as Ines Duarte</div>
            </div>
            <InCount />
          </div>
          <div className="flex flex-col gap-3 p-3">
            <SelectBox>Any gate</SelectBox>
            <Viewfinder seed="harbourlight-hero" className="h-[196px]" />
            <Flash>Admitted Maya Chen</Flash>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-foreground/[0.12] px-3">
              <Search className="size-3.5 text-muted-foreground" />
              <Typed text="Okafor" delay={1.5} />
            </div>
            <ResultRow name="Amara Okafor" detail="amara@pierside.co · HL-7Q4K2" />
            <ResultRow name="Nathan Okafor" detail="nathan@kestrel.aero · HL-3M8RT" admitted />
          </div>
        </div>
      </div>
    </div>
  );
}

const BOARD_TOOLS = [StickyNote, ListTodo, FileText, LayoutGrid, Columns3, MessageSquare, Table, Calendar, Clock, Image, Upload, Pencil, MoreHorizontal];

function BoardToolbar() {
  return (
    <div className="absolute top-4 left-4 z-[3] flex flex-col gap-0.5 rounded-xl border border-foreground/[0.1] bg-surface-card p-1 shadow-lg shadow-black/10 dark:bg-surface-dialog">
      {BOARD_TOOLS.map((Icon, index) => (
        <span key={index} className={cn("flex size-8 items-center justify-center rounded-lg text-muted-foreground", index === 6 && "bg-foreground/[0.08] text-foreground")}>
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      ))}
    </div>
  );
}

function Sticky({ children, className }) {
  return <div className={cn("rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2.5 leading-[1.4] text-foreground/90 shadow-sm shadow-black/5 dark:bg-foreground/[0.04]", className)}>{children}</div>;
}

function LineupColumn({ title, notes, className }) {
  return (
    <div className={cn("absolute w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-subtle/80 p-2.5 text-[12px] dark:bg-surface-subtle", className)}>
      <div className="flex items-center gap-2 px-1 pb-2.5 text-[13px] font-medium">
        <Columns3 className="size-3.5 text-muted-foreground" />
        {title}
        <span className="ml-auto text-[11px] font-normal text-muted-foreground">{notes.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {notes.map(([name, detail]) => (
          <Sticky key={name}>
            <span className="block font-medium">{name}</span>
            <span className="block text-[11px] text-muted-foreground">{detail}</span>
          </Sticky>
        ))}
      </div>
    </div>
  );
}

const RUN_OF_SHOW = [
  ["18:30", "Bar opens"],
  ["19:00", "Doors"],
  ["19:45", "Leah opens as MC"],
  ["20:00", "Zara Patel"],
  ["20:15", "Ravi Menon"],
  ["20:35", "Interval"],
  ["20:50", "Clara Vidal"],
  ["21:10", "Amara Okafor"],
  ["21:40", "Raffle and close"],
];

const ACTS = [
  ["Zara Patel", "20:00", "10 min", "£60", "Confirmed"],
  ["Ravi Menon", "20:15", "15 min", "£80", "Confirmed"],
  ["Clara Vidal", "20:50", "15 min", "£80", "Confirmed"],
  ["Amara Okafor", "21:10", "25 min", "£200", "Confirmed"],
];

// Section stage: the November board with the run of show, the line-up in columns, a timer, and the acts table being filled in.
export function HarbourlightBoardStage() {
  return (
    <Window className="h-[660px] w-[1000px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
        <NotesMark />
        <span className="text-muted-foreground">Boards</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">{EVENT}</span>
        <span className="ml-auto flex items-center gap-3">
          <AvatarStack names={["Leah Mensah", "Kofi Asante", "Ines Duarte"]} size={22} />
          <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Collaborate</span>
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden" style={CANVAS_DOTS}>
        <BoardToolbar />

        <div className="absolute top-6 left-[80px] w-[224px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <FileText className="size-3.5 text-muted-foreground" /> Run of show
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            {RUN_OF_SHOW.map(([time, item]) => (
              <div key={time} className="flex gap-3">
                <span className="w-9 shrink-0 font-mono text-[11px] leading-[18px] text-muted-foreground tabular-nums">{time}</span>
                <span className={cn("text-foreground/85", item === "Interval" && "text-muted-foreground")}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <LineupColumn
          title="Confirmed"
          className="top-6 left-[324px]"
          notes={[
            ["Zara Patel", "Opener · 10 min"],
            ["Ravi Menon", "15 min"],
            ["Clara Vidal", "15 min"],
            ["Amara Okafor", "Headliner · 25 min"],
          ]}
        />
        <LineupColumn
          title="Pencilled in"
          className="top-6 left-[544px]"
          notes={[
            ["Noah Fischer", "New hour preview · 10 min"],
            ["Mia Johansson", "Backup slot · 15 min"],
          ]}
        />

        <div className="absolute top-6 left-[764px] flex w-[208px] items-center gap-3 rounded-xl border border-foreground/[0.1] bg-surface-card px-4 py-3 shadow-sm shadow-black/5 dark:bg-surface-subtle">
          <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 text-foreground">
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" strokeDasharray="94.2 94.2" />
          </svg>
          <div>
            <div className="text-[11px] text-muted-foreground">Timer · Interval</div>
            <div className="text-[20px] font-medium tabular-nums">15:00</div>
          </div>
        </div>
        <Sticky className="absolute top-[100px] left-[764px] w-[208px] rotate-[1.5deg] text-[12px]">Ask Ines to run the raffle at close</Sticky>
        <Sticky className="absolute top-[172px] left-[764px] w-[208px] rotate-[-1deg] text-[12px]">Festival needs two stages, so book a second sound tech</Sticky>

        <div className={cn("absolute top-[318px] left-[350px] z-[3] w-[600px] overflow-hidden rounded-xl border border-foreground/[0.14] bg-surface-card text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.float)}>
          <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 font-medium", LINE)}>
            <Table className="size-3.5 text-muted-foreground" /> Acts
            <span className="ml-auto text-[11px] font-normal text-muted-foreground">5 rows</span>
          </div>
          <div className={cn("grid grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_1fr] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
            {["Act", "Slot", "Set", "Fee", "Status"].map((heading) => (
              <span key={heading}>{heading}</span>
            ))}
          </div>
          {ACTS.map((row) => (
            <div key={row[0]} className={cn("grid grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_1fr] gap-3 border-b px-4 py-2 text-foreground/85 tabular-nums", LINE)}>
              {row.map((cell, index) => (
                <span key={index} className={cn(index === 4 && "inline-flex items-center gap-1.5")}>
                  {index === 4 ? <Dot tone="emerald" /> : null}
                  {cell}
                </span>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_1fr] gap-3 bg-foreground/[0.03] px-4 py-2 text-foreground/85">
            <span className="rounded-[3px] ring-1 ring-foreground/40">
              <Typed text="Noah Fischer" delay={1.4} className="px-1" />
            </span>
            <span className="text-muted-foreground">—</span>
            <span>10 min</span>
            <span>£60</span>
            <span className="inline-flex items-center gap-1.5">
              <Dot tone="amber" /> Pencilled in
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}

const FESTIVAL_BOARDS = [
  { title: "Line-up and stages", cards: 42, shape: "columns" },
  { title: "Volunteer rota", cards: 18, shape: "table" },
  { title: "Bar and suppliers", cards: 23, shape: "notes" },
  { title: "Monthly nights", cards: 11, shape: "boards" },
];

function MiniPreview({ shape }) {
  if (shape === "columns") {
    return (
      <div className="flex gap-1.5">
        {[3, 2, 3].map((count, index) => (
          <div key={index} className="flex flex-1 flex-col gap-1 rounded bg-foreground/[0.05] p-1">
            {Array.from({ length: count }, (_, row) => (
              <span key={row} className="h-2 rounded-sm bg-foreground/[0.12]" />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (shape === "table") {
    return (
      <div className="flex flex-col gap-1">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((col) => (
              <span key={col} className={cn("h-2 rounded-sm", row === 0 ? "bg-foreground/20" : "bg-foreground/[0.08]")} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (shape === "boards") {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((index) => (
          <span key={index} className="h-7 rounded border border-foreground/[0.12] bg-foreground/[0.04]" />
        ))}
      </div>
    );
  }
  return (
    <div className="relative h-8">
      {[
        [0, 2, -3],
        [34, 0, 2],
        [68, 4, -1],
      ].map(([left, top, rotate]) => (
        <span key={left} className="absolute h-7 w-9 rounded-sm bg-foreground/[0.1]" style={{ left, top, rotate: `${rotate}deg` }} />
      ))}
    </div>
  );
}

// Cell: the festival as a board of boards, one for each part of the day.
export function FestivalBoardsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08]" style={CANVAS_DOTS}>
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-foreground/[0.1] bg-surface-card px-2.5 py-1 text-[11px] dark:bg-surface-subtle">
        <span className="text-muted-foreground">Boards ›</span>
        <span className="font-medium">Harbourlight Comedy Festival</span>
      </div>
      <div className="absolute top-[52px] left-3 grid w-[434px] grid-cols-2 gap-3">
        {FESTIVAL_BOARDS.map((board, index) => (
          <div
            key={board.title}
            className={cn("rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle", styles.popIn)}
            style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-3.5 text-muted-foreground" />
              <span className="truncate font-medium">{board.title}</span>
              <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{board.cards}</span>
            </div>
            <div className="mt-3">
              <MiniPreview shape={board.shape} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const APPLICATION_STATUS = { Approved: "emerald", Complete: "emerald", Pending: "amber", "Needs review": "amber", Rejected: "red" };

function AppStatus({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground/85">
      <Dot tone={APPLICATION_STATUS[status]} />
      {status}
    </span>
  );
}

const APPLICATIONS = [
  { name: "Noah Fischer", detail: "New hour preview", status: "Pending", set: "10 min", clip: true, time: "2m" },
  { name: "Mia Johansson", detail: "Character comedy", status: "Needs review", set: "15 min", clip: true, time: "1h" },
  { name: "Priya Nair", detail: "Stand-up", status: "Approved", set: "10 min", clip: true, time: "3h" },
  { name: "Tyler Brennan", detail: "First open spot", status: "Complete", set: "5 min", clip: false, time: "5h" },
  { name: "Maya Chen", detail: "Musical comedy", status: "Approved", set: "15 min", clip: true, time: "1d" },
  { name: "Grace Donnelly", detail: "Stand-up", status: "Rejected", set: "20 min", clip: false, time: "1d" },
  { name: "Theo Lindqvist", detail: "Sketch duo", status: "Needs review", set: "15 min", clip: true, time: "2d" },
];

function ApplicationsWindow({ className }) {
  return (
    <Window className={cn("w-[690px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <FormsMark />
        <span className="font-medium">Comedian applications</span>
        <span className="text-muted-foreground">46 responses</span>
        <span className="ml-auto flex items-center rounded-md border border-foreground/10 p-0.5 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
            <Table2 className="size-3.5" /> Table
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5">
            <Kanban className="size-3.5" /> Kanban
          </span>
        </span>
      </div>
      <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
        {["All responses", "Needs review", "Approval queue", "Booked"].map((view, index) => (
          <span key={view} className={cn("rounded-full px-2.5 py-1", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
            {view}
          </span>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1.7fr_1.1fr_0.7fr_0.5fr_0.5fr] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Applicant</span>
        <span>Status</span>
        <span>Set length</span>
        <span>Clip</span>
        <span className="text-right">Sent</span>
      </div>
      {APPLICATIONS.map((application, index) => (
        <div key={application.name} className={cn("grid grid-cols-[1.7fr_1.1fr_0.7fr_0.5fr_0.5fr] items-center gap-3 border-b px-5 py-2.5", LINE, index === 0 && "bg-foreground/[0.04]")}>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={application.name} size={22} />
            <span className="min-w-0">
              <span className="block truncate font-medium">{application.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{application.detail}</span>
            </span>
          </span>
          <AppStatus status={application.status} />
          <span className="text-foreground/80 tabular-nums">{application.set}</span>
          <span>{application.clip ? <Paperclip className="size-3.5 text-muted-foreground" /> : <span className="text-muted-foreground">—</span>}</span>
          <span className="text-right text-[12px] text-muted-foreground">{application.time}</span>
        </div>
      ))}
    </Window>
  );
}

function Answer({ label, children }) {
  return (
    <div className="py-1.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground/90">{children}</div>
    </div>
  );
}

function ApplicationDetail({ className }) {
  return (
    <Window className={cn("w-[350px]", className)}>
      <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
        <Avatar name="Noah Fischer" size={32} />
        <div className="min-w-0">
          <div className="font-medium">Noah Fischer</div>
          <div className="truncate text-[12px] text-muted-foreground">noah@brightloop.io</div>
        </div>
        <span className="ml-auto">
          <AppStatus status="Pending" />
        </span>
      </div>
      <div className={cn("border-b px-5 py-2", LINE)}>
        <Answer label="Set length">10 minutes</Answer>
        <Answer label="Send us a clip of your set">
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] bg-foreground/[0.03] px-2 py-1 text-[12px]">
            <Paperclip className="size-3 text-muted-foreground" /> noah-fischer-set.mp4
          </span>
        </Answer>
        <Answer label="Where have you gigged?">Lantern Rooms open mic, two festival previews</Answer>
      </div>
      <div className="px-5 py-4">
        <div className="text-[11px] font-medium text-muted-foreground">Approval chain</div>
        <div className="relative mt-2.5 flex flex-col gap-3">
          <span className="absolute top-3 bottom-3 left-[9px] border-l border-dashed border-foreground/20" />
          <div className="relative flex items-start gap-3">
            <span className="mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-surface-card bg-emerald-500 text-white dark:border-surface-subtle">
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
            <div>
              <div className="text-foreground/90">Booker</div>
              <div className="text-[11px] text-muted-foreground">Approved · Leah Mensah</div>
            </div>
          </div>
          <div className="relative flex items-start gap-3">
            <span className="mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-surface-card bg-amber-500 text-white dark:border-surface-subtle">
              <Clock className="size-2.5" strokeWidth={3} />
            </span>
            <div>
              <div className="text-foreground/90">Host</div>
              <div className="text-[11px] text-muted-foreground">Waiting on Kofi Asante</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-muted-foreground">Decision · Host</div>
        <div className="mt-2 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-500 text-[12px] font-medium text-white">
            <CheckCircle2 className="size-3.5" /> Approve
          </span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-foreground/10 text-[12px] text-muted-foreground">Reject</span>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the applications inbox with statuses, and one act halfway through a two-step approval.
export function ApplicationsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <ApplicationsWindow className="absolute top-0 left-0" />
      <ApplicationDetail className={cn("absolute top-[64px] left-[640px] z-[2]", styles.float)} />
    </div>
  );
}

const PALETTE_GROUPS = [
  ["Basic", ["Short text", "Long text"]],
  ["Choice", ["Dropdown", "Multiple choice"]],
  ["Advanced", ["File upload", "Signature"]],
];

function BuilderField({ type, label, active, children, className }) {
  return (
    <div className={cn("rounded-xl border bg-surface-card px-3 py-2.5 dark:bg-surface-subtle", active ? "border-foreground/30" : "border-foreground/[0.09]", className)}>
      <MonoLabel className="text-[10px]">{type}</MonoLabel>
      <div className="mt-0.5 font-medium text-foreground/90">{label}</div>
      {children}
    </div>
  );
}

// Cell: the application form taking shape, with a file upload for each act's clip.
export function ApplicationBuilderRender() {
  return (
    <div className="mx-auto flex h-[300px] w-[460px] gap-3 text-[12px]">
      <div className="w-[160px] shrink-0 rounded-xl border border-foreground/[0.09] bg-surface-card p-2 dark:bg-surface-subtle">
        <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1.5">
          <span className="font-medium">Add field</span>
          <span className="text-[11px] text-muted-foreground">36 types</span>
        </div>
        {PALETTE_GROUPS.map(([group, fields]) => (
          <div key={group} className="mt-1">
            <MonoLabel className="px-1.5 text-[10px]">{group}</MonoLabel>
            {fields.map((field) => (
              <div key={field} className={cn("mt-0.5 rounded-md px-1.5 py-1", field === "File upload" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/75")}>
                {field}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <BuilderField type="Short text" label="Stage name" />
        <BuilderField type="Dropdown" label="Set length">
          <div className="mt-1.5 flex gap-1">
            {["5 min", "10 min", "15 min", "20 min"].map((option) => (
              <span key={option} className="rounded border border-foreground/[0.1] px-1.5 text-[11px] leading-5 text-muted-foreground">
                {option}
              </span>
            ))}
          </div>
        </BuilderField>
        <div className={styles.popIn} style={{ "--pop-delay": "0.5s" }}>
          <BuilderField type="File upload" label="Send us a clip of your set" active>
            <div className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/20 text-[11px] text-muted-foreground">
              <Upload className="size-3.5" /> Drop a video or audio file
            </div>
          </BuilderField>
        </div>
      </div>
    </div>
  );
}

const SHIFTS = ["Front door", "Bar", "Green room", "Get-out"];

// Cell: the volunteer signup in conversational mode, one question at a time.
export function VolunteerSignupRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-2xl border border-foreground/[0.1] bg-surface-card text-[14px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <div className="h-1 bg-foreground/[0.06]">
        <div className={cn("h-full w-[50%] origin-left bg-foreground/70", styles.fill)} />
      </div>
      <div className="px-8 pt-6 pb-6">
        <div className="mb-2.5 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="font-mono">3</span>→ <span>of 6 · Festival volunteers</span>
        </div>
        <div className="text-[19px] leading-snug font-medium tracking-tight">Which shifts can you do?</div>
        <div className="mt-1 text-[13px] text-muted-foreground">Choose as many as you like.</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {SHIFTS.map((shift, index) => {
            const picked = index === 0 || index === 2;
            return (
              <span key={shift} className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px]", picked ? "border-foreground/40 bg-foreground/[0.06]" : "border-foreground/[0.1]")}>
                <span className="flex size-5 items-center justify-center rounded border border-foreground/15 font-mono text-[11px] text-muted-foreground">{"ABCD"[index]}</span>
                <span className="truncate">{shift}</span>
                {picked ? <Check className="ml-auto size-3.5 shrink-0" /> : null}
              </span>
            );
          })}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span className="flex h-9 items-center gap-1.5 rounded-md bg-foreground px-4 text-[13px] font-medium text-background">
            OK <Check className="size-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            press <Kbd>Enter</Kbd> <CornerDownLeft className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// The November poster: a spotlight and a microphone stand, drawn in the palette's greys.
function HarbourlightCover({ className }) {
  return (
    <div className={cn("relative overflow-hidden bg-foreground/[0.06]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(34%_95%_at_74%_0%,color-mix(in_oklab,var(--foreground)_24%,transparent),transparent_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-foreground/[0.05]" />
      <svg viewBox="0 0 120 200" className="absolute right-[84px] bottom-0 h-[180px] text-foreground/45" fill="none" aria-hidden="true">
        <rect x="50" y="18" width="20" height="34" rx="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M54 30h12M54 38h12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M60 52v128M36 200l24-20 24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-5 left-6">
        <div className="font-mono text-[11px] tracking-[0.12em] text-foreground/60 uppercase">Harbourlight Comedy · Pier Road</div>
        <div className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">{EVENT}</div>
      </div>
    </div>
  );
}

const TIERS = [
  { name: "Early bird", price: "£10", note: "Sold out", soldOut: true },
  { name: "General admission", price: "£14", note: "Next wave opens Fri 1 Nov" },
  { name: "Front tables", price: "£22", note: "Reserved seating · 14 left" },
];

function NightPageWindow({ className }) {
  return (
    <Window title={EVENT} icon={EventsMark} meta="Public page" className={cn("w-[560px]", className)}>
      <HarbourlightCover className="h-[190px]" />
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" /> The Harbourlight Rooms, Pier Road
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" /> Fri 14 Nov · Doors 19:00
          </span>
        </div>
        <div className={cn("flex gap-5 border-b pb-3 text-[12px]", LINE)}>
          {["About", "What to expect", "Schedule", "Location & directions", "FAQ"].map((tab, index) => (
            <span key={tab} className={index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
              {tab}
            </span>
          ))}
        </div>
        <p className="leading-6 text-foreground/80">Five acts, one headliner and a raffle for the festival fund. Front tables are reserved; everyone else sits where they like.</p>
        <div className={cn("overflow-hidden rounded-xl border", LINE)}>
          {TIERS.map((tier) => (
            <div key={tier.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
              <span className={cn("flex-1", tier.soldOut ? "text-muted-foreground" : "text-foreground/90")}>{tier.name}</span>
              <span className="text-[12px] text-muted-foreground">{tier.note}</span>
              <span className={cn("w-10 text-right font-medium tabular-nums", tier.soldOut && "text-muted-foreground line-through decoration-foreground/30")}>{tier.price}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

// Eight tables of four in front of the stage; seat state per table, left to right.
const TABLES = [
  ["taken", "taken", "open", "open"],
  ["taken", "taken", "taken", "taken"],
  ["open", "open", "taken", "open"],
  ["taken", "yours", "yours", "taken"],
  ["open", "open", "open", "open"],
  ["taken", "open", "taken", "taken"],
  ["open", "taken", "open", "open"],
  ["taken", "taken", "open", "taken"],
];

function SeatPicker() {
  const seatOffsets = [
    [-15, -15],
    [15, -15],
    [-15, 15],
    [15, 15],
  ];
  return (
    <svg viewBox="0 0 372 168" className="w-full text-foreground" aria-hidden="true">
      <rect x="96" y="4" width="180" height="22" rx="6" fill="currentColor" fillOpacity="0.08" />
      <text x="186" y="19" textAnchor="middle" className="fill-muted-foreground text-[10px] tracking-[0.12em] uppercase">
        Stage
      </text>
      {TABLES.map((seats, index) => {
        const cx = 46 + (index % 4) * 93;
        const cy = 70 + Math.floor(index / 4) * 64;
        return (
          <g key={index}>
            <circle cx={cx} cy={cy} r="11" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.18" />
            <text x={cx} y={cy + 3.5} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {index + 1}
            </text>
            {seats.map((state, seat) => {
              const [dx, dy] = seatOffsets[seat];
              if (state === "yours") {
                return <circle key={seat} cx={cx + dx} cy={cy + dy} r="5.5" fill="var(--color-emerald-500)" />;
              }
              return state === "taken" ? (
                <circle key={seat} cx={cx + dx} cy={cy + dy} r="5" fill="currentColor" fillOpacity="0.35" />
              ) : (
                <circle key={seat} cx={cx + dx} cy={cy + dy} r="4.5" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

const CHECKOUT_STEPS = ["Details", "Seats", "Add-ons", "Review"];

function SeatsCheckout({ className }) {
  return (
    <Window className={cn("w-[420px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3.5", LINE)}>
        <Ticket className="size-4 text-muted-foreground" />
        <span className="font-medium">Front tables</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">
          <Zap className="size-3" /> Express Lane
        </span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3 text-[12px]", LINE)}>
        {CHECKOUT_STEPS.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-[18px] items-center justify-center rounded-full text-[10px] font-medium",
                index === 0 ? "bg-emerald-500 text-white" : index === 1 ? "bg-foreground text-background" : "border border-foreground/20 text-muted-foreground",
              )}
            >
              {index === 0 ? <Check className="size-2.5" strokeWidth={3.5} /> : index + 1}
            </span>
            <span className={index === 1 ? "font-medium text-foreground" : "text-muted-foreground"}>{step}</span>
            {index < CHECKOUT_STEPS.length - 1 ? <span className="h-px w-3 bg-foreground/15" /> : null}
          </span>
        ))}
      </div>
      <div className="px-5 pt-4">
        <SeatPicker />
        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-foreground/45" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-foreground/35" /> Taken
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Your seats
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className={cn("flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 text-[12px] text-amber-800 dark:text-amber-200", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
          <Clock className="size-3.5 shrink-0" /> Table 4, seats 2 and 3 are held for 10 minutes
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">2 × Front tables</span>
          <span className="font-medium tabular-nums">£44.00</span>
        </div>
        <span className="flex h-10 items-center justify-center rounded-lg bg-foreground text-[13px] font-medium text-background">Continue to add-ons</span>
        <span className="text-center text-[11px] text-muted-foreground">Card payments by Stripe</span>
      </div>
    </Window>
  );
}

// Section stage: the night's public page with its tiers, and checkout on the seats step with two seats held.
export function NightSalesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NightPageWindow className="absolute top-0 left-[10px] opacity-85" />
      <SeatsCheckout className="absolute top-[44px] left-[560px] z-[2]" />
    </div>
  );
}

const WAVES = [
  { name: "Wave 1", mode: "On sale now", sold: 80, total: 80, state: "Sold out" },
  { name: "Wave 2", mode: "On a date · Fri 1 Nov, 10:00", sold: 0, total: 80, state: "Scheduled" },
  { name: "Wave 3", mode: "After a sell-out", sold: 0, total: 60, state: "Waiting" },
];

// Cell: General admission released in three waves, and the notice a buyer sees between them.
export function WavesRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center justify-between border-b px-4 py-3", LINE)}>
          <span className="font-medium">General admission</span>
          <span className="text-muted-foreground">£14</span>
        </div>
        {WAVES.map((wave, index) => (
          <div key={wave.name} className={cn("border-b px-4 py-3 last:border-b-0", LINE)}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
              <span className="text-foreground/90">{wave.name}</span>
              <span className="truncate text-[12px] text-muted-foreground">· {wave.mode}</span>
              <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground">
                <Dot tone={wave.state === "Sold out" ? "strong" : wave.state === "Scheduled" ? "amber" : "neutral"} />
                {wave.state}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className={cn("absolute inset-y-0 left-0 origin-left rounded-full bg-foreground/45", styles.fill)} style={{ width: `${(wave.sold / wave.total) * 100}%`, "--fill-delay": "0.3s" }} />
              </span>
              <span className="w-[60px] text-right text-[12px] text-muted-foreground tabular-nums">
                {wave.sold} / {wave.total}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 flex items-start gap-2.5 rounded-xl border border-foreground/[0.1] bg-surface-card px-4 py-3 shadow-lg shadow-black/10 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
        <Clock className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
        <span className="leading-5 text-foreground/85">This wave is sold out — the next wave opens Fri 1 Nov, 10:00.</span>
      </div>
    </div>
  );
}

const DISCOUNTS = [
  { kind: "Coupon", name: "REGULARS10", summary: "10% off any tier", mono: true },
  { kind: "Group rule", name: "Birthday tables", summary: "Auto | 10% at 6+" },
  { kind: "Early-bird rule", name: "Book early", summary: "15% off until 20 Oct" },
  { kind: "Affiliate code", name: "LATESET", summary: "LATESET | The Late Set podcast", mono: true },
];

// Cell: Discounts & Codes with one of each kind: a coupon, a group rule, an early-bird rule and an affiliate code.
export function NightDiscountsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Tag className="size-4 text-muted-foreground" />
        <span className="font-medium">Discounts &amp; Codes</span>
        <span className="ml-auto flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
          <Plus className="size-3.5" /> New
        </span>
      </div>
      {DISCOUNTS.map((discount, index) => (
        <div key={discount.kind} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <div className="min-w-0 flex-1">
            <div className={cn("truncate text-foreground/90", discount.mono && "font-mono text-[12px] tracking-wider")}>{discount.name}</div>
            <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{discount.summary}</div>
          </div>
          <Chip className="h-5 px-2 text-[11px]">{discount.kind}</Chip>
        </div>
      ))}
    </div>
  );
}

function CheckinWindow({ className }) {
  return (
    <Window className={cn("w-[600px]", className)}>
      <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b px-5", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{EVENT}</div>
          <div className="truncate text-[11px] text-muted-foreground">Scanning as Ines Duarte</div>
        </div>
        <InCount />
        <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <LogOut className="size-3.5" /> Exit
        </span>
      </div>
      <div className="flex flex-col gap-3.5 p-5">
        <div className="grid grid-cols-2 gap-2">
          <SelectBox>Any gate</SelectBox>
          <SelectBox>Any zone</SelectBox>
        </div>
        <Viewfinder seed="harbourlight-door" className="h-[200px]" />
        <Flash tone="amber" delay="0.6s">
          Grace Donnelly is already checked in
        </Flash>
        <div className="flex gap-2">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-foreground/[0.12] px-3">
            <Search className="size-3.5 text-muted-foreground" />
            Okafor
          </div>
          <span className="flex h-10 items-center rounded-lg bg-foreground px-4 text-[12px] font-medium text-background">Search</span>
        </div>
        <ResultRow name="Amara Okafor" detail="amara@pierside.co · HL-7Q4K2" />
        <ResultRow name="Nathan Okafor" detail="nathan@kestrel.aero · HL-3M8RT" admitted />
      </div>
    </Window>
  );
}

function DoorSection({ title, children }) {
  return (
    <div className="rounded-xl border border-foreground/[0.08] p-3">
      <div className="mb-2.5 text-[12px] font-medium">{title}</div>
      {children}
    </div>
  );
}

function DoorSalesWindow({ className }) {
  return (
    <Window className={cn("w-[390px]", className)}>
      <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b px-4", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">Door sales</div>
          <div className="truncate text-[11px] text-muted-foreground">Selling as Kofi Asante</div>
        </div>
        <InCount />
      </div>
      <div className="flex flex-col gap-2.5 p-4 text-[12px]">
        <DoorSection title="Ticket">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["General admission", "£14", true],
              ["Front tables", "£22", false],
            ].map(([name, price, active]) => (
              <span key={name} className={cn("flex items-center justify-between rounded-lg border px-2.5 py-2", active ? "border-foreground/40 bg-foreground/[0.06]" : "border-foreground/[0.1]")}>
                <span className="truncate">{name}</span>
                <span className="text-muted-foreground tabular-nums">{price}</span>
              </span>
            ))}
          </div>
        </DoorSection>
        <DoorSection title="Quantity & payment">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.1] text-muted-foreground">
                <Minus className="size-3" />
              </span>
              <span className="w-4 text-center text-[15px] font-semibold tabular-nums">2</span>
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.1] text-foreground/80">
                <Plus className="size-3" />
              </span>
            </span>
            <span className="flex rounded-lg border border-foreground/[0.1] p-0.5">
              {["Cash", "Card", "Comp"].map((method) => (
                <span key={method} className={cn("rounded-md px-2.5 py-1", method === "Cash" ? "bg-foreground/[0.08] font-medium text-foreground" : "text-muted-foreground")}>
                  {method}
                </span>
              ))}
            </span>
          </div>
        </DoorSection>
        <DoorSection title="Buyer">
          <div className="flex h-8 items-center rounded-md border border-foreground/[0.1] px-2.5">Tyler Brennan</div>
          <div className="mt-1.5 flex h-8 items-center rounded-md border border-foreground/[0.1] px-2.5 text-muted-foreground">name@email.com</div>
        </DoorSection>
        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">2× General admission (cash)</div>
            <div className="text-[18px] font-bold tabular-nums">£28.00</div>
          </div>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[12px] font-medium text-background">
            <CheckCircle2 className="size-3.5" /> Sell &amp; check in
          </span>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the scanner at the gate catching a second scan, with a walk-in being recorded at the door.
export function DoorNightStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <CheckinWindow className="absolute top-0 left-0 opacity-90" />
      <DoorSalesWindow className={cn("absolute top-[70px] left-[586px] z-[2]", styles.float)} />
    </div>
  );
}

const KIOSK_OPTIONS = [
  { icon: ScanLine, label: "Check in", body: "Already have a ticket" },
  { icon: UserPlus, label: "Register", body: "Sign up on the spot" },
];

// Cell: the self check-in kiosk at the entrance, offering check-in or on-the-spot registration.
export function KioskRender() {
  return (
    <div className="mx-auto w-[440px] rounded-[26px] border border-foreground/[0.12] bg-surface-card p-2.5 shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <div className="rounded-[18px] border border-foreground/[0.07] px-6 pt-6 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[18px] leading-tight font-semibold tracking-[-0.02em]">Harbourlight Live</div>
            <div className="mt-1 text-[12px] text-muted-foreground">Choose how you&apos;d like to continue</div>
          </div>
          <InCount />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {KIOSK_OPTIONS.map(({ icon: Icon, label, body }, index) => (
            <div
              key={label}
              className={cn("flex flex-col gap-3 rounded-2xl border px-4 py-5", index === 0 ? "border-foreground/30 bg-foreground/[0.05]" : "border-foreground/[0.1]", styles.popIn)}
              style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-foreground/[0.12] bg-foreground/[0.04]">
                <Icon className="size-5 text-foreground/80" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[15px] font-medium">{label}</span>
                <span className="block text-[12px] text-muted-foreground">{body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Cell: Now & Next on the screen above the bar, with the other board templates beneath.
export function NightBoardRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className="rounded-xl bg-neutral-950 p-1.5 shadow-xl shadow-black/25 ring-1 ring-foreground/10">
        <div className="flex h-[226px] flex-col rounded-lg bg-[radial-gradient(90%_70%_at_20%_0%,rgb(255_255_255/0.08),transparent_70%)] px-6 py-5 text-neutral-100">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono tracking-[0.12em] uppercase">Harbourlight Live · November</span>
            <span className="tabular-nums">20:52</span>
          </div>
          <div className="mt-5 font-mono text-[10px] tracking-[0.14em] text-emerald-400 uppercase">Now</div>
          <div className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">Clara Vidal</div>
          <div className="text-[13px] text-neutral-400">15 minute set</div>
          <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-3">
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-neutral-400 uppercase">Next</div>
              <div className="mt-1 text-[14px] text-neutral-200">Headliner · Amara Okafor</div>
            </div>
            <span className="text-[14px] text-neutral-400 tabular-nums">21:10</span>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-16 bg-linear-to-b from-foreground/20 to-transparent" />
      <div className="mt-1 flex flex-wrap justify-center gap-1.5">
        {["Title card", "Now & Next", "Full day grid"].map((template) => (
          <Chip key={template} className={cn("h-6 text-[11px]", template === "Now & Next" && "border-foreground/30 text-foreground")}>
            {template}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const CONTACT_TONES = { VIP: "strong", Active: "emerald", Lead: "amber", Archived: "neutral" };

const CONTACTS = [
  { name: "Maya Chen", email: "maya@northwind.studio", tags: ["regular", "front-row"], status: "VIP" },
  { name: "Ravi Menon", email: "ravi@fieldnote.app", tags: ["regular", "member"], status: "Active" },
  { name: "Elena Rossi", email: "elena@atlascoffee.co", tags: ["festival"], status: "Active" },
  { name: "Samuel Okoro", email: "sam@cobalt.shop", tags: ["open-mic"], status: "Lead" },
  { name: "Zara Patel", email: "zara@orbital.dev", tags: ["act", "regular"], status: "VIP" },
  { name: "Marcus Whitfield", email: "marcus@brightloop.io", tags: [], status: "Archived" },
];

// Showcase panel: the Contact Book of everyone who has come to a night, with a membership plan from the members portal.
export function RegularsRender() {
  return (
    <div className="relative h-[440px] w-[680px]">
      <Window title="Contact Book" icon={EventsMark} meta="Harbourlight Comedy" className="h-[440px] w-[600px]">
        <div className={cn("grid grid-cols-4 border-b", LINE)}>
          {[
            ["Contacts", "1,284"],
            ["Active", "642"],
            ["VIP", "58"],
            ["Email consent", "911"],
          ].map(([label, value], index) => (
            <div key={label} className={cn("px-4 py-3", index > 0 && "border-l", LINE)}>
              <div className="text-[11px] text-muted-foreground">{label}</div>
              <div className="mt-0.5 text-[17px] font-medium tracking-tight tabular-nums">{value}</div>
            </div>
          ))}
        </div>
        <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
          <Chip className="h-6 text-[11px]">All statuses</Chip>
          <Chip dot="neutral" className="h-6 border-foreground/30 text-[11px] text-foreground">
            regular
          </Chip>
          <span className="ml-auto text-[11px] text-muted-foreground">Segment · Came three times or more</span>
        </div>
        {CONTACTS.map((contact) => (
          <div key={contact.name} className={cn("grid grid-cols-[1.5fr_0.7fr_1.2fr] items-center gap-3 border-b px-4 py-2", LINE)}>
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar name={contact.name} size={22} />
              <span className="min-w-0">
                <span className="block truncate font-medium">{contact.name}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{contact.email}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-foreground/85">
              <Dot tone={CONTACT_TONES[contact.status]} />
              {contact.status}
            </span>
            <span className="flex min-w-0 gap-1 overflow-hidden">
              {contact.tags.map((tag) => (
                <span key={tag} className="rounded border border-foreground/10 px-1.5 text-[11px] leading-5 whitespace-nowrap text-muted-foreground">
                  {tag}
                </span>
              ))}
            </span>
          </div>
        ))}
      </Window>
      <div className={cn("absolute top-[188px] left-[430px] z-[2] w-[244px] rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.float)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[13px] font-semibold">Harbourlight Members</div>
            <div className="mt-0.5 text-muted-foreground">
              <span className="text-[15px] font-semibold text-foreground">£40</span> · 10% off tickets
            </div>
          </div>
          <Sparkles className="size-4 shrink-0 text-muted-foreground" />
        </div>
        <ul className="mt-3 flex flex-col gap-1.5 text-muted-foreground">
          {["A members' night every quarter", "Your name on the festival wall"].map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {benefit}
            </li>
          ))}
        </ul>
        <span className="mt-3.5 flex h-8 items-center justify-center rounded-md bg-foreground font-medium text-background">Join — £40</span>
      </div>
    </div>
  );
}
