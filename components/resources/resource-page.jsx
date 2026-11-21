import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@geiger/ui";

const SITE_URL = "https://geiger.studio";

// Shared shell for the organiser resources (fee calculators, comparisons, form templates): breadcrumb, hero, body, FAQ, related links, CTA.
export function ResourcePage({ section, path, title, description, highlights = [], checked, faqs = [], related = [], relatedTitle = "Related resources", cta, jsonLd = [], children }) {
  const url = `${SITE_URL}${path}`;
  const structuredData = [
    ...jsonLd,
    faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
        }
      : null,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Geiger Studios", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: section.label, item: `${SITE_URL}${section.href}` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="border-b border-border pt-28 sm:pt-32">
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
            <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-text-secondary" aria-label="Breadcrumb">
              <Link href="/" className="transition-colors hover:text-foreground">Geiger</Link>
              <span>/</span>
              <Link href={section.href} className="transition-colors hover:text-foreground">{section.label}</Link>
              <span>/</span>
              <span className="text-foreground">{title}</span>
            </nav>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
              <div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
                {highlights.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {highlights.map((highlight) => (
                      <span key={highlight} className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}
                {checked ? <p className="mt-4 text-xs text-text-tertiary">Last checked {checked}</p> : null}
              </div>
            </div>
          </div>
        </section>

        {children}

        {faqs.length ? (
          <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.035em]">Common questions</h2>
            </div>
            <Accordion type="single" collapsible className="border-t border-border">
              {faqs.map((faq, index) => (
                <AccordionItem value={`faq-${index}`} key={faq.question}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="pr-8 leading-6 text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        {related.length ? (
          <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">{relatedTitle}</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.href} href={item.href} className="group rounded-xl border border-border p-5 transition hover:bg-surface-hover">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-medium">{item.label}</h3>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    {item.description ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {cta ? <ResourceCta {...cta} /> : null}
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}

export function ResourceCta({ title, body, href, label }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface-subtle p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
        <Link href={href} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
          {label} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

// Grid of cards for the resource hubs (/tools fee calculators, /compare, /templates).
export function ResourceIndex({ title, description, items, children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />
      <main className="relative z-10">
        <section className="border-b border-border px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <div className="mx-auto max-w-6xl">
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Link key={item.href} href={item.href} className="group relative flex min-h-52 flex-col rounded-xl border border-border bg-surface-subtle p-5 transition-colors hover:border-border-strong hover:bg-surface-card">
                <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-8 text-lg font-semibold tracking-tight">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
