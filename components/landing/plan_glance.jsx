import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { plans } from "@/lib/pricing/plans";
import { DISPLAY } from "@/components/landing/landing_font";
import { SectionHeading } from "@/components/landing/section_heading";
import { SPECTRUM_GRADIENT } from "@/components/landing/suite_apps";

const appsIncluded = (plan) => Object.values(plan.productAllowances).reduce((sum, count) => sum + count, 0);

// Plan summary read straight from the pricing catalog, so it can't drift from checkout.
export function PlanGlance() {
  const startingPrice = Math.min(...plans.map((plan) => plan.price));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          title={`Plans from $${startingPrice} a month.`}
          description="Each plan includes a set of apps, seats and storage. Add more of either as you grow."
        />
        <Link
          href="/pricing"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          Build your own plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="relative flex flex-col bg-background p-6 sm:p-8">
            {plan.featured ? <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundImage: SPECTRUM_GRADIENT }} /> : null}
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className={`${DISPLAY} text-6xl leading-none text-foreground`}>${plan.price}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-foreground">
              <li>{appsIncluded(plan)} apps included</li>
              <li>{plan.projectAllowance} active {plan.projectAllowance === 1 ? "project" : "projects"}</li>
              <li>{plan.seatAllowance} collaborators</li>
              <li>{plan.storageAllowance} GB storage</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlanGlance;
