// The Geiger Events film: a 63 s edit and a 15 s cutdown, both cut to the bar grid of "Your Breath" (119.72 BPM).

const TRACK_BPM = 119.72;
const TRACK_BAR = (60 / TRACK_BPM) * 4;
// Measured kick onsets put the track's bar n at 2.888 + n bars: the drop is bar 6, the lift 13, the peak 21, the breakdown 39.
const downbeat = (n) => Number((2.888 + n * TRACK_BAR).toFixed(3));

const TRACK = {
  file: "scripts/film/music/your-breath.mp3",
  title: "Your Breath",
  artist: "Eugenio Mininni",
  source: "https://mixkit.co/free-stock-music/tag/technology/",
  license: "Mixkit Stock Music Free License, https://mixkit.co/license/#musicFree",
  bpm: TRACK_BPM,
};

export const BEAT = 60 / TRACK_BPM;
export const BAR = BEAT * 4;
export const bars = (count) => count * BAR;

// Film bar k plays track bar k + 3; track bars 23–30 repeat the peak, so they're skipped to land the breakdown under the end card.
export const MUSIC = { ...TRACK, segments: [[downbeat(3), downbeat(23)], [downbeat(31), downbeat(44)]], fadeOut: 2.6 };

// [shot id, from bar, to bar, dissolve in seconds, seconds into the shot it cuts in at]
export const EDIT = [
  ["open_editor", 0, 3],
  ["design_layouts", 3, 6],
  ["design_import", 6, 8],
  ["venue_bowl", 8, 10],
  ["sell_seats", 10, 13],
  ["sell_checkout", 13, 15.5],
  ["sell_confirmed", 15.5, 18],
  ["sales_overview", 18, 21],
  ["door_pass", 21, 23],
  ["door_scan", 23, 26],
  ["door_full", 26, 28],
  ["finale", 28, 31.5, 0.5],
];

export const DURATION = bars(31.5);

export const CHAPTERS = [
  { at: 0, title: "Create the page" },
  { at: bars(10), title: "Sell every seat" },
  { at: bars(21), title: "Run the door" },
];

// The cutdown runs from two bars before the peak, so the peak lands on its third bar.
export const CUT_MUSIC = { ...TRACK, segments: [[downbeat(19), downbeat(27)]], fadeOut: 1.4 };

export const CUT_EDIT = [
  ["design_layouts", 0, 1, 0, 2],
  ["sell_seats", 1, 2, 0, 2.6],
  ["sales_overview", 2, 3.5, 0, 1.4],
  ["door_scan", 3.5, 5, 0, 2.0],
  ["finale_cut", 5, 7.5, 0.3],
];

export const CUT_DURATION = bars(7.5);
