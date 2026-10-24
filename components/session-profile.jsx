import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { NotificationsBell } from "@/components/notifications-bell";
import { avatarUrlForUser } from "@/lib/avatar-url";

// Signed-in Help Center header slot (notifications bell + avatar menu).
export function SessionProfile({ user }) {
  return (
    <div className="flex items-center gap-2">
      <NotificationsBell />
      <UserProfileDropdown
        user={{
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          fullName: user.user_metadata?.full_name,
          avatarUrl: avatarUrlForUser(user),
          dashboardHref: "/org",
        }}
      />
    </div>
  );
}
