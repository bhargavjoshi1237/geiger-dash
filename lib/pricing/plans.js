// Pricing defaults and the one calculation; /admin/pricing publishes versions over these (lib/pricing/config.js merges them).
// Use createPricing(config) to price anything, so the calculator and checkout share one source and the server never trusts a client total.
// The exports below are the code defaults: purchases made before versioning stay on them, so changing a value here reprices those customers.

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
  { id: "campaign", name: "Campaign", detail: "Campaign Planning & Delivery", blurb: "Plan and Run Campaigns", category: "core" },
  { id: "flow", name: "Flow", detail: "Projects & Delivery", blurb: "Projects and Delivery", category: "core" },
  { id: "events", name: "Events", detail: "Event Operations and Registration", blurb: "Registration and Event Ops", category: "core" },
  { id: "assets", name: "Assets", detail: "Creative Asset Control", blurb: "Creative Asset Library", category: "core" },
  { id: "comms", name: "Comms", detail: "Customer Messaging & Support", blurb: "Customer Messaging", category: "core" },
  { id: "forms", name: "Forms", detail: "Intake and Feedback", blurb: "Intake and Feedback", category: "addon" },
  { id: "grey", name: "Grey", detail: "Managed RAG & Knowledge Graphs", blurb: "AI Knowledge Base", category: "addon" },
  // Retired: off the picker for new buyers, kept in the catalog so anyone who already owns it keeps the same price.
  { id: "office", name: "Office", detail: "Workspace Operations", blurb: "Workspace Operations", category: "addon", retired: true },
  // Always included, so it shows among the tools (`showWith`) without using a tool slot.
  { id: "notes", name: "Notes", detail: "Docs and Knowledge", blurb: "Docs and Knowledge", category: "cherry", showWith: "addon" },
  { id: "docs", name: "Docs", detail: "Document Signing & Agreements", blurb: "Document Signing", category: "addon" },
  { id: "content", name: "Content", detail: "Personalized Content Feeds", blurb: "Personalized Feeds", category: "addon" },
  { id: "pods", name: "Pods", detail: "API Gateway", blurb: "API Gateway", category: "addon" },
  { id: "property", name: "Property", detail: "Real Estate and Property Management", blurb: "Property Management", category: "core" },
  { id: "oauth", name: "OAuth / SSO Login", shortName: "SSO Sign-In", detail: "Bring Your Own Identity Provider for Org Sign-in", blurb: "Use Your Own Identity Provider", category: "security" },
  // Domains & branding — per-product price overrides the category rate (see
  // computeEstimate). `domain` is catalog-visible but not yet buildable, so the
  // calculator renders it disabled via `comingSoon`.
  { id: "subdomain", name: "Custom Subdomain", shortName: "Custom Subdomain", detail: "Host Your Workspace at yourname.geiger.studio", blurb: "yourteam.geiger.studio", category: "domains", price: 5 },
  { id: "domain", name: "Own Domain", shortName: "Your Own Domain", detail: "Bring Your Own Custom Domain", blurb: "Bring Your Own Domain", category: "domains", price: 10, comingSoon: true },
  // Email & messaging — the custom-template builder unlocks per-org branded
  // emails; the price override drives the calculator like the domains add-ons.
  { id: "emailTemplate", name: "Custom Email Templates", shortName: "Branded Emails", detail: "Branded Templates for Every Email You Send", blurb: "Your Templates on Every Email", category: "email", price: 10 },
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
  { id: "projects", label: "Active projects", min: 1, max: 20, step: 1 },
  { id: "seats", label: "Collaborators", min: 1, max: 500, step: 5 },
  { id: "storage", label: "Storage", min: 0, max: 1000, step: 3, suffix: "GB" },
  { id: "bandwidth", label: "Bandwidth", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "edgeData", label: "Edge / CDN Serving", min: 0, max: 5000, step: 3, suffix: "GB" },
  { id: "aiCredits", label: "AI credits", min: 0, max: 5000, step: 10, suffix: "credits" },
  // Global org-wide email purse — pay-as-you-go, drawn down as products send.
  { id: "emails", label: "Monthly emails", min: 0, max: 200000, step: 1000, suffix: "emails" },
];

export const usageRates = {
  project: 5,
  collaborator: 1,
  storage: 0.5,
  bandwidth: 0.25,
  edgeData: 0.1,
  aiPer1000: 10,
  emailPer1000: 0.35,
};

// What the Medium and Heavy presets add on top of the plan; Light adds nothing.
export const usageSteps = {
  storage: [50, 250],
  aiCredits: [1000, 5000],
  emails: [10000, 100000],
  edgeData: [100, 1000],
};

