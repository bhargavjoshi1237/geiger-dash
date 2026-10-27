import {
  BarChart3,
  Check,
  Copy,
  DoorClosed,
  Eye,
  GitMerge,
  Hand,
  History,
  Lock,
  LogIn,
  Megaphone,
  Pause,
  PencilOff,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Timer,
  Undo,
  UserMinus,
  Users,
  Wand2,
  X,
  ArrowLeft,
  ArrowRightLeft,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, LINE, Typed } from "@/components/product-pages/mock_kit";
import {
  BOARD_TABS,
  Board,
  Button,
  CollabDialog,
  Column,
  CommentCard,
  Cursor,
  LaserTrail,
  Node,
  Note,
  NotesBar,
  NotesWindow,
  PANEL,
  SESSION_TABS,
  SessionPill,
  Switch,
  Toast,
  arcPoints,
} from "@/components/product-pages/apps/notes/notes_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Live sessions on Fieldnote's Atlas Coffee workshop: a GEIGER code, live cursors, the laser, follow mode, host controls and merging back.

const PEOPLE = ["Aisha Bennett", "Theo Lindqvist", "Hana Ito", "Samuel Okoro", "Clara Vidal"];
const CODE = "GEIGER-K7QM-4XPA";

const KEEP = ["The hand-lettered menus", "Roasting in view of the counter", "The long table at the harbour café"];
const CHANGE = ["Bags that look like every other roaster's", "Sleeves that tear when the cup is hot", "A menu board you can read from the queue"];
const QUESTIONS = ["Do we keep the anchor in the logo?", "One loyalty card, or one per café?"];

function ToolButton({ icon: Icon, active, className }) {
  return (
    <span className={cn("flex size-8 items-center justify-center rounded-md text-muted-foreground", active && "bg-foreground/[0.08] text-foreground", className)}>
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  );
}

