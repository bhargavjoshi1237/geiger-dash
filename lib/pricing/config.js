// Turns a stored pricing version into a full config and checks a draft before it publishes; pure, so the admin screen can use it too.
import { DEFAULT_PRICING } from "./plans.js";

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const MAX_MONEY = 100000;
const MAX_ALLOWANCE = 10000000;
const MAX_TEXT = 2000;
const MAX_FAQS = 30;
const ALLOWANCE_KEYS = ["core", "addon", "cherry", "security", "domains", "email"];
const PLAN_LIMITS = [
  ["projectAllowance", "active projects"],
  ["seatAllowance", "collaborators"],
  ["storageAllowance", "GB storage"],
  ["aiAllowance", "AI credits"],
  ["emailAllowance", "monthly emails"],
];
const RATE_LABELS = {
  project: "Extra project",
  collaborator: "Extra collaborator",
  storage: "Storage per GB",
  bandwidth: "Transfer per GB",
  edgeData: "Edge delivery per GB",
  aiPer1000: "AI credits per 1,000",
  emailPer1000: "Emails per 1,000",
};
const PAGE_TEXT = {
  heroTitle: "Hero title",
  heroDescription: "Hero description",
  plansEyebrow: "Plans label",
  plansHeading: "Plans heading",
  plansDescription: "Plans description",
  faqHeading: "FAQ heading",
  contactTitle: "Contact title",
  contactDescription: "Contact description",
  contactEmail: "Contact email",
};
const PAGE_TOGGLES = {
  showTrial: "Free trial offer",
  showBeta: "Alpha tester strip",
  showFaq: "FAQ section",
  showContact: "Contact block",
};

const text = (value, fallback) => (typeof value === "string" ? value : fallback);
const flag = (value, fallback) => (typeof value === "boolean" ? value : fallback);
// Only real numbers and numeric input strings count: Number(null) is 0, which would turn a missing price into a free plan.
const number = (value, fallback, max = MAX_MONEY) => {
  const n = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  return Number.isFinite(n) && n >= 0 && n <= max ? n : fallback;
};
const whole = (value, fallback) => {
  const n = number(value, fallback, MAX_ALLOWANCE);
  return Number.isInteger(n) ? n : fallback;
};
const lines = (value, fallback) =>
  Array.isArray(value) ? value.filter((line) => typeof line === "string" && line.trim()).map((line) => line.trim()) : fallback;
const byId = (list) => new Map((Array.isArray(list) ? list : []).filter(isObject).map((item) => [item.id, item]));

function planCopy(plan, stored) {
  return {
    name: text(stored.name, plan.name),
    description: text(stored.description, plan.description),
    included: lines(stored.included, plan.included),
  };
}

function planLimits(plan, stored) {
  return Object.fromEntries(PLAN_LIMITS.map(([key]) => [key, whole(stored[key], plan[key])]));
}

function mergePlan(plan, stored = {}) {
  const allowances = isObject(stored.productAllowances) ? stored.productAllowances : {};
  return {
    ...plan,
    ...planCopy(plan, stored),
    ...planLimits(plan, stored),
    price: number(stored.price, plan.price),
    tagline: text(stored.tagline, plan.tagline),
    featured: flag(stored.featured, Boolean(plan.featured)),
    productAllowances: Object.fromEntries(ALLOWANCE_KEYS.map((key) => [key, whole(allowances[key], plan.productAllowances[key])])),
  };
}

function mergeProduct(product, stored = {}) {
  return {
    ...product,
    detail: text(stored.detail, product.detail),
    blurb: text(stored.blurb, product.blurb),
    // Only products that already bill on their own price can change it; the rest follow their category's rate.
    ...(product.price === undefined ? {} : { price: number(stored.price, product.price) }),
    comingSoon: flag(stored.comingSoon, Boolean(product.comingSoon)),
  };
}

function mergeSteps(steps, stored) {
  return Object.fromEntries(
    Object.entries(steps).map(([id, [medium, heavy]]) => {
      const saved = isObject(stored) && Array.isArray(stored[id]) ? stored[id] : [];
      return [id, [whole(saved[0], medium), whole(saved[1], heavy)]];
    }),
  );
}

