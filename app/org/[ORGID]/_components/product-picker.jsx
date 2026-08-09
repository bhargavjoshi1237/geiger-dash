"use client";

import { Check, FolderKanban, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { productMeta } from "./constants";

export function ProductSearchInput({ value, onChange, className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products"
        className="bg-surface-card pl-8"
      />
    </div>
  );
}

export function ProductPickerEmpty({ query, className }) {
  return (
    <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
      No products match &ldquo;{query}&rdquo;.
    </p>
  );
}

// Blocked-state icon shared by both picker layouts.
function ProductStateIcon({ locked, usedElsewhere, Icon, iconClass, size }) {
  if (locked) return <Lock className={cn(size, "text-tertiary")} />;
  if (usedElsewhere) return <FolderKanban className={cn(size, "text-tertiary")} />;
  return <Icon className={cn(size, iconClass)} />;
}

// Grid card used by the create dialog.
export function ProductGridCard({ product, state, onToggle }) {
  const meta = productMeta(product.id);
  const { locked, usedElsewhere, isBlocked, isSelected, hint, description } = state;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isBlocked}
      aria-pressed={isSelected}
      title={hint}
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
        isBlocked
          ? "cursor-not-allowed border-dashed border-border bg-surface-subtle opacity-60"
          : isSelected
            ? "border-primary/40 bg-surface-card ring-1 ring-primary/20"
            : "border-border bg-surface-card/50 hover:border-border-strong hover:bg-surface-card",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg border",
          isBlocked ? "border-border bg-surface-card" : meta.tile,
        )}
      >
        <ProductStateIcon
          locked={locked}
          usedElsewhere={usedElsewhere}
          Icon={meta.Icon}
          iconClass={meta.icon}
          size={locked || usedElsewhere ? "size-4" : "size-4.5"}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{product.name}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{description}</span>
      </span>
      {isBlocked ? (
        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
          {locked ? <Lock className="size-3 text-tertiary" /> : <FolderKanban className="size-3 text-tertiary" />}
        </span>
      ) : (
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
          )}
        >
          {isSelected && <Check className="size-3" />}
        </span>
      )}
    </button>
  );
}

// Switch row used by the edit dialog.
export function ProductToggleRow({ product, state, onToggle }) {
  const meta = productMeta(product.id);
  const { locked, usedElsewhere, isBlocked, isSelected, hint, description } = state;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
        isBlocked
          ? "cursor-not-allowed opacity-50"
          : isSelected
            ? "cursor-pointer bg-surface-card"
            : "cursor-pointer hover:bg-surface-card/60",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={isBlocked}
        aria-pressed={isSelected}
        title={hint}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            isBlocked ? "bg-surface-card" : meta.tile,
          )}
        >
          <ProductStateIcon
            locked={locked}
            usedElsewhere={usedElsewhere}
            Icon={meta.Icon}
            iconClass={meta.icon}
            size={locked || usedElsewhere ? "size-3.5" : "size-4"}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
          <span className="mt-0.5 block truncate text-xs leading-snug text-muted-foreground">{description}</span>
        </span>
      </button>
      {/* The tile icon already flags why a row is blocked, so the switch just goes dead. */}
      <Switch
        checked={isSelected}
        disabled={isBlocked}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${product.name}`}
        className="shrink-0"
      />
    </div>
  );
}
