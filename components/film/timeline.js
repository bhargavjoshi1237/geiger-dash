// The film's edit: the music's tempo grid, then every shot and chapter placed on it in bars.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// "Ramp It Up" (Mixkit, 120 BPM). Its kick grid runs on 16.12 s + 2 s per bar, so starting the track at 6.12 s puts every
// film bar on a downbeat and the drop on bar 5 (10 s). Sections: drop at bar 5, lift 13, breakdown 21–29, full 29, peak 37, final hit 45.
export const MUSIC = {
  file: "scripts/film/music/track.mp3",
  title: "Ramp It Up",
  artist: "Ahjay Stelino",
  source: "https://mixkit.co/free-stock-music/tag/technology/",
  license: "Mixkit Stock Music Free License, https://mixkit.co/license/#musicFree",
  bpm: 120,
  start: 6.12,
  fadeOut: 2.5,
};

export const BEAT = 60 / MUSIC.bpm;
export const BAR = BEAT * 4;
export const bars = (count) => count * BAR;

// [id, from bar, to bar, dissolve-in seconds]. Later shots draw over earlier ones, so an overlap with a dissolve is a crossfade.
export const EDIT = [
  ["open_message", 0, 2, 0],
  ["open_teams", 2, 3, 0],
  ["open_tools", 3, 5, 0],
  ["open_reveal", 5, 7.25, 0],
  ["intake_comms", 7, 11.25, 0.5],
  ["intake_forms", 11, 15, 0.5],
  ["plan_flow", 15, 18.25, 0],
  ["plan_notes", 18, 20, 0.5],
  ["plan_roadmap", 20, 21, 0],
  ["ai_grey", 21, 26.25, 0],
  ["ai_graph", 26, 29, 0.6],
  ["launch_tickets", 29, 32.25, 0],
  ["launch_door", 32, 34, 0.5],
  ["launch_montage", 34, 37, 0],
  ["finale_spectrum", 37, 40.25, 0],
  ["finale_lockup", 40, 46.75, 0.6],
];

export const DURATION = bars(46.75);

export const CHAPTERS = [
  { at: 0, title: "Intro" },
  { at: bars(7), title: "Intake: every request has somewhere to land" },
  { at: bars(15), title: "Plan: from first sketch to launch" },
  { at: bars(21), title: "AI: put your team's knowledge to work" },
  { at: bars(29), title: "Launch: ship it to the people it's for" },
  { at: bars(37), title: "One account, every app" },
];
