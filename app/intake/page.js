import { IntakePage } from "@/components/product-pages/intake/intake_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";

export const metadata = {
  title: "Intake and inboxes",
  description:
    "Conversations, form responses, registrations and new issues each land in a queue built for them: Comms, Forms, Events and Flow on one Geiger account.",
  alternates: { canonical: "/intake" },
};

export default function Page() {
  return <IntakePage />;
}
