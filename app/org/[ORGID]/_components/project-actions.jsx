"use client";

import { useState } from "react";
import { Copy, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";

export function ProjectActions({ project, name, organizationId }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function copyId() {
    if (!project.projectId) return;
    void navigator.clipboard?.writeText(project.projectId);
    toast.success("Project ID copied");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Project actions"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onSelect={copyId}>
            <Copy className="size-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <PenLine className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProjectDialog
        project={project}
        name={name}
        organizationId={organizationId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteProjectDialog
        project={project}
        name={name}
        organizationId={organizationId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
