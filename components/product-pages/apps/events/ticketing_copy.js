// Plain copy for /apps/events/ticketing, so the page text, its JSON-LD and the FAQ share one source.
// Every line was checked against geiger-events on 2026-11-16. Features that only save settings are named only as "not yet"; re-check before widening.

export const CHECKED = "16 November 2026";

export const SUMMARY =
  "Geiger Events is event ticketing software for organisers who sell their own tickets. You publish an event page and sell general admission, reserved seats on a seat map you draw, time slots, add-ons, VIP packages and exhibitor booths from it. Buyers pay on Stripe Checkout, the money goes straight to your own Stripe account, and Geiger adds no fee per ticket.";

export const FACTS = [
  { label: "Fee per ticket", value: "None from Geiger", detail: "You pay only Stripe's processing fee." },
  { label: "Where ticket money goes", value: "Your own Stripe account", detail: "Each sale is charged directly on it." },
  { label: "Price", value: "From $29 a month", detail: "Events is one of the main apps on every plan." },
  { label: "Free trial", value: "15 days", detail: "On the Basic plan, with no card needed." },
];

export const EVENT_TYPES = [
  {
    title: "Theatres and concert halls",
    body: "Sell reserved seats on a map of your auditorium, mark wheelchair, companion, obstructed-view and house seats, and price each section by ticket.",
  },
  {
    title: "Arenas and stadiums",
    body: "Generate an oval stadium or a rectangular arena in tiers, drag sections to match the venue, import the seat manifest from a CSV and sell standing areas as general admission.",
  },
  {
    title: "Galas, dinners and fundraisers",
    body: "Lay out banquet tables and sell the seats around them, offer VIP packages on their own page and let guests add a donation to your cause at checkout.",
  },
  {
    title: "Conferences and summits",
    body: "Sell passes in tiers, add workshops as add-ons, give a group one order with a ticket for each attendee, and unlock speaker or student passes with an access code.",
  },
  {
    title: "Expos and trade shows",
    body: "Sell exhibitor booths from a hall plan, publish a sponsorship page that lists open spots and takes enquiries, and sell visitor tickets for the same event.",
  },
  {
    title: "Classes, tours and workshops",
    body: "Offer time slots, each with its own capacity and, if you like, its own price, so every session stops selling when it is full.",
  },
  {
    title: "Festivals and club nights",
    body: "Release tickets in waves, end early-bird prices on a date, sell parking or camping as add-ons and track promoters with affiliate links.",
  },
  {
    title: "Free and invite-only events",
    body: "Take free registrations with no payment step, approve guests before they get a place, and set a capacity with an overbook buffer for no-shows.",
  },
];

// Grouped [feature, what it does] rows; a feature can be { label, href } when another page covers it.
export const FEATURES = [
  {
    title: "Tickets and pricing",
    rows: [
      ["Ticket types and tiers", "As many tickets per event as you need, each with its own price and quantity, grouped under named tiers."],
      ["Price steps", "Sell each price as its own ticket with its own quantity, so buyers move to the next price when one sells out."],
      ["Release waves", "Split a ticket's stock into waves that open now, on a date, after the previous wave sells out or when you release them."],
      ["Early-bird prices", "A lower price inside a time window you set, such as until a month before the event."],
      ["Discount codes", "Codes with a base discount, a usage limit, the dates they work and rules that change the discount by quantity or date."],
      ["Group discounts", "A percentage off once an order reaches the group size you set."],
      ["Bundles", "Several tickets sold together at a fixed price, or at the sum of the tickets inside."],
      ["Access-code tickets", "Hidden tickets that appear only when a buyer enters the code, such as a student or speaker pass."],
      ["Time slots", "Buyers choose a slot with its own capacity and an optional price change."],
      ["Add-ons", "Workshops, meals, parking or merchandise charged as their own lines, shown only for the tickets, slots or quantities you choose."],
      ["Donations", "A suggested or custom donation to a cause you name, added at checkout."],
      ["Capacity and overbooking", "An event capacity plus an optional buffer for no-shows, checked as each order is placed."],
      ["Affiliate links", "With the Affiliates add-on, each promoter gets a link, and the orders and commission it brings in are credited to them."],
    ],
  },
  {
    title: "Seating, booths and packages",
    rows: [
      ["Seat-map editor", "Build each section from rows, seats per row, curve and aisles, or generate a theatre horseshoe, oval stadium, rectangular arena or banquet tables in one step."],
      ["Seat manifest import", "Paste a CSV of section, row and seat to use your venue's real labels."],
      ["Standing areas", "General admission zones with their own capacity on the same map."],
      ["Accessible and house seats", "Mark wheelchair, companion, obstructed-view and house seats; buyers can show only accessible seats."],
      ["Choosing seats", "Buyers pick seats on the map or from a list sorted by best seats, lowest price or section."],
      ["Section pricing", "Link each section to a ticket, so its seats sell at that ticket's price."],
      ["Seat holds", "Chosen seats are held while the buyer pays, 10 minutes by default, and a refunded order puts its seats back on sale."],
      ["Exhibitor booths", "Exhibitors pick and pay for a stand on your hall plan; it is held for 15 minutes by default and can't be sold twice."],
      ["Sponsorship page", "A public page that lists your open sponsorship spots and takes enquiries through your own form."],
      ["VIP packages", "A separate packages page where buyers book a package through checkout or send an enquiry."],
    ],
  },
  {
    title: "Checkout and payments",
    rows: [
      ["Stripe Checkout", "Buyers pay on Stripe's hosted checkout page, styled in your event's colours."],
      ["Your own Stripe account", "Connect your Stripe account once; ticket sales are charged directly on it and Geiger takes no fee."],
      ["Express Lane", "Two-click checkout for a single ticket: pick it, then pay on Stripe."],
      ["Purchase terms", "Buyers tick your terms before paying, and the time they agreed is saved with the Stripe payment."],
      ["Questions at checkout", "Ask your own questions plus dietary and accessibility needs, and read the answers for each registrant."],
      ["Group orders", "One payment, with a separate ticket and portal for each attendee."],
      ["Free tickets", "Free tickets and RSVPs complete without a payment step."],
      ["Approval before payment", "Guests request a place and can only buy once you approve them."],
      ["One currency per event", "Each event charges in the currency you set for it."],
    ],
  },
  {
    title: "After the sale",
    rows: [
      ["Orders", "Every order across your events, with its items, status, total, card and Stripe receipt."],
      ["Event overview", "Tickets sold, revenue, sell-through and days to go, counted from real orders."],
      ["Buyer portal", "Each buyer gets an account with their tickets, QR codes, calendar files and receipts."],
      ["Refunds and cancellations", "Mark an order refunded or cancelled to free its seats and update revenue, then return the money from your Stripe dashboard. Buyers can request a refund from their portal."],
      ["Disputes", "Log a dispute with its status and evidence deadline."],
      [{ label: "At the door", href: "/apps/events/check-in" }, "Scan QR tickets, sell at the door and run a self check-in kiosk."],
      ["AI assistants", "Connect Claude or another MCP client to list events, orders and registrations, create and publish events, and approve or decline registrations."],
    ],
  },
];

