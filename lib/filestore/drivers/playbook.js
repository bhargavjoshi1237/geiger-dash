// Playbook provider driver — built-in and dev-only; toggled on/off in the admin, never created through the provider form.
// Talks to Playbook's unofficial persisted-query GraphQL API (see geiger-assets/PLAYBOOK_API.md); credentials come from env.
// Uploads are proxied (~4.5 MB cap) and archived after registration; reads re-sign daily-expiring links, and remove moves assets to Trash.

import { createHash, randomUUID } from "node:crypto";
import { readJson } from "./shared.js";

export const id = "playbook";
export const label = "Playbook (dev)";
export const builtin = true;
export const description =
  "Dev-only pool member backed by a Playbook workspace board. Uploads are archived after registration; sessions expire every ~30 days.";

export const configFields = [];
export const secretFields = [];

export const defaultCapabilities = {
  cdn: false,
  publicRead: false,
  presign: false,
  multipart: false,
  maxObjectSize: 4 * 1024 * 1024,
  mimeAllow: [],
};

// Declared pool ceiling for the built-in row: the free plan's 100 GB (its real cap is 300 assets, checked by the probe).
export const defaultCapacityBytes = 100 * 1024 * 1024 * 1024;

const ENDPOINT = "https://www.playbook.com/graphql";
const CHUNK_SIZE = 1024 * 1024;
const URL_CACHE_LIMIT = 1000;

// Persisted-query hashes captured 2026-09-25; they change when Playbook redeploys, so PLAYBOOK_OPERATIONS (JSON) can override them.
const OPERATIONS = {
  BeginBatchUpload: "76be9dfa53c446d431c321b757bf3e32",
  CompleteBatchUpload: "c8ea09df85aeab5fee0dbe3e83f6a93c",
  ArchiveAssetsMutation: "69cf92bd383ded5e3bf8f5a162c4448e",
  FullAssetModalQuery: "8addd1617887d1c2ffed4649f4b04a38",
  DeleteAssetsMutation: "ae050cbe867f36ca1589baed1858abed",
  OrganizationStorageQuery: "b8ebf656b90993df5dd964c9bdd8f55a",
};

// 1x1 PNG — Playbook is an image-first DAM, so the probe writes an image rather than plain text.
const PROBE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

export function settings() {
  return {
    jwt: process.env.PLAYBOOK_JWT || "",
    organization: process.env.PLAYBOOK_ORGANIZATION || "",
    board: process.env.PLAYBOOK_BOARD || "",
  };
}

export function isConfigured() {
  const { jwt, organization, board } = settings();
  return Boolean(jwt && organization && board);
}

function operationId(name) {
  let overrides = {};
  try {
    overrides = JSON.parse(process.env.PLAYBOOK_OPERATIONS || "{}");
  } catch {
    overrides = {};
  }
  return `graphql-frontend-prod/${overrides[name] || OPERATIONS[name]}`;
}

function headers() {
  const { jwt, organization } = settings();
  if (!jwt || !organization) {
    throw new Error("PLAYBOOK_JWT and PLAYBOOK_ORGANIZATION must be set.");
  }
  return {
    authorization: `Bearer ${jwt}`,
    organization,
    clienttype: "web-app",
    "content-type": "application/json",
  };
}

async function unwrap(name, response) {
  const payload = await readJson(response);
  if (!response.ok || payload?.errors || !payload?.data) {
    const detail = JSON.stringify(payload?.errors || payload).slice(0, 300);
    throw new Error(`Playbook ${name} failed (${response.status}): ${detail}`);
  }
  return payload.data;
}

async function query(name, variables = {}) {
  const params = new URLSearchParams({
    operationName: name,
    variables: JSON.stringify(variables),
    extensions: JSON.stringify({ operationId: operationId(name) }),
  });
  const response = await fetch(`${ENDPOINT}?${params}`, {
    headers: headers(),
    cache: "no-store",
  });
  return unwrap(name, response);
}

async function mutate(name, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      operationName: name,
      variables,
      extensions: { operationId: operationId(name) },
    }),
  });
  return unwrap(name, response);
}

