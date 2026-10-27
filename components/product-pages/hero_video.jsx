"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/features-hub/motion";
import styles from "@/components/product-pages/product_pages.module.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const noopSubscribe = () => () => {};
const fileFor = (name, theme, ext) => `${BASE}/videos/${name}-${theme}.${ext}`;

// One theme's loop: fades in over its poster once frames are actually playing, and only plays while on screen.
function FilmLoop({ name, theme }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn("absolute inset-0 size-full object-cover object-[62%_center] transition-opacity duration-1000 ease-out", playing ? "opacity-100" : "opacity-0")}
    >
      <source src={fileFor(name, theme, "webm")} type="video/webm" />
      <source src={fileFor(name, theme, "mp4")} type="video/mp4" />
    </video>
  );
}

// Linear's hero film: a pre-rendered loop of the product (scripts/hero-video) playing muted behind the headline.
// Posters render on the server so the hero is never empty; reduced motion and data saver keep the still.
export function HeroVideo({ name, className }) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const saveData = mounted && Boolean(navigator.connection?.saveData);
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const play = mounted && Boolean(resolvedTheme) && !reducedMotion && !saveData;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none", className)}>
      <div className="absolute inset-0 opacity-75 dark:opacity-60">
        <div className="absolute inset-0 bg-cover bg-[position:62%_center] dark:hidden" style={{ backgroundImage: `url(${fileFor(name, "light", "jpg")})` }} />
        <div className="absolute inset-0 hidden bg-cover bg-[position:62%_center] dark:block" style={{ backgroundImage: `url(${fileFor(name, "dark", "jpg")})` }} />
        {play ? <FilmLoop key={theme} name={name} theme={theme} /> : null}
      </div>
      <div className={styles.videoShade} />
    </div>
  );
}
