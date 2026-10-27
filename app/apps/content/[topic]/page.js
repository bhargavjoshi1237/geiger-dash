import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { ContentModellingPage } from "@/components/product-pages/apps/content/modelling_page";
import { ContentPublishingPage } from "@/components/product-pages/apps/content/publishing_page";
import { ContentDeliveryPage } from "@/components/product-pages/apps/content/delivery_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "modelling": ContentModellingPage,
  "publishing": ContentPublishingPage,
  "delivery": ContentDeliveryPage,
};

export function generateStaticParams() {
  return findTour("content").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("content", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
