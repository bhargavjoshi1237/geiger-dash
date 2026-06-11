"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Fingerprint,
  Key,
  LockKeyhole,
  ShieldCheck,
  TimerReset,
  TriangleAlert,
} from "lucide-react";

const DEFAULT_ACCESS_SETUP = {
  methods: ["pin"],
  pin: "",
  password: "",
  requirePurpose: true,
  sessionMinutes: "15",
};

const METHOD_COPY = {
  pin: {
    label: "PIN",
    icon: LockKeyhole,
    helper: "Enter the configured vault PIN.",
  },
  password: {
    label: "Passphrase",
    icon: Key,
    helper: "Use the passphrase set for this secret.",
  },
  passkey: {
    label: "Hardware passkey",
    icon: Fingerprint,
    helper: "Approve with a security key or platform authenticator.",
  },
};

function getSecretValue(item) {
  return item?.secret || item?.password || item?.apiKey || "";
}

export function VaultCredentialAccessDialog({
  item,
  open = false,
  onOpenChange = () => {},
}) {
  const accessSetup = useMemo(
    () => ({
      ...DEFAULT_ACCESS_SETUP,
      ...(item?.accessSetup || {}),
      methods: item?.accessSetup?.methods?.length
        ? item.accessSetup.methods
        : DEFAULT_ACCESS_SETUP.methods,
    }),
    [item],
  );
  const availableMethods = useMemo(
    () => accessSetup.methods.filter((method) => METHOD_COPY[method]),
    [accessSetup.methods],
  );
  const [activeMethod, setActiveMethod] = useState(availableMethods[0] || "pin");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [error, setError] = useState("");

  const secretValue = getSecretValue(item);
  const isLockedOut = attemptsLeft <= 0;
  const requiresPurpose = Boolean(accessSetup.requirePurpose);

  const markFailure = () => {
    setAttemptsLeft((current) => {
      const next = Math.max(0, current - 1);
      setError(
        next === 0
          ? "Access locked after repeated failed attempts."
          : `Verification failed. ${next} attempt${next === 1 ? "" : "s"} remaining.`,
      );
      return next;
    });
  };

  const handleUnlock = () => {
    if (isLockedOut) return;

    if (requiresPurpose && !purpose.trim()) {
      setError("Add a reason before revealing this secret.");
      return;
    }

    if (activeMethod === "pin") {
      const expectedPin = accessSetup.pin || "1234";
      if (pin !== expectedPin) {
        markFailure();
        return;
      }
    }

    if (activeMethod === "password") {
      const expectedPassword = accessSetup.password || "vault-access";
      if (password !== expectedPassword) {
        markFailure();
        return;
      }
    }

    setError("");
    setIsUnlocked(true);
  };

  const handlePasskeyUnlock = () => {
    if (requiresPurpose && !purpose.trim()) {
      setError("Add a reason before revealing this secret.");
      return;
    }

    setError("");
    setIsUnlocked(true);
  };

  const handleCopy = async () => {
    if (!secretValue) return;
    await navigator.clipboard.writeText(secretValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const ActiveIcon = METHOD_COPY[activeMethod]?.icon || LockKeyhole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto bg-background text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className="size-5 text-muted-foreground" />
            Reveal Secret
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
            Verify identity before viewing or copying {item?.name || "this secret"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface-subtle p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{item?.name}</p>
                <p className="truncate text-xs text-text-secondary">
                  {item?.username || item?.url || "Protected vault secret"}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                <TimerReset className="size-3" />
                {accessSetup.sessionMinutes || 15}m session
              </div>
            </div>
          </div>

          {requiresPurpose && !isUnlocked && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Reason For Reveal
              </Label>
              <Textarea
                placeholder="Example: Rotating deployment token for release"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="min-h-[72px] resize-none bg-surface-subtle border-border text-foreground placeholder:text-text-tertiary focus:border-border-strong"
              />
            </div>
          )}

          {!isUnlocked ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {availableMethods.map((method) => {
                  const methodMeta = METHOD_COPY[method];
                  const MethodIcon = methodMeta.icon;
                  const isActive = activeMethod === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setActiveMethod(method);
                        setError("");
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                        isActive
                          ? "border-border-strong bg-surface-active text-white"
                          : "border-border bg-surface-subtle text-text-secondary hover:border-border-strong hover:text-muted-foreground",
                      )}
                    >
                      <MethodIcon className="size-4 shrink-0" />
                      <span className="truncate">{methodMeta.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-border bg-surface-subtle p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                  <ActiveIcon className="size-4 text-muted-foreground" />
                  {METHOD_COPY[activeMethod]?.label}
                </div>
                <p className="mb-3 text-xs leading-5 text-text-secondary">
                  {METHOD_COPY[activeMethod]?.helper}
                </p>

                {activeMethod === "pin" && (
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    disabled={isLockedOut}
                    className="bg-background border-border text-foreground placeholder:text-text-tertiary h-9"
                  />
                )}

                {activeMethod === "password" && (
                  <Input
                    type="password"
                    placeholder="Enter passphrase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLockedOut}
                    className="bg-background border-border text-foreground placeholder:text-text-tertiary h-9"
                  />
                )}

                {activeMethod === "passkey" && (
                  <Button
                    type="button"
                    onClick={handlePasskeyUnlock}
                    disabled={isLockedOut}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9"
                  >
                    <Fingerprint className="mr-2 size-4" />
                    Verify passkey
                  </Button>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                <CheckCircle2 className="size-4" />
                Verified access
              </div>
              <div className="relative flex items-center rounded-lg border border-border bg-background py-2.5 pl-3 pr-20">
                <code className="block min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                  {showSecret ? secretValue || "No secret saved" : "************************"}
                </code>
                <button
                  type="button"
                  onClick={() => setShowSecret((current) => !current)}
                  className="absolute right-11 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-card hover:text-foreground"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                >
                  {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!secretValue}
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={copied ? "Secret copied" : "Copy secret"}
                  title={copied ? "Secret copied" : "Copy secret"}
                >
                  <Copy className="size-4" />
                </button>
              </div>
              <p className="text-xs leading-5 text-text-secondary">
                Secret reveal is recorded with method, reason, timestamp, and session TTL for audit review.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-border text-text-secondary hover:text-foreground hover:bg-surface-card hover:border-border-strong h-9"
          >
            Close
          </Button>
          {!isUnlocked && activeMethod !== "passkey" && (
            <Button
              type="button"
              onClick={handleUnlock}
              disabled={isLockedOut}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9"
            >
              Verify & Reveal
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
