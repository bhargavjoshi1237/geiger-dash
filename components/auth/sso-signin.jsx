"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

const BTN =
  "inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-border bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50";

// "Continue with SSO" entry: reveals an email field and resolves the user's
// email domain to their org's OAuth provider (domain-based discovery), then runs
// that provider's auth-code flow and returns a Supabase session.
export function SsoSignIn({ next = "" }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function go(e) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setLoading(true);
    // Normalize to a leading-slash path so /auth/callback's `${origin}${next}`
    // concatenation stays well-formed; blank lets the start route default it.
    const path = next ? (next.startsWith("/") ? next : `/${next}`) : "";
    const params = new URLSearchParams({ email: value });
    if (path) params.set("next", path);
    window.location.href = `/api/oauth/discover?${params.toString()}`;
  }

  if (!open) {
    return (
      <button type="button" className={BTN} onClick={() => setOpen(true)}>
        <KeyRound className="mr-2 h-4 w-4" />
        Continue with SSO
      </button>
    );
  }

  return (
    <form onSubmit={go} className="space-y-2 text-left">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        autoFocus
        className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground placeholder:text-text-tertiary transition-colors focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-0"
      />
      <div className="flex gap-2">
        <button type="submit" className={BTN} disabled={loading || !email.trim()}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