// Everything on /pricing that isn't a price; FAQ answers are plain text, so editors update them when prices change.
export const pricingPage = {
  heroTitle: "One suite, priced around your team.",
  heroDescription:
    "Choose a plan, then shape the apps, people and usage around your work. Every allowance and overage stays visible as you configure.",
  plansEyebrow: "Choose a plan",
  plansHeading: "Pick a plan. Add only what you need.",
  plansDescription:
    "Each plan includes a set of apps, people and storage. Anything past that has one fixed price, and the receipt shows exactly what checkout charges.",
  faqHeading: "How pricing works, in plain terms.",
  faqs: [
    {
      question: "What are main apps and tools?",
      answer:
        "Main apps run a whole area of work: Flow, Campaign, Events, Assets, Comms and Property. Tools are smaller apps that work alongside them: Forms, Grey, Docs, Content and Pods. Every plan includes a set number of each, plus Notes. Extra main apps are $10/mo and extra tools $5/mo.",
    },
    {
      question: "What do Light, Medium and Heavy mean?",
      answer:
        "They are presets for storage, AI credits, email and edge delivery. Light is what your plan already includes. Medium and Heavy add a fixed amount, and each one shows its price before you pick it.",
    },
    {
      question: "Can I change my plan or apps later?",
      answer:
        "Yes. Add apps, people or usage at any time. When you upgrade, you only pay the difference from what you already pay. To move to a smaller plan, cancel your current plan first.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes. Basic is free for 15 days with no card required. The trial ends on its own and nothing is charged.",
    },
    {
      question: "What is the Alpha tester plan?",
      answer:
        "While Geiger is in beta, testers get every app for $0 with 1 active project, 3 people, 5 GB storage, 25 GB transfer and 50 AI credits.",
    },
    {
      question: "How does yearly billing work?",
      answer: "Yearly costs 10 times the monthly price, so two months are free. Your whole setup is billed once a year.",
    },
  ],
  contactTitle: "Need more than Pro?",
  contactDescription: "Custom limits, security reviews, data residency and dedicated support.",
  contactEmail: "contact@geiger.studio",
  showTrial: true,
  showBeta: true,
  showFaq: true,
  showContact: true,
};

export const DEFAULT_PRICING = {
  betaPlan,
  plans,
  products,
  productCategories,
  metricConfig,
  usageRates,
  usageSteps,
  // Yearly is billed at this many months (10 means 2 months free).
  yearlyMultiplier: 10,
  trialDays: 15,
  page: pricingPage,
};

// Binds the pricing calculations to one config; versionId is the published version it came from, null for the code defaults.
export function createPricing(config = DEFAULT_PRICING, versionId = null) {
  const { betaPlan, plans, products, productCategories, usageRates: rates, yearlyMultiplier } = config;

  function getPlan(planId) {
    if (planId === betaPlan.id) return betaPlan;
    return plans.find((plan) => plan.id === planId) || plans[0];
  }

  // Plans are ordered lowest -> highest tier; the index decides upgrade vs blocked downgrade.
  function getPlanRank(planId) {
    const rank = plans.findIndex((plan) => plan.id === planId);
    return rank === -1 ? 0 : rank;
  }

  // Returns the monthly total + breakdown; callers apply the yearly multiplier. Inputs are sanitised so a tampered payload can't produce a negative charge.
  function computeEstimate({ planId, selectedProducts = [], metrics = {} }) {
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
      // A product's own price overrides the category rate; the allowance covers the cheapest items, so charge the most expensive `billable` ones.
      const prices = selectedInCategory
        .map((product) => product.price ?? category.rate)
        .sort((a, b) => b - a)
        .slice(0, billable);
      const cost = prices.reduce((sum, price) => sum + price, 0);
      productCosts[category.id] = { billable, cost };
      return total + cost;
    }, 0);

    const projectCost = Math.max(0, m.projects - selectedPlan.projectAllowance) * rates.project;
    const seatCost = Math.max(0, m.seats - selectedPlan.seatAllowance) * rates.collaborator;
    const storageCost = Math.max(0, m.storage - selectedPlan.storageAllowance) * rates.storage;
    const includedBandwidth = m.storage * 5;
    const bandwidthCost = Math.max(0, m.bandwidth - includedBandwidth) * rates.bandwidth;
    const edgeDataCost = m.edgeData * rates.edgeData;
    const aiCost = (Math.max(0, m.aiCredits - selectedPlan.aiAllowance) / 1000) * rates.aiPer1000;
    const emailCost = (Math.max(0, m.emails - selectedPlan.emailAllowance) / 1000) * rates.emailPer1000;

    const total =
      selectedPlan.price + productCost + projectCost + seatCost + storageCost + bandwidthCost + edgeDataCost + aiCost + emailCost;

    return { selectedPlan, total, productCost, productCosts, projectCost, seatCost, storageCost, bandwidthCost, edgeDataCost, aiCost, emailCost };
  }

  // Full recurring price of a plan configuration in cents, split into base/products/usage. A purchase's
  // amount_total is only what was charged (an upgrade delta), so read the plan's real price from here.
  function planPrice({ planId, billingInterval = "month", selectedProducts = [], metrics = {} }) {
    const estimate = computeEstimate({ planId, selectedProducts, metrics });
    const multiplier = billingInterval === "year" ? yearlyMultiplier : 1;
    const toCents = (dollars) => Math.round(dollars * multiplier * 100);
    return {
      totalCents: toCents(estimate.total),
      baseCents: toCents(estimate.selectedPlan.price),
      productsCents: toCents(estimate.productCost),
      usageCents: toCents(estimate.total - estimate.selectedPlan.price - estimate.productCost),
    };
  }

  return { ...config, config, versionId, getPlan, getPlanRank, computeEstimate, planPrice };
}

const codeDefaults = createPricing();

// Catalog lookups for old purchases and entitlements, which never read live prices.
export const getPlan = codeDefaults.getPlan;
export const getPlanRank = codeDefaults.getPlanRank;

// The limits a purchase keeps for life, recorded on the subscription so later edits only reach new buyers.
export function planSnapshot(plan) {
  return {
    name: plan.name,
    projectAllowance: plan.projectAllowance,
    seatAllowance: plan.seatAllowance,
    storageAllowance: plan.storageAllowance,
    aiAllowance: plan.aiAllowance,
    emailAllowance: plan.emailAllowance,
  };
}
