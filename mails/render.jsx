// Renders a template key to final HTML + subject.
//
// Content/subject come from the DB (admin-edited) with the registry defaults as
// a fallback, then {{variables}} are interpolated against the runtime `data`.

import { render } from "@react-email/render";
import { getComponent } from "./index.js";
import { getTemplateMeta } from "./registry.js";
import { interpolate, interpolateContent } from "./interpolate.js";

export async function renderTemplate({ key, content, subject, data = {} }) {
  const Component = getComponent(key);
  if (!Component) {
    throw new Error(`Unknown email template: ${key}`);
  }

  const meta = getTemplateMeta(key);
  const mergedContent = { ...(meta?.content || {}), ...(content || {}) };
  const resolvedContent = interpolateContent(mergedContent, data);
  const resolvedSubject = interpolate(subject ?? meta?.subject ?? "", data);

  const html = await render(
    <Component content={resolvedContent} data={data} />
  );

  return { html, subject: resolvedSubject };
}
