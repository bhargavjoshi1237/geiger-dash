"use client";

import { useRef } from "react";
import { Headset, Megaphone, Receipt, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, TypingDots, WINDOW } from "@/components/product-pages/mock_kit";
import { CopilotRender } from "@/components/product-pages/intake/comms_renders";
import { FunnelRender } from "@/components/product-pages/intake/forms_renders";
import { BoardRender } from "@/components/product-pages/plan/tracker_renders";
import { RoadmapRender } from "@/components/product-pages/plan/roadmap_renders";
import { AiCardRender } from "@/components/product-pages/plan/canvas_renders";
import { FormatsRender, McpRender } from "@/components/product-pages/ai/grey_renders";
import { ReleasesRender, SeatMapRender } from "@/components/product-pages/launch/events_renders";
import { WebhooksRender } from "@/components/product-pages/launch/content_renders";
import { ShareLinkRender } from "@/components/product-pages/launch/assets_renders";
import { UsagePlansRender } from "@/components/product-pages/launch/pods_renders";
import { Camera } from "@/components/film/camera";
import { useFrame } from "@/components/film/clock";
import { clamp, easeInCubic, glide, lerp, progress, seeded, swift } from "@/components/film/ease";
import { Blackout, Bloom, GeigerMark, Stage } from "@/components/film/film_kit";
import { Fade, Words } from "@/components/film/kinetic";
import { BAR, BEAT } from "@/components/film/timeline";

// Cold open: one message, four teams, a dozen tools piling up, then a cut to black and the suite on the drop.

const HOOK_TYPE = "absolute inset-x-0 bottom-[150px] text-center text-[128px] leading-none font-medium tracking-[-0.045em]";

function CustomerBubble() {
  return (
    <div className="flex w-[1400px] justify-center">
      <div className="flex flex-col items-start">
        <div className="mb-6 flex items-center gap-4 text-[30px]">
          <Avatar name="Jordan Lee" size={60} />
          <span className="font-medium">Jordan Lee</span>
          <span className="text-foreground/50">Northwind · via chat · now</span>
        </div>
        <div className="relative">
          <Fade at={0.15} out={1.05} exit={0.15} y={0} className="absolute top-0 left-0 inline-flex h-[104px] items-center rounded-[36px] rounded-tl-lg border border-foreground/[0.1] bg-surface-subtle px-10 text-foreground/60">
            <TypingDots className="scale-[1.9]" />
          </Fade>
          <Fade at={1.1} duration={0.5} y={14} scale={0.96} className="rounded-[36px] rounded-tl-lg border border-foreground/[0.1] bg-surface-subtle px-11 py-7 text-[54px] leading-[1.25] tracking-[-0.02em] whitespace-nowrap text-foreground shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
            Hi! Can we get 40 seats together for Fight Night 12?
          </Fade>
        </div>
      </div>
    </div>
  );
}

export function OpenMessage() {
  return (
    <>
      <Stage />
      <Camera
        width={1400}
        height={220}
        keys={[
          { t: 0, y: -120, z: -160, rx: 12, ry: -4 },
          { t: BAR * 2, y: -130, z: 20, rx: 4, ry: 0 },
        ]}
      >
        <CustomerBubble />
      </Camera>
      <Words text="One message." at={BEAT * 2} className={HOOK_TYPE} />
    </>
  );
}
OpenMessage.cues = [{ at: 1.1, sound: "pop" }];

const TEAMS = [
  { name: "Support", icon: Headset, at: [-600, -230] },
  { name: "Operations", icon: Truck, at: [600, -230] },
  { name: "Marketing", icon: Megaphone, at: [-600, 150] },
  { name: "Finance", icon: Receipt, at: [600, 150] },
];

