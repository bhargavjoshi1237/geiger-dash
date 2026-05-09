"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  LucideDoorClosed,
  UserMinus,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MEMBERS = [
  { id: "you", name: "You (Host)", role: "Owner", status: "online", isMe: true },
  { id: "aanya", name: "Aanya", role: "Editor", status: "online" },
  { id: "ravi", name: "Ravi", role: "Viewer", status: "idle" },
];

function DraggableCollaboratorDialog({
  activeTab,
  children,
  className = "",
  footer,
}) {
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
        "absolute z-10 w-[min(26rem,calc(100%-1.5rem))] overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] text-zinc-100 shadow-xl",
        className,
      )}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    >
      <div
        className="cursor-move touch-none select-none border-b border-zinc-800 p-4"
        onPointerDown={beginDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-zinc-400" />
            <h4 className="text-base font-normal text-zinc-100">Collaborate</h4>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </div>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 bg-[#1e1e1e]">
        {[
          { id: "session", label: "Session" },
          { id: "members", label: "Members" },
          { id: "join", label: "Join" },
          { id: "merge", label: "Merge" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex-1 border-b-2 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-zinc-100 bg-zinc-800/30 text-zinc-100"
                : "border-transparent text-zinc-500",
            )}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[250px] bg-[#1e1e1e] p-4">{children}</div>

      <div className="flex justify-end gap-2 border-t border-zinc-800 bg-[#1e1e1e] p-4">
        {footer}
      </div>
    </div>
  );
}

function SessionTabPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Session Active
            </span>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <button
              className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-300"
              type="button"
            >
              <span className="select-all font-mono text-xl font-bold tracking-[0.15em] text-zinc-100">
                GEIGER-4G7Q-2M9A
              </span>
              <span className="flex w-[10%] items-center justify-center text-zinc-500">
                <Copy className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>

          <p className="px-4 text-center text-[11px] text-zinc-600">
            Share this code with team members to let them join your workspace
            instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

function MembersTabPreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="-mx-2 flex-1 overflow-hidden px-2">
        <h4 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          In Session ({MEMBERS.length})
        </h4>
        <div className="space-y-1">
          {MEMBERS.map((member) => (
            <div
              className="group flex items-center justify-between rounded p-2 transition-colors hover:bg-zinc-800/50"
              key={member.id}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1e1e1e]",
                      member.status === "online" ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                    {member.name}
                    {member.isMe && (
                      <span className="text-xs text-zinc-500">(You)</span>
                    )}
                    {member.role === "Owner" && (
                      <span className="h-4 rounded border border-zinc-700 px-1 text-[10px] font-normal text-zinc-400">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">{member.role}</div>
                </div>
              </div>
              {!member.isMe && (
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                  type="button"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollaboratorTabsShowcase({
  backgroundImage,
  ctaHref,
  ctaLabel,
}) {
  return (
    <section
      className="relative overflow-hidden rounded-sm border border-[#212121] bg-[#161616] bg-cover bg-center bg-no-repeat p-4 sm:p-6 md:p-8 xl:p-10"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold leading-snug text-[#f5f5f5] sm:text-3xl">
            Collaborate in Real-Time to Pplan & Execute.
          </h3>
          <p className="text-base text-[#bcbcbc] sm:text-lg">
            Invite your team to collaborate in real-time, ensuring everyone stays aligned while you plan and execute together.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 font-medium text-[#ee6b3b] transition-colors hover:text-[#ff8052]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#2f2f2f] bg-[#101010] p-3">
          <div
            className="relative h-[520px] overflow-hidden rounded-lg border border-[#2b2b2b] bg-cover bg-center bg-no-repeat p-3 sm:h-[560px] sm:p-4 md:h-[600px] md:p-6"
            style={{
              backgroundImage:
                "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Finternal-brand%2Finternal-brand-023-3291bb4c.jpg&w=1920&q=70')",
            }}
          >
            <div className="absolute inset-0 bg-black/12" />
            <DraggableCollaboratorDialog
              activeTab="session"
              className="left-3 top-3 sm:left-4 sm:top-5 md:left-8 md:top-8"
              footer={
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-3 text-xs font-medium text-white"
                  type="button"
                >
                  <LucideDoorClosed className="mr-1 h-4 w-4" />
                  End Session
                </button>
              }
            >
              <SessionTabPreview />
            </DraggableCollaboratorDialog>

            <DraggableCollaboratorDialog
              activeTab="members"
              className="bottom-3 right-3 z-20 sm:bottom-5 md:bottom-8 md:right-8"
              footer={
                <button
                  className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-800 px-3 text-sm font-medium text-zinc-400"
                  type="button"
                >
                  Close
                </button>
              }
            >
              <MembersTabPreview />
            </DraggableCollaboratorDialog>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
