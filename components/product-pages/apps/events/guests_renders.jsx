import {
  Accessibility,
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  Bell,
  Check,
  CheckCheck,
  HelpCircle,
  Home,
  Mail,
  Merge,
  MessagesSquare,
  MoreHorizontal,
  Pencil,
  PlayCircle,
  Plus,
  Radio as RadioIcon,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Trash2,
  Upload,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMark, Avatar, AvatarStack, Chip, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, EVENT, Input, Radio, ScreenTitle, Select, StatStrip, Status, Toggle, WorkspaceNav } from "@/components/product-pages/apps/events/events_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Events guest renders for Northside Design Week 2026: registrations and approvals, the Contact Book and the members portal.

function TagChip({ children, removable = false }) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-2 text-[11px] text-foreground/80">
      {children}
      {removable ? <X className="size-2.5 text-muted-foreground" /> : null}
    </span>
  );
}

function DrawerTabs({ active, className }) {
  return (
    <div className={cn("flex gap-4 border-b px-5 text-[12px]", LINE, className)}>
      {["Overview", "Tags & Notes", "Activity", "Consent", "Events"].map((tab) => (
        <span key={tab} className={cn("-mb-px border-b py-2.5", tab === active ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground")}>
          {tab}
        </span>
      ))}
    </div>
  );
}

function ContactHeader({ className }) {
  return (
    <div className={cn("border-b px-5 py-4", LINE, className)}>
      <div className="flex items-center gap-3">
        <Avatar name="Maya Chen" size={38} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium">Maya Chen</div>
          <div className="text-[12px] text-muted-foreground">maya@brightloop.io</div>
        </div>
        <X className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
        <Status status="VIP" />· Head of Design, Brightloop
      </div>
    </div>
  );
}

const CONTACTS = [
  { name: "Maya Chen", email: "maya@brightloop.io", company: "Brightloop", tags: ["speaker", "alumni"], status: "VIP", open: true },
  { name: "Theo Lindqvist", email: "theo@kestrelaero.com", company: "Kestrel Aero", tags: ["alumni"], status: "Active" },
  { name: "Hana Ito", email: "hana@fieldnote.app", company: "Fieldnote", tags: ["student"], status: "Lead" },
  { name: "Samuel Okoro", email: "sam@atlascoffee.co", company: "Atlas Coffee", tags: ["exhibitor"], status: "Active" },
  { name: "Clara Vidal", email: "clara@cobaltretail.com", company: "Cobalt Retail", tags: ["alumni", "volunteer"], status: "Active" },
  { name: "Ravi Menon", email: "ravi@orbitalfreight.com", company: "Orbital Freight", tags: ["speaker"], status: "VIP" },
  { name: "Elena Rossi", email: "elena@northwind.studio", company: "Northwind", tags: [], status: "Lead" },
  { name: "Noah Fischer", email: "noah@fieldnote.app", company: "Fieldnote", tags: ["alumni"], status: "Archived" },
];

const CONTACT_COLUMNS = "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_84px]";

const NOTES = [
  { who: "Ines Duarte", when: "Oct 21", body: "Spoke at Northside 2025. Invite back to host the Friday panel." },
  { who: "Kofi Asante", when: "Sep 2", body: "Prefers step-free routes; seat near the aisle at the keynote." },
];

// The hero's tilted plane: the Contact Book with Maya Chen's drawer open on Tags & Notes, a note being written.
export function ContactBookWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <div className="flex min-h-0 flex-1">
        <WorkspaceNav active="Contact Book" className="w-[210px] shrink-0" />
        <div className="relative min-w-0 flex-1">
          <div className="px-7 pt-6 pb-4">
            <ScreenTitle
              title="Contact Book"
              description="Every person across your events — one CRM record each, with tags, notes, consent, and history."
              actions={
                <>
                  <Button variant="ghost" icon={Merge}>
                    Find duplicates
                  </Button>
                  <Button variant="ghost" icon={Upload}>
                    Import
                  </Button>
                  <Button icon={Plus}>Add contact</Button>
                </>
              }
            />
            <StatStrip
              className="mt-5"
              stats={[
                { label: "Contacts", value: "4,812", footer: "Across all events" },
                { label: "Active", value: "3,106", footer: "Currently engaged" },
                { label: "VIP", value: "148", footer: "Priority guests" },
                { label: "Email consent", value: "3,402", footer: "Opted in to marketing email · 71%" },
              ]}
            />
            <div className="mt-4 flex items-center gap-2">
              <Select className="w-[118px]">All Statuses</Select>
              <Select className="w-[118px]">Any consent</Select>
              <Select className="w-[104px]">All tags</Select>
              <Input className="ml-auto w-[200px] text-muted-foreground/70">
                <Search className="size-3.5" /> Search contacts…
              </Input>
            </div>
          </div>
          <div className={cn("grid h-8 items-center gap-4 border-y px-7 text-[11px] text-muted-foreground", CONTACT_COLUMNS, LINE)}>
            <span>Contact</span>
            <span>Company</span>
            <span>Tags</span>
            <span>Status</span>
          </div>
          {CONTACTS.map((contact) => (
            <div key={contact.name} className={cn("grid h-[46px] items-center gap-4 border-b px-7", CONTACT_COLUMNS, LINE, contact.open && "bg-foreground/[0.05]")}>
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar name={contact.name} size={24} />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground/90">{contact.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{contact.email}</span>
                </span>
              </span>
              <span className="truncate text-foreground/75">{contact.company}</span>
              <span className="flex gap-1">
                {contact.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </span>
              <Status status={contact.status} />
            </div>
          ))}
          <div className="absolute inset-y-0 right-0 z-[2] flex w-[392px] flex-col border-l border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/40 dark:bg-surface-dialog">
            <ContactHeader />
            <DrawerTabs active="Tags & Notes" />
            <div className="flex flex-col gap-5 px-5 py-4">
              <div>
                <MonoLabel>Tags</MonoLabel>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {["speaker", "alumni", "workshop-lead"].map((tag) => (
                    <TagChip key={tag} removable>
                      {tag}
                    </TagChip>
                  ))}
                  <span className="text-[12px] text-muted-foreground/70">Add a tag…</span>
                </div>
              </div>
              <div>
                <MonoLabel>Notes</MonoLabel>
                <div className="mt-2 rounded-lg border border-foreground/25 bg-background/40">
                  <div className="min-h-[52px] px-3 py-2.5 text-[13px]">
                    <Typed text="Wants a stand on the expo floor next year" delay={1.5} />
                  </div>
                  <div className={cn("flex justify-end border-t px-2 py-1.5", LINE)}>
                    <Button className="h-7">Add note</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {NOTES.map((note) => (
                    <div key={note.who} className="rounded-lg border border-foreground/[0.08] px-3 py-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Avatar name={note.who} size={16} />
                        <span className="font-medium text-foreground/80">{note.who}</span>· {note.when}
                      </div>
                      <p className="mt-1.5 text-[12px] leading-5 text-foreground/85">{note.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const REGISTRATIONS = [
  { name: "Leah Mensah", email: "leah@kestrelaero.com", status: "Confirmed", source: "Online", time: "2m" },
  { name: "Hana Ito", email: "hana@fieldnote.app", status: "Pending", source: "Online", time: "8m" },
  { name: "Priya Nair", email: "priya@cobaltretail.com", status: "Pending", source: "Organizer", time: "21m" },
  { name: "Samuel Okoro", email: "sam@atlascoffee.co", status: "Checked-in", source: "Online", time: "1h" },
  { name: "Tyler Brennan", email: "tyler@northwind.studio", status: "Waitlisted", source: "Online", time: "2h" },
  { name: "Danielle Reyes", email: "danielle@brightloop.io", status: "Confirmed", source: "Import", time: "3h" },
  { name: "Noah Fischer", email: "noah@fieldnote.app", status: "Declined", source: "API", time: "5h" },
  { name: "Mia Johansson", email: "mia@orbitalfreight.com", status: "Cancelled", source: "Online", time: "1d" },
];

const REG_COLUMNS = "grid-cols-[minmax(0,1.6fr)_104px_88px_64px]";

function RegistrationsWindow({ className }) {
  return (
    <Window title="Registrations" meta={EVENT.name} className={cn("w-[640px]", className)}>
      <StatStrip
        className="m-5 mb-4"
        stats={[
          { label: "Confirmed", value: "552" },
          { label: "Checked-in", value: "612" },
          { label: "Pending", value: "18" },
          { label: "Waitlisted", value: "14" },
        ]}
      />
      <div className={cn("grid h-8 items-center gap-3 border-y px-5 text-[11px] text-muted-foreground", REG_COLUMNS, LINE)}>
        <span>Guest</span>
        <span>Status</span>
        <span>Source</span>
        <span className="text-right">Registered</span>
      </div>
      {REGISTRATIONS.map((registration) => (
        <div key={registration.name} className={cn("grid h-[46px] items-center gap-3 border-b px-5", REG_COLUMNS, LINE)}>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar name={registration.name} size={22} />
            <span className="min-w-0">
              <span className="block truncate font-medium">{registration.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{registration.email}</span>
            </span>
          </span>
          <Status status={registration.status} />
          <span className="text-[12px] text-muted-foreground">{registration.source}</span>
          <span className="text-right text-[12px] text-muted-foreground">{registration.time}</span>
        </div>
      ))}
    </Window>
  );
}

const REQUESTS = [
  { name: "Hana Ito", email: "hana@fieldnote.app", line: "Student pass", chips: [{ icon: Utensils, label: "Vegetarian" }], answer: "MA Interaction Design, Harbour School of Art", approved: true },
  { name: "Priya Nair", email: "priya@cobaltretail.com", line: "Full pass · party of 2", chips: [{ icon: Accessibility, label: "Step-free access" }], answer: "Leading Cobalt's in-store design team" },
  { name: "Ethan Caldwell", email: "ethan@atlascoffee.co", line: "Day pass — Friday", chips: [], answer: "Rebranding our roastery this winter" },
];

function ApprovalQueue({ className }) {
  return (
    <Window className={cn("w-[420px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-5 py-3.5", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">Approval Gates</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="truncate font-medium">{EVENT.short}</span>
      </div>
      <div className={cn("flex items-center gap-2 border-b px-5 py-2.5", LINE)}>
        <span className="text-[12px] text-muted-foreground">Showing 3 of 18</span>
        <Button variant="ghost" icon={X} className="ml-auto h-7">
          Decline all
        </Button>
        <Button icon={CheckCheck} className="h-7">
          Approve all
        </Button>
      </div>
      {REQUESTS.map((request) => (
        <div key={request.name} className={cn("border-b px-5 py-3.5 last:border-b-0", LINE, request.approved && "bg-emerald-500/[0.05]")}>
          <div className="flex items-center gap-2">
            <span className="font-medium">{request.name}</span>
            <span className="truncate text-[11px] text-muted-foreground">{request.email}</span>
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">{request.line}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {request.chips.map(({ icon: Icon, label }) => (
              <Chip key={label} icon={Icon} className="h-5 px-2 text-[11px]">
                {label}
              </Chip>
            ))}
            <span className="truncate text-[12px] text-foreground/80">“{request.answer}”</span>
          </div>
          {request.approved ? (
            <div className={cn("mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-400", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
              <Check className="size-3.5" strokeWidth={2.5} /> Approved Hana Ito.
            </div>
          ) : (
            <div className="mt-2.5 flex gap-2">
              <Button icon={Check} className="h-7">
                Approve
              </Button>
              <Button variant="ghost" icon={X} className="h-7">
                Decline
              </Button>
            </div>
          )}
        </div>
      ))}
    </Window>
  );
}

// Section stage: the event's registrations from every source, with its approval queue in front.
export function ApprovalStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <RegistrationsWindow className="absolute top-0 left-0 opacity-85" />
      <div className={cn("absolute top-[48px] left-[580px] z-[2]", styles.float)}>
        <ApprovalQueue />
      </div>
    </div>
  );
}

const WAITLIST = ["Tyler Brennan", "Amara Okafor", "Danielle Reyes", "Ethan Caldwell"];

// Cell: the waitlist with four places open and guests promoted by hand.
export function WaitlistRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium">Waitlist</span>
            <span className="truncate text-muted-foreground">{EVENT.name}</span>
            <Button icon={ArrowUp} className="ml-auto h-7">
              Promote next
            </Button>
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <span className={cn("absolute inset-y-0 left-0 w-[99.7%] origin-left rounded-full bg-foreground/45", styles.fill)} />
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              1,596/1,600 · <span className="text-emerald-600 dark:text-emerald-400">4 open</span> · 13 waiting
            </span>
          </div>
        </div>
        {WAITLIST.map((name, index) => (
          <div key={name} className={cn("flex h-11 items-center gap-3 border-b px-4 last:border-b-0", LINE)}>
            <span className="w-5 font-mono text-[11px] text-muted-foreground">#{index + 1}</span>
            <Avatar name={name} size={22} />
            <span className="flex-1 text-foreground/90">{name}</span>
            <Button variant="ghost" icon={ArrowUp} className="h-7">
              Promote
            </Button>
          </div>
        ))}
      </div>
      <div className={cn("absolute right-3 bottom-1 z-[2] flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-surface-card px-3 py-2 text-[12px] shadow-xl shadow-black/20 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "1s" }}>
        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
        Promoted Leah Mensah from the waitlist.
      </div>
    </div>
  );
}

// Cell: the email a guest gets when their registration is approved, with a link back to the event page.
export function ApprovalEmailRender() {
  return (
    <div className="mx-auto w-[440px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] shadow-xl shadow-black/15 dark:bg-surface-subtle">
      <div className={cn("flex flex-col gap-1 border-b px-4 py-3", LINE)}>
        {[
          ["From", EVENT.name],
          ["To", "hana@fieldnote.app"],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <span className="w-10 text-muted-foreground">{label}</span>
            <span className="text-foreground/85">{value}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">
          <Mail className="size-3.5 text-muted-foreground" /> You&apos;re approved for {EVENT.short}
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="text-[15px] font-medium tracking-[-0.01em]">Hi Hana,</div>
        <p className="mt-2 leading-5 text-foreground/80">
          Good news — your registration for {EVENT.name} on Nov 19, 2026 has been approved. Pick up where you left off on the event page.
        </p>
        <span className={cn("mt-4 inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-[12px] font-medium text-background", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
          Continue to the event
        </span>
        <div className="mt-3.5 text-[11px] text-muted-foreground">
          {EVENT.name} · {EVENT.venue}
        </div>
      </div>
    </div>
  );
}

const DUPLICATES = [
  {
    key: "maya@brightloop.io",
    rows: [
      { name: "Maya Chen", email: "maya@brightloop.io", added: "Mar 4, 2025", keep: true },
      { name: "Maya Chen", email: "Maya@Brightloop.io", added: "Oct 2, 2026" },
    ],
  },
  {
    key: "theo lindqvist",
    rows: [
      { name: "Theo Lindqvist", email: "theo@kestrelaero.com", added: "Nov 20, 2025", keep: true },
      { name: "Theo Lindqvist", email: "t.lindqvist@kestrelaero.com", added: "Jun 3, 2026" },
      { name: "Theo L.", email: "theo@kestrelaero.com", added: "Oct 9, 2026" },
    ],
  },
];

function DuplicatesWindow({ className }) {
  return (
    <Window className={cn("h-[600px] w-[640px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5 text-muted-foreground", LINE)}>
        <ArrowLeft className="size-3.5" /> Back to contacts
      </div>
      <div className="px-6 pt-5">
        <ScreenTitle title="Find duplicates" description="Find duplicate contacts and fold them into a single record — tags, notes, consent, and history are preserved." />
        <StatStrip
          className="mt-4"
          stats={[
            { label: "Duplicate groups", value: "6" },
            { label: "Contacts affected", value: "13" },
            { label: "Removable", value: "7" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 p-6 pt-4">
        {DUPLICATES.map((group, groupIndex) => (
          <div key={group.key} className="overflow-hidden rounded-xl border border-foreground/[0.08]">
            <div className={cn("flex items-center gap-2 border-b bg-foreground/[0.025] px-4 py-2.5 text-[12px]", LINE)}>
              <span className="font-mono text-[11px] text-foreground/80">{group.key}</span>
              <span className="text-muted-foreground">{group.rows.length} contacts</span>
              <Button icon={Merge} className={cn("ml-auto h-7", groupIndex === 0 && styles.popIn)}>
                Merge
              </Button>
            </div>
            {group.rows.map((row) => (
              <div key={row.email + row.added} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
                <Radio on={row.keep} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground/90">{row.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {row.email} · added {row.added}
                  </span>
                </span>
                {row.keep ? <span className="text-[11px] text-muted-foreground">Keeps this one</span> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
}

const ATTENDED = [
  { name: "Northside Design Week 2026", date: "Nov 19, 2026", status: "Confirmed" },
  { name: "Brightloop Studio Night", date: "Jun 12, 2026", status: "Checked-in" },
  { name: "Northside Design Week 2025", date: "Nov 20, 2025", status: "Checked-in" },
  { name: "Type Tuesdays #14", date: "Mar 4, 2025", status: "Checked-in" },
];

function EventsDrawer({ className }) {
  return (
    <Window className={cn("w-[360px]", className)}>
      <ContactHeader />
      <DrawerTabs active="Events" className="gap-3.5" />
      <div className="flex flex-col gap-2 p-4">
        {ATTENDED.map((event, index) => (
          <div key={event.name} className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-2.5", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.12}s` }}>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-foreground/90">{event.name}</span>
              <span className="block text-[11px] text-muted-foreground">{event.date}</span>
            </span>
            <Status status={event.status} />
          </div>
        ))}
      </div>
    </Window>
  );
}

// Section stage: duplicates folded into one record, and that contact's events in their drawer.
export function DuplicatesStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <DuplicatesWindow className="absolute top-0 left-0 opacity-90" />
      <div className={cn("absolute top-[56px] left-[620px] z-[2]", styles.float)}>
        <EventsDrawer />
      </div>
    </div>
  );
}

const SEGMENT_RULES = [
  ["Tag", "is", "speaker"],
  ["Email consent", "is", "Yes"],
  ["Attending event", "is", EVENT.name],
];

// Cell: a segment built from three rules, and who it matches.
export function SegmentsRender() {
  return (
    <div className="mx-auto w-[450px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Speakers who opted in</span>
        <span className="ml-auto text-[11px] text-muted-foreground">Match all rules</span>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        {SEGMENT_RULES.map(([field, op, value], index) => (
          <div key={field} className={cn("grid grid-cols-[140px_56px_minmax(0,1fr)] gap-2", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
            <Select>{field}</Select>
            <Select>{op}</Select>
            <Input className="truncate">{value}</Input>
          </div>
        ))}
        <span className="flex h-8 items-center gap-1.5 rounded-md border border-dashed border-foreground/20 px-2.5 text-muted-foreground">
          <Plus className="size-3.5" /> Add rule
        </span>
      </div>
      <div className={cn("flex items-center gap-3 border-t px-4 py-3", LINE)}>
        <span className="text-[20px] font-semibold tracking-[-0.01em] tabular-nums">42</span>
        <span className="text-muted-foreground">members</span>
        <span className="ml-auto">
          <AvatarStack names={["Maya Chen", "Ravi Menon", "Zara Patel", "Theo Lindqvist", "Hana Ito"]} size={22} />
        </span>
      </div>
    </div>
  );
}

const MAPPING = [
  ["Full Name", "Name"],
  ["E-mail", "Email"],
  ["Organisation", "Company"],
  ["City", "Location"],
  ["Labels", "Tags"],
];

// Cell: a CSV import on its Map columns step.
export function ImportRender() {
  return (
    <div className="mx-auto w-[450px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        {["Upload", "Map columns", "Preview", "Done"].map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 ? <span className="h-px w-3 bg-foreground/15" /> : null}
            <span className={cn("flex size-4 items-center justify-center rounded-full text-[9px]", index === 0 ? "bg-foreground/80 text-background" : index === 1 ? "border border-foreground/60 font-medium" : "border border-foreground/20 text-muted-foreground")}>
              {index === 0 ? <Check className="size-2.5" strokeWidth={3} /> : index + 1}
            </span>
            <span className={index === 1 ? "font-medium" : "text-muted-foreground"}>{step}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 pt-3 text-[11px] text-muted-foreground">
        <Upload className="size-3.5" /> nsdw-2025-attendees.csv · 1,284 rows
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {MAPPING.map(([column, field], index) => (
          <div key={column} className={cn("grid grid-cols-[minmax(0,1fr)_16px_150px] items-center gap-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.08}s` }}>
            <span className="truncate rounded-md bg-foreground/[0.04] px-2.5 py-1.5 font-mono text-[11px] text-foreground/80">{column}</span>
            <span className="text-center text-muted-foreground">→</span>
            <Select className="h-7">{field}</Select>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAGS = [
  { tag: "alumni", count: "1,920", description: "Came to a past Northside week" },
  { tag: "student", count: "412", description: "Student pass holders" },
  { tag: "exhibitor", count: "88", description: "Expo floor stands" },
  { tag: "speaker", count: "64", description: "Spoke at any Northside event", menu: true },
  { tag: "volunteer", count: "57", description: "Door and room crews" },
];

// Cell: the Tags list with a tag's menu open on Merge into….
export function TagsRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[450px]">
      <div className="overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
        <div className={cn("grid h-8 grid-cols-[110px_64px_minmax(0,1fr)_16px] items-center gap-3 border-b px-4 text-[11px] text-muted-foreground", LINE)}>
          <span>Tag</span>
          <span>Contacts</span>
          <span>Description</span>
          <span />
        </div>
        {TAGS.map((row) => (
          <div key={row.tag} className={cn("grid h-11 grid-cols-[110px_64px_minmax(0,1fr)_16px] items-center gap-3 border-b px-4 last:border-b-0", LINE, row.menu && "bg-foreground/[0.04]")}>
            <span>
              <TagChip>{row.tag}</TagChip>
            </span>
            <span className="tabular-nums text-foreground/85">{row.count}</span>
            <span className="truncate text-muted-foreground">{row.description}</span>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className={cn("absolute top-[176px] right-[8px] z-[2] w-[160px] rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[12px] shadow-2xl shadow-black/30 dark:bg-surface-dialog", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        {[
          { icon: Pencil, label: "Edit" },
          { icon: Merge, label: "Merge into…", active: true },
          { icon: Trash2, label: "Delete", danger: true },
        ].map(({ icon: Icon, label, active, danger }) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", active && "bg-foreground/[0.07]", danger ? "text-red-600 dark:text-red-400" : "text-foreground/85")}>
            <Icon className={cn("size-3.5", danger ? "" : "text-muted-foreground")} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

const DATA_REQUESTS = [
  { who: "Noah Fischer", type: "Erasure", status: "In Progress", due: "Nov 14" },
  { who: "Elena Rossi", type: "Export", status: "New", due: "Nov 20" },
  { who: "Clara Vidal", type: "Rectification", status: "Completed", due: "Oct 18" },
  { who: "Tyler Brennan", type: "Export", status: "Completed", due: "Oct 2" },
];

// Cell: GDPR and CCPA requests, each tracked to its due date.
export function DataRequestsRender() {
  return (
    <div className="mx-auto w-[450px] text-[12px]">
      <StatStrip
        className="bg-surface-card dark:bg-surface-subtle"
        stats={[
          { label: "Open", value: "2" },
          { label: "Overdue", value: "0" },
          { label: "Completed", value: "9" },
        ]}
      />
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("grid h-8 grid-cols-[minmax(0,1fr)_100px_96px_52px] items-center gap-3 border-b px-4 text-[11px] text-muted-foreground", LINE)}>
          <span>Requester</span>
          <span>Type</span>
          <span>Status</span>
          <span className="text-right">Due</span>
        </div>
        {DATA_REQUESTS.map((request, index) => (
          <div key={request.who} className={cn("grid h-10 grid-cols-[minmax(0,1fr)_100px_96px_52px] items-center gap-3 border-b px-4 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name={request.who} size={18} />
              <span className="truncate text-foreground/90">{request.who}</span>
            </span>
            <span>
              <Chip className="h-5 px-2 text-[11px]">{request.type}</Chip>
            </span>
            <Status status={request.status} />
            <span className="text-right text-muted-foreground tabular-nums">{request.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PORTAL_NAV = [
  { items: [{ icon: Home, label: "Home" }] },
  {
    label: "Tickets & orders",
    items: [
      { icon: Ticket, label: "Tickets" },
      { icon: ShoppingBag, label: "Orders" },
      { icon: BadgeCheck, label: "Memberships", active: true },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: RadioIcon, label: "Live" },
      { icon: PlayCircle, label: "Watch" },
    ],
  },
  {
    label: "Community",
    items: [
      { icon: Users, label: "Community" },
      { icon: HelpCircle, label: "Q&A" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: MessagesSquare, label: "Messages", badge: "1" },
      { icon: Bell, label: "Notifications" },
    ],
  },
];

function PlanCard({ name, price, status, description, benefits, included, footer, action, className }) {
  return (
    <div className={cn("rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold">{name}</div>
          <div className="mt-0.5 text-[15px] font-semibold tabular-nums">{price}</div>
        </div>
        {status ? <Status status={status} /> : null}
      </div>
      <p className="mt-2 text-[12px] leading-5 text-muted-foreground">{description}</p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-[12px] text-foreground/80">
            <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {benefit}
          </li>
        ))}
      </ul>
      {included ? (
        <div className="mt-3 flex gap-1.5">
          {included.map((item) => (
            <Chip key={item} className="h-5 px-2 text-[11px]">
              {item}
            </Chip>
          ))}
        </div>
      ) : null}
      {footer ? <div className="mt-3 text-[11px] text-muted-foreground">{footer}</div> : null}
      {action}
    </div>
  );
}

function PortalWindow({ className }) {
  return (
    <Window className={cn("h-[600px] w-[700px]", className)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
        <AppMark id="events" size={22} />
        <span className="font-medium">Members</span>
        <span className="text-muted-foreground">{EVENT.short}</span>
        <span className="ml-auto">
          <Avatar name="Clara Vidal" size={24} />
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className={cn("flex w-[170px] shrink-0 flex-col gap-3 border-r px-2 py-3 text-[12px]", LINE)}>
          {PORTAL_NAV.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label ? <div className="px-2 pb-1 text-[10px] text-muted-foreground">{group.label}</div> : null}
              {group.items.map(({ icon: Icon, label, active, badge }) => (
                <div key={label} className={cn("flex h-7 items-center gap-2 rounded-md px-2", active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/70")}>
                  <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                  <span className="flex-1">{label}</span>
                  {badge ? <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-[9px] font-medium text-background">{badge}</span> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 px-6 py-5">
          <div className="text-[18px] font-medium tracking-[-0.02em]">Memberships</div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Your memberships and their benefits, and plans you can join.</p>
          <MonoLabel className="mt-5 block">Your memberships</MonoLabel>
          <PlanCard
            className="mt-2"
            name="Northside Friends"
            price="$60"
            status="Active"
            description="For the people who come back every November."
            benefits={["Replays of every Main Stage talk", "The members' lounge on the expo floor"]}
            included={["VOD content", "Special access"]}
            footer="Since Mar 12, 2026"
          />
          <MonoLabel className="mt-5 block">Available memberships</MonoLabel>
          <PlanCard
            className={cn("mt-2", styles.popIn)}
            name="Northside Patron"
            price="$180"
            description="Backs the bursary fund that brings students to the week."
            benefits={["Everything in Friends", "Your name on the patrons' wall"]}
            action={<Button className="mt-3 w-full">Join — $180</Button>}
          />
        </div>
      </div>
    </Window>
  );
}

function ThreadPanel({ className }) {
  return (
    <Window className={cn("w-[330px]", className)}>
      <div className={cn("flex items-start gap-2.5 border-b px-4 py-3", LINE)}>
        <ArrowLeft className="mt-0.5 size-3.5 text-muted-foreground" />
        <div>
          <div className="font-medium">Step-free route to The Loft?</div>
          <div className="text-[11px] text-muted-foreground">Open · started Oct 24, 2026</div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4 py-4 text-[12px]">
        <div className="ml-8 rounded-xl rounded-br-sm bg-foreground/[0.08] px-3 py-2.5 leading-5">
          Is The Loft step-free? I use a wheelchair and want to get to the portfolio clinic.
          <div className="mt-1 text-[10px] text-muted-foreground">You · Oct 24, 9:12 AM</div>
        </div>
        <div className={cn("mr-8 rounded-xl rounded-bl-sm border border-foreground/[0.1] px-3 py-2.5 leading-5", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
          Yes — the lift beside Gate B goes straight up to The Loft. We&apos;ve added a note to your registration.
          <div className="mt-1 text-[10px] text-muted-foreground">Organiser · Oct 24, 10:40 AM</div>
        </div>
      </div>
      <div className={cn("flex items-center gap-2 border-t px-3 py-2.5", LINE)}>
        <Input className="flex-1 text-muted-foreground/70">Reply…</Input>
        <span className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
          <Send className="size-3.5" />
        </span>
      </div>
    </Window>
  );
}

// Section stage: the members portal on Memberships, with a conversation with the organiser in front.
export function PortalStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <PortalWindow className="absolute top-0 left-0" />
      <div className={cn("absolute top-[90px] left-[660px] z-[2]", styles.float)}>
        <ThreadPanel />
      </div>
    </div>
  );
}

const ENTITLEMENTS = [
  { label: "VOD content", body: "Recordings & replays from your on-demand library" },
  { label: "Special access", body: "On-site room passes · Members' lounge" },
];

// Cell: a membership plan on its Benefits tab, with the perks and what the plan unlocks.
export function PlanEditorRender() {
  return (
    <div className="mx-auto w-[450px] rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <BadgeCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">Membership Plans</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Northside Patron</span>
        <span className="ml-auto tabular-nums text-muted-foreground">$180</span>
      </div>
      <div className={cn("flex gap-4 border-b px-4 text-[12px]", LINE)}>
        {["Pricing", "Benefits", "Details"].map((tab) => (
          <span key={tab} className={cn("-mb-px border-b py-2", tab === "Benefits" ? "border-foreground font-medium" : "border-transparent text-muted-foreground")}>
            {tab}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-2.5">
        <div>
          <div className="text-[11px] font-medium text-muted-foreground">Perks</div>
          <div className="mt-1 rounded-md border border-foreground/[0.1] bg-background/40 px-2.5 py-1.5 leading-5 text-foreground/85">
            Everything in Friends
            <br />
            Your name on the patrons&apos; wall
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-medium text-muted-foreground">Unlocks</div>
          {ENTITLEMENTS.map((entitlement, index) => (
            <div key={entitlement.label} className={cn("flex items-center gap-3 rounded-lg border border-foreground/[0.08] px-3 py-1.5", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.12}s` }}>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground/90">{entitlement.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{entitlement.body}</span>
              </span>
              <Toggle on />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const THREADS = [
  { who: "Theo Lindqvist", subject: "Can't find my Friday pass", status: "Open", when: "4m", active: true },
  { who: "Clara Vidal", subject: "Step-free route to The Loft?", status: "Open", when: "2h" },
  { who: "Samuel Okoro", subject: "Power at booth B4", status: "Closed", when: "1d" },
];

// Cell: the organiser's Messages inbox, replying to a member from the same thread they see in the portal.
export function OrganiserInboxRender() {
  return (
    <div className="mx-auto w-[450px] overflow-hidden rounded-xl border border-foreground/[0.08] bg-surface-card text-[12px] dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <MessagesSquare className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Messages</span>
        <Select className="ml-auto h-7 w-[110px]">All threads</Select>
      </div>
      {THREADS.map((thread) => (
        <div key={thread.who} className={cn("flex h-11 items-center gap-2.5 border-b px-4", LINE, thread.active && "bg-foreground/[0.05]")}>
          <Avatar name={thread.who} size={20} />
          <span className="w-[96px] shrink-0 truncate font-medium text-foreground/90">{thread.who}</span>
          <span className="min-w-0 flex-1 truncate text-muted-foreground">{thread.subject}</span>
          <Status status={thread.status} className="text-[11px]" />
          <span className="w-6 text-right text-[11px] text-muted-foreground">{thread.when}</span>
        </div>
      ))}
      <div className="px-4 py-3">
        <div className="mr-10 rounded-xl rounded-bl-sm bg-foreground/[0.06] px-3 py-2 leading-5 text-foreground/85">I bought a Friday day pass yesterday but can&apos;t see it anywhere.</div>
        <div className="mt-2.5 flex items-center gap-2">
          <Input className="h-9 flex-1 border-foreground/25">
            <Typed text="It's under Tickets in your portal — tap it for the QR." delay={1.4} className="text-[12px]" />
          </Input>
          <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
            <Send className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
