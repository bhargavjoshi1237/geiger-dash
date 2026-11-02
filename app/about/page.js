import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

const SITE_URL = "https://geiger.studio";
const DESCRIPTION = "Who builds Geiger Studios, what is in the suite, and how we write and correct what we publish.";

export const metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Geiger Studios", description: DESCRIPTION, url: "/about", type: "website" },
};

const APPS = [
  { href: "/events", name: "Events", body: "Event pages, ticketing, reserved seating and QR check-in." },
  { href: "/forms", name: "Forms", body: "Forms and surveys with conditional logic, scoring and a responses inbox." },
  { href: "/flow", name: "Flow", body: "Projects, issues and milestones for the work behind them." },
  { href: "/notes", name: "Notes", body: "Shared canvases and documents for working things out together." },
  { href: "/grey", name: "Grey", body: "Answers from your team's own files, with the sources cited." },
  { href: "/assets", name: "Assets", body: "A shared library for your team's files and media." },
];

const STANDARDS = [
  ["We check product claims against what ships.", "New posts are checked against the product, and when something has a limit, we say so. We're still working through older posts and pages, so tell us if one doesn't match what you see."],
  ["We link to the source.", "Figures and quotes from other people link to where they came from, and we date comparisons with other tools because those products change."],
  ["We say when it's our own product.", "We build what we sell, so anything we write about Geiger, or about tools we compete with, comes from that position."],
  ["We use AI tools.", "AI helps with research, drafting and review on this blog. The person or team named on a post is responsible for what it says."],
  ["We fix mistakes.", "If something is wrong or out of date, tell us through the contact page and we'll correct it."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  name: "About Geiger Studios",
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">About Geiger Studios</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
          Geiger Studios is a suite of connected apps for teams, with one account across events, forms, projects, notes and AI answers from your own files. It&apos;s in open alpha, so expect it to change quickly.
        </p>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">What&apos;s in the suite</h2>
          <ul className="mt-6 divide-y divide-border/70 border-y border-border/70">
            {APPS.map((app) => (
              <li key={app.href} className="py-4">
                <Link href={app.href} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {app.name}
                </Link>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{app.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/why-geiger" className="font-medium text-foreground underline underline-offset-4">
              Compare every app
            </Link>{" "}
            with the tools it replaces.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Who builds it</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            <Link href="/blog/authors/bhargav-joshi" className="font-medium text-foreground underline underline-offset-4">
              Bhargav Joshi
            </Link>{" "}
            builds Geiger Studios and writes about it here, working across the apps, their shared backend and the AI systems behind them.
          </p>
        </section>

        <section id="editorial" className="mt-14 scroll-mt-28">
          <h2 className="text-2xl font-semibold tracking-tight">How we write</h2>
          <dl className="mt-6 space-y-5">
            {STANDARDS.map(([title, body]) => (
              <div key={title}>
                <dt className="font-medium text-foreground">{title}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Get in touch</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            For sales, support or a correction to something we&apos;ve published, use the{" "}
            <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
              contact page
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
