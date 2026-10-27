// The film's arena: two tiers of twelve sections around a ring, 12 rows × 14 seats each, as a bowl generator lays it
// out (sections numbered by tier, 101… then 201…, clockwise from the top left). Units are px on a 900 × 560 canvas.

export const CANVAS = { width: 900, height: 560 };
export const CENTER = { x: 450, y: 280 };
export const RING = 150;
export const ROWS = 12;
export const SEATS = 14;

const TIERS = [
  { inner: { x: 130, y: 100 }, depth: 58, gap: 8 },
  { inner: { x: 210, y: 180 }, depth: 64, gap: 10 },
];

// Price bands, most expensive first, in the buyer map's band colours (rose, amber, violet, sky).
export const BANDS = {
  ringside: { name: "Ringside", price: 480, color: "#fb7185" },
  front: { name: "Lower bowl front", price: 250, color: "#fbbf24" },
  lower: { name: "Lower bowl", price: 165, color: "#a78bfa" },
  upper: { name: "Upper tier", price: 95, color: "#38bdf8" },
};

function bandFor(tier, side) {
  const long = side === "top" || side === "bottom";
  if (tier === 0) return long ? "ringside" : "front";
  return long ? "lower" : "upper";
}

// Each section: its box, the side it faces the ring from, its band, and its seats (row, number, x, y).
export const SECTIONS = TIERS.flatMap((tier, tierIndex) => {
  const { inner, depth, gap } = tier;
  const sides = [
    { side: "top", along: "x", span: inner.x, fixed: -inner.y - depth, reverse: false },
    { side: "right", along: "y", span: inner.y, fixed: inner.x, reverse: false },
    { side: "bottom", along: "x", span: inner.x, fixed: inner.y, reverse: true },
    { side: "left", along: "y", span: inner.y, fixed: -inner.x - depth, reverse: true },
  ];
  let number = 0;
  return sides.flatMap(({ side, along, span, fixed, reverse }) => {
    const length = (span * 2 - gap * 2) / 3;
    return [0, 1, 2].map((slot) => {
      const position = reverse ? 2 - slot : slot;
      const start = -span + position * (length + gap);
      number += 1;
      const box = along === "x" ? { x: CENTER.x + start, y: CENTER.y + fixed, width: length, height: depth } : { x: CENTER.x + fixed, y: CENTER.y + start, width: depth, height: length };
      const band = bandFor(tierIndex, side);
      // Row A sits nearest the ring; seats run across the section.
      const seats = [];
      for (let row = 0; row < ROWS; row++) {
        for (let seat = 0; seat < SEATS; seat++) {
          const radial = (row + 0.5) / ROWS;
          const across = (seat + 0.5) / SEATS;
          const toward = { top: [across, 1 - radial], bottom: [1 - across, radial], right: [radial, across], left: [1 - radial, 1 - across] }[side];
          seats.push({ row: String.fromCharCode(65 + row), number: seat + 1, x: box.x + toward[0] * box.width, y: box.y + toward[1] * box.height });
        }
      }
      return { name: String((tierIndex + 1) * 100 + number), tier: tierIndex, side, band, ...box, seats };
    });
  });
});

export const SECTION_BY_NAME = Object.fromEntries(SECTIONS.map((section) => [section.name, section]));

export const SEAT_COUNT = SECTIONS.length * ROWS * SEATS;

// A fixed scatter of seats already sold, so the buyer's map reads as a live on-sale.
export function isSold(section, seat, index) {
  let hash = (Number(section.name) * 7919 + index * 104729) % 1000;
  hash = (hash * 2654435761) % 1000;
  const rate = { ringside: 0.78, front: 0.55, lower: 0.5, upper: 0.38 }[section.band];
  return hash / 1000 < rate && !(section.name === "104" && seat.row === "C");
}
