import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SessionLink } from "@/components/session-link";
import { EclipseScene } from "@/components/eclipse-hero/eclipse_scene";

const LINES = ["One sign-in", "One team", "One bill"];

// Landing-preview hero: copy either side of the backlit Geiger mark from xl up; below that the scene sits above the copy.
export function EclipseHero() {
  return (
    <section className="relative isolate flex w-full flex-col pt-16 [--eclipse-mark:clamp(170px,44vw,240px)] xl:min-h-[min(100svh,1000px)] xl:[--eclipse-mark:clamp(250px,21vw,320px)]">
      <div className="relative h-[min(118vw,520px)] w-full xl:absolute xl:inset-x-0 xl:top-16 xl:bottom-0 xl:h-auto">
        <EclipseScene />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-10 px-4 pb-20 text-center sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:pb-0 xl:text-left">
        <div className="flex max-w-xl flex-col items-center xl:max-w-[33rem] xl:items-start">
          <h1 className="text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground [font-family:var(--font-display)] [font-stretch:112%] sm:text-6xl xl:text-5xl">
            Built to Manage. Designed to Create
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
            <SessionLink
              label="Log in to Start"
              signedInLabel="Get in Your Workspace"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
            >
              <ArrowRight className="h-4 w-4" />
            </SessionLink>
            <Link
              href="/why-geiger"
              className="inline-flex h-10 items-center rounded-full border border-border-strong bg-background/40 px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-surface-hover/70 sm:text-base"
            >
              Why Geiger
            </Link>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5 text-sm font-medium text-foreground/85 sm:text-base xl:w-56">
          {LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default EclipseHero;