// The session's top-bar cluster: who's here (hands and the host marked), the laser, a hand or reactions, and for hosts the Host button.
function SessionCluster({ me = "Aisha Bennett", host = true, hands = [], following, laser = false }) {
  const others = PEOPLE.filter((name) => name !== me);
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1.5 flex -space-x-1.5">
        {others.map((name) => (
          <span key={name} className={cn("relative rounded-full", following === name && "ring-2 ring-foreground ring-offset-2 ring-offset-surface-card dark:ring-offset-surface-subtle")}>
            <Avatar name={name} size={26} />
            {hands.includes(name) ? (
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-black">
                <Hand className="size-2.5" strokeWidth={2.5} />
              </span>
            ) : name === "Aisha Bennett" ? (
              <span className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full border border-foreground/[0.12] bg-surface-card dark:bg-surface-dialog">
                <ShieldCheck className="size-2.5 text-amber-500" strokeWidth={2.5} />
              </span>
            ) : null}
          </span>
        ))}
      </span>
      <ToolButton icon={Wand2} active={laser} className={laser ? "text-red-500" : undefined} />
      {host ? null : <ToolButton icon={Hand} />}
      <ToolButton icon={SmilePlus} />
      {host ? (
        <span className="ml-1 flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.12] bg-foreground/[0.04] px-2.5 text-[12px] font-medium text-foreground/85">
          <ShieldCheck className="size-3.5" strokeWidth={2} /> Host
          {hands.length ? <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">{hands.length}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

// A poll card: options with their share of the votes, voters' initials and the voting mode underneath.
function PollCard({ at, w = 300, question, options, mode = "Single choice", tally, selected, className }) {
  const total = options.reduce((sum, option) => sum + option.votes, 0);
  return (
    <Node at={at} w={w} selected={selected} className={cn("p-3.5 text-[12px]", className)}>
      <div className="flex items-center gap-2">
        <BarChart3 className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="truncate text-[13px] font-semibold">{question}</span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {options.map((option, index) => {
          const share = Math.round((option.votes / total) * 100);
          return (
            <div key={option.text} className={cn("relative flex items-center gap-2 overflow-hidden rounded-md border px-2.5 py-1.5", option.mine ? "border-foreground/30" : "border-foreground/[0.1]")}>
              <span
                className={cn("absolute inset-y-0 left-0 origin-left", option.mine ? "bg-foreground/[0.12]" : "bg-foreground/[0.06]", styles.fill)}
                style={{ width: `${share}%`, "--fill-delay": `${0.4 + index * 0.15}s` }}
              />
              <span className="relative min-w-0 flex-1 truncate text-foreground/90">{option.text}</span>
              {option.dots ? (
                <span className="relative flex gap-0.5">
                  {Array.from({ length: option.dots }, (_, dot) => (
                    <span key={dot} className="size-1.5 rounded-full bg-foreground/70" />
                  ))}
                </span>
              ) : null}
              {option.voters ? (
                <span className="relative flex -space-x-1">
                  {option.voters.map((name) => (
                    <span key={name} className="flex size-[18px] items-center justify-center rounded-full border border-foreground/[0.15] bg-surface-hover text-[8px] font-semibold">
                      {name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  ))}
                </span>
              ) : null}
              <span className="relative shrink-0 text-[11px] text-muted-foreground tabular-nums">
                <span className="font-semibold text-foreground">{option.votes}</span> · {share}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 text-[11px] text-muted-foreground">
        {mode} · {tally}
      </div>
    </Node>
  );
}

const WORDMARKS = [
  { text: "A — hand-lettered", votes: 3, voters: ["Aisha Bennett", "Hana Ito", "Clara Vidal"], mine: true },
  { text: "B — geometric", votes: 1, voters: ["Samuel Okoro"] },
  { text: "C — stencil", votes: 1, voters: ["Theo Lindqvist"] },
];

// A timer card counting down a round, its ring part-spent.
function TimerCard({ at, w = 210, label, time, spent = 0.3, className }) {
  const circumference = 2 * Math.PI * 24;
  return (
    <Node at={at} w={w} className={cn("flex items-center gap-3.5 p-3.5", className)}>
      <svg width="58" height="58" viewBox="0 0 58 58" className="shrink-0 -rotate-90 text-foreground" aria-hidden="true">
        <circle cx="29" cy="29" r="24" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="5" />
        <circle cx="29" cy="29" r="24" fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${circumference * (1 - spent)} ${circumference}`} className="stroke-amber-500" />
      </svg>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Timer className="size-3" /> {label}
        </div>
        <div className="text-[24px] leading-tight font-medium tracking-[-0.02em] tabular-nums">{time}</div>
        <div className="mt-1 flex gap-1.5 text-muted-foreground">
          <Pause className="size-3.5" />
          <RotateCcw className="size-3.5" />
        </div>
      </div>
    </Node>
  );
}

// Hero: Theo's view of the live workshop, following Aisha while she circles the poll with her laser and Hana types a note.
export function SessionHeroWindow() {
  return (
    <NotesWindow
      bar={
        <NotesBar live>
          <SessionCluster me="Theo Lindqvist" host={false} hands={["Samuel Okoro"]} following="Aisha Bennett" />
        </NotesBar>
      }
      activeTool={0}
      className="h-[700px] w-[1180px]"
    >
      <div className="absolute top-[22px] left-[32px]">
        <div className="text-[22px] font-bold tracking-[-0.015em]">Round two: what should the rebrand keep?</div>
        <div className="mt-1 text-[12px] text-muted-foreground">Atlas Coffee workshop · Fieldnote</div>
      </div>
      <Column at={[32, 92]} w={226} title="Keep" items={KEEP}>
        <div className="rounded-[5px] border border-foreground/40 bg-surface-card px-2.5 py-2 leading-[1.4] ring-1 ring-foreground/20 dark:bg-foreground/[0.06]">
          <Typed text="Say where every bean comes from" delay={1.4} />
        </div>
      </Column>
      <Column at={[274, 92]} w={226} title="Change" items={CHANGE} />
      <Column at={[516, 92]} w={226} title="Questions" items={QUESTIONS} />
      <PollCard at={[762, 92]} w={320} question="Which wordmark goes forward?" options={WORDMARKS} tally="5 voters" />
      <TimerCard at={[762, 296]} w={220} label="Round two" time="04:12" spent={0.42} />
      <CommentCard at={[516, 330]} w={226} name="Samuel Okoro">
        Can we test both wordmarks on the actual cup before we decide?
      </CommentCard>
      <Note at={[274, 386]} w={226}>
        Bring the roastery photos into the press kit.
      </Note>
      <LaserTrail points={arcPoints(900, 158, 140, 34, Math.PI * 0.9, Math.PI * 2.25, 24)} />
      <Cursor at={[994, 176]} name="Aisha Bennett" tone={0} />
      <Cursor at={[228, 344]} name="Hana Ito" tone={1} delay="-1.2s" />
      <Cursor at={[470, 252]} name="Clara Vidal" tone={2} delay="-3s" />
      <Cursor at={[700, 448]} name="Samuel Okoro" tone={3} delay="-4.4s" />
      <SessionPill dot action={<><X className="size-3" /> Stop</>} className="absolute top-3 left-1/2 z-[7] -translate-x-1/2">
        Following <span className="font-medium">Aisha Bennett</span>
      </SessionPill>
    </NotesWindow>
  );
}

// The host's board in a session, used behind the stage panels.
function HostBoard({ className, pill, rows = 3, children }) {
  return (
    <NotesWindow
      bar={
        <NotesBar live>
          <SessionCluster hands={["Samuel Okoro", "Theo Lindqvist"]} laser />
        </NotesBar>
      }
      activeTool={0}
      className={className}
    >
      <Column at={[24, 54]} w={210} title="Keep" items={KEEP.slice(0, rows)} />
      <Column at={[250, 54]} w={210} title="Change" items={CHANGE.slice(0, rows)} />
      {pill}
      {children}
    </NotesWindow>
  );
}

// Section stage: Aisha hosting the workshop, with the Collaborate dialog showing the session's code.
export function SessionStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <HostBoard
        className="absolute top-[36px] left-0 h-[600px] w-[720px]"
        pill={
          <SessionPill icon={Eye} action="Stop leading" className="absolute top-3 left-1/2 z-[7] -translate-x-1/2">
            3 people are following you
          </SessionPill>
        }
      >
        <Column at={[476, 54]} w={190} title="Questions" items={QUESTIONS} />
        <Note at={[250, 340]} w={210}>
          Kraft sleeve with the origin printed on the band.
        </Note>
        <LaserTrail points={arcPoints(360, 214, 128, 30, Math.PI * 0.9, Math.PI * 2.25, 22)} />
        <Cursor at={[176, 300]} name="Theo Lindqvist" tone={1} delay="-1s" />
        <Cursor at={[520, 260]} name="Hana Ito" tone={2} delay="-2.6s" />
        <Cursor at={[90, 430]} name="Samuel Okoro" tone={3} delay="-4s" />
      </HostBoard>
      <div className={cn("absolute top-0 left-[590px] z-[2]", styles.float)}>
        <CollabDialog live tabs={SESSION_TABS} active="Session">
          <div className="px-6 pt-6 pb-7">
            <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Session Active</div>
            <div className="mt-3 flex items-center justify-center gap-3 rounded-xl border border-foreground/[0.1] bg-foreground/[0.04] p-4">
              <span className="font-mono text-[19px] font-bold tracking-[0.12em]">{CODE}</span>
              <Copy className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mx-auto mt-3 max-w-[290px] text-center text-[11px] leading-[1.45] text-muted-foreground">Share this code with team members to let them join your workspace instantly.</p>
            <div className="mt-6 flex justify-center">
              <Button tone="red" icon={DoorClosed}>
                End Session
              </Button>
            </div>
          </div>
        </CollabDialog>
      </div>
    </div>
  );
}

// Cell: Clara joining from her own board with the session code.
export function JoinRender() {
  return (
    <CollabDialog tabs={BOARD_TABS} active="Join" footer={false} className="mx-auto w-[440px]">
      <div className="flex flex-col items-center px-8 pt-6 pb-7 text-center">
        <LogIn className="size-7 text-foreground/20" />
        <div className="mt-4 text-[14px] font-semibold">Join a Session</div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">Enter a session code to join a live collaborative workspace.</p>
        <div className="mt-5 w-full rounded-md border border-foreground/[0.14] bg-foreground/[0.04] px-3 py-2 text-center font-mono text-[13px] tracking-wider">
          <Typed text={CODE} delay={1.2} />
        </div>
        <Button primary icon={LogIn} className="mt-3 w-full">
          Join Session
        </Button>
      </div>
    </CollabDialog>
  );
}

const MEMBERS = [
  { name: "Aisha Bennett", note: "(You)", host: true },
  { name: "Theo Lindqvist" },
  { name: "Hana Ito" },
  { name: "Samuel Okoro" },
];

const MEMBER_ACTIONS = [
  [Eye, "Follow their view"],
  [Eye, "Make view-only"],
  [ShieldCheck, "Make co-host"],
  [ArrowRightLeft, "Make host…"],
];

// Cell: the Members tab with a request to join, and the actions for one member open.
export function MembersRender() {
  return (
    <div className="relative mx-auto h-[396px] w-[460px]">
      <CollabDialog live tabs={SESSION_TABS} active="Members" footer={false} className="w-[400px]">
        <div className="flex flex-col gap-2.5 px-4 py-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Requests <span className="rounded-full bg-foreground/[0.08] px-1.5 text-[10px] text-foreground">1</span>
            </div>
            <div className={cn("mt-2 flex items-center gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-2.5 py-1.5", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
              <Avatar name="Clara Vidal" size={24} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium">Clara Vidal</span>
                <span className="block text-[11px] text-muted-foreground">Wants to join</span>
              </span>
              <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground">
                <X className="size-3.5" />
              </span>
              <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">In Session (4)</div>
            <div className="mt-1.5 flex flex-col">
              {MEMBERS.map((member) => (
                <div key={member.name} className="flex items-center gap-2.5 rounded-md px-1 py-1">
                  <span className="relative">
                    <Avatar name={member.name} size={24} />
                    <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface-card bg-emerald-500 dark:border-surface-dialog" />
                  </span>
                  <span className="text-[12.5px]">{member.name}</span>
                  {member.note ? <span className="text-[11px] text-muted-foreground">{member.note}</span> : null}
                  {member.host ? <span className="rounded-full border border-foreground/[0.14] px-1.5 text-[10px] text-muted-foreground">Host</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollabDialog>
      <div className={cn(PANEL, "absolute top-[178px] right-0 w-[200px] p-1 text-[12px]", styles.float)}>
        <div className="flex items-center justify-between px-2 py-1.5 font-medium">
          Samuel Okoro <span className="text-[10px] font-normal tracking-wide text-muted-foreground uppercase">Editor</span>
        </div>
        <div className="my-1 h-px bg-foreground/[0.08]" />
        {MEMBER_ACTIONS.map(([Icon, label], index) => (
          <div key={label}>
            {index === 1 ? <div className="my-1 h-px bg-foreground/[0.08]" /> : null}
            <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", label === "Make co-host" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
              <Icon className="size-3.5 text-muted-foreground" />
              {label}
            </div>
          </div>
        ))}
        <div className="my-1 h-px bg-foreground/[0.08]" />
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-red-600 dark:text-red-400">
          <UserMinus className="size-3.5" /> Remove from session
        </div>
      </div>
    </div>
  );
}

// A small patch of board for the cells.
function MiniBoard({ className, children }) {
  return <Board className={cn("relative mx-auto h-[300px] w-[460px] flex-none rounded-xl border border-foreground/[0.08]", className)}>{children}</Board>;
}

// Cell: the three ways views move together, as the pills a session shows.
export function FollowRender() {
  return (
    <MiniBoard className="border-2 border-foreground/25">
      <Note at={[30, 190]} w={150} className="opacity-60">
        The hand-lettered menus
      </Note>
      <Note at={[270, 214]} w={160} className="opacity-60">
        One loyalty card, or one per café?
      </Note>
      <div className="absolute inset-x-0 top-5 flex flex-col items-center gap-2.5">
        {[
          <SessionPill key="following" dot action={<><X className="size-3" /> Stop</>}>
            Following <span className="font-medium">Hana Ito</span>
          </SessionPill>,
          <SessionPill key="presenting" icon={Lock}>
            <span className="font-medium">Aisha Bennett</span> is presenting — your view follows theirs
          </SessionPill>,
          <SessionPill key="leading" icon={Eye} action="Stop leading">
            3 people are following you
          </SessionPill>,
        ].map((pill, index) => (
          <div key={index} className={styles.popIn} style={{ "--pop-delay": `${0.3 + index * 0.2}s` }}>
            {pill}
          </div>
        ))}
      </div>
      <Cursor at={[196, 150]} name="Hana Ito" tone={1} />
    </MiniBoard>
  );
}

// Cell: a laser trail around a question, a raised hand and the reactions.
export function LaserRender() {
  return (
    <MiniBoard>
      <div className={cn(PANEL, "absolute top-3 right-3 flex items-center gap-0.5 rounded-lg p-1 shadow-md")}>
        <ToolButton icon={Wand2} active className="text-red-500" />
        <ToolButton icon={Hand} className="bg-amber-500/15 text-amber-600 dark:text-amber-300" />
        <ToolButton icon={SmilePlus} />
      </div>
      <SessionPill icon={Wand2} action="Esc" className="absolute top-3.5 left-3">
        Laser on — move to point
      </SessionPill>
      <Note at={[70, 120]} w={190}>
        Do we keep the anchor in the logo?
      </Note>
      <LaserTrail points={arcPoints(165, 145, 120, 46, Math.PI * 0.85, Math.PI * 2.4, 26)} />
      <Note at={[290, 132]} w={150} className="opacity-60">
        Kraft over gloss
      </Note>
      <div className={cn("absolute right-3 bottom-3", styles.popIn)} style={{ "--pop-delay": "0.7s" }}>
        <Toast title="Hand raised" body="The host can see it in the people list." className="w-[250px]" />
      </div>
    </MiniBoard>
  );
}

function ToggleRow({ label, hint, on }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-[12.5px] text-foreground">{label}</span>
        {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
      </span>
      <Switch on={on} />
    </div>
  );
}

function PanelSection({ title, aside, children }) {
  return (
    <div className={cn("flex flex-col gap-2.5 border-t px-3.5 py-3 first:border-t-0", LINE)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</span>
        {aside}
      </div>
      {children}
    </div>
  );
}

const PERMISSIONS = [
  ["Edit the board", true],
  ["Ask to join", true],
  ["Use the laser pointer", false],
  ["Run polls and timers", true],
  ["See each other's cursors", true],
];

// The host controls popover, with the view locked, an announcement being typed and two hands up.
function HostControlsPanel({ className }) {
  return (
    <div className={cn(PANEL, "flex w-[330px] flex-col text-[12px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Host controls</span>
        <span className="ml-auto rounded-full border border-foreground/[0.12] px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Host</span>
      </div>
      <PanelSection title="Attention">
        <div className="grid grid-cols-2 gap-2">
          <Button icon={Users} className="h-8 text-[11.5px]">
            Bring everyone
          </Button>
          <Button icon={Sparkles} className="h-8 border-foreground/30 bg-foreground/[0.06] text-[11.5px]">
            Spotlight node
          </Button>
        </div>
        <ToggleRow label="Lock everyone's view to mine" hint="Everyone follows you until you release." on />
        <div className="flex items-center gap-1.5">
          <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-foreground/[0.14] bg-surface-card px-2 text-[12px] dark:bg-foreground/[0.04]">
            <Megaphone className="size-3.5 shrink-0 text-muted-foreground" />
            <Typed text="Five minutes left on this round" delay={1.5} />
          </div>
          <span className="flex size-8 items-center justify-center text-muted-foreground">
            <Send className="size-3.5" />
          </span>
        </div>
      </PanelSection>
      <PanelSection title="Raised hands (2)" aside={<span className="text-[11px] text-muted-foreground">Lower all</span>}>
        {["Samuel Okoro", "Theo Lindqvist"].map((name, index) => (
          <div key={name} className={cn("flex items-center gap-2", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.2}s` }}>
            <span className="w-3 text-right text-[11px] text-muted-foreground tabular-nums">{index + 1}</span>
            <Avatar name={name} size={18} />
            <span className="flex-1 text-[12.5px]">{name}</span>
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground">
              <Hand className="size-3" /> Lower
            </span>
          </div>
        ))}
      </PanelSection>
      <PanelSection title="Participants can">
        {PERMISSIONS.map(([label, on]) => (
          <ToggleRow key={label} label={label} on={on} />
        ))}
      </PanelSection>
      <div className={cn("grid grid-cols-2 gap-2 border-t px-3.5 py-3", LINE)}>
        <Button icon={Pause} className="h-8 text-[11.5px]">
          Pause all
        </Button>
        <Button icon={DoorClosed} className="h-8 text-[11.5px] text-red-600 dark:text-red-400">
          End for all
        </Button>
      </div>
    </div>
  );
}

// Section stage: the host's board with a card spotlit, and Host controls open over it.
export function HostStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <HostBoard
        rows={2}
        className="absolute top-[30px] left-0 h-[600px] w-[700px]"
        pill={
          <SessionPill icon={Lock} action="Release" className="absolute top-3 left-1/2 z-[7] -translate-x-1/2">
            Everyone’s view follows yours
          </SessionPill>
        }
      >
        <div className="absolute top-[238px] left-[244px] h-[200px] w-[340px] rounded-lg border-2 border-foreground/60 shadow-[0_0_0_6px] shadow-foreground/10" />
        <PollCard at={[250, 244]} w={328} question="Which wordmark goes forward?" options={WORDMARKS} tally="5 voters" />
        <TimerCard at={[24, 250]} w={200} label="Round two" time="04:12" spent={0.42} />
        <Cursor at={[540, 392]} />
      </HostBoard>
      <div className={cn("absolute top-0 left-[640px] z-[2]", styles.float)}>
        <HostControlsPanel />
      </div>
    </div>
  );
}

// Cell: the room paused, as the host's switches and a participant's screen show it.
export function PauseRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className={cn(PANEL, "absolute top-0 left-0 w-[250px] text-[12px] shadow-xl")}>
        <PanelSection title="Participants can">
          {PERMISSIONS.map(([label]) => (
            <ToggleRow key={label} label={label} on={false} />
          ))}
        </PanelSection>
        <div className={cn("border-t px-3.5 py-3", LINE)}>
          <span className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-[11.5px] font-medium text-amber-700 dark:text-amber-300">
            <Play className="size-3.5" /> Resume all
          </span>
        </div>
      </div>
      <MiniBoard className="absolute top-[40px] right-0 h-[250px] w-[230px]">
        <SessionPill icon={PencilOff} className="absolute top-3 left-2.5 w-[206px] items-start rounded-xl py-2 whitespace-normal">
          The host paused editing — you can still look around
        </SessionPill>
        <Note at={[22, 92]} w={150} className="opacity-70">
          Kraft over gloss
        </Note>
        <div className={cn("absolute right-2 bottom-2 left-2", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
          <Toast tone="warning" title="Session paused" body="Editing, joining, cursors and the laser are limited to hosts." className="w-full px-3" />
        </div>
      </MiniBoard>
    </div>
  );
}

// Cell: a dot-voting poll and a round timer on the board.
export function PollTimerRender() {
  return (
    <MiniBoard>
      <PollCard
        at={[16, 18]}
        w={278}
        question="Where should the launch be?"
        mode="Dot voting"
        tally="15 dots · 1 left"
        options={[
          { text: "Harbour café", votes: 8, dots: 2, mine: true },
          { text: "The roastery", votes: 5 },
          { text: "Market stall", votes: 2 },
        ]}
      />
      <TimerCard at={[230, 196]} w={214} label="Vote closes" time="01:30" spent={0.7} />
      <Cursor at={[150, 220]} name="Clara Vidal" tone={2} />
    </MiniBoard>
  );
}

const PAST_SESSIONS = [
  { code: CODE, people: ["Aisha Bennett", "Theo Lindqvist", "Hana Ito"], merged: false, date: "27/10/2026" },
  { code: "GEIGER-A2TB-9WNC", people: ["Aisha Bennett", "Hana Ito", "Samuel Okoro"], merged: false, date: "21/10/2026" },
  { code: "GEIGER-S9LH-3RDE", people: ["Aisha Bennett", "Clara Vidal"], merged: true, date: "12/10/2026" },
];

// Section stage: back on her own board, Aisha opens the session in the Merge tab and merges its six new cards in.
export function MergeStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NotesWindow crumbs={["Atlas Coffee rebrand — workshop"]} activeTool={0} className="absolute top-[40px] left-0 h-[580px] w-[640px]">
        <Column at={[24, 24]} w={200} title="Moodboard" items={["Warm neutrals, roasted browns", "Kraft paper, no gloss"]} />
        {[
          <Column key="keep" at={[240, 24]} w={200} title="Keep" items={KEEP.slice(0, 2)} />,
          <Note key="note" at={[24, 196]} w={200}>
            Say where every bean comes from
          </Note>,
          <Column key="change" at={[240, 220]} w={200} title="Change" items={CHANGE.slice(0, 2)} />,
          <PollCard key="poll" at={[24, 276]} w={200} question="Wordmark" options={WORDMARKS.map((option) => ({ ...option, voters: null, text: option.text.split(" — ")[0] }))} tally="5 voters" />,
        ].map((node, index) => (
          <div key={index} className={styles.popIn} style={{ "--pop-delay": `${0.6 + index * 0.12}s` }}>
            {node}
          </div>
        ))}
        <Cursor at={[470, 120]} />
      </NotesWindow>
      <div className={cn("absolute top-0 left-[560px] z-[2]", styles.float)}>
        <CollabDialog tabs={BOARD_TABS} active="Merge" className="w-[420px]">
          <div className="flex flex-col gap-4 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-0.5 rounded-xl border-2 border-dashed border-foreground/[0.14] bg-foreground/[0.03] p-4">
                <span className="text-[24px] font-bold text-emerald-600 tabular-nums dark:text-emerald-400">6</span>
                <span className="text-[11.5px] font-medium text-muted-foreground">New Nodes</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-xl border-2 border-dashed border-foreground/[0.14] bg-foreground/[0.03] p-4">
                <span className="text-[24px] font-bold text-foreground/80 tabular-nums">2</span>
                <span className="text-[11.5px] font-medium text-muted-foreground">Modified</span>
              </div>
            </div>
            <p className="text-[12px] leading-[1.5] text-muted-foreground">Merging will combine these changes into your current board. Your local unique nodes will be preserved.</p>
          </div>
          <div className={cn("flex gap-2 border-t px-4 py-3", LINE)}>
            <Button icon={ArrowLeft} className="w-[30%]">
              Back
            </Button>
            <Button tone="emerald" className="flex-1">
              Merge Changes
            </Button>
          </div>
        </CollabDialog>
      </div>
    </div>
  );
}

