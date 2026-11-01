import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { ContactSplit, CONTACT_LINK } from "../contact-split";
import { getContactIdentity } from "../queries";
import SupportForm from "./support-form";

export const metadata = {
  title: "Contact Support — Geiger Studios",
  description: "Ask product questions, report problems, or leave feedback for the Geiger Studios team.",
  alternates: {
    canonical: "/contact/support",
  },
};

const POINTS = ["Ask product questions", "Report problems or unexpected behavior", "Leave feedback"];

export default async function ContactSupportPage() {
  const identity = await getContactIdentity();

  return (
    <ContactSplit
      title="Contact support"
      points={POINTS}
      note={
        <>
          Questions about plans, pricing, or demos?{" "}
          <Link href="/contact/sales" className={CONTACT_LINK}>
            Contact sales
          </Link>
          <br />
          You can also email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={CONTACT_LINK}>
            {CONTACT_EMAIL}
          </a>
        </>
      }
    >
      <SupportForm identity={identity} />
    </ContactSplit>
  );
}
