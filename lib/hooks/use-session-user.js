"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Signed-in user from the browser session cookie, so statically rendered pages can stay user-aware without reading cookies on the server.
// Returns undefined until resolved, then the user or null. Display-only: never use it for authorization.
export function useSessionUser() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const supabase = createClient();
    // Fires INITIAL_SESSION right away, then again on every sign-in/out.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return user;
}
