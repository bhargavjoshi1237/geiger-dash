import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Inbox,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  MessageSquare,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_ICONS } from "@/lib/pricing/product-icons";
import { AppMark, Avatar, AvatarStack, Chip, Dot, LINE, MonoLabel, Typed, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Halden Group on Geiger: every department a project in one organisation, people brought in with a role, requests signed off in order in Forms, and the whole company's usage on one bill.

const POPOVER = "rounded-xl border border-foreground/[0.1] bg-surface-card shadow-2xl shadow-black/25 dark:bg-surface-dialog";
const CARD = "rounded-xl border border-foreground/[0.08] bg-surface-card dark:bg-surface-subtle";

const PRODUCT_NAMES = { notes: "Notes", flow: "Flow", forms: "Forms", grey: "Grey", assets: "Assets", content: "Content", events: "Events", property: "Property" };

const PROJECT_TONES = {
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  teal: "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  slate: "border-foreground/[0.14] bg-foreground/[0.06] text-foreground/80",
};

const DEPARTMENTS = [
  { name: "People & HR", tone: "rose", apps: ["forms", "flow", "grey"], added: "Feb 2, 2026", members: ["Ruth Mensah", "Joel Asante", "Priti Shah"] },
  { name: "Finance", tone: "emerald", apps: ["forms", "flow", "grey"], added: "Feb 2, 2026", members: ["Daniel Okoye", "Mei Tanaka"] },
  { name: "IT & Security", tone: "sky", apps: ["flow", "forms", "grey", "assets"], added: "Feb 9, 2026", members: ["Marek Novak", "Ana Ruiz", "Ben Carter", "Kwame Boateng"] },
  { name: "Legal", tone: "violet", apps: ["forms", "grey", "notes"], added: "Mar 1, 2026", members: ["Isabel Ferreira", "Tom Weller"] },
  { name: "Facilities", tone: "amber", apps: ["forms", "flow", "property"], added: "Mar 16, 2026", members: ["Owen Price", "Lena Vogel"] },
  { name: "Marketing", tone: "teal", apps: ["notes", "assets", "content", "events"], added: "Apr 6, 2026", members: ["Hannah Lindgren", "Felix Moreau", "Zara Ali"] },
];

const PROCUREMENT = { name: "Procurement", tone: "slate", apps: ["forms", "flow"], added: "Today", members: ["Sami Rahman"] };

function ProductIcon({ id, className }) {
  const Icon = PRODUCT_ICONS[id];
  return Icon ? <Icon className={cn("size-4 shrink-0 text-muted-foreground", className)} strokeWidth={1.75} /> : null;
}

// A project's product strip pill, as the organisation page draws it: the app's icon and name, or a lock when the plan lacks it.
function ProductPill({ id, locked = false }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px]", locked ? "text-muted-foreground/70" : "text-foreground/75")}>
      {locked ? <Lock className="size-4 shrink-0 text-muted-foreground/70" strokeWidth={1.75} /> : <ProductIcon id={id} />}
      {PRODUCT_NAMES[id]}
    </span>
  );
}

function ProjectAvatar({ project, size = 36 }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-lg border font-semibold", PROJECT_TONES[project.tone])} style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}>
      {project.name[0]}
    </span>
  );
}

