import Link from "next/link";
import ChangelogWidget from "./changelog_widget";
import { getHomepageChangelogs } from "@/lib/public-content/queries";

function formatReleaseDate(value) {
  if (!value) return "TBD";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "TBD";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ChangeLogComponent() {
  const changelogs = await getHomepageChangelogs();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <p className="text-2xl">Change Log</p>
      </div>
      <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-4 px-4 py-4 sm:px-6 md:grid-cols-3">
        {(changelogs || []).slice(0, 3).map((entry) => (
          <Link key={entry.id} href="/changelog" className="block h-full w-full">
            <ChangelogWidget date={formatReleaseDate(entry.release_date)} title={entry.title} />
          </Link>
        ))}
        {(!changelogs || changelogs.length === 0) && (
          <p className="text-sm text-muted-foreground">No changelog entries published yet.</p>
        )}
      </div>
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <Link href="/changelog" className="mt-12 text-foreground hover:underline">
          See what is new in Geiger Studio -&gt;
        </Link>
      </div>
    </div>
  );
}
