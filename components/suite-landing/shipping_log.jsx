import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomepageChangelogs } from "@/lib/public-content/queries";
import { SectionIntro } from "@/components/suite-landing/section_intro";

function formatReleaseDate(value) {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return "Upcoming";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// The three latest changelog entries, as proof the suite ships every week.
export async function ShippingLog() {
  const entries = await getHomepageChangelogs();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionIntro
        title="New in the suite"
        description="Every push to a Geiger app becomes a changelog entry, written from the actual change."
      >
        <div className="flex shrink-0 gap-5 text-sm">
          <Link href="/changelog" className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline">
            Full changelog
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog" className="text-text-secondary underline-offset-4 hover:text-foreground hover:underline dark:text-muted-foreground">
            Read the blog
          </Link>
        </div>
      </SectionIntro>

      {entries?.length ? (
        <ol className="divide-y divide-border border-y border-border">
          {entries.slice(0, 3).map((entry) => (
            <li key={entry.id}>
              <Link
                href="/changelog"
                className="group grid gap-1 py-5 transition-colors hover:bg-surface-subtle sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-3"
              >
                <time dateTime={entry.release_date ?? undefined} className="font-mono text-xs text-muted-foreground tabular-nums">
                  {formatReleaseDate(entry.release_date)}
                </time>
                <span className="text-base font-medium text-foreground sm:text-lg">{entry.title}</span>
                <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No changelog entries are published yet. They appear here as soon as the first one is.
        </p>
      )}
    </section>
  );
}

export default ShippingLog;
