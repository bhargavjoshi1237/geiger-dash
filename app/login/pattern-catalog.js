// Looping patterns for the login screen's right-hand panel; `dark` picks the panel surface behind each one.
export const LOGIN_PATTERNS = [
  { kind: "pulse", dark: true },
  { kind: "truchet", dark: false },
  { kind: "ridges", dark: true },
  { kind: "tiles", dark: false },
  { kind: "slash", dark: true },
  { kind: "halftone", dark: false },
  { kind: "pulseMark", dark: true },
  { kind: "pendulum", dark: false },
  { kind: "topo", dark: false },
  { kind: "moire", dark: false },
  { kind: "iso", dark: false },
  { kind: "typewall", dark: true },
  { kind: "torus", dark: true },
  { kind: "flow", dark: true },
];

// Called per request on the server, so the first paint already has the right panel surface.
export function pickLoginPattern() {
  return LOGIN_PATTERNS[Math.floor(Math.random() * LOGIN_PATTERNS.length)].kind;
}
