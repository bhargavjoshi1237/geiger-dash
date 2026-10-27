import {
  Archive,
  BarChart3,
  BookOpenText,
  Braces,
  Calendar,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Code2,
  DraftingCompass,
  FileClock,
  FileCode2,
  FileJson,
  FilePenLine,
  FileText,
  Fingerprint,
  GitCompareArrows,
  Hash,
  History,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  Library,
  Link2,
  List,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Network,
  PanelTop,
  Pilcrow,
  RadioTower,
  RefreshCcw,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Split,
  Target,
  ToggleLeft,
  Type,
  UserCheck,
  UserCog,
  Blocks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Dot, LINE, MonoLabel } from "@/components/product-pages/mock_kit";

// Shared pieces for the Geiger Content tour: Atlas Coffee's workspace sidebar, entry statuses, field types, code panes and drawn art.

// Content's five entry statuses, each on the tone it means: emerald live, amber waiting on someone, greys otherwise.
export const STATUS_TONES = { Published: "emerald", "In review": "amber", Scheduled: "strong", Draft: "neutral", Archived: "neutral" };

// A status as a dot and its name, for table cells.
export function StatusLabel({ status, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap text-muted-foreground", className)}>
      <Dot tone={STATUS_TONES[status]} />
      {status}
    </span>
  );
}

// A status in a soft pill, for headers and menus.
export function StatusPill({ status, className }) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.1] bg-foreground/[0.03] px-2.5 text-[12px] whitespace-nowrap text-foreground/85", className)}>
      <Dot tone={STATUS_TONES[status]} />
      {status}
    </span>
  );
}

// The nine data types a field can take, with the icon each one wears in the renders.
export const FIELD_TYPES = {
  Text: Type,
  Number: Hash,
  Boolean: ToggleLeft,
  Date: Calendar,
  Reference: Link2,
  "Rich text": Pilcrow,
  Enum: List,
  JSON: Braces,
  Media: ImageIcon,
};

// A field's data type as a tag with its icon.
export function TypeTag({ type, className }) {
  const Icon = FIELD_TYPES[type];
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-md border border-foreground/[0.1] bg-foreground/[0.03] px-2 text-[12px] whitespace-nowrap text-foreground/85", className)}>
      {Icon ? <Icon className="size-3 text-muted-foreground" strokeWidth={2} /> : null}
      {type}
    </span>
  );
}

// GET reads in emerald like a live route; POST stays neutral.
export function Method({ verb = "GET", className }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded px-1.5 font-mono text-[10px] font-semibold tracking-wide",
        verb === "GET" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-foreground/[0.08] text-foreground/80",
        className,
      )}
    >
      {verb}
    </span>
  );
}

