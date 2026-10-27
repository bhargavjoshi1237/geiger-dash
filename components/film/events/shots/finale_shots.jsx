"use client";

import { useRef } from "react";
import { useFrame } from "@/components/film/clock";
import { lerp, progress, swift } from "@/components/film/ease";
import { Bloom, GeigerMark, Stage } from "@/components/film/film_kit";
import { Fade, Words } from "@/components/film/kinetic";
import { Phone } from "@/components/film/events/events_kit";
import { BuyerMap, SEAT } from "@/components/film/events/checkout_kit";
import { PassScreen } from "@/components/film/events/pass";

// The end card over the track's breakdown: the Events lockup in rose, its line, then the call to action on the left
// with the right half left clear for YouTube's end-screen elements.

// The lockup builds in the centre, then settles into the end card's top-left corner.
function Lockup({ settleAt }) {
  const ref = useRef(null);
  useFrame((local) => {
    const settle = progress(local, settleAt, 1.0, swift);
    if (!ref.current) return;
    ref.current.style.left = `${lerp(960, 124, settle)}px`;
    ref.current.style.top = `${lerp(440, 214, settle)}px`;
    ref.current.style.transform = `translate(${lerp(-50, 0, settle)}%, -50%) scale(${lerp(1, 0.5, settle)})`;
  });
  return (
    <div ref={ref} className="absolute flex origin-left items-center gap-9 whitespace-nowrap" style={{ left: 960, top: 440, transform: "translate(-50%, -50%)" }}>
      <GeigerMark at={0.2} height={104} />
      <Words text="Geiger Events" at={0.45} duration={0.8} className="text-[118px] leading-none font-medium tracking-[-0.045em]" />
    </div>
  );
}

function FadeOut({ at, duration }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.style.opacity = progress(local, at, duration, (x) => x);
  });
  return <div ref={ref} className="absolute inset-0 z-[800] bg-background opacity-0" />;
}

export function Finale() {
  return (
    <>
      <Stage />
      <Bloom at={0.1} size={1500} strength={0.16} color="var(--color-rose-500)" className="top-[44%]" />
      <Lockup settleAt={3.3} />
      <Fade at={1.25} out={3.1} y={14} blur={8} duration={0.8} className="absolute inset-x-0 top-[560px] text-center text-[46px] tracking-[-0.02em] text-foreground/60">
        Sell the tickets and run the door.
      </Fade>
      <div className="absolute top-[370px] left-[124px]">
        <Words text={"Try Geiger free\nfor 15 days."} at={3.9} duration={0.9} className="block text-[104px] leading-[1.02] font-medium tracking-[-0.04em]" />
        <Fade at={4.5} y={10} duration={0.7} className="mt-10 flex items-center gap-5 text-[36px] text-foreground/60">
          <span className="font-mono tracking-tight text-foreground">geiger.studio</span>
          <span className="h-7 w-px bg-foreground/25" />
          No card needed
        </Fade>
      </div>
      <Fade at={4.0} y={0} duration={1.2} className="absolute right-[128px] bottom-[150px] left-[124px] h-[3px] rounded-full bg-gradient-to-r from-rose-500 via-rose-400/60 to-transparent" />
      <FadeOut at={6.45} duration={0.6} />
    </>
  );
}
Finale.cues = [
  { at: 0.1, sound: "impact", gain: 0.6 },
  { at: 0.5, sound: "chime", gain: 0.3, pitch: 3 },
];

// The cutdown's end card: the same lockup and line, landing faster, with the offer underneath.
export function FinaleCut() {
  return (
    <>
      <Stage />
      <Bloom at={0} size={1400} strength={0.16} color="var(--color-rose-500)" className="top-[42%]" />
      <div className="absolute inset-x-0 top-[330px] flex items-center justify-center gap-9">
        <GeigerMark at={0} height={96} />
        <Words text="Geiger Events" at={0.2} duration={0.7} className="text-[110px] leading-none font-medium tracking-[-0.045em]" />
      </div>
      <Fade at={0.75} y={12} blur={6} duration={0.7} className="absolute inset-x-0 top-[500px] text-center text-[46px] tracking-[-0.02em] text-foreground/60">
        Sell the tickets and run the door.
      </Fade>
      <Fade at={1.5} y={12} duration={0.7} className="absolute inset-x-0 top-[660px] flex items-center justify-center gap-5 text-[34px] text-foreground/60">
        Try Geiger free for 15 days
        <span className="h-7 w-px bg-foreground/25" />
        <span className="font-mono tracking-tight text-foreground">geiger.studio</span>
      </Fade>
      <FadeOut at={4.5} duration={0.5} />
    </>
  );
}
FinaleCut.cues = [{ at: 0, sound: "impact", gain: 0.6 }];

// The YouTube thumbnail: the line on the left, the seat map and the pass on the right, all from the film's parts.
export function Thumbnail() {
  const c7 = SEAT("104", "C", 7);
  const c8 = SEAT("104", "C", 8);
  return (
    <>
      <Stage />
      <Bloom at={-5} size={1500} strength={0.2} color="var(--color-rose-500)" className="top-[55%] left-[72%]" />
      <div className="absolute top-[150px] left-[1090px] h-[620px] w-[880px] overflow-hidden rounded-[28px] bg-[#161616] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.55)]" style={{ transform: "perspective(1800px) rotateY(-14deg) rotateX(6deg) rotateZ(2deg)" }}>
        <BuyerMap
          className="absolute top-1/2 left-1/2 w-[1100px] -translate-x-1/2 -translate-y-1/2"
          picks={[
            { id: "C7", x: c7.x, y: c7.y, at: -5 },
            { id: "C8", x: c8.x, y: c8.y, at: -5 },
          ]}
        />
      </div>
      <div className="absolute top-[250px] left-[1370px]" style={{ transform: "perspective(1800px) rotateY(-16deg) rotateZ(4deg) scale(0.86)" }}>
        <Phone>
          <PassScreen brightAt={-5} />
        </Phone>
      </div>
      <div className="absolute top-[140px] left-[110px] flex items-center gap-6">
        <GeigerMark at={-5} height={70} />
        <span className="text-[60px] leading-none font-medium tracking-[-0.04em]">Geiger Events</span>
      </div>
      <div className="absolute top-[390px] left-[104px] text-[160px] leading-[0.95] font-semibold tracking-[-0.055em]">
        Sell out.
        <br />
        <span className="text-rose-600">Run the door.</span>
      </div>
    </>
  );
}

export const FINALE_SHOTS = { finale: Finale, finale_cut: FinaleCut, thumbnail: Thumbnail };
