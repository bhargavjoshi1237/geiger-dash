import {
  AppWindow,
  Calendar,
  ChartColumn,
  Clock,
  Code,
  Columns3,
  Copy,
  FileStack,
  FileText,
  Film,
  Gauge,
  Hand,
  Headphones,
  Image,
  LayoutGrid,
  Link,
  ListTodo,
  MessageSquare,
  Mic,
  MonitorUp,
  MoreHorizontal,
  Network,
  Palette,
  Pencil,
  Redo2,
  Shapes,
  Sigma,
  Sparkles,
  Sticker,
  StickyNote,
  Table,
  Timer,
  Type,
  Undo2,
  Upload,
  User,
  Video,
  Vote,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, LINE, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Notes: the seeded "Sprint 42 — retro" board, the docked video stage, the AI assistant card and the card palette.

const TOOLBAR = [StickyNote, Link, ListTodo, FileText, LayoutGrid, Columns3, MessageSquare, Table, Calendar, Clock, Image, Upload, Pencil, MoreHorizontal];

function BoardBar({ title = "Sprint 42 — retro", people = ["Jonas", "Danielle", "Marco"] }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
      <FileStack className="size-4 text-muted-foreground" strokeWidth={1.75} />
      <span className="text-muted-foreground">Boards</span>
      <span className="text-muted-foreground/60">›</span>
      <span className="font-medium">{title}</span>
      <span className="ml-3 flex items-center gap-2.5 text-muted-foreground">
        <Undo2 className="size-3.5" />
        <Redo2 className="size-3.5" />
      </span>
      <span className="ml-auto flex items-center gap-3">
        <AvatarStack names={people} size={22} />
        <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Collaborate</span>
      </span>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="absolute top-4 left-4 z-[3] flex flex-col gap-0.5 rounded-xl border border-foreground/[0.1] bg-surface-card p-1 shadow-lg shadow-black/10 dark:bg-surface-dialog">
      {TOOLBAR.map((Icon, index) => (
        <span key={index} className={cn("flex size-8 items-center justify-center rounded-lg text-muted-foreground", index === 0 && "bg-foreground/[0.08] text-foreground")}>
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      ))}
    </div>
  );
}

function NoteCard({ children, className }) {
  return <div className={cn("rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2.5 leading-[1.4] text-foreground/90 shadow-sm shadow-black/5 dark:bg-foreground/[0.04]", className)}>{children}</div>;
}

