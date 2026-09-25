import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { receive } from "./playbook.js";

const originalFetch = globalThis.fetch;
const originalEnv = {
  PLAYBOOK_JWT: process.env.PLAYBOOK_JWT,
  PLAYBOOK_ORGANIZATION: process.env.PLAYBOOK_ORGANIZATION,
  PLAYBOOK_BOARD: process.env.PLAYBOOK_BOARD,
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function fakePlaybook({ archiveFails = false } = {}) {
  const operations = [];
  process.env.PLAYBOOK_JWT = "test-token";
  process.env.PLAYBOOK_ORGANIZATION = "test-workspace";
  process.env.PLAYBOOK_BOARD = "test-board";

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).startsWith("https://upload.test")) {
      if (options.method === "POST") {
        return new Response(null, { status: 201, headers: { location: "/upload/1" } });
      }
      if (options.method === "PATCH") return new Response(null, { status: 204 });
      if (options.method === "HEAD") {
        return new Response(null, { status: 200, headers: { "upload-offset": "3" } });
      }
    }

    const { operationName, variables } = JSON.parse(options.body);
    operations.push({ name: operationName, variables });
    if (operationName === "BeginBatchUpload") {
      return Response.json({
        data: {
          beginBatchUpload: {
            batchId: "batch-1",
            uploadAssets: [{
              signedTusUploadUrl: "https://upload.test/create",
              gcsId: "gcs-1",
              signedGcsId: "signed-1",
              encryptedOrganizationMetadata: "metadata",
              fileExtension: "png",
              errors: [],
            }],
          },
        },
      });
    }
    if (operationName === "CompleteBatchUpload") {
      return Response.json({
        data: {
          completeBatchUpload: {
            uploadAssets: [{ asset: { token: "asset-1", size: "3", url: "https://read.test/asset-1" } }],
          },
        },
      });
    }
    if (operationName === "ArchiveAssetsMutation") {
      return archiveFails
        ? Response.json({ errors: [{ message: "Archive unavailable" }] })
        : Response.json({ data: { archiveAssets: { tokens: ["asset-1"] } } });
    }
    if (operationName === "DeleteAssetsMutation") {
      return Response.json({ data: { deleteAssets: true } });
    }
    throw new Error(`Unexpected operation: ${operationName}`);
  };
  return operations;
}

test("upload archives the registered asset before returning its token", async () => {
  const operations = fakePlaybook();

  const uploaded = await receive(null, { key: "file.png", mime: "image/png", body: Buffer.from("abc") });

  assert.equal(uploaded.key, "asset-1");
  assert.deepEqual(operations.map(({ name }) => name), [
    "BeginBatchUpload", "CompleteBatchUpload", "ArchiveAssetsMutation",
  ]);
  assert.deepEqual(operations[2].variables, { tokens: ["asset-1"] });
});

test("an archive failure rejects the upload and removes the untracked asset", async () => {
  const operations = fakePlaybook({ archiveFails: true });

  await assert.rejects(
    receive(null, { key: "file.png", mime: "image/png", body: Buffer.from("abc") }),
    /Archive unavailable/,
  );
  assert.deepEqual(operations.map(({ name }) => name), [
    "BeginBatchUpload", "CompleteBatchUpload", "ArchiveAssetsMutation", "DeleteAssetsMutation",
  ]);
  assert.deepEqual(operations[3].variables, { assetTokens: ["asset-1"] });
});
