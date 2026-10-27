// Fluted-glass hero artifact: a shader-painted cube seen through a row of refracting glass cylinders.
// Single-pass WebGL port of the Raycast hero scene (R3F + MeshTransmissionMaterial) with no three.js dependency.

// Scene layout in world units, mirroring Raycast's published hero config; the liquid warp is capped well below
// theirs (15) because past ~1.5 it acts like a prism and slides the whole cube off-centre.
export const GLASS_SCENE = {
  cameraZ: 16.54,
  fov: 35,
  cubeZ: -9,
  cubeY: 0,
  cubeSize: 7,
  glassAngle: 0.73,
  ior: 1.5,
  thickness: 1,
  anisotropicBlur: 2.88,
  roughness: 0.35,
  chromaticAberration: 3,
  distortionMax: 1.2,
  distortionRate: 0.1,
  distortionScale: 0.08,
  temporalDistortion: 0.025,
  patternSpeed: 0.1,
  patternSize: 0.99,
  rotationInfluence: 0.3,
};

// Cube ramps as [low, mid, high] RGB with an output gamma; light variants stay pale so dark text reads over them.
export const GLASS_PALETTES = {
  ember: {
    dark: { low: [184, 2, 50], mid: [255, 122, 152], high: [244, 254, 255], gamma: 3 },
    light: { low: [255, 214, 222], mid: [255, 122, 152], high: [255, 244, 246], gamma: 1 },
  },
  indigo: {
    dark: { low: [40, 22, 150], mid: [129, 140, 248], high: [238, 242, 255], gamma: 3 },
    light: { low: [224, 231, 255], mid: [129, 140, 248], high: [245, 247, 255], gamma: 1 },
  },
  mono: {
    dark: { low: [70, 70, 74], mid: [178, 178, 184], high: [255, 255, 255], gamma: 3 },
    light: { low: [236, 236, 238], mid: [168, 168, 174], high: [250, 250, 251], gamma: 1 },
  },
};

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const fragmentShader = (samples) => `
precision highp float;

uniform vec2 uResolution;
uniform float uTanHalf;
uniform float uCamZ;
uniform vec3 uBg;
uniform vec3 uHull[8];
uniform float uSoft;
uniform float uPhase;
uniform float uSize;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform float uGamma;
uniform float uGlassAngle;
uniform float uIor;
uniform float uThickness;
uniform float uSmear;
uniform float uRoughness;
uniform float uChroma;
uniform float uDistortion;
uniform float uDistortionScale;
uniform float uDrift;

#define SAMPLES ${samples}
#define CYL_RADIUS 0.5
#define CYL_HALF_HEIGHT 7.5

// Ashima 3D simplex noise (MIT) for the slow liquid warp of the glass normals.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = 0.142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float hash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

// Screen space: y spans [-1, 1], x spans [-aspect, aspect].
vec2 project(vec3 w) { return w.xy / ((uCamZ - w.z) * uTanHalf); }

// Signed distance to the cube's projected silhouette (convex hull edges from the CPU).
float hullDistance(vec2 s) {
  float d = -1e3;
  for (int i = 0; i < 8; i++) d = max(d, dot(uHull[i].xy, s) + uHull[i].z);
  return d;
}

// Raycast's interfering-waves cube shader, sampled in screen space so every face shares one pattern.
vec3 cubePattern(vec2 s) {
  float aspect = uResolution.x / uResolution.y;
  vec2 xy = vec2(s.x / aspect, s.y) * 0.5 * uSize + 0.5;
  float t = uPhase;
  float horizontal = cos(3.0 * xy.x + t);
  float diagonal = cos(xy.x * cos(t) + 5.0 * xy.y * sin(t) + t);
  float rx = 0.3 * xy.x - 0.5 + cos(t);
  float ry = 0.3 * xy.y - 0.5 + sin(t * 0.5);
  float radial = sin(20.0 * sqrt(rx * rx + ry * ry + 1.0) + t);
  float nv = ((horizontal + diagonal + radial) / 3.0 + 1.0) * 0.5;
  vec3 color = nv < 0.5 ? mix(uLow, uMid, nv * 2.0) : mix(uMid, uHigh, (nv - 0.5) * 2.0);
  return pow(color, vec3(uGamma));
}

vec3 scene(vec2 s) {
  float coverage = 1.0 - smoothstep(-uSoft, uSoft, hullDistance(s));
  if (coverage <= 0.0) return uBg;
  return mix(uBg, cubePattern(s), coverage);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 s = (gl_FragCoord.xy / uResolution * 2.0 - 1.0) * vec2(aspect, 1.0);
  vec3 rd = normalize(vec3(s * uTanHalf, -1.0));

  // Glass-local ray: the cylinder row is rotated about z, axes along local y, centres at x = -7..8.
  float ca = cos(uGlassAngle);
  float sa = sin(uGlassAngle);
  vec3 rl = vec3(mat2(ca, -sa, sa, ca) * rd.xy, rd.z);
  float k0 = floor(rl.x * (-uCamZ / rl.z) + 7.5);
  float tHit = 1e9;
  float cx = 0.0;
  for (int j = -1; j <= 1; j++) {
    float k = k0 + float(j);
    if (k < 0.0 || k > 15.0) continue;
    float c = k - 7.0;
    vec2 o = vec2(-c, uCamZ);
    vec2 d = rl.xz;
    float a = dot(d, d);
    float b = dot(o, d);
    float disc = b * b - a * (dot(o, o) - CYL_RADIUS * CYL_RADIUS);
    if (disc <= 0.0) continue;
    float t = (-b - sqrt(disc)) / a;
    if (t < tHit && abs(rl.y * t) < CYL_HALF_HEIGHT) { tHit = t; cx = c; }
  }

  vec3 color;
  if (tHit > 1e8) {
    color = scene(s);
  } else {
    vec3 pl = rl * tHit + vec3(0.0, 0.0, uCamZ);
    vec3 nl = normalize(vec3(pl.x - cx, 0.0, pl.z));
    mat2 toWorld = mat2(ca, sa, -sa, ca);
    vec3 p = vec3(toWorld * pl.xy, pl.z);
    vec3 n = vec3(toWorld * nl.xy, nl.z);

    vec3 warp = vec3(0.0);
    if (uDistortion > 0.0) {
      vec3 q = p * uDistortionScale;
      vec3 drift = vec3(uDrift, -uDrift, -uDrift);
      warp = uDistortion * vec3(snoise(q + drift), snoise(q.zxy - drift), snoise(q.yxz + drift));
    }

    // MeshTransmissionMaterial-style transmission: jittered normals, smeared thickness, per-channel IOR.
    float jitterAmount = uRoughness * uRoughness * 2.0;
    float offset = hash(vec3(gl_FragCoord.xy, 0.0));
    color = vec3(0.0);
    for (int i = 0; i < SAMPLES; i++) {
      float fi = float(i) * 4.0 + 1.0;
      vec3 jitter = normalize(vec3(
        hash(vec3(gl_FragCoord.xy, fi)) - 0.5,
        hash(vec3(gl_FragCoord.xy, fi + 1.0)) - 0.5,
        hash(vec3(gl_FragCoord.xy, fi + 2.0)) - 0.5
      )) * pow(hash(vec3(gl_FragCoord.xy, fi + 3.0)), 0.33);
      vec3 sn = normalize(n + jitterAmount * jitter + warp);
      float f = (float(i) + offset) / float(SAMPLES);
      float th = uThickness + uSmear * f;
      color.r += scene(project(p + refract(rd, sn, 1.0 / uIor) * th)).r;
      color.g += scene(project(p + refract(rd, sn, 1.0 / (uIor * (1.0 + uChroma * f))) * th)).g;
      color.b += scene(project(p + refract(rd, sn, 1.0 / (uIor * (1.0 + 2.0 * uChroma * f))) * th)).b;
    }
    color /= float(SAMPLES);
  }

  // Sub-LSB dither keeps the dark gradients from banding.
  color += (hash(vec3(gl_FragCoord.xy, 97.0)) - 0.5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}
`;

