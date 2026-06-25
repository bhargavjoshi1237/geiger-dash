"use client";

// Top-level shell for the email admin: a header and three sections — the
// template directory (master-detail), the send log, and cross-app API keys.

import { useState } from "react";
import { Mail, ScrollText, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateWorkspace } from "./template-workspace";
import { MessagesTable } from "./messages-table";
import { ApiKeysPanel } from "./api-keys-panel";

const SECTIONS = [
  { id: "templates", label: "Templates", icon: Mail },
  { id: "logs", label: "Send log", icon: ScrollText },
  { id: "keys", label: "API keys", icon: KeyRound },
];

export function EmailManager({ templates, messages, apiKeys }) {
  const [section, setSection] = useState("templates");

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
      <header className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Email Studio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The suite-wide home for transactional email — edit templates, preview
          them, send tests, and manage the keys other apps use to send.
        </p>
      </header>

      <nav className="mb-6 flex items-center gap-1 border-b border-border">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          const count =
            s.id === "templates"
              ? templates.length
              : s.id === "logs"
                ? messages.length
                : apiKeys.length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
              <span className="rounded-full bg-surface-active px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {section === "templates" && <TemplateWorkspace templates={templates} />}
      {section === "logs" && <MessagesTable messages={messages} />}
      {section === "keys" && <ApiKeysPanel apiKeys={apiKeys} />}
    </div>
  );
}
