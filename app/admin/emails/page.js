// Email management admin surface. The mother project hosts all suite templates,
// their editing, the send log, and cross-app API keys here.

import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { getTemplates, getMessages, getApiKeys } from "@/lib/email/queries";
import { EmailManager } from "@/components/admin/emails/email-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email Studio · Geiger",
};

export default async function AdminEmailsPage() {
  const supabase = await createClient();
  await requireUser(supabase, "/login?next=/admin/emails");

  const [templates, messages, apiKeys] = await Promise.all([
    getTemplates(),
    getMessages(),
    getApiKeys(),
  ]);

  return (
    <EmailManager templates={templates} messages={messages} apiKeys={apiKeys} />
  );
}
