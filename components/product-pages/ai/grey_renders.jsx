import {
  ArrowUp,
  AudioLines,
  BookOpen,
  Check,
  ChevronDown,
  Database,
  FileImage,
  FileText,
  FileVideo,
  Globe,
  KeyRound,
  Lock,
  Network,
  Paperclip,
  Plug,
  Search,
  Sparkles,
  StickyNote,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Bar, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Grey renders: knowledge bases, cited answers, the graph and the ways out (API, MCP, widget).

const KIND_ICONS = { Document: FileText, Audio: AudioLines, Video: FileVideo, Image: FileImage, "Web page": Globe, Note: StickyNote };

const FRESHNESS = {
  Verified: { tone: "emerald", text: "text-emerald-700 dark:text-emerald-400" },
  "Review due": { tone: "amber", text: "text-amber-700 dark:text-amber-300" },
  Stale: { tone: "red", text: "text-red-600 dark:text-red-400" },
};

export function Cite({ n, active = false }) {
  return (
    <span
      className={cn(
        "mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-[4px] px-1 align-middle font-mono text-[10px] leading-none",
        active ? "bg-foreground text-background" : "bg-foreground/[0.09] text-foreground/80",
      )}
    >
      {n}
    </span>
  );
}

const SOURCES = [
  { n: 1, name: "Refund Policy.pdf", where: "p. 3", kind: "Document", score: "0.91" },
  { n: 2, name: "Billing FAQ", where: "Web page", kind: "Web page", score: "0.84" },
  { n: 3, name: "Support onboarding.mp4", where: "04:12", kind: "Video", score: "0.77" },
];

function SourceRow({ source, active }) {
  const Icon = KIND_ICONS[source.kind];
  return (
    <div className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2", active ? "border-foreground/20 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
      <Cite n={source.n} active={active} />
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate text-foreground/90">{source.name}</span>
      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{source.where}</span>
    </div>
  );
}

function Question({ children }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-foreground/[0.07] px-3.5 py-2.5 leading-5 text-foreground/90">{children}</div>
    </div>
  );
}

function Answer({ worked = "Retrieved 6 chunks · 1.4s" }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/[0.1] bg-foreground/[0.04]">
        <Sparkles className="size-3.5 text-foreground/80" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {worked} <ChevronDown className="size-3" />
        </div>
        <p className="leading-6 text-foreground/90">
          Refunds are available within 30 days of the invoice date
          <Cite n={1} active />. After that, annual plans are prorated for the unused months
          <Cite n={2} />. Ask for the invoice number so billing can process it in one step
          <Cite n={3} />.
        </p>
      </div>
    </div>
  );
}

