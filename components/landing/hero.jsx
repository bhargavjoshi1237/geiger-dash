import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SessionLink } from "@/components/session-link";
import { AppSpectrum } from "@/components/landing/app_spectrum";
import { DISPLAY } from "@/components/landing/landing_font";
import { LIVE_APP_COUNT, UPCOMING_APP_COUNT } from "@/components/landing/suite_apps";

export const PRIMARY_CTA =
  "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
export const SECONDARY_CTA =
  "inline-flex h-11 items-center rounded-full border border-border-strong px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function LandingHero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16 sm:pb-28">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Geiger Studios · {LIVE_APP_COUNT} apps live, {UPCOMING_APP_COUNT} on the way
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h1 className={`${DISPLAY} text-[3.4rem] leading-[0.86] text-balance text-foreground sm:text-7xl lg:col-span-8 lg:text-[6.25rem]`}>
          Everything your team runs, on one account.
        </h1>

        <div className="lg:col-span-4 lg:pb-2">
          <p className="max-w-sm text-base leading-relaxed text-text-secondary dark:text-muted-foreground">
            Tickets, campaigns, projects, forms, media and AI search, sharing one sign-in, one team and one bill. Start with
            the app you need; the next one is a click away.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SessionLink label="Get started" signedInLabel="Open your workspace" className={PRIMARY_CTA}>
              <ArrowRight className="h-4 w-4" />
            </SessionLink>
            <Link href="/pricing" className={SECONDARY_CTA}>
              See pricing
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <AppSpectrum />
        <div className="mt-4 hidden items-center justify-between font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase lg:flex">
          <span>Hatched bars are on the way</span>
          <span>Hover a bar to open it</span>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
