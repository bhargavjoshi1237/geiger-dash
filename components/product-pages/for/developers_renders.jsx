import {
  AlignLeft,
  Braces,
  Calendar,
  Check,
  Database,
  Filter,
  Gauge,
  Hash,
  History,
  Image as ImageIcon,
  KeyRound,
  Link2,
  List,
  Lock,
  Plug,
  Plus,
  RotateCcw,
  Search,
  Send,
  SquareTerminal,
  ToggleLeft,
  Type,
  Webhook,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Chip, Dot, LINE, MonoLabel, Typed, TypingDots, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Orbital Freight's platform team calling Geiger over HTTP: Content's delivery API, Assets' image URLs, Grey's grounded answers and Forms' webhooks.

const POPOVER = "rounded-xl border border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";
const CARD = "rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle";

// Code is tinted with foreground opacities only: keys strongest, strings and values softer, punctuation faintest.
const TONE = { k: "text-foreground/90", s: "text-foreground/60", n: "text-foreground/75", p: "text-foreground/40" };

const MORE = "__more__";
const inline = (value) => ({ __inline: value });
const isInline = (value) => Boolean(value && typeof value === "object" && "__inline" in value);

function primitive(value) {
  return typeof value === "string" ? ["s", JSON.stringify(value)] : ["n", String(value)];
}

// One-line JSON tokens; `compact` drops the spaces, the way a server streams it.
function inlineTokens(value, compact = false) {
  const comma = compact ? "," : ", ";
  if (value === MORE) return [["p", "…"]];
  if (isInline(value)) return inlineTokens(value.__inline, compact);
  if (Array.isArray(value)) {
    return [["p", "["], ...value.flatMap((item, index) => [...(index ? [["p", comma]] : []), ...inlineTokens(item, compact)]), ["p", "]"]];
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return [["p", "{}"]];
    const parts = entries.flatMap(([key, item], index) => [...(index ? [["p", comma]] : []), ["k", JSON.stringify(key)], ["p", compact ? ":" : ": "], ...inlineTokens(item, compact)]);
    return [["p", compact ? "{" : "{ "], ...parts, ["p", compact ? "}" : " }"]];
  }
  return [primitive(value)];
}

// Pretty-printed JSON as lines of [tone, text] tokens; `inline()` keeps a value on one line and MORE elides the rest.
function jsonLines(value, depth = 0, key, last = true) {
  const lead = key === undefined ? [] : [["k", JSON.stringify(key)], ["p", ": "]];
  const tail = last ? [] : [["p", ","]];
  if (value === MORE) return [{ depth, tokens: [["p", "…"]] }];
  if (!isInline(value) && value && typeof value === "object") {
    const isArray = Array.isArray(value);
    const entries = isArray ? value.map((item) => [undefined, item]) : Object.entries(value);
    if (isArray && entries.every(([, item]) => item === null || typeof item !== "object")) return [{ depth, tokens: [...lead, ...inlineTokens(value), ...tail] }];
    return [
      { depth, tokens: [...lead, ["p", isArray ? "[" : "{"]] },
      ...entries.flatMap(([entryKey, item], index) => jsonLines(item, depth + 1, entryKey, index === entries.length - 1)),
      { depth, tokens: [["p", isArray ? "]" : "}"], ...tail] },
    ];
  }
  return [{ depth, tokens: [...lead, ...inlineTokens(value), ...tail] }];
}

function Tokens({ tokens }) {
  return tokens.map(([tone, text], index) => (
    <span key={index} className={TONE[tone]}>
      {text}
    </span>
  ));
}

function CodeLines({ lines, className, indent = 14, leading = "leading-[20px]", pop }) {
  return (
    <div className={cn("font-mono text-[12px]", leading, className)}>
      {lines.map((line, index) => (
        <div
          key={index}
          className={cn("whitespace-pre", pop && styles.popIn)}
          style={{ paddingLeft: line.depth * indent, ...(pop ? { "--pop-delay": `${pop.start + index * pop.step}s` } : null) }}
        >
          <Tokens tokens={line.tokens} />
        </div>
      ))}
    </div>
  );
}

function Json({ value, ...props }) {
  return <CodeLines lines={jsonLines(value)} {...props} />;
}

function Method({ children }) {
  return <span className="shrink-0 rounded bg-foreground/[0.08] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold tracking-wide text-foreground/90">{children}</span>;
}

// Status codes are the only colour in a code render: 2xx emerald, 4xx amber, 5xx red.
function StatusCode({ code, label, className }) {
  const tone =
    code >= 500
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : code >= 400
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : code >= 300
          ? "bg-foreground/[0.06] text-muted-foreground"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium", tone, className)}>
      {code}
      {label ? ` ${label}` : ""}
    </span>
  );
}

function RequestLine({ method, path, children, className }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 font-mono text-[12px]", className)}>
      <Method>{method}</Method>
      <span className="min-w-0 truncate text-foreground/85">{path}</span>
      {children ? <span className="ml-auto flex shrink-0 items-center gap-2">{children}</span> : null}
    </div>
  );
}

// Query parameters one per line, as an HTTP client shows them.
function queryLines(params) {
  return params.map(([key, value], index) => ({ depth: 0, tokens: [["p", index ? "&" : "?"], ["k", key], ["p", "="], ["s", value]] }));
}

function Prompt({ children, dir = "~/orbital-app" }) {
  return (
    <div className="flex gap-2.5 whitespace-nowrap">
      <span className="text-foreground/40">{dir} ❯</span>
      <span className="min-w-0 text-foreground/90">{children}</span>
    </div>
  );
}

const SSE_LINES = [
  inline({ choices: [{ delta: { content: "Yes. Packed with equipment, " } }] }),
  inline({ choices: [{ delta: { content: "they travel as UN3481 [1]. " } }] }),
  inline({ choices: [{ delta: { content: "Declare them 48 hours before cut-off [2]." } }] }),
];

// One server-sent event: `data:` and a compact JSON chunk, arriving on its own delay.
function DataLine({ value, delay, wrap = false }) {
  return (
    <div className={cn(wrap ? "break-all whitespace-pre-wrap" : "whitespace-pre", styles.popIn)} style={{ "--pop-delay": `${delay}s` }}>
      <span className="text-foreground/40">data: </span>
      {value === "[DONE]" ? <span className="text-foreground/90">[DONE]</span> : <Tokens tokens={inlineTokens(value, true)} />}
    </div>
  );
}

