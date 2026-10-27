import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { AssetsLibraryPage } from "@/components/product-pages/apps/assets/library_page";
import { AssetsApprovalsPage } from "@/components/product-pages/apps/assets/approvals_page";
import { AssetsGalleriesPage } from "@/components/product-pages/apps/assets/galleries_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "library": AssetsLibraryPage,
  "approvals": AssetsApprovalsPage,
  "galleries": AssetsGalleriesPage,
};

export function generateStaticParams() {
  return findTour("assets").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("assets", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
