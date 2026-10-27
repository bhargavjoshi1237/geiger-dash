import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { PropertyLeasingPage } from "@/components/product-pages/apps/property/leasing_page";
import { PropertyMaintenancePage } from "@/components/product-pages/apps/property/maintenance_page";
import { PropertyAccountingPage } from "@/components/product-pages/apps/property/accounting_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "leasing": PropertyLeasingPage,
  "maintenance": PropertyMaintenancePage,
  "accounting": PropertyAccountingPage,
};

export function generateStaticParams() {
  return findTour("property").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("property", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
