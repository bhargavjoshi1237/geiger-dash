"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GitBranch, Loader2 } from "lucide-react";
import { SegmentedTabs } from "@geiger/ui";
import { PRODUCT_BADGES } from "@/lib/product-badges/shared";
import { setProductBadgeAction } from "@/lib/product-badges/actions";

const NO_BADGE = "none";
const BADGE_TABS = [{ label: "None", value: NO_BADGE }, ...PRODUCT_BADGES.map((badge) => ({ label: badge, value: badge }))];

// One row per product: picking a stage saves straight away and rolls back if the save fails.
function ProductRow({ product, canEdit }) {
  const [badge, setBadge] = useState(product.badge);
  const [saving, setSaving] = useState(false);

  async function handleChange(value) {
    const next = value === NO_BADGE ? null : value;
    if (saving || next === badge) return;

    const previous = badge;
    setBadge(next);
    setSaving(true);
    const result = await setProductBadgeAction(product.href, next).catch(() => null);
    setSaving(false);

    if (result?.ok) {
      toast.success(next ? `${product.name} is now ${next}` : `Badge removed from ${product.name}`);
    } else {
      setBadge(previous);
      toast.error(result?.error || "Couldn't update the badge.");
    }
  }

  return (
    <li className="flex flex-col gap-2 border-b border-border px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{product.name}</p>
          <p className="truncate text-xs text-muted-foreground">{product.href}</p>
        </div>
        {saving ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" /> : null}
      </div>

      {canEdit ? (
        <SegmentedTabs
          tabs={BADGE_TABS}
          value={badge ?? NO_BADGE}
          onChange={handleChange}
          buttonClassName="h-7 text-xs"
        />
      ) : (
        <span className="text-sm text-muted-foreground">{badge ?? "None"}</span>
      )}
    </li>
  );
}

export function VersionControlManager({ products, canEdit }) {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
      <header className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Version control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The stage badge beside each product in the Products menu, across every app in the suite. Changes appear
          within a minute, with no redeploy.
        </p>
        {canEdit ? null : (
          <p className="mt-2 text-sm text-muted-foreground">Only content editors can change these badges.</p>
        )}
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <GitBranch className="h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No products to show</p>
            <p className="mt-1 text-xs text-muted-foreground">The product list couldn&apos;t be loaded.</p>
          </div>
        ) : (
          <ul>
            {products.map((product) => (
              <ProductRow key={product.href} product={product} canEdit={canEdit} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
