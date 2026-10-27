"use client";

import { useRef } from "react";
import { SUITE_APP_BY_ID } from "@/components/landing/suite_apps";
import { useFrame } from "@/components/film/clock";
import { clamp, easeInCubic, glide, lerp, progress, seeded, swift } from "@/components/film/ease";
import { Bloom, GeigerMark, Stage } from "@/components/film/film_kit";
import { Fade, Words } from "@/components/film/kinetic";
import { BEAT } from "@/components/film/timeline";

// Finale: the whole film has been grey; here each app's mark lights up in its own colour, then the lockup and the end card.

// The apps the film can show as live today, in the landing page's hue order.
const APPS = ["events", "notes", "forms", "content", "grey", "comms", "flow", "assets", "pods", "property"].map((id) => SUITE_APP_BY_ID[id]);

const TILE = 132;
const GAP = 36;
const ROW = APPS.length * TILE + (APPS.length - 1) * GAP;
const LIGHT_AT = BEAT * 4;

const ORIGINS = (() => {
  const random = seeded(37);
  return APPS.map(() => ({ x: (random() - 0.5) * 1400, y: (random() - 0.5) * 900, z: -1800 - random() * 900, r: (random() - 0.5) * 90 }));
})();

function AppTile({ app, index }) {
  const ref = useRef(null);
  const lit = useRef(null);
  const glow = useRef(null);
  useFrame((local) => {
    const node = ref.current;
    if (!node) return;
    const arrive = progress(local, 0.05 + index * 0.07, 1.1, swift);
    const gather = progress(local, 5.5, 0.9, easeInCubic);
    const origin = ORIGINS[index];
    const home = index * (TILE + GAP) - ROW / 2 + TILE / 2;
    const bob = Math.sin((local + index * 0.37) * 2.1) * 6 * clamp(local - 1.2);
    const x = lerp(origin.x, home, arrive) * (1 - gather);
    const y = lerp(origin.y, 0, arrive) + bob - gather * 40;
    const z = lerp(origin.z, 0, arrive) - gather * 600;
    node.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotate(${origin.r * (1 - arrive)}deg)`;
    node.style.opacity = clamp(arrive * 1.4) * (1 - gather);
    node.style.filter = arrive < 0.98 ? `blur(${((1 - arrive) * 12).toFixed(1)}px)` : "none";
    const on = progress(local, LIGHT_AT + index * 0.1, 0.5, glide);
    if (lit.current) lit.current.style.opacity = on;
    if (glow.current) glow.current.style.opacity = on * (1 - progress(local, LIGHT_AT + index * 0.1 + 0.4, 1.4, glide) * 0.55);
  });
  const Icon = app.icon;
  return (
    <div ref={ref} className="absolute top-1/2 left-1/2 opacity-0" style={{ width: TILE, height: TILE, "--accent": app.accent.color }}>
      <div ref={glow} className="absolute -inset-10 rounded-full opacity-0 blur-2xl" style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 55%, transparent), transparent)" }} />
      <div className="absolute inset-0 flex items-center justify-center rounded-[34px] border border-foreground/[0.12] bg-surface-subtle text-foreground/70">
        <Icon className="size-[58px]" strokeWidth={1.5} />
      </div>
      <div
        ref={lit}
        className="absolute inset-0 flex items-center justify-center rounded-[34px] opacity-0"
        style={{ background: "color-mix(in oklab, var(--accent) 20%, var(--surface-subtle))", border: "1.5px solid color-mix(in oklab, var(--accent) 60%, transparent)", color: "var(--accent)" }}
      >
        <Icon className="size-[58px]" strokeWidth={1.5} />
      </div>
      <Fade at={LIGHT_AT + index * 0.1 + 0.15} out={5.4} exit={0.3} y={6} duration={0.4} className="absolute inset-x-[-20px] top-[150px] text-center text-[22px] text-foreground/70">
        {app.name}
      </Fade>
    </div>
  );
}

export function FinaleSpectrum() {
  return (
    <>
      <Stage />
      <div className="absolute inset-x-0 top-[200px] h-[400px]" style={{ perspective: "1400px" }}>
        {APPS.map((app, index) => (
          <AppTile key={app.id} app={app} index={index} />
        ))}
      </div>
      <div className="absolute inset-x-0 top-[700px] flex justify-center gap-[0.3em] text-[112px] leading-none font-medium tracking-[-0.045em]">
        <Words text="One account." at={0.6} out={5.3} />
        <Words text="Every app." at={LIGHT_AT} out={5.35} />
      </div>
    </>
  );
}
FinaleSpectrum.cues = [
  { at: 0, sound: "whoosh", gain: 0.6 },
  ...APPS.map((_, index) => ({ at: LIGHT_AT + index * 0.1, sound: "chime", gain: 0.35, pitch: index })),
];

// The suite name beside the mark, which settles from the centre of the frame into the end card's corner.
function Lockup() {
  const ref = useRef(null);
  useFrame((local) => {
    const node = ref.current;
    if (!node) return;
    const settle = progress(local, 5.2, 1.1, swift);
    node.style.left = `${lerp(960, 128, settle)}px`;
    node.style.top = `${lerp(430, 236, settle)}px`;
    node.style.transform = `translate(${lerp(-50, 0, settle)}%, -50%) scale(${lerp(1, 0.44, settle)})`;
  });
  return (
    <div ref={ref} className="absolute flex origin-left items-center gap-10 whitespace-nowrap" style={{ left: 960, top: 430, transform: "translate(-50%, -50%)" }}>
      <GeigerMark at={0.15} height={118} />
      <Words text="Geiger Studios" at={0.45} duration={0.8} className="text-[118px] leading-none font-medium tracking-[-0.045em]" />
    </div>
  );
}

// A hairline of the suite's colours along the bottom of the end card, brightening on the music's last hit.
function SpectrumLine() {
  const ref = useRef(null);
  useFrame((local) => {
    if (!ref.current) return;
    const grow = progress(local, 5.6, 1.4, glide);
    const hit = Math.max(0, 1 - Math.abs(local - 10) / 0.6);
    ref.current.style.transform = `scaleX(${grow})`;
    ref.current.style.opacity = 0.55 + hit * 0.45;
  });
  const gradient = `linear-gradient(90deg, ${APPS.map((app) => app.accent.color).join(", ")})`;
  return <div ref={ref} className="absolute right-[128px] bottom-[150px] left-[128px] h-[3px] origin-left rounded-full" style={{ background: gradient, transform: "scaleX(0)" }} />;
}

function FadeToBlack({ at, duration }) {
  const ref = useRef(null);
  useFrame((local) => {
    if (ref.current) ref.current.style.opacity = progress(local, at, duration, (x) => x);
  });
  return <div ref={ref} className="absolute inset-0 z-[800] bg-black opacity-0" />;
}

export function FinaleLockup() {
  return (
    <>
      <Stage />
      <Bloom at={0.1} size={1500} strength={0.16} className="top-[40%]" />
      <Lockup />
      <Fade at={1.3} out={4.9} y={14} blur={8} duration={0.8} className="absolute inset-x-0 top-[560px] text-center text-[46px] tracking-[-0.02em] text-foreground/60">
        Built to manage. Designed to create.
      </Fade>
      <div className="absolute top-[380px] left-[128px]">
        <Words text={"Try Geiger free\nfor 15 days."} at={6} duration={0.9} className="block text-[104px] leading-[1.02] font-medium tracking-[-0.04em]" />
        <Fade at={6.6} y={10} duration={0.7} className="mt-10 flex items-center gap-5 text-[36px] text-foreground/60">
          <span className="font-mono tracking-tight text-foreground">geiger.studio</span>
          <span className="h-7 w-px bg-foreground/25" />
          No card needed
        </Fade>
      </div>
      <SpectrumLine />
      <FadeToBlack at={12.4} duration={1.1} />
    </>
  );
}
FinaleLockup.cues = [{ at: 0.1, sound: "impact", gain: 0.7 }];

// The YouTube thumbnail, rendered from the same parts as the film: the suite's colours beside the line that names it.
function LitTile({ app }) {
  const Icon = app.icon;
  return (
    <div className="relative size-[186px]" style={{ "--accent": app.accent.color }}>
      <div className="absolute -inset-12 rounded-full blur-2xl" style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 45%, transparent), transparent)" }} />
      <div
        className="absolute inset-0 flex items-center justify-center rounded-[46px]"
        style={{ background: "color-mix(in oklab, var(--accent) 22%, var(--surface-subtle))", border: "2px solid color-mix(in oklab, var(--accent) 65%, transparent)", color: "var(--accent)" }}
      >
        <Icon className="size-[84px]" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export function Thumbnail() {
  return (
    <>
      <Stage />
      <div className="absolute top-1/2 left-[1330px] -translate-x-1/2 -translate-y-1/2" style={{ perspective: "1600px" }}>
        <div className="grid grid-cols-[repeat(5,186px)] gap-12" style={{ transform: "rotateX(12deg) rotateY(-17deg) rotateZ(3deg) scale(0.92)" }}>
          {APPS.map((app) => (
            <LitTile key={app.id} app={app} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_30%,transparent_62%)]" />
      <div className="absolute top-[150px] left-[110px] flex items-center gap-6">
        <GeigerMark at={-2} height={78} />
        <span className="text-[64px] leading-none font-medium tracking-[-0.04em]">Geiger Studios</span>
      </div>
      <div className="absolute top-[390px] left-[104px] text-[168px] leading-[0.95] font-semibold tracking-[-0.055em]">
        One suite
        <br />
        <span className="text-foreground/55">for all of it.</span>
      </div>
    </>
  );
}

export const FINALE_SHOTS = { finale_spectrum: FinaleSpectrum, finale_lockup: FinaleLockup, thumbnail: Thumbnail };
