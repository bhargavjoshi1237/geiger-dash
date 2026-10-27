import {
  ArrowRight,
  Armchair,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  Globe,
  GripVertical,
  Heart,
  KeyRound,
  Layers,
  Lock,
  MapPin,
  Minus,
  MoreHorizontal,
  Package,
  Percent,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, Checkbox, DesignCover, EVENT, EditorNav, Field, Input, Radio, ScreenTitle, Segmented, Select, StatStrip, Status } from "@/components/product-pages/apps/events/events_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Events ticketing renders for Northside Design Week 2026: the tickets tab, checkout, discounts, seats, booths and orders.

const TICKET_GROUPS = [
  {
    name: "Passes",
    tickets: [
      { name: "Early bird pass", price: "$240", sold: 300, total: 300, meta: "Sold out" },
      { name: "Full pass", price: "$320", sold: 412, total: 600, meta: "Wave 2 of 2 · on sale since wave 1 sold out", codes: ["ALUMNI10", "BRIGHTLOOP"] },
      { name: "Student pass", price: "$90", sold: 64, total: 100, meta: "Hidden · unlocks with an access code", hidden: true },
    ],
  },
  {
    name: "Day passes",
    tickets: [
      { name: "Day pass — Thursday", price: "$140", sold: 188, total: 250, meta: "One pool · 62 left", codes: ["ALUMNI10"] },
      { name: "Day pass — Friday", price: "$140", sold: 200, total: 350, meta: "Wave 1 sold out · wave 2 opens Nov 1", codes: ["ALUMNI10"] },
    ],
  },
];

const TICKET_COLUMNS = "grid-cols-[minmax(0,1fr)_64px_190px_176px_16px]";

function CodeChip({ children }) {
  return <span className="inline-flex h-5 items-center rounded border border-foreground/[0.1] bg-foreground/[0.03] px-1.5 font-mono text-[10.5px] tracking-wide text-foreground/75">{children}</span>;
}

function SoldBar({ sold, total, delay = 0.4, className }) {
  const full = sold >= total;
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
        <span
          className={cn("absolute inset-y-0 left-0 origin-left rounded-full", full ? "bg-foreground/40" : "bg-emerald-500", styles.fill)}
          style={{ width: `${Math.round((sold / total) * 100)}%`, "--fill-delay": `${delay}s` }}
        />
      </span>
      <span className="w-[66px] text-right text-[11px] text-muted-foreground tabular-nums">
        {sold} / {total}
      </span>
    </span>
  );
}

function TicketRow({ ticket, delay }) {
  return (
    <div className={cn("grid h-[52px] items-center gap-4 border-b px-7", TICKET_COLUMNS, LINE)}>
      <span className="flex min-w-0 items-center gap-2.5">
        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50" />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 truncate text-foreground/90">
            {ticket.hidden ? <KeyRound className="size-3 text-muted-foreground" /> : null}
            {ticket.name}
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">{ticket.meta}</span>
        </span>
      </span>
      <span className="tabular-nums text-foreground/85">{ticket.price}</span>
      <SoldBar sold={ticket.sold} total={ticket.total} delay={delay} />
      <span className="flex gap-1">
        {ticket.codes?.length ? ticket.codes.map((code) => <CodeChip key={code}>{code}</CodeChip>) : <span className="text-[11px] text-muted-foreground/70">No codes</span>}
      </span>
      <MoreHorizontal className="size-4 text-muted-foreground" />
    </div>
  );
}

const NEW_TICKET_CODES = [
  { code: "ALUMNI10", note: "10% off", on: true },
  { code: "BRIGHTLOOP", note: "Affiliate · Brightloop", on: true },
  { code: "SPEAKER26", note: "$140 off · max 1", on: false },
];

