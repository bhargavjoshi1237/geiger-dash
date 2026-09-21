// S3-compatible provider driver — AWS S3, Cloudflare R2, Backblaze B2, Wasabi,
// MinIO. One driver covers them all because they share the API; only endpoint,
// region and path style differ.
//
// Secrets can never be handed to a browser, so transfers are presigned
// server-side: small objects get a single presigned PUT, large ones get a
// presigned URL per part plus a server-side CompleteMultipartUpload.

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { renderPublicUrl } from "./shared.js";

export const id = "s3";
export const label = "S3-compatible";

export const configFields = [
  { key: "bucket", label: "Bucket", type: "text", required: true, placeholder: "geiger-assets" },
  { key: "region", label: "Region", type: "text", required: true, placeholder: "auto" },
  { key: "endpoint", label: "Endpoint", type: "url", placeholder: "https://<account>.r2.cloudflarestorage.com" },
  { key: "prefix", label: "Key prefix", type: "text", placeholder: "geiger/" },
  { key: "forcePathStyle", label: "Force path-style URLs", type: "boolean" },
  { key: "partSize", label: "Part size (bytes)", type: "number", placeholder: "8388608" },
  { key: "multipartThreshold", label: "Use multipart above (bytes)", type: "number", placeholder: "16777216" },
  { key: "signedUrlTtl", label: "Signed URL TTL (seconds)", type: "number", placeholder: "900" },
];

export const secretFields = [
  { key: "accessKeyId", label: "Access key ID", required: true },
  { key: "secretAccessKey", label: "Secret access key", required: true },
];

export const defaultCapabilities = {
  cdn: false,
  publicRead: false,
  presign: true,
  multipart: true,
  maxObjectSize: 5 * 1024 * 1024 * 1024 * 1024,
  mimeAllow: [],
};

const DEFAULT_PART_SIZE = 8 * 1024 * 1024;
const DEFAULT_THRESHOLD = 16 * 1024 * 1024;
const DEFAULT_TTL = 900;

function client(ctx) {
  return new S3Client({
    region: ctx.config?.region || "auto",
    endpoint: ctx.config?.endpoint || undefined,
    forcePathStyle: Boolean(ctx.config?.forcePathStyle),
    credentials: {
      accessKeyId: ctx.secrets?.accessKeyId || "",
      secretAccessKey: ctx.secrets?.secretAccessKey || "",
    },
  });
}

function bucket(ctx) {
  return ctx.config?.bucket;
}

export function publicUrl(ctx, key) {
  if (ctx.publicUrlTemplate) return renderPublicUrl(ctx.publicUrlTemplate, key);

  const endpoint = ctx.config?.endpoint;
  if (endpoint) return `${endpoint.replace(/\/+$/, "")}/${bucket(ctx)}/${key}`;
  return `https://${bucket(ctx)}.s3.${ctx.config?.region || "us-east-1"}.amazonaws.com/${key}`;
}

// Private buckets are read through a short-lived signed URL the gateway route
// redirects to, rather than a permanent public link.
export async function signedReadUrl(ctx, key) {
  const ttl = Number(ctx.config?.signedUrlTtl) || DEFAULT_TTL;
  return getSignedUrl(
    client(ctx),
    new GetObjectCommand({ Bucket: bucket(ctx), Key: key }),
    { expiresIn: ttl }
  );
}

export async function createTicket(ctx, { key, size, mime }) {
  const sdk = client(ctx);
  const ttl = Number(ctx.config?.signedUrlTtl) || DEFAULT_TTL;
  const threshold = Number(ctx.config?.multipartThreshold) || DEFAULT_THRESHOLD;
  const contentType = mime || "application/octet-stream";

  if (size > threshold) {
    const partSize = Number(ctx.config?.partSize) || DEFAULT_PART_SIZE;
    const created = await sdk.send(
      new CreateMultipartUploadCommand({
        Bucket: bucket(ctx),
        Key: key,
        ContentType: contentType,
      })
    );

    const partCount = Math.max(1, Math.ceil(size / partSize));
    const parts = [];
    for (let partNumber = 1; partNumber <= partCount; partNumber += 1) {
      parts.push({
        partNumber,
        method: "PUT",
        url: await getSignedUrl(
          sdk,
          new UploadPartCommand({
            Bucket: bucket(ctx),
            Key: key,
            UploadId: created.UploadId,
            PartNumber: partNumber,
          }),
          { expiresIn: ttl }
        ),
      });
    }

    return {
      mode: "multipart",
      providerKey: key,
      driverState: { uploadId: created.UploadId, key },
      ticket: { mode: "multipart", partSize, contentType, parts },
    };
  }

  const url = await getSignedUrl(
    sdk,
    new PutObjectCommand({ Bucket: bucket(ctx), Key: key, ContentType: contentType }),
    { expiresIn: ttl }
  );

  return {
    mode: "presigned-put",
    providerKey: key,
    driverState: { key },
    ticket: {
      mode: "presigned-put",
      url,
      method: "PUT",
      headers: { "Content-Type": contentType },
    },
  };
}

