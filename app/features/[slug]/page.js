import { SeoDetailPage } from "@/components/pages-studio/seo-detail-page";
import { buildSeoPageMetadata } from "@/lib/pages-studio/metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildSeoPageMetadata("feature", slug);
}

export default async function FeaturePage({ params }) {
  const { slug } = await params;
  return <SeoDetailPage pageType="feature" slug={slug} />;
}
