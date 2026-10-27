import {
  AudioLines,
  Check,
  ChevronDown,
  FileText,
  Gauge,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Library,
  MessagesSquare,
  Network,
  Send,
  Settings,
  ShieldCheck,
  StickyNote,
  Video,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Shared pieces for the Geiger Grey tour: Kestrel Aero's knowledge bases and sources, status text, small controls and the app's sidebar.

export { Cite } from "@/components/product-pages/ai/grey_renders";

export const KIND_ICONS = { Document: FileText, Audio: AudioLines, Video, Image: ImageIcon, "Web page": Globe, Note: StickyNote };

export const KNOWLEDGE_BASES = ["Maintenance manuals", "Crew handbook", "IT service desk"];

export const SOURCES = [
  { name: "A320 line maintenance manual.pdf", kind: "Document", origin: "Upload", kb: "Maintenance manuals", size: "412 pages", status: "Ready", freshness: "Verified", added: "3 weeks ago" },
  { name: "De-icing procedure.docx", kind: "Document", origin: "Assets", kb: "Maintenance manuals", size: "18 pages", status: "Ready", freshness: "Review due", added: "2 months ago" },
  { name: "Fleet schedule Q4.xlsx", kind: "Document", origin: "Upload", kb: "Maintenance manuals", size: "1.8 MB", status: "Processing", freshness: "Not verified", added: "Just now" },
  { name: "Ramp safety briefing.mp4", kind: "Video", origin: "Assets", kb: "Maintenance manuals", size: "24:18", status: "Ready", freshness: "Verified", added: "5 days ago" },
  { name: "Hangar 2 layout.png", kind: "Image", origin: "Upload", kb: "Maintenance manuals", size: "2.4 MB", status: "Ready", freshness: "Verified", added: "1 week ago" },
  { name: "Engine run-up checklist", kind: "Note", origin: "Notes", kb: "Maintenance manuals", size: "12 KB", status: "Ready", freshness: "Not verified", added: "1 week ago" },
  { name: "Night shift handover.m4a", kind: "Audio", origin: "Upload", kb: "Maintenance manuals", size: "41:05", status: "Ready", freshness: "Not verified", added: "2 days ago" },
  { name: "Crew rostering policy", kind: "Web page", origin: "URL", kb: "Crew handbook", size: "48 KB", status: "Ready", freshness: "Stale", added: "4 months ago" },
];

const TONE_TEXT = {
  emerald: "text-emerald-700 dark:text-emerald-400",
  amber: "text-amber-700 dark:text-amber-300",
  red: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

const TONE_DOT = { emerald: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500", neutral: "bg-foreground/35" };

const TONE_PULSE = { emerald: "text-emerald-500", amber: "text-amber-500", red: "text-red-500", neutral: "text-foreground/40" };

const TONE_BADGE = {
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  red: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  neutral: "border-foreground/[0.1] bg-foreground/[0.04] text-foreground/75",
};

export const SOURCE_STATUS = { Pending: "neutral", Queued: "neutral", Processing: "amber", Ready: "emerald", Failed: "red" };
export const FRESHNESS = { Verified: "emerald", "Review due": "amber", Stale: "red", "Not verified": "neutral" };
export const RUN_STATUS = { Queued: "neutral", Running: "amber", Completed: "emerald", Failed: "red", Succeeded: "emerald", Cancelled: "neutral" };

// A dot and a label, the way Grey's StatusPill reads; `live` makes the dot pulse.
export function StatusText({ label, tone = "neutral", live = false, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap", TONE_TEXT[tone], className)}>
      <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone], live && cn(styles.pulse, TONE_PULSE[tone]))} />
      {label}
    </span>
  );
}

export function Badge({ tone = "neutral", className, style, children }) {
  return (
    <span className={cn("inline-flex h-5 shrink-0 items-center gap-1 rounded-full border px-2 text-[11px] font-medium whitespace-nowrap", TONE_BADGE[tone], className)} style={style}>
      {children}
    </span>
  );
}

export function KindTile({ kind, size = 28, className }) {
  const Icon = KIND_ICONS[kind] ?? FileText;
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.03]", className)} style={{ width: size, height: size }}>
      <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
    </span>
  );
}

export function Toggle({ on = false, className }) {
  return (
    <span className={cn("relative inline-flex h-[18px] w-8 shrink-0 rounded-full border", on ? "border-foreground bg-foreground" : "border-foreground/[0.12] bg-foreground/[0.08]", className)}>
      <span className={cn("absolute top-[1px] size-3.5 rounded-full", on ? "left-[15px] bg-background" : "left-[1px] bg-foreground/45")} />
    </span>
  );
}

export function Checkbox({ checked = false, className }) {
  return (
    <span className={cn("flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border", checked ? "border-foreground bg-foreground text-background" : "border-foreground/25", className)}>
      {checked ? <Check className="size-2.5" strokeWidth={3} /> : null}
    </span>
  );
}

