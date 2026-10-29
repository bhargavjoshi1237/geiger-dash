import { notFound } from "next/navigation";
import { TEAM_PAGES, findTeamPage, pageMetadata } from "@/components/product-pages/tours";
import { CorporatePage } from "@/components/product-pages/teams/corporate_page";
import { CreativePage } from "@/components/product-pages/teams/creative_page";
import { ManagementPage } from "@/components/product-pages/teams/management_page";
import { MarketingPage } from "@/components/product-pages/teams/marketing_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  corporate: CorporatePage,
  creative: CreativePage,
  management: ManagementPage,
  marketing: MarketingPage,
};

export function generateStaticParams() {
  return TEAM_PAGES.map((page) => ({ team: page.id }));
}

export async function generateMetadata({ params }) {
  const { team } = await params;
  return pageMetadata(findTeamPage(team));
}

export default async function Page({ params }) {
  const { team } = await params;
  const Component = PAGES[team];
  if (!Component) notFound();
  return <Component />;
}
