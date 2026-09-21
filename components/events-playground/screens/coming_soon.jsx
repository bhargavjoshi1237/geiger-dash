"use client";

import React from "react";
import { ArrowUpRight, Hammer } from "lucide-react";

import { MainScreenWrapper } from "../shared/screen_wrappers";
import { ScreenHeader } from "../shared/screen_kit";

// Stand-in for the nav items the landing embed doesn't carry. The full screen
// exists in the Events workspace; the playground ships the shell and Overview.
export function ComingSoonScreen({ title = "Screen", description }) {
  return (
    <MainScreenWrapper>
      <ScreenHeader
        title={title}
        description={
          description ||
          `${title} is part of the full Geiger Events workspace.`
        }
      />

      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-subtle text-muted-foreground">
          <Hammer className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-foreground">
            {title} lives in the workspace
          </p>
          <p className="mx-auto max-w-md text-sm text-text-secondary">
            This preview runs the Events shell and its live Overview. Open the
            workspace to use {title} with your own events and data.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-muted-foreground">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Open Geiger Events
        </span>
      </div>
    </MainScreenWrapper>
  );
}

export default ComingSoonScreen;