// The hero's tilted plane: the event editor on its Tickets tab, with a new day pass being named.
export function BoxOfficeWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <CalendarDays className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">All Events</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">{EVENT.name}</span>
        <span className="ml-2 inline-flex items-center gap-1.5 text-[12px] text-foreground/85">
          <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
          On Sale
        </span>
        <span className="ml-auto flex items-center gap-2">
          <Chip className="h-6 text-[11px]">In-person</Chip>
          <Button variant="ghost" icon={ExternalLink}>
            View page
          </Button>
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <EditorNav
          open="Tickets"
          active="Tickets"
          items={["Tickets", "Seating", "Exhibitor Floor", "Express Lane", "Purchase Disclaimer", "Early-bird", "Donations", "Access Codes", "Group Orders", "Batched Releases"]}
          className="w-[220px] shrink-0"
        />
        <div className="relative min-w-0 flex-1">
          <div className="px-7 pt-6 pb-5">
            <ScreenTitle
              title="Tickets"
              description="The tickets buyers can purchase for this event, organised into tier groups. Pricing and rules live on each ticket."
              actions={
                <>
                  <Button variant="ghost" icon={Layers}>
                    Add group
                  </Button>
                  <Button icon={Plus}>Add ticket</Button>
                </>
              }
            />
            <StatStrip
              className="mt-5"
              stats={[
                { label: "Sold", value: "1,164" },
                { label: "Revenue", value: "$263,920" },
                { label: "Capacity", value: "1,600" },
                { label: "Sell-through", value: "73%" },
              ]}
            />
          </div>
          <div className={cn("grid h-8 items-center gap-4 border-y px-7 text-[11px] text-muted-foreground", TICKET_COLUMNS, LINE)}>
            <span className="pl-6">Ticket</span>
            <span>Price</span>
            <span>Sold</span>
            <span>Discount codes</span>
            <span />
          </div>
          {TICKET_GROUPS.map((group, groupIndex) => (
            <div key={group.name}>
              <div className={cn("flex h-8 items-center gap-2 border-b bg-foreground/[0.025] px-7 text-[12px]", LINE)}>
                <span className="font-medium text-foreground/90">{group.name}</span>
                <span className="text-muted-foreground">{group.tickets.length}</span>
              </div>
              {group.tickets.map((ticket, index) => (
                <TicketRow key={ticket.name} ticket={ticket} delay={0.4 + (groupIndex * 3 + index) * 0.12} />
              ))}
            </div>
          ))}
          <div className="absolute top-[188px] left-[540px] z-[2] w-[380px] rounded-xl border border-foreground/[0.12] bg-surface-card p-5 text-[13px] shadow-2xl shadow-black/30 dark:bg-surface-dialog">
            <div className="flex items-center gap-2">
              <Ticket className="size-4 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-[14px] font-medium">New ticket</span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Field label="Ticket name">
                <Input className="h-9 border-foreground/25 text-[13px]">
                  <Typed text="Day pass — Saturday" delay={1.6} />
                </Input>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price">
                  <Input className="tabular-nums">$140</Input>
                </Field>
                <Field label="Quantity">
                  <Input className="tabular-nums">350</Input>
                </Field>
              </div>
              <Field label="Group" hint="Which tier this ticket belongs to.">
                <Select>Day passes</Select>
              </Field>
              <Field label="Discount codes" hint="Only the codes you tick work on this ticket.">
                <div className="flex flex-col gap-2 rounded-md border border-foreground/[0.08] px-3 py-2.5">
                  {NEW_TICKET_CODES.map((item) => (
                    <span key={item.code} className="flex items-center gap-2.5 text-[12px]">
                      <Checkbox on={item.on} />
                      <span className="font-mono text-[11px] tracking-wide">{item.code}</span>
                      <span className="ml-auto text-muted-foreground">{item.note}</span>
                    </span>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Save ticket</Button>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const SCHEDULE = [
  { time: "09:30", room: "Main Stage", title: "Opening keynote" },
  { time: "11:00", room: "Studio 2", title: "Type in motion — workshop" },
  { time: "14:00", room: "The Loft", title: "Portfolio clinic" },
];

function PublicPageWindow({ className }) {
  return (
    <Window title={EVENT.name} icon={Globe} meta="Public page" className={cn("w-[560px]", className)}>
      <DesignCover className="h-[196px]" />
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> {EVENT.dates}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {EVENT.venue}
          </span>
        </div>
        <div className={cn("flex gap-5 border-b pb-3 text-[12px]", LINE)}>
          {["About", "Schedule", "Speakers", "Location & directions", "FAQ"].map((tab, index) => (
            <span key={tab} className={index === 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-col">
          {SCHEDULE.map((item) => (
            <div key={item.title} className={cn("flex items-center gap-4 border-b py-2.5 last:border-b-0", LINE)}>
              <span className="w-10 text-[12px] text-muted-foreground tabular-nums">{item.time}</span>
              <span className="flex-1 text-foreground/90">{item.title}</span>
              <span className="text-[12px] text-muted-foreground">{item.room}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-foreground/[0.08] px-4 py-3">
          <div>
            <div className="text-[12px] text-muted-foreground">Tickets from</div>
            <div className="text-[15px] font-semibold">$140</div>
          </div>
          <span className="rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background">Get tickets</span>
        </div>
      </div>
    </Window>
  );
}

const STEPS = ["Details", "Add-ons", "Review"];

const ORDER_LINES = [
  { label: "2 × Full pass", value: "$640.00" },
  { label: "Add-ons · 2 × Workshop add-on", value: "$130.00" },
  { label: "Discount (ALUMNI10)", value: "−$64.00", tone: "emerald" },
  { label: "Donation", value: "$10.00" },
];

function CheckoutReview({ className }) {
  return (
    <Window className={cn("w-[430px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-4", LINE)}>
        <Ticket className="size-4 text-muted-foreground" />
        <span className="font-medium">Checkout</span>
        <span className="ml-auto text-[12px] text-muted-foreground">{EVENT.short}</span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3 text-[12px]", LINE)}>
        {STEPS.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 ? <span className="h-px w-6 bg-foreground/15" /> : null}
            <span className={cn("flex size-5 items-center justify-center rounded-full text-[10px]", index < 2 ? "bg-foreground/80 text-background" : "border border-foreground/50 font-medium text-foreground")}>
              {index < 2 ? <Check className="size-3" strokeWidth={3} /> : index + 1}
            </span>
            <span className={index === 2 ? "font-medium text-foreground" : "text-muted-foreground"}>{step}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-col gap-2 text-[12px]">
          {ORDER_LINES.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{line.label}</span>
              <span className={cn("tabular-nums", line.tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/85")}>{line.value}</span>
            </div>
          ))}
          <div className={cn("mt-1 flex justify-between border-t pt-2.5 text-[14px] font-medium", LINE)}>
            <span>Total</span>
            <span className="tabular-nums">$716.00</span>
          </div>
        </div>
        <div className={cn("flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
          <span className="flex items-center gap-2 text-[12px]">
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono">ALUMNI10</span> applied
          </span>
          <span className="text-[11px] text-muted-foreground">Remove</span>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg border border-foreground/[0.08] px-3 py-2.5 text-[12px] leading-5 text-foreground/80">
          <Checkbox on className="mt-0.5" />I agree to the event terms and the Northside code of conduct.
        </div>
        <span className="flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground text-[13px] font-medium text-background">
          <Lock className="size-3.5" /> Pay $716.00 <ArrowRight className="size-3.5" />
        </span>
        <span className="text-center text-[11px] text-muted-foreground">You&apos;ll finish paying on Stripe Checkout</span>
      </div>
    </Window>
  );
}

// Section stage: the public event page behind, the checkout's review step in front with a code and a donation.
export function CheckoutStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <div className="absolute top-0 left-[10px] opacity-85">
        <PublicPageWindow />
      </div>
      <div className={cn("absolute top-[54px] left-[560px] z-[2]", styles.float)}>
        <CheckoutReview />
      </div>
    </div>
  );
}

// Cell: the Express Lane sheet, one click to open and one to pay.
export function ExpressLaneRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="mx-auto w-[400px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[13px] shadow-xl shadow-black/15 dark:bg-surface-dialog">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            <Zap className="size-3.5 text-foreground" /> Two clicks to your tickets
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background">1</span>
            <span className="h-px w-3 bg-foreground/25" />
            <span className="flex size-4 items-center justify-center rounded-full border border-foreground/40 text-foreground/70">2</span>
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            { name: "Full pass", price: "$320", on: true },
            { name: "Day pass — Thursday", price: "$140" },
          ].map((ticket) => (
            <div key={ticket.name} className={cn("flex h-10 items-center gap-3 rounded-lg border px-3", ticket.on ? "border-foreground/30 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
              <Radio on={ticket.on} />
              <span className="flex-1 text-foreground/90">{ticket.name}</span>
              <span className="tabular-nums text-muted-foreground">{ticket.price}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2">
          <span className="text-[12px] text-muted-foreground">1 ticket</span>
          <span className="text-[15px] font-semibold tabular-nums">$320.00</span>
        </div>
        <span className={cn("mt-3 flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground text-[13px] font-medium text-background", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
          <Lock className="size-3.5" /> Pay $320.00 <ArrowRight className="size-3.5" />
        </span>
        <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">Your email and card are taken on Stripe — nothing else to fill in here.</p>
        <p className={cn("mt-2.5 border-t pt-2.5 text-center text-[11px] text-muted-foreground underline decoration-foreground/20 underline-offset-4", LINE)}>
          Need add-ons, a promo code or a time slot? Use full checkout
        </p>
      </div>
    </div>
  );
}

const WAVES = [
  { name: "Wave 1", start: "On Sale now", sold: 200, total: 200, state: "Sold out" },
  { name: "Wave 2", start: "On a specific date · Nov 1", sold: 0, total: 150, state: "Opens Nov 1" },
];

// Cell: a day pass split into two waves, and what buyers see between them.
export function WavesRender() {
  return (
    <div className="mx-auto w-[460px] text-[13px]">
      <div className="rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <span className="font-medium">Day pass — Friday</span>
          <span className="text-muted-foreground">$140</span>
          <Chip className="ml-auto h-5 px-2 text-[11px]">2 waves</Chip>
        </div>
        {WAVES.map((wave, index) => (
          <div key={wave.name} className={cn("px-4 py-3", index === 0 && cn("border-b", LINE))}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
              <span className="text-foreground/90">{wave.name}</span>
              <span className="text-[12px] text-muted-foreground">· {wave.start}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Dot tone={index === 0 ? "strong" : "amber"} />
                {wave.state}
              </span>
            </div>
            <SoldBar sold={wave.sold} total={wave.total} delay={0.3 + index * 0.4} className="mt-2.5" />
          </div>
        ))}
        <div className={cn("border-t px-4 py-3", LINE)}>
          <div className="text-[11px] text-muted-foreground">Buyers see:</div>
          <div className={cn("mt-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-800 dark:text-amber-200", styles.popIn)} style={{ "--pop-delay": "1.1s" }}>
            This wave is sold out — the next wave opens Nov 1.
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["After wave 1 sells out", "On a specific date", "When I say so"].map((mode) => (
          <Chip key={mode} className={cn("h-6 text-[11px]", mode === "On a specific date" && "border-foreground/30 text-foreground")}>
            {mode}
          </Chip>
        ))}
      </div>
    </div>
  );
}

// Cell: a studio's order of six, with the group discount and a donation itemised.
export function GroupDonationRender() {
  return (
    <div className="mx-auto w-[430px] rounded-xl border border-foreground/[0.08] bg-surface-card p-4 text-[12px] dark:bg-surface-subtle">
      <div className="flex justify-between gap-4 text-[13px]">
        <span className="text-foreground/90">6 × Full pass</span>
        <span className="tabular-nums">$1,920.00</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Users className="size-3" /> Who are these 6 tickets for? Group discount: 15% off.
      </div>
      <div className={cn("mt-3 flex justify-between gap-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <span className="text-foreground/85">Group discount (15%)</span>
        <span className="text-emerald-600 tabular-nums dark:text-emerald-400">−$288.00</span>
      </div>
      <div className={cn("mt-4 border-t pt-3.5", LINE)}>
        <div className="flex items-center gap-1.5 text-[12px] font-medium">
          <Heart className="size-3.5 text-muted-foreground" /> Support the Northside bursary fund
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {["$5", "$10", "$25"].map((amount) => (
            <span key={amount} className={cn("flex h-8 w-14 items-center justify-center rounded-md border tabular-nums", amount === "$10" ? "border-foreground/40 bg-foreground/[0.07] font-medium" : "border-foreground/[0.1] text-muted-foreground")}>
              {amount}
            </span>
          ))}
          <span className="flex h-8 flex-1 items-center rounded-md border border-foreground/[0.1] px-2.5 text-muted-foreground/70">Other</span>
        </div>
      </div>
      <div className={cn("mt-4 flex flex-col gap-1.5 border-t pt-3", LINE)}>
        <div className="flex justify-between text-muted-foreground">
          <span>Donation</span>
          <span className="tabular-nums">$10.00</span>
        </div>
        <div className="flex justify-between text-[14px] font-medium">
          <span>Total</span>
          <span className="tabular-nums">$1,642.00</span>
        </div>
      </div>
    </div>
  );
}

function MiniCheckout({ name, badge, price, button, note, primary, className }) {
  return (
    <div className={cn("absolute w-[290px] rounded-xl border border-foreground/[0.1] bg-surface-card p-4 text-[12px] shadow-xl shadow-black/15 dark:bg-surface-dialog", className)}>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium">{name}</span>
        {badge}
        <span className="ml-auto tabular-nums text-muted-foreground">{price}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Input className="text-muted-foreground/70">Full name</Input>
        <Input className="text-muted-foreground/70">Email</Input>
      </div>
      <span className={cn("mt-3 flex h-9 items-center justify-center rounded-lg text-[12px] font-medium", primary ? "bg-foreground text-background" : "border border-foreground/25 text-foreground")}>{button}</span>
      <div className="mt-2 text-center text-[11px] text-muted-foreground">{note}</div>
    </div>
  );
}

// Cell: a free ticket that completes without a payment step, and one that asks for approval first.
export function FreeAndRequestRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <MiniCheckout name="Community evening" price="Free" button="Complete registration" note="No payment step for a free ticket" primary className="top-0 left-0" />
      <MiniCheckout
        name="Press pass"
        price="Free"
        badge={
          <span className="inline-flex h-5 items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-2 text-[10.5px] text-amber-800 dark:text-amber-200">Approval required</span>
        }
        button="Request to register"
        note="The organiser reviews each request"
        className={cn("top-[96px] left-[170px] z-[2]", styles.popIn)}
      />
    </div>
  );
}

const DISCOUNTS = [
  { name: "Alumni", kind: "Coupon", details: "ALUMNI10 · 10% off · 2 rules · until 2026-11-18", status: "Active", open: true },
  { name: "Studio teams", kind: "Group rule", details: "Auto | 15% at 6+", status: "Active" },
  { name: "Early bird", kind: "Early-bird rule", details: "15% off until 2026-10-31", status: "Active" },
  { name: "Brightloop partners", kind: "Affiliate code", details: "BRIGHTLOOP | Brightloop", status: "Active" },
  { name: "Speaker guests", kind: "Coupon", details: "SPEAKER26 · $140 off · max 1", status: "Active" },
  { name: "Summer preview", kind: "Coupon", details: "PREVIEW20 · 20% off · until 2026-07-31", status: "Inactive" },
];

const DISCOUNT_COLUMNS = "grid-cols-[130px_112px_minmax(0,1fr)_72px]";

function DiscountsWindow({ className }) {
  return (
    <Window className={cn("h-[600px] w-[640px]", className)}>
      <div className="px-6 pt-6 pb-4">
        <ScreenTitle title="Discounts & Codes" description="Reusable coupons and discount rules. Create them here, then attach to any event from its edit page." actions={<Button icon={Plus}>New discount</Button>} />
        <div className="mt-5 flex items-center gap-2">
          <Select className="w-[120px]">All Types</Select>
          <Select className="w-[120px]">All Statuses</Select>
          <Input className="ml-auto w-[170px] text-muted-foreground/70">
            <Search className="size-3.5" /> Search discounts…
          </Input>
        </div>
      </div>
      <div className={cn("grid h-8 items-center gap-3 border-y px-6 text-[11px] text-muted-foreground", DISCOUNT_COLUMNS, LINE)}>
        <span>Name</span>
        <span>Type</span>
        <span>Details</span>
        <span>Status</span>
      </div>
      {DISCOUNTS.map((discount) => (
        <div key={discount.name} className={cn("grid h-11 items-center gap-3 border-b px-6 text-[12.5px]", DISCOUNT_COLUMNS, LINE, discount.open && "bg-foreground/[0.04]")}>
          <span className="truncate font-medium text-foreground/90">{discount.name}</span>
          <span className="truncate text-muted-foreground">{discount.kind}</span>
          <span className="truncate text-[12px] text-foreground/75">{discount.details}</span>
          <Status status={discount.status} />
        </div>
      ))}
    </Window>
  );
}

const RULES = [
  { when: "3+ tickets", gives: "15% off" },
  { when: "Until 2026-11-01", gives: "12% off" },
];

function SectionLabel({ title, body }) {
  return (
    <div>
      <div className="text-[12px] font-medium">{title}</div>
      {body ? <div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{body}</div> : null}
    </div>
  );
}

function CouponEditor({ className }) {
  return (
    <Window className={cn("w-[390px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3.5", LINE)}>
        <Percent className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Alumni</span>
        <Chip className="h-5 px-2 text-[11px]">Coupon</Chip>
        <Status status="Active" className="ml-auto" />
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">
        <SectionLabel title="Coupon" body="A code buyers type at checkout." />
        <Field label="Code">
          <Input className="font-mono tracking-wide">ALUMNI10</Input>
        </Field>
        <Field label="Base discount" hint="What the code gives when no rule below matches.">
          <span className="flex items-center gap-2">
            <Segmented options={["Percent", "Flat"]} active="Percent" />
            <Input className="w-[84px] tabular-nums">
              10 <span className="ml-auto text-muted-foreground">%</span>
            </Input>
          </span>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Usage Limit">
            <Input className="tabular-nums">250</Input>
          </Field>
          <Field label="Valid until">
            <Input className="tabular-nums">2026-11-18</Input>
          </Field>
        </div>
        <div className={cn("border-t pt-4", LINE)}>
          <SectionLabel title="Discount Rules" body="Checked top-down — the first match wins." />
          <div className="mt-2.5 flex flex-col gap-1.5">
            {RULES.map((rule, index) => (
              <div key={rule.when} className={cn("flex h-9 items-center gap-2.5 rounded-lg border border-foreground/[0.1] px-2.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.5 + index * 0.15}s` }}>
                <GripVertical className="size-3.5 text-muted-foreground/60" />
                <span className="font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                <span className="text-foreground/90">{rule.when}</span>
                <span className="ml-auto font-medium tabular-nums">{rule.gives}</span>
              </div>
            ))}
            <span className="flex h-9 items-center gap-2 rounded-lg border border-dashed border-foreground/20 px-2.5 text-[12px] text-muted-foreground">
              <Plus className="size-3.5" /> Add rule
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}

// Section stage: the Discounts & Codes list behind, a coupon with its rules open in front.
export function DiscountsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <DiscountsWindow className="absolute top-0 left-0 opacity-90" />
      <div className={cn("absolute top-[60px] left-[600px] z-[2]", styles.float)}>
        <CouponEditor />
      </div>
    </div>
  );
}

const BUNDLE_ITEMS = [
  { ticket: "Full pass", qty: 4 },
  { ticket: "Day pass — Friday", qty: 2 },
];

// Cell: a bundle of passes sold at one fixed price.
export function BundleRender() {
  return (
    <div className="mx-auto w-[440px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Package className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Studio pack</span>
        <Chip className="h-5 px-2 text-[11px]">Bundle</Chip>
        <Status status="Active" className="ml-auto" />
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <span className="text-[11px] font-medium text-muted-foreground">Bundle items</span>
        {BUNDLE_ITEMS.map((item, index) => (
          <div key={item.ticket} className={cn("flex items-center gap-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <Select className="flex-1">{item.ticket}</Select>
            <Input className="w-14 justify-center tabular-nums">{item.qty}</Input>
          </div>
        ))}
      </div>
      <div className={cn("flex flex-col gap-2.5 border-t px-4 py-3", LINE)}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Pricing mode</span>
          <Segmented options={["Fixed price", "Sum of items"]} active="Fixed price" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground">Bundle price</div>
            <div className="text-[20px] font-semibold tracking-[-0.01em] tabular-nums">$1,380</div>
          </div>
          <div className="text-right text-[12px]">
            <div className="text-muted-foreground line-through decoration-foreground/30 tabular-nums">Sum of items $1,560</div>
            <div className="text-emerald-600 dark:text-emerald-400">Saves $180</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cell: the public page's ticket list, with a hidden student pass unlocked by its code.
export function AccessCodeRender() {
  return (
    <div className="mx-auto w-[420px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[13px] dark:bg-surface-subtle">
      <div className={cn("border-b px-4 py-3 font-medium", LINE)}>Tickets</div>
      {[
        { name: "Full pass", price: "$320" },
        { name: "Day pass — Thursday", price: "$140" },
      ].map((ticket) => (
        <div key={ticket.name} className={cn("flex items-center gap-3 border-b px-4 py-2.5", LINE)}>
          <span className="flex-1 text-foreground/90">{ticket.name}</span>
          <span className="text-[12px] text-muted-foreground tabular-nums">{ticket.price}</span>
          <span className="flex size-6 items-center justify-center rounded-md border border-foreground/[0.1] text-muted-foreground">
            <Minus className="size-3" />
          </span>
          <span className="w-2 text-center text-muted-foreground tabular-nums">0</span>
          <span className="flex size-6 items-center justify-center rounded-md border border-foreground/[0.1]">
            <Plus className="size-3" />
          </span>
        </div>
      ))}
      <div className="px-4 py-3">
        <div className="text-[12px] text-muted-foreground">Have an access code?</div>
        <div className="mt-2 flex gap-2">
          <Input className="h-9 flex-1 border-foreground/25 font-mono tracking-wide">
            <Typed text="STUDENT26" delay={1.2} />
          </Input>
          <Button variant="ghost" className="h-9">
            Apply
          </Button>
        </div>
      </div>
      <div className={cn("mx-3 mb-3 flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.07] px-3 py-2.5", styles.popIn)} style={{ "--pop-delay": "2.4s" }}>
        <KeyRound className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="flex-1">
          <span className="block text-foreground/90">Student pass</span>
          <span className="block text-[11px] text-emerald-700 dark:text-emerald-400">Unlocked with STUDENT26</span>
        </span>
        <span className="text-[12px] text-muted-foreground tabular-nums">$90</span>
      </div>
    </div>
  );
}

// The Main Stage in rows: side stalls, centre stalls and a balcony, curved gently towards the stage.
const SEAT = 12;
const PITCH = 16;
const BLOCKS = [
  { name: "side", x: 116, cols: 6, rows: 10, y: 66, opacity: 0.32 },
  { name: "centre", x: 236, cols: 12, rows: 10, y: 66, opacity: 0.58 },
  { name: "side", x: 452, cols: 6, rows: 10, y: 66, opacity: 0.32 },
  { name: "balcony", x: 140, cols: 24, rows: 3, y: 306, opacity: 0.2 },
];
const ROW_LABELS = "ABCDEFGHIJKLM";
const HELD = new Set(["centre-2-4", "centre-2-5", "side-6-3", "balcony-1-12", "balcony-1-13"]);

function seatState(block, row, col) {
  const key = `${block.name}-${row}-${col}`;
  if (block.name === "centre" && row === 5 && (col === 6 || col === 7)) return "picked";
  if (HELD.has(key)) return "held";
  if ((row * 7 + col * 3 + block.x) % 5 === 0 || (block.name !== "balcony" && row < 3 && col % 4 !== 1)) return "sold";
  return "open";
}

function SeatMap() {
  const centre = 330;
  const seats = [];
  for (const block of BLOCKS) {
    for (let row = 0; row < block.rows; row += 1) {
      for (let col = 0; col < block.cols; col += 1) {
        const x = block.x + col * PITCH;
        const bow = (x + SEAT / 2 - centre) ** 2 * 0.00028;
        const y = block.y + row * (PITCH + 3) + bow;
        seats.push({ key: `${block.name}-${block.x}-${row}-${col}`, x, y, state: seatState(block, row, col), opacity: block.opacity });
      }
    }
  }
  return (
    <svg viewBox="0 0 660 376" className="h-[376px] w-[660px] text-foreground" aria-hidden="true">
      <path d="M222 10h216a14 14 0 0 1 14 14v8c-60 14-184 14-244 0v-8a14 14 0 0 1 14-14Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.2" />
      <text x="330" y="29" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px] tracking-[0.2em]">
        STAGE
      </text>
      {Array.from({ length: 10 }, (_, row) => (
        <text key={row} x="92" y={66 + row * (PITCH + 3) + 9 + 13} className="fill-muted-foreground font-mono text-[9px]">
          {ROW_LABELS[row]}
        </text>
      ))}
      <text x="330" y="294" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px] tracking-[0.2em]">
        BALCONY
      </text>
      {seats.map((seat) => {
        if (seat.state === "picked") {
          return (
            <g key={seat.key}>
              <rect x={seat.x - 2.5} y={seat.y - 2.5} width={SEAT + 5} height={SEAT + 5} rx="4.5" fill="none" stroke="var(--color-emerald-500)" strokeWidth="1.5" />
              <rect x={seat.x} y={seat.y} width={SEAT} height={SEAT} rx="3" fill="var(--color-emerald-500)" />
            </g>
          );
        }
        if (seat.state === "held") return <rect key={seat.key} x={seat.x} y={seat.y} width={SEAT} height={SEAT} rx="3" fill="var(--color-amber-500)" fillOpacity="0.55" />;
        if (seat.state === "sold") return <rect key={seat.key} x={seat.x + 0.5} y={seat.y + 0.5} width={SEAT - 1} height={SEAT - 1} rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.16" />;
        return <rect key={seat.key} x={seat.x} y={seat.y} width={SEAT} height={SEAT} rx="3" fill="currentColor" fillOpacity={seat.opacity} />;
      })}
    </svg>
  );
}

const BANDS = [
  { label: "Centre stalls", price: "$320", opacity: 0.58 },
  { label: "Side stalls", price: "$240", opacity: 0.32 },
  { label: "Balcony", price: "$140", opacity: 0.2 },
];

function SeatPickerWindow({ className }) {
  return (
    <Window title="Opening keynote · Main Stage" icon={Armchair} meta="Choose your seats" className={cn("w-[700px]", className)}>
      <div className="flex justify-center px-5 pt-3">
        <SeatMap />
      </div>
      <div className="flex items-center gap-4 px-6 pb-3 text-[11px] text-muted-foreground">
        {BANDS.map((band) => (
          <span key={band.label} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-foreground" style={{ opacity: band.opacity }} />
            <span className="tabular-nums">{band.price}</span> {band.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-amber-500/60" /> Held
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] border border-foreground/25" /> Sold
        </span>
      </div>
      <div className={cn("relative mx-5 mb-5 overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card shadow-lg shadow-black/15 dark:bg-foreground/[0.04]", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <div className="flex items-center gap-6 px-4 py-3">
          {[
            ["Section", "Centre stalls"],
            ["Row", "F"],
            ["Seats", "7, 8"],
            ["Total", "$640"],
          ].map(([label, value]) => (
            <div key={label}>
              <MonoLabel className="text-[10px]">{label}</MonoLabel>
              <div className="mt-0.5 font-medium tabular-nums">{value}</div>
            </div>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[12px] text-amber-700 tabular-nums dark:text-amber-300">
            <Clock className="size-3.5" /> Held 08:42
          </span>
          <Button>Reserve seats</Button>
        </div>
        <span className="absolute inset-x-0 bottom-0 h-0.5">
          <span className="block h-full w-[87%] bg-foreground/50" />
        </span>
      </div>
    </Window>
  );
}

function SeatEditorPanel({ className }) {
  return (
    <Window className={cn("w-[320px]", className)}>
      <div className={cn("border-b px-5 py-3.5", LINE)}>
        <div className="flex items-center gap-2">
          <Armchair className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Main Stage</span>
          <span className="text-[12px] text-muted-foreground">Seat map</span>
        </div>
        <div className="mt-2.5 flex gap-4 text-[11px] text-muted-foreground">
          <span>
            <span className="font-medium text-foreground tabular-nums">312</span> seats
          </span>
          <span>
            <span className="font-medium text-foreground tabular-nums">4</span> sections
          </span>
          <span>
            <span className="font-medium text-foreground tabular-nums">8</span> accessible
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <Field label="Name">
          <Input>Centre stalls</Input>
        </Field>
        <Field label="Type" hint="A GA zone sells by capacity and has no chairs.">
          <Segmented options={["Seated", "GA zone"]} active="Seated" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rows">
            <Input className="tabular-nums">10</Input>
          </Field>
          <Field label="Seats per row">
            <Input className="tabular-nums">12</Input>
          </Field>
          <Field label="Row labels">
            <Input>A, B, C…</Input>
          </Field>
          <Field label="Curve">
            <Input className="tabular-nums">
              8 <span className="ml-auto text-muted-foreground">°</span>
            </Input>
          </Field>
        </div>
        <Field label="Aisles after seat" hint="Comma-separated, e.g. 4, 8">
          <Input className="tabular-nums">6</Input>
        </Field>
      </div>
    </Window>
  );
}

// Section stage: guests pick their seats and hold them while they pay, with the seat-map editor alongside.
export function SeatsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <SeatPickerWindow className="absolute top-0 left-0" />
      <div className={cn("absolute top-[90px] left-[680px] z-[2]", styles.float)}>
        <SeatEditorPanel />
      </div>
    </div>
  );
}

// Booths on the expo floor: a perimeter row, two back-to-back rows and an island, with B4 picked.
const BOOTHS = [
  ...["A1", "A2", "A3", "A4", "A5", "A6"].map((code, index) => ({ code, x: 14 + index * 40, y: 14, w: 36, h: 28, corner: index === 0 || index === 5 })),
  ...["B1", "B2", "B3", "B4"].map((code, index) => ({ code, x: 14 + index * 40, y: 96, w: 36, h: 28, corner: index === 3 })),
  ...["C1", "C2", "C3", "C4"].map((code, index) => ({ code, x: 14 + index * 40, y: 126, w: 36, h: 28, corner: index === 3 })),
  { code: "D1", x: 186, y: 96, w: 62, h: 58, island: true },
  ...["E1", "E2", "E3", "E4", "E5"].map((code, index) => ({ code, x: 14 + index * 40, y: 196, w: 36, h: 28 })),
];
const BOOTH_STATE = { A1: "sold", A3: "sold", A4: "sold", B2: "sold", C1: "sold", C3: "held", D1: "sold", E2: "sold", E5: "held", B4: "picked" };

function HallMap() {
  return (
    <svg viewBox="0 0 262 250" className="h-[250px] w-[262px] text-foreground" aria-hidden="true">
      <rect x="2" y="2" width="258" height="236" rx="8" fill="currentColor" fillOpacity="0.025" stroke="currentColor" strokeOpacity="0.22" />
      <path d="M96 238h70" stroke="var(--background)" strokeWidth="3" />
      <text x="131" y="247" textAnchor="middle" className="fill-muted-foreground font-mono text-[7px] tracking-[0.18em]">
        ENTRANCE
      </text>
      {BOOTHS.map((booth) => {
        const state = BOOTH_STATE[booth.code] ?? "open";
        const fill = state === "picked" ? "var(--color-emerald-500)" : state === "held" ? "var(--color-amber-500)" : "currentColor";
        const fillOpacity = state === "picked" ? 0.9 : state === "held" ? 0.35 : state === "sold" ? 0.2 : 0.04;
        return (
          <g key={booth.code}>
            <rect
              x={booth.x}
              y={booth.y}
              width={booth.w}
              height={booth.h}
              rx="3"
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={state === "picked" ? "var(--color-emerald-500)" : "currentColor"}
              strokeOpacity={state === "open" ? 0.32 : 0.15}
            />
            <text
              x={booth.x + booth.w / 2}
              y={booth.y + booth.h / 2 + 3}
              textAnchor="middle"
              className={cn("font-mono text-[8px]", state === "picked" ? "fill-background" : "fill-muted-foreground")}
            >
              {booth.code}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Cell: the expo floor's hall map, with a corner stand picked.
export function HallMapRender() {
  return (
    <div className="mx-auto flex w-[460px] items-start gap-4 text-[12px]">
      <HallMap />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-1.5 font-medium">
          <Store className="size-3.5 text-muted-foreground" /> Choose your stand
        </div>
        {[
          { size: "Standard", price: "$1,200" },
          { size: "Corner", price: "$1,800" },
          { size: "Island", price: "$3,600" },
        ].map((size) => (
          <div key={size.size} className="flex items-center justify-between text-muted-foreground">
            <span>{size.size}</span>
            <span className="tabular-nums">{size.price}</span>
          </div>
        ))}
        <div className={cn("mt-1 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] font-medium">B4</span>
            <span className="tabular-nums">$1,800</span>
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Corner · Hall 1</div>
        </div>
        <Button className="w-full">Continue</Button>
      </div>
    </div>
  );
}

const ORDERS = [
  { ref: "ORD-7F3A2C", items: "2 × Full pass, 2 add-ons", status: "Paid", total: "$716" },
  { ref: "ORD-5A0E9B", items: "Studio pack", status: "Disputed", total: "$1,380", dispute: true },
  { ref: "ORD-2C8D11", items: "2 × Day pass — Friday", status: "Partially refunded", total: "$280" },
  { ref: "ORD-C4127F", items: "Student pass", status: "Refunded", total: "$90" },
  { ref: "ORD-08D3E6", items: "Day pass — Thursday", status: "Cancelled", total: "$140" },
];

const ORDER_COLUMNS = "grid-cols-[88px_minmax(0,1fr)_120px_56px]";

// Cell: every order on one list, with a dispute waiting on its evidence.
export function OrdersRender() {
  return (
    <div className="mx-auto w-[460px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <ShoppingBag className="size-3.5 text-muted-foreground" />
        <span className="font-medium">All Orders</span>
        <span className="ml-auto text-[11px] text-muted-foreground">{EVENT.short}</span>
      </div>
      <div className={cn("grid h-8 items-center gap-3 border-b px-4 text-[11px] text-muted-foreground", ORDER_COLUMNS, LINE)}>
        <span>Order</span>
        <span>Items</span>
        <span>Status</span>
        <span className="text-right">Total</span>
      </div>
      {ORDERS.map((order) => (
        <div key={order.ref} className={cn("border-b last:border-b-0", LINE, order.dispute && "bg-foreground/[0.03]")}>
          <div className={cn("grid h-9 items-center gap-3 px-4", ORDER_COLUMNS)}>
            <span className="font-mono text-[11px] text-foreground/80">{order.ref}</span>
            <span className="truncate text-foreground/85">{order.items}</span>
            <Status status={order.status} />
            <span className="text-right tabular-nums">{order.total}</span>
          </div>
          {order.dispute ? (
            <div className={cn("mx-4 mb-2.5 flex items-center gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 text-[11px]", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
              <span className="font-medium text-foreground/90">Dispute</span>
              <Status status="Needs response" className="text-[11px]" />
              <span className="ml-auto text-muted-foreground">
                Evidence due <span className="text-foreground/85 tabular-nums">Nov 3, 2026</span>
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
