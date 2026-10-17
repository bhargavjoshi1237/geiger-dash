// Landing-page catalog: every suite app in hue order (so the hero reads as a spectrum), with copy drawn from each product's own repo.
import { PRODUCT_ICONS } from "@/lib/pricing/product-icons";

// Whole class strings per accent so Tailwind can see them.
const ACCENTS = {
  rose: { text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500", soft: "bg-rose-500/10", border: "border-rose-500/40", glow: "from-rose-500/35", ring: "ring-rose-500/30" },
  orange: { text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500", soft: "bg-orange-500/10", border: "border-orange-500/40", glow: "from-orange-500/35", ring: "ring-orange-500/30" },
  amber: { text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", soft: "bg-amber-500/10", border: "border-amber-500/40", glow: "from-amber-500/35", ring: "ring-amber-500/30" },
  yellow: { text: "text-yellow-600 dark:text-yellow-400", dot: "bg-yellow-500", soft: "bg-yellow-500/10", border: "border-yellow-500/40", glow: "from-yellow-500/35", ring: "ring-yellow-500/30" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", soft: "bg-emerald-500/10", border: "border-emerald-500/40", glow: "from-emerald-500/35", ring: "ring-emerald-500/30" },
  teal: { text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500", soft: "bg-teal-500/10", border: "border-teal-500/40", glow: "from-teal-500/35", ring: "ring-teal-500/30" },
  cyan: { text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500", soft: "bg-cyan-500/10", border: "border-cyan-500/40", glow: "from-cyan-500/35", ring: "ring-cyan-500/30" },
  sky: { text: "text-sky-600 dark:text-sky-400", dot: "bg-sky-500", soft: "bg-sky-500/10", border: "border-sky-500/40", glow: "from-sky-500/35", ring: "ring-sky-500/30" },
  blue: { text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", soft: "bg-blue-500/10", border: "border-blue-500/40", glow: "from-blue-500/35", ring: "ring-blue-500/30" },
  indigo: { text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500", soft: "bg-indigo-500/10", border: "border-indigo-500/40", glow: "from-indigo-500/35", ring: "ring-indigo-500/30" },
  violet: { text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500", soft: "bg-violet-500/10", border: "border-violet-500/40", glow: "from-violet-500/35", ring: "ring-violet-500/30" },
  fuchsia: { text: "text-fuchsia-600 dark:text-fuchsia-400", dot: "bg-fuchsia-500", soft: "bg-fuchsia-500/10", border: "border-fuchsia-500/40", glow: "from-fuchsia-500/35", ring: "ring-fuchsia-500/30" },
  slate: { text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400", soft: "bg-slate-400/10", border: "border-slate-400/40", glow: "from-slate-400/35", ring: "ring-slate-400/30" },
};

const app = (entry) => ({ ...entry, icon: PRODUCT_ICONS[entry.id], accent: ACCENTS[entry.hue] });

// `available: false` marks apps that are announced but not shipped; the hero hatches them instead of linking.
export const SUITE_APPS = [
  app({
    id: "events",
    name: "Events",
    hue: "rose",
    tagline: "Sell the tickets and run the door.",
    features: ["Event pages and ticketing", "QR check-in and kiosk mode", "Seat maps and venues"],
    href: "/events",
    available: true,
  }),
  app({
    id: "campaign",
    name: "Campaign",
    hue: "orange",
    tagline: "Plan, send and track every campaign.",
    features: ["Email builder with A/B tests", "Journeys and automations", "Segments and lead scoring"],
    href: "/campaign",
    available: true,
  }),
  app({
    id: "notes",
    name: "Notes",
    hue: "amber",
    tagline: "Think out loud on an infinite canvas.",
    features: ["Docs, sketches and tables on one board", "Live cursors for the whole team", "A video stage inside the board"],
    href: "/notes",
    available: true,
  }),
  app({
    id: "docs",
    name: "Docs",
    hue: "yellow",
    tagline: "Send it, sign it, file it.",
    features: ["E-signatures", "Signing order", "Audit trail"],
    available: false,
  }),
  app({
    id: "forms",
    name: "Forms",
    hue: "emerald",
    tagline: "Build forms people actually finish.",
    features: ["Conditions and formulas", "Conversational mode", "Funnel and drop-off analytics"],
    href: "/forms",
    available: true,
  }),
  app({
    id: "office",
    name: "Office",
    hue: "teal",
    tagline: "Run the back office.",
    features: ["HR records", "Invoices", "Time and leave"],
    available: false,
  }),
  app({
    id: "content",
    name: "Content",
    hue: "cyan",
    tagline: "Model, publish and personalise content.",
    features: ["Structured content types", "Releases and edge delivery", "Feeds that learn taste"],
    href: "/content",
    available: true,
  }),
  app({
    id: "grey",
    name: "Grey",
    hue: "sky",
    tagline: "Put your knowledge to work with AI.",
    features: ["Knowledge bases and ingestion", "A 3D knowledge graph", "API, MCP and embeddable widgets"],
    href: "/grey",
    available: true,
  }),
  app({
    id: "comms",
    name: "Comms",
    hue: "blue",
    tagline: "Talk to your customers.",
    features: ["Live chat", "Shared inbox", "Help center"],
    available: false,
  }),
  app({
    id: "flow",
    name: "Flow",
    hue: "indigo",
    tagline: "Plan the work, then ship it.",
    features: ["Issues, cycles and triage", "Boards, milestones and goals", "Team chat with calls"],
    href: "/flow",
    available: true,
  }),
  app({
    id: "assets",
    name: "Assets",
    hue: "violet",
    tagline: "Organise, approve and deliver media.",
    features: ["Versioned media library", "Approvals and expiring share links", "Galleries and a storefront"],
    href: "/assets",
    available: true,
  }),
  app({
    id: "pods",
    name: "Pods",
    hue: "fuchsia",
    tagline: "Put a gateway in front of every API.",
    features: ["Routes, keys and usage plans", "WAF and custom domains", "Developer portals with SDKs"],
    href: "/pods",
    available: true,
  }),
  app({
    id: "property",
    name: "Property",
    hue: "slate",
    tagline: "Manage rentals from listing to renewal.",
    features: ["Listings, leases and renewals", "Work orders and inspections", "Accounting and owner portals"],
    href: "/property",
    available: true,
  }),
];

export const SUITE_APP_BY_ID = Object.fromEntries(SUITE_APPS.map((entry) => [entry.id, entry]));

export const AVAILABLE_APP_COUNT = SUITE_APPS.filter((entry) => entry.available).length;
