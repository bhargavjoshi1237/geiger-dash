import { SeoProductHub } from "@/components/pages-studio/seo-product-hub";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product } = await params;
  return buildSeoHubMetadata("solution", product);
}

export default async function SolutionProductHubPage({ params }) {
  const { product } = await params;
  return <SeoProductHub pageType="solution" segment={product} />;
}
