import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { GreyKnowledgeBasesPage } from "@/components/product-pages/apps/grey/knowledge_bases_page";
import { GreyAnswersPage } from "@/components/product-pages/apps/grey/answers_page";
import { GreyDeliveryPage } from "@/components/product-pages/apps/grey/delivery_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "knowledge-bases": GreyKnowledgeBasesPage,
  "answers": GreyAnswersPage,
  "delivery": GreyDeliveryPage,
};

export function generateStaticParams() {
  return findTour("grey").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("grey", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
