import { SeoHubPage } from "@/components/pages-studio/seo-hub-page";
import { PAGE_TYPE_HUB } from "@/lib/pages-studio/skills";

export const dynamic = "force-dynamic";

export const metadata = {
  title: PAGE_TYPE_HUB.solution.title,
  description: PAGE_TYPE_HUB.solution.description,
};

export default function SolutionsHubPage() {
  return <SeoHubPage pageType="solution" />;
}