// Playbook signs the original `url` per UTC day, so a fetched link is reused until just before midnight.
const urlCache = new Map();

function remember(token, url) {
  if (!token || !url) return;
  if (urlCache.size >= URL_CACHE_LIMIT) urlCache.clear();
  const now = new Date();
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  urlCache.set(token, { url, expiresAt: midnight - 60_000 });
}

function recall(token) {
  const hit = urlCache.get(token);
  if (hit && hit.expiresAt > Date.now()) return hit.url;
  urlCache.delete(token);
  return "";
}

async function fetchAsset(token) {
  const { asset } = await query("FullAssetModalQuery", { assetToken: token });
  if (!asset) throw new Error(`Playbook has no asset ${token}.`);
  if (asset.discardedAt) throw new Error(`Playbook asset ${token} is in the Trash.`);
  remember(token, asset.url);
  return asset;
}

// CompleteBatchUpload returns { uploadAssets: [{ asset: { token, title, size, url } }] }.
function registeredAsset(payload) {
  return payload?.uploadAssets?.map((item) => item?.asset).find((asset) => asset?.token) || null;
}

function jwtDaysLeft() {
  try {
    const [, body] = settings().jwt.split(".");
    const { exp } = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return Number.isFinite(exp) ? (exp * 1000 - Date.now()) / 86_400_000 : null;
  } catch {
    return null;
  }
}

// There is no permanent link we rely on; reads always go through signedReadUrl.
export function publicUrl() {
  return "";
}

export async function signedReadUrl(ctx, key) {
  return recall(key) || (await fetchAsset(key)).url || "";
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

// The proxy route hands back the Playbook asset token as providerKey; Playbook is the authority on the stored size.
export async function commit(ctx, { driverState, providerKey, size }) {
  const key = providerKey || driverState?.key;
  const asset = await fetchAsset(key);
  return {
    key,
    url: asset.url || "",
    size: Number(asset.size) || size,
    mime: asset.mediaType || "",
    etag: null,
  };
}

// Reserve a slot -> tus create -> PATCH 1 MiB checksummed chunks -> HEAD verify -> register the asset.
export async function receive(ctx, { key, filename, mime, body }) {
  const { board } = settings();
  if (!board) throw new Error("PLAYBOOK_BOARD must be set.");

  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const uuid = randomUUID();
  const size = String(bytes.length);
  const mediaType = mime || "application/octet-stream";
  const title = key || filename || "file";

  const { beginBatchUpload: begin } = await mutate("BeginBatchUpload", {
    collectionToken: board,
    confirmedOverageTb: null,
    uploadAttributes: [{ uuid, title, mediaType, size }],
  });

  const slot = begin?.uploadAssets?.[0];
  if (!slot?.signedTusUploadUrl || slot.errors?.length) {
    const detail = JSON.stringify(slot?.errors || begin).slice(0, 300);
    throw new Error(`Playbook refused the upload: ${detail}`);
  }
  const trace = `${slot.gcsId}/0`;

  const created = await fetch(slot.signedTusUploadUrl, {
    method: "POST",
    headers: {
      "tus-resumable": "1.0.0",
      "upload-length": size,
      "x-upload-content-type": mediaType,
      "x-amz-meta-encrypted-organization-metadata": slot.encryptedOrganizationMetadata,
      "x-amz-meta-extension": slot.fileExtension,
      "playbook-upload-trace": trace,
    },
  });
  const location = created.headers.get("location");
  if (created.status !== 201 || !location) {
    throw new Error(`Playbook tus create failed (${created.status}).`);
  }
  const uploadUrl = new URL(location, slot.signedTusUploadUrl).toString();

  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + CHUNK_SIZE);
    const patched = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Tus-Resumable": "1.0.0",
        "Upload-Offset": String(offset),
        "Content-Type": "application/offset+octet-stream",
        "Upload-Checksum": `sha256 ${createHash("sha256").update(chunk).digest("base64")}`,
        "playbook-upload-trace": trace,
      },
      body: chunk,
    });
    if (!patched.ok) {
      throw new Error(`Playbook chunk at offset ${offset} failed (${patched.status}).`);
    }
  }

  const head = await fetch(uploadUrl, {
    method: "HEAD",
    headers: { "Tus-Resumable": "1.0.0" },
  });
  if (head.headers.get("upload-offset") !== size) {
    throw new Error("Playbook did not receive every byte of the upload.");
  }

  const md5 = createHash("md5").update(bytes).digest("hex");
  const { completeBatchUpload } = await mutate("CompleteBatchUpload", {
    batchId: begin.batchId,
    collectionToken: board,
    folderContexts: [""],
    dropzone: false,
    disableAutoCleanup: false,
    uploadAttributes: [
      {
        uuid,
        signedGcsId: slot.signedGcsId,
        title,
        mediaType,
        size,
        position: 0,
        md5,
        uploadStartedAt: new Date().toISOString(),
      },
    ],
  });

  const asset = registeredAsset(completeBatchUpload);
  if (!asset) {
    const detail = JSON.stringify(completeBatchUpload).slice(0, 300);
    throw new Error(`Playbook registered no asset: ${detail}`);
  }

  try {
    await mutate("ArchiveAssetsMutation", { tokens: [asset.token] });
  } catch (err) {
    try {
      await remove(ctx, { key: asset.token });
    } catch (cleanupErr) {
      throw new Error(`${err.message} Cleanup also failed: ${cleanupErr.message}`);
    }
    throw err;
  }
  remember(asset.token, asset.url);

  return {
    key: asset.token,
    url: asset.url || "",
    size: Number(asset.size) || bytes.length,
    etag: md5,
  };
}

