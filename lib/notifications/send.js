import { after } from "next/server";
import { createNotifier } from "@geiger/notify";
import { createServerNotifier } from "@geiger/notify/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { DASH_NOTIFICATION_TYPES } from "./types";

const OPTIONS = { app: "dash", types: DASH_NOTIFICATION_TYPES };
const ORG_MANAGER_ROLES = ["Owner", "Admin", "Manager"];

// Sends as the signed-in user, so notify.send's membership checks apply.
function sessionNotifier(supabase) {
  return createNotifier(supabase, OPTIONS);
}

// Service-role notifier for recipients the actor may no longer share an org with.
function trustedNotifier() {
  const admin = createAdminClient();
  return admin ? createServerNotifier({ supabase: admin, ...OPTIONS }) : null;
}

export function displayName(user) {
  const meta = user?.user_metadata || {};
  return meta.full_name || meta.name || user?.email?.split("@")[0] || "";
}

// Best-effort and post-response: a failed notification never fails the mutation.
function later(task) {
  after(async () => {
    try {
      await task();
    } catch (error) {
      console.error("[notifications.dash]", error);
    }
  });
}

export function notifyMemberJoined(supabase, { user, organizationId, orgName }) {
  if (!organizationId) return;
  later(() =>
    sessionNotifier(supabase).notifyOrganization(organizationId, "org.member_joined", {
      roles: ORG_MANAGER_ROLES,
      organizationId,
      data: { organizationId, orgName, memberName: displayName(user) },
    }),
  );
}

// Trusted: any manager may replace the deduped notice, not only whoever sent it first.
export function notifyRoleChanged({ actorId, organizationId, orgName, userId, role }) {
  if (!organizationId || !userId) return;
  later(() =>
    trustedNotifier()?.notifyUser(userId, "org.role_changed", {
      actorId,
      organizationId,
      data: { organizationId, orgName, userId, role },
    }),
  );
}

// Trusted: the requester isn't a member yet, so notify.send would refuse their session.
export function notifyJoinRequested({ user, organizationId, orgName, requestId, message }) {
  if (!organizationId || !requestId) return;
  later(() =>
    trustedNotifier()?.notifyOrganization(organizationId, "org.join_requested", {
      roles: ORG_MANAGER_ROLES,
      actorId: user?.id ?? null,
      organizationId,
      data: { organizationId, orgName, requestId, requesterName: displayName(user), message: message || "" },
    }),
  );
}

// Trusted: a declined requester shares no org with the approver.
export function notifyJoinDecided({ actorId, organizationId, orgName, userId, approved }) {
  if (!organizationId || !userId) return;
  later(() =>
    trustedNotifier()?.notifyUser(userId, approved ? "org.join_approved" : "org.join_declined", {
      actorId,
      organizationId: approved ? organizationId : undefined,
      data: { organizationId, orgName },
    }),
  );
}

export function notifyMemberRemoved({ actorId, organizationId, orgName, userId }) {
  if (!userId) return;
  later(() =>
    trustedNotifier()?.notifyUser(userId, "org.member_removed", {
      actorId,
      data: { organizationId, orgName },
    }),
  );
}
