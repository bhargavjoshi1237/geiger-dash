import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SessionLink } from "@/components/session-link";
import { DISPLAY } from "@/components/landing/landing_font";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/components/landing/hero";
import { SPECTRUM_GRADIENT } from "@/components/landing/suite_apps";

const LOGO_MASK = `url(${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg)`;

// Closing call to action: the hero's spectrum resolves into the Geiger mark itself.
export function LandingClosing() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="grid items-center gap-12 border-t border-border pt-20 sm:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className={`${DISPLAY} text-5xl leading-[0.88] text-balance text-foreground sm:text-7xl`}>
            Start with the app you need this week.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary dark:text-muted-foreground">
            The rest of the suite sits on the same account, ready when you are.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SessionLink label="Get started" signedInLabel="Open your workspace" className={PRIMARY_CTA}>
              <ArrowRight className="h-4 w-4" />
            </SessionLink>
            <Link href="/contact" className={SECONDARY_CTA}>
              Talk to us
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mx-auto aspect-[467/285] w-full max-w-md lg:col-span-5 lg:max-w-none"
          style={{
            backgroundImage: SPECTRUM_GRADIENT,
            maskImage: LOGO_MASK,
            WebkitMaskImage: LOGO_MASK,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </div>
    </section>
  );
}

export default LandingClosing;
