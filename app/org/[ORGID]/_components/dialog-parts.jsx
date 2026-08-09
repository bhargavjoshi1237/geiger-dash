"use client";

import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const PROJECT_DIALOG_CONTENT_CLASS =
  "geiger-flow-palette flex max-h-[88vh] max-w-2xl flex-col gap-0 overflow-hidden border-border bg-background p-0 text-foreground";

export function ProjectDialogHeader({ icon: Icon, title, description, className, children }) {
  return (
    <DialogHeader className={cn("border-b border-border bg-surface-subtle/40 px-6 py-5", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-xs">{description}</DialogDescription>
        </div>
      </div>
      {children}
    </DialogHeader>
  );
}

// Compact head section matching the Organization Settings dialog: plain muted icon + title on one line.
export function CompactDialogHeader({ icon: Icon, title, className, children }) {
  return (
    <DialogHeader className={cn("border-b border-border p-4", className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <DialogTitle className="text-base font-medium text-foreground">{title}</DialogTitle>
      </div>
      {children}
    </DialogHeader>
  );
}

export function ProductPickerFooter({ count, children }) {
  return (
    <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-surface-subtle/40 px-6 py-4 sm:justify-between">
      <span className="text-xs text-muted-foreground">
        {count} {count === 1 ? "product" : "products"} selected
      </span>
      <div className="flex items-center gap-2">{children}</div>
    </DialogFooter>
  );
}
