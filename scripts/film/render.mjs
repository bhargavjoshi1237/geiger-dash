// Renders a launch film from the /film page of a running dev server (npm run dev) to a YouTube-ready MP4.
//   node scripts/film/render.mjs                      -> out/film/geiger-suite-film.mp4 (4K, 30 fps, mixed audio)
//   node scripts/film/render.mjs --film events        -> out/film/geiger-events-film.mp4 (1080p); --film events-15 for the 15 s cut
//   node scripts/film/render.mjs --preview 1,9.2,40   -> PNG stills in out/film/preview, no encode
//   node scripts/film/render.mjs --scale 1 --from 12 --to 28   -> a quick 1080p draft of one stretch
//   node scripts/film/render.mjs --thumbnail          -> out/film/geiger-suite-film-thumbnail.jpg (1280×720, under 2 MB)
//   node scripts/film/render.mjs --remix              -> rebuilds only the soundtrack onto the rendered film (after a music or cue change)
// Frames stream from headless Chrome straight into ffmpeg, so no image sequence is ever written to disk.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSoundtrack } from "./audio.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CHROME =
  process.env.CHROME_PATH ||
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  }[process.platform] ||
  "google-chrome";

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const URL_BASE = flag("url", "http://localhost:3000");
const FILM = flag("film", "suite");
// The suite film masters in 4K and the Events films in 1080p; a --scale below the master's is a draft.
const MASTER_SCALE = FILM === "suite" ? 2 : 1;
const SCALE = Number(flag("scale", MASTER_SCALE));
const DRAFT = SCALE < MASTER_SCALE;
const WORKERS = Number(flag("workers", Math.max(1, Math.min(6, Math.floor(os.cpus().length / 3)))));
const PREVIEW = flag("preview");
const THUMBNAIL = args.includes("--thumbnail");
const REMIX = args.includes("--remix");
const OUT = path.join(ROOT, "out/film");
const BASE = { suite: "geiger-suite-film", events: "geiger-events-film", "events-15": "geiger-events-film-15s" }[FILM] ?? `geiger-${FILM}-film`;
const NAME = flag("name", DRAFT ? `${BASE}-draft` : BASE);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openChrome(port) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "film-chrome-"));
  const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--mute-audio", "--force-color-profile=srgb", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  let targets = [];
  for (let attempt = 0; attempt < 80 && !targets.length; attempt++) {
    try {
      targets = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((target) => target.type === "page");
    } catch {
      await sleep(250);
    }
  }
  if (!targets.length) throw new Error(`Chrome didn't start on port ${port}`);
  const socket = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve));
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const next = ++id;
      pending.set(next, (message) => (message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result)));
      socket.send(JSON.stringify({ id: next, method, params }));
    });
  const close = () => {
    socket.close();
    chrome.kill();
    // Chrome can hold its profile for a moment after exit; a leftover temp folder isn't worth failing a render over.
    setTimeout(() => {
      try {
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 });
      } catch {}
    }, 2000);
  };
  return { send, close };
}

// Opens the film page and waits until fonts and images are in, returning a frame renderer and the film's metadata.
async function openFilm(port, query = "") {
  const chrome = await openChrome(port);
  const { send } = chrome;
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: SCALE, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }, { name: "prefers-color-scheme", value: "dark" }] });
  await send("Page.navigate", { url: `${URL_BASE}/film?capture=1&film=${FILM}${query}` });
  const evaluate = async (expression, awaitPromise = false) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, awaitPromise, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    return result.value;
  };
  for (let attempt = 0; attempt < 240; attempt++) {
    if (await evaluate("typeof window.render === 'function' && !!window.ready").catch(() => false)) break;
    await sleep(500);
  }
  await evaluate("window.ready.then(() => true)", true);
  const film = await evaluate("window.film");
  // Match the emulated colour scheme to a light film, so nothing that reads prefers-color-scheme fights its theme.
  if (film.theme === "light") await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }, { name: "prefers-color-scheme", value: "light" }] });
  const frame = async (time) => {
    await evaluate(`window.render(${time})`);
    // Two animation frames so layout, masks and filters settle before the capture.
    await evaluate("new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))", true);
    const shot = await send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true, captureBeyondViewport: false });
    return Buffer.from(shot.data, "base64");
  };
  return { ...chrome, film, frame };
}

function encoder(file, fps) {
  // H.264 High, 4:2:0, BT.709, closed GOP of half the frame rate: YouTube's recommended upload settings.
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y", "-v", "error",
      "-f", "image2pipe", "-c:v", "png", "-framerate", String(fps), "-i", "-",
      "-c:v", "libx264", "-preset", "medium", "-crf", DRAFT ? "18" : "16", "-tune", "film",
      "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", String(fps / 2), "-bf", "2", "-flags", "+cgop",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      file,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise((resolve, reject) => ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code} for ${file}`)))));
  const write = (buffer) => new Promise((resolve) => (ffmpeg.stdin.write(buffer) ? resolve() : ffmpeg.stdin.once("drain", resolve)));
  return { write, end: () => (ffmpeg.stdin.end(), done) };
}

const run = (command, commandArgs) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { stdio: "inherit" });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`))));
  });

