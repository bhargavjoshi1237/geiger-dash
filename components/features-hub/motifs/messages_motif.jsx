"use client";

import { CalendarClock, ChevronUp, Hash, Megaphone, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, LINE, Typed, Window } from "@/components/product-pages/mock_kit";
import { Button, Field, Input, Segmented, Select, Status } from "@/components/product-pages/apps/events/events_kit";
import { useScene } from "@/components/features-hub/motion";
import { Cursor, Expand, Fit } from "@/components/features-hub/motifs/motif_kit";

const CAMPAIGN_NAME = "Early bird ends Friday";

const CAMPAIGN_SCENE = [500, 1300, 650, 650, 900, 280, 3400];

// The campaign editor up to Schedule send: the form fills and the status moves to Scheduled. Nothing here claims a delivery.
function Campaign({ running }) {
  const step = useScene(CAMPAIGN_SCENE, running);
  const scheduled = step === 6;
  const hint = "text-muted-foreground/60";

  return (
    <div className="relative h-[330px] w-[480px]">
      <Window className="h-[330px] w-[480px]">
        <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b px-5", LINE)}>
          <Megaphone className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-medium">Campaigns</span>
          <Status status={scheduled ? "Scheduled" : "Draft"} className="ml-1" />
          <span className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" icon={Send} className="h-7 text-[11px]">
              Send now
            </Button>
            <Button icon={CalendarClock} className={cn("h-7 text-[11px] transition-[scale] duration-150", step === 5 ? "scale-95" : "")}>
              Schedule send
            </Button>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 px-4 pt-3.5">
          <Field label="Name">
            <Input className={step === 1 ? "border-foreground/40" : ""}>
              {step === 0 ? <span className={hint}>Name this campaign</span> : step === 1 ? <Typed key="typing" text={CAMPAIGN_NAME} delay={0.1} duration={1} /> : <span className="truncate">{CAMPAIGN_NAME}</span>}
            </Input>
          </Field>
          <Field label="Channel">
            <Segmented options={["Email", "SMS", "WhatsApp"]} active={step >= 2 ? "Email" : ""} className="h-8 w-full justify-between text-[11px]" />
          </Field>
          <Field label="Audience">
            <Select className={step === 3 ? "border-foreground/40" : ""}>{step >= 3 ? "Segment · Past attendees" : <span className={hint}>Choose a segment</span>}</Select>
          </Field>
          <Field label="Schedule">
            <Input className={step === 4 ? "border-foreground/40" : ""}>
              <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
              {step >= 4 ? <span className="truncate tabular-nums">Thu 5 Nov · 09:00</span> : <span className={hint}>Pick a date</span>}
            </Input>
          </Field>
        </div>
        <div className="mx-4 mt-3.5 rounded-lg border border-foreground/[0.08] px-3.5 py-3">
          <div className="flex gap-2 text-[11px]">
            <span className="text-muted-foreground">Subject</span>
            <span className="truncate text-foreground/90">Full passes go up on Friday night</span>
          </div>
          <div className={cn("mt-2 border-t pt-2.5 text-[12px] leading-5 text-foreground/80", LINE)}>
            Northside Design Week 2026 is three weeks away. Early bird closes this Friday, then Full passes move to $320. Harbour Hall, Nov 19–21.
          </div>
        </div>
      </Window>
      <Cursor at={[405, 28]} down={step === 5} hidden={step < 4 || scheduled} />
    </div>
  );
}

const CHAT = [
  { name: "Maya Chen", text: "Anyone going to the type workshop after lunch?" },
  { name: "Kofi Asante", text: "Yes, Studio 2. Saved you a seat." },
  { name: "Amara Okafor", text: "Slides go up in here right after." },
];

const POLL_OPTIONS = ["Portfolio clinic", "Type in motion", "Grids that bend"];

// Vote counts for the chat poll at each step of the scene.
const POLL_VOTES = [
  [18, 24, 9],
  [18, 27, 10],
  [20, 31, 10],
  [21, 36, 12],
  [23, 41, 13],
];

const QUESTIONS = [
  { text: "Will the keynote be recorded?", name: "Tomas Marek", votes: [14, 15, 15, 17, 19] },
  { text: "Is Saturday's clinic drop-in?", name: "Grace Donnelly", votes: [9, 9, 11, 11, 12] },
  { text: "Where do speakers check in?", name: "Aisha Bennett", votes: [4, 5, 5, 6, 7] },
];

const COMMUNITY_SCENE = [1000, 1000, 1000, 1200, 3400];

function ChatLine({ name, text }) {
  return (
    <div className="flex gap-2 pt-2.5">
      <Avatar name={name} size={20} />
      <p className="min-w-0 text-[12px] leading-[17px]">
        <span className="font-medium">{name}</span> <span className="text-foreground/80">{text}</span>
      </p>
    </div>
  );
}

// Event Chat in play: a chat poll collects votes, messages land under it and Q&A upvotes climb.
function Community({ running }) {
  const step = useScene(COMMUNITY_SCENE, running);
  const votes = POLL_VOTES[step];
  const total = votes.reduce((sum, value) => sum + value, 0);
  const leader = Math.max(...votes);

  return (
    <Window title="Event Chat" icon={Hash} meta="Open discussion" className="h-[330px] w-[480px]" actions={<span className="text-[11px] tabular-nums">{184 + step} attendees</span>}>
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 px-3.5 py-3">
          <div className="rounded-lg border border-foreground/[0.09] bg-foreground/[0.025] p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[12px] font-medium">Which session after lunch?</span>
              <span className="text-[11px] whitespace-nowrap text-muted-foreground tabular-nums">{total} votes</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-2">
              {POLL_OPTIONS.map((option, index) => (
                <div key={option}>
                  <div className="flex justify-between text-[11px]">
                    <span className={votes[index] === leader ? "font-medium text-foreground" : "text-foreground/80"}>{option}</span>
                    <span className="text-muted-foreground tabular-nums">{Math.round((votes[index] / total) * 100)}%</span>
                  </div>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                    <span className={cn("block h-full rounded-full transition-[width] duration-700 ease-out", votes[index] === leader ? "bg-foreground/70" : "bg-foreground/30")} style={{ width: `${(votes[index] / total) * 100}%` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          {CHAT.map((line, index) => (
            <Expand key={line.name} when={step >= index + 1}>
              <ChatLine {...line} />
            </Expand>
          ))}
        </div>
        <div className={cn("w-[168px] shrink-0 border-l", LINE)}>
          <div className={cn("flex h-9 items-center border-b px-3 text-[12px] font-medium", LINE)}>Q&amp;A</div>
          {QUESTIONS.map((question) => (
            <div key={question.text} className={cn("flex gap-2 border-b px-3 py-2.5", LINE)}>
              <span className="flex h-9 w-7 shrink-0 flex-col items-center justify-center rounded-md border border-foreground/[0.1] text-[11px] text-foreground/85 tabular-nums">
                <ChevronUp className="size-3 text-muted-foreground" />
                {question.votes[step]}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] leading-4 text-foreground/90">{question.text}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{question.name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export function MessagesMotif({ variant, running }) {
  return <Fit>{variant === "community" ? <Community running={running} /> : <Campaign running={running} />}</Fit>;
}
