import {
  AlignLeft,
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Columns3,
  Copy,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  GitMerge,
  Hand,
  Hash,
  Image as ImageIcon,
  Kanban,
  LayoutList,
  Link2,
  ListChecks,
  Lock,
  Mail,
  MessageSquare,
  Mic,
  MonitorUp,
  Paperclip,
  PenLine,
  Pencil,
  Phone,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Upload,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, AvatarStack, Chip, Dot, Kbd, LINE, MonoLabel, PriorityIcon, StatusIcon, Typed, TypingDots, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS, Health, Points, ProgressRing } from "@/components/product-pages/plan/plan_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Fieldnote's Atlas Coffee rebrand across the suite: the enquiry in Forms, the client workshop in Notes, the plan in Flow and sign-off in Assets.

const BOARD = "Atlas Coffee rebrand — workshop";

function NotesMark() {
  return <AppMark id="notes" size={20} />;
}

function FormsMark() {
  return <AppMark id="forms" size={20} />;
}

function FlowMark() {
  return <AppMark id="flow" size={20} />;
}

function AssetsMark() {
  return <AppMark id="assets" size={20} />;
}

// Atlas Coffee's new mark: a bean inside a ring, with the wordmark beneath when there's room.
function AtlasLogo({ wordmark = false, className }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <circle cx="60" cy={wordmark ? 48 : 60} r={wordmark ? 34 : 46} stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" />
      <g transform={wordmark ? "translate(60 48) rotate(-28)" : "translate(60 60) rotate(-28) scale(1.3)"}>
        <ellipse rx="13" ry="19" fill="currentColor" fillOpacity="0.8" />
        <path d="M0 -17 C -7 -6, 7 6, 0 17" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {wordmark ? (
        <text x="60" y="104" textAnchor="middle" className="fill-foreground text-[12px] font-semibold tracking-[0.3em]">
          ATLAS
        </text>
      ) : null}
    </svg>
  );
}

