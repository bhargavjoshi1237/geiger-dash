import {
  AlignLeft,
  Braces,
  Check,
  Copy,
  FileText,
  Hand,
  Headset,
  Image as ImageIcon,
  Lock,
  LogIn,
  Mail,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  PhoneOff,
  Pin,
  Play,
  ArrowRightLeft,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  StickyNote,
  UserMinus,
  Users,
  Video,
  VideoOff,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import {
  BOARD_TABS,
  Board,
  Button,
  CollabDialog,
  Column,
  CommentCard,
  Node,
  Note,
  NotesBar,
  NotesWindow,
  PANEL,
  Switch,
  TableCard,
  ToolRail,
  Toast,
  Wires,
} from "@/components/product-pages/apps/notes/notes_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Meetings and the AI card on Fieldnote's Atlas Coffee boards: the docked call, host tools, huddle spots, the AI assistant and action items.

const MEET_CODE = "MEET-7HQX-2LMD";

// The top bar while a meeting runs: LIVE, the elapsed time, the code to copy and how many are in.
function MeetStatus({ total = 5 }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
        <span className={cn("size-1.5 rounded-full bg-red-500 text-red-500", styles.pulse)} /> LIVE
      </span>
      <span className="font-mono text-[12px] text-foreground tabular-nums">18:42</span>
      <span className="flex items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2 py-1 font-mono text-[11px]">
        {MEET_CODE}
        <Copy className="size-3" />
      </span>
      <span className="flex items-center gap-1 text-[12px]">
        <Users className="size-4" strokeWidth={2} /> {total}
      </span>
    </span>
  );
}

const TILE_LIGHT = {
  "Aisha Bennett": "radial-gradient(70% 80% at 30% 20%, color-mix(in oklab, var(--foreground) 16%, transparent), transparent 70%)",
  "Theo Lindqvist": "radial-gradient(70% 80% at 75% 15%, color-mix(in oklab, var(--foreground) 14%, transparent), transparent 70%)",
  "Hana Ito": "radial-gradient(80% 70% at 20% 30%, color-mix(in oklab, var(--foreground) 12%, transparent), transparent 70%)",
  "Samuel Okoro": "radial-gradient(70% 80% at 60% 10%, color-mix(in oklab, var(--foreground) 15%, transparent), transparent 70%)",
};

// A camera feed drawn as a soft-lit head and shoulders.
function Feed({ name, scale = 1 }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-foreground/[0.07]" style={{ backgroundImage: TILE_LIGHT[name] }}>
      <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full text-foreground" aria-hidden="true">
        <g transform={`translate(80 90) scale(${scale}) translate(-80 -90)`}>
          <circle cx="80" cy="40" r="16" fill="currentColor" fillOpacity="0.22" />
          <path d="M44 92 C 46 68, 60 60, 80 60 C 100 60, 114 68, 116 92 Z" fill="currentColor" fillOpacity="0.16" />
        </g>
      </svg>
    </div>
  );
}

// A meeting tile: the feed or an avatar, the name with host and mic state, and any hand or spotlight badge.
function VideoTile({ name, label, cam = true, mic = true, host = false, hand = false, spotlight = false, sharing = false, menu = false, className, children }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-card dark:bg-surface-subtle", hand && "border-amber-500/50", className)}>
      {children ?? (cam ? <Feed name={name} /> : <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.04]"><Avatar name={name} size={48} /></div>)}
      <div className="absolute top-2 left-2 flex gap-1.5">
        {hand ? (
          <span className={cn("flex items-center gap-1 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-black", styles.popIn)} style={{ "--pop-delay": "0.8s" }}>
            <Hand className="size-3" /> Hand raised
          </span>
        ) : null}
        {spotlight ? (
          <span className="flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
            <Pin className="size-3" /> Spotlight
          </span>
        ) : null}
      </div>
      {menu ? (
        <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-black/45 text-white">
          <MoreHorizontal className="size-4" />
        </span>
      ) : null}
      <div className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 text-white">
        <span className="truncate text-[11px] font-medium">{label ?? name}</span>
        {host ? <span className="text-[10px] text-amber-300">Host</span> : null}
        {mic ? <Mic className="size-3 shrink-0 text-white/70" /> : <MicOff className="size-3 shrink-0 text-red-400" />}
        {sharing ? <MonitorUp className="size-3 shrink-0 text-emerald-400" /> : null}
      </div>
    </div>
  );
}

