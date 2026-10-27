// Renders a hero film set (scripts/hero-video/<scene>/scene.html) to looping background videos for the area pages.
//   node scripts/hero-video/render.mjs events                     -> public/videos/events-hero-{dark,light}.{webm,mp4,jpg}
//   node scripts/hero-video/render.mjs events --theme dark        -> one theme only
//   node scripts/hero-video/render.mjs events --preview 0,3,8.5   -> PNG stills in the scratch folder, no encode
// Needs Google Chrome and ffmpeg on the machine. Every frame is drawn by window.render(t), so output is deterministic.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CHROME =
  process.env.CHROME_PATH ||
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  }[process.platform] ||
  "google-chrome";

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 24;
const SECONDS = 12;

const args = process.argv.slice(2);
const scene = args[0];
const flag = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1];
};
const themes = flag("theme") ? [flag("theme")] : ["dark", "light"];
const preview = flag("preview");
const scratch = flag("out") || path.join(os.tmpdir(), `hero-video-${scene}`);

if (!scene || !fs.existsSync(path.join(ROOT, "scripts/hero-video", scene, "scene.html"))) {
  console.error("Usage: node scripts/hero-video/render.mjs <scene> [--theme dark|light] [--preview t1,t2]");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openChrome(port) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "hero-video-chrome-"));
  const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  let targets = [];
  for (let attempt = 0; attempt < 60 && !targets.length; attempt++) {
    try {
      targets = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((target) => target.type === "page");
    } catch {
      await sleep(200);
    }
  }
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
    new Promise((resolve) => {
      const next = ++id;
      pending.set(next, resolve);
      socket.send(JSON.stringify({ id: next, method, params }));
    });
  const close = () => {
    socket.close();
    chrome.kill();
  };
  return { send, close };
}

async function renderTheme(theme, port) {
  const { send, close } = await openChrome(port);
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
  const url = `${pathToFileURL(path.join(ROOT, "scripts/hero-video", scene, "scene.html")).href}?theme=${theme}`;
  await send("Page.navigate", { url });
  await sleep(1500);
  await send("Runtime.evaluate", { expression: "window.ready", awaitPromise: true });

  const frame = async (t, file) => {
    await send("Runtime.evaluate", { expression: `window.render(${t})` });
    // Two animation frames so layout, the masked layer and the blur all settle before the capture.
    await send("Runtime.evaluate", { expression: "new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))", awaitPromise: true });
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(file, Buffer.from(shot.result.data, "base64"));
  };

  const dir = path.join(scratch, theme);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  if (preview) {
    for (const t of preview.split(",").map(Number)) await frame(t, path.join(dir, `preview_${String(t).replace(".", "_")}.png`));
    close();
    console.log(`[${theme}] previews in ${dir}`);
    return;
  }

  const total = FPS * SECONDS;
  for (let index = 0; index < total; index++) {
    await frame(index / FPS, path.join(dir, `${String(index).padStart(4, "0")}.png`));
    if (index % 48 === 0) console.log(`[${theme}] frame ${index}/${total}`);
  }
  close();

  const out = path.join(ROOT, "public/videos");
  fs.mkdirSync(out, { recursive: true });
  const base = path.join(out, `${scene}-hero-${theme}`);
  const input = ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(dir, "%04d.png")];
  const run = (extra) => {
    const result = spawnSync("ffmpeg", [...input, ...extra], { stdio: "inherit" });
    if (result.status !== 0) throw new Error(`ffmpeg failed: ${extra.at(-1)}`);
  };
  run(["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p", "-an", `${base}.webm`]);
  run(["-c:v", "libx264", "-preset", "slow", "-crf", "23", "-tune", "film", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${base}.mp4`]);
  spawnSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "0000.png"), "-vf", "scale=1280:-1", "-q:v", "4", `${base}.jpg`], { stdio: "inherit" });
  for (const ext of ["webm", "mp4", "jpg"]) console.log(`${base}.${ext}  ${(fs.statSync(`${base}.${ext}`).size / 1024).toFixed(0)} KB`);
}

let port = 9520;
for (const theme of themes) await renderTheme(theme, port++);
