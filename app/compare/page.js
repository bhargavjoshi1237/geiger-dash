import { ResourceIndex } from "@/components/resources/resource-page";
import { formatMoney, ticketBreakdown } from "@/lib/resources/fee-math";
import { COMPARISONS, comparisonSlug } from "@/lib/resources/comparisons";
import { FEES_CHECKED, GEIGER, defaultPlan, findFeePlatform } from "@/lib/resources/ticket-fees";

export const metadata = {
  title: "Event Ticketing Platforms Compared",
  description:
    "Side-by-side comparisons of event ticketing platforms for organizers: Luma vs Eventbrite, Posh vs Eventbrite, DICE vs Posh, Partiful vs Luma and Eventbrite vs Ticket Tailor. Real fees on real ticket prices.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Event Ticketing Platforms Compared | Geiger Studios",
    description: "Fees, payouts and features of the main ticketing platforms, side by side.",
    url: "/compare",
    type: "website",
  },
};

// What the organiser keeps from a $25 ticket on each side, plus Geiger, for the card art.
function previewFor(a, b) {
  const keep = (plan, pass) => formatMoney(ticketBreakdown(plan, 25, pass).organiserGets);
  return [
    { label: a.name, value: keep(defaultPlan(a), defaultPlan(a).defaultPass) },
    { label: b.name, value: keep(defaultPlan(b), defaultPlan(b).defaultPass) },
    { label: "Geiger (Stripe fee only)", value: keep(GEIGER.plan, false) },
  ];
}

export default function ComparePage() {
  const items = COMPARISONS.map((comparison) => {
    const a = findFeePlatform(comparison.a);
    const b = findFeePlatform(comparison.b);
    return {
      href: `/compare/${comparisonSlug(comparison)}`,
      label: `${a.name} vs ${b.name}`,
      badge: "Comparison",
      meta: `Fees, payouts and features · checked ${FEES_CHECKED}`,
      description: `Choose ${a.name} if ${lower(comparison.chooseA)} Choose ${b.name} if ${lower(comparison.chooseB)}`,
      previewTitle: "$25 ticket, you keep",
      preview: previewFor(a, b),
    };
  });

  return (
    <ResourceIndex
      title="Ticketing platforms, compared"
      description="What each platform really charges on common ticket prices, who pays the fee, when you get paid and which events each one suits. Checked against each platform's own pages."
      listTitle="All comparisons"
      items={items}
    />
  );
}

function lower(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
