"use client";

// Subpath import, not the barrel: keeps @geiger/ui's optional peers out of the graph.
import { SuiteHeader } from "@geiger/ui/suite-header";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { avatarUrlForUser } from "@/lib/avatar-url";
import { useSessionUser } from "@/lib/hooks/use-session-user";

// Client twin of <Header /> for statically rendered pages: resolves the session in the browser so the page can be served from the CDN.
export function SessionHeader({ megaMenue = true }) {
  const user = useSessionUser();
  const userId = user?.id ?? null;

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
