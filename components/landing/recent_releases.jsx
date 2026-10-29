import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomepageChangelogs } from "@/lib/public-content/queries";
import { DISPLAY } from "@/components/landing/landing_font";

function formatReleaseDate(value) {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return "Upcoming";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Latest changelog entries, written from each push to a Geiger app.
export async function RecentReleases() {
  const entries = await getHomepageChangelogs();

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className={`${DISPLAY} text-4xl leading-[0.9] text-foreground sm:text-5xl`}>Shipped lately.</h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary dark:text-muted-foreground">
          Every push to a Geiger app becomes an entry, written from the change itself.
        </p>
        <Link
          href="/changelog"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          Full changelog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="lg:col-span-8">
        {entries?.length ? (
          <ol className="divide-y divide-border border-y border-border">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/changelog/${entry.id}`}
                  className="group grid gap-1 py-5 transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-ring sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-3"
                >
                  <time dateTime={entry.release_date ?? undefined} className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatReleaseDate(entry.release_date)}
                  </time>
                  <span className="text-base font-medium text-foreground">{entry.title}</span>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No changelog entries are published yet. New ones appear here as they ship.
          </p>
        )}
      </div>
    </section>
  );
}

export default RecentReleases;
