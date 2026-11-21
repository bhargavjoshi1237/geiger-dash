import { ResourcePage } from "@/components/resources/resource-page";
import { FeeComparisonTable } from "@/components/resources/fee-calculator";
import { CALCULATOR_HUB_HREF, FEES_CHECKED, FEE_PLATFORMS, GEIGER, calculatorHref } from "@/lib/resources/ticket-fees";
import { COMPARISONS, comparisonSlug, displayName } from "@/lib/resources/comparisons";

const TITLE = "Ticket Fee Calculator: Eventbrite, Luma, Posh, DICE & More Compared";
const DESCRIPTION =
  "Compare ticket fees across Eventbrite, Luma, Posh, DICE, Partiful and Ticket Tailor for any ticket price. See what each platform takes, what you keep and how no-fee ticketing on Geiger Events compares.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ticket fee calculator", "ticketing fees comparison", "event ticketing fees", "ticket platform fees"],
  alternates: { canonical: CALCULATOR_HUB_HREF },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CALCULATOR_HUB_HREF, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function TicketFeeCalculatorPage() {
  const faqs = [
    { question: "Which ticketing platform has the lowest fees?", answer: `It depends on ticket price and volume, because some platforms charge a percentage, some a fixed amount per ticket and some a monthly plan. Geiger Events adds no fee per ticket, so you pay only Stripe's processing fee (2.9% + 30¢ for a standard US card), plus a plan from $${GEIGER.monthly} a month.` },
    { question: "Should I pass ticket fees on to buyers?", answer: "Passing fees on keeps your full ticket price, but buyers see a higher total at checkout, which can lower conversion. Platforms such as Posh and DICE add their fee on top by default; Luma always takes it from your ticket price." },
    { question: "Are these fees the same outside the US?", answer: "No. These are US rates in US dollars. Most platforms and Stripe charge different rates in other countries and for international cards." },
  ];

  return (
    <ResourcePage
      section={{ label: "Tools", href: "/tools" }}
      path={CALCULATOR_HUB_HREF}
      title="Ticket fee calculator"
      description={DESCRIPTION}
      highlights={["6 platforms", "Monthly plans included", "Sourced fees"]}
      checked={FEES_CHECKED}
      faqs={faqs}
      related={[
        ...FEE_PLATFORMS.map((platform) => ({ href: calculatorHref(platform), label: `${platform.name} fee calculator`, description: platform.tagline })),
        ...COMPARISONS.map((comparison) => ({ href: `/compare/${comparisonSlug(comparison)}`, label: `${displayName(comparison.a)} vs ${displayName(comparison.b)}`, description: "Fees, payouts and features side by side." })),
      ]}
      relatedTitle="Per-platform calculators and comparisons"
      cta={{ title: "Sell tickets with no fee per ticket", body: GEIGER.summary, href: GEIGER.href, label: "See Geiger Events ticketing" }}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Ticket fee calculator",
          url: `https://geiger.studio${CALCULATOR_HUB_HREF}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any operating system with a modern web browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: DESCRIPTION,
        },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-card/65 p-3 shadow-[0_24px_80px_rgb(0_0_0/0.08)] sm:p-5">
          <FeeComparisonTable platforms={FEE_PLATFORMS} geiger={GEIGER} />
        </div>
      </section>
    </ResourcePage>
  );
}
