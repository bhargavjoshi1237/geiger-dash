"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createProjectAction } from "../actions";
import { DEFAULT_SELECTED_PRODUCT_IDS } from "./constants";
import { PROJECT_DIALOG_CONTENT_CLASS, ProductPickerFooter, ProjectDialogHeader } from "./dialog-parts";
import { productLocked, productUsedElsewhere, useEntitlements } from "./entitlements";
import { ProductGridCard, ProductPickerEmpty, ProductSearchInput } from "./product-picker";
import { useProductPicker } from "./use-product-picker";

export function CreateProjectDialog({ organizationId, trigger }) {
  const entitlements = useEntitlements();
  const defaultSelected = useMemo(
    () =>
      DEFAULT_SELECTED_PRODUCT_IDS.filter(
        (id) => !productLocked(entitlements, id) && !productUsedElsewhere(entitlements, id),
      ),
    [entitlements],
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const picker = useProductPicker({ initialSelected: defaultSelected });

  function handleOpenChange(next) {
    setOpen(next);
    if (next) return;
    setStep(0);
    setTitle("");
    setSubmitting(false);
    picker.setSearch("");
    picker.setSelected([...defaultSelected]);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={PROJECT_DIALOG_CONTENT_CLASS}>
        <ProjectDialogHeader
          icon={FolderPlus}
          title="New project"
          description={step === 0 ? "Name your project container." : "Pick the products to include."}
          className="space-y-3"
        >
          <div className="flex items-center gap-1.5">
            {[0, 1].map((s) => (
              <span
                key={s}
                className={cn("h-1 flex-1 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-surface-strong")}
              />
            ))}
          </div>
        </ProjectDialogHeader>

        <form
          action={createProjectAction}
          onSubmit={(e) => {
            if (step === 0) {
              e.preventDefault();
              setStep(1);
              return;
            }
            setSubmitting(true);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <input type="hidden" name="organization_id" value={organizationId} />
          {/* Title lives outside the step-0 markup so it survives the step switch. */}
          <input type="hidden" name="title" value={title} />
          {picker.selected.map((id) => (
            <input key={id} type="hidden" name="products" value={id} />
          ))}

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {step === 0 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="project-title" className="text-xs font-medium text-muted-foreground">
                    Project name <span className="text-tertiary">optional</span>
                  </Label>
                  <Input
                    id="project-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Marketing"
                    autoFocus
                    className="bg-surface-card"
                  />
                  <p className="text-xs text-tertiary">Leave blank to auto-name it. You can rename it any time.</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-card p-4">
                  <p className="text-xs font-medium text-foreground">What is a project?</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A project is a shared container that provisions a workspace in each product you select, so your team
                    works against the same context across the suite.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ProductSearchInput value={picker.search} onChange={picker.setSearch} className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={picker.toggleAll}>
                    {picker.allSelected ? "Clear all" : "Select all"}
                  </Button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {picker.filteredProducts.map((product) => (
                    <ProductGridCard
                      key={product.id}
                      product={product}
                      state={picker.stateOf(product)}
                      onToggle={() => picker.toggle(product.id)}
                    />
                  ))}
                  {picker.filteredProducts.length === 0 && (
                    <ProductPickerEmpty query={picker.search} className="col-span-full" />
                  )}
                </div>
              </div>
            )}
          </div>

          <ProductPickerFooter count={picker.selected.length}>
            {step === 0 ? (
              <>
                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setStep(1)}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button type="submit" disabled={submitting || picker.selected.length === 0}>
                  {submitting ? "Creating…" : "Create project"}
                </Button>
              </>
            )}
          </ProductPickerFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
