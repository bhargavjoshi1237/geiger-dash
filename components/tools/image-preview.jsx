"use client";

import { FileImage, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/tools/image-tools";

export function ImagePreview({ source, onClear, children, overlay }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-active">
            <FileImage className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{source.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {source.width} x {source.height} px · {formatBytes(source.file.size)}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remove image"
          onClick={onClear}
        >
          <X />
        </Button>
      </div>
      <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-[linear-gradient(45deg,var(--surface-active)_25%,transparent_25%),linear-gradient(-45deg,var(--surface-active)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--surface-active)_75%),linear-gradient(-45deg,transparent_75%,var(--surface-active)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-5">
        <div className="relative max-h-[430px] max-w-full">
          {/* A native image is required for local blob URLs selected by the user. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={source.url}
            alt={`Preview of ${source.file.name}`}
            className="block max-h-[430px] max-w-full object-contain"
          />
          {overlay}
        </div>
      </div>
      {children}
    </div>
  );
}
