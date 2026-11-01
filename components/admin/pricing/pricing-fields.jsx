"use client";

import { Input, Label, Switch, Textarea } from "@geiger/ui";

// Compact labelled inputs shared by the pricing panels; numbers stay as typed, and validation reports any bad value before publishing.
export function NumberField({ id, label, value, onChange, prefix, suffix, step = "any", disabled }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-1.5">
        {prefix ? <span className="text-sm text-muted-foreground">{prefix}</span> : null}
        <Input
          id={id}
          type="number"
          min="0"
          step={step}
          value={value ?? ""}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 bg-background tabular-nums"
        />
        {suffix ? <span className="shrink-0 text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
    </div>
  );
}

export function TextField({ id, label, value, onChange, multiline, rows = 2, disabled }) {
  const Control = multiline ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Control
        id={id}
        value={value ?? ""}
        disabled={disabled}
        rows={multiline ? rows : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={multiline ? "resize-none bg-background" : "h-8 bg-background"}
      />
    </div>
  );
}

export function SwitchField({ label, hint, checked, onChange, disabled }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
      <span className="min-w-0">
        <span className="block text-text-secondary">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      <Switch checked={Boolean(checked)} onCheckedChange={onChange} disabled={disabled} />
    </label>
  );
}

export function PanelCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-surface-card p-4">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
