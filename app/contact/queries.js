import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";

// Name and email of the signed-in visitor, used to prefill and skip contact form fields.
export async function getContactIdentity() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return null;

  return {
    name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    email: user.email || "",
  };
}
