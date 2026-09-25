"use client";

// Namespaces, the keys that write into them, and the activity log.
//
// A namespace is a consumer app's own root; a key is scoped to exactly one, so
// geiger-flow can never list geiger-notes' files. Keys are shown in full once,
// at creation — only the SHA-256 hash is stored.

import { useState } from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  FolderPlus,
  Upload,
  Move,
  FlaskConical,
  RefreshCw,
  CircleAlert,
} from "lucide-react";
import {
  Button,
  Field,
  Input,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import { formatBytes, formatRelative, parseBytes } from "@/lib/filestore/utils";
import {
  createApiKeyAction,
  revokeApiKeyAction,
  createNamespaceAction,
} from "@/lib/filestore/actions";

const EVENT_ICONS = {
  upload: Upload,
  delete: Trash2,
  migrate: Move,
  probe: FlaskConical,
  reconcile: RefreshCw,
  error: CircleAlert,
};

export function KeysPanel({ apiKeys, namespaces, events, providers }) {
  const [nsKey, setNsKey] = useState("");
  const [nsName, setNsName] = useState("");
  const [nsQuota, setNsQuota] = useState("");
  const [creatingNs, setCreatingNs] = useState(false);

  const [keyName, setKeyName] = useState("");
  const [keyProject, setKeyProject] = useState("geiger-flow");
  const [keyNamespace, setKeyNamespace] = useState(namespaces[0]?.id || "");
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(null);

  const providerName = (id) =>
    providers.find((provider) => provider.id === id)?.name || "";

  async function handleCreateNamespace() {
    if (!nsKey.trim()) {
      toast.error("Give the namespace a key.");
      return;
    }

    setCreatingNs(true);
    const result = await createNamespaceAction({
      key: nsKey,
      name: nsName,
      quotaBytes: parseBytes(nsQuota),
    });
    setCreatingNs(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Namespace ${result.namespace.key} created.`);
    setNsKey("");
    setNsName("");
    setNsQuota("");
  }

  async function handleCreateKey() {
    if (!keyName.trim()) {
      toast.error("Give the key a name.");
      return;
    }
    if (!keyNamespace) {
      toast.error("Pick a namespace for this key.");
      return;
    }

    setCreatingKey(true);
    const result = await createApiKeyAction({
      name: keyName,
      project: keyProject,
      namespaceId: keyNamespace,
    });
    setCreatingKey(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setNewKey(result.key);
    setKeyName("");
    toast.success("Key created — copy it now, it won't be shown again.");
  }

  async function handleRevoke(key) {
    setRevoking(key.id);
    const result = await revokeApiKeyAction(key.id);
    setRevoking(null);
    if (!result.ok) toast.error(result.error);
    else toast.success(`${key.name} revoked.`);
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Namespaces"
        description="One root per consumer app. Files, folders and quotas live inside it."
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Key">
            <Input
              value={nsKey}
              onChange={(event) => setNsKey(event.target.value)}
              placeholder="geiger-flow"
            />
          </Field>
          <Field label="Display name">
            <Input
              value={nsName}
              onChange={(event) => setNsName(event.target.value)}
              placeholder="Geiger Flow"
            />
          </Field>
          <Field label="Quota" hint="Blank for none">
            <Input
              value={nsQuota}
              onChange={(event) => setNsQuota(event.target.value)}
              placeholder="50 GB"
            />
          </Field>
          <div className="flex items-end">
            <Button
              onClick={handleCreateNamespace}
              disabled={creatingNs}
              className="w-full gap-1.5 bg-primary"
            >
              {creatingNs ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderPlus className="h-4 w-4" />
              )}
              Create
            </Button>
          </div>
        </div>

        {namespaces.length > 0 && (
          <div className="mt-4 divide-y divide-border">
            {namespaces.map((namespace) => (
              <div
                key={namespace.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="text-sm text-foreground">{namespace.name}</span>
                <code className="rounded bg-surface-active px-1.5 py-0.5 text-[11px] text-text-secondary">
                  {namespace.key}
                </code>
                <span className="ml-auto text-xs tabular-nums text-text-secondary">
                  {formatBytes(namespace.usedBytes)}
                  {namespace.quotaBytes
                    ? ` / ${formatBytes(namespace.quotaBytes)}`
                    : ""}
                  <span className="ml-2 text-text-tertiary">
                    {namespace.objectCount} objects
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="API keys"
        description="How other suite apps authenticate to /api/storage. Scoped to one namespace."
      >
        {newKey && (
          <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
            <p className="mb-2 text-xs text-emerald-300">
              Copy this now — it is never shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded bg-surface-active px-2 py-1.5 text-xs text-foreground">
                {newKey}
              </code>
              <Button variant="outline" size="sm" onClick={copyKey} className="gap-1.5">
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Name">
            <Input
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              placeholder="Flow uploads"
            />
          </Field>
          <Field label="Project">
            <Input
              value={keyProject}
              onChange={(event) => setKeyProject(event.target.value)}
            />
          </Field>
          <Field label="Namespace">
            <Select value={keyNamespace} onValueChange={setKeyNamespace}>
              <SelectTrigger className="bg-surface-card">
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                {namespaces.map((namespace) => (
                  <SelectItem key={namespace.id} value={namespace.id}>
                    {namespace.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-end">
            <Button
              onClick={handleCreateKey}
              disabled={creatingKey || namespaces.length === 0}
              className="w-full gap-1.5 bg-primary"
            >
              {creatingKey ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create key
            </Button>
          </div>
        </div>

        {apiKeys.length > 0 && (
          <div className="mt-4 divide-y divide-border">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <KeyRound
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    key.active ? "text-text-tertiary" : "text-red-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {key.name}
                    {!key.active && (
                      <span className="ml-2 text-[11px] text-red-400">revoked</span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-text-tertiary">
                    {key.prefix} · {key.namespaceKey} · {key.scopes.join(", ")} ·
                    used {formatRelative(key.lastUsedAt)}
                  </p>
                </div>
                {key.active && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Revoke ${key.name}`}
                    className="text-red-400 hover:bg-red-500/10"
                    onClick={() => handleRevoke(key)}
                    disabled={revoking === key.id}
                  >
                    {revoking === key.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Activity"
        description="Every upload, delete, migration and probe against the pool."
      >
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nothing has happened yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {events.slice(0, 60).map((event) => {
              const Icon = EVENT_ICONS[event.type] || Upload;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      event.type === "error" ? "text-red-400" : "text-text-tertiary"
                    )}
                  />
                  <span className="text-sm text-foreground">{event.type}</span>
                  <span
                    className="min-w-0 flex-1 truncate text-xs text-text-secondary"
                    title={event.detail?.message || undefined}
                  >
                    {event.detail?.message
                      ? `${event.detail.stage ? `${event.detail.stage}: ` : ""}${event.detail.message}`
                      : event.detail?.path || providerName(event.providerId) || ""}
                  </span>
                  {event.bytes > 0 && (
                    <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                      {formatBytes(event.bytes)}
                    </span>
                  )}
                  <span className="shrink-0 text-[11px] text-text-tertiary">
                    {formatRelative(event.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
