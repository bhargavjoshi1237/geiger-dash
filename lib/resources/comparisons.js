// Platform-vs-platform pages (/compare/<a>-vs-<b>). Fees and feature rows come from ticket-fees.js; only the framing lives here.

export const COMPARE_SECTION = { label: "Compare", href: "/compare" };

export const COMPARISONS = [
  {
    a: "luma",
    b: "eventbrite",
    chooseA: "You run community or meetup events from a calendar people follow, mostly free or low-priced, and want a clean page with little setup.",
    chooseB: "You sell to the public and want Eventbrite's marketplace to bring in buyers, or you need more ticketing controls than Luma offers.",
  },
  {
    a: "posh",
    b: "eventbrite",
    chooseA: "You run nightlife, parties or culture events, want buyers to cover the fee, and like a social app where people find events.",
    chooseB: "You run a wider range of events, want Eventbrite's large marketplace, and need more control over who pays the fees.",
  },
  {
    a: "dice",
    b: "posh",
    chooseA: "You're a music venue or promoter that wants DICE's fan app, all-in pricing and its Waiting List for resale.",
    chooseB: "You want self-serve setup with no approval, payouts before the event and recurring series.",
  },
  {
    a: "partiful",
    b: "luma",
    chooseA: "You're hosting a party or casual social event and mostly invite people by text.",
    chooseB: "You run recurring community events, want payouts on Stripe's normal schedule and need embeds or a calendar people can subscribe to.",
  },
  {
    a: "eventbrite",
    b: "ticket-tailor",
    chooseA: "Discovery matters more than fees and you want buyers to find you on Eventbrite's marketplace.",
    chooseB: "You bring your own audience, want a low flat fee per ticket and payouts straight to your own Stripe or PayPal account.",
  },
];

export const comparisonSlug = (comparison) => `${comparison.a}-vs-${comparison.b}`;

// Titles need platform names, so callers resolve them through ticket-fees.js; this keeps the two modules free of a cycle.
export function comparisonsFor(platformId) {
  return COMPARISONS.filter((comparison) => comparison.a === platformId || comparison.b === platformId).map((comparison) => ({
    href: `/compare/${comparisonSlug(comparison)}`,
    title: `${displayName(comparison.a)} vs ${displayName(comparison.b)}`,
    description: `Fees, payouts and features side by side.`,
  }));
}

const NAMES = { luma: "Luma", eventbrite: "Eventbrite", posh: "Posh", dice: "DICE", partiful: "Partiful", "ticket-tailor": "Ticket Tailor" };

export function displayName(id) {
  return NAMES[id] ?? id;
}

export function findComparison(slug) {
  return COMPARISONS.find((comparison) => comparisonSlug(comparison) === slug) ?? null;
}
