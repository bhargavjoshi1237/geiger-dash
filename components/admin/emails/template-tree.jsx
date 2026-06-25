"use client";

// The directory tree: Project → Category → Template, with search and
// collapsible groups. Selecting a leaf drives the detail pane.

import { useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_DOT = {
  active: "bg-emerald-500",
  draft: "bg-amber-500",
  archived: "bg-zinc-400",
};

// Build { project: { category: template[] } } from the flat list.
function groupTemplates(templates) {
  const tree = {};
  for (const t of templates) {
    tree[t.project] ??= {};
    tree[t.project][t.category] ??= [];
    tree[t.project][t.category].push(t);
  }
  return tree;
}

export function TemplateTree({ templates, selectedKey, onSelect }) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [templates, search]);

  const tree = useMemo(() => groupTemplates(filtered), [filtered]);

  function toggle(id) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface-card">
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates"
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border-strong"
          />
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-2">
        {Object.keys(tree).length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No matches
          </p>
        ) : (
          Object.entries(tree).map(([project, categories]) => {
            const projectCollapsed = collapsed.has(project);
            return (
              <div key={project} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggle(project)}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary hover:bg-surface-hover"
                >
                  {projectCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  {projectCollapsed ? (
                    <Folder className="h-3.5 w-3.5" />
                  ) : (
                    <FolderOpen className="h-3.5 w-3.5" />
                  )}
                  <span className="truncate">{project}</span>
                </button>

                {!projectCollapsed &&
                  Object.entries(categories).map(([category, items]) => {
                    const catId = `${project}::${category}`;
                    const catCollapsed = collapsed.has(catId);
                    return (
                      <div key={catId} className="ml-3">
                        <button
                          type="button"
                          onClick={() => toggle(catId)}
                          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        >
                          {catCollapsed ? (
                            <ChevronRight className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                          <span className="truncate">{category}</span>
                        </button>

                        {!catCollapsed && (
                          <ul className="ml-4 border-l border-border">
                            {items.map((t) => {
                              const active = t.key === selectedKey;
                              return (
                                <li key={t.key}>
                                  <button
                                    type="button"
                                    onClick={() => onSelect(t.key)}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                                      active
                                        ? "bg-surface-active font-medium text-foreground"
                                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                    )}
                                  >
                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{t.name}</span>
                                    <span
                                      className={cn(
                                        "ml-auto h-1.5 w-1.5 shrink-0 rounded-full",
                                        STATUS_DOT[t.status] || "bg-zinc-400"
                                      )}
                                    />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
