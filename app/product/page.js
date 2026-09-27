import { SeoHubPage } from "@/components/pages-studio/seo-hub-page";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildSeoHubMetadata("product");

export default function ProductHubPage() {
  return <SeoHubPage pageType="product" />;
}
