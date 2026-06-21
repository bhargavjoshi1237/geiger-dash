"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  Box,
  Check,
  ChevronDown,
  ExternalLink,
  FolderKanban,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PRODUCT_APPS } from "@/lib/org/product-apps";
import { createProjectAction } from "./actions";

const DEFAULT_SELECTED_PRODUCT_IDS = ["flow"];

function shortId(value) {
  if (!value) return "No project ID";
  return String(value).slice(0, 8);
}

function formatDate(value) {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function launchHref(product) {
  if (product.projectId) {
    return `${product.href}/project/${product.projectId}`;
  }

  return product.href;
}

function projectName(project, index) {
  return `Project ${index + 1}`;
}

function projectStatus(project) {
  return project.products.length ? "active" : "empty";
}

function sortProjects(projects, sort) {
  return [...projects].sort((a, b) => {
    if (sort === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }

    if (sort === "products") {
      return b.products.length - a.products.length;
    }

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

function ProjectCreateDialog({ organizationId, triggerLabel = "New project", triggerClassName = "h-9 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700" }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(DEFAULT_SELECTED_PRODUCT_IDS);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setTitle("");
      setSelectedProducts([...DEFAULT_SELECTED_PRODUCT_IDS]);
    }
  }

  function toggleProduct(productId) {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((selectedProductId) => selectedProductId !== productId)
        : [...current, productId],
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className={triggerClassName}>
          <Plus className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="geiger-flow-palette max-w-3xl border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg">Create project</DialogTitle>
          <DialogDescription className="text-sm">
            Create a project container for this organization and choose the products to include.
          </DialogDescription>
        </DialogHeader>

        <form action={createProjectAction} className="space-y-4" onSubmit={() => handleOpenChange(false)}>
          <input type="hidden" name="organization_id" value={organizationId} />

          <div className="grid gap-1.5">
            <Label htmlFor="project-title" className="text-sm font-medium">Project title (optional)</Label>
            <Input
              id="project-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter a custom name for this project"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Select products</Label>
            <div className="grid max-h-[50vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {PRODUCT_APPS.map((product) => {
                const isSelected = selectedProducts.includes(product.id);

                return (
                  <label
                    key={product.id}
                    className={cn(
                      "group flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-background p-2.5 transition hover:border-border-strong",
                      isSelected && "border-emerald-500/50 bg-emerald-500/5",
                    )}
                  >
                    <input
                      type="checkbox"
                      name="products"
                      value={product.id}
                      checked={isSelected}
                      onChange={() => toggleProduct(product.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-border bg-muted text-transparent transition",
                        isSelected && "border-emerald-600 bg-emerald-600 text-white",
                      )}
                    >
                      <Check className="size-3" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-foreground">{product.name}</span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{product.detail}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProjectProducts({ project }) {
  if (!project.products.length) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No purchased products were found in this project plan.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {project.products.map((product) => (
        <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Box className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted-foreground">{product.detail}</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link href={launchHref(product)} aria-label={`Launch ${product.name}`}>
              <ExternalLink className="size-4" />
              Launch
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ organizationId }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed bg-card py-16">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-muted">
          <FolderKanban className="size-6 text-muted-foreground" />
        </div>
        <h2 className="text-base font-semibold">No projects yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first project to organize and manage products for this organization.
        </p>
        <div className="mt-4">
          <ProjectCreateDialog
            organizationId={organizationId}
            triggerLabel="Create project"
            triggerClassName="h-9 bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700"
          />
        </div>
      </div>
    </div>
  );
}

const ERROR_MESSAGES = {
  missing_organization_id: 'Organization ID is missing.',
  organization_not_found: 'That organization could not be found.',
  forbidden: 'You do not have access to create projects for this organization.',
  invalid_products: 'One or more selected products were invalid.',
  project_create_failed: 'The project could not be created.',
  plan_create_failed: 'The project plan could not be saved.',
  link_create_failed: 'The organization link could not be saved.',
};

function ProjectCard({ project, index }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          className="group relative rounded-lg border border-border bg-card p-3 transition-colors hover:border-border-strong cursor-pointer"
        >
          {/* Project Header */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <FolderKanban className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium">{projectName(project, index)}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {shortId(project.projectId)} • Added {formatDate(project.createdAt)}
                </p>
              </div>
            </div>
            <Badge 
              variant={project.products.length ? "success" : "secondary"}
              className="shrink-0 text-[10px] font-medium"
            >
              {project.products.length} {project.products.length === 1 ? "product" : "products"}
            </Badge>
          </div>

          {/* Products List */}
          {project.products.length > 0 ? (
            <div className="space-y-1.5">
              {project.products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2 transition-colors hover:bg-muted"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Box className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs font-medium">{product.name}</span>
                  </div>
                  <Button 
                    asChild 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 shrink-0 px-2 text-xs hover:bg-muted-foreground/10"
                  >
                    <Link href={launchHref(product)} aria-label={`Launch ${product.name}`}>
                      <ExternalLink className="size-3" />
                      Launch
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-muted/30 py-4 text-center text-xs text-muted-foreground">
              No products
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48 rounded-lg border-border bg-surface-subtle p-1 text-foreground">
        <ContextMenuItem 
          onSelect={() => setEditDialogOpen(true)}
          className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit project
        </ContextMenuItem>
        <ContextMenuItem 
          onSelect={() => {
            toast.success('Project archived');
          }}
          className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Archive
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-surface-hover" />
        <ContextMenuItem 
          onSelect={() => setDeleteDialogOpen(true)}
          className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete project
        </ContextMenuItem>
      </ContextMenuContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="geiger-flow-palette max-w-lg border-border bg-surface-subtle text-foreground">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>Update the project details and manage products.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor={`project-title-${project.id}`}>Project title</Label>
              <Input
                id={`project-title-${project.id}`}
                defaultValue={project.title || projectName(project, index)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Project updated.');
              setEditDialogOpen(false);
            }}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="geiger-flow-palette max-w-md border-border bg-surface-subtle text-foreground">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will permanently remove {projectName(project, index)} and all its products. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              toast.success('Project deleted.');
              setDeleteDialogOpen(false);
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
}

export function OrganizationProjectsClient({ organizationId, projects, notificationParams }) {
  const router = useRouter();
  const notifiedRef = useRef(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (notifiedRef.current) return;

    if (notificationParams?.projectCreated) {
      notifiedRef.current = true;
      toast.success('Project created.');
      router.replace(`/org/${organizationId}`, { scroll: false });
    } else if (notificationParams?.projectError) {
      notifiedRef.current = true;
      const errorMessage = ERROR_MESSAGES[notificationParams.projectError] || notificationParams.projectError;
      toast.error(errorMessage);
      router.replace(`/org/${organizationId}`, { scroll: false });
    }
  }, [notificationParams, organizationId, router]);

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project, index) => {
      const query = search.trim().toLowerCase();
      const name = projectName(project, index).toLowerCase();
      const productText = project.products.map((product) => product.name).join(" ").toLowerCase();
      const idText = `${project.projectId || ""} ${project.planId || ""} ${project.title || ""}`.toLowerCase();
      const matchesSearch = !query || name.includes(query) || productText.includes(query) || idText.includes(query);
      const matchesStatus = statusFilter === "all" || projectStatus(project) === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return sortProjects(filtered, sort);
  }, [projects, search, sort, statusFilter]);

  if (!projects.length) {
    return <EmptyState organizationId={organizationId} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a project"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 bg-background pl-8 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 text-xs">
                <span className="capitalize">{statusFilter === "all" ? "All" : statusFilter}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="empty">Empty</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 text-xs">
                <ArrowDownUp className="size-3.5 text-muted-foreground" />
                {sort === "newest" ? "Newest" : sort === "oldest" ? "Oldest" : "Products"}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="products">Most products</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-7 w-7 p-0 hover:bg-background",
                viewMode === "grid" && "bg-background shadow-sm"
              )}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn(
                "h-7 w-7 p-0 hover:bg-background",
                viewMode === "list" && "bg-background shadow-sm"
              )}
            >
              <List className="size-3.5" />
            </Button>
          </div>

          <ProjectCreateDialog 
            organizationId={organizationId}
            triggerLabel="New project"
            triggerClassName="h-9 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
          />
        </div>
      </div>

      {!visibleProjects.length ? (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No projects match the current filters.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-1 rounded-lg border border-border bg-card overflow-hidden">
          {visibleProjects.map((project, index) => (
            <Accordion key={project.id} type="single" collapsible>
              <AccordionItem value={project.id} className="border-0">
                <AccordionTrigger className="px-3 py-2.5 hover:bg-muted hover:no-underline">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FolderKanban className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{projectName(project, index)}</span>
                        <Badge 
                          variant={project.products.length ? "success" : "secondary"}
                          className="shrink-0 text-[10px] font-medium"
                        >
                          {project.products.length}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {shortId(project.projectId)} • Added {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  {project.products.length > 0 ? (
                    <div className="space-y-1.5">
                      {project.products.map((product) => (
                        <div 
                          key={product.id} 
                          className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2 transition-colors hover:bg-muted"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Box className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate text-xs font-medium">{product.name}</span>
                          </div>
                          <Button 
                            asChild 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 shrink-0 px-2 text-xs hover:bg-muted-foreground/10"
                          >
                            <Link href={launchHref(product)} aria-label={`Launch ${product.name}`}>
                              <ExternalLink className="size-3" />
                              Launch
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed border-border bg-muted/30 py-4 text-center text-xs text-muted-foreground">
                      No products
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}
