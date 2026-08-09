"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { FallbackProductIcon, PRODUCT_ICONS } from "@/lib/pricing/product-icons";
import { cn } from "@/lib/utils";

const PRODUCT_BY_ID = new Map(PRODUCT_CATALOG.map((product) => [product.id, product]));

// Everything in the catalog you can actually buy today — the denominator for
// "6 of 18 unlocked".
const PURCHASABLE_COUNT = PRODUCT_CATALOG.filter((product) => !product.comingSoon).length;

// Catalog families in display order. The tint is the family's identity: it is
// the only colour in the grid, so colour always means "which family".
const FAMILIES = [
  { key: "core", label: "Core", tile: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
  { key: "addon", label: "Add-ons", tile: "border-blue-500/20 bg-blue-500/10 text-blue-400" },
  { key: "cherry", label: "Cherry", tile: "border-violet-500/20 bg-violet-500/10 text-violet-400" },
  { key: "security", label: "Security", tile: "border-amber-500/20 bg-amber-500/10 text-amber-400" },
  { key: "domains", label: "Domains", tile: "border-sky-500/20 bg-sky-500/10 text-sky-400" },
  { key: "email", label: "Email", tile: "border-rose-500/20 bg-rose-500/10 text-rose-400" },
  { key: "other", label: "Other", tile: "border-border bg-surface-card text-muted-foreground" },
];

// Family tint by catalog category, so every surface that lists products (here,
// the usage screen) colours them the same way.
export const FAMILY_TINT = Object.fromEntries(FAMILIES.map((family) => [family.key, family.tile]));

// Suite apps open at /<id> (rewritten to the product in lib/product-routes.mjs);
// security, domain, and email entries are account-level add-ons with no app.
const LINKED_FAMILIES = new Set(["core", "addon", "cherry"]);

// Unknown ids still render rather than vanishing from a plan someone paid for.
function resolveProduct(id) {
  return PRODUCT_BY_ID.get(id) || { id, name: id, detail: "", category: "other" };
}

function groupByFamily(ids) {
  const list = (Array.isArray(ids) ? ids : []).map(resolveProduct);
  return FAMILIES.map((family) => ({
    ...family,
    items: list.filter((product) => (product.category || "other") === family.key),
  })).filter((family) => family.items.length);
}

function ProductTile({ product, tile }) {
  const Icon = PRODUCT_ICONS[product.id] || FallbackProductIcon;
  const href = LINKED_FAMILIES.has(product.category) ? `/${product.id}` : null;

  const body = (
    <>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border", tile)}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground">{product.name}</span>
          {typeof product.price === "number" ? (
            <span className="shrink-0 rounded-full border border-border px-1.5 py-px text-[10px] font-medium tabular-nums text-muted-foreground">
              ${product.price}/mo
            </span>
          ) : null}
        </span>
        {product.detail ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{product.detail}</span>
        ) : null}
      </span>
      {href ? (
        <ArrowUpRight className="size-4 shrink-0 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      ) : null}
    </>
  );

  const shell =
    "group flex items-center gap-3 rounded-xl border border-border bg-surface-subtle p-3 transition-colors";

  if (!href) return <div className={shell}>{body}</div>;

  return (
    <Link
      href={href}
      title={`Open ${product.name}`}
      className={cn(
        shell,
        "hover:border-border-strong hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {body}
    </Link>
  );
}

export function ProductAccess({ productIds, className, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const groups = groupByFamily(productIds);
  if (!groups.length) return null;

  const owned = groups.reduce((sum, group) => sum + group.items.length, 0);
  // Collapsed, the header still says which families the plan covers.
  const summary = groups.map((group) => `${group.label} ${group.items.length}`).join(" · ");

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-surface-card", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            <span className="tabular-nums">{owned}</span> of {PURCHASABLE_COUNT} products unlocked
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{summary}</span>
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>

      {open ? (
        <>
          <div className="flex flex-col gap-5 border-t border-border p-5">
            {groups.map((group) => (
              <div key={group.key}>
                <div className="mb-2.5 flex items-center gap-3">
                  <span className="text-xs font-medium text-text-secondary">{group.label}</span>
                  <span className="text-xs tabular-nums text-text-tertiary">{group.items.length}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.items.map((product) => (
                    <ProductTile key={product.id} product={product} tile={group.tile} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end border-t border-border bg-surface-subtle px-5 py-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-foreground"
            >
              Add Products
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ProductAccess;
