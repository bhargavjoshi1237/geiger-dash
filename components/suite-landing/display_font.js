import { Archivo } from "next/font/google";

// Landing-only headline face; the width axis lets headings run slightly expanded like instrument lettering.
export const displayFont = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});