export async function commit(ctx, { mode, driverState, providerKey, parts, size }) {
  const sdk = client(ctx);
  const key = providerKey || driverState?.key;

  if (mode === "multipart") {
    // The client reports each part's ETag; S3 needs them in order to assemble.
    const ordered = (parts || [])
      .map((part) => ({ PartNumber: part.partNumber, ETag: part.etag }))
      .sort((a, b) => a.PartNumber - b.PartNumber);

    await sdk.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucket(ctx),
        Key: key,
        UploadId: driverState.uploadId,
        MultipartUpload: { Parts: ordered },
      })
    );
  }

  // HEAD is the authority on the stored size, whichever path got us here.
  const head = await sdk.send(
    new HeadObjectCommand({ Bucket: bucket(ctx), Key: key })
  );

  return {
    key,
    url: publicUrl(ctx, key),
    size: Number(head.ContentLength) || size,
    mime: head.ContentType || "",
    etag: head.ETag || null,
  };
}

export async function receive(ctx, { key, mime, body }) {
  await client(ctx).send(
    new PutObjectCommand({
      Bucket: bucket(ctx),
      Key: key,
      Body: body,
      ContentType: mime || "application/octet-stream",
    })
  );

  return { key, url: publicUrl(ctx, key), size: body.byteLength, etag: null };
}

export async function abort(ctx, { key, uploadId }) {
  if (!uploadId) return;
  try {
    await client(ctx).send(
      new AbortMultipartUploadCommand({
        Bucket: bucket(ctx),
        Key: key,
        UploadId: uploadId,
      })
    );
  } catch (err) {
    console.error("[filestore.s3.abort]", err.message);
  }
}

export async function remove(ctx, { key }) {
  await client(ctx).send(
    new DeleteObjectCommand({ Bucket: bucket(ctx), Key: key })
  );
  return true;
}

export async function probe(ctx) {
  const warnings = [];
  if (!bucket(ctx)) return { ok: false, error: "Bucket is required.", warnings };
  if (!ctx.secrets?.accessKeyId || !ctx.secrets?.secretAccessKey) {
    return { ok: false, error: "Access key ID and secret access key are required.", warnings };
  }

  const key = `${ctx.config?.prefix ? `${ctx.config.prefix.replace(/^\/+|\/+$/g, "")}/` : ""}_geiger-probe/${Date.now()}.txt`;
  const body = Buffer.from("geiger-filestore probe");

  try {
    await receive(ctx, { key, mime: "text/plain", body });
  } catch (err) {
    return { ok: false, error: `Write failed: ${err.message}`, warnings };
  }

  try {
    const head = await client(ctx).send(
      new HeadObjectCommand({ Bucket: bucket(ctx), Key: key })
    );
    if (Number(head.ContentLength) !== body.byteLength) {
      warnings.push("Read back a different size than was written.");
    }
  } catch (err) {
    warnings.push(`Wrote the probe but could not read it back: ${err.message}`);
  }

  if (!ctx.capabilities?.publicRead && !ctx.publicUrlTemplate) {
    warnings.push(
      "No public URL template — reads will be served through short-lived signed URLs."
    );
  }
  warnings.push(
    "Browser uploads need a CORS rule on this bucket allowing PUT from the dashboard origin."
  );

  try {
    await remove(ctx, { key });
  } catch (err) {
    warnings.push(`Probe cleanup failed: ${err.message}`);
  }

  return { ok: true, error: null, warnings };
}
