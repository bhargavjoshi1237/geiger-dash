// A tiny 3D graph renderer for the Grey showcase: a seeded force layout, a yaw/pitch camera and a 2D canvas painter.

const TAU = Math.PI * 2;
const CAMERA_DISTANCE = 3.1;

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInBall(random, radius) {
  const u = random() * TAU;
  const v = Math.acos(2 * random() - 1);
  const r = radius * Math.cbrt(random());
  return { x: r * Math.sin(v) * Math.cos(u), y: r * Math.sin(v) * Math.sin(u), z: r * Math.cos(v) };
}

// Same seed, same shape on every load: repulsion between all nodes, springs along links and a pull to the centre.
// Each step's move is capped by a cooling temperature, so well-linked nodes can't overshoot and blow the layout up.
export function layoutGraph(nodes, links, seed = 11) {
  const random = seeded(seed);
  const points = nodes.map(() => randomInBall(random, 1.2));
  const index = new Map(nodes.map((node, i) => [node.id, i]));
  const edges = links.map(([a, b]) => [index.get(a), index.get(b)]);
  const steps = 500;

  for (let step = 0; step < steps; step += 1) {
    const temperature = 0.1 * (1 - step / steps) + 0.003;
    const force = points.map((point) => ({ x: -point.x * 0.06, y: -point.y * 0.06, z: -point.z * 0.06 }));
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        const d2 = dx * dx + dy * dy + dz * dz + 0.02;
        const push = 0.012 / (d2 * Math.sqrt(d2));
        force[i].x += dx * push; force[i].y += dy * push; force[i].z += dz * push;
        force[j].x -= dx * push; force[j].y -= dy * push; force[j].z -= dz * push;
      }
    }
    for (const [a, b] of edges) {
      const dx = points[b].x - points[a].x;
      const dy = points[b].y - points[a].y;
      const dz = points[b].z - points[a].z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
      const pull = (d - 0.35) * 0.12;
      force[a].x += (dx / d) * pull; force[a].y += (dy / d) * pull; force[a].z += (dz / d) * pull;
      force[b].x -= (dx / d) * pull; force[b].y -= (dy / d) * pull; force[b].z -= (dz / d) * pull;
    }
    points.forEach((point, i) => {
      const { x, y, z } = force[i];
      const length = Math.sqrt(x * x + y * y + z * z);
      if (!length || !Number.isFinite(length)) return;
      const move = Math.min(length, temperature) / length;
      point.x += x * move;
      point.y += y * move;
      point.z += z * move;
    });
  }

  // Scale by the 92nd-percentile radius so one stray node can't shrink the whole cloud.
  const radii = points.map((p) => Math.hypot(p.x, p.y, p.z)).sort((a, b) => a - b);
  const radius = radii[Math.floor(radii.length * 0.92)] || 1;
  return new Map(nodes.map((node, i) => [node.id, { x: points[i].x / radius, y: points[i].y / radius, z: points[i].z / radius }]));
}

// Faint specks around the graph that turn with it, for depth.
export function makeDust(count, seed = 3) {
  const random = seeded(seed);
  return Array.from({ length: count }, () => ({ ...randomInBall(random, 2.4), alpha: 0.08 + random() * 0.22 }));
}

export function rotate(point, yaw, pitch) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = point.x * cy + point.z * sy;
  const z1 = -point.x * sy + point.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: point.y * cp - z1 * sp, z: point.y * sp + z1 * cp };
}

// The yaw and pitch that turn `point` to face the camera.
export function aimAt(point) {
  const yaw = Math.atan2(-point.x, point.z);
  const z1 = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  return { yaw, pitch: Math.atan2(point.y, z1) };
}

export function shortestTurn(from, to) {
  let delta = (to - from) % TAU;
  if (delta > Math.PI) delta -= TAU;
  if (delta < -Math.PI) delta += TAU;
  return delta;
}

