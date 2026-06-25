// Shared design tokens for every Geiger email template.
//
// Emails render in a huge range of clients, so we stick to inline styles and a
// small, safe palette. Keep this in sync with the suite's brand, but remember
// dark-mode email support is unreliable — these are light-surface values.

export const theme = {
  color: {
    background: "#f4f4f5", // page canvas behind the card
    card: "#ffffff",
    border: "#e4e4e7",
    heading: "#18181b",
    text: "#3f3f46",
    muted: "#71717a",
    subtle: "#a1a1aa",
    brand: "#18181b",
    accent: "#4f46e5",
    accentSoft: "#eef2ff",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
    panel: "#fafafa",
  },
  font: {
    // Match the app, which loads Geist / Geist Mono via next/font. Email clients
    // that don't support web fonts (e.g. Gmail) fall back down the stack.
    sans: 'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  radius: "12px",
  width: "560px",
};

// Google Fonts stylesheet for Geist — drop into an email <Head> so clients that
// honour web fonts render the brand typeface (others use the fallback stack).
export const GEIST_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap";

// Public base URL of the dashboard, used for logo/footer links in emails.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://geiger.studio";
