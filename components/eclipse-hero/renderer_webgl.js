import { FRAME_FLOATS, RC } from "./scene_config.js";

// WebGL2 backend for the eclipse hero; mirrors renderer_webgpu.js pass for pass.
// Texel space is y-down like the mark bitmap; only the composite flips gl_FragCoord to reach canvas pixels.

const HEADER = `#version 300 es
precision highp float;
precision highp int;
layout(std140) uniform Frame {
  vec4 size;
  vec4 mark;
  vec4 light;
  vec4 look;
  vec4 background;
  vec4 ring;
  vec4 fade;
  vec4 lamp;
};
const float TAU = 6.28318530718;
const float SENTINEL = -1e5;
`;

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

// Emission in R (bars + LED band) and G (pointer disc) so the composite can curve them separately; A is the solid flag.
// The whole bar emits: seen from outside that equals a glowing rim, and it can't alias into gaps at rc resolution.
const SCENE = `${HEADER}
uniform sampler2D markLo;
out vec4 outColor;
void main() {
  vec2 q = gl_FragCoord.xy;
  vec4 m = texelFetch(markLo, ivec2(q), 0);
  vec2 p = q / fade.w;
  float disc = (1.0 - smoothstep(light.z * 0.55, light.z, length(p - light.xy))) * step(0.001, light.w);
  float bar = step(0.5, max(m.r, m.g));
  float solid = max(bar, step(0.5, disc));
  outColor = vec4(bar * look.x, disc * light.w, 0.0, solid);
}
`;

const JFA_SEED = `${HEADER}
uniform sampler2D sceneTex;
out vec4 outSeed;
void main() {
  vec2 q = gl_FragCoord.xy;
  float solid = texelFetch(sceneTex, ivec2(q), 0).a;
  outSeed = vec4(solid > 0.5 ? q : vec2(SENTINEL), 0.0, 1.0);
}
`;

const JFA_STEP = `${HEADER}
uniform sampler2D seedTex;
uniform int stepSize;
out vec4 outSeed;
void main() {
  vec2 q = gl_FragCoord.xy;
  ivec2 c = ivec2(q);
  ivec2 limit = ivec2(size.zw) - 1;
  vec2 best = vec2(SENTINEL);
  float bestDist = 1e12;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 s = texelFetch(seedTex, clamp(c + ivec2(x, y) * stepSize, ivec2(0), limit), 0).xy;
      if (s.x < -1e4) continue;
      vec2 d = s - q;
      float dist = dot(d, d);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
  }
  outSeed = vec4(best, 0.0, 1.0);
}
`;

// One cascade, direction-first layout: tile = ray direction, texel within the tile = probe.
const CASCADE = `${HEADER}
uniform sampler2D sceneTex;
uniform sampler2D seedTex;
uniform sampler2D upperTex;
uniform int cascade;
uniform int cascadeCount;
out vec4 outColor;
void main() {
  vec2 rc = size.zw;
  vec2 texel = floor(gl_FragCoord.xy);
  float side = exp2(float(cascade + 1));
  vec2 probes = rc / side;
  vec2 tile = floor(texel / probes);
  vec2 probe = texel - tile * probes;
  float index = tile.x + tile.y * side;
  float angle = (index + 0.5) * TAU / (side * side);
  vec2 dir = vec2(cos(angle), sin(angle));
  vec2 origin = (probe + 0.5) * side;

  float scale = pow(4.0, float(cascade));
  float t = ${RC.interval0.toFixed(1)} * (scale - 1.0) / 3.0;
  float end = ${RC.interval0.toFixed(1)} * (scale * 4.0 - 1.0) / 3.0;
  vec3 radiance = vec3(0.0);
  float open = 1.0;
  for (int k = 0; k < ${RC.maxSteps}; k++) {
    vec2 p = origin + dir * t;
    if (p.x < 0.0 || p.y < 0.0 || p.x >= rc.x || p.y >= rc.y) break;
    vec2 seed = texelFetch(seedTex, ivec2(p), 0).xy;
    float dist = seed.x < -1e4 ? 1e5 : length(seed - p);
    if (dist < 1.0) {
      radiance = texelFetch(sceneTex, ivec2(seed), 0).rgb;
      open = 0.0;
      break;
    }
    t += max(dist - 0.71, 0.3);
    if (t >= end) break;
  }

  if (open > 0.0 && cascade < cascadeCount - 1) {
    float upperSide = side * 2.0;
    vec2 upperProbes = rc / upperSide;
    vec2 upperProbe = clamp(origin / upperSide - 0.5, vec2(0.0), upperProbes - 1.0);
    vec3 sum = vec3(0.0);
    for (int j = 0; j < 4; j++) {
      float child = index * 4.0 + float(j);
      vec2 childTile = vec2(mod(child, upperSide), floor(child / upperSide));
      sum += texture(upperTex, (childTile * upperProbes + upperProbe + 0.5) / rc).rgb;
    }
    radiance += sum * 0.25;
  }
  outColor = vec4(radiance, 1.0);
}
`;

