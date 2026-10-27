import { ArrowUpRight, Check, ChevronDown, GripVertical, ListChecks, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Events registration renders: approval gates, the waitlist and conditional questions.

const REG_TONES = { Confirmed: "emerald", "Checked-in": "emerald", Pending: "amber", Waitlisted: "neutral", Declined: "red", Cancelled: "neutral" };

function RegStatus({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground/85">
      <Dot tone={REG_TONES[status]} />
      {status}
    </span>
  );
}

const REGISTRATIONS = [
  { name: "Hana Ito", email: "hana@kestrel.aero", status: "Pending", source: "Online", time: "Just now" },
  { name: "Samuel Okoro", email: "sam@atlascoffee.co", status: "Confirmed", source: "Online", time: "12m" },
  { name: "Clara Vidal", email: "clara@lumenhealth.io", status: "Confirmed", source: "Organizer", time: "40m" },
  { name: "Ravi Menon", email: "ravi@fieldnote.app", status: "Waitlisted", source: "Online", time: "1h" },
  { name: "Elena Rossi", email: "elena@cobalt.shop", status: "Pending", source: "Import", time: "2h" },
  { name: "Noah Fischer", email: "noah@orbital.dev", status: "Confirmed", source: "API", time: "3h" },
  { name: "Mia Johansson", email: "mia@brightloop.io", status: "Declined", source: "Online", time: "5h" },
];

const COUNTS = [
  { label: "Confirmed", value: "214" },
  { label: "Pending", value: "12" },
  { label: "Waitlisted", value: "38" },
  { label: "Capacity", value: "250" },
];

function RegistrationsWindow({ className }) {
  return (
    <Window title="Registrations" meta="Summit 2026 · Lisbon" className={cn("w-[700px]", className)}>
      <div className={cn("grid grid-cols-4 border-b", LINE)}>
        {COUNTS.map((count, index) => (
          <div key={count.label} className={cn("px-5 py-3.5", index > 0 && "border-l", LINE)}>
            <div className="text-[11px] text-muted-foreground">{count.label}</div>
            <div className="mt-0.5 text-lg font-medium tracking-tight tabular-nums">{count.value}</div>
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-[1.7fr_1fr_0.8fr_0.6fr] gap-3 border-b px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Guest</span>
        <span>Status</span>
        <span>Source</span>
        <span className="text-right">Registered</span>
      </div>
      {REGISTRATIONS.map((registration, index) => (
        <div key={registration.name} className={cn("grid grid-cols-[1.7fr_1fr_0.8fr_0.6fr] items-center gap-3 border-b px-5 py-2.5", LINE, index === 0 && "bg-foreground/[0.04]")}>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={registration.name} size={22} />
            <span className="min-w-0">
              <span className="block truncate font-medium">{registration.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{registration.email}</span>
            </span>
          </span>
          <RegStatus status={registration.status} />
          <span className="text-muted-foreground">{registration.source}</span>
          <span className="text-right text-[12px] text-muted-foreground">{registration.time}</span>
        </div>
      ))}
    </Window>
  );
}

function ApprovalDrawer({ className }) {
  return (
    <Window className={cn("w-[340px]", className)}>
      <div className={cn("border-b px-5 py-4", LINE)}>
        <div className="flex items-center gap-3">
          <Avatar name="Hana Ito" size={32} />
          <div>
            <div className="font-medium">Hana Ito</div>
            <div className="text-[12px] text-muted-foreground">Client preview — approval</div>
          </div>
        </div>
        <div className="mt-3">
          <RegStatus status="Pending" />
        </div>
      </div>
      <div className={cn("flex flex-col gap-3 border-b px-5 py-4", LINE)}>
        <div>
          <div className="text-[11px] text-muted-foreground">Why would you like to attend?</div>
          <p className="mt-1 leading-5 text-foreground/90">We&apos;re rolling the platform out to three regional teams next quarter and want to see the roadmap first.</p>
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">Dietary &amp; accessibility</div>
          <div className="mt-1.5 flex gap-1.5">
            <Chip className="h-5 px-2 text-[11px]">Nut allergy</Chip>
            <Chip className="h-5 px-2 text-[11px]">Step-free access</Chip>
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-5 py-4">
        <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground text-[12px] font-medium text-background">
          <Check className="size-3.5" /> Approve
        </span>
        <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-foreground/10 text-[12px] text-muted-foreground">
          <X className="size-3.5" /> Decline
        </span>
      </div>
    </Window>
  );
}

export function RegistrationsStage() {
  return (
    <div className="relative h-[600px] w-[1000px]">
      <RegistrationsWindow className="absolute top-0 left-0" />
      <ApprovalDrawer className={cn("absolute top-[70px] left-[640px] z-[2]", styles.float)} />
    </div>
  );
}

const WAITLIST = [
  { name: "Ravi Menon", note: "Promoted · 23h left to claim", promoted: true },
  { name: "Grace Liu", note: "#2 on the waitlist" },
  { name: "Omar Haddad", note: "#3 on the waitlist" },
  { name: "Julia Brandt", note: "#4 on the waitlist" },
];

export function WaitlistRender() {
  return (
    <div className="mx-auto w-[440px] text-[13px]">
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-foreground/[0.09] bg-surface-card px-4 py-3 dark:bg-surface-subtle">
        <div className="min-w-0 flex-1">
          <div className="font-medium">Auto-promote</div>
          <div className="text-[12px] text-muted-foreground">Claim window (hours) · 24</div>
        </div>
        <span className="flex h-5 w-9 items-center rounded-full bg-foreground p-0.5">
          <span className="ml-auto size-4 rounded-full bg-background" />
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 text-[12px]", LINE)}>
          <span className="text-muted-foreground">A spot opened up</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <ArrowUpRight className="size-3.5" /> 1 promoted
          </span>
        </div>
        {WAITLIST.map((guest, index) => (
          <div
            key={guest.name}
            className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, guest.promoted && "bg-emerald-500/[0.06]", guest.promoted && styles.popIn)}
            style={guest.promoted ? { "--pop-delay": "0.4s" } : undefined}
          >
            <span className="w-4 font-mono text-[11px] text-muted-foreground">{index + 1}</span>
            <Avatar name={guest.name} size={22} />
            <span className="flex-1 truncate">{guest.name}</span>
            <span className={cn("text-[12px]", guest.promoted ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>{guest.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuilderField({ type, label, children, nested = false }) {
  return (
    <div className={cn("flex items-start gap-2 rounded-xl border border-foreground/[0.09] bg-surface-card px-3 py-3 dark:bg-surface-subtle", nested && "ml-8 border-dashed")}>
      <GripVertical className="mt-0.5 size-4 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <MonoLabel>{type}</MonoLabel>
        </div>
        <div className="mt-1 font-medium text-foreground/90">{label}</div>
        {children}
      </div>
    </div>
  );
}

export function QuestionsRender() {
  return (
    <div className="mx-auto flex w-[440px] flex-col gap-2.5 text-[13px]">
      <div className="flex items-center gap-2 px-1 text-[12px] text-muted-foreground">
        <ListChecks className="size-3.5" /> Meetup RSVP
      </div>
      <BuilderField type="Short text" label="Name on badge" />
      <BuilderField type="Checkbox" label="Want to give a lightning talk?">
        <div className="mt-2 flex items-center gap-2 text-[12px] text-foreground/85">
          <span className="flex size-4 items-center justify-center rounded border border-foreground bg-foreground text-background">
            <Check className="size-3" strokeWidth={3} />
          </span>
          Yes, I&apos;d like a slot
        </div>
      </BuilderField>
      <div className={styles.popIn} style={{ "--pop-delay": "0.5s" }}>
        <BuilderField type="Short text" label="Talk title" nested>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-foreground/[0.05] px-2 py-1 text-[11px] text-muted-foreground">
            Show when <span className="text-foreground/85">Want to give a lightning talk?</span> is checked
            <ChevronDown className="size-3" />
          </div>
        </BuilderField>
      </div>
      <div className="flex items-center gap-1.5 px-1 text-[12px] text-muted-foreground">
        <Plus className="size-3.5" /> Add question
      </div>
    </div>
  );
}
