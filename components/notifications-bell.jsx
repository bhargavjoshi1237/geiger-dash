"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NotificationBell } from "@geiger/notify/react";
import { createClient } from "@/utils/supabase/client";

function announce(notification) {
  toast(notification.title, { description: notification.body || undefined });
}

function reportError(error, scope) {
  if (scope !== "realtime") toast.error(error.message);
}

// Suite notification bell on dash's own session client; new arrivals also toast.
export function NotificationsBell() {
  const [supabase] = useState(createClient);
  return <NotificationBell supabase={supabase} app="dash" onReceive={announce} onError={reportError} />;
}
