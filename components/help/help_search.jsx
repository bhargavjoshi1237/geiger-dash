"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Hash, Search } from "lucide-react";
import { CommandPalette, Kbd, useCommandShortcut, useModifierKeyLabel } from "@geiger/ui";
import { getHelpSearchEntriesAction } from "@/app/help/actions";

// Sidebar links stand in as search entries until the full index (sections + snippets) loads.
function navigationEntries(navigation) {
  return navigation.flatMap((group) =>
    group.links
      .flatMap((link) => [link, ...link.children])
      .map((link) => ({ id: link.slug, title: link.label, group: group.title, href: link.href, kind: "page" })),
  );
}

export function HelpSearch({ navigation }) {
  const router = useRouter();
  const modifierKey = useModifierKeyLabel();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState(null);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  useCommandShortcut(toggle);

  useEffect(() => {
    if (!open || entries) return undefined;
    let alive = true;
    getHelpSearchEntriesAction()
      .then((result) => {
        if (alive && result?.length) setEntries(result);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open, entries]);

  const items = useMemo(
    () =>
      (entries || navigationEntries(navigation)).map((entry) => ({
        ...entry,
        icon: entry.kind === "section" ? Hash : FileText,
      })),
    [entries, navigation],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group hidden h-8 w-full max-w-[430px] items-center gap-2 rounded-md border border-border bg-surface-card px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-border-strong hover:bg-surface-active lg:flex"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search help...</span>
        <Kbd className="border border-border bg-surface-subtle px-1.5 text-[11px] text-muted-foreground transition-colors group-hover:bg-surface-hover group-hover:text-foreground">
          {modifierKey} K
        </Kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search help"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
      >
        <Search className="size-4" />
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        onSelect={(item) => router.push(item.href)}
        placeholder="Search the help center..."
        rootGroupLabel="Help Center"
        recentsKey="geiger:help:recents"
        emptyHint="Try a different word, or ask AI."
      />
    </>
  );
}
