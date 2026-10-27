import {
  AlignLeft,
  AtSign,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronDownSquare,
  CircleDot,
  Clock,
  DollarSign,
  EyeOff,
  FileText,
  FunctionSquare,
  Gauge,
  Grid2x2Check,
  Grid3x3,
  Hash,
  Heading,
  Image as ImageIcon,
  Images,
  Link2,
  ListChecks,
  ListOrdered,
  MapPin,
  Package,
  Paperclip,
  PenLine,
  Phone,
  Quote,
  Receipt,
  Repeat,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  SplitSquareVertical,
  SquarePlay,
  Star,
  Type,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot } from "@/components/product-pages/mock_kit";

// Shared pieces for the Geiger Forms tour: Brightloop's forms, the real field palette and the inbox's status vocabulary.

export const CARD = "rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle";
export const POPOVER = "rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";

// The builder palette as Geiger Forms ships it: 36 field types in 8 groups.
export const FIELD_GROUPS = [
  {
    group: "Basic",
    fields: [
      ["Short text", AlignLeft],
      ["Long text", Type],
      ["Email", AtSign],
      ["Phone", Phone],
      ["Website URL", Link2],
      ["Number", Hash],
      ["Currency", DollarSign],
    ],
  },
  {
    group: "Choice",
    fields: [
      ["Single choice", CircleDot],
      ["Dropdown", ChevronDownSquare],
      ["Multiple choice", ListChecks],
      ["Picture choice", Images],
      ["Multiple picture choice", Grid2x2Check],
      ["Checkbox (yes/no)", CheckSquare],
      ["Ranking", ListOrdered],
    ],
  },
  {
    group: "Date & time",
    fields: [
      ["Date", Calendar],
      ["Time", Clock],
      ["Date & time", CalendarClock],
      ["Booking slot", CalendarDays],
    ],
  },
  {
    group: "Survey",
    fields: [
      ["Star rating", Star],
      ["Linear scale", SlidersHorizontal],
      ["NPS (0–10)", Gauge],
      ["Opinion scale", Smile],
      ["Matrix / Likert", Grid3x3],
    ],
  },
  {
    group: "Contact",
    fields: [
      ["Full name", User],
      ["Address", MapPin],
    ],
  },
  {
    group: "Advanced",
    fields: [
      ["File upload", Paperclip],
      ["Signature", PenLine],
      ["Consent", ShieldCheck],
      ["Repeating group", Repeat],
      ["Hidden field", EyeOff],
      ["Calculated", FunctionSquare],
    ],
  },
  {
    group: "Payments",
    fields: [
      ["Product", Package],
      ["Order total", Receipt],
    ],
  },
  {
    group: "Layout",
    fields: [
      ["Section heading", Heading],
      ["Text block", FileText],
      ["Statement", Quote],
      ["Image", ImageIcon],
      ["Video", SquarePlay],
      ["Page break", SplitSquareVertical],
    ],
  },
];

export const FIELD_ICON = Object.fromEntries(FIELD_GROUPS.flatMap(({ fields }) => fields));

const STATUS_TONES = {
  Published: "emerald",
  Complete: "emerald",
  Approved: "emerald",
  Paid: "emerald",
  Delivered: "emerald",
  "Needs review": "amber",
  Pending: "amber",
  "In progress": "amber",
  Unpaid: "amber",
  Retrying: "amber",
  "Awaiting payment": "strong",
  Rejected: "red",
  Failed: "red",
  Refunded: "neutral",
  Canceled: "neutral",
  Spam: "neutral",
  High: "red",
  Medium: "amber",
  Low: "neutral",
};

// A status, priority or payment state the way the inbox shows it: a coloured dot and its label.
export function StatusDot({ status, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-foreground/85", className)}>
      <Dot tone={STATUS_TONES[status] ?? "neutral"} />
      {status}
    </span>
  );
}

// The response score, as the inbox shows it beside the priority.
export function ScoreBadge({ score, className }) {
  return <span className={cn("inline-flex h-5 items-center rounded-md bg-foreground/[0.06] px-1.5 text-[11px] font-medium text-foreground/75 tabular-nums", className)}>{score}</span>;
}

// A response tag.
export function Tag({ children, className }) {
  return <span className={cn("rounded border border-foreground/10 px-1.5 text-[11px] leading-5 whitespace-nowrap text-muted-foreground", className)}>{children}</span>;
}

// A settings switch, on unless told otherwise.
export function Toggle({ on = true, className }) {
  return (
    <span className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5", on ? "bg-foreground" : "bg-foreground/15", className)}>
      <span className={cn("size-4 rounded-full bg-background", on && "ml-auto")} />
    </span>
  );
}

