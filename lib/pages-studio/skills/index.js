// Registry for the SEO page-writing skills. Each page type (product, solution,
// feature) supplies its own editorial system prompt; the shared user-prompt
// builder and normalizer here give every type the same JSON output contract and
// image-token handling, mirroring lib/blog-import/skill-prompt.js.
import { PRODUCT_PAGE_SKILL } from "./product";
import { SOLUTION_PAGE_SKILL } from "./solution";
import { FEATURE_PAGE_SKILL } from "./feature";
import { resolveProductApp } from "@/lib/pages-studio/products";

export const PAGE_SKILLS = {
  product: PRODUCT_PAGE_SKILL,
  solution: SOLUTION_PAGE_SKILL,
  feature: FEATURE_PAGE_SKILL,
};

// Ordered options for the studio picker.
export const PAGE_TYPE_OPTIONS = [
  { value: "solution", label: SOLUTION_PAGE_SKILL.label, description: SOLUTION_PAGE_SKILL.description },
  { value: "product", label: PRODUCT_PAGE_SKILL.label, description: PRODUCT_PAGE_SKILL.description },
  { value: "feature", label: FEATURE_PAGE_SKILL.label, description: FEATURE_PAGE_SKILL.description },
];

// Public URL segment each type renders under (see app/{solutions,product,features}).
export const PAGE_TYPE_PATH = {
  solution: "solutions",
  product: "product",
  feature: "features",
};

export const PAGE_TYPE_LABEL = {
  solution: SOLUTION_PAGE_SKILL.label,
  product: PRODUCT_PAGE_SKILL.label,
  feature: FEATURE_PAGE_SKILL.label,
};

// Public hub config per type: the URL segment, the breadcrumb/list label, and the
// hub page's own title + description. Keeps routes, breadcrumbs, and the sitemap
// in agreement from one source.
export const PAGE_TYPE_HUB = {
  solution: {
    path: "solutions",
    label: "Solutions",
    title: "Solutions",
    description: "Ways teams put the Geiger suite to work — by role, workflow, and use-case.",
  },
  product: {
    path: "product",
    label: "Products",
    title: "Products",
    description: "The tools in the Geiger suite, each built for one job and made to work together.",
  },
  feature: {
    path: "features",
    label: "Features",
    title: "Features",
    description: "A closer look at what the Geiger suite can do, one capability at a time.",
  },
};

// Reverse lookup: public URL segment (e.g. "solutions") -> page type.
export const PAGE_TYPE_BY_PATH = Object.fromEntries(
  Object.entries(PAGE_TYPE_HUB).map(([type, hub]) => [hub.path, type])
);

// Canonical public path for a page: /<typePath>/<productId>/<slug>, e.g.
// /solutions/events/community-event-platform. Pages nest under their product so
// each suite product owns its own slug space (unique key: product, page_type,
// slug). Falls back to the flat /<typePath>/<slug> when the product is unknown.
export function buildSeoPagePath(pageType, product, slug) {
  const segment = PAGE_TYPE_PATH[pageType] || "solutions";
  const productId = resolveProductApp(product)?.id;
  return productId ? `/${segment}/${productId}/${slug}` : `/${segment}/${slug}`;
}

// The product-scoped hub path: /<typePath>/<productId> (lists that product's
// pages of this type).
export function buildSeoProductHubPath(pageType, product) {
  const segment = PAGE_TYPE_PATH[pageType] || "solutions";
  const productId = resolveProductApp(product)?.id;
  return productId ? `/${segment}/${productId}` : `/${segment}`;
}

export function getPageSkill(pageType) {
  return PAGE_SKILLS[pageType] || SOLUTION_PAGE_SKILL;
}

export function isValidPageType(pageType) {
  return Object.prototype.hasOwnProperty.call(PAGE_SKILLS, pageType);
}

