import Link from "next/link";
import ChangelogWidget from "./changelog_widget";
import { createClient } from "@/utils/supabase/server";

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
  const supabase = await createClient();

  const { data: changelogs } = await supabase
    .from("dash_changelog")
    .select("id, title, release_date")
    .order("release_date", { ascending: false })
    .limit(4);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <p className="text-2xl">Change Log</p>
      </div>
      <div className="flex w-full max-w-7xl flex-wrap items-stretch justify-center gap-4 px-4 py-4 sm:px-6">
        {(changelogs || []).map((entry) => (
          <Link key={entry.id} href="/changelog" className="block w-full sm:w-auto">
            <ChangelogWidget date={formatReleaseDate(entry.release_date)} title={entry.title} />
          </Link>
        ))}
        {(!changelogs || changelogs.length === 0) && (
          <p className="text-sm text-zinc-400">No changelog entries published yet.</p>
        )}
      </div>
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <Link href="/changelog" className="mt-12 text-white hover:underline">
          See what is new in Geiger Studio -&gt;
        </Link>
      </div>
    </div>
  );
}
