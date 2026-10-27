import {
  BarChart3,
  Calendar,
  ChartColumnBig,
  CheckSquare,
  ChevronRight,
  CircleCheck,
  Clapperboard,
  Clock,
  Columns2,
  Contact,
  FileCode2,
  FileText,
  Goal,
  Headset,
  Image,
  Info,
  LayoutDashboard,
  Link,
  MessageSquare,
  MoreHorizontal,
  Network,
  Palette,
  PanelsTopLeft,
  PenTool,
  ScanEye,
  Settings,
  Shapes,
  Sigma,
  Sparkles,
  Sticker,
  StickyNote,
  Table,
  Timer,
  TriangleAlert,
  Type,
  Upload,
  Users2,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, LINE, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Notes pieces for the /apps/notes tour: Fieldnote's boards, the top bar, the tool rail, cards, live cursors and the Collaborate dialog.

// The toolbar as it ships: sixteen tools, with the other fifteen under More.
export const TOOLBAR = [
  [StickyNote, "Note"],
  [Link, "Link"],
  [CheckSquare, "To-do"],
  [FileText, "Document"],
  [LayoutDashboard, "Board"],
  [Columns2, "Column"],
  [MessageSquare, "Comment"],
  [Table, "Table"],
  [Calendar, "Calendar"],
  [Clock, "Clock"],
  [Image, "Image"],
  [Upload, "Upload"],
  [PenTool, "Draw"],
  [Type, "Text"],
  [Shapes, "Shape"],
  [Sticker, "Sticker"],
];

export const MORE_TOOLS = [
  [PanelsTopLeft, "Embed"],
  [Clapperboard, "Media"],
  [FileCode2, "Code"],
  [Timer, "Timer"],
  [BarChart3, "Poll"],
  [Goal, "Progress"],
  [ChartColumnBig, "Chart"],
  [Contact, "Person"],
  [Palette, "Palette"],
  [Network, "Mind map"],
  [Workflow, "Mermaid diagram"],
  [Sigma, "Formula"],
  [Sparkles, "AI assistant"],
  [ScanEye, "Mirror"],
  [Headset, "Huddle"],
];

export const PANEL = "rounded-xl border border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";
export const CARD = "rounded-md border border-foreground/[0.1] bg-surface-card shadow-sm shadow-black/5";

export function Divider({ className }) {
  return <span className={cn("h-5 w-px shrink-0 bg-foreground/[0.1]", className)} />;
}

// The board's top bar: the Notes mark, breadcrumbs, then any live cluster, the clock, Collaborate and Settings (`tools` off hides those three).
export function NotesBar({ crumbs = [], children, live = false, tools = true, clock = "10:24" }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
      <AppMark id="notes" size={22} />
      <span className={cn("ml-1 border-l pl-3 font-semibold", LINE)}>Notes</span>
      {crumbs.map((crumb, index) => (
        <span key={crumb} className="flex min-w-0 items-center gap-2">
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/70" />
          <span className={cn("truncate", index === crumbs.length - 1 ? "font-medium" : "text-muted-foreground")}>{crumb}</span>
        </span>
      ))}
      <div className="ml-auto flex shrink-0 items-center gap-3 text-muted-foreground">
        {children ? (
          <>
            {children}
            {tools ? <Divider /> : null}
          </>
        ) : null}
        {tools ? (
          <>
            <span className="font-mono text-[12px] tabular-nums">{clock}</span>
            <Divider />
            <span className={cn("relative flex size-8 items-center justify-center rounded-lg", live && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")}>
              {live ? <span className={cn("absolute inset-1 rounded-md text-emerald-500", styles.pulse)} /> : null}
              <Users2 className="relative size-4" strokeWidth={2} />
            </span>
            <Settings className="size-4" strokeWidth={1.75} />
          </>
        ) : null}
      </div>
    </div>
  );
}

// The 64px rail down the left of every board; `active` is a toolbar index, `moreOpen` lights the More button.
export function ToolRail({ active = 0, moreOpen = false }) {
  return (
    <div className={cn("flex w-[52px] shrink-0 flex-col items-center gap-0.5 overflow-hidden border-r py-2.5", LINE)}>
      {TOOLBAR.map(([Icon, label], index) => (
        <span key={label} className={cn("flex size-[30px] shrink-0 items-center justify-center rounded-lg text-muted-foreground", index === active && "bg-foreground/[0.08] text-foreground")}>
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      ))}
      <span className="my-1.5 h-px w-6 shrink-0 bg-foreground/[0.1]" />
      <span className={cn("flex size-[30px] shrink-0 items-center justify-center rounded-lg text-muted-foreground", moreOpen && "bg-foreground/[0.08] text-foreground")}>
        <MoreHorizontal className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}

// The dotted ground every card sits on.
export function Board({ className, children }) {
  return (
    <div className={cn("relative min-w-0 flex-1 overflow-hidden bg-foreground/[0.015]", className)} style={CANVAS_DOTS}>
      {children}
    </div>
  );
}

// A whole Notes screen: top bar, tool rail and the board.
export function NotesWindow({ crumbs, bar, rail = true, activeTool, moreOpen, className, boardClassName, children }) {
  return (
    <Window className={className}>
      {bar ?? <NotesBar crumbs={crumbs} />}
      <div className="flex min-h-0 flex-1">
        {rail ? <ToolRail active={activeTool} moreOpen={moreOpen} /> : null}
        <Board className={boardClassName}>{children}</Board>
      </div>
    </Window>
  );
}

// A card placed on the board at `at` = [left, top].
export function Node({ at = [0, 0], w, h, selected = false, className, style, children }) {
  return (
    <div
      className={cn("absolute", CARD, selected && "border-foreground/40 ring-1 ring-foreground/30", className)}
      style={{ left: at[0], top: at[1], width: w, height: h, ...style }}
    >
      {children}
    </div>
  );
}

// A plain note card.
export function Note({ at, w = 180, selected, className, style, children }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("px-3 py-2.5 text-[12px] leading-[1.45] text-foreground/90", className)} style={style}>
      {children}
    </Node>
  );
}

function Check({ done }) {
  return (
    <span className={cn("mt-px flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border", done ? "border-emerald-500 bg-emerald-500" : "border-foreground/30")}>
      {done ? (
        <svg viewBox="0 0 10 10" className="size-2.5">
          <path d="M2.2 5.2 4.1 7l3.7-3.9" stroke="var(--background)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export function TodoLine({ text, done, className }) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Check done={done} />
      <span className={cn("leading-[1.35]", done ? "text-muted-foreground line-through decoration-foreground/30" : "text-foreground/90")}>{text}</span>
    </div>
  );
}

// A to-do card; items are [text, done] pairs.
export function TodoCard({ at, w = 220, items, selected, className }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("flex flex-col gap-2 px-3 py-3 text-[12px]", className)}>
      {items.map(([text, done]) => (
        <TodoLine key={text} text={text} done={done} />
      ))}
    </Node>
  );
}

// A column card: a titled stack of smaller cards; items are strings or [text, done] to-dos.
export function Column({ at, w = 210, title, items, selected, className, children }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("bg-surface-subtle p-2 text-[12px] dark:bg-surface-card", className)}>
      <div className="flex items-center gap-2 px-1 pt-0.5 pb-2">
        <Columns2 className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="truncate text-[12.5px] font-medium">{title}</span>
        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">
          {items.length + (children ? 1 : 0)} cards
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={Array.isArray(item) ? item[0] : item} className="rounded-[5px] border border-foreground/[0.08] bg-surface-card px-2.5 py-2 leading-[1.4] text-foreground/90 dark:bg-foreground/[0.04]">
            {Array.isArray(item) ? <TodoLine text={item[0]} done={item[1]} /> : item}
          </div>
        ))}
        {children}
      </div>
    </Node>
  );
}

