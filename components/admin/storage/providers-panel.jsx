"use client";

// The members of the pool: what each one is, how full it is, whether it has
// qualified, and the order uploads fill them in.

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  MoreHorizontal,
  FlaskConical,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  StatusPill,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  usagePercent,
  formatRelative,
  PROVIDER_STATUS_MAP,
  CAPABILITY_LABELS,
} from "@/lib/filestore/utils";
import {
  testProviderAction,
  deleteProviderAction,
  setProviderStatusAction,
  reorderProvidersAction,
} from "@/lib/filestore/actions";
import { ProviderDialog } from "./provider-dialog";

export function ProvidersPanel({ providers, drivers, secretKeyReady }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [testing, setTesting] = useState(null);
  const [busy, setBusy] = useState(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(provider) {
    setEditing(provider);
    setDialogOpen(true);
  }

  // The probe is the qualification gate — it reports what it actually did, and
  // warnings (no delete endpoint, CORS, proxy size caps) matter as much as pass.
  async function handleTest(provider) {
    setTesting(provider.id);
    const result = await testProviderAction(provider.id);
    setTesting(null);

    if (!result.ok) {
      toast.error(result.error || "Probe failed.", { duration: 8000 });
      return;
    }

    const warnings = result.warnings || [];
    toast.success(
      warnings.length
        ? `${provider.name} qualified with ${warnings.length} note(s): ${warnings[0]}`
        : `${provider.name} qualified — write, read and delete all worked.`,
      { duration: warnings.length ? 9000 : 4000 }
    );
  }

  async function handleDelete(provider) {
    setBusy(provider.id);
    const result = await deleteProviderAction(provider.id);
    setBusy(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${provider.name} removed from the pool.`);
  }

  async function handleStatus(provider, status) {
    setBusy(provider.id);
    const result = await setProviderStatusAction(provider.id, status);
    setBusy(null);
    if (!result.ok) toast.error(result.error);
    else toast.success(`${provider.name} is now ${status}.`);
  }

  async function handleMove(index, direction) {
    const next = [...providers];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    const result = await reorderProvidersAction(next.map((item) => item.id));
    if (!result.ok) toast.error(result.error);
    else toast.success("Fill order updated.");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Uploads fill the lowest-priority provider with room, then spill to the
          next. Rules and required capabilities narrow the candidates first.
        </p>
        <Button onClick={openCreate} className="shrink-0 gap-1.5 bg-primary">
          <Plus className="h-4 w-4" />
          Add provider
        </Button>
      </div>

      {providers.length === 0 ? (
        <EmptyState
          title="The pool is empty"
          description="Add an S3 bucket, a REST provider like Uploadcare, Supabase Storage or Vercel Blob to give uploads somewhere to land."
          action={
            <Button onClick={openCreate} className="gap-1.5 bg-primary">
              <Plus className="h-4 w-4" />
              Add provider
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-subtle">
          {providers.map((provider, index) => {
            const percent = usagePercent(provider.usedBytes, provider.capacityBytes);
            const capabilities = Object.entries(CAPABILITY_LABELS).filter(
              ([key]) => provider.capabilities?.[key]
            );

            return (
              <div
                key={provider.id}
                className={cn(
                  "flex flex-col gap-3 p-4 lg:flex-row lg:items-center",
                  index > 0 && "border-t border-border"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {provider.name}
                    </span>
                    <StatusPill status={provider.status} map={PROVIDER_STATUS_MAP} />
                    <span className="rounded-full border border-border bg-surface-active px-2 py-0.5 text-[11px] text-text-secondary">
                      {provider.driver}
                    </span>
                    {capabilities.map(([key, label]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-300"
                      >
                        {key === "cdn" ? (
                          <Zap className="h-2.5 w-2.5" />
                        ) : (
                          <ShieldCheck className="h-2.5 w-2.5" />
                        )}
                        {label}
                      </span>
                    ))}
                  </div>

                  <p className="mt-1 text-xs text-text-tertiary">
                    Priority {provider.priority} · {provider.objectCount} object
                    {provider.objectCount === 1 ? "" : "s"} · probed{" "}
                    {formatRelative(provider.lastProbeAt)}
                    {provider.lastProbeError ? ` · ${provider.lastProbeError}` : ""}
                  </p>
                </div>

                <div className="w-full lg:w-56">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-active">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        percent >= 90 ? "bg-red-400" : "bg-primary"
                      )}
                      style={{ width: `${provider.capacityBytes ? percent : 4}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] tabular-nums text-text-tertiary">
                    {formatBytes(provider.usedBytes)}
                    {provider.capacityBytes
                      ? ` / ${formatBytes(provider.capacityBytes)} · ${percent}%`
                      : " · unlimited"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleTest(provider)}
                    disabled={testing === provider.id}
                  >
                    {testing === provider.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FlaskConical className="h-3.5 w-3.5" />
                    )}
                    Test
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${provider.name}`}
                        disabled={busy === provider.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-border bg-surface-subtle"
                    >
                      <DropdownMenuItem onClick={() => openEdit(provider)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMove(index, -1)}>
                        <ArrowUp className="mr-2 h-3.5 w-3.5" />
                        Fill earlier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMove(index, 1)}>
                        <ArrowDown className="mr-2 h-3.5 w-3.5" />
                        Fill later
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {provider.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => handleStatus(provider, "readonly")}
                        >
                          Stop new uploads
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatus(provider, "active")}
                        >
                          Accept uploads
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="text-red-400 focus:bg-red-500/10"
                        onClick={() => handleDelete(provider)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {dialogOpen && (
        <ProviderDialog
          onOpenChange={setDialogOpen}
          provider={editing}
          drivers={drivers}
          secretKeyReady={secretKeyReady}
        />
      )}
    </div>
  );
}