function mergePage(page, stored) {
  const saved = isObject(stored) ? stored : {};
  return {
    ...Object.fromEntries(Object.keys(PAGE_TEXT).map((key) => [key, text(saved[key], page[key])])),
    ...Object.fromEntries(Object.keys(PAGE_TOGGLES).map((key) => [key, flag(saved[key], page[key])])),
    faqs: Array.isArray(saved.faqs)
      ? saved.faqs
          .filter(isObject)
          .map((faq) => ({ question: text(faq.question, ""), answer: text(faq.answer, "") }))
          .filter((faq) => faq.question || faq.answer)
      : page.faqs,
  };
}

// Stored fields merge over the code defaults one by one, so ids, categories and anything new in code keep working and a bad value can't reach checkout.
export function normalizePricingConfig(stored) {
  const defaults = DEFAULT_PRICING;
  const saved = isObject(stored) ? stored : {};
  const plans = byId(saved.plans);
  const products = byId(saved.products);
  const categories = byId(saved.productCategories);
  const beta = isObject(saved.betaPlan) ? saved.betaPlan : {};
  const rates = isObject(saved.usageRates) ? saved.usageRates : {};

  return {
    ...defaults,
    // The beta stays free with every app, so only its copy and limits can change.
    betaPlan: { ...defaults.betaPlan, ...planCopy(defaults.betaPlan, beta), ...planLimits(defaults.betaPlan, beta) },
    plans: defaults.plans.map((plan) => mergePlan(plan, plans.get(plan.id))),
    products: defaults.products.map((product) => mergeProduct(product, products.get(product.id))),
    productCategories: defaults.productCategories.map((category) => {
      const item = categories.get(category.id) || {};
      return { ...category, description: text(item.description, category.description), rate: number(item.rate, category.rate) };
    }),
    usageRates: Object.fromEntries(Object.entries(defaults.usageRates).map(([key, rate]) => [key, number(rates[key], rate)])),
    usageSteps: mergeSteps(defaults.usageSteps, saved.usageSteps),
    yearlyMultiplier: number(saved.yearlyMultiplier, defaults.yearlyMultiplier),
    trialDays: whole(saved.trialDays, defaults.trialDays),
    page: mergePage(defaults.page, saved.page),
  };
}

const usd = (value) => `$${value}`;

// Problems that stop a draft publishing, worded for the editor; a bad value is refused here rather than silently defaulted.
export function validatePricingConfig(draft) {
  const errors = [];
  const checkMoney = (value, label, min = 0) => {
    const n = number(value, null);
    if (n === null || n < min) errors.push(`${label} must be a number from ${usd(min)} to ${usd(MAX_MONEY)}.`);
  };
  const checkWhole = (value, label) => {
    if (whole(value, null) === null) errors.push(`${label} must be a whole number of 0 or more.`);
  };
  const checkText = (value, label, { required = true } = {}) => {
    if (typeof value !== "string" || (required && !value.trim())) errors.push(`${label} can't be empty.`);
    else if (value.length > MAX_TEXT) errors.push(`${label} is longer than ${MAX_TEXT} characters.`);
  };
  const checkLimits = (plan, name) => PLAN_LIMITS.forEach(([key, label]) => checkWhole(plan[key], `${name} ${label}`));

  for (const plan of draft.plans) {
    checkText(plan.name, "Plan name");
    // A paid plan under $1 falls below Stripe's minimum charge, and $0 would give it away.
    checkMoney(plan.price, `${plan.name} price`, 1);
    checkText(plan.description, `${plan.name} description`);
    checkText(plan.tagline, `${plan.name} tagline`);
    checkLimits(plan, plan.name);
    ALLOWANCE_KEYS.forEach((key) => checkWhole(plan.productAllowances?.[key], `${plan.name} included ${key} apps`));
  }
  checkText(draft.betaPlan.name, "Alpha tester name");
  checkLimits(draft.betaPlan, draft.betaPlan.name);

  for (const category of draft.productCategories) checkMoney(category.rate, `${category.name} price`);
  for (const product of draft.products) {
    if (product.price !== undefined) checkMoney(product.price, `${product.name} price`);
  }
  for (const [key, label] of Object.entries(RATE_LABELS)) checkMoney(draft.usageRates[key], label);
  for (const [id, steps] of Object.entries(draft.usageSteps)) {
    steps.forEach((step, index) => checkWhole(step, `${id} ${index ? "Heavy" : "Medium"} preset`));
    if (Number(steps[1]) < Number(steps[0])) errors.push(`${id}: Heavy can't be smaller than Medium.`);
  }

  const months = number(draft.yearlyMultiplier, null, 12);
  if (months === null || months < 1) errors.push("Yearly billing must be between 1 and 12 months.");
  const days = whole(draft.trialDays, null);
  if (days === null || days < 1 || days > 365) errors.push("Trial length must be between 1 and 365 days.");

  for (const key of Object.keys(PAGE_TEXT)) checkText(draft.page[key], PAGE_TEXT[key]);
  if (!Array.isArray(draft.page.faqs) || draft.page.faqs.length > MAX_FAQS) errors.push(`Keep the FAQ to ${MAX_FAQS} questions or fewer.`);
  (draft.page.faqs || []).forEach((faq, index) => {
    checkText(faq.question, `FAQ ${index + 1} question`);
    checkText(faq.answer, `FAQ ${index + 1} answer`);
  });
  return errors;
}

