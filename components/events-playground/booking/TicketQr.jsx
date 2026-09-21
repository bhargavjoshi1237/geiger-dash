"use client";

import { Logo } from "@geiger/ui";
import { cn } from "@/lib/utils";

// A 25×25 grid is a real QR's version-2 size, so the finders, timing tracks and
// alignment square land where a scanner would expect them. The payload modules
// are decorative, not encoded — this is a picture of a ticket, not a live code.
const MODULES = 25;
const QUIET = 2;
const ALIGN = 16;
// Cleared for the logo. Seven modules is ~28% of the code, the usual ceiling for
// a branded QR before error correction can't recover the covered area.
const CLEAR_FROM = 9;
const CLEAR_TO = 15;

// Integer-only hash so the server and client produce identical modules.
function noise(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >> 13)) | 0;
  h = Math.imul(h, 1274126177) | 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function buildMatrix() {
  const dark = Array.from({ length: MODULES }, () => Array(MODULES).fill(false));
  const fixed = Array.from({ length: MODULES }, () => Array(MODULES).fill(false));

  // Finder: a 7×7 ring with a 3×3 core, plus the blank separator around it.
  const finder = (ox, oy) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const gx = ox + x;
        const gy = oy + y;
        if (gx < 0 || gy < 0 || gx >= MODULES || gy >= MODULES) continue;
        fixed[gy][gx] = true;
        const inside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
        const ring = inside && (x === 0 || x === 6 || y === 0 || y === 6);
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        dark[gy][gx] = ring || core;
      }
    }
  };

  finder(0, 0);
  finder(MODULES - 7, 0);
  finder(0, MODULES - 7);

  // Alignment square, bottom-right.
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      fixed[ALIGN + y][ALIGN + x] = true;
      dark[ALIGN + y][ALIGN + x] =
        x === 0 || x === 4 || y === 0 || y === 4 || (x === 2 && y === 2);
    }
  }

  // Timing tracks: alternating modules joining the finders.
  for (let i = 8; i < MODULES - 8; i += 1) {
    if (!fixed[6][i]) {
      fixed[6][i] = true;
      dark[6][i] = i % 2 === 0;
    }
    if (!fixed[i][6]) {
      fixed[i][6] = true;
      dark[i][6] = i % 2 === 0;
    }
  }

  for (let y = 0; y < MODULES; y += 1) {
    for (let x = 0; x < MODULES; x += 1) {
      if (fixed[y][x]) continue;
      const cleared =
        x >= CLEAR_FROM && x <= CLEAR_TO && y >= CLEAR_FROM && y <= CLEAR_TO;
      dark[y][x] = cleared ? false : noise(x, y) > 0.48;
    }
  }

  return dark;
}

// One path beats 300 rects, and the matrix never changes, so build it once.
const QR_PATH = buildMatrix()
  .flatMap((row, y) =>
    row.map((on, x) => (on ? `M${x + QUIET} ${y + QUIET}h1v1h-1z` : "")),
  )
  .join("");

const SPAN = MODULES + QUIET * 2;

export default function TicketQr({ className, size = 68 }) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${SPAN} ${SPAN}`}
        className="h-full w-full rounded-sm"
        role="img"
        aria-label="Ticket QR code"
      >
        <rect width={SPAN} height={SPAN} rx="1.5" className="fill-white" />
        <path d={QR_PATH} className="fill-black" shapeRendering="crispEdges" />
      </svg>

      <span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2px] bg-white"
        style={{ width: size * 0.3, height: size * 0.3 }}
      >
        <Logo size={size * 0.22} className="text-black" />
      </span>
    </div>
  );
}
