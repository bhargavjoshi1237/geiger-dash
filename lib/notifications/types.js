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
  // To the org's managers; the link opens the org's Members settings, where requests are approved.
  "org.join_requested": {
    category: "invite",
    icon: "UserPlus",
    tone: "info",
    title: (d) => `${d.requesterName || "Someone"} asked to join ${d.orgName || "your organization"}`,
    body: (d) => d.message || "Approve or decline the request in Members settings.",
    url: (d) => `/org?members=${d.organizationId}`,
    actions: (d) => [{ label: "Review", url: `/org?members=${d.organizationId}`, variant: "primary" }],
    groupKey: (d) => `org:${d.organizationId}:join_requests`,
    // One notice per request, so repeating a pending request doesn't notify twice.
    dedupeKey: (d) => `org:${d.organizationId}:join_request:${d.requestId}`,
  },
  "org.join_approved": {
    category: "invite",
    icon: "UserCheck",
    tone: "success",
    title: (d) => `Your request to join ${d.orgName || "an organization"} was approved`,
    body: "You're now a member and can open its projects.",
    url: (d) => `/org/${d.organizationId}`,
  },
  "org.join_declined": {
    category: "invite",
    icon: "UserX",
    tone: "warning",
    title: (d) => `Your request to join ${d.orgName || "an organization"} was declined`,
  },
});