async function preview(times) {
  const dir = path.join(OUT, "preview");
  fs.mkdirSync(dir, { recursive: true });
  const film = await openFilm(9600);
  for (const time of times) {
    const file = path.join(dir, `t${String(time.toFixed(2)).replace(".", "_")}.png`);
    fs.writeFileSync(file, await film.frame(time));
    console.log(file);
  }
  film.close();
}

async function render() {
  fs.mkdirSync(OUT, { recursive: true });
  const probe = await openFilm(9600);
  const { fps, duration } = probe.film;
  probe.close();

  const first = Math.round(Number(flag("from", 0)) * fps);
  const last = Math.min(Math.round(Number(flag("to", duration)) * fps), Math.round(duration * fps));
  const total = last - first;
  const per = Math.ceil(total / WORKERS);
  const started = Date.now();
  let rendered = 0;
  console.log(`${total} frames at ${1920 * SCALE}×${1080 * SCALE}, ${WORKERS} workers`);

  const segments = await Promise.all(
    Array.from({ length: WORKERS }, async (_, worker) => {
      const from = first + worker * per;
      const to = Math.min(last, from + per);
      if (from >= to) return null;
      const file = path.join(OUT, `segment-${worker}.mp4`);
      const film = await openFilm(9610 + worker);
      const out = encoder(file, fps);
      for (let index = from; index < to; index++) {
        await out.write(await film.frame(index / fps));
        rendered++;
        if (rendered % 60 === 0) {
          const rate = rendered / ((Date.now() - started) / 1000);
          console.log(`${rendered}/${total} frames · ${rate.toFixed(1)} fps · ~${Math.round((total - rendered) / rate)}s left`);
        }
      }
      film.close();
      await out.end();
      return file;
    }),
  );

  const list = path.join(OUT, "segments.txt");
  fs.writeFileSync(list, segments.filter(Boolean).map((file) => `file '${file.replaceAll("\\", "/")}'`).join("\n"));
  const silent = path.join(OUT, `${NAME}-video.mp4`);
  await run("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", silent]);
  for (const file of segments.filter(Boolean)) fs.rmSync(file);
  fs.rmSync(list);

  const final = path.join(OUT, `${NAME}.mp4`);
  const soundtrack = await buildSoundtrack({ film: probe.film, from: first / fps, to: last / fps, out: OUT });
  if (soundtrack) {
    await run("ffmpeg", ["-y", "-v", "error", "-i", silent, "-i", soundtrack, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "384k", "-ar", "48000", "-shortest", "-movflags", "+faststart", final]);
    fs.rmSync(silent);
  } else {
    await run("ffmpeg", ["-y", "-v", "error", "-i", silent, "-c", "copy", "-movflags", "+faststart", final]);
    fs.rmSync(silent);
  }
  const size = fs.statSync(final).size / 1024 / 1024;
  console.log(`${final}  ${size.toFixed(0)} MB  in ${Math.round((Date.now() - started) / 1000)}s`);
}

// The thumbnail is its own composition (?solo=thumbnail), captured once and saved as a YouTube-sized JPEG.
async function thumbnail() {
  fs.mkdirSync(OUT, { recursive: true });
  const film = await openFilm(9600, "&solo=thumbnail");
  const png = path.join(OUT, "thumbnail.png");
  fs.writeFileSync(png, await film.frame(5));
  film.close();
  const jpg = path.join(OUT, `${BASE}-thumbnail.jpg`);
  await run("ffmpeg", ["-y", "-v", "error", "-i", png, "-vf", "scale=1280:720:flags=lanczos", "-q:v", "2", jpg]);
  fs.rmSync(png);
  console.log(`${jpg}  ${(fs.statSync(jpg).size / 1024).toFixed(0)} KB`);
}

// Swaps a fresh soundtrack onto an already-rendered film, copying the picture untouched.
async function remix() {
  const film = path.join(OUT, `${NAME}.mp4`);
  if (!fs.existsSync(film)) throw new Error(`Render the film first: ${film} doesn't exist.`);
  const probe = await openFilm(9600);
  probe.close();
  const soundtrack = await buildSoundtrack({ film: probe.film, out: OUT });
  const next = path.join(OUT, `${NAME}.remix.mp4`);
  await run("ffmpeg", ["-y", "-v", "error", "-i", film, "-i", soundtrack, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "384k", "-ar", "48000", "-shortest", "-movflags", "+faststart", next]);
  fs.rmSync(soundtrack);
  fs.renameSync(next, film);
  console.log(`${film}  soundtrack replaced`);
}

if (THUMBNAIL) await thumbnail();
else if (REMIX) await remix();
else if (PREVIEW) await preview(PREVIEW.split(",").map(Number));
else await render();
