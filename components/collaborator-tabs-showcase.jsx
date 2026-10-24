"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  DoorClosed,
  Hand,
  Link2,
  Lock,
  LogIn,
  LucideDoorClosed,
  Megaphone,
  Pause,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserMinus,
  Users,
  Users2,
  Video,
} from "lucide-react";
import { Badge, Button, Input, Switch } from "@geiger/ui";
import { cn } from "@/lib/utils";

// A static replica of a Geiger Notes live session: the Collaborate dialog and host controls over a shared board.

const SESSION_CODE = "GEIGER-4G7Q-2M9A";

// Colours are from Notes' realtime palette so people read the same as they do in the app.
const INITIAL_MEMBERS = [
  { id: "kiran", name: "Kiran", role: "Owner", color: "#60a5fa", isMe: true },
  { id: "aanya", name: "Aanya", role: "Co-host", color: "#f472b6" },
  { id: "ravi", name: "Ravi", role: "Editor", color: "#4ade80" },
];

const INITIAL_REQUESTS = [{ id: "meera", name: "Meera", color: "#facc15" }];

// Kept in the open strips above and below the windows so they never slide underneath one.
const CURSORS = [
  { id: "aanya", className: "bottom-3 left-[12%]" },
  { id: "ravi", className: "right-[6%] top-4" },
];

const COLLAB_TABS = [
  { id: "host", label: "Session" },
  { id: "members", label: "Members" },
  { id: "meet", label: "Meeting" },
];

const PERMISSIONS = [
  { key: "edit", label: "Edit the board" },
  { key: "join", label: "Ask to join" },
  { key: "laser", label: "Use the laser pointer" },
  { key: "facilitate", label: "Run polls and timers" },
  { key: "cursors", label: "See each other's cursors" },
];

const OPEN_PERMISSIONS = Object.fromEntries(PERMISSIONS.map(({ key }) => [key, true]));
const PAUSED_PERMISSIONS = Object.fromEntries(PERMISSIONS.map(({ key }) => [key, false]));

const initialOf = (name) => (name || "?").trim().charAt(0).toUpperCase() || "?";

// Drag by the header, like the real dialog; the offset is purely visual. Surfaces match the profile dropdown.
function DraggablePanel({ className, header, children }) {
  const dragStart = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const beginDrag = (event) => {
    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) {
      return;
    }

    setOffset({
      x: dragStart.current.offset.x + event.clientX - dragStart.current.x,
      y: dragStart.current.offset.y + event.clientY - dragStart.current.y,
    });
  };

  const endDrag = (event) => {
    if (dragStart.current?.pointerId === event.pointerId) {
      dragStart.current = null;
    }
  };

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-xl",
        className,
      )}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
    >
      <div
        className="cursor-move touch-none select-none"
        onPointerDown={beginDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {header}
      </div>
      {children}
    </div>
  );
}

function StatusPill({ icon: Icon, action, onAction, children }) {
  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-background/95 py-1 pl-2.5 pr-1.5 text-xs text-foreground shadow-xl backdrop-blur">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 truncate">{children}</span>
      <button
        type="button"
        onClick={onAction}
        className="rounded-full px-2 py-0.5 font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        {action}
      </button>
    </div>
  );
}

function LiveCursor({ name, color, className }) {
  return (
    <div className={cn("pointer-events-none absolute z-[5] max-sm:hidden", className)}>
      <svg width="18" height="18" viewBox="0 0 18 18" className="drop-shadow-sm" aria-hidden="true">
        <path
          d="M2 1.5 15.5 8.2 9 9.7 6.2 16Z"
          fill={color}
          stroke="var(--background)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="ml-3 -mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-black shadow-sm"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}

function LivePill() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-500">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      Live
    </div>
  );
}

