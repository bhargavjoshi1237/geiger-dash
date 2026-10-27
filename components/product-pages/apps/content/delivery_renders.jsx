import { ArrowLeftRight, ChevronDown, GitCompareArrows, KeyRound, Lock, Network, Plus, Search, Sparkles, SlidersHorizontal, Split } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  CodeBlock,
  CodeLine,
  ContentSidebar,
  GhostButton,
  Input,
  Method,
  OriginArt,
  PourOverArt,
  PrimaryButton,
  ScreenHead,
  Select,
  StatsRow,
} from "@/components/product-pages/apps/content/content_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Content delivery renders: Atlas Coffee's REST API, schema and tokens, personalisation slots and decisions, metrics and semantic search.

const ENDPOINTS = [
  { verb: "GET", title: "List published entries", path: "/api/content/v1/entries" },
  { verb: "GET", title: "Get entry by slug", path: "/api/content/v1/entries/[slug]" },
  { verb: "POST", title: "Collect event (beacon)", path: "/api/content/v1/collect" },
  { verb: "GET", title: "List entries (v2)", path: "/api/content/v2/projects/[projectId]/[apiPlural]", active: true },
  { verb: "GET", title: "Get entry by id or slug (v2)", path: "/api/content/v2/projects/[projectId]/[apiPlural]/[idOrSlug]" },
  { verb: "GET", title: "Content-type schema (v2)", path: "/api/content/v2/projects/[projectId]/_schema" },
];

function LiveDot({ label = "Live" }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
      <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
      {label}
    </span>
  );
}

function Pane({ label, aside, children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2", LINE)}>
        <MonoLabel className="text-[10px]">{label}</MonoLabel>
        {aside ? <span className="ml-auto">{aside}</span> : null}
      </div>
      {children}
    </div>
  );
}

