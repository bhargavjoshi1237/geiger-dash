"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTIF_COMPONENTS } from "@/components/features-hub/motifs";
import { useInView, useReducedMotion, useScramble } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

// Linear's Security card trick: the tail of the line stays scrambled until the card is hovered.
function ScrambledTail({ target, scrambled, decoded }) {
  const text = useScramble(target, scrambled, decoded);
  return (
    <>
      <span className="[@media(hover:hover)]:hidden">{target}</span>
      <span className="hidden [@media(hover:hover)]:inline">
        {text.split("").map((char, index) => (
          <span key={index} className={char === target[index] ? undefined : "text-text-tertiary/70"}>
            {char}
          </span>
        ))}
      </span>
    </>
  );
}

function Description({ text, scramble, decoded }) {
  const words = text.trim().split(/\s+/);
  const last = words.pop() || "";
  if (!scramble || last.length < 3) return text;
  const keep = Math.ceil(last.length * 0.4);
  const head = [...words, last.slice(0, keep)].join(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {head}
        <ScrambledTail target={last.slice(keep)} scrambled={scramble.slice(0, last.length - keep)} decoded={decoded} />
      </span>
    </>
  );
}

// Motifs draw in the palette's primary text shade (--ink) and set text on it in the background shade.
const INK = { "--ink": "var(--foreground)", "--ink-fg": "var(--background)", "--halo": "var(--surface-subtle)" };

// One feature in the Linear-style grid: an animated motif behind, the eyebrow and line in front.
export function FeatureCard({ href, title, description, motif, variant, seed, scramble, wide }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const Motif = MOTIF_COMPONENTS[motif] || MOTIF_COMPONENTS.cards;

  return (
    <Link
      ref={ref}
      href={href}
      data-inview={inView === null ? undefined : String(inView)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl bg-surface-subtle p-6 transition-[filter,scale] duration-200 ease-out hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.99] sm:p-8",
        wide && "sm:col-span-2 sm:min-h-[23rem]",
        styles.card,
      )}
      style={INK}
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 -z-10 h-[17rem]", wide && "sm:inset-y-0 sm:right-0 sm:left-[34%] sm:h-auto")}
      >
        <Motif
          variant={variant}
          seed={seed}
          hovered={hovered}
          inView={inView}
          running={inView !== false && !reducedMotion}
          reducedMotion={reducedMotion}
          cardRef={ref}
        />
      </div>
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 bg-linear-to-t from-surface-subtle via-surface-subtle/85 to-transparent", wide && "sm:hidden")}
      />
      {wide ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[34%] -z-10 hidden w-44 bg-linear-to-r from-surface-subtle to-transparent sm:block" />
      ) : null}

      <div className="flex items-end justify-between gap-5">
        <div className="max-w-sm">
          <h3 className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <span aria-hidden="true" className="h-2 w-3.5 shrink-0 rounded-full border border-text-tertiary" />
            {title}
          </h3>
          <p className="mt-1.5 text-lg leading-snug font-medium tracking-tight text-balance text-foreground sm:text-xl">
            <Description text={description} scramble={scramble} decoded={hovered} />
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-card text-muted-foreground transition-colors group-hover:border-border-strong group-hover:bg-surface-hover group-hover:text-foreground"
        >
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border border-border transition-colors group-hover:border-border-strong" />
    </Link>
  );
}
