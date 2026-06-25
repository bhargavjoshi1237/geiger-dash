// Reads against the email schema. Returns camelCase view models; the DB stays
// snake_case behind this boundary.

import { emailServiceClient } from "./service.js";

function normalizeTemplate(row) {
  if (!row) return null;
  return {
    id: row.id,
    key: row.key,
    project: row.project,
    category: row.category,
    name: row.name,
    description: row.description,
    subject: row.subject,
    content: row.content || {},
    fields: row.fields || [],
    sampleData: row.sample_data || {},
    variables: row.variables || [],
    status: row.status,
    version: row.version,
    updatedAt: row.updated_at,
  };
}

export async function getTemplates() {
  const supabase = emailServiceClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("project", { ascending: true })
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[email.getTemplates]", error.message);
    return [];
  }
  return (data || []).map(normalizeTemplate);
}

export async function getTemplateByKey(key) {
  const supabase = emailServiceClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error("[email.getTemplateByKey]", error.message);
    return null;
  }
  return normalizeTemplate(data);
}

export async function getMessages(limit = 100) {
  const supabase = emailServiceClient();
  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, template_key, project, to_address, from_address, subject, status, provider_id, error, created_at, sent_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[email.getMessages]", error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    templateKey: row.template_key,
    project: row.project,
    to: row.to_address,
    from: row.from_address,
    subject: row.subject,
    status: row.status,
    providerId: row.provider_id,
    error: row.error,
    createdAt: row.created_at,
    sentAt: row.sent_at,
  }));
}

export async function getApiKeys() {
  const supabase = emailServiceClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, project, prefix, active, last_used_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[email.getApiKeys]", error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    project: row.project,
    prefix: row.prefix,
    active: row.active,
    lastUsedAt: row.last_used_at,
    createdAt: row.created_at,
  }));
}
