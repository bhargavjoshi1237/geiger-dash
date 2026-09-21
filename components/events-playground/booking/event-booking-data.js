// The event behind the landing booking demo. Mirrors the Summer Product Launch
// record in the playground's sample data so the marketing page and the
// workspace embed describe the same event.
export const DEMO_EVENT = {
  name: "Summer Product Launch",
  slug: "summer-product-launch",
  status: "On sale",
  month: "June 2026",
  day: "18",
  weekday: "Thursday",
  dateLabel: "Thu 18 June",
  doors: "Doors 18:00",
  timeLabel: "18:00 – 22:00 BST",
  venue: "The Glasshouse",
  address: "61 Southwark Street, London SE1",
  host: "Ava Mitchell",
  hostRole: "Head of Product, Northwind",
  summary:
    "The year's release, shown properly. Doors at six, the keynote at quarter to seven, terrace until close.",
  agenda: [
    { time: "18:00", title: "Doors and welcome drinks" },
    { time: "18:45", title: "Keynote" },
    { time: "19:30", title: "Live demos" },
    { time: "20:15", title: "Terrace" },
  ],
  capacity: 400,
  sold: 312,
};

export const TICKET_TIERS = [
  {
    id: "general",
    name: "General admission",
    price: 28,
    perk: "Standing, doors at six",
    remaining: 64,
    zone: null,
  },
  {
    id: "priority",
    name: "Priority",
    price: 45,
    perk: "Reserved seat, early entry",
    remaining: 18,
    zone: "priority",
  },
  {
    id: "vip",
    name: "VIP table",
    price: 120,
    perk: "Front table, drinks included",
    remaining: 4,
    zone: "vip",
  },
  {
    id: "livestream",
    name: "Livestream",
    price: 12,
    perk: "Online, replay for a month",
    remaining: null,
    zone: null,
  },
];

// Front-to-back seating. Only the reserved tiers map to a zone; general
// admission is standing and the livestream has no seat at all.
export const SEAT_ROWS = [
  { id: "A", zone: "vip", seats: 8 },
  { id: "B", zone: "vip", seats: 10 },
  { id: "C", zone: "priority", seats: 12 },
  { id: "D", zone: "priority", seats: 12 },
  { id: "E", zone: "priority", seats: 14 },
];

export const ZONE_LABELS = {
  vip: "VIP tables",
  priority: "Priority seating",
};

// Fixed so the same seats read as sold on the server and the client.
export function isSeatTaken(rowIndex, seatIndex) {
  return (rowIndex * 5 + seatIndex * 3 + rowIndex * seatIndex) % 7 === 0;
}

export const SERVICE_FEE_RATE = 0.06;

export const currency = (value) =>
  value.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
