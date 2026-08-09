"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { ExpandableSearch } from "@geiger/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProjectAction } from "../actions";
import { CompactDialogHeader, PROJECT_DIALOG_CONTENT_CLASS, ProductPickerFooter } from "./dialog-parts";
import { ProductPickerEmpty, ProductToggleRow } from "./product-picker";
import { ProjectAvatarField } from "./project-avatar-field";
import { useProductPicker } from "./use-product-picker";

function EditProjectForm({ project, name, organizationId, onClose }) {
  // The project's own products are pre-selected and exempt from the "taken" check.
  const ownProductIds = useMemo(() => project.products.map((p) => p.id), [project.products]);

  const [title, setTitle] = useState(name || "");
  const [submitting, setSubmitting] = useState(false);
  const picker = useProductPicker({ initialSelected: ownProductIds, ownProductIds });

  return (
    <form action={updateProjectAction} onSubmit={() => setSubmitting(true)} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="organization_id" value={organizationId} />
      <input type="hidden" name="plan_id" value={project.planId || ""} />
      <input type="hidden" name="project_id" value={project.projectId || ""} />
      <input type="hidden" name="title" value={title} />
      {picker.selected.map((id) => (
        <input key={id} type="hidden" name="products" value={id} />
      ))}

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="flex items-center gap-4">
          <ProjectAvatarField
            project={project}
            organizationId={organizationId}
            fallbackLabel={(title || name || "P")[0].toUpperCase()}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor={`edit-title-${project.id}`} className="text-xs font-medium text-muted-foreground">
              Project name
            </Label>
            <Input
              id={`edit-title-${project.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Marketing"
              autoFocus
              className="bg-surface-card"
            />
            <p className="text-xs text-foreground/50">Click the avatar to upload a custom image.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex h-9 items-center justify-between gap-2">
            <Label className="text-xs font-medium text-muted-foreground">Products</Label>
            <ExpandableSearch
              value={picker.search}
              onChange={picker.setSearch}
              placeholder="Search products"
              label="Search products"
              className="-mr-1"
              inputClassName="focus-visible:border-input focus-visible:ring-0"
            />
          </div>
          <div className="-mx-1 space-y-1.5">
            {picker.filteredProducts.map((product) => (
              <ProductToggleRow
                key={product.id}
                product={product}
                state={picker.stateOf(product)}
                onToggle={() => picker.toggle(product.id)}
              />
            ))}
            {picker.filteredProducts.length === 0 && <ProductPickerEmpty query={picker.search} />}
          </div>
        </div>
      </div>

      <ProductPickerFooter count={picker.selected.length}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || picker.selected.length === 0}>
          {submitting ? "Saving…" : "Save Changes"}
        </Button>
      </ProductPickerFooter>
    </form>
  );
}

export function EditProjectDialog({ project, name, organizationId, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={PROJECT_DIALOG_CONTENT_CLASS}>
        <CompactDialogHeader icon={Pencil} title="Edit project" />
        {/* Keyed by open state so each open starts from the project's current values. */}
        <EditProjectForm
          key={open ? project.id : undefined}
          project={project}
          name={name}
          organizationId={organizationId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
