"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Lock, PenLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import { formatDate, launchHref, productMeta, projectAvatarColor } from "./constants";
import { productLocked, useEntitlements } from "./entitlements";
import { ProjectActions } from "./project-actions";

// Matches the strip's gap-0.5.
const PILL_GAP = 2;
// The strip overlaps the row gap before ⋯; when every pill fits, keep that much room clear.
const FIT_TRAIL = 16;
// Trigger margins (ml-2 mr-1): its gaps match the 8px pill insets on the left and the ⋯ glyph's inset on the right.
const MORE_MARGIN_CLASS = "ml-2 mr-1";
const MORE_MARGIN = 12;

const PILL_CLASS = "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5";
const MORE_CLASS =
  "inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-border py-[5px] pl-2 pr-1.5 text-[13px] text-text-secondary";

function ProjectIdentity({ project, name }) {
  const color = projectAvatarColor(project.projectId || project.id);
  const count = project.products?.length || 0;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-sm font-semibold",
          project.avatarUrl ? "border-border bg-surface-subtle" : cn(color.bg, color.border, color.text),
        )}
      >
        {project.avatarUrl ? (
          <Image src={project.avatarUrl} alt="" fill className="object-cover" unoptimized />
        ) : (
          (name || "P")[0].toUpperCase()
        )}
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
        <p className="truncate text-xs text-muted-foreground">
          {count} {count === 1 ? "product" : "products"} · Added {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
}

// Pill icon + label, shared by the strip and the overflow menu; `accent` warms the icon to the product colour on hover.
function PillBody({ product, locked, accent = true }) {
  const meta = productMeta(product.id);
  const Icon = locked ? Lock : meta.Icon;
  const iconHover = accent ? meta.hover : "group-hover/row:text-foreground group-focus-visible/row:text-foreground";

  return (
    <>
      <Icon className={cn("size-4 shrink-0 text-text-tertiary transition-colors", !locked && iconHover)} />
      <span
        className={cn(
          "whitespace-nowrap text-[13px] text-text-secondary transition-colors",
          !locked && "group-hover/row:text-foreground group-focus-visible/row:text-foreground",
        )}
      >
        {product.name}
      </span>
    </>
  );
}

// Quiet launch pill: dim monochrome at rest, warming to the product's accent on hover.
function ProductPill({ product, locked }) {
  if (locked) {
    return (
      <span title={`${product.name} isn't in your plan`} className={cn(PILL_CLASS, "opacity-45")}>
        <PillBody product={product} locked />
      </span>
    );
  }

  return (
    // Plain <a>: products are separate Next apps behind rewrites, so <Link> would prefetch and soft-navigate in vain.
    <a href={launchHref(product)} className={cn(PILL_CLASS, "group/row transition-colors hover:bg-surface-hover")}>
      <PillBody product={product} />
    </a>
  );
}

// Overflow entry: the same pill on the row's card surface, but hover stays neutral instead of taking the product colour.
const MENU_PILL_CLASS = cn(PILL_CLASS, "flex focus:bg-surface-hover");

