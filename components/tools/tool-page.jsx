import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { PublicHeader } from "@/components/header";
import Footer from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { benefits, tools } from "@/lib/tools/tool-content";
import { TrackedAssetsLink } from "@/components/tools/tracked-assets-link";

export function ToolPage({ content, children }) {
  const relatedTools = tools.filter((tool) => tool.slug !== content.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: content.eyebrow,
      url: `https://geiger.studio/tools/${content.slug}`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any operating system with a modern web browser",
      browserRequirements: "Requires JavaScript and HTML5 Canvas",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: content.description,
      featureList: content.highlights,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Geiger Studios",
          item: "https://geiger.studio/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: "https://geiger.studio/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: content.eyebrow,
          item: `https://geiger.studio/tools/${content.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <main>
        <section className="border-b border-border pt-28 sm:pt-32">
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
            <nav className="mb-7 flex items-center gap-2 text-xs text-text-secondary" aria-label="Breadcrumb">
              <Link href="/" className="transition-colors hover:text-foreground">Geiger</Link>
              <span>/</span>
              <Link href="/tools" className="transition-colors hover:text-foreground">Tools</Link>
              <span>/</span>
              <span className="text-foreground">{content.eyebrow}</span>
            </nav>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {content.eyebrow}
                </p>
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {content.title}
                </h1>
              </div>
              <div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {content.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {content.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="rounded-2xl border border-border bg-card/65 p-3 shadow-[0_24px_80px_rgb(0_0_0/0.08)] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4 px-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Browser workspace
              </p>
              <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <LockKeyhole className="size-3.5" />
                Your file stays on this device
              </p>
            </div>
            {children}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              From source file to finished image.
            </h2>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {content.steps.map((step, index) => (
              <li key={step} className="bg-background p-5">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <p className="mt-8 text-sm leading-6 text-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-border bg-surface-subtle/50">
          <div className="mx-auto grid w-full max-w-6xl gap-px px-4 py-14 sm:grid-cols-3 sm:px-6 lg:py-20">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="border-border p-5 first:pl-0 sm:border-l sm:first:border-l-0 sm:first:pl-5">
                  <Icon className="size-5 text-muted-foreground" />
                  <h2 className="mt-8 text-base font-medium">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Common questions</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              What to know before you convert.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              These tools use standard browser image APIs. Results can vary slightly between browsers, especially at very low quality settings.
            </p>
          </div>
          <Accordion type="single" collapsible className="border-t border-border">
            {content.faqs.map((faq, index) => (
              <AccordionItem value={`faq-${index}`} key={faq.question}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="pr-8 leading-6 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Keep working</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">Related image tools</h2>
              </div>
              <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                Browse all tools <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-xl border border-border p-5 transition hover:bg-surface-hover">
                    <div className="flex items-start justify-between">
                      <Icon className="size-5 text-muted-foreground" />
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <h3 className="mt-8 text-sm font-medium">{tool.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{tool.shortDescription}</p>
                  </Link>
                );
              })}
            </div>
            <TrackedAssetsLink tool={content.slug} />
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
