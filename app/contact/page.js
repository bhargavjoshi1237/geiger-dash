import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact";
import { CONTACT_HEADING } from "./contact-split";

export const metadata = {
  title: "Contact — Geiger Studios",
  description: "Talk to sales, get product support, or reach the Geiger Studios team about anything else.",
  alternates: {
    canonical: "/contact",
  },
};

const CHANNELS = [
  {
    title: "Sales",
    description: "Speak to our sales team about plans, pricing, larger teams, or request a demo.",
    label: "Talk to sales",
    href: "/contact/sales",
  },
  {
    title: "Support",
    description: "We are here to help. Ask product questions, report problems, or leave feedback.",
    label: "Contact support",
    href: "/contact/support",
  },
  {
    title: "Other inquiries",
    description: "Get in touch with our team for press inquiries, partnerships, or other questions.",
    label: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
];

const RESOURCES = [
  {
    title: "Help Center",
    description: "Learn how every Geiger app works",
    label: "Open the Help Center",
    href: "/help",
  },
  {
    title: "Changelog",
    description: "See what shipped across the suite",
    label: "Read the changelog",
    href: "/changelog",
  },
  {
    title: "Pricing",
    description: "Compare plans and estimate your cost",
    label: "View pricing",
    href: "/pricing",
  },
  {
    title: "Why Geiger",
    description: "What each app does and who it suits",
    label: "Read why Geiger",
    href: "/why-geiger",
  },
];

export default function ContactPage() {
  return (
    <>
      <h1 className={CONTACT_HEADING}>How can we help?</h1>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {CHANNELS.map(({ title, description, label, href }) => {
          const isMail = href.startsWith("mailto:");
          const Anchor = isMail ? "a" : Link;
          return (
            <div
              key={title}
              className="relative flex min-h-[230px] flex-col rounded-[14px] border border-border bg-surface-subtle p-6 transition-colors hover:bg-surface-hover"
            >
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</h2>
              <p className="mt-auto pt-10 text-sm leading-6 text-muted-foreground">{description}</p>
              <Anchor
                href={href}
                className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/85 after:absolute after:inset-0 after:rounded-[14px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
              >
                {label}
                {isMail ? null : <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />}
              </Anchor>
            </div>
          );
        })}
      </div>

      <section className="mt-20 grid gap-10 md:grid-cols-3 md:gap-4" aria-labelledby="contact-resources">
        <h2 id="contact-resources" className="text-[15px] font-medium text-foreground">
          Resources
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 md:col-span-2 md:gap-x-4 md:gap-y-12">
          {RESOURCES.map(({ title, description, label, href }) => (
            <div key={title} className="sm:border-l sm:border-border sm:pl-6">
              <h3 className="text-[15px] font-medium text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
              <Link
                href={href}
                className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
