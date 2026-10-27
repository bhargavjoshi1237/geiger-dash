import { CalendarClock, ChevronDown, FileText, Globe, Languages, LayoutTemplate, Send, Webhook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Bar, Dot, LINE, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Content renders: entries, the editor, the delivery API, webhooks and locales. Entries come from the content seed.

const STATUS_TONES = { Published: "emerald", "In review": "amber", Scheduled: "strong", Draft: "neutral" };

const ENTRIES = [
  { title: "Winter campaign landing", type: "Page", status: "Scheduled", updated: "4m" },
  { title: "Production migration checklist", type: "Doc", status: "In review", updated: "1h" },
  { title: "Pricing", type: "Page", status: "Draft", updated: "3h" },
  { title: "Getting started guide", type: "Guide", status: "Published", updated: "1d" },
  { title: "Homepage", type: "Page", status: "Published", updated: "2d" },
  { title: "Release notes: October", type: "Article", status: "Published", updated: "4d" },
];

function StatusLabel({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Dot tone={STATUS_TONES[status]} />
      {status}
    </span>
  );
}

function EntriesList({ className }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("flex h-12 items-center gap-2 border-b px-4", LINE)}>
        <span className="font-medium">Entries</span>
        <span className="text-muted-foreground">128</span>
        <span className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground">
          All types <ChevronDown className="size-3" />
        </span>
      </div>
      {ENTRIES.map((entry, index) => (
        <div key={entry.title} className={cn("flex items-center gap-3 border-b px-4 py-3", LINE, index === 0 && "bg-foreground/[0.045]")}>
          <FileText className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-foreground/90">{entry.title}</div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">{entry.type}</span>
              <StatusLabel status={entry.status} />
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">{entry.updated}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="rounded-lg border border-foreground/[0.09] px-3 py-2.5 text-foreground/90">{children}</div>
    </div>
  );
}

function EntryEditor({ className }) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <LayoutTemplate className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Page</span>
        <span className="text-muted-foreground">/</span>
        <span className="truncate font-medium">Winter campaign landing</span>
        <span className="ml-auto flex items-center gap-1.5">
          {[
            ["en", true],
            ["hi", false],
            ["fr", false],
          ].map(([locale, active]) => (
            <span key={locale} className={cn("rounded-md px-2 py-0.5 font-mono text-[11px]", active ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {locale}
            </span>
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <Field label="Title">Winter campaign landing</Field>
        <Field label="Slug">
          <span className="font-mono text-[12px]">winter-campaign-landing</span>
        </Field>
        <Field label="Hero heading">Warm up for the long nights</Field>
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Body</div>
          <div className="flex flex-col gap-2.5 rounded-lg border border-foreground/[0.09] px-3 py-3.5">
            <Bar className="w-11/12" />
            <Bar className="w-4/5" />
            <Bar className="w-10/12" />
            <Bar className="w-1/2" />
          </div>
        </div>
      </div>
      <div className={cn("flex items-center gap-3 border-t px-5 py-3.5", LINE)}>
        <CalendarClock className="size-4 text-muted-foreground" />
        <span className="text-foreground/85">Scheduled for 1 Dec, 09:00</span>
        <span className="ml-auto rounded-md border border-foreground/[0.1] px-2.5 py-1 text-[12px] text-muted-foreground">Unschedule</span>
        <span className="rounded-md bg-foreground px-2.5 py-1 text-[12px] font-medium text-background">Publish now</span>
      </div>
    </div>
  );
}

const JSON_LINES = [
  ["{", 0],
  ['"slug": "winter-campaign-landing",', 1],
  ['"type": "page",', 1],
  ['"locale": "en",', 1],
  ['"status": "published",', 1],
  ['"fields": {', 1],
  ['"title": "Winter campaign landing",', 2],
  ['"heroHeading": "Warm up for the long nights"', 2],
  ["}", 1],
  ["}", 0],
];

export function ApiPanel({ className }) {
  return (
    <Window className={cn("w-[400px] font-mono text-[12px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">GET</span>
        <span className="truncate text-foreground/85">/api/content/v1/entries/winter-campaign-landing</span>
      </div>
      <div className="px-4 py-3 leading-[1.7]">
        {JSON_LINES.map(([line, depth], index) => (
          <div key={index} style={{ paddingLeft: depth * 16 }} className={line.includes(":") ? "text-foreground/85" : "text-muted-foreground"}>
            {line}
          </div>
        ))}
      </div>
      <div className={cn("flex items-center gap-2 border-t px-4 py-2.5 font-sans text-[11px] text-muted-foreground", LINE)}>
        <Globe className="size-3.5" /> Edge Delivery · Cache TTL 300s
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Dot tone="emerald" /> 200
        </span>
      </div>
    </Window>
  );
}

// Section stage: the entry list and editor, with the same entry coming back from the delivery API.
export function ContentStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[820px]">
        <div className="flex h-full">
          <EntriesList className={cn("w-[300px] shrink-0 border-r", LINE)} />
          <EntryEditor className="flex-1" />
        </div>
      </Window>
      <div className={cn("absolute top-[250px] left-[600px] z-[2]", styles.float)}>
        <ApiPanel />
      </div>
    </div>
  );
}

const DELIVERIES = [
  { event: "entry.published", entry: "Getting started guide", status: "Delivered", code: "200", time: "2m" },
  { event: "entry.scheduled", entry: "Winter campaign landing", status: "Delivered", code: "200", time: "4m" },
  { event: "entry.unpublished", entry: "Autumn sale", status: "Failed", code: "503", time: "18m" },
  { event: "entry.published", entry: "Homepage", status: "Pending", code: "—", time: "now" },
];

const DELIVERY_TONES = { Delivered: "emerald", Failed: "red", Pending: "amber" };

export function WebhooksRender() {
  return (
    <div className="mx-auto w-[460px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Webhook className="size-4 text-muted-foreground" />
        <span className="truncate font-mono text-[12px] text-foreground/85">https://shop.halcyon.io/hooks/content</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">
          <Send className="size-3" /> Send test
        </span>
      </div>
      {DELIVERIES.map((delivery, index) => (
        <div
          key={`${delivery.event}-${index}`}
          className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, styles.popIn)}
          style={{ "--pop-delay": `${0.15 + index * 0.12}s` }}
        >
          <span className="w-[124px] shrink-0 font-mono text-[11px] text-foreground/80">{delivery.event}</span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">{delivery.entry}</span>
          <span className="inline-flex w-[84px] shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <Dot tone={DELIVERY_TONES[delivery.status]} />
            {delivery.status}
          </span>
          <span className="w-7 shrink-0 text-right font-mono text-[11px] text-muted-foreground">{delivery.code}</span>
        </div>
      ))}
    </div>
  );
}

const LOCALES = [
  { code: "en", name: "English", note: "Default", done: 100 },
  { code: "fr", name: "French", note: "Falls back to en", done: 86 },
  { code: "hi", name: "Hindi", note: "Falls back to en", done: 62 },
];

export function LocalesRender() {
  return (
    <div className="mx-auto w-[440px] text-[13px]">
      <div className="mb-3 flex items-center gap-2 px-1 text-[12px] text-muted-foreground">
        <Languages className="size-4" /> Localization
        <span className="ml-auto">Winter campaign landing</span>
      </div>
      <div className="flex flex-col gap-2">
        {LOCALES.map((locale, index) => (
          <div key={locale.code} className="rounded-xl border border-foreground/[0.08] bg-surface-card px-4 py-3 dark:bg-surface-subtle">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-foreground/[0.07] px-1.5 py-0.5 font-mono text-[11px]">{locale.code}</span>
              <span className="text-foreground/90">{locale.name}</span>
              <span className="ml-auto text-[12px] text-muted-foreground">{locale.note}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                <span
                  className={cn("absolute inset-y-0 left-0 origin-left rounded-full", locale.done === 100 ? "bg-emerald-500" : "bg-foreground/45", styles.fill)}
                  style={{ width: `${locale.done}%`, "--fill-delay": `${0.3 + index * 0.2}s` }}
                />
              </span>
              <span className="w-16 text-right text-[11px] text-muted-foreground tabular-nums">{locale.done}% fields</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 px-1 text-[12px] text-muted-foreground">
        <Avatar name="Danielle Reyes" size={18} /> Missing French and Hindi fields are served in English.
      </div>
    </div>
  );
}
