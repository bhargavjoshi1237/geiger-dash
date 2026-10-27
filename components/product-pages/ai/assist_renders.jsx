import {
  Check,
  FileQuestion,
  FileText,
  Hourglass,
  Languages,
  Mail,
  MessageSquareReply,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  StickyNote,
  Tag,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Webhook,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, Dot, LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// AI and automation inside the other apps: Comms Copilot, knowledge gaps and article AI, the Notes assistant card,
// Content's steerable feed, and rule-based automations in Comms and Forms.

const GAPS = [
  { topic: "How do I reset two-factor authentication?", impact: 42, questions: 37, trend: "Rising", change: "+18%", sources: "Conversations, Messenger", active: true },
  { topic: "Moving a booking to another date", impact: 31, questions: 26, trend: "Steady", change: "0%", sources: "Conversations" },
  { topic: "Adding a VAT number to invoices", impact: 24, questions: 19, trend: "Rising", change: "+9%", sources: "Messenger, Reactions" },
  { topic: "Exporting contacts to CSV", impact: 17, questions: 14, trend: "Falling", change: "−6%", sources: "Conversations" },
  { topic: "Changing the account owner", impact: 12, questions: 9, trend: "Steady", change: "+1%", sources: "Messenger" },
  { topic: "Custom domain for the help center", impact: 9, questions: 8, trend: "Falling", change: "−3%", sources: "Conversations" },
];

const TREND_ICON = { Rising: TrendingUp, Falling: TrendingDown, Steady: Minus };

function GapsTable({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <FileQuestion className="size-4 text-muted-foreground" />
        <span className="font-medium">Knowledge Gaps</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Last 30 days</span>
      </div>
      <div className={cn("grid grid-cols-4 border-b", LINE)}>
        {[
          ["Open gaps", "12"],
          ["Questions (30 days)", "418"],
          ["Unanswered rate", "9%"],
          ["Resolved (30 days)", "7"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-5 py-3.5", index > 0 && "border-l", LINE)}>
            <div className="truncate text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[18px] font-medium tracking-tight">{value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1fr_64px_96px_88px] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Topic</span>
        <span>Impact</span>
        <span>Questions (30d)</span>
        <span>Trend</span>
      </div>
      {GAPS.map((gap) => {
        const Icon = TREND_ICON[gap.trend];
        return (
          <div key={gap.topic} className={cn("grid grid-cols-[1fr_64px_96px_88px] items-center gap-3 border-b px-5 py-3", LINE, gap.active && "bg-foreground/[0.045]")}>
            <span className="min-w-0">
              <span className="block truncate text-foreground/90">{gap.topic}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{gap.sources}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-8 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span className="block h-full rounded-full bg-foreground/60" style={{ width: `${Math.min(100, gap.impact * 2.2)}%` }} />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{gap.impact}</span>
            </span>
            <span className="font-mono text-[12px] text-foreground/80">{gap.questions}</span>
            <span className={cn("flex items-center gap-1 text-[12px]", gap.trend === "Rising" ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground")}>
              <Icon className="size-3.5" /> {gap.change}
            </span>
          </div>
        );
      })}
    </Window>
  );
}

function GapDrawer({ className }) {
  return (
    <Window className={className}>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="text-[15px] leading-5 font-medium">How do I reset two-factor authentication?</div>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>Impact 42</span>
          <span className="size-1 rounded-full bg-foreground/30" />
          <span className="text-amber-700 dark:text-amber-300">Rising +18%</span>
        </div>
      </div>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="mb-2.5 text-[11px] font-medium text-muted-foreground">What Customers Asked</div>
        <div className="flex flex-col gap-2 text-[12px]">
          {["Lost my phone, can't log in with 2FA", "2FA codes stopped working after I changed phones", "Where do I turn off two-step login?"].map((quote) => (
            <div key={quote} className="rounded-lg bg-foreground/[0.04] px-3 py-2 text-foreground/85">
              “{quote}”
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-2.5 text-[11px] font-medium text-muted-foreground">Articles That Almost Answer It</div>
        <div className="flex items-center gap-2.5 rounded-lg border border-foreground/[0.08] px-3 py-2.5 text-[12px]">
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="text-foreground/90">Set up two-factor authentication</span>
          <span className="ml-auto rounded bg-amber-500/10 px-1.5 py-0.5 text-[10.5px] text-amber-700 dark:text-amber-300">Weak match</span>
        </div>
        <div className="mt-4 flex gap-2 text-[12px]">
          <span className="rounded-md bg-foreground px-2.5 py-1.5 font-medium text-background">Create article</span>
          <span className="rounded-md border border-foreground/[0.12] px-2.5 py-1.5 text-foreground/80">Suggest edit</span>
          <span className="rounded-md border border-foreground/[0.12] px-2.5 py-1.5 text-foreground/80">Link existing article</span>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the gaps report behind, one cluster open in its drawer.
export function GapsStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <div className="absolute top-[40px] left-0 opacity-90">
        <GapsTable className="w-[640px]" />
      </div>
      <GapDrawer className="absolute top-0 right-0 z-[2] w-[400px]" />
    </div>
  );
}

const SUMMARY = [
  "Maya was charged twice for October on the Pro plan.",
  "Aria refunded the duplicate charge; it lands in 3–5 days.",
  "Maya asked for an updated invoice with her VAT number.",
  "Still open: send the corrected invoice.",
];

export function SummaryRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/10 dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <Sparkles className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Conversation summary</span>
        <span className="ml-auto rounded bg-foreground/[0.07] px-1.5 py-0.5 text-[10.5px] text-muted-foreground">AI-generated</span>
      </div>
      <ul className="mt-3.5 flex flex-col gap-2">
        {SUMMARY.map((line, index) => (
          <li key={line} className={cn("flex gap-2.5 leading-5 text-foreground/90", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.15}s` }}>
            <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/50" />
            {line}
          </li>
        ))}
      </ul>
      <div className={cn("mt-4 flex items-center gap-2 border-t pt-3 text-[11px] text-muted-foreground", LINE)}>
        Generated by Anthropic · Claude Sonnet 5.5
        <span className="ml-auto flex items-center gap-1 text-foreground/80">
          <RefreshCw className="size-3" /> Regenerate
        </span>
        <span className="flex items-center gap-1 text-foreground/80">
          <StickyNote className="size-3" /> Insert as note
        </span>
      </div>
    </div>
  );
}

const ARTICLE_AI = ["Improve writing", "Shorten", "Expand", "Change tone", "Write description", "Suggest titles", "Translate with AI"];

export function ArticleAiRender() {
  return (
    <div className="relative mx-auto h-[350px] w-[460px]">
      <div className={cn("absolute inset-x-0 top-0 rounded-xl border border-foreground/[0.1] bg-surface-card px-5 pt-4 pb-16 text-[13px] dark:bg-surface-subtle", styles.fadeBottom)}>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="text-foreground/80">Articles</span> / Security
          <span className="ml-auto rounded bg-foreground/[0.06] px-1.5 py-0.5">Changes unpublished</span>
        </div>
        <div className="mt-3 text-[16px] font-medium tracking-tight">Set up two-factor authentication</div>
        <p className="mt-2 leading-6 text-foreground/80">
          Two-factor authentication adds a second step when you sign in.{" "}
          <mark className="rounded-[3px] bg-foreground/[0.12] px-0.5 text-foreground">If you lose your phone, ask an admin to reset it from Members.</mark>
        </p>
      </div>
      <div className="absolute top-[142px] left-[190px] z-[2] w-[230px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        {ARTICLE_AI.map((item, index) => (
          <div key={item} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1", index === 2 ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            {item === "Translate with AI" ? <Languages className="size-3.5 text-muted-foreground" /> : <Sparkles className="size-3.5 text-muted-foreground" />}
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const STICKIES = [
  { text: "Onboarding emails feel generic", at: [0, 26], rotate: -3 },
  { text: "Pricing page confuses teams", at: [20, 150], rotate: 2 },
  { text: "Users want a Slack digest", at: [6, 238], rotate: -1 },
];

const SPAWNED = ["Rewrite the welcome email", "Add a team plan FAQ", "Prototype a weekly digest"];

export function NotesAiRender() {
  return (
    <div
      className="relative mx-auto h-[310px] w-[470px] rounded-xl border border-foreground/[0.06]"
      style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
    >
      {STICKIES.map((sticky) => (
        <div
          key={sticky.text}
          className="absolute w-[128px] rounded-md border border-foreground/[0.08] bg-surface-card px-3 py-2.5 text-[11.5px] leading-4 text-foreground/85 shadow-md shadow-black/10 dark:bg-surface-hover"
          style={{ left: sticky.at[0] + 12, top: sticky.at[1], rotate: `${sticky.rotate}deg` }}
        >
          {sticky.text}
        </div>
      ))}
      <div className="absolute top-[22px] left-[160px] w-[180px] rounded-xl border border-foreground/[0.12] bg-surface-card p-3 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="size-3.5 text-muted-foreground" /> AI assistant
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-1 text-[11px]">
          {["Summarize", "Cluster", "Brainstorm", "Action items"].map((mode) => (
            <span key={mode} className={cn("rounded-md px-1.5 py-1 text-center", mode === "Action items" ? "bg-foreground text-background" : "bg-foreground/[0.05] text-muted-foreground")}>
              {mode}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex flex-col gap-1 text-[11px] text-foreground/85">
          {SPAWNED.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="size-3 text-muted-foreground" /> {item}
            </span>
          ))}
        </div>
        <div className="mt-3 rounded-md bg-foreground/[0.07] py-1.5 text-center text-[11px] font-medium">Spawn as notes</div>
      </div>
      {SPAWNED.map((item, index) => (
        <div
          key={item}
          className={cn("absolute w-[112px] rounded-md border border-foreground/20 bg-surface-card px-2.5 py-2 text-[11px] leading-4 text-foreground shadow-md shadow-black/10 dark:bg-surface-hover", styles.popIn)}
          style={{ left: 352, top: 26 + index * 92, "--pop-delay": `${0.6 + index * 0.25}s` }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Segmented({ label, options, active }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] text-muted-foreground">{label}</div>
      <div className="grid grid-cols-3 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] p-0.5 text-[12px]">
        {options.map((option) => (
          <span key={option} className={cn("rounded-md py-1 text-center", option === active ? "bg-surface-card text-foreground shadow-sm dark:bg-surface-hover" : "text-muted-foreground")}>
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SteerRender() {
  return (
    <div className="mx-auto flex w-[440px] flex-col gap-4 rounded-xl border border-foreground/[0.08] bg-surface-card p-5 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <span className="font-medium">Steer your feed</span>
        <span className="ml-auto text-[11px] text-muted-foreground">Up to 6 at a time</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 py-2">
        <span className="text-foreground/90">more vintage motorsport photos</span>
        <span className="ml-auto rounded bg-foreground/[0.07] px-1.5 py-0.5 text-[10.5px] text-muted-foreground">3 days</span>
      </div>
      <Segmented label="Exploration" options={["Focused", "Balanced", "Adventurous"]} active="Balanced" />
      <Segmented label="Variety" options={["Tight", "Balanced", "Wide"]} active="Wide" />
    </div>
  );
}

// A Comms workflow on the canvas: a quiet customer gets one nudge, then the conversation closes itself.
const CANVAS_NODES = [
  { id: "trigger", kind: "Trigger", icon: Hourglass, label: "Customer unresponsive", at: [24, 20] },
  { id: "condition", kind: "Condition", icon: Tag, label: "State is Open", at: [24, 128] },
  { id: "reply", kind: "Action", icon: MessageSquareReply, label: "Send a reply", at: [24, 236] },
  { id: "wait", kind: "Action", icon: Hourglass, label: "Wait · 2 days", at: [300, 236] },
  { id: "close", kind: "Action", icon: XCircle, label: "Close conversation", at: [300, 344] },
];

export function WorkflowCanvasRender() {
  return (
    <div
      className="relative h-[440px] w-[560px] rounded-xl border border-foreground/[0.06]"
      style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2 text-[12px]">
        <span className="font-medium text-foreground/90">Close quiet conversations</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <Dot tone="emerald" /> Live
        </span>
      </div>
      <svg viewBox="0 0 560 440" className="absolute inset-0 h-full w-full text-foreground" aria-hidden="true">
        {["M134 72 V128", "M134 180 V236", "M244 262 H300", "M410 288 V344"].map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.25" className={styles.flow} />
        ))}
      </svg>
      {CANVAS_NODES.map((node) => {
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className="absolute w-[220px] rounded-xl border border-foreground/[0.1] bg-surface-card px-3 py-2.5 text-[12px] shadow-lg shadow-black/10 dark:bg-surface-subtle"
            style={{ left: node.at[0], top: node.at[1] }}
          >
            <MonoLabel className="text-[10px]">{node.kind}</MonoLabel>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-foreground/90">
              <Icon className="size-3.5 text-muted-foreground" /> {node.label}
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-4 left-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Plus className="size-3.5" /> Add step
      </div>
    </div>
  );
}

const THEN_ACTIONS = [
  [Tag, "Set status", "Needs review"],
  [Tag, "Set priority", "High"],
  [UserPlus, "Assign to", "Arjun Patel"],
  [Mail, "Send email to", "events@halcyon.co"],
  [Webhook, "Call webhook URL", "https://…/hooks/vip"],
];

export function FormsRuleRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.08] bg-surface-card p-4 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <span className="font-medium">VIP pass requests</span>
        <span className="ml-auto text-[11px] text-muted-foreground">Geiger Summit 2026 — Registration</span>
      </div>
      <div className="mt-3.5 flex items-start gap-3">
        <span className="w-12 shrink-0 pt-1 text-muted-foreground">When</span>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <Chip>VIP pass</Chip>
          <span className="text-[12px] text-muted-foreground">Equals</span>
          <Chip>Yes</Chip>
          <span className="text-[11px] text-muted-foreground">All match</span>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="w-12 shrink-0 pt-1.5 text-muted-foreground">Then</span>
        <div className="flex flex-1 flex-col gap-1.5">
          {THEN_ACTIONS.map(([Icon, action, value], index) => (
            <div
              key={action}
              className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-1.5 text-[12px]", styles.popIn)}
              style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}
            >
              <Icon className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{action}</span>
              <span className="ml-auto truncate text-foreground/90">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RUNS = [
  { workflow: "Escalate urgent conversations", status: "Success", time: "2m ago", ms: "412 ms" },
  { workflow: "Close quiet conversations", status: "Success", time: "9m ago", ms: "238 ms" },
  { workflow: "Tag billing questions", status: "Skipped", time: "14m ago", ms: "61 ms" },
  { workflow: "Send VIP alert to webhook", status: "Failed", time: "31m ago", ms: "1.2 s" },
  { workflow: "Escalate urgent conversations", status: "Running", time: "now", ms: "—" },
];

const RUN_TONE = {
  Success: ["emerald", "text-emerald-700 dark:text-emerald-400"],
  Failed: ["red", "text-red-600 dark:text-red-400"],
  Running: ["amber", "text-amber-700 dark:text-amber-300"],
  Skipped: ["neutral", "text-muted-foreground"],
};

export function RunHistoryRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          ["Total runs", "1,284"],
          ["Success rate", "97.6%"],
          ["Avg duration", "290 ms"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-4 py-3", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[15px] font-medium tracking-tight">{value}</div>
          </div>
        ))}
      </div>
      {RUNS.map((run, index) => {
        const [tone, text] = RUN_TONE[run.status];
        return (
          <div key={`${run.workflow}-${index}`} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
            <span className={cn("flex w-[72px] shrink-0 items-center gap-1.5", text)}>
              <Dot tone={tone} className={run.status === "Running" ? styles.pulse : undefined} /> {run.status}
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground/85">{run.workflow}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{run.ms}</span>
            <span className="w-12 text-right text-[11px] text-muted-foreground">{run.time}</span>
          </div>
        );
      })}
    </div>
  );
}
