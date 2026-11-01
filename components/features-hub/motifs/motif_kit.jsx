import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { seededRandom } from "@/components/features-hub/random";
import pageStyles from "@/components/product-pages/product_pages.module.css";

// A QR-looking module grid with the three finder squares, drawn the same for a given seed.
export function QrGlyph({ seed = "qr", size = 21, className = "" }) {
  const random = seededRandom(seed);
  const finder = (row, col) => {
    // Each finder keeps a one-module blank separator, so the three corners read clearly and the code sits the right way up.
    for (const [r, c] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
      if (row >= r - 1 && row <= r + 7 && col >= c - 1 && col <= c + 7) {
        const ring = Math.max(Math.abs(row - (r + 3)), Math.abs(col - (c + 3)));
        return ring <= 3 && ring !== 2;
      }
    }
    // Timing patterns: alternating modules along row and column 6 between the finders.
    if (row === 6 || col === 6) return (row + col) % 2 === 0;
    return null;
  };
  const cells = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const fixed = finder(row, col);
      if (fixed ?? random() > 0.52) cells.push(`M${col} ${row}h1v1h-1z`);
    }
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      <path d={cells.join("")} fill="currentColor" />
    </svg>
  );
}

// Every card draws at one design size and scales to its width in pure CSS, top-anchored so it can run off the bottom like an area-page stage.
export const MOTIF_W = 480;
export const MOTIF_H = 330;

export function Fit({ width = MOTIF_W, height = MOTIF_H, max = 1.15, className, children }) {
  return (
    <div className={pageStyles.fit}>
      <div className={pageStyles.fitSizer} style={{ "--w": `${width}px`, "--h": `${height}px`, "--max": max }}>
        <div className={cn(pageStyles.fitInner, "text-[13px] text-foreground", className)}>{children}</div>
      </div>
    </div>
  );
}

// A pointer that glides to `at` ([x, y] in design pixels) and dips while `down`, for scenes that show a click or a drag.
export function Cursor({ at = [0, 0], down = false, hidden = false }) {
  return (
    <MousePointer2
      className="pointer-events-none absolute top-0 left-0 z-30 size-[18px] fill-foreground text-background drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)]"
      strokeWidth={1.5}
      style={{
        translate: `${at[0]}px ${at[1]}px`,
        scale: down ? 0.8 : 1,
        opacity: hidden ? 0 : 1,
        transition: "translate 0.7s cubic-bezier(0.65, 0, 0.35, 1), scale 0.15s ease-out, opacity 0.3s ease-out",
      }}
    />
  );
}

// Fades something in place when its moment comes; it keeps its space, so nothing else jumps.
export function Show({ when, className, children }) {
  return <div className={cn("transition-[opacity,translate,scale] duration-500 ease-out", when ? "" : "pointer-events-none translate-y-1.5 scale-[0.98] opacity-0", className)}>{children}</div>;
}

// Opens a row into a list, pushing the rows under it down.
export function Expand({ when, className, children }) {
  return (
    <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out", when ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0", className)}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
