"use client";

import { useState, useSyncExternalStore } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Static, session-remembered password gate over /admin. This is UI-only and NOT
// real security — anyone can read the client bundle; it just keeps the admin
// surface out of casual reach until proper auth replaces it.
const STORAGE_KEY = "geiger-admin-unlocked";
const UNLOCK_EVENT = "geiger-admin-unlock";
const ADMIN_PASSWORD = "123";

// Read the unlock flag from sessionStorage via useSyncExternalStore so the value
// is SSR-safe and stays in sync after unlocking, without setState-in-effect.
function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(UNLOCK_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(UNLOCK_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function AdminGate({ children }) {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (value === ADMIN_PASSWORD) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // sessionStorage may be unavailable; the event still unlocks this render.
      }
      window.dispatchEvent(new Event(UNLOCK_EVENT));
      setError("");
      return;
    }
    setError("Incorrect password.");
    setValue("");
  };

  if (unlocked) return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm space-y-5 rounded-xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur"
      >
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
          <Lock className="size-4" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Admin access</h1>
          <p className="text-sm text-muted-foreground">
            Enter the password to open the admin area.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError("");
            }}
            placeholder="••••"
            className="bg-background text-foreground"
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
        <Button type="submit" className="w-full">
          Unlock
        </Button>
      </form>
    </div>
  );
}
