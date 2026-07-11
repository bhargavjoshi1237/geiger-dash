import { getPublishedSeoPageByProductSlug } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { buildSeoPagePath } from "@/lib/pages-studio/skills";

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
