import { notFound } from "next/navigation";
import HelpCenter from "@/components/help/help_center";
import { getDocsPageWithNavigation } from "@/lib/docs/queries";
import { HELP_HOME_SLUG } from "@/lib/docs/paths";

export async function generateMetadata({ searchParams }) {
  const preview = (await searchParams)?.preview === "1";
  return {
    title: { absolute: "Help Center - Geiger Studio" },
    description: "Guides for the Geiger suite: setting up your organization, running projects, and using each product.",
    alternates: { canonical: "/help" },
    robots: preview ? { index: false, follow: false } : undefined,
  };
}

export default async function HelpPage({ searchParams }) {
  const preview = (await searchParams)?.preview === "1";
  const { navigation, page } = await getDocsPageWithNavigation(HELP_HOME_SLUG, preview);
  if (!page) notFound();

  return <HelpCenter navigation={navigation} page={page} />;
}
