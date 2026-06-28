// Single source of truth for pricing. Both the client calculator
// (components/pricing/plan_cards.jsx) and the server-side checkout action
// (app/pricing/actions.js) import from here so the amount a user sees is the
// exact amount Stripe charges — the server never trusts a client-sent total,
// it recomputes from the same config with computeEstimate().

export const betaPlan = {
  id: "beta",
  name: "Beta Tester",
  price: 0,
  description:
    "Help shape Geiger with full access to all 14 products while the suite is in beta.",
  included: [
    "All 14 products",
    "1 active project",
    "3 collaborators",
    "5 GB storage",
    "25 GB bandwidth",
    "50 AI credits",
  ],
};

export const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 19,
    description: "A focused workspace for small teams shipping one active project.",
    eyebrow: "For Smaller Teams",
    included: ["1 Core + 1 Add-on + 2 Cherry", "1 active project", "5 collaborators", "5 GB storage", "25 GB bandwidth", "50 AI credits"],
    productAllowances: { core: 1, addon: 1, cherry: 2 },
    projectAllowance: 1,
    seatAllowance: 5,
    storageAllowance: 5,
    aiAllowance: 50,
  },
  {
    id: "plus",
    name: "Plus",
    price: 79,
    description: "More products, people, and room for teams managing parallel work.",
    eyebrow: "Most popular",
    included: ["2 Core + 2 Add-on + all Cherry", "3 active projects", "12 collaborators", "50 GB storage", "250 GB bandwidth", "200 AI credits"],
    productAllowances: { core: 2, addon: 2, cherry: 3 },
    projectAllowance: 3,
    seatAllowance: 12,
    storageAllowance: 50,
    aiAllowance: 200,
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 119,
    description: "The complete suite for teams coordinating complex, multi-project delivery.",
    eyebrow: "For growing studios",
    included: ["3 Core + 4 Add-on + all Cherry", "10 active projects", "25 collaborators", "100 GB storage", "500 GB bandwidth", "300 AI credits"],
    productAllowances: { core: 3, addon: 4, cherry: 3 },
    projectAllowance: 10,
    seatAllowance: 25,
    storageAllowance: 100,
    aiAllowance: 300,
  },
];

// Product catalog without UI concerns — the client maps id -> Lucide icon.
export const products = [
  { id: "campaign", name: "Campaign", detail: "Campaign planning and delivery", category: "core" },
  { id: "flow", name: "Flow", detail: "Projects and delivery", category: "core" },
  { id: "events", name: "Events", detail: "Event operations and registration", category: "core" },
  { id: "assets", name: "Assets", detail: "Creative asset control", category: "core" },
  { id: "comms", name: "Comms", detail: "Broadcast communications", category: "core" },
  { id: "forms", name: "Forms", detail: "Intake and feedback", category: "addon" },
  { id: "grey", name: "Grey", detail: "AI project assistant", category: "addon" },
  { id: "office", name: "Office", detail: "Workspace operations", category: "addon" },
  { id: "docs", name: "Docs", detail: "Published documentation", category: "addon" },
  { id: "content", name: "Content", detail: "Publishing workflows", category: "addon" },
  { id: "pods", name: "Pods", detail: "Audio publishing workflows", category: "addon" },
  { id: "chat", name: "Chat", detail: "Project conversations", category: "cherry" },
  { id: "notes", name: "Notes", detail: "Docs and knowledge", category: "cherry" },
  { id: "canvas", name: "Canvas", detail: "Visual collaboration", category: "cherry" },
];

export const productCategories = [
  { id: "core", name: "Core products", description: "The operational foundation of your workspace.", rate: 10 },
  { id: "addon", name: "Add-on products", description: "Specialized tools to extend your workflow.", rate: 5 },
  { id: "cherry", name: "Cherry products", description: "Lightweight collaboration tools for the finishing touch.", rate: 3 },
];

export const metricConfig = [
  { id: "projects", label: "Active projects", min: 1, max: 30, step: 1 },
  { id: "seats", label: "Collaborators", min: 1, max: 100, step: 1 },
  { id: "storage", label: "Storage", min: 0, max: 1000, step: 3, suffix: "GB" },
  { id: "bandwidth", label: "Bandwidth", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "edgeData", label: "Edge / CDN Serving", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "aiCredits", label: "AI credits", min: 0, max: 5000, step: 10, suffix: "credits" },
];

export const PROJECT_RATE = 5;
export const COLLABORATOR_RATE = 1;
export const STORAGE_RATE = 0.5;
export const BANDWIDTH_RATE = 0.25;
export const EDGE_DATA_RATE = 0.1;
export const AI_RATE_PER_1000 = 10;

// Yearly is billed at 10x the monthly rate (≈2 months free).
export const YEARLY_MULTIPLIER = 10;

export function getPlan(planId) {
  return plans.find((plan) => plan.id === planId) || plans[0];
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
  };

  const productCost = productCategories.reduce((total, category) => {
    const selectedCount = products.filter(
      (product) => product.category === category.id && selectedIds.includes(product.id),
    ).length;
    const included = selectedPlan.productAllowances[category.id];
    return total + Math.max(0, selectedCount - included) * category.rate;
  }, 0);

  const projectCost = Math.max(0, m.projects - selectedPlan.projectAllowance) * PROJECT_RATE;
  const seatCost = Math.max(0, m.seats - selectedPlan.seatAllowance) * COLLABORATOR_RATE;
  const storageCost = Math.max(0, m.storage - selectedPlan.storageAllowance) * STORAGE_RATE;
  const includedBandwidth = m.storage * 5;
  const bandwidthCost = Math.max(0, m.bandwidth - includedBandwidth) * BANDWIDTH_RATE;
  const edgeDataCost = m.edgeData * EDGE_DATA_RATE;
  const aiCost = (Math.max(0, m.aiCredits - selectedPlan.aiAllowance) / 1000) * AI_RATE_PER_1000;

  const total =
    selectedPlan.price + productCost + projectCost + seatCost + storageCost + bandwidthCost + edgeDataCost + aiCost;

  return { selectedPlan, total, productCost, projectCost, seatCost, storageCost, bandwidthCost, edgeDataCost, aiCost };
}
