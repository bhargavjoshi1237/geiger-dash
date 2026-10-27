import {
  ArrowUp,
  Copy,
  Cpu,
  Database,
  FileText,
  Gauge,
  History,
  KeyRound,
  Link2,
  Lock,
  Megaphone,
  MessageCircle,
  PanelBottom,
  Plug,
  RotateCcw,
  SquareTerminal,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  Badge,
  Card,
  Code,
  EditorHeader,
  Field,
  GreySidebar,
  PANEL,
  PrimaryButton,
  SectionRail,
  Segmented,
  StatusText,
  Toggle,
} from "@/components/product-pages/apps/grey/grey_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Grey's ways out for Kestrel Aero: the OpenAI-compatible API, MCP servers, the chat widget, model keys and usage.

const BASE = "https://geiger.studio/grey/api/v1/pipelines/7f3c2a9e";

const PIPELINE_SECTIONS = [
  { label: "Model", icon: Cpu },
  { label: "Retrieval", icon: Database },
  { label: "Prompt", icon: FileText },
  { label: "Versions", icon: History },
  { label: "Endpoints", icon: Link2 },
  { label: "Danger zone", icon: TriangleAlert },
];

function CopyField({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-foreground/85">{label}</span>
      <span className="flex h-8 items-center gap-2 rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-2.5 font-mono text-[11px] text-foreground/85">
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <Copy className="size-3.5 shrink-0 text-muted-foreground" />
      </span>
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

// The hero plane: a pipeline's Endpoints section, with the OpenAI SDK snippet asking its first question.
export function EndpointsWindow() {
  const snippet = [
    [["k", "import "], ["p", "OpenAI "], ["k", "from "], ["s", '"openai"'], ["p", ";"]],
    [],
    [["k", "const "], ["p", "client = "], ["k", "new "], ["p", "OpenAI({"]],
    [["p", "  apiKey: process.env."], ["k", "GREY_API_KEY"], ["p", ","]],
    [["p", "  baseURL: "], ["s", '"https://geiger.studio/grey/api/v1/…"'], ["p", ","]],
    [["p", "});"]],
    [],
    [["c", "// `model` is ignored: the published version answers."]],
    [["k", "const "], ["p", "completion = "], ["k", "await "], ["p", "client.chat.completions.create({"]],
    [["p", "  model: "], ["s", '"grey"'], ["p", ","]],
  ];
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <GreySidebar open="Pipelines" active="All Pipelines" />
        <div className="flex min-w-0 flex-1 flex-col">
          <EditorHeader back="All Pipelines" title="Line maintenance answers" status={<Badge tone="emerald">Live · v7</Badge>} meta="Answers the line team's questions from the manuals, procedures and briefings.">
            <PrimaryButton icon={Megaphone}>Publish</PrimaryButton>
          </EditorHeader>
          <div className="flex min-h-0 flex-1">
            <SectionRail items={PIPELINE_SECTIONS} active="Endpoints" />
            <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_264px] gap-3 p-4">
              <Card title="Code snippets" description="Call this pipeline from your own app." className="overflow-hidden" bodyClassName="p-3">
                <Segmented options={["curl", "JavaScript", "OpenAI SDK", "Retrieve"]} value="OpenAI SDK" />
                <div className="mt-3 rounded-lg border border-foreground/[0.08] bg-background/50 px-3.5 py-3 dark:bg-foreground/[0.02]">
                  <Code lines={snippet} />
                  <div className="font-mono text-[11.5px] leading-[1.75] whitespace-pre text-foreground/85">
                    <div>{"  messages: [{"}</div>
                    <div>
                      {"    role: "}
                      <span className="text-emerald-700 dark:text-emerald-400">&quot;user&quot;</span>,
                    </div>
                    <div>
                      {"    content: "}
                      <span className="text-emerald-700 dark:text-emerald-400">
                        &quot;
                        <Typed text="Who signs off the post de-icing check?" delay={1.5} />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="flex min-w-0 flex-col gap-3">
                <Card title="Serving endpoints" description="OpenAI-compatible chat and a raw retrieve endpoint, serving the latest published version." bodyClassName="flex flex-col gap-3">
                  <CopyField label="Chat completions">{BASE}/chat/completions</CopyField>
                  <CopyField label="Retrieve">{BASE}/retrieve</CopyField>
                  <CopyField label="OpenAI base URL" hint="Use as baseURL in any OpenAI SDK.">
                    {BASE}
                  </CopyField>
                </Card>
                <Card title="MCP servers" description="MCP servers that answer with this pipeline.">
                  <div className="flex items-center gap-2.5 text-[12px]">
                    <Plug className="size-3.5 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-medium">Kestrel maintenance</span>
                    <StatusText label="Enabled" tone="emerald" live />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const STREAM = [
  { text: 'data: {"object":"chat.completion.chunk","model":"grey/7f3c2a9e@v7","choices":[{"delta":{"role":' },
  { text: '       "assistant","content":""}}],"citations":[{"index":1,"title":"A320 line maintenance' },
  { text: '       manual.pdf","page":212},{"index":2,"title":"De-icing procedure.docx","page":6},…]}' },
  { content: "In the aircraft technical log", gap: true },
  { content: ", with the fluid type and the time" },
  { content: " the final step started [1]." },
  { content: " The technician signs it before release [2]." },
  { text: 'data: {"choices":[{"delta":{},"finish_reason":"stop"}],"citations":[{"index":1,…},{"index":2,…}]}', gap: true },
  { text: "data: [DONE]", gap: true, done: true },
];

const ENDPOINTS = [
  ["POST", "/chat/completions", "An answer, streamed, with its citations"],
  ["GET", "/models", "The pipeline's published version"],
  ["POST", "/retrieve", "The matching chunks, without an answer"],
];

// Section stage: a streamed chat completion in the terminal, citations first, and the three endpoints beside it.
export function StreamStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window title="Terminal" icon={SquareTerminal} meta="~/kestrel-ops-portal" className="absolute top-0 left-0 h-[420px] w-[740px]">
        <div className="flex flex-col gap-0.5 px-5 py-4 font-mono text-[11.5px] leading-[1.8] whitespace-pre">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400">❯ </span>
            <span className="text-foreground">curl -N {BASE}/chat/completions \</span>
          </div>
          <div className="text-foreground/85">{'    -H "Authorization: Bearer gk_live_8Kd2••••" \\'}</div>
          <div className="text-foreground/85">{'    -d \'{"stream": true, "messages": [{"role": "user",'}</div>
          <div className="text-foreground/85">{'         "content": "Where is the post de-icing check recorded?"}]}\''}</div>
          <div className="h-3" />
          {STREAM.map((line, index) => (
            <div
              key={line.text ?? line.content}
              className={cn(line.gap && "mt-2.5", line.done ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground", styles.popIn)}
              style={{ "--pop-delay": `${0.4 + index * 0.18}s` }}
            >
              {line.content ? (
                <>
                  {'data: {"choices":[{"delta":{"content":"'}
                  <span className="text-foreground">{line.content}</span>
                  {'"}}]}'}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
      </Window>
      <div className={cn(PANEL, "absolute top-[196px] left-[610px] z-[2] w-[380px] p-4 text-[12px]", styles.float)}>
        <div className="flex items-center gap-2">
          <Link2 className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Line maintenance answers</span>
          <Badge tone="emerald" className="ml-auto">
            Live · v7
          </Badge>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {ENDPOINTS.map(([method, path, body]) => (
            <div key={path} className="rounded-lg border border-foreground/[0.08] px-3 py-2">
              <div className="flex items-center gap-2 font-mono text-[11.5px]">
                <span className={cn("w-9 text-[10px] font-semibold", method === "GET" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>{method}</span>
                <span className="text-foreground/90">{path}</span>
              </div>
              <div className="mt-0.5 pl-11 text-[11px] text-muted-foreground">{body}</div>
            </div>
          ))}
        </div>
        <div className={cn("mt-3 flex items-center gap-2 border-t pt-3", LINE)}>
          <KeyRound className="size-3.5 text-muted-foreground" />
          <span className="font-mono text-[11px] text-foreground/85">gk_live_8Kd2••••</span>
          <span className="ml-auto flex gap-1">
            <Badge>Chat</Badge>
            <Badge>Retrieve</Badge>
          </span>
        </div>
      </div>
    </div>
  );
}

const KEYS = [
  { name: "Ops portal", prefix: "gk_live_8Kd2", scopes: ["Chat", "Retrieve"], used: "2 min ago", status: "Active" },
  { name: "Line control laptops", prefix: "gk_live_Qm7v", scopes: ["MCP"], used: "1 h ago", status: "Active" },
  { name: "Crew portal widget", prefix: "gk_live_c4Ra", scopes: ["Chat"], used: "5 min ago", status: "Active" },
  { name: "Old crew app", prefix: "gk_live_Zt01", scopes: ["Chat"], used: "3 weeks ago", status: "Revoked" },
  { name: "Hangar kiosk pilot", prefix: "gk_live_9wEe", scopes: ["Retrieve"], used: "Never", status: "Expired" },
];

const KEY_TONE = { Active: "emerald", Revoked: "red", Expired: "amber" };

// Cell: API Keys, each scoped to Retrieve, Chat or MCP, with revoked and expired keys kept on the list.
export function ApiKeysRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("grid grid-cols-[minmax(0,1fr)_112px_64px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Name</span>
        <span>Scopes</span>
        <span>Status</span>
      </div>
      {KEYS.map((key, index) => (
        <div key={key.prefix} className={cn("grid grid-cols-[minmax(0,1fr)_112px_64px] items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <span className="min-w-0">
            <span className={cn("block truncate font-medium", key.status === "Active" ? "text-foreground/90" : "text-muted-foreground")}>{key.name}</span>
            <span className="block truncate font-mono text-[10.5px] text-muted-foreground">
              {key.prefix}•••• · {key.used}
            </span>
          </span>
          <span className="flex flex-wrap gap-1">
            {key.scopes.map((scope) => (
              <Badge key={scope}>{scope}</Badge>
            ))}
          </span>
          <StatusText label={key.status} tone={KEY_TONE[key.status]} />
        </div>
      ))}
    </div>
  );
}

const RETRIEVE_JSON = [
  [["p", "{ "], ["k", '"object"'], ["p", ": "], ["s", '"retrieval"'], ["p", ", "], ["k", '"version"'], ["p", ": 7, "], ["k", '"chunks"'], ["p", ": ["]],
  [["p", "  { "], ["k", '"sourceName"'], ["p", ": "], ["s", '"De-icing procedure.docx"'], ["p", ","]],
  [["p", "    "], ["k", '"page"'], ["p", ": 6, "], ["k", '"score"'], ["p", ": 0.86, "], ["k", '"via"'], ["p", ": "], ["s", '"vector+text"'], ["p", ","]],
  [["p", "    "], ["k", '"content"'], ["p", ": "], ["s", '"After de-icing, the certifying technician…"'], ["p", " },"]],
  [["p", "  { "], ["k", '"sourceName"'], ["p", ": "], ["s", '"Ramp safety briefing.mp4"'], ["p", ","]],
  [["p", "    "], ["k", '"startMs"'], ["p", ": 494000, "], ["k", '"score"'], ["p", ": 0.77, "], ["k", '"via"'], ["p", ": "], ["s", '"graph"'], ["p", ","]],
  [["p", "    "], ["k", '"content"'], ["p", ": "], ["s", '"…walk the wing from root to tip…"'], ["p", " }"]],
  [["p", "] }"]],
];

// Cell: the retrieve endpoint, which returns the scored passages and no answer.
export function RetrieveRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 font-mono text-[11.5px]", LINE)}>
        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">POST</span>
        <span className="text-foreground/90">/retrieve</span>
        <span className="ml-auto truncate text-muted-foreground">{'{ "query": "post de-icing check" }'}</span>
      </div>
      <div className={cn("px-4 py-3", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <Code lines={RETRIEVE_JSON} className="text-[11px] leading-[1.7]" />
      </div>
    </div>
  );
}

const SERVER_CONFIG = [
  [["p", "{"]],
  [["p", "  "], ["k", '"mcpServers"'], ["p", ": {"]],
  [["p", "    "], ["k", '"kestrel-maintenance"'], ["p", ": {"]],
  [["p", "      "], ["k", '"url"'], ["p", ": "], ["s", '"https://geiger.studio/grey/api/mcp/3c9e51b2"'], ["p", ","]],
  [["p", "      "], ["k", '"headers"'], ["p", ": { "], ["k", '"Authorization"'], ["p", ": "], ["s", '"Bearer <YOUR_API_KEY>"'], ["p", " }"]],
  [["p", "    }"]],
  [["p", "  }"]],
  [["p", "}"]],
];

// Callout centrepiece: one MCP server's sheet, its tools and the config to paste into a client.
export function McpServerSheet() {
  return (
    <div className={cn(PANEL, "mx-auto w-[460px] text-[12px]")}>
      <div className={cn("border-b px-4 py-3.5", LINE)}>
        <div className="flex items-center gap-2">
          <Plug className="size-4 text-muted-foreground" />
          <span className="text-[14px] font-medium">Kestrel maintenance</span>
        </div>
        <div className="mt-1 text-muted-foreground">Pipeline: Line maintenance answers · Knowledge bases: Maintenance manuals</div>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-medium">Status</div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
              Accepting MCP connections.
            </div>
          </div>
          <Toggle on />
        </div>
        <div>
          <div className="mb-1.5 font-medium">Server URL</div>
          <span className="flex h-8 items-center gap-2 rounded-lg border border-foreground/[0.1] bg-foreground/[0.03] px-2.5 font-mono text-[11px] text-foreground/85">
            <span className="min-w-0 flex-1 truncate">https://geiger.studio/grey/api/mcp/3c9e51b2</span>
            <Copy className="size-3.5 shrink-0 text-muted-foreground" />
          </span>
        </div>
        <div>
          <div className="font-medium">Tools</div>
          <div className="text-muted-foreground">Enabled on this server.</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["search", "ask", "get_entity"].map((tool, index) => (
              <span key={tool} className={cn("rounded-md border border-foreground/[0.14] px-2 py-0.5 font-mono text-[11px] text-foreground/90", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium">Connect a client</div>
          <div className="text-muted-foreground">Authenticated with Line control laptops.</div>
          <Segmented options={["Claude Desktop", "Cursor"]} value="Claude Desktop" className="mt-2" />
          <div className="mt-2 text-[11px] text-muted-foreground">
            Add this to <span className="font-mono text-foreground/80">claude_desktop_config.json</span>.
          </div>
          <div className="mt-1.5 rounded-lg border border-foreground/[0.08] bg-background/50 px-3 py-2 dark:bg-foreground/[0.02]">
            <Code lines={SERVER_CONFIG} className="text-[10.5px] leading-[1.65]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Cell: the ask tool called by an MCP client, and the cited answer it returns.
export function McpAskRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-2.5 text-[12px]">
      <div className="rounded-xl border border-foreground/[0.1] bg-surface-card px-4 py-3 dark:bg-surface-subtle">
        <div className="flex items-center gap-2">
          <MonoLabel>tools/call</MonoLabel>
          <span className="rounded-md border border-foreground/[0.14] px-1.5 font-mono text-[11px] text-foreground">ask</span>
        </div>
        <div className="mt-2 font-mono text-[11.5px] text-foreground/85">
          {'{ "question": "'}
          <span className="text-emerald-700 dark:text-emerald-400">Where is the post de-icing check recorded?</span>
          {'" }'}
        </div>
      </div>
      <div className={cn(PANEL, "px-4 py-3", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <MonoLabel>Result</MonoLabel>
        <p className="mt-2 leading-[1.55] text-foreground/90">
          In the aircraft technical log, with the fluid type and the time the final step started <span className="font-mono text-muted-foreground">[1]</span>. The certifying technician signs it before the aircraft is released{" "}
          <span className="font-mono text-muted-foreground">[2]</span>.
        </p>
        <div className="mt-2.5 font-mono text-[11px] leading-[1.7] text-muted-foreground">
          <div>Sources:</div>
          <div>[1] A320 line maintenance manual.pdf — p. 212</div>
          <div>[2] De-icing procedure.docx — p. 6</div>
        </div>
      </div>
    </div>
  );
}

const TOOL_SWITCHES = [
  ["search", "Semantic search over the server's knowledge bases.", true],
  ["ask", "Ask a question through the server's pipeline.", true],
  ["get_entity", "Look up a knowledge graph entity by name or id.", false],
  ["list_sources", "List sources available to this server.", false],
];

// Cell: a new MCP server, scoped to a pipeline, a key and the tools it exposes.
export function McpServerDialogRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[460px] p-4 text-[12px]")}>
      <div className="text-[14px] font-medium">New MCP Server</div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Field label="Pipeline" select>
          Line maintenance answers
        </Field>
        <Field label="API key" select>
          Line control laptops
        </Field>
      </div>
      <div className="mt-3 font-medium text-foreground/85">Tools</div>
      <div className="mt-1">
        {TOOL_SWITCHES.map(([name, body, on]) => (
          <div key={name} className={cn("flex items-center gap-3 border-b py-2 last:border-b-0", LINE)}>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[11.5px] text-foreground/90">{name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{body}</div>
            </div>
            <Toggle on={on} />
          </div>
        ))}
      </div>
    </div>
  );
}

// A fictional crew portal page behind the widget: a heading, a duty table and body copy, all for rhythm.
function CrewPortalPage() {
  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <div className="flex items-center gap-6 text-[12px] text-muted-foreground">
        <span className="font-semibold tracking-[-0.01em] text-foreground">Kestrel Aero · Crew</span>
        <span className="text-foreground">Rostering</span>
        <span>Training</span>
        <span>Bases</span>
        <span>Forms</span>
      </div>
      <div>
        <div className="text-[28px] font-medium tracking-[-0.02em]">Rostering</div>
        <div className="mt-3 flex flex-col gap-2.5">
          <Bar className="w-[420px]" />
          <Bar className="w-[380px]" />
          <Bar className="w-[300px]" />
        </div>
      </div>
      <div className="w-[440px] overflow-hidden rounded-xl border border-foreground/[0.08]">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className={cn("flex items-center gap-6 border-b px-4 py-3 last:border-b-0", LINE, row === 0 && "bg-foreground/[0.03]")}>
            <Bar className={cn("w-24", row === 0 && "bg-foreground/[0.12]")} />
            <Bar className={cn("w-16", row === 0 && "bg-foreground/[0.12]")} />
            <Bar className={cn("w-20", row === 0 && "bg-foreground/[0.12]")} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <Bar className="h-2.5 w-[180px] bg-foreground/[0.12]" />
        <Bar className="w-[400px]" />
        <Bar className="w-[360px]" />
      </div>
    </div>
  );
}

// Section stage: the crew portal with the chat bubble open, an answer streaming in with its sources.
export function WidgetStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute inset-x-0 top-0 h-[640px]">
        <div className={cn("flex h-10 shrink-0 items-center gap-1.5 border-b px-4", LINE)}>
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="mx-auto flex h-6 w-[360px] items-center justify-center gap-1.5 rounded-md bg-foreground/[0.05] text-[11px] text-muted-foreground">
            <Lock className="size-3" /> crew.kestrelaero.example/rostering
          </span>
        </div>
        <CrewPortalPage />
      </Window>
      <div className={cn(PANEL, "absolute top-[54px] right-[30px] z-[2] flex w-[370px] flex-col overflow-hidden text-[12.5px]")}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <MessageCircle className="size-4 text-muted-foreground" />
          <span className="font-medium">Ask crew ops</span>
          <span className="ml-auto flex items-center gap-2 text-muted-foreground">
            <RotateCcw className="size-3.5" />
            <X className="size-3.5" />
          </span>
        </div>
        <div className="flex flex-col gap-3 px-4 py-4">
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-foreground/[0.05] px-3 py-2 leading-[1.45] text-foreground/85">Hi! Ask me anything about rostering, rest and swaps.</div>
          <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-foreground px-3 py-2 leading-[1.45] text-background">How much notice do I need to give for a duty swap?</div>
          <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-foreground/[0.05] px-3 py-2 leading-[1.5] text-foreground/90">
            Ask crew control at least 48 hours before the first duty in the swap [1]. Both crew members must hold the same base and qualification [2]. Swaps inside 48 hours go to the duty manager instead [1].
          </div>
          <div className="-mt-1 flex flex-wrap gap-1.5">
            {["[1] Crew rostering policy", "[2] Crew handbook 2026.pdf — p. 31"].map((cite, index) => (
              <span key={cite} className={cn("max-w-full truncate rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.15}s` }}>
                {cite}
              </span>
            ))}
          </div>
        </div>
        <div className={cn("flex items-center gap-2 border-t px-4 py-3", LINE)}>
          <span className="flex-1 text-muted-foreground">Type your question…</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
        <div className={cn("border-t py-1.5 text-center text-[10.5px] text-muted-foreground", LINE)}>Powered by Grey</div>
      </div>
      <span className={cn("absolute top-[520px] right-[30px] z-[2] flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-xl shadow-black/30", styles.float)}>
        <X className="size-5" />
      </span>
    </div>
  );
}

// Cell: the widget's appearance settings and white-label switch.
export function WidgetSettingsRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[460px] p-4 text-[12px]")}>
      <MonoLabel>Appearance</MonoLabel>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <Field label="Title" boxClassName="border-foreground/25">
          <Typed text="Ask crew ops" delay={1.3} />
        </Field>
        <Field label="Placeholder">Type your question…</Field>
      </div>
      <Field label="Greeting" className="mt-2.5">
        Hi! Ask me anything about rostering, rest and swaps.
      </Field>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-medium text-foreground/85">Position</span>
        <Segmented options={["Left", "Right"]} value="Right" />
      </div>
      <div className={cn("mt-3 flex items-center gap-3 border-t pt-3", LINE)}>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground/85">White-label</div>
          <div className="text-[11px] text-muted-foreground">Hide the “Powered by Grey” footer.</div>
        </div>
        <Toggle />
      </div>
    </div>
  );
}

const WIDGETS = [
  { name: "Crew portal", pipeline: "Crew questions", domains: "crew.kestrelaero.example", status: "Enabled" },
  { name: "IT help page", pipeline: "Service desk bot", domains: "it.kestrelaero.example", status: "Disabled" },
];

// Cell: Widgets, each tied to a pipeline and the hostnames allowed to load it, with its embed snippet.
export function WidgetsListRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3 text-[12px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
          <PanelBottom className="size-3.5 text-muted-foreground" />
          <span className="font-medium">Widgets</span>
        </div>
        {WIDGETS.map((widget) => (
          <div key={widget.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground/90">{widget.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {widget.pipeline} · {widget.domains}
              </div>
            </div>
            <StatusText label={widget.status} tone={widget.status === "Enabled" ? "emerald" : "neutral"} />
          </div>
        ))}
      </div>
      <div className={cn(PANEL, "p-3.5", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Paste before &lt;/body&gt;</span>
          <Copy className="size-3.5 text-muted-foreground" />
        </div>
        <div className="mt-2 rounded-lg border border-foreground/[0.08] bg-background/50 px-3 py-2 font-mono text-[11px] leading-[1.6] text-foreground/85 dark:bg-foreground/[0.02]">
          &lt;script src=&quot;https://geiger.studio/grey/widget.js&quot;
          <br />
          {"  "}data-widget=&quot;5d1e07c4&quot; async&gt;&lt;/script&gt;
        </div>
      </div>
    </div>
  );
}

const PROVIDERS = [
  { name: "Kestrel Anthropic", kind: "Anthropic", key: "4f2a", caps: ["Chat"], status: "Connected" },
  { name: "Kestrel OpenAI", kind: "OpenAI", key: "91c0", caps: ["Chat", "Embeddings", "Transcription"], status: "Connected" },
  { name: "Voyage AI", kind: "Voyage AI", key: "7d3e", caps: ["Embeddings", "Rerank"], status: "Connected" },
  { name: "Hangar server", kind: "Ollama", key: "—", caps: ["Chat", "Embeddings"], status: "Unverified" },
  { name: "AssemblyAI", kind: "AssemblyAI", key: "0b8c", caps: ["Transcription"], status: "Error" },
];

const PROVIDER_TONE = { Connected: "emerald", Unverified: "neutral", Error: "red" };

// Cell: Model Providers, the customer's own keys for chat, embeddings, rerank and transcription.
export function ProvidersRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("grid grid-cols-[minmax(0,1fr)_64px_84px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Name</span>
        <span>Key</span>
        <span>Status</span>
      </div>
      {PROVIDERS.map((provider, index) => (
        <div key={provider.name} className={cn("grid grid-cols-[minmax(0,1fr)_64px_84px] items-center gap-3 border-b px-4 py-2 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-medium text-foreground/90">{provider.name}</span>
              <span className="truncate text-[11px] text-muted-foreground">{provider.kind}</span>
            </span>
            <span className="mt-1 flex gap-1">
              {provider.caps.map((cap) => (
                <span key={cap} className="rounded border border-foreground/[0.08] px-1.5 text-[10.5px] text-muted-foreground">
                  {cap}
                </span>
              ))}
            </span>
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            {provider.key === "—" ? (
              "—"
            ) : (
              <>
                <Lock className="size-3" />
                ••{provider.key}
              </>
            )}
          </span>
          <StatusText label={provider.status} tone={PROVIDER_TONE[provider.status]} />
        </div>
      ))}
    </div>
  );
}

const USAGE = [
  ["Pages ingested", "18,420"],
  ["Media minutes", "612"],
  ["Retrievals", "41,880"],
  ["LLM tokens", "12.4M"],
  ["Graph extraction", "3.1M"],
  ["Storage", "4.2 GB"],
];

const CAP_OPTIONS = ["Alert only", "Pause ingestion, keep retrieval", "Pause ingestion"];

// Cell: Usage counted in units, and what happens when the monthly soft cap is reached.
export function UsageRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3 text-[12px]">
      <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        {USAGE.map(([label, value], index) => (
          <div key={label} className={cn("px-3.5 py-2.5", index % 3 !== 0 && "border-l", index > 2 && "border-t", LINE)}>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {index === 0 ? <Gauge className="size-3" /> : null}
              {label}
            </div>
            <div className="mt-0.5 text-[17px] font-medium tracking-[-0.01em] tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className={cn(PANEL, "p-3.5", styles.popIn)} style={{ "--pop-delay": "0.4s" }}>
        <div className="font-medium text-foreground/85">When the cap is reached</div>
        <div className="mt-2 flex flex-col gap-1">
          {CAP_OPTIONS.map((option) => {
            const active = option === "Pause ingestion, keep retrieval";
            return (
              <div key={option} className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-1.5", active ? "border-foreground/30 bg-foreground/[0.05] text-foreground" : "border-transparent text-foreground/70")}>
                <span className={cn("flex size-3.5 items-center justify-center rounded-full border", active ? "border-foreground" : "border-foreground/30")}>{active ? <span className="size-1.5 rounded-full bg-foreground" /> : null}</span>
                {option}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">Stops new ingestion jobs; chat and retrieval keep working.</div>
      </div>
    </div>
  );
}