const COLLECTIONS = [
  { app: "content", name: "Geiger Content", requests: [["GET", "service-updates", true], ["GET", "_schema"], ["POST", "decide"]] },
  { app: "assets", name: "Geiger Assets", requests: [["GET", "assets"], ["POST", "upload"], ["GET", "dock-12.jpg"]] },
  { app: "grey", name: "Geiger Grey", requests: [["POST", "chat/completions"], ["POST", "retrieve"], ["GET", "models"]] },
  { app: "forms", name: "Geiger Forms", requests: [["GET", "responses"]] },
];

const SERVICE_PARAMS = [
  ["filters[region][$eq]", "emea"],
  ["sort", "effectiveFrom:desc"],
  ["populate", "heroImage"],
  ["pagination[pageSize]", "2"],
];

const CONSOLE_RESPONSE = {
  data: [
    {
      id: "e41a7c2d",
      slug: "rotterdam-storm-closure",
      publishedAt: "2026-10-27T06:10:00Z",
      title: "Rotterdam terminal closed for storm",
      region: "emea",
      pinned: true,
      heroImage: inline({ url: "…/rotterdam-quay.jpg", width: 1600 }),
    },
    MORE,
  ],
  meta: { pagination: inline({ page: 1, pageSize: 2, pageCount: 7, total: 13 }) },
};

