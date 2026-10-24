"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@geiger/ui";
import { HelpNavTree } from "@/components/help/help_nav_tree";

export function HelpMobileNav({ navigation, activeSlug }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open help navigation"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
      >
        <Menu className="size-4" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] gap-0 overflow-y-auto p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle>Help Center</SheetTitle>
            <SheetDescription className="sr-only">Browse help pages</SheetDescription>
          </SheetHeader>
          <div className="px-5 py-5">
            <HelpNavTree navigation={navigation} activeSlug={activeSlug} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
