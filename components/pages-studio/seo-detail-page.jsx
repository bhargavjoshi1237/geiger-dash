import { notFound } from "next/navigation";
import { SeoPageView } from "@/components/seo-page-view";
import { getPublishedSeoPageByProductSlug } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";

// Fetch + render one published SEO page for a nested /<type>/<product>/<slug>
// route, or 404. `product` is the URL segment (product id, e.g. "events").
export async function SeoDetailPage({ pageType, product, slug }) {
  const productValue = resolveProductApp(product)?.value;
  if (!productValue) notFound();

  const page = await getPublishedSeoPageByProductSlug(productValue, pageType, slug);
  if (!page) notFound();

  return <SeoPageView page={page} pageType={pageType} />;
}
