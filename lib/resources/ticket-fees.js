// Ticket fee data for the fee calculators (/tools/<id>-fee-calculator) and comparisons (/compare/<a>-vs-<b>).
// US organisers selling in USD. Every number cites its source; `estimate: true` marks fees the platform doesn't publish. Re-check before each FEES_CHECKED bump.

export const FEES_CHECKED = "21 November 2026";

export const STRIPE_US = { percent: 2.9, fixed: 0.3 };

export const GEIGER = {
  id: "geiger",
  name: "Geiger Events",
  plan: { id: "geiger", label: "Geiger Events", percent: 0, fixed: 0, processing: STRIPE_US, canPassToBuyer: false },
  monthly: 29,
  summary: "No fee per ticket. Sales are charged on your own Stripe account, so you pay only Stripe's processing fee, plus a Geiger plan from $29 a month.",
  href: "/apps/events/ticketing",
};

export const FEE_PLATFORMS = [
  {
    id: "eventbrite",
    name: "Eventbrite",
    alternativeHref: "/solutions/events/eventbrite-alternative",
    tagline: "The big marketplace, with 3.7% + $1.79 a ticket plus 2.9% processing",
    plans: [
      { id: "standard", label: "Eventbrite", percent: 3.7, fixed: 1.79, processing: { percent: 2.9, fixed: 0 }, processingOnSubtotal: true, canPassToBuyer: true, defaultPass: true, isDefault: true },
    ],
    whoPays: "The buyer, by default. You can tick “Absorb fees” on each ticket type to take them out of your ticket price instead; the change applies to future orders.",
    freeEvents: "No fees on free events.",
    payouts: "Through Eventbrite Payment Processing; US organisers can't connect their own Stripe account. Payouts go out three business days after the event ends and usually land 6–8 business days after it. Custom schedules open up after your first event.",
    refunds: "Eventbrite keeps its fees when you refund a ticket. They are returned to buyers only if the event is cancelled.",
    notes: [
      "The service fee is charged on the ticket price; the 2.9% processing fee is charged on the whole order, including the service fee and tax.",
      "Per-ticket fees are the same on every plan. Premium ($69 a month) and Ultimate ($199 a month) add marketing tools; Pro is closed to new subscribers and Flex has been retired.",
      "At the door, Eventbrite charges $1 per paid ticket plus 2.9% of the order, and the processing fee can't be passed on.",
    ],
    sources: [
      { label: "Eventbrite pricing", url: "https://www.eventbrite.com/organizer/pricing/" },
      { label: "Eventbrite's ticketing fees", url: "https://support.eventbrite.com/hc/en-us/articles/34868013324818-Eventbrite-s-Ticketing-Fees" },
      { label: "Pricing and plans", url: "https://support.eventbrite.com/hc/en-us/articles/34868014976658-Eventbrite-s-pricing-and-plans" },
      { label: "Is the ticketing fee refundable?", url: "https://support.eventbrite.com/hc/en-us/articles/34864930557586-Is-the-Ticketing-Fee-refundable" },
    ],
    profile: {
      bestFor: "Public events that want reach through a large consumer marketplace",
      discovery: "Yes, eventbrite.com and the app, plus paid Eventbrite Ads",
      reservedSeating: "Yes, though not with recurring events or waitlists",
      recurring: "Yes, including timed entry",
      questions: "Yes, with conditional sub-questions",
      checkIn: "Yes, the Organizer app, plus card sales at the door",
      embed: "Yes, embedded checkout for one event at a time",
      messaging: "Built-in email campaigns; more volume on Premium and Ultimate",
      payouts: "After the event by default, through Eventbrite's own processing",
      limits: "$1.79 fixed fee hurts cheap tickets, no own processor in the US, fees kept on refunds",
    },
  },
  {
    id: "ticket-tailor",
    name: "Ticket Tailor",
    alternativeHref: null,
    tagline: "A flat $0.85 per ticket plus your own Stripe, PayPal or Square fees",
    plans: [
      { id: "payg", label: "Ticket Tailor pay as you sell", percent: 0, fixed: 0.85, processing: STRIPE_US, canPassToBuyer: true, isDefault: true },
      { id: "credits-100", label: "Ticket Tailor credits (100 pack)", percent: 0, fixed: 0.7, processing: STRIPE_US, canPassToBuyer: true },
      { id: "credits-1000", label: "Ticket Tailor credits (1,000 pack)", percent: 0, fixed: 0.52, processing: STRIPE_US, canPassToBuyer: true },
    ],
    whoPays: "Your choice. Ticket Tailor won't add fees automatically; to pass them on you add your own booking fee per ticket and transaction fee per order.",
    freeEvents: "No fees for up to 5,000 free tickets a year. Seated tickets use extra credits, even when free.",
    payouts: "Straight to your own Stripe, PayPal or Square account as each sale happens; Ticket Tailor never holds the money.",
    refunds: "Ticket Tailor's fees aren't refunded, even if an event is cancelled. You can choose to refund the full amount or keep the booking fees you added.",
    notes: [
      "The flat fee is per paid ticket; card processing is your processor's own rate. Stripe charges 2.9% + 30¢ per transaction, so orders with several tickets pay the 30¢ once. This calculator applies it per ticket, the cautious case.",
      "Prepaid credits get cheaper with volume, down to $0.34 a ticket at 20,000 credits. Paid seated tickets use 2 credits, and charities get 50% off.",
      "White labelling costs $49 a month and a custom domain $8 a month.",
    ],
    sources: [
      { label: "Ticket Tailor pricing (US)", url: "https://www.tickettailor.com/en-us/pricing" },
      { label: "How Ticket Tailor charges", url: "https://help.tickettailor.com/en/articles/6731528-how-much-does-ticket-tailor-cost-and-how-will-i-be-charged" },
      { label: "Passing fees to buyers", url: "https://help.tickettailor.com/en/articles/5210356-how-to-pass-fees-onto-your-ticket-buyers" },
    ],
    profile: {
      bestFor: "Cost-conscious independent organisers, venues and charities selling to their own audience",
      discovery: "No meaningful marketplace",
      reservedSeating: "Yes, custom seating charts (each seat uses an extra credit)",
      recurring: "Yes, with time slots and occurrences",
      questions: "Yes, a custom checkout form",
      checkIn: "Yes, an offline-capable scanning app",
      embed: "Yes, on your own website",
      messaging: "Scheduled emails to buyers and SMS reminders at $0.10 each",
      payouts: "Instant, to your own Stripe, PayPal or Square account",
      limits: "Processing fees extra, fees can't be passed on automatically, fees kept even if an event is cancelled",
    },
  },
  {
    id: "luma",
    name: "Luma",
    alternativeHref: "/solutions/events/luma-alternative",
    tagline: "Community and meetup events with a 5% fee on the free plan",
    plans: [
      { id: "free", label: "Luma Free", percent: 5, fixed: 0, processing: STRIPE_US, canPassToBuyer: false, isDefault: true },
      { id: "plus", label: "Luma Plus ($59/mo billed yearly)", percent: 0, fixed: 0, processing: STRIPE_US, canPassToBuyer: false, monthly: 59 },
    ],
    whoPays: "The organiser. Luma has no option to add fees on top, so the price you set is what guests pay and both fees come out of it.",
    freeEvents: "No fees on free events.",
    payouts: "Paid into your own Stripe account (one per Luma calendar) on Stripe's payout schedule, usually rolling.",
    refunds: "Luma charges nothing extra to refund, but you lose the original card fee and the 5% platform fee on a refunded ticket.",
    notes: [
      "Luma Plus is $59 a month billed yearly and is bought per calendar; the monthly price isn't listed on the pricing page.",
      "Luma's help center says to charge about $52.50 to net $50 on the free plan, which leaves out Stripe's fee. With both fees you need about $54.62.",
    ],
    sources: [
      { label: "Luma pricing", url: "https://luma.com/pricing" },
      { label: "Luma Plus", url: "https://help.luma.com/p/luma-plus" },
      { label: "Creating a paid event", url: "https://help.luma.com/p/creating-a-paid-event" },
      { label: "Refunding a guest", url: "https://help.luma.com/p/refunding-a-guest" },
    ],
    profile: {
      bestFor: "Community, tech and creator meetups run from a calendar people subscribe to",
      discovery: "Partly: curated city pages and featured events picked by Luma's team",
      reservedSeating: "No",
      recurring: "By cloning an event, up to 30 copies at a time",
      questions: "Yes, on every plan",
      checkIn: "Yes, QR scanning in the web and mobile apps",
      embed: "Yes, a registration button or embedded event page",
      messaging: "Email, SMS, push and WhatsApp blasts to guests",
      payouts: "Your own Stripe account, on Stripe's schedule",
      limits: "5% fee on the free plan, fees can't be passed to buyers, no reserved seating",
    },
  },
  {
    id: "partiful",
    name: "Partiful",
    alternativeHref: "/solutions/events/partiful-alternative",
    tagline: "Stylish party invites, with paid ticketing added in 2026",
    plans: [
      { id: "tickets", label: "Partiful ticket sales (estimated)", percent: 10, fixed: 2, processing: null, canPassToBuyer: true, isDefault: true, estimate: true },
    ],
    whoPays: "Your choice. Enter what you want to receive or the ticket price, and Partiful fills in the other with its service fee.",
    freeEvents: "No fees on free tickets.",
    payouts: "Through Stripe, held until after the event and paid about 3–7 business days after it ends; first payouts can take up to 14 days.",
    refunds: "Hosts can't refund individual tickets in the app. If the host cancels, Partiful refunds every ticket in full, including the service fee.",
    notes: [
      "Partiful doesn't publish its ticket fee; it says the fee depends on event size and ticket price. 10% + $2.00 per ticket is the figure Luma reported in September 2026, and it matches Partiful's own example of a $112 ticket paying the host $100.",
      "The service fee includes card processing, so nothing extra is added for Stripe.",
    ],
    sources: [
      { label: "What fees does Partiful charge", url: "https://help.partiful.com/hc/en-us/articles/49479024950299-What-fees-does-Partiful-charge" },
      { label: "When do I get paid", url: "https://help.partiful.com/hc/en-us/articles/49478118810523-When-do-I-get-paid" },
      { label: "Refund policy", url: "https://help.partiful.com/hc/en-us/articles/49479642989467-What-is-your-refund-policy" },
      { label: "Luma vs Partiful (fee estimate)", url: "https://help.luma.com/p/luma-vs-partiful" },
    ],
    profile: {
      bestFor: "Parties and casual social events sent to friends by text",
      discovery: "Limited",
      reservedSeating: "No",
      recurring: "No, each event is a one-off",
      questions: "Yes, an RSVP questionnaire",
      checkIn: "Yes, mobile QR check-in for ticketed events",
      embed: "No",
      messaging: "Text blasts to guests",
      payouts: "Held until after the event, then 3–7 business days",
      limits: "Unpublished fees, no individual refunds, payouts only after the event",
    },
  },
  {
    id: "posh",
    name: "Posh",
    alternativeHref: "/solutions/events/posh-alternative",
    tagline: "Nightlife and party ticketing with a 10% + $0.99 buyer fee",
    plans: [
      { id: "standard", label: "Posh", percent: 10, fixed: 0.99, processing: null, canPassToBuyer: true, defaultPass: true, isDefault: true },
    ],
    whoPays: "The buyer, by default. Posh adds 10% + $0.99 to each paid ticket and shows the all-in price, so you keep the ticket price. To absorb it you would lower your ticket price.",
    freeEvents: "No fees on free and RSVP events.",
    payouts: "Through Stripe, daily or on request once funds clear (24–48 business hours); standard bank transfers take 3–5 business days. Instant payouts cost 5%.",
    refunds: "Posh keeps its fee when you refund a single ticket or part of an order. It is refunded when the whole event is cancelled.",
    notes: [
      "Posh's help center describes the service fee but not its rate; 10% + $0.99 per paid ticket, card processing included, comes from Posh's own guides and matches independent comparisons.",
      "Instant payouts cost a flat 5%, and Posh keeps 20% of Kickback affiliate payouts.",
    ],
    sources: [
      { label: "Posh vs Luma (Posh)", url: "https://posh.vip/university/post/posh-vs-luma" },
      { label: "Eventbrite fees explained (Posh)", url: "https://posh.vip/university/post/eventbrite-fees-explained-2026" },
      { label: "Payouts and bank accounts", url: "https://support.posh.vip/en/articles/15090213-managing-your-balance-payouts-bank-accounts" },
      { label: "Ticket refunds", url: "https://support.posh.vip/en/articles/10723777-how-to-request-ticket-refunds" },
    ],
    profile: {
      bestFor: "Independent nightlife, parties, comedy and community events",
      discovery: "Yes, a consumer app and marketplace feed you opt into",
      reservedSeating: "Table service on a seating map; no seat-by-seat assigned seating found",
      recurring: "Yes, recurring series",
      questions: "Yes, checkout questions",
      checkIn: "Yes, built-in scanner and Tap to Pay door sales",
      embed: "Yes, an event iframe",
      messaging: "SMS blasts (10 per 30 days at organisation level)",
      payouts: "Stripe, daily or manual from the first sale",
      limits: "Buyer fee about 13% on a $30 ticket, fee kept on partial refunds, 5% for instant payouts",
    },
  },
  {
    id: "dice",
    name: "DICE",
    alternativeHref: "/solutions/events/dice-alternative",
    tagline: "Music and club-night ticketing with a 13% fee on top for fans",
    plans: [
      { id: "self-sign-up", label: "DICE self sign-up", percent: 13, fixed: 0, processing: null, canPassToBuyer: true, defaultPass: true, isDefault: true },
    ],
    whoPays: "The fan. On DICE's self sign-up terms the 13% service fee sits on top of your face value and is shown all-in, so you keep face value. Established venues negotiate their own fee in a private term sheet.",
    freeEvents: "No service fee on free tickets.",
    payouts: "Within 5 business days after the event, not during sales. DICE can hold up to 5% of an event's sales for 6 months against chargebacks.",
    refunds: "You are responsible for refunds, and DICE can take them from your sales or ask you to send the money within 48 hours.",
    notes: [
      "The 13% comes from DICE's US self sign-up terms, last updated 20 November 2026, and includes card processing. Negotiated partnership fees aren't published.",
      "Box office and door sales carry a 10% fee, and DICE keeps up to 5% of sales as a chargeback reserve for six months.",
    ],
    sources: [
      { label: "DICE self sign-up terms (US)", url: "https://support.dice.fm/article/764-mio-ticketing-terms-and-conditions-us" },
      { label: "DICE standard partnership terms (US)", url: "https://support.dice.fm/article/289-dice-usa-standard-ticket-partnership-terms-and-conditions" },
    ],
    profile: {
      bestFor: "Music venues, promoters, gigs and club nights",
      discovery: "Yes, the DICE fan app with personalised recommendations",
      reservedSeating: "No assigned-seating product found",
      recurring: "Not documented",
      questions: "Not documented",
      checkIn: "Yes, the DICE Access scanner",
      embed: "Yes, an event listing widget",
      messaging: "No organiser blast tool; DICE markets to fans in its app",
      payouts: "Within 5 business days after the event, less up to a 5% reserve",
      limits: "Payout after the event, 5% chargeback reserve, standard DICE event pages, listings can be refused",
    },
  },
];

export function findFeePlatform(id) {
  return FEE_PLATFORMS.find((platform) => platform.id === id) ?? null;
}

export function defaultPlan(platform) {
  return platform.plans.find((plan) => plan.isDefault) ?? platform.plans[0];
}

export const calculatorSlug = (platform) => `${platform.id}-fee-calculator`;
export const calculatorHref = (platform) => `/tools/${calculatorSlug(platform)}`;
export const CALCULATOR_HUB_HREF = "/tools/ticket-fee-calculator";