// A table card: a header row and plain cells, figures right-aligned.
export function TableCard({ at, w = 300, columns, rows, numeric = [], selected, className }) {
  const template = { gridTemplateColumns: columns.map((_, index) => (index === 0 ? "1.4fr" : "1fr")).join(" ") };
  return (
    <Node at={at} w={w} selected={selected} className={cn("overflow-hidden text-[12px]", className)}>
      <div className={cn("grid border-b bg-foreground/[0.03] font-semibold", LINE)} style={template}>
        {columns.map((column, index) => (
          <span key={column} className={cn("truncate px-2.5 py-1.5 text-[11.5px]", index > 0 && "border-l border-foreground/[0.07]", numeric.includes(index) && "text-right")}>
            {column}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row[0]} className={cn("grid border-b last:border-b-0", LINE)} style={template}>
          {row.map((cell, index) => (
            <span
              key={index}
              className={cn("truncate px-2.5 py-1.5 text-foreground/85", index > 0 && "border-l border-foreground/[0.07]", numeric.includes(index) && "text-right tabular-nums")}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </Node>
  );
}

// A board card: a sub-board you double-click to open.
export function BoardTile({ at, w = 230, label, caption = "Double click to open", icon: Icon = LayoutDashboard, selected, className }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("flex items-center gap-3 px-3 py-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.07] text-foreground/80">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium">{label}</span>
        <span className="block truncate text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{caption}</span>
      </span>
    </Node>
  );
}

// A document card with its title and the first lines of the page.
export function DocCard({ at, w = 210, title, lines = [92, 78, 86, 60], className }) {
  return (
    <Node at={at} w={w} className={cn("p-3 text-[12px]", className)}>
      <div className="flex items-center gap-2 font-medium">
        <FileText className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="truncate">{title}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {lines.map((width, index) => (
          <span key={index} className="block h-1.5 rounded-full bg-foreground/[0.08]" style={{ width: `${width}%` }} />
        ))}
      </div>
    </Node>
  );
}

// A comment card signed by its author.
export function CommentCard({ at, w = 220, name, children, className }) {
  return (
    <Node at={at} w={w} className={cn("p-3 text-[12px]", className)}>
      <div className="flex items-center gap-2">
        <Avatar name={name} size={18} />
        <span className="font-medium">{name}</span>
        <MessageSquare className="ml-auto size-3.5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <p className="mt-2 leading-[1.45] text-foreground/85">{children}</p>
    </Node>
  );
}

// Connectors between cards: `paths` are SVG path strings in board coordinates.
export function Wires({ paths, className }) {
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full overflow-visible text-foreground", className)}>
      <defs>
        <marker id="notes-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" fillOpacity="0.5" />
        </marker>
      </defs>
      {paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          fill="none"
          stroke="currentColor"
          strokeOpacity={path.strong ? 0.5 : 0.32}
          strokeWidth="1.5"
          strokeDasharray={path.dashed ? "4 5" : undefined}
          markerEnd={path.arrow ? "url(#notes-arrow)" : undefined}
          className={path.flow ? styles.flow : undefined}
        />
      ))}
    </svg>
  );
}

const CURSOR_TAGS = ["bg-foreground text-background", "bg-foreground/80 text-background", "bg-foreground/60 text-background", "border border-foreground/25 bg-surface-card text-foreground"];

// A teammate's live cursor with their name tag; leave `name` off for your own pointer.
export function Cursor({ at, name, tone = 0, delay = "0s", className }) {
  return (
    <div className={cn("absolute z-[6] flex items-start", styles.float, className)} style={{ left: at[0], top: at[1], animationDelay: delay }}>
      <svg width="16" height="18" viewBox="0 0 16 18" className="shrink-0 drop-shadow-sm">
        <path d="M1 1 L1 15 L5 11.2 L7.8 17 L10.2 15.9 L7.4 10.2 L13 10.2 Z" className="fill-foreground stroke-background" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      {name ? <span className={cn("mt-3 -ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", CURSOR_TAGS[tone])}>{name}</span> : null}
    </div>
  );
}

// Points along an ellipse, for laser trails that circle a card.
export function arcPoints(cx, cy, rx, ry, from, to, steps = 18) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = from + ((to - from) * index) / steps;
    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry];
  });
}

