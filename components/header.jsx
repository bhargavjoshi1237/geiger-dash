// Subpath import, not the barrel: this is a Server Component, so pulling
// @geiger/ui's index would resolve every optional peer (input-otp, recharts...)
// this app does not install.
import { SuiteHeader } from "@geiger/ui/suite-header";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { avatarUrlForUser } from "@/lib/avatar-url";

// Resolves the session, then hands the shared SuiteHeader a ready-made profile
// slot. Layout, mega menu, and theme toggle live in @geiger/ui so every
// product's landing header stays identical.
export async function Header({ megaMenue = true }) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  const userId = user?.id;

  const profile = userId ? (
    <UserProfileDropdown
      user={{
        id: userId,
        email: user.email,
        name: user.user_metadata?.name,
        fullName: user.user_metadata?.full_name,
        avatarUrl: avatarUrlForUser(user),
        dashboardHref: "/org",
      }}
    />
  ) : null;

  return <SuiteHeader userId={userId} profile={profile} megaMenu={megaMenue} />;
}
