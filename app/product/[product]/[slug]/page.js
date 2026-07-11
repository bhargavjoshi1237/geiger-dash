import { SeoDetailPage } from "@/components/pages-studio/seo-detail-page";
import { buildSeoPageMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product, slug } = await params;
  return buildSeoPageMetadata("product", product, slug);
}

export default async function ProductDetailPage({ params }) {
  const { product, slug } = await params;
  return <SeoDetailPage pageType="product" product={product} slug={slug} />;
}
