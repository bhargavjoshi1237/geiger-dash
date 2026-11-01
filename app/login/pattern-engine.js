// Canvas drawings for the login panel: each pattern has init(w, h, env) -> state and draw(ctx, w, h, t, state).
// Geiger mark (same paths as @geiger/ui Logo, viewBox 467x285).
const LOGO_PATHS = [
  "M427.054 1.17427C431.046 1.15338 464.984 0.670938 466.079 1.40804C466.298 4.01125 464.421 3.92073 463.267 6.18971C450.436 31.3381 435.978 55.3181 422.003 79.8289L339.669 223C327.843 243.287 317.065 263.871 304.413 283.952L285.161 283.494C273.521 283.311 254.97 282.561 244.096 284C255.18 269.451 265.622 246.845 275.646 231.004C280.056 224.033 284.971 216.613 289.146 209.596C302.879 186.047 316.389 162.368 329.675 138.564C346.203 109.513 363.065 80.653 380.256 51.9898C390.11 35.4483 398.71 17.3651 409.366 1.55774C415.08 1.29513 421.301 1.29165 427.054 1.17427Z",
  "M218.309 1.31216L224 1.15608L193.641 50.3271L170.178 91.0997L136.561 149.51L124.008 172.428L103.37 206.726L77.2097 251.035L57.3197 283.677L6.18221 283.433L0 284.156L22.4687 244.331L54.6016 189.816L75.3213 152.467L94.3273 119.376L144.096 31L161 1.15608L218.309 1.31216Z",
  "M344.758 0L345.096 0.735049C326.643 33.9528 307.753 66.9251 288.428 99.6433C284.236 106.683 278.484 114.061 274.613 121.064C265.581 137.399 256.332 153.496 247.097 169.697L208.592 236.882C199.377 253.009 192.444 267.92 180.666 282.525C163.285 284.093 142.445 282.6 123.432 284L123.098 283.728C123.005 282.163 127.788 276.233 129.062 273.917C135.826 261.605 142.61 249.297 149.637 237.134L240.526 79.7429C249.025 64.9272 257.723 50.1984 266.187 35.3414C268.992 30.4177 277.596 15 285.096 0.735052C305.596 0.735046 325.596 0.735049 344.131 0.1168L344.758 0Z",
];

// Canvas can't read CSS variables, so the dark tokens and Tailwind zinc/-500 accents are mirrored here as hex.
const DARK = { bg: "#161616", fg: "#e7e7e7", tertiary: "#525252", border: "#333333", line: "#2a2a2a" };
const ZINC = { 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 900: "#18181b", 950: "#09090b" };
const ACCENT_HEX = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#8b5cf6"];
// Suite accent-500s in suite order (flow ... property).
const SUITE_HEX = ["#6366f1", "#f59e0b", "#8b5cf6", "#0ea5e9", "#14b8a6", "#10b981", "#f43f5e", "#06b6d4", "#f97316", "#d946ef", "#3b82f6", "#eab308", "#94a3b8"];
const TAU = Math.PI * 2;

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixHex = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
};
const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noise1(seed) {
  const r = rng(seed), p = new Float32Array(256);
  for (let i = 0; i < 256; i++) p[i] = r();
  return (x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return p[i & 255] + (p[(i + 1) & 255] - p[i & 255]) * u;
  };
}

function noise3(seed) {
  const r = rng(seed), p = [];
  for (let i = 0; i < 256; i++) p.push(i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  const perm = new Uint16Array(512), V = new Float32Array(256);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) V[i] = r();
  const sm = (f) => f * f * (3 - 2 * f), L = (a, b, k) => a + (b - a) * k;
  const H = (a, b, c) => V[perm[perm[perm[a] + b] + c]];
  return (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const u = sm(x - xi), v = sm(y - yi), w = sm(z - zi);
    const X = xi & 255, Y = yi & 255, Z = zi & 255;
    return L(
      L(L(H(X, Y, Z), H(X + 1, Y, Z), u), L(H(X, Y + 1, Z), H(X + 1, Y + 1, Z), u), v),
      L(L(H(X, Y, Z + 1), H(X + 1, Y, Z + 1), u), L(H(X, Y + 1, Z + 1), H(X + 1, Y + 1, Z + 1), u), v),
      w,
    );
  };
}

