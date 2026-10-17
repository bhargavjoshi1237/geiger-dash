"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { SUITE_APPS } from "@/components/landing/suite_apps";
import { DISPLAY } from "@/components/landing/landing_font";

const DWELL_MS = 5200;
const HOVER_DELAY_MS = 90;

// Parallelogram leaning like the Geiger mark; --slant is the horizontal lean across the bar's height.
const BAR_CLIP = "polygon(var(--slant) 0, 100% 0, calc(100% - var(--slant)) 100%, 0 100%)";
const ROW_CLIP = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

const STRIP_FILL = "linear-gradient(to bottom, color-mix(in oklab, var(--hue) 92%, transparent), color-mix(in oklab, var(--hue) 20%, transparent) 78%)";
const HATCH_FILL = "repeating-linear-gradient(-60deg, color-mix(in oklab, var(--hue) 55%, transparent) 0 2px, transparent 2px 9px), color-mix(in oklab, var(--hue) 10%, transparent)";
const PANEL_WASH = "linear-gradient(to bottom, color-mix(in oklab, var(--hue) 36%, transparent), transparent 62%)";
const ROW_FILL = "linear-gradient(to right, color-mix(in oklab, var(--hue) 42%, transparent), color-mix(in oklab, var(--hue) 6%, transparent) 70%)";
const ROW_HATCH = "repeating-linear-gradient(-60deg, color-mix(in oklab, var(--hue) 40%, transparent) 0 2px, transparent 2px 9px)";

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function FeatureList({ app }) {
  return (
    <ul className="space-y-1.5">
      {app.features.map((feature) => (
        <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary dark:text-muted-foreground">
          <span aria-hidden="true" className={`h-2 w-1.5 shrink-0 -skew-x-[14deg] ${app.accent.dot} ${app.available ? "" : "opacity-50"}`} />
          {feature}
        </li>
      ))}
    </ul>
  );
}

function OpenLink({ app }) {
  if (!app.available) {
    return <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">In the works</p>;
  }
  return (
    <a
      href={app.href}
      className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Open {app.name}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
    </a>
  );
}