const shown = (value) => (typeof value === "boolean" ? (value ? "On" : "Off") : String(value));

// Every field an editor can change, labelled and grouped, for the publish review.
function fieldsOf(config) {
  const fields = [];
  const add = (kind, label, value) => fields.push({ key: `${kind}:${label}`, kind, label, value: shown(value) });

  for (const plan of [...config.plans, config.betaPlan]) {
    const id = DEFAULT_PRICING.plans.find((item) => item.id === plan.id)?.name || DEFAULT_PRICING.betaPlan.name;
    if (plan.id !== "beta") add("price", `${id} price`, plan.price);
    PLAN_LIMITS.forEach(([key, label]) => add("limit", `${id}: ${label}`, plan[key]));
    if (plan.id !== "beta") ALLOWANCE_KEYS.forEach((key) => add("limit", `${id}: included ${key} apps`, plan.productAllowances[key]));
    add("copy", `${id} name`, plan.name);
    add("copy", `${id} description`, plan.description);
    add("copy", `${id} tagline`, plan.tagline ?? "");
    add("copy", `${id} feature list`, (plan.included || []).join(", "));
    if (plan.id !== "beta") add("copy", `${id} marked most popular`, Boolean(plan.featured));
  }
  for (const category of config.productCategories) add("price", `${category.name} price`, category.rate);
  for (const product of config.products) {
    if (product.price !== undefined) add("price", `${product.name} price`, product.price);
    add("copy", `${product.name} short description`, product.blurb);
    add("copy", `${product.name} coming soon`, Boolean(product.comingSoon));
  }
  for (const [key, label] of Object.entries(RATE_LABELS)) add("price", label, config.usageRates[key]);
  for (const [id, steps] of Object.entries(config.usageSteps)) add("copy", `${id} presets`, steps.join(" / "));
  add("price", "Yearly billing (months charged)", config.yearlyMultiplier);
  add("copy", "Trial length (days)", config.trialDays);
  for (const [key, label] of Object.entries(PAGE_TEXT)) add("copy", label, config.page[key]);
  for (const [key, label] of Object.entries(PAGE_TOGGLES)) add("copy", label, config.page[key]);
  add("copy", "FAQ", config.page.faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" "));
  return fields;
}

// What a publish would change, for the review dialog.
export function diffPricingConfig(before, after) {
  const previous = new Map(fieldsOf(before).map((field) => [field.key, field]));
  return fieldsOf(after).flatMap((field) => {
    const old = previous.get(field.key);
    return old && old.value !== field.value ? [{ kind: field.kind, label: field.label, from: old.value, to: field.value }] : [];
  });
}
