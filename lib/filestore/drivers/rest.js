// Generic REST provider driver.
//
// Entirely config-driven, so a Uploadcare-shaped service is added by filling in
// the admin form — no code, no deploy. It covers both upload styles such a
// service offers:
//
//   small files  POST {uploadUrl} as multipart/form-data, static auth fields +
//                the file; the response carries the object key at {keyPath}
//   large files  POST {multipartStartUrl} -> { uuid, parts: [presigned URLs] };
//                the client PUTs fixed-size chunks; POST {multipartCompleteUrl}
//                returns the final metadata
//
// Defaults below are Uploadcare's, since that is the reference implementation:
//   uploadUrl            https://upload.uploadcare.com/base/
//   multipartStartUrl    https://upload.uploadcare.com/multipart/start/
//   multipartCompleteUrl https://upload.uploadcare.com/multipart/complete/
//   keyPath              file
//   publicUrlTemplate    https://ucarecdn.com/{key}/

import { getPath, interpolate, renderPublicUrl, readJson, pickSize } from "./shared.js";

export const id = "rest";
export const label = "REST API";

export const configFields = [
  { key: "uploadUrl", label: "Upload endpoint", type: "url", required: true, placeholder: "https://upload.uploadcare.com/base/" },
  { key: "fileField", label: "File form field", type: "text", placeholder: "file" },
  { key: "formFields", label: "Static form fields (JSON)", type: "json", placeholder: '{"UPLOADCARE_PUB_KEY":"{secret.publicKey}","UPLOADCARE_STORE":"auto"}' },
  { key: "keyPath", label: "Response path to object key", type: "text", placeholder: "file" },
  { key: "multipartStartUrl", label: "Multipart start endpoint", type: "url", placeholder: "https://upload.uploadcare.com/multipart/start/" },
  { key: "multipartCompleteUrl", label: "Multipart complete endpoint", type: "url", placeholder: "https://upload.uploadcare.com/multipart/complete/" },
  { key: "multipartThreshold", label: "Use multipart above (bytes)", type: "number", placeholder: "10485760" },
  { key: "partSize", label: "Part size (bytes)", type: "number", placeholder: "5242880" },
  { key: "deleteUrl", label: "Delete endpoint", type: "url", placeholder: "https://api.uploadcare.com/files/{key}/storage/" },
  { key: "deleteMethod", label: "Delete method", type: "text", placeholder: "DELETE" },
  { key: "authHeader", label: "Auth header name", type: "text", placeholder: "Authorization" },
  { key: "authHeaderValue", label: "Auth header value", type: "text", placeholder: "Uploadcare.Simple {secret.publicKey}:{secret.secretKey}" },
];

export const secretFields = [
  { key: "publicKey", label: "Public key", required: false },
  { key: "secretKey", label: "Secret key", required: false },
];

export const defaultCapabilities = {
  cdn: true,
  publicRead: true,
  presign: false,
  multipart: true,
  maxObjectSize: 5 * 1024 * 1024 * 1024,
  mimeAllow: [],
};

const DEFAULTS = {
  fileField: "file",
  keyPath: "file",
  multipartThreshold: 10 * 1024 * 1024,
  partSize: 5 * 1024 * 1024,
  deleteMethod: "DELETE",
  uploadIdPath: "uuid",
  partsPath: "parts",
  completeIdField: "uuid",
  filenameField: "filename",
  sizeField: "size",
  contentTypeField: "content_type",
};

function setting(ctx, key) {
  return ctx.config?.[key] ?? DEFAULTS[key];
}

// Static form fields, with {secret.X} / {config.X} resolved.
function staticFields(ctx, vars = {}) {
  const raw = ctx.config?.formFields;
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  const out = {};
  for (const [key, value] of Object.entries(parsed || {})) {
    out[key] = interpolate(String(value), vars, ctx);
  }
  return out;
}

function authHeaders(ctx) {
  const name = ctx.config?.authHeader;
  const value = ctx.config?.authHeaderValue;
  if (!name || !value) return {};
  return { [name]: interpolate(value, {}, ctx) };
}

export function publicUrl(ctx, key) {
  return renderPublicUrl(ctx.publicUrlTemplate, key);
}

// A ticket tells the client exactly how to transfer the bytes itself; our own
// functions never carry them, so the 4.5 MB request cap never applies.
export async function createTicket(ctx, { key, size, mime, filename }) {
  const threshold = Number(setting(ctx, "multipartThreshold"));
  const startUrl = ctx.config?.multipartStartUrl;

  if (startUrl && size > threshold) {
    const form = new FormData();
    const fields = staticFields(ctx, { key, filename, size, mime });
    for (const [name, value] of Object.entries(fields)) form.append(name, value);
    form.append(setting(ctx, "filenameField"), filename);
    form.append(setting(ctx, "sizeField"), String(size));
    form.append(setting(ctx, "contentTypeField"), mime || "application/octet-stream");

    const response = await fetch(startUrl, {
      method: "POST",
      headers: authHeaders(ctx),
      body: form,
    });
    const payload = await readJson(response);

    if (!response.ok) {
      throw new Error(
        `Multipart start failed (${response.status}): ${JSON.stringify(payload).slice(0, 300)}`
      );
    }

    const uploadId = getPath(payload, setting(ctx, "uploadIdPath"));
    const parts = getPath(payload, setting(ctx, "partsPath")) || [];

    return {
      mode: "multipart",
      providerKey: uploadId,
      driverState: { uploadId },
      ticket: {
        mode: "multipart",
        partSize: Number(setting(ctx, "partSize")),
        contentType: mime || "application/octet-stream",
        parts: parts.map((url, index) => ({
          partNumber: index + 1,
          url,
          method: "PUT",
          headers: { "Content-Type": mime || "application/octet-stream" },
        })),
      },
    };
  }

  // Single-shot form post. The client builds a multipart/form-data body from
  // `fields` plus the file under `fileField`.
  return {
    mode: "form-post",
    providerKey: "",
    driverState: {},
    ticket: {
      mode: "form-post",
      url: ctx.config?.uploadUrl,
      method: "POST",
      fileField: setting(ctx, "fileField"),
      fields: staticFields(ctx, { key, filename, size, mime }),
      headers: authHeaders(ctx),
      keyPath: setting(ctx, "keyPath"),
      maxBytes: threshold,
    },
  };
}

