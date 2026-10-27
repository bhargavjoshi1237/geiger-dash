"use client";

import { Check, ChevronDown, Clock, CornerDownLeft, Hash, Kanban, MessageCircle, Paperclip, SendHorizontal, Sparkles, Table2, Timer, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Chip, Dot, Kbd, LINE, Window } from "@/components/product-pages/mock_kit";
import { InboxRow } from "@/components/product-pages/intake/comms_renders";
import { ResponseStatus } from "@/components/product-pages/intake/forms_renders";
import { Camera } from "@/components/film/camera";
import { swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { ActTitle, Caption, Cursor, Fade, Grow, TypeOn } from "@/components/film/kinetic";

// Act one, Intake: Jordan's message lands in the Comms inbox and gets an answer, then the group's details come in through a Forms form.

const QUEUE = [
  { name: "Devon Parker", subject: "How do I invite my team?", preview: "Thanks! And can teammates have different roles?", time: "14m", unread: true, assignee: "Aria" },
  { name: "Tomas Ruiz", subject: "Mobile app keeps logging me out", preview: "Still happening on the latest build.", time: "32m", urgent: true, tag: "bug" },
  { name: "Priya Nair", subject: "Accessible seating", preview: "Is there step-free access at Gate B?", time: "1h", assignee: "Marco" },
  { name: "Amara Okafor", subject: "Invoice PDF missing VAT number", preview: "Our finance team needs it on every invoice.", time: "3h", tag: "billing", assignee: "Aria" },
  { name: "Diego Alvarez", subject: "Transfer my ticket", preview: "Can I put my second ticket in my partner's name?", time: "5h", assignee: "Marco" },
  { name: "Hannah Feld", subject: "Loving the new seat map", preview: "Picking seats was so easy this year.", time: "2d", assignee: "Marco" },
];

const JORDAN = { name: "Jordan Lee", subject: "Group booking, 40 seats", preview: "Hi! Can we get 40 seats together for Fight Night 12?", time: "now", unread: true, waiting: "1m", tag: "groups" };

const REPLY = "Yes! We can seat all 40 of you together. Sending the form now.";

function Bubble({ from, side = "left", time, children }) {
  const mine = side === "right";
  return (
    <div className={cn("flex gap-3", mine && "flex-row-reverse")}>
      <Avatar name={from} size={32} />
      <div className="max-w-[78%]">
        <div className={cn("mb-1 flex items-baseline gap-2 text-[13px]", mine && "justify-end")}>
          <span className="font-medium text-foreground">{from}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
        <div className={cn("rounded-2xl px-4 py-3 text-[15px] leading-6", mine ? "rounded-tr-sm bg-foreground text-background" : "rounded-tl-sm border border-foreground/[0.08] text-foreground/90")}>{children}</div>
      </div>
    </div>
  );
}

function PanelRow({ label, children }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-foreground/90">{children}</span>
    </div>
  );
}