function RoundButton({ icon: Icon, on = true, className, children }) {
  return (
    <span
      className={cn(
        "relative flex size-11 items-center justify-center rounded-full border",
        on ? "border-foreground/[0.12] bg-foreground/[0.06] text-foreground" : "border-transparent bg-red-500/10 text-red-600 dark:text-red-300",
        className,
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} />
      {children}
    </span>
  );
}

// The meeting's control bar: mic, camera, screen share, hand, reactions, host tools, Leave and End for all.
function ControlBar({ sharing = false, hands = 1 }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center gap-2.5 border-t px-4 py-3", LINE)}>
      <RoundButton icon={Mic} />
      <RoundButton icon={Video} />
      <RoundButton icon={MonitorUp} on={sharing} />
      <RoundButton icon={Hand} />
      <RoundButton icon={SmilePlus} />
      <RoundButton icon={ShieldCheck}>
        {hands ? <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">{hands}</span> : null}
      </RoundButton>
      <span className="ml-1 flex h-11 items-center gap-2 rounded-full bg-red-600 px-5 text-[13px] font-semibold text-white">
        <PhoneOff className="size-[18px]" /> Leave
      </span>
      <span className="flex h-11 items-center rounded-full border border-foreground/[0.12] px-4 text-[13px] font-medium text-muted-foreground">End for all</span>
    </div>
  );
}

// What Aisha is sharing: the packaging board, with a note being typed.
function SharedBoard() {
  return (
    <Board className="absolute inset-0">
      <div className="absolute top-5 left-6 text-[22px] font-bold tracking-[-0.015em]">Packaging, round two</div>
      <svg viewBox="0 0 200 240" className="absolute top-[70px] left-[40px] h-[250px] w-[210px] text-foreground" aria-hidden="true">
        <path d="M40 20 L160 20 L170 60 L170 225 L30 225 L30 60 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M30 60 L170 60" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
        <rect x="30" y="140" width="140" height="34" fill="currentColor" fillOpacity="0.16" />
        <text x="100" y="112" textAnchor="middle" className="fill-foreground text-[17px] font-semibold">
          Atlas
        </text>
        <text x="100" y="161" textAnchor="middle" className="fill-foreground/70 text-[9px] tracking-[0.2em]">
          SINGLE ORIGIN
        </text>
      </svg>
      <Column at={[300, 76]} w={230} title="Bag" items={["Kraft, matt, no window", "One-colour print", "Origin on the band"]} />
      <Note at={[300, 290]} w={230} className="border-foreground/40 ring-1 ring-foreground/20">
        <Typed text="Print the farm on the back" delay={1.6} />
      </Note>
      <Column at={[560, 76]} w={230} title="Sleeve" items={["Same kraft as the bag", ["Test the sleeve when the cup is hot", true]]} />
      <CommentCard at={[560, 270]} w={230} name="Hana Ito">
        Atlas want the farm named on every bag, not just the band.
      </CommentCard>
    </Board>
  );
}

// Hero: the meeting docked under the workshop's top bar, Aisha sharing the packaging board with the team in the filmstrip.
export function MeetingHeroWindow() {
  return (
    <Window className="h-[700px] w-[1180px]">
      <NotesBar crumbs={["Atlas Coffee rebrand — workshop"]}>
        <MeetStatus />
      </NotesBar>
      <div className="flex min-h-0 flex-1">
        <ToolRail active={-1} />
        <div className="flex min-w-0 flex-1 flex-col bg-background/60">
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
            <VideoTile name="You" sharing className="min-h-0 flex-1">
              <SharedBoard />
            </VideoTile>
            <div className="flex shrink-0 gap-3">
              <VideoTile name="Aisha Bennett" label="You" host className="aspect-video w-[200px]" />
              <VideoTile name="Theo Lindqvist" className="aspect-video w-[200px]" />
              <VideoTile name="Hana Ito" className="aspect-video w-[200px]" />
              <VideoTile name="Samuel Okoro" hand className="aspect-video w-[200px]" />
              <VideoTile name="Clara Vidal" cam={false} mic={false} className="aspect-video w-[200px]" />
            </div>
          </div>
          <ControlBar sharing />
        </div>
      </div>
    </Window>
  );
}

// The host tools popover: mute all, lower hands, what participants can do, the lock and the hands queue.
function HostToolsPanel({ className }) {
  return (
    <div className={cn(PANEL, "w-[290px] text-[12px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
        <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[13px] font-medium">Host tools</span>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
        <Button icon={MicOff} className="h-8 text-[11.5px]">
          Mute all
        </Button>
        <Button icon={Hand} className="h-8 text-[11.5px]">
          Lower all hands
        </Button>
      </div>
      <div className={cn("flex flex-col gap-2 border-t px-3.5 py-3", LINE)}>
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Participants can</span>
        {[
          ["Unmute themselves", true],
          ["Start their video", true],
          ["Share their screen", false],
        ].map(([label, on]) => (
          <span key={label} className="flex items-center justify-between text-[12.5px]">
            {label}
            <Switch on={on} />
          </span>
        ))}
      </div>
      <div className={cn("border-t px-3.5 py-3", LINE)}>
        <span className="flex items-center justify-between text-[12.5px]">
          Lock the meeting
          <Switch on />
        </span>
        <p className="mt-1 text-[11px] text-muted-foreground">Nobody new can join with the code while it’s locked.</p>
      </div>
      <div className={cn("border-t px-3.5 py-3", LINE)}>
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Raised hands (1)</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="w-3 text-right text-[11px] text-muted-foreground tabular-nums">1</span>
          <span className="flex-1 text-[12.5px]">Samuel Okoro</span>
          <span className="text-[11px] text-muted-foreground">Lower</span>
        </div>
      </div>
    </div>
  );
}

// Section stage: the call in tiles over the workshop board, with Host tools open and the meeting locked.
export function MeetStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-[24px] left-0 h-[540px] w-[760px]">
        <NotesBar crumbs={["Atlas Coffee rebrand — workshop"]} tools={false}>
          <MeetStatus />
        </NotesBar>
        <div className="flex min-h-0 flex-1">
          <ToolRail active={-1} />
          <div className="flex min-w-0 flex-1 flex-col bg-background/60">
            <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3 p-3.5">
              <VideoTile name="Theo Lindqvist" />
              <VideoTile name="Hana Ito" mic={false} />
              <VideoTile name="Samuel Okoro" hand />
              <VideoTile name="Clara Vidal" cam={false} />
              <VideoTile name="Aisha Bennett" label="You" host />
            </div>
            <ControlBar />
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-0 left-[690px] z-[2]", styles.float)}>
        <HostToolsPanel />
      </div>
    </div>
  );
}

// A huddle spot card, live or waiting.
function HuddleCard({ at, w = 236, title, topic, live = false, code, className }) {
  return (
    <Node at={at} w={w} className={cn("flex flex-col gap-2 p-3 text-[12px]", className)}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-foreground/[0.07]">
          <Headset className="size-4 text-muted-foreground" strokeWidth={1.75} />
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Huddle spot</span>
        {live ? (
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className={cn("size-1.5 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> Live
          </span>
        ) : null}
      </div>
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="mt-0.5 text-[11.5px] leading-[1.4] text-muted-foreground">{topic}</div>
      </div>
      {code ? (
        <div className="text-[10px] text-muted-foreground">
          Room <span className="font-mono text-foreground">{code}</span>
        </div>
      ) : null}
      <span className={cn("flex h-8 items-center justify-center gap-1.5 rounded-md text-[12px] font-medium", live ? "bg-foreground/[0.07] text-foreground" : "bg-foreground text-background")}>
        {live ? <LogIn className="size-3.5" /> : <Video className="size-3.5" />}
        {live ? "You’re in this huddle" : "Start huddle"}
      </span>
    </Node>
  );
}

// Cell: two huddle spots on the board, one with a call running.
export function HuddleRender() {
  return (
    <Board className="relative mx-auto h-[300px] w-[460px] flex-none rounded-xl border border-foreground/[0.08]">
      <HuddleCard at={[16, 20]} w={210} title="Packaging crit" topic="Ten minutes on the bag before the client call." live code={MEET_CODE} />
      <HuddleCard at={[236, 72]} w={208} title="Menu boards" topic="Drop in to talk it through." />
      <Note at={[24, 236]} w={180} className="opacity-70">
        Kraft, matt, no window
      </Note>
    </Board>
  );
}

// Cell: the Meeting tab, starting one or joining with a code.
export function MeetTabRender() {
  return (
    <CollabDialog tabs={BOARD_TABS} active="Meeting" footer={false} className="mx-auto w-[440px]">
      <div className="flex flex-col items-center px-8 pt-5 pb-6 text-center">
        <Video className="size-7 text-foreground/20" />
        <div className="mt-3 text-[14px] font-semibold">Start a Meeting</div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">Video, audio, and screen sharing — peer to peer, with its own code.</p>
        <div className="mt-4 flex gap-2">
          <Button primary icon={Video} className="min-w-[150px]">
            Start Meeting
          </Button>
          <Button icon={LogIn} className="bg-foreground/[0.06]">
            Join
          </Button>
        </div>
        <div className="mt-4 w-full rounded-md border border-foreground/[0.14] bg-foreground/[0.04] px-3 py-2 font-mono text-[13px] tracking-wider">
          <Typed text={MEET_CODE} delay={1.2} />
        </div>
        <Button icon={LogIn} className="mt-2.5 w-full">
          Join Meeting
        </Button>
      </div>
    </CollabDialog>
  );
}

const TILE_ACTIONS = [
  [MicOff, "Mute"],
  [VideoOff, "Stop video"],
  [Hand, "Lower hand"],
  null,
  [Pin, "Spotlight for everyone"],
  [ArrowRightLeft, "Make host"],
];

// Cell: the host's menu on Samuel's tile.
export function ParticipantMenuRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <VideoTile name="Samuel Okoro" hand menu className="absolute top-0 left-0 h-[220px] w-[330px]" />
      <div className={cn(PANEL, "absolute top-[38px] right-0 w-[214px] p-1 text-[12px]", styles.float)}>
        <div className="px-2 py-1.5 font-medium">Samuel Okoro</div>
        <div className="my-1 h-px bg-foreground/[0.08]" />
        {TILE_ACTIONS.map((action, index) =>
          action ? (
            <div key={action[1]} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", action[1] === "Spotlight for everyone" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
              {(() => {
                const Icon = action[0];
                return <Icon className="size-3.5 text-muted-foreground" />;
              })()}
              {action[1]}
            </div>
          ) : (
            <div key={index} className="my-1 h-px bg-foreground/[0.08]" />
          ),
        )}
        <div className="my-1 h-px bg-foreground/[0.08]" />
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-red-600 dark:text-red-400">
          <UserMinus className="size-3.5" /> Remove from meeting
        </div>
      </div>
    </div>
  );
}

// Cell: the top bar during a call, the code copied, and the states a tile can show.
export function StatusRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <div className="flex h-12 items-center gap-2.5 rounded-xl border border-foreground/[0.1] bg-surface-card px-3.5 text-[13px] text-muted-foreground shadow-lg dark:bg-surface-subtle">
        <MeetStatus />
      </div>
      <div className={cn("absolute top-[62px] left-[96px]", styles.popIn)} style={{ "--pop-delay": "0.6s" }}>
        <Toast title="Meeting code copied" className="w-[230px]" />
      </div>
      <div className="absolute inset-x-0 top-[134px] grid grid-cols-3 gap-2.5">
        <VideoTile name="Theo Lindqvist" spotlight className="h-[150px]" />
        <VideoTile name="Samuel Okoro" hand className="h-[150px]" />
        <VideoTile name="Clara Vidal" cam={false} mic={false} className="h-[150px]" />
      </div>
    </div>
  );
}

