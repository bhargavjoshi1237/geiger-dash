"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShotContext, runFrame, seekAnimations, useFrame } from "@/components/film/clock";
import { clamp, seeded } from "@/components/film/ease";
import { FILMS, trackAt } from "@/components/film/films";
import { FPS, HEIGHT, WIDTH } from "@/components/film/timeline";
import styles from "@/components/film/film.module.css";

// Shots mount this long before they cut in, so their first frame never pays for the mount during playback.
const PREMOUNT = 1;

// Lays a film's edit out in absolute time: where each shot cuts in and out, where its clock starts, and its sound cues.
function prepare(film) {
  const bars = (count) => count * film.bar;
  const shots = film.edit.map(([id, from, to, dissolve = 0, offset = 0], index) => {
    const Component = film.shots[id];
    const cutIn = bars(from);
    const start = cutIn - offset;
    const end = bars(to);
    const cues = (Component?.cues ?? [])
      .filter((cue) => cue.at >= offset && (!film.trim || start + cue.at < end))
      .map((cue) => ({ ...cue, at: Number((start + cue.at).toFixed(4)) }));
    return { id, index, start, cutIn, offset, end, dissolve, Component, cues };
  });
  // Shots outside the edit (the thumbnail) play only under ?solo=<id>, for stills and checking one shot on its own.
  const extra = Object.entries(film.shots)
    .filter(([id]) => !shots.some((shot) => shot.id === id))
    .map(([id, Component]) => ({ id, index: 0, start: 0, cutIn: 0, offset: 0, end: Infinity, dissolve: 0, Component, cues: [] }));
  return { shots, all: [...shots, ...extra], cues: shots.flatMap((shot) => shot.cues).sort((a, b) => a.at - b.at) };
}

const mode = { solo: null };

const activeAt = (prepared, time) =>
  mode.solo ??
  prepared.shots
    .filter((shot) => time >= shot.cutIn - PREMOUNT && time < shot.end)
    .map((shot) => shot.id)
    .join(",");

const noopSubscribe = () => () => {};
const readMode = () => new URLSearchParams(window.location.search).has("capture");

// Holds the page in a film's theme: next-themes may re-apply the visitor's theme after mount, so any change is undone.
function useDocumentTheme(theme) {
  useEffect(() => {
    if (theme !== "light") return undefined;
    const root = document.documentElement;
    const apply = () => {
      if (root.classList.contains("dark")) root.classList.remove("dark");
      if (!root.classList.contains("light")) root.classList.add("light");
      if (root.style.colorScheme !== "light") root.style.colorScheme = "light";
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "style"] });
    return () => observer.disconnect();
  }, [theme]);
}

function ShotFrame({ shot }) {
  const ref = useRef(null);
  const context = useMemo(() => ({ id: shot.id, start: shot.start, end: shot.end }), [shot]);
  return (
    <ShotContext.Provider value={context}>
      <ShotLayer shot={shot} innerRef={ref} />
    </ShotContext.Provider>
  );
}

function ShotLayer({ shot, innerRef }) {
  useFrame((local) => {
    const node = innerRef.current;
    if (!node) return;
    node.style.visibility = local < shot.offset ? "hidden" : "visible";
    node.style.opacity = shot.dissolve > 0 ? clamp((local - shot.offset) / shot.dissolve) : 1;
  });
  const Component = shot.Component;
  return (
    <div ref={innerRef} data-clock={shot.start} className="absolute inset-0" style={{ zIndex: shot.index + 1, visibility: "hidden" }}>
      {Component ? <Component /> : <MissingShot id={shot.id} />}
    </div>
  );
}

function MissingShot({ id }) {
  return <div className="absolute inset-0 flex items-center justify-center font-mono text-[28px] text-foreground/40">{id}</div>;
}

// Film grain that changes every frame, seeded by the frame number so a re-render matches.
function Grain() {
  const ref = useRef(null);
  useFrame((_, time) => {
    const random = seeded(Math.round(time * FPS) + 1);
    if (ref.current) ref.current.style.backgroundPosition = `${Math.round(random() * 400)}px ${Math.round(random() * 400)}px`;
  });
  return <div ref={ref} className={styles.grain} />;
}

