"use client";

import { BookUser, ChevronDown, Copy, Upload, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Input, Segmented, StatStrip, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit } from "@/components/features-hub/motifs/motif_kit";

const CONTACTS = [
  { name: "Maya Chen", email: "maya@brightloop.io", company: "Brightloop", tags: ["VIP", "Speaker"], status: "VIP", vip: true },
  { name: "Marcus Whitfield", email: "marcus@orbitalfreight.com", company: "Orbital Freight", tags: ["Sponsor"], status: "Active" },
  { name: "Amara Okafor", email: "amara@fieldnote.app", company: "Fieldnote", tags: ["VIP"], status: "VIP", vip: true },
  { name: "Tomas Marek", email: "tomas@cobaltretail.com", company: "Cobalt Retail", tags: ["Alumni"], status: "Active" },
  { name: "Aisha Bennett", email: "aisha@lumenhealth.org", company: "Lumen Health", tags: ["VIP", "Alumni"], status: "VIP", vip: true },
  { name: "Kofi Asante", email: "kofi@atlascoffee.co", company: "Atlas Coffee", tags: [], status: "Lead" },
  { name: "Grace Donnelly", email: "grace@kestrelaero.com", company: "Kestrel Aero", tags: ["VIP"], status: "VIP", vip: true },
  { name: "Ethan Caldwell", email: "ethan@northwind.example", company: "Northwind", tags: ["Alumni"], status: "Active" },
  { name: "Nathan Okafor", email: "nathan@halden.example", company: "Halden Group", tags: ["VIP", "Sponsor"], status: "VIP", vip: true },
];

const CRM_COLUMNS = "grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_56px]";
const CRM_SCENE = [1400, 800, 220, 3800];

function Tag({ children, strong }) {
  return <span className={cn("rounded border px-1.5 text-[10.5px] leading-[18px]", strong ? "border-foreground/25 text-foreground" : "border-foreground/10 text-muted-foreground")}>{children}</span>;
}

// Contact Book: filtering the tags to VIP folds the rest of the audience away and the count follows.
function ContactBook({ running }) {
  const step = useScene(CRM_SCENE, running);
  const filtered = step === 3;

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
          <BookUser className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Contact Book</span>
          <span className="ml-auto flex gap-1.5">
            <Button variant="ghost" icon={Copy} className="h-7 px-2.5 text-[11px]">
              Find duplicates
            </Button>
            <Button variant="ghost" icon={Upload} className="h-7 px-2.5 text-[11px]">
              Import CSV
            </Button>
          </span>
        </div>
        <div className={cn("flex items-center gap-2 border-b px-4 py-2", LINE)}>
          <span className="text-[12px] tabular-nums">
            <span className="font-medium">{filtered ? "318" : "2,481"}</span> <span className="text-muted-foreground">Contacts</span>
          </span>
          <span className={cn("ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[11.5px] transition-colors duration-200", filtered ? "border-foreground/35 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-foreground/80")}>
            {filtered ? "VIP" : "All tags"}
            <ChevronDown className="size-3 text-muted-foreground" />
          </span>
        </div>
        <div className={cn("grid gap-3 border-b px-4 py-1.5 text-[11px] text-muted-foreground", CRM_COLUMNS, LINE)}>
          <span>Contact</span>
          <span>Company</span>
          <span>Tags</span>
          <span>Status</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {CONTACTS.map((contact) => (
            <Expand key={contact.name} when={!filtered || contact.vip}>
              <div className={cn("grid h-[43px] items-center gap-3 border-b px-4", CRM_COLUMNS, LINE)}>
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar name={contact.name} size={22} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] leading-4 font-medium text-foreground/90">{contact.name}</span>
                    <span className="block truncate text-[10.5px] leading-4 text-muted-foreground">{contact.email}</span>
                  </span>
                </span>
                <span className="truncate text-[12px] text-foreground/80">{contact.company}</span>
                <span className="flex min-w-0 gap-1 overflow-hidden">
                  {contact.tags.map((tag) => (
                    <Tag key={tag} strong={filtered && tag === "VIP"}>
                      {tag}
                    </Tag>
                  ))}
                </span>
                <Status status={contact.status} className="text-[11px]" />
              </div>
            </Expand>
          ))}
        </div>
      </Window>
      <Cursor at={[436, 72]} down={step === 2} hidden={step === 0 || filtered} />
    </div>
  );
}

const REG_COLUMNS = "grid-cols-[minmax(0,1.5fr)_62px_62px_82px]";
const RSVP_SCENE = [600, 700, 800, 240, 900, 3600];

const REGISTRATIONS = [
  { name: "Maya Chen", email: "maya@brightloop.io", source: "Online", registered: "2h ago", status: "Confirmed" },
  { name: "Marcus Whitfield", email: "marcus@orbitalfreight.com", source: "Organizer", registered: "5h ago", status: "Confirmed" },
  { name: "Tomas Marek", email: "tomas@cobaltretail.com", source: "Online", registered: "1d ago", status: "Waitlisted" },
  { name: "Aisha Bennett", email: "aisha@lumenhealth.org", source: "Kiosk", registered: "1d ago", status: "Checked-in" },
  { name: "Grace Donnelly", email: "grace@kestrelaero.com", source: "Online", registered: "2d ago", status: "Confirmed" },
];

