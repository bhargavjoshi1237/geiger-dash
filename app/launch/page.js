import { LaunchPage } from "@/components/product-pages/launch/launch_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = {
  title: "Publish, sell and deliver",
  description:
    "Sell tickets and run the door with Events, publish content through an API with Content, hand over approved media with Assets, and put a gateway in front of your APIs with Pods, all on one Geiger account.",
  alternates: { canonical: "/launch" },
};

export default function Page() {
  return <LaunchPage />;
}