// The hero's tilted plane: the REST API screen, a v2 query for natural-process origins being written beside its response.
export function RestWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex h-full">
        <ContentSidebar open="Developers" active="REST API" />
        <div className="min-w-0 flex-1">
          <ScreenHead title="REST API" description="Versioned delivery endpoints, their contracts, and copy-paste examples." />
          <div className="flex gap-4 px-6 py-4">
            <div className="flex w-[330px] shrink-0 flex-col gap-4">
              <StatsRow
                stats={[
                  { label: "Endpoints", value: "6", footer: "v1 + v2" },
                  { label: "Cache TTL", value: "60s", footer: "Revalidates" },
                ]}
              />
              <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
                {ENDPOINTS.map((endpoint) => (
                  <div key={endpoint.path} className={cn("border-b px-3.5 py-2.5 last:border-b-0", LINE, endpoint.active && "bg-foreground/[0.05]")}>
                    <div className="flex items-center gap-2">
                      <Method verb={endpoint.verb} />
                      <span className="truncate text-foreground/90">{endpoint.title}</span>
                      <span className="ml-auto">
                        <LiveDot />
                      </span>
                    </div>
                    <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{endpoint.path}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div>
                <div className="text-[15px] font-medium">List entries (v2)</div>
                <div className="text-[12px] text-muted-foreground">Filters, sort, fields, populate, pagination and locale, scoped to one content type.</div>
              </div>
              <Pane label="Example request" aside={<span className="font-mono text-[11px] text-muted-foreground">curl</span>}>
                <div className="px-4 py-3 font-mono text-[12px] leading-[1.75]">
                  <div className="whitespace-pre">
                    <span className="text-emerald-700 dark:text-emerald-400">GET</span>
                    <span className="text-foreground/85"> /api/content/v2/projects/7c1e…/origins</span>
                  </div>
                  <div className="pl-4 text-muted-foreground">?filters[process][$eq]=Natural</div>
                  <div className="pl-4 text-muted-foreground">&amp;populate=roastery</div>
                  <div className="pl-4 text-foreground/85">
                    <Typed text="&sort=altitude:desc" delay={1.4} />
                  </div>
                  <div className="pl-4 text-muted-foreground">&amp;pagination[pageSize]=2</div>
                  <div className="text-muted-foreground">Authorization: Bearer ••••••••••</div>
                </div>
              </Pane>
              <Pane label="Example response" aside={<LiveDot label="200 · 84 ms" />}>
                <CodeBlock
                  className="px-4 py-3"
                  lines={[
                    ["{", 0],
                    ['"data": [', 1],
                    ["{", 2],
                    ['"slug": "ethiopia-guji-natural",', 3],
                    ['"name": "Ethiopia Guji — Natural",', 3],
                    ['"altitude": 2100,', 3],
                    ['"process": "Natural",', 3],
                    ['"roastery": { "name": "Harbour Roastery" }', 3, "focus"],
                    ["},", 2],
                    ['{ "slug": "rwanda-nyamasheke-natural", … }', 2],
                    ["],", 1],
                    ['"meta": {', 1],
                    ['"pagination": { "page": 1, "pageSize": 2, "total": 5 }', 2],
                    ["}", 1],
                    ["}", 0],
                  ]}
                />
              </Pane>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

function HttpWindow({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Method verb="GET" />
        <span className="truncate font-mono text-[12px] text-foreground/85">/api/content/v2/projects/7c1e…/origins/ethiopia-guji-natural?populate=roastery</span>
      </div>
      <div className={cn("flex items-center gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <LiveDot label="200 OK" />
        <span>62 ms</span>
        <span className="font-mono">Cache-Control: s-maxage=60, stale-while-revalidate</span>
      </div>
      <CodeBlock
        className="px-5 py-4"
        lines={[
          ["{", 0],
          ['"data": {', 1],
          ['"id": "3f2b0c7e-…-91ac",', 2],
          ['"slug": "ethiopia-guji-natural",', 2],
          ['"locale": "en",', 2],
          ['"type": "origin",', 2],
          ['"publishedAt": "2026-10-26T09:42:00Z",', 2],
          ['"name": "Ethiopia Guji — Natural",', 2],
          ['"region": "Guji, Oromia",', 2],
          ['"altitude": 2100,', 2],
          ['"process": "Natural",', 2],
          ['"tasting_notes": "Blueberry, jasmine, cocoa nib",', 2],
          ['"cover": { "url": "…/guji-drying-beds.jpg", "width": 1600 },', 2],
          ['"roastery": {', 2, "focus"],
          ['"slug": "harbour-roastery",', 3, "focus"],
          ['"name": "Harbour Roastery"', 3, "focus"],
          ["}", 2, "focus"],
          ["},", 1],
          ['"meta": {}', 1],
          ["}", 0],
        ]}
      />
    </Window>
  );
}

function ShopPage({ className }) {
  return (
    <Window className={className}>
      <div className={cn("flex h-11 shrink-0 items-center gap-2 border-b px-4", LINE)}>
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="mx-auto flex h-6 items-center gap-1.5 rounded-md bg-foreground/[0.05] px-3 text-[11px] text-muted-foreground">
          <Lock className="size-3" /> atlascoffee.example/coffee/ethiopia-guji-natural
        </span>
      </div>
      <OriginArt className="block h-[170px] w-full" />
      <div className="px-5 py-4">
        <MonoLabel className="text-[10px]">Single origin · Ethiopia</MonoLabel>
        <div className="mt-1 text-[22px] leading-tight font-semibold tracking-[-0.02em]">Ethiopia Guji — Natural</div>
        <div className="mt-1.5 text-[12px] text-muted-foreground">Guji, Oromia · 2,100 m · Natural process</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Blueberry", "Jasmine", "Cocoa nib"].map((note) => (
            <Chip key={note} className="h-6 text-[11px]">
              {note}
            </Chip>
          ))}
        </div>
        <div className={cn("mt-4 flex items-center gap-2 border-t pt-3 text-[12px] text-muted-foreground", LINE)}>
          Roasted at <span className="text-foreground/85">Harbour Roastery</span>
          <span className="ml-auto rounded-full bg-foreground px-3.5 py-1.5 text-[12px] font-medium text-background">Brew guide</span>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the v2 response for one origin with its roastery populated, and the shop page built from it.
export function QueryStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <HttpWindow className="absolute top-0 left-0 w-[600px]" />
      <ShopPage className={cn("absolute top-[70px] left-[560px] z-[2] w-[420px]", styles.float)} />
    </div>
  );
}

// Cell: the _schema endpoint describing the Origin type and its fields.
export function SchemaRender() {
  return (
    <div className={cn("mx-auto h-[300px] w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle", styles.fadeBottom)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Method verb="GET" />
        <span className="truncate font-mono text-[12px] text-foreground/85">/api/content/v2/projects/7c1e…/_schema</span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <KeyRound className="size-3" /> Bearer token · <span className="font-mono text-foreground/80">schema:read</span>
      </div>
      <CodeBlock
        className="px-4 py-3 text-[11px]"
        lines={[
          ['"types": [', 0],
          ["{", 1],
          ['"name": "Origin",', 2],
          ['"apiId": "origin",', 2],
          ['"apiPlural": "origins",', 2],
          ['"fields": [', 2],
          ['{ "key": "altitude", "type": "number", "required": true },', 3],
          ['{ "key": "process", "type": "enum", "options": [ … ] },', 3],
          ['{ "key": "roastery", "type": "reference" },', 3],
          ['{ "key": "cover", "type": "media" }', 3],
        ]}
      />
    </div>
  );
}

const TOKENS = [
  { name: "Website — read only", scopes: "delivery:read", state: "Active", used: "Today" },
  { name: "Mobile app", scopes: "delivery:read schema:read", state: "Active", used: "Today" },
  { name: "Agency preview", scopes: "delivery:read", state: "Expired", used: "Sep 30" },
  { name: "Old kiosk build", scopes: "delivery:read", state: "Revoked", used: "Aug 12" },
];

const TOKEN_TONES = { Active: "emerald", Expired: "amber", Revoked: "neutral" };

// Cell: API Tokens, scoped bearer tokens with their state.
export function TokensRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <KeyRound className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">API Tokens</span>
        <PrimaryButton icon={Plus} className="ml-auto h-7 px-2.5">
          Mint token
        </PrimaryButton>
      </div>
      {TOKENS.map((token, index) => (
        <div key={token.name} className={cn("grid grid-cols-[minmax(0,1fr)_76px_64px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
          <div className="min-w-0">
            <div className={cn("truncate", token.state === "Active" ? "text-foreground/90" : "text-muted-foreground")}>{token.name}</div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">{token.scopes}</div>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Dot tone={TOKEN_TONES[token.state]} /> {token.state}
          </span>
          <span className="text-right text-[11px] text-muted-foreground">{token.used}</span>
        </div>
      ))}
    </div>
  );
}

const PARAMS = [
  ["filters[altitude][$gte]=1800", "Grown at 1,800 m or higher"],
  ["filters[process][$in][0]=Natural", "Any of a list of values"],
  ["filters[name][$containsi]=kenya", "Contains, ignoring case"],
  ["sort=publishedAt:desc", "Newest first"],
  ["populate=roastery", "Include the linked entry"],
  ["fields[0]=name", "Only the fields you ask for"],
  ["pagination[page]=2", "Page through the results"],
];

// Cell: the v2 query parameters, each with what it does.
export function FiltersRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 text-[13px]", LINE)}>
        <SlidersHorizontal className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">/origins</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Query parameters</span>
      </div>
      {PARAMS.map(([param, meaning], index) => (
        <div key={param} className={cn("flex items-center gap-3 border-b px-4 py-[9px] last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
          <span className="truncate font-mono text-[12px] text-foreground/85">{param}</span>
          <span className="ml-auto shrink-0 text-[12px] text-muted-foreground">{meaning}</span>
        </div>
      ))}
    </div>
  );
}

function ErrorCard({ path, status, name, message, className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card dark:bg-surface-subtle", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Method verb="GET" />
        <span className="truncate font-mono text-[11px] text-foreground/80">{path}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
          <Dot tone="red" /> {status}
        </span>
      </div>
      <div className="px-4 py-2.5 font-mono text-[11px] leading-[1.7]">
        <CodeLine text={`"name": "${name}",`} />
        <CodeLine text={`"message": "${message}"`} />
      </div>
    </div>
  );
}

// Cell: the API turning away a draft and a token without the scope it needs.
export function ScopeRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <ErrorCard className="absolute top-0 left-0 w-[420px]" path="…/origins/kenya-nyeri-washed" status="404" name="NotFoundError" message="Entry not found." />
      <div className="absolute top-[100px] left-0 flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <Dot tone="strong" /> Kenya Nyeri — Washed is Scheduled, not Published
      </div>
      <ErrorCard
        className={cn("absolute top-[140px] left-[40px] w-[420px] shadow-xl shadow-black/20", styles.popIn)}
        path="…/_schema"
        status="403"
        name="ForbiddenError"
        message="This token is missing the schema:read scope."
      />
      <div className="absolute top-[240px] left-[44px] flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <KeyRound className="size-3" /> Website — read only · <span className="font-mono">delivery:read</span>
      </div>
    </div>
  );
}

const VARIANTS = [
  { entry: "Autumn menu launch", rule: 'segment equals "subscriber"', priority: 20, active: true },
  { entry: "Store screens — morning menu", rule: 'device equals "kiosk"', priority: 10 },
  { entry: "Ethiopia Guji — Natural", rule: "Default · no rules", priority: 0 },
];

function TargetingWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="Targeting Rules" description="All clauses must match (AND) for the variant to win." />
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="overflow-hidden rounded-xl border border-foreground/[0.08]">
          <div className={cn("grid grid-cols-[minmax(0,1fr)_200px_56px] gap-3 border-b bg-foreground/[0.02] px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
            <span>Homepage hero · variant</span>
            <span>Clauses</span>
            <span className="text-right">Priority</span>
          </div>
          {VARIANTS.map((variant) => (
            <div key={variant.entry} className={cn("grid grid-cols-[minmax(0,1fr)_200px_56px] items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE, variant.active && "bg-foreground/[0.05]")}>
              <span className="flex min-w-0 items-center gap-2">
                <Split className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground/90">{variant.entry}</span>
              </span>
              <span className="truncate font-mono text-[11px] text-muted-foreground">{variant.rule}</span>
              <span className="text-right font-mono text-[12px] text-foreground/80">{variant.priority}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-foreground/[0.08] p-4">
          <div className="flex items-center">
            <div>
              <div className="font-medium">Rule editor</div>
              <div className="text-[12px] text-muted-foreground">Editing rules for Homepage hero · Autumn menu launch</div>
            </div>
            <PrimaryButton className="ml-auto h-7">Save rules</PrimaryButton>
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)_auto] items-end gap-2">
            <Input label="Key" mono>
              segment
            </Input>
            <Select label="Operator">equals</Select>
            <Input label="Value" mono>
              subscriber
            </Input>
            <GhostButton icon={Plus} className="h-9">
              Clause
            </GhostButton>
          </div>
        </div>
      </div>
    </Window>
  );
}

function DecidePanel({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Method verb="POST" />
        <span className="font-mono text-[12px] text-foreground/85">/api/decide</span>
        <span className="ml-auto">
          <LiveDot label="200" />
        </span>
      </div>
      <CodeBlock
        className={cn("border-b px-4 py-3 text-[11px]", LINE)}
        lines={[
          ['"projectId": "7c1e…",', 0],
          ['"slotKey": "homepage_hero",', 0],
          ['"profile": {', 0],
          ['"anonymousId": "anon_5f2c…",', 1],
          ['"segment": "subscriber"', 1],
          ["},", 0],
          ['"context": { "device": "web" }', 0],
        ]}
      />
      <div className={cn("px-4 py-3", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
        <MonoLabel className="text-[10px]">Decision</MonoLabel>
        <div className="mt-1.5 font-medium">Autumn menu launch</div>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
          Selected entry a91c… because it matched segment equals &ldquo;subscriber&rdquo; and had the highest priority (20).
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Dot tone="emerald" /> Personalization consent granted · decision trace recorded
        </div>
      </div>
    </div>
  );
}

// Section stage: the homepage hero's variants and rules behind, a live decide call with its reason in front.
export function SlotStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <TargetingWindow className="absolute top-0 left-0 w-[600px] opacity-90" />
      <DecidePanel className={cn("absolute top-[56px] left-[592px] z-[2] w-[400px]", styles.float)} />
    </div>
  );
}

function VisitorDecision({ visitor, consent, granted, entry, note, className, delay }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3.5 text-[13px] dark:bg-surface-subtle", styles.popIn, className)} style={{ "--pop-delay": delay }}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{visitor}</span>
        <span
          className={cn(
            "ml-auto inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-[11px]",
            granted ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
          )}
        >
          {consent}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Split className="size-3.5 text-muted-foreground" />
        <span className="font-medium">{entry}</span>
      </div>
      <div className="mt-1 text-[12px] text-muted-foreground">{note}</div>
    </div>
  );
}

// Cell: two visitors on the same slot, one who granted personalisation and one who declined it.
export function ConsentRender() {
  return (
    <div className="mx-auto flex w-[460px] flex-col gap-3">
      <div className="flex items-center gap-2 px-1 text-[12px] text-muted-foreground">
        <span className="font-mono text-foreground/80">homepage_hero</span> · two visitors, both subscribers
      </div>
      <VisitorDecision visitor="anon_5f2c…" consent="Personalization granted" granted entry="Autumn menu launch" note='Matched segment equals "subscriber" · trace recorded' delay="0.3s" />
      <VisitorDecision visitor="anon_88d1…" consent="Personalization denied" entry="Ethiopia Guji — Natural" note="Targeted variants skipped · default served · nothing recorded" delay="0.6s" />
    </div>
  );
}

const DAYS = [
  [38, 6],
  [44, 7],
  [41, 5],
  [52, 9],
  [61, 12],
  [58, 10],
  [47, 8],
  [50, 9],
  [63, 13],
  [72, 15],
  [68, 12],
  [80, 17],
  [76, 16],
  [88, 19],
];

const TOP_ENTRIES = [
  ["Autumn menu launch", "4,812", "196"],
  ["Brewing a better pour-over", "3,240", "88"],
  ["Ethiopia Guji — Natural", "1,905", "61"],
];

// Cell: daily views and conversions collected from the site, with the top entries.
export function MetricsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-3 border-b px-4 py-2.5", LINE)}>
        <span className="font-medium">Traffic trend</span>
        <span className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-foreground/30" /> Views
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-emerald-500" /> Conversions
          </span>
        </span>
      </div>
      <div className="flex h-[96px] items-end gap-[7px] px-4 pt-3 pb-2">
        {DAYS.map(([views, conversions], index) => (
          <div key={index} className={cn("relative flex-1", styles.popIn)} style={{ height: `${views}%`, "--pop-delay": `${0.1 + index * 0.04}s` }}>
            <span className="absolute inset-0 rounded-t-[3px] bg-foreground/[0.16]" />
            <span className="absolute inset-x-0 bottom-0 rounded-t-[3px] bg-emerald-500/80" style={{ height: `${(conversions / views) * 100 * 1.6}%` }} />
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1fr)_56px_44px] gap-3 border-y px-4 py-1.5 text-[11px] text-muted-foreground", LINE)}>
        <span>Entry</span>
        <span className="text-right">Views</span>
        <span className="text-right">Conv.</span>
      </div>
      {TOP_ENTRIES.map(([entry, views, conversions]) => (
        <div key={entry} className={cn("grid grid-cols-[minmax(0,1fr)_56px_44px] gap-3 border-b px-4 py-2 last:border-b-0", LINE)}>
          <span className="truncate text-foreground/90">{entry}</span>
          <span className="text-right text-[12px] text-muted-foreground tabular-nums">{views}</span>
          <span className="text-right text-[12px] text-emerald-700 tabular-nums dark:text-emerald-400">{conversions}</span>
        </div>
      ))}
    </div>
  );
}

const RESULTS = [
  { kind: "Content", title: "Ethiopia Guji — Natural", score: "0.794", excerpt: "Heavy, fruit-led and sweet, dried whole on raised beds in Guji." },
  { kind: "Content", title: "Colombia Huila — Honey", score: "0.701", excerpt: "Red apple and panela, with a long caramel finish." },
];

function ResultCard({ result }) {
  return (
    <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-foreground/[0.02]">
      <div className="px-3.5 py-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">{result.kind}</div>
            <div className="mt-0.5 truncate font-medium">{result.title}</div>
          </div>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">{result.score}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.45] text-muted-foreground">{result.excerpt}</p>
      </div>
    </div>
  );
}

function ImageResult({ title, score, art }) {
  return (
    <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-foreground/[0.02]">
      {art}
      <div className="flex items-start gap-3 px-3.5 py-2.5">
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground">Image</div>
          <div className="mt-0.5 truncate font-medium">{title}</div>
        </div>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">{score}</span>
      </div>
    </div>
  );
}

function SemanticWindow({ className }) {
  return (
    <Window className={className}>
      <ScreenHead title="Semantic Search" description="Find images and published content by meaning, using the same embedding space." />
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-end gap-2">
          <Input label="Search" className="flex-1">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <Typed text="fruity coffee for a filter brew" delay={1.3} />
          </Input>
          <Select label="Sources" className="w-[130px]">
            All sources
          </Select>
          <PrimaryButton className="h-9">Search</PrimaryButton>
        </div>
        <div>
          <div className="font-medium">Results</div>
          <div className="text-[12px] text-muted-foreground">Scores indicate semantic similarity with editorial adjustments; they are not engagement predictions.</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ImageResult title="Guji drying beds" score="0.812" art={<OriginArt className="block h-[92px] w-full" />} />
          <ResultCard result={RESULTS[0]} />
          <ResultCard result={RESULTS[1]} />
          <ImageResult title="Pour-over at the bar" score="0.688" art={<PourOverArt className="block h-[92px] w-full" />} />
        </div>
      </div>
    </Window>
  );
}

function GraphNode({ label, kind, strong, className }) {
  return (
    <span
      className={cn(
        "absolute inline-flex h-7 items-center gap-1.5 rounded-full border bg-surface-card px-2.5 text-[11px] whitespace-nowrap dark:bg-surface-dialog",
        strong ? "border-foreground/35 font-medium text-foreground" : "border-foreground/[0.12] text-foreground/85",
        className,
      )}
    >
      <Dot tone={kind === "taxonomy" ? "amber" : strong ? "strong" : "neutral"} />
      {label}
    </span>
  );
}

function EdgeLabel({ children, className }) {
  return <span className={cn("absolute rounded bg-surface-card px-1 font-mono text-[10px] text-muted-foreground dark:bg-surface-dialog", className)}>{children}</span>;
}

function GraphPanel({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-foreground/[0.12] bg-surface-card text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Network className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Knowledge Graph</span>
        <span className="ml-auto text-[12px] text-muted-foreground">5 entities · 4 relations</span>
      </div>
      <div className="relative h-[230px] text-foreground">
        <svg viewBox="0 0 380 230" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
          <path d="M190 115 L95 38" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
          <path d="M190 115 L300 38" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
          <path d="M190 115 L95 192" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
          <path d="M190 115 L292 192" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.25" className={styles.flow} />
        </svg>
        <GraphNode label="Ethiopia Guji — Natural" strong className="top-[101px] left-[104px]" />
        <GraphNode label="Harbour Roastery" className="top-[24px] left-[24px]" />
        <GraphNode label="Fruit-forward" kind="taxonomy" className="top-[24px] left-[250px]" />
        <GraphNode label="Brewing a better pour-over" className="top-[178px] left-[12px]" />
        <GraphNode label="Colombia Huila — Honey" className="top-[178px] left-[206px]" />
        <EdgeLabel className="top-[68px] left-[118px]">reference</EdgeLabel>
        <EdgeLabel className="top-[68px] left-[226px]">tagged</EdgeLabel>
        <EdgeLabel className="top-[146px] left-[112px]">reference</EdgeLabel>
        <EdgeLabel className="top-[146px] left-[205px]">similar 81%</EdgeLabel>
      </div>
    </div>
  );
}

// Section stage: a search by meaning across entries and images, with the knowledge graph around the top result.
export function SearchStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <SemanticWindow className="absolute top-0 left-0 w-[620px]" />
      <GraphPanel className={cn("absolute top-[170px] left-[596px] z-[2] w-[390px]", styles.float)} />
    </div>
  );
}

