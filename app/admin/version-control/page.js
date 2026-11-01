import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { isContentEditor } from "@/lib/studio/access";
import { listProductBadges } from "@/lib/product-badges/queries";
import { VersionControlManager } from "@/components/admin/version-control/version-control-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Version control · Geiger",
};

export default async function AdminVersionControlPage() {
  const supabase = await createClient();
  await requireUser(supabase, "/login?next=/admin/version-control");

  const [products, canEdit] = await Promise.all([listProductBadges(supabase), isContentEditor(supabase)]);

  return <VersionControlManager products={products} canEdit={canEdit} />;
}