function OverflowItem({ product, locked }) {
  if (locked) {
    return (
      <DropdownMenuItem disabled className={cn(MENU_PILL_CLASS, "data-[disabled]:opacity-45")}>
        <PillBody product={product} locked />
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem asChild className={cn(MENU_PILL_CLASS, "group/row")}>
      <a href={launchHref(product)}>
        <PillBody product={product} accent={false} />
      </a>
    </DropdownMenuItem>
  );
}

function OverflowMenu({ products, name, entitlements, hasVisible, onEditProducts }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            MORE_CLASS,
            MORE_MARGIN_CLASS,
            "group/more outline-none transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-border-strong data-[state=open]:bg-surface-hover data-[state=open]:text-foreground",
          )}
        >
          <span className="whitespace-nowrap tabular-nums">
            {hasVisible ? `${products.length} More` : `${products.length} products`}
          </span>
          <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/more:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-max min-w-0 rounded-lg bg-surface-card p-1 shadow-lg">
        {products.map((product) => (
          <OverflowItem key={product.id} product={product} locked={productLocked(entitlements, product.id)} />
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onEditProducts}
          aria-label="Edit products"
          className={cn(MENU_PILL_CLASS, "justify-center text-text-tertiary focus:text-foreground")}
        >
          <PenLine className="size-4 text-current" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Counts how many pills fit beside a "+N more" trigger; null until the first measure.
function useFitCount(signature) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [fitCount, setFitCount] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    function fit() {
      const nodes = [...measure.children];
      const [moreOneDigit, moreTwoDigit] = nodes.splice(-2).map((node) => node.offsetWidth);
      const widths = nodes.map((node) => node.offsetWidth);
      const available = container.clientWidth;
      const total = widths.reduce((sum, w, i) => sum + w + (i ? PILL_GAP : 0), 0);

      if (total + FIT_TRAIL <= available) return setFitCount(widths.length);

      // Keep the largest count whose pills, its own "N More" trigger and the trailing gap still fit.
      let used = 0;
      let count = 0;
      widths.forEach((width, i) => {
        used += (i ? PILL_GAP : 0) + width;
        const hidden = widths.length - (i + 1);
        const more = hidden > 9 ? moreTwoDigit : moreOneDigit;
        if (hidden && used + PILL_GAP + MORE_MARGIN + more + PILL_GAP <= available) count = i + 1;
      });
      setFitCount(count);
    }

    // Fires once on observe, then on row resize or font swap in the measuring layer.
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [signature]);

  return { containerRef, measureRef, fitCount };
}

export function ProjectRow({ project, name, organizationId }) {
  const entitlements = useEntitlements();
  const products = project.products || [];
  const [editOpen, setEditOpen] = useState(false);
  const { containerRef, measureRef, fitCount } = useFitCount(products.map((p) => p.id).join(","));

  const visibleCount = fitCount ?? products.length;
  const visible = products.slice(0, visibleCount);
  const hidden = products.slice(visibleCount);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-card px-3 py-3 transition-colors hover:border-border-strong sm:gap-4 sm:px-4">
      <div className="w-40 shrink-0 sm:w-60">
        <ProjectIdentity project={project} name={name} />
      </div>

      <div className="h-9 w-px shrink-0 bg-border" />

      {/* Runs up to the ⋯ button (cancelling the row gap) so the space after the trigger is one of the shared gaps.
          Clipped only until the first measure, so server-rendered pills never spill into the actions column. */}
      <div
        ref={containerRef}
        className={cn("relative -mr-3 min-w-0 flex-1 sm:-mr-4", fitCount === null && "overflow-hidden")}
      >
        {products.length ? (
          <>
            {/* On overflow, spread spare room evenly; the empty ::after item makes the gap after "N More" match the one before it. */}
            <div
              className={cn(
                "flex items-center gap-0.5",
                hidden.length > 0 && "justify-between after:content-['']",
              )}
            >
              {visible.map((product) => (
                <ProductPill key={product.id} product={product} locked={productLocked(entitlements, product.id)} />
              ))}
              {hidden.length > 0 && (
                <OverflowMenu
                  products={hidden}
                  name={name}
                  entitlements={entitlements}
                  hasVisible={visible.length > 0}
                  onEditProducts={() => setEditOpen(true)}
                />
              )}
            </div>

            {/* Invisible copy of every pill plus one- and two-digit triggers, measured to decide the fit. */}
            <div aria-hidden className="pointer-events-none invisible absolute inset-0 overflow-hidden">
              <div ref={measureRef} className="flex w-max items-center">
                {products.map((product) => (
                  <span key={product.id} className={PILL_CLASS}>
                    <span className="size-4 shrink-0" />
                    <span className="whitespace-nowrap text-[13px]">{product.name}</span>
                  </span>
                ))}
                {["8 More", "88 More"].map((label) => (
                  <span key={label} className={MORE_CLASS}>
                    <span className="whitespace-nowrap tabular-nums">{label}</span>
                    <span className="size-3.5" />
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">No products yet.</span>
        )}
      </div>

      <ProjectActions
        project={project}
        name={name}
        organizationId={organizationId}
        editOpen={editOpen}
        onEditOpenChange={setEditOpen}
      />
    </div>
  );
}
