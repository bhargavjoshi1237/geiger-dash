import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { FallbackProductIcon, PRODUCT_ICONS } from "@/lib/pricing/product-icons";
import { cn } from "@/lib/utils";

const PRODUCT_BY_ID = new Map(PRODUCT_CATALOG.map((product) => [product.id, product]));

// Catalog families in display order; `tile` is only the usage screen's family tint (see FAMILY_TINT).
const FAMILIES = [
  { key: "core", label: "Core", tile: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { key: "addon", label: "Add-ons", tile: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { key: "cherry", label: "Cherry", tile: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { key: "security", label: "Security", tile: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { key: "domains", label: "Domains", tile: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { key: "email", label: "Email", tile: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { key: "other", label: "Other", tile: "border-border bg-surface-card text-muted-foreground" },
];

export const FAMILY_TINT = Object.fromEntries(FAMILIES.map((family) => [family.key, family.tile]));

// Suite apps open at /<id> (rewritten in lib/product-routes.mjs); security, domain and email entries have no app.
const LINKED_FAMILIES = new Set(["core", "addon", "cherry"]);

// "canvas" -> "Canvas"; for ids that predate the catalog.
export function titleCaseId(id) {
  return String(id || "").replace(/(^|[-_\s])(\w)/g, (_, sep, ch) => `${sep ? " " : ""}${ch.toUpperCase()}`);
}

// Unknown ids still render rather than vanishing from a plan someone paid for.
function resolveProduct(id) {
  return PRODUCT_BY_ID.get(id) || { id, name: titleCaseId(id), detail: "", category: "other" };
}

function groupByFamily(ids) {
  const list = (Array.isArray(ids) ? ids : []).map(resolveProduct);
  return FAMILIES.map((family) => ({
    ...family,
    items: list.filter((product) => (product.category || "other") === family.key),
  })).filter((family) => family.items.length);
}

function ProductRow({ product }) {
  const Icon = PRODUCT_ICONS[product.id] || FallbackProductIcon;
  const href = LINKED_FAMILIES.has(product.category) ? `/${product.id}` : null;

  const body = (
    <>
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-foreground">{product.name}</span>
          {typeof product.price === "number" ? (
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">${product.price}/mo</span>
          ) : null}
        </span>
        {product.detail ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{product.detail}</span>
        ) : null}
      </span>
      {href ? (
        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      ) : null}
    </>
  );

  const shell = "group -mx-2 flex items-start gap-3 rounded-md px-2 py-2";

  if (!href) return <li className={shell}>{body}</li>;

  return (
    <li>
      <a
        href={href}
        title={`Open ${product.name}`}
        className={cn(
          shell,
          "transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {body}
      </a>
    </li>
  );
}

// The products a plan includes, grouped by catalog family.
export function ProductAccess({ productIds, className }) {
  const groups = groupByFamily(productIds);
  if (!groups.length) return null;

  return (
    <div className={className}>
      <div className="divide-y divide-border">
        {groups.map((group) => (
          <div key={group.key} className="grid gap-x-6 gap-y-1 py-3 first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <p className="pt-2 text-xs font-medium text-muted-foreground">
              {group.label} <span className="tabular-nums text-text-tertiary">· {group.items.length}</span>
            </p>
            <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link
        href="/pricing"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Add products
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}

export default ProductAccess;
