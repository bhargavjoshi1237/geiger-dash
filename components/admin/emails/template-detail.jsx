"use client";

// Right pane: live preview (rendered server-side to HTML) + an inline editor for
// the subject and editable content slots, plus a send-test row.

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Send,
  Save,
  Loader2,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  previewTemplateAction,
  saveTemplateAction,
  sendTestEmailAction,
} from "@/lib/email/actions";

const STATUS_STYLE = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function TemplateDetail({ template, onSaved }) {
  const [tab, setTab] = useState("preview");
  const [subject, setSubject] = useState(template.subject);
  const [content, setContent] = useState({ ...template.content });
  const [html, setHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [sending, setSending] = useState(false);

  const dirty =
    subject !== template.subject ||
    JSON.stringify(content) !== JSON.stringify(template.content);

  async function refreshPreview() {
    setPreviewLoading(true);
    const res = await previewTemplateAction({
      key: template.key,
      subject,
      content,
    });
    if (res.ok) {
      setHtml(res.html);
    } else {
      toast.error(res.error || "Failed to render preview");
    }
    setPreviewLoading(false);
  }

  // Render once when a template is opened (the component remounts per key).
  useEffect(() => {
    void refreshPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.key]);

  async function handleSave() {
    setSaving(true);
    const res = await saveTemplateAction({ key: template.key, subject, content });
    setSaving(false);
    if (res.ok) {
      toast.success("Template saved");
      onSaved(template.key, { subject, content });
      void refreshPreview();
    } else {
      toast.error(res.error || "Failed to save");
    }
  }

  async function handleSendTest() {
    if (!testTo.trim()) {
      toast.error("Enter a recipient address");
      return;
    }
    setSending(true);
    const res = await sendTestEmailAction({ key: template.key, to: testTo.trim() });
    setSending(false);
    if (res.ok) {
      toast.success(`Test sent to ${testTo.trim()}`);
    } else {
      toast.error(res.error || "Failed to send test");
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface-card">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground">
              {template.name}
            </h2>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[11px] font-medium capitalize",
                STATUS_STYLE[template.status] || STATUS_STYLE.archived
              )}
            >
              {template.status}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <code className="rounded bg-surface-active px-1.5 py-0.5 font-mono">
              {template.key}
            </code>
            <span>·</span>
            <span>{template.category}</span>
          </div>
          {template.description ? (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {template.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          <TabButton
            active={tab === "preview"}
            onClick={() => {
              setTab("preview");
              if (dirty) void refreshPreview();
            }}
            icon={Eye}
            label="Preview"
          />
          <TabButton
            active={tab === "edit"}
            onClick={() => setTab("edit")}
            icon={Pencil}
            label="Edit"
          />
        </div>
      </div>

      {/* Body */}
      {tab === "preview" ? (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Subject:{" "}
              <span className="font-medium text-foreground">
                {subject || "—"}
              </span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPreview}
              disabled={previewLoading}
            >
              {previewLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            {previewLoading && !html ? (
              <div className="flex h-[560px] items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <iframe
                title="Email preview"
                srcDoc={html}
                sandbox=""
                className="h-[560px] w-full"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          <Field label="Subject line">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-border-strong"
            />
          </Field>

          {template.fields.map((field) => (
            <Field key={field.key} label={field.label}>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={content[field.key] ?? ""}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, [field.key]: e.target.value }))
                  }
                  className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-border-strong"
                />
              ) : (
                <input
                  value={content[field.key] ?? ""}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, [field.key]: e.target.value }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-border-strong"
                />
              )}
            </Field>
          ))}

          {template.variables.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Available variables — use as{" "}
                <code className="font-mono">{"{{name}}"}</code>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {template.variables.map((v) => (
                  <code
                    key={v}
                    className="rounded bg-surface-active px-1.5 py-0.5 font-mono text-[11px] text-text-secondary"
                  >
                    {v}
                  </code>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!dirty || saving} size="sm">
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      )}

      {/* Send test */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-subtle/40 p-4">
        <input
          type="email"
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="you@example.com"
          className="h-9 min-w-[220px] flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-border-strong"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSendTest}
          disabled={sending}
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Send test
        </Button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-surface-active text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}
