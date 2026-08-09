"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, launchHref, productMeta, projectAvatarColor } from "./constants";
import { productLocked, useEntitlements } from "./entitlements";
import { ProjectActions } from "./project-actions";

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

// Quiet launch pill: dim monochrome at rest, warming to the product's accent on hover.
function ProductPill({ product, entitlements }) {
  const meta = productMeta(product.id);
  const Icon = meta.Icon;

  if (productLocked(entitlements, product.id)) {
    return (
      <span
        title={`${product.name} isn't in your plan`}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 opacity-45"
      >
        <Lock className="size-4 shrink-0 text-text-tertiary" />
        <span className="whitespace-nowrap text-[13px] text-text-secondary">{product.name}</span>
      </span>
    );
  }

  return (
    <Link
      href={launchHref(product)}
      className="group/row inline-flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-hover"
    >
      <Icon className={cn("size-4 shrink-0 text-text-tertiary transition-colors", meta.hover)} />
      <span className="whitespace-nowrap text-[13px] text-text-secondary transition-colors group-hover/row:text-foreground">
        {product.name}
      </span>
    </Link>
  );
}

export function ProjectRow({ project, name, organizationId }) {
  const entitlements = useEntitlements();
  const products = project.products || [];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-card px-3 py-3 transition-colors hover:border-border-strong sm:gap-4 sm:px-4">
      <div className="w-40 shrink-0 sm:w-56">
        <ProjectIdentity project={project} name={name} />
      </div>

      <div className="h-9 w-px shrink-0 bg-border" />

      <div className="relative min-w-0 flex-1">
        {products.length ? (
          <>
            <div className="flex items-center gap-0.5 overflow-x-auto pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <ProductPill key={product.id} product={product} entitlements={entitlements} />
              ))}
            </div>
            {/* Right-edge fade hints there's more to scroll. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface-card to-transparent" />
          </>
        ) : (
          <span className="text-xs text-muted-foreground">No products yet.</span>
        )}
      </div>

      <ProjectActions project={project} name={name} organizationId={organizationId} />
    </div>
  );
}