// A closed select showing its current value.
export function Select({ children, className }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.12] bg-foreground/[0.03] px-2.5 text-[12px] whitespace-nowrap", className)}>
      <span className="min-w-0 truncate">{children}</span>
      <ChevronDown className="ml-auto size-3 shrink-0 text-muted-foreground" />
    </span>
  );
}

// A segmented control or tab list with one option selected.
export function Segmented({ options, active = 0, className }) {
  return (
    <span className={cn("inline-flex rounded-lg bg-foreground/[0.05] p-0.5 text-[12px]", className)}>
      {options.map((option, index) => (
        <span key={option} className={cn("rounded-md px-2.5 py-1 whitespace-nowrap", index === active ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
          {option}
        </span>
      ))}
    </span>
  );
}

// A text field with its value already filled in.
export function Input({ children, mono = false, className }) {
  return (
    <span className={cn("flex h-8 items-center gap-2 rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 text-[12px] text-foreground/90 dark:bg-foreground/[0.03]", mono && "font-mono text-[11px]", className)}>
      {children}
    </span>
  );
}

// Brightloop's loop mark, drawn in the palette's greys.
export function BrightloopMark({ size = 20, className }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-[6px] bg-foreground text-background", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 20 20" style={{ width: size * 0.66, height: size * 0.66 }} fill="none" aria-hidden="true">
        <path d="M6.2 13.6a3.6 3.6 0 1 1 0-7.2c2.4 0 3.6 3.6 3.8 3.6s1.4-3.6 3.8-3.6a3.6 3.6 0 1 1 0 7.2c-2.4 0-3.6-3.6-3.8-3.6s-1.4 3.6-3.8 3.6Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

// An abstract arts-fund cover: soft light, overlapping arcs and brush dots in foreground tints.
export function ArtCover({ className, children }) {
  return (
    <div className={cn("relative overflow-hidden bg-foreground/[0.06]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_82%_0%,color-mix(in_oklab,var(--foreground)_20%,transparent),transparent_70%)]" />
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-foreground" aria-hidden="true">
        <circle cx="318" cy="96" r="70" fill="currentColor" fillOpacity="0.06" />
        <circle cx="262" cy="40" r="44" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
        <path d="M150 150c30-60 80-90 140-84s92 46 120 40" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M200 160c26-38 64-56 104-52s70 30 96 26" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="8" strokeLinecap="round" />
        {[
          [348, 30, 3],
          [364, 54, 2],
          [300, 128, 2.5],
          [226, 90, 2],
          [380, 112, 3.5],
        ].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" fillOpacity="0.35" />
        ))}
      </svg>
      {children}
    </div>
  );
}

// Brightloop's Spring Grants applications, used across the inbox, approvals and analytics renders.
export const APPLICATIONS = [
  { name: "Zara Patel", email: "zara.patel@fieldnote.studio", project: "Murals for the Eastside underpass", status: "Needs review", priority: "High", score: 44, tags: ["public art"], assignee: "Mia Johansson", time: "4m" },
  { name: "Kofi Asante", email: "kofi@asante-sound.org", project: "Free drumming circles for teens", status: "Pending", priority: "High", score: 41, tags: ["youth", "music"], assignee: "Ravi Menon", time: "38m" },
  { name: "Leah Mensah", email: "leah.mensah@northwind.io", project: "Community darkroom reopening", status: "In progress", priority: "Medium", score: 33, tags: ["photography"], assignee: "Noah Fischer", time: "2h" },
  { name: "Hana Ito", email: "hana@itoprint.jp", project: "Risograph zine library", status: "Approved", priority: "Medium", score: 29, tags: ["print"], assignee: "Elena Rossi", time: "5h" },
  { name: "Theo Lindqvist", email: "theo@lindqvist.se", project: "Pop-up chamber concerts", status: "Complete", priority: "Low", score: 18, tags: ["music"], assignee: "Mia Johansson", time: "1d" },
  { name: "Ines Duarte", email: "ines@duarte.pt", project: "Ceramics studio for seniors", status: "Rejected", priority: "Low", score: 12, tags: ["craft"], assignee: "", time: "1d" },
  { name: "Samuel Okoro", email: "samuel@okoro.ng", project: "Storytelling nights in the library", status: "Approved", priority: "Medium", score: 27, tags: ["literature"], assignee: "Ravi Menon", time: "2d" },
  { name: "Clara Vidal", email: "clara@vidal.es", project: "Dance workshops in the park", status: "Needs review", priority: "Medium", score: 31, tags: ["dance"], assignee: "", time: "2d" },
];
