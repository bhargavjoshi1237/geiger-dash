import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { FormsBuilderPage } from "@/components/product-pages/apps/forms/builder_page";
import { FormsResponsesPage } from "@/components/product-pages/apps/forms/responses_page";
import { FormsShareAndSellPage } from "@/components/product-pages/apps/forms/share_and_sell_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "builder": FormsBuilderPage,
  "responses": FormsResponsesPage,
  "share-and-sell": FormsShareAndSellPage,
};

export function generateStaticParams() {
  return findTour("forms").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("forms", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
