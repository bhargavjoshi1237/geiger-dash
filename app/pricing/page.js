import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { PlanCards } from "@/components/pricing/plan_cards";
import { PublicPageHero } from "@/components/public-page-hero";
import { Button } from "@/components/ui/button";
import { getOrgEntitlements } from "@/lib/billing/entitlements";
import { getUserPlan } from "@/lib/billing/store";

const faqs = [
  {
    question: "How does product access work?",
    answer:
      "Each foundation includes an allowance for Core, Add-on, and Cherry products. You can choose the exact products in each group and pay only for selections above the plan allowance.",
  },
  {
    question: "Can I change products after I subscribe?",
    answer:
      "Products can be enabled or disabled as your needs change, with billing updated on the next monthly cycle. Foundations can also be upgraded or downgraded at any time.",
  },
  {
    question: "How much storage and bandwidth are included?",
    answer:
      "Basic includes 5 GB storage, Plus includes 50 GB, and Pro includes 100 GB. Extra storage is $0.50 per GB, each selected storage GB includes 5 GB of bandwidth, and extra bandwidth is $0.25 per GB.",
  },
  {
    question: "What is included with the Beta Tester plan?",
    answer:
      "Beta testers get access to all 15 products for $0 while the beta program is active, along with a small included workspace allowance.",
  },
  {
    question: "How are usage overages handled?",
    answer:
      "Extra active projects are $5 each, extra collaborators are $1 each, and bandwidth is $0.25 per extra GB. Edge/CDN usage is not included with any foundation, starts at 0 GB, and costs $0.10 per GB across 119 PoPs. AI credits are $10 per 1,000 beyond the foundation allowance.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  const isAuthed = Boolean(user);

  // RLS scopes this to the user's own organizations; used by the checkout org
  // picker so a purchase can be applied to a specific organization. metadata
  // is fetched too so we can compute each org's current-plan entitlements
  // (what's already purchased) for the no-downgrade UI.
  let organizations = [];
  let entitlementsByOrg = {};
  // A user may start the cardless trial once, ever, and only when they don't
  // already hold a live plan (trialing/active). Gated on the per-user user_plan.
  let canStartTrial = false;
  if (isAuthed) {
    const { data } = await supabase
      .from("organizations")
      .select("id, name, metadata")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    organizations = (data || []).map((org) => ({ id: org.id, name: org.name || "Untitled organization" }));
    entitlementsByOrg = Object.fromEntries(
      (data || []).map((org) => [org.id, getOrgEntitlements(org)]),
    );

    const userPlan = await getUserPlan(user.id);
    canStartTrial =
      !userPlan?.trialStartedAt &&
      userPlan?.status !== "active" &&
      userPlan?.status !== "trialing";
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-20">
            <PublicPageHero
              eyebrow="Plans and pricing"
              title="One suite, priced around your team."
              description="Choose a foundation, then shape the product mix and scale around your work. Every allowance and overage stays visible as you configure."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#plans-heading">
                  Explore plans
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#plan-calculator">Build a custom plan</a>
              </Button>
            </div>
          </div>

          <PlanCards
            isAuthed={isAuthed}
            organizations={organizations}
            entitlementsByOrg={entitlementsByOrg}
            canStartTrial={canStartTrial}
          />

          <section className="border-t border-border py-16 sm:py-20" aria-labelledby="faq-heading">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Good to know</p>
                <h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Straight answers, without the pricing maze.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                  A few direct answers about configuring products, changing your plan, and understanding the estimate.
                </p>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {faqs.map((faq, index) => (
                  <details key={faq.question} className="group py-5" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {faq.question}
                      <span className="relative size-5 shrink-0 rounded-full border border-border text-muted-foreground">
                        <span className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition group-open:rotate-90 group-open:opacity-0" />
                      </span>
                    </summary>
                    <p className="max-w-2xl pt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface-card p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-sm font-semibold">Need higher limits or enterprise controls?</p>
              <p className="mt-1 text-sm text-muted-foreground">We can model dedicated support, security, data residency, and unusually high-volume workloads.</p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="mailto:support@geiger.studio">
                Talk to us
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
