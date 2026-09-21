"use client";

// Add / edit a provider. The form is driven by the driver's own field
// definitions, so a new driver surfaces here without touching this file.
//
// Secrets are write-only: stored values are never sent to the browser, the
// inputs render as placeholders ("•••• set"), and a blank field on save means
// "leave that credential alone".

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@geiger/ui";
import { formatBytes, parseBytes, CAPABILITY_LABELS } from "@/lib/filestore/utils";
import { saveProviderAction } from "@/lib/filestore/actions";

const CAPABILITY_KEYS = ["cdn", "publicRead", "presign", "multipart"];

function emptyDraft(drivers) {
  return {
    name: "",
    driver: drivers[0]?.id || "s3",
    priority: 100,
    capacity: "",
    publicUrlTemplate: "",
    config: {},
    secrets: {},
    capabilities: drivers[0]?.defaultCapabilities || {},
  };
}

function draftFrom(provider, drivers) {
  if (!provider) return emptyDraft(drivers);

  return {
    name: provider.name,
    driver: provider.driver,
    priority: provider.priority,
    capacity: provider.capacityBytes ? String(provider.capacityBytes) : "",
    publicUrlTemplate: provider.publicUrlTemplate || "",
    config: { ...(provider.config || {}) },
    secrets: {},
    capabilities: { ...(provider.capabilities || {}) },
  };
}

