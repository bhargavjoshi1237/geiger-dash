import { ResourceIndex } from "@/components/resources/resource-page";
import { COMPARISONS, comparisonSlug, displayName } from "@/lib/resources/comparisons";

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

export default function ComparePage() {
  return (
    <ResourceIndex
      title="Event ticketing platforms, compared"
      description="What each platform really charges on common ticket prices, who pays the fee, when you get paid and which events each one suits. Checked against each platform's own pages."
      items={COMPARISONS.map((comparison) => ({
        href: `/compare/${comparisonSlug(comparison)}`,
        label: `${displayName(comparison.a)} vs ${displayName(comparison.b)}`,
        description: "Fees, payouts and features side by side.",
      }))}
    />
  );
}
