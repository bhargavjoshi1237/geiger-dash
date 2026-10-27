"use client";

import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useFrame } from "@/components/film/clock";
import { sample } from "@/components/film/ease";

// Camera values: translate (px), rotate (deg), scale, opacity, and the focus: blur radius (px), centre (%) and size (%).
const DEFAULTS = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 1, blur: 0, fx: 50, fy: 50, fr: 42 };

// Each key inherits whatever the key before it set, so a move only has to name the values that change.
function fill(keys) {
  let previous = DEFAULTS;
  return keys.map((key) => (previous = { ...previous, ...key }));
}

// A camera over a flat composition: keyframed moves in 3D, plus a depth of field drawn as a blurred copy
// behind a sharp copy masked to the focal point, the same trick the area-page heroes use.
export function Camera({ keys, width, height, perspective = 2200, origin = "50% 42%", dimBlur = 0.9, className, children }) {
  const filled = useMemo(() => fill(keys), [keys]);
  const hasFocus = filled.some((key) => key.blur > 0);
  const root = useRef(null);
  const planes = useRef([]);
  const sharp = useRef(null);
  const soft = useRef(null);

  useFrame((local) => {
    const value = sample(filled, local);
    const transform = `translate3d(${value.x}px, ${value.y}px, ${value.z}px) rotateX(${value.rx}deg) rotateY(${value.ry}deg) rotateZ(${value.rz}deg) scale(${value.s})`;
    for (const plane of planes.current) if (plane) plane.style.transform = transform;
    if (root.current) root.current.style.opacity = value.o;
    if (!hasFocus) return;
    const focused = value.blur > 0.05;
    soft.current.style.display = focused ? "block" : "none";
    soft.current.style.filter = `blur(${value.blur}px)`;
    sharp.current.style.maskImage = focused ? `radial-gradient(${value.fr}% ${value.fr * 0.82}% at ${value.fx}% ${value.fy}%, #000 34%, transparent 100%)` : "none";
  });

  const plane = (index) => (
    <div
      ref={(node) => {
        planes.current[index] = node;
      }}
      className="absolute top-1/2 left-1/2"
      style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2 }}
    >
      {children}
    </div>
  );

  const layer = "absolute inset-0";
  const depth = { perspective: `${perspective}px`, perspectiveOrigin: origin };

  return (
    <div ref={root} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {hasFocus ? (
        <div ref={soft} className={layer} style={{ ...depth, opacity: dimBlur }}>
          {plane(1)}
        </div>
      ) : null}
      <div ref={sharp} className={layer} style={depth}>
        {plane(0)}
      </div>
    </div>
  );
}
