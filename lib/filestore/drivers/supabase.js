// Supabase Storage provider driver.
//
// The service role key can never reach a browser and Supabase's signed upload
// URLs are single-use and short-lived, so this driver uses `proxy` mode: the
// client posts bytes to our own route, which forwards them. That caps uploads at
// Vercel's ~4.5 MB request body limit — fine for the avatars and small assets
// this provider is typically the fallback for, and the placement engine simply
// routes anything larger elsewhere via maxObjectSize.

import { createClient } from "@supabase/supabase-js";
import { renderPublicUrl } from "./shared.js";

export const id = "supabase";
export const label = "Supabase Storage";

export const configFields = [
  { key: "bucket", label: "Bucket", type: "text", required: true, placeholder: "products" },
  { key: "prefix", label: "Path prefix", type: "text", placeholder: "filestore/" },
  { key: "url", label: "Project URL", type: "url", placeholder: "https://<ref>.supabase.co" },
  { key: "signedUrlTtl", label: "Signed URL TTL (seconds)", type: "number", placeholder: "900" },
];

export const secretFields = [
  { key: "serviceKey", label: "Service role key", required: false },
];

export const defaultCapabilities = {
  cdn: false,
  publicRead: true,
  presign: false,
  multipart: false,
  maxObjectSize: 4 * 1024 * 1024,
  mimeAllow: [],
};

const DEFAULT_TTL = 900;

function client(ctx) {
  const url = ctx.config?.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = ctx.secrets?.serviceKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Supabase URL and service role key are required.");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function bucket(ctx) {
  return ctx.config?.bucket;
}

export function publicUrl(ctx, key) {
  if (ctx.publicUrlTemplate) return renderPublicUrl(ctx.publicUrlTemplate, key);

  const base = (ctx.config?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${bucket(ctx)}/${key}`;
}

export async function signedReadUrl(ctx, key) {
  const ttl = Number(ctx.config?.signedUrlTtl) || DEFAULT_TTL;
  const { data, error } = await client(ctx)
    .storage.from(bucket(ctx))
    .createSignedUrl(key, ttl);

  if (error) throw new Error(error.message);
  return data?.signedUrl || "";
}

export async function createTicket(ctx, { key }) {
  return {
    mode: "proxy",
    providerKey: key,
    driverState: { key },
    ticket: {
      mode: "proxy",
      method: "POST",
      maxBytes: defaultCapabilities.maxObjectSize,
    },
  };
}

export async function commit(ctx, { driverState, providerKey, size }) {
  const key = providerKey || driverState?.key;
  return { key, url: publicUrl(ctx, key), size, mime: "", etag: null };
}

export async function receive(ctx, { key, mime, body }) {
  const { error } = await client(ctx)
    .storage.from(bucket(ctx))
    .upload(key, body, {
      contentType: mime || "application/octet-stream",
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return { key, url: publicUrl(ctx, key), size: body.byteLength, etag: null };
}

export async function remove(ctx, { key }) {
  const { error } = await client(ctx).storage.from(bucket(ctx)).remove([key]);
  if (error) throw new Error(error.message);
  return true;
}

export async function probe(ctx) {
  const warnings = [];
  if (!bucket(ctx)) return { ok: false, error: "Bucket is required.", warnings };

  const key = `_geiger-probe/${Date.now()}.txt`;
  const body = Buffer.from("geiger-filestore probe");

  try {
    await receive(ctx, { key, mime: "text/plain", body });
  } catch (err) {
    return { ok: false, error: `Write failed: ${err.message}`, warnings };
  }

  try {
    const { error } = await client(ctx).storage.from(bucket(ctx)).download(key);
    if (error) warnings.push(`Wrote the probe but could not read it back: ${error.message}`);
  } catch (err) {
    warnings.push(`Read-back failed: ${err.message}`);
  }

  warnings.push(
    "Uploads are proxied through the dashboard, so objects here are capped at ~4.5 MB."
  );

  try {
    await remove(ctx, { key });
  } catch (err) {
    warnings.push(`Probe cleanup failed: ${err.message}`);
  }

  return { ok: true, error: null, warnings };
}
