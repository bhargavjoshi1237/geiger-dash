"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SHOWCASE_SLIDES, accentFor } from "./showcase-apps";

// How long a slide stays put, and how long its fade in/out runs. Keep FADE_MS in
// step with the --animate-showcase-* durations in globals.css.
const HOLD_MS = 5200;
const FADE_MS = 500;

// Always light (explicit colours, not theme tokens) so it contrasts with the black sign-in column.
const PANEL =
  "relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 text-zinc-950";

// Fisher-Yates, then push any two neighbours from the same app apart so a random
// order never shows one product twice in a row.
function shuffleDeck(slides) {
  const deck = [...slides];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  for (let i = 1; i < deck.length; i += 1) {
    if (deck[i].app !== deck[i - 1].app) continue;
    const swap = deck.findIndex(
      (slide, k) => k > i && slide.app !== deck[i - 1].app && slide.app !== deck[i + 1]?.app,
    );
    if (swap > -1) [deck[i], deck[swap]] = [deck[swap], deck[i]];
  }
  return deck;
}

// Fades and lifts its children in when mounted, and back out when `phase` flips
// to "out". Remount it with a key to replay the entrance.
function Reveal({ phase, delay = 0, className, children }) {
  return (
    <div
      className={cn(
        phase === "out" ? "animate-showcase-out" : "animate-showcase-in",
        "motion-reduce:animate-none",
        className,
      )}
      style={phase === "out" ? undefined : { animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// The login screen's right-hand panel: an endlessly rotating tour of the suite,
// one app and three of its features at a time.
export function AppShowcase({ className }) {
  // Shuffled on mount, not during render: a random order on the server would not
  // match the client's. The panel renders empty for that first frame, which the
  // opening slide's fade-in covers.
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");
  const [pending, setPending] = useState(null);

  // Deferred a tick so the shuffle lands as a client-only update rather than a
  // cascading render during hydration.
  useEffect(() => {
    const shuffle = setTimeout(() => setDeck(shuffleDeck(SHOWCASE_SLIDES)), 0);
    return () => clearTimeout(shuffle);
  }, []);

  useEffect(() => {
    if (phase !== "in" || !deck.length) return undefined;
    const out = setTimeout(() => setPhase("out"), HOLD_MS);
    return () => clearTimeout(out);
  }, [phase, index, deck.length]);

  // Once the fade-out has played, swap in whichever slide is due — the next one,
  // or the one the indicators asked for.
  useEffect(() => {
    if (phase !== "out" || !deck.length) return undefined;
    const advance = setTimeout(() => {
      setIndex((current) => pending ?? (current + 1) % deck.length);
      setPending(null);
      setPhase("in");
    }, FADE_MS);
    return () => clearTimeout(advance);
  }, [phase, pending, deck.length]);

  // Jumping from the indicators fades the current slide out first, so a manual
  // pick animates exactly like an automatic one.
  const jumpTo = useCallback(
    (target) => {
      if (target === index) return;
      setPending(target);
      setPhase("out");
    },
    [index],
  );

  const slide = deck[index];

  // Empty only for the pre-hydration frame, before the deck is shuffled in.
  if (!slide) return <aside className={cn(PANEL, className)} aria-hidden="true" />;

  const Icon = slide.icon;
  const accent = accentFor(slide.app);

  return (
    <aside className={cn(PANEL, className)} aria-label="What you get with Geiger">
      {/* Soft accent wash behind the slide, tinted by the current app. */}
      <Reveal
        key={`glow-${slide.id}`}
        phase={phase}
        className={cn(
          "pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl",
          accent.split(" ")[0],
        )}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Reveal key={`head-${slide.id}`} phase={phase} className="max-w-md text-center">
            <div
              className={cn(
                "mx-auto flex size-28 items-center justify-center rounded-2xl ring-1",
                accent,
              )}
            >
              <Icon className="size-12" strokeWidth={1.5} />
            </div>
            <h2 className="mt-8 text-balance text-4xl font-medium tracking-tight text-zinc-950">
              {slide.headline}
            </h2>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-zinc-600">
              {slide.blurb}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 py-10">
          {deck.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={item.headline}
              aria-current={i === index}
              className="group flex h-4 w-5 items-center"
            >
              <span
                className={cn(
                  "h-0.5 w-full rounded-full transition-colors duration-300",
                  i === index
                    ? "bg-zinc-900"
                    : "bg-zinc-300 group-hover:bg-zinc-500",
                )}
              />
            </button>
          ))}
        </div>

        <Reveal key={`features-${slide.id}`} phase={phase} delay={140}>
          <ul className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-4">
            {slide.features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <li
                  key={feature.label}
                  className="flex flex-col items-center gap-3 text-center text-xs leading-relaxed text-zinc-600"
                >
                  <FeatureIcon className="size-5 text-zinc-500" strokeWidth={1.5} />
                  <span className="text-balance">{feature.label}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </aside>
  );
}

export default AppShowcase;
