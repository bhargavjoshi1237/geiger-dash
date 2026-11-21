import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ExternalLink, ShieldCheck, Ticket } from "lucide-react";
import { ResourcePage, ResourceSection, Showcase, backdropFor } from "@/components/resources/resource-page";
import { FeeCalculator } from "@/components/resources/fee-calculator";
import { describePlan, formatMoney, ticketBreakdown } from "@/lib/resources/fee-math";
import { CALCULATOR_HUB_HREF, FEES_CHECKED, FEE_PLATFORMS, GEIGER, STRIPE_ONLY_NOTE, calculatorHref, calculatorSlug, defaultPlan } from "@/lib/resources/ticket-fees";
import { comparisonsFor } from "@/lib/resources/comparisons";

export const dynamicParams = false;

const TOOLS_SECTION = { label: "Tools", href: "/tools" };

function findBySlug(slug) {
  return FEE_PLATFORMS.find((platform) => calculatorSlug(platform) === slug) ?? null;
}

export function generateStaticParams() {
  return FEE_PLATFORMS.map((platform) => ({ calculator: calculatorSlug(platform) }));
}

function copyFor(platform) {
  const plan = defaultPlan(platform);
  const sample = ticketBreakdown(plan, 25);
  const metaTitle = `${platform.name} Fee Calculator (2026): What You Keep Per Ticket`;
  const passed = plan.defaultPass ? ticketBreakdown(plan, 25, true) : null;
  const example = passed
    ? `On a $25 ticket buyers pay ${formatMoney(passed.buyerPays)}, or you keep ${formatMoney(sample.organiserGets)} if you absorb the fees.`
    : `On a $25 ticket you keep about ${formatMoney(sample.organiserGets)} on ${plan.label}.`;
  const description = `Calculate ${platform.name} ticket fees for any price: the ${platform.name} fee, card processing, what buyers pay and what you keep. ${example}`;
  return { plan, sample, metaTitle, description };
}

export async function generateMetadata({ params }) {
  const { calculator } = await params;
  const platform = findBySlug(calculator);
  if (!platform) return {};
  const { metaTitle, description } = copyFor(platform);
  const path = calculatorHref(platform);
  return {
    title: { absolute: metaTitle },
    description,
    keywords: [`${platform.name.toLowerCase()} fee calculator`, `${platform.name.toLowerCase()} fees`, `${platform.name.toLowerCase()} ticket fees`, `${platform.name.toLowerCase()} pricing`],
    alternates: { canonical: path },
    openGraph: { title: metaTitle, description, url: path, type: "website" },
    twitter: { card: "summary", title: metaTitle, description },
  };
}

