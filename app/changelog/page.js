import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Wrench, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function FallbackRelease() {
  return {
    id: "fallback-release",
    version: "1.2.0",
    title: "Enhanced collaboration features",
    description:
      "Introducing real-time collaboration tools, sharper planning views, and improved sharing controls across the Geiger product suite.",
    category: "feature",
    product: "geiger-flow",
    release_date: "2026-03-14T00:00:00.000Z",
    is_featured: true,
    image_url: null,
    items: [],
  };
}

const itemIcons = {
  added: Zap,
  changed: ArrowUpRight,
  fixed: Wrench,
  removed: Check,
  deprecated: Check,
};

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: changelogs } = await supabase
    .from("dash_changelog")
    .select("*, items:dash_changelog_items(id,type,description)")
    .order("release_date", { ascending: false });

  const releases = changelogs?.length ? changelogs : [FallbackRelease()];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <section className="grid gap-8 border-b border-border/70 pb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-foreground" />
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Ship log
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Every meaningful change, documented.
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            A running ledger of what changed across Geiger, why it matters, and where the product is heading.
          </p>
        </section>

        <section className="mt-4">
          {releases.map((release, index) => (
            <article
              key={release.id}
              className="grid border-b border-border/70 py-12 lg:grid-cols-[190px_1fr] lg:gap-12 lg:py-16"
            >
              <aside className="mb-8 lg:mb-0">
                <div className="sticky top-24">
                  <p className="font-mono text-2xl font-medium tracking-tight">v{release.version}</p>
                  <time className="mt-2 block text-xs text-muted-foreground" dateTime={release.release_date}>
                    {formatDate(release.release_date)}
                  </time>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{release.product}</Badge>
                    <Badge variant="secondary">{release.category}</Badge>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    {index === 0 ? (
                      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Latest release
                      </p>
                    ) : null}
                    <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                      {release.title}
                    </h2>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
                      {release.description}
                    </p>
                  </div>
                  {release.is_featured ? <Badge>Featured</Badge> : null}
                </div>

                {release.image_url ? (
                  <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={release.image_url}
                      alt={release.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 820px, 100vw"
                    />
                  </div>
                ) : null}

                {release.items?.length ? (
                  <>
                    <Separator className="my-8" />
                    <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                      {release.items.map((item) => {
                        const Icon = itemIcons[item.type] || Check;
                        return (
                          <div key={item.id} className="flex gap-3">
                            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
                              <Icon className="size-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                {item.type}
                              </p>
                              <p className="mt-1 text-sm leading-6">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Looking for implementation details?</p>
          <Button asChild variant="outline">
            <Link href="/docs">
              Read the documentation
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
