import { seededRandom } from "@/components/features-hub/random";

// A QR-looking module grid with the three finder squares, drawn the same for a given seed.
export function QrGlyph({ seed = "qr", size = 21, className = "" }) {
  const random = seededRandom(seed);
  const finder = (row, col) => {
    const inBox = (r, c) => row >= r && row < r + 7 && col >= c && col < c + 7;
    const ring = (r, c) => Math.max(Math.abs(row - (r + 3)), Math.abs(col - (c + 3)));
    for (const [r, c] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
      if (inBox(r, c)) return ring(r, c) !== 2;
    }
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

// Placeholder text lines, the "copy" inside illustrated UI.
export function Lines({ widths = ["80%", "56%"], className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {widths.map((width, index) => (
        <span key={index} className="block h-1.5 rounded-full bg-foreground/10" style={{ width }} />
      ))}
    </div>
  );
}
