import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Wrench, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const itemIcons = {
  added: Zap,
  changed: ArrowUpRight,
  fixed: Wrench,
  removed: Check,
  deprecated: Check,
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getFallbackRelease(id) {
  if (id !== "fallback-release") return null;

  return {
    id,
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

async function getRelease(id) {
  const fallback = getFallbackRelease(id);
  if (fallback) return fallback;

  const supabase = await createClient();
  const { data } = await supabase
    .from("dash_changelog")
    .select("*, items:dash_changelog_items(id,type,description)")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const release = await getRelease(id);

  if (!release) return { title: "Release not found" };

  return {
    title: `${release.title} - v${release.version}`,
    description: release.description,
    alternates: { canonical: `/changelog/${release.id}` },
    openGraph: {
      title: `${release.title} - v${release.version}`,
      description: release.description,
      url: `/changelog/${release.id}`,
      type: "article",
      publishedTime: release.release_date,
      images: release.image_url ? [{ url: release.image_url }] : undefined,
    },
  };
}

export default async function ChangelogDetailPage({ params }) {
  const { id } = await params;
  const release = await getRelease(id);

  if (!release) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <Link
          href="/changelog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Changelog
        </Link>

        <article className="mt-10">
          <header className="border-b border-border/70 pb-10 sm:pb-12">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {release.product.replaceAll("-", " ")}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {release.category}
              </Badge>
              {release.is_featured ? <Badge>Featured</Badge> : null}
            </div>

            <p className="mt-8 font-mono text-sm text-muted-foreground">
              Version {release.version}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
              {release.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {release.description}
            </p>
            <time
              className="mt-6 block text-xs text-muted-foreground"
              dateTime={release.release_date}
            >
              Released {formatDate(release.release_date)}
            </time>
          </header>

          {release.image_url ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={release.image_url}
                alt={release.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          ) : null}

          <section className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Release notes
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              What changed
            </h2>

            {release.items?.length ? (
              <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
                {release.items.map((item) => {
                  const Icon = itemIcons[item.type] || Check;

                  return (
                    <div
                      key={item.id}
                      className="grid gap-4 py-6 sm:grid-cols-[150px_1fr] sm:items-start"
                    >
                      <Badge variant="outline" className="capitalize">
                        <Icon />
                        {item.type}
                      </Badge>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                This release does not have additional itemized notes.
              </div>
            )}
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
