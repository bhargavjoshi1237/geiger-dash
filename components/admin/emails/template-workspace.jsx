"use client";

// Master-detail for templates: a directory tree on the left, the preview/editor
// on the right. Mirrors geiger-flow's list+detail feel.

import { useState, useMemo } from "react";
import { MailX } from "lucide-react";
import { TemplateTree } from "./template-tree";
import { TemplateDetail } from "./template-detail";

export function TemplateWorkspace({ templates: initial }) {
  const [templates, setTemplates] = useState(initial);
  const [selectedKey, setSelectedKey] = useState(initial[0]?.key || null);

  const selected = useMemo(
    () => templates.find((t) => t.key === selectedKey) || null,
    [templates, selectedKey]
  );

  function handleSaved(key, patch) {
    setTemplates((prev) =>
      prev.map((t) => (t.key === key ? { ...t, ...patch } : t))
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-subtle/40 px-6 py-20 text-center">
        <MailX className="h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No templates yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Run the seed script to push the template library into the database:
        </p>
        <code className="mt-3 rounded-md bg-surface-active px-2.5 py-1.5 font-mono text-xs text-foreground">
          npm run email:seed
        </code>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-[300px]">
        <TemplateTree
          templates={templates}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
        />
      </aside>
      <section className="min-w-0 flex-1">
        {selected ? (
          <TemplateDetail
            key={selected.key}
            template={selected}
            onSaved={handleSaved}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a template to preview and edit.
          </p>
        )}
      </section>
    </div>
  );
}
