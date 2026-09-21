// Storage pool admin surface. The mother project owns the suite's provider
// pool, its capacity ledger, and the virtual file tree every app uploads into.

import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { getPoolSnapshot } from "@/lib/filestore/stats";
import { getRules, getApiKeys, getNodes } from "@/lib/filestore/queries";
import { DRIVER_CATALOG } from "@/lib/filestore/drivers";
import { hasSecretKey } from "@/lib/filestore/crypto";
import { StorageManager } from "@/components/admin/storage/storage-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Storage Pool · Geiger",
};

export default async function AdminStoragePage() {
  const supabase = await createClient();
  await requireUser(supabase, "/login?next=/admin/storage");

  const [snapshot, rules, apiKeys] = await Promise.all([
    getPoolSnapshot(),
    getRules(),
    getApiKeys(),
  ]);

  // The browser opens on the first namespace; switching one re-fetches.
  const firstNamespace = snapshot.namespaces[0] || null;
  const nodes = firstNamespace ? await getNodes(firstNamespace.id) : [];

  return (
    <StorageManager
      snapshot={snapshot}
      rules={rules}
      apiKeys={apiKeys}
      drivers={DRIVER_CATALOG}
      initialNodes={nodes}
      initialNamespaceId={firstNamespace?.id || null}
      secretKeyReady={hasSecretKey()}
    />
  );
}