// Build the user message: the brief + product + optional image tokens, plus the
// exact JSON output contract every skill fills in.
export function buildPageUserPrompt({ pageType, productName, brief, keywords = "", images = [] }) {
  const skill = getPageSkill(pageType);
  const typeLabel = skill.label;

  const imageBlock = images.length
    ? `\nIMAGES TO PLACE (screenshots, diagrams, product shots). Put the relevant ones in the content where they support a point using the EXACT placeholder token as the src — e.g. <img src="{{IMAGE_1}}" alt="short description">. Use each token at most once, in a sensible order, and skip any that don't help. Do NOT invent image URLs and do NOT use a token that isn't listed.\n${images
        .map((img, index) => `{{IMAGE_${index + 1}}} — ${img.alt ? `alt: "${img.alt}"` : "no alt text"}`)
        .join("\n")}\n`
    : "";

  const keywordLine = keywords && String(keywords).trim()
    ? `\nTARGET KEYWORDS (weave in naturally, do not stuff): ${String(keywords).trim()}`
    : "";

  return `Write a ${typeLabel} page for the product "${productName}".

BRIEF (the details to build the page from — features, audience, use-cases, positioning, any numbers):
"""
${String(brief || "").trim() || "No extra brief supplied — write from the product's general purpose."}
"""
${keywordLine}
${imageBlock}
Respond with ONLY a JSON object (no prose, no code fences) in this exact shape:
{
  "title": "the page H1 — specific and keyword-aligned",
  "slug": "url-friendly-slug",
  "metaTitle": "SEO <title>: front-load the term people search, under ~60 chars",
  "metaDescription": "meta description, 150-160 chars: concrete value + a reason to click",
  "heroHeading": "short punchy hero headline",
  "heroSubheading": "one supporting sentence under the hero headline",
  "heroCtaText": "call-to-action button label, e.g. 'Start with ${productName}'",
  "excerpt": "one-sentence summary used as a fallback description",
  "keywords": ["3-6", "lowercase", "target keywords"],
  "coverImage": "${images.length ? "the placeholder token of the best hero/OG image, e.g. {{IMAGE_1}}, or empty string if none fits" : "empty string"}",
  "content": "the full page body as an HTML fragment"
}`;
}

// Swap {{IMAGE_n}} placeholders in generated HTML back to real URLs, then drop
// any placeholder the model referenced but we couldn't fill.
export function applyImages(content, images = []) {
  let out = String(content || "");
  images.forEach((img, index) => {
    if (img?.src) out = out.split(`{{IMAGE_${index + 1}}}`).join(img.src);
  });
  out = out.replace(/<img\b[^>]*\{\{IMAGE_\d+\}\}[^>]*>/gi, "");
  out = out.replace(/\{\{IMAGE_\d+\}\}/g, "");
  return out;
}

// Normalise the model's JSON into a create-page payload. Returns null when the
// essential fields are missing so the caller can surface a retry.
export function normalizeGeneratedPage(result, { images = [] } = {}) {
  if (!result || typeof result !== "object") return null;

  const title = String(result.title || "").trim();
  const content = applyImages(String(result.content || "").trim(), images);
  if (!title || !content) return null;

  const keywords = Array.isArray(result.keywords)
    ? result.keywords.map((keyword) => String(keyword || "").trim()).filter(Boolean)
    : String(result.keywords || "")
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

  // Resolve the cover: a raw URL or a model-picked {{IMAGE_n}} token wins,
  // otherwise fall back to the first supplied image.
  const coverRaw = String(result.coverImage || "").trim();
  let coverImage = "";
  if (/^https?:\/\//i.test(coverRaw) || /^data:image\//i.test(coverRaw)) {
    coverImage = coverRaw;
  } else if (coverRaw) {
    const resolved = applyImages(coverRaw, images).trim();
    if (resolved && resolved !== coverRaw) coverImage = resolved;
  }
  if (!coverImage) coverImage = images[0]?.src || "";

  return {
    title,
    slug: String(result.slug || "").trim(),
    metaTitle: String(result.metaTitle || "").trim(),
    metaDescription: String(result.metaDescription || result.excerpt || "").trim(),
    heroHeading: String(result.heroHeading || "").trim(),
    heroSubheading: String(result.heroSubheading || "").trim(),
    heroCtaText: String(result.heroCtaText || "").trim(),
    excerpt: String(result.excerpt || result.metaDescription || "").trim(),
    keywords,
    content,
    coverImage,
  };
}
