"use client";

// The send log: an append-only view of every email the system has rendered and
// (attempted to) deliver.

import { ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  sent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  queued: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

function formatWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesTable({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-subtle/40 px-6 py-20 text-center">
        <ScrollText className="h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No emails sent yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sent and test emails will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Template</th>
              <th className="px-4 py-2.5 font-medium">To</th>
              <th className="px-4 py-2.5 font-medium">Subject</th>
              <th className="px-4 py-2.5 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr
                key={m.id}
                className="border-b border-border last:border-0 hover:bg-surface-hover/50"
              >
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[11px] font-medium capitalize",
                      STATUS_STYLE[m.status] || STATUS_STYLE.queued
                    )}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <code className="font-mono text-xs text-text-secondary">
                    {m.templateKey || "—"}
                  </code>
                </td>
                <td className="px-4 py-2.5 text-foreground">{m.to}</td>
                <td className="max-w-[280px] truncate px-4 py-2.5 text-muted-foreground">
                  {m.subject}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-2.5 text-muted-foreground"
                  suppressHydrationWarning
                >
                  {formatWhen(m.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