// Desktop: the suite as a band of leaning bars; one widens to show its app.
function SpectrumBand() {
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [inView, setInView] = useState(false);
  const bandRef = useRef(null);
  const hoverTimer = useRef(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const calm = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cycling = wide && !calm && !engaged && inView;

  useEffect(() => {
    const node = bandRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cycling) return undefined;
    const timer = setTimeout(() => setActive((index) => (index + 1) % SUITE_APPS.length), DWELL_MS);
    return () => clearTimeout(timer);
  }, [cycling, active]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const activate = (index) => {
    setEngaged(true);
    setActive(index);
  };

  const hoverIn = (event, index) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => activate(index), HOVER_DELAY_MS);
  };

  // Resume the auto-advance once the pointer leaves, unless keyboard focus is still inside the band.
  const leaveBand = () => {
    clearTimeout(hoverTimer.current);
    if (!bandRef.current?.contains(document.activeElement)) setEngaged(false);
  };

  return (
    <ul
      ref={bandRef}
      onPointerLeave={leaveBand}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false);
      }}
      className="hidden h-[440px] [--gap:6px] [--slant:90px] [--strip:34px] [--tilt:11.6deg] lg:flex xl:[--slant:110px] xl:[--strip:50px] xl:[--tilt:14deg]"
    >
      {SUITE_APPS.map((app, index) => {
        const isActive = index === active;
        const Icon = app.icon;
        const panelId = `spectrum-panel-${app.id}`;

        return (
          <li
            key={app.id}
            onPointerEnter={(event) => hoverIn(event, index)}
            onPointerLeave={() => clearTimeout(hoverTimer.current)}
            className="relative h-full min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:animate-landing-rise motion-reduce:transition-none"
            style={{
              "--hue": app.accent.color,
              flexGrow: isActive ? 1 : 0,
              flexShrink: 0,
              flexBasis: "calc(var(--strip) + var(--slant))",
              marginLeft: index === 0 ? 0 : "calc(var(--gap) - var(--slant))",
              clipPath: BAR_CLIP,
              animationDelay: `${index * 45}ms`,
            }}
          >
            {/* Collapsed strip: hue fill (hatched when not shipped yet), icon at the foot, name along the lean. */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"}`}
              style={{ background: app.available ? STRIP_FILL : HATCH_FILL }}
            >
              <span
                className="absolute bottom-14 origin-left font-mono text-[11px] tracking-[0.2em] whitespace-nowrap text-foreground/80 uppercase"
                style={{ left: "calc(var(--strip) / 2)", transform: "rotate(calc(-90deg + var(--tilt)))" }}
              >
                {app.name}
              </span>
              <Icon className="absolute bottom-4 h-4 w-4 text-foreground" style={{ left: "calc(var(--strip) / 2 - 0.5rem)" }} />
            </div>

            {/* Open panel surface. */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-surface-subtle transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
            >
              <div className="absolute inset-0" style={{ background: PANEL_WASH }} />
            </div>

            <button
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              aria-label={`${app.name}: ${app.tagline}${app.available ? "" : " (coming soon)"}`}
              onClick={() => activate(index)}
              onFocus={() => activate(index)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:[box-shadow:inset_0_-3px_0_var(--hue)]"
            />

            {/* Content is laid out at the open width so it never reflows while the bar grows; the steps follow the lean. */}
            <div
              id={panelId}
              inert={!isActive}
              className={`absolute inset-y-0 left-0 z-20 flex w-[31rem] flex-col justify-between py-7 transition-opacity xl:w-[35rem] ${
                isActive ? "opacity-100 delay-200 duration-500" : "pointer-events-none opacity-0 duration-150"
              }`}
            >
              <div className="flex items-center gap-3 pr-6" style={{ paddingLeft: "calc(var(--slant) + 1.25rem)" }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background/70">
                  <Icon className={`h-[18px] w-[18px] ${app.accent.text}`} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {app.available ? "Live now" : "On the way"}
                </span>
              </div>

              <h3 className={`${DISPLAY} text-[5.5rem] leading-[0.85] text-foreground`} style={{ paddingLeft: "calc(var(--slant) * 0.5 + 1.25rem)" }}>
                {app.name}
              </h3>

              <div className="space-y-5" style={{ paddingLeft: "calc(var(--slant) * 0.42 + 1rem)", paddingRight: "calc(var(--slant) * 0.6 + 1rem)" }}>
                <p className="text-lg leading-snug text-foreground">{app.tagline}</p>
                <FeatureList app={app} />
                <OpenLink app={app} />
              </div>
            </div>

            {isActive && cycling ? (
              <span
                key={`dwell-${active}`}
                aria-hidden="true"
                className="absolute bottom-0 left-0 z-20 h-[3px] w-full origin-left animate-landing-dwell"
                style={{ backgroundColor: "var(--hue)", animationDuration: `${DWELL_MS}ms` }}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// Below lg: the same band turned into a stack of leaning rows, one open at a time.
function SpectrumStack() {
  const [openId, setOpenId] = useState(SUITE_APPS[0].id);

  return (
    <ul className="flex flex-col gap-1.5 lg:hidden">
      {SUITE_APPS.map((app) => {
        const open = app.id === openId;
        const Icon = app.icon;
        const panelId = `spectrum-row-${app.id}`;

        return (
          <li key={app.id} className="relative" style={{ "--hue": app.accent.color, clipPath: ROW_CLIP }}>
            <div aria-hidden="true" className={`absolute inset-0 ${open ? "bg-surface-subtle" : ""}`} style={{ background: open ? undefined : app.available ? ROW_FILL : ROW_HATCH }}>
              {open ? <div className="absolute inset-0" style={{ background: "linear-gradient(to right, color-mix(in oklab, var(--hue) 26%, transparent), transparent 75%)" }} /> : null}
            </div>
            <h3 className="relative">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : app.id)}
                className="flex w-full items-center gap-3 py-3.5 pr-8 pl-7 text-left focus-visible:outline-none focus-visible:[box-shadow:inset_0_-2px_0_var(--hue)]"
              >
                <Icon className="h-4 w-4 shrink-0 text-foreground" />
                <span className={open ? `${DISPLAY} text-2xl leading-none text-foreground` : "text-sm font-medium text-foreground"}>{app.name}</span>
                {!open ? <span className="hidden min-w-0 truncate text-sm text-foreground/70 sm:block">{app.tagline}</span> : null}
                {!app.available ? (
                  <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">On the way</span>
                ) : null}
              </button>
            </h3>
            {open ? (
              <div id={panelId} className="relative space-y-4 pr-8 pb-6 pl-7">
                <p className="text-base leading-snug text-foreground">{app.tagline}</p>
                <FeatureList app={app} />
                <OpenLink app={app} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function AppSpectrum() {
  return (
    <>
      <SpectrumBand />
      <SpectrumStack />
    </>
  );
}

export default AppSpectrum;
