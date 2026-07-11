import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { PublicPageHero } from "@/components/public-page-hero";
import { getPublishedSeoPagesByType } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { PAGE_TYPE_HUB } from "@/lib/pages-studio/skills";

// Hub page listing every published page of one type — the middle rung of the
// breadcrumb and the internal-linking anchor for the type's pages.
export async function SeoHubPage({ pageType }) {
  const hub = PAGE_TYPE_HUB[pageType] || PAGE_TYPE_HUB.solution;
  const pages = await getPublishedSeoPagesByType(pageType);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <PublicPageHero eyebrow="Geiger Studio" title={hub.title} description={hub.description} />

        {pages.length ? (
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {pages.map((page) => {
              const productApp = resolveProductApp(page.product);
              return (
                <Link
                  key={page.id}
                  href={`/${hub.path}/${page.slug}`}
                  className="group flex min-h-64 flex-col bg-background p-6 transition-colors hover:bg-muted/40"
                >
                  {page.cover_image ? (
                    <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={page.cover_image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 640px) 420px, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {productApp ? <Badge variant="outline">{productApp.name}</Badge> : null}
                      {page.is_featured ? <Badge variant="secondary">Featured</Badge> : null}
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight">
                    {page.hero_heading || page.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {page.hero_subheading || page.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-sm text-muted-foreground">
            Nothing published here yet.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
