import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { FlowIssuesPage } from "@/components/product-pages/apps/flow/issues_page";
import { FlowProjectsPage } from "@/components/product-pages/apps/flow/projects_page";
import { FlowTeamPage } from "@/components/product-pages/apps/flow/team_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "issues": FlowIssuesPage,
  "projects": FlowProjectsPage,
  "team": FlowTeamPage,
};

export function generateStaticParams() {
  return findTour("flow").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("flow", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
