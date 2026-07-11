import { SeoDetailPage } from "@/components/pages-studio/seo-detail-page";
import { buildSeoPageMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildSeoPageMetadata("solution", slug);
}

export default async function SolutionPage({ params }) {
  const { slug } = await params;
  return <SeoDetailPage pageType="solution" slug={slug} />;
}