function vignette(ctx, w, h, rgb, inner, outer, alpha) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * inner, w / 2, h / 2, Math.max(w, h) * outer);
  g.addColorStop(0, `rgba(${rgb},0)`);
  g.addColorStop(1, `rgba(${rgb},${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function pulseSpawn(d, t0, near) {
  const r = d.rnd;
  let c, rr;
  if (near) {
    c = Math.round((near.x - d.x0) / d.g + (r() - 0.5) * 10);
    rr = Math.round((near.y - d.y0) / d.g + (r() - 0.5) * 10);
  } else {
    c = Math.floor(d.cols * (0.15 + 0.7 * r()));
    rr = Math.floor(d.rows * (0.15 + 0.7 * r()));
  }
  c = Math.max(1, Math.min(d.cols - 2, c));
  rr = Math.max(1, Math.min(d.rows - 2, rr));
  const tint = r() < 0.4 ? hex(ACCENT_HEX[Math.floor(r() * ACCENT_HEX.length)]) : hex(DARK.fg);
  const e = { x: d.x0 + c * d.g, y: d.y0 + rr * d.g, t0, tint };
  d.events.push(e);
  return e;
}

// Marching-squares segment for one cell; corners a=TL b=TR c=BR d=BL.
function msSeg(p, a, b, c, d, L, x, y, s) {
  const code = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
  if (code === 0 || code === 15) return;
  const T = () => [x + (s * (L - a)) / (b - a), y];
  const R = () => [x + s, y + (s * (L - b)) / (c - b)];
  const B = () => [x + (s * (L - d)) / (c - d), y + s];
  const Lf = () => [x, y + (s * (L - a)) / (d - a)];
  const ln = (P, Q) => { p.moveTo(P[0], P[1]); p.lineTo(Q[0], Q[1]); };
  switch (code) {
    case 1: case 14: ln(Lf(), B()); break;
    case 2: case 13: ln(B(), R()); break;
    case 3: case 12: ln(Lf(), R()); break;
    case 4: case 11: ln(T(), R()); break;
    case 5: ln(Lf(), T()); ln(B(), R()); break;
    case 6: case 9: ln(T(), B()); break;
    case 7: case 8: ln(Lf(), T()); break;
    case 10: ln(Lf(), B()); ln(T(), R()); break;
  }
}

function flowSpawn(p, w, h, r, initial) {
  p.x = r() * w; p.y = r() * h; p.tr = []; p.age = initial ? r() * 4 : 0;
  p.life = 3 + r() * 5; p.dying = false; p.accent = r() < 0.07;
  return p;
}

export const PATTERNS = {
  // Dot matrix; Geiger-counter "clicks" send rings through it.
  pulse: {
    init(w, h) {
      const g = 18, cols = Math.floor((w - 8) / g), rows = Math.floor((h - 8) / g);
      const x0 = (w - (cols - 1) * g) / 2, y0 = (h - (rows - 1) * g) / 2;
      const xs = new Float32Array(cols * rows), ys = new Float32Array(cols * rows);
      let n = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { xs[n] = x0 + c * g; ys[n] = y0 + r * g; n++; }
      return { xs, ys, n, g, cols, rows, x0, y0, events: [], next: 0.3, rnd: rng(11) };
    },
    draw(ctx, w, h, t, d) {
      if (t - d.next > 2) d.next = t;
      while (t >= d.next) {
        const e = pulseSpawn(d, d.next);
        if (d.rnd() < 0.3) {
          const n = 1 + Math.floor(d.rnd() * 2);
          for (let k = 0; k < n; k++) pulseSpawn(d, d.next + 0.1 + d.rnd() * 0.3, e);
        }
        d.next += 0.35 - Math.log(1 - d.rnd()) / 1.7;
      }
      const SPEED = 140, WID = 16, LIFE = 5;
      d.events = d.events.filter((e) => t - e.t0 < LIFE);
      const act = [];
      for (const e of d.events) {
        const age = t - e.t0;
        if (age >= 0) act.push({ e, age, R: age * SPEED, f: 1 - age / LIFE });
      }
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const base = new Path2D();
      for (let i = 0; i < d.n; i++) { base.moveTo(d.xs[i] + 1.3, d.ys[i]); base.arc(d.xs[i], d.ys[i], 1.3, 0, TAU); }
      ctx.fillStyle = DARK.border;
      ctx.fill(base);
      ctx.lineWidth = 1;
      for (const a of act) {
        ctx.strokeStyle = `rgba(${a.e.tint.join(",")},${0.12 * a.f})`;
        ctx.beginPath();
        ctx.arc(a.e.x, a.e.y, a.R, 0, TAU);
        ctx.stroke();
      }
      const B = hex(DARK.border);
      for (let i = 0; i < d.n; i++) {
        let I = 0, cr = 0, cg = 0, cb = 0;
        const x = d.xs[i], y = d.ys[i];
        for (const a of act) {
          const dx = x - a.e.x, dy = y - a.e.y;
          const dd = Math.sqrt(dx * dx + dy * dy) - a.R;
          if (dd > 3 * WID || dd < -200) continue;
          let k = Math.exp(-(dd * dd) / (WID * WID));
          if (dd < 0) k = Math.max(k, 0.16 * Math.exp(dd / 45));
          k *= 1.25 * a.f;
          if (k < 0.012) continue;
          I += k; cr += a.e.tint[0] * k; cg += a.e.tint[1] * k; cb += a.e.tint[2] * k;
        }
        if (I < 0.02) continue;
        const s = Math.min(1, I), inv = 1 / I;
        ctx.fillStyle = `rgb(${(B[0] + (cr * inv - B[0]) * s) | 0},${(B[1] + (cg * inv - B[1]) * s) | 0},${(B[2] + (cb * inv - B[2]) * s) | 0})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.3 + 2 * s, 0, TAU);
        ctx.fill();
      }
      for (const a of act) {
        if (a.age >= 0.5) continue;
        const k = 1 - a.age / 0.5;
        ctx.fillStyle = `rgba(${a.e.tint.join(",")},${k})`;
        ctx.beginPath();
        ctx.arc(a.e.x, a.e.y, 2.2 + 2.5 * k, 0, TAU);
        ctx.fill();
      }
      vignette(ctx, w, h, "22,22,22", 0.36, 0.8, 0.6);
    },
  },

  // Truchet tiles: random ripples of quarter-turns keep re-routing the lines.
  truchet: {
    init(w, h) {
      const s = 44, cols = Math.ceil(w / s) + 1, rows = Math.ceil(h / s) + 1;
      const ox = (w - cols * s) / 2, oy = (h - rows * s) / 2;
      const r = rng(5), tiles = [];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        tiles.push({ cx: ox + i * s + s / 2, cy: oy + j * s + s / 2, i, j, o: r() < 0.5 ? 0 : 1, fs: -1 });
      }
      return { s, tiles, cols, rows, next: 0.8, rnd: rng(23) };
    },
    draw(ctx, w, h, t, d) {
      if (t - d.next > 3) d.next = t;
      while (t >= d.next) {
        const ci = d.rnd() * d.cols, cj = d.rnd() * d.rows;
        for (const tl of d.tiles) {
          if (tl.fs < 0 && d.rnd() < 0.3) tl.fs = d.next + Math.hypot(tl.i - ci, tl.j - cj) * 0.06;
        }
        d.next += 2.6;
      }
      const path = new Path2D(), R = d.s / 2, DUR = 0.75;
      for (const tl of d.tiles) {
        let a = (tl.o * Math.PI) / 2;
        if (tl.fs >= 0 && t >= tl.fs) {
          const p = (t - tl.fs) / DUR;
          if (p >= 1) { tl.o ^= 1; tl.fs = -1; a = (tl.o * Math.PI) / 2; } else a += (ease(p) * Math.PI) / 2;
        }
        const cos = Math.cos(a), sin = Math.sin(a);
        const ax = tl.cx - R * cos + R * sin, ay = tl.cy - R * sin - R * cos;
        const bx = tl.cx + R * cos - R * sin, by = tl.cy + R * sin + R * cos;
        path.moveTo(ax + R * Math.cos(a), ay + R * Math.sin(a));
        path.arc(ax, ay, R, a, a + Math.PI / 2);
        path.moveTo(bx + R * Math.cos(a + Math.PI), by + R * Math.sin(a + Math.PI));
        path.arc(bx, by, R, a + Math.PI, a + 1.5 * Math.PI);
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.strokeStyle = ZINC[100];
      ctx.lineWidth = 9;
      ctx.stroke(path);
      ctx.strokeStyle = ZINC[900];
      ctx.lineWidth = 1.5;
      ctx.stroke(path);
      vignette(ctx, w, h, "255,255,255", 0.3, 0.7, 0.92);
    },
  },

  // Stacked waveform ridges with a scan line travelling down.
  ridges: {
    init(w, h) {
      return { N: 30, n1: noise1(3), n2: noise1(9), top: h * 0.2, bottom: h * 0.82, x0: w * 0.1, x1: w * 0.9 };
    },
    draw(ctx, w, h, t, d) {
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const N = d.N, gap = (d.bottom - d.top) / (N - 1), cx = w / 2, A = h * 0.11, step = 3;
      const scan = ((t * 4) % (N + 14)) - 7;
      const count = Math.floor((d.x1 - d.x0) / step) + 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let i = 0; i < N; i++) {
        const y0 = d.top + i * gap;
        const line = new Path2D(), poly = new Path2D();
        for (let j = 0; j < count; j++) {
          const x = d.x0 + j * step;
          const e1 = Math.exp(-(((x - cx) / (w * 0.15)) ** 2));
          const e2 = Math.exp(-(((x - cx) / (w * 0.28)) ** 2));
          const n = 0.62 * d.n1(x * 0.017 + i * 5.31 + t * 0.42) + 0.38 * d.n2(x * 0.046 - t * 0.64 + i * 2.17);
          const y = y0 - A * (0.8 * e1 + 0.2 * e2) * n * n * 1.6 - 1.2 * d.n2(x * 0.12 + i * 9.7 + t * 0.5);
          if (j === 0) { line.moveTo(x, y); poly.moveTo(x, y); } else { line.lineTo(x, y); poly.lineTo(x, y); }
        }
        poly.lineTo(d.x0 + (count - 1) * step, y0 + gap * 4);
        poly.lineTo(d.x0, y0 + gap * 4);
        poly.closePath();
        ctx.fillStyle = DARK.bg;
        ctx.fill(poly);
        const k = Math.exp(-((i - scan) ** 2) / 1.2);
        ctx.strokeStyle = mixHex(DARK.tertiary, DARK.fg, Math.min(1, 0.3 + 0.6 * (i / (N - 1)) + 0.7 * k));
        ctx.lineWidth = 1.2 + 0.7 * k;
        ctx.stroke(line);
      }
    },
  },

  // A field of the mark's slanted strokes; the ones inside the mark sit brighter, a sweep lights everything.
  slash: {
    init(w, h) {
      const cw = 13, rh = 21, slope = 0.57;
      const lw = Math.min(w * 0.62, 440), s = lw / 467, lh = 285 * s;
      const ox = (w - lw) / 2, oy = (h - lh) / 2 - h * 0.02;
      const paths = LOGO_PATHS.map((p) => new Path2D(p));
      const probe = document.createElement("canvas").getContext("2d");
      const r = rng(7), strokes = [];
      for (let y = rh / 2; y < h + rh; y += rh) {
        for (let x = -cw * 3; x < w + cw * 3; x += cw) {
          const inside = paths.some((p) => probe.isPointInPath(p, (x - ox) / s, (y - oy) / s));
          strokes.push({ x, y, u: x + y * slope, inside, ph: r(), click: r() < 0.07 });
        }
      }
      return { strokes, slope, umax: w + h * slope };
    },
    draw(ctx, w, h, t, d) {
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const L = 24, buckets = [];
      for (let i = 0; i < L; i++) buckets.push(new Path2D());
      const period = 5.6, span = d.umax + 360;
      const f = ((t % period) / period) * span - 180;
      const SIG = 26;
      for (const st of d.strokes) {
        const du = st.u - f;
        let I = Math.exp(-(du * du) / (2 * SIG * SIG));
        if (du < 0) I = Math.max(I, 0.3 * Math.exp(du / 150));
        let v = st.inside ? 0.55 + 0.45 * I : 0.03 + 0.72 * I;
        if (st.click) {
          const p = (t / 7 + st.ph) % 1;
          if (p < 0.025) v = Math.max(v, 0.85 * (1 - p / 0.025));
        }
        const SH = st.inside ? 15 : 11, HALF = st.inside ? 1.7 : 1.3;
        const hh = (SH * (1 + 0.3 * I)) / 2, sx = hh * d.slope;
        const b = buckets[Math.min(L - 1, Math.round(v * (L - 1)))];
        b.moveTo(st.x - sx - HALF, st.y + hh);
        b.lineTo(st.x - sx + HALF, st.y + hh);
        b.lineTo(st.x + sx + HALF, st.y - hh);
        b.lineTo(st.x + sx - HALF, st.y - hh);
        b.closePath();
      }
      for (let i = 0; i < L; i++) { ctx.fillStyle = mixHex(DARK.line, DARK.fg, i / (L - 1)); ctx.fill(buckets[i]); }
      vignette(ctx, w, h, "22,22,22", 0.35, 0.72, 0.8);
    },
  },

  // Halftone dots; the mark lives in the dot sizes and dark rings pulse out from it.
  halftone: {
    init(w, h) {
      const sp = 10, q = 4, mw = Math.ceil(w / q), mh = Math.ceil(h / q);
      const mc = document.createElement("canvas");
      mc.width = mw; mc.height = mh;
      const m = mc.getContext("2d");
      const lw = Math.min(w * 0.7, 470), s = lw / 467, lh = 285 * s;
      const ox = (w - lw) / 2, oy = (h - lh) / 2 - h * 0.02;
      m.filter = "blur(2.5px)";
      m.setTransform(s / q, 0, 0, s / q, ox / q, oy / q);
      m.fillStyle = "#000";
      LOGO_PATHS.forEach((p) => m.fill(new Path2D(p)));
      const data = m.getImageData(0, 0, mw, mh).data;
      const cx = w / 2, cy = oy + lh / 2, dots = [];
      let row = 0;
      for (let y = sp / 2; y < h + sp; y += sp * 0.866, row++) {
        for (let x = (row % 2) * (sp / 2); x < w + sp; x += sp) {
          const mx = Math.min(mw - 1, Math.max(0, Math.round(x / q))), my = Math.min(mh - 1, Math.max(0, Math.round(y / q)));
          dots.push({ x, y, m: data[(my * mw + mx) * 4 + 3] / 255, dist: Math.hypot(x - cx, y - cy) });
        }
      }
      return { dots, sp };
    },
    draw(ctx, w, h, t, d) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      const L = 10, paths = [];
      for (let i = 0; i < L; i++) paths.push(new Path2D());
      const rmax = d.sp * 0.5;
      for (const p of d.dots) {
        // Seconds from the nearest ring: one leaves the centre every 4.5s, and dots swell and darken as it passes.
        const away = ((((t - p.dist / 88) % 4.5) + 6.75) % 4.5) - 2.25;
        const rip = Math.exp(-((away / 0.38) ** 2));
        const v = 0.1 + 0.64 * p.m + (0.52 - 0.26 * p.m) * rip;
        const r = rmax * Math.max(0, Math.min(1, v));
        if (r < 0.35) continue;
        const b = paths[Math.min(L - 1, Math.round(Math.max(p.m, rip * 0.62) * (L - 1)))];
        b.moveTo(p.x + r, p.y);
        b.arc(p.x, p.y, r, 0, TAU);
      }
      for (let i = 0; i < L; i++) { ctx.fillStyle = mixHex(ZINC[300], ZINC[950], i / (L - 1)); ctx.fill(paths[i]); }
    },
  },

  // The dot matrix with the mark drawn into it; rings that reach the mark make it flare and echo.
  pulseMark: {
    init(w, h) {
      const g = 14, cols = Math.floor((w - 8) / g), rows = Math.floor((h - 8) / g);
      const x0 = (w - (cols - 1) * g) / 2, y0 = (h - (rows - 1) * g) / 2;
      const n = cols * rows, xs = new Float32Array(n), ys = new Float32Array(n), inside = new Uint8Array(n);
      const lw = Math.min(w * 0.56, 360), s = lw / 467, lh = 285 * s, ox = (w - lw) / 2, oy = (h - lh) / 2;
      const paths = LOGO_PATHS.map((p) => new Path2D(p));
      const probe = document.createElement("canvas").getContext("2d");
      let k = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = x0 + c * g, y = y0 + r * g;
        xs[k] = x; ys[k] = y;
        inside[k] = paths.some((p) => probe.isPointInPath(p, (x - ox) / s, (y - oy) / s)) ? 1 : 0;
        k++;
      }
      return { xs, ys, inside, n, g, x0, y0, cx: w / 2, cy: oy + lh / 2, lw, events: [], hits: [], lastEcho: -9, next: 0.2, rnd: rng(13) };
    },
    draw(ctx, w, h, t, d) {
      const SPEED = 150, WID = 14, LIFE = 5;
      if (t - d.next > 2) d.next = t;
      while (t >= d.next) {
        let x, y, tries = 0;
        do { x = w * (0.06 + 0.88 * d.rnd()); y = h * (0.06 + 0.88 * d.rnd()); tries++; } while (Math.hypot(x - d.cx, y - d.cy) < d.lw * 0.6 && tries < 10);
        x = d.x0 + Math.round((x - d.x0) / d.g) * d.g;
        y = d.y0 + Math.round((y - d.y0) / d.g) * d.g;
        const tint = d.rnd() < 0.45 ? hex(ACCENT_HEX[Math.floor(d.rnd() * ACCENT_HEX.length)]) : hex(DARK.fg);
        d.events.push({ x, y, t0: d.next, tint, D: Math.hypot(x - d.cx, y - d.cy), hit: false });
        d.next += 0.55 - Math.log(1 - d.rnd()) / 1.4;
      }
      for (const e of d.events) {
        if (e.hit) continue;
        const th = e.t0 + e.D / SPEED;
        if (t < th) continue;
        e.hit = true;
        const f = 1 - (th - e.t0) / LIFE;
        if (f <= 0.1) continue;
        d.hits.push({ t: th, k: f });
        if (th - d.lastEcho > 1.3) {
          d.events.push({ x: d.cx, y: d.cy, t0: th, tint: hex(DARK.fg), D: 0, hit: true, echo: true });
          d.lastEcho = th;
        }
      }
      d.events = d.events.filter((e) => t - e.t0 < LIFE);
      d.hits = d.hits.filter((x) => t - x.t < 3);
      let flare = 0;
      for (const x of d.hits) if (t >= x.t) flare += x.k * Math.exp(-(t - x.t) / 0.42);
      flare = Math.min(1, flare);
      const breath = 0.5 + 0.5 * Math.sin(t * 1.3);
      const act = [];
      for (const e of d.events) {
        const age = t - e.t0;
        if (age >= 0) act.push({ e, age, R: age * SPEED, f: (1 - age / LIFE) * (e.echo ? 0.9 : 1) });
      }
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const ga = 0.04 + 0.025 * breath + 0.2 * flare;
      const glow = ctx.createRadialGradient(d.cx, d.cy, 0, d.cx, d.cy, d.lw * 0.8);
      glow.addColorStop(0, `rgba(231,231,231,${ga})`);
      glow.addColorStop(1, "rgba(231,231,231,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const a of act) {
        ctx.strokeStyle = `rgba(${a.e.tint.join(",")},${(a.e.echo ? 0.2 : 0.11) * a.f})`;
        ctx.beginPath();
        ctx.arc(a.e.x, a.e.y, a.R, 0, TAU);
        ctx.stroke();
      }
      const base = new Path2D(), B = hex(DARK.border), F = hex(DARK.fg);
      for (let i = 0; i < d.n; i++) {
        const x = d.xs[i], y = d.ys[i];
        let I = 0, cr = 0, cg = 0, cb = 0;
        for (const a of act) {
          const dx = x - a.e.x, dy = y - a.e.y;
          const dd = Math.sqrt(dx * dx + dy * dy) - a.R;
          if (dd > 3 * WID || dd < -200) continue;
          let k = Math.exp(-(dd * dd) / (WID * WID));
          if (dd < 0) k = Math.max(k, 0.14 * Math.exp(dd / 45));
          k *= 1.2 * a.f;
          if (k < 0.012) continue;
          I += k; cr += a.e.tint[0] * k; cg += a.e.tint[1] * k; cb += a.e.tint[2] * k;
        }
        if (d.inside[i]) {
          // Fixed size; a hit only brightens the mark.
          const s = Math.min(1, 0.36 + 0.08 * breath + 0.7 * flare + I);
          ctx.fillStyle = `rgb(${(B[0] + (F[0] - B[0]) * s) | 0},${(B[1] + (F[1] - B[1]) * s) | 0},${(B[2] + (F[2] - B[2]) * s) | 0})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.7, 0, TAU);
          ctx.fill();
          continue;
        }
        if (I < 0.02) { base.moveTo(x + 1.2, y); base.arc(x, y, 1.2, 0, TAU); continue; }
        const s = Math.min(1, I), inv = 1 / I;
        ctx.fillStyle = `rgb(${(B[0] + (cr * inv - B[0]) * s) | 0},${(B[1] + (cg * inv - B[1]) * s) | 0},${(B[2] + (cb * inv - B[2]) * s) | 0})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + 2 * s, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = DARK.border;
      ctx.fill(base);
      for (const a of act) {
        if (a.e.echo || a.age >= 0.5) continue;
        const k = 1 - a.age / 0.5;
        ctx.fillStyle = `rgba(${a.e.tint.join(",")},${k})`;
        ctx.beginPath();
        ctx.arc(a.e.x, a.e.y, 2.2 + 2.5 * k, 0, TAU);
        ctx.fill();
      }
      vignette(ctx, w, h, "22,22,22", 0.36, 0.8, 0.6);
    },
  },

  // Pendulum wave seen from above: each row swings at a slightly different rate; all realign every T seconds.
  pendulum: {
    init(w, h) {
      const N = 22, top = h * 0.1, bottom = h * 0.9;
      return { N, top, gap: (bottom - top) / (N - 1), cx: w / 2, A: Math.min(w * 0.36, 240), T: 40, K: 20 };
    },
    draw(ctx, w, h, t, d) {
      const { N, top, gap, cx, A, T, K } = d;
      const X = (i, tt) => cx + A * Math.cos((TAU * (K + i) * tt) / T);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      const tracks = new Path2D();
      for (let i = 0; i < N; i++) { const y = top + i * gap; tracks.moveTo(cx - A - 16, y); tracks.lineTo(cx + A + 16, y); }
      ctx.lineWidth = 1;
      ctx.strokeStyle = ZINC[100];
      ctx.stroke(tracks);
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = ZINC[300];
      ctx.beginPath();
      ctx.moveTo(cx, top - 28);
      ctx.lineTo(cx, top + (N - 1) * gap + 28);
      ctx.stroke();
      ctx.setLineDash([]);
      const pts = [];
      for (let i = 0; i < N; i++) pts.push([X(i, t), top + i * gap]);
      const sn = new Path2D();
      sn.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < N - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(N - 1, i + 2)];
        sn.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
      }
      ctx.strokeStyle = ZINC[300];
      ctx.lineWidth = 1.25;
      ctx.stroke(sn);
      for (let k = 6; k >= 1; k--) {
        const g = new Path2D(), rk = 6.5 - k * 0.45;
        for (let i = 0; i < N; i++) { const x = X(i, t - k * 0.024), y = top + i * gap; g.moveTo(x + rk, y); g.arc(x, y, rk, 0, TAU); }
        ctx.fillStyle = `rgba(9,9,11,${0.045 * (7 - k)})`;
        ctx.fill(g);
      }
      for (let i = 0; i < N; i++) {
        const [x, y] = pts[i];
        ctx.fillStyle = mixHex(ZINC[950], SUITE_HEX[i % 13], Math.exp(-(((x - cx) / 22) ** 2)));
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, TAU);
        ctx.fill();
      }
    },
  },

  // Contour map of a slowly shifting terrain; one elevation line sweeps up through the levels.
  topo: {
    init(w, h) {
      const res = 8, nx = Math.ceil(w / res) + 1, ny = Math.ceil(h / res) + 1;
      return { res, nx, ny, f: new Float32Array(nx * ny), n: noise3(41) };
    },
    draw(ctx, w, h, t, d) {
      const { res, nx, ny, f, n } = d;
      const z1 = t * 0.06, z2 = t * 0.09 + 7.1;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const x = i * res, y = j * res;
        f[j * nx + i] = 0.68 * n(x * 0.0052, y * 0.0052, z1) + 0.32 * n(x * 0.0125 + 31.7, y * 0.0125 + 12.3, z2);
      }
      const L0 = 0.12, dl = 0.045, NL = 17;
      const hl = L0 + ((t * 0.03) % 1) * (NL - 1) * dl;
      const thin = new Path2D(), idx = new Path2D(), hot = new Path2D();
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = f[j * nx + i], b = f[j * nx + i + 1], c = f[(j + 1) * nx + i + 1], e = f[(j + 1) * nx + i];
        const lo = Math.min(a, b, c, e), hi = Math.max(a, b, c, e);
        const x = i * res, y = j * res;
        const k0 = Math.max(0, Math.ceil((lo - L0) / dl)), k1 = Math.min(NL - 1, Math.floor((hi - L0) / dl));
        for (let k = k0; k <= k1; k++) msSeg(k % 4 === 0 ? idx : thin, a, b, c, e, L0 + k * dl, x, y, res);
        if (lo < hl && hi > hl) msSeg(hot, a, b, c, e, hl, x, y, res);
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineWidth = 1;
      ctx.strokeStyle = ZINC[200];
      ctx.stroke(thin);
      ctx.strokeStyle = ZINC[400];
      ctx.stroke(idx);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = ZINC[950];
      ctx.stroke(hot);
      vignette(ctx, w, h, "255,255,255", 0.32, 0.75, 0.9);
    },
  },

  // Two concentric ring fields sliding past each other inside a feathered lens.
  moire: {
    init(w, h) {
      return { cx: w / 2, cy: h / 2, R: Math.min(w, h) * 0.43 };
    },
    draw(ctx, w, h, t, d) {
      const { cx, cy, R } = d;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.clip();
      const sp = 8;
      const cs = [
        [cx + 34 * Math.cos(t * 0.29), cy + 46 * Math.sin(t * 0.21)],
        [cx - 34 * Math.cos(t * 0.29 + 0.8), cy - 46 * Math.sin(t * 0.21 + 0.5)],
      ];
      ctx.lineWidth = 1;
      ctx.strokeStyle = ZINC[900];
      for (const [x, y] of cs) {
        const p = new Path2D(), max = R + Math.hypot(x - cx, y - cy) + sp;
        for (let r = sp; r < max; r += sp) { p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); }
        ctx.stroke(p);
      }
      const fade = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R);
      fade.addColorStop(0, "rgba(255,255,255,0)");
      fade.addColorStop(1, "rgba(255,255,255,1)");
      ctx.fillStyle = fade;
      ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      ctx.restore();
    },
  },

  // Isometric columns: a wave rises from the centre, the columns it lifts inside the mark stay up to spell it, then drop.
  iso: {
    // Loops start from a flat field, so the reduced-motion frame jumps to where the mark is fully up.
    stillTime: 6.5,
    init(w, h) {
      // Wider than the panel, so the field's side corners bleed off and the mark gets more columns.
      const n = 37, tw = Math.min(46, (w * 1.18) / n), th = tw / 2, c = (n - 1) / 2, minZ = tw * 1.4, maxZ = tw * 3.2;
      // Stretched taller than the 2:1 ground plane so the slashes keep their steepness on screen.
      const lw = n * tw * 0.58, s = lw / 467, sy = s * 0.72;
      const cx = w / 2, cy = h / 2 + (minZ + maxZ) * 0.5;
      const paths = LOGO_PATHS.map((p) => new Path2D(p));
      const probe = document.createElement("canvas").getContext("2d");
      const cols = [];
      // Back to front, so nearer columns paint over farther ones.
      for (let a = 0; a <= 2 * (n - 1); a++) {
        for (let i = Math.max(0, a - n + 1); i <= Math.min(n - 1, a); i++) {
          const j = a - i, X = ((i - j) * tw) / 2, Y = ((i + j - 2 * c) * th) / 2;
          if (Math.abs(X) > w / 2 + tw) continue;
          const inMark = paths.some((p) => probe.isPointInPath(p, X / s + 467 / 2, Y / sy + 285 / 2));
          cols.push({ X: cx + X, Y: cy + Y, rho: Math.hypot(i - c, j - c) / (c * Math.SQRT2), inMark });
        }
      }
      return { cols, tw, th, minZ, maxZ, tones: Array.from({ length: 33 }, (_, k) => mixHex("#ffffff", ZINC[950], k / 32)) };
    },
    draw(ctx, w, h, t, d) {
      const { cols, tw, th, minZ, maxZ, tones } = d, hw = (tw / 2) * 0.9, hh = (th / 2) * 0.9;
      const LOOP = 8, SPREAD = 1.9, DROP_AT = 5.3;
      const p = (t - 3) % LOOP;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.75;
      const outline = (x0, y0, x1, y1, x2, y2, x3, y3) => {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
      };
      const face = (fill, x0, y0, x1, y1, x2, y2, x3, y3) => {
        ctx.beginPath();
        outline(x0, y0, x1, y1, x2, y2, x3, y3);
        ctx.fillStyle = fill;
        ctx.fill();
      };
      for (const { X, Y, rho, inMark } of cols) {
        // Seconds since the wave front reached this column; it travels outward from the centre.
        const u = p - rho * SPREAD;
        const crest = Math.exp(-(((u - 0.32) / 0.26) ** 2));
        const lift = inMark ? ease(Math.max(0, Math.min(1, (u - 0.12) / 0.6))) * (1 - ease(Math.max(0, Math.min(1, (p - DROP_AT - rho * 0.6) / 0.7)))) : 0;
        // The idle ripple fades out as a column lifts: uneven heights would show its side walls as lines across the mark.
        const z = minZ + 5 * (1 - lift) * (0.5 + 0.5 * Math.sin(rho * 14 - t * 1.9)) + maxZ * (lift + crest * (inMark ? 0.3 : 0.62));
        const tone = Math.round(32 * Math.max(lift, crest * 0.22));
        const top = Y - z;
        face(ZINC[100], X - hw, top, X, top + hh, X, Y + hh, X - hw, Y);
        face(ZINC[200], X, top + hh, X + hw, top, X + hw, Y, X, Y + hh);
        // Raised tops grow to touch and lose their outline, so the mark's strokes read as solid shapes.
        const tw2 = hw + (tw / 2 - hw) * lift, th2 = hh + (th / 2 - hh) * lift;
        face(tones[tone], X, top - th2, X + tw2, top, X, top + th2, X - tw2, top);
        // One stroke per column instead of one per face, since strokes are the costly part of this field.
        ctx.beginPath();
        ctx.moveTo(X - hw, top);
        ctx.lineTo(X - hw, Y);
        ctx.lineTo(X, Y + hh);
        ctx.lineTo(X + hw, Y);
        ctx.lineTo(X + hw, top);
        ctx.moveTo(X, top + hh);
        ctx.lineTo(X, Y + hh);
        if (lift <= 0.5) outline(X, top - th2, X + tw2, top, X, top + th2, X - tw2, top);
        ctx.strokeStyle = ZINC[300];
        ctx.stroke();
        if (lift > 0.5) {
          ctx.beginPath();
          outline(X, top - th2, X + tw2, top, X, top + th2, X - tw2, top);
          ctx.strokeStyle = tones[tone];
          ctx.stroke();
        }
      }
    },
  },

  // Rows of product names scrolling in alternating directions; the centre column lights them.
  typewall: {
    // Word widths are measured in init, so it re-runs once the web font has loaded.
    usesFonts: true,
    init(w, h, env) {
      const words = ["Flow", "Notes", "Assets", "Grey", "Forms", "Events", "Content", "Campaign", "Pods", "Comms", "Docs", "Property"];
      const lh = 78, gap = 30, font = `500 60px ${env.fontFamily}`;
      const m = document.createElement("canvas").getContext("2d");
      m.font = font;
      if ("letterSpacing" in m) m.letterSpacing = "-1.5px";
      const W = words.map((x) => m.measureText(x).width);
      const rows = Math.ceil(h / lh) + 1, y0 = (h - (rows - 1) * lh) / 2;
      const rowsData = Array.from({ length: rows }, (_, k) => {
        let x = 0;
        const items = words.map((_, q) => { const wi = (q * 5 + k * 3) % 13; const it = { wi, x }; x += W[wi] + gap; return it; });
        return { items, len: x, dir: k % 2 ? 1 : -1, sp: 14 + (k % 3) * 6, y: y0 + k * lh };
      });
      return { words, W, rowsData, font };
    },
    draw(ctx, w, h, t, d) {
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.font = d.font;
      if ("letterSpacing" in ctx) ctx.letterSpacing = "-1.5px";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#303030";
      const band = w * 0.3, mid = w / 2;
      for (const row of d.rowsData) {
        const off = (((t * row.sp * row.dir) % row.len) + row.len) % row.len;
        for (let base = -off; base < w; base += row.len) {
          for (const it of row.items) {
            const x = base + it.x, ww = d.W[it.wi];
            if (x > w || x + ww < 0) continue;
            const word = d.words[it.wi];
            ctx.strokeText(word, x, row.y);
            let a = 1 - Math.abs(x + ww / 2 - mid) / band;
            if (a > 0) {
              a = a * a * (3 - 2 * a);
              ctx.fillStyle = `rgba(231,231,231,${a})`;
              ctx.fillText(word, x, row.y);
            }
          }
        }
      }
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(22,22,22,1)");
      g.addColorStop(0.16, "rgba(22,22,22,0)");
      g.addColorStop(0.84, "rgba(22,22,22,0)");
      g.addColorStop(1, "rgba(22,22,22,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },

  // A tumbling torus of points; a bright band travels around the ring.
  torus: {
    init(w, h) {
      const R = Math.min(w, h) * 0.24, r = R * 0.42, nu = 90, nv = 30;
      const n = nu * nv, P = new Float32Array(n * 3), U = new Float32Array(n);
      let k = 0;
      for (let i = 0; i < nu; i++) {
        const u = (i / nu) * TAU;
        for (let j = 0; j < nv; j++) {
          const v = (j / nv) * TAU + (i % 2) * (Math.PI / nv);
          P[k * 3] = (R + r * Math.cos(v)) * Math.cos(u);
          P[k * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
          P[k * 3 + 2] = r * Math.sin(v);
          U[k] = u;
          k++;
        }
      }
      return { P, U, n, cx: w / 2, cy: h / 2, ext: R + r };
    },
    draw(ctx, w, h, t, d) {
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const ax = 1.1 + 0.2 * Math.sin(t * 0.19), ay = 0.35 * Math.sin(t * 0.13), az = t * 0.22;
      const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay), cc = Math.cos(az), sc = Math.sin(az);
      const L = 12, norm = [], hot = [];
      for (let i = 0; i < L; i++) { norm.push(new Path2D()); hot.push(new Path2D()); }
      const band = (t * 0.7) % TAU, F = 900;
      for (let k = 0; k < d.n; k++) {
        const x = d.P[k * 3], y = d.P[k * 3 + 1], z = d.P[k * 3 + 2];
        const x1 = x * cc - y * sc, y1 = x * sc + y * cc;
        const y2 = y1 * ca - z * sa, z2 = y1 * sa + z * ca;
        const x3 = x1 * cb + z2 * sb, z3 = -x1 * sb + z2 * cb;
        const pz = F / (F - z3), sx = d.cx + x3 * pz, sy = d.cy + y2 * pz;
        const depth = Math.max(0, Math.min(1, (z3 / d.ext + 1) / 2));
        let du = Math.abs(d.U[k] - band);
        du = Math.min(du, TAU - du);
        const hk = Math.exp(-(du * du) / 0.018);
        const rad = (0.6 + 1.4 * depth) * pz * (1 + 0.7 * hk);
        const p = (hk > 0.35 ? hot : norm)[Math.min(L - 1, Math.floor(depth * L))];
        p.moveTo(sx + rad, sy);
        p.arc(sx, sy, rad, 0, TAU);
      }
      for (let i = 0; i < L; i++) {
        const q = i / (L - 1);
        ctx.fillStyle = mixHex("#262626", "#a3a3a3", q);
        ctx.fill(norm[i]);
        ctx.fillStyle = mixHex("#3f3f46", "#ffffff", q);
        ctx.fill(hot[i]);
      }
      vignette(ctx, w, h, "22,22,22", 0.4, 0.8, 0.6);
    },
  },

  // Particle streams riding a slowly drifting noise current; a few run in an accent.
  flow: {
    // Trails only exist after a few frames, so a reduced-motion still needs a head start.
    settleFrames: 90,
    init(w, h) {
      const r = rng(77), ps = [];
      for (let i = 0; i < 300; i++) ps.push(flowSpawn({}, w, h, r, true));
      return { ps, n: noise3(19), r, lastT: null };
    },
    draw(ctx, w, h, t, d) {
      const dt = d.lastT == null ? 1 / 60 : Math.max(0, Math.min(0.05, t - d.lastT));
      d.lastT = t;
      const TL = 90;
      for (const p of d.ps) {
        if (p.dying) {
          p.tr.splice(0, 4);
          if (p.tr.length < 4) flowSpawn(p, w, h, d.r, false);
          continue;
        }
        if (dt <= 0) continue;
        const a = -0.55 + (d.n(p.x * 0.0028, p.y * 0.0028, t * 0.04) - 0.5) * TAU * 1.3;
        p.x += Math.cos(a) * 95 * dt;
        p.y += Math.sin(a) * 95 * dt;
        p.age += dt;
        p.tr.push(p.x, p.y);
        if (p.tr.length > TL * 2) p.tr.splice(0, 2);
        if (p.age > p.life || p.x < -10 || p.y < -10 || p.x > w + 10 || p.y > h + 10) p.dying = true;
      }
      ctx.fillStyle = DARK.bg;
      ctx.fillRect(0, 0, w, h);
      const NB = 4, mono = [], acc = [];
      for (let i = 0; i < NB; i++) { mono.push(new Path2D()); acc.push(new Path2D()); }
      for (const p of d.ps) {
        const n = p.tr.length / 2;
        if (n < 2) continue;
        const set = p.accent ? acc : mono;
        for (let s = 1; s < n; s++) {
          const path = set[Math.min(NB - 1, Math.floor((s / n) * NB))];
          path.moveTo(p.tr[(s - 1) * 2], p.tr[(s - 1) * 2 + 1]);
          path.lineTo(p.tr[s * 2], p.tr[s * 2 + 1]);
        }
      }
      ctx.lineWidth = 1.15;
      ctx.lineCap = "round";
      for (let i = 0; i < NB; i++) {
        const a = 0.05 + (i / (NB - 1)) * 0.6;
        ctx.strokeStyle = `rgba(231,231,231,${a})`;
        ctx.stroke(mono[i]);
        ctx.strokeStyle = `rgba(56,189,248,${a + 0.15})`;
        ctx.stroke(acc[i]);
      }
      vignette(ctx, w, h, "22,22,22", 0.35, 0.8, 0.75);
    },
  },
};
