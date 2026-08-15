"use client";

// Notice banner admin: the editor for the full-width strip above the topbar.
// One notice can be live at a time — switching one on switches the rest off —
// and when nothing is live the strip renders nothing at all.

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Info,
  Loader2,
  Megaphone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { noticeStatus } from "@/lib/notices/shared";
import {
  deleteNoticeAction,
  saveNoticeAction,
  setNoticeActiveAction,
} from "@/lib/notices/actions";

const EMPTY_DRAFT = {
  id: null,
  message: "",
  type: "warning",
  dismissible: true,
  linkText: "",
  linkHref: "",
  linkExternal: false,
  isActive: false,
  startsAt: "",
  endsAt: "",
};

// Same palette the shared <GlobalBanner /> uses, so the preview is honest.
const BANNER_THEMES = {
  warning: {
    icon: AlertCircle,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
  },
  info: {
    icon: Info,
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-200",
  },
};

const STATUS_BADGES = {
  live: { label: "Live", className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" },
  scheduled: { label: "Scheduled", className: "border-blue-500/20 bg-blue-500/10 text-blue-400" },
  expired: { label: "Expired", className: "border-amber-500/20 bg-amber-500/10 text-amber-500" },
  off: { label: "Off", className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400" },
};

// <input type="datetime-local"> speaks local wall-clock time; the column is a
// timestamptz. Convert at this boundary and nowhere else.
function toLocalInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatWhen(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function draftFromNotice(notice) {
  return {
    id: notice.id,
    message: notice.message,
    type: notice.type,
    dismissible: notice.dismissible,
    linkText: notice.linkText,
    linkHref: notice.linkHref,
    linkExternal: notice.linkExternal,
    isActive: notice.isActive,
    startsAt: toLocalInput(notice.startsAt),
    endsAt: toLocalInput(notice.endsAt),
  };
}

// A faithful, inert copy of the real strip.
function BannerPreview({ draft }) {
  const theme = BANNER_THEMES[draft.type] ?? BANNER_THEMES.warning;
  const Icon = theme.icon;
  const hasLink = Boolean(draft.linkText && draft.linkHref);

  return (
    <div
      className={cn(
        "relative flex h-9 w-full items-center justify-center overflow-hidden rounded-lg border px-4",
        theme.className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,currentColor_0_1px,transparent_1px_10px)] opacity-10" />
      <div className="relative flex min-w-0 items-center gap-2 text-[13px] font-medium">
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">
          {draft.message || "Your notice will read like this."}
        </span>
        {hasLink ? (
          <>
            <span className="opacity-40" aria-hidden="true">
              ·
            </span>
            <span className="font-semibold underline decoration-current underline-offset-4">
              {draft.linkText}
            </span>
          </>
        ) : null}
      </div>
      {draft.dismissible ? (
        <X className="absolute right-3 size-3.5 opacity-70" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export function NoticeManager({ notices }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));
  const editing = Boolean(draft.id);

  async function handleSave() {
    if (!draft.message.trim()) {
      toast.error("A notice needs a message.");
      return;
    }
    setSaving(true);
    const res = await saveNoticeAction({
      ...draft,
      startsAt: fromLocalInput(draft.startsAt),
      endsAt: fromLocalInput(draft.endsAt),
    });
    setSaving(false);

    if (res.ok) {
      toast.success(editing ? "Notice updated" : "Notice created");
      setDraft(res.notice ? draftFromNotice(res.notice) : EMPTY_DRAFT);
    } else {
      toast.error(res.error || "Couldn't save the notice.");
    }
  }

  async function handleToggle(notice, isActive) {
    setBusyId(notice.id);
    const res = await setNoticeActiveAction(notice.id, isActive);
    setBusyId(null);

    if (res.ok) {
      toast.success(isActive ? "Notice is live" : "Notice switched off");
      if (draft.id === notice.id) set("isActive")(isActive);
    } else {
      toast.error(res.error || "Couldn't update the notice.");
    }
  }

  async function handleDelete(notice) {
    setBusyId(notice.id);
    const res = await deleteNoticeAction(notice.id);
    setBusyId(null);

    if (res.ok) {
      toast.success("Notice deleted");
      if (draft.id === notice.id) setDraft(EMPTY_DRAFT);
    } else {
      toast.error(res.error || "Couldn't delete the notice.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
      <header className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Notice banner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The strip above the topbar — maintenance windows, incidents,
          announcements. Only one notice shows at a time, and the strip
          disappears entirely when none is live.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Editor */}
        <div className="space-y-4 rounded-xl border border-border bg-surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {editing ? "Edit notice" : "New notice"}
            </h2>
            {editing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDraft(EMPTY_DRAFT)}
              >
                <Plus className="h-3.5 w-3.5" />
                New notice
              </Button>
            ) : null}
          </div>

          <BannerPreview draft={draft} />

          <div className="space-y-2">
            <Label htmlFor="notice-message">Message</Label>
            <Textarea
              id="notice-message"
              rows={2}
              value={draft.message}
              onChange={(e) => set("message")(e.target.value)}
              placeholder="Scheduled maintenance on Sunday 02:00–04:00 UTC."
              className="resize-none bg-background"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notice-type">Style</Label>
              <Select value={draft.type} onValueChange={set("type")}>
                <SelectTrigger id="notice-type" className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning (amber)</SelectItem>
                  <SelectItem value="info">Info (blue)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <label className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 text-sm">
                <span className="text-text-secondary">Dismissible</span>
                <Switch
                  checked={draft.dismissible}
                  onCheckedChange={set("dismissible")}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notice-link-text">Link label</Label>
              <Input
                id="notice-link-text"
                value={draft.linkText}
                onChange={(e) => set("linkText")(e.target.value)}
                placeholder="See status"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-link-href">Link URL</Label>
              <Input
                id="notice-link-href"
                value={draft.linkHref}
                onChange={(e) => set("linkHref")(e.target.value)}
                placeholder="/changelog"
                className="bg-background"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
            <span className="text-text-secondary">Open link in a new tab</span>
            <Switch
              checked={draft.linkExternal}
              onCheckedChange={set("linkExternal")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notice-starts">Starts (optional)</Label>
              <Input
                id="notice-starts"
                type="datetime-local"
                value={draft.startsAt}
                onChange={(e) => set("startsAt")(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-ends">Ends (optional)</Label>
              <Input
                id="notice-ends"
                type="datetime-local"
                value={draft.endsAt}
                onChange={(e) => set("endsAt")(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave both empty to show the notice for as long as it&apos;s on. With
            an end time it takes itself down.
          </p>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Switch
                checked={draft.isActive}
                onCheckedChange={set("isActive")}
              />
              <span className="text-text-secondary">
                Show this notice{" "}
                <span className="text-muted-foreground">
                  (switches the others off)
                </span>
              </span>
            </label>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {editing ? "Save changes" : "Create notice"}
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
          <div className="border-b border-border px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notices
          </div>

          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Megaphone className="h-7 w-7 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No notices yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The banner stays hidden until one is live.
              </p>
            </div>
          ) : (
            <ul>
              {notices.map((notice) => {
                const status = noticeStatus(notice);
                const badge = STATUS_BADGES[status];
                const selected = draft.id === notice.id;

                return (
                  <li
                    key={notice.id}
                    className={cn(
                      "border-b border-border last:border-0",
                      selected && "bg-surface-hover/50",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setDraft(draftFromNotice(notice))}
                      className="w-full px-4 py-3 text-left transition-colors hover:bg-surface-hover/50"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                        <span className="line-clamp-2 text-sm text-foreground">
                          {notice.message}
                        </span>
                      </div>
                      {notice.startsAt || notice.endsAt ? (
                        <p
                          className="mt-1.5 text-xs text-muted-foreground"
                          suppressHydrationWarning
                        >
                          {formatWhen(notice.startsAt)} →{" "}
                          {formatWhen(notice.endsAt)}
                        </p>
                      ) : null}
                    </button>

                    <div className="flex items-center justify-between gap-2 px-4 pb-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                        <Switch
                          checked={notice.isActive}
                          disabled={busyId === notice.id}
                          onCheckedChange={(v) => handleToggle(notice, v)}
                        />
                        {notice.isActive ? "On" : "Off"}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notice)}
                        disabled={busyId === notice.id}
                        aria-label="Delete notice"
                        className="text-muted-foreground hover:text-red-500"
                      >
                        {busyId === notice.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
