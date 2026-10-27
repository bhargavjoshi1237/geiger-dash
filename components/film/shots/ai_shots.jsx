"use client";

import { Fragment, useRef } from "react";
import { ArrowUp, ChevronDown, Database, FileText, Globe, Network, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot, LINE, MonoLabel, Window } from "@/components/product-pages/mock_kit";
import { Cite, GraphStage } from "@/components/product-pages/ai/grey_renders";
import { Camera } from "@/components/film/camera";
import { useFrame } from "@/components/film/clock";
import { clamp, swift } from "@/components/film/ease";
import { Stage } from "@/components/film/film_kit";
import { ActTitle, Caption, Fade, TypeOn, Words } from "@/components/film/kinetic";

// Act three, AI: Grey answers the team's question from the box office's own documents, with citations, then the graph behind it.

const QUESTION = "What's our policy for group bookings over 30 seats?";

// The answer as it streams in, word by word, with its citations inline.
const ANSWER = [
  ..."Groups of 30 or more can hold seats together for 48 hours".split(" "),
  { cite: 1, active: true },
  ..."A 20% deposit confirms the block".split(" "),
  { cite: 2 },
  ..."and the balance is due seven days before the event".split(" "),
  { cite: 3 },
];

const SOURCES = [
  { n: 1, name: "Group bookings policy.pdf", where: "p. 2", icon: FileText, score: "0.93" },
  { n: 2, name: "Box office FAQ", where: "Web page", icon: Globe, score: "0.86" },
  { n: 3, name: "Venue terms 2026.docx", where: "§ 4.3", icon: FileText, score: "0.79" },
];

