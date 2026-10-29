// Single source of truth for pricing. Both the client calculator
// (components/pricing/plan_configurator.jsx) and the server-side checkout action
// (app/pricing/actions.js) import from here so the amount a user sees is the
// exact amount Stripe charges — the server never trusts a client-sent total,
// it recomputes from the same config with computeEstimate().

export const betaPlan = {
  id: "beta",
  name: "Alpha tester",
  price: 0,
  description:
    "Help shape Geiger with full access to all 15 products while the suite is in beta.",
  included: [
    "All 15 products",
    "1 active project",
    "3 collaborators",
    "5 GB storage",
    "25 GB bandwidth",
    "50 AI credits",
  ],
  // Every app is free while the beta runs; domain, email and SSO add-ons stay paid.
  productAllowances: { core: Infinity, addon: Infinity, cherry: Infinity, security: 0, domains: 0, email: 0 },
  projectAllowance: 1,
  seatAllowance: 3,
  storageAllowance: 5,
  aiAllowance: 50,
  emailAllowance: 0,
};

export const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "A focused workspace for small teams shipping one active project.",
    tagline: "One team working on one project at a time.",
    included: ["1 Core + 1 Add-on + 2 Cherry", "1 active project", "5 collaborators", "5 GB storage", "25 GB bandwidth", "50 AI credits"],
    productAllowances: { core: 1, addon: 1, cherry: 2, security: 0, domains: 0, email: 0 },
    projectAllowance: 1,
    seatAllowance: 5,
    storageAllowance: 5,
    aiAllowance: 50,
    emailAllowance: 0,
  },
  {
    id: "plus",
    name: "Plus",
    price: 79,
    description: "More products, people, and room for teams managing parallel work.",
    tagline: "Teams running a few projects side by side.",
    included: ["2 Core + 2 Add-on + all Cherry", "3 active projects", "12 collaborators", "50 GB storage", "250 GB bandwidth", "200 AI credits"],
    productAllowances: { core: 2, addon: 2, cherry: 3, security: 0, domains: 0, email: 0 },
    projectAllowance: 3,
    seatAllowance: 12,
    storageAllowance: 50,
    aiAllowance: 200,
    emailAllowance: 0,
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 119,
    description: "The complete suite for teams coordinating complex, multi-project delivery.",
    tagline: "Studios delivering many projects at once.",
    included: ["3 Core + 4 Add-on + all Cherry", "10 active projects", "25 collaborators", "100 GB storage", "500 GB bandwidth", "300 AI credits"],
    productAllowances: { core: 3, addon: 4, cherry: 3, security: 0, domains: 0, email: 0 },
    projectAllowance: 10,
    seatAllowance: 25,
    storageAllowance: 100,
    aiAllowance: 300,
    emailAllowance: 0,
  },
];

