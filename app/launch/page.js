import { LaunchPage } from "@/components/product-pages/launch/launch_page";
import { areaMetadata, findArea } from "@/components/product-pages/areas";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = areaMetadata(findArea("launch"));

export default function Page() {
  return <LaunchPage />;
}
