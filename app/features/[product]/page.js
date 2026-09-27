import { SeoProductHub } from "@/components/pages-studio/seo-product-hub";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product } = await params;
  return buildSeoHubMetadata("feature", product);
}

export default async function FeatureProductHubPage({ params }) {
  const { product } = await params;
  return <SeoProductHub pageType="feature" segment={product} />;
}