const TAGS = [
  { content: "Colombia Huila — Honey", term: "Fruit-forward", taxonomy: "Flavour", score: "82%" },
  { content: "Kenya Nyeri — Washed", term: "Bright acidity", taxonomy: "Flavour", score: "79%" },
  { content: "Cold brew concentrate", term: "Iced drinks", taxonomy: "Menu", score: "74%" },
  { content: "Decaf, done properly", term: "Brew guides", taxonomy: "Topic", score: "68%" },
];

// Cell: AI tag suggestions drawn from similar, already-tagged neighbours.
export function TagsRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <Sparkles className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">AI Tag Suggestions</span>
        <Chip className="ml-auto h-6 text-[11px]">
          Similarity ≥ 65% <ChevronDown className="size-3 text-muted-foreground" />
        </Chip>
      </div>
      <div className={cn("flex items-center gap-4 border-b px-4 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>
          Suggestions <span className="text-foreground tabular-nums">4</span>
        </span>
        <span>
          Sources scanned <span className="text-foreground tabular-nums">38</span>
        </span>
        <span className="ml-auto">
          Provider requests <span className="text-foreground tabular-nums">0</span>
        </span>
      </div>
      {TAGS.map((row, index) => (
        <div key={row.content} className={cn("grid grid-cols-[minmax(0,1fr)_auto_40px] items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
          <span className="truncate text-foreground/90">{row.content}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="rounded-md border border-foreground/[0.14] bg-foreground/[0.05] px-1.5 py-0.5 text-[11px] text-foreground/85">{row.term}</span>
            {row.taxonomy}
          </span>
          <span className="text-right text-[12px] text-muted-foreground tabular-nums">{row.score}</span>
        </div>
      ))}
    </div>
  );
}

const PAIRS = [
  { from: "Autumn menu launch", to: "Autumn menu 2026 — copy", score: "97%", tone: "red" },
  { from: "Cold brew concentrate", to: "Cold brew at home", score: "92%", tone: "amber" },
  { from: "Flat white at home", to: "Flat white, the café way", score: "90%", tone: "amber" },
];

const PAIR_TONES = {
  red: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

// Cell: Duplicate Detection, near-identical published entries paired up for review.
export function DuplicatesRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <GitCompareArrows className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Duplicate Detection</span>
        <Chip className="ml-auto h-6 text-[11px]">
          At least 90% similar <ChevronDown className="size-3 text-muted-foreground" />
        </Chip>
      </div>
      {PAIRS.map((pair, index) => (
        <div key={pair.from} className={cn("grid grid-cols-[minmax(0,1fr)_14px_minmax(0,1fr)_44px] items-center gap-2.5 border-b px-4 py-3", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}>
          <span className="truncate text-foreground/90">{pair.from}</span>
          <ArrowLeftRight className="size-3.5 text-muted-foreground" />
          <span className="truncate text-foreground/90">{pair.to}</span>
          <span className={cn("inline-flex h-5 items-center justify-center rounded-md border text-[11px] tabular-nums", PAIR_TONES[pair.tone])}>{pair.score}</span>
        </div>
      ))}
      <div className="px-4 py-3 text-[12px] leading-5 text-muted-foreground">Similarity is evidence for editorial review; confirm intent before merging content.</div>
    </div>
  );
}