// The laser pointer's fading trail, thin and faint at the tail, bright at the head.
export function LaserTrail({ points, className }) {
  const head = points[points.length - 1];
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 z-[5] size-full overflow-visible", className)}>
      {points.slice(1).map((point, index) => {
        const share = (index + 1) / (points.length - 1);
        const previous = points[index];
        return (
          <line
            key={index}
            x1={previous[0].toFixed(1)}
            y1={previous[1].toFixed(1)}
            x2={point[0].toFixed(1)}
            y2={point[1].toFixed(1)}
            className="stroke-red-500"
            strokeOpacity={0.1 + share * 0.8}
            strokeWidth={1 + share * 3}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={head[0].toFixed(1)} cy={head[1].toFixed(1)} r="11" className="fill-red-500/20" />
      <circle cx={head[0].toFixed(1)} cy={head[1].toFixed(1)} r="4.5" className="fill-red-500" />
    </svg>
  );
}

// The floating status pills a session shows over the board.
export function SessionPill({ icon: Icon, dot = false, action, className, style, children }) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 rounded-full border border-foreground/[0.12] bg-surface-card py-1 pl-2.5 text-[12px] whitespace-nowrap shadow-xl shadow-black/20 dark:bg-surface-dialog",
        action ? "pr-1.5" : "pr-3",
        className,
      )}
      style={style}
    >
      {dot ? <span className="size-2 shrink-0 rounded-full bg-foreground/70" /> : Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} /> : null}
      <span>{children}</span>
      {action ? <span className="flex items-center gap-1 rounded-full bg-foreground/[0.06] px-2 py-0.5 font-medium text-muted-foreground">{action}</span> : null}
    </div>
  );
}