function Stream({ tokens, at, rate = 10 }) {
  const refs = useRef([]);
  useFrame((local) => {
    refs.current.forEach((node, index) => {
      if (node) node.style.opacity = clamp((local - at - index / rate) / 0.18);
    });
  });
  return (
    <p className="text-[19px] leading-[1.7] text-foreground/90">
      {tokens.map((token, index) => (
        <Fragment key={index}>
          <span
            ref={(node) => {
              refs.current[index] = node;
            }}
            className="opacity-0"
          >
            {typeof token === "string" ? token : <Cite n={token.cite} active={token.active} />}
          </span>
          {typeof tokens[index + 1] === "string" ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

function Playground() {
  return (
    <Window className="h-[640px] w-[1440px] text-[15px]">
      <div className="flex h-full">
        <div className={cn("flex w-[260px] shrink-0 flex-col gap-7 border-r px-5 py-6", LINE)}>
          <div>
            <MonoLabel>Pipelines</MonoLabel>
            <div className="mt-3 flex flex-col gap-1">
              {[
                ["Box office answers", "Live", true],
                ["Venue search", "Live"],
                ["Sponsor briefs", "Draft"],
              ].map(([name, status, active]) => (
                <div key={name} className={cn("flex items-center gap-2 rounded-md px-2.5 py-2", active && "bg-foreground/[0.06]")}>
                  <Network className="size-4 text-muted-foreground" />
                  <span className={active ? "text-foreground" : "text-foreground/75"}>{name}</span>
                  <span className="ml-auto text-[12px] text-muted-foreground">{status}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <MonoLabel>Knowledge bases</MonoLabel>
            <div className="mt-3 flex flex-col gap-1">
              {["Box office & policies", "Venue documents", "Event playbooks"].map((base) => (
                <div key={base} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-foreground/75">
                  <Database className="size-4 text-muted-foreground" />
                  {base}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={cn("flex min-w-0 flex-1 flex-col border-r", LINE)}>
          <div className={cn("flex h-14 shrink-0 items-center gap-2 border-b px-6", LINE)}>
            <span className="font-medium">Playground Chat</span>
            <span className="text-muted-foreground">Box office answers</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
              <Dot tone="emerald" /> Live · v3
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-6 px-8 py-7">
            <Fade at={5.3} y={10} duration={0.45} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-foreground/[0.08] px-4 py-3 text-[17px] leading-6 text-foreground/90">{QUESTION}</div>
            </Fade>
            <Fade at={5.55} y={8} duration={0.4} className="flex gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.1] bg-foreground/[0.04]">
                <Sparkles className="size-4 text-foreground/80" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  Retrieved 6 chunks · 1.1s <ChevronDown className="size-3.5" />
                </div>
                <Stream tokens={ANSWER} at={5.9} rate={10} />
                <div className="mt-4 flex flex-col gap-2">
                  {SOURCES.map((source, index) => {
                    const Icon = source.icon;
                    return (
                      <Fade key={source.n} at={8.6 + index * 0.12} y={8} duration={0.4}>
                        <div className={cn("flex items-center gap-3 rounded-lg border px-3.5 py-2.5", index === 0 ? "border-foreground/20 bg-foreground/[0.04]" : "border-foreground/[0.08]")}>
                          <Cite n={source.n} active={index === 0} />
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-foreground/90">{source.name}</span>
                          <span className="ml-auto shrink-0 text-[13px] text-muted-foreground">{source.where}</span>
                        </div>
                      </Fade>
                    );
                  })}
                </div>
              </div>
            </Fade>
          </div>
          <div className="px-8 pb-7">
            <div className="rounded-xl border border-foreground/[0.1] px-4 pt-3.5 pb-3 dark:bg-foreground/[0.02]">
              <div className="relative min-h-7 text-[17px] leading-7">
                <Fade at={-1} out={5.2} exit={0.1} y={0} duration={0.01}>
                  <TypeOn text={QUESTION} at={3.1} speed={2.1} caretUntil={5.1} />
                </Fade>
                <Fade at={5.3} y={0} duration={0.3} className="absolute inset-0 text-muted-foreground">
                  Ask the pipeline anything…
                </Fade>
              </div>
              <div className="mt-2.5 flex items-center gap-3 text-muted-foreground">
                <Paperclip className="size-4" />
                <span className="flex items-center gap-1.5 text-[13px]">
                  <Database className="size-3.5" /> Box office &amp; policies
                </span>
                <span className="ml-auto flex size-8 items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowUp className="size-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[290px] shrink-0 flex-col gap-6 px-5 py-6 text-[14px]">
          <div>
            <div className="mb-2 font-medium text-foreground">Retrieval</div>
            {[
              ["Search", "Hybrid"],
              ["Graph expansion", "Auto"],
              ["Top K", "6"],
              ["Citations", "On"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground/90">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 font-medium text-foreground">Retrieved chunks</div>
            <div className="flex flex-col gap-2">
              {SOURCES.map((source, index) => (
                <Fade key={source.n} at={5.6 + index * 0.1} y={6} duration={0.35} className="flex items-center gap-2">
                  <Cite n={source.n} />
                  <span className="truncate text-foreground/80">{source.name}</span>
                  <span className="ml-auto font-mono text-[12px] text-muted-foreground">{source.score}</span>
                </Fade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

export function AiGrey() {
  return (
    <>
      <Stage />
      <Camera
        width={1440}
        height={640}
        keys={[
          { t: 0, z: -640, rx: 20, ry: -12, rz: 3, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 2.4, z: -580, rx: 19, ry: -11, rz: 3, y: 30, blur: 14, fr: 0, o: 0.75 },
          { t: 3.1, z: 180, s: 1.32, rx: 10, ry: -7, rz: 1.5, x: 40, y: -310, blur: 5, fr: 54, fx: 50, fy: 58, o: 1, ease: swift },
          { t: 5.2, z: 200, s: 1.32, rx: 9, ry: -6, rz: 1.2, x: 20, y: -300, blur: 5, fr: 54, fx: 50, fy: 58, o: 1 },
          { t: 6.2, z: 240, s: 1.32, rx: 9, ry: -6, rz: 1.2, x: -40, y: 130, blur: 5, fr: 56, fx: 50, fy: 44, o: 1 },
          { t: 10.5, z: 330, s: 1.32, rx: 8, ry: -5, rz: 1, x: -70, y: 80, blur: 5, fr: 56, fx: 50, fy: 50, o: 1 },
        ]}
      >
        <Playground />
      </Camera>
      <ActTitle index="03" label="AI" title={"Put your team's\nknowledge to work."} at={0.1} out={2.3} />
      <Caption app="grey" name="Grey" text="Answers grounded in your own documents" at={3.2} out={10} />
    </>
  );
}
AiGrey.cues = [
  { at: 0.1, sound: "whoosh", gain: 0.5 },
  { at: 2.5, sound: "whoosh", gain: 0.35 },
  { at: 5.2, sound: "send" },
  { at: 8.6, sound: "tick", gain: 0.5 },
];

export function AiGraph() {
  return (
    <>
      <Stage />
      <Camera
        width={1000}
        height={640}
        keys={[
          { t: 0, z: 120, s: 1.35, rx: 34, ry: -22, rz: 6, x: 260, y: 40, blur: 6, fr: 48, fx: 60, fy: 48, o: 0.9 },
          { t: 6, z: 320, s: 1.35, rx: 24, ry: 12, rz: -3, x: 220, y: 0, blur: 6, fr: 48, fx: 58, fy: 46, o: 0.9, ease: (x) => x },
        ]}
      >
        <GraphStage />
      </Camera>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_8%,transparent_58%)]" />
      <Words text={"Answers that cite\ntheir sources."} at={0.5} out={5.3} className="absolute top-[360px] left-[128px] text-[104px] leading-[1.02] font-medium tracking-[-0.038em]" />
    </>
  );
}
AiGraph.cues = [{ at: 0.5, sound: "whoosh", gain: 0.3 }];

export const AI_SHOTS = { ai_grey: AiGrey, ai_graph: AiGraph };
