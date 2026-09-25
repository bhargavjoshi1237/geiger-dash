"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Fingerprint, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, LogoLoading } from "@geiger/ui";
import { Card, Section } from "@/components/account/panel";
import { deletePasskey, isPasskeySupported, listPasskeys, registerPasskey } from "@/lib/auth/passkeys";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

// Profile → Security card for listing, adding, and removing the user's passkeys.
export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    listPasskeys().then((rows) => {
      if (!active) return;
      setUnavailable(rows === null);
      setPasskeys(rows ?? []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleAdd() {
    setAdding(true);
    const result = await registerPasskey();
    setAdding(false);
    if (result.ok) {
      setPasskeys((prev) => [...prev, result.passkey]);
      toast.success("Passkey added.");
    } else if (!result.cancelled) {
      toast.error(result.error);
    }
  }

  async function handleRemove(passkey) {
    const previous = passkeys;
    setPasskeys((prev) => prev.filter((item) => item.id !== passkey.id));
    const ok = await deletePasskey(passkey.id);
    if (ok) {
      toast.success(`Removed “${passkey.name}”.`);
    } else {
      setPasskeys(previous);
      toast.error("Couldn't remove that passkey.");
    }
  }

  // Only read after the client-side load, so the WebAuthn check never runs on the server.
  const supported = !loading && isPasskeySupported();
  const canAdd = supported && !unavailable;

  return (
    <Section
      title="Passkeys"
      action={
        canAdd ? (
          <Button type="button" size="sm" variant="outline" onClick={handleAdd} disabled={adding}>
            {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add Passkey
          </Button>
        ) : null
      }
    >
      <Card className="divide-y divide-border">
        {loading ? (
          <div className="flex justify-center p-6">
            <LogoLoading size={36} />
          </div>
        ) : !supported ? (
          <p className="p-5 text-sm text-muted-foreground">This browser doesn&apos;t support passkeys.</p>
        ) : unavailable ? (
          <p className="p-5 text-sm text-muted-foreground">Passkeys aren&apos;t available right now.</p>
        ) : passkeys.length === 0 ? (
          <div className="flex items-start gap-3 p-5">
            <Fingerprint className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Sign in with your fingerprint, face, or device screen lock instead of a password.
              Add a passkey to get started.
            </p>
          </div>
        ) : (
          passkeys.map((passkey) => (
            <div key={passkey.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Fingerprint className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{passkey.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {formatDate(passkey.createdAt)} ·{" "}
                    {passkey.lastUsedAt
                      ? `Last used ${formatDistanceToNow(new Date(passkey.lastUsedAt), { addSuffix: true })}`
                      : "Never used"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${passkey.name}`}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => handleRemove(passkey)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </Card>
    </Section>
  );
}
