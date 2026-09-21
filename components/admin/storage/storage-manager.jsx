"use client";

// Top-level shell for the storage admin: a header and five sections — the pool
// overview, the providers in it, the virtual file browser, the placement rules,
// and the keys other apps upload with alongside the activity log.

import { useState } from "react";
import {
  LayoutDashboard,
  HardDrive,
  FolderTree,
  Route,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewPanel } from "./overview-panel";
import { ProvidersPanel } from "./providers-panel";
import { BrowserPanel } from "./browser-panel";
import { RulesPanel } from "./rules-panel";
import { KeysPanel } from "./keys-panel";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "providers", label: "Providers", icon: HardDrive },
  { id: "browser", label: "Browser", icon: FolderTree },
  { id: "rules", label: "Rules", icon: Route },
  { id: "keys", label: "Keys & activity", icon: KeyRound },
];

export function StorageManager({
  snapshot,
  rules,
  apiKeys,
  drivers,
  initialNodes,
  initialNamespaceId,
  secretKeyReady,
}) {
  const [section, setSection] = useState("overview");

  const counts = {
    overview: snapshot.totals.fileCount,
    providers: snapshot.providers.length,
    browser: snapshot.namespaces.length,
    rules: rules.length,
    keys: apiKeys.filter((key) => key.active).length,
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
      <header className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Storage Pool
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One pool across every storage provider in the suite. Files keep a
          stable path and link here; the bytes land wherever the pool has room.
        </p>
      </header>

      {!secretKeyReady && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              STORAGE_SECRET_KEY is not set
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Provider credentials are encrypted with it before they reach the
              database, so providers that need a secret can&apos;t be saved until
              it exists. Generate one with{" "}
              <code className="rounded bg-surface-active px-1 py-0.5 text-[12px]">
                node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;base64&apos;))&quot;
              </code>
              .
            </p>
          </div>
        </div>
      )}

      <nav className="mb-6 flex items-center gap-1 overflow-x-auto border-b border-border">
        {SECTIONS.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              <span className="rounded-full bg-surface-active px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </nav>

      {section === "overview" && (
        <OverviewPanel snapshot={snapshot} onJump={setSection} />
      )}
      {section === "providers" && (
        <ProvidersPanel
          providers={snapshot.providers}
          drivers={drivers}
          secretKeyReady={secretKeyReady}
        />
      )}
      {section === "browser" && (
        <BrowserPanel
          namespaces={snapshot.namespaces}
          providers={snapshot.providers}
          initialNodes={initialNodes}
          initialNamespaceId={initialNamespaceId}
        />
      )}
      {section === "rules" && (
        <RulesPanel rules={rules} providers={snapshot.providers} />
      )}
      {section === "keys" && (
        <KeysPanel
          apiKeys={apiKeys}
          namespaces={snapshot.namespaces}
          events={snapshot.events}
          providers={snapshot.providers}
        />
      )}
    </div>
  );
}
