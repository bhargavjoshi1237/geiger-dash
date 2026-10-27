import { PlanPage } from "@/components/product-pages/plan/plan_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = {
  title: "Planning and collaboration",
  description:
    "Plan in Flow's issues, cycles, roadmap and goals, think it through on a live Notes canvas, and talk it over in team chat, all on one Geiger account.",
  alternates: { canonical: "/plan" },
};

export default function Page() {
  return <PlanPage />;
}