// One line of a JSON or HTTP pane: keys in the foreground, values and punctuation a step back; `mark` highlights a line.
export function CodeLine({ text, depth = 0, mark, className }) {
  const match = /^("[^"]+":)(.*)$/.exec(text);
  return (
    <div
      className={cn("whitespace-pre", mark === "add" && "bg-emerald-500/[0.08]", mark === "focus" && "bg-foreground/[0.05]", className)}
      style={{ paddingLeft: depth * 14 }}
    >
      {match ? (
        <>
          <span className="text-foreground/85">{match[1]}</span>
          <span className="text-muted-foreground">{match[2]}</span>
        </>
      ) : (
        <span className="text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

// A stack of code lines from [text, depth, mark] tuples.
export function CodeBlock({ lines, className }) {
  return (
    <div className={cn("font-mono text-[12px] leading-[1.7]", className)}>
      {lines.map(([text, depth, mark], index) => (
        <CodeLine key={index} text={text} depth={depth} mark={mark} />
      ))}
    </div>
  );
}

const NAV = [
  { title: "Overview", icon: LayoutDashboard },
  {
    title: "Content",
    icon: BookOpenText,
    items: [
      ["All Content", Library],
      ["Drafts", FilePenLine],
      ["Pages", PanelTop],
      ["Content Slots", Blocks],
      ["Scheduled", CalendarClock],
      ["Archived", Archive],
    ],
  },
  {
    title: "Architecture",
    icon: DraftingCompass,
    items: [
      ["Content Types", FileJson],
      ["Field Schemas", Braces],
      ["References", Link2],
      ["Validation Rules", CheckCheck],
    ],
  },
  {
    title: "Editorial",
    icon: FileText,
    items: [
      ["Structured Editor", FilePenLine],
      ["Comments & Mentions", MessageSquareText],
      ["Assignments", UserCheck],
      ["Review Queue", ClipboardCheck],
      ["Version History", History],
      ["Compare & Rollback", GitCompareArrows],
      ["AI Assistant", Sparkles],
    ],
  },
  {
    title: "Publishing",
    icon: Rocket,
    items: [
      ["Publishing Queue", ListChecks],
      ["Delivery APIs", RadioTower],
      ["Cache Invalidation", RefreshCcw],
      ["Publishing History", FileClock],
    ],
  },
  {
    title: "Governance",
    icon: ShieldCheck,
    items: [
      ["Roles", UserCog],
      ["Permissions", LockKeyhole],
      ["Consent & Privacy", Fingerprint],
      ["Audit Logs", FileClock],
    ],
  },
  {
    title: "Developers",
    icon: Code2,
    items: [
      ["API Explorer", FileCode2],
      ["REST API", Braces],
      ["API Tokens", KeyRound],
    ],
  },
  {
    title: "Personalization",
    icon: Target,
    items: [
      ["Content Variants", Split],
      ["Targeting Rules", SlidersHorizontal],
    ],
  },
  {
    title: "Intelligence",
    icon: ChartNoAxesCombined,
    items: [
      ["Content Performance", BarChart3],
      ["Semantic Search", Search],
      ["AI Tag Suggestions", Sparkles],
      ["Duplicate Detection", GitCompareArrows],
      ["Knowledge Graph", Network],
    ],
  },
];

// Atlas Coffee's workspace sidebar with one section open and one screen in focus.
export function ContentSidebar({ open, active, className }) {
  return (
    <div className={cn("flex w-[220px] shrink-0 flex-col border-r py-3", LINE, className)}>
      <div className="flex items-center gap-2 px-4 pb-3">
        <AppMark id="content" size={22} />
        <span className="font-medium">Atlas Coffee</span>
        <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-px px-2">
        {NAV.map((group) => {
          const Icon = group.icon;
          const isOpen = group.title === open;
          return (
            <div key={group.title}>
              <div className={cn("flex items-center gap-2 rounded-md px-2 py-[5px]", isOpen ? "text-foreground" : "text-foreground/70")}>
                <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                <span className="truncate">{group.title}</span>
                {group.items ? (
                  isOpen ? <ChevronDown className="ml-auto size-3 text-muted-foreground" /> : <ChevronRight className="ml-auto size-3 text-muted-foreground/70" />
                ) : null}
              </div>
              {isOpen ? (
                <div className="ml-[15px] flex flex-col gap-px border-l border-foreground/[0.08] py-0.5 pl-2">
                  {group.items.map(([title, ItemIcon]) => (
                    <div key={title} className={cn("flex items-center gap-2 rounded-md px-2 py-[5px] text-[12px]", title === active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/65")}>
                      <ItemIcon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                      <span className="truncate">{title}</span>
                    </div>
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

// A screen header in the app's style: title and description over a hairline, actions on the right.
export function ScreenHead({ title, description, actions, className }) {
  return (
    <div className={cn("flex items-end gap-4 border-b px-6 pt-5 pb-4", LINE, className)}>
      <div className="min-w-0">
        <div className="text-[19px] font-medium tracking-[-0.02em]">{title}</div>
        {description ? <div className="mt-1 truncate text-[12px] text-muted-foreground">{description}</div> : null}
      </div>
      {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

// The app's StatsBar: one card, divider-separated stats with a label, a figure and a footer.
export function StatsRow({ stats, className }) {
  return (
    <div className={cn("grid overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]", className)} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={cn("px-4 py-3", index > 0 && "border-l", LINE)}>
          <MonoLabel className="text-[10px]">{stat.label}</MonoLabel>
          <div className="mt-1 text-[20px] font-medium tracking-[-0.02em] tabular-nums">{stat.value}</div>
          {stat.footer ? <div className="truncate text-[11px] text-muted-foreground">{stat.footer}</div> : null}
        </div>
      ))}
    </div>
  );
}

// The app's filled primary button.
export function PrimaryButton({ children, icon: Icon, className }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[12px] font-medium text-background", className)}>
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

// The app's outlined secondary button.
export function GhostButton({ children, icon: Icon, className }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-3 text-[12px] text-foreground/80", className)}>
      {Icon ? <Icon className="size-3.5 text-muted-foreground" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

// A labelled input the way the app's Field + Input pair draws it.
export function Input({ label, hint, children, mono = false, invalid = false, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">{label}</div> : null}
      <div
        className={cn(
          "flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-foreground/[0.02] px-3 text-foreground/90",
          invalid ? "border-red-500/50" : "border-foreground/[0.1]",
          mono && "font-mono text-[12px]",
        )}
      >
        {children}
      </div>
      {hint ? <div className={cn("mt-1.5 text-[11px]", invalid ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>{hint}</div> : null}
    </div>
  );
}

// A closed select: the chosen value with a chevron.
export function Select({ label, children, className }) {
  return (
    <Input label={label} className={className}>
      <span className="truncate">{children}</span>
      <ChevronDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
    </Input>
  );
}

// Terraced hillside with drying beds, drawn in the palette's greys: the cover for an origin.
export function OriginArt({ className }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="320" height="200" fill="currentColor" fillOpacity="0.05" />
      <circle cx="242" cy="54" r="22" fill="currentColor" fillOpacity="0.14" />
      <path d="M0 96 C 60 62 120 70 170 88 S 270 64 320 76 V200 H0Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M0 122 C 70 98 150 104 210 118 S 290 104 320 110 V200 H0Z" fill="currentColor" fillOpacity="0.13" />
      {[0, 1, 2, 3].map((row) => (
        <path key={row} d={`M0 ${140 + row * 12} C 80 ${128 + row * 12} 200 ${134 + row * 12} 320 ${130 + row * 12}`} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
      ))}
      <path d="M0 150 C 90 136 210 142 320 138 V200 H0Z" fill="currentColor" fillOpacity="0.16" />
      {[24, 58, 92, 126, 160, 194, 228, 262, 296].map((x, index) => (
        <circle key={x} cx={x} cy={112 + (index % 3) * 4} r="5" fill="currentColor" fillOpacity="0.22" />
      ))}
      {[0, 1, 2].map((bed) => (
        <g key={bed}>
          <rect x={30 + bed * 96} y={170} width="76" height="9" rx="2" fill="currentColor" fillOpacity="0.32" />
          <line x1={36 + bed * 96} y1={179} x2={36 + bed * 96} y2={192} stroke="currentColor" strokeOpacity="0.3" />
          <line x1={100 + bed * 96} y1={179} x2={100 + bed * 96} y2={192} stroke="currentColor" strokeOpacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

// A pour-over dripper over a cup, for the brewing article's cover.
export function PourOverArt({ className }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="320" height="200" fill="currentColor" fillOpacity="0.05" />
      <ellipse cx="160" cy="182" rx="120" ry="10" fill="currentColor" fillOpacity="0.07" />
      <path d="M112 46 H208 L184 104 H136Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M118 46 H202" stroke="currentColor" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
      <rect x="146" y="104" width="28" height="8" rx="2" fill="currentColor" fillOpacity="0.28" />
      <path d="M160 112 V128" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 4" />
      <path d="M118 128 H202 V160 a24 24 0 0 1 -24 24 H142 a24 24 0 0 1 -24 -24Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M202 136 a14 14 0 0 1 0 28" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="5" />
      <path d="M232 30 c-10 12 10 18 0 30" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