// Comms, drawn at film scale: the queue, Jordan's thread with a reply being written, and the contact.
function Inbox() {
  return (
    <Window className="h-[700px] w-[1560px] flex-row text-[14px]">
      <div className="flex w-full">
        <div className={cn("flex w-[380px] shrink-0 flex-col border-r", LINE)}>
          <div className={cn("flex h-14 items-center gap-2 border-b px-4", LINE)}>
            <span className="font-medium">All Conversations</span>
            <span className="text-muted-foreground">48</span>
            <span className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground">
              Newest activity <ChevronDown className="size-3" />
            </span>
          </div>
          <Grow at={3.0} height={97}>
            <InboxRow conversation={JORDAN} active />
          </Grow>
          {QUEUE.map((conversation) => (
            <InboxRow key={conversation.name} conversation={conversation} />
          ))}
        </div>
        <div className={cn("flex min-w-0 flex-1 flex-col border-r", LINE)}>
          <div className={cn("flex h-14 shrink-0 items-center gap-2 border-b px-6", LINE)}>
            <span className="font-medium">Group booking, 40 seats</span>
            <Chip className="h-6 text-[12px]">groups</Chip>
            <div className="ml-auto flex items-center gap-3 text-muted-foreground">
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-foreground/10 px-2.5 text-[12px]">
                <Timer className="size-3" /> First reply in 14m
              </span>
              <UserPlus className="size-4" />
              <Clock className="size-4" />
              <Check className="size-4" />
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-6 px-7 py-7">
            <Fade at={3.3} y={10}>
              <Bubble from="Jordan Lee" time="9:41">
                Hi! Can we get 40 seats together for Fight Night 12? It&apos;s for our company night out.
              </Bubble>
            </Fade>
            <Fade at={6.55} y={14} duration={0.5}>
              <Bubble from="Aria" side="right" time="9:43">
                {REPLY}
              </Bubble>
            </Fade>
          </div>
          <div className="px-7 pb-7">
            <div className="rounded-xl border border-foreground/[0.1] dark:bg-foreground/[0.02]">
              <div className={cn("flex items-center gap-4 border-b px-4 pt-3 text-[13px]", LINE)}>
                <span className="border-b border-foreground pb-2.5 font-medium text-foreground">Reply</span>
                <span className="pb-2.5 text-muted-foreground">Note</span>
                <span className="ml-auto pb-2.5 text-muted-foreground">To Jordan Lee by chat</span>
              </div>
              <div className="relative min-h-[4.5rem] px-4 py-3.5 text-[15px] leading-6">
                <Fade at={-1} out={6.5} exit={0.1} y={0} duration={0.01}>
                  <TypeOn text={REPLY} at={3.9} speed={2} caretUntil={6.4} />
                </Fade>
                <Fade at={6.6} y={0} duration={0.3} className="absolute inset-x-4 top-3.5 text-muted-foreground">
                  Write a reply… Type # for a macro.
                </Fade>
              </div>
              <div className="flex items-center gap-3 px-3.5 pb-3 text-muted-foreground">
                <Paperclip className="size-4" />
                <Hash className="size-4" />
                <Sparkles className="size-4" />
                <span className="ml-auto text-[12px]">Ctrl ↵ to send</span>
                <span className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-[13px] font-medium text-background">
                  Send <SendHorizontal className="size-3.5" />
                </span>
              </div>
            </div>
          </div>
          <Cursor
            keys={[
              { t: 5.6, x: 900, y: 420 },
              { t: 6.3, x: 1196, y: 650 },
            ]}
            clicks={[6.45]}
          />
        </div>
        <div className="flex w-[280px] shrink-0 flex-col gap-5 px-5 py-6 text-[13px]">
          <div className="flex items-center gap-3">
            <Avatar name="Jordan Lee" size={40} />
            <div>
              <div className="text-[14px] font-medium">Jordan Lee</div>
              <div className="text-muted-foreground">jordan@northwind.io</div>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[12px] font-medium text-muted-foreground">Conversation</div>
            <PanelRow label="Status">
              <Dot tone="strong" /> Open
            </PanelRow>
            <PanelRow label="Assignee">
              <Avatar name="Aria" size={18} /> Aria
            </PanelRow>
            <PanelRow label="Priority">
              <Dot tone="amber" /> High
            </PanelRow>
            <PanelRow label="Tags">
              <Chip className="h-5 px-2 text-[11px]">groups</Chip>
            </PanelRow>
            <PanelRow label="Channel">
              <MessageCircle className="size-3.5 text-muted-foreground" /> Chat
            </PanelRow>
            <PanelRow label="Started">Today, 9:41</PanelRow>
          </div>
        </div>
      </div>
    </Window>
  );
}

export function IntakeComms() {
  return (
    <>
      <Stage />
      <Camera
        width={1560}
        height={700}
        keys={[
          { t: 0, z: -620, rx: 20, ry: -12, rz: 4, y: 40, blur: 14, fr: 0, o: 0.75 },
          { t: 2.4, z: -560, rx: 19, ry: -11, rz: 4, y: 40, blur: 14, fr: 0, o: 0.75 },
          { t: 3.2, z: 120, s: 1.42, rx: 12, ry: -9, rz: 2.5, x: -70, y: 150, blur: 5, fr: 54, fx: 50, fy: 34, o: 1, ease: swift },
          { t: 4.2, z: 160, s: 1.42, rx: 11, ry: -8, rz: 2, x: -100, y: -110, blur: 5, fr: 56, fx: 52, fy: 64, o: 1 },
          { t: 6.3, z: 220, s: 1.42, rx: 10, ry: -7, rz: 1.8, x: -150, y: -100, blur: 5, fr: 56, fx: 56, fy: 66, o: 1 },
          { t: 7.0, z: 250, s: 1.42, rx: 9, ry: -6, rz: 1.5, x: -170, y: 90, blur: 5, fr: 56, fx: 56, fy: 42, o: 1 },
          { t: 8.5, z: 270, s: 1.42, rx: 9, ry: -6, rz: 1.5, x: -180, y: 90, blur: 5, fr: 56, fx: 56, fy: 42, o: 1 },
        ]}
      >
        <Inbox />
      </Camera>
      <ActTitle index="01" label="Intake" title={"Every request has\nsomewhere to land."} at={0.1} out={2.3} />
      <Caption app="comms" name="Comms" text="One shared inbox for every conversation" at={3.3} out={7.9} />
    </>
  );
}
IntakeComms.cues = [
  { at: 0.1, sound: "whoosh", gain: 0.5 },
  { at: 2.6, sound: "whoosh", gain: 0.35 },
  { at: 3.0, sound: "pop" },
  { at: 6.45, sound: "click" },
  { at: 6.55, sound: "send" },
];

