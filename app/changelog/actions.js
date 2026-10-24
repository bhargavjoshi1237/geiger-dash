"use server";

import { getChangelogPage } from "@/lib/public-content/queries";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The next page of the changelog feed. The cursor comes from the browser and lands in a PostgREST filter, so anything but a real timestamp and id is refused.
export async function loadChangelogPageAction(cursor) {
  const releaseDate = String(cursor?.releaseDate || "");
  const id = String(cursor?.id || "");
  if (!UUID.test(id) || /["\\,()]/.test(releaseDate) || Number.isNaN(Date.parse(releaseDate))) return null;

  return getChangelogPage({ cursor: { releaseDate, id } });
}
