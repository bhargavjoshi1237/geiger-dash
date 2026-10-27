import { notFound } from "next/navigation";
import { AUDIENCE_PAGES, findAudiencePage, pageMetadata } from "@/components/product-pages/tours";
import { OrganisersPage } from "@/components/product-pages/for/organisers_page";
import { StudiosPage } from "@/components/product-pages/for/studios_page";
import { OperationsPage } from "@/components/product-pages/for/operations_page";
import { DevelopersPage } from "@/components/product-pages/for/developers_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "event-organisers": OrganisersPage,
  "creative-studios": StudiosPage,
  operations: OperationsPage,
  developers: DevelopersPage,
};

export function generateStaticParams() {
  return AUDIENCE_PAGES.map((page) => ({ audience: page.id }));
}

export async function generateMetadata({ params }) {
  const { audience } = await params;
  return pageMetadata(findAudiencePage(audience));
}

export default async function Page({ params }) {
  const { audience } = await params;
  const Component = PAGES[audience];
  if (!Component) notFound();
  return <Component />;
}