const rgba = ([r, g, b], alpha) => `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;

// Opens a path for one entity glyph centred on (x, y); a ring is stroked, everything else filled.
function traceShape(ctx, shape, x, y, r) {
  ctx.beginPath();
  if (shape === "square") {
    const side = r * 1.7;
    ctx.roundRect(x - side / 2, y - side / 2, side, side, r * 0.3);
  } else if (shape === "diamond") {
    const d = r * 1.3;
    ctx.moveTo(x, y - d);
    ctx.lineTo(x + d, y);
    ctx.lineTo(x, y + d);
    ctx.lineTo(x - d, y);
    ctx.closePath();
  } else if (shape === "triangle") {
    const t = r * 1.35;
    ctx.moveTo(x, y - t);
    ctx.lineTo(x + t * 0.95, y + t * 0.7);
    ctx.lineTo(x - t * 0.95, y + t * 0.7);
    ctx.closePath();
  } else {
    ctx.arc(x, y, shape === "ring" ? r * 0.85 : r, 0, TAU);
  }
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

// Paints one frame and returns the projected nodes, front-most last, for hit-testing.
export function drawFrame(ctx, frame) {
  const { width, height, yaw, pitch, positions, nodes, links, dust, degree, shapes, colors, focus, selectedId, hoverId, pulses, now, font } = frame;
  // Sits in the upper part of the frame, clear of the ask bar along the bottom.
  const scale = Math.min(width * 1.1, height * 1.2) * 0.9;
  const cx = width / 2;
  const cy = height * 0.43;
  const project = (point) => {
    const p = rotate(point, yaw, pitch);
    const s = scale / (CAMERA_DISTANCE - p.z);
    return { x: cx + p.x * s, y: cy - p.y * s, z: p.z, s: s / (scale / CAMERA_DISTANCE) };
  };

  ctx.clearRect(0, 0, width, height);

  for (const speck of dust) {
    const p = project(speck);
    if (p.s <= 0) continue;
    ctx.fillStyle = rgba(colors.fg, speck.alpha * Math.min(1, p.s));
    ctx.fillRect(p.x, p.y, 1.2 * p.s, 1.2 * p.s);
  }

  const projected = nodes.map((node) => ({ node, ...project(positions.get(node.id)) }));
  const byId = new Map(projected.map((p) => [p.node.id, p]));
  const lit = (id) => !focus || focus.has(id);
  const depth = (z) => (z + 1) / 2;

  for (const [a, b] of links) {
    const pa = byId.get(a);
    const pb = byId.get(b);
    const both = focus && focus.has(a) && focus.has(b);
    const d = depth((pa.z + pb.z) / 2);
    if (both) {
      ctx.strokeStyle = rgba(colors.fg, 0.55);
      ctx.lineWidth = 1.4;
    } else {
      ctx.strokeStyle = rgba(colors.fg, (0.04 + d * 0.1) * (focus ? 0.4 : 1));
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();

    // A spark travels along every lit link.
    if (both) {
      const t = ((now / 1400 + (a.length * 7 + b.length * 3) / 17) % 1 + 1) % 1;
      ctx.fillStyle = rgba(colors.fg, 0.9);
      ctx.beginPath();
      ctx.arc(pa.x + (pb.x - pa.x) * t, pa.y + (pb.y - pa.y) * t, 1.6, 0, TAU);
      ctx.fill();
    }
  }

  // Monochrome nodes: brightness carries depth and focus, shape carries the entity type.
  // Only a light ink on a dark ground glows; in light mode a "glow" would just be a grey smudge.
  const glows = colors.bg[0] + colors.bg[1] + colors.bg[2] < 384;
  const ordered = [...projected].sort((p, q) => p.z - q.z);
  for (const p of ordered) {
    const { node } = p;
    const shape = shapes[node.type] || "circle";
    const on = lit(node.id);
    const emphasis = node.id === selectedId || node.id === hoverId;
    const radius = (2.6 + Math.min(degree.get(node.id) || 0, 8) * 0.38) * p.s * (emphasis ? 1.35 : 1);
    const alpha = focus ? (on ? 0.95 : 0.14) : 0.28 + depth(p.z) * 0.62;

    if (glows && ((focus && on) || emphasis)) {
      ctx.shadowColor = rgba(colors.fg, 0.6);
      ctx.shadowBlur = 14 * p.s;
    }
    traceShape(ctx, shape, p.x, p.y, radius);
    if (shape === "ring") {
      ctx.strokeStyle = rgba(colors.fg, alpha);
      ctx.lineWidth = Math.max(1.2, radius * 0.42);
      ctx.stroke();
    } else {
      ctx.fillStyle = rgba(colors.fg, alpha);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (node.id === selectedId) {
      ctx.strokeStyle = rgba(colors.fg, 0.85);
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 5, 0, TAU);
      ctx.stroke();
    }
    p.radius = radius;
  }

  for (const pulse of pulses) {
    const p = byId.get(pulse.id);
    const age = (now - pulse.start) / 1600;
    if (!p || age < 0 || age > 1) continue;
    ctx.strokeStyle = rgba(colors.fg, (1 - age) * 0.85);
    ctx.lineWidth = 2 * (1 - age) + 0.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 4) + 4 + age * 30, 0, TAU);
    ctx.stroke();
  }

  // Labels: lit nodes when something is in focus, otherwise the nearest non-source nodes plus whatever is hovered.
  ctx.font = `500 11px ${font}`;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (const p of ordered) {
    const { node } = p;
    const hovered = node.id === hoverId || node.id === selectedId;
    const show = hovered || (focus ? focus.has(node.id) : depth(p.z) > 0.8 && node.type !== "source");
    if (!show) continue;
    const text = truncate(node.label, hovered ? 40 : 22);
    const x = p.x + (p.radius || 4) + 6;
    const alpha = hovered || focus ? 0.95 : 0.35 + depth(p.z) * 0.45;
    ctx.strokeStyle = rgba(colors.bg, 0.85 * alpha);
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, p.y);
    ctx.fillStyle = rgba(colors.fg, alpha);
    ctx.fillText(text, x, p.y);
  }

  return ordered;
}
