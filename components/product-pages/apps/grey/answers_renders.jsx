import {
  ArrowUp,
  CircleHelp,
  Copy,
  Database,
  Ellipsis,
  FlaskConical,
  Globe,
  History,
  Layers,
  Link2,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Minus,
  PanelRightClose,
  Plus,
  Puzzle,
  RotateCcw,
  ScrollText,
  Search,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  Cpu,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, LINE, MonoLabel, Typed, TypingDots, Window } from "@/components/product-pages/mock_kit";
import {
  Badge,
  Card,
  Checkbox,
  Cite,
  EditorHeader,
  Field,
  GhostButton,
  GreySidebar,
  KindTile,
  PANEL,
  PrimaryButton,
  RUN_STATUS,
  SectionRail,
  Segmented,
  StatusText,
  Toggle,
} from "@/components/product-pages/apps/grey/grey_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Grey's answers for Kestrel Aero: the Playground with its citations and context, pipelines, and the quality screens.

const PIPELINE = "Line maintenance answers";

const HERO_SOURCES = [
  { n: 1, title: "De-icing procedure.docx", where: "p. 6", kind: "Document" },
  { n: 2, title: "A320 line maintenance manual.pdf", where: "p. 212", kind: "Document" },
  { n: 3, title: "Ramp safety briefing.mp4", where: "08:14", kind: "Video" },
];

const CHATS = [
  { title: "Post de-icing check sign-off", when: "Now", active: true },
  { title: "APU start on stand 14", when: "2h" },
  { title: "Night shift handover notes", when: "Yesterday" },
  { title: "Deferred defects in the tech log", when: "Yesterday" },
  { title: "Brake wear pin check", when: "Mon" },
  { title: "Torque values for the nose wheel", when: "Mon" },
  { title: "Who holds the rig two keys", when: "Oct 21" },
];

function Question({ children, className }) {
  return (
    <div className={cn("flex justify-end", className)}>
      <div className="max-w-[78%] rounded-xl rounded-tr-sm bg-foreground/[0.07] px-3.5 py-2.5 leading-5 text-foreground/90">{children}</div>
    </div>
  );
}

function ReplyHeader({ time = "09:41", context }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.1] bg-foreground/[0.04]">
        <Database className="size-3 text-foreground/80" />
      </span>
      <span className="font-medium text-foreground/90">{PIPELINE}</span>
      <span className="text-muted-foreground">{time}</span>
      {context ? (
        <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-foreground/[0.06] px-1.5 text-[11px] text-foreground/85 tabular-nums">
          <Layers className="size-3.5" />
          {context}
        </span>
      ) : null}
    </div>
  );
}

function SourceChip({ source, active }) {
  return (
    <span className={cn("inline-flex h-7 max-w-[230px] items-center gap-1.5 rounded-lg border px-2 text-[11.5px]", active ? "border-foreground/25 bg-foreground/[0.06]" : "border-foreground/[0.1]")}>
      <Cite n={source.n} active={active} />
      <span className="truncate text-foreground/85">{source.title}</span>
      <span className="shrink-0 text-muted-foreground">{source.where}</span>
    </span>
  );
}

const ACTIONS = [
  [Copy, "Copy"],
  [RotateCcw, "Ask again"],
  [ThumbsUp, "Helpful"],
  [ThumbsDown, "Not helpful"],
  [CircleHelp, "Mark unanswered"],
];

function ReplyActions() {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      {ACTIONS.map(([Icon, label]) => (
        <span key={label} className="flex size-7 items-center justify-center rounded-md" title={label}>
          <Icon className="size-3.5" />
        </span>
      ))}
    </div>
  );
}

function KnowledgeOnlyChip({ checked = true }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-2 rounded-full border px-3 text-[11.5px] font-medium", checked ? "border-foreground/20 bg-foreground/[0.06] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
      <Checkbox checked={checked} />
      Knowledge base only
    </span>
  );
}

