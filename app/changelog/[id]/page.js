import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  ListChecks,
  Minus,
  Package,
  Plus,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { Badge, cn } from "@geiger/ui";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { getAdjacentChangelogReleases, getChangelogRelease } from "@/lib/public-content/queries";
import { resolveProductApp } from "@/lib/pages-studio/products";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// Display order per item type; types are told apart by icon, colors stay on the neutral theme palette.
const ITEM_TYPES = [
  { type: "added", label: "Added", icon: Plus },
  { type: "changed", label: "Improved", icon: Sparkles },
  { type: "fixed", label: "Fixed", icon: Wrench },
  { type: "removed", label: "Removed", icon: Minus },
  { type: "deprecated", label: "Deprecated", icon: Archive },
];

const NEUTRAL_DOT = "bg-muted-foreground/50";

const CATEGORIES = {
  feature: { label: "New feature", dot: "bg-foreground" },
  improvement: { label: "Improvement", dot: NEUTRAL_DOT },
  bugfix: { label: "Bug fix", dot: NEUTRAL_DOT },
  breaking: { label: "Breaking change", dot: "bg-destructive" },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// "geiger-flow" -> { label: "Geiger Flow", href }; unknown slugs are title-cased with no link.
function productInfo(product) {
  const app = resolveProductApp(product);
  if (app) return { label: app.label, href: app.href };
  const label = String(product || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return { label, href: null };
}

function groupItems(items = []) {
  return ITEM_TYPES.map((meta) => ({
    ...meta,
    items: items.filter((item) => item.type === meta.type),
  })).filter((group) => group.items.length > 0);
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
  return getFallbackRelease(id) || getChangelogRelease(id);
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

function ReleaseDetail({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right text-foreground">{children}</dd>
    </div>
  );
}

function AdjacentRelease({ release, direction }) {
  const isNext = direction === "next";

  // An empty slot links back to the full changelog instead of leaving a blank card.
  if (!release) {
    return (
      <Link
        href="/changelog"
        className={cn(
          "group flex flex-col justify-center gap-2 bg-background p-6 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          isNext && "sm:items-end sm:text-right",
        )}
      >
        <span className="inline-flex items-center gap-2 text-xs">
          <ListChecks className="size-3.5" />
          {isNext ? "This is the latest release" : "This is the first release"}
        </span>
        <span className="text-sm font-medium text-foreground">Browse all releases</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/changelog/${release.id}`}
      className={cn(
        "group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-muted/50",
        isNext && "sm:items-end sm:text-right",
      )}
    >
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        {isNext ? null : (
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        )}
        {isNext ? "Newer release" : "Older release"}
        {isNext ? (
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        ) : null}
      </span>
      <span className="font-mono text-xs text-muted-foreground">v{release.version}</span>
      <span className="text-lg font-semibold leading-snug tracking-tight">{release.title}</span>
      <time className="text-xs text-muted-foreground" dateTime={release.release_date}>
        {formatDate(release.release_date)}
      </time>
    </Link>
  );
}

export default async function ChangelogDetailPage({ params }) {
  const { id } = await params;
  const release = await getRelease(id);

  if (!release) notFound();

  const { previous, next } =
    release.id === "fallback-release"
      ? { previous: null, next: null }
      : await getAdjacentChangelogReleases(release);

  const product = productInfo(release.product);
  const category = CATEGORIES[release.category] || { label: release.category, dot: NEUTRAL_DOT };
  const groups = groupItems(release.items);
  const totalItems = release.items?.length || 0;
  const releasedOn = formatDate(release.release_date);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Changelog
          </Link>
          <ChevronRight className="pointer-events-none size-3.5 opacity-50" />
          <span className="truncate text-foreground/80">{product.label}</span>
        </nav>

        <article className="mt-10">
          <header className="pb-10 sm:pb-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-md border border-border bg-muted/50 px-2 font-mono text-xs font-medium">
                v{release.version}
              </span>
              <Badge variant="outline" className="gap-1.5">
                <span className={cn("size-1.5 rounded-full", category.dot)} />
                {category.label}
              </Badge>
              {release.is_featured ? (
                <Badge variant="secondary" className="gap-1">
                  <Star className="size-3" />
                  Featured
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[3.25rem]">
              {release.title}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {release.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <time className="inline-flex items-center gap-2" dateTime={release.release_date}>
                <Calendar className="size-3.5" />
                {releasedOn}
              </time>
              <span className="inline-flex items-center gap-2">
                <Package className="size-3.5" />
                {product.label}
              </span>
              {totalItems ? (
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="size-3.5" />
                  {totalItems} {totalItems === 1 ? "change" : "changes"}
                </span>
              ) : null}
            </div>
          </header>

          {release.image_url ? (
            <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
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

          <div className="grid gap-10 border-t border-border/70 pt-10 sm:pt-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {groups.length ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    In this release
                  </p>
                  <nav className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
                    {groups.map((group) => (
                      <a
                        key={group.type}
                        href={`#${group.type}`}
                        className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:-mx-2 lg:border-transparent lg:px-2"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className={cn("size-1.5 rounded-full", NEUTRAL_DOT)} />
                          {group.label}
                        </span>
                        <span className="font-mono text-xs tabular-nums">{group.items.length}</span>
                      </a>
                    ))}
                  </nav>
                </>
              ) : null}

              <dl className="mt-8 hidden divide-y divide-border/70 border-y border-border/70 lg:block">
                <ReleaseDetail label="Version">
                  <span className="font-mono text-xs">v{release.version}</span>
                </ReleaseDetail>
                <ReleaseDetail label="Released">
                  {new Date(release.release_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </ReleaseDetail>
                <ReleaseDetail label="Product">
                  {product.href ? (
                    <a href={product.href} className="underline-offset-4 hover:underline">
                      {product.label}
                    </a>
                  ) : (
                    product.label
                  )}
                </ReleaseDetail>
              </dl>
            </aside>

            <div className="min-w-0 space-y-12">
              {groups.length ? (
                groups.map((group) => {
                  const Icon = group.icon;

                  return (
                    <section key={group.type} id={group.type} className="scroll-mt-28">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-card text-foreground">
                          <Icon className="size-4" />
                        </span>
                        <h2 className="text-lg font-semibold tracking-tight">{group.label}</h2>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {group.items.length}
                        </span>
                      </div>

                      <ul className="mt-5 divide-y divide-border/70 overflow-hidden rounded-xl border border-border bg-background/70 backdrop-blur-sm">
                        {group.items.map((item) => (
                          <li
                            key={item.id || item.description}
                            className="flex gap-4 px-5 py-4 text-[0.9375rem] leading-7 text-foreground/90"
                          >
                            <span className={cn("mt-[0.7rem] size-1.5 shrink-0 rounded-full", NEUTRAL_DOT)} />
                            <span className="text-pretty">{item.description}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                  This release does not have additional itemized notes.
                </div>
              )}
            </div>
          </div>
        </article>

        {previous || next ? (
          <nav
            aria-label={`More ${product.label} releases`}
            className="mt-20 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2"
          >
            <AdjacentRelease release={previous} direction="previous" />
            <AdjacentRelease release={next} direction="next" />
          </nav>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
