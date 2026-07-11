import { getPublishedSeoPageBySlug } from "@/lib/public-content/queries";
import { PAGE_TYPE_HUB } from "@/lib/pages-studio/skills";

// Build Next metadata for a published SEO page, preferring the author's meta
// fields and falling back to the title/excerpt. Shared by every type route.
export async function buildSeoPageMetadata(pageType, slug) {
  const page = await getPublishedSeoPageBySlug(pageType, slug);
  if (!page) return { title: "Page not found" };

  const hub = PAGE_TYPE_HUB[pageType] || PAGE_TYPE_HUB.solution;
  const canonical = `/${hub.path}/${page.slug}`;
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