const AI_ACTIONS = ["Summarize", "Cluster", "Brainstorm", "Action items", "Custom"];

// The AI assistant card: its connections and Run button, the action picker when selected, the result and Spawn as notes.
function AiCard({ at, w = 330, action, connected, selected = true, output, itemsTitle, items = [], prompt, stamp = "27/10/2026, 11:52:08", className }) {
  return (
    <Node at={at} w={w} selected={selected} className={cn("flex flex-col text-[12px]", className)}>
      <div className={cn("flex items-center gap-2 border-b px-3 py-2", LINE)}>
        <Sparkles className="size-4 shrink-0" strokeWidth={1.75} />
        <span className="text-[13px] font-semibold whitespace-nowrap">AI assistant</span>
        <span className="rounded-full border border-foreground/[0.12] px-2 py-0.5 text-[10px] whitespace-nowrap text-muted-foreground">{connected} connected</span>
        <span className="ml-auto flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[11.5px] font-medium whitespace-nowrap text-background">
          <Play className="size-3" /> {action}
        </span>
      </div>
      {selected ? (
        <div className={cn("flex flex-col gap-2 border-b px-3 py-2", LINE)}>
          <div className="flex flex-wrap gap-1">
            {AI_ACTIONS.map((item) => (
              <span key={item} className={cn("rounded-md px-2 py-1 text-[11px]", item === action ? "bg-foreground/[0.09] text-foreground" : "text-muted-foreground")}>
                {item}
              </span>
            ))}
          </div>
          {prompt ? <div className="rounded-md border border-foreground/[0.14] bg-foreground/[0.03] px-2 py-1.5 text-[11.5px] leading-[1.45]">{prompt}</div> : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 px-3 py-2.5 text-[12.5px] leading-[1.5]">
        {output ? <p className="text-foreground/90">{output}</p> : null}
        {items.length ? (
          <div>
            <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{itemsTitle}</div>
            <ul className="ml-4 list-disc space-y-0.5 text-foreground/90">
              {items.map((item, index) => (
                <li key={item} className={styles.popIn} style={{ "--pop-delay": `${0.4 + index * 0.12}s` }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {!output && !items.length ? <p className="text-[11.5px] text-muted-foreground">Connect notes, to-dos or tables to this node, pick an action and press run.</p> : null}
      </div>
      {output || items.length ? (
        <div className={cn("mt-auto flex items-center gap-2 border-t px-3 py-1.5", LINE)}>
          <span className="mr-auto truncate text-[10px] text-muted-foreground tabular-nums">{stamp}</span>
          <span className="flex h-6 items-center gap-1.5 rounded-md bg-foreground/[0.07] px-2 text-[11px] text-foreground">
            <StickyNote className="size-3.5" /> Spawn as notes
          </span>
        </div>
      ) : null}
    </Node>
  );
}

const THEMES = ["Keep what’s made by hand", "Say where the coffee comes from", "Make the menu easy to read from the queue"];

// Section stage: workshop notes, café visits and a comment wired into an AI card that clusters them, with the themes spawned as notes.
export function AiStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NotesWindow crumbs={["Atlas Coffee rebrand — workshop"]} activeTool={-1} className="absolute top-0 left-0 h-[660px] w-[1000px]">
        <Wires
          paths={[
            { d: "M240 110 C 270 110, 270 140, 298 140", dashed: true, flow: true },
            { d: "M240 316 C 272 316, 270 180, 298 180", dashed: true, flow: true },
            { d: "M240 452 C 280 452, 276 220, 298 220", dashed: true, flow: true },
            { d: "M680 150 C 700 150, 700 66, 718 66", arrow: true, strong: true },
            { d: "M680 174 C 700 174, 700 160, 718 160", arrow: true, strong: true },
            { d: "M680 198 C 702 198, 700 254, 718 254", arrow: true, strong: true },
          ]}
        />
        <Column at={[24, 24]} w={216} title="What we heard" items={["Customers love the hand-lettered menus", "Nobody can read the board from the queue", "Regulars ask where the beans are from"]} />
        <TableCard
          at={[24, 252]}
          w={216}
          columns={["Café visit", "Mentions"]}
          rows={[
            ["Menu board", "9"],
            ["Bean origin", "6"],
            ["Loyalty card", "2"],
          ]}
          numeric={[1]}
        />
        <CommentCard at={[24, 410]} w={216} name="Clara Vidal">
          Atlas lit up at the hand-drawn type. Keep it.
        </CommentCard>
        <AiCard
          at={[300, 40]}
          w={380}
          action="Cluster"
          connected={3}
          output="Three themes run through the café visits, the workshop notes and the client’s reaction."
          itemsTitle="Themes"
          items={THEMES}
        />
        {THEMES.map((theme, index) => (
          <div key={theme} className={styles.popIn} style={{ "--pop-delay": `${1 + index * 0.18}s` }}>
            <Note at={[720, 40 + index * 94]} w={210}>
              {theme}
            </Note>
          </div>
        ))}
        <div className={cn("absolute top-[330px] left-[716px]", styles.popIn)} style={{ "--pop-delay": "1.6s" }}>
          <Toast title="Added 3 notes" className="w-[220px]" />
        </div>
      </NotesWindow>
    </div>
  );
}

// Cell: a Custom prompt over two connected cards.
export function AiCustomRender() {
  return (
    <Board className="relative mx-auto h-[300px] w-[460px] flex-none rounded-xl border border-foreground/[0.08]">
      <Wires
        paths={[
          { d: "M118 64 C 130 64, 128 96, 140 96", dashed: true, flow: true },
          { d: "M118 214 C 130 214, 128 150, 140 150", dashed: true, flow: true },
        ]}
      />
      <Note at={[10, 34]} w={108} className="px-2.5 text-[11px]">
        Atlas lit up at the hand-drawn type
      </Note>
      <Note at={[10, 184]} w={108} className="px-2.5 text-[11px]">
        They asked twice about the bag price
      </Note>
      <AiCard
        at={[142, 24]}
        w={308}
        action="Custom"
        connected={2}
        prompt={<Typed text="What did Atlas react to most?" delay={1.3} />}
      />
    </Board>
  );
}

// Cell: Brainstorm's ideas, ready to spawn as notes.
export function AiBrainstormRender() {
  return (
    <Board className="relative mx-auto h-[300px] w-[460px] flex-none rounded-xl border border-foreground/[0.08]">
      <AiCard
        at={[40, 16]}
        w={380}
        selected={false}
        action="Brainstorm"
        connected={4}
        itemsTitle="Items"
        items={["A stamp for the loyalty card, carved by hand", "Farm names on the menu board", "A tasting flight at the launch", "Kraft sleeves printed in one colour", "A map of the farms on the café wall"]}
      />
    </Board>
  );
}

const ACTIONS = ["Send Atlas the final wordmark files — Theo", "Order 2,000 kraft bags — Hana", "Redraw the menu board larger — Samuel", "Book the harbour café for 7 November — Clara"];

const STATUS = {
  Available: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Busy: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  Away: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Out of office": "border-foreground/[0.14] bg-foreground/[0.05] text-muted-foreground",
};

const STATUS_DOT = { Available: "bg-emerald-500", Busy: "bg-red-500", Away: "bg-amber-500", "Out of office": "bg-foreground/40" };

function StatusPill({ status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", STATUS[status])}>
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </span>
  );
}

// A person card: avatar with status, name, role and team, local time and email.
function PersonCard({ at, w = 250, name, role, team, status, time, email, className }) {
  return (
    <Node at={at} w={w} className={cn("p-3.5 text-[12px]", className)}>
      <div className="flex items-start gap-3">
        <span className="relative">
          <Avatar name={name} size={42} />
          <span className={cn("absolute right-0 bottom-0 size-3 rounded-full border-2 border-surface-card", STATUS_DOT[status])} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold">{name}</div>
          <div className="truncate text-muted-foreground">{role}</div>
          <div className="truncate text-[11px] text-muted-foreground">{team}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <StatusPill status={status} />
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
          <Clock className="size-3" /> {time}
        </span>
      </div>
      {email ? (
        <div className="mt-2 flex items-center gap-1.5 truncate text-[11px] text-foreground/80">
          <Mail className="size-3 text-muted-foreground" /> {email}
        </div>
      ) : null}
    </Node>
  );
}

// Section stage: the call notes run through Action items, each one spawned as a note beside its owner's person card.
export function ActionItemsStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <NotesWindow crumbs={["Atlas Coffee rebrand — workshop"]} activeTool={-1} className="absolute top-0 left-0 h-[660px] w-[1000px]">
        <Wires
          paths={[
            { d: "M238 120 C 260 120, 262 160, 284 160", dashed: true, flow: true },
            { d: "M604 150 C 630 150, 632 54, 656 54", arrow: true, strong: true },
            { d: "M604 170 C 632 170, 634 128, 656 128", arrow: true, strong: true },
            { d: "M604 190 C 634 190, 634 202, 656 202", arrow: true, strong: true },
            { d: "M604 210 C 630 210, 632 276, 656 276", arrow: true, strong: true },
          ]}
        />
        <Column at={[22, 24]} w={216} title="Client call notes" items={["Atlas sign off wordmark A", "Bags: kraft, one-colour print", "Menu board type is too small", "Launch at the harbour café, 7 Nov"]} />
        <AiCard
          at={[286, 60]}
          w={318}
          selected={false}
          action="Action items"
          connected={1}
          output="Four follow-ups came out of the call."
          itemsTitle="Action items"
          items={ACTIONS}
        />
        {ACTIONS.map((item, index) => (
          <div key={item} className={styles.popIn} style={{ "--pop-delay": `${1 + index * 0.15}s` }}>
            <Note at={[658, 30 + index * 74]} w={268}>
              {item}
            </Note>
          </div>
        ))}
        <PersonCard at={[22, 322]} w={240} name="Theo Lindqvist" role="Designer" team="Fieldnote" status="Busy" time="11:52 · GMT+1" />
        <PersonCard at={[282, 330]} w={240} name="Hana Ito" role="Producer" team="Fieldnote" status="Available" time="19:52 · GMT+9" />
        <div className={cn("absolute top-[316px] left-[726px]", styles.popIn)} style={{ "--pop-delay": "1.7s" }}>
          <Toast title="Added 4 notes" className="w-[200px]" />
        </div>
      </NotesWindow>
    </div>
  );
}

const TXT = [
  "Board: Atlas Coffee rebrand — workshop",
  "=======================================",
  "",
  "Nodes: 38  |  Edges: 21",
  "",
  "NODES",
  "-----",
  "",
  "[35] CUSTOM",
  "  Label:    Send Atlas the final wordmark files — Theo",
  "  Position: (1180, 240)",
  "",
  "[36] CUSTOM",
  "  Label:    Order 2,000 kraft bags — Hana",
  "  Position: (1180, 332)",
];

const FORMATS = [
  [Braces, "JSON"],
  [FileText, "PDF"],
  [ImageIcon, "PNG"],
  [AlignLeft, "TXT"],
];

// Cell: the plain-text export of the workshop board, open beside the format picker.
export function TxtExportRender() {
  return (
    <div className="relative mx-auto h-[312px] w-[460px]">
      <div className="absolute top-0 left-0 flex gap-1.5">
        {FORMATS.map(([Icon, label]) => (
          <span
            key={label}
            className={cn("flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[11.5px] font-medium", label === "TXT" ? "border-foreground/35 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}
          >
            <Icon className="size-3.5" strokeWidth={1.75} /> {label}
          </span>
        ))}
      </div>
      <Window title="Atlas Coffee rebrand — workshop.txt" icon={AlignLeft} className="absolute top-[42px] left-0 h-[270px] w-[460px]" barClassName="h-10">
        <div className="px-4 py-3 font-mono text-[10.5px] leading-[1.6] whitespace-pre text-foreground/80">
          {TXT.map((line, index) => (
            <div key={index} className={cn(line.startsWith("Board") && "font-semibold text-foreground", line.startsWith("  Label") && "text-foreground")}>
              {line || " "}
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}

// Cell: Theo's person card with the status menu open.
export function PersonRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[460px]">
      <PersonCard at={[0, 20]} w={250} name="Theo Lindqvist" role="Designer" team="Fieldnote" status="Busy" time="11:52 · GMT+1" className="shadow-lg" />
      <div className={cn(PANEL, "absolute top-[136px] left-[120px] w-[160px] p-1 text-[12px]", styles.float)}>
        {Object.keys(STATUS).map((status) => (
          <div key={status} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", status === "Busy" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/80")}>
            <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
            {status}
            {status === "Busy" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
      <div className="absolute top-[20px] left-[296px] flex w-[164px] flex-col gap-2.5">
        {[
          ["Hana Ito", "Available"],
          ["Samuel Okoro", "Away"],
          ["Clara Vidal", "Out of office"],
        ].map(([name, status]) => (
          <div key={name} className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] bg-surface-card px-2.5 py-2 text-[12px] dark:bg-surface-subtle">
            <Avatar name={name} size={22} />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} /> {status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