// Product catalog without UI concerns — the client maps id -> Lucide icon. `blurb` and
// `shortName` are the plain one-line copy the pricing configurator shows.
export const products = [
  { id: "campaign", name: "Campaign", detail: "Campaign Planning & Delivery", blurb: "Plan and run campaigns", category: "core" },
  { id: "flow", name: "Flow", detail: "Projects & Delivery", blurb: "Projects and delivery", category: "core" },
  { id: "events", name: "Events", detail: "Event Operations and Registration", blurb: "Registration and event ops", category: "core" },
  { id: "assets", name: "Assets", detail: "Creative Asset Control", blurb: "Creative asset library", category: "core" },
  { id: "comms", name: "Comms", detail: "Customer Messaging & Support", blurb: "Customer messaging", category: "core" },
  { id: "forms", name: "Forms", detail: "Intake and Feedback", blurb: "Intake and feedback", category: "addon" },
  { id: "grey", name: "Grey", detail: "Managed RAG & Knowledge Graphs", blurb: "AI knowledge base", category: "addon" },
  { id: "office", name: "Office", detail: "Workspace Operations", blurb: "Workspace operations", category: "addon" },
  { id: "docs", name: "Docs", detail: "Document Signing & Agreements", blurb: "Document signing", category: "addon" },
  { id: "content", name: "Content", detail: "Personalized Content Feeds", blurb: "Personalized feeds", category: "addon" },
  { id: "pods", name: "Pods", detail: "API Gateway", blurb: "API gateway", category: "addon" },
  { id: "notes", name: "Notes", detail: "Docs and Knowledge", blurb: "Docs and knowledge", category: "cherry" },
  { id: "property", name: "Property", detail: "Real Estate and Property Management", blurb: "Property management", category: "core" },
  { id: "oauth", name: "OAuth / SSO Login", shortName: "SSO sign-in", detail: "Bring Your Own Identity Provider for Org Sign-in", blurb: "Use your own identity provider", category: "security" },
  // Domains & branding — per-product price overrides the category rate (see
  // computeEstimate). `domain` is catalog-visible but not yet buildable, so the
  // calculator renders it disabled via `comingSoon`.
  { id: "subdomain", name: "Custom Subdomain", shortName: "Custom subdomain", detail: "Host Your Workspace at yourname.geiger.studio", blurb: "yourteam.geiger.studio", category: "domains", price: 5 },
  { id: "domain", name: "Own Domain", shortName: "Your own domain", detail: "Bring Your Own Custom Domain", blurb: "Bring your own domain", category: "domains", price: 10, comingSoon: true },
  // Email & messaging — the custom-template builder unlocks per-org branded
  // emails; the price override drives the calculator like the domains add-ons.
  { id: "emailTemplate", name: "Custom Email Templates", shortName: "Branded emails", detail: "Branded Templates for Every Email You Send", blurb: "Your templates on every email", category: "email", price: 10 },
];

export const productCategories = [
  { id: "core", name: "Core Products", description: "The operational foundation of your workspace.", rate: 10 },
  { id: "addon", name: "Add-on Products", description: "Specialized tools to extend your workflow.", rate: 5 },
  { id: "cherry", name: "Cherry Products", description: "Lightweight collaboration tools for the finishing touch.", rate: 3 },
  { id: "security", name: "Security & SSO", description: "Bring your own OAuth provider for organization sign-in.", rate: 10 },
  { id: "domains", name: "Domains & Branding", description: "Put your workspace on your own subdomain or custom domain.", rate: 5 },
  { id: "email", name: "Email & Messaging", description: "Design and manage your own branded email templates.", rate: 10 },
];

export const metricConfig = [
  { id: "projects", label: "Active projects", min: 1, max: 30, step: 1 },
  { id: "seats", label: "Collaborators", min: 1, max: 100, step: 1 },
  { id: "storage", label: "Storage", min: 0, max: 1000, step: 3, suffix: "GB" },
  { id: "bandwidth", label: "Bandwidth", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "edgeData", label: "Edge / CDN Serving", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "aiCredits", label: "AI credits", min: 0, max: 5000, step: 10, suffix: "credits" },
  // Global org-wide email purse — pay-as-you-go, drawn down as products send.
  { id: "emails", label: "Monthly emails", min: 0, max: 200000, step: 1000, suffix: "emails" },
];

export const PROJECT_RATE = 5;
export const COLLABORATOR_RATE = 1;
export const STORAGE_RATE = 0.5;
export const BANDWIDTH_RATE = 0.25;
export const EDGE_DATA_RATE = 0.1;
export const AI_RATE_PER_1000 = 10;
export const EMAIL_RATE_PER_1000 = 0.35;

// Yearly is billed at 10x the monthly rate (≈2 months free).
export const YEARLY_MULTIPLIER = 10;

export function getPlan(planId) {
  if (planId === betaPlan.id) return betaPlan;
  return plans.find((plan) => plan.id === planId) || plans[0];
}

// Plans are ordered lowest -> highest tier; the array index is the rank used
// to decide whether a selection is an upgrade or a blocked downgrade.
export function getPlanRank(planId) {
  const rank = plans.findIndex((plan) => plan.id === planId);
  return rank === -1 ? 0 : rank;
}