// A thin line drawn from the message out to a team as it joins.
function Link({ to, at }) {
  const ref = useRef(null);
  const length = Math.hypot(to[0], to[1]);
  useFrame((local) => {
    if (ref.current) ref.current.style.strokeDashoffset = String(length * (1 - progress(local, at, 0.45, glide)));
  });
  return (
    <line ref={ref} x1="0" y1="0" x2={to[0]} y2={to[1]} stroke="currentColor" strokeOpacity="0.32" strokeWidth="2" strokeDasharray={length} strokeDashoffset={length} />
  );
}

export function OpenTeams() {
  return (
    <>
      <Stage />
      <Camera width={1600} height={760} keys={[{ t: 0, y: -90, z: -40, rx: 6 }, { t: BAR, y: -100, z: 40, rx: 4 }]}>
        <div className="relative size-full">
          <svg className="absolute top-1/2 left-1/2 overflow-visible text-foreground" width="0" height="0">
            {TEAMS.map((team, index) => (
              <Link key={team.name} to={team.at} at={0.05 + index * (BEAT / 2)} />
            ))}
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7]">
            <div className="rounded-[36px] rounded-tl-lg border border-foreground/[0.1] bg-surface-subtle px-11 py-7 text-[54px] leading-[1.25] tracking-[-0.02em] whitespace-nowrap shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
              Hi! Can we get 40 seats together for Fight Night 12?
            </div>
          </div>
          {TEAMS.map((team, index) => {
            const Icon = team.icon;
            return (
              <Fade
                key={team.name}
                at={0.15 + index * (BEAT / 2)}
                duration={0.45}
                scale={0.85}
                y={0}
                className="absolute top-1/2 left-1/2"
                style={{ marginLeft: team.at[0], marginTop: team.at[1] }}
              >
                <span className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-foreground/[0.12] bg-surface-subtle py-4 pr-9 pl-5 text-[38px] font-medium whitespace-nowrap shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
                  <span className="flex size-14 items-center justify-center rounded-full bg-foreground/[0.08]">
                    <Icon className="size-7 text-foreground/80" strokeWidth={1.75} />
                  </span>
                  {team.name}
                </span>
              </Fade>
            );
          })}
        </div>
      </Camera>
      <Words text="Four teams." at={0.05} className={HOOK_TYPE} />
    </>
  );
}
OpenTeams.cues = TEAMS.map((_, index) => ({ at: 0.15 + index * (BEAT / 2), sound: "tick" }));

const TOOLS = [CopilotRender, FunnelRender, BoardRender, RoadmapRender, AiCardRender, FormatsRender, McpRender, SeatMapRender, ReleasesRender, WebhooksRender, ShareLinkRender, UsagePlansRender];

// Where each tool lands in the pile: scattered in depth and angle, but the same on every render.
const SCATTER = (() => {
  const random = seeded(12);
  const slots = [
    [-640, -300], [80, -360], [700, -260], [-300, -60], [420, 20], [-760, 160],
    [-60, 260], [660, 300], [-420, 360], [260, -180], [-120, -340], [820, 40],
  ];
  return slots.map(([x, y]) => ({
    x: x + (random() - 0.5) * 80,
    y: y + (random() - 0.5) * 60,
    z: -700 + random() * 820,
    rx: (random() - 0.5) * 40,
    ry: (random() - 0.5) * 60,
    rz: (random() - 0.5) * 26,
  }));
})();

// The same twelve tools in order: a 4×3 wall.
const GRID = TOOLS.map((_, index) => ({ x: ((index % 4) - 1.5) * 540, y: (Math.floor(index / 4) - 1) * 380, z: 0, rx: 0, ry: 0, rz: 0 }));

function ToolCard({ Render }) {
  return (
    <div className={cn(WINDOW, "flex h-[340px] w-[500px] items-center justify-center overflow-hidden")}>
      <div className="origin-center scale-[0.92]">
        <Render />
      </div>
    </div>
  );
}

const toTransform = (p) => `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`;

