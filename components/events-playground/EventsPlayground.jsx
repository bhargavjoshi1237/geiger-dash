"use client";

import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@geiger/ui/sidebar";
import { AppSidebar } from "./sidebar/sidebar";
import { Topbar } from "./topbar/topbar";
import { workspaceNav } from "./sidebar/sidebar_nav";
import { EventsOverviewScreen } from "./screens/overview/events_overview";
import { ComingSoonScreen } from "./screens/coming_soon";

const DEFAULT_TAB = "Overview";

// Resolve a tab title to its nav entry (top-level or sub-item), like the shell.
function findNavItem(title) {
  for (const item of workspaceNav) {
    if (item.title === title) return item;
    const sub = item.subItems?.find((s) => s.title === title);
    if (sub) return sub;
  }
  return workspaceNav[0] || { title: DEFAULT_TAB };
}

// Live, embeddable copy of the Events workspace for the landing page. It mirrors
// the product shell but fills its container (h-full) instead of the viewport, and
// keeps navigation in component state so browsing the embed never touches the
// landing page's URL. The Overview runs in demo mode — no save, no load, no DB.
export function EventsPlayground() {
  const [currentTab, setCurrentTab] = useState(DEFAULT_TAB);
  const activeItem = useMemo(() => findNavItem(currentTab), [currentTab]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-surface-strong">
      <SidebarProvider
        className="!flex h-full min-w-0 flex-col"
        style={{ flexDirection: "column" }}
      >
        <Topbar onTabChange={setCurrentTab} />
        <div className="relative flex flex-1 overflow-hidden">
          <AppSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
          <SidebarInset className="relative flex h-full flex-1 flex-col overflow-hidden border-none bg-transparent">
            <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[500px] rounded-full bg-white/[0.02] blur-[120px]" />
            <main className="relative z-10 w-full min-w-0 flex-1 overflow-y-auto p-4 md:p-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {currentTab === DEFAULT_TAB ? (
                <EventsOverviewScreen demo />
              ) : (
                <ComingSoonScreen title={activeItem.title} />
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default EventsPlayground;