const UNIFORMS = [
  "uResolution", "uTanHalf", "uCamZ", "uBg", "uHull", "uSoft", "uPhase", "uSize", "uLow", "uMid", "uHigh",
  "uGamma", "uGlassAngle", "uIor", "uThickness", "uSmear", "uRoughness", "uChroma", "uDistortion",
  "uDistortionScale", "uDrift",
];

// Unity-style SmoothDamp, the same critically damped spring maath uses for the cube's motion.
function damp(state, key, target, smoothTime, dt) {
  const omega = 2 / Math.max(1e-4, smoothTime);
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = state[key] - target;
  const temp = (state[`${key}V`] + omega * change) * dt;
  state[`${key}V`] = (state[`${key}V`] - omega * temp) * decay;
  state[key] = target + (change + temp) * decay;
}

// Projects the rotated cube's corners and returns its convex silhouette as up to 8 outward edge lines.
function cubeSilhouette({ rx, ry, scale }, tanHalf) {
  const half = (GLASS_SCENE.cubeSize / 2) * scale;
  const cosX = Math.cos(rx), sinX = Math.sin(rx), cosY = Math.cos(ry), sinY = Math.sin(ry);
  const points = [];
  for (const x of [-half, half]) for (const y of [-half, half]) for (const z of [-half, half]) {
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const k = 1 / ((GLASS_SCENE.cameraZ - (z2 + GLASS_SCENE.cubeZ)) * tanHalf);
    points.push([x1 * k, (y2 + GLASS_SCENE.cubeY) * k]);
  }

  // Andrew's monotone chain, counter-clockwise.
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const chain = (list) => {
    const out = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 1e-9) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  const hull = [...chain(points), ...chain([...points].reverse())];

  const edges = new Float32Array(24);
  for (let i = 0; i < 8; i++) edges.set([0, 0, -1e3], i * 3);
  if (hull.length < 3) {
    edges.set([0, 0, 1e3], 0);
    return edges;
  }
  hull.slice(0, 8).forEach((a, i, list) => {
    const b = list[(i + 1) % list.length];
    const nx = b[1] - a[1];
    const ny = -(b[0] - a[0]);
    const len = Math.hypot(nx, ny) || 1;
    edges.set([nx / len, ny / len, -(nx * a[0] + ny * a[1]) / len], i * 3);
  });
  return edges;
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[glass-backdrop] shader", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const toUnit = (rgb) => rgb.map((v) => v / 255);

// Mounts the scene on a canvas; returns null when WebGL is unavailable so the caller can keep its fallback.
export function createGlassRenderer(
  canvas,
  { palette = GLASS_PALETTES.ember.dark, background = [0, 0, 0], reducedMotion = false, onFirstFrame } = {},
) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const samples = window.innerWidth < 768 ? 4 : 6;
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader(samples));
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[glass-backdrop] link", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]));
  const tanHalf = Math.tan((GLASS_SCENE.fov * Math.PI) / 360);
  gl.uniform1f(u.uTanHalf, tanHalf);
  gl.uniform1f(u.uCamZ, GLASS_SCENE.cameraZ);
  gl.uniform1f(u.uSize, GLASS_SCENE.patternSize);
  gl.uniform1f(u.uGlassAngle, GLASS_SCENE.glassAngle);
  gl.uniform1f(u.uIor, GLASS_SCENE.ior);
  gl.uniform1f(u.uThickness, GLASS_SCENE.thickness);
  gl.uniform1f(u.uSmear, GLASS_SCENE.thickness * Math.max(GLASS_SCENE.roughness ** 0.33, GLASS_SCENE.anisotropicBlur));
  gl.uniform1f(u.uRoughness, GLASS_SCENE.roughness);
  gl.uniform1f(u.uChroma, GLASS_SCENE.chromaticAberration);
  gl.uniform1f(u.uDistortionScale, GLASS_SCENE.distortionScale);
  gl.uniform1f(u.uSoft, 0.035);

  const cube = { rx: 0, rxV: 0, ry: 0, ryV: 0, scale: reducedMotion ? 1 : 0, scaleV: 0 };
  const pointer = { x: 0, y: 0 };
  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let running = false;
  let painted = false;
  const size = { width: 1, height: 1, quality: 1 };
  const perf = { frames: 0, avg: 1 / 60 };

  const applySize = () => {
    canvas.width = Math.max(1, Math.round(size.width * size.quality));
    canvas.height = Math.max(1, Math.round(size.height * size.quality));
  };

  const setPalette = (ramp) => {
    gl.uniform3fv(u.uLow, toUnit(ramp.low));
    gl.uniform3fv(u.uMid, toUnit(ramp.mid));
    gl.uniform3fv(u.uHigh, toUnit(ramp.high));
    gl.uniform1f(u.uGamma, ramp.gamma);
  };
  const setBackground = (rgb) => gl.uniform3fv(u.uBg, toUnit(rgb));
  setPalette(palette);
  setBackground(background);

  const draw = (dt) => {
    if (gl.isContextLost()) return;
    if (!reducedMotion) {
      elapsed += dt;
      damp(cube, "scale", 1, 1, dt);
      damp(cube, "rx", pointer.x * GLASS_SCENE.rotationInfluence, 0.5, dt);
      damp(cube, "ry", -pointer.y * GLASS_SCENE.rotationInfluence, 0.5, dt);
    }
    const wide = canvas.width / Math.max(1, canvas.height) > 0.7;
    const distortion = wide && !reducedMotion ? Math.min(GLASS_SCENE.distortionMax, elapsed * GLASS_SCENE.distortionRate) : 0;
    // Phase wraps at 4π (the pattern's full period) on the CPU so float precision never steps the animation.
    const phase = (10000 + elapsed * GLASS_SCENE.patternSpeed) % (4 * Math.PI);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uResolution, canvas.width, canvas.height);
    gl.uniform3fv(u.uHull, cubeSilhouette(cube, tanHalf));
    gl.uniform1f(u.uPhase, phase);
    gl.uniform1f(u.uDistortion, distortion);
    gl.uniform1f(u.uDrift, elapsed * GLASS_SCENE.temporalDistortion);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!painted) {
      painted = true;
      onFirstFrame?.();
    }
  };

  const loop = (now) => {
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    // Adaptive resolution: weaker GPUs that can't hold ~40fps render fewer pixels; the glass blur hides the softer image.
    perf.avg = perf.avg * 0.95 + raw * 0.05;
    if (++perf.frames > 60 && perf.avg > 1 / 40 && size.quality > 0.5) {
      size.quality -= 0.25;
      applySize();
      perf.frames = 0;
      perf.avg = 1 / 60;
    }
    draw(Math.min(0.1, raw));
    frame = requestAnimationFrame(loop);
  };

  return {
    resize(width, height) {
      size.width = width;
      size.height = height;
      applySize();
      if (!running) draw(0);
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setPalette(ramp) {
      setPalette(ramp);
      if (!running) draw(0);
    },
    setBackground(rgb) {
      setBackground(rgb);
      if (!running) draw(0);
    },
    start() {
      if (running) return;
      if (reducedMotion) return draw(0);
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    // Frees GL objects but keeps the context alive: StrictMode remounts reuse the same canvas, and a lost context never comes back.
    destroy() {
      this.stop();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    },
  };
}