// The 1920×1080 frame every shot draws into, in the film's theme. Memoised so playback ticks don't re-render shots.
const Frame = memo(function Frame({ theme, shots, active }) {
  const ids = active ? active.split(",") : [];
  return (
    <div className={cn("relative overflow-hidden bg-background font-sans text-foreground antialiased", theme === "light" ? styles.light : "dark")} style={{ width: WIDTH, height: HEIGHT }}>
      {shots
        .filter((shot) => ids.includes(shot.id))
        .map((shot) => (
          <ShotFrame key={shot.id} shot={shot} />
        ))}
      <div className={styles.vignette} />
      <Grain />
    </div>
  );
});

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const frames = Math.floor((time % 1) * FPS);
  return `${minutes}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
};

// /film?film=<id>: plays a film in the browser with its music, and exposes window.render(t) for scripts/film/render.mjs.
export function FilmPlayer({ id = "suite" }) {
  const film = FILMS[id] ?? FILMS.suite;
  const prepared = useMemo(() => prepare(film), [film]);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const capture = useSyncExternalStore(noopSubscribe, readMode, () => false);
  const [active, setActive] = useState(() => activeAt(prepared, 0));
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [scale, setScale] = useState(0.5);
  const activeRef = useRef(active);
  const audio = useRef(null);
  const clock = useRef({ time: 0 });
  useDocumentTheme(film.theme);

  const seek = useCallback(
    (next) => {
      const key = activeAt(prepared, next);
      if (key !== activeRef.current) {
        activeRef.current = key;
        flushSync(() => setActive(key));
      }
      clock.current.time = next;
      runFrame(next);
      seekAnimations(next);
    },
    [prepared],
  );

  useEffect(() => {
    if (!mounted) return undefined;
    mode.solo = new URLSearchParams(window.location.search).get("solo");
    const frame = requestAnimationFrame(() => seek(0));
    window.render = (next) => seek(next);
    window.film = { id: film.id, theme: film.theme, duration: film.duration, fps: FPS, width: WIDTH, height: HEIGHT, music: film.music, chapters: film.chapters, cues: prepared.cues };
    window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map((image) => image.decode().catch(() => {}))));
    return () => cancelAnimationFrame(frame);
  }, [mounted, seek, film, prepared]);

  // Preview: fit the frame to the window.
  useEffect(() => {
    if (!mounted || capture) return undefined;
    const fit = () => setScale(Math.min((window.innerWidth - 64) / WIDTH, (window.innerHeight - 140) / HEIGHT));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mounted, capture]);

  // Preview playback follows the music's clock when it is playing, jumping the track at each splice of a spliced bed.
  useEffect(() => {
    if (!playing) return undefined;
    const track = audio.current;
    let frame;
    let place = trackAt(film.music, clock.current.time);
    const started = performance.now() - clock.current.time * 1000;
    if (track) {
      track.currentTime = place.at;
      track.play().catch(() => {});
    }
    const tick = () => {
      let next = (performance.now() - started) / 1000;
      if (track && !track.paused) {
        next = place.offset + track.currentTime - place.from;
        if (track.currentTime >= place.to) {
          place = trackAt(film.music, next);
          track.currentTime = place.at;
        }
      }
      if (next >= film.duration) {
        seek(film.duration - 1 / FPS);
        setTime(film.duration);
        setPlaying(false);
        return;
      }
      seek(next);
      setTime(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      track?.pause();
    };
  }, [playing, seek, film]);

  useEffect(() => {
    if (!mounted || capture) return undefined;
    const onKey = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying((value) => !value);
      }
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        const step = (event.shiftKey ? 1 : 1 / FPS) * (event.code === "ArrowRight" ? 1 : -1);
        const next = clamp(clock.current.time + step, 0, film.duration);
        seek(next);
        setTime(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, capture, seek, film]);

  const jump = (next) => {
    setPlaying(false);
    seek(next);
    setTime(next);
  };

  return (
    <div className={cn("fixed inset-0 z-[2147483647] overflow-hidden", capture ? "bg-black" : "flex flex-col items-center justify-center gap-5 bg-neutral-950 text-neutral-200")}>
      <style>{"nextjs-portal{display:none!important}html,body{overflow:hidden!important}"}</style>
      {capture ? (
        <div className="absolute top-0 left-0">
          <Frame theme={film.theme} shots={prepared.all} active={active} />
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10" style={{ width: WIDTH * scale, height: HEIGHT * scale }}>
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
              <Frame theme={film.theme} shots={prepared.all} active={active} />
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px]" style={{ width: WIDTH * scale }}>
            <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)} className="flex size-9 items-center justify-center rounded-full bg-white text-black">
              {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
            </button>
            <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((value) => !value)} className="text-neutral-400 hover:text-white">
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <span className="w-[86px] font-mono text-neutral-400 tabular-nums">{formatTime(time)}</span>
            <input
              type="range"
              min={0}
              max={film.duration}
              step={1 / FPS}
              value={time}
              onChange={(event) => jump(Number(event.target.value))}
              className="flex-1 accent-white"
              aria-label="Scrub"
            />
            <span className="font-mono text-neutral-500 tabular-nums">{formatTime(film.duration)}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-[12px]" style={{ width: WIDTH * scale }}>
            {film.chapters.map((chapter) => (
              <button key={chapter.at} type="button" onClick={() => jump(chapter.at)} className="rounded-full border border-white/10 px-3 py-1 text-neutral-400 hover:border-white/30 hover:text-white">
                {formatTime(chapter.at).slice(0, -3)} {chapter.title.split(":")[0]}
              </button>
            ))}
          </div>
          <audio ref={audio} src={`/film/audio?film=${film.id}`} preload="auto" muted={muted} />
        </>
      )}
    </div>
  );
}