// Cell: the Merge tab's list of hosted sessions, and undoing the one already merged.
export function RollbackRender() {
  return (
    <div className="relative mx-auto h-[310px] w-[460px]">
      <CollabDialog tabs={BOARD_TABS} active="Merge" footer={false} className="w-[400px]">
        <div className="flex flex-col gap-2 p-3">
          {PAST_SESSIONS.map((session) => (
            <div key={session.code} className={cn("flex flex-col gap-1.5 rounded-lg border px-3 py-2", session.merged ? "border-foreground/30 bg-foreground/[0.06]" : "border-foreground/[0.1] bg-foreground/[0.02]")}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-medium">{session.code}</span>
                <span className="flex items-center grayscale">
                  <AvatarStack names={session.people} size={18} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px]",
                    session.merged ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-foreground/[0.1] bg-foreground/[0.04] text-muted-foreground",
                  )}
                >
                  <GitMerge className="size-3" /> {session.merged ? "Merged" : "Not Merged"}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">{session.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CollabDialog>
      <div className={cn(PANEL, "absolute top-[150px] right-0 w-[230px] p-3.5 text-center text-[12px]", styles.float)}>
        <History className="mx-auto size-5 text-foreground/25" />
        <div className="mt-1.5 text-[13.5px] font-medium">Undo Merge</div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Merged on <span className="text-foreground">12/10/2026</span> at <span className="text-foreground">16:42</span>
        </p>
        <p className="mt-2 text-[11px] leading-[1.4] text-muted-foreground">Rolling back will restore the board state to exactly how it was before the merge.</p>
        <Button tone="amber" icon={Undo} className="mt-3 w-full">
          Rollback
        </Button>
      </div>
    </div>
  );
}