// The one calculation that matters. Returns the monthly base total + breakdown;
// callers apply the yearly multiplier for display/charge. Inputs are sanitised
// so a tampered client payload can never produce a negative or absurd charge.
export function computeEstimate({ planId, selectedProducts = [], metrics = {} }) {
  const selectedPlan = getPlan(planId);
  const selectedIds = Array.isArray(selectedProducts) ? selectedProducts : [];

  const safeMetric = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };

  const m = {
    projects: safeMetric(metrics.projects, selectedPlan.projectAllowance),
    seats: safeMetric(metrics.seats, selectedPlan.seatAllowance),
    storage: safeMetric(metrics.storage, selectedPlan.storageAllowance),
    bandwidth: safeMetric(metrics.bandwidth, selectedPlan.storageAllowance * 5),
    edgeData: safeMetric(metrics.edgeData, 0),
    aiCredits: safeMetric(metrics.aiCredits, selectedPlan.aiAllowance),
    emails: safeMetric(metrics.emails, selectedPlan.emailAllowance),
  };

  // Per-category { billable, cost } so a receipt can itemise productCost.
  const productCosts = {};
  const productCost = productCategories.reduce((total, category) => {
    const selectedInCategory = products.filter(
      (product) => product.category === category.id && selectedIds.includes(product.id),
    );
    const included = selectedPlan.productAllowances[category.id] ?? 0;
    const billable = Math.max(0, selectedInCategory.length - included);
    if (billable === 0) return total;
    // Per-product price override (used by the domains add-ons where each item has
    // its own price); the allowance covers the cheapest items, so charge the most
    // expensive `billable` ones. Reduces exactly to `billable * category.rate`
    // when no product sets an override.
    const prices = selectedInCategory
      .map((product) => product.price ?? category.rate)
      .sort((a, b) => b - a)
      .slice(0, billable);
    const cost = prices.reduce((sum, price) => sum + price, 0);
    productCosts[category.id] = { billable, cost };
    return total + cost;
  }, 0);

  const projectCost = Math.max(0, m.projects - selectedPlan.projectAllowance) * PROJECT_RATE;
  const seatCost = Math.max(0, m.seats - selectedPlan.seatAllowance) * COLLABORATOR_RATE;
  const storageCost = Math.max(0, m.storage - selectedPlan.storageAllowance) * STORAGE_RATE;
  const includedBandwidth = m.storage * 5;
  const bandwidthCost = Math.max(0, m.bandwidth - includedBandwidth) * BANDWIDTH_RATE;
  const edgeDataCost = m.edgeData * EDGE_DATA_RATE;
  const aiCost = (Math.max(0, m.aiCredits - selectedPlan.aiAllowance) / 1000) * AI_RATE_PER_1000;
  const emailCost = (Math.max(0, m.emails - selectedPlan.emailAllowance) / 1000) * EMAIL_RATE_PER_1000;

  const total =
    selectedPlan.price + productCost + projectCost + seatCost + storageCost + bandwidthCost + edgeDataCost + aiCost + emailCost;

  return { selectedPlan, total, productCost, productCosts, projectCost, seatCost, storageCost, bandwidthCost, edgeDataCost, aiCost, emailCost };
}

// Full recurring price of a plan configuration in cents, split into base/products/usage. A purchase's
// amount_total is only what was charged (an upgrade delta), so read the plan's real price from here.
export function planPrice({ planId, billingInterval = "month", selectedProducts = [], metrics = {} }) {
  const estimate = computeEstimate({ planId, selectedProducts, metrics });
  const multiplier = billingInterval === "year" ? YEARLY_MULTIPLIER : 1;
  const toCents = (dollars) => Math.round(dollars * multiplier * 100);
  return {
    totalCents: toCents(estimate.total),
    baseCents: toCents(estimate.selectedPlan.price),
    productsCents: toCents(estimate.productCost),
    usageCents: toCents(estimate.total - estimate.selectedPlan.price - estimate.productCost),
  };
}
