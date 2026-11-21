import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@geiger/ui/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button } from "@geiger/ui";
import { PublicPageHero } from "@/components/public-page-hero";
import { SHOWCASE_BACKGROUND_IMAGES } from "@/lib/showcase-backgrounds";

const SITE_URL = "https://geiger.studio";
const GRID_BACKDROP =
  "pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]";

// Same painting for the same page on every render, so pages stay cacheable and neighbours differ.
export function backdropFor(key) {
  const hash = [...String(key)].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
  return SHOWCASE_BACKGROUND_IMAGES[hash % SHOWCASE_BACKGROUND_IMAGES.length];
}

// The live piece of a page (calculator, fee table, form) in an app window on one of the landing page's painted backdrops.
export function Showcase({ backdrop, label, children }) {
  return (
    <div className="mt-10 rounded-xl bg-cover bg-center bg-no-repeat p-2 sm:p-8" style={{ backgroundImage: `url('${backdrop}')` }}>
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl dark:border-[#313131]">
        {label ? (
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="ml-2 truncate text-xs text-muted-foreground">{label}</span>
          </div>
        ) : null}
        <div className="p-3 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

// Blog-style section: an uppercase label over a rule, with an optional note on the right.
export function ResourceSection({ title, note, children, className = "mt-20" }) {
  return (
    <section className={className}>
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em]">{title}</h2>
        {note ? <span className="font-mono text-xs text-muted-foreground">{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

// Shared shell for the organiser resources (fee calculators, comparisons, form templates), laid out like a blog post.
export function ResourcePage({ section, path, kind, title, description, meta = [], showcase, faqs = [], related = [], relatedTitle = "Related resources", cta, jsonLd = [], children }) {
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className={GRID_BACKDROP} />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <Link href={section.href} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to {section.label}
        </Link>

        <header className="mt-10 border-b border-border/70 pb-10 sm:pb-12">
          {kind ? <Badge variant="outline">{kind}</Badge> : null}
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          {meta.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {meta.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2">
                  {Icon ? <Icon className="size-3.5" /> : null}
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {showcase}
        {children}

        {faqs.length ? (
          <ResourceSection title="Common questions" note={String(faqs.length).padStart(2, "0")}>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem value={`faq-${index}`} key={faq.question}>
                  <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                  <AccordionContent className="max-w-3xl pr-8 text-sm leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ResourceSection>
        ) : null}

        {related.length ? (
          <ResourceSection title={relatedTitle}>
            <div className="grid overflow-hidden rounded-xl border-l border-t border-border sm:grid-cols-2 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href} className="group flex min-h-40 flex-col border-b border-r border-border bg-background p-6 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span>{item.kind ?? "Resource"}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug tracking-tight">{item.label}</h3>
                  {item.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                </Link>
              ))}
            </div>
          </ResourceSection>
        ) : null}

        {cta ? <ResourceCta {...cta} /> : null}
      </main>
      <Footer />
    </div>
  );
}

export function ResourceCta({ title, body, href, label }) {
  return (
    <section className="mt-20 flex flex-col items-start gap-5 rounded-xl border border-border bg-card/70 p-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
      <Link href={href} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}

// A small app window on a painted backdrop, showing a few label/value rows; used as the index thumbnails and lead image.
function PreviewArt({ backdrop, title, rows = [], large = false }) {
  return (
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025]" style={{ backgroundImage: `url('${backdrop}')` }}>
      <div className={`absolute inset-x-[10%] top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-black/70 shadow-2xl backdrop-blur-md ${large ? "p-5" : "p-2"}`}>
        {title ? <p className={`text-white/50 ${large ? "mb-1 text-xs" : "text-[8px]"}`}>{title}</p> : null}
        {rows.map((row) => (
          <div key={row.label} className={`flex items-baseline justify-between gap-3 border-b border-white/10 last:border-0 ${large ? "py-2.5 text-sm" : "py-1 text-[9px]"}`}>
            <span className="truncate text-white/60">{row.label}</span>
            <span className="shrink-0 font-medium tabular-nums text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hub pages (/compare, /templates) laid out like the blog index: a lead card, then a numbered list.
export function ResourceIndex({ title, description, listTitle, items, children }) {
  const [lead, ...rest] = items;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className={GRID_BACKDROP} />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <PublicPageHero title={title} description={description} />

        {lead ? (
          <Link href={lead.href} className="group mt-10 grid overflow-hidden rounded-xl border border-border bg-card/70 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative min-h-72 overflow-hidden bg-muted lg:min-h-[400px]">
              <PreviewArt backdrop={backdropFor(lead.href)} title={lead.previewTitle} rows={lead.preview} large />
              <Badge className="absolute left-5 top-5 border-white/15 bg-black/45 text-white backdrop-blur-md">Start here</Badge>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              {lead.meta ? <p className="text-xs text-muted-foreground">{lead.meta}</p> : <span />}
              <div className="mt-16">
                {lead.badge ? <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{lead.badge}</p> : null}
                <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em]">{lead.label}</h2>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">{lead.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                  Open
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ) : null}

        {rest.length ? (
          <section className="mt-20">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-sm font-medium uppercase tracking-[0.18em]">{listTitle}</h2>
              <span className="font-mono text-xs text-muted-foreground">{String(items.length).padStart(2, "0")} in total</span>
            </div>
            <div>
              {rest.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group grid gap-5 border-b border-border/70 py-7 transition-colors hover:bg-muted/25 sm:grid-cols-[52px_160px_1fr_auto] sm:items-center sm:px-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 2).padStart(2, "0")}</span>
                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-md bg-muted sm:block">
                    <PreviewArt backdrop={backdropFor(item.href)} title={item.previewTitle} rows={item.preview?.slice(0, 3)} />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                      {item.meta ? <span className="text-xs text-muted-foreground">{item.meta}</span> : null}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{item.label}</h3>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex" tabIndex={-1} asChild>
                    <span>
                      <ArrowUpRight className="size-4" />
                    </span>
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {children}
      </main>
      <Footer />
    </div>
  );
}