export default async function FeeCalculatorPage({ params }) {
  const { calculator } = await params;
  const platform = findBySlug(calculator);
  if (!platform) notFound();

  const { plan, sample, description } = copyFor(platform);
  const onGeiger = ticketBreakdown(GEIGER.plan, 25);
  const path = calculatorHref(platform);
  const estimate = platform.plans.some((entry) => entry.estimate);

  const faqs = [
    {
      question: `How much does ${platform.name} charge per ticket?`,
      answer: `${platform.plans.map((entry) => `${entry.label}: ${describePlan(entry)}`).join(". ")}.${estimate ? ` ${platform.name} doesn't publish this fee, so it is an estimate.` : ""}`,
    },
    { question: `What do I keep from a $25 ticket on ${platform.name}?`, answer: `About ${formatMoney(sample.organiserGets)} on ${plan.label} when you absorb the fees: ${formatMoney(sample.platformFee)} goes to ${platform.name} and ${formatMoney(sample.processing)} to card processing. On Geiger Events you keep ${formatMoney(onGeiger.organiserGets)}: Geiger takes no platform fee, and the ${formatMoney(onGeiger.processing)} is Stripe's card fee only.` },
    { question: `Who pays ${platform.name}'s fees, the organiser or the buyer?`, answer: platform.whoPays },
    { question: `Does ${platform.name} charge for free events?`, answer: platform.freeEvents },
    { question: `When does ${platform.name} pay out ticket money?`, answer: platform.payouts },
    { question: `Are ${platform.name} fees refunded?`, answer: platform.refunds },
    { question: `Is there a ${platform.name} alternative with no platform fee?`, answer: `Geiger Events takes no platform fee on tickets. ${STRIPE_ONLY_NOTE} You also pay for a Geiger plan, from $${GEIGER.monthly} a month.` },
  ];

  const related = [
    { href: CALCULATOR_HUB_HREF, kind: "Fee calculator", label: "Compare every platform's fees", description: "One ticket price, every platform side by side." },
    platform.alternativeHref ? { href: platform.alternativeHref, kind: "Alternative", label: `${platform.name} alternative`, description: `How Geiger Events compares with ${platform.name} for organisers.` } : null,
    ...comparisonsFor(platform.id).map((comparison) => ({ href: comparison.href, kind: "Comparison", label: comparison.title, description: comparison.description })),
    ...FEE_PLATFORMS.filter((other) => other.id !== platform.id).map((other) => ({ href: calculatorHref(other), kind: "Fee calculator", label: `${other.name} fee calculator`, description: other.tagline })),
  ].filter(Boolean).slice(0, 9);

  return (
    <ResourcePage
      section={TOOLS_SECTION}
      path={path}
      kind="Fee calculator"
      title={`${platform.name} fee calculator`}
      description={description}
      meta={[
        { icon: Calendar, label: `Checked ${FEES_CHECKED}` },
        { icon: ShieldCheck, label: estimate ? "Estimated; fee not published" : `From ${platform.name}'s own pages` },
        { icon: Ticket, label: "US organisers, USD" },
      ]}
      showcase={
        <Showcase backdrop={backdropFor(path)} label={`${platform.name} fee calculator`}>
          <FeeCalculator platform={platform} geiger={GEIGER} />
        </Showcase>
      }
      faqs={faqs}
      related={related}
      relatedTitle="More calculators and comparisons"
      cta={{
        title: "Keep the platform fee",
        body: GEIGER.summary,
        href: platform.alternativeHref ?? GEIGER.href,
        label: platform.alternativeHref ? `Geiger vs ${platform.name}` : "See Geiger Events ticketing",
      }}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${platform.name} fee calculator`,
          url: `https://geiger.studio${path}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any operating system with a modern web browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description,
        },
      ]}
    >
      <ResourceSection title={`${platform.name} fees explained`} note={`Checked ${FEES_CHECKED}`}>
        <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Fee per ticket</th>
                <th className="px-5 py-3 text-right font-medium">You keep from $25</th>
              </tr>
            </thead>
            <tbody>
              {platform.plans.map((entry) => (
                <tr key={entry.id} className="border-b border-border/70">
                  <td className="px-5 py-4 font-medium">{entry.label}{entry.estimate ? <span className="ml-2 text-xs font-normal text-muted-foreground">estimate</span> : null}</td>
                  <td className="px-5 py-4 text-muted-foreground">{describePlan(entry)}</td>
                  <td className="px-5 py-4 text-right tabular-nums">{formatMoney(ticketBreakdown(entry, 25).organiserGets)}</td>
                </tr>
              ))}
              <tr className="bg-muted/40">
                <td className="px-5 py-4 font-medium">{GEIGER.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{describePlan(GEIGER.plan)}; plan from ${GEIGER.monthly}/month</td>
                <td className="px-5 py-4 text-right tabular-nums">{formatMoney(onGeiger.organiserGets)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {[
            ["Who pays the fees", platform.whoPays],
            ["Free events", platform.freeEvents],
            ["Payouts", platform.payouts],
            ["Refunds", platform.refunds],
          ].map(([term, detail]) => (
            <div key={term} className="bg-background p-6">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{term}</dt>
              <dd className="mt-3 text-sm leading-7 text-foreground/85">{detail}</dd>
            </div>
          ))}
        </dl>

        {platform.notes.length ? (
          <div className="mt-8 grid gap-4">
            {platform.notes.map((note) => (
              <p key={note} className="border-l-2 border-foreground/30 pl-5 text-sm leading-7 text-muted-foreground">{note}</p>
            ))}
          </div>
        ) : null}
      </ResourceSection>

      <ResourceSection title="Sources" note={String(platform.sources.length).padStart(2, "0")}>
        <ul className="flex flex-wrap gap-2">
          {platform.sources.map((source) => (
            <li key={source.url}>
              <Link href={source.url} rel="nofollow noopener" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                {source.label} <ExternalLink className="size-3" />
              </Link>
            </li>
          ))}
        </ul>
      </ResourceSection>
    </ResourcePage>
  );
}
