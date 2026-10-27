import { BookOpen, Globe, KeyRound, Network, RotateCw, Route, ShieldCheck, SquareTerminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Pods renders: the CLI, an API's monitoring tab, the gateway's layers, usage plans and the developer portal.
// The API, plans and key come from the Anime Explorer seed, renamed so no real brand appears.

const PLAN_LINES = [
  { mark: "+", kind: "route", name: "GET  /anime/{id}/similar", note: "" },
  { mark: "~", kind: "route", name: "POST /graphql", note: "cache 60s → 300s" },
  { mark: "~", kind: "plan", name: "Builder · Pro", note: "10 rps · burst 20" },
];

function Prompt({ children }) {
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground">~/anime-explorer</span>
      <span className="text-emerald-600 dark:text-emerald-400">❯</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

const STAGES = [
  { name: "prod", deployment: "dep_7f3a", note: "Canary 10% · 15 min", tone: "amber" },
  { name: "staging", deployment: "dep_7f3a", note: "Live", tone: "emerald" },
  { name: "dev", deployment: "dep_7f39", note: "Live", tone: "emerald" },
];

const LOG_LINES = [
  { time: "21:14:02", method: "GET", path: "/anime/21/similar", status: "200", ms: "38 ms", note: "cache hit" },
  { time: "21:14:02", method: "POST", path: "/graphql", status: "200", ms: "112 ms", note: "" },
  { time: "21:14:03", method: "GET", path: "/anime/search", status: "429", ms: "2 ms", note: "throttled" },
];

// A pods CLI session: plan, apply and tail logs, ending in a deploy that types itself out.
export function TerminalWindow({ typed }) {
  return (
    <Window title="pods" icon={SquareTerminal} meta="~/anime-explorer" className="h-[640px] w-[1180px]">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-7 px-8 py-7 font-mono text-[17px] leading-[30px]">
          <div>
            <Prompt>pods plan -f pods.yaml</Prompt>
            {PLAN_LINES.map((line) => (
              <div key={line.name} className="flex gap-4 pl-7">
                <span className={line.mark === "+" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{line.mark}</span>
                <span className="w-16 text-muted-foreground">{line.kind}</span>
                <span className="w-72 text-foreground/85">{line.name}</span>
                <span className="text-muted-foreground">{line.note}</span>
              </div>
            ))}
            <div className="pl-7 text-muted-foreground">Plan: 1 to add, 2 to change.</div>
          </div>
          <div>
            <Prompt>pods apply -f pods.yaml</Prompt>
            <div className="pl-7 text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span> Applied 3 changes to Anime Explorer · staging
            </div>
          </div>
          <div>
            <Prompt>pods logs tail --api anime-explorer --stage staging</Prompt>
            {LOG_LINES.map((log) => (
              <div key={log.path} className="flex gap-4 pl-7 text-muted-foreground">
                <span>{log.time}</span>
                <span className="w-12">{log.method}</span>
                <span className="w-56 text-foreground/85">{log.path}</span>
                <span className={log.status === "200" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{log.status}</span>
                <span className="w-16 text-right">{log.ms}</span>
                <span>{log.note}</span>
              </div>
            ))}
          </div>
          <Prompt>{typed ? <Typed text={typed} delay={1.2} /> : null}</Prompt>
        </div>
        <div className={cn("flex w-[330px] shrink-0 flex-col gap-3 border-l px-5 py-6 text-[13px]", LINE)}>
          <div className="text-[11px] font-medium text-muted-foreground">Stages</div>
          {STAGES.map((stage) => (
            <div key={stage.name} className="rounded-xl border border-foreground/[0.08] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono">{stage.name}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">{stage.deployment}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Dot tone={stage.tone} />
                {stage.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

const TABS = ["Resources", "Routes", "Authorizers", "CORS", "Deployments", "Stages", "Monitoring", "Docs", "SDKs", "Agent tools"];

const ROUTES = [
  ["GET", "/anime/{id}"],
  ["GET", "/anime/{id}/similar"],
  ["GET", "/anime/search"],
  ["POST", "/graphql"],
  ["GET", "/characters/{id}"],
  ["GET", "/studios/{id}/anime"],
  ["GET", "/users/{name}/list"],
];

const METRICS = [
  { label: "Requests", value: "26.1k", note: "per day" },
  { label: "Latency p90", value: "210 ms", note: "p50 84 ms" },
  { label: "Cache hit ratio", value: "71%", note: "stage cache" },
  { label: "5XX errors", value: "0.02%", note: "4XX 0.4%" },
];

// Deterministic request counts per half hour, shaped like a day.
const BARS = Array.from({ length: 48 }, (_, index) => {
  const day = Math.sin(((index - 10) / 48) * Math.PI * 2) * 0.32 + 0.55;
  const wobble = ((index * 37) % 11) / 55;
  return Math.max(0.12, Math.min(0.96, day + wobble - 0.08));
});

function line(points, height) {
  return points.map((value, index) => `${(index / (points.length - 1)) * 100},${(height - value * height).toFixed(1)}`).join(" ");
}

const P50 = BARS.map((value, index) => 0.2 + value * 0.12 + ((index * 13) % 7) / 200);
const P90 = BARS.map((value, index) => 0.38 + value * 0.22 + ((index * 17) % 9) / 140);

function MonitoringChart() {
  return (
    <div className="relative h-[230px]">
      <div className="absolute inset-0 flex items-end gap-[3px]">
        {BARS.map((value, index) => (
          <span key={index} className="flex-1 rounded-t-[2px] bg-foreground/[0.14]" style={{ height: `${value * 100}%` }} />
        ))}
      </div>
      <svg viewBox="0 0 100 230" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <polyline points={line(P90, 230)} fill="none" stroke="var(--color-amber-500)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <polyline points={line(P50, 230)} fill="none" stroke="var(--color-emerald-500)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

// Section stage: one API's routes beside its Monitoring tab.
export function ApiMonitoringStage() {
  return (
    <Window title="Anime Explorer" icon={Network} meta="REST" className="h-[640px] w-[1000px]" actions={<StageSwitch />}>
      <div className={cn("flex gap-5 border-b px-5 text-[12px]", LINE)}>
        {TABS.map((tab) => (
          <span key={tab} className={cn("py-2.5", tab === "Monitoring" ? "border-b border-foreground font-medium text-foreground" : "text-muted-foreground")}>
            {tab}
          </span>
        ))}
      </div>
      <div className="flex flex-1">
        <div className={cn("flex w-[260px] shrink-0 flex-col border-r py-2", LINE)}>
          <div className="px-5 py-2 text-[11px] font-medium text-muted-foreground">Routes</div>
          {ROUTES.map(([method, path], index) => (
            <div key={path} className={cn("flex items-center gap-2.5 px-5 py-2", index === 1 && "bg-foreground/[0.045]")}>
              <span className={cn("w-10 font-mono text-[10px] font-semibold", method === "GET" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>{method}</span>
              <span className="truncate font-mono text-[12px] text-foreground/85">{path}</span>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5">
          <div className="grid grid-cols-4 gap-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-foreground/[0.08] px-3.5 py-3">
                <div className="text-[11px] text-muted-foreground">{metric.label}</div>
                <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] tabular-nums">{metric.value}</div>
                <div className="text-[11px] text-muted-foreground">{metric.note}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-foreground/[0.08] p-4">
            <div className="mb-4 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Requests and latency · last 24 hours</span>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-foreground/25" /> Requests
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3 rounded bg-emerald-500" /> p50
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3 rounded bg-amber-500" /> p90
              </span>
            </div>
            <MonitoringChart />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground tabular-nums">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

function StageSwitch() {
  return (
    <span className="flex items-center gap-1 rounded-lg border border-foreground/[0.08] p-0.5 text-[11px]">
      {["dev", "staging", "prod"].map((stage) => (
        <span key={stage} className={cn("rounded-md px-2 py-0.5 font-mono", stage === "prod" ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
          {stage}
        </span>
      ))}
    </span>
  );
}

const LAYERS = [
  { label: "Custom domain", note: "anime.geiger-notes.dev", icon: Globe },
  { label: "WAF", note: "Pods Common · SQLi", icon: ShieldCheck },
  { label: "Key and usage plan", note: "Builder · Pro", icon: KeyRound },
  { label: "Route", note: "GET /anime/{id}/similar", icon: Route },
];

const PLATE = { halfWidth: 112, halfHeight: 56, depth: 12, gap: 92 };

function Plate({ y, strong }) {
  const { halfWidth: w, halfHeight: h, depth: d } = PLATE;
  const top = `M160 ${y - h} L${160 + w} ${y} L160 ${y + h} L${160 - w} ${y}Z`;
  const left = `M${160 - w} ${y} L160 ${y + h} L160 ${y + h + d} L${160 - w} ${y + d}Z`;
  const right = `M160 ${y + h} L${160 + w} ${y} L${160 + w} ${y + d} L160 ${y + h + d}Z`;
  return (
    <g strokeLinejoin="round">
      <path d={left} style={{ fill: "color-mix(in oklab, var(--foreground) 9%, var(--background))" }} stroke="currentColor" strokeOpacity="0.35" />
      <path d={right} style={{ fill: "color-mix(in oklab, var(--foreground) 5%, var(--background))" }} stroke="currentColor" strokeOpacity="0.35" />
      <path d={top} style={{ fill: "var(--background)" }} stroke="currentColor" strokeOpacity={strong ? 0.7 : 0.45} />
      <path d={`M160 ${y - h + 10} L${160 + w - 20} ${y} L160 ${y + h - 10} L${160 - w + 20} ${y}Z`} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 3" />
    </g>
  );
}

// Callout centrepiece: a request falling through the gateway's layers, drawn as stacked isometric plates.
export function GatewayDiagram() {
  const first = 70;
  const ys = LAYERS.map((_, index) => first + index * PLATE.gap);
  return (
    <div className="relative mx-auto h-[420px] w-[320px] text-foreground">
      <svg viewBox="0 0 320 420" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <line x1="160" y1="0" x2="160" y2="420" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 5" />
        {[...ys].reverse().map((y, index) => (
          <Plate key={y} y={y} strong={index === LAYERS.length - 1} />
        ))}
      </svg>
      {LAYERS.map((layer, index) => {
        const Icon = layer.icon;
        return (
          <span key={layer.label} className="absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-foreground/75" style={{ left: 160, top: ys[index] }}>
            <Icon className="size-[18px]" strokeWidth={1.5} />
          </span>
        );
      })}
      {[0, 1.1, 2.2].map((delay) => (
        <span
          key={delay}
          className={cn("absolute top-0 left-0 size-2 rounded-full bg-emerald-500 opacity-0 shadow-[0_0_10px_var(--color-emerald-500)]", styles.travel)}
          style={{ offsetPath: "path('M160 0 V420')", "--travel-duration": "3.3s", "--travel-delay": `${delay}s` }}
        />
      ))}
    </div>
  );
}

const PLANS = [
  { name: "Starter", tier: "Free", rate: "2", burst: "5", quota: "500 / day" },
  { name: "Builder", tier: "Pro", rate: "10", burst: "20", quota: "50k / month", active: true },
  { name: "Studio", tier: "Partner", rate: "25", burst: "50", quota: "1M / month" },
];

export function UsagePlansRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("grid grid-cols-[1fr_64px_64px_96px] gap-3 border-b px-4 py-2.5 text-[11px] text-muted-foreground", LINE)}>
          <span>Usage plan</span>
          <span className="text-right">Rate (rps)</span>
          <span className="text-right">Burst</span>
          <span className="text-right">Quota</span>
        </div>
        {PLANS.map((plan) => (
          <div key={plan.name} className={cn("grid grid-cols-[1fr_64px_64px_96px] items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, plan.active && "bg-foreground/[0.04]")}>
            <span className="text-foreground/90">
              {plan.name} <span className="text-muted-foreground">· {plan.tier}</span>
            </span>
            <span className="text-right font-mono text-[12px] tabular-nums">{plan.rate}</span>
            <span className="text-right font-mono text-[12px] tabular-nums">{plan.burst}</span>
            <span className="text-right font-mono text-[12px] tabular-nums">{plan.quota}</span>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 flex items-center gap-3 rounded-xl border border-foreground/[0.1] bg-surface-card px-4 py-3 shadow-lg shadow-black/10 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <KeyRound className="size-4 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="text-foreground/90">Watchlist for iOS</div>
          <div className="font-mono text-[11px] text-muted-foreground">pk_live_••••••••3f9a · Builder · Pro</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2 py-1 text-[11px] text-muted-foreground">
          <RotateCw className="size-3" /> Rotate
        </span>
      </div>
    </div>
  );
}

const LANGUAGES = ["TypeScript", "JavaScript", "Python", "Go", "Java", "Kotlin", "Swift", "Ruby", "Android"];

export function PortalRender() {
  return (
    <Window title="Anime Explorer Developer Hub" icon={BookOpen} meta="Portal" className="mx-auto w-[460px]">
      <div className="flex">
        <div className={cn("flex w-[120px] shrink-0 flex-col gap-1 border-r p-2.5 text-[12px]", LINE)}>
          {["Products", "Pages", "SDKs", "API keys"].map((item) => (
            <span key={item} className={cn("rounded-md px-2 py-1", item === "SDKs" ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground")}>
              {item}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3.5">
          <div className="text-[12px] text-muted-foreground">Generated from the API&apos;s OpenAPI spec</div>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGES.map((language, index) => (
              <span
                key={language}
                className={cn("rounded-md border px-2 py-1.5 text-center text-[11px]", index === 0 ? "border-foreground/25 bg-foreground/[0.05] text-foreground" : "border-foreground/[0.08] text-muted-foreground")}
              >
                {language}
              </span>
            ))}
          </div>
          <div className="rounded-lg bg-foreground/[0.04] px-3 py-2.5 font-mono text-[11px] leading-5 text-foreground/80">
            <div>
              <span className="text-muted-foreground">const</span> similar = <span className="text-muted-foreground">await</span>
            </div>
            <div className="pl-3">client.anime.similar({"{"} id: 21 {"}"});</div>
          </div>
        </div>
      </div>
    </Window>
  );
}
