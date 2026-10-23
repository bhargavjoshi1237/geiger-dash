import { notFound, permanentRedirect } from "next/navigation";
import HelpCenter from "@/components/help/help_center";
import { getDocsPage, getDocsPageWithNavigation, normalizeSlug } from "@/lib/docs/queries";
import { HELP_HOME_SLUG, helpHref } from "@/lib/docs/paths";

async function readRoute({ params, searchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return { slug: normalizeSlug(slug), preview: query?.preview === "1" };
}

export async function generateMetadata(props) {
  const { slug, preview } = await readRoute(props);
  const page = await getDocsPage(slug, preview);
  if (!page) return { title: "Page not found" };

  return {
    title: { absolute: `${page.title} - Geiger Help Center` },
    description: page.description,
    alternates: { canonical: helpHref(page.slug) },
    robots: preview || page.status !== "published" ? { index: false, follow: false } : undefined,
  };
}

export default async function HelpArticlePage(props) {
  const { slug, preview } = await readRoute(props);
  // The home page lives at the bare /help.
  if (slug === HELP_HOME_SLUG) permanentRedirect(helpHref(HELP_HOME_SLUG, { preview }));

  const { navigation, page } = await getDocsPageWithNavigation(slug, preview);
  if (!page) notFound();

  return <HelpCenter navigation={navigation} page={page} />;
}
