import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { PAGE_TYPE_HUB } from "@/lib/pages-studio/skills";

const SITE_URL = "https://geiger.studio";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Editor content is HTML; plain-text drafts are wrapped into paragraphs.
function formatPageContent(content) {
  const value = String(content || "").trim();
  if (!value) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

// Renders one published SEO page: breadcrumb (UI + JSON-LD), hero, product CTA,
// body, and a closing CTA. Shared by /solutions, /product, /features.
export function SeoPageView({ page, pageType }) {
  const hub = PAGE_TYPE_HUB[pageType] || PAGE_TYPE_HUB.solution;
  const productApp = resolveProductApp(page.product);
  const heroHeading = page.hero_heading || page.title;
  const heroSubheading = page.hero_subheading || page.excerpt;
  const ctaLabel =
    page.hero_cta_text || (productApp ? `Explore ${productApp.name}` : "Get started");
  const pageUrl = `${SITE_URL}/${hub.path}/${page.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: hub.label, item: `${SITE_URL}/${hub.path}` },
      { "@type": "ListItem", position: 3, name: page.title, item: pageUrl },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link href={`/${hub.path}`} className="transition-colors hover:text-foreground">
            {hub.label}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{page.title}</span>
        </nav>

        <header className="mt-10 border-b border-border/70 pb-10 sm:pb-12">
          {productApp ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {productApp.name} · {hub.label}
            </p>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            {heroHeading}
          </h1>
          {heroSubheading ? (
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {heroSubheading}
            </p>
          ) : null}
          {productApp ? (
            <div className="mt-8">
              <Link
                href={productApp.href}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : null}
        </header>

        {page.cover_image ? (
          <div className="relative mt-10 aspect-[16/8.5] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={page.cover_image}
              alt={page.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>
        ) : null}

        <article
          className="mx-auto mt-12 max-w-3xl text-[1rem] leading-8 text-muted-foreground [&_a]:break-words [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/30 [&_blockquote]:pl-6 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-12 [&_hr]:border-border [&_img]:my-10 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_li]:mt-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-5 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: formatPageContent(page.content) }}
        />

        {productApp ? (
          <section className="mt-20 flex flex-col items-start gap-5 rounded-xl border border-border bg-card/70 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to try {productApp.name}?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {productApp.detail}
              </p>
            </div>
            <Link
              href={productApp.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {ctaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
