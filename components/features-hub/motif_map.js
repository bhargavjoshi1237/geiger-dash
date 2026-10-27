// Picks the animated illustration ("motif") each feature card plays: known slugs map by hand,
// new Studio pages fall back to keyword rules, then to a stable hash so every page gets one.
import { hashString } from "@/components/features-hub/random";

// Every motif and the variant it plays when a page only matches by hash.
const DEFAULT_VARIANTS = {
  chart: "analytics",
  cipher: "shield",
  marquee: "api",
  cards: "ticket",
  seats: "theatre",
  scan: "checkin",
  pulse: "nfc",
  timeline: "agenda",
  nodes: "automation",
  messages: "campaign",
  builder: "page",
  people: "crm",
  board: "papers",
  live: "stream",
};

const MOTIF_KEYS = Object.keys(DEFAULT_VARIANTS);

const SLUG_MOTIFS = {
  "event-ticketing-payments": ["cards", "ticket"],
  "wallet-passes": ["cards", "pass"],
  memberships: ["cards", "membership"],
  "certificates-ceu": ["cards", "certificate"],
  "event-templates": ["cards", "template"],
  "dynamic-ticket-pricing": ["chart", "pricing"],
  "event-analytics": ["chart", "analytics"],
  "anti-scalping-resale": ["cipher", "shield"],
  "discount-codes-promo": ["cipher", "code"],
  "api-webhooks": ["marquee", "api"],
  "reserved-seating": ["seats", "theatre"],
  "event-floor-plans-seating": ["seats", "floor"],
  "venue-management": ["seats", "tables"],
  "event-check-in-app": ["scan", "checkin"],
  "badge-printing": ["scan", "badge"],
  "lead-retrieval": ["scan", "lead"],
  "rfid-nfc-access": ["pulse", "nfc"],
  "conference-agenda-speakers": ["timeline", "agenda"],
  "event-series-recurring": ["timeline", "series"],
  "event-automation": ["nodes", "automation"],
  "event-email-sms-marketing": ["messages", "campaign"],
  "event-community-engagement": ["messages", "community"],
  "event-page-builder": ["builder", "page"],
  "custom-domains-branding": ["builder", "domain"],
  "organizer-event-page": ["builder", "storefront"],
  "attendee-crm": ["people", "crm"],
  "event-registration-rsvp": ["people", "rsvp"],
  "organizer-profiles-followers": ["people", "followers"],
  "venue-sourcing": ["board", "venues"],
  "call-for-papers": ["board", "papers"],
  "sponsors-exhibitors": ["board", "sponsors"],
  "livestream-webinar-rooms": ["live", "stream"],
};

// First match wins, so the narrower rules sit above the broad ones.
const KEYWORD_MOTIFS = [
  [/coupon|discount|promo|voucher/, "cipher", "code"],
  [/secur|fraud|scalp|permission|encrypt|privacy|complian|audit|sso/, "cipher", "shield"],
  [/analytic|report|insight|metric|dashboard|pricing|revenue|forecast|chart/, "chart", "analytics"],
  [/\bapi\b|webhook|integrat|sync|connect|import|export|plugin/, "marquee", "api"],
  [/certif|credential|diploma/, "cards", "certificate"],
  [/template|duplicate|clone|preset/, "cards", "template"],
  [/member|subscription|loyalty/, "cards", "membership"],
  [/wallet|pass\b/, "cards", "pass"],
  [/ticket|payment|checkout|invoice|billing|order/, "cards", "ticket"],
  [/seat|floor|venue|room|layout|\bmap/, "seats", "theatre"],
  [/nfc|rfid|tap|access|door|wristband/, "pulse", "nfc"],
  [/badge|print/, "scan", "badge"],
  [/scan|check-?in|\bqr\b|lead/, "scan", "checkin"],
  [/series|recurr|repeat|weekly/, "timeline", "series"],
  [/agenda|schedul|calendar|session|timeline|cycle|roadmap|speaker/, "timeline", "agenda"],
  [/automat|workflow|trigger|rule|journey|pipeline/, "nodes", "automation"],
  [/communit|forum|chat|comment|engag/, "messages", "community"],
  [/email|sms|message|notif|inbox|campaign|newsletter/, "messages", "campaign"],
  [/domain|brand|white-?label/, "builder", "domain"],
  [/storefront|organi[sz]er|profile page|portal/, "builder", "storefront"],
  [/page|builder|design|theme|site|editor/, "builder", "page"],
  [/follower|audience|fan/, "people", "followers"],
  [/rsvp|regist|invite|guest/, "people", "rsvp"],
  [/crm|contact|people|attendee|profile|team/, "people", "crm"],
  [/sponsor|exhibitor|deal|sales/, "board", "sponsors"],
  [/sourc|venue|vendor|supplier/, "board", "venues"],
  [/board|kanban|review|approv|submission|paper/, "board", "papers"],
  [/live|stream|video|webinar|broadcast|meeting/, "live", "stream"],
];

// Resolve { motif, variant } for one published SEO page.
export function resolveFeatureMotif(page) {
  const slug = String(page.slug || "");
  if (SLUG_MOTIFS[slug]) {
    const [motif, variant] = SLUG_MOTIFS[slug];
    return { motif, variant };
  }

  const haystack = `${slug} ${page.title || ""}`.toLowerCase();
  const rule = KEYWORD_MOTIFS.find(([pattern]) => pattern.test(haystack));
  if (rule) return { motif: rule[1], variant: rule[2] };

  const motif = MOTIF_KEYS[hashString(slug) % MOTIF_KEYS.length];
  return { motif, variant: DEFAULT_VARIANTS[motif] };
}

// Linear's rhythm: two full-width cards up top, then one more after every six grid cards.
export function isWideCard(index) {
  return index < 2 || (index - 2) % 7 === 6;
}
