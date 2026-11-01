import Link from "next/link";
import { ContactSplit, CONTACT_LINK } from "../contact-split";
import { getContactIdentity } from "../queries";
import SalesForm from "./sales-form";

export const metadata = {
  title: "Contact Sales — Geiger Studios",
  description: "Get in touch with our sales team to learn how Geiger Studios can work for your organization.",
  alternates: {
    canonical: "/contact/sales",
  },
};

const POINTS = ["Get a demo", "Find the plan that fits your team", "Get help setting up your workspace"];

export default async function ContactSalesPage() {
  const identity = await getContactIdentity();

  return (
    <ContactSplit
      title="Contact sales"
      points={POINTS}
      note={
        <>
          Technical issues or product questions?{" "}
          <Link href="/contact/support" className={CONTACT_LINK}>
            Contact support
          </Link>
        </>
      }
    >
      <SalesForm identity={identity} />
    </ContactSplit>
  );
}
