// Canonical product list for SEO pages, derived from the suite's PRODUCT_APPS so
// the studio picker and the public CTA always resolve to the same app + route.
// Stored `product` values are `geiger-<id>` (matching the changelog convention).
import { PRODUCT_APPS } from "@/lib/org/product-apps";

export const PAGE_PRODUCTS = PRODUCT_APPS.map((product) => ({
  value: `geiger-${product.id}`,
  id: product.id,
  name: product.name,
  label: `Geiger ${product.name}`,
  href: product.href,
  detail: product.detail,
}));

const BY_VALUE = new Map(PAGE_PRODUCTS.map((product) => [product.value, product]));

// Resolve a stored product value (e.g. "geiger-flow", "flow", "Flow") to its app
// entry so the public page can render a CTA that links to the right route.
export function resolveProductApp(productValue) {
  if (!productValue) return null;
  const normalized = String(productValue).trim().toLowerCase();
  if (BY_VALUE.has(normalized)) return BY_VALUE.get(normalized);
  const id = normalized.replace(/^geiger[-_\s]*/, "");
  return BY_VALUE.get(`geiger-${id}`) || null;
}
