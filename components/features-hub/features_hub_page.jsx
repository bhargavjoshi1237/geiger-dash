import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { SessionLink } from "@/components/session-link";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/components/landing/hero";
import { FeatureCard } from "@/components/features-hub/feature_card";
import { FeaturesHero } from "@/components/features-hub/features_hero";
import { isWideCard, resolveFeatureMotif } from "@/components/features-hub/motif_map";
import { scrambleText } from "@/components/features-hub/random";
import { getPublishedSeoPagesByType } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";
import { PAGE_TYPE_HUB, buildSeoPagePath } from "@/lib/pages-studio/skills";

// /features and /features/<product>: Linear's features page, one animated card per published feature page.
export async function FeaturesHubPage({ product }) {
  const pages = await getPublishedSeoPagesByType("feature", product);
  const app = product ? resolveProductApp(product) : null;
  const ordered = [...pages].sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)));

  const title = app ? `Everything Geiger ${app.name} can do` : "The features behind every Geiger app";
  const description = app ? `${app.detail}, explored one feature at a time.` : PAGE_TYPE_HUB.feature.description;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      {/* pt-12 clears the fixed 48px header so the tile rows start flush under it, as on Linear. */}
      <main className="flex-1 pt-12 pb-24">
        <FeaturesHero title={title} description={description} />

        <section aria-label="Features" className="mx-auto mt-20 w-full max-w-6xl px-4 sm:mt-32 sm:px-6">
          {ordered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {ordered.map((page, index) => {
                const { motif, variant } = resolveFeatureMotif(page);
                const line = page.hero_heading || page.excerpt || page.title;
                const lastWord = line.trim().split(/\s+/).pop() || "";
                return (
                  <FeatureCard
                    key={page.id}
                    href={buildSeoPagePath("feature", page.product, page.slug)}
                    title={page.title}
                    description={line}
                    motif={motif}
                    variant={variant}
                    seed={page.slug}
                    scramble={motif === "cipher" ? scrambleText(lastWord, page.slug) : null}
                    wide={isWideCard(index)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Nothing published here yet.
            </div>
          )}
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:mt-32 sm:px-6">
          <div className="flex flex-col gap-6 border-t border-border pt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-16">
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
              Run the whole show from one account.
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/pricing" className={SECONDARY_CTA}>
                See pricing
              </Link>
              <SessionLink label="Get started" signedInLabel="Open your workspace" className={PRIMARY_CTA}>
                <ArrowRight className="h-4 w-4" />
              </SessionLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