// The hero plane: a Content query answered in an HTTP client, with a terminal beside it calling Assets, Grey and Forms.
export function ApiConsoleWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[700px] w-[830px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <SquareTerminal className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">platform.http</span>
          <span className="text-muted-foreground">Orbital Freight</span>
          <span className="ml-auto flex items-center gap-1 rounded-lg border border-foreground/[0.08] p-0.5 text-[11px]">
            {["staging", "production"].map((env) => (
              <span key={env} className={cn("rounded-md px-2 py-0.5 font-mono", env === "production" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
                {env}
              </span>
            ))}
          </span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className={cn("flex w-[230px] shrink-0 flex-col gap-4 border-r px-3 py-4", LINE)}>
            <div className="px-2">
              <MonoLabel>Collections</MonoLabel>
            </div>
            {COLLECTIONS.map((group) => (
              <div key={group.app} className="flex flex-col gap-0.5">
                <div className="mb-1 flex items-center gap-2 px-2 text-[12px] font-medium">
                  <AppMark id={group.app} size={20} />
                  {group.name}
                </div>
                {group.requests.map(([method, name, active]) => (
                  <div key={name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[12px]", active ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
                    <span className="w-9 shrink-0 text-[10.5px] font-semibold text-foreground/50">{method}</span>
                    <span className="truncate">{name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b px-5", LINE)}>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-foreground/[0.12] px-3 py-2">
                <RequestLine method="GET" path="{{content}}/api/content/v2/projects/8c1f2e/service-updates" />
              </div>
              <span className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">
                <Send className="size-3.5" /> Send
              </span>
            </div>
            <div className={cn("flex flex-col gap-3 border-b px-5 py-3.5", LINE)}>
              <div className="flex gap-1 text-[12px]">
                {["Params", "Headers", "Body"].map((tab, index) => (
                  <span key={tab} className={cn("rounded-md px-2 py-0.5", index === 0 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
                    {tab}
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
                  <Lock className="size-3.5" />
                  <Chip className="h-5 px-2 font-mono text-[10.5px]">delivery:read</Chip>
                </span>
              </div>
              <CodeLines lines={[...queryLines(SERVICE_PARAMS), { depth: 0, tokens: [["k", "Authorization"], ["p", ": "], ["s", "Bearer ••••3f9a"]] }]} />
            </div>
            <div className={cn("flex h-11 shrink-0 items-center gap-3 border-b px-5 text-[12px] text-muted-foreground", LINE)}>
              <StatusCode code={200} label="OK" className={styles.popIn} />
              <span className="tabular-nums">84 ms</span>
              <span className="tabular-nums">2.1 KB</span>
            </div>
            <Json value={CONSOLE_RESPONSE} className="overflow-hidden px-5 py-3" />
          </div>
        </div>
      </Window>
      <Window title="zsh" icon={SquareTerminal} meta="~/orbital-app" className="absolute top-[96px] left-[690px] z-[2] h-[560px] w-[490px]">
        <div className="flex flex-col px-5 py-4 font-mono text-[12px] leading-[20px]">
          <Prompt>curl -sI \</Prompt>
          <div className="pl-4 whitespace-pre text-foreground/90">&quot;$ASSETS/d/…/w_640,c_cover,f_webp,q_75/dock-12.jpg&quot;</div>
          <div className="text-foreground/60">
            HTTP/2 <StatusCode code={200} />
          </div>
          <div className="text-foreground/60">content-type: image/webp</div>
          <div className="text-foreground/60">cache-control: public, max-age=31536000, immutable</div>
          <div className="h-4" />
          <Prompt>curl -N \</Prompt>
          <div className="pl-4 whitespace-pre text-foreground/90">&quot;$GREY/api/v1/pipelines/ops-assistant/chat/completions&quot; \</div>
          <div className="pl-4 whitespace-pre text-foreground/90">-H @grey.headers -d @ask.json</div>
          {SSE_LINES.map((line, index) => (
            <DataLine key={index} value={line} delay={0.6 + index * 0.4} />
          ))}
          <TypingDots className="mt-1.5 ml-1 text-foreground/40" />
          <div className="h-4" />
          <Prompt>
            <Typed text={'curl "$FORMS/api/v1/forms/4b7e…/responses"'} delay={1.6} />
          </Prompt>
        </div>
      </Window>
    </div>
  );
}

const TYPE_ICONS = { Text: Type, Enum: List, Date: Calendar, "Rich text": AlignLeft, Media: ImageIcon, Reference: Link2, Number: Hash, Boolean: ToggleLeft, JSON: Braces };

const TYPE_FIELDS = [
  { label: "Summary", key: "summary", type: "Text", required: true },
  { label: "Region", key: "region", type: "Enum", note: "emea, americas, apac", required: true },
  { label: "Effective from", key: "effectiveFrom", type: "Date", required: true },
  { label: "Details", key: "details", type: "Rich text" },
  { label: "Hero image", key: "heroImage", type: "Media" },
  { label: "Lanes", key: "lanes", type: "Reference", note: "Lane, multiple" },
  { label: "Priority", key: "priority", type: "Number" },
  { label: "Pinned", key: "pinned", type: "Boolean" },
  { label: "Extra", key: "extra", type: "JSON", fresh: true },
];

const CONTENT_TYPES = [
  ["Service update", 13],
  ["Lane", 42],
  ["Port", 18],
  ["Carrier FAQ", 27],
  ["Page", 9],
];

const STAGE_RESPONSE = {
  data: [
    {
      slug: "rotterdam-storm-closure",
      title: "Rotterdam terminal closed for storm",
      region: "emea",
      effectiveFrom: "2026-10-27",
      heroImage: inline({ url: "…/rotterdam-quay.jpg" }),
    },
    MORE,
  ],
  meta: { pagination: inline({ page: 1, pageSize: 2, total: 13 }) },
};

// Section stage: the Service update content type with its typed fields, and a filtered v2 request for its entries.
export function ContentApiStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[640px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <AppMark id="content" size={22} />
          <span className="text-muted-foreground">Content types</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium">Service update</span>
          <span className="ml-auto flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">
            <Plus className="size-3.5" /> Add field
          </span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className={cn("flex w-[160px] shrink-0 flex-col gap-0.5 border-r p-2 text-[12px]", LINE)}>
            {CONTENT_TYPES.map(([name, count], index) => (
              <div key={name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
                <span className="truncate">{name}</span>
                <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{count}</span>
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className={cn("border-b px-5 py-3.5", LINE)}>
              <div className="text-[15px] font-medium tracking-[-0.01em]">Service update</div>
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">service-update · /service-updates</div>
            </div>
            <div className={cn("grid grid-cols-[1fr_88px_110px] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
              <span>Field</span>
              <span>Type</span>
              <span>Key</span>
            </div>
            {TYPE_FIELDS.map((field) => {
              const Icon = TYPE_ICONS[field.type];
              return (
                <div
                  key={field.key}
                  className={cn("grid grid-cols-[1fr_88px_110px] items-center gap-3 border-b px-5 py-2.5", LINE, field.fresh && cn("bg-foreground/[0.04]", styles.popIn))}
                  style={field.fresh ? { "--pop-delay": "0.6s" } : undefined}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03]">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-foreground/90">
                        {field.label}
                        {field.required ? <span className="ml-1 text-muted-foreground">*</span> : null}
                      </span>
                      {field.note ? <span className="block truncate text-[11px] text-muted-foreground">{field.note}</span> : null}
                    </span>
                  </span>
                  <span className="truncate text-[12px] text-foreground/80">{field.type}</span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">{field.key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Window>
      <Window className={cn("absolute top-[96px] left-[520px] z-[2] w-[480px]", styles.float)}>
        <div className={cn("flex flex-col gap-2.5 border-b px-4 py-3", LINE)}>
          <RequestLine method="GET" path="/api/content/v2/projects/8c1f2e/service-updates" />
          <CodeLines lines={queryLines(SERVICE_PARAMS)} className="pl-1" />
          <CodeLines lines={[{ depth: 0, tokens: [["k", "Authorization"], ["p", ": "], ["s", "Bearer ••••3f9a"]] }]} className="pl-1" />
        </div>
        <div className={cn("flex items-center gap-3 border-b px-4 py-2 text-[12px] text-muted-foreground", LINE)}>
          <StatusCode code={200} label="OK" className={styles.popIn} />
          <span className="tabular-nums">61 ms</span>
          <span className="ml-auto font-mono text-[11px]">application/json</span>
        </div>
        <Json value={STAGE_RESPONSE} className="px-4 py-3" />
      </Window>
    </div>
  );
}

const TOKENS = [
  { name: "Customer app", mask: "3f9a", scopes: ["delivery:read"], status: "Active" },
  { name: "Marketing site", mask: "71c4", scopes: ["delivery:read", "schema:read"], status: "Active" },
  { name: "Q3 preview build", mask: "0be2", scopes: ["delivery:read"], status: "Expired" },
  { name: "Old staging", mask: "d58e", scopes: ["delivery:read", "schema:read"], status: "Revoked" },
];

const TOKEN_TONES = { Active: ["emerald", "text-emerald-700 dark:text-emerald-400"], Expired: ["amber", "text-amber-700 dark:text-amber-300"], Revoked: ["red", "text-red-600 dark:text-red-400"] };

// Cell: delivery tokens with their scopes and states, and what happens when one asks for more than it holds.
export function DeliveryTokensRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <KeyRound className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Delivery tokens</span>
        <span className="text-muted-foreground">Orbital Freight web</span>
      </div>
      {TOKENS.map((token) => {
        const [tone, text] = TOKEN_TONES[token.status];
        return (
          <div key={token.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5", LINE, token.status !== "Active" && "opacity-75")}>
            <div className="w-[120px] shrink-0">
              <div className="truncate text-foreground/90">{token.name}</div>
              <div className="font-mono text-[11px] text-muted-foreground">••••{token.mask}</div>
            </div>
            <span className="flex min-w-0 flex-1 gap-1">
              {token.scopes.map((scope) => (
                <Chip key={scope} className="h-5 px-2 font-mono text-[10.5px]">
                  {scope}
                </Chip>
              ))}
            </span>
            <span className={cn("inline-flex w-[66px] shrink-0 items-center gap-1.5 text-[11px]", text)}>
              <Dot tone={tone} /> {token.status}
            </span>
          </div>
        );
      })}
      <div className={cn("flex flex-col gap-1.5 px-4 py-3", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <RequestLine method="GET" path="…/projects/8c1f2e/_schema">
          <StatusCode code={403} />
        </RequestLine>
        <CodeLines lines={[{ depth: 0, tokens: [["k", "\"message\""], ["p", ": "], ["s", "\"This token is missing the schema:read scope.\""]] }]} />
      </div>
    </div>
  );
}

const SCHEMA = {
  types: [
    {
      name: "Service update",
      apiPlural: "service-updates",
      fields: [inline({ key: "region", type: "enum", required: true }), inline({ key: "effectiveFrom", type: "date" }), inline({ key: "lanes", type: "reference" }), MORE],
    },
    MORE,
  ],
};

// Cell: the _schema document, so a front end can read each type's fields before it reads entries.
export function SchemaRender() {
  return (
    <div className={cn("mx-auto w-[480px]", CARD)}>
      <div className={cn("border-b px-4 py-3", LINE)}>
        <RequestLine method="GET" path="/api/content/v2/projects/8c1f2e/_schema">
          <StatusCode code={200} />
        </RequestLine>
      </div>
      <Json value={SCHEMA} indent={12} leading="leading-[19px]" className="px-4 py-3" />
    </div>
  );
}

const VERSIONS = [
  { tag: "v14", who: "Priya Nair", time: "10:42", current: true },
  { tag: "v13", who: "Marcus Whitfield", time: "09:58" },
  { tag: "v12", who: "Priya Nair", time: "Yesterday" },
];

// Cell: an entry's version snapshots with compare and roll back, and the cache cleared on demand.
export function VersionsCacheRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className={CARD}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
          <History className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Versions</span>
          <span className="truncate font-mono text-[11px] text-muted-foreground">rotterdam-storm-closure</span>
        </div>
        {VERSIONS.map((version, index) => (
          <div key={version.tag} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, index === 1 && "bg-foreground/[0.03]")}>
            <span className="w-8 font-mono text-foreground">{version.tag}</span>
            <Avatar name={version.who} size={18} />
            <span className="min-w-0 flex-1 truncate text-foreground/85">{version.who}</span>
            <span className="text-[11px] text-muted-foreground">{version.time}</span>
            {version.current ? (
              <span className="w-[156px] text-right text-[11px] text-emerald-700 dark:text-emerald-400">Current</span>
            ) : (
              <span className="flex w-[156px] justify-end gap-1.5 whitespace-nowrap">
                <span className="rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">Compare</span>
                <span className={cn("flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]", index === 1 ? "bg-foreground font-medium text-background" : "border border-foreground/[0.1] text-muted-foreground")}>
                  <RotateCcw className="size-3" /> Roll back
                </span>
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={cn("mt-3 flex items-center gap-3 px-4 py-3", CARD)}>
        <Zap className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <div className="text-foreground/90">Edge cache</div>
          <div className="font-mono text-[11px] text-muted-foreground">service-updates · TTL 300s</div>
        </div>
        <span className="rounded-md border border-foreground/[0.12] px-2.5 py-1 text-foreground/90">Invalidate cache</span>
      </div>
      <div className={cn("mt-2.5 ml-auto flex w-fit items-center gap-2 px-3 py-2", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-foreground/90">Cache invalidated for service-updates</span>
      </div>
    </div>
  );
}

// Cell: a consent-aware decision for the home page hero, and an analytics beacon the visitor's consent suppresses.
export function DecideRender() {
  const decideBody = { projectId: "8c1f2e…", slotKey: "home-hero", profile: inline({ anonymousId: "anon_5d21" }) };
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3">
      <div className={cn("px-4 py-3", CARD)}>
        <RequestLine method="POST" path="/api/decide">
          <StatusCode code={200} />
        </RequestLine>
        <Json value={decideBody} leading="leading-[19px]" className="mt-2" />
        <CodeLines leading="leading-[19px]" className="mt-1.5" lines={[{ depth: 0, tokens: [["p", "→ "], ...inlineTokens({ entryId: "e41a7c2d", variantId: "v7b04e19" })] }]} />
      </div>
      <div className={cn("px-4 py-3", CARD, styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <RequestLine method="POST" path="/api/content/v1/collect">
          <StatusCode code={200} />
        </RequestLine>
        <CodeLines leading="leading-[19px]" className="mt-2" lines={[{ depth: 0, tokens: inlineTokens({ type: "page_view", anonymousId: "anon_9c3a" }) }]} />
        <CodeLines leading="leading-[19px]" lines={[{ depth: 0, tokens: [["p", "→ "], ...inlineTokens({ ok: true, suppressed: true })] }]} />
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="size-3" /> This visitor declined analytics, so nothing was stored.
        </div>
      </div>
    </div>
  );
}

// Freight scenes drawn in the palette's greys, standing in for the library's photos.
function Scene({ kind = "dock", className }) {
  return (
    <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" className={cn("text-foreground", className)} aria-hidden="true">
      <rect width="160" height="110" fill="currentColor" fillOpacity="0.05" />
      <rect width="160" height="58" fill="currentColor" fillOpacity="0.06" />
      {kind === "ship" ? (
        <>
          <path d="M0 80 Q20 76 40 80 T80 80 T120 80 T160 80 V110 H0Z" fill="currentColor" fillOpacity="0.14" />
          <path d="M18 70 H138 L128 84 H28Z" fill="currentColor" fillOpacity="0.32" />
          {[30, 48, 66, 84, 102].map((x, index) => (
            <rect key={x} x={x} y={index % 2 ? 56 : 60} width="16" height={index % 2 ? 14 : 10} fill="currentColor" fillOpacity={0.18 + (index % 3) * 0.08} />
          ))}
          <rect x="116" y="50" width="12" height="20" fill="currentColor" fillOpacity="0.4" />
        </>
      ) : null}
      {kind === "dock" ? (
        <>
          <rect y="86" width="160" height="24" fill="currentColor" fillOpacity="0.16" />
          <path d="M116 86V24M122 86V24M104 26H156M122 30 152 26" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" fill="none" />
          <path d="M146 27V44" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="139" y="44" width="14" height="7" fill="currentColor" fillOpacity="0.35" />
          {[
            [10, 77, 0.38],
            [33, 77, 0.24],
            [56, 77, 0.32],
            [79, 77, 0.2],
            [10, 68, 0.22],
            [33, 68, 0.36],
            [56, 68, 0.18],
            [21, 59, 0.3],
            [44, 59, 0.2],
          ].map(([x, y, opacity]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="22" height="8.5" rx="0.6" fill="currentColor" fillOpacity={opacity} />
          ))}
        </>
      ) : null}
      {kind === "trucks" ? (
        <>
          <rect y="84" width="160" height="26" fill="currentColor" fillOpacity="0.14" />
          {[8, 84].map((x) => (
            <g key={x}>
              <rect x={x} y="56" width="50" height="24" fill="currentColor" fillOpacity="0.3" />
              <path d={`M${x + 52} 64h10l6 8v8h-16z`} fill="currentColor" fillOpacity="0.4" />
              {[x + 10, x + 40, x + 60].map((cx) => (
                <circle key={cx} cx={cx} cy="82" r="4" fill="currentColor" fillOpacity="0.5" />
              ))}
            </g>
          ))}
        </>
      ) : null}
      {kind === "warehouse" ? (
        <>
          <rect y="88" width="160" height="22" fill="currentColor" fillOpacity="0.14" />
          <path d="M14 88V46L80 26 146 46V88Z" fill="currentColor" fillOpacity="0.24" />
          {[30, 62, 94].map((x) => (
            <rect key={x} x={x} y="62" width="22" height="26" fill="currentColor" fillOpacity="0.2" />
          ))}
          {[66, 70, 74, 78, 82].map((y) => (
            <line key={y} x1="30" x2="116" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.12" />
          ))}
        </>
      ) : null}
    </svg>
  );
}

const LIBRARY = [
  { name: "dock-12.jpg", kind: "dock", size: "4032 × 3024", selected: true },
  { name: "vessel-arrival.jpg", kind: "ship", size: "6000 × 4000" },
  { name: "fleet-yard.jpg", kind: "trucks", size: "5472 × 3648" },
  { name: "warehouse-b.jpg", kind: "warehouse", size: "4032 × 3024" },
  { name: "reefer-row.jpg", kind: "dock", size: "6000 × 4000" },
  { name: "night-loading.jpg", kind: "trucks", size: "4032 × 3024" },
  { name: "quay-crane-3.jpg", kind: "dock", size: "5472 × 3648" },
  { name: "feeder-vessel.jpg", kind: "ship", size: "6000 × 4000" },
  { name: "cross-dock.jpg", kind: "warehouse", size: "4032 × 3024" },
];

const VARIANTS = [
  { transform: "w_320,f_webp", size: "320 × 240", bytes: "18 KB", share: 13, code: 200 },
  { transform: "w_640,f_webp", size: "640 × 480", bytes: "54 KB", share: 38, code: 200 },
  { transform: "w_1280,f_avif", size: "1280 × 960", bytes: "141 KB", share: 100, code: 200 },
];

// Section stage: the Assets library with one photo's delivery URL, its sized variants and a referrer that gets turned away.
export function AssetsApiStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[600px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <AppMark id="assets" size={22} />
          <span className="font-medium">Library</span>
          <span className="text-muted-foreground">Orbital media</span>
          <span className="ml-auto flex h-7 w-[150px] items-center gap-1.5 rounded-md border border-foreground/[0.09] px-2 text-[12px] text-muted-foreground">
            <Search className="size-3.5" /> Search files
          </span>
        </div>
        <div className={cn("flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]", LINE)}>
          {["All files", "Ports", "Fleet", "Warehouses", "Campaigns"].map((folder, index) => (
            <span key={folder} className={cn("rounded-full px-2.5 py-1", index === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
              {folder}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 p-4">
          {LIBRARY.map((file) => (
            <div key={file.name} className={cn("overflow-hidden rounded-lg border", file.selected ? "border-foreground/40 ring-2 ring-foreground/15" : "border-foreground/[0.08]")}>
              <Scene kind={file.kind} className="block h-[104px] w-full" />
              <div className="px-2.5 py-2">
                <div className="truncate text-[12px] text-foreground/90">{file.name}</div>
                <div className="font-mono text-[10.5px] text-muted-foreground">{file.size}</div>
              </div>
            </div>
          ))}
        </div>
      </Window>
      <Window className={cn("absolute top-[70px] left-[540px] z-[2] w-[460px]", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <ImageIcon className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Delivery</span>
          <span className="text-muted-foreground">dock-12.jpg</span>
          <Chip dot="emerald" className="ml-auto h-5 px-2 text-[11px]">
            Signed URLs
          </Chip>
        </div>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="rounded-lg bg-foreground/[0.04] px-3 py-2.5 font-mono text-[12px] leading-[20px] break-all">
            <span className="text-foreground/40">/d/3f9c/7a21/</span>
            <span className="text-foreground/90">w_640,c_cover,f_webp,q_75</span>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/60">dock-12.jpg</span>
            <span className="text-foreground/40">?sig=</span>
            <span className="text-foreground/60">9b1e…</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[
              ["w", "640"],
              ["fit", "cover"],
              ["format", "webp"],
              ["quality", "75"],
            ].map(([key, value]) => (
              <Chip key={key} className="h-5 px-2 font-mono text-[10.5px]">
                <span className="text-muted-foreground">{key}</span> {value}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col py-1.5">
          {VARIANTS.map((variant, index) => (
            <div key={variant.transform} className={cn("flex items-center gap-3 px-4 py-2 font-mono text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
              <span className="w-[112px] shrink-0 text-foreground/90">{variant.transform}</span>
              <span className="w-[78px] shrink-0 text-[11px] text-muted-foreground">{variant.size}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                <span className={cn("block h-full origin-left rounded-full bg-foreground/40", styles.fill)} style={{ width: `${variant.share}%`, "--fill-delay": `${0.5 + index * 0.15}s` }} />
              </span>
              <span className="w-[48px] shrink-0 text-right text-[11px] text-muted-foreground">{variant.bytes}</span>
              <StatusCode code={variant.code} />
            </div>
          ))}
          <div className={cn("flex items-center gap-3 px-4 py-2 font-mono text-[12px]", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
            <span className="text-foreground/60">Referer:</span>
            <span className="min-w-0 flex-1 truncate text-foreground/90">elsewhere.example</span>
            <span className="font-sans text-[11px] text-muted-foreground">not on the allow list</span>
            <StatusCode code={403} />
          </div>
        </div>
        <div className={cn("flex items-center gap-2 border-t px-4 py-2.5 text-[11px] text-muted-foreground", LINE)}>
          <Lock className="size-3.5" /> Allowed referrers
          <span className="ml-auto font-mono text-foreground/75">orbitalfreight.com, app.orbitalfreight.com</span>
        </div>
      </Window>
    </div>
  );
}

const ASSET_KEYS = [
  { name: "Customer app", prefix: "gk_live_7Hq2", scopes: ["assets:read", "delivery:read"], used: "2m ago" },
  { name: "Upload worker", prefix: "gk_live_c91X", scopes: ["upload:write", "assets:write"], used: "1h ago" },
  { name: "Collections sync", prefix: "gk_live_Pz4k", scopes: ["collections:read", "collections:write"], used: "Yesterday" },
];

// Cell: Assets API keys, each limited to the scopes its job needs, and one of them listing the library.
export function AssetKeysRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <KeyRound className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">API keys</span>
        <span className="text-muted-foreground">Orbital media</span>
      </div>
      {ASSET_KEYS.map((key, index) => (
        <div key={key.name} className={cn("border-b px-4 py-2.5", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.12}s` }}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-foreground/90">{key.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{key.prefix}…</span>
            <span className="ml-auto text-[11px] text-muted-foreground">{key.used}</span>
          </div>
          <div className="mt-1.5 flex gap-1">
            {key.scopes.map((scope) => (
              <Chip key={scope} className="h-5 px-2 font-mono text-[10.5px]">
                {scope}
              </Chip>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-1 px-4 py-3">
        <RequestLine method="GET" path="/api/v1/assets?limit=2">
          <StatusCode code={200} />
        </RequestLine>
        <CodeLines lines={[{ depth: 0, tokens: [["p", "→ "], ...inlineTokens({ data: [{ name: "dock-12.jpg" }, MORE] })] }]} />
      </div>
    </div>
  );
}

const WORKFLOW = [
  { icon: Zap, kind: "Trigger", label: "Asset approved" },
  { icon: Filter, kind: "If has tag", label: "hero" },
  { icon: Webhook, kind: "Webhook", label: "POST https://api.orbitalfreight.com/hooks/assets", mono: true },
];

// Cell: an Assets workflow that calls the app's webhook when a hero photo is approved.
export function AssetWorkflowRender() {
  return (
    <div className="relative mx-auto w-[460px] text-[12px]">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="text-[13px] font-medium">Publish approved hero photos</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
          <Dot tone="emerald" /> Active
        </span>
      </div>
      <div className="flex flex-col items-stretch">
        {WORKFLOW.map(({ icon: Icon, kind, label, mono }, index) => (
          <div key={kind} className="flex flex-col items-center">
            {index ? (
              <svg viewBox="0 0 2 22" className="h-[22px] w-[2px] text-foreground" aria-hidden="true">
                <line x1="1" y1="0" x2="1" y2="22" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" className={styles.flow} />
              </svg>
            ) : null}
            <div className={cn("flex w-full items-center gap-3 px-3.5 py-2.5", CARD)}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04]">
                <Icon className="size-3.5 text-foreground/80" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-muted-foreground">{kind}</div>
                <div className={cn("truncate text-foreground/90", mono && "font-mono text-[11.5px]")}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 ml-auto flex w-fit items-center gap-2 px-3 py-2", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
        <span className="text-foreground/80">dock-12.jpg approved</span>
        <span className="font-mono text-[11px] text-muted-foreground">142 ms</span>
        <StatusCode code={200} />
      </div>
    </div>
  );
}

const STREAM_START = inline({
  object: "chat.completion.chunk",
  choices: [{ delta: { role: "assistant", content: "" } }],
  citations: [{ index: 1, title: "Dangerous goods playbook.pdf", page: 12 }, { index: 2, title: "Rotterdam port rules", page: null }],
});

const STREAM_END = inline({ choices: [{ delta: {}, finish_reason: "stop" }], citations: [MORE] });

const LOGS = [
  { time: "10:42", channel: "API", query: "Can we ship lithium batteries to Rotterdam by sea?", status: "OK", latency: "1,920ms", tokens: "1,284" },
  { time: "10:41", channel: "MCP", query: "reefer plug-in limits at Antwerp", status: "OK", latency: "410ms", tokens: "312" },
  { time: "10:40", channel: "Widget", query: "Where is my container right now?", status: "OK", latency: "2,310ms", tokens: "1,906" },
  { time: "10:38", channel: "Playground", query: "Reasons for a customs hold", status: "OK", latency: "1,640ms", tokens: "1,120" },
  { time: "10:37", channel: "API", query: "Demurrage rules for Felixstowe", status: "Error", latency: "—", tokens: "—" },
];

// Section stage: a streamed, cited chat completion in the terminal, with Grey's request log across every channel.
export function GreyStreamStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="zsh" icon={SquareTerminal} meta="~/orbital-assistant" className="absolute top-0 left-0 h-[600px] w-[660px]">
        <div className="flex flex-col gap-0.5 px-5 py-4 font-mono text-[12px] leading-[20px]">
          <Prompt dir="~/orbital-assistant">curl -N &quot;$GREY/api/v1/pipelines/ops-assistant/chat/completions&quot; \</Prompt>
          <div className="pl-[158px] whitespace-pre text-foreground/90">-H &quot;Authorization: Bearer $GREY_KEY&quot; \</div>
          <div className="pl-[158px] whitespace-pre text-foreground/90">
            -d <span className="text-foreground/60">&apos;{"{"}&quot;stream&quot;:true,&quot;messages&quot;:[…]{"}"}&apos;</span>
          </div>
          <DataLine value={STREAM_START} delay={0.4} wrap />
          {SSE_LINES.map((line, index) => (
            <DataLine key={index} value={line} delay={0.8 + index * 0.35} />
          ))}
          <DataLine value={STREAM_END} delay={2} />
          <DataLine value="[DONE]" delay={2.3} />
          <div className="mt-3">
            <Prompt dir="~/orbital-assistant">
              <Typed text={'curl "$GREY/…/ops-assistant/models"'} delay={2.8} />
            </Prompt>
          </div>
        </div>
      </Window>
      <Window className={cn("absolute top-[292px] left-[460px] z-[2] w-[540px]", styles.float)}>
        <div className={cn("flex h-11 shrink-0 items-center gap-2.5 border-b px-4", LINE)}>
          <AppMark id="grey" size={20} />
          <span className="font-medium">Request logs</span>
          <span className="text-muted-foreground">ops-assistant</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Live
          </span>
        </div>
        <div className={cn("grid grid-cols-[40px_74px_1fr_44px_60px_40px] gap-3 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Time</span>
          <span>Channel</span>
          <span>Query</span>
          <span>Status</span>
          <span className="text-right">Latency</span>
          <span className="text-right">Tokens</span>
        </div>
        {LOGS.map((log, index) => (
          <div key={log.time} className={cn("grid grid-cols-[40px_74px_1fr_44px_60px_40px] items-center gap-3 border-b px-4 py-2 text-[12px] last:border-b-0", LINE, index === 0 && "bg-foreground/[0.04]")}>
            <span className="font-mono text-[11px] text-muted-foreground">{log.time}</span>
            <Chip className="h-5 w-fit px-2 text-[11px]">{log.channel}</Chip>
            <span className="truncate text-foreground/85">{log.query}</span>
            <span className={cn("inline-flex items-center gap-1.5 text-[11px]", log.status === "OK" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              <Dot tone={log.status === "OK" ? "emerald" : "red"} /> {log.status}
            </span>
            <span className="text-right font-mono text-[11px] text-muted-foreground tabular-nums">{log.latency}</span>
            <span className="text-right font-mono text-[11px] text-muted-foreground tabular-nums">{log.tokens}</span>
          </div>
        ))}
      </Window>
    </div>
  );
}

const MCP_CONFIG = {
  mcpServers: {
    "orbital-ops": {
      url: "https://…/api/mcp/5d0e9a",
      headers: { Authorization: "Bearer <YOUR_API_KEY>" },
    },
  },
};

// Cell: the MCP server's copyable client config and the four tools it exposes.
export function McpConfigRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <Plug className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">MCP server</span>
        <span className="text-muted-foreground">Orbital ops</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
          <Dot tone="emerald" /> Enabled
        </span>
      </div>
      <div className="px-4 pt-3">
        <div className="flex w-fit gap-1 rounded-lg bg-foreground/[0.05] p-1">
          {["Claude Desktop", "Cursor"].map((client, index) => (
            <span key={client} className={cn("rounded-md px-2.5 py-1", index === 0 ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground")}>
              {client}
            </span>
          ))}
        </div>
      </div>
      <Json value={MCP_CONFIG} indent={12} leading="leading-[19px]" className="px-4 py-3" />
      <div className={cn("flex items-center gap-1.5 border-t px-4 py-2.5", LINE)}>
        <span className="mr-1 text-[11px] text-muted-foreground">Tools</span>
        {["search", "ask", "get_entity", "list_sources"].map((tool, index) => (
          <span key={tool} className={cn("rounded-md border border-foreground/[0.1] px-1.5 py-0.5 font-mono text-[11px] text-foreground/85", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

const GREY_KEYS = [
  { name: "Customer app assistant", prefix: "gk_live_4Rm2", scopes: ["Retrieve", "Chat"] },
  { name: "Search indexer", prefix: "gk_live_Tn8w", scopes: ["Retrieve"] },
  { name: "Team Cursor and Claude", prefix: "gk_live_q0Ld", scopes: ["MCP"] },
];

// Cell: Grey API keys, each granted retrieve, chat or MCP access on its own.
export function GreyKeysRender() {
  return (
    <div className={cn("mx-auto w-[460px] text-[12px]", CARD)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3 text-[13px]", LINE)}>
        <KeyRound className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">API keys</span>
        <span className="text-muted-foreground">ops-assistant</span>
      </div>
      {GREY_KEYS.map((key) => (
        <div key={key.name} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-foreground/90">{key.name}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{key.prefix}••••</div>
          </div>
          <span className="grid shrink-0 grid-cols-3 gap-1 rounded-lg bg-foreground/[0.05] p-1">
            {["Retrieve", "Chat", "MCP"].map((scope) => {
              const on = key.scopes.includes(scope);
              return (
                <span key={scope} className={cn("flex items-center justify-center gap-1 rounded-md px-2 py-0.5 text-[11px]", on ? "bg-surface-card font-medium text-foreground shadow-sm dark:bg-foreground/[0.1]" : "text-muted-foreground/70")}>
                  {on ? <Check className="size-3" /> : null}
                  {scope}
                </span>
              );
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

const PROVIDERS = [
  { name: "OpenAI", key: "••••91c0" },
  { name: "Anthropic", key: "••••4f2a" },
  { name: "Google", key: "••••77de" },
  { name: "OpenRouter", key: "••••a10b" },
  { name: "Mistral", key: "••••5c3e" },
  { name: "Groq", key: "••••e8d1" },
  { name: "Ollama", key: "http://gpu-01:11434", local: true },
  { name: "vLLM", key: "http://vllm.internal:8000", local: true },
];

// Cell: model providers on the team's own keys, cloud and self-hosted side by side.
export function ModelKeysRender() {
  return (
    <div className="mx-auto grid w-[460px] grid-cols-2 gap-2 text-[12px]">
      {PROVIDERS.map((provider, index) => (
        <div key={provider.name} className={cn("flex items-center gap-2.5 px-3 py-2.5", CARD, styles.popIn)} style={{ "--pop-delay": `${0.1 + index * 0.06}s` }}>
          <Avatar name={provider.name} size={24} className="rounded-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-medium">
              {provider.name}
              {provider.local ? <span className="text-[10.5px] font-normal text-muted-foreground">self-hosted</span> : null}
            </div>
            <div className="truncate font-mono text-[10.5px] text-muted-foreground">{provider.key}</div>
          </div>
          <Dot tone="emerald" />
        </div>
      ))}
    </div>
  );
}

const EVAL_METRICS = [
  { name: "Faithfulness", score: 0.93 },
  { name: "Answer relevance", score: 0.9 },
  { name: "Context precision", score: 0.84 },
  { name: "Context recall", score: 0.79 },
];

// Cell: an evaluation run over the assistant's customs questions, scored on four measures.
export function EvalsRender() {
  return (
    <div className={cn("mx-auto w-[440px] p-5 text-[13px]", CARD)}>
      <div className="flex items-center gap-2">
        <Gauge className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Customs questions</span>
        <span className="text-muted-foreground">· 60 cases</span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">ops-assistant v6</span>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {EVAL_METRICS.map((metric, index) => (
          <div key={metric.name}>
            <div className="mb-1.5 flex justify-between text-[12px]">
              <span className="text-foreground/85">{metric.name}</span>
              <span className="font-mono text-muted-foreground">{metric.score.toFixed(2)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
              <div className={cn("h-full origin-left rounded-full bg-foreground/70", styles.fill)} style={{ width: `${metric.score * 100}%`, "--fill-delay": `${0.3 + index * 0.15}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DELIVERIES = [
  { when: "2m", event: "response.created", state: "Delivered", code: 200, attempts: 1 },
  { when: "14m", event: "response.created", state: "Failed", code: 500, attempts: 5, replay: true },
  { when: "31m", event: "response.updated", state: "Retrying", code: 503, attempts: 2 },
  { when: "1h", event: "response.approved", state: "Delivered", code: 200, attempts: 1 },
  { when: "3h", event: "response.approved", state: "Delivered", code: 200, attempts: 1 },
  { when: "5h", event: "response.created", state: "Delivered", code: 200, attempts: 1 },
];

const DELIVERY_TONES = { Delivered: ["emerald", "text-emerald-700 dark:text-emerald-400"], Retrying: ["amber", "text-amber-700 dark:text-amber-300"], Failed: ["red", "text-red-600 dark:text-red-400"] };

const PAYLOAD = {
  event: "response.created",
  data: {
    form: inline({ slug: "carrier-onboarding" }),
    response: {
      status: "Needs review",
      respondent: inline({ name: "Leah Mensah" }),
      answers: MORE,
    },
  },
};

// Showcase: the carrier onboarding form's webhook, its delivery log with a replay, and the payload it sends.
export function FormsWebhooksRender() {
  return (
    <div className="relative h-[440px] w-[680px]">
      <Window className="absolute top-0 left-0 w-[620px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
          <AppMark id="forms" size={22} />
          <span className="font-medium">Webhooks</span>
          <span className="text-muted-foreground">Carrier onboarding</span>
        </div>
        <div className={cn("flex flex-col gap-2 border-b px-5 py-3", LINE)}>
          <div className="flex items-center gap-2 font-mono text-[12px] text-foreground/85">
            <Webhook className="size-3.5 text-muted-foreground" /> https://api.orbitalfreight.com/hooks/forms
          </div>
          <div className="flex gap-1.5">
            {["response.created", "response.updated", "response.approved"].map((event) => (
              <Chip key={event} className="h-5 px-2 font-mono text-[10.5px]">
                {event}
              </Chip>
            ))}
          </div>
        </div>
        <div className={cn("grid grid-cols-[36px_136px_112px_64px_1fr] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>When</span>
          <span>Event</span>
          <span>Status</span>
          <span>Attempts</span>
          <span />
        </div>
        {DELIVERIES.map((delivery, index) => {
          const [tone, text] = DELIVERY_TONES[delivery.state];
          return (
            <div key={index} className={cn("grid grid-cols-[36px_136px_112px_64px_1fr] items-center gap-3 border-b px-5 py-2.5 last:border-b-0", LINE, delivery.replay && "bg-foreground/[0.04]")}>
              <span className="text-[11px] text-muted-foreground">{delivery.when}</span>
              <span className="truncate font-mono text-[11.5px] text-foreground/85">{delivery.event}</span>
              <span className="flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1.5 text-[12px]", text)}>
                  <Dot tone={tone} /> {delivery.state}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{delivery.code}</span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{delivery.attempts}</span>
              <span className="flex justify-end">
                {delivery.replay ? (
                  <span className="flex h-6 items-center gap-1 rounded-md bg-foreground px-2 text-[11px] font-medium text-background">
                    <RotateCcw className="size-3" /> Replay
                  </span>
                ) : null}
              </span>
            </div>
          );
        })}
      </Window>
      <div className={cn("absolute top-[236px] left-[332px] z-[2] w-[348px] p-3.5", POPOVER, styles.float)}>
        <div className="mb-2 flex items-center gap-2 text-[12px]">
          <Database className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Payload</span>
          <span className="ml-auto">
            <StatusCode code={200} />
          </span>
        </div>
        <Json value={PAYLOAD} indent={12} leading="leading-[19px]" />
      </div>
    </div>
  );
}

const RESPONSES_JSON = {
  responses: [
    {
      status: "Approved",
      priority: "High",
      respondent: inline({ name: "Leah Mensah" }),
      tags: ["haulage", "eu"],
    },
    MORE,
  ],
  nextCursor: "MjAyNi0xMC0yN3w…",
};

// Cell: reading a form's responses over REST with a bearer key.
export function FormsRestRender() {
  return (
    <div className={cn("mx-auto w-[460px]", CARD)}>
      <div className={cn("flex flex-col gap-2 border-b px-4 py-3", LINE)}>
        <RequestLine method="GET" path="/api/v1/forms/4b7e…/responses?limit=20">
          <StatusCode code={200} />
        </RequestLine>
        <CodeLines lines={[{ depth: 0, tokens: [["k", "Authorization"], ["p", ": "], ["s", "Bearer gf_••••"]] }]} />
      </div>
      <Json value={RESPONSES_JSON} leading="leading-[19px]" className="px-4 py-3" pop={{ start: 0.3, step: 0.05 }} />
    </div>
  );
}

// Cell: the carrier onboarding form embedded inline on Orbital's site with one script tag.
export function EmbedRender() {
  return (
    <div className="mx-auto flex w-[470px] flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
        <div className={cn("flex items-center gap-1.5 border-b px-3 py-2", LINE)}>
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">orbitalfreight.com/carriers/join</span>
        </div>
        <div className="flex gap-5 p-4">
          <div className="flex w-[150px] shrink-0 flex-col gap-2.5 pt-1">
            <span className="text-[15px] leading-tight font-medium tracking-[-0.01em]">Haul with Orbital</span>
            <span className="block h-2 w-full rounded-full bg-foreground/[0.07]" />
            <span className="block h-2 w-5/6 rounded-full bg-foreground/[0.07]" />
            <span className="block h-2 w-4/6 rounded-full bg-foreground/[0.07]" />
          </div>
          <div className={cn("flex min-w-0 flex-1 flex-col gap-2 rounded-xl border border-foreground/[0.1] bg-surface-card p-3.5 text-[12px] dark:bg-surface-subtle", styles.popIn)} style={{ "--pop-delay": "0.3s" }}>
            <span className="text-[13px] font-medium">Carrier onboarding</span>
            {["Company name", "Fleet size"].map((label) => (
              <span key={label} className="flex h-7 items-center rounded-md border border-foreground/[0.12] px-2.5 text-muted-foreground">
                {label}
              </span>
            ))}
            <span className="mt-0.5 flex h-7 items-center justify-center rounded-md bg-foreground font-medium text-background">Continue</span>
          </div>
        </div>
      </div>
      <div className={cn("px-3.5 py-2.5 font-mono text-[11.5px] leading-[19px]", CARD, styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <div className="truncate">
          <span className="text-foreground/40">&lt;div </span>
          <span className="text-foreground/90">data-geiger-form</span>
          <span className="text-foreground/40">=</span>
          <span className="text-foreground/60">&quot;carrier-onboarding&quot;</span>
          <span className="text-foreground/90"> data-mode</span>
          <span className="text-foreground/40">=</span>
          <span className="text-foreground/60">&quot;inline&quot;</span>
          <span className="text-foreground/40">&gt;&lt;/div&gt;</span>
        </div>
        <div className="truncate">
          <span className="text-foreground/40">&lt;script </span>
          <span className="text-foreground/90">src</span>
          <span className="text-foreground/40">=</span>
          <span className="text-foreground/60">&quot;…/embed.js&quot;</span>
          <span className="text-foreground/90"> async</span>
          <span className="text-foreground/40">&gt;&lt;/script&gt;</span>
        </div>
      </div>
    </div>
  );
}
