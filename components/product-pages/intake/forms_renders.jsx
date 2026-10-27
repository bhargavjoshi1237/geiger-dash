import { Check, ChevronDown, CornerDownLeft, Kanban, MessageSquare, ShieldCheck, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, Kbd, LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Forms renders, drawn from the Summit 2026 registration form in the Forms showcase seed.

const STATUS_TONES = {
  Approved: "emerald",
  Complete: "emerald",
  Pending: "amber",
  "Needs review": "amber",
  "Awaiting payment": "neutral",
  Rejected: "red",
  Spam: "neutral",
};

export function ResponseStatus({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground/85">
      <Dot tone={STATUS_TONES[status]} />
      {status}
    </span>
  );
}

const RESPONSES = [
  { name: "Leah Mensah", company: "Orbital Freight", status: "Pending", priority: "High", score: 44, tags: ["enterprise", "sales"], assignee: "Arjun Patel", time: "2m" },
  { name: "Zara Patel", company: "Cobalt Retail", status: "Approved", priority: "High", score: 18, tags: ["enterprise"], assignee: "Arjun Patel", time: "1h" },
  { name: "Kofi Asante", company: "Lumen Health", status: "Needs review", priority: "Medium", score: 31, tags: ["online"], assignee: "Ines Duarte", time: "3h" },
  { name: "Theo Lindqvist", company: "Atlas Coffee", status: "Awaiting payment", priority: "Medium", score: 22, tags: ["vip"], assignee: "", time: "5h" },
  { name: "Ines Duarte", company: "Kestrel Aero", status: "Complete", priority: "Low", score: 12, tags: ["online"], assignee: "Arjun Patel", time: "1d" },
  { name: "Marcus Hale", company: "Fieldnote", status: "Approved", priority: "Medium", score: 27, tags: ["sales"], assignee: "Ines Duarte", time: "1d" },
  { name: "unknown@mailbox.ru", company: "", status: "Spam", priority: "Low", score: 0, tags: [], assignee: "", time: "2d" },
];

const VIEWS = ["All responses", "VIP guests", "Approval queue", "Enterprise leads"];

export function ResponsesWindow({ className }) {
  return (
    <Window className={cn("w-[720px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <span className="font-medium">Geiger Summit 2026 — Registration</span>
        <span className="text-muted-foreground">84 responses</span>
        <span className="ml-auto flex items-center rounded-md border border-foreground/10 p-0.5 text-muted-foreground">
          <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
            <Table2 className="size-3.5" /> Table
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5">
            <Kanban className="size-3.5" /> Kanban
          </span>
        </span>
      </div>
      <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
        {VIEWS.map((view, index) => (
          <span key={view} className={cn("rounded-full px-2.5 py-1", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
            {view}
          </span>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1.6fr_1.1fr_0.7fr_0.5fr_1fr_0.5fr] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Respondent</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Score</span>
        <span>Tags</span>
        <span className="text-right">Owner</span>
      </div>
      {RESPONSES.map((response, index) => (
        <div
          key={response.name}
          className={cn("grid grid-cols-[1.6fr_1.1fr_0.7fr_0.5fr_1fr_0.5fr] items-center gap-3 border-b px-5 py-2.5", LINE, index === 0 && "bg-foreground/[0.04]")}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={response.name} size={22} />
            <span className="min-w-0">
              <span className={cn("block truncate", response.status === "Spam" ? "text-muted-foreground" : "font-medium")}>{response.name}</span>
              {response.company ? <span className="block truncate text-[11px] text-muted-foreground">{response.company}</span> : null}
            </span>
          </span>
          <ResponseStatus status={response.status} />
          <span className="text-foreground/80">{response.priority}</span>
          <span className="font-mono text-[12px] text-foreground/80">{response.score}</span>
          <span className="flex min-w-0 gap-1 overflow-hidden">
            {response.tags.map((tag) => (
              <span key={tag} className="rounded border border-foreground/10 px-1.5 text-[11px] leading-5 text-muted-foreground">
                {tag}
              </span>
            ))}
          </span>
          <span className="flex justify-end">
            {response.assignee ? <Avatar name={response.assignee} size={20} /> : <span className="size-5 rounded-full border border-dashed border-foreground/30" />}
          </span>
        </div>
      ))}
    </Window>
  );
}

function Answer({ label, children }) {
  return (
    <div className="py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground/90">{children}</div>
    </div>
  );
}

export function ResponseDetail({ className }) {
  return (
    <Window className={cn("w-[360px]", className)}>
      <div className={cn("flex items-center gap-3 border-b px-5 py-4", LINE)}>
        <Avatar name="Leah Mensah" size={32} />
        <div className="min-w-0">
          <div className="font-medium">Leah Mensah</div>
          <div className="text-[12px] text-muted-foreground">leah@orbitalfreight.com</div>
        </div>
        <span className="ml-auto">
          <ResponseStatus status="Pending" />
        </span>
      </div>
      <div className={cn("border-b px-5 py-2", LINE)}>
        <Answer label="Team size">200+</Answer>
        <Answer label="How will you attend?">In person</Answer>
        <Answer label="Book a 1:1">Thursday, 14:30</Answer>
        <Answer label="Annual tooling budget">$40,000 – $60,000</Answer>
      </div>
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MessageSquare className="size-3" /> Comments
        </div>
        <div className="flex gap-2.5">
          <Avatar name="Arjun Patel" size={22} />
          <p className="leading-5 text-foreground/85">
            <span className="font-medium text-foreground">Arjun Patel</span> Enterprise lead: 200+ seats in their org. Booked a demo for after the summit.
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground text-[12px] font-medium text-background">
            <Check className="size-3.5" /> Approve
          </span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-foreground/10 text-[12px] text-muted-foreground">Reject</span>
        </div>
      </div>
    </Window>
  );
}

export function FormsStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <ResponsesWindow className="absolute top-0 left-0" />
      <ResponseDetail className={cn("absolute top-[90px] left-[640px] z-[2]", styles.float)} />
    </div>
  );
}

const ATTEND_OPTIONS = ["In person", "Online", "Not sure yet"];

// Conversational mode: one question per screen, answered from the keyboard.
export function ConversationalForm() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-2xl border border-foreground/[0.1] bg-surface-card text-[14px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <div className="h-1 bg-foreground/[0.06]">
        <div className={cn("h-full w-[55%] origin-left bg-foreground/70", styles.fill)} />
      </div>
      <div className="px-8 pt-8 pb-7">
        <div className="mb-3 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="font-mono">5</span>→ <span>of 9</span>
        </div>
        <div className="text-[19px] leading-snug font-medium tracking-tight">How will you attend?</div>
        <div className="mt-1 text-[13px] text-muted-foreground">We&apos;ll send the right joining details.</div>
        <div className="mt-5 flex flex-col gap-2">
          {ATTEND_OPTIONS.map((option, index) => (
            <span
              key={option}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                index === 0 ? "border-foreground/40 bg-foreground/[0.06]" : "border-foreground/[0.1]",
              )}
            >
              <span className="flex size-5 items-center justify-center rounded border border-foreground/15 font-mono text-[11px] text-muted-foreground">{"ABC"[index]}</span>
              {option}
              {index === 0 ? <Check className="ml-auto size-4" /> : null}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
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

function Select({ children, className }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-md border border-foreground/[0.12] bg-foreground/[0.03] px-2.5 text-[12px] whitespace-nowrap", className)}>
      {children}
      <ChevronDown className="size-3 text-muted-foreground" />
    </span>
  );
}

export function LogicRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3 text-[13px]">
      <div className="rounded-xl border border-foreground/[0.09] bg-surface-card p-4 dark:bg-surface-subtle">
        <MonoLabel>Logic</MonoLabel>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="w-9 text-muted-foreground">If</span>
          <Select>How will you attend?</Select>
          <Select>Equals</Select>
          <Select>In person</Select>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="w-9 text-muted-foreground">Then</span>
          <Select>Show</Select>
          <Select>Dietary needs</Select>
        </div>
      </div>
      <div className="rounded-xl border border-foreground/[0.09] bg-surface-card p-4 dark:bg-surface-subtle">
        <div className="flex items-center justify-between">
          <MonoLabel>Calculated</MonoLabel>
          <span className="text-[12px] text-muted-foreground">Ticket tier</span>
        </div>
        <div className="mt-3 rounded-lg border border-foreground/[0.08] bg-background/60 px-3 py-2.5 font-mono text-[12px] leading-5 text-foreground/85 dark:bg-background/40">
          IF(<span className="text-foreground">{"{Team size}"}</span> &gt;= 50, <span className="text-emerald-600 dark:text-emerald-400">&quot;Enterprise&quot;</span>, <span className="text-emerald-600 dark:text-emerald-400">&quot;Team&quot;</span>)
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-[12px] text-muted-foreground">
          Result for Leah Mensah <Chip className="h-5 px-2 text-[11px]">Enterprise</Chip>
        </div>
      </div>
    </div>
  );
}

const FUNNEL = [
  { label: "Viewed", value: 1240, share: 100 },
  { label: "Started", value: 812, share: 65 },
  { label: "Submitted", value: 506, share: 41 },
];

const FIELD_DROPOFF = [
  { field: "Work email", loss: 3 },
  { field: "Annual tooling budget", loss: 14 },
  { field: "Book a 1:1", loss: 6 },
];

export function FunnelRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className="flex items-end gap-3">
        {FUNNEL.map((step, index) => (
          <div key={step.label} className="flex-1">
            <div className="text-[12px] text-muted-foreground">{step.label}</div>
            <div className="mt-0.5 text-xl font-medium tracking-tight tabular-nums">{step.value.toLocaleString("en-US")}</div>
            <div className="mt-3 flex h-28 items-end rounded-md bg-foreground/[0.04]">
              <div
                className={cn("w-full origin-bottom rounded-md bg-linear-to-t from-foreground/45 to-foreground/20", styles.fill)}
                style={{ height: `${step.share}%`, "--fill-delay": `${0.3 + index * 0.15}s` }}
              />
            </div>
            <div className="mt-2 font-mono text-[11px] text-muted-foreground">{step.share}%</div>
          </div>
        ))}
      </div>
      <div className={cn("mt-5 border-t pt-3", LINE)}>
        <div className="mb-2 text-[11px] text-muted-foreground">Field drop-off</div>
        {FIELD_DROPOFF.map((row) => (
          <div key={row.field} className="flex items-center gap-3 py-1">
            <span className="w-44 truncate text-foreground/85">{row.field}</span>
            <span className="h-1.5 flex-1 rounded-full bg-foreground/[0.06]">
              <span className={cn("block h-full rounded-full", row.loss > 10 ? "bg-amber-500" : "bg-foreground/35")} style={{ width: `${row.loss * 5}%` }} />
            </span>
            <span className={cn("w-10 text-right font-mono text-[11px]", row.loss > 10 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>−{row.loss}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SPAM_RULES = [
  { name: "Honeypot", detail: "A hidden field only bots fill in" },
  { name: "Captcha", detail: "Cloudflare Turnstile, no puzzles" },
  { name: "Rate limit", detail: "Caps how often one visitor can submit" },
  { name: "Duplicate detection", detail: "Flags the same response sent twice" },
];

function Toggle() {
  return (
    <span className="flex h-5 w-9 shrink-0 items-center rounded-full bg-foreground p-0.5">
      <span className="ml-auto size-4 rounded-full bg-background" />
    </span>
  );
}

export function SpamRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" />
        <span className="font-medium">Spam &amp; Abuse</span>
        <span className="ml-auto text-[12px] text-muted-foreground">23 blocked this week</span>
      </div>
      {SPAM_RULES.map((rule) => (
        <div key={rule.name} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="text-foreground/90">{rule.name}</div>
            <div className="text-[12px] text-muted-foreground">{rule.detail}</div>
          </div>
          <Toggle />
        </div>
      ))}
    </div>
  );
}
