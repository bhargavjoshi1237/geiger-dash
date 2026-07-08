"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, MailCheck } from "lucide-react";
import { signUp } from "./actions";
import { SsoSignIn } from "@/components/auth/sso-signin";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const showPassword = email.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setIsLoading(false);
      setError(result.error);
      return;
    }

    if (result?.needsConfirmation) {
      setIsLoading(false);
      setSent(true);
      return;
    }

    // Auto session (email confirmation disabled) → straight to onboarding.
    router.push("/onboarding");
    router.refresh();
  }

  if (sent) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 font-sans text-foreground">
        <div className="w-full max-w-[400px] space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-subtle ring-1 ring-border">
            <MailCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-white">Check your email</h1>
          <p className="text-sm text-foreground0">
            We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
            activate your account, then sign in.
          </p>
          <a
            href="/login"
            className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 font-sans text-foreground">
      <div className="relative z-10 w-full max-w-[400px] space-y-6 text-center">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-white">Create your account</h1>
          <p className="text-lg font-medium text-foreground0">
            The better way to manage work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          {error && (
            <div className="flex items-center gap-2 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="ml-1 text-xs font-medium text-foreground0">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors placeholder:text-text-tertiary focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
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
                placeholder="Create a password (min. 8 characters)"
                required={showPassword}
                minLength={8}
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors placeholder:text-text-tertiary focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
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
                <span>Creating account...</span>
              </div>
            ) : (
              <span>Create account</span>
            )}
          </button>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-foreground0">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <SsoSignIn next="/onboarding" />
        </form>

        <p className="mt-8 text-center text-xs text-foreground0">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
