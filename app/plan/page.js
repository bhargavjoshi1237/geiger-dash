import { PlanPage } from "@/components/product-pages/plan/plan_page";
import { areaMetadata, findArea } from "@/components/product-pages/areas";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = areaMetadata(findArea("plan"));

export default function Page() {
  return <PlanPage />;
}
