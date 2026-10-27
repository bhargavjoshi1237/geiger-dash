import * as SUITE from "@/components/film/timeline";
import * as EVENTS from "@/components/film/events/timeline";
import { SHOT_COMPONENTS } from "@/components/film/shots";
import { EVENTS_SHOTS } from "@/components/film/events/shots";

// Every film the /film player can play, by the id in ?film=<id>. `trim` drops cues a shorter cut never reaches.
export const FILMS = {
  suite: { id: "suite", theme: "dark", music: SUITE.MUSIC, bar: SUITE.BAR, edit: SUITE.EDIT, duration: SUITE.DURATION, chapters: SUITE.CHAPTERS, shots: SHOT_COMPONENTS },
  events: { id: "events", theme: "light", music: EVENTS.MUSIC, bar: EVENTS.BAR, edit: EVENTS.EDIT, duration: EVENTS.DURATION, chapters: EVENTS.CHAPTERS, shots: EVENTS_SHOTS },
  "events-15": { id: "events-15", theme: "light", music: EVENTS.CUT_MUSIC, bar: EVENTS.BAR, edit: EVENTS.CUT_EDIT, duration: EVENTS.CUT_DURATION, chapters: [], shots: EVENTS_SHOTS, trim: true },
};

// Film time → where the music bed is: the track segment playing, the track time inside it, and the film time it began.
export function trackAt(music, time) {
  const segments = music.segments ?? [[music.start, Infinity]];
  let offset = 0;
  for (let index = 0; index < segments.length; index++) {
    const [from, to] = segments[index];
    if (time < offset + (to - from) || index === segments.length - 1) return { index, at: from + time - offset, offset, from, to };
    offset += to - from;
  }
  return null;
}
