// {{variable}} interpolation for editable email content.
//
// Admin-edited content slots and subject lines may reference runtime variables
// with `{{name}}`. Unknown variables collapse to an empty string so a partial
// payload never leaks a raw `{{token}}` into a sent email.

export function interpolate(input, data = {}) {
  if (typeof input !== "string") return input;
  return input.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key) => {
    const value = key
      .split(".")
      .reduce((acc, part) => (acc == null ? acc : acc[part]), data);
    return value == null ? "" : String(value);
  });
}

// Interpolate every string value of a content object (one level deep, which is
// all our slot schemas need).
export function interpolateContent(content = {}, data = {}) {
  const out = {};
  for (const [key, value] of Object.entries(content)) {
    out[key] = typeof value === "string" ? interpolate(value, data) : value;
  }
  return out;
}
