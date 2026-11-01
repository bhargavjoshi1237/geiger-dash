import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { isContentEditor } from "@/lib/studio/access";
import { getLivePricing, listPricingVersions } from "@/lib/pricing/queries";
import { PricingManager } from "@/components/admin/pricing/pricing-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing · Geiger",
};

export default async function AdminPricingPage() {
  const supabase = await createClient();
  await requireUser(supabase, "/login?next=/admin/pricing");

  const [live, canEdit] = await Promise.all([getLivePricing(), isContentEditor(supabase)]);
  if (!live) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Pricing</h1>
        <p className="mt-1 text-sm text-muted-foreground">The current pricing couldn&apos;t be loaded. Refresh to try again.</p>
      </div>
    );
  }

  const versions = canEdit ? await listPricingVersions() : [];

  return <PricingManager key={live.versionId ?? "defaults"} config={live.config} versionId={live.versionId} versions={versions} canEdit={canEdit} />;
}
