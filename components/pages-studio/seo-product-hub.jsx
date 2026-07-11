import { notFound, permanentRedirect } from "next/navigation";
import { SeoHubPage } from "@/components/pages-studio/seo-hub-page";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { findPublishedSeoPageBySlug } from "@/lib/public-content/queries";
import { buildSeoPagePath } from "@/lib/pages-studio/skills";

// Renders /<type>/<segment>. When <segment> is a known product id it shows that
// product's hub for the type; otherwise it treats <segment> as a legacy flat
// /<type>/<slug> URL and 301-redirects to the canonical nested path (or 404s).
export async function SeoProductHub({ pageType, segment }) {
  const app = resolveProductApp(segment);
  if (app) return <SeoHubPage pageType={pageType} product={app.value} />;

  const legacy = await findPublishedSeoPageBySlug(pageType, segment);
  if (legacy) {
    permanentRedirect(buildSeoPagePath(pageType, legacy.product, legacy.slug));
  }
  notFound();
}
