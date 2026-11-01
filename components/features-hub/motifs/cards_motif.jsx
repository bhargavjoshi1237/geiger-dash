"use client";

import { Award, Check, Copy, MoreHorizontal, Plus, QrCode, Ticket, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, Chip, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, Field, Input, Select, StatStrip, Status, Toggle } from "@/components/product-pages/apps/events/events_kit";
import { useScene, useTicker } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit, QrGlyph, Show } from "@/components/features-hub/motifs/motif_kit";
import pageStyles from "@/components/product-pages/product_pages.module.css";

const TICKETS = [
  { name: "Full pass", price: "$320", sold: 412, total: 600 },
  { name: "Day pass — Thursday", price: "$140", sold: 188, total: 250 },
];

const ORDERS = [
  { id: "#4820", items: "1 × Day pass — Thursday", total: "$140.00" },
  { id: "#4819", items: "3 × Full pass", total: "$960.00" },
];

const ORDER_COLUMNS = "grid-cols-[50px_minmax(0,1fr)_56px_64px]";
const TICKET_SCENE = [1400, 1300, 1100, 3200];

function OrderRow({ order, fresh }) {
  return (
    <div className={cn("grid h-[34px] items-center gap-2 border-b px-4 text-[12px]", ORDER_COLUMNS, LINE, fresh && "bg-foreground/[0.045]")}>
      <span className="font-mono text-[11px] text-muted-foreground">{order.id}</span>
      <span className="truncate text-foreground/90">{order.items}</span>
      <Status status="Paid" />
      <span className="text-right tabular-nums">{order.total}</span>
    </div>
  );
}

