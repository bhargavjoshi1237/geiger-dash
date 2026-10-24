"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Wrench, Zap } from "lucide-react";
import { Badge, Button, LogoLoading, Separator } from "@geiger/ui";
import { loadChangelogPageAction } from "@/app/changelog/actions";

const itemIcons = {
  added: Zap,
  changed: ArrowUpRight,
  fixed: Wrench,
  removed: Check,
  deprecated: Check,
};

// Pinned to UTC so the server render and the browser agree on the day.
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ReleaseArticle({ release, latest }) {
  return (
    <article className="grid border-b border-border/70 py-12 lg:grid-cols-[190px_1fr] lg:gap-12 lg:py-16">
      <aside className="mb-8 lg:mb-0">
        <div className="sticky top-24">
          <p className="font-mono text-2xl font-medium tracking-tight">v{release.version}</p>
          <time className="mt-2 block text-xs text-muted-foreground" dateTime={release.release_date}>
            {formatDate(release.release_date)}
          </time>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {release.product.replaceAll("-", " ")}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {release.category}
            </Badge>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-5">
          <div>
            {latest ? (
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Latest release
              </p>
            ) : null}
            <Link
              href={`/changelog/${release.id}`}
              className="group/title inline-flex max-w-3xl items-start gap-3"
            >
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                {release.title}
              </h2>
              <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-foreground" />
            </Link>
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

        <Link
          href={`/changelog/${release.id}`}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View release
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

// The first page arrives server-rendered; each older page loads as the reader nears the end of the list.
export function ChangelogFeed({ initialReleases, initialCursor }) {
  const [releases, setReleases] = useState(initialReleases);
  const [cursor, setCursor] = useState(initialCursor);
  const [status, setStatus] = useState("idle");
  const sentinel = useRef(null);
  const loading = useRef(false);

  const loadMore = useCallback(async () => {
    if (!cursor || loading.current) return;
    loading.current = true;
    setStatus("loading");

    const page = await loadChangelogPageAction(cursor).catch(() => null);
    loading.current = false;
    if (!page) {
      setStatus("error");
      return;
    }

    // A release can only repeat if the feed changed mid-scroll; keep the first copy.
    setReleases((current) => {
      const seen = new Set(current.map((release) => release.id));
      return [...current, ...page.releases.filter((release) => !seen.has(release.id))];
    });
    setCursor(page.nextCursor);
    setStatus("idle");
  }, [cursor]);

  // Re-observed after each page, so a short page that leaves the end in view loads the next one too.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !cursor || status === "error") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [cursor, status, loadMore]);

  return (
    <>
      <section className="mt-4">
        {releases.map((release, index) => (
          <ReleaseArticle key={release.id} release={release} latest={index === 0} />
        ))}
      </section>

      {cursor ? (
        <div ref={sentinel} className="flex min-h-28 items-center justify-center py-10" aria-live="polite">
          {status === "error" ? (
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <p>Couldn&apos;t load older releases.</p>
              <Button variant="outline" size="sm" onClick={loadMore}>
                Try again
              </Button>
            </div>
          ) : status === "loading" ? (
            <LogoLoading size={36} aria-label="Loading older releases" />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default ChangelogFeed;
