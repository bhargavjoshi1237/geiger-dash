import { notFound } from "next/navigation";
import { SeoPageView } from "@/components/seo-page-view";
import {
  getBlogPostsByTags,
  getPublishedSeoPageByProductSlug,
  getPublishedSeoPagesByType,
} from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";

const SIBLING_COUNT = 6;
const CROSS_COUNT = 3;
// Features link out to solutions and vice versa, so both sets share link equity.
const CROSS_TYPE = { feature: "solution", solution: "feature" };

// Stable per-slug number, so a page always links to the same set.
function slugHash(slug) {
  return [...slug].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

// `count` pages following `slug` in slug order, wrapping around, so links spread evenly across every page.
function rotateFrom(pages, slug, count) {
  const sorted = [...pages].sort((a, b) => a.slug.localeCompare(b.slug));
  const index = sorted.findIndex((page) => page.slug === slug);
  const others = sorted.filter((page) => page.slug !== slug);
  if (others.length <= count) return others;
  // In its own list the page's successor sits at `index` once it is removed; otherwise start from the hash.
  const start = index >= 0 ? index : slugHash(slug);
  return Array.from({ length: count }, (_, i) => others[(start + i) % others.length]);
}

// Fetch + render one published SEO page for a nested /<type>/<product>/<slug>
// route, or 404. `product` is the URL segment (product id, e.g. "events").
export async function SeoDetailPage({ pageType, product, slug }) {
  const productValue = resolveProductApp(product)?.value;
  if (!productValue) notFound();

  const page = await getPublishedSeoPageByProductSlug(productValue, pageType, slug);
  if (!page) notFound();

  const crossType = CROSS_TYPE[pageType];
  const [relatedPosts, siblings, crossPages] = await Promise.all([
    // Posts tagged with this page's slug first, then any post about the product.
    getBlogPostsByTags([page.slug, productValue]),
    getPublishedSeoPagesByType(pageType, productValue),
    crossType ? getPublishedSeoPagesByType(crossType, productValue) : [],
  ]);

  return (
    <SeoPageView
      page={page}
      pageType={pageType}
      relatedPosts={relatedPosts}
      siblingPages={rotateFrom(siblings, page.slug, SIBLING_COUNT)}
      crossPages={rotateFrom(crossPages, page.slug, CROSS_COUNT)}
      crossType={crossType}
    />
  );
}