const ACCESS = [
  { name: "Theo Lindqvist", level: "Can edit" },
  { name: "Hana Ito", level: "Manage" },
  { name: "Samuel Okoro", level: "No access" },
];

function LevelButton({ children, strong }) {
  return (
    <span className={cn("flex h-7 items-center gap-1 rounded-md border px-2 text-[11.5px]", strong ? "border-foreground/25 text-foreground" : "border-foreground/[0.12] text-foreground/80")}>
      {children} <ChevronDown className="size-3 text-muted-foreground" />
    </span>
  );
}

// Cell: Manage Access for the workshop board: keyed entry, a default level and per-member levels.
export function AccessRender() {
  return (
    <div className={cn(PANEL, "mx-auto w-[440px] px-5 py-4 text-[12px] shadow-xl")}>
      <div className="text-[15px] font-semibold">Manage Access</div>
      <p className="mt-1 text-[12px] leading-[1.45] text-muted-foreground">
        Control who in this project can enter, view, or edit <span className="font-medium text-foreground">Atlas Coffee rebrand — workshop</span>.
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Entry</span>
        <span className="flex overflow-hidden rounded-md border border-foreground/[0.12] text-[11.5px]">
          <span className="px-2.5 py-1 text-muted-foreground">Keyless</span>
          <span className="border-l border-foreground/[0.12] bg-foreground/[0.08] px-2.5 py-1 font-medium">Keyed</span>
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">Members must enter the access key to open this board.</p>
      <div className="mt-2 flex items-center gap-2 rounded-md border border-foreground/[0.14] bg-foreground/[0.03] px-2.5 py-1.5">
        <KeyRound className="size-3.5 text-muted-foreground" />
        <span className="font-mono tracking-[0.2em] text-foreground/80">atlas-launch</span>
      </div>
      <div className={cn("mt-3 flex items-center justify-between border-y py-2", LINE)}>
        <span>
          <span className="block text-[12.5px]">Everyone in the project</span>
          <span className="block text-[11px] text-muted-foreground">Default access for members without a specific level.</span>
        </span>
        <LevelButton>View only</LevelButton>
      </div>
      <div className="mt-2.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Members</div>
      <div className="mt-1.5 flex flex-col gap-1">
        {ACCESS.map((member) => (
          <div key={member.name} className="flex items-center gap-2.5 py-0.5">
            <Avatar name={member.name} size={22} />
            <span className="flex-1 text-[12.5px]">{member.name}</span>
            <LevelButton strong={member.level === "Manage"}>{member.level}</LevelButton>
          </div>
        ))}
      </div>
    </div>
  );
}
