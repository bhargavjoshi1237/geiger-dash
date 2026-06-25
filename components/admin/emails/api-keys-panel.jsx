"use client";

// Cross-app API keys: other suite apps authenticate to /api/email/send with one
// of these. Keys are shown in full exactly once, at creation.

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Plus, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createApiKeyAction, revokeApiKeyAction } from "@/lib/email/actions";

function formatWhen(iso) {
  if (!iso) return "never";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApiKeysPanel({ apiKeys }) {
  const [name, setName] = useState("");
  const [project, setProject] = useState("geiger-flow");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(null);

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Give the key a name");
      return;
    }
    setCreating(true);
    const res = await createApiKeyAction({ name, project });
    setCreating(false);
    if (res.ok) {
      setNewKey(res.key);
      setName("");
      toast.success("API key created");
    } else {
      toast.error(res.error || "Failed to create key");
    }
  }

  async function handleRevoke(id) {
    setRevoking(id);
    const res = await revokeApiKeyAction(id);
    setRevoking(null);
    if (res.ok) {
      toast.success("Key revoked");
    } else {
      toast.error(res.error || "Failed to revoke");
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      {/* Create */}
      <div className="rounded-xl border border-border bg-surface-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Create a key</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a key for another suite app. You&apos;ll see the full key
          once — copy it somewhere safe.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Geiger Flow production"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-border-strong"
            />
          </div>
          <div className="w-40">
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Project
            </label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-border-strong"
            />
          </div>
          <Button onClick={handleCreate} disabled={creating} size="sm">
            {creating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Create key
          </Button>
        </div>

        {newKey ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
            <code className="flex-1 truncate font-mono text-sm text-foreground">
              {newKey}
            </code>
            <Button variant="outline" size="sm" onClick={copyKey}>
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : null}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
        {apiKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <KeyRound className="h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No keys yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Project</th>
                <th className="px-4 py-2.5 font-medium">Key</th>
                <th className="px-4 py-2.5 font-medium">Last used</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-border last:border-0 hover:bg-surface-hover/50"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {k.name}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {k.project}
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="font-mono text-xs text-text-secondary">
                      {k.prefix}
                    </code>
                  </td>
                  <td
                    className="px-4 py-2.5 text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {formatWhen(k.lastUsedAt)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                        k.active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                      )}
                    >
                      {k.active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {k.active ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(k.id)}
                        disabled={revoking === k.id}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        {revoking === k.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Usage hint */}
      <div className="rounded-xl border border-border bg-surface-subtle/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Sending from another app
        </h3>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/80 p-3 text-xs leading-relaxed text-zinc-200">
          {`curl -X POST https://geiger.studio/api/email/send \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "flow.issue_assigned",
    "to": "person@example.com",
    "data": { "recipientName": "Alex", "issueTitle": "Login bug", "issueUrl": "https://..." }
  }'`}
        </pre>
      </div>
    </div>
  );
}
