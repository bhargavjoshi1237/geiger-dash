"use client";

import { ArrowDown, ArrowUp, CalendarDays, Check, Copy, ExternalLink, Globe, Image as ImageIcon, Images, LayoutTemplate, Layers, MapPin, MoreHorizontal, Plus, Quote, Rows3, Save, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, DesignCover, EVENT, Field, Input, Select, StatStrip, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, Show } from "@/components/features-hub/motifs/motif_kit";

const BUILDER_TABS = [
  { label: "Add", icon: Plus },
  { label: "Outline", icon: Rows3 },
  { label: "Layers", icon: Layers },
  { label: "Layouts", icon: LayoutTemplate },
];

const PROOF_BLOCKS = [
  { label: "Speaker grid", icon: Users },
  { label: "Logo wall", icon: ImageIcon },
  { label: "Testimonials", icon: Quote },
  { label: "Gallery", icon: Images },
];

const LOGOS = ["Brightloop", "Fieldnote", "Orbital Freight", "Cobalt Retail"];

const SCHEDULE = [
  ["09:30", "Opening keynote", "Main Stage"],
  ["11:00", "Type in motion", "Studio 2"],
  ["14:00", "Portfolio clinic", "The Loft"],
];

// Where the Logo wall tile sits, and where it drops on the canvas.
const TILE = [12, 148];
const DROP = [214, 150];
const SAVE = [438, 15];

const PAGE_SCENE = [500, 800, 240, 800, 800, 800, 3400];

function PaletteTile({ block, className }) {
  const Icon = block.icon;
  return (
    <div className={cn("flex h-8 items-center gap-2 rounded-md border border-foreground/[0.09] bg-foreground/[0.025] px-2 text-[11.5px] text-foreground/85", className)}>
      <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="truncate">{block.label}</span>
    </div>
  );
}