export function Segmented({ options, value, className, itemClassName }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-lg bg-foreground/[0.05] p-0.5 text-[12px]", className)}>
      {options.map((option) => (
        <span
          key={option}
          className={cn("rounded-md px-2.5 py-1 text-center", option === value ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground", itemClassName)}
        >
          {option}
        </span>
      ))}
    </span>
  );
}

// A labelled form control: label above, a bordered box below (select boxes get a chevron).
export function Field({ label, hint, select = false, mono = false, className, boxClassName, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[12px] font-medium text-foreground/85">{label}</span>
      <span className={cn("flex min-h-8 items-center gap-2 rounded-lg border border-foreground/[0.12] bg-background/40 px-3 py-1.5 text-[12px] text-foreground/90 dark:bg-foreground/[0.02]", mono && "font-mono text-[11.5px]", boxClassName)}>
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {select ? <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" /> : null}
      </span>
      {hint ? <span className="text-[11px] leading-4 text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

export function PrimaryButton({ icon: Icon, className, children }) {
  return (
    <span className={cn("inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background", className)}>
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

export function GhostButton({ icon: Icon, className, children }) {
  return (
    <span className={cn("inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2.5 text-[12px] text-foreground/80", className)}>
      {Icon ? <Icon className="size-3.5 text-muted-foreground" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

// A floating panel (dialog, sheet, popover) that reads as a layer above the window behind it.
export const PANEL = "rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/30 dark:bg-surface-dialog";

const NAV = [
  { title: "Overview", icon: LayoutDashboard },
  { title: "Knowledge Bases", icon: Library, items: ["All Knowledge Bases", "Sources", "Ingestion Jobs", "Ingestion Presets"] },
  { title: "Knowledge Graph", icon: Network, items: ["Graph Explorer", "Entities", "Ontology"] },
  { title: "Playground", icon: MessagesSquare, items: ["Chat", "Conversations"] },
  { title: "Pipelines", icon: Workflow, items: ["All Pipelines", "Model Providers"] },
  { title: "Delivery", icon: Send, items: ["API Keys", "MCP Servers", "Widgets"] },
  { title: "Quality", icon: ShieldCheck, items: ["Evaluations", "Feedback"] },
  { title: "Usage", icon: Gauge, items: ["Usage & Costs", "Request Logs"] },
  { title: "Settings", icon: Settings },
];

// Grey's workspace sidebar with one section open and one screen selected.
export function GreySidebar({ open, active, className }) {
  return (
    <div className={cn("flex w-[214px] shrink-0 flex-col gap-4 border-r px-3 py-4", LINE, className)}>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[12px] font-semibold text-background">K</span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium">Kestrel Aero</span>
          <span className="block truncate text-[11px] text-muted-foreground">Geiger Grey</span>
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {NAV.map(({ title, icon: Icon, items }) => (
          <div key={title}>
            <div className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5", title === open ? "text-foreground" : "text-foreground/70")}>
              <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
              <span className="truncate">{title}</span>
              {items ? <ChevronDown className={cn("ml-auto size-3 text-muted-foreground/70", title !== open && "-rotate-90")} /> : null}
            </div>
            {items && title === open ? (
              <div className={cn("my-0.5 ml-[17px] flex flex-col gap-0.5 border-l pl-2.5", LINE)}>
                {items.map((item) => (
                  <span key={item} className={cn("truncate rounded-md px-2 py-1 text-[12px]", item === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const TOKEN_CLASS = {
  c: "text-muted-foreground/70 italic",
  k: "font-medium text-foreground",
  s: "text-emerald-700 dark:text-emerald-400",
  p: "text-foreground/85",
  m: "text-muted-foreground",
};

// Monospaced lines built from [kind, text] tokens: c comment, k keyword, s string, p plain, m muted.
export function Code({ lines, numbered = false, className, lineClassName }) {
  return (
    <pre className={cn("overflow-hidden font-mono text-[11.5px] leading-[1.75]", className)}>
      {lines.map((line, index) => (
        <div key={index} className={cn("flex", lineClassName)}>
          {numbered ? <span className="w-6 shrink-0 text-muted-foreground/50 select-none">{index + 1}</span> : null}
          <span className="whitespace-pre">
            {line.map(([kind, text], part) => (
              <span key={part} className={TOKEN_CLASS[kind]}>
                {text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </pre>
  );
}

// The editor shell Grey uses for a knowledge base or a pipeline: back link, title and status, a section rail.
export function EditorHeader({ back, title, status, meta, className, children }) {
  return (
    <div className={cn("border-b px-6 py-4", LINE, className)}>
      <div className="text-[12px] text-muted-foreground">‹ {back}</div>
      <div className="mt-2 flex items-center gap-2.5">
        <span className="text-[19px] font-medium tracking-[-0.02em]">{title}</span>
        {status}
        <span className="ml-auto flex items-center gap-2">{children}</span>
      </div>
      {meta ? <div className="mt-1 text-[12px] text-muted-foreground">{meta}</div> : null}
    </div>
  );
}

export function SectionRail({ items, active, className }) {
  return (
    <div className={cn("flex w-[176px] shrink-0 flex-col gap-0.5 border-r p-2.5", LINE, className)}>
      {items.map(({ label, icon: Icon }) => (
        <span key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px]", label === active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground")}>
          <Icon className="size-3.5" strokeWidth={1.75} />
          {label}
        </span>
      ))}
    </div>
  );
}

// A titled card inside a screen, like Grey's SectionCard.
export function Card({ title, description, action, className, bodyClassName, children }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.08] bg-foreground/[0.015]", className)}>
      {title ? (
        <div className={cn("flex items-start gap-3 border-b px-4 py-3", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium">{title}</div>
            {description ? <div className="mt-0.5 text-[11.5px] text-muted-foreground">{description}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn("px-4 py-3", bodyClassName)}>{children}</div>
    </div>
  );
}
