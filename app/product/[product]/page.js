import { SeoProductHub } from "@/components/pages-studio/seo-product-hub";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product } = await params;
  return buildSeoHubMetadata("product", product);
}

export default async function ProductProductHubPage({ params }) {
  const { product } = await params;
  return <SeoProductHub pageType="product" segment={product} />;
}
