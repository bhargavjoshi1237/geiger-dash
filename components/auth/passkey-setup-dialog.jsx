"use client";

import { useState } from "react";
import { Fingerprint, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import { dismissPasskeyPrompt, registerPasskey } from "@/lib/auth/passkeys";

// Post-login offer to register a passkey; `onDone` fires once however it closes.
export function PasskeySetupDialog({ open, userId, onDone, className }) {
  const [saving, setSaving] = useState(false);

  function close() {
    if (!saving) onDone?.();
  }

  function neverAsk() {
    dismissPasskeyPrompt(userId);
    close();
  }

  async function handleSetup() {
    setSaving(true);
    const result = await registerPasskey();
    setSaving(false);
    if (result.ok) {
      toast.success("Passkey added. You can use it next time you sign in.");
      onDone?.();
    } else if (!result.cancelled) {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader className="items-center text-center sm:items-start sm:text-left">
          <span className="mb-2 flex size-10 items-center justify-center rounded-xl border border-border bg-surface-card text-foreground">
            <Fingerprint className="size-5" />
          </span>
          <DialogTitle>Sign in faster with a passkey</DialogTitle>
          <DialogDescription>
            Use your fingerprint, face, or device screen lock instead of a password next time.
            Passkeys can&apos;t be phished and never leave your device.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={neverAsk}
            disabled={saving}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Don&apos;t ask again
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="ghost" onClick={close} disabled={saving}>
              Not now
            </Button>
            <Button type="button" onClick={handleSetup} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Fingerprint className="size-4" />}
              Set up passkey
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
