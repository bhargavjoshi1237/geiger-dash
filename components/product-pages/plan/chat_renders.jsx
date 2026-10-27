import { AtSign, File, Hash, Lock, MessageSquare, Mic, Paperclip, Phone, PhoneOff, Pin, SmilePlus, Users, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, TypingDots, Window } from "@/components/product-pages/mock_kit";
import styles from "@/components/product-pages/product_pages.module.css";

// Flow's Grounding chat: the seeded #incidents channel, a thread, slash commands and a one-to-one call.

const NAV = [
  [MessageSquare, "Messages"],
  [Hash, "Channels"],
  [Users, "Contacts"],
  [Phone, "Calls"],
  [File, "Files"],
];

const CHANNELS = [
  { name: "general" },
  { name: "incidents", locked: true, active: true },
  { name: "release" },
  { name: "design-review" },
];

function Sidebar() {
  return (
    <div className={cn("flex w-[210px] shrink-0 flex-col gap-5 border-r px-3 py-4 text-[12px]", LINE)}>
      <div className="flex flex-col gap-0.5">
        {NAV.map(([Icon, label]) => (
          <span key={label} className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5", label === "Channels" ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70")}>
            <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </div>
      <div>
        <div className="px-2 pb-1.5 text-[11px] text-muted-foreground">Channels</div>
        {CHANNELS.map((channel) => (
          <span key={channel.name} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", channel.active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/70")}>
            {channel.locked ? <Lock className="size-3 text-muted-foreground" /> : <Hash className="size-3 text-muted-foreground" />}
            {channel.name}
          </span>
        ))}
      </div>
      <div>
        <div className="px-2 pb-1.5 text-[11px] text-muted-foreground">Direct messages</div>
        {["Tyler Brennan", "Grace Donnelly", "Danielle Reyes"].map((name) => (
          <span key={name} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground/70">
            <Avatar name={name} size={16} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function Message({ name, time, children, reactions, replies }) {
  return (
    <div className="flex gap-3">
      <Avatar name={name} size={32} />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{name}</span>
          <span className="text-[11px] text-muted-foreground">{time}</span>
        </div>
        <p className="mt-0.5 leading-[1.5] text-foreground/85">{children}</p>
        {reactions ? (
          <div className="mt-1.5 flex gap-1.5">
            {reactions.map(([emoji, count]) => (
              <span key={emoji} className="inline-flex h-6 items-center gap-1 rounded-full border border-foreground/[0.1] bg-foreground/[0.03] px-2 text-[11px] text-foreground/80">
                {emoji} {count}
              </span>
            ))}
          </div>
        ) : null}
        {replies ? (
          <div className="mt-1.5 flex items-center gap-2 text-[12px]">
            <span className="flex -space-x-1">
              <Avatar name="Grace Donnelly" size={16} />
              <Avatar name="Tyler Brennan" size={16} />
            </span>
            <span className="font-medium text-foreground/80">{replies} replies</span>
            <span className="text-muted-foreground">Last reply 10:58</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ThreadPane() {
  return (
    <div className={cn("flex w-[290px] shrink-0 flex-col border-l text-[12px]", LINE)}>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-4", LINE)}>
        <span className="font-medium">Thread</span>
        <span className="text-muted-foreground">#incidents</span>
        <X className="ml-auto size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <div className={cn("border-b pb-4", LINE)}>
          <div className="flex items-center gap-2">
            <Avatar name="Marcus Whitfield" size={20} />
            <span className="font-medium">Marcus Whitfield</span>
          </div>
          <p className="mt-1.5 leading-[1.5] text-foreground/80">Service worker is serving a stale bundle after the 0.8 deploy. Investigating now.</p>
        </div>
        {[
          ["Grace Donnelly", "Seeing it on staging too. A hard refresh clears it, so it's the cache."],
          ["Tyler Brennan", "Pushing the version-stamped path now. Should be out in ten."],
          ["Marcus Whitfield", "Thanks both. I'll watch it for an hour before closing this out."],
        ].map(([name, text]) => (
          <div key={text} className="flex gap-2.5">
            <Avatar name={name} size={20} />
            <div>
              <div className="font-medium">{name}</div>
              <p className="mt-0.5 leading-[1.5] text-foreground/80">{text}</p>
            </div>
          </div>
        ))}
        <div className="mt-auto flex items-center rounded-lg border border-foreground/[0.1] px-3 py-2 text-muted-foreground">Reply…</div>
      </div>
    </div>
  );
}

// Section stage: the locked #incidents channel with its pinned topic, reactions, a thread and someone typing.
export function ChatStage() {
  return (
    <Window className="h-[580px] w-[1000px]">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
            <Lock className="size-3.5 text-muted-foreground" />
            <span className="font-medium">incidents</span>
            <span className="truncate text-[12px] text-muted-foreground">Live incidents only. Keep the noise out.</span>
            <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Pin className="size-3.5" /> 1 pinned
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-5 px-5 py-5">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className={cn("h-px flex-1 border-t", LINE)} />
              Today
              <span className={cn("h-px flex-1 border-t", LINE)} />
            </div>
            <Message name="Marcus Whitfield" time="10:42" replies={3}>
              Service worker is serving a stale bundle after the 0.8 deploy. Investigating now.
            </Message>
            <Message name="Tyler Brennan" time="10:51" reactions={[["👀", 2]]}>
              Confirmed - the precache manifest is not being invalidated. Shipping a version-stamped path.
            </Message>
            <Message name="Marcus Whitfield" time="11:20" reactions={[["✅", 4], ["🙌", 2]]}>
              Fix is out, cache busted. Post-mortem goes in the decisions log.
            </Message>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <TypingDots className="text-muted-foreground" /> Grace Donnelly is typing…
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 rounded-xl border border-foreground/[0.1] px-4 py-3 text-muted-foreground">
              Message #incidents
              <span className="ml-auto flex items-center gap-3">
                <Paperclip className="size-3.5" />
                <SmilePlus className="size-3.5" />
                <AtSign className="size-3.5" />
              </span>
            </div>
          </div>
        </div>
        <ThreadPane />
      </div>
    </Window>
  );
}

const SLASH = [
  { command: "/call", hint: "Start a voice call" },
  { command: "/video", hint: "Start a video call", active: true },
  { command: "/shrug", hint: "Append a shrug" },
  { command: "/tableflip", hint: "Append a table flip" },
];

export function SlashRender() {
  return (
    <div className="relative mx-auto h-[236px] w-[440px]">
      <div className="absolute inset-x-0 top-0 rounded-xl border border-foreground/[0.1] bg-surface-card p-1.5 text-[13px] shadow-xl shadow-black/20 dark:bg-surface-dialog">
        {SLASH.map((item, index) => (
          <div key={item.command} className={cn("flex items-center gap-3 rounded-lg px-3 py-2", item.active ? "bg-foreground/[0.07]" : "", styles.popIn)} style={{ "--pop-delay": `${0.1 + index * 0.08}s` }}>
            <span className="w-[86px] font-mono text-[12px] text-foreground">{item.command}</span>
            <span className="truncate text-muted-foreground">{item.hint}</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 rounded-xl border border-foreground/[0.12] bg-surface-card px-4 py-3.5 text-[13px] dark:bg-surface-subtle">
        <span className="text-foreground">/vid</span>
        <span className={styles.caret} />
        <span className="ml-auto flex items-center gap-3 text-muted-foreground">
          <Paperclip className="size-3.5" />
          <SmilePlus className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

export function CallRender() {
  return (
    <div className="mx-auto w-[420px] overflow-hidden rounded-2xl border border-foreground/[0.1] bg-surface-card text-[12px] shadow-xl shadow-black/20 dark:bg-surface-subtle">
      <div className={cn("flex items-center gap-2 border-b px-4 py-2.5", LINE)}>
        <span className={cn("size-2 rounded-full bg-emerald-500 text-emerald-500", styles.pulse)} />
        <span className="font-medium">Video call</span>
        <span className="text-muted-foreground">with Tyler Brennan</span>
        <span className="ml-auto tabular-nums text-muted-foreground">04:12</span>
      </div>
      <div className="relative flex h-[178px] items-center justify-center bg-foreground/[0.05]">
        <Avatar name="Tyler Brennan" size={64} />
        <div className="absolute right-3 bottom-3 flex h-[62px] w-[92px] items-center justify-center rounded-lg border border-foreground/[0.12] bg-surface-card dark:bg-surface-dialog">
          <Avatar name="Marcus Whitfield" size={26} />
          <span className="absolute bottom-1 left-1.5 text-[10px] text-muted-foreground">You</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2.5 py-3">
        {[Mic, Video].map((Icon, index) => (
          <span key={index} className="flex size-9 items-center justify-center rounded-full border border-foreground/[0.12] text-foreground/80">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        ))}
        <span className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white">
          <PhoneOff className="size-4" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}
