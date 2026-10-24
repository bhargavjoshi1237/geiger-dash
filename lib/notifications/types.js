import { defineNotificationTypes } from "@geiger/notify";

// Every notification dash sends, declared once; send by key via the notifiers in ./send.js.
// "account.welcome" is the exception: a trigger on auth.users sends it (migration 20261024195014_notify_welcome_new_user).
export const DASH_NOTIFICATION_TYPES = defineNotificationTypes({
  "org.member_joined": {
    category: "update",
    icon: "UserPlus",
    tone: "success",
    title: (d) => `${d.memberName || "A new member"} joined ${d.orgName || "your organization"}`,
    url: (d) => `/org/${d.organizationId}`,
    groupKey: (d) => `org:${d.organizationId}:members`,
  },
  "org.role_changed": {
    category: "update",
    icon: "ShieldUser",
    tone: "info",
    title: (d) => `Your role in ${d.orgName || "an organization"} is now ${d.role}`,
    url: (d) => `/org/${d.organizationId}`,
    // One live notice per member per org; a later change replaces and resurfaces it.
    dedupeKey: (d) => `org:${d.organizationId}:role:${d.userId}`,
    onConflict: "replace",
  },
  "org.member_removed": {
    category: "security",
    icon: "UserMinus",
    tone: "warning",
    title: (d) => `You were removed from ${d.orgName || "an organization"}`,
    body: "You no longer have access to its projects.",
  },
});