function ColumnCard({ title, notes, className }) {
  return (
    <div className={cn("absolute w-[220px] rounded-xl border border-foreground/[0.1] bg-surface-subtle/80 p-2.5 text-[12px] backdrop-blur-sm dark:bg-surface-subtle", className)}>
      <div className="flex items-center gap-2 px-1 pb-2.5 text-[13px] font-medium">
        <Columns3 className="size-3.5 text-muted-foreground" />
        {title}
        <span className="ml-auto text-[11px] font-normal text-muted-foreground">{notes.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {notes.map((note) => (
          <NoteCard key={note}>{note}</NoteCard>
        ))}
      </div>
    </div>
  );
}

// A teammate's live cursor with their name tag.
function Cursor({ name, className, delay = "0s" }) {
  return (
    <div className={cn("absolute z-[4] flex items-start", styles.float, className)} style={{ animationDelay: delay }}>
      <svg width="16" height="18" viewBox="0 0 16 18" className="drop-shadow-sm">
        <path d="M1 1 L1 15 L5 11.2 L7.8 17 L10.2 15.9 L7.4 10.2 L13 10.2 Z" className="fill-foreground stroke-background" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="mt-3 -ml-0.5 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">{name}</span>
    </div>
  );
}

const VELOCITY = [
  ["40", "21", "18", "3"],
  ["41", "24", "20", "4"],
  ["42", "22", "21", "1"],
];

// Section stage: the retro board with three columns, a velocity table, a timer, a doc and two live cursors.
export function CanvasStage() {
  return (
    <Window className="h-[660px] w-[1000px]">
      <BoardBar />
      <div className="relative flex-1 overflow-hidden" style={CANVAS_DOTS}>
        <Toolbar />
        <ColumnCard
          title="Went well"
          className="top-8 left-[86px]"
          notes={["Kestrel pre-order page shipped two days early", "Design QA caught the contrast bug before launch", "Fewer meetings, longer focus blocks"]}
        />
        <ColumnCard title="To improve" className="top-8 left-[326px]" notes={["Creative reviews ran to four rounds", "Handoff notes landed the night before"]} />
        <ColumnCard title="Actions" className="top-8 left-[566px]" notes={["Cap creative reviews at two rounds — Jonas", "Share handoff notes by Thursday — Danielle"]} />

        <div className="absolute top-[318px] left-[566px] w-[300px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle">
          <div className={cn("flex items-center gap-2 border-b px-3 py-2 font-medium", LINE)}>
            <Table className="size-3.5 text-muted-foreground" /> Velocity
          </div>
          <div className={cn("grid grid-cols-4 border-b px-3 py-1.5 text-[11px] text-muted-foreground", LINE)}>
            {["Sprint", "Planned", "Done", "Carry-over"].map((heading) => (
              <span key={heading}>{heading}</span>
            ))}
          </div>
          {VELOCITY.map((row) => (
            <div key={row[0]} className={cn("grid grid-cols-4 border-b px-3 py-1.5 tabular-nums text-foreground/85 last:border-b-0", LINE)}>
              {row.map((cell, index) => (
                <span key={index}>{cell}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute top-[318px] left-[326px] flex w-[220px] items-center gap-3 rounded-xl border border-foreground/[0.1] bg-surface-card px-4 py-3 shadow-sm shadow-black/5 dark:bg-surface-subtle">
          <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 text-foreground">
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" strokeDasharray="70 94.2" />
          </svg>
          <div>
            <div className="text-[11px] text-muted-foreground">Timer · Actions</div>
            <div className="text-[20px] font-medium tabular-nums">04:59</div>
          </div>
        </div>

        <div className="absolute top-[290px] left-[86px] w-[220px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle">
          <div className="flex items-center gap-2 font-medium">
            <FileText className="size-3.5 text-muted-foreground" /> Sprint 42 retro notes
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {[92, 78, 86, 60, 72].map((width) => (
              <span key={width} className="block h-1.5 rounded-full bg-foreground/[0.08]" style={{ width: `${width}%` }} />
            ))}
          </div>
        </div>

        <div className="absolute top-[352px] left-[910px] flex flex-col items-center gap-1">
          {[0.15, 0.3, 0.5, 0.75].map((opacity, index) => (
            <span key={index} className="size-2 rounded-full bg-red-500" style={{ opacity, translate: `${index * -10}px ${index * 8}px` }} />
          ))}
          <span className="size-3 rounded-full bg-red-500 shadow-[0_0_12px_2px] shadow-red-500/60" style={{ translate: "-42px 26px" }} />
        </div>

        <Cursor name="Jonas" className="top-[214px] left-[700px]" />
        <Cursor name="Danielle" className="top-[430px] left-[470px]" delay="-2.5s" />
      </div>
    </Window>
  );
}

// Showcase panel: the meeting docked under the board's top bar, with a shared screen and a filmstrip.
export function VideoStageRender() {
  return (
    <Window className="h-[440px] w-[680px]">
      <BoardBar title="Atlas Coffee — rebrand plan" people={["Danielle", "Jonas", "Marco", "Grace"]} />
      <div className={cn("flex gap-2.5 border-b bg-foreground/[0.03] p-3", LINE)}>
        <div className="relative flex-1 overflow-hidden rounded-lg border border-foreground/[0.1] bg-background">
          <div className="absolute top-2 left-2 z-[1] flex items-center gap-1.5 rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-medium text-background">
            <MonitorUp className="size-3" /> Danielle is presenting
          </div>
          <div className="flex h-[188px] gap-3 p-4 pt-9" style={CANVAS_DOTS}>
            <div className="w-1/2 rounded-md border border-foreground/[0.1] bg-surface-card p-2.5 dark:bg-surface-subtle">
              <div className="h-2 w-2/3 rounded-full bg-foreground/25" />
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index} className="aspect-square rounded bg-foreground/[0.08]" />
                ))}
              </div>
            </div>
            <div className="flex w-1/2 flex-col gap-2">
              <span className="h-2 w-3/4 rounded-full bg-foreground/20" />
              <span className="h-2 w-1/2 rounded-full bg-foreground/10" />
              <span className="mt-1 h-14 rounded-md border border-dashed border-foreground/15" />
              <span className="h-2 w-2/3 rounded-full bg-foreground/10" />
            </div>
          </div>
        </div>
        <div className="flex w-[124px] flex-col gap-2">
          {["Danielle", "Jonas", "Marco"].map((name, index) => (
            <div key={name} className={cn("relative flex h-[58px] items-center justify-center rounded-lg border bg-foreground/[0.06]", index === 0 ? "border-foreground/40" : "border-foreground/[0.08]")}>
              <Avatar name={name} size={28} />
              <span className="absolute bottom-1 left-1.5 text-[10px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-3 py-2", LINE)}>
        {[Mic, Video, MonitorUp, Hand].map((Icon, index) => (
          <span key={index} className={cn("flex size-8 items-center justify-center rounded-lg border", index === 2 ? "border-foreground/20 bg-foreground text-background" : "border-foreground/[0.1] text-foreground/80")}>
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        ))}
        <span className="ml-2 flex h-8 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-2.5 text-[12px] text-foreground/80">
          <Copy className="size-3.5" /> Copy meeting code
        </span>
        <span className="ml-auto flex h-8 items-center rounded-lg bg-red-500 px-3 text-[12px] font-medium text-white">Leave</span>
      </div>
      <div className="relative flex-1" style={CANVAS_DOTS}>
        <div className="absolute top-4 left-6 w-[180px]">
          <NoteCard className="text-[12px]">Moodboard: warm neutrals, hand-drawn type</NoteCard>
        </div>
        <div className="absolute top-4 left-[220px] w-[160px]">
          <NoteCard className="text-[12px]">Packaging round two</NoteCard>
        </div>
      </div>
    </Window>
  );
}

const AI_ACTIONS = ["Summarize", "Cluster", "Brainstorm", "Action items", "Custom"];
const SPAWNED = ["Cap creative reviews at two rounds", "Share handoff notes by Thursday", "Book the Kestrel launch retro"];

export function AiCardRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[470px] overflow-hidden rounded-xl" style={CANVAS_DOTS}>
      <div className="absolute top-3 left-3 w-[262px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] shadow-lg shadow-black/10 dark:bg-surface-subtle">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <Sparkles className="size-3.5 text-muted-foreground" /> AI assistant
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {AI_ACTIONS.map((action) => (
            <span key={action} className={cn("rounded-full border px-2 py-0.5 text-[11px]", action === "Action items" ? "border-foreground/30 bg-foreground/[0.08] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
              {action}
            </span>
          ))}
        </div>
        <ul className="mt-3 flex flex-col gap-1.5 text-foreground/85">
          {SPAWNED.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-3.5 flex h-7 w-fit items-center rounded-md bg-foreground px-2.5 font-medium text-background">Spawn as notes</span>
      </div>
      {SPAWNED.map((item, index) => (
        <div key={item} className={cn("absolute right-3 w-[170px]", styles.popIn)} style={{ top: 20 + index * 86, "--pop-delay": `${0.6 + index * 0.25}s`, rotate: `${[-1.5, 1, -0.5][index]}deg` }}>
          <NoteCard className="text-[12px]">{item}</NoteCard>
        </div>
      ))}
    </div>
  );
}

const MORE_TOOLS = [
  [Type, "Text"],
  [Shapes, "Shape"],
  [Sticker, "Sticker"],
  [AppWindow, "Embed"],
  [Film, "Media"],
  [Code, "Code"],
  [Timer, "Timer"],
  [Vote, "Poll"],
  [Gauge, "Progress"],
  [ChartColumn, "Chart"],
  [User, "Person"],
  [Palette, "Palette"],
  [Network, "Mind map"],
  [Workflow, "Mermaid diagram"],
  [Sigma, "Formula"],
  [Sparkles, "AI assistant"],
  [Copy, "Mirror"],
  [Headphones, "Huddle"],
];

export function ToolsRender() {
  return (
    <div className="mx-auto w-[470px] rounded-xl border border-foreground/[0.1] bg-surface-card p-2 text-[12px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
      <div className="px-2 pt-1 pb-2 text-[11px] text-muted-foreground">More tools</div>
      <div className="grid grid-cols-3 gap-1">
        {MORE_TOOLS.map(([Icon, label], index) => (
          <span key={label} className={cn("flex items-center gap-2 rounded-md px-2 py-[7px] text-foreground/85", index === 12 && "bg-foreground/[0.07] text-foreground")}>
            <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