function SessionTab() {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  // Ending affects everyone, so the real button asks twice; here the second click just resets it.
  useEffect(() => {
    if (!confirming) return undefined;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-2">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <span className="block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Session Active
          </span>

          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <button
              type="button"
              onClick={() => setCopied(true)}
              aria-label="Copy session code"
              className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-subtle p-4 transition-all duration-300 hover:border-border-strong"
            >
              <span className="whitespace-nowrap font-mono text-base font-bold tracking-[0.12em] text-foreground sm:text-xl sm:tracking-[0.15em]">
                {SESSION_CODE}
              </span>
              <span className="flex items-center justify-center text-muted-foreground transition-colors group-hover:text-emerald-500/80">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </span>
            </button>
          </div>

          <p className="px-4 text-center text-[11px] text-muted-foreground">
            Share this code with team members to let them join your workspace instantly.
          </p>
        </div>

        <div className="text-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirming((value) => !value)}
            className="h-8 text-xs text-white"
          >
            <LucideDoorClosed className="h-4 w-4" />
            {confirming ? "Click again to end for everyone" : "End Session"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MembersTab({ members, requests, onAccept, onDecline, onKick }) {
  return (
    <div className="-mx-2 space-y-6 px-2">
      {requests.length > 0 ? (
        <div>
          <h4 className="mb-2 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Requests
            <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
              {requests.length}
            </Badge>
          </h4>
          <div className="space-y-1">
            {requests.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded border border-border/50 bg-surface-hover/30 p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover text-xs font-medium text-muted-foreground">
                    {initialOf(user.name)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">Wants to join</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDecline(user.id)}
                    aria-label={`Decline ${user.name}`}
                    className="h-7 w-7 p-0 text-red-600 hover:bg-red-500/10 hover:text-red-500 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAccept(user.id)}
                    aria-label={`Accept ${user.name}`}
                    className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h4 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          In Session ({members.length})
        </h4>
        <div className="space-y-1">
          {members.map((user) => (
            <div
              key={user.id}
              className="group flex items-center justify-between rounded p-2 transition-colors hover:bg-surface-hover/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border bg-surface-hover text-xs font-medium"
                    style={{ borderColor: user.color, color: user.color }}
                  >
                    {initialOf(user.name)}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {user.name}
                    {user.isMe ? <span className="text-xs text-muted-foreground">(You)</span> : null}
                    {user.role === "Owner" ? (
                      <Badge variant="outline" className="h-4 px-1 py-0 text-[10px] font-normal">
                        Host
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </div>
              {user.role !== "Owner" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onKick(user.id)}
                  aria-label={`Remove ${user.name}`}
                  className="h-8 w-8 text-red-600 opacity-0 hover:bg-red-500/10 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100 dark:text-red-400"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeetTab() {
  const [attachToSession, setAttachToSession] = useState(true);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="flex min-h-full flex-col items-center justify-center space-y-6 px-2">
      <div className="space-y-4 text-center">
        <Video className="mx-auto h-8 w-8 opacity-20" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Start a Meeting</h3>
          <p className="mx-auto max-w-[280px] text-xs text-muted-foreground">
            Video, audio, and screen sharing — peer to peer, with its own code.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAttachToSession((value) => !value)}
          aria-pressed={attachToSession}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
            attachToSession ? "border-primary/40 bg-primary/5" : "border-border hover:border-border-strong",
          )}
        >
          <Link2
            className={cn("h-4 w-4 shrink-0", attachToSession ? "text-primary" : "text-muted-foreground")}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-foreground">Use the collab session</span>
            <span className="block text-[11px] text-muted-foreground">
              Everyone on this board joins without a code.
            </span>
          </span>
          <span
            className={cn(
              "h-4 w-4 shrink-0 rounded-full border transition-colors",
              attachToSession ? "border-primary bg-primary" : "border-border",
            )}
          />
        </button>

        <div className="flex items-center justify-center gap-2">
          <Button className="min-w-[150px] text-sm">
            <Video className="h-4 w-4" /> Start Meeting
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowJoin((value) => !value)}
            aria-expanded={showJoin}
            className={cn("text-sm", showJoin && "bg-surface-hover")}
          >
            <LogIn className="h-4 w-4" /> Join
          </Button>
        </div>
      </div>

      {showJoin ? (
        <Input
          placeholder="MEET-XXXX-XXXX"
          aria-label="Meeting code"
          className="bg-surface-subtle text-center font-mono uppercase"
        />
      ) : null}
    </div>
  );
}

function CollaborateDialog({ members, requests, onAccept, onDecline, onKick }) {
  const [activeTab, setActiveTab] = useState("host");

  return (
    <DraggablePanel
      className="z-10 w-full max-w-[23rem]"
      header={
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-base font-normal text-foreground">Collaborate</h4>
          </div>
          <LivePill />
        </div>
      }
    >
      <div className="flex border-b border-border">
        {COLLAB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 border-b-2 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-primary bg-surface-hover/40 text-foreground"
                : "border-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[230px] overflow-y-auto p-4 sm:h-[250px] lg:h-[300px]">
        {activeTab === "host" ? <SessionTab /> : null}
        {activeTab === "members" ? (
          <MembersTab
            members={members}
            requests={requests}
            onAccept={onAccept}
            onDecline={onDecline}
            onKick={onKick}
          />
        ) : null}
        {activeTab === "meet" ? <MeetTab /> : null}
      </div>

      <div className="flex justify-end border-t border-border p-4">
        <Button variant="ghost" className="text-muted-foreground hover:bg-surface-hover hover:text-foreground">
          Close
        </Button>
      </div>
    </DraggablePanel>
  );
}

function PanelSection({ title, aside, children }) {
  return (
    <div className="space-y-2 border-t border-border px-3 py-3 first:border-t-0">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
        {aside}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-sm text-foreground">{label}</span>
        {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function HostControlsPanel({
  className,
  members,
  viewLocked,
  onViewLock,
  permissions,
  onPermissions,
  raisedHands,
  onLowerHand,
}) {
  const [message, setMessage] = useState("");
  const paused = PERMISSIONS.every(({ key }) => !permissions[key]);
  const hands = raisedHands
    .map((id) => members.find((member) => member.id === id))
    .filter(Boolean);

  return (
    <DraggablePanel
      // contain:size keeps this panel out of the pair's height, so it stretches to match the dialog.
      className={cn("z-20 w-72 flex-col [contain:size]", className)}
      header={
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Host controls</span>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Host
          </span>
        </div>
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PanelSection title="Attention">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Users className="h-3.5 w-3.5" /> Bring everyone
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> Spotlight node
            </Button>
          </div>
          <ToggleRow
            label="Lock everyone's view to mine"
            hint="Everyone follows you until you release."
            checked={viewLocked}
            onChange={onViewLock}
          />
          <div className="flex items-center gap-1.5">
            <div className="relative min-w-0 flex-1">
              <Megaphone className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && setMessage("")}
                placeholder="Announce to everyone…"
                aria-label="Announcement"
                maxLength={280}
                className="h-8 w-full rounded-md border border-border bg-surface-card pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-border-strong focus:outline-none"
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setMessage("")}
              disabled={!message.trim()}
              aria-label="Send announcement"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </PanelSection>

        <PanelSection
          title={`Raised hands${hands.length ? ` (${hands.length})` : ""}`}
          aside={
            hands.length > 1 ? (
              <button
                type="button"
                onClick={() => onLowerHand("*")}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Lower all
              </button>
            ) : null
          }
        >
          {hands.length ? (
            <ol className="space-y-1">
              {hands.map((member, index) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-surface-hover"
                >
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <span className="w-4 text-right text-[11px] tabular-nums text-muted-foreground">{index + 1}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: member.color }} />
                    <span className="truncate text-foreground">{member.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onLowerHand(member.id)}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  >
                    <Hand className="h-3 w-3" /> Lower
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-muted-foreground">No hands up.</p>
          )}
        </PanelSection>

        <PanelSection title="Participants can">
          {PERMISSIONS.map(({ key, label }) => (
            <ToggleRow
              key={key}
              label={label}
              checked={permissions[key]}
              onChange={(on) => onPermissions({ ...permissions, [key]: on })}
            />
          ))}
        </PanelSection>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border px-3 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPermissions(paused ? OPEN_PERMISSIONS : PAUSED_PERMISSIONS)}
          className={cn(
            "h-8 text-xs",
            paused && "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
          )}
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? "Resume all" : "Pause all"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
        >
          <DoorClosed className="h-3.5 w-3.5" /> End for all
        </Button>
      </div>
    </DraggablePanel>
  );
}

function LiveSessionStage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [raisedHands, setRaisedHands] = useState(["ravi"]);
  const [viewLocked, setViewLocked] = useState(true);
  const [permissions, setPermissions] = useState(OPEN_PERMISSIONS);

  const acceptRequest = (id) => {
    const request = requests.find((item) => item.id === id);
    if (!request) return;
    setRequests((prev) => prev.filter((item) => item.id !== id));
    setMembers((prev) => [...prev, { ...request, role: "Editor" }]);
  };

  const declineRequest = (id) => setRequests((prev) => prev.filter((item) => item.id !== id));

  const kickMember = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
    setRaisedHands((prev) => prev.filter((handId) => handId !== id));
  };

  const lowerHand = (id) => setRaisedHands((prev) => (id === "*" ? [] : prev.filter((handId) => handId !== id)));

  return (
    <div
      className="relative h-full overflow-hidden bg-background bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/internal-brand-023-3291bb4c.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/12" />

      {permissions.cursors
        ? CURSORS.map((cursor) => {
            const member = members.find((item) => item.id === cursor.id);
            return member ? (
              <LiveCursor key={cursor.id} name={member.name} color={member.color} className={cursor.className} />
            ) : null;
          })
        : null}

      {viewLocked ? (
        <div className="pointer-events-none absolute left-1/2 top-3 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 justify-center">
          <StatusPill icon={Lock} action="Release" onAction={() => setViewLocked(false)}>
            Everyone&apos;s view follows yours
          </StatusPill>
        </div>
      ) : null}

      {/* Auto height so the row is as tall as the dialog; host controls only show where they fit beside it. */}
      <div className="absolute inset-x-0 bottom-14 flex justify-center gap-6 px-4 sm:bottom-16">
        <CollaborateDialog
          members={members}
          requests={requests}
          onAccept={acceptRequest}
          onDecline={declineRequest}
          onKick={kickMember}
        />

        <HostControlsPanel
          className="hidden min-[840px]:max-lg:flex min-[1250px]:flex"
          members={members}
          viewLocked={viewLocked}
          onViewLock={setViewLocked}
          permissions={permissions}
          onPermissions={setPermissions}
          raisedHands={raisedHands}
          onLowerHand={lowerHand}
        />
      </div>
    </div>
  );
}

export default function CollaboratorTabsShowcase({ backgroundImage, ctaHref, ctaLabel }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#212121] bg-background bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6 md:p-8 xl:p-10"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">

        <div className="flex w-full flex-col items-start justify-center space-y-6 lg:w-[30%]">
          <div className="space-y-4">
            <h3 className="text-2xl leading-snug font-semibold text-[#f5f5f5] sm:text-3xl">
              Collaborate in Real&#8209;Time to Plan & Execute
            </h3>
            <p className="text-base text-[#bcbcbc] sm:text-lg">
              Share a code and your team is on the board with you: live cursors, a laser pointer and a
              view that follows yours. Run the room from host controls, with a meeting one tab away.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 font-medium text-[#ee6b3b] transition-colors hover:text-[#ff8052]"
          >
            {ctaLabel || "Checkout Notes"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="w-full flex-1 lg:w-[70%]">
          <div className="relative overflow-hidden rounded-2xl border border-[#313131] bg-surface-card p-1.5 shadow-2xl">
            <div className="h-[520px] overflow-hidden rounded-xl border border-[#313131] bg-background sm:h-[560px] lg:h-[600px]">
              <LiveSessionStage />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
