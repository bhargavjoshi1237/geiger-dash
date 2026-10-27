"use client";

import { useRef } from "react";
import { Columns3, FileStack, FileText, ListFilter, Redo2, SlidersHorizontal, StickyNote, Table, Ticket, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarStack, LINE, PriorityIcon, StatusIcon, Window } from "@/components/product-pages/mock_kit";
import { CANVAS_DOTS, GroupHeader, IssueRow, Points } from "@/components/product-pages/plan/plan_kit";
import { RoadmapWindow } from "@/components/product-pages/plan/roadmap_renders";
import { Camera } from "@/components/film/camera";
import { useFrame } from "@/components/film/clock";
import { glide, progress, sample, swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { ActTitle, Caption, Clock, Cursor, Fade, Grow } from "@/components/film/kinetic";

// Act two, Plan: the team turns the night into issues in Flow, works the run of show on a Notes board, then the roadmap.

const IN_PROGRESS = [
  { id: "FN-14", title: "Door staff rota for Gate B", status: "progress", priority: "high", assignee: "Marco", points: 3, labels: ["ops"] },
  { id: "FN-12", title: "Print wristbands for the Record Lounge", status: "progress", priority: "medium", assignee: "Aria", points: 2 },
];

const TODO = [
  { id: "FN-18", title: "Seat map for the lower bowl", status: "todo", priority: "medium", assignee: "Sam", points: 5, labels: ["venue"] },
  { id: "FN-19", title: "Kiosk tablets at every gate", status: "todo", priority: "high", assignee: "Marco", points: 3, labels: ["ops"] },
  { id: "FN-20", title: "Run of show for fight night", status: "todo", priority: "low", assignee: "Aria", points: 2 },
];

const NEW_ISSUE = { id: "FN-21", title: "Hold 40 seats together for Northwind", priority: "high", points: 1, labels: ["groups"] };

const STATUSES = [
  ["backlog", "Backlog"],
  ["todo", "Todo"],
  ["progress", "In Progress"],
  ["review", "In Review"],
  ["done", "Done"],
];

// The new issue's row: its status flips from Todo to In Progress when the menu is clicked, and Aria picks it up.
function NewIssueRow() {
  return (
    <div className={cn("relative flex h-12 items-center gap-3 border-b bg-foreground/[0.045] px-6 text-[15px]", LINE)}>
      <PriorityIcon level={NEW_ISSUE.priority} />
      <span className="w-[66px] shrink-0 text-[13px] text-muted-foreground tabular-nums">{NEW_ISSUE.id}</span>
      <span className="relative size-3.5">
        <Fade at={-1} out={5.05} exit={0.05} y={0} duration={0.01} className="absolute inset-0">
          <StatusIcon status="todo" />
        </Fade>
        <Fade at={5.05} y={0} scale={0.4} duration={0.3} className="absolute inset-0">
          <StatusIcon status="progress" />
        </Fade>
      </span>
      <span className="min-w-0 flex-1 truncate text-foreground">{NEW_ISSUE.title}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[12px] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-foreground/40" />
        groups
      </span>
      <Points value={NEW_ISSUE.points} />
      <span className="relative size-5">
        <Fade at={-1} out={5.3} exit={0.05} y={0} duration={0.01} className="absolute inset-0">
          <span className="block size-5 rounded-full border border-dashed border-foreground/30" />
        </Fade>
        <Fade at={5.3} y={0} scale={0.5} duration={0.35} className="absolute inset-0">
          <Avatar name="Aria" size={20} />
        </Fade>
      </span>
    </div>
  );
}

function StatusMenu() {
  const highlight = useRef(null);
  useFrame((local) => {
    // The highlight steps down the list as the pointer moves from Todo to In Progress.
    const row = sample([{ t: 4.45, r: 1 }, { t: 4.8, r: 2, ease: swift }], local).r;
    if (highlight.current) highlight.current.style.transform = `translateY(${row * 36}px)`;
  });
  return (
    <Fade at={4.4} out={5.12} exit={0.15} y={-6} scale={0.97} duration={0.22} className="absolute top-[42px] left-[96px] z-20 w-[230px] rounded-xl border border-foreground/[0.12] bg-surface-dialog p-1.5 text-[14px] shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)]">
      <div className="relative">
        <div ref={highlight} className="absolute inset-x-0 top-0 h-9 rounded-lg bg-foreground/[0.08]" />
        {STATUSES.map(([status, label], index) => (
          <div key={status} className="relative flex h-9 items-center gap-2.5 px-2.5">
            <StatusIcon status={status} />
            <span className="text-foreground/90">{label}</span>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">{index + 1}</span>
          </div>
        ))}
      </div>
    </Fade>
  );
}

// Flow's issue list for the event's project, at film scale.
function Tracker() {
  return (
    <Window className="h-[720px] w-[1380px] text-[15px]">
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b px-6", LINE)}>
        <span className="flex size-6 items-center justify-center rounded-md bg-foreground/[0.08]">
          <Ticket className="size-3.5 text-foreground/80" />
        </span>
        <span className="font-medium">Fight Night 12</span>
        <span className="text-muted-foreground">›</span>
        <span className="text-muted-foreground">Issues</span>
        <span className="ml-5 flex gap-1 text-[13px]">
          {["All issues", "Active", "Backlog"].map((tab, index) => (
            <span key={tab} className={cn("rounded-md px-2.5 py-1", index === 1 ? "bg-foreground/[0.08] text-foreground" : "text-muted-foreground")}>
              {tab}
            </span>
          ))}
        </span>
        <span className="ml-auto flex items-center gap-4 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ListFilter className="size-4" /> Filter
          </span>
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4" /> Display
          </span>
          <AvatarStack names={["Aria", "Marco", "Sam"]} size={24} />
        </span>
      </div>
      <div className="[&_.h-10]:h-12 [&_.h-10]:text-[15px] [&_.h-9]:h-11 [&_.h-9]:text-[14px]">
        <GroupHeader status="progress" count={2} />
        {IN_PROGRESS.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
        <GroupHeader status="todo" count={4} />
        <div className="relative">
          <Grow at={3.1} height={48}>
            <NewIssueRow />
          </Grow>
          <StatusMenu />
        </div>
        {TODO.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
        <GroupHeader status="done" count={9} />
        <IssueRow issue={{ id: "FN-9", title: "Book Harbour Arena for 14 November", status: "done", priority: "high", assignee: "Sam", points: 8 }} />
      </div>
      <Cursor
        keys={[
          { t: 3.7, x: 420, y: 420 },
          { t: 4.3, x: 133, y: 262 },
          { t: 4.75, x: 196, y: 376, ease: glide },
        ]}
        clicks={[4.33, 5.0]}
      />
    </Window>
  );
}

export function PlanFlow() {
  return (
    <>
      <Stage />
      <Camera
        width={1380}
        height={720}
        keys={[
          { t: 0, z: -640, rx: 22, ry: 10, rz: -4, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 2.4, z: -580, rx: 21, ry: 9, rz: -4, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 3.1, z: 160, s: 1.34, rx: 11, ry: 7, rz: -2, x: 260, y: 60, blur: 5, fr: 52, fx: 40, fy: 44, o: 1, ease: swift },
          { t: 6.5, z: 300, s: 1.34, rx: 8, ry: 5, rz: -1.5, x: 330, y: 40, blur: 5, fr: 50, fx: 40, fy: 46, o: 1 },
        ]}
      >
        <Tracker />
      </Camera>
      <ActTitle index="02" label="Plan" title={"Plan the work from\nfirst sketch to launch."} at={0.1} out={2.3} />
      <Caption app="flow" name="Flow" text="Issues, cycles and roadmaps" at={3.2} out={6.1} />
    </>
  );
}
PlanFlow.cues = [
  { at: 0.1, sound: "whoosh", gain: 0.5 },
  { at: 2.5, sound: "whoosh", gain: 0.35 },
  { at: 3.1, sound: "pop", gain: 0.7 },
  { at: 4.33, sound: "click" },
  { at: 5.0, sound: "click" },
  { at: 5.05, sound: "tick" },
];

const RUN_OF_SHOW = [
  { time: "18:00", title: "Doors and prelims", notes: ["Kiosks live at Gates A–D", "Record Lounge opens"] },
  { time: "20:30", title: "Main card", notes: ["Walkouts on the display boards", "Northwind group seated, block F"] },
  { time: "22:15", title: "Title fight", notes: ["Photo pit: two approved shooters", "Recap draft ready by 23:30"] },
];

// A teammate's live cursor with a name tag, gliding through keyframed points.
function LiveCursor({ name, keys }) {
  const ref = useRef(null);
  useFrame((local) => {
    const point = sample(keys, local);
    if (ref.current) ref.current.style.transform = `translate(${point.x}px, ${point.y}px)`;
  });
  return (
    <div ref={ref} className="absolute top-0 left-0 z-[6] flex items-start">
      <svg width="22" height="25" viewBox="0 0 16 18" className="drop-shadow-sm">
        <path d="M1 1 L1 15 L5 11.2 L7.8 17 L10.2 15.9 L7.4 10.2 L13 10.2 Z" className="fill-foreground stroke-background" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="mt-4 -ml-0.5 rounded-full bg-foreground px-2.5 py-0.5 text-[13px] font-medium text-background">{name}</span>
    </div>
  );
}

// A sticky that Marco drags from the inbox column into the main card.
function DraggedSticky() {
  const ref = useRef(null);
  useFrame((local) => {
    const point = sample([{ t: 0, x: 980, y: 470 }, { t: 0.6, x: 980, y: 470 }, { t: 2.2, x: 386, y: 300, ease: glide }], local);
    const lift = progress(local, 0.55, 0.2) * (1 - progress(local, 2.2, 0.25));
    if (ref.current) {
      ref.current.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${lift * -3}deg) scale(${1 + lift * 0.04})`;
      ref.current.style.boxShadow = `0 ${8 + lift * 24}px ${20 + lift * 40}px -10px rgb(0 0 0 / ${0.3 + lift * 0.35})`;
    }
  });
  return (
    <div ref={ref} className="absolute top-0 left-0 z-[5] w-[250px] rounded-lg border border-amber-500/30 bg-amber-500/[0.12] px-3.5 py-3 text-[14px] leading-snug text-foreground">
      Hold 40 seats together for Northwind
    </div>
  );
}

function RunOfShowBoard() {
  return (
    <Window className="h-[720px] w-[1380px] text-[14px]">
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b px-5", LINE)}>
        <FileStack className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-muted-foreground">Boards</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="font-medium">Fight Night 12 — run of show</span>
        <span className="ml-3 flex items-center gap-2.5 text-muted-foreground">
          <Undo2 className="size-4" />
          <Redo2 className="size-4" />
        </span>
        <span className="ml-auto flex items-center gap-3">
          <AvatarStack names={["Aria", "Marco", "Sam"]} size={26} />
          <span className="flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background">Collaborate</span>
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden" style={{ ...CANVAS_DOTS, backgroundSize: "22px 22px" }}>
        {RUN_OF_SHOW.map((block, index) => (
          <div key={block.time} className="absolute top-10 w-[270px] rounded-xl border border-foreground/[0.1] bg-surface-subtle p-3" style={{ left: 90 + index * 300 }}>
            <div className="flex items-center gap-2 px-1 pb-3 text-[15px] font-medium">
              <Columns3 className="size-4 text-muted-foreground" />
              <span className="font-mono text-[13px] text-muted-foreground">{block.time}</span>
              {block.title}
            </div>
            <div className="flex flex-col gap-2.5">
              {block.notes.map((note) => (
                <div key={note} className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.04] px-3.5 py-3 leading-snug text-foreground/90">
                  {note}
                </div>
              ))}
              {index === 1 ? <div className="h-[52px] rounded-lg border border-dashed border-foreground/15" /> : null}
            </div>
          </div>
        ))}
        <div className="absolute top-10 left-[990px] w-[300px] rounded-xl border border-foreground/[0.1] bg-surface-subtle p-3">
          <div className="flex items-center gap-2 px-1 pb-3 text-[15px] font-medium">
            <StickyNote className="size-4 text-muted-foreground" /> Inbox
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.04] px-3.5 py-3 leading-snug text-foreground/90">Step-free route from Gate B</div>
            <div className="h-[52px]" />
          </div>
        </div>
        <div className="absolute top-[330px] left-[90px] w-[570px] overflow-hidden rounded-xl border border-foreground/[0.1] bg-surface-subtle text-[13px]">
          <div className={cn("flex items-center gap-2 border-b px-4 py-2.5 font-medium", LINE)}>
            <Table className="size-4 text-muted-foreground" /> Gate staffing
          </div>
          {[
            ["Gate", "Opens", "Staff", "Kiosks"],
            ["A", "18:00", "6", "2"],
            ["B", "18:00", "8", "3"],
            ["C", "18:30", "4", "2"],
          ].map((row, index) => (
            <div key={row[0]} className={cn("grid grid-cols-4 border-b px-4 py-2 tabular-nums last:border-b-0", LINE, index === 0 ? "text-[12px] text-muted-foreground" : "text-foreground/85")}>
              {row.map((cell, cellIndex) => (
                <span key={cellIndex}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute top-[330px] left-[690px] w-[270px] rounded-xl border border-foreground/[0.1] bg-surface-subtle p-4">
          <div className="flex items-center gap-2 font-medium">
            <FileText className="size-4 text-muted-foreground" /> Fight night brief
          </div>
          <div className="mt-3.5 flex flex-col gap-2.5">
            {[94, 80, 88, 62, 76].map((width) => (
              <span key={width} className="block h-2 rounded-full bg-foreground/[0.08]" style={{ width: `${width}%` }} />
            ))}
          </div>
        </div>
        <DraggedSticky />
        <LiveCursor name="Marco" keys={[{ t: 0, x: 1150, y: 560 }, { t: 0.55, x: 1110, y: 500 }, { t: 2.2, x: 516, y: 330, ease: glide }, { t: 4, x: 540, y: 360 }]} />
        <LiveCursor name="Aria" keys={[{ t: 0, x: 240, y: 470 }, { t: 1.6, x: 330, y: 430 }, { t: 3.2, x: 300, y: 520 }, { t: 4.5, x: 360, y: 480 }]} />
      </div>
    </Window>
  );
}

export function PlanNotes() {
  return (
    <>
      <Stage />
      <Camera
        width={1380}
        height={720}
        keys={[
          { t: 0, z: 40, s: 1.05, rx: 14, ry: -10, rz: 2, x: -40, y: 10, blur: 5, fr: 50, fx: 48, fy: 46 },
          { t: 4.5, z: 220, s: 1.05, rx: 10, ry: -6, rz: 1, x: 60, y: -10, blur: 5, fr: 50, fx: 44, fy: 44 },
        ]}
      >
        <RunOfShowBoard />
      </Camera>
      <Caption app="notes" name="Notes" text="Think it through together, live" at={0.6} out={3.6} />
    </>
  );
}
PlanNotes.cues = [{ at: 2.25, sound: "tick" }];

export function PlanRoadmap() {
  return (
    <>
      <Stage />
      <Camera
        width={1180}
        height={720}
        keys={[
          { t: 0, z: -80, s: 1.15, rx: 26, ry: 14, rz: -6, x: 260, y: 60, blur: 6, fr: 46, fx: 58, fy: 52 },
          { t: 2, z: 220, s: 1.15, rx: 18, ry: 8, rz: -3, x: 40, y: 0, blur: 6, fr: 46, fx: 56, fy: 52, ease: glide },
        ]}
      >
        <Clock at={-1.3}>
          <RoadmapWindow />
        </Clock>
      </Camera>
      <Caption app="flow" name="Flow" text="See the whole plan" at={0.1} out={1.6} />
    </>
  );
}
PlanRoadmap.cues = [{ at: 0, sound: "whoosh", gain: 0.45 }];

export const PLAN_SHOTS = { plan_flow: PlanFlow, plan_notes: PlanNotes, plan_roadmap: PlanRoadmap };
