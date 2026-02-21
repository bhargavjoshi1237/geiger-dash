"use client";

import { useState } from "react";
import { login } from "./actions";
import { Github, Mail, Loader2, AlertCircle, Apple } from "lucide-react";

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

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const showPassword = email.length > 0;

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

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 font-sans text-zinc-100">
      <div className="w-full max-w-[400px] space-y-6 text-center relative z-10">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-white">
            Welcome to Geiger
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            The better way to manage work.
          </p>
        </div>

        <div className="space-y-3">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-black hover:bg-zinc-900 text-white h-10 px-4 w-full relative"
            type="button"
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Continue with Google
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-black hover:bg-zinc-900 text-white h-10 px-4 w-full relative"
            type="button"
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-black hover:bg-zinc-900 text-white h-10 px-4 w-full relative"
            type="button"
          >
            <Apple className="mr-2 h-4 w-4" />
            Continue with Apple
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left mt-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-zinc-600 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showPassword
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden space-y-4 py-1">
              <input
                name="password"
                type="password"
                placeholder="Your password"
                required={showPassword}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-zinc-600 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          {email.length === 0 && (
            <p className="text-xs text-red-500/0 h-4">
              Please enter your email
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 h-10 px-8 w-full relative overflow-hidden group border border-zinc-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-8">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
