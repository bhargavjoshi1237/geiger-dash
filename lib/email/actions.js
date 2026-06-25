"use server";

// Server actions for the email admin surface. UI components call these; they
// never touch Supabase directly. Each action gates on a signed-in user, returns
// a plain `{ ok, ... }` result (the UI owns the toast), and revalidates the
// admin route when it mutates.

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { emailServiceClient } from "./service.js";
import { renderPreview } from "./render.js";
import { sendTemplateEmail } from "./send.js";
import { generateApiKey } from "./keys.js";
import { getTemplateByKey } from "./queries.js";

const ADMIN_PATH = "/admin/emails";

async function requireAuth() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { user: null, error: "You must be signed in." };
  return { user, error: null };
}

// Save edited subject / content / status for a template.
export async function saveTemplateAction({ key, subject, content, status }) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const current = await getTemplateByKey(key);
  if (!current) return { ok: false, error: "Template not found." };

  const supabase = emailServiceClient();
  const patch = { updated_by: user.id, version: (current.version || 1) + 1 };
  if (subject !== undefined) patch.subject = subject;
  if (content !== undefined) patch.content = content;
  if (status !== undefined) patch.status = status;

  const { error } = await supabase.from("templates").update(patch).eq("key", key);
  if (error) {
    console.error("[email.saveTemplate]", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  return { ok: true };
}

// Render a (possibly unsaved) template to HTML for the live preview pane.
export async function previewTemplateAction({ key, content, subject, data }) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const template = await getTemplateByKey(key);
  const sampleData = { ...(template?.sampleData || {}), ...(data || {}) };
  try {
    const rendered = await renderPreview({ key, content, subject, data: sampleData });
    return { ok: true, html: rendered.html, subject: rendered.subject };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Send a real test email using the current template content.
export async function sendTestEmailAction({ key, to, data }) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };
  if (!to) return { ok: false, error: "Enter a recipient address." };

  const template = await getTemplateByKey(key);
  const sampleData = { ...(template?.sampleData || {}), ...(data || {}) };

  const result = await sendTemplateEmail({
    key,
    to,
    data: sampleData,
    project: template?.project,
  });

  revalidatePath(ADMIN_PATH);
  return result.ok
    ? { ok: true, id: result.id }
    : { ok: false, error: result.error };
}

// Create a cross-app API key. The plaintext key is returned exactly once.
export async function createApiKeyAction({ name, project }) {
  const { user, error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };
  if (!name?.trim()) return { ok: false, error: "Give the key a name." };

  const { key, prefix, hash } = generateApiKey();
  const supabase = emailServiceClient();
  const { error } = await supabase.from("api_keys").insert({
    name: name.trim(),
    project: project?.trim() || "geiger-flow",
    prefix,
    key_hash: hash,
    created_by: user.id,
  });

  if (error) {
    console.error("[email.createApiKey]", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  return { ok: true, key };
}

export async function revokeApiKeyAction(id) {
  const { error: authError } = await requireAuth();
  if (authError) return { ok: false, error: authError };

  const supabase = emailServiceClient();
  const { error } = await supabase
    .from("api_keys")
    .update({ active: false })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath(ADMIN_PATH);
  return { ok: true };
}
