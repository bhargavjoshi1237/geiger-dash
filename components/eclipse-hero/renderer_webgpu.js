import { FRAME_FLOATS, RC } from "./scene_config.js";

// WebGPU backend for the eclipse hero; mirrors renderer_webgl.js pass for pass (framebuffer space is y-down here).

const SLOT = 256;

const HEADER = /* wgsl */ `
struct Frame {
  size: vec4f,
  mark: vec4f,
  light: vec4f,
  look: vec4f,
  background: vec4f,
  ring: vec4f,
  fade: vec4f,
  lamp: vec4f,
};
struct Params {
  value: i32,
  count: i32,
  pad0: i32,
  pad1: i32,
};
@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(2) var linearSampler: sampler;
const TAU = 6.28318530718;
const SENTINEL = -1e5;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4f(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const SCENE = /* wgsl */ `${HEADER}
@group(1) @binding(0) var markLo: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let q = pos.xy;
  let m = textureLoad(markLo, vec2i(q), 0);
  let p = q / frame.fade.w;
  let disc = (1.0 - smoothstep(frame.light.z * 0.55, frame.light.z, length(p - frame.light.xy))) * step(0.001, frame.light.w);
  let bar = step(0.5, max(m.r, m.g));
  let solid = max(bar, step(0.5, disc));
  return vec4f(bar * frame.look.x, disc * frame.light.w, 0.0, solid);
}
`;

const JFA_SEED = /* wgsl */ `${HEADER}
@group(1) @binding(0) var sceneTex: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let q = pos.xy;
  let solid = textureLoad(sceneTex, vec2i(q), 0).a;
  return vec4f(select(vec2f(SENTINEL), q, solid > 0.5), 0.0, 1.0);
}
`;

const JFA_STEP = /* wgsl */ `${HEADER}
@group(1) @binding(0) var seedTex: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let q = pos.xy;
  let c = vec2i(q);
  let limit = vec2i(frame.size.zw) - 1;
  var best = vec2f(SENTINEL);
  var bestDist = 1e12;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      let s = textureLoad(seedTex, clamp(c + vec2i(x, y) * params.value, vec2i(0), limit), 0).xy;
      if (s.x < -1e4) { continue; }
      let d = s - q;
      let dist = dot(d, d);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
  }
  return vec4f(best, 0.0, 1.0);
}
`;

const CASCADE = /* wgsl */ `${HEADER}
@group(1) @binding(0) var sceneTex: texture_2d<f32>;
@group(1) @binding(1) var seedTex: texture_2d<f32>;
@group(1) @binding(2) var upperTex: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let rc = frame.size.zw;
  let texel = floor(pos.xy);
  let cascade = params.value;
  let side = exp2(f32(cascade + 1));
  let probes = rc / side;
  let tile = floor(texel / probes);
  let probe = texel - tile * probes;
  let index = tile.x + tile.y * side;
  let angle = (index + 0.5) * TAU / (side * side);
  let dir = vec2f(cos(angle), sin(angle));
  let origin = (probe + 0.5) * side;

  let scale = pow(4.0, f32(cascade));
  var t = ${RC.interval0.toFixed(1)} * (scale - 1.0) / 3.0;
  let end = ${RC.interval0.toFixed(1)} * (scale * 4.0 - 1.0) / 3.0;
  var radiance = vec3f(0.0);
  var open = 1.0;
  for (var k = 0; k < ${RC.maxSteps}; k++) {
    let p = origin + dir * t;
    if (p.x < 0.0 || p.y < 0.0 || p.x >= rc.x || p.y >= rc.y) { break; }
    let seed = textureLoad(seedTex, vec2i(p), 0).xy;
    let dist = select(length(seed - p), 1e5, seed.x < -1e4);
    if (dist < 1.0) {
      radiance = textureLoad(sceneTex, vec2i(seed), 0).rgb;
      open = 0.0;
      break;
    }
    t += max(dist - 0.71, 0.3);
    if (t >= end) { break; }
  }

  if (open > 0.0 && cascade < params.count - 1) {
    let upperSide = side * 2.0;
    let upperProbes = rc / upperSide;
    let upperProbe = clamp(origin / upperSide - 0.5, vec2f(0.0), upperProbes - 1.0);
    var sum = vec3f(0.0);
    for (var j = 0; j < 4; j++) {
      let child = index * 4.0 + f32(j);
      let childTile = vec2f(child % upperSide, floor(child / upperSide));
      sum += textureSampleLevel(upperTex, linearSampler, (childTile * upperProbes + upperProbe + 0.5) / rc, 0.0).rgb;
    }
    radiance += sum * 0.25;
  }
  return vec4f(radiance, 1.0);
}
`;

const COMPOSITE = /* wgsl */ `${HEADER}
@group(1) @binding(0) var cascadeTex: texture_2d<f32>;
@group(1) @binding(1) var markHi: texture_2d<f32>;
@group(1) @binding(2) var markLo: texture_2d<f32>;
fn hash(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let px = pos.xy;
  let rc = frame.size.zw;
  // Manual bilinear over cascade 0's probes, skipping probes buried in a bar so the dark fill can't bleed out as notches.
  let probes = rc * 0.5;
  let u = px * frame.fade.w * 0.5 - 0.5;
  let cell = floor(u);
  let f = u - cell;
  var fluence = vec2f(0.0);
  var total = 1e-4;
  for (var k = 0u; k < 4u; k++) {
    let o = vec2f(f32(k % 2u), f32(k / 2u));
    let probe = clamp(cell + o, vec2f(0.0), probes - 1.0);
    let axis = mix(1.0 - f, f, o);
    let w = axis.x * axis.y * (1.0 - step(0.5, textureLoad(markLo, vec2i(probe * 2.0 + 1.0), 0).r));
    var sum = vec2f(0.0);
    for (var j = 0u; j < 4u; j++) {
      let tile = vec2f(f32(j % 2u), f32(j / 2u));
      sum += textureLoad(cascadeTex, vec2i(tile * probes + probe), 0).rg;
    }
    fluence += sum * 0.25 * w;
    total += w;
  }
  fluence /= total;

  let m = textureLoad(markHi, vec2i(px), 0);
  let edgeDist = min(px, frame.size.xy - px);
  let edge = smoothstep(0.0, frame.fade.z * min(frame.size.x, frame.size.y), min(edgeDist.x, edgeDist.y));
  // The pool stays a circle inside the canvas so narrow (phone) canvases never crop it into a box.
  let outer = min(frame.fade.y * frame.mark.z, 0.5 * min(frame.size.x, frame.size.y));
  let ringMask = (1.0 - smoothstep(outer * frame.fade.x / frame.fade.y, outer, length(px - frame.mark.xy))) * frame.ring.w * edge;
  let base = mix(frame.background.rgb, frame.ring.rgb, ringMask);
  let rimLit = 1.0 - exp(-pow(fluence.x + m.g * frame.look.x, frame.mark.w) * frame.look.y);
  let lampLit = 1.0 - exp(-pow(fluence.y, frame.lamp.y) * frame.lamp.x);
  let lit = (1.0 - (1.0 - rimLit) * (1.0 - lampLit)) * edge;
  var color = mix(base, vec3f(1.0), lit);
  color += (hash(px + frame.look.w * 17.0) - 0.5) * frame.look.z * lit * (1.0 - lit) * 4.0;
  color = mix(color, vec3f(0.0), m.r);
  return vec4f(color, 1.0);
}
`;

const texture = (sampleType) => ({ visibility: GPUShaderStage.FRAGMENT, texture: { sampleType } });

// Adapter, device and pipelines come first; the canvas only gets a WebGPU context once they all succeed,
// so a failure here still leaves it free for WebGL2.
export async function createWebGPURenderer(canvas, { onLost } = {}) {
  if (!self.navigator?.gpu) return null;
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return null;
  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();

  const frameLayout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform", hasDynamicOffset: true } },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
    ],
  });
  const layouts = {
    scene: [texture("unfilterable-float")],
    seed: [texture("unfilterable-float")],
    step: [texture("unfilterable-float")],
    cascade: [texture("unfilterable-float"), texture("unfilterable-float"), texture("float")],
    composite: [texture("float"), texture("unfilterable-float"), texture("unfilterable-float")],
  };
  const groupLayouts = Object.fromEntries(
    Object.entries(layouts).map(([name, entries]) => [
      name,
      device.createBindGroupLayout({ entries: entries.map((entry, binding) => ({ binding, ...entry })) }),
    ]),
  );
  const pipeline = (name, code, targetFormat) => {
    const shader = device.createShaderModule({ code });
    return device.createRenderPipelineAsync({
      layout: device.createPipelineLayout({ bindGroupLayouts: [frameLayout, groupLayouts[name]] }),
      vertex: { module: shader, entryPoint: "vs" },
      fragment: { module: shader, entryPoint: "fs", targets: [{ format: targetFormat }] },
      primitive: { topology: "triangle-list" },
    });
  };

  let pipelines;
  try {
    const [scene, seed, step, cascade, composite] = await Promise.all([
      pipeline("scene", SCENE, "rgba16float"),
      pipeline("seed", JFA_SEED, "rg32float"),
      pipeline("step", JFA_STEP, "rg32float"),
      pipeline("cascade", CASCADE, "rgba16float"),
      pipeline("composite", COMPOSITE, format),
    ]);
    pipelines = { scene, seed, step, cascade, composite };
  } catch (error) {
    console.error(error);
    device.destroy();
    return null;
  }

  const context = canvas.getContext("webgpu");
  if (!context) {
    device.destroy();
    return null;
  }
  context.configure({ device, format, alphaMode: "opaque" });

  let destroyed = false;
  device.lost.then(() => {
    if (!destroyed) onLost?.();
  });

  const frameBuffer = device.createBuffer({ size: FRAME_FLOATS * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
  let paramsBuffer = null;
  let frameGroup = null;
  let textures = null;
  let markHi = null;
  let markLo = null;
  let plan = null;
  let size = null;

  const makeTexture = (width, height, textureFormat, extra = 0) =>
    device.createTexture({
      size: [width, height],
      format: textureFormat,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | extra,
    });
  const group = (name, resources) =>
    device.createBindGroup({
      layout: groupLayouts[name],
      entries: resources.map((resource, binding) => ({ binding, resource: resource.createView() })),
    });

  // Bind groups depend on both the render targets and the mark textures, so they are rebuilt when either changes.
  const buildPlan = () => {
    if (!textures || !markHi) return;
    const { scene, seedA, seedB, cascadeA, cascadeB } = textures;
    const steps = [];
    let read = seedA;
    let write = seedB;
    for (let stride = 2 ** Math.ceil(Math.log2(Math.max(size.rcWidth, size.rcHeight))) / 2; stride >= 1; stride /= 2) {
      steps.push({ stride, group: group("step", [read]), target: write });
      [read, write] = [write, read];
    }
    const seedFinal = read;
    const cascades = [];
    let upper = cascadeB;
    let current = cascadeA;
    for (let cascade = RC.cascades - 1; cascade >= 0; cascade--) {
      cascades.push({ cascade, group: group("cascade", [scene, seedFinal, upper]), target: current });
      [upper, current] = [current, upper];
    }

    // One 256-byte slot per JFA step and per cascade, addressed through the dynamic offset.
    const slots = [...steps.map((s) => [s.stride, 0]), ...cascades.map((c) => [c.cascade, RC.cascades])];
    paramsBuffer?.destroy();
    paramsBuffer = device.createBuffer({ size: slots.length * SLOT, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const data = new Int32Array((slots.length * SLOT) / 4);
    slots.forEach(([value, count], i) => data.set([value, count], (i * SLOT) / 4));
    device.queue.writeBuffer(paramsBuffer, 0, data);
    frameGroup = device.createBindGroup({
      layout: frameLayout,
      entries: [
        { binding: 0, resource: { buffer: frameBuffer } },
        { binding: 1, resource: { buffer: paramsBuffer, size: 16 } },
        { binding: 2, resource: sampler },
      ],
    });
    steps.forEach((s, i) => (s.offset = i * SLOT));
    cascades.forEach((c, i) => (c.offset = (steps.length + i) * SLOT));

    plan = {
      scene: group("scene", [markLo]),
      seed: group("seed", [scene]),
      steps,
      cascades,
      composite: group("composite", [upper, markHi, markLo]),
    };
  };

  const run = (encoder, pipelineName, view, bindGroup, offset = 0) => {
    const pass = encoder.beginRenderPass({
      colorAttachments: [{ view, loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 1] }],
    });
    pass.setPipeline(pipelines[pipelineName]);
    pass.setBindGroup(0, frameGroup, [offset]);
    pass.setBindGroup(1, bindGroup);
    pass.draw(3);
    pass.end();
  };

  const uploadMark = (bitmap, previous) => {
    previous?.destroy();
    const target = makeTexture(bitmap.width, bitmap.height, "rgba8unorm", GPUTextureUsage.COPY_DST);
    device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: target }, [bitmap.width, bitmap.height]);
    bitmap.close?.();
    return target;
  };

  return {
    backend: "webgpu",
    resize({ width, height, rcWidth, rcHeight }) {
      canvas.width = width;
      canvas.height = height;
      if (textures) Object.values(textures).forEach((t) => t.destroy());
      textures = {
        scene: makeTexture(rcWidth, rcHeight, "rgba16float"),
        seedA: makeTexture(rcWidth, rcHeight, "rg32float"),
        seedB: makeTexture(rcWidth, rcHeight, "rg32float"),
        cascadeA: makeTexture(rcWidth, rcHeight, "rgba16float"),
        cascadeB: makeTexture(rcWidth, rcHeight, "rgba16float"),
      };
      size = { width, height, rcWidth, rcHeight };
      buildPlan();
    },
    setMark(hi, lo) {
      markHi = uploadMark(hi, markHi);
      markLo = uploadMark(lo, markLo);
      buildPlan();
    },
    render(frame) {
      if (!plan || destroyed) return;
      device.queue.writeBuffer(frameBuffer, 0, frame);
      const encoder = device.createCommandEncoder();
      run(encoder, "scene", textures.scene.createView(), plan.scene);
      run(encoder, "seed", textures.seedA.createView(), plan.seed);
      for (const s of plan.steps) run(encoder, "step", s.target.createView(), s.group, s.offset);
      for (const c of plan.cascades) run(encoder, "cascade", c.target.createView(), c.group, c.offset);
      run(encoder, "composite", context.getCurrentTexture().createView(), plan.composite);
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      destroyed = true;
      device.destroy();
    },
  };
}