// The pile: tools arrive on eighth notes, each blurred by its distance from the focal plane.
function Pile() {
  const refs = useRef([]);
  useFrame((local) => {
    const drift = local * 2.6;
    refs.current.forEach((node, index) => {
      if (!node) return;
      const spot = SCATTER[index];
      const enter = progress(local, 0.1 + index * 0.27, 0.6, glide);
      const p = { ...spot, z: lerp(spot.z - 900, spot.z, enter), rz: spot.rz + drift * (index % 2 ? 1 : -1), ry: spot.ry + drift };
      node.style.transform = toTransform(p);
      node.style.opacity = enter;
      const softness = clamp(Math.abs(p.z + 150) / 70, 0, 9) + (1 - enter) * 8;
      node.style.filter = `blur(${softness.toFixed(1)}px) brightness(${(0.55 + clamp((p.z + 700) / 820) * 0.35).toFixed(2)})`;
    });
  });
  return (
    <div className="absolute inset-0" style={{ perspective: "1600px", perspectiveOrigin: "50% 45%" }}>
      {TOOLS.map((Render, index) => (
        <div
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          className="absolute top-1/2 left-1/2 opacity-0"
        >
          <ToolCard Render={Render} />
        </div>
      ))}
    </div>
  );
}

export function OpenTools() {
  return (
    <>
      <Stage />
      <Pile />
      <Words text="A dozen tools." at={0.05} out={BEAT * 6.9} className={HOOK_TYPE} />
      <Blackout at={BEAT * 7.25} />
    </>
  );
}
OpenTools.cues = TOOLS.map((_, index) => ({ at: 0.1 + index * 0.27, sound: "tick", gain: 0.45 }));

// On the drop the pile snaps into a wall and tips back into the distance, and the mark builds in front of it.
function WallCards() {
  const refs = useRef([]);
  useFrame((local) => {
    refs.current.forEach((node, index) => {
      if (!node) return;
      const snap = progress(local, index * 0.025, 0.85, swift);
      const from = SCATTER[index];
      const to = GRID[index];
      const p = Object.fromEntries(Object.keys(to).map((key) => [key, lerp(from[key], to[key], snap)]));
      node.style.transform = toTransform(p);
    });
  });
  return (
    <div className="relative size-full" style={{ perspective: "1600px" }}>
      {TOOLS.map((Render, index) => (
        <div
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          className="absolute top-1/2 left-1/2"
        >
          <ToolCard Render={Render} />
        </div>
      ))}
    </div>
  );
}

function Wall() {
  return (
    <Camera
      width={2200}
      height={1200}
      perspective={1800}
      dimBlur={1}
      keys={[
        { t: 0, z: -200, rx: 0, s: 1, blur: 2, fr: 0, o: 0.85 },
        { t: 0.9, z: -950, rx: 56, y: 330, blur: 3, fr: 0, o: 0.6, ease: swift },
        { t: BAR * 1.75, z: -1250, rx: 60, y: 360, blur: 4.5, fr: 0, o: 0.45 },
      ]}
    >
      <WallCards />
    </Camera>
  );
}

export function OpenReveal() {
  const words = useRef(null);
  useFrame((local) => {
    if (words.current) words.current.style.opacity = 1 - progress(local, BAR * 1.5, 0.4, easeInCubic);
  });
  return (
    <>
      <Stage />
      <Wall />
      <Bloom at={0.05} size={1300} strength={0.2} className="top-[44%]" />
      <div className="absolute inset-x-0 top-[300px] flex justify-center">
        <GeigerMark at={0.05} height={170} />
      </div>
      <div ref={words}>
        <Words text="One suite for all of it." at={BEAT * 2} className="absolute inset-x-0 top-[560px] text-center text-[92px] leading-none font-medium tracking-[-0.04em]" />
      </div>
    </>
  );
}
OpenReveal.cues = [{ at: 0, sound: "impact" }, { at: 0.05, sound: "whoosh", gain: 0.6 }];

export const OPEN_SHOTS = { open_message: OpenMessage, open_teams: OpenTeams, open_tools: OpenTools, open_reveal: OpenReveal };