// Moves the asset to Playbook's Trash, which frees its workspace slot.
export async function remove(ctx, { key }) {
  await mutate("DeleteAssetsMutation", { assetTokens: [key] });
  urlCache.delete(key);
  return true;
}

export async function probe() {
  const warnings = [];
  if (!isConfigured()) {
    return {
      ok: false,
      error: "Set PLAYBOOK_JWT, PLAYBOOK_ORGANIZATION and PLAYBOOK_BOARD to use Playbook.",
      warnings,
    };
  }

  const daysLeft = jwtDaysLeft();
  if (daysLeft !== null && daysLeft <= 0) {
    return { ok: false, error: "PLAYBOOK_JWT has expired — log in again and replace it.", warnings };
  }
  if (daysLeft !== null && daysLeft < 7) {
    warnings.push(`PLAYBOOK_JWT expires in ${Math.max(1, Math.floor(daysLeft))} day(s).`);
  }

  try {
    const { organization } = await query("OrganizationStorageQuery");
    const remaining = Number(organization?.assetsLimitRemaining);
    if (Number.isFinite(remaining) && remaining <= 0) {
      return { ok: false, error: "The Playbook workspace has no asset slots left.", warnings };
    }
    if (Number.isFinite(remaining) && remaining < 25) {
      warnings.push(`Only ${remaining} Playbook asset slot(s) left.`);
    }
  } catch (err) {
    return { ok: false, error: err.message, warnings };
  }

  let uploaded;
  try {
    uploaded = await receive(null, {
      key: `_geiger-probe/${Date.now()}.png`,
      mime: "image/png",
      body: PROBE_PNG,
    });
  } catch (err) {
    return { ok: false, error: `Write failed: ${err.message}`, warnings };
  }

  try {
    const check = await fetch(uploaded.url || (await signedReadUrl(null, uploaded.key)));
    if (!check.ok) warnings.push(`Uploaded, but reading it back returned ${check.status}.`);
  } catch (err) {
    warnings.push(`Uploaded, but the read-back failed: ${err.message}`);
  }

  try {
    await remove(null, { key: uploaded.key });
  } catch (err) {
    warnings.push(`Probe cleanup failed: ${err.message}`);
  }

  warnings.push("Dev only — unofficial Playbook API; uploads are proxied and capped at ~4.5 MB.");
  return { ok: true, error: null, warnings };
}