// A coffee bag mock-up in the palette's greys, with the mark on the front.
function BagMock({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <path d="M36 24h48l6 10v70a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V34z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M36 24l-6 10h60l-6-10" fill="currentColor" fillOpacity="0.1" />
      <circle cx="60" cy="66" r="14" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" />
      <ellipse cx="60" cy="66" rx="5" ry="7.5" fill="currentColor" fillOpacity="0.7" transform="rotate(-28 60 66)" />
      <rect x="44" y="88" width="32" height="3" rx="1.5" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

// A packaging shot: a cup on a counter under soft light; `tone` varies the frame.
function CupShot({ tone = 0, className }) {
  return (
    <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="160" height="110" fill="currentColor" fillOpacity={[0.12, 0.07, 0.17, 0.09][tone % 4]} />
      <circle cx={[120, 36, 96, 60][tone % 4]} cy="18" r="34" fill="currentColor" fillOpacity="0.07" />
      <rect y="78" width="160" height="32" fill="currentColor" fillOpacity="0.12" />
      <g transform={`translate(${[62, 70, 48, 84][tone % 4]} 0)`}>
        <path d="M0 46h30l-3 34a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="currentColor" fillOpacity="0.34" />
        <path d="M30 54h5a6 6 0 0 1 0 12h-6" stroke="currentColor" strokeOpacity="0.34" strokeWidth="3" fill="none" />
        <path d="M9 38c-3-5 3-7 0-12M19 38c-3-5 3-7 0-12" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// A teammate's live cursor with their name tag.
function Cursor({ name, className, delay = "0s" }) {
  return (
    <div className={cn("absolute z-[4] flex items-start", styles.float, className)} style={{ animationDelay: delay }}>
      <svg width="16" height="18" viewBox="0 0 16 18" className="drop-shadow-sm">
        <path d="M1 1 L1 15 L5 11.2 L7.8 17 L10.2 15.9 L7.4 10.2 L13 10.2 Z" className="fill-foreground stroke-background" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="mt-3 -ml-0.5 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-background">{name}</span>
    </div>
  );
}

function Laser({ className }) {
  return (
    <div className={cn("absolute z-[4] flex flex-col items-center gap-1", className)}>
      {[0.15, 0.3, 0.5, 0.75].map((opacity, index) => (
        <span key={index} className="size-2 rounded-full bg-red-500" style={{ opacity, translate: `${index * -10}px ${index * 8}px` }} />
      ))}
      <span className="size-3 rounded-full bg-red-500 shadow-[0_0_12px_2px] shadow-red-500/60" style={{ translate: "-42px 26px" }} />
    </div>
  );
}

function Sticky({ children, className }) {
  return <div className={cn("rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2.5 leading-[1.4] text-foreground/90 shadow-sm shadow-black/5 dark:bg-foreground/[0.04]", className)}>{children}</div>;
}

function StickyColumn({ title, notes, className, children }) {
  return (
    <div className={cn("absolute w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-subtle/80 p-2.5 text-[12px] dark:bg-surface-subtle", className)}>
      <div className="flex items-center gap-2 px-1 pb-2.5 text-[13px] font-medium">
        <Columns3 className="size-3.5 text-muted-foreground" />
        {title}
        <span className="ml-auto text-[11px] font-normal text-muted-foreground">{notes.length + (children ? 1 : 0)}</span>
      </div>
      <div className="flex flex-col gap-2">
        {notes.map((note) => (
          <Sticky key={note}>{note}</Sticky>
        ))}
        {children}
      </div>
    </div>
  );
}

function LiveChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
      <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Live session
    </span>
  );
}

function SessionBar({ people }) {
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
      <NotesMark />
      <span className="text-muted-foreground">Boards</span>
      <span className="text-muted-foreground/60">›</span>
      <span className="font-medium">{BOARD}</span>
      <span className="ml-1">
        <LiveChip />
      </span>
      <span className="ml-auto flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground">GEIGER-A7CF-2KLM</span>
        <AvatarStack names={people} size={22} />
        <span className="flex h-7 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Collaborate</span>
      </span>
    </div>
  );
}

const PIPELINE = [
  { name: "Internal review", who: "Aisha Bennett", state: "Approved" },
  { name: "Producer check", who: "Samuel Okoro", state: "Approved" },
  { name: "Client sign-off", who: "Elena Rossi · Atlas Coffee", state: "In Review" },
];

function PipelineSteps({ stages, finalApproved = false }) {
  return (
    <div className="relative flex flex-col gap-3">
      <span className="absolute top-3 bottom-3 left-[9px] border-l border-dashed border-foreground/20" />
      {stages.map((stage, index) => {
        const approved = stage.state === "Approved" || (finalApproved && index === stages.length - 1);
        return (
          <div key={stage.name} className={cn("relative flex items-start gap-3", finalApproved && index === stages.length - 1 && styles.popIn)} style={{ "--pop-delay": "1.2s" }}>
            <span
              className={cn(
                "mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-surface-card text-white dark:border-surface-subtle",
                approved ? "bg-emerald-500" : "bg-amber-500",
              )}
            >
              {approved ? <Check className="size-2.5" strokeWidth={3.5} /> : <Clock className="size-2.5" strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-foreground/90">{stage.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {approved ? "Approved" : stage.state} · {stage.who}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// The hero's tilted plane: the client workshop board live on the left, the logo's sign-off landing on the right.
export function StudioHeroWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[700px] w-[900px]">
        <SessionBar people={["Aisha Bennett", "Elena Rossi", "Theo Lindqvist", "Hana Ito", "Samuel Okoro"]} />
        <div className="relative flex-1 overflow-hidden" style={CANVAS_DOTS}>
          <div className="absolute top-4 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-foreground/[0.14] bg-surface-card px-3 py-1 text-[12px] shadow-md shadow-black/10 dark:bg-surface-dialog">
            <Lock className="size-3 text-muted-foreground" />
            <span className="font-medium">Aisha Bennett</span> is presenting — your view follows theirs
          </div>
          <StickyColumn
            title="What Atlas is"
            className="top-[64px] left-[40px]"
            notes={["Roasted on site, every morning", "The corner shop people walk to", "Warm, a little scruffy, never twee"]}
          >
            <div className="rounded-lg border border-foreground/40 bg-surface-card px-3 py-2.5 leading-[1.4] shadow-sm dark:bg-foreground/[0.06]">
              <Typed text="Hand-drawn, like the chalk menus" delay={1.4} />
            </div>
          </StickyColumn>
          <StickyColumn title="What it isn't" className="top-[64px] left-[260px]" notes={["Third-wave minimalism", "Gold foil and serif capitals"]} />
          <div className="absolute top-[64px] left-[480px] w-[380px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle">
            <div className="flex items-center gap-2 pb-2.5 text-[13px] font-medium">
              <ImageIcon className="size-3.5 text-muted-foreground" /> Moodboard
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 1, 2].map((tone, index) => (
                <div key={index} className="overflow-hidden rounded-md border border-foreground/[0.06]">
                  <CupShot tone={tone} className="block h-[70px] w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-[300px] left-[480px] w-[380px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[12px] shadow-sm shadow-black/5 dark:bg-surface-subtle">
            <div className="flex items-center gap-2 pb-2.5 text-[13px] font-medium">
              <Pencil className="size-3.5 text-muted-foreground" /> Logo routes
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Route A — Ring", "Route B — Bean", "Route C — Stamp"].map((route, index) => (
                <div key={route} className={cn("rounded-lg border p-2", index === 1 ? "border-foreground/30 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
                  <AtlasLogo className={cn("mx-auto size-14", index !== 1 && "opacity-50")} />
                  <div className="mt-1.5 truncate text-center text-[11px] text-muted-foreground">{route}</div>
                </div>
              ))}
            </div>
          </div>
          <Laser className="top-[340px] left-[790px]" />
          <Cursor name="Elena Rossi" className="top-[250px] left-[230px]" />
          <Cursor name="Theo Lindqvist" className="top-[470px] left-[600px]" delay="-2.5s" />
        </div>
      </Window>

      <Window className="absolute top-[110px] left-[800px] z-[2] w-[370px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
          <AssetsMark />
          <span className="truncate font-medium">Primary logo</span>
          <span className="font-mono text-[11px] text-muted-foreground">v4</span>
          <span className={cn("ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300", styles.popIn)} style={{ "--pop-delay": "1.4s" }}>
            <CheckCircle2 className="size-3" /> Approved
          </span>
        </div>
        <div className={cn("flex h-[170px] items-center justify-center border-b bg-foreground/[0.03]", LINE)}>
          <AtlasLogo wordmark className="size-[132px]" />
        </div>
        <div className="flex flex-col gap-3 p-4 text-[12px]">
          <div>
            <div className="text-[11px] text-muted-foreground">Approval pipeline</div>
            <div className="mt-0.5 font-medium">Client sign-off · Sequential</div>
          </div>
          <PipelineSteps stages={PIPELINE} finalApproved />
          <div className={cn("mt-1 flex items-center gap-2 rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-3 py-2", styles.popIn)} style={{ "--pop-delay": "1.6s" }}>
            <Lock className="size-3.5 text-muted-foreground" />
            <span className="text-foreground/85">v4 locked as the approved version</span>
          </div>
        </div>
      </Window>
    </div>
  );
}

function FormField({ label, children, className }) {
  return (
    <div className={className}>
      <div className="mb-1.5 text-[12px] font-medium text-foreground/90">{label}</div>
      {children}
    </div>
  );
}

function Input({ children, muted, icon: Icon, className }) {
  return (
    <div className={cn("flex h-9 items-center gap-2 rounded-lg border border-foreground/[0.12] bg-foreground/[0.02] px-3", muted ? "text-muted-foreground" : "text-foreground/90", className)}>
      {children}
      {Icon ? <Icon className="ml-auto size-3.5 text-muted-foreground" /> : null}
    </div>
  );
}

// A signature drawn in one stroke.
function SignatureStroke({ className }) {
  return (
    <svg viewBox="0 0 220 60" className={cn("text-foreground", className)} fill="none" aria-hidden="true">
      <path
        d="M8 42c10-18 18-30 22-28 5 2-12 34-6 34 7 0 14-26 22-26 6 0-3 20 3 20 8 0 12-16 20-16 6 0 2 14 8 14 9 0 15-22 24-22 7 0 0 22 8 22 10 0 20-14 32-14 12 0 22 4 40 2"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NEEDS = [
  ["Brand identity", true],
  ["Packaging", true],
  ["Website", false],
  ["Signage", false],
];

function EnquiryForm({ className }) {
  return (
    <Window title="New project enquiry" icon={FormsMark} meta="Fieldnote" className={cn("w-[560px]", className)}>
      <div className="flex flex-col gap-3.5 px-7 py-5">
        <div>
          <div className="text-[20px] font-medium tracking-[-0.02em]">Tell us about the project</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">Takes about four minutes. We reply within two working days.</div>
        </div>
        <FormField label="Company">
          <Input>Atlas Coffee</Input>
        </FormField>
        <FormField label="What do you need?">
          <div className="flex flex-wrap gap-1.5">
            {NEEDS.map(([need, picked]) => (
              <span key={need} className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[12px]", picked ? "border-foreground/40 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
                {picked ? <Check className="size-3.5" /> : null}
                {need}
              </span>
            ))}
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Budget">
            <Input icon={ChevronDown}>£40,000 – £60,000</Input>
          </FormField>
          <FormField label="Ideal launch">
            <Input icon={Calendar}>3 Mar 2027</Input>
          </FormField>
        </div>
        <FormField label="Share your current brand files">
          <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-foreground/20 p-2">
            {[
              ["atlas-logo-2019.ai", "4.2 MB", 100],
              ["shop-photos.zip", "86 MB", 64],
            ].map(([name, size, progress], index) => (
              <div key={name} className="flex items-center gap-2.5 rounded-md bg-foreground/[0.03] px-2.5 py-1.5 text-[12px]">
                <Paperclip className="size-3.5 text-muted-foreground" />
                <span className="w-[150px] truncate">{name}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                  <span className={cn("block h-full origin-left rounded-full", progress === 100 ? "bg-emerald-500" : "bg-foreground/45", styles.fill)} style={{ width: `${progress}%`, "--fill-delay": `${0.3 + index * 0.3}s` }} />
                </span>
                <span className="w-12 text-right text-[11px] text-muted-foreground tabular-nums">{size}</span>
              </div>
            ))}
          </div>
        </FormField>
        <FormField label="Signature">
          <div className="rounded-lg border border-foreground/[0.12] bg-foreground/[0.02] px-3 pt-2 pb-1.5">
            <SignatureStroke className="h-[46px] w-[220px]" />
            <div className={cn("mt-1 border-t pt-1.5 text-[11px] text-muted-foreground", LINE)}>Elena Rossi · Head of brand, Atlas Coffee</div>
          </div>
        </FormField>
      </div>
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

function SelectPill({ label, children }) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-[11px] text-muted-foreground">{label}</div>
      <span className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2.5 text-[12px]">
        {children}
        <ChevronDown className="ml-auto size-3 text-muted-foreground" />
      </span>
    </div>
  );
}

function EnquiryResponse({ className }) {
  return (
    <Window className={cn("w-[370px]", className)}>
      <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
        <Avatar name="Elena Rossi" size={32} />
        <div className="min-w-0">
          <div className="font-medium">Elena Rossi</div>
          <div className="truncate text-[12px] text-muted-foreground">elena@atlascoffee.co · Just now</div>
        </div>
      </div>
      <div className={cn("flex gap-2.5 border-b px-5 py-3.5", LINE)}>
        <SelectPill label="Status">
          <Dot tone="amber" /> Needs review
        </SelectPill>
        <SelectPill label="Priority">
          <PriorityIcon level="high" /> High
        </SelectPill>
      </div>
      <div className={cn("border-b px-5 py-2", LINE)}>
        <Answer label="What do you need?">Brand identity, Packaging</Answer>
        <Answer label="Budget">£40,000 – £60,000</Answer>
        <Answer label="Share your current brand files">
          <span className="mt-1 flex flex-wrap gap-1.5">
            {["atlas-logo-2019.ai", "shop-photos.zip"].map((file) => (
              <span key={file} className="inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] bg-foreground/[0.03] px-2 py-0.5 text-[12px]">
                <Paperclip className="size-3 text-muted-foreground" /> {file}
              </span>
            ))}
          </span>
        </Answer>
        <Answer label="Signature">
          <span className="inline-flex items-center gap-1.5 text-[12px]">
            <PenLine className="size-3.5 text-muted-foreground" /> Signed 27 Oct, 09:14
          </span>
        </Answer>
      </div>
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MessageSquare className="size-3" /> Comments
        </div>
        <div className="flex gap-2.5">
          <Avatar name="Samuel Okoro" size={22} />
          <p className="leading-5 text-foreground/85">
            <span className="font-medium text-foreground">Samuel Okoro</span> Aisha, this is the café group from the trade fair. Can you take the intro call?
          </p>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the public enquiry form filled in by the client, and the response in the inbox with its status and priority.
export function EnquiryStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <EnquiryForm className="absolute top-0 left-0 opacity-90" />
      <EnquiryResponse className={cn("absolute top-[56px] left-[610px] z-[2]", styles.float)} />
    </div>
  );
}

const FIELD_TILES = [
  [AlignLeft, "Short text", false],
  [Mail, "Email", false],
  [DollarSign, "Currency", false],
  [ListChecks, "Multiple choice", true],
  [ChevronDown, "Dropdown", true],
  [Star, "Star rating", false],
  [Calendar, "Date", true],
  [Clock, "Booking slot", false],
  [Users, "Full name", false],
  [Upload, "File upload", true],
  [PenLine, "Signature", true],
  [Hash, "Calculated", false],
];

// Cell: a corner of the field palette, with the five types the enquiry form uses picked out.
export function FieldTypesRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[12px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
      <div className="flex items-center justify-between px-1 pb-2.5">
        <span className="font-medium">Add a field</span>
        <span className="text-[11px] text-muted-foreground">36 field types</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {FIELD_TILES.map(([Icon, label, used], index) => (
          <span
            key={label}
            className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2.5", used ? "border-foreground/25 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.07] text-foreground/70", used && styles.popIn)}
            style={used ? { "--pop-delay": `${0.2 + index * 0.06}s` } : undefined}
          >
            <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const KANBAN = [
  {
    status: "Needs review",
    tone: "amber",
    cards: [{ name: "Elena Rossi", company: "Atlas Coffee", priority: "high", label: "High", fresh: true }],
  },
  {
    status: "Pending",
    tone: "amber",
    cards: [
      { name: "Marcus Whitfield", company: "Orbital Freight", priority: "medium", label: "Medium" },
      { name: "Clara Vidal", company: "Brightloop", priority: "low", label: "Low" },
    ],
  },
  {
    status: "Approved",
    tone: "emerald",
    cards: [{ name: "Noah Fischer", company: "Kestrel Aero", priority: "medium", label: "Medium" }],
  },
];

// Cell: the enquiry inbox in its kanban view, one column per status.
export function EnquiryKanbanRender() {
  return (
    <div className={cn("mx-auto grid h-[290px] w-[470px] grid-cols-3 gap-2.5", styles.fadeBottom)}>
      {KANBAN.map((column) => (
        <div key={column.status} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2">
          <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px]">
            <Dot tone={column.tone} />
            <span className="font-medium">{column.status}</span>
            <span className="text-muted-foreground">{column.cards.length}</span>
          </div>
          {column.cards.map((card, index) => (
            <div
              key={card.name}
              className={cn("rounded-lg border bg-surface-card p-2.5 text-[12px] shadow-sm shadow-black/5 dark:bg-foreground/[0.03]", card.fresh ? "border-foreground/30" : "border-foreground/[0.09]", styles.popIn)}
              style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}
            >
              <div className="flex items-center gap-2">
                <Avatar name={card.name} size={18} />
                <span className="truncate font-medium">{card.name}</span>
              </div>
              <div className="mt-1 truncate text-[11px] text-muted-foreground">{card.company}</div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <PriorityIcon level={card.priority} /> {card.label}
                {card.fresh ? <span className="ml-auto text-foreground/80">New</span> : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const PARTICIPANTS = [
  { name: "Aisha Bennett", role: "Host" },
  { name: "Elena Rossi", hand: true },
  { name: "Theo Lindqvist" },
  { name: "Samuel Okoro" },
];

function Toggle({ on = true }) {
  return (
    <span className={cn("flex h-[18px] w-8 shrink-0 items-center rounded-full p-0.5", on ? "bg-foreground" : "bg-foreground/15")}>
      <span className={cn("size-3.5 rounded-full bg-background", on && "ml-auto")} />
    </span>
  );
}

function HostControls({ className }) {
  return (
    <div className={cn("w-[272px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className="px-1 pb-2 text-[13px] font-medium">Host controls</div>
      <MonoLabel className="px-1 text-[10px]">Attention</MonoLabel>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-foreground/[0.05] px-2.5 py-2">
        <Lock className="size-3.5 text-muted-foreground" />
        <span className="flex-1">Lock everyone&apos;s view to mine</span>
        <Toggle />
      </div>
      <div className={cn("mt-3 border-t pt-2.5", LINE)}>
        <div className="px-1 text-[12px] font-medium">Raised hands (1)</div>
        <div className={cn("mt-1.5 flex items-center gap-2 rounded-lg px-2.5 py-1.5", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          <Hand className="size-3.5 text-amber-500" />
          <Avatar name="Elena Rossi" size={18} />
          <span className="flex-1">Elena Rossi</span>
          <span className="text-[11px] text-muted-foreground">Lower</span>
        </div>
      </div>
      <div className={cn("mt-2 border-t pt-2.5", LINE)}>
        <MonoLabel className="px-1 text-[10px]">Participants can</MonoLabel>
        {[
          ["Edit the board", true],
          ["Use the laser pointer", true],
          ["See each other's cursors", true],
          ["Run polls and timers", false],
        ].map(([label, on]) => (
          <div key={label} className="flex items-center gap-2 px-1 py-1.5">
            <span className="flex-1 text-foreground/85">{label}</span>
            <Toggle on={on} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Section stage: the workshop board with the client on it, a meeting docked under the top bar and the host's controls open.
export function WorkshopStage() {
  return (
    <div className="relative h-[660px] w-[1000px]">
      <Window className="absolute inset-x-0 top-0 h-[660px]">
        <SessionBar people={["Aisha Bennett", "Elena Rossi", "Theo Lindqvist", "Samuel Okoro"]} />
        <div className={cn("flex gap-2.5 border-b bg-foreground/[0.03] p-3", LINE)}>
          <div className="relative h-[112px] w-[290px] shrink-0 overflow-hidden rounded-lg border border-foreground/[0.1] bg-background">
            <div className="absolute top-2 left-2 z-[1] flex items-center gap-1.5 rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-medium text-background">
              <MonitorUp className="size-3" /> Hana Ito is sharing her screen
            </div>
            <div className="grid h-full grid-cols-4 gap-1.5 p-2 pt-8">
              {[0, 1, 2, 3].map((tone) => (
                <div key={tone} className="overflow-hidden rounded-[4px]">
                  <CupShot tone={tone} className="block h-full w-full" />
                </div>
              ))}
            </div>
          </div>
          {PARTICIPANTS.map((person) => (
            <div key={person.name} className="relative flex h-[112px] w-[104px] shrink-0 items-center justify-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.06]">
              <Avatar name={person.name} size={34} />
              <span className="absolute bottom-1.5 left-2 truncate text-[10px] text-muted-foreground">{person.name.split(" ")[0]}</span>
              {person.hand ? (
                <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white">
                  <Hand className="size-3" />
                </span>
              ) : null}
            </div>
          ))}
          <div className="ml-auto flex flex-col items-end justify-between">
            <div className="grid grid-cols-2 gap-1.5">
              {[Mic, Video, MonitorUp, Hand].map((Icon, index) => (
                <span key={index} className="flex size-8 items-center justify-center rounded-lg border border-foreground/[0.1] text-foreground/80">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
              ))}
            </div>
            <span className="flex h-7 items-center rounded-lg bg-red-500 px-3 text-[12px] font-medium text-white">Leave</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden" style={CANVAS_DOTS}>
          <div className="absolute top-3 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2 rounded-full border border-foreground/[0.14] bg-surface-card px-3 py-1 text-[12px] shadow-md shadow-black/10 dark:bg-surface-dialog">
            <Lock className="size-3 text-muted-foreground" />
            <span>Everyone&apos;s view follows yours</span>
            <span className="text-muted-foreground">Release</span>
          </div>
          <StickyColumn title="What Atlas is" className="top-[52px] left-[36px]" notes={["Roasted on site, every morning", "The corner shop people walk to", "Warm, a little scruffy, never twee"]} />
          <StickyColumn title="What it isn't" className="top-[52px] left-[256px]" notes={["Third-wave minimalism", "Gold foil and serif capitals"]} />
          <div className="absolute top-[52px] left-[476px] w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-card p-2.5 text-[12px] dark:bg-surface-subtle">
            <div className="flex items-center gap-2 px-1 pb-2.5 text-[13px] font-medium">
              <ImageIcon className="size-3.5 text-muted-foreground" /> Moodboard
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 2, 1, 3].map((tone) => (
                <div key={tone} className="overflow-hidden rounded-md border border-foreground/[0.06]">
                  <CupShot tone={tone} className="block h-[54px] w-full" />
                </div>
              ))}
            </div>
          </div>
          <Laser className="top-[150px] left-[560px]" />
          <Cursor name="Elena Rossi" className="top-[196px] left-[176px]" />
          <Cursor name="Theo Lindqvist" className="top-[300px] left-[540px]" delay="-2.5s" />
        </div>
      </Window>
      <HostControls className={cn("absolute top-[200px] left-[712px] z-[5]", styles.float)} />
    </div>
  );
}

const AI_ACTIONS = ["Summarize", "Cluster", "Brainstorm", "Action items", "Custom"];
const ACTION_ITEMS = ["Theo: three logo routes by Friday", "Hana: warm palette and type tests", "Samuel: book the bag print proof"];

// Cell: the AI card turning the workshop's stickies into action items, spawned as notes beside it.
export function WorkshopAiRender() {
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
          {ACTION_ITEMS.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-3.5 flex h-7 w-fit items-center rounded-md bg-foreground px-2.5 font-medium text-background">Spawn as notes</span>
      </div>
      {ACTION_ITEMS.map((item, index) => (
        <div key={item} className={cn("absolute right-3 w-[170px]", styles.popIn)} style={{ top: 20 + index * 86, "--pop-delay": `${0.6 + index * 0.25}s`, rotate: `${[-1.5, 1, -0.5][index]}deg` }}>
          <Sticky className="text-[12px]">{item}</Sticky>
        </div>
      ))}
    </div>
  );
}

// Cell: the session merged back into the studio's own board, with the changes counted first.
export function SessionMergeRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <GitMerge className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Merge</span>
        <span className="text-muted-foreground">into Atlas Coffee rebrand</span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="rounded-lg border border-foreground/[0.12] bg-foreground/[0.03] p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-medium tracking-wider">GEIGER-A7CF-2KLM</span>
            <AvatarStack names={["Aisha Bennett", "Elena Rossi", "Theo Lindqvist"]} size={18} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded border border-foreground/[0.1] bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <GitMerge className="size-3" /> Not Merged
            </span>
            <span className="text-[11px] text-muted-foreground">27/10/2026</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["14", "New Nodes"],
            ["5", "Modified"],
          ].map(([value, label], index) => (
            <div key={label} className={cn("rounded-lg border border-foreground/[0.08] px-3 py-2.5", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
              <div className="text-[20px] font-medium tracking-tight tabular-nums">{value}</div>
              <div className="text-[11px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <p className="leading-5 text-muted-foreground">Merging will combine these changes into your current board. Your local unique nodes will be preserved.</p>
        <div className="flex justify-end gap-2">
          <span className="flex h-8 items-center rounded-md px-3 text-muted-foreground">Back</span>
          <span className="flex h-8 items-center rounded-md bg-foreground px-3 font-medium text-background">Merge Changes</span>
        </div>
      </div>
    </div>
  );
}

const ATL_ISSUES = [
  { id: "ATL-21", title: "Menu board layouts for the flagship", status: "todo", priority: "medium", assignee: "Hana Ito", points: 3 },
  { id: "ATL-22", title: "Cup sleeve dielines from the printer", status: "todo", priority: "low", assignee: "Samuel Okoro", points: 1 },
  { id: "ATL-23", title: "Shop fascia measurements", status: "todo", priority: "none", assignee: "", points: 1 },
  { id: "ATL-14", title: "Three logo routes for the client review", status: "progress", priority: "high", assignee: "Theo Lindqvist", points: 5 },
  { id: "ATL-17", title: "Warm palette and type pairing tests", status: "progress", priority: "medium", assignee: "Hana Ito", points: 3 },
  { id: "ATL-12", title: "Brand audit: what to keep from 2019", status: "review", priority: "medium", assignee: "Aisha Bennett", points: 2 },
  { id: "ATL-09", title: "Workshop board with the client", status: "done", priority: "high", assignee: "Aisha Bennett", points: 2 },
  { id: "ATL-10", title: "Competitor shelf walk", status: "done", priority: "low", assignee: "Samuel Okoro", points: 1 },
];

const COLUMN_TITLES = { todo: "Todo", progress: "In Progress", review: "In Review", done: "Done" };

function IssueCard({ issue }) {
  return (
    <div className="rounded-lg border border-foreground/[0.09] bg-surface-card p-2.5 text-[12px] shadow-sm shadow-black/5 dark:bg-foreground/[0.03]">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {issue.id}
        <span className="ml-auto">{issue.assignee ? <Avatar name={issue.assignee} size={16} /> : <span className="block size-4 rounded-full border border-dashed border-foreground/30" />}</span>
      </div>
      <div className="mt-1 flex gap-1.5 leading-[1.35] text-foreground/90">
        <StatusIcon status={issue.status} className="mt-px" />
        <span className="line-clamp-2">{issue.title}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <PriorityIcon level={issue.priority} />
        <Points value={issue.points} />
      </div>
    </div>
  );
}

function AtlasBoardWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <FlowMark />
        <span className="text-muted-foreground">Atlas Coffee rebrand</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Issues</span>
        <span className="ml-4 flex items-center rounded-md border border-foreground/10 p-0.5 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1 px-2 py-0.5">
            <LayoutList className="size-3.5" /> List
          </span>
          <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
            <Kanban className="size-3.5" /> Board
          </span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2 py-1 text-[12px] text-muted-foreground">
          <SlidersHorizontal className="size-3.5" /> Display
        </span>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2.5 p-3">
        {Object.keys(COLUMN_TITLES).map((status) => {
          const cards = ATL_ISSUES.filter((issue) => issue.status === status);
          return (
            <div key={status} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2">
              <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px]">
                <StatusIcon status={status} />
                <span className="font-medium">{COLUMN_TITLES[status]}</span>
                <span className="text-muted-foreground">{cards.length}</span>
                <Plus className="ml-auto size-3.5 text-muted-foreground" />
              </div>
              {cards.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          );
        })}
      </div>
    </Window>
  );
}

function NewIssue({ className }) {
  return (
    <div className={cn("w-[460px] rounded-xl border border-foreground/[0.14] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 text-[12px]", LINE)}>
        <Chip className="h-5 px-2 text-[11px]">Atlas Coffee rebrand</Chip>
        <span className="text-muted-foreground">› New issue</span>
        <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
          press <Kbd>C</Kbd> anywhere
        </span>
      </div>
      <div className="px-4 pt-3.5 pb-3">
        <div className="text-[16px] font-medium">
          <Typed text="Bag front for the single-origin range" delay={1.5} />
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <span className="block h-2 w-4/5 rounded-full bg-foreground/[0.07]" />
          <span className="block h-2 w-3/5 rounded-full bg-foreground/[0.07]" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
        <Chip>
          <StatusIcon status="todo" className="size-3" /> Todo
        </Chip>
        <Chip>
          <PriorityIcon level="high" className="size-3" /> High
        </Chip>
        <Chip>
          <Avatar name="Hana Ito" size={14} /> Hana Ito
        </Chip>
        <Chip dot="neutral">packaging</Chip>
        <Chip>Cycle 2 - Identity</Chip>
      </div>
      <div className={cn("flex items-center justify-end gap-2 border-t px-4 py-2.5", LINE)}>
        <span className="flex h-7 items-center rounded-md bg-foreground px-3 text-[12px] font-medium text-background">Create issue</span>
      </div>
    </div>
  );
}

// Section stage: the rebrand's issues on a board, with a new issue being written over it.
export function AtlasTrackerStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <AtlasBoardWindow className="absolute top-0 left-0 h-[600px] w-[800px]" />
      <NewIssue className={cn("absolute top-[318px] left-[520px] z-[2]", styles.float)} />
    </div>
  );
}

// Day offsets from 1 October across Oct–Dec (92 days).
const MONTHS = { Oct: 0, Nov: 31, Dec: 61 };
const SPAN = 92;
const at = (month, day) => ((MONTHS[month] + day - 1) / SPAN) * 100;

const ROADMAP = [
  { kind: "division", title: "Atlas Coffee rebrand", from: ["Oct", 5], to: ["Dec", 20], progress: 38 },
  { kind: "cycle", title: "Cycle 1 - Discovery", from: ["Oct", 5], to: ["Oct", 18], progress: 100 },
  { kind: "cycle", title: "Cycle 2 - Identity", from: ["Oct", 19], to: ["Nov", 1], progress: 46, current: true },
  { kind: "cycle", title: "Cycle 3 - Packaging", from: ["Nov", 2], to: ["Nov", 15], progress: 0 },
  { kind: "cycle", title: "Cycle 4 - Rollout", from: ["Nov", 16], to: ["Nov", 29], progress: 0 },
];

// Cell: the rebrand on the Initiatives roadmap, its division above four cycles, with today marked.
export function AtlasRoadmapRender() {
  const labelWidth = 170;
  return (
    <div className="mx-auto w-[470px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex h-8 border-b", LINE)}>
        <div className={cn("flex shrink-0 items-center gap-1.5 border-r px-3 text-[11px] text-muted-foreground", LINE)} style={{ width: labelWidth }}>
          Initiatives
          <Health value="on" className="ml-auto text-[11px]" />
        </div>
        <div className="relative flex-1">
          {Object.keys(MONTHS).map((month) => (
            <span key={month} className={cn("absolute top-0 flex h-8 items-center border-l pl-1.5 text-[11px] text-muted-foreground", LINE)} style={{ left: `${at(month, 1)}%` }}>
              {month}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        {ROADMAP.map((row, index) => {
          const left = at(...row.from);
          const width = at(...row.to) - left;
          return (
            <div key={row.title} className={cn("flex border-b last:border-b-0", LINE)}>
              <div className={cn("flex shrink-0 items-center gap-2 border-r px-3 py-3", LINE)} style={{ width: labelWidth }}>
                <ProgressRing value={row.progress} className={row.progress === 100 ? "text-emerald-500" : "text-foreground/70"} />
                <span className={cn("truncate", row.kind === "division" ? "font-medium text-foreground" : "text-foreground/85")}>{row.title}</span>
              </div>
              <div className="relative flex-1 py-3.5">
                <div className={cn("relative h-4 overflow-hidden rounded-full border bg-foreground/[0.05]", row.current ? "border-foreground/40" : "border-foreground/[0.14]")} style={{ marginLeft: `${left}%`, width: `${width}%` }}>
                  <span
                    className={cn("absolute inset-y-0 left-0 origin-left", row.progress === 100 ? "bg-foreground/20" : "bg-foreground/35", styles.fill)}
                    style={{ width: `${row.progress}%`, "--fill-delay": `${0.3 + index * 0.12}s` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-y-0 right-0" style={{ left: labelWidth }}>
          <span className="absolute inset-y-0 w-px bg-foreground/70" style={{ left: `${at("Oct", 27)}%` }}>
            <span className="absolute -top-px left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground" />
          </span>
        </div>
      </div>
    </div>
  );
}

// Cell: the rebrand's channel in Grounding, with a one-to-one video call running over it.
export function AtlasChatRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[316px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <Hash className="size-3.5 text-muted-foreground" />
          <span className="font-medium">atlas-rebrand</span>
          <span className="truncate text-muted-foreground">Logos, packaging, print</span>
        </div>
        <div className="flex flex-col gap-3 py-3 pr-10 pl-4">
          {[
            ["Theo Lindqvist", "10:12", "Route B is up on the workshop board. Elena liked the bean."],
            ["Hana Ito", "10:20", "Palette tests are up: three warm browns to choose from."],
            ["Samuel Okoro", "10:31", "Printer can proof the bags on Thursday if files land by Tuesday."],
          ].map(([name, time, text]) => (
            <div key={time} className="flex gap-2.5">
              <Avatar name={name} size={24} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{name}</span>
                  <span className="text-[11px] text-muted-foreground">{time}</span>
                </div>
                <p className="mt-0.5 leading-[1.45] text-foreground/85">{text}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <TypingDots className="text-muted-foreground" /> Aisha Bennett is typing…
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[48px] right-0 z-[2] w-[172px] overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card text-[11px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <div className={cn("flex items-center gap-1.5 border-b px-3 py-2", LINE)}>
          <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
          <span className="font-medium">Video call</span>
          <span className="ml-auto text-muted-foreground tabular-nums">02:41</span>
        </div>
        <div className="relative flex h-[78px] items-center justify-center bg-foreground/[0.05]">
          <Avatar name="Theo Lindqvist" size={36} />
          <span className="absolute bottom-1.5 left-2 text-[10px] text-muted-foreground">Theo Lindqvist</span>
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          {[Mic, Video].map((Icon, index) => (
            <span key={index} className="flex size-7 items-center justify-center rounded-full border border-foreground/[0.12] text-foreground/80">
              <Icon className="size-3.5" strokeWidth={1.75} />
            </span>
          ))}
          <span className="flex size-7 items-center justify-center rounded-full bg-red-500 text-white">
            <Phone className="size-3.5 rotate-[135deg]" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </div>
  );
}

const LIBRARY = [
  { name: "Primary logo", version: "v4", status: "In Review", art: "logo" },
  { name: "Logo — mono", version: "v2", status: "Approved", art: "logo" },
  { name: "Bag — single origin", version: "v3", status: "Draft", art: "bag" },
  { name: "Packaging shoot 01", version: "v1", status: "Approved", art: "shot", tone: 0 },
  { name: "Bag — house blend", version: "v2", status: "In Review", art: "bag" },
  { name: "Packaging shoot 02", version: "v1", status: "Approved", art: "shot", tone: 2 },
];

const ASSET_TONES = { Approved: "emerald", "In Review": "amber", Draft: "neutral", "Changes Requested": "amber" };

function LibraryWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <AssetsMark />
        <span className="text-muted-foreground">Atlas Coffee rebrand</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Library</span>
      </div>
      <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
        {["All assets", "Approved", "In Review", "Draft"].map((filter, index) => (
          <span key={filter} className={cn("rounded-full px-2.5 py-1", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
            {filter}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {LIBRARY.map((asset) => (
          <div key={asset.name} className="overflow-hidden rounded-lg border border-foreground/[0.08]">
            <div className="flex h-[104px] items-center justify-center bg-foreground/[0.04]">
              {asset.art === "logo" ? <AtlasLogo className="size-16" /> : asset.art === "bag" ? <BagMock className="size-20" /> : <CupShot tone={asset.tone} className="block h-full w-full" />}
            </div>
            <div className="px-2.5 py-2 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="truncate">{asset.name}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{asset.version}</span>
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Dot tone={ASSET_TONES[asset.status]} /> {asset.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Window>
  );
}

const VERSIONS = ["v1", "v2", "v3", "v4"];

function SignOffWindow({ className }) {
  return (
    <Window title="Atlas Coffee — primary logo" icon={AssetsMark} meta="Client sign-off" className={cn("w-[560px]", className)}>
      <div className="flex">
        <div className={cn("flex w-[230px] shrink-0 flex-col gap-3 border-r p-4", LINE)}>
          <div className="flex h-[176px] items-center justify-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.03]">
            <AtlasLogo wordmark className="size-[140px]" />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {VERSIONS.map((version) => (
              <div key={version} className={cn("rounded-md border p-1", version === "v4" ? "border-foreground/30 bg-foreground/[0.05]" : "border-foreground/[0.08]")}>
                <AtlasLogo className={cn("mx-auto size-8", version !== "v4" && "opacity-45")} />
                <div className="mt-0.5 text-center font-mono text-[10px] text-muted-foreground">{version}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-2 text-[11px] leading-[1.45]">
            <div className="font-medium text-amber-800 dark:text-amber-200">v3 · Changes Requested</div>
            <div className="mt-0.5 text-foreground/75">&ldquo;Warmer brown, and lose the shine.&rdquo; Elena Rossi</div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 text-[12px]">
          <div>
            <div className="text-[11px] text-muted-foreground">Approval pipeline</div>
            <div className="mt-0.5 text-[13px] font-medium">Client sign-off · Sequential</div>
          </div>
          <PipelineSteps stages={PIPELINE} />
          <div className={cn("border-t pt-3", LINE)}>
            <div className="text-[11px] text-muted-foreground">On final approval</div>
            <div className="mt-2 flex items-center gap-2">
              <Lock className="size-3.5 text-muted-foreground" />
              <span className="flex-1 text-foreground/85">Lock the approved version</span>
              <Toggle />
            </div>
          </div>
          <div className="mt-auto flex gap-2">
            <span className="flex-1 rounded-md border border-foreground/[0.1] py-1.5 text-center text-muted-foreground">Request changes</span>
            <span className="flex-1 rounded-md bg-foreground py-1.5 text-center font-medium text-background">Approve</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the rebrand's library behind, the logo in front with its versions and the client's turn to sign off.
export function SignOffStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <LibraryWindow className="absolute top-0 left-0 w-[600px] opacity-85" />
      <SignOffWindow className={cn("absolute top-[60px] left-[430px] z-[2]", styles.float)} />
    </div>
  );
}

// Cell: a share link for the brand guidelines, set to expire, with its menu open on Revoke.
export function GuidelinesLinkRender() {
  return (
    <div className="relative mx-auto h-[320px] w-[460px]">
      <div className="absolute top-0 left-0 w-[400px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <Link2 className="size-4 text-muted-foreground" />
          <span className="truncate font-medium">Atlas brand guidelines — final</span>
          <Chip dot="emerald" className="ml-auto h-5 text-[11px]">
            Active
          </Chip>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <div className="flex items-center gap-2 rounded-lg border border-foreground/[0.09] px-3 py-2">
            <span className="truncate font-mono text-[12px] text-foreground/85">/s/atlas-guidelines-final</span>
            <Copy className="ml-auto size-3.5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-[12px]">
            {[
              ["Visibility", "Restricted"],
              ["Expires", "In 30 days"],
              ["Views", "38"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-foreground/[0.04] px-2.5 py-2">
                <div className="text-[11px] text-muted-foreground">{label}</div>
                <div className="mt-0.5 text-foreground/90 tabular-nums">{value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Eye className="size-3.5" /> Created by Aisha Bennett · 21 Oct
          </div>
        </div>
      </div>
      <div className={cn("absolute top-[166px] left-[292px] z-[2] w-[160px] rounded-xl border border-foreground/[0.12] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        {[
          [Copy, "Copy URL"],
          [ExternalLink, "Open"],
          [Pencil, "Edit"],
        ].map(([Icon, label]) => (
          <div key={label} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-foreground/85">
            <Icon className="size-3.5 text-muted-foreground" /> {label}
          </div>
        ))}
        <div className={cn("my-1 border-t", LINE)} />
        <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-2.5 py-1.5 text-red-600 dark:text-red-400">
          <Ban className="size-3.5" /> Revoke
        </div>
      </div>
    </div>
  );
}

const LAYOUTS = ["Grid", "Masonry", "Justified rows", "Mosaic", "Slideshow", "Single column"];
const ROWS = [
  [1.6, 1, 1.3],
  [1, 1.5, 1.2],
];

// Cell: the packaging-shoot gallery in justified rows, locked behind a password for the client.
export function ShootGalleryRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[460px]">
        <div className="mb-2 flex items-center gap-2 text-[12px]">
          <span className="font-medium">Atlas Coffee — packaging shoot</span>
          <span className="text-muted-foreground">Gallery · 48 photos</span>
        </div>
        <div className="mb-2 flex flex-wrap gap-1">
          {LAYOUTS.map((layout) => (
            <span key={layout} className={cn("rounded-md px-1.5 py-0.5 text-[10px]", layout === "Justified rows" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {layout}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 opacity-60 blur-[2px]">
          {ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((grow, index) => (
                <div key={index} className="overflow-hidden rounded-md" style={{ flexGrow: grow, flexBasis: 0 }}>
                  <CupShot tone={rowIndex * 3 + index} className="block h-[92px] w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[66px] left-1/2 z-[2] w-[240px] -translate-x-1/2 rounded-xl border border-foreground/[0.12] bg-surface-card p-4 text-center text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <span className="mx-auto flex size-9 items-center justify-center rounded-full border border-foreground/[0.12] bg-foreground/[0.05]">
          <Lock className="size-4 text-foreground/80" />
        </span>
        <div className="mt-2.5 text-[13px] font-medium">This gallery is protected</div>
        <div className="mt-0.5 text-muted-foreground">Enter the password Fieldnote sent you</div>
        <div className="mt-3 flex h-8 items-center rounded-md border border-foreground/[0.12] px-3 text-left tracking-[0.3em] text-foreground/80">••••••••</div>
        <span className="mt-2 flex h-8 items-center justify-center rounded-md bg-foreground font-medium text-background">Unlock</span>
      </div>
    </div>
  );
}

const LICENCES = [
  { title: "Packaging photography", scope: "Packaging · Web", term: "12 months", fee: "£4,800", status: "Active", tone: "emerald" },
  { title: "Shop mural illustration", scope: "In-store · UK", term: "24 months", fee: "£2,200", status: "Active", tone: "emerald" },
  { title: "Launch campaign photos", scope: "Social · Print", term: "6 months", fee: "£1,500", status: "Active", tone: "emerald", note: "Ends in 21 days" },
];

// Cell: Issued Licenses for the work Atlas Coffee uses, one flagged in Expirations & Renewals.
export function AtlasLicencesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <FileText className="size-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">Issued Licenses</span>
        <span className="ml-auto text-[11px] text-muted-foreground">Licensee · Atlas Coffee</span>
      </div>
      <div className={cn("grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Licence</span>
        <span>Scope</span>
        <span>Fee</span>
        <span>Status</span>
      </div>
      {LICENCES.map((licence, index) => (
        <div key={licence.title} className={cn("grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span className="min-w-0">
            <span className="block truncate text-foreground/90">{licence.title}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{licence.term}</span>
          </span>
          <span className="truncate text-muted-foreground">{licence.scope}</span>
          <span className="text-foreground/85 tabular-nums">{licence.fee}</span>
          <span className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-foreground/85">
              <Dot tone={licence.tone} /> {licence.status}
            </span>
            {licence.note ? <span className="block truncate text-[11px] text-amber-700 dark:text-amber-300">{licence.note}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

// Cell: Fieldnote's own print shop, a gallery storefront selling through Stripe.
export function PrintShopRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="absolute top-0 left-0 w-[280px]">
        <div className="mb-2 flex items-center gap-2 text-[12px]">
          <span className="font-medium">Fieldnote prints</span>
          <span className="text-muted-foreground">Storefront · Published</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 2, 1, 3].map((tone) => (
            <div key={tone} className="overflow-hidden rounded-md border border-foreground/[0.06]">
              <CupShot tone={tone} className="block h-[96px] w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[40px] right-0 w-[200px] rounded-xl border border-foreground/[0.1] bg-surface-card p-3 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="overflow-hidden rounded-lg">
          <CupShot tone={2} className="block h-[86px] w-full" />
        </div>
        <div className="mt-2.5 font-medium">Morning pour — A2 print</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Giclée print · signed</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">£65</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
            <ShoppingBag className="size-3" /> Add to cart
          </span>
        </div>
      </div>
      <div className="absolute right-[12px] bottom-1 flex w-[200px] items-center gap-2 rounded-lg border border-foreground/[0.08] bg-surface-card px-3 py-2 text-[11px] dark:bg-surface-subtle">
        <Avatar name="Maya Chen" size={18} />
        <span className="min-w-0 flex-1 truncate text-foreground/85">Order #2048 · Paid</span>
        <Dot tone="emerald" />
      </div>
    </div>
  );
}

