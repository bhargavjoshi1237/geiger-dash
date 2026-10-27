// Builds the film's soundtrack: the music bed, synthesised sound effects on the film's cues, mixed and loudness-normalised.
// Effects are generated here from code (no sample files), so the whole soundtrack re-renders with the picture.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const RATE = 48000;
// YouTube plays back around -14 LUFS; peaks aim for -1.5 dBTP so they stay under -1 after the AAC encode.
const LOUDNESS = { I: -14, TP: -1.5, LRA: 11 };
// Effects sit under the music: present on the beat, never louder than it.
const EFFECTS_GAIN = 0.42;

const db = (value) => 10 ** (value / 20);

function random(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296) * 2 - 1;
  };
}

// RBJ biquad with a cutoff that can move per sample, for sweeps.
function biquad(type) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (input, frequency, q = 0.8) => {
    const w = (2 * Math.PI * Math.min(frequency, RATE * 0.45)) / RATE;
    const alpha = Math.sin(w) / (2 * q);
    const cos = Math.cos(w);
    let b0, b1, b2;
    if (type === "lowpass") [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
    else if (type === "highpass") [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
    else [b0, b1, b2] = [alpha, 0, -alpha];
    const a0 = 1 + alpha;
    const a1 = -2 * cos;
    const a2 = 1 - alpha;
    const output = (b0 * input + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = input;
    y2 = y1;
    y1 = output;
    return output;
  };
}

// Each voice returns { left, right } sample arrays; `seed` keeps the noise identical between renders.
const VOICES = {
  tick({ seed }) {
    const length = Math.round(RATE * 0.05);
    const noise = random(seed);
    const band = biquad("bandpass");
    const out = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      out[i] = (band(noise(), 4200, 2.2) * 2.4 + Math.sin(2 * Math.PI * 2300 * t) * 0.35) * Math.exp(-t / 0.008) * 0.5;
    }
    return { left: out, right: out };
  },
  click({ seed }) {
    const length = Math.round(RATE * 0.06);
    const noise = random(seed);
    const high = biquad("highpass");
    const out = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      const press = high(noise(), 2500) * Math.exp(-t / 0.003);
      const release = t > 0.035 ? high(noise(), 3000) * Math.exp(-(t - 0.035) / 0.002) * 0.5 : 0;
      out[i] = (press + release + Math.sin(2 * Math.PI * 140 * t) * Math.exp(-t / 0.01) * 0.4) * 0.55;
    }
    return { left: out, right: out };
  },
  pop() {
    const length = Math.round(RATE * 0.35);
    const out = new Float32Array(length);
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      const frequency = 620 + 520 * Math.min(1, t / 0.045);
      phase += (2 * Math.PI * frequency) / RATE;
      const envelope = Math.min(1, t / 0.004) * Math.exp(-t / 0.09);
      out[i] = (Math.sin(phase) + 0.25 * Math.sin(phase * 2)) * envelope * 0.42;
    }
    return { left: out, right: out };
  },
  send({ seed }) {
    const length = Math.round(RATE * 0.32);
    const noise = random(seed);
    const band = biquad("bandpass");
    const out = new Float32Array(length);
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      const sweep = 900 + 3200 * (t / 0.32) ** 0.7;
      phase += (2 * Math.PI * (700 + 900 * (t / 0.32))) / RATE;
      const envelope = Math.sin(Math.PI * Math.min(1, t / 0.32)) ** 1.5;
      out[i] = (band(noise(), sweep, 1.4) * 1.8 + Math.sin(phase) * 0.12) * envelope * 0.5;
    }
    return { left: out, right: out };
  },
  success() {
    const length = Math.round(RATE * 1.1);
    const out = new Float32Array(length);
    const notes = [
      [880, 0],
      [1318.5, 0.085],
    ];
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      let sample = 0;
      for (const [frequency, start] of notes) {
        if (t < start) continue;
        const local = t - start;
        sample += (Math.sin(2 * Math.PI * frequency * local) + 0.18 * Math.sin(2 * Math.PI * frequency * 2.01 * local)) * Math.min(1, local / 0.006) * Math.exp(-local / 0.32);
      }
      out[i] = sample * 0.24;
    }
    return { left: out, right: out };
  },
  whoosh({ seed }) {
    const duration = 0.95;
    const length = Math.round(RATE * duration);
    const noise = random(seed);
    const band = biquad("bandpass");
    const low = biquad("lowpass");
    const left = new Float32Array(length);
    const right = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const x = i / length;
      const sweep = 280 + 2600 * Math.sin(Math.PI * x) ** 2;
      const envelope = Math.sin(Math.PI * Math.min(1, x * 1.15)) ** 2;
      const sample = (band(noise(), sweep, 0.9) * 1.6 + low(noise(), 500) * 0.4) * envelope * 0.55;
      const pan = x;
      left[i] = sample * Math.cos((pan * Math.PI) / 2);
      right[i] = sample * Math.sin((pan * Math.PI) / 2);
    }
    return { left, right };
  },
  impact({ seed }) {
    const length = Math.round(RATE * 2.4);
    const noise = random(seed);
    const low = biquad("lowpass");
    const tail = biquad("lowpass");
    const out = new Float32Array(length);
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      phase += (2 * Math.PI * (44 + 56 * Math.exp(-t / 0.12))) / RATE;
      const boom = Math.sin(phase) * Math.min(1, t / 0.003) * Math.exp(-t / 0.7);
      const crack = low(noise(), 2400) * Math.exp(-t / 0.03) * 0.6;
      const air = tail(noise(), 900) * Math.exp(-t / 0.9) * 0.18;
      out[i] = (boom * 0.9 + crack + air) * 0.8;
    }
    return { left: out, right: out };
  },
  hit({ seed }) {
    const length = Math.round(RATE * 0.9);
    const noise = random(seed);
    const low = biquad("lowpass");
    const out = new Float32Array(length);
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      phase += (2 * Math.PI * (52 + 70 * Math.exp(-t / 0.05))) / RATE;
      out[i] = (Math.sin(phase) * Math.exp(-t / 0.28) * 0.85 + low(noise(), 3200) * Math.exp(-t / 0.02) * 0.5) * 0.75;
    }
    return { left: out, right: out };
  },
  scan() {
    const length = Math.round(RATE * 0.16);
    const out = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      const envelope = Math.min(1, t / 0.004) * (t < 0.11 ? 1 : Math.exp(-(t - 0.11) / 0.015));
      out[i] = (Math.sin(2 * Math.PI * 1760 * t) + 0.2 * Math.sin(2 * Math.PI * 5280 * t)) * envelope * 0.16;
    }
    return { left: out, right: out };
  },
  chime({ pitch = 0 }) {
    // A rising pentatonic run as the app tiles light up one after another.
    const scale = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093, 2349.3, 2637, 3136, 3520];
    const frequency = scale[pitch % scale.length];
    const length = Math.round(RATE * 1.2);
    const left = new Float32Array(length);
    const right = new Float32Array(length);
    const pan = 0.15 + (pitch / 9) * 0.7;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      const envelope = Math.min(1, t / 0.005) * Math.exp(-t / 0.38);
      const sample = (Math.sin(2 * Math.PI * frequency * t) + 0.5 * Math.sin(2 * Math.PI * frequency * 1.003 * t) + 0.08 * Math.sin(2 * Math.PI * frequency * 3 * t)) * envelope * 0.14;
      left[i] = sample * Math.cos((pan * Math.PI) / 2);
      right[i] = sample * Math.sin((pan * Math.PI) / 2);
    }
    return { left, right };
  },
};

