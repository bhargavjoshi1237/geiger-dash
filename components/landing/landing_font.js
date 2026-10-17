import { Anybody } from "next/font/google";

// Landing display face: Anybody's italic + width axis lets headlines lean like the strokes of the Geiger mark.
export const landingFont = Anybody({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-landing",
  display: "swap",
});

// Condensed, heavy, leaning headline treatment shared by every landing heading.
export const DISPLAY = "[font-family:var(--font-landing)] italic font-extrabold [font-stretch:68%] tracking-[-0.01em]";
