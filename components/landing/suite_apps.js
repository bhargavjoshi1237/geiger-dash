// Every suite app in hue order, so the hero spectrum reads as one continuous band of colour.
import { PRODUCT_ICONS } from "@/lib/pricing/product-icons";

// Literal class strings so Tailwind generates them (and the --color-* vars `color` points at).
const ACCENTS = {
  rose: { color: "var(--color-rose-500)", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
  orange: { color: "var(--color-orange-500)", dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
  amber: { color: "var(--color-amber-500)", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  yellow: { color: "var(--color-yellow-500)", dot: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  emerald: { color: "var(--color-emerald-500)", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  teal: { color: "var(--color-teal-500)", dot: "bg-teal-500", text: "text-teal-600 dark:text-teal-400" },
  cyan: { color: "var(--color-cyan-500)", dot: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400" },
  sky: { color: "var(--color-sky-500)", dot: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
  blue: { color: "var(--color-blue-500)", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
  indigo: { color: "var(--color-indigo-500)", dot: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
  violet: { color: "var(--color-violet-500)", dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
  fuchsia: { color: "var(--color-fuchsia-500)", dot: "bg-fuchsia-500", text: "text-fuchsia-600 dark:text-fuchsia-400" },
  slate: { color: "var(--color-slate-400)", dot: "bg-slate-400", text: "text-slate-600 dark:text-slate-300" },
};

const app = (entry) => ({ ...entry, icon: PRODUCT_ICONS[entry.id], accent: ACCENTS[entry.hue] });

// `available: false` marks announced apps: the spectrum hatches them and shows no link.
export const SUITE_APPS = [
  app({ id: "events", name: "Events", hue: "rose", available: true, href: "/events", tagline: "Sell the tickets and run the door.", features: ["Event pages and ticketing", "QR check-in and kiosk mode", "Seat maps and venues"] }),
  app({ id: "campaign", name: "Campaign", hue: "orange", available: true, href: "/campaign", tagline: "Plan, send and track every campaign.", features: ["Email builder with A/B tests", "Journeys and automations", "Segments and lead scoring"] }),
  app({ id: "notes", name: "Notes", hue: "amber", available: true, href: "/notes", tagline: "Think out loud on an infinite canvas.", features: ["Docs, sketches and tables on one board", "Live cursors for the whole team", "A video stage inside the board"] }),
  app({ id: "docs", name: "Docs", hue: "yellow", available: false, tagline: "Send it, sign it, file it.", features: ["E-signatures", "Signing order", "Audit trail"] }),
  app({ id: "forms", name: "Forms", hue: "emerald", available: true, href: "/forms", tagline: "Build forms people actually finish.", features: ["Conditions and formulas", "Conversational mode", "Funnel and drop-off analytics"] }),
  app({ id: "office", name: "Office", hue: "teal", available: false, tagline: "Run the back office.", features: ["HR records", "Invoices", "Time and leave"] }),
  app({ id: "content", name: "Content", hue: "cyan", available: true, href: "/content", tagline: "Model, publish and personalise content.", features: ["Structured content types", "Releases and edge delivery", "Feeds that learn taste"] }),
  app({ id: "grey", name: "Grey", hue: "sky", available: true, href: "/grey", tagline: "Put your knowledge to work with AI.", features: ["Knowledge bases and ingestion", "A 3D knowledge graph", "API, MCP and embeddable widgets"] }),
  app({ id: "comms", name: "Comms", hue: "blue", available: false, tagline: "Talk to your customers.", features: ["Live chat", "Shared inbox", "Help center"] }),
  app({ id: "flow", name: "Flow", hue: "indigo", available: true, href: "/flow", tagline: "Plan the work, then ship it.", features: ["Issues, cycles and triage", "Boards, milestones and goals", "Team chat with calls"] }),
  app({ id: "assets", name: "Assets", hue: "violet", available: true, href: "/assets", tagline: "Organise, approve and deliver media.", features: ["Versioned media library", "Approvals and expiring share links", "Galleries and a storefront"] }),
  app({ id: "pods", name: "Pods", hue: "fuchsia", available: true, href: "/pods", tagline: "Put a gateway in front of every API.", features: ["Routes, keys and usage plans", "WAF and custom domains", "Developer portals with SDKs"] }),
  app({ id: "property", name: "Property", hue: "slate", available: true, href: "/property", tagline: "Manage rentals from listing to renewal.", features: ["Listings, leases and renewals", "Work orders and inspections", "Accounting and owner portals"] }),
];

export const SUITE_APP_BY_ID = Object.fromEntries(SUITE_APPS.map((entry) => [entry.id, entry]));

export const LIVE_APP_COUNT = SUITE_APPS.filter((entry) => entry.available).length;
export const UPCOMING_APP_COUNT = SUITE_APPS.length - LIVE_APP_COUNT;

// The full spectrum as a CSS gradient, for surfaces that echo the hero band (e.g. the closing mark).
export const SPECTRUM_GRADIENT = `linear-gradient(100deg, ${SUITE_APPS.map((entry) => entry.accent.color).join(", ")})`;
