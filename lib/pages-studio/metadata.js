import { getPublishedSeoPageByProductSlug } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";
import {
  PAGE_TYPE_HUB,
  buildSeoPagePath,
  buildSeoProductHubPath,
} from "@/lib/pages-studio/skills";

// Metadata for a /<type> hub, or its /<type>/<product> hub when a product segment is given.
export function buildSeoHubMetadata(pageType, product) {
  const hub = PAGE_TYPE_HUB[pageType] || PAGE_TYPE_HUB.solution;
  if (!product) {
    return {
      title: hub.title,
      description: hub.description,
      alternates: { canonical: `/${hub.path}` },
    };
  }

  const app = resolveProductApp(product);
  if (!app) return {};
  return {
    title: `Geiger ${app.name} ${hub.title}`,
    description: `${hub.title} for Geiger ${app.name}: ${app.detail}`,
    alternates: { canonical: buildSeoProductHubPath(pageType, app.value) },
  };
}

// Build Next metadata for a published SEO page at /<type>/<product>/<slug>,
// preferring the author's meta fields and falling back to title/excerpt.
export async function buildSeoPageMetadata(pageType, product, slug) {
  const productValue = resolveProductApp(product)?.value;
  if (!productValue) return { title: "Page not found" };

  const page = await getPublishedSeoPageByProductSlug(productValue, pageType, slug);
  if (!page) return { title: "Page not found" };

  const canonical = buildSeoPagePath(pageType, page.product, page.slug);
  const title = page.meta_title || page.title;
  const description = page.meta_description || page.excerpt || "";

  return {
    title,
    description,
    keywords: Array.isArray(page.keywords) && page.keywords.length ? page.keywords : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: page.cover_image ? [{ url: page.cover_image }] : undefined,
    },
  };
}
