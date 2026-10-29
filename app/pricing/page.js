import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { PlanConfigurator } from "@/components/pricing/plan_configurator";
import { BetaSignup } from "@/components/pricing/beta_signup";
import { PublicPageHero } from "@/components/public-page-hero";
import { displayFont } from "@/components/suite-landing/display_font";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@geiger/ui";
import { getOrgEntitlements } from "@/lib/billing/entitlements";
import { getUserPlan } from "@/lib/billing/store";

const faqs = [
  {
    question: "What are main apps and tools?",
    answer:
      "Main apps run a whole area of work: Flow, Campaign, Events, Assets, Comms and Property. Tools are smaller apps that work alongside them: Forms, Grey, Docs, Office, Content and Pods. Every plan includes a set number of each, plus Notes. Extra main apps are $10/mo and extra tools $5/mo.",
  },
  {
    question: "What do Light, Medium and Heavy mean?",
    answer:
      "They are presets for storage, AI credits, email and edge delivery. Light is what your plan already includes. Medium and Heavy add a fixed amount, and each one shows its price before you pick it.",
  },
  {
    question: "Can I change my plan or apps later?",
    answer:
      "Yes. Add apps, people or usage at any time. When you upgrade, you only pay the difference from what you already pay. To move to a smaller plan, cancel your current plan first.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes. Basic is free for 15 days with no card required. The trial ends on its own and nothing is charged.",
  },
  {
    question: "What is the Beta Tester plan?",
    answer:
      "While Geiger is in beta, testers get every app for $0 with 1 active project, 3 people, 5 GB storage, 25 GB transfer and 50 AI credits.",
  },
  {
    question: "How does yearly billing work?",
    answer: "Yearly costs 10 times the monthly price, so two months are free. Your whole setup is billed once a year.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  const isAuthed = Boolean(user);

  // RLS-scoped orgs feed the checkout org picker; metadata gives each org's current-plan entitlements for the no-downgrade UI.
  let organizations = [];
  let entitlementsByOrg = {};
  // The cardless trial can be started once per user, and only without a live (trialing/active) plan.
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
    <div className={`${displayFont.variable} flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground`}>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-20">
            <PublicPageHero
              eyebrow="Plans and pricing"
              title="One suite, priced around your team."
              titleClassName="[font-family:var(--font-display)]"
              description="Choose a plan, then shape the apps, people and usage around your work. Every allowance and overage stays visible as you configure."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#plans-heading">
                  Explore plans
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#plan-builder">Build a custom plan</a>
              </Button>
            </div>
          </div>

          <PlanConfigurator
            isAuthed={isAuthed}
            organizations={organizations}
            entitlementsByOrg={entitlementsByOrg}
            canStartTrial={canStartTrial}
          />

          <BetaSignup isAuthed={isAuthed} organizations={organizations} entitlementsByOrg={entitlementsByOrg} />

          <section className="mt-24 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16" aria-labelledby="faq-heading">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Questions</p>
              <h2 id="faq-heading" className="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] [font-family:var(--font-display)]">
                How pricing works, in plain terms.
              </h2>
            </div>
            <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-border">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border last:border-b">
                  <AccordionTrigger className="items-center gap-6 py-[18px] text-[15px] font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[640px] pb-5 text-pretty text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface-subtle px-6 py-6 sm:flex-row sm:items-center sm:px-7">
            <div>
              <p className="text-[15px] font-semibold">Need more than Pro?</p>
              <p className="mt-1 text-sm text-muted-foreground">Custom limits, security reviews, data residency and dedicated support.</p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <a href="mailto:support@geiger.studio">
                Talk to us
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
