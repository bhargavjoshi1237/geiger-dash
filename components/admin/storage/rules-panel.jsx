"use client";

// Placement rules. These run before the default priority fill, so an admin can
// force a class of upload onto a particular provider — or simply insist it lands
// somewhere CDN-backed, leaving the choice of which to the pool.

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Route, Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import { formatBytes, parseBytes } from "@/lib/filestore/utils";
import { saveRuleAction, deleteRuleAction } from "@/lib/filestore/actions";

const ANY = "__any__";
const CAPABILITY = "__capability__";

const EMPTY = {
  name: "",
  priority: 100,
  enabled: true,
  mimePrefix: "",
  minSize: "",
  maxSize: "",
  namespaceKey: "",
  targetProviderId: ANY,
  requireCdn: false,
};

function describe(rule, providers) {
  const match = [];
  if (rule.match?.mimePrefix) match.push(`type starts with ${rule.match.mimePrefix}`);
  if (rule.match?.minSize) match.push(`larger than ${formatBytes(rule.match.minSize)}`);
  if (rule.match?.maxSize) match.push(`smaller than ${formatBytes(rule.match.maxSize)}`);
  if (rule.match?.namespaceKey) match.push(`from ${rule.match.namespaceKey}`);

  const provider = providers.find((item) => item.id === rule.target?.providerId);
  const target = provider
    ? `pin to ${provider.name}`
    : rule.target?.requireCapabilities?.length
      ? `require ${rule.target.requireCapabilities.join(", ")}`
      : "no target set";

  return `${match.length ? match.join(", ") : "every upload"} → ${target}`;
}

export function RulesPanel({ rules, providers }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }));

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY);
    setOpen(true);
  }

  function openEdit(rule) {
    setEditing(rule);
    setDraft({
      name: rule.name,
      priority: rule.priority,
      enabled: rule.enabled,
      mimePrefix: rule.match?.mimePrefix || "",
      minSize: rule.match?.minSize ? String(rule.match.minSize) : "",
      maxSize: rule.match?.maxSize ? String(rule.match.maxSize) : "",
      namespaceKey: rule.match?.namespaceKey || "",
      targetProviderId:
        rule.target?.providerId ||
        (rule.target?.requireCapabilities?.length ? CAPABILITY : ANY),
      requireCdn: Boolean(rule.target?.requireCapabilities?.includes("cdn")),
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!draft.name.trim()) {
      toast.error("Give the rule a name.");
      return;
    }

    const match = {};
    if (draft.mimePrefix.trim()) match.mimePrefix = draft.mimePrefix.trim();
    if (draft.minSize) match.minSize = parseBytes(draft.minSize);
    if (draft.maxSize) match.maxSize = parseBytes(draft.maxSize);
    if (draft.namespaceKey.trim()) match.namespaceKey = draft.namespaceKey.trim();

    const target = {};
    if (draft.targetProviderId !== ANY && draft.targetProviderId !== CAPABILITY) {
      target.providerId = draft.targetProviderId;
    }
    if (draft.requireCdn) target.requireCapabilities = ["cdn"];

    if (!target.providerId && !target.requireCapabilities) {
      toast.error("A rule needs a target: pin a provider or require a capability.");
      return;
    }

    setSaving(true);
    const result = await saveRuleAction({
      id: editing?.id,
      name: draft.name,
      priority: draft.priority,
      enabled: draft.enabled,
      match,
      target,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Rule updated." : "Rule created.");
    setOpen(false);
  }

  async function handleDelete(rule) {
    setBusyId(rule.id);
    const result = await deleteRuleAction(rule.id);
    setBusyId(null);
    if (!result.ok) toast.error(result.error);
    else toast.success("Rule deleted.");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Evaluated in priority order; the first match wins, then the pool fills
          normally within whatever the rule allowed.
        </p>
        <Button onClick={openCreate} className="shrink-0 gap-1.5 bg-primary">
          <Plus className="h-4 w-4" />
          Add rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          title="No placement rules"
          description="Without rules, uploads simply fill providers in priority order — which is a perfectly good default. Add one when a class of file needs special treatment, like images always landing on a CDN."
          action={
            <Button onClick={openCreate} className="gap-1.5 bg-primary">
              <Plus className="h-4 w-4" />
              Add rule
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-subtle">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-3 p-4",
                index > 0 && "border-t border-border"
              )}
            >
              <Route
                className={cn(
                  "h-4 w-4 shrink-0",
                  rule.enabled ? "text-emerald-400" : "text-text-tertiary"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {rule.name}
                  <span className="ml-2 text-[11px] font-normal text-text-tertiary">
                    priority {rule.priority}
                    {rule.enabled ? "" : " · disabled"}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-xs text-text-secondary">
                  {describe(rule, providers)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${rule.name}`}
                onClick={() => openEdit(rule)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${rule.name}`}
                className="text-red-400 hover:bg-red-500/10"
                onClick={() => handleDelete(rule)}
                disabled={busyId === rule.id}
              >
                {busyId === rule.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit rule" : "New placement rule"}</DialogTitle>
            <DialogDescription>
              Match an upload on its type, size or namespace, then say where it
              should go.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={draft.name}
                  onChange={(event) => set("name")(event.target.value)}
                  placeholder="Images to the CDN"
                />
              </Field>
              <Field label="Priority" hint="Lower runs first.">
                <Input
                  type="number"
                  value={draft.priority}
                  onChange={(event) => set("priority")(event.target.value)}
                />
              </Field>
            </div>

            <div className="rounded-lg border border-border bg-surface-card p-3">
              <p className="mb-3 text-sm font-medium text-foreground">Match</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Mime prefix" hint="e.g. image/">
                  <Input
                    value={draft.mimePrefix}
                    onChange={(event) => set("mimePrefix")(event.target.value)}
                    placeholder="image/"
                  />
                </Field>
                <Field label="Namespace key" hint="Blank matches every consumer.">
                  <Input
                    value={draft.namespaceKey}
                    onChange={(event) => set("namespaceKey")(event.target.value)}
                    placeholder="geiger-flow"
                  />
                </Field>
                <Field label="Larger than">
                  <Input
                    value={draft.minSize}
                    onChange={(event) => set("minSize")(event.target.value)}
                    placeholder="10 MB"
                  />
                </Field>
                <Field label="Smaller than">
                  <Input
                    value={draft.maxSize}
                    onChange={(event) => set("maxSize")(event.target.value)}
                    placeholder="2 GB"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface-card p-3">
              <p className="mb-3 text-sm font-medium text-foreground">Target</p>
              <Field label="Pin to a provider" className="mb-3">
                <Select
                  value={draft.targetProviderId}
                  onValueChange={set("targetProviderId")}
                >
                  <SelectTrigger className="bg-surface-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>No pin — let the pool choose</SelectItem>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <label className="flex items-center gap-2.5 text-sm">
                <Switch
                  checked={draft.requireCdn}
                  onCheckedChange={set("requireCdn")}
                />
                <span className="text-foreground">
                  Must land on a CDN-backed provider
                </span>
              </label>

              <label className="mt-3 flex items-center gap-2.5 text-sm">
                <Switch checked={draft.enabled} onCheckedChange={set("enabled")} />
                <span className="text-foreground">Rule enabled</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save rule" : "Create rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