function ChatComposer({ typed, className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.1] bg-background/40 px-3.5 pt-3 pb-2.5 dark:bg-foreground/[0.02]", className)}>
      <div className="min-h-6 leading-6">{typed ? <Typed text={typed} delay={1.3} /> : <span className="text-muted-foreground">Ask the pipeline anything…</span>}</div>
      <div className="mt-2 flex items-center gap-3 text-muted-foreground">
        <Paperclip className="size-3.5" />
        <span className="flex items-center gap-1 text-[11px]">
          <Database className="size-3" /> Help Center &amp; Policies
        </span>
        <span className="ml-auto flex size-7 items-center justify-center rounded-full bg-foreground text-background">
          <ArrowUp className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

const PIPELINES = [
  { name: "Support answers", status: "Live", active: true },
  { name: "Policy search", status: "Live" },
  { name: "Sales enablement", status: "Draft" },
];

const BASES = ["Help Center & Policies", "Product docs", "Onboarding videos"];

// The hero plane: Grey's Playground Chat, a cited answer above and a new question being typed below.
export function PlaygroundWindow({ typed }) {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <div className={cn("flex w-[230px] shrink-0 flex-col gap-6 border-r px-4 py-5", LINE)}>
          <div>
            <MonoLabel>Pipelines</MonoLabel>
            <div className="mt-2.5 flex flex-col gap-0.5">
              {PIPELINES.map((pipeline) => (
                <div key={pipeline.name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", pipeline.active && "bg-foreground/[0.06]")}>
                  <Network className="size-3.5 text-muted-foreground" />
                  <span className={pipeline.active ? "text-foreground" : "text-foreground/75"}>{pipeline.name}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{pipeline.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <MonoLabel>Knowledge bases</MonoLabel>
            <div className="mt-2.5 flex flex-col gap-0.5">
              {BASES.map((base) => (
                <div key={base} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground/75">
                  <Database className="size-3.5 text-muted-foreground" />
                  {base}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={cn("flex min-w-0 flex-1 flex-col border-r", LINE)}>
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <span className="font-medium">Playground Chat</span>
            <span className="text-muted-foreground">Support answers</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <Dot tone="emerald" /> Live · v4
            </span>
          </div>
          <div className="flex flex-col gap-5 px-6 py-6">
            <Question>Can customers on an annual plan get a refund after 30 days?</Question>
            <Answer />
            <div className="ml-10 flex flex-col gap-1.5">
              {SOURCES.map((source) => (
                <SourceRow key={source.n} source={source} active={source.n === 1} />
              ))}
            </div>
            <ChatComposer typed={typed} className="mt-3" />
          </div>
        </div>
        <div className="flex w-[270px] shrink-0 flex-col gap-5 px-5 py-5 text-[12px]">
          <div>
            <div className="mb-2 font-medium text-foreground">Retrieval</div>
            {[
              ["Search", "Hybrid"],
              ["Graph expansion", "Auto"],
              ["Rerank", "Cohere Rerank 4"],
              ["Top K", "6"],
              ["Citations", "On"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground/90">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 font-medium text-foreground">Retrieved chunks</div>
            <div className="flex flex-col gap-1.5">
              {SOURCES.map((source) => (
                <div key={source.n} className="flex items-center gap-2">
                  <Cite n={source.n} />
                  <span className="truncate text-foreground/80">{source.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">{source.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const KB_SOURCES = [
  { name: "Refund Policy.pdf", kind: "Document", chunks: 48, freshness: "Verified" },
  { name: "Billing FAQ", kind: "Web page", chunks: 31, freshness: "Verified" },
  { name: "Support onboarding.mp4", kind: "Video", chunks: 112, freshness: "Verified" },
  { name: "Enterprise terms 2026.docx", kind: "Document", chunks: 86, freshness: "Review due" },
  { name: "Weekly support call", kind: "Audio", chunks: 64, freshness: "Verified" },
  { name: "Plan comparison.xlsx", kind: "Document", chunks: 22, freshness: "Stale" },
  { name: "Escalation checklist", kind: "Note", chunks: 9, freshness: "Verified" },
];

function KnowledgeBaseWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Database className="size-4 text-muted-foreground" />
        <span className="font-medium">Help Center &amp; Policies</span>
        <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Upload className="size-3.5" /> Add sources
        </span>
      </div>
      <div className={cn("grid grid-cols-3 border-b", LINE)}>
        {[
          ["Sources", "214"],
          ["Chunks", "9,842"],
          ["Entities", "1,306"],
        ].map(([label, value], index) => (
          <div key={label} className={cn("px-5 py-3.5", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="mt-0.5 text-[18px] font-medium tracking-tight">{value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1fr_88px_96px] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Source</span>
        <span>Chunks</span>
        <span>Freshness</span>
      </div>
      {KB_SOURCES.map((source) => {
        const Icon = KIND_ICONS[source.kind];
        const fresh = FRESHNESS[source.freshness];
        return (
          <div key={source.name} className={cn("grid grid-cols-[1fr_88px_96px] items-center gap-3 border-b px-5 py-2.5", LINE)}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03]">
                <Icon className="size-3.5 text-muted-foreground" />
              </span>
              <span className="truncate text-foreground/90">{source.name}</span>
            </span>
            <span className="font-mono text-[12px] text-muted-foreground">{source.chunks}</span>
            <span className={cn("flex items-center gap-1.5 text-[12px]", fresh.text)}>
              <Dot tone={fresh.tone} /> {source.freshness}
            </span>
          </div>
        );
      })}
    </Window>
  );
}

function CitationPreview({ className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", className)}>
      <div className="flex items-center gap-2">
        <Cite n={1} active />
        <FileText className="size-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Refund Policy.pdf</span>
        <span className="ml-auto text-muted-foreground">Page 3</span>
      </div>
      <p className="mt-3 leading-5 text-muted-foreground">
        4.1 Refunds.{" "}
        <mark className="rounded-[3px] bg-foreground/[0.12] px-0.5 text-foreground">Customers may request a full refund within 30 days of the invoice date.</mark> Annual
        subscriptions cancelled after this period are refunded pro rata…
      </p>
    </div>
  );
}

// Section stage: the knowledge base behind, a cited answer in front, and the passage the first citation points at.
export function GroundedStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <div className="absolute top-[56px] left-0 opacity-90">
        <KnowledgeBaseWindow className="w-[560px]" />
      </div>
      <Window className="absolute top-0 left-[430px] z-[2] w-[570px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <span className="font-medium">Playground Chat</span>
          <span className="text-muted-foreground">Support answers</span>
        </div>
        <div className="flex flex-col gap-5 px-5 py-5">
          <Question>Can customers on an annual plan get a refund after 30 days?</Question>
          <Answer />
          <div className="ml-10 flex flex-col gap-1.5">
            {SOURCES.map((source) => (
              <SourceRow key={source.n} source={source} active={source.n === 1} />
            ))}
          </div>
          <ChatComposer />
        </div>
      </Window>
      <CitationPreview className={cn("absolute top-[300px] left-[70px] z-[3] w-[340px]", styles.float)} />
    </div>
  );
}

const FORMATS = ["DOC", "DOCX", "XLSX", "PPTX", "EPUB", "HTML", "MD", "CSV", "PDF", "JSON", "TXT", "RTF", "ODT", "ODS", "ODP", "TSV", "XLS", "PPT", "MP3", "MP4", "PNG", "JPG", "URL", "NOTE"];

export function FormatsRender() {
  return (
    <div className="mx-auto w-[460px]">
      <div className={cn("grid grid-cols-6 gap-2.5", styles.fadeEdges)}>
        {FORMATS.map((format, index) => (
          <span
            key={format}
            className={cn(
              "flex aspect-square items-center justify-center rounded-xl border font-mono text-[11px] tracking-wide",
              index === 8 ? "border-foreground/25 bg-foreground/[0.08] text-foreground" : "border-foreground/[0.08] bg-foreground/[0.025] text-muted-foreground",
            )}
          >
            {format}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {[
          [Upload, "Upload"],
          [FileImage, "Assets"],
          [StickyNote, "Notes"],
          [Globe, "URL"],
        ].map(([Icon, label]) => (
          <Chip key={label} icon={Icon}>
            {label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const PRESETS = [
  { name: "Fast", parser: "Text", chunking: "Fixed size" },
  { name: "Balanced", parser: "Layout", chunking: "Recursive", active: true },
  { name: "High accuracy", parser: "Vision (VLM)", chunking: "Semantic" },
  { name: "Auto", parser: "Picked per file", chunking: "Picked per file" },
];

export function PresetsRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-2.5">
      {PRESETS.map((preset) => (
        <div
          key={preset.name}
          className={cn(
            "rounded-xl border px-4 py-3.5 text-[12px]",
            preset.active ? "border-foreground/30 bg-foreground/[0.05] shadow-lg shadow-black/10" : "border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-foreground">{preset.name}</span>
            <span className={cn("flex size-4 items-center justify-center rounded-full border", preset.active ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
              {preset.active ? <Check className="size-2.5" strokeWidth={3} /> : null}
            </span>
          </div>
          <div className="mt-3 flex justify-between text-muted-foreground">
            Parser <span className="text-foreground/85">{preset.parser}</span>
          </div>
          <div className="mt-1 flex justify-between text-muted-foreground">
            Chunking <span className="text-foreground/85">{preset.chunking}</span>
          </div>
        </div>
      ))}
      <div className="col-span-2 flex items-center justify-center gap-4 pt-1 font-mono text-[11px] text-muted-foreground">
        <span>512 tokens</span>
        <span className="size-1 rounded-full bg-foreground/30" />
        <span>64 overlap</span>
        <span className="size-1 rounded-full bg-foreground/30" />
        <span>Graph extraction on</span>
      </div>
    </div>
  );
}

export function FreshnessRender() {
  const rows = [KB_SOURCES[0], KB_SOURCES[3], KB_SOURCES[2], KB_SOURCES[5]];
  return (
    <div className="mx-auto flex w-[440px] flex-col gap-2.5">
      {rows.map((source, index) => {
        const Icon = KIND_ICONS[source.kind];
        const fresh = FRESHNESS[source.freshness];
        return (
          <div
            key={source.name}
            className={cn("flex items-center gap-3 rounded-xl border border-foreground/[0.08] bg-surface-card px-3.5 py-3 text-[13px] dark:bg-surface-subtle", styles.popIn)}
            style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}
          >
            <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.03]">
              <Icon className="size-3.5 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{source.name}</div>
              <div className="text-[11px] text-muted-foreground">{source.kind}</div>
            </div>
            <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full border border-current/20 px-2.5 text-[11px]", fresh.text)}>
              <Dot tone={fresh.tone} /> {source.freshness}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const METRICS = [
  { name: "Faithfulness", score: 0.94 },
  { name: "Answer relevance", score: 0.89 },
  { name: "Context precision", score: 0.81 },
  { name: "Context recall", score: 0.76 },
];

export function EvaluationsRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.08] bg-surface-card p-5 text-[13px] dark:bg-surface-subtle">
      <div className="flex items-center gap-2">
        <span className="font-medium">Refund questions</span>
        <span className="text-muted-foreground">· 40 cases</span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">LLM judge</span>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {METRICS.map((metric, index) => (
          <div key={metric.name}>
            <div className="mb-1.5 flex justify-between text-[12px]">
              <span className="text-foreground/85">{metric.name}</span>
              <span className="font-mono text-muted-foreground">{metric.score.toFixed(2)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
              <div
                className={cn("h-full origin-left rounded-full bg-foreground/70", styles.fill)}
                style={{ width: `${metric.score * 100}%`, "--fill-delay": `${0.3 + index * 0.15}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// The knowledge graph: entities as nodes, relations as edges, one entity open in the inspector.
const NODES = [
  { id: "refund", x: 330, y: 300, r: 30, label: "Refund policy", focus: true },
  { id: "annual", x: 170, y: 190, r: 18, label: "Annual plan" },
  { id: "monthly", x: 120, y: 360, r: 14, label: "Monthly plan" },
  { id: "pdf", x: 470, y: 170, r: 16, label: "Refund Policy.pdf" },
  { id: "billing", x: 520, y: 360, r: 20, label: "Billing team" },
  { id: "invoice", x: 330, y: 480, r: 15, label: "Invoice" },
  { id: "proration", x: 210, y: 470, r: 12, label: "Proration" },
  { id: "vat", x: 470, y: 520, r: 10, label: "VAT number" },
  { id: "enterprise", x: 80, y: 90, r: 13, label: "Enterprise terms" },
  { id: "sla", x: 620, y: 230, r: 11, label: "Support SLA" },
  { id: "faq", x: 600, y: 110, r: 12, label: "Billing FAQ" },
  { id: "card", x: 650, y: 470, r: 9, label: "" },
  { id: "chargeback", x: 30, y: 250, r: 9, label: "" },
  { id: "currency", x: 250, y: 90, r: 9, label: "" },
  { id: "tax", x: 560, y: 600, r: 8, label: "" },
  { id: "trial", x: 40, y: 450, r: 8, label: "" },
];

const EDGES = [
  ["refund", "annual", true],
  ["refund", "pdf", true],
  ["refund", "billing", true],
  ["refund", "invoice", true],
  ["refund", "proration"],
  ["refund", "monthly"],
  ["annual", "enterprise"],
  ["annual", "currency"],
  ["pdf", "faq"],
  ["billing", "sla"],
  ["billing", "card"],
  ["invoice", "vat"],
  ["vat", "tax"],
  ["monthly", "trial"],
  ["monthly", "chargeback"],
  ["annual", "chargeback"],
  ["proration", "invoice"],
  ["faq", "sla"],
];

const NODE_BY_ID = Object.fromEntries(NODES.map((node) => [node.id, node]));

function GraphCanvas() {
  return (
    <svg viewBox="0 0 700 640" className="h-[640px] w-[700px] overflow-visible">
      <g className="text-foreground">
        {EDGES.map(([from, to, strong]) => {
          const a = NODE_BY_ID[from];
          const b = NODE_BY_ID[to];
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeOpacity={strong ? 0.35 : 0.13}
              strokeWidth={strong ? 1.25 : 1}
              className={strong ? styles.flow : undefined}
            />
          );
        })}
        {NODES.map((node) => (
          <g key={node.id}>
            {node.focus ? <circle cx={node.x} cy={node.y} r={node.r + 14} fill="currentColor" fillOpacity="0.06" /> : null}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="var(--background)"
              stroke="currentColor"
              strokeOpacity={node.focus ? 0.9 : 0.3}
              strokeWidth={node.focus ? 1.5 : 1}
            />
            <circle cx={node.x} cy={node.y} r={Math.max(3, node.r * 0.32)} fill="currentColor" fillOpacity={node.focus ? 0.9 : 0.35} />
            {node.label ? (
              <text x={node.x} y={node.y + node.r + 16} textAnchor="middle" fill="currentColor" fillOpacity={node.focus ? 0.95 : 0.6} fontSize={node.focus ? 13 : 11.5} fontWeight={node.focus ? 500 : 400}>
                {node.label}
              </text>
            ) : null}
          </g>
        ))}
      </g>
    </svg>
  );
}

const RELATIONS = [
  ["applies to", "Annual plan", "0.94"],
  ["defined in", "Refund Policy.pdf", "0.97"],
  ["handled by", "Billing team", "0.88"],
  ["requires", "Invoice", "0.82"],
];

function EntityInspector({ className }) {
  return (
    <Window className={className}>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[15px]">Refund policy</span>
          <Chip className="h-5 px-2 text-[11px]">Policy</Chip>
        </div>
        <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">Rules for returning money to customers, by plan and by time since the invoice.</p>
      </div>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="mb-2.5 text-[11px] font-medium text-muted-foreground">Relations</div>
        <div className="flex flex-col gap-2 text-[12px]">
          {RELATIONS.map(([verb, target, confidence]) => (
            <div key={target} className="flex items-center gap-2">
              <span className="text-muted-foreground">{verb}</span>
              <span className="truncate text-foreground/90">{target}</span>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{confidence}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-2.5 text-[11px] font-medium text-muted-foreground">Possible duplicate</div>
        <div className="rounded-lg border border-dashed border-foreground/20 px-3 py-2.5 text-[12px]">
          <div className="text-foreground/90">Refunds policy</div>
          <div className="mt-0.5 text-muted-foreground">Mentioned in 3 sources</div>
          <div className="mt-2.5 flex gap-1.5">
            <span className="rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background">Merge</span>
            <span className="rounded-md border border-foreground/[0.12] px-2 py-1 text-[11px] text-muted-foreground">Keep both</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

export function GraphStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <div className="absolute top-0 left-0 flex items-center gap-1 rounded-lg border border-foreground/[0.1] bg-surface-card p-1 text-[12px] dark:bg-surface-subtle">
        <span className="rounded-md bg-foreground/[0.08] px-2.5 py-1 text-foreground">2D</span>
        <span className="px-2.5 py-1 text-muted-foreground">3D</span>
      </div>
      <div className="absolute top-0 left-[110px] flex items-center gap-2 rounded-lg border border-foreground/[0.1] bg-surface-card px-3 py-1.5 text-[12px] text-muted-foreground dark:bg-surface-subtle">
        <Search className="size-3.5" /> refund
      </div>
      <div className="absolute top-[10px] left-0">
        <GraphCanvas />
      </div>
      <EntityInspector className="absolute top-[40px] right-0 z-[2] w-[300px]" />
    </div>
  );
}

// MCP: one server, four tools, and the clients that call them.
const MCP_TOOLS = [
  ["search", "Hybrid search over the knowledge base"],
  ["ask", "A cited answer from the pipeline"],
  ["get_entity", "An entity and its relations"],
  ["list_sources", "What the knowledge base holds"],
];

export function McpRender() {
  return (
    <div className="mx-auto w-[440px]">
      <div className="rounded-xl border border-foreground/[0.1] bg-surface-card shadow-xl shadow-black/15 dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
          <Plug className="size-4 text-muted-foreground" />
          <span className="font-medium">Grey MCP server</span>
          <span className="text-muted-foreground">Support answers</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
            <Dot tone="emerald" /> Live
          </span>
        </div>
        <div className="flex flex-col p-1.5">
          {MCP_TOOLS.map(([name, body], index) => (
            <div key={name} className={cn("flex items-center gap-3 rounded-md px-3 py-2", index === 1 && "bg-foreground/[0.05]")}>
              <span className="w-[92px] shrink-0 font-mono text-[12px] text-foreground">{name}</span>
              <span className="truncate text-[12px] text-muted-foreground">{body}</span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 440 70" className="h-[70px] w-[440px] text-foreground" aria-hidden="true">
        <path d="M220 0 V24 Q220 34 210 34 H120 Q110 34 110 44 V70" fill="none" stroke="currentColor" strokeOpacity="0.25" className={styles.flow} />
        <path d="M220 0 V24 Q220 34 230 34 H320 Q330 34 330 44 V70" fill="none" stroke="currentColor" strokeOpacity="0.25" className={styles.flow} />
      </svg>
      <div className="flex justify-between px-6">
        {["Claude Desktop", "Cursor"].map((client) => (
          <span key={client} className="flex h-10 w-[170px] items-center justify-center gap-2 rounded-xl border border-foreground/[0.1] bg-surface-card text-[13px] text-foreground/90 dark:bg-surface-subtle">
            <KeyRound className="size-3.5 text-muted-foreground" />
            {client}
          </span>
        ))}
      </div>
    </div>
  );
}

const CODE = [
  [["c", "// Any OpenAI client works: point it at a Grey pipeline."]],
  [["k", "const "], ["p", "grey = "], ["k", "new "], ["p", "OpenAI({"]],
  [["p", "  baseURL: "], ["s", "`${GREY_URL}/api/v1/pipelines/support-answers`"], ["p", ","]],
  [["p", "  apiKey: process.env."], ["k", "GREY_KEY"], ["p", ","]],
  [["p", "});"]],
  [],
  [["k", "const "], ["p", "reply = "], ["k", "await "], ["p", "grey.chat.completions.create({"]],
  [["p", "  messages: [{ role: "], ["s", "\"user\""], ["p", ", content: question }],"]],
  [["p", "});"]],
];

const TOKEN_CLASS = { c: "text-muted-foreground/70 italic", k: "text-foreground font-medium", s: "text-foreground/65", p: "text-foreground/85" };

export function ApiRender() {
  return (
    <div className="mx-auto w-[470px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 text-[12px]", LINE)}>
        <span className="font-mono text-foreground/90">answer.js</span>
        <span className="ml-auto flex gap-1.5">
          {["Retrieve", "Chat", "MCP"].map((scope, index) => (
            <span key={scope} className={cn("rounded px-1.5 py-0.5 text-[10px]", index === 1 ? "bg-foreground/[0.1] text-foreground" : "text-muted-foreground")}>
              {scope}
            </span>
          ))}
        </span>
      </div>
      <pre className="overflow-hidden px-4 py-3.5 font-mono text-[11.5px] leading-[1.75]">
        {CODE.map((line, index) => (
          <div key={index} className="flex">
            <span className="w-6 shrink-0 text-muted-foreground/50 select-none">{index + 1}</span>
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
    </div>
  );
}

export function WidgetRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[470px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
      <div className={cn("flex items-center gap-1.5 border-b px-3 py-2", LINE)}>
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="ml-3 h-4 w-48 rounded bg-foreground/[0.06]" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <Bar className="h-3 w-40 bg-foreground/[0.12]" />
        <Bar className="w-64" />
        <Bar className="w-56" />
        <Bar className="mt-3 w-48" />
        <Bar className="w-60" />
      </div>
      <div className={cn("absolute right-4 bottom-4 w-[250px] rounded-2xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-2xl shadow-black/25 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <BookOpen className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Chat with us</span>
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="ml-auto rounded-xl rounded-br-sm bg-foreground/[0.07] px-2.5 py-1.5">Do you refund annual plans?</span>
          <span className="leading-[1.45] text-foreground/90">
            Yes, in full within 30 days of the invoice
            <Cite n={1} />, then pro rata
            <Cite n={2} />.
          </span>
        </div>
        <div className={cn("border-t px-3.5 py-2 text-center text-[10px] text-muted-foreground", LINE)}>Powered by Grey</div>
      </div>
      <div className="absolute top-[52px] right-4 rounded-md border border-foreground/[0.08] bg-background/80 px-2.5 py-1.5 font-mono text-[10.5px] text-muted-foreground backdrop-blur">
        &lt;script src=&quot;…/widget.js&quot; data-widget=&quot;support&quot;&gt;
      </div>
    </div>
  );
}

const PROVIDERS = [
  { name: "Anthropic", models: ["Claude Sonnet 5.5", "Claude Haiku 5.5"], key: "4f2a" },
  { name: "OpenAI", models: ["GPT-5", "text-embedding-3-large"], key: "91c0" },
  { name: "Google", models: ["Gemini 3 Flash"], key: "77de" },
  { name: "Cohere", models: ["Embed v5 Pro", "Rerank 4"], key: "0b3e" },
];

export function ProvidersRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-2">
      {PROVIDERS.map((provider) => (
        <div key={provider.name} className="flex items-center gap-3 rounded-xl border border-foreground/[0.08] bg-surface-card px-3.5 py-2.5 text-[13px] dark:bg-surface-subtle">
          <Avatar name={provider.name} size={26} className="rounded-lg" />
          <div className="min-w-0 flex-1">
            <div className="font-medium">{provider.name}</div>
            <div className="mt-1 flex gap-1.5">
              {provider.models.map((model) => (
                <span key={model} className="truncate rounded border border-foreground/[0.08] px-1.5 py-px text-[10.5px] text-muted-foreground">
                  {model}
                </span>
              ))}
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Lock className="size-3" />
            ••••{provider.key}
          </span>
        </div>
      ))}
    </div>
  );
}

const VERSIONS = [
  { version: "v5", note: "Rerank on, top K 8", status: "Draft", who: "Danielle" },
  { version: "v4", note: "Graph expansion set to Auto", status: "Live", who: "Marco" },
  { version: "v3", note: "Added Enterprise terms 2026", status: "Archived", who: "Aria" },
];

export function VersionsRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Network className="size-4 text-muted-foreground" />
        <span className="font-medium">Support answers</span>
        <span className="ml-auto rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background">Promote v5 to live</span>
      </div>
      {VERSIONS.map((row) => (
        <div key={row.version} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE)}>
          <span className="w-7 font-mono text-[12px] text-foreground">{row.version}</span>
          <span className="min-w-0 flex-1 truncate text-foreground/85">{row.note}</span>
          <Avatar name={row.who} size={18} />
          <span
            className={cn(
              "w-16 text-right text-[11px]",
              row.status === "Live" ? "text-emerald-700 dark:text-emerald-400" : row.status === "Draft" ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {row.status}
          </span>
        </div>
      ))}
    </div>
  );
}