function Composer({ typed, placeholder = `Ask ${PIPELINE} a question…`, checked = true, className }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.12] bg-background/40 px-4 pt-3 pb-2.5 dark:bg-foreground/[0.02]", className)}>
      <div className="min-h-6 leading-6">{typed ? <Typed text={typed} delay={1.4} /> : <span className="text-muted-foreground">{placeholder}</span>}</div>
      <div className="mt-2 flex items-center gap-2">
        <KnowledgeOnlyChip checked={checked} />
        <span className="ml-auto flex size-8 items-center justify-center rounded-full bg-foreground text-background">
          <ArrowUp className="size-4" />
        </span>
      </div>
    </div>
  );
}

// The hero plane: the Playground's chat, a cited answer with its sources, and the next question being typed.
export function PlaygroundChatWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <GreySidebar open="Playground" active="Chat" />
        <div className={cn("flex w-[236px] shrink-0 flex-col border-r", LINE)}>
          <div className={cn("flex h-12 items-center border-b px-4", LINE)}>
            <span className="font-medium">Chats</span>
            <span className="ml-auto flex size-7 items-center justify-center rounded-md border border-foreground/[0.1]">
              <Plus className="size-3.5 text-muted-foreground" />
            </span>
          </div>
          <div className="flex flex-col gap-0.5 p-2">
            {CHATS.map((chat) => (
              <div key={chat.title} className={cn("rounded-lg px-3 py-2", chat.active && "bg-foreground/[0.06]")}>
                <div className={cn("truncate text-[12.5px]", chat.active ? "font-medium text-foreground" : "text-foreground/75")}>{chat.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{chat.when}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
            <span className="truncate font-medium">Post de-icing check sign-off</span>
            <span className="truncate text-[12px] text-muted-foreground">Claude Sonnet 5.5 · Maintenance manuals, Crew handbook</span>
            <span className="ml-auto flex items-center gap-2">
              <Chip dot="emerald" className="h-7">
                {PIPELINE}
              </Chip>
              <span className="flex size-7 items-center justify-center rounded-md border border-foreground/[0.1]">
                <PanelRightClose className="size-3.5 text-muted-foreground" />
              </span>
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-5 px-10 pt-7">
            <Question>Who signs off the post de-icing check, and where is it recorded?</Question>
            <div className="flex flex-col gap-3">
              <ReplyHeader context="6 passages · ~1,492 tokens" />
              <p className="max-w-[600px] text-[14px] leading-[1.65] text-foreground/90">
                The certifying technician signs off the post de-icing check before the aircraft is released
                <Cite n={1} />, and records it in the aircraft technical log with the fluid type and the time the final step started
                <Cite n={2} active />. The check itself is a walk-round of the wings, tail and engine intakes from the de-icing platform
                <Cite n={3} />.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HERO_SOURCES.map((source) => (
                  <SourceChip key={source.n} source={source} active={source.n === 2} />
                ))}
              </div>
              <ReplyActions />
            </div>
            <Question className={styles.popIn}>Does the same apply on the night shift?</Question>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ReplyHeader time="09:42" />
              <TypingDots className="ml-1" />
            </div>
            <Composer typed="Which stands are cleared for de-icing at night?" className="mt-auto mb-6" />
          </div>
        </div>
      </div>
    </Window>
  );
}

const PASSAGES = [
  { n: 1, title: "A320 line maintenance manual.pdf", where: "p. 301", score: "0.84", tokens: 402, cited: true, text: "Before an APU start on the ground, confirm the inlet and exhaust are clear and that no one is within the exhaust hazard area." },
  { n: 2, title: "Engine run-up checklist", where: "", score: "0.79", tokens: 214, cited: true, text: "Stand 14 faces the terminal: call the ramp controller before any APU or engine start and wait for clearance." },
  { n: 3, title: "Ramp safety briefing.mp4", where: "14:32", score: "0.71", tokens: 288, cited: true, text: "Stand on the nose side, clear of the exhaust, and keep eye contact with the flight deck until the APU is running." },
  { n: 4, title: "Night shift handover.m4a", where: "00:45", score: "0.58", tokens: 176, text: "The APU on the second aircraft faulted on start and cleared on the second attempt." },
  { n: 5, title: "Hangar 2 layout.png", where: "", score: "0.36", tokens: 58, text: "Floor plan of Hangar 2: two aircraft bays side by side, a tool crib in the north-west corner." },
  { n: 6, title: "Fleet schedule Q4.xlsx", where: "", score: "0.29", tokens: 340, text: "Ship 304 · Stand 14 · Night stop · Departs 06:10." },
];

function ContextPanel({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-foreground/[0.1] bg-foreground/[0.02]", className)}>
      <div className={cn("flex h-8 items-center gap-2 border-b pr-1.5 pl-3 text-[11px]", LINE)}>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          <span className="font-medium text-foreground/80">Sent to the model</span> · 6 passages · ~1,478 tokens
        </span>
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground">
          <Copy className="size-3" /> Copy
        </span>
      </div>
      {PASSAGES.map((passage, index) => (
        <div key={passage.n} className={cn("flex gap-3 border-b px-3 py-2 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.08}s` }}>
          <span className="mt-px flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border border-foreground/[0.12] text-[10px] font-semibold text-muted-foreground tabular-nums">{passage.n}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-foreground/90">
                {passage.title}
                {passage.where ? <span className="font-normal text-muted-foreground"> · {passage.where}</span> : null}
              </span>
              {passage.cited ? <span className="rounded-full border border-foreground/[0.12] px-2 py-px text-[10px] font-medium text-foreground/75">Cited</span> : null}
              <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                <span className={passage.cited ? "text-foreground/85" : undefined}>{passage.score}</span> · {passage.tokens} tokens
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11.5px] leading-5 text-muted-foreground">{passage.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Section stage: an answer with its context panel open, scores and all, and one citation opened in its popover.
export function CitedAnswerStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-[20px] w-[640px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <MessageCircle className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">APU start on stand 14</span>
          <Chip dot="emerald" className="ml-auto">
            {PIPELINE}
          </Chip>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5">
          <Question>What has to happen before the APU is started on stand 14?</Question>
          <ReplyHeader time="11:08" context="6 passages · ~1,478 tokens" />
          <p className="text-[13.5px] leading-[1.65] text-foreground/90">
            Check that the APU inlet and exhaust are clear and that no one is in the exhaust area
            <Cite n={1} />. Stand 14 faces the terminal, so call the ramp controller and wait for clearance first
            <Cite n={2} />. During the start, stand on the nose side and keep eye contact with the flight deck
            <Cite n={3} active />.
          </p>
          <ContextPanel />
        </div>
      </Window>
      <div className={cn(PANEL, "absolute top-[196px] left-[606px] z-[2] w-[350px] p-4 text-[12px]", styles.float)}>
        <div className="flex items-start gap-2.5">
          <KindTile kind="Video" size={28} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">Ramp safety briefing.mp4</div>
            <div className="text-[11px] text-muted-foreground">14:32</div>
          </div>
          <Cite n={3} active />
        </div>
        <p className="mt-3 rounded-md border border-foreground/[0.08] bg-foreground/[0.03] px-2.5 py-2 leading-[1.55] text-muted-foreground">
          …stand on the nose side, clear of the exhaust, and keep eye contact with the flight deck until the APU is running. Only then walk round to the tail…
        </p>
        <span className="mt-3 flex h-8 items-center justify-center rounded-md border border-foreground/[0.12] text-foreground/85">Open source</span>
      </div>
    </div>
  );
}

// Cell: the Knowledge base only switch in the composer, on and off, with what each one means.
export function KnowledgeOnlyRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-4 text-[12px]">
      <div>
        <div className={cn(PANEL, "mb-2 w-fit max-w-[340px] px-3 py-2 leading-[1.45] text-foreground/85", styles.popIn)} style={{ "--pop-delay": "0.3s" }}>
          Answers use only passages from your knowledge bases — never the model&apos;s own training data.
        </div>
        <Composer placeholder="Ask Line maintenance answers a question…" />
      </div>
      <div className="opacity-80">
        <Composer placeholder="Ask Line maintenance answers a question…" checked={false} />
        <div className={cn(PANEL, "mt-2 w-fit max-w-[340px] px-3 py-2 leading-[1.45] text-foreground/85", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
          The model may add general knowledge where your knowledge bases fall short, and says when it does.
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground/90">{children}</span>
    </div>
  );
}

function Slider({ value, display, label }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground tabular-nums">{display}</span>
      </div>
      <div className="relative mt-2.5 h-1.5 rounded-full bg-foreground/[0.1]">
        <span className={cn("absolute inset-y-0 left-0 origin-left rounded-full bg-foreground", styles.fill)} style={{ width: `${value}%` }} />
        <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" style={{ left: `${value}%` }} />
      </div>
    </div>
  );
}

// Cell: the Playground's run settings: the pipeline's configuration, and overrides for this tab only.
export function RunSettingsRender() {
  return (
    <div className={cn(PANEL, "mx-auto grid w-[460px] grid-cols-2 text-[12px]")}>
      <div className={cn("border-r p-4", LINE)}>
        <MonoLabel>Configuration</MonoLabel>
        <div className="mt-1.5">
          <ConfigRow label="Model">Claude Sonnet 5.5</ConfigRow>
          <ConfigRow label="Search">Hybrid · top 6</ConfigRow>
          <ConfigRow label="Min. similarity">0.2</ConfigRow>
          <ConfigRow label="Rerank">Off</ConfigRow>
          <ConfigRow label="Graph">Auto</ConfigRow>
          <ConfigRow label="Citations">On</ConfigRow>
          <ConfigRow label="Max tokens">1,024</ConfigRow>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <MonoLabel>Session overrides</MonoLabel>
          <RotateCcw className="size-3.5 text-muted-foreground" />
        </div>
        <div className="mt-4 flex flex-col gap-5">
          <Slider label="Temperature" value={15} display="0.3" />
          <Slider label="Passages (top K)" value={42} display="8" />
        </div>
        <p className="mt-auto pt-4 text-[11px] leading-4 text-muted-foreground">Overrides apply to this tab only and are never saved to the pipeline.</p>
      </div>
    </div>
  );
}

// Cell: citations that name the page, or the second in a recording where playback starts.
export function TimestampRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3 text-[12px]">
      <div className="flex flex-wrap gap-1.5">
        <SourceChip source={HERO_SOURCES[1]} />
        <SourceChip source={HERO_SOURCES[2]} active />
      </div>
      <div className={cn(PANEL, "overflow-hidden", styles.popIn)} style={{ "--pop-delay": "0.3s" }}>
        <div className="relative h-[150px] bg-foreground/[0.06]">
          <svg viewBox="0 0 460 150" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-foreground" aria-hidden="true">
            <rect y="96" width="460" height="54" fill="currentColor" fillOpacity="0.08" />
            <path d="M230 150 V100" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M90 82 L212 75 M248 75 L370 82" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
            <circle cx="230" cy="72" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.4" />
            <path d="M230 50 V18" stroke="currentColor" strokeOpacity="0.28" strokeWidth="6" strokeLinecap="round" />
            <circle cx="176" cy="88" r="9" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.35" />
            <circle cx="284" cy="88" r="9" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.35" />
            <path d="M150 128 v-22 m-6 6 h12" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
            <circle cx="150" cy="101" r="4" fill="currentColor" fillOpacity="0.45" />
          </svg>
          <span className="absolute top-3 left-3 rounded-md bg-background/80 px-2 py-1 text-[11px] text-foreground/85 backdrop-blur">Opens at 08:14</span>
        </div>
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <KindTile kind="Video" size={24} />
          <span className="truncate font-medium text-foreground/90">Ramp safety briefing.mp4</span>
          <span className="relative h-1 flex-1 rounded-full bg-foreground/15">
            <span className={cn("absolute inset-y-0 left-0 w-[34%] origin-left rounded-full bg-foreground", styles.fill)} />
            <span className="absolute top-1/2 left-[34%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">08:14 / 24:18</span>
        </div>
      </div>
    </div>
  );
}

const CHANNEL_ICON = { Playground: MessageCircle, Widget: Globe, API: Puzzle };

const CONVERSATIONS = [
  { title: "Post de-icing check sign-off", channel: "Playground", messages: 4, feedback: "up", when: "2 min ago" },
  { title: "Rest after a night duty", channel: "Widget", messages: 6, when: "1 h ago" },
  { title: "Tech log lookup", channel: "API", messages: 2, when: "3 h ago" },
  { title: "APU start on stand 14", channel: "Playground", messages: 8, feedback: "down", when: "Yesterday" },
  { title: "Swap request deadline", channel: "Widget", messages: 3, feedback: "unanswered", when: "Yesterday" },
];

// Cell: Conversations, one list for chats from the Playground, the widget and the API.
export function ConversationsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
        <History className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Conversations</span>
        <span className="ml-auto">
          <Segmented options={["All", "Playground", "Widget", "API"]} value="All" itemClassName="px-2 py-0.5 text-[11px]" />
        </span>
      </div>
      {CONVERSATIONS.map((row, index) => {
        const Icon = CHANNEL_ICON[row.channel];
        return (
          <div key={row.title} className={cn("grid grid-cols-[minmax(0,1fr)_88px_34px_22px_66px] items-center gap-2 border-b px-3.5 py-2 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.08}s` }}>
            <span className="truncate text-foreground/90">{row.title}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3.5" /> {row.channel}
            </span>
            <span className="text-right text-muted-foreground tabular-nums">{row.messages}</span>
            <span className="flex justify-center">
              {row.feedback === "up" ? <ThumbsUp className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : null}
              {row.feedback === "down" ? <ThumbsDown className="size-3.5 text-red-600 dark:text-red-400" /> : null}
              {row.feedback === "unanswered" ? <CircleHelp className="size-3.5 text-amber-600 dark:text-amber-400" /> : null}
            </span>
            <span className="text-right text-[11px] text-muted-foreground">{row.when}</span>
          </div>
        );
      })}
    </div>
  );
}

const PIPELINE_SECTIONS = [
  { label: "Model", icon: Cpu },
  { label: "Retrieval", icon: Database },
  { label: "Prompt", icon: FileText },
  { label: "Versions", icon: History },
  { label: "Endpoints", icon: Link2 },
  { label: "Danger zone", icon: TriangleAlert },
];

function SwitchTile({ title, on }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-2">
      <span className="truncate text-[12px] font-medium text-foreground/90">{title}</span>
      <Toggle on={on} />
    </div>
  );
}

const PIPELINE_KBS = [
  ["Maintenance manuals", true],
  ["Crew handbook", true],
  ["IT service desk", false],
];

// Section stage: a pipeline's retrieval settings, and the publish dialog that makes the change live.
export function PipelineStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[620px] w-[664px]">
        <EditorHeader back="All Pipelines" title={PIPELINE} status={<Badge tone="emerald">Live · v7</Badge>}>
          <PrimaryButton icon={Megaphone}>Publish</PrimaryButton>
        </EditorHeader>
        <div className="flex min-h-0 flex-1">
          <SectionRail items={PIPELINE_SECTIONS} active="Retrieval" />
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
            <Card title="Knowledge bases" description="Sources this pipeline retrieves chunks from." bodyClassName="flex flex-wrap gap-x-5 gap-y-2 py-2.5">
              {PIPELINE_KBS.map(([name, checked]) => (
                <span key={name} className="flex items-center gap-2 text-[12px]">
                  <Checkbox checked={checked} />
                  <span className={checked ? "text-foreground/90" : "text-muted-foreground"}>{name}</span>
                </span>
              ))}
            </Card>
            <Card title="Retrieval" description="How chunks are found and ranked for each query.">
              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-foreground/85">Top K</span>
                  <span className="flex h-8 items-center rounded-lg border border-foreground/[0.12]">
                    <span className="flex w-8 justify-center text-muted-foreground">
                      <Minus className="size-3.5" />
                    </span>
                    <span className="w-8 text-center font-medium tabular-nums">6</span>
                    <span className="flex w-8 justify-center text-muted-foreground">
                      <Plus className="size-3.5" />
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-foreground/85">Graph mode</span>
                  <Segmented options={["Off", "Auto", "Always"]} value="Auto" className="flex" itemClassName="flex-1" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <SwitchTile title="Rerank" />
                <SwitchTile title="Hybrid search" on />
                <SwitchTile title="Citations" on />
              </div>
              <div className="mt-4 text-[12px]">
                <Slider label="Similarity threshold" value={20} display="0.20" />
              </div>
            </Card>
          </div>
        </div>
      </Window>
      <div className={cn(PANEL, "absolute top-[236px] left-[636px] z-[2] w-[350px] p-4 text-[12px]", styles.float)}>
        <div className="text-[14px] font-medium">Publish pipeline</div>
        <p className="mt-1 leading-[1.45] text-muted-foreground">This snapshots the current configuration as a new version and makes it live.</p>
        <Field label="Release note (optional)" className="mt-3.5" boxClassName="min-h-[64px] items-start border-foreground/25 py-2">
          <Typed text="Added the Crew handbook" delay={1.4} />
        </Field>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="px-2.5 text-muted-foreground">Cancel</span>
          <PrimaryButton icon={Megaphone}>Publish</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const PIPELINES = [
  { name: PIPELINE, kbs: "Maintenance manuals, Crew handbook", model: "Anthropic · Claude Sonnet 5.5", status: "Live", version: "v7" },
  { name: "Crew questions", kbs: "Crew handbook", model: "OpenAI · GPT-5 mini", status: "Live", version: "v3" },
  { name: "Service desk bot", kbs: "IT service desk", model: "Google · Gemini 3 Flash", status: "Draft", version: "—" },
];

// Cell: All Pipelines, two live and one still a draft.
export function PipelinesListRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("grid grid-cols-[minmax(0,1fr)_64px_40px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Pipeline</span>
        <span>Status</span>
        <span className="text-right">Version</span>
      </div>
      {PIPELINES.map((pipeline, index) => (
        <div key={pipeline.name} className={cn("grid grid-cols-[minmax(0,1fr)_64px_40px] items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground/90">{pipeline.name}</div>
            <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{pipeline.model}</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Database className="size-3" /> <span className="truncate">{pipeline.kbs}</span>
            </div>
          </div>
          <Badge tone={pipeline.status === "Live" ? "emerald" : "neutral"} className="w-fit">
            {pipeline.status}
          </Badge>
          <span className="text-right font-mono text-[11.5px] text-muted-foreground">{pipeline.version}</span>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ children }) {
  return <span className="rounded bg-foreground/[0.1] px-1 text-foreground">{children}</span>;
}

// Cell: the system prompt, with {{context}} and {{question}} placing the passages and the question.
export function PromptRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="font-medium">System prompt</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Every response is grounded with this instruction.</span>
        </div>
        <div className="flex flex-col gap-2.5 px-4 py-3.5 font-mono text-[11.5px] leading-[1.7] text-foreground/85">
          <p>You answer questions from Kestrel Aero&apos;s line maintenance team. Use only the passages below, and cite each one you rely on as [n].</p>
          <p>If the passages don&apos;t answer the question, say so and suggest who to ask.</p>
          <p>
            Passages:
            <br />
            <Placeholder>{"{{context}}"}</Placeholder>
          </p>
          <p>
            Question:
            <br />
            <Placeholder>{"{{question}}"}</Placeholder>
          </p>
        </div>
      </div>
      <p className="mt-2.5 px-1 text-[11px] text-muted-foreground">
        Use <span className="font-mono text-foreground/80">{"{{context}}"}</span> and <span className="font-mono text-foreground/80">{"{{question}}"}</span> to place retrieved context and the user&apos;s question.
      </p>
    </div>
  );
}

const RUNS = [
  { set: "De-icing questions", pipeline: PIPELINE, status: "Running" },
  { set: "De-icing questions", pipeline: PIPELINE, status: "Completed", metrics: [94, 91, 82, 78] },
  { set: "Tech log sign-off", pipeline: PIPELINE, status: "Completed", metrics: [89, 93, 76, 71] },
  { set: "Rostering rules", pipeline: "Crew questions", status: "Completed", metrics: [96, 88, 84, 80] },
  { set: "Service desk basics", pipeline: "Service desk bot", status: "Failed" },
  { set: "Rostering rules", pipeline: "Crew questions", status: "Queued" },
];

function MetricCell({ value, delay }) {
  if (value === undefined) return <span className="text-right text-muted-foreground">—</span>;
  return (
    <span className="flex flex-col items-end gap-1">
      <span className="text-foreground/90 tabular-nums">{value}%</span>
      <span className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
        <span className={cn("absolute inset-y-0 left-0 origin-left rounded-full bg-foreground/55", styles.fill)} style={{ width: `${value}%`, "--fill-delay": `${delay}s` }} />
      </span>
    </span>
  );
}

const CASES = [
  { q: "Who signs off the post de-icing check?", a: "The certifying technician, before the aircraft is released.", sources: 1 },
  { q: "Where is the de-icing time recorded?", a: "In the technical log, with the fluid type and start time.", sources: 2 },
  { q: "Which stands can be used for de-icing at night?", a: "Stands 12 to 16, with the rig two floodlights on.", sources: 1 },
  { q: "Who do I call if rig two is out of service?", a: "Maintenance control, then the duty ramp manager.", sources: 1 },
];

// Section stage: evaluation runs scored on the four metrics, with an eval set's cases open beside them.
export function EvaluationsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 w-[760px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <FlaskConical className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Evaluations</span>
          <Segmented options={["Sets", "Runs"]} value="Runs" className="ml-2" itemClassName="py-0.5" />
          <PrimaryButton className="ml-auto">Run evaluation</PrimaryButton>
        </div>
        <div className={cn("grid grid-cols-[minmax(0,1fr)_100px_76px_76px_76px_76px] gap-3 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Set</span>
          <span>Status</span>
          <span className="text-right">Faithfulness</span>
          <span className="text-right">Relevance</span>
          <span className="text-right">Precision</span>
          <span className="text-right">Recall</span>
        </div>
        {RUNS.map((run, index) => (
          <div key={`${run.set}-${index}`} className={cn("grid grid-cols-[minmax(0,1fr)_100px_76px_76px_76px_76px] items-center gap-3 border-b px-5 py-2.5 text-[12px] last:border-b-0", LINE)}>
            <span className="min-w-0">
              <span className="block truncate text-foreground/90">{run.set}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{run.pipeline}</span>
            </span>
            <StatusText label={run.status} tone={RUN_STATUS[run.status]} live={run.status === "Running"} />
            {[0, 1, 2, 3].map((metric) => (
              <MetricCell key={metric} value={run.metrics?.[metric]} delay={0.3 + metric * 0.12 + index * 0.05} />
            ))}
          </div>
        ))}
      </Window>
      <div className={cn(PANEL, "absolute top-[236px] left-[470px] z-[2] w-[510px] text-[12px]", styles.float)}>
        <div className={cn("flex items-start gap-3 border-b px-4 py-3.5", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-medium">De-icing questions</div>
            <div className="mt-0.5 text-muted-foreground">What the line team asks every winter · 24 cases</div>
          </div>
          <GhostButton icon={Plus}>Add case</GhostButton>
        </div>
        <div className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_52px] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Question</span>
          <span>Expected answer</span>
          <span className="text-right">Sources</span>
        </div>
        {CASES.map((row, index) => (
          <div key={row.q} className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_52px] gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.1}s` }}>
            <span className="leading-[1.45] text-foreground/90">{row.q}</span>
            <span className="leading-[1.45] text-muted-foreground">{row.a}</span>
            <span className="text-right text-muted-foreground tabular-nums">{row.sources}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEEDBACK_MENU = [
  { label: "Open conversation", icon: MessageSquare },
  { label: "Add to eval set", icon: FlaskConical, active: true },
  { label: "Resolve", icon: CheckCircle2 },
];

// Cell: Feedback, with a thumbs-down being promoted into an eval set.
export function FeedbackRender() {
  return (
    <div className="relative mx-auto h-[310px] w-[460px] text-[12px]">
      <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        {[
          ["Thumbs up", "412"],
          ["Thumbs down", "23"],
          ["Unanswered", "9"],
          ["Satisfaction", "95%"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-3 py-2.5", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[17px] font-medium tracking-[-0.01em] tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <Segmented options={["Negative", "Unanswered", "All"]} value="Negative" className="mt-3" />
      <div className="mt-2.5 flex flex-col gap-1.5">
        <div className="rounded-xl border border-foreground/20 bg-foreground/[0.04] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <ThumbsDown className="size-3.5 text-red-600 dark:text-red-400" />
            <span className="truncate font-medium text-foreground/90">Can a deferred defect stay open past the next check?</span>
            <Ellipsis className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </div>
          <div className="mt-1 truncate pl-5.5 text-muted-foreground">“Cited last year&apos;s procedure” · {PIPELINE}</div>
        </div>
        <div className="rounded-xl border border-foreground/[0.08] bg-surface-card px-3.5 py-2.5 dark:bg-surface-subtle">
          <div className="flex items-center gap-2">
            <ThumbsDown className="size-3.5 text-red-600 dark:text-red-400" />
            <span className="truncate font-medium text-foreground/90">Is the hangar door code on the night sheet?</span>
          </div>
          <div className="mt-1 truncate pl-5.5 text-muted-foreground">“Answered from the wrong hangar” · {PIPELINE}</div>
        </div>
      </div>
      <div className={cn(PANEL, "absolute top-[146px] right-[8px] z-[2] w-[196px] p-1.5", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        {FEEDBACK_MENU.map(({ label, icon: Icon, active }) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/75")}>
            <Icon className="size-3.5 text-muted-foreground" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

const LOGS = [
  { time: "11:08:42", channel: "Playground", query: "What has to happen before the APU is started…", status: "OK", ms: "1.4 s" },
  { time: "11:06:15", channel: "MCP", query: "post de-icing check sign-off", status: "OK", ms: "0.6 s" },
  { time: "11:02:51", channel: "Widget", query: "Rest after a night duty", status: "Error", ms: "0.2 s" },
];

const TRACE = [
  ["A320 line maintenance manual.pdf", "Hybrid", "0.84"],
  ["Engine run-up checklist", "Vector", "0.79"],
  ["Ramp safety briefing.mp4", "Graph", "0.71"],
];

// Cell: Request Logs across every channel, with one request's trace of the chunks it retrieved.
export function RequestTraceRender() {
  return (
    <div className="relative mx-auto h-[350px] w-[460px] text-[12px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <ScrollText className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Request Logs</span>
          <span className="ml-auto flex gap-1.5">
            {["Playground", "Widget", "API", "MCP"].map((channel) => (
              <span key={channel} className="rounded border border-foreground/[0.08] px-1.5 py-px text-[10.5px] text-muted-foreground">
                {channel}
              </span>
            ))}
          </span>
        </div>
        {LOGS.map((log, index) => (
          <div key={log.time} className={cn("grid grid-cols-[58px_74px_minmax(0,1fr)_44px_36px] items-center gap-2 border-b px-3.5 py-2 last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
            <span className="font-mono text-[10.5px] text-muted-foreground">{log.time}</span>
            <span className="text-muted-foreground">{log.channel}</span>
            <span className="truncate text-foreground/85">{log.query}</span>
            <StatusText label={log.status} tone={log.status === "OK" ? "emerald" : "red"} />
            <span className="text-right text-[11px] text-muted-foreground tabular-nums">{log.ms}</span>
          </div>
        ))}
      </div>
      <div className={cn(PANEL, "absolute top-[156px] left-[40px] z-[2] w-[380px] p-3.5", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Request trace</span>
          <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">1.4 s · 1,912 tokens</span>
        </div>
        <MonoLabel className="mt-3 block">Retrieved chunks</MonoLabel>
        <div className="mt-1.5 flex flex-col gap-1">
          {TRACE.map(([name, via, score]) => (
            <div key={name} className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-1.5">
              <span className="min-w-0 flex-1 truncate text-foreground/85">{name}</span>
              <Badge>{via}</Badge>
              <span className="w-8 text-right text-[11px] text-muted-foreground tabular-nums">{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

