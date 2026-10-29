import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "@geiger/ui/logo";
import { SessionLink } from "@/components/session-link";

export function ClosingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-subtle px-6 py-14 sm:px-12 sm:py-20">
        <Logo
          size={520}
          className="pointer-events-none absolute -right-24 -bottom-40 h-auto w-[420px] text-foreground/[0.04] sm:w-[560px]"
        />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground [font-family:var(--font-display)] [font-stretch:112%] sm:text-6xl">
            Run the whole thing from one place.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary dark:text-muted-foreground sm:text-lg">
            Start with the app you need this week. The rest are already on your account.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SessionLink
              label="Start free"
              signedInLabel="Open your workspace"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowRight className="h-4 w-4" />
            </SessionLink>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-border-strong px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClosingCta;