const SEATING = ["Together, lower bowl", "Spread across tiers", "Not sure yet"];

// The group form in conversational mode: one question per screen, answered from the keyboard.
function GroupForm() {
  return (
    <div className="w-[640px] overflow-hidden rounded-3xl border border-foreground/[0.1] bg-surface-subtle text-[18px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.85)]">
      <div className="h-1.5 bg-foreground/[0.06]">
        <ProgressFill />
      </div>
      <div className="relative h-[470px] px-12 pt-12">
        <Fade at={-1} out={1.45} exit={0.3} y={0} duration={0.01} className="absolute inset-x-12 top-12">
          <div className="mb-4 flex items-center gap-2 text-[15px] text-muted-foreground">
            <span className="font-mono">3</span>→ <span>of 6</span>
          </div>
          <div className="text-[30px] leading-snug font-medium tracking-tight">How many seats do you need?</div>
          <div className="mt-1.5 text-[17px] text-muted-foreground">We&apos;ll hold them together while you confirm.</div>
          <div className="mt-9 border-b-2 border-foreground/70 pb-2 text-[40px] font-medium tracking-tight">
            <TypeOn text="40" at={0.5} speed={0.5} caretUntil={1.4} />
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[16px] font-medium text-background">
              OK <Check className="size-4" />
            </span>
            <span className="flex items-center gap-1.5 text-[15px] text-muted-foreground">
              press <Kbd>Enter</Kbd> <CornerDownLeft className="size-3.5" />
            </span>
          </div>
        </Fade>
        <Fade at={1.7} out={3.6} exit={0.35} y={40} duration={0.6} className="absolute inset-x-12 top-12">
          <div className="mb-4 flex items-center gap-2 text-[15px] text-muted-foreground">
            <span className="font-mono">4</span>→ <span>of 6</span>
          </div>
          <div className="text-[30px] leading-snug font-medium tracking-tight">Where would you like to sit?</div>
          <div className="mt-7 flex flex-col gap-3">
            {SEATING.map((option, index) => (
              <div key={option} className="relative flex items-center gap-4 rounded-xl border border-foreground/[0.12] px-4 py-3.5">
                <span className="flex size-7 items-center justify-center rounded-md border border-foreground/15 font-mono text-[14px] text-muted-foreground">{"ABC"[index]}</span>
                {option}
                {index === 0 ? (
                  <Fade at={2.75} y={0} duration={0.15} className="absolute inset-0 flex items-center justify-end rounded-xl border-2 border-foreground/60 bg-foreground/[0.07] pr-4">
                    <Check className="size-5" />
                  </Fade>
                ) : null}
              </div>
            ))}
          </div>
        </Fade>
        <Fade at={3.95} y={30} duration={0.6} className="absolute inset-x-12 top-24 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-8" strokeWidth={3} />
          </div>
          <div className="text-[32px] font-medium tracking-tight">Thanks, Jordan.</div>
          <div className="mt-2 text-[18px] text-muted-foreground">Your 40 seats are being held together.</div>
        </Fade>
      </div>
    </div>
  );
}

function ProgressFill() {
  return (
    <div className="relative h-full">
      <Fade at={-1} out={1.5} exit={0.2} y={0} duration={0.01} className="absolute inset-y-0 left-0 w-1/3 bg-foreground/70" />
      <Fade at={1.5} out={3.8} exit={0.2} y={0} duration={0.2} className="absolute inset-y-0 left-0 w-1/2 bg-foreground/70" />
      <Fade at={3.8} y={0} duration={0.2} className="absolute inset-y-0 left-0 w-full bg-emerald-500" />
    </div>
  );
}

