"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProjectAction } from "../actions";

export function DeleteProjectDialog({ project, name, organizationId, open, onOpenChange }) {
  const count = project.products.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="geiger-flow-palette max-w-md border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Delete {name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and unlinks its {count} {count === 1 ? "product" : "products"}. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form action={deleteProjectAction}>
          <input type="hidden" name="organization_id" value={organizationId} />
          <input type="hidden" name="organization_project_id" value={project.id} />
          <input type="hidden" name="project_id" value={project.projectId || ""} />
          <input type="hidden" name="plan_id" value={project.planId || ""} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              <Trash2 className="size-4" />
              Delete project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