function ProjectRow({ project, active = false, fresh = false, lockedApp }) {
  return (
    <div
      className={cn("flex items-center gap-4 border-b px-5 py-3 last:border-b-0", LINE, active && "bg-foreground/[0.035]", fresh && styles.popIn)}
      style={fresh ? { "--pop-delay": "2.8s" } : undefined}
    >
      <ProjectAvatar project={project} />
      <div className="w-[176px] min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{project.name}</span>
          {fresh ? <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 text-[10px] leading-4 text-emerald-700 dark:text-emerald-300">New</span> : null}
        </div>
        <div className="truncate text-[11.5px] text-muted-foreground">
          {project.apps.length} products · Added {project.added}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
        {project.apps.map((id) => (
          <ProductPill key={id} id={id} />
        ))}
        {lockedApp ? <ProductPill id={lockedApp} locked /> : null}
      </div>
      <AvatarStack names={project.members} size={22} />
      <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}

const ORG_STATS = [
  { label: "Projects", value: "6", hint: "One per department", icon: Inbox },
  { label: "Members", value: "48", hint: "Across every project", icon: Users },
  { label: "Apps in use", value: "8", hint: "On one plan", icon: BadgeCheck },
  { label: "Join requests", value: "3", hint: "Waiting for an admin", icon: UserPlus },
];

// The organisation page's head: the org's mark and name, its counts, and the actions an admin reaches for.
function OrgHead({ compact = false }) {
  return (
    <>
      <div className={cn("flex items-center gap-3 border-b px-5", compact ? "h-14" : "h-16", LINE)}>
        <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-[15px] font-semibold text-background">H</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold tracking-[-0.01em]">Halden Group</span>
            <Chip className="h-5 px-2 text-[10.5px]">Organisation</Chip>
          </div>
          <div className="text-[11.5px] text-muted-foreground">halden.example · Owner Amelia Hart</div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[12px]">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-3 text-foreground/80">
            <Users className="size-3.5 text-muted-foreground" /> Members
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-foreground/[0.1] px-3 text-foreground/80">
            <Settings className="size-3.5 text-muted-foreground" /> Settings
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 font-medium text-background">
            <Plus className="size-3.5" /> New project
          </span>
        </div>
      </div>
      {compact ? null : (
        <div className={cn("grid grid-cols-4 border-b", LINE)}>
          {ORG_STATS.map(({ label, value, hint, icon: Icon }, index) => (
            <div key={label} className={cn("px-5 py-3", index > 0 && "border-l", LINE)}>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="size-3.5" strokeWidth={1.75} />
                {label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[22px] font-medium tracking-[-0.02em] tabular-nums">{value}</span>
                <span className="truncate text-[11px] text-muted-foreground">{hint}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const MEMBERS = [
  { name: "Amelia Hart", email: "amelia@halden.example", role: "Owner" },
  { name: "Daniel Okoye", email: "daniel@halden.example", role: "Financial Officer" },
  { name: "Marek Novak", email: "marek@halden.example", role: "Technical Officer" },
  { name: "Ruth Mensah", email: "ruth@halden.example", role: "Manager" },
  { name: "Owen Price", email: "owen@halden.example", role: "Leader" },
  { name: "Joel Asante", email: "joel@halden.example", role: "User" },
];

const ROLE_OPTIONS = ["Manager", "User", "Leader", "Technical Officer", "Financial Officer"];

function RoleSelect({ role, open = false }) {
  if (role === "Owner") {
    return (
      <span className="inline-flex h-7 w-[150px] items-center gap-1.5 px-2.5 text-[12px] text-muted-foreground">
        <KeyRound className="size-3.5" /> Owner
      </span>
    );
  }
  return (
    <span className={cn("inline-flex h-7 w-[150px] items-center justify-between rounded-md border px-2.5 text-[12px] text-foreground/85", open ? "border-foreground/40 ring-2 ring-foreground/10" : "border-foreground/[0.1]")}>
      {role}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}

// Hero: Halden's organisation page with every department as a project, the members panel open on a role change.
export function OrgHeroWindow() {
  return (
    <div className="relative h-[700px] w-[1180px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[1000px]">
        <OrgHead />
        <div className={cn("flex items-center gap-2 border-b px-5 py-2.5 text-[12px]", LINE)}>
          <span className="font-medium">Projects</span>
          <span className="text-muted-foreground">6</span>
          <span className="ml-auto flex h-7 w-[200px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-muted-foreground">
            <Search className="size-3.5" /> Search projects
          </span>
        </div>
        {DEPARTMENTS.map((project, index) => (
          <ProjectRow key={project.name} project={project} active={index === 1} />
        ))}
      </Window>
      <div className={cn(POPOVER, "absolute top-[110px] left-[760px] z-[2] w-[400px] overflow-hidden text-[12.5px]", styles.float)}>
        <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
          <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Members</span>
          <span className="text-muted-foreground">48</span>
          <span className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[11.5px] font-medium text-background">
            <UserPlus className="size-3.5" /> Invite
          </span>
        </div>
        {MEMBERS.slice(0, 5).map((member) => (
          <div key={member.email} className={cn("flex items-center gap-2.5 border-b px-4 py-2.5 last:border-b-0", LINE, member.name === "Daniel Okoye" && "bg-foreground/[0.035]")}>
            <Avatar name={member.name} size={26} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{member.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{member.email}</div>
            </div>
            <RoleSelect role={member.role} open={member.name === "Daniel Okoye"} />
          </div>
        ))}
      </div>
      <div className={cn(POPOVER, "absolute top-[338px] left-[1010px] z-[3] w-[150px] p-1 text-[12px]", styles.popIn)} style={{ "--pop-delay": "1.2s" }}>
        {ROLE_OPTIONS.map((option) => (
          <div key={option} className={cn("flex items-center justify-between rounded-md px-2.5 py-1.5", option === "Financial Officer" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            <span className="truncate">{option}</span>
            {option === "Financial Officer" ? <Check className="size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const PICKER_APPS = ["forms", "flow", "grey", "notes", "assets", "content", "events", "property"];

// Section stage: the organisation's department projects, with Procurement being created from the New project dialog and landing in the list.
export function DepartmentsStage() {
  return (
    <div className="relative h-[620px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[600px] w-[1000px]">
        <OrgHead compact />
        {[...DEPARTMENTS, PROCUREMENT].map((project) => (
          <ProjectRow key={project.name} project={project} fresh={project === PROCUREMENT} />
        ))}
      </Window>
      <div className={cn(POPOVER, "absolute top-[96px] right-[28px] z-[2] w-[380px] overflow-hidden text-[12.5px]", styles.float)}>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="font-medium">New project</div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">Give it a name and pick the apps it uses.</div>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Name</div>
            <div className="flex h-9 items-center rounded-lg border border-foreground/40 px-3 ring-2 ring-foreground/10">
              <Typed text="Procurement" delay={0.8} />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center text-[11px] font-medium text-muted-foreground">
              Products
              <span className="ml-auto font-normal tabular-nums">2 selected</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PICKER_APPS.map((id, index) => {
                const picked = id === "forms" || id === "flow";
                return (
                  <span
                    key={id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2.5 py-2",
                      picked ? "border-foreground/30 bg-foreground/[0.05] text-foreground" : "border-foreground/[0.08] text-foreground/75",
                      picked && styles.popIn,
                    )}
                    style={picked ? { "--pop-delay": `${1.7 + index * 0.25}s` } : undefined}
                  >
                    <ProductIcon id={id} />
                    <span className="flex-1 truncate">{PRODUCT_NAMES[id]}</span>
                    <span className={cn("flex size-4 items-center justify-center rounded-[4px] border", picked ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
                      {picked ? <Check className="size-3" strokeWidth={2.5} /> : null}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className={cn("flex items-center justify-end gap-2 border-t px-4 py-2.5", LINE)}>
          <span className="rounded-md px-3 py-1.5 text-muted-foreground">Cancel</span>
          <span className="rounded-md bg-foreground px-3 py-1.5 font-medium text-background">Create project</span>
        </div>
      </div>
    </div>
  );
}

const SWITCHER_APPS = ["forms", "flow", "grey"];

// Cell: one account moving between Finance's apps, the same person signed in on every one.
export function OneSignInRender() {
  return (
    <div className="relative h-[300px] w-[460px]">
      <div className={cn(CARD, "absolute top-0 left-0 w-[300px] overflow-hidden text-[12.5px]")}>
        <div className={cn("flex items-center gap-3 border-b px-4 py-3", LINE)}>
          <ProjectAvatar project={DEPARTMENTS[1]} size={30} />
          <div className="min-w-0">
            <div className="font-semibold">Finance</div>
            <div className="text-[11px] text-muted-foreground">Halden Group · 3 products</div>
          </div>
        </div>
        {SWITCHER_APPS.map((id, index) => (
          <div key={id} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE, index === 1 && "bg-foreground/[0.04]")}>
            <AppMark id={id} size={26} />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Geiger {PRODUCT_NAMES[id]}</div>
              <div className="truncate text-[11px] text-muted-foreground">{["Purchase and expense requests", "Month-end close tracker", "Finance policies, cited"][index]}</div>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className={cn(POPOVER, "absolute top-[118px] right-0 z-[2] w-[230px] p-3 text-[12px]", styles.float)}>
        <div className="flex items-center gap-2.5">
          <Avatar name="Daniel Okoye" size={30} />
          <div className="min-w-0">
            <div className="truncate font-medium">Daniel Okoye</div>
            <div className="truncate text-[11px] text-muted-foreground">daniel@halden.example</div>
          </div>
        </div>
        <div className={cn("mt-3 flex flex-col gap-1.5 border-t pt-3", LINE)}>
          {SWITCHER_APPS.map((id, index) => (
            <div key={id} className={cn("flex items-center gap-2", styles.popIn)} style={{ "--pop-delay": `${0.6 + index * 0.3}s` }}>
              <ProductIcon id={id} className="size-3.5" />
              <span className="text-foreground/85">{PRODUCT_NAMES[id]}</span>
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Signed in
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Cell: the department list trimmed to each team's own apps, one app locked until the organisation adds it.
export function ProjectAppsRender() {
  return (
    <div className={cn(CARD, "w-[470px] overflow-hidden text-[12.5px]")}>
      {[DEPARTMENTS[4], DEPARTMENTS[3], DEPARTMENTS[0]].map((project, index) => (
        <div key={project.name} className={cn("flex items-center gap-3 border-b px-4 py-3 last:border-b-0", LINE)}>
          <ProjectAvatar project={project} size={30} />
          <div className="w-[96px] min-w-0">
            <div className="truncate font-semibold">{project.name}</div>
            <div className="text-[11px] text-muted-foreground">{project.apps.length} products</div>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5">
            {project.apps.map((id) => (
              <ProductPill key={id} id={id} />
            ))}
            {index === 1 ? <ProductPill id="content" locked /> : null}
          </div>
        </div>
      ))}
      <div className={cn("flex items-center gap-2 border-t bg-foreground/[0.02] px-4 py-2.5 text-[11.5px] text-muted-foreground", LINE)}>
        <Lock className="size-3.5" />
        Content isn’t on Halden’s plan yet. Add it once and any project can use it.
      </div>
    </div>
  );
}

const PENDING_INVITES = [
  { email: "sami@halden.example", role: "Manager", sent: "2h ago" },
  { email: "grace@halden.example", role: "User", sent: "Yesterday" },
];

// SplitShowcase render: the Members dialog, every person with their role, the role list open on a change, and the invites still pending.
export function MembersRender() {
  return (
    <Window className="relative h-[500px] w-[680px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
        <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Members</span>
        <span className="text-muted-foreground">Halden Group</span>
        <span className="ml-auto flex h-8 w-[180px] items-center gap-2 rounded-md border border-foreground/[0.1] px-2.5 text-[12px] text-muted-foreground">
          <Search className="size-3.5" /> Search members
        </span>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">
          <UserPlus className="size-3.5" /> Invite
        </span>
      </div>
      <div className={cn("grid grid-cols-[minmax(0,1fr)_150px_24px] gap-4 border-b bg-foreground/[0.02] px-5 py-2 text-[11px] text-muted-foreground", LINE)}>
        <span>Member</span>
        <span>Role</span>
        <span />
      </div>
      {MEMBERS.map((member) => (
        <div key={member.email} className={cn("grid grid-cols-[minmax(0,1fr)_150px_24px] items-center gap-4 border-b px-5 py-2.5", LINE, member.name === "Owen Price" && "bg-foreground/[0.035]")}>
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={member.name} size={26} />
            <div className="min-w-0">
              <div className="truncate font-medium">{member.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{member.email}</div>
            </div>
          </div>
          <RoleSelect role={member.role} open={member.name === "Owen Price"} />
          {member.role === "Owner" ? <span /> : <MoreHorizontal className="size-4 text-muted-foreground" />}
        </div>
      ))}
      <div className="px-5 pt-3 pb-1">
        <MonoLabel className="text-[10px]">Pending invites</MonoLabel>
      </div>
      {PENDING_INVITES.map((invite) => (
        <div key={invite.email} className="flex items-center gap-2.5 px-5 py-1.5 text-[12px]">
          <Mail className="size-3.5 text-muted-foreground" />
          <span className="text-foreground/85">{invite.email}</span>
          <span className="text-muted-foreground">
            {invite.role} · sent {invite.sent}
          </span>
          <span className="ml-auto rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">Revoke</span>
        </div>
      ))}
      <div className={cn(POPOVER, "absolute top-[270px] left-[440px] z-[2] w-[170px] p-1 text-[12px]", styles.popIn)} style={{ "--pop-delay": "0.9s" }}>
        {ROLE_OPTIONS.map((option) => (
          <div key={option} className={cn("flex items-center justify-between rounded-md px-2.5 py-1.5", option === "Manager" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            <span>{option}</span>
            {option === "Leader" ? <Check className="size-3.5 text-muted-foreground" /> : null}
          </div>
        ))}
      </div>
    </Window>
  );
}

const INVITEES = ["grace@halden.example", "omar@halden.example", "lucy@halden.example"];

// Cell: inviting three new starters by email with one role, the invitations going out.
export function InviteRender() {
  return (
    <div className="relative h-[300px] w-[460px]">
      <div className={cn(POPOVER, "absolute top-0 left-0 w-[380px] overflow-hidden text-[12.5px]")}>
        <div className={cn("border-b px-4 py-3", LINE)}>
          <div className="font-medium">Invite people to Halden Group</div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">They’ll get an email with a link to join.</div>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Email addresses</div>
            <div className="flex min-h-[64px] flex-wrap content-start items-center gap-1.5 rounded-lg border border-foreground/40 p-2 ring-2 ring-foreground/10">
              {INVITEES.slice(0, 2).map((email) => (
                <Chip key={email} className="h-6 gap-1 pr-1.5">
                  {email}
                  <X className="size-3 text-muted-foreground" />
                </Chip>
              ))}
              <Typed text={INVITEES[2]} delay={1} className="text-[12px]" />
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Role</div>
            <span className="flex h-9 items-center justify-between rounded-lg border border-foreground/[0.1] px-3">
              User
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </span>
          </div>
        </div>
        <div className={cn("flex items-center justify-end gap-2 border-t px-4 py-2.5", LINE)}>
          <span className="rounded-md px-3 py-1.5 text-muted-foreground">Cancel</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 font-medium text-background">
            <Send className="size-3.5" /> Send 3 invites
          </span>
        </div>
      </div>
      <div className={cn(POPOVER, "absolute right-0 bottom-3 z-[2] flex w-[230px] items-start gap-2.5 px-3.5 py-3 text-[12px]", styles.popIn)} style={{ "--pop-delay": "3.2s" }}>
        <CheckCircle2 className="mt-px size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <div className="font-medium">3 invitations sent</div>
          <div className="mt-0.5 text-muted-foreground">Each joins as a User.</div>
        </div>
      </div>
    </div>
  );
}

const JOIN_REQUESTS = [
  { name: "Priti Shah", email: "priti@halden.example", message: "Joining People & HR from Monday, Ruth asked me to request access.", time: "12m", approved: true },
  { name: "Callum Reid", email: "callum@halden.example", message: "Facilities contractor for the Leeds site move.", time: "1h" },
  { name: "Noor Haddad", email: "noor@halden.example", message: "New in Legal, starting on contracts.", time: "3h" },
];

// Cell: people asking to join the organisation with a note, an admin approving the first.
export function JoinRequestsRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <UserPlus className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">Join requests</span>
        <span className="ml-auto rounded-full bg-foreground/[0.07] px-2 text-[11px] leading-5 text-muted-foreground tabular-nums">3</span>
      </div>
      {JOIN_REQUESTS.map((request) => (
        <div key={request.email} className={cn("border-b px-4 py-3 last:border-b-0", LINE)}>
          <div className="flex items-center gap-2.5">
            <Avatar name={request.name} size={24} />
            <div className="min-w-0 flex-1">
              <span className="font-medium">{request.name}</span>
              <span className="ml-1.5 text-[11px] text-muted-foreground">{request.email}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{request.time}</span>
          </div>
          <p className="mt-1.5 pl-[34px] text-[12px] leading-[1.45] text-foreground/80">{request.message}</p>
          <div className="mt-2 flex items-center gap-1.5 pl-[34px]">
            {request.approved ? (
              <span className={cn("inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11.5px] text-emerald-700 dark:text-emerald-300", styles.popIn)} style={{ "--pop-delay": "1.4s" }}>
                <UserCheck className="size-3.5" /> Approved by Amelia Hart
              </span>
            ) : (
              <>
                <span className="rounded-md bg-foreground px-2.5 py-1 text-[11.5px] font-medium text-background">Approve</span>
                <span className="rounded-md border border-foreground/[0.1] px-2.5 py-1 text-[11.5px] text-muted-foreground">Decline</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const PURCHASES = [
  { who: "Owen Price", item: "Thermal label printers × 12", amount: "£4,860", status: "Pending", time: "18m", active: true },
  { who: "Hannah Lindgren", item: "Trade show stand, Birmingham", amount: "£12,400", status: "Approved", time: "2h" },
  { who: "Marek Novak", item: "Laptop refresh, 9 machines", amount: "£10,350", status: "Pending", time: "5h" },
  { who: "Ruth Mensah", item: "Learning platform, annual", amount: "£6,200", status: "Approved", time: "1d" },
  { who: "Isabel Ferreira", item: "Contract review software", amount: "£3,180", status: "Rejected", time: "2d" },
  { who: "Lena Vogel", item: "Office chairs, Leeds floor 2", amount: "£2,940", status: "Complete", time: "3d" },
];

const PURCHASE_TONES = { Pending: "amber", Approved: "emerald", Complete: "emerald", Rejected: "red" };

const CHAIN = [
  { step: "Line manager", who: "Lena Vogel", state: "Approved", time: "09:12" },
  { step: "Finance", who: "Daniel Okoye", state: "Approved", time: "10:40" },
  { step: "Procurement", who: "Sami Rahman", state: "Waiting" },
];

function ChainState({ state }) {
  if (state === "Approved") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" /> Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
      <span className={cn("size-1.5 rounded-full bg-amber-500 text-amber-500", styles.pulse)} /> Waiting
    </span>
  );
}

// Section stage: the purchase request inbox in Forms, Owen's printers open with the approval chain two steps through and a countersignature to come.
export function PurchaseApprovalStage() {
  return (
    <Window className="h-[620px] w-[1000px]">
      <div className={cn("flex h-12 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <AppMark id="forms" size={22} />
        <span className="font-medium">Response Inbox</span>
        <span className="text-muted-foreground">Purchase request</span>
        <span className="ml-auto flex items-center gap-1.5">
          <Chip dot="amber">2 in approval</Chip>
          <Chip>Finance · Procurement</Chip>
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className={cn("w-[400px] shrink-0 border-r", LINE)}>
          {PURCHASES.map((row) => (
            <div key={row.item} className={cn("flex items-start gap-3 border-b px-4 py-3", LINE, row.active && "bg-foreground/[0.04]")}>
              <Avatar name={row.who} size={24} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{row.item}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{row.time}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px]">
                  <span className="text-muted-foreground">{row.who}</span>
                  <span className="font-medium tabular-nums">{row.amount}</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-foreground/80">
                    <Dot tone={PURCHASE_TONES[row.status]} />
                    {row.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <div className="flex items-center gap-2.5">
            <Avatar name="Owen Price" size={30} />
            <div>
              <div className="text-[15px] font-medium">Thermal label printers × 12</div>
              <div className="text-[12px] text-muted-foreground">Owen Price · Facilities · submitted 18 minutes ago</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11.5px] text-amber-700 dark:text-amber-300">
              <Clock className="size-3" /> In approval
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 text-[12.5px]">
            {[
              ["Supplier", "Northgate Office Supply"],
              ["Total cost", "£4,860.00"],
              ["Cost centre", "Facilities · Leeds"],
              ["Needed by", "Friday 14 November"],
              ["Reason", "Dispatch bench labels for the new site"],
              ["Quote", "northgate-quote-2291.pdf"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="text-[11px] text-muted-foreground">{label}</div>
                <div className="mt-0.5 flex items-center gap-1.5 truncate text-foreground/90">
                  {label === "Quote" ? <FileText className="size-3.5 shrink-0 text-muted-foreground" /> : null}
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-foreground/[0.08]">
            <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
              <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
              <span className="font-medium">Approval chain</span>
              <span className="ml-auto text-[11.5px] text-muted-foreground">In order · 2 of 3 signed</span>
            </div>
            {CHAIN.map((step, index) => (
              <div key={step.step} className={cn("flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0", LINE)}>
                <span className="flex size-5 items-center justify-center rounded-md bg-foreground/[0.07] font-mono text-[11px] text-foreground/80">{index + 1}</span>
                <span className="w-[110px] font-medium">{step.step}</span>
                <Avatar name={step.who} size={20} />
                <span className="text-foreground/85">{step.who}</span>
                <span className="ml-auto flex items-center gap-3">
                  {step.time ? <span className="text-[11px] text-muted-foreground tabular-nums">{step.time}</span> : null}
                  <ChainState state={step.state} />
                </span>
              </div>
            ))}
            <div className={cn("flex items-center gap-3 border-t border-dashed px-4 py-2.5 text-[12px] text-muted-foreground", LINE)}>
              <PenLine className="size-4" strokeWidth={1.75} />
              Countersignature by Amelia Hart once every step has signed
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Avatar name="Daniel Okoye" size={22} />
            <div className="min-w-0 flex-1 rounded-lg border border-foreground/[0.08] px-3 py-2 text-[12.5px]">
              <span className="font-medium">Daniel Okoye</span>
              <span className="ml-2 text-[11px] text-muted-foreground">10:41</span>
              <p className="mt-0.5 text-foreground/85">
                Inside the Facilities budget. <span className="font-medium">@Sami Rahman</span> <Typed text="can you match it to the framework price?" delay={1.6} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

const STARTER_KIT = [
  ["Laptop", true],
  ["Second screen", true],
  ["Building pass", true],
  ["Desk phone", false],
];

// Cell: the New starter form People & HR sends to every hiring manager, filled in for a Monday start.
export function NewStarterFormRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <AppMark id="forms" size={22} />
        <div>
          <div className="font-medium">New starter</div>
          <div className="text-[11px] text-muted-foreground">People & HR · step 2 of 3</div>
        </div>
        <span className="ml-auto h-1.5 w-[90px] overflow-hidden rounded-full bg-foreground/[0.07]">
          <span className={cn("block h-full w-2/3 origin-left rounded-full bg-foreground/70", styles.fill)} />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 py-3.5">
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Starter’s name</div>
          <div className="flex h-9 items-center rounded-lg border border-foreground/[0.1] px-3 text-foreground/90">Grace Whitlock</div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Start date</div>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 text-foreground/90">
            <Calendar className="size-3.5 text-muted-foreground" /> Mon 17 Nov
          </div>
        </div>
        <div className="col-span-2">
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Equipment</div>
          <div className="grid grid-cols-2 gap-1.5">
            {STARTER_KIT.map(([item, on], index) => (
              <span key={item} className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2", on ? "border-foreground/25 bg-foreground/[0.04]" : "border-foreground/[0.08] text-foreground/70", on && styles.popIn)} style={on ? { "--pop-delay": `${0.5 + index * 0.25}s` } : undefined}>
                <span className={cn("flex size-4 items-center justify-center rounded-[4px] border", on ? "border-foreground bg-foreground text-background" : "border-foreground/25")}>
                  {on ? <Check className="size-3" strokeWidth={2.5} /> : null}
                </span>
                {item === "Laptop" ? <Laptop className="size-3.5 text-muted-foreground" /> : null}
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Hiring manager’s signature</div>
          <div className="relative flex h-[58px] items-center rounded-lg border border-dashed border-foreground/20 px-3">
            <svg viewBox="0 0 220 40" className="h-9 w-[170px] text-foreground" aria-hidden="true">
              <path d="M6 28 C 18 6, 26 36, 38 20 S 58 8, 64 26 S 84 34, 96 14 C 104 4, 112 30, 124 24 S 150 12, 164 22 S 196 30, 214 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.flow} />
            </svg>
            <span className="ml-auto text-[11px] text-muted-foreground">Ruth Mensah</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const HISTORY = [
  { icon: Upload, text: "Owen Price submitted the request", time: "08:54" },
  { icon: Send, text: "Sent to Lena Vogel, line manager", time: "08:54" },
  { icon: CheckCircle2, text: "Lena Vogel approved", time: "09:12", tone: "emerald" },
  { icon: CheckCircle2, text: "Daniel Okoye approved for Finance", time: "10:40", tone: "emerald" },
  { icon: MessageSquare, text: "Daniel Okoye mentioned Sami Rahman", time: "10:41" },
  { icon: Clock, text: "Waiting on Sami Rahman, Procurement", time: "Now", tone: "amber" },
];

// Cell: the request's history, every hand-off and signature in the order it happened.
export function RequestHistoryRender() {
  return (
    <div className={cn(CARD, "w-[460px] px-4 py-3.5 text-[12.5px]")}>
      <div className="mb-3 flex items-center gap-2">
        <span className="font-medium">History</span>
        <span className="text-muted-foreground">Thermal label printers × 12</span>
      </div>
      <div className="relative flex flex-col gap-3 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-px before:bg-foreground/[0.1]">
        {HISTORY.map(({ icon: Icon, text, time, tone }, index) => (
          <div key={text} className={cn("relative flex items-center gap-3", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.18}s` }}>
            <span
              className={cn(
                "relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border bg-surface-card dark:bg-surface-subtle",
                tone === "emerald" ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : tone === "amber" ? "border-amber-500/30 text-amber-600 dark:text-amber-400" : "border-foreground/[0.12] text-muted-foreground",
              )}
            >
              <Icon className="size-3" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground/85">{text}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ALLOWANCES = [
  { label: "Active Projects", used: 7, total: 10, unit: "" },
  { label: "Collaborators", used: 48, total: 60, unit: "" },
  { label: "Storage", used: 182, total: 500, unit: "GB" },
  { label: "Bandwidth", used: 640, total: 1000, unit: "GB" },
  { label: "AI Credits", used: 6200, total: 10000, unit: "" },
  { label: "Email Purse", used: 31400, total: 50000, unit: "emails" },
];

const format = (value) => value.toLocaleString("en-GB");

// Callout centrepiece: the organisation's usage page, every allowance on the plan with what the company has used so far.
export function UsageRender() {
  return (
    <div className={cn(CARD, "w-[560px] overflow-hidden text-[12.5px] shadow-xl shadow-black/15")}>
      <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
        <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[12px] font-semibold text-background">H</span>
        <div>
          <div className="font-medium">Usage</div>
          <div className="text-[11px] text-muted-foreground">Halden Group · this billing month</div>
        </div>
        <Chip className="ml-auto h-6">Pro plan</Chip>
      </div>
      <div className="px-4 pt-3 pb-1">
        <MonoLabel className="text-[10px]">Allowance</MonoLabel>
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
        {ALLOWANCES.map((row, index) => {
          const share = row.used / row.total;
          return (
            <div key={row.label} className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-muted-foreground tabular-nums">{Math.round(share * 100)}%</span>
              </div>
              <div className="mt-1 text-[15px] font-medium tracking-[-0.01em] tabular-nums">
                {format(row.used)}
                <span className="text-[11.5px] font-normal text-muted-foreground">
                  {" "}
                  / {format(row.total)} {row.unit}
                </span>
              </div>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                <span
                  className={cn("block h-full origin-left rounded-full", share > 0.75 ? "bg-amber-500" : "bg-foreground/70", styles.fill)}
                  style={{ width: `${share * 100}%`, "--fill-delay": `${0.4 + index * 0.12}s` }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const OWNED = [
  { id: "forms", note: "Core" },
  { id: "flow", note: "Core" },
  { id: "grey", note: "Core" },
  { id: "notes", note: "Core" },
  { id: "assets", note: "Add-on" },
  { id: "events", note: "Add-on" },
];

// Cell: what Halden pays for, the apps every project can use and the email templates add-on, on one plan.
export function PlanProductsRender() {
  return (
    <div className={cn(CARD, "w-[460px] overflow-hidden text-[12.5px]")}>
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", LINE)}>
        <span className="font-medium">Products</span>
        <span className="text-muted-foreground">on Halden’s plan</span>
        <span className="ml-auto text-[11.5px] text-muted-foreground">Renews 1 Dec</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-3">
        {OWNED.map((product, index) => (
          <div key={product.id} className={cn("flex items-center gap-2 rounded-lg border border-foreground/[0.08] px-2.5 py-2", styles.popIn)} style={{ "--pop-delay": `${0.2 + index * 0.1}s` }}>
            <ProductIcon id={product.id} />
            <div className="min-w-0">
              <div className="truncate font-medium">{PRODUCT_NAMES[product.id]}</div>
              <div className="text-[10.5px] text-muted-foreground">{product.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn("flex items-center gap-2.5 border-t px-4 py-3", LINE)}>
        <Mail className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <div className="font-medium">Custom email templates</div>
          <div className="text-[11px] text-muted-foreground">Halden’s own branding on every email the apps send</div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11.5px] text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" /> Active
        </span>
      </div>
    </div>
  );
}

const WEEKS = [
  { label: "W1", value: 52 },
  { label: "W2", value: 68 },
  { label: "W3", value: 61 },
  { label: "W4", value: 84 },
];

// Cell: the month's email sending week by week, drawn from the organisation's single email purse.
export function EmailPurseRender() {
  return (
    <div className={cn(CARD, "w-[460px] px-4 py-3.5 text-[12.5px]")}>
      <div className="flex items-start gap-2">
        <div>
          <div className="font-medium">Email Purse</div>
          <div className="text-[11px] text-muted-foreground">One balance for every app’s emails</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[18px] font-medium tracking-[-0.02em] tabular-nums">31,400</div>
          <div className="text-[11px] text-muted-foreground">sent this month</div>
        </div>
      </div>
      <div className="mt-4 flex h-[120px] items-end gap-4 border-b border-foreground/[0.08] px-2">
        {WEEKS.map((week, index) => (
          <div key={week.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10.5px] text-muted-foreground tabular-nums">{format(Math.round(week.value * 93))}</span>
            <span className={cn("block w-full rounded-t-md", index === WEEKS.length - 1 ? "bg-foreground/70" : "bg-foreground/[0.18]", styles.popIn)} style={{ height: `${week.value}%`, "--pop-delay": `${0.3 + index * 0.15}s` }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-4 px-2 text-[10.5px] text-muted-foreground">
        {WEEKS.map((week) => (
          <span key={week.label} className="flex-1 text-center">
            {week.label}
          </span>
        ))}
      </div>
    </div>
  );
}
