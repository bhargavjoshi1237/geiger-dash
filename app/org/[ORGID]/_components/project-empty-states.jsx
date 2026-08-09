"use client";

import { FolderKanban, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "./create-project-dialog";

export function NoProjectsState({ organizationId }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-card py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <FolderKanban className="size-7" />
      </span>
      <h2 className="text-base font-semibold text-foreground">No projects yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first project to provision product workspaces and launch apps for this organization.
      </p>
      <div className="mt-5">
        <CreateProjectDialog
          organizationId={organizationId}
          trigger={
            <Button type="button">
              <Plus className="size-4" />
              Create project
            </Button>
          }
        />
      </div>
    </div>
  );
}

export function NoMatchesState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-card py-14 text-center">
      <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-black/20 text-muted-foreground">
        <Rocket className="size-6" />
      </span>
      <p className="text-sm font-medium text-foreground">No projects match your filters</p>
      <p className="mt-1 text-xs text-muted-foreground">Try a different search or clear the filters.</p>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
