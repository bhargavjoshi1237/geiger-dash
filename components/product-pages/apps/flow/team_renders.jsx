import {
  AtSign,
  Box,
  CalendarClock,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Database,
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Flame,
  Globe,
  Hash,
  Heart,
  Image as ImageIcon,
  Info,
  Key,
  Laugh,
  Lightbulb,
  Link,
  Lock,
  LockKeyhole,
  Mail,
  MessagesSquare,
  Mic,
  Paperclip,
  PartyPopper,
  Phone,
  PhoneMissed,
  PhoneOff,
  Plus,
  Reply,
  Search,
  SendHorizontal,
  Server,
  ShieldCheck,
  SmilePlus,
  SquarePen,
  Terminal,
  ThumbsUp,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { ChatRail, Checkbox, POPOVER, ScreenTitle, StatStrip } from "@/components/product-pages/apps/flow/flow_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Geiger Flow's Grounding chat and vault for Orbital Freight: direct messages, channels and threads, one-to-one calls and locked secrets.

function DayDivider({ children = "Today" }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
      <span className={cn("h-px flex-1 border-t", LINE)} />
      {children}
      <span className={cn("h-px flex-1 border-t", LINE)} />
    </div>
  );
}

// A run of messages from one author: avatar and name once, then each bubble, mine on the right.
function Group({ name, me = false, time, className, style, children }) {
  return (
    <div className={cn("flex gap-3", me && "flex-row-reverse", className)} style={style}>
      <Avatar name={me ? "Marcus Whitfield" : name} size={28} />
      <div className={cn("flex min-w-0 max-w-[78%] flex-col gap-1", me && "items-end")}>
        <div className={cn("flex items-baseline gap-2 text-[12px]", me && "flex-row-reverse")}>
          <span className="font-semibold">{me ? "You" : name}</span>
          <span className="text-[11px] text-muted-foreground">{time}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Bubble({ me = false, className, children }) {
  return (
    <div
      className={cn(
        "w-fit rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed",
        me ? "rounded-tr-md bg-foreground text-background" : "rounded-tl-md border border-foreground/[0.08] bg-foreground/[0.04] text-foreground/90",
        className,
      )}
    >
      {children}
    </div>
  );
}

const REACTION_ICONS = { like: ThumbsUp, love: Heart, laugh: Laugh, celebrate: PartyPopper, insightful: Lightbulb, fire: Flame };

function Reactions({ items }) {
  return (
    <div className="flex gap-1.5">
      {items.map(([key, count, mine]) => {
        const Icon = REACTION_ICONS[key];
        return (
          <span key={key} className={cn("inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px]", mine ? "border-foreground/30 bg-foreground/[0.08] text-foreground" : "border-foreground/[0.1] bg-foreground/[0.03] text-foreground/80")}>
            <Icon className="size-3.5" strokeWidth={1.75} /> {count}
          </span>
        );
      })}
    </div>
  );
}

const FILE_ICONS = { pdf: FileText, sheet: FileSpreadsheet, archive: FileArchive, doc: FileText, image: ImageIcon };

function FileCard({ name, size, kind = "pdf", className }) {
  const Icon = FILE_ICONS[kind];
  return (
    <div className={cn("flex w-[260px] items-center gap-3 rounded-xl border border-foreground/[0.1] bg-surface-card px-3 py-2.5 dark:bg-foreground/[0.03]", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium">{name}</span>
        <span className="block text-[11px] text-muted-foreground">{size}</span>
      </span>
      <Download className="size-3.5 text-muted-foreground" />
    </div>
  );
}

// A photo attachment drawn as a dim tunnel mouth: an arch of light in foreground tints.
function TunnelPhoto({ className }) {
  return (
    <div className={cn("relative h-[124px] w-[220px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-foreground/[0.06]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(42%_60%_at_50%_70%,color-mix(in_oklab,var(--foreground)_30%,transparent),transparent_75%)]" />
      <svg viewBox="0 0 220 124" className="absolute inset-0 size-full text-foreground/25" fill="none" aria-hidden="true">
        <path d="M40 124 C40 50, 180 50, 180 124" stroke="currentColor" strokeWidth="2" />
        <path d="M70 124 C70 76, 150 76, 150 124" stroke="currentColor" strokeWidth="1" />
        <path d="M110 124 L104 96 M110 124 L116 96" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

function Receipt({ seen = true }) {
  return (
    <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
      {seen ? <CheckCheck className="size-3.5 text-foreground/80" /> : <Check className="size-3.5" />}
      {seen ? "Seen" : "Sent"}
    </div>
  );
}

function IconButton({ icon: Icon, active = false }) {
  return (
    <span className={cn("flex size-8 items-center justify-center rounded-full", active ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  );
}

function Composer({ placeholder, typed, className }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-2xl border border-foreground/[0.12] bg-foreground/[0.02] py-1.5 pr-1.5 pl-2", className)}>
      <IconButton icon={Plus} />
      <span className="min-w-0 flex-1 truncate text-[13px]">{typed ? <Typed text={typed} delay={1.5} /> : <span className="text-muted-foreground">{placeholder}</span>}</span>
      <IconButton icon={AtSign} />
      <IconButton icon={Paperclip} />
      <IconButton icon={SmilePlus} />
      <span className={cn("flex size-8 items-center justify-center rounded-full", typed ? "bg-foreground text-background" : "bg-foreground/10 text-muted-foreground")}>
        <SendHorizontal className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}

const DMS = [
  { name: "Danielle Reyes", preview: "Can we get it into Cycle 14?", time: "10:44", unread: 2, pinned: true, active: true },
  { name: "Nathan Okafor", preview: "Sending the trace from the van", time: "09:31", pinned: true },
  { name: "Priya Nair", preview: "You: thanks, merging after lunch", time: "Yesterday" },
  { name: "Tyler Brennan", preview: "Device lab is booked for Thursday", time: "Yesterday" },
  { name: "Ethan Caldwell", preview: "Invoice export looks right to me", time: "Mon" },
];

function ConversationRow({ item }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg px-2.5 py-2", item.active && "bg-foreground/[0.07]")}>
      <Avatar name={item.name} size={32} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className={cn("truncate text-[13px]", item.unread ? "font-semibold" : "font-medium")}>{item.name}</span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="truncate text-[12px] text-muted-foreground">{item.preview}</span>
          {item.unread ? <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">{item.unread}</span> : null}
        </span>
      </span>
    </div>
  );
}

// The hero's tilted plane: Grounding's Messages tab, a pinned direct message open with a photo, a reply and a read receipt.
export function ChatWindow() {
  return (
    <Window className="h-[700px] w-[1180px] flex-row">
      <div className="flex h-full w-full">
        <ChatRail active="Messages" inbox="1" />
        <div className={cn("flex w-[300px] shrink-0 flex-col border-r px-2.5 py-3", LINE)}>
          <div className="flex items-center gap-2 px-2 pb-3">
            <span className="text-[15px] font-semibold">Messages</span>
            <SquarePen className="ml-auto size-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="mx-1 mb-2 flex h-9 items-center gap-2 rounded-lg border border-foreground/[0.1] px-3 text-[12px] text-muted-foreground">
            <Search className="size-3.5" /> Search
          </div>
          <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Pinned</div>
          {DMS.filter((item) => item.pinned).map((item) => (
            <ConversationRow key={item.name} item={item} />
          ))}
          <div className={cn("mx-2 my-2 border-t", LINE)} />
          {DMS.filter((item) => !item.pinned).map((item) => (
            <ConversationRow key={item.name} item={item} />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b px-5", LINE)}>
            <Avatar name="Danielle Reyes" size={30} />
            <span className="text-[14px] font-semibold">Danielle Reyes</span>
            <span className="ml-auto flex items-center gap-1">
              <IconButton icon={Search} />
              <IconButton icon={Phone} />
              <IconButton icon={Video} />
              <IconButton icon={Info} />
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-4 px-6 py-5">
            <DayDivider />
            <Group name="Danielle Reyes" time="10:38">
              <Bubble>Three drivers lost the voice prompt in the Harbour tunnel this morning. Photo of the exit they missed.</Bubble>
              <TunnelPhoto />
            </Group>
            <Group me time="10:41">
              <Bubble me>That&apos;s ORB-118. Priya picked it up yesterday and the fix is in review.</Bubble>
              <Reactions items={[["like", 1]]} />
            </Group>
            <Group name="Danielle Reyes" time="10:44" className={styles.popIn} style={{ "--pop-delay": "0.6s" }}>
              <div className="w-fit max-w-full rounded-lg border-l-2 border-foreground/25 pl-2 text-[11px] text-muted-foreground">You: That&apos;s ORB-118. Priya picked it up yesterday…</div>
              <Bubble>Can we get it into Cycle 14?</Bubble>
            </Group>
            <Group me time="10:46">
              <Bubble me>Yes, it ships with the route planner build on Thursday.</Bubble>
            </Group>
            <Receipt />
          </div>
          <div className="px-5 pb-5">
            <Composer typed="I'll ring you when it's on staging" />
          </div>
        </div>
      </div>
    </Window>
  );
}

const CHANNELS = [
  { name: "route-planner", locked: true, active: true, pinned: true },
  { name: "dispatch-alerts", locked: true, unread: 4, pinned: true },
  { name: "general" },
  { name: "releases", unread: 1 },
  { name: "depot-ops" },
  { name: "billing" },
];

// Section stage: the private #route-planner channel with a message's action bar and reaction picker, and its thread open beside it.
export function ChannelStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[720px] flex-row">
        <div className="flex h-full w-full">
          <div className={cn("flex w-[200px] shrink-0 flex-col border-r px-2.5 py-3 text-[12.5px]", LINE)}>
            <div className="flex items-center gap-2 px-2 pb-3">
              <span className="text-[15px] font-semibold">Channels</span>
              <Plus className="ml-auto size-4 text-muted-foreground" />
            </div>
            <div className="px-2 pt-1 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Pinned</div>
            {CHANNELS.map((channel, index) => (
              <div key={channel.name}>
                {index === 2 ? <div className={cn("mx-2 my-2 border-t", LINE)} /> : null}
                <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", channel.active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/75")}>
                  {channel.locked ? <Lock className="size-3.5 text-muted-foreground" /> : <Hash className="size-3.5 text-muted-foreground" />}
                  <span className="truncate">{channel.name}</span>
                  {channel.unread ? <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">{channel.unread}</span> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
              <Lock className="size-4 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">route-planner</span>
                <span className="block truncate text-[11px] text-muted-foreground">Cycle 14 and the route planner build</span>
              </span>
              <span className="ml-auto flex items-center gap-2 text-[12px] text-muted-foreground">
                <AvatarStack names={["Priya Nair", "Nathan Okafor", "Danielle Reyes", "Tyler Brennan"]} size={20} />
                <span className="flex items-center gap-1 rounded-md bg-foreground/[0.07] px-1.5 py-1 text-foreground">
                  <MessagesSquare className="size-3.5" /> 1
                </span>
                <span className="flex items-center gap-1 px-1.5 py-1">
                  <Paperclip className="size-3.5" /> 4
                </span>
              </span>
            </div>
            <div className="relative flex flex-1 flex-col gap-5 px-5 py-5">
              <DayDivider />
              <Group name="Marcus Whitfield" time="09:12">
                <Bubble>Build 14.3 is on the internal track, with the route planner behind a flag.</Bubble>
                <FileCard name="route-planner-14.3-notes.pdf" size="240 KB" />
              </Group>
              <div className="relative">
                <Group name="Priya Nair" time="09:20">
                  <Bubble className="max-w-[300px] ring-1 ring-foreground/15">Turn-by-turn now holds the last GPS fix through a tunnel. Can someone drive the Harbour loop today?</Bubble>
                  <Reactions items={[["like", 3, true], ["insightful", 1]]} />
                  <span className="flex items-center gap-2 text-[12px]">
                    <AvatarStack names={["Nathan Okafor", "Danielle Reyes"]} size={16} />
                    <span className="font-medium text-foreground/85">3 replies</span>
                  </span>
                </Group>
                <div className={cn("absolute top-[2px] left-[262px] flex items-center gap-0.5 rounded-lg p-0.5", POPOVER, styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
                  {[SmilePlus, Reply, MessagesSquare, Copy, Info].map((Icon, index) => (
                    <span key={index} className={cn("flex size-7 items-center justify-center rounded-md", index === 2 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
                      <Icon className="size-3.5" strokeWidth={1.75} />
                    </span>
                  ))}
                </div>
              </div>
              <Group name="Tyler Brennan" time="09:31">
                <Bubble>I can take the van out after lunch.</Bubble>
              </Group>
            </div>
            <div className="px-5 pb-5">
              <Composer placeholder="Write a message…" />
            </div>
          </div>
        </div>
      </Window>
      <Window className={cn("absolute top-[56px] left-[684px] z-[2] h-[560px] w-[310px]", styles.float)}>
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4 text-[13px]", LINE)}>
          <MessagesSquare className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-semibold">Thread</span>
          <span className="text-muted-foreground">#route-planner</span>
          <X className="ml-auto size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 py-4">
          <div className={cn("border-b pb-4", LINE)}>
            <Group name="Priya Nair" time="09:20">
              <Bubble>Turn-by-turn now holds the last GPS fix through a tunnel. Can someone drive the Harbour loop today?</Bubble>
            </Group>
          </div>
          <Group name="Nathan Okafor" time="09:24">
            <Bubble>I&apos;ll take a phone through at two and record it.</Bubble>
          </Group>
          <Group name="Danielle Reyes" time="09:26">
            <Bubble>This morning&apos;s recording is in #dispatch-alerts if you want a before.</Bubble>
          </Group>
          <Group name="Priya Nair" time="09:27" className={styles.popIn} style={{ "--pop-delay": "0.9s" }}>
            <Bubble>Perfect, thanks both.</Bubble>
          </Group>
          <div className="mt-auto rounded-xl border border-foreground/[0.12] px-3 py-2.5 text-[12px] text-muted-foreground">Reply in thread…</div>
        </div>
      </Window>
    </div>
  );
}

const PEOPLE_PICK = [
  ["Danielle Reyes", true],
  ["Marcus Whitfield", true],
  ["Tyler Brennan", false],
];

// Cell: creating a private, invite-only channel with two people added.
export function PrivateChannelRender() {
  return (
    <div className={cn("mx-auto w-[440px] p-5", POPOVER)}>
      <div className="text-[15px] font-semibold">Create a channel</div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">Channels are where your team communicates around a topic.</div>
      <div className="mt-4 text-[11px] font-medium text-muted-foreground">Name</div>
      <div className="mt-1.5 flex h-9 items-center gap-2 rounded-lg border border-foreground/30 px-2.5 ring-2 ring-foreground/10">
        <Hash className="size-4 text-muted-foreground" />
        <Typed text="late-drops" delay={1.2} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          [Globe, "Public", "Anyone can join", false],
          [Lock, "Private", "Invite only", true],
        ].map(([Icon, label, hint, selected]) => (
          <div key={label} className={cn("flex flex-col gap-1 rounded-lg border p-3", selected ? "border-foreground/30 bg-foreground/[0.07]" : "border-foreground/[0.1]")}>
            <span className="flex items-center gap-2 text-[13px] font-medium">
              <Icon className="size-4 text-muted-foreground" /> {label}
            </span>
            <span className="text-[11px] text-muted-foreground">{hint}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] font-medium text-muted-foreground">
        Add people <span className="font-normal">(optional, 2 selected)</span>
      </div>
      <div className="mt-1.5 flex flex-col">
        {PEOPLE_PICK.map(([name, picked], index) => (
          <div key={name} className={cn("flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-[12px]", styles.popIn)} style={{ "--pop-delay": `${0.3 + index * 0.1}s` }}>
            <Checkbox checked={picked} />
            <Avatar name={name} size={20} />
            {name}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2 text-[12px]">
        <span className="flex h-8 items-center rounded-md px-3 text-muted-foreground">Cancel</span>
        <span className="flex h-8 items-center rounded-md bg-foreground px-3 font-medium text-background">Create channel</span>
      </div>
    </div>
  );
}

const FILES = [
  ["pdf", "route-planner-14.3-notes.pdf", "PDF", "#route-planner", "240 KB"],
  ["image", "harbour-tunnel-exit.png", "Image", "Danielle Reyes", "1.1 MB"],
  ["sheet", "depot-gate-codes.xlsx", "Spreadsheet", "#depot-ops", "86 KB"],
  ["archive", "pod-photos-october.zip", "Archive", "#dispatch-alerts", "18.2 MB"],
  ["doc", "fuel-card-rules.docx", "Document", "#billing", "54 KB"],
];

// Cell: every file shared in a conversation, filterable by kind.
export function FilesRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="flex items-center gap-2">
        {["All", "PDFs", "Images", "Docs"].map((tab) => (
          <span key={tab} className={cn("rounded-full border px-2.5 py-1", tab === "All" ? "border-foreground/25 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
            {tab}
          </span>
        ))}
        <span className="ml-auto flex h-7 w-[150px] items-center gap-2 rounded-full border border-foreground/[0.12] px-2.5 text-muted-foreground">
          <Search className="size-3.5" /> Search files
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        <div className={cn("grid grid-cols-[1fr_74px_100px_56px] gap-3 border-b px-3.5 py-2 text-[11px] text-muted-foreground", LINE)}>
          <span>Name</span>
          <span>Type</span>
          <span>Shared in</span>
          <span className="text-right">Size</span>
        </div>
        {FILES.map(([kind, name, type, place, size], index) => {
          const Icon = FILE_ICONS[kind];
          return (
            <div key={name} className={cn("grid grid-cols-[1fr_74px_100px_56px] items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.08}s` }}>
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground/90">{name}</span>
              </span>
              <span className="text-muted-foreground">{type}</span>
              <span className="truncate text-muted-foreground">{place}</span>
              <span className="text-right text-muted-foreground tabular-nums">{size}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CallCard({ missed = false, mine = false, detail }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className="flex w-[300px] items-center gap-3 rounded-2xl border border-foreground/[0.1] bg-surface-card px-3.5 py-2.5 dark:bg-foreground/[0.03]">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border", missed ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400" : "border-foreground/[0.14] bg-foreground/[0.05] text-muted-foreground")}>
          {missed ? <PhoneMissed className="size-4" /> : <Video className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-medium">{missed ? "Missed call" : "Video call ended"}</span>
          <span className="block text-[11px] text-muted-foreground">{detail}</span>
        </span>
        <span className="flex h-7 items-center gap-1.5 rounded-lg border border-foreground/[0.12] px-2.5 text-[11px] font-medium">
          {missed ? <Phone className="size-3" /> : <Video className="size-3" />} Call back
        </span>
      </div>
    </div>
  );
}

function CallTile({ name, label, big = false }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-foreground/[0.08] bg-foreground/[0.05]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_30%,color-mix(in_oklab,var(--foreground)_12%,transparent),transparent_70%)]" />
      <Avatar name={name} size={big ? 72 : 44} className="relative" />
      <span className="absolute bottom-2.5 left-3 flex items-center gap-1.5 rounded-md bg-background/70 px-2 py-0.5 text-[11px]">
        {label}
        {big ? <Mic className="size-3 text-muted-foreground" /> : null}
      </span>
    </div>
  );
}

// Section stage: a direct message with its call history, and a live one-to-one video call over it.
export function CallStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-[370px] h-[620px] w-[630px] opacity-90">
        <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b px-5", LINE)}>
          <Avatar name="Nathan Okafor" size={30} />
          <span className="text-[14px] font-semibold">Nathan Okafor</span>
          <span className="ml-auto flex items-center gap-1">
            <IconButton icon={Search} />
            <IconButton icon={Phone} />
            <IconButton icon={Video} active />
            <IconButton icon={Info} />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 px-6 py-5">
          <DayDivider />
          <CallCard missed detail="No answer · 08:52" />
          <Group me time="08:55">
            <Bubble me>Sorry, I was driving. Calling you back now.</Bubble>
          </Group>
          <CallCard mine detail="14 min · 09:10" />
          <Group name="Nathan Okafor" time="09:31">
            <Bubble>Sending the trace from the van.</Bubble>
            <FileCard name="harbour-loop-gps-trace.pdf" size="1.4 MB" />
          </Group>
          <Group me time="09:33">
            <Bubble me>Got it. Ringing you to go through it.</Bubble>
          </Group>
          <Receipt />
        </div>
      </Window>
      <Window className={cn("absolute top-[70px] left-0 z-[2] h-[440px] w-[520px]", styles.float)}>
        <div className={cn("flex items-center gap-3 border-b px-4 py-3", LINE)}>
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
            <span className={cn("size-1.5 rounded-full bg-red-500 text-red-500", styles.pulse)} /> LIVE
          </span>
          <span>
            <span className="block text-[13px] font-semibold">Nathan Okafor</span>
            <span className="block text-[11px] text-muted-foreground tabular-nums">Video call · 08:42</span>
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 p-4">
          <CallTile name="Nathan Okafor" label="Nathan Okafor" big />
          <CallTile name="Marcus Whitfield" label="You" />
        </div>
        <div className={cn("flex items-center justify-center gap-3 border-t px-4 py-3", LINE)}>
          <span className="flex size-11 items-center justify-center rounded-full border border-foreground/[0.14] bg-foreground/[0.04]">
            <Mic className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span className="flex size-11 items-center justify-center rounded-full border border-foreground/[0.14] bg-foreground/[0.04]">
            <Video className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span className="ml-1 flex h-11 items-center gap-2 rounded-full bg-red-600 px-5 text-[13px] font-semibold text-white">
            <PhoneOff className="size-[18px]" /> Leave
          </span>
        </div>
      </Window>
    </div>
  );
}

// Cell: the ringing dialog a teammate sees when you call them.
export function IncomingCallRender() {
  return (
    <div className="relative mx-auto flex h-[300px] w-[460px] items-center justify-center rounded-2xl bg-foreground/[0.03]">
      <div className={cn("w-[280px] px-6 py-6 text-center", POPOVER, styles.popIn)}>
        <div className="relative mx-auto w-fit">
          <span className={cn("absolute inset-0 rounded-full text-foreground/40", styles.pulse)} />
          <Avatar name="Danielle Reyes" size={64} />
        </div>
        <div className="mt-3 text-[15px] font-semibold">Danielle Reyes</div>
        <div className="text-[12px] text-muted-foreground">Incoming video call</div>
        <div className="mt-5 flex items-center justify-center gap-8">
          <span className="flex flex-col items-center gap-1.5">
            <span className="flex size-12 items-center justify-center rounded-full bg-red-600 text-white">
              <PhoneOff className="size-5" />
            </span>
            <span className="text-[11px] text-muted-foreground">Decline</span>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Video className="size-5" />
            </span>
            <span className="text-[11px] text-muted-foreground">Accept</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const REMINDERS = [
  { title: "Upcoming call: Cycle 14 review", body: "Your call “Cycle 14 review” starts in about 15 min.", time: "now", unread: true },
  { title: "Upcoming call: Depot pilot debrief", body: "Your call “Depot pilot debrief” is starting now.", time: "Yesterday" },
  { title: "Upcoming call: Billing export check-in", body: "Your call “Billing export check-in” starts in about 30 min.", time: "Mon" },
];

// Cell: scheduled calls dropping a reminder into the chat inbox before they start.
export function ReminderRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="flex items-center gap-2">
        {["All", "Unread"].map((tab) => (
          <span key={tab} className={cn("rounded-full border px-2.5 py-1", tab === "All" ? "border-foreground/25 bg-foreground/[0.07] text-foreground" : "border-foreground/[0.1] text-muted-foreground")}>
            {tab}
          </span>
        ))}
        <span className="ml-auto flex h-7 w-[170px] items-center gap-2 rounded-full border border-foreground/[0.12] px-2.5 text-muted-foreground">
          <Search className="size-3.5" /> Filter notifications...
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {REMINDERS.map((item, index) => (
          <div
            key={item.title}
            className={cn("flex items-start gap-3 rounded-xl border bg-surface-card px-3.5 py-3 dark:bg-surface-subtle", item.unread ? "border-foreground/[0.16]" : "border-foreground/[0.08] opacity-70", styles.popIn)}
            style={{ "--pop-delay": `${0.2 + index * 0.12}s` }}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarClock className="size-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[13px] font-medium">{item.title}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-muted-foreground">{item.body}</span>
            </span>
            {item.unread ? <span className={cn("mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const SECRET_ICONS = { api_key: Key, database: Database, smtp: Mail, certificate: Server, ssh_key: Terminal, oauth: Link, password: Key, other: Box };
const METHOD = { pin: [LockKeyhole, "PIN"], password: [Key, "Password"], passkey: [Fingerprint, "Passkey"] };

const SECRETS = [
  { name: "Routing API key", sub: "svc-route-planner", type: "api_key", method: "pin", notes: "Production key for the route planner." },
  { name: "Fleet database replica", sub: "readonly_fleet", type: "database", method: "password", access: "Managers only", notes: "Read-only. Ask Priya before using it in a script." },
  { name: "Driver app signing certificate", sub: "No details", type: "certificate", method: "passkey", access: "Specific people", notes: "Store release signing. Renew in March." },
  { name: "Depot SMTP relay", sub: "depot-mailer", type: "smtp", method: "pin", notes: "Sends the depot opening-hours emails." },
  { name: "Deploy SSH key", sub: "deploy@build-runner", type: "ssh_key", method: "passkey", access: "Managers only", notes: "Build runner only." },
  { name: "Telematics OAuth client", sub: "telematics-sync", type: "oauth", method: "password", notes: "Client for the van trackers." },
];

function SecretCard({ secret, highlighted = false }) {
  const Icon = SECRET_ICONS[secret.type];
  const [MethodIcon, methodLabel] = METHOD[secret.method];
  return (
    <div className={cn("flex flex-col rounded-xl border bg-foreground/[0.02] p-4", highlighted ? "border-foreground/30" : "border-foreground/[0.09]")}>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.1] bg-foreground/[0.04] text-muted-foreground">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium">{secret.name}</span>
          <span className="block truncate text-[12px] text-muted-foreground">{secret.sub}</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {secret.access ? <span className="rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">{secret.access}</span> : null}
        <span className="flex items-center gap-1 rounded-md border border-foreground/[0.1] px-2 py-0.5 text-[11px] text-muted-foreground">
          <MethodIcon className="size-3" /> {methodLabel}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="line-clamp-2 flex-1 text-[12px] text-muted-foreground">{secret.notes}</p>
        <span className={cn("flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[12px]", highlighted ? "border-foreground/30 bg-foreground/[0.08] text-foreground" : "border-foreground/[0.12] text-foreground/80")}>
          <MethodIcon className="size-3" /> Access
        </span>
      </div>
    </div>
  );
}

// Section stage: the project's vault with every secret locked, and one opening with a passkey.
export function VaultStage() {
  return (
    <div className="relative h-[640px] w-[1000px]">
      <Window className="absolute top-0 left-0 h-[640px] w-[780px]">
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-start gap-3">
            <ScreenTitle title="Vault" description="Keep the project's secrets encrypted, and choose who can open each one." className="flex-1 border-b-0 pb-0" />
            <span className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/[0.12] px-3 text-[12px]">
              <Fingerprint className="size-3.5" /> Passkeys
            </span>
            <span className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-[12px] font-medium text-background">
              <Plus className="size-3.5" /> Add Secret
            </span>
          </div>
          <StatStrip
            stats={[
              { label: "Total secrets", value: "14", footer: "8 secret types" },
              { label: "Passwords", value: "5", footer: "Password secrets" },
              { label: "API keys", value: "4", footer: "API key secrets" },
              { label: "Restricted", value: "3", footer: "2 opened by passkey" },
            ]}
          />
          <div className="flex items-center gap-2 text-[12px]">
            <span className="flex h-8 w-[140px] items-center justify-between rounded-md border border-foreground/[0.12] px-2.5">
              All Types <ChevronDown className="size-3.5 text-muted-foreground" />
            </span>
            <span className="ml-auto flex h-8 w-[220px] items-center gap-2 rounded-md border border-foreground/[0.12] px-2.5 text-muted-foreground">
              <Search className="size-3.5" /> Search secrets…
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SECRETS.map((secret) => (
              <SecretCard key={secret.name} secret={secret} highlighted={secret.type === "certificate"} />
            ))}
          </div>
        </div>
      </Window>
      <div className={cn("absolute top-[96px] left-[580px] z-[2] w-[400px] p-6", POPOVER, styles.float)}>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">Access Secret</span>
          <X className="ml-auto size-4 text-muted-foreground" />
        </div>
        <div className="mt-1 text-[12px] leading-5 text-muted-foreground">Confirm with your passkey to open Driver app signing certificate.</div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="relative flex size-16 items-center justify-center rounded-full border border-foreground/[0.14] bg-foreground/[0.04]">
            <span className={cn("absolute inset-0 rounded-full text-foreground/30", styles.pulse)} />
            <Fingerprint className="size-7 text-foreground/80" strokeWidth={1.5} />
          </span>
          <span className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-foreground text-[13px] font-medium text-background">
            <Fingerprint className="size-4" /> Use passkey
          </span>
        </div>
        <div className="mt-4 flex h-9 items-center justify-center rounded-md text-[12px] text-muted-foreground">Close</div>
      </div>
    </div>
  );
}

const ACCESS_MODES = [
  [Users, "Everyone in the project", "Anyone in the project who passes the secret's check", false],
  [ShieldCheck, "Managers only", "The person who added it, the project's creator and organization owners", false],
  [UserCheck, "Specific people", "Managers, plus the people you list by email", true],
];

// Cell: Access Control, set to managers plus two named people.
export function AccessLevelsRender() {
  return (
    <div className={cn("mx-auto w-[440px] p-5", POPOVER)}>
      <div className="text-[15px] font-semibold">Access Control</div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">Choose who can open Deploy SSH key. They still need its PIN, password or their own passkey.</div>
      <div className="mt-4 text-[11px] font-semibold tracking-wide text-muted-foreground">Who Can Open It</div>
      <div className="mt-2 flex flex-col gap-1.5">
        {ACCESS_MODES.map(([Icon, label, description, active]) => (
          <div key={label} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2", active ? "border-foreground/30 bg-foreground/[0.07]" : "border-foreground/[0.1]")}>
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium">{label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{description}</span>
            </span>
            <span className={cn("size-2 rounded-full", active ? "bg-emerald-500" : "bg-foreground/15")} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["nathan@orbitalfreight.com", "priya@orbitalfreight.com"].map((email, index) => (
          <span key={email} className={cn("flex items-center gap-1.5 rounded-md border border-foreground/[0.12] px-2 py-1 text-[11px]", styles.popIn)} style={{ "--pop-delay": `${0.4 + index * 0.15}s` }}>
            {email}
            <X className="size-3 text-muted-foreground" />
          </span>
        ))}
      </div>
    </div>
  );
}

// Cell: a wrong PIN, with the attempts left before a 15-minute lock.
export function LockoutRender() {
  return (
    <div className={cn("mx-auto w-[400px] p-5", POPOVER)}>
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold">Access Secret</span>
        <X className="ml-auto size-4 text-muted-foreground" />
      </div>
      <div className="mt-1 text-[12px] text-muted-foreground">Enter the PIN for Routing API key.</div>
      <div className="mt-4 text-[11px] font-medium text-muted-foreground">PIN</div>
      <div className="mt-1.5 flex h-10 items-center rounded-md border border-foreground/30 px-3 text-[13px] text-muted-foreground ring-2 ring-foreground/10">
        <span className={cn("text-foreground", styles.caret)} />
        <span className="ml-1">Enter PIN</span>
      </div>
      <div className={cn("mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-[12px] leading-5 text-amber-700 dark:text-amber-300", styles.popIn)} style={{ "--pop-delay": "0.5s" }}>
        <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
        Wrong PIN. 1 attempt left before it locks for 15 minutes.
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <span className="flex h-9 items-center justify-center rounded-md text-muted-foreground">Close</span>
        <span className="flex h-9 items-center justify-center rounded-md bg-foreground/40 font-medium text-background">Access Secret</span>
      </div>
    </div>
  );
}

const HISTORY = [
  ["nathan@orbitalfreight.com", "Passkey", "Opened", "Oct 27, 9:14 AM"],
  ["tyler@orbitalfreight.com", "PIN", "Locked", "Oct 26, 6:02 PM"],
  ["tyler@orbitalfreight.com", "PIN", "Wrong code", "Oct 26, 6:01 PM"],
  ["priya@orbitalfreight.com", "Password", "Opened", "Oct 26, 11:40 AM"],
  ["marcus@orbitalfreight.com", "PIN", "Opened", "Oct 25, 4:18 PM"],
];

const OUTCOME_TONE = {
  Opened: "text-emerald-600 dark:text-emerald-400",
  "Wrong code": "text-amber-600 dark:text-amber-400",
  Locked: "text-red-600 dark:text-red-400",
};

// Cell: the access history kept for every secret.
export function AccessHistoryRender() {
  return (
    <div className="mx-auto w-[460px] text-[12px]">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground">Access History</div>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.09] bg-surface-card dark:bg-surface-subtle">
        {HISTORY.map(([email, method, outcome, when], index) => (
          <div key={`${email}-${when}`} className={cn("flex items-center gap-3 border-b px-3.5 py-2.5 last:border-b-0", LINE, styles.popIn)} style={{ "--pop-delay": `${0.15 + index * 0.1}s` }}>
            <span className="min-w-0 flex-1 truncate text-foreground/90">{email}</span>
            <span className="w-[58px] text-muted-foreground">{method}</span>
            <span className={cn("w-[70px]", OUTCOME_TONE[outcome])}>{outcome}</span>
            <span className="w-[96px] text-right text-[11px] text-muted-foreground tabular-nums">{when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPES = [
  [Key, "Password"],
  [Key, "API Key"],
  [Database, "Database"],
  [Link, "OAuth"],
  [Mail, "SMTP"],
  [Server, "Certificate"],
  [Terminal, "SSH Key"],
  [Box, "Other"],
];

const UNLOCK = [
  [LockKeyhole, "PIN", "4 to 8 digits, shared with the people who open it", false],
  [Key, "Password", "At least 8 characters, shared with the people who open it", false],
  [Fingerprint, "Passkey", "Each person confirms with their own passkey", true],
];

// Cell: adding a secret, its type and how it unlocks.
export function NewSecretRender() {
  return (
    <div className="relative mx-auto h-[340px] w-[460px] text-[12px]">
      <div className={cn("absolute top-0 left-0 w-[300px] p-4", POPOVER)}>
        <div className="text-[14px] font-semibold">Add New Secret</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">It&apos;s encrypted as soon as it&apos;s saved.</div>
        <div className="mt-3 text-[11px] font-medium text-muted-foreground">Type</div>
        <div className="mt-1.5 flex h-8 items-center justify-between rounded-md border border-foreground/30 px-2.5 ring-2 ring-foreground/10">
          SSH Key <ChevronDown className="size-3.5 text-muted-foreground" />
        </div>
        <div className="mt-3 text-[11px] font-semibold tracking-wide text-muted-foreground">Unlock With</div>
        <div className="mt-1.5 flex flex-col gap-1.5">
          {UNLOCK.map(([Icon, label, description, active]) => (
            <div key={label} className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-2", active ? "border-foreground/30 bg-foreground/[0.07]" : "border-foreground/[0.1]")}>
              <Icon className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{label}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{description}</span>
              </span>
              <span className={cn("size-2 rounded-full", active ? "bg-emerald-500" : "bg-foreground/15")} />
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute top-[82px] left-[268px] w-[170px] p-1", POPOVER, styles.float)}>
        {TYPES.map(([Icon, label]) => (
          <div key={label} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", label === "SSH Key" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/80")}>
            <Icon className="size-3.5 text-muted-foreground" />
            {label}
            {label === "SSH Key" ? <Check className="ml-auto size-3.5" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
