import { FeaturesHubPage } from "@/components/features-hub/features_hub_page";
import { buildSeoHubMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildSeoHubMetadata("feature");

export default function FeaturesPage() {
  return <FeaturesHubPage />;
}