const RESPONSES = [
  { name: "Lena Novak", company: "Cobalt Retail", seats: 12, status: "Approved", time: "1h" },
  { name: "Kofi Asante", company: "Lumen Health", seats: 24, status: "Awaiting payment", time: "3h" },
  { name: "Theo Lindqvist", company: "Atlas Coffee", seats: 8, status: "Complete", time: "5h" },
  { name: "Ines Duarte", company: "Kestrel Aero", seats: 16, status: "Approved", time: "1d" },
  { name: "Marcus Hale", company: "Fieldnote", seats: 30, status: "Complete", time: "1d" },
];

function ResponseRow({ response, highlight }) {
  return (
    <div className={cn("grid grid-cols-[1.7fr_0.7fr_1.2fr_0.5fr] items-center gap-3 border-b px-6 py-3.5", LINE, highlight && "bg-foreground/[0.05]")}>
      <span className="flex min-w-0 items-center gap-3">
        <Avatar name={response.name} size={28} />
        <span className="min-w-0">
          <span className="block truncate font-medium">{response.name}</span>
          <span className="block truncate text-[13px] text-muted-foreground">{response.company}</span>
        </span>
      </span>
      <span className="font-mono text-foreground/85">{response.seats}</span>
      <ResponseStatus status={response.status} />
      <span className="text-right text-[13px] text-muted-foreground">{response.time}</span>
    </div>
  );
}

function Responses() {
  return (
    <Window className="w-[900px] text-[15px]">
      <div className={cn("flex h-14 shrink-0 items-center gap-2 border-b px-6", LINE)}>
        <span className="font-medium">Fight Night 12 — Group bookings</span>
        <span className="text-muted-foreground">23 responses</span>
        <span className="ml-auto flex items-center rounded-md border border-foreground/10 p-0.5 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1 rounded bg-foreground/[0.07] px-2 py-0.5 text-foreground">
            <Table2 className="size-3.5" /> Table
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5">
            <Kanban className="size-3.5" /> Kanban
          </span>
        </span>
      </div>
      <div className={cn("grid grid-cols-[1.7fr_0.7fr_1.2fr_0.5fr] gap-3 border-b px-6 py-2.5 text-[12px] text-muted-foreground", LINE)}>
        <span>Respondent</span>
        <span>Seats</span>
        <span>Status</span>
        <span className="text-right">Received</span>
      </div>
      <Grow at={4.5} height={71}>
        <ResponseRow response={{ name: "Jordan Lee", company: "Northwind", seats: 40, status: "Pending", time: "now" }} highlight />
      </Grow>
      {RESPONSES.map((response) => (
        <ResponseRow key={response.name} response={response} />
      ))}
    </Window>
  );
}

export function IntakeForms() {
  return (
    <>
      <Stage />
      <Camera
        width={1700}
        height={820}
        keys={[
          { t: 0, x: 420, y: 20, z: 260, s: 1.1, rx: 8, ry: 14, rz: 0, blur: 5, fr: 46, fx: 38, fy: 50 },
          { t: 3.9, x: 380, y: 20, z: 330, s: 1.1, rx: 7, ry: 11, rz: 0, blur: 5, fr: 46, fx: 40, fy: 50 },
          { t: 5.0, x: -330, y: 30, z: 200, s: 1.1, rx: 9, ry: -12, rz: 0, blur: 5, fr: 46, fx: 60, fy: 46, ease: swift },
          { t: 8, x: -390, y: 30, z: 260, s: 1.1, rx: 8, ry: -14, rz: 0, blur: 5, fr: 46, fx: 60, fy: 46 },
        ]}
      >
        <div className="relative size-full">
          <div className="absolute top-[150px] left-[40px] z-[2]">
            <GroupForm />
          </div>
          <div className="absolute top-[60px] left-[780px]">
            <Responses />
          </div>
        </div>
      </Camera>
      <Caption app="forms" name="Forms" text="Collect the details, one question at a time" at={0.4} out={7.5} />
    </>
  );
}
IntakeForms.cues = [
  { at: 1.45, sound: "tick" },
  { at: 2.75, sound: "tick" },
  { at: 3.8, sound: "success" },
  { at: 3.95, sound: "whoosh", gain: 0.35 },
  { at: 4.5, sound: "pop", gain: 0.7 },
];

export const INTAKE_SHOTS = { intake_comms: IntakeComms, intake_forms: IntakeForms };
