// Bridges DB-stored template content to the JSX renderer in mails/.
//
// The stored (admin-edited) subject + content win; the registry defaults fill
// any gap. {{variables}} are interpolated against `data` inside renderTemplate.

import { getTemplateByKey } from "./queries.js";
import { renderTemplate } from "@/mails/render.jsx";

// Render using the live DB content for a key (used by the send API).
export async function renderForSend({ key, data = {}, subject }) {
  const template = await getTemplateByKey(key);
  return renderTemplate({
    key,
    content: template?.content,
    subject: subject ?? template?.subject,
    data,
  });
}

// Render from explicit (possibly unsaved) content — used by the admin preview so
// edits show before they're saved.
export async function renderPreview({ key, content, subject, data = {} }) {
  return renderTemplate({ key, content, subject, data });
}
