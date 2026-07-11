import { SeoProductHub } from "@/components/pages-studio/seo-product-hub";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { PAGE_TYPE_HUB } from "@/lib/pages-studio/skills";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { product } = await params;
  const app = resolveProductApp(product);
  if (!app) return {};
  return {
    title: `${app.name} ${PAGE_TYPE_HUB.feature.title}`,
    description: `${PAGE_TYPE_HUB.feature.title} for ${app.name}.`,
  };
}

export default async function FeatureProductHubPage({ params }) {
  const { product } = await params;
  return <SeoProductHub pageType="feature" segment={product} />;
}
