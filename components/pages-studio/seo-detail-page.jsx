import { notFound } from "next/navigation";
import { SeoPageView } from "@/components/seo-page-view";
import { getPublishedSeoPageBySlug } from "@/lib/public-content/queries";

// Fetch + render one published SEO page for a type route, or 404.
export async function SeoDetailPage({ pageType, slug }) {
  const page = await getPublishedSeoPageBySlug(pageType, slug);
  if (!page) notFound();
  return <SeoPageView page={page} pageType={pageType} />;
}
