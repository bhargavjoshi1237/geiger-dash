// Notice banner admin surface — the strip above the topbar is driven by
// public.dash_notices and renders nothing when no notice is live.

import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { listNotices } from "@/lib/notices/queries";
import { NoticeManager } from "@/components/admin/notices/notice-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notice Banner · Geiger",
};

export default async function AdminNoticePage() {
  const supabase = await createClient();
  await requireUser(supabase, "/login?next=/admin/notice");

  const notices = await listNotices();

  return <NoticeManager notices={notices} />;
}