// The page builder: a Logo wall is dragged from the palette onto the page, lands between the sections, then the page is saved.
function PageBuilder({ running }) {
  const step = useScene(PAGE_SCENE, running);
  const lifted = step === 2 || step === 3;
  const placed = step >= 4;
  const saving = step === 5;
  const saved = step === 6;
  const tile = step >= 3 ? DROP : TILE;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-3.5", LINE)}>
          <X className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] leading-4 font-medium">{EVENT.name}</span>
            <span className="block truncate text-[11px] leading-4 text-muted-foreground">{placed ? "4 sections · 11 blocks" : "3 sections · 9 blocks"}{placed && !saved ? " · unsaved" : ""}</span>
          </span>
          <Button variant="ghost" icon={ExternalLink} className="h-7 px-2.5 text-[11.5px]">
            Preview
          </Button>
          <Button icon={Save} className={cn("h-7 px-2.5 text-[11.5px] transition-[scale] duration-150", saving && "scale-95")}>
            Save
          </Button>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className={cn("w-[150px] shrink-0 border-r bg-foreground/[0.015]", LINE)}>
            <div className={cn("grid grid-cols-4 border-b", LINE)}>
              {BUILDER_TABS.map(({ label, icon: Icon }, index) => (
                <span key={label} title={label} className={cn("flex h-9 items-center justify-center border-b-2", index === 0 ? "border-foreground/70 text-foreground" : "border-transparent text-muted-foreground")}>
                  <Icon className="size-3.5" strokeWidth={1.75} />
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Add · Social proof</span>
              {PROOF_BLOCKS.map((block) => (
                <PaletteTile key={block.label} block={block} className={block.label === "Logo wall" && lifted ? "border-dashed opacity-40" : undefined} />
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 overflow-hidden bg-foreground/[0.02] p-3">
            <div className="overflow-hidden rounded-lg border border-foreground/[0.08] bg-background/60">
              <DesignCover className="h-[72px]" title={false} />
              <div className="px-3 pt-2 pb-2.5">
                <div className="text-[13px] leading-4 font-semibold tracking-[-0.01em]">{EVENT.short}</div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                  <MapPin className="size-3" /> {EVENT.venue} · Nov 19–21
                </div>
              </div>
              <div className={cn("mx-3 rounded-md border-2 border-dashed border-foreground/25 transition-[height,opacity,margin] duration-200", step === 3 ? "my-1 h-4 opacity-100" : "my-0 h-0 opacity-0")} />
              <Expand when={placed}>
                <div className={cn("border-t px-3 py-2.5", LINE, step === 4 && "bg-foreground/[0.05]")}>
                  <div className="text-[11px] font-medium">Backed by</div>
                  <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                    {LOGOS.map((logo) => (
                      <span key={logo} className="truncate text-[11px] font-semibold tracking-[-0.01em] text-foreground/55">
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
              </Expand>
              <div className={cn("border-t px-3 py-2", LINE)}>
                <div className="text-[11px] font-medium">Schedule</div>
                {SCHEDULE.map(([time, title, room]) => (
                  <div key={title} className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground tabular-nums">{time}</span>
                    <span className="min-w-0 flex-1 truncate text-foreground/90">{title}</span>
                    <span className="text-muted-foreground">{room}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>

      {/* The tile that follows the pointer while it's being dragged. */}
      <div
        className="absolute top-0 left-0 z-20 w-[126px]"
        style={{
          translate: `${tile[0]}px ${tile[1]}px`,
          opacity: lifted ? 1 : 0,
          rotate: lifted ? "-2deg" : "0deg",
          transition: "translate 0.7s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.2s ease-out, rotate 0.2s ease-out",
        }}
      >
        <PaletteTile block={PROOF_BLOCKS[1]} className="border-foreground/30 bg-surface-card shadow-xl shadow-black/30 dark:bg-surface-dialog" />
      </div>
      <Cursor at={step >= 5 ? SAVE : step >= 3 ? [DROP[0] + 92, DROP[1] + 18] : [TILE[0] + 92, TILE[1] + 18]} down={step === 2 || saving} hidden={step === 0 || saved} />

      <Show when={saved} className="absolute top-[56px] right-3 z-20">
        <span className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.12] bg-surface-card px-2.5 py-1.5 text-[11.5px] shadow-lg shadow-black/20 dark:bg-surface-dialog">
          <Check className="size-3 text-emerald-500" strokeWidth={3} /> Page saved
        </span>
      </Show>
    </div>
  );
}

const DOMAIN = "tickets.northside.example";
const DOMAIN_SCENE = [600, 1900, 600, 3600];
const DOMAIN_COLUMNS = "grid-cols-[minmax(0,1fr)_78px_90px_16px]";

// Custom Domains: a domain is added and its CNAME shown; the render stops on Pending because that's as far as setup goes today.
function CustomDomains({ running }) {
  const step = useScene(DOMAIN_SCENE, running);
  const dialog = step <= 2;
  const added = step === 3;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window title="Custom Domains" icon={Globe} className="h-[330px] w-[480px]" actions={<Button icon={Plus} className="h-7 px-2.5 text-[11.5px]">Add domain</Button>}>
        <div className="flex flex-col gap-3 p-3.5">
          <StatStrip
            stats={[
              { label: "Addresses", value: added ? "1" : "0" },
              { label: "Connected", value: "0" },
              { label: "Pending", value: added ? "1" : "0" },
            ]}
          />
          <div className="overflow-hidden rounded-lg border border-foreground/[0.08] text-[12px]">
            <div className={cn("grid items-center gap-3 border-b bg-foreground/[0.025] px-3 py-2 text-[11px] text-muted-foreground", DOMAIN_COLUMNS, LINE)}>
              <span>Domain</span>
              <span>Status</span>
              <span>SSL</span>
              <span />
            </div>
            <Expand when={added}>
              <div className={cn("border-b", LINE)}>
                <div className={cn("grid items-center gap-3 px-3 py-2.5", DOMAIN_COLUMNS)}>
                  <span className="truncate font-medium text-foreground/90">{DOMAIN}</span>
                  <Status status="Pending" />
                  <span className="text-muted-foreground">Provisioning</span>
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </div>
                <div className={cn("flex items-center gap-2 border-t bg-foreground/[0.02] px-3 py-2", LINE)}>
                  <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground">CNAME tickets → custom.events.geiger.events</span>
                  <Copy className="size-3 shrink-0 text-muted-foreground" />
                  <Button className="h-7 px-2.5 text-[11px]">Verify now</Button>
                </div>
              </div>
            </Expand>
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-muted-foreground">No subdomain yet</span>
              <Button variant="ghost" className="h-7 px-2.5 text-[11px]">
                Choose a subdomain
              </Button>
            </div>
          </div>
        </div>
      </Window>

      <div className={cn("absolute inset-0 z-10 rounded-xl bg-background/55 transition-opacity duration-300", dialog ? "opacity-100" : "pointer-events-none opacity-0")} />
      <div
        className={cn(
          "absolute top-[62px] left-1/2 z-20 w-[340px] -translate-x-1/2 rounded-xl border border-foreground/[0.12] bg-surface-card p-4 shadow-2xl shadow-black/30 transition-[opacity,scale] duration-300 dark:bg-surface-dialog",
          dialog ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="text-[14px] font-medium">Add a custom domain</div>
        <p className="mt-1 text-[11.5px] leading-[1.45] text-muted-foreground">Enter the domain your event pages should be served from.</p>
        <Field label="Domain name" className="mt-3">
          <Input className="h-9 border-foreground/25 text-[12.5px]">{step === 0 ? <span className="text-muted-foreground/70">events.example.com</span> : step === 1 ? <Typed text={DOMAIN} delay={0.15} duration={1.3} /> : DOMAIN}</Input>
        </Field>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button className={cn("transition-[scale] duration-150", step === 2 && "scale-95")}>Add domain</Button>
        </div>
      </div>
      <Cursor at={step >= 2 ? [372, 224] : [330, 170]} down={step === 2} hidden={step < 1 || step > 2} />
    </div>
  );
}

const WALL_TABS = ["General", "Design", "Footer", "Events", "Custom URL"];

const WALL_EVENTS = [
  { name: "Northside Design Week", short: "Design Week 2026", meta: "Nov 19–21 · Harbour Hall" },
  { name: "Print Fair Weekend", meta: "Dec 5–6 · The Loft" },
];

const NEW_WALL_EVENT = { name: "Type in Motion Live", meta: "Jan 24 · Studio 2" };

const WALL_SCENE = [500, 800, 700, 500, 3600];

function FeaturedRow({ event, index }) {
  return (
    <div className={cn("flex items-center gap-2 border-b px-2.5 py-2 last:border-b-0", LINE)}>
      <span className="w-3 shrink-0 text-center font-mono text-[10px] text-muted-foreground">{index + 1}</span>
      <span className="min-w-0 flex-1 truncate text-[11.5px] text-foreground/90">{event.short ?? event.name}</span>
      <ArrowUp className="size-3 shrink-0 text-muted-foreground" />
      <ArrowDown className="size-3 shrink-0 text-muted-foreground" />
    </div>
  );
}

function WallCard({ event }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-foreground/[0.08] p-1.5">
      <DesignCover className="h-9 w-12 shrink-0 rounded-[4px]" title={false} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] leading-4 font-medium text-foreground/90">{event.name}</div>
        <div className="truncate text-[10px] leading-4 text-muted-foreground">{event.meta}</div>
      </div>
    </div>
  );
}

// Event Wall: an event is featured from the Events tab and joins the public page at /w/northside beside it.
function EventWall({ running }) {
  const step = useScene(WALL_SCENE, running);
  const open = step === 2 || step === 3;
  const added = step === 4;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex shrink-0 items-start gap-2 border-b px-4 pt-3 pb-2.5", LINE)}>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] leading-5 font-medium tracking-[-0.01em]">Event Wall</div>
            <div className="mt-0.5 flex items-center gap-1 font-mono text-[10.5px] text-muted-foreground">
              <span className="truncate">geiger.events/w/northside</span>
              <Copy className="size-2.5 shrink-0" />
            </div>
          </div>
          <Button variant="ghost" icon={Copy} className="h-7 px-2.5 text-[11px]">
            Copy link
          </Button>
          <Button variant="ghost" icon={ExternalLink} className="h-7 px-2.5 text-[11px]">
            View live
          </Button>
        </div>
        <div className={cn("flex shrink-0 gap-4 border-b px-4 text-[11.5px]", LINE)}>
          {WALL_TABS.map((tab) => (
            <span key={tab} className={cn("border-b-2 py-2", tab === "Events" ? "border-foreground/70 font-medium text-foreground" : "border-transparent text-muted-foreground")}>
              {tab}
            </span>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[216px_minmax(0,1fr)]">
          <div className={cn("min-w-0 border-r p-3", LINE)}>
            <div className="text-[12px] font-medium">Featured events</div>
            <div className="mt-2 overflow-hidden rounded-md border border-foreground/[0.08]">
              {WALL_EVENTS.map((event, index) => (
                <FeaturedRow key={event.name} event={event} index={index} />
              ))}
              <Expand when={added}>
                <div className={cn("border-t", LINE)}>
                  <FeaturedRow event={NEW_WALL_EVENT} index={2} />
                </div>
              </Expand>
            </div>
            <Field label="Add a featured event" className="mt-2.5">
              <div className="relative">
                <Select className="h-7 text-[11px]">Select an event</Select>
                <div className={cn("absolute inset-x-0 bottom-full z-20 mb-1 rounded-lg border border-foreground/[0.12] bg-surface-card p-1 text-[11.5px] shadow-xl shadow-black/30 transition-[opacity,translate] duration-200 dark:bg-surface-dialog", open ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0")}>
                  <div className={cn("truncate rounded-md px-2 py-1.5 transition-colors duration-150", step === 3 && "bg-foreground/[0.08]")}>{NEW_WALL_EVENT.name}</div>
                </div>
              </div>
            </Field>
          </div>
          <div className="min-w-0 bg-foreground/[0.02] p-2.5">
            <div className="overflow-hidden rounded-lg border border-foreground/[0.08] bg-background/60">
              <div className={cn("flex items-center gap-1.5 border-b px-2 py-1.5", LINE)}>
                <Globe className="size-3 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono text-[9.5px] text-muted-foreground">/w/northside</span>
              </div>
              <div className="p-2">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3 text-muted-foreground" />
                  <span className="text-[11.5px] font-semibold tracking-[-0.01em]">Northside</span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {WALL_EVENTS.map((event) => (
                    <WallCard key={event.name} event={event} />
                  ))}
                  <Expand when={added}>
                    <WallCard event={NEW_WALL_EVENT} />
                  </Expand>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>

      <Cursor at={step >= 3 ? [120, 216] : [150, 250]} down={step === 3} hidden={step === 0 || step === 4} />
    </div>
  );
}

const VARIANTS = { page: PageBuilder, domain: CustomDomains, storefront: EventWall };

export function BuilderMotif({ variant, running }) {
  const View = VARIANTS[variant] || PageBuilder;
  return (
    <Fit>
      <View running={running} />
    </Fit>
  );
}