function RegistrationRow({ person, highlight }) {
  return (
    <div className={cn("grid h-[43px] items-center gap-2.5 border-b px-4 transition-colors duration-300", REG_COLUMNS, LINE, highlight && "bg-foreground/[0.045]")}>
      <span className="flex min-w-0 items-center gap-2">
        <Avatar name={person.name} size={22} />
        <span className="min-w-0">
          <span className="block truncate text-[12px] leading-4 font-medium text-foreground/90">{person.name}</span>
          <span className="block truncate text-[10.5px] leading-4 text-muted-foreground">{person.email}</span>
        </span>
      </span>
      <span className="truncate text-[11.5px] text-foreground/80">{person.source}</span>
      <span className="truncate text-[11.5px] text-muted-foreground">{person.registered}</span>
      <Status status={person.status} className="text-[11px]" />
    </div>
  );
}

// Registrations: a new sign-up lands as Pending, the organiser confirms it, and the status and count update in place.
function Registrations({ running }) {
  const step = useScene(RSVP_SCENE, running);
  const arrived = step >= 1;
  const confirmed = step >= 4;
  const newcomer = { name: "Amara Okafor", email: "amara@fieldnote.app", source: "Online", registered: "Just now", status: confirmed ? "Confirmed" : "Pending" };

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
          <UserCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Registrations</span>
          <Segmented options={["By Event", "All People"]} active="All People" className="ml-auto text-[11px]" />
        </div>
        <div className={cn("flex h-9 shrink-0 items-center gap-4 border-b px-4 text-[12px] text-muted-foreground tabular-nums", LINE)}>
          <span>
            <span className="font-medium text-foreground">{confirmed ? "205" : "204"}</span> Confirmed
          </span>
          <span>
            <span className="font-medium text-foreground">{arrived && !confirmed ? "12" : "11"}</span> Pending
          </span>
          <span>
            <span className="font-medium text-foreground">18</span> Waitlisted
          </span>
        </div>
        <div className={cn("grid shrink-0 gap-2.5 border-b px-4 py-1.5 text-[11px] text-muted-foreground", REG_COLUMNS, LINE)}>
          <span>Person</span>
          <span>Source</span>
          <span>Registered</span>
          <span>Status</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <Expand when={arrived}>
            <RegistrationRow person={newcomer} highlight={arrived && !confirmed} />
          </Expand>
          {REGISTRATIONS.map((person) => (
            <RegistrationRow key={person.name} person={person} />
          ))}
        </div>
      </Window>
      <Cursor at={[420, 136]} down={step === 3} hidden={step < 2 || step === 5} />
    </div>
  );
}

const NEW_FOLLOWERS = [
  { name: "Grace Donnelly", email: "grace@kestrelaero.com", followed: "Just now" },
  { name: "Kofi Asante", email: "kofi@atlascoffee.co", followed: "12m ago" },
  { name: "Tomas Marek", email: "tomas@cobaltretail.com", followed: "1h ago" },
];

const FOLLOWERS = [
  { name: "Maya Chen", email: "maya@brightloop.io", followed: "2h ago" },
  { name: "Amara Okafor", email: "amara@fieldnote.app", followed: "Yesterday" },
  { name: "Marcus Whitfield", email: "marcus@orbitalfreight.com", followed: "3d ago" },
];

const FOLLOWER_SCENE = [600, 1300, 1300, 3400];

function FollowerRow({ person }) {
  return (
    <div className={cn("flex h-[40px] items-center gap-2 border-b px-3", LINE)}>
      <Avatar name={person.name} size={20} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11.5px] leading-4 text-foreground/90">{person.name}</span>
        <span className="block truncate text-[10.5px] leading-4 text-muted-foreground">{person.email}</span>
      </span>
      <span className="shrink-0 text-[11px] text-muted-foreground">{person.followed}</span>
    </div>
  );
}

// Organiser profile: new followers land at the top of the list while Followers and New this week tick up.
function Followers({ running }) {
  const step = useScene(FOLLOWER_SCENE, running);
  // Rows arrive oldest first, so the newest one is on top when the scene finishes.
  const shown = NEW_FOLLOWERS.map((person, index) => ({ person, when: step >= NEW_FOLLOWERS.length - index }));

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
          <span className="text-muted-foreground">Discovery</span>
          <span className="text-muted-foreground/60">›</span>
          <span className="font-medium">Organiser profile</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
          <StatStrip
            className="shrink-0"
            stats={[
              { label: "Followers", value: (1284 + step).toLocaleString("en-US") },
              { label: "New this week", value: `${17 + step}` },
              { label: "Profile complete", value: "92%" },
            ]}
          />
          <div className="grid min-h-0 flex-1 grid-cols-[156px_minmax(0,1fr)] gap-3">
            <div className="flex min-w-0 flex-col gap-2.5">
              <Field label="Display name">
                <Input>Northside</Input>
              </Field>
              <Field label="Tagline">
                <div className="rounded-md border border-foreground/[0.1] bg-background/50 px-2.5 py-1.5 text-[12px] leading-[1.4] text-foreground/90">Design events for curious people</div>
              </Field>
            </div>
            <div className="min-w-0 overflow-hidden rounded-lg border border-foreground/[0.08]">
              <div className={cn("flex h-7 items-center justify-between border-b bg-foreground/[0.025] px-3 text-[11px] text-muted-foreground", LINE)}>
                <span>Followers</span>
                <span>Followed</span>
              </div>
              {shown.map(({ person, when }) => (
                <Expand key={person.email} when={when}>
                  <FollowerRow person={person} />
                </Expand>
              ))}
              {FOLLOWERS.map((person) => (
                <FollowerRow key={person.email} person={person} />
              ))}
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}

const VARIANTS = { crm: ContactBook, rsvp: Registrations, followers: Followers };

export function PeopleMotif({ variant, running }) {
  const View = VARIANTS[variant] || ContactBook;
  return (
    <Fit>
      <View running={running} />
    </Fit>
  );
}