// A buyer checks out: the order lands in All Orders, then the ticket's sold bar and the totals catch up.
function TicketTypes({ running }) {
  const step = useScene(TICKET_SCENE, running);
  const landed = step >= 1;
  const counted = step >= 2;

  return (
    <Window title="Ticket Types" icon={Ticket} meta={EVENT.short} className="h-[330px] w-[480px]" actions={<Chip className="h-6 text-[11px]">On Sale</Chip>}>
      <StatStrip
        className="rounded-none border-0 border-b"
        stats={[
          { label: "Sold", value: counted ? "1,166" : "1,164" },
          { label: "Gross revenue", value: counted ? "$264,560" : "$263,920" },
        ]}
      />
      {TICKETS.map((ticket, index) => {
        const sold = ticket.sold + (index === 0 && counted ? 2 : 0);
        return (
          <div key={ticket.name} className={cn("flex h-[38px] items-center gap-3 border-b px-4 text-[12px]", LINE)}>
            <span className="w-[136px] truncate text-foreground/90">{ticket.name}</span>
            <span className="w-9 text-muted-foreground tabular-nums">{ticket.price}</span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-[width] duration-700 ease-out" style={{ width: `${(sold / ticket.total) * 100}%` }} />
            </span>
            <span className="w-[54px] text-right text-[11px] text-muted-foreground tabular-nums">
              {sold} / {ticket.total}
            </span>
          </div>
        );
      })}
      <div className={cn("grid h-6 items-center gap-2 border-b bg-foreground/[0.025] px-4 text-[11px] text-muted-foreground", ORDER_COLUMNS, LINE)}>
        <span>Order</span>
        <span>Items</span>
        <span>Status</span>
        <span className="text-right">Total</span>
      </div>
      <Expand when={landed}>
        <OrderRow order={{ id: "#4821", items: "2 × Full pass", total: "$640.00" }} fresh />
      </Expand>
      {ORDERS.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </Window>
  );
}

const QR_SCENE = [800, 800, 700, 800, 700, 3400];

function SettingToggle({ label, on }) {
  return (
    <div className="flex h-8 items-center justify-between gap-3 text-[12px]">
      <span className="text-foreground/90">{label}</span>
      <Toggle on={on} />
    </div>
  );
}

// QR Tickets: the logo and rotating codes are switched on, and the ticket preview follows.
function QrTickets({ seed, running }) {
  const step = useScene(QR_SCENE, running);
  const logo = step >= 2;
  const rotating = step >= 4;
  const tick = useTicker(1800, running && rotating);
  const cursorAt = step <= 2 ? [274, 166] : [274, 234];

  return (
    <>
      <Window title="QR Tickets" icon={QrCode} meta={EVENT.short} className="h-[330px] w-[480px]">
        <div className="flex min-h-0 flex-1">
          <div className={cn("flex w-[308px] flex-col border-r px-4 pt-3", LINE)}>
            <MonoLabel>Appearance</MonoLabel>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <Field label="Code size">
                <Select>Medium</Select>
              </Field>
              <Field label="Error correction">
                <Select>High</Select>
              </Field>
            </div>
            <div className="mt-2">
              <SettingToggle label="Show logo in center" on={logo} />
            </div>
            <MonoLabel className="mt-3">Encoding</MonoLabel>
            <div className="mt-2">
              <SettingToggle label="Rotating (dynamic) codes" on={rotating} />
            </div>
            <Field label="Encoded value" className="mt-2">
              <Select>Ticket code</Select>
            </Field>
          </div>
          <div className="min-w-0 flex-1 px-3.5 pt-3">
            <MonoLabel>Preview</MonoLabel>
            <div className="mt-2 rounded-xl border border-foreground/[0.1] bg-background/50 p-2.5 text-center">
              <div className="truncate text-[11px] font-medium">{EVENT.short}</div>
              <div className="truncate text-[10px] text-muted-foreground">Full pass</div>
              <div className="relative mx-auto mt-2 size-[112px] rounded-lg bg-white p-1.5 text-black">
                <QrGlyph key={tick} seed={rotating ? `${seed}-${tick}` : seed} className={cn("block size-full", rotating && pageStyles.popIn)} />
                <Show when={logo} className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-md bg-white p-0.5">
                    <AppMark id="events" size={24} className="bg-black text-white" />
                  </span>
                </Show>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-muted-foreground">
                <span className={cn("size-1.5 rounded-full", rotating ? cn("bg-emerald-500 text-emerald-500", pageStyles.pulse) : "bg-foreground/35")} />
                {rotating ? "Rotating code" : "Static code"}
              </div>
            </div>
          </div>
        </div>
      </Window>
      <Cursor at={cursorAt} down={step === 2 || step === 4} hidden={step === 0 || step === 5} />
    </>
  );
}

const MEMBERS = [
  { name: "Aisha Bennett", joined: "2 days ago" },
  { name: "Tomas Marek", joined: "Oct 28" },
  { name: "Grace Donnelly", joined: "Oct 21" },
];

const BENEFITS = ["10% off member tickets", "Member-only registration"];
const MEMBER_SCENE = [1500, 1300, 3600];

function MemberRow({ member, fresh }) {
  return (
    <div className={cn("flex h-11 items-center gap-2.5 border-b px-3.5", LINE, fresh && "bg-foreground/[0.045]")}>
      <Avatar name={member.name} size={22} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium text-foreground/90">{member.name}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{member.joined}</span>
      </span>
      <Status status="Active" />
    </div>
  );
}

// A one-time plan on the left; someone joins through it and lands on the roster as Active.
function MembershipPlans({ running }) {
  const step = useScene(MEMBER_SCENE, running);
  const joined = step >= 1;

  return (
    <Window title="Membership Plans" icon={Users} meta={EVENT.short} className="h-[330px] w-[480px]" actions={<Button icon={Plus} className="h-7">Add plan</Button>}>
      <div className="flex min-h-0 flex-1">
        <div className={cn("w-[208px] shrink-0 border-r px-4 py-3.5", LINE)}>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-medium">Northside Circle</span>
            <Status status="Active" />
          </div>
          <MonoLabel className="mt-4 block">Pricing</MonoLabel>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-[24px] font-medium tracking-[-0.02em] tabular-nums">$120</span>
            <span className="text-[12px] text-muted-foreground">one-time</span>
          </div>
          <MonoLabel className="mt-4 block">Benefits</MonoLabel>
          <ul className="mt-2 flex flex-col gap-2 text-[12px] text-foreground/85">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-1.5 leading-4">
                <Check className="mt-px size-3.5 shrink-0 text-muted-foreground" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-3.5 flex items-center justify-between text-[12px]">
            <span className="text-foreground/90">Public join</span>
            <Toggle on />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className={cn("flex h-10 items-center justify-between border-b px-3.5 text-[12px]", LINE)}>
            <span className="font-medium">Members</span>
            <span className="text-muted-foreground tabular-nums">{joined ? 249 : 248}</span>
          </div>
          <Expand when={joined}>
            <MemberRow member={{ name: "Kofi Asante", joined: "Joined just now" }} fresh />
          </Expand>
          {MEMBERS.map((member) => (
            <MemberRow key={member.name} member={member} />
          ))}
        </div>
      </div>
    </Window>
  );
}

const BODY = "Design Council";
const CERTIFICATE_SCENE = [700, 800, 900, 1300, 800, 3200];

// A CEU template being finished: credit hours and the accrediting body fill the preview, then it goes from Draft to Active.
function CertificateEditor({ running }) {
  const step = useScene(CERTIFICATE_SCENE, running);
  const hours = step >= 2 ? "4.0" : "2.0";
  const typing = step === 3;
  const hasBody = step >= 3;
  const active = step === 5;
  const cursorAt = step <= 2 ? [130, 112] : step === 3 ? [130, 170] : [130, 228];

  return (
    <>
      <Window title="CEU & Certificates" icon={Award} meta="Templates" className="h-[330px] w-[480px]" actions={<Button className="h-7">Save</Button>}>
        <div className="flex min-h-0 flex-1">
          <div className={cn("flex w-[204px] shrink-0 flex-col gap-2.5 border-r px-4 py-3", LINE)}>
            <Field label="Credit hours">
              <Input className="tabular-nums">{hours}</Input>
            </Field>
            <Field label="Accrediting body">
              <Input className={cn(typing && "border-foreground/30")}>
                {typing ? <Typed text={BODY} delay={0.1} duration={0.9} /> : hasBody ? BODY : <span className="text-muted-foreground/70">None yet</span>}
              </Input>
            </Field>
            <Field label="Status">
              <Select>
                <Status status={active ? "Active" : "Draft"} />
              </Select>
            </Field>
          </div>
          <div className="min-w-0 flex-1 p-3.5">
            <div className="flex items-center justify-between">
              <MonoLabel>Preview</MonoLabel>
              <Status status={active ? "Active" : "Draft"} />
            </div>
            <div className="relative mt-2 flex h-[186px] flex-col items-center rounded-lg border border-foreground/[0.14] bg-background/50 px-3 py-4 text-center outline outline-offset-[-6px] outline-foreground/[0.08]">
              <div className="font-mono text-[8.5px] tracking-[0.2em] text-muted-foreground uppercase">Certificate of attendance</div>
              <div className="mt-2.5 text-[14px] leading-[1.2] font-medium tracking-[-0.01em]">{EVENT.name}</div>
              <div className="mt-2.5 text-[11px] text-muted-foreground">Presented to</div>
              <div className="text-[12px] font-medium">Attendee name</div>
              <div className="mt-auto flex w-full items-end justify-between gap-2 text-left">
                <span className="min-w-0">
                  <span className="block text-[9.5px] text-muted-foreground">Accrediting body</span>
                  <span className="block truncate text-[11px]">{hasBody ? BODY : "—"}</span>
                </span>
                <span className="shrink-0 rounded-md border border-foreground/[0.14] bg-foreground/[0.05] px-1.5 py-1 text-[11px] font-medium tabular-nums">{hours} CEU</span>
              </div>
            </div>
          </div>
        </div>
      </Window>
      <Cursor at={cursorAt} down={step === 2 || step === 4} hidden={step === 0 || step === 5} />
    </>
  );
}

const TEMPLATES = [
  { name: "Quarterly Meetup", category: "Meetup", used: 12 },
  { name: "Design Conference", category: "Conference", used: 4 },
  { name: "Workshop Day", category: "Workshop", used: 7 },
];

const DRAFT_FIELDS = [
  { label: "Format", value: "In-person" },
  { label: "Capacity", value: "120" },
  { label: "Visibility", value: "Public" },
];

const TEMPLATE_SCENE = [800, 800, 300, 500, 450, 450, 450, 3200];

function TemplateCard({ template, used, pressed }) {
  return (
    <div className="flex h-[106px] min-w-0 flex-1 flex-col rounded-lg border border-foreground/[0.09] bg-foreground/[0.02] p-2.5">
      <span className="truncate text-[12px] font-medium">{template.name}</span>
      <span className="text-[11px] text-muted-foreground">{template.category}</span>
      <span className="mt-1 truncate text-[10.5px] text-muted-foreground tabular-nums">Used by {used} events</span>
      <span className="mt-auto flex items-center gap-1">
        <span className={cn("inline-flex h-6 items-center rounded-md bg-foreground px-2.5 text-[11px] font-medium text-background transition-opacity", pressed && "opacity-70")}>Use</span>
        <span className="inline-flex h-6 items-center rounded-md border border-foreground/[0.1] px-2 text-[11px] text-foreground/75">Edit</span>
        <MoreHorizontal className="ml-auto size-3.5 text-muted-foreground" />
      </span>
    </div>
  );
}

// Templates: the cursor clicks Use and a new draft arrives with the template's format, capacity and visibility filled in.
function Templates({ running }) {
  const step = useScene(TEMPLATE_SCENE, running);
  const used = step >= 3;

  return (
    <>
      <Window title="Templates" icon={Copy} meta="All categories" className="h-[330px] w-[480px]" actions={<Button icon={Plus} className="h-7">New template</Button>}>
        <div className="flex gap-2 p-3">
          {TEMPLATES.map((template, index) => (
            <TemplateCard key={template.name} template={template} used={template.used + (index === 0 && used ? 1 : 0)} pressed={index === 0 && step === 2} />
          ))}
        </div>
        <Show when={used} className="mx-3 rounded-xl border border-foreground/[0.14] bg-surface-card shadow-xl shadow-black/15 dark:bg-surface-dialog">
          <div className={cn("flex h-10 items-center gap-2 border-b px-3.5", LINE)}>
            <span className="truncate font-medium">Quarterly Meetup</span>
            <span className="text-[11px] text-muted-foreground">New event</span>
            <Status status="Draft" className="ml-auto" />
          </div>
          <div className="grid grid-cols-3 gap-2.5 px-3.5 py-3">
            {DRAFT_FIELDS.map((field, index) => (
              <Field key={field.label} label={field.label}>
                <Input>
                  <span className={cn("transition-opacity duration-300", step >= 4 + index ? "opacity-100" : "opacity-0")}>{field.value}</span>
                </Input>
              </Field>
            ))}
          </div>
        </Show>
      </Window>
      <Cursor at={[38, 133]} down={step === 2} hidden={step === 0 || step >= 4} />
    </>
  );
}

const VARIANTS = { ticket: TicketTypes, pass: QrTickets, membership: MembershipPlans, certificate: CertificateEditor, template: Templates };

export function CardsMotif({ variant, seed, running }) {
  const View = VARIANTS[variant] || TicketTypes;
  return (
    <Fit>
      <View seed={seed} running={running} />
    </Fit>
  );
}
