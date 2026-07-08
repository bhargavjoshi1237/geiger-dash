"use client";

import { useState } from "react";
import { login } from "./actions";
import { Github, Loader2, AlertCircle, Apple, KeyRound, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Google Icon since it's not in Lucide
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const ERROR_MESSAGES = {
  sso_not_found: "No SSO provider is set up for that email domain.",
  sso_invalid_email: "Enter a valid email address.",
  oauth_failed: "SSO sign-in failed. Please try again.",
  oauth_state: "SSO sign-in failed. Please try again.",
  oauth_unavailable: "SSO isn't available for that organization right now.",
  oauth_no_email: "Your provider didn't return an email address.",
  auth_callback_failed: "That sign-in link was invalid or expired.",
};

const INPUT =
  "flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground placeholder:text-text-tertiary transition-colors focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50";

export function AuthForm({ next, initialError = "" }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [error, setError] = useState(ERROR_MESSAGES[initialError] || "");
  // View state: cross-fade between the standard sign-in and the enterprise SSO
  // panel. `fading` hides the current content, we swap views while invisible,
  // then fade the new one back in — a clean crossfade with one container.
  const [ssoMode, setSsoMode] = useState(false);
  const [fading, setFading] = useState(false);
  const showPassword = email.length > 0;

  function switchMode(toSso) {
    if (fading) return;
    setError("");
    setFading(true);
    setTimeout(() => {
      setSsoMode(toSso);
      setFading(false);
    }, 200);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result && result.error) {
      setIsLoading(false);
      setError(result.error);
    }
  }

  // Enterprise SSO: resolve the email domain to the org's provider (discover
  // route), which redirects into that provider's auth-code flow.
  function handleSsoSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setSsoLoading(true);
    const path = next ? (next.startsWith("/") ? next : `/${next}`) : "";
    const params = new URLSearchParams({ email: value });
    if (path) params.set("next", path);
    window.location.href = `/api/oauth/discover?${params.toString()}`;
  }

  const errorBox = error ? (
    <div className="flex items-center gap-2 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  ) : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 font-sans text-foreground">
      <div className="relative z-10 w-full max-w-[400px]">
        <div
          className={cn(
            "transition-all duration-200 ease-out",
            fading ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {ssoMode ? (
            // ---- Enterprise SSO panel ----
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <h1 className="text-3xl font-medium tracking-tight text-white">Welcome back</h1>
                <p className="text-sm text-foreground0">Sign in to your enterprise account</p>
              </div>

              <form onSubmit={handleSsoSubmit} className="space-y-4">
                {errorBox}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-medium text-white">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="gavin@hooli.com"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT}
                  />
                </div>
                <button
                  type="submit"
                  disabled={ssoLoading || !email.trim()}
                  className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {ssoLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting…
                    </span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-foreground0">
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </button>
              </p>
            </div>
          ) : (
            // ---- Standard sign-in ----
            <div className="space-y-6 text-center">
              <div className="mb-8 space-y-2">
                <h1 className="text-2xl font-medium tracking-tight text-white">Welcome to Geiger</h1>
                <p className="text-lg font-medium text-foreground0">The better way to manage work.</p>
              </div>

              <div className="space-y-3">
                <button
                  className="relative inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-border bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </button>
                <button
                  className="relative inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-border bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </button>
                <button
                  className="relative inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-border bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                >
                  <Apple className="mr-2 h-4 w-4" />
                  Continue with Apple
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="relative inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-border bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Continue with SSO
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <input type="hidden" name="next" value={next || ""} />

                {errorBox}

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-medium text-foreground0">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    showPassword
                      ? "grid-rows-[1fr] opacity-100"
                      : "pointer-events-none grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="space-y-4 overflow-hidden py-1">
                    <input
                      name="password"
                      type="password"
                      placeholder="Your password"
                      required={showPassword}
                      className={INPUT}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md border border-border bg-surface-subtle px-8 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 duration-300 animate-in fade-in zoom-in">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-foreground0">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign up
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
