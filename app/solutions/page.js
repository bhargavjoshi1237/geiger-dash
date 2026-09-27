import { SeoHubPage } from "@/components/pages-studio/seo-hub-page";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildSeoHubMetadata("solution");

export default function SolutionsHubPage() {
  return <SeoHubPage pageType="solution" />;
}
