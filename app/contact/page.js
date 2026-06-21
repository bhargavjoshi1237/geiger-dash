import Link from "next/link";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { PublicPageHero } from "@/components/public-page-hero";
import { Button } from "@/components/ui/button";
import ContactForm from "./contact-form";

export const metadata = {
  title: "Contact Sales — Geiger Studios",
  description:
    "Get in touch with our sales team to learn how Geiger Studios can work for your organization.",
  alternates: {
    canonical: "/contact",
  },
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email us directly",
    value: "info@geiger.studio",
    href: "mailto:info@geiger.studio",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within one business day",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-16">
            <PublicPageHero
              eyebrow="Contact sales"
              title="Let's talk about your team."
              description="Tell us about your organisation and what you're trying to accomplish. We'll find the right plan and get you set up."
            />
          </div>

          <div className="grid gap-16 lg:grid-cols-[1fr_340px]">
            <ContactForm />

            <aside className="flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-5 text-sm font-semibold">Contact details</p>
                <ul className="space-y-5">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                        <Icon className="size-3.5 text-muted-foreground" />
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-0.5 text-sm font-medium hover:text-muted-foreground transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-semibold">Need help instead?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  For product support, billing questions, or account issues, our
                  support team is the fastest route.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href="mailto:support@geiger.studio">
                    Contact support
                    <ArrowRight className="size-3.5" />
                  </a>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-semibold">Explore pricing first?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  See how plans are structured and estimate your cost before
                  reaching out.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/pricing">
                    View pricing
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