// The parent mounts this only while it is open, so the draft is seeded once at
// mount rather than synced from props in an effect.
export function ProviderDialog({ onOpenChange, provider, drivers, secretKeyReady }) {
  const [draft, setDraft] = useState(() => draftFrom(provider, drivers));
  const [saving, setSaving] = useState(false);

  const driver = useMemo(
    () => drivers.find((item) => item.id === draft.driver) || drivers[0],
    [drivers, draft.driver]
  );

  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }));

  const setConfig = (key) => (value) =>
    setDraft((current) => ({ ...current, config: { ...current.config, [key]: value } }));

  const setSecret = (key) => (value) =>
    setDraft((current) => ({ ...current, secrets: { ...current.secrets, [key]: value } }));

  const setCapability = (key) => (value) =>
    setDraft((current) => ({
      ...current,
      capabilities: { ...current.capabilities, [key]: value },
    }));

  // Switching driver adopts that driver's sensible defaults rather than keeping
  // capabilities that no longer mean anything.
  function handleDriverChange(value) {
    const next = drivers.find((item) => item.id === value);
    setDraft((current) => ({
      ...current,
      driver: value,
      config: {},
      secrets: {},
      capabilities: next?.defaultCapabilities || {},
    }));
  }

  async function handleSave() {
    if (!draft.name.trim()) {
      toast.error("Give the provider a name.");
      return;
    }

    const missing = (driver?.configFields || [])
      .filter((field) => field.required && !String(draft.config[field.key] || "").trim())
      .map((field) => field.label);

    if (missing.length) {
      toast.error(`Missing: ${missing.join(", ")}`);
      return;
    }

    setSaving(true);
    const result = await saveProviderAction({
      id: provider?.id,
      name: draft.name,
      driver: draft.driver,
      priority: Number(draft.priority) || 100,
      capacityBytes: parseBytes(draft.capacity),
      config: draft.config,
      capabilities: {
        ...draft.capabilities,
        maxObjectSize: parseBytes(draft.capabilities.maxObjectSize),
      },
      publicUrlTemplate: draft.publicUrlTemplate,
      secrets: draft.secrets,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error || "Could not save the provider.");
      return;
    }

    toast.success(
      provider ? "Provider updated." : "Provider added — run a test to qualify it."
    );
    onOpenChange(false);
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{provider ? "Edit provider" : "Add a provider"}</DialogTitle>
          <DialogDescription>
            A provider joins the pool unverified. It only starts receiving uploads
            once a test writes, reads back and deletes a probe file successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={draft.name}
                onChange={(event) => set("name")(event.target.value)}
                placeholder="Uploadcare EU"
              />
            </Field>

            <Field label="Driver">
              <Select
                value={draft.driver}
                onValueChange={handleDriverChange}
                disabled={Boolean(provider)}
              >
                <SelectTrigger className="bg-surface-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Capacity"
              hint={
                draft.capacity
                  ? formatBytes(parseBytes(draft.capacity))
                  : "Blank or 0 means unlimited"
              }
            >
              <Input
                value={draft.capacity}
                onChange={(event) => set("capacity")(event.target.value)}
                placeholder="500 GB"
              />
            </Field>

            <Field label="Priority" hint="Lower fills first, then spills to the next.">
              <Input
                type="number"
                value={draft.priority}
                onChange={(event) => set("priority")(event.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Public URL template"
            hint="How a stored key becomes a link. {key} is substituted."
          >
            <Input
              value={draft.publicUrlTemplate}
              onChange={(event) => set("publicUrlTemplate")(event.target.value)}
              placeholder="https://ucarecdn.com/{key}/"
            />
          </Field>

          <div className="rounded-lg border border-border bg-surface-card p-3">
            <p className="mb-3 text-sm font-medium text-foreground">Capabilities</p>
            <p className="mb-3 text-xs text-text-secondary">
              What this provider can offer. Uploads that demand a capability —
              say <code className="rounded bg-surface-active px-1">cdn</code> —
              are only ever placed on providers that have it.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {CAPABILITY_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2.5 text-sm">
                  <Switch
                    checked={Boolean(draft.capabilities[key])}
                    onCheckedChange={setCapability(key)}
                  />
                  <span className="text-foreground">{CAPABILITY_LABELS[key]}</span>
                </label>
              ))}
            </div>
            <Field
              className="mt-3"
              label="Max object size"
              hint={
                draft.capabilities.maxObjectSize
                  ? formatBytes(parseBytes(draft.capabilities.maxObjectSize))
                  : "Blank means no per-object limit"
              }
            >
              <Input
                value={draft.capabilities.maxObjectSize || ""}
                onChange={(event) => setCapability("maxObjectSize")(event.target.value)}
                placeholder="5 GB"
              />
            </Field>
          </div>

          <div className="rounded-lg border border-border bg-surface-card p-3">
            <p className="mb-3 text-sm font-medium text-foreground">
              {driver?.label} settings
            </p>
            <div className="grid gap-3">
              {(driver?.configFields || []).map((field) =>
                field.type === "boolean" ? (
                  <label key={field.key} className="flex items-center gap-2.5 text-sm">
                    <Switch
                      checked={Boolean(draft.config[field.key])}
                      onCheckedChange={setConfig(field.key)}
                    />
                    <span className="text-foreground">{field.label}</span>
                  </label>
                ) : (
                  <Field
                    key={field.key}
                    label={`${field.label}${field.required ? " *" : ""}`}
                  >
                    <Input
                      value={draft.config[field.key] ?? ""}
                      onChange={(event) => setConfig(field.key)(event.target.value)}
                      placeholder={field.placeholder}
                    />
                  </Field>
                )
              )}
            </div>
          </div>

          {driver?.secretFields?.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-card p-3">
              <p className="mb-1 text-sm font-medium text-foreground">Credentials</p>
              <p className="mb-3 text-xs text-text-secondary">
                Encrypted before they reach the database and never sent back to
                this form. Leave a field blank to keep the stored value.
              </p>
              <div className="grid gap-3">
                {driver.secretFields.map((field) => (
                  <Field
                    key={field.key}
                    label={`${field.label}${field.required ? " *" : ""}`}
                  >
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={draft.secrets[field.key] ?? ""}
                      onChange={(event) => setSecret(field.key)(event.target.value)}
                      placeholder={
                        provider?.secretsSet?.[field.key] ? "•••••••• set" : "Not set"
                      }
                    />
                  </Field>
                ))}
              </div>
              {!secretKeyReady && (
                <p className="mt-3 text-xs text-amber-400">
                  STORAGE_SECRET_KEY is missing — credentials cannot be saved.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {provider ? "Save changes" : "Add provider"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