function writeWav(file, left, right) {
  const frames = left.length;
  const buffer = Buffer.alloc(44 + frames * 8);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + frames * 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(3, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(RATE, 24);
  buffer.writeUInt32LE(RATE * 8, 28);
  buffer.writeUInt16LE(8, 32);
  buffer.writeUInt16LE(32, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(frames * 8, 40);
  for (let i = 0; i < frames; i++) {
    buffer.writeFloatLE(left[i], 44 + i * 8);
    buffer.writeFloatLE(right[i], 48 + i * 8);
  }
  fs.writeFileSync(file, buffer);
}

// Renders every cue between `from` and `to` (film seconds) onto one stereo track.
export function renderEffects(cues, from, to, file) {
  const frames = Math.ceil((to - from) * RATE);
  const left = new Float32Array(frames);
  const right = new Float32Array(frames);
  cues.forEach((cue, index) => {
    const voice = VOICES[cue.sound];
    if (!voice || cue.at < from - 3 || cue.at >= to) return;
    const sound = voice({ seed: 7 + index * 131, pitch: cue.pitch });
    const gain = (cue.gain ?? 1) * EFFECTS_GAIN;
    const offset = Math.round((cue.at - from) * RATE);
    for (let i = 0; i < sound.left.length; i++) {
      const at = offset + i;
      if (at < 0 || at >= frames) continue;
      left[at] += sound.left[i] * gain;
      right[at] += sound.right[i] * gain;
    }
  });
  writeWav(file, left, right);
  return file;
}

const ffmpeg = (args, capture = false) =>
  new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: ["ignore", "inherit", capture ? "pipe" : "inherit"] });
    let stderr = "";
    if (capture) child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (code) => (code === 0 ? resolve(stderr) : reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-2000)}`))));
  });

// Half the crossfade at each splice of a spliced music bed; each side runs on by this much, so downbeats stay on time.
const SPLICE = 0.015;

// The music bed as filter-graph lines ending in [bed]: one trim from MUSIC.start, or MUSIC.segments joined on downbeats.
function musicBed(music) {
  const segments = music.segments ?? [[music.start, null]];
  if (segments.length === 1) return [`[0:a]aresample=${RATE},atrim=start=${segments[0][0]},asetpts=PTS-STARTPTS[bed]`];
  const last = segments.length - 1;
  const lines = [`[0:a]aresample=${RATE},asplit=${segments.length}${segments.map((_, index) => `[raw${index}]`).join("")}`];
  segments.forEach(([start, end], index) => {
    const from = index ? start - SPLICE : start;
    const to = index < last ? end + SPLICE : end;
    lines.push(`[raw${index}]atrim=start=${from}:end=${to},asetpts=PTS-STARTPTS[part${index}]`);
  });
  for (let index = 1; index <= last; index++) {
    const left = index === 1 ? "[part0]" : `[joined${index - 1}]`;
    lines.push(`${left}[part${index}]acrossfade=d=${SPLICE * 2}:c1=tri:c2=tri${index === last ? "[bed]" : `[joined${index}]`}`);
  }
  return lines;
}

// The music bed, effects on top, then a two-pass loudnorm to YouTube's target.
export async function buildSoundtrack({ film, from = 0, to = film.duration, out }) {
  const music = path.join(ROOT, film.music.file);
  if (!fs.existsSync(music)) {
    console.warn(`No music at ${film.music.file}; rendering without a soundtrack.`);
    return null;
  }
  const length = to - from;
  const effects = renderEffects(film.cues, from, to, path.join(out, "effects.wav"));
  const fadeOut = to >= film.duration - 0.01 ? film.music.fadeOut : 0.05;
  const graph = [
    ...musicBed(film.music),
    `[bed]atrim=start=${from}:duration=${length},asetpts=PTS-STARTPTS,afade=t=in:d=0.25,afade=t=out:st=${Math.max(0, length - fadeOut)}:d=${fadeOut}[music]`,
    `[1:a]aresample=${RATE}[fx]`,
    "[music][fx]amix=inputs=2:duration=first:normalize=0[mix]",
  ];
  const mixed = path.join(out, "mix.wav");
  await ffmpeg(["-y", "-v", "error", "-i", music, "-i", effects, "-filter_complex", graph.join(";"), "-map", "[mix]", "-c:a", "pcm_f32le", mixed]);

  const target = `I=${LOUDNESS.I}:TP=${LOUDNESS.TP}:LRA=${LOUDNESS.LRA}`;
  const report = await ffmpeg(["-hide_banner", "-i", mixed, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"], true);
  const measured = JSON.parse(report.slice(report.lastIndexOf("{"), report.lastIndexOf("}") + 1));
  const soundtrack = path.join(out, "soundtrack.wav");
  const second = `loudnorm=${target}:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true`;
  await ffmpeg(["-y", "-v", "error", "-i", mixed, "-af", `${second},aresample=${RATE}`, "-c:a", "pcm_s24le", soundtrack]);
  fs.rmSync(effects);
  fs.rmSync(mixed);
  console.log(`soundtrack: measured ${measured.input_i} LUFS → ${LOUDNESS.I} LUFS, true peak ≤ ${LOUDNESS.TP} dBTP`);
  return soundtrack;
}
