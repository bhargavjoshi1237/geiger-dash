// Vercel Blob provider driver.
//
// The read-write token is a credential, so like the Supabase driver this uses
// `proxy` mode and inherits Vercel's ~4.5 MB request body cap. Blob reports no
// capacity of its own, so the pool ceiling for it is whatever the admin declares
// on the provider row.

import { put, del, head } from "@vercel/blob";

export const id = "vercel_blob";
export const label = "Vercel Blob";

export const configFields = [
  { key: "prefix", label: "Path prefix", type: "text", placeholder: "filestore/" },
  { key: "access", label: "Access", type: "text", placeholder: "public" },
];

export const secretFields = [
  { key: "token", label: "Read-write token", required: true },
];

export const defaultCapabilities = {
  cdn: true,
  publicRead: true,
  presign: false,
  multipart: false,
  maxObjectSize: 4 * 1024 * 1024,
  mimeAllow: [],
};

function token(ctx) {
  const value = ctx.secrets?.token || process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) throw new Error("A Vercel Blob read-write token is required.");
  return value;
}

// Blob mints its own URL on write; we persist it on the placement, so this is
// only the fallback for a row that somehow lost it.
export function publicUrl(ctx, key) {
  return key.startsWith("http") ? key : "";
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

export async function commit(ctx, { driverState, providerKey, size, response }) {
  const key = response?.url || providerKey || driverState?.key;
  return { key, url: key, size, mime: "", etag: null };
}

export async function receive(ctx, { key, mime, body }) {
  const result = await put(key, body, {
    access: ctx.config?.access || "public",
    contentType: mime || "application/octet-stream",
    token: token(ctx),
    addRandomSuffix: false,
  });

  // Blob's canonical identifier IS its URL, so we store that as the key.
  return { key: result.url, url: result.url, size: body.byteLength, etag: null };
}

export async function remove(ctx, { key }) {
  await del(key, { token: token(ctx) });
  return true;
}

export async function probe(ctx) {
  const warnings = [];
  const key = `_geiger-probe/${Date.now()}.txt`;
  const body = Buffer.from("geiger-filestore probe");

  let uploaded;
  try {
    uploaded = await receive(ctx, { key, mime: "text/plain", body });
  } catch (err) {
    return { ok: false, error: `Write failed: ${err.message}`, warnings };
  }

  try {
    await head(uploaded.url, { token: token(ctx) });
  } catch (err) {
    warnings.push(`Wrote the probe but could not read it back: ${err.message}`);
  }

  warnings.push(
    "Uploads are proxied through the dashboard, so objects here are capped at ~4.5 MB."
  );
  warnings.push("Vercel Blob reports no capacity — the pool uses the declared ceiling.");

  try {
    await remove(ctx, { key: uploaded.url });
  } catch (err) {
    warnings.push(`Probe cleanup failed: ${err.message}`);
  }

  return { ok: true, error: null, warnings };
}
