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
import { getPricing } from "@/lib/pricing/queries";

const PRICING_DESCRIPTION = "Plans and prices for Geiger Studios. Choose the apps your team needs, and see what each plan includes before you start.";

export const metadata = {
  title: "Pricing",
  description: PRICING_DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: { title: "Pricing | Geiger Studios", description: PRICING_DESCRIPTION, url: "/pricing", type: "website" },
};

export default async function PricingPage() {
  const supabase = await createClient();
  const [user, pricing] = await Promise.all([getUser(supabase), getPricing()]);
  const isAuthed = Boolean(user);
  const { page } = pricing;

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
              title={page.heroTitle}
              titleClassName="[font-family:var(--font-display)]"
              description={page.heroDescription}
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
            pricingConfig={pricing.config}
            pricingVersionId={pricing.versionId}
            isAuthed={isAuthed}
            organizations={organizations}
            entitlementsByOrg={entitlementsByOrg}
            canStartTrial={canStartTrial}
          />

          {page.showBeta ? (
            <BetaSignup
              betaPlan={pricing.betaPlan}
              isAuthed={isAuthed}
              organizations={organizations}
              entitlementsByOrg={entitlementsByOrg}
            />
          ) : null}

          {page.showFaq && page.faqs.length ? (
            <section className="mt-24 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16" aria-labelledby="faq-heading">
              <div>
                <h2 id="faq-heading" className="text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] [font-family:var(--font-display)]">
                  {page.faqHeading}
                </h2>
              </div>
              <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-border">
                {page.faqs.map((faq, index) => (
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
          ) : null}

          {page.showContact ? (
            <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface-subtle px-6 py-6 sm:flex-row sm:items-center sm:px-7">
              <div>
                <p className="text-[15px] font-semibold">{page.contactTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{page.contactDescription}</p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <a href={`mailto:${page.contactEmail}`}>
                  Talk to us
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
