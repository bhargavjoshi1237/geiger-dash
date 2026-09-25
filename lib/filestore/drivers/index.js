// Driver registry.
//
// Every driver implements the same surface, so the placement engine and the API
// routes never branch on provider type:
//
//   probe(ctx)                            qualification: write -> read -> delete
//   createTicket(ctx, { key, size, ... }) how the client should transfer bytes
//   commit(ctx, { ... })                  finalize; returns the authoritative size
//   receive(ctx, { key, mime, body })     server-side transfer (proxy mode, probes)
//   remove(ctx, { key })                  delete the object
//   publicUrl(ctx, key)                   raw public/CDN URL
//   signedReadUrl(ctx, key)               optional; private reads
//   abort(ctx, { key, uploadId })         optional; clean up a failed multipart

import * as s3 from "./s3.js";
import * as rest from "./rest.js";
import * as supabase from "./supabase.js";
import * as vercelBlob from "./vercel-blob.js";
import * as playbook from "./playbook.js";
import { decryptSecrets } from "../crypto.js";

const DRIVERS = {
  s3,
  rest,
  supabase,
  vercel_blob: vercelBlob,
  playbook,
};

export function getDriver(driverId) {
  const driver = DRIVERS[driverId];
  if (!driver) throw new Error(`Unknown storage driver: ${driverId}`);
  return driver;
}

// What the admin UI needs to render a provider form — field definitions only,
// never a value. Built-in drivers are toggled, not configured, so they stay out.
export const DRIVER_CATALOG = Object.values(DRIVERS)
  .filter((driver) => !driver.builtin)
  .map((driver) => ({
    id: driver.id,
    label: driver.label,
    configFields: driver.configFields,
    secretFields: driver.secretFields.map(({ key, label, required }) => ({
      key,
      label,
      required,
    })),
    defaultCapabilities: driver.defaultCapabilities,
  }));

// Built-in pool members are configured from env and only switched on/off in the admin.
export function builtinCatalog() {
  return Object.values(DRIVERS)
    .filter((driver) => driver.builtin)
    .map((driver) => ({
      driver: driver.id,
      label: driver.label,
      description: driver.description,
      configured: driver.isConfigured(),
    }));
}

// Build the context a driver call needs. This is the only place secrets are
// decrypted, and it is server-only.
export function driverContext(provider) {
  return {
    id: provider.id,
    config: provider.config || {},
    secrets: decryptSecrets(provider.secretsEnvelope || provider.secrets),
    capabilities: provider.capabilities || {},
    publicUrlTemplate: provider.publicUrlTemplate ?? provider.public_url_template ?? "",
  };
}

// Not every driver can sign a private read; fall back to the public URL.
export async function resolveReadUrl(provider, key, fallbackUrl) {
  const driver = getDriver(provider.driver);
  const ctx = driverContext(provider);

  if (provider.capabilities?.publicRead !== false && fallbackUrl) return fallbackUrl;

  if (typeof driver.signedReadUrl === "function") {
    try {
      return await driver.signedReadUrl(ctx, key);
    } catch (err) {
      console.error("[filestore.resolveReadUrl]", err.message);
    }
  }

  return fallbackUrl || driver.publicUrl(ctx, key);
}
