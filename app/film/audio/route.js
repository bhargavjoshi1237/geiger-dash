import fs from "node:fs/promises";
import path from "node:path";
import { MUSIC as SUITE_MUSIC } from "@/components/film/timeline";
import { CUT_MUSIC, MUSIC as EVENTS_MUSIC } from "@/components/film/events/timeline";

const MUSIC = { suite: SUITE_MUSIC, events: EVENTS_MUSIC, "events-15": CUT_MUSIC };

// Serves a film's music (?film=<id>) to the /film preview in development; it never ships.
export async function GET(request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const music = MUSIC[new URL(request.url).searchParams.get("film")] ?? SUITE_MUSIC;
  try {
    const data = await fs.readFile(path.join(process.cwd(), music.file));
    return new Response(data, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
