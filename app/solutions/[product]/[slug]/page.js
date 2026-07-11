import { SeoDetailPage } from "@/components/pages-studio/seo-detail-page";
import { buildSeoPageMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product, slug } = await params;
  return buildSeoPageMetadata("solution", product, slug);
}

export default async function SolutionDetailPage({ params }) {
  const { product, slug } = await params;
  return <SeoDetailPage pageType="solution" product={product} slug={slug} />;
}