// Stripe's standard US card rate, checked on stripe.com/pricing in November 2026: 2.9% + 30¢ of $25 is $1.03.
export const FEE_EXAMPLE = [
  ["Ticket price", "$25.00"],
  ["Geiger fee per ticket", "$0.00"],
  ["Stripe processing, 2.9% + 30¢", "−$1.03"],
  ["You receive", "$23.97"],
];

export const FEE_NOTE =
  "Stripe's standard rate for US cards, checked in November 2026. International cards and currency conversion cost more, and rates differ by country.";

// Mirrors /pricing; change both together.
export const PLANS = [
  { label: "Basic", value: "$29 a month", detail: "1 main app such as Events, 1 tool, 1 project and 5 people." },
  { label: "Plus", value: "$79 a month", detail: "2 main apps, 2 tools, 3 projects and 12 people." },
  { label: "Pro", value: "$119 a month", detail: "3 main apps, 4 tools, 10 projects and 25 people." },
];

export const PLANS_NOTE = `Yearly billing gives 2 months free. Plan prices as listed on /pricing on ${CHECKED}.`;

export const FAQ = [
  {
    question: "Does Geiger Events charge a fee per ticket?",
    answer:
      "No. Geiger Events adds no platform fee to tickets. Ticket money is charged on your own Stripe account and you pay only Stripe's processing fee, 2.9% + 30¢ for a standard US card, so you keep $23.97 of a $25 ticket.",
  },
  {
    question: "Can I sell reserved seats with my own seating chart?",
    answer:
      "Yes. Draw each section from rows, seats per row, curve and aisles, or generate a theatre, stadium, arena or banquet layout, then import your real row and seat labels from a CSV. Buyers pick their seats on the map and the seats are held while they pay.",
  },
  {
    question: "Can I sell seats at tables for a gala or banquet?",
    answer:
      "Yes. The banquet layout places tables in a grid with the number of seats per table you choose, and guests pick their seats at checkout. You can also sell VIP packages on their own page and take donations at checkout.",
  },
  {
    question: "Can ticket prices go up as an event sells?",
    answer:
      "Yes, in steps you set. Sell each price as its own ticket with its own quantity so buyers move to the next price when one sells out, and end early-bird prices on a date. Geiger Events doesn't change prices automatically based on demand.",
  },
  {
    question: "Can I sell exhibitor booths and sponsorships?",
    answer:
      "Yes. Exhibitors pick and pay for a stand on your hall plan, and a public sponsorship page lists your open spots and takes enquiries through your own form.",
  },
  {
    question: "Can I run free or invite-only events?",
    answer:
      "Yes. Free tickets complete without a payment step. For invite-only events, guests request a place and can only buy once you approve them.",
  },
  {
    question: "Do buyers need an account to buy tickets?",
    answer:
      "No. Buyers check out without signing up first. Each buyer then gets a portal account with their tickets, QR codes, calendar files and receipts.",
  },
  {
    question: "Can I sell tickets at the door?",
    answer:
      "Yes. Staff open a door sales screen with a staff code and record cash, card or complimentary sales as orders. Card payments at the door are taken on your own card reader, not inside Geiger Events.",
  },
  {
    question: "How do refunds work?",
    answer:
      "Mark an order refunded or cancelled in Geiger Events to put its seats back on sale and take it out of your revenue, then return the money from your Stripe dashboard. Buyers can also request a refund from their portal.",
  },
  {
    question: "Can I manage events from an AI assistant?",
    answer:
      "Yes. Geiger Events has an MCP server, so once you sign in and allow access, Claude or another MCP client can list your events, orders and registrations, create, update and publish events, and approve or decline registrations.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "During early access, the $0 alpha tester plan includes every Geiger app, Events among them, within its limits. Paid plans start at $29 a month, and Basic has a 15-day free trial with no card needed.",
  },
  {
    question: "What doesn't Geiger Events ticketing do yet?",
    answer:
      "It doesn't yet offer automatic demand-based pricing, payment plans, ticket transfers or resale, Apple Wallet or Google Wallet passes, sales tax or VAT, or an embeddable checkout widget. Tickets and their QR codes are in each buyer's portal.",
  },
];