const COMPOSITE = `${HEADER}
uniform sampler2D cascadeTex;
uniform sampler2D markHi;
uniform sampler2D markLo;
out vec4 outColor;
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec2 px = vec2(gl_FragCoord.x, size.y - gl_FragCoord.y);
  vec2 rc = size.zw;
  // Manual bilinear over cascade 0's probes, skipping probes buried in a bar so the dark fill can't bleed out as notches.
  vec2 probes = rc * 0.5;
  vec2 u = px * fade.w * 0.5 - 0.5;
  vec2 cell = floor(u);
  vec2 f = u - cell;
  vec2 fluence = vec2(0.0);
  float total = 1e-4;
  for (int k = 0; k < 4; k++) {
    vec2 o = vec2(float(k % 2), float(k / 2));
    vec2 probe = clamp(cell + o, vec2(0.0), probes - 1.0);
    vec2 axis = mix(1.0 - f, f, o);
    float w = axis.x * axis.y * (1.0 - step(0.5, texelFetch(markLo, ivec2(probe * 2.0 + 1.0), 0).r));
    vec2 sum = vec2(0.0);
    for (int j = 0; j < 4; j++) {
      vec2 tile = vec2(float(j % 2), float(j / 2));
      sum += texelFetch(cascadeTex, ivec2(tile * probes + probe), 0).rg;
    }
    fluence += sum * 0.25 * w;
    total += w;
  }
  fluence /= total;

  vec4 m = texelFetch(markHi, ivec2(px), 0);
  vec2 edgeDist = min(px, size.xy - px);
  float edge = smoothstep(0.0, fade.z * min(size.x, size.y), min(edgeDist.x, edgeDist.y));
  // The pool stays a circle inside the canvas so narrow (phone) canvases never crop it into a box.
  float outer = min(fade.y * mark.z, 0.5 * min(size.x, size.y));
  float ringMask = (1.0 - smoothstep(outer * fade.x / fade.y, outer, length(px - mark.xy))) * ring.w * edge;
  vec3 base = mix(background.rgb, ring.rgb, ringMask);
  float rimLit = 1.0 - exp(-pow(fluence.x + m.g * look.x, mark.w) * look.y);
  float lampLit = 1.0 - exp(-pow(fluence.y, lamp.y) * lamp.x);
  float lit = (1.0 - (1.0 - rimLit) * (1.0 - lampLit)) * edge;
  vec3 color = mix(base, vec3(1.0), lit);
  color += (hash(px + look.w * 17.0) - 0.5) * look.z * lit * (1.0 - lit) * 4.0;
  color = mix(color, vec3(0.0), m.r);
  outColor = vec4(color, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`eclipse shader: ${log}`);
  }
  return shader;
}

function link(gl, vertex, fragmentSource, samplers) {
  const program = gl.createProgram();
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`eclipse link: ${gl.getProgramInfoLog(program)}`);
  const block = gl.getUniformBlockIndex(program, "Frame");
  if (block !== gl.INVALID_INDEX) gl.uniformBlockBinding(program, block, 0);
  gl.useProgram(program);
  for (const [name, unit] of Object.entries(samplers)) gl.uniform1i(gl.getUniformLocation(program, name), unit);
  return program;
}

// Texture units are fixed per input so no pass ever samples the texture it renders into.
const UNIT = { scene: 0, seed: 1, upper: 2, markLo: 3, markHi: 4 };

export function createWebGLRenderer(canvas, { onLost } = {}) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  let programs;
  try {
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    programs = {
      scene: link(gl, vertex, SCENE, { markLo: UNIT.markLo }),
      seed: link(gl, vertex, JFA_SEED, { sceneTex: UNIT.scene }),
      step: link(gl, vertex, JFA_STEP, { seedTex: UNIT.seed }),
      cascade: link(gl, vertex, CASCADE, { sceneTex: UNIT.scene, seedTex: UNIT.seed, upperTex: UNIT.upper }),
      composite: link(gl, vertex, COMPOSITE, { cascadeTex: UNIT.upper, markHi: UNIT.markHi, markLo: UNIT.markLo }),
    };
    gl.deleteShader(vertex);
  } catch (error) {
    console.error(error);
    return null;
  }
  const stepLocation = gl.getUniformLocation(programs.step, "stepSize");
  const cascadeLocation = gl.getUniformLocation(programs.cascade, "cascade");
  gl.useProgram(programs.cascade);
  gl.uniform1i(gl.getUniformLocation(programs.cascade, "cascadeCount"), RC.cascades);

  const vao = gl.createVertexArray();
  const ubo = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
  gl.bufferData(gl.UNIFORM_BUFFER, FRAME_FLOATS * 4, gl.DYNAMIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);

  const lost = (event) => {
    event.preventDefault();
    onLost?.();
  };
  canvas.addEventListener("webglcontextlost", lost);

  let targets = null;
  let markHi = null;
  let markLo = null;
  let size = null;

  const makeTexture = (width, height, internal, filter) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internal, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  };
  const makeTarget = (width, height, internal, filter) => {
    const texture = makeTexture(width, height, internal, filter);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return { texture, framebuffer };
  };
  const dropTarget = (target) => {
    gl.deleteTexture(target.texture);
    gl.deleteFramebuffer(target.framebuffer);
  };
  const bind = (unit, texture) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  };
  const draw = (program, target, width, height) => {
    gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.framebuffer : null);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const uploadMark = (bitmap, previous) => {
    if (previous) gl.deleteTexture(previous);
    const texture = makeTexture(bitmap.width, bitmap.height, gl.RGBA8, gl.NEAREST);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    bitmap.close?.();
    return texture;
  };

  return {
    backend: "webgl",
    resize({ width, height, rcWidth, rcHeight }) {
      canvas.width = width;
      canvas.height = height;
      if (targets) Object.values(targets).forEach(dropTarget);
      targets = {
        scene: makeTarget(rcWidth, rcHeight, gl.RGBA16F, gl.NEAREST),
        seedA: makeTarget(rcWidth, rcHeight, gl.RG32F, gl.NEAREST),
        seedB: makeTarget(rcWidth, rcHeight, gl.RG32F, gl.NEAREST),
        cascadeA: makeTarget(rcWidth, rcHeight, gl.RGBA16F, gl.LINEAR),
        cascadeB: makeTarget(rcWidth, rcHeight, gl.RGBA16F, gl.LINEAR),
      };
      size = { width, height, rcWidth, rcHeight };
    },
    setMark(hi, lo) {
      markHi = uploadMark(hi, markHi);
      markLo = uploadMark(lo, markLo);
    },
    render(frame) {
      if (!targets || !markHi || gl.isContextLost()) return;
      const { width, height, rcWidth, rcHeight } = size;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, frame);

      bind(UNIT.markLo, markLo);
      draw(programs.scene, targets.scene, rcWidth, rcHeight);

      bind(UNIT.scene, targets.scene.texture);
      draw(programs.seed, targets.seedA, rcWidth, rcHeight);

      let read = targets.seedA;
      let write = targets.seedB;
      for (let step = 2 ** Math.ceil(Math.log2(Math.max(rcWidth, rcHeight))) / 2; step >= 1; step /= 2) {
        bind(UNIT.seed, read.texture);
        gl.useProgram(programs.step);
        gl.uniform1i(stepLocation, step);
        draw(programs.step, write, rcWidth, rcHeight);
        [read, write] = [write, read];
      }
      bind(UNIT.seed, read.texture);

      let upper = targets.cascadeB;
      let current = targets.cascadeA;
      for (let cascade = RC.cascades - 1; cascade >= 0; cascade--) {
        bind(UNIT.upper, upper.texture);
        gl.useProgram(programs.cascade);
        gl.uniform1i(cascadeLocation, cascade);
        draw(programs.cascade, current, rcWidth, rcHeight);
        [upper, current] = [current, upper];
      }

      bind(UNIT.upper, upper.texture);
      bind(UNIT.markHi, markHi);
      draw(programs.composite, null, width, height);
    },
    destroy() {
      canvas.removeEventListener("webglcontextlost", lost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