// Finalize. For multipart we call the provider's complete endpoint and trust the
// metadata it returns; for a form post the client already has the response and
// hands us back the extracted key.
export async function commit(ctx, { mode, driverState, providerKey, response, size }) {
  if (mode === "multipart") {
    const form = new FormData();
    const fields = staticFields(ctx, {});
    for (const [name, value] of Object.entries(fields)) form.append(name, value);
    form.append(setting(ctx, "completeIdField"), driverState.uploadId);

    const res = await fetch(ctx.config?.multipartCompleteUrl, {
      method: "POST",
      headers: authHeaders(ctx),
      body: form,
    });
    const payload = await readJson(res);

    if (!res.ok) {
      throw new Error(
        `Multipart complete failed (${res.status}): ${JSON.stringify(payload).slice(0, 300)}`
      );
    }

    const key = getPath(payload, setting(ctx, "uploadIdPath")) || driverState.uploadId;
    return {
      key,
      url: publicUrl(ctx, key),
      size: pickSize(payload, size),
      mime: payload?.mime_type || "",
      etag: null,
    };
  }

  // form-post: the key was extracted client-side from the provider's response.
  const key = providerKey || getPath(response, setting(ctx, "keyPath"));
  if (!key) throw new Error("Provider response carried no object key.");

  return {
    key,
    url: publicUrl(ctx, key),
    size: pickSize(response, size),
    mime: response?.mime_type || "",
    etag: null,
  };
}

// Server-side transfer, used by the ?direct=1 shortcut and the probe.
export async function receive(ctx, { filename, mime, body }) {
  const form = new FormData();
  const fields = staticFields(ctx, { filename, mime, size: body.byteLength });
  for (const [name, value] of Object.entries(fields)) form.append(name, value);
  form.append(
    setting(ctx, "fileField"),
    new Blob([body], { type: mime || "application/octet-stream" }),
    filename
  );

  const response = await fetch(ctx.config?.uploadUrl, {
    method: "POST",
    headers: authHeaders(ctx),
    body: form,
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(
      `Upload failed (${response.status}): ${JSON.stringify(payload).slice(0, 300)}`
    );
  }

  const key = getPath(payload, setting(ctx, "keyPath"));
  if (!key) throw new Error("Provider response carried no object key.");

  return { key, url: publicUrl(ctx, key), size: body.byteLength, etag: null };
}

export async function remove(ctx, { key }) {
  const template = ctx.config?.deleteUrl;
  if (!template) return false;

  const response = await fetch(interpolate(template, { key }, ctx), {
    method: setting(ctx, "deleteMethod"),
    headers: authHeaders(ctx),
  });
  return response.ok;
}

// Qualification: write a probe file, read it back over the public URL, then
// clean it up. A provider that cannot delete is usable but flagged.
export async function probe(ctx) {
  const warnings = [];
  if (!ctx.config?.uploadUrl) {
    return { ok: false, error: "Upload endpoint is required.", warnings };
  }

  const body = Buffer.from(`geiger-filestore probe ${Date.now()}`);
  let uploaded;
  try {
    uploaded = await receive(ctx, {
      filename: "geiger-probe.txt",
      mime: "text/plain",
      body,
    });
  } catch (err) {
    return { ok: false, error: err.message, warnings };
  }

  if (uploaded.url) {
    try {
      const check = await fetch(uploaded.url, { method: "GET" });
      if (!check.ok) {
        warnings.push(
          `Uploaded, but reading the public URL returned ${check.status}. Files may not be publicly readable yet.`
        );
      }
    } catch (err) {
      warnings.push(`Uploaded, but the public URL could not be fetched: ${err.message}`);
    }
  } else {
    warnings.push("No public URL template configured, so links cannot be produced.");
  }

  if (ctx.config?.deleteUrl) {
    try {
      const removed = await remove(ctx, { key: uploaded.key });
      if (!removed) warnings.push("Probe file could not be deleted; clean it up manually.");
    } catch (err) {
      warnings.push(`Probe cleanup failed: ${err.message}`);
    }
  } else {
    warnings.push("No delete endpoint configured — deletions will only unlink, not free bytes.");
  }

  return { ok: true, error: null, warnings, probeKey: uploaded.key };
}