const TOAST_ICONS = {
  success: [CircleCheck, "text-emerald-600 dark:text-emerald-400"],
  info: [Info, "text-muted-foreground"],
  warning: [TriangleAlert, "text-amber-600 dark:text-amber-400"],
};

// A Sonner-style toast.
export function Toast({ tone = "success", title, body, className, style }) {
  const [Icon, tint] = TOAST_ICONS[tone];
  return (
    <div className={cn(PANEL, "flex w-[300px] items-start gap-2.5 px-3.5 py-3 text-[12.5px] shadow-xl", className)} style={style}>
      <Icon className={cn("mt-px size-4 shrink-0", tint)} strokeWidth={2} />
      <div className="min-w-0">
        <div className="font-medium text-foreground">{title}</div>
        {body ? <div className="mt-0.5 text-[12px] leading-[1.4] text-muted-foreground">{body}</div> : null}
      </div>
    </div>
  );
}

export function Switch({ on = false }) {
  return (
    <span className={cn("relative inline-flex h-[18px] w-8 shrink-0 rounded-full", on ? "bg-foreground" : "bg-foreground/[0.16]")}>
      <span className={cn("absolute top-[2px] size-3.5 rounded-full bg-background shadow-sm", on ? "left-[16px]" : "left-[2px]")} />
    </span>
  );
}

// The Collaborate dialog's tab sets: in a session you host, and on your own board.
export const SESSION_TABS = ["Session", "Members", "Meeting"];
export const BOARD_TABS = ["Host", "Members", "Meeting", "Join", "Merge"];

// The Collaborate dialog: title, the Live or Offline badge, tabs, the active tab's body and (unless `footer` is off) a Close button.
export function CollabDialog({ live = false, tabs = BOARD_TABS, active, footer = true, className, style, children }) {
  return (
    <div className={cn(PANEL, "flex w-[400px] flex-col overflow-hidden text-[13px]", className)} style={style}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Users2 className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Collaborate</span>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
            live ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-foreground/[0.1] text-muted-foreground",
          )}
        >
          <span className={cn("size-1.5 rounded-full", live ? cn("bg-emerald-500 text-emerald-500", styles.pulse) : "bg-foreground/40")} />
          {live ? "Live" : "Offline"}
        </span>
      </div>
      <div className={cn("flex border-b", LINE)}>
        {tabs.map((tab) => (
          <span
            key={tab}
            className={cn("flex-1 border-b-2 py-2.5 text-center text-[12.5px] font-medium", tab === active ? "border-foreground bg-foreground/[0.03] text-foreground" : "border-transparent text-muted-foreground")}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
      {footer ? (
        <div className={cn("flex justify-end border-t px-4 py-2.5", LINE)}>
          <span className="rounded-md px-3 py-1.5 text-[12px] text-muted-foreground">Close</span>
        </div>
      ) : null}
    </div>
  );
}

// A primary or quiet button as drawn inside dialogs and cards.
export function Button({ icon: Icon, primary = false, tone, className, children }) {
  const tones = {
    emerald: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-black",
    red: "bg-red-600 text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] font-medium whitespace-nowrap",
        tone ? tones[tone] : primary ? "bg-foreground text-background" : "border border-foreground/[0.12] text-foreground/85",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}
