"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Copy,
  ExternalLink,
  FolderKanban,
  FolderPlus,
  GitBranch,
  Images,
  LayoutGrid,
  List,
  Megaphone,
  MessageSquare,
  Mic,
  MoreHorizontal,
  NotebookPen,
  PenLine,
  PenTool,
  Plus,
  Radio,
  Rocket,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PRODUCT_APPS } from "@/lib/org/product-apps";
import {
  createProjectAction,
  deleteProjectAction,
  renameProjectAction,
} from "./actions";

const DEFAULT_SELECTED_PRODUCT_IDS = ["flow"];

// Per-product identity: a Lucide icon + a static colour accent (semantic /10 bg
// + /20 border + -400 text, per the craft guide's badge convention). Class
// strings are written out in full so Tailwind's JIT keeps them.
const PRODUCT_META = {
  campaign: { Icon: Megaphone, icon: "text-pink-400", tile: "bg-pink-500/10 border-pink-500/20" },
  flow: { Icon: GitBranch, icon: "text-blue-400", tile: "bg-blue-500/10 border-blue-500/20" },
  events: { Icon: CalendarDays, icon: "text-orange-400", tile: "bg-orange-500/10 border-orange-500/20" },
  assets: { Icon: Images, icon: "text-violet-400", tile: "bg-violet-500/10 border-violet-500/20" },
  comms: { Icon: Radio, icon: "text-cyan-400", tile: "bg-cyan-500/10 border-cyan-500/20" },
  forms: { Icon: ClipboardList, icon: "text-teal-400", tile: "bg-teal-500/10 border-teal-500/20" },
  grey: { Icon: Sparkles, icon: "text-indigo-400", tile: "bg-indigo-500/10 border-indigo-500/20" },
  office: { Icon: Building2, icon: "text-amber-400", tile: "bg-amber-500/10 border-amber-500/20" },
  docs: { Icon: BookOpen, icon: "text-sky-400", tile: "bg-sky-500/10 border-sky-500/20" },
  content: { Icon: PenLine, icon: "text-rose-400", tile: "bg-rose-500/10 border-rose-500/20" },
  pods: { Icon: Mic, icon: "text-purple-400", tile: "bg-purple-500/10 border-purple-500/20" },
  chat: { Icon: MessageSquare, icon: "text-green-400", tile: "bg-green-500/10 border-green-500/20" },
  notes: { Icon: NotebookPen, icon: "text-yellow-400", tile: "bg-yellow-500/10 border-yellow-500/20" },
  canvas: { Icon: PenTool, icon: "text-emerald-400", tile: "bg-emerald-500/10 border-emerald-500/20" },
};

function productMeta(id) {
  return PRODUCT_META[id] || { Icon: Boxes, icon: "text-muted-foreground", tile: "bg-surface-strong border-border" };
}

function shortId(value) {
  if (!value) return "No ID";
  return String(value).slice(0, 8);
}

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function launchHref(product) {
  if (product.projectId) return `${product.href}/project/${product.projectId}`;
  return product.href;
}

function projectStatus(project) {
  return project.products.length ? "active" : "empty";
}

const ERROR_MESSAGES = {
  missing_organization_id: "Organization ID is missing.",
  organization_not_found: "That organization could not be found.",
  forbidden: "You do not have access to manage projects for this organization.",
  invalid_products: "One or more selected products were invalid.",
  project_create_failed: "The project could not be created.",
  plan_create_failed: "The project plan could not be saved.",
  link_create_failed: "The organization link could not be saved.",
  project_rename_failed: "The project could not be renamed.",
  project_delete_failed: "The project could not be deleted.",
};

// ---------------------------------------------------------------------------
// Create project — two-step dialog (details → products) with search + select-all.
// ---------------------------------------------------------------------------
function CreateProjectDialog({ organizationId, trigger }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selected, setSelected] = useState(DEFAULT_SELECTED_PRODUCT_IDS);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep(0);
    setTitle("");
    setProductSearch("");
    setSelected([...DEFAULT_SELECTED_PRODUCT_IDS]);
    setSubmitting(false);
  }

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) reset();
  }

  function toggle(id) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return PRODUCT_APPS;
    return PRODUCT_APPS.filter((p) => `${p.name} ${p.detail}`.toLowerCase().includes(q));
  }, [productSearch]);

  const allSelected = selected.length === PRODUCT_APPS.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="geiger-flow-palette flex max-h-[88vh] max-w-2xl flex-col gap-0 overflow-hidden border-border bg-background p-0 text-foreground">
        <DialogHeader className="space-y-3 border-b border-border bg-surface-subtle/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <FolderPlus className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-base">New project</DialogTitle>
              <DialogDescription className="text-xs">
                {step === 0 ? "Name your project container." : "Pick the products to include."}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1].map((s) => (
              <span
                key={s}
                className={cn("h-1 flex-1 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-surface-strong")}
              />
            ))}
          </div>
        </DialogHeader>

        <form
          action={createProjectAction}
          onSubmit={() => setSubmitting(true)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <input type="hidden" name="organization_id" value={organizationId} />
          {/* Title lives outside the step-0 markup so it survives the step switch. */}
          <input type="hidden" name="title" value={title} />
          {selected.map((id) => (
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
                  <p className="text-xs text-tertiary">
                    Leave blank to auto-name it. You can rename it any time.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-card p-4">
                  <p className="text-xs font-medium text-foreground">What is a project?</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A project is a shared container that provisions a workspace in each product you
                    select, so your team works against the same context across the suite.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products"
                      className="bg-surface-card pl-8"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(allSelected ? [] : PRODUCT_APPS.map((p) => p.id))}
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </Button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {filteredProducts.map((product) => {
                    const meta = productMeta(product.id);
                    const Icon = meta.Icon;
                    const isSelected = selected.includes(product.id);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => toggle(product.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          "group flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                          isSelected
                            ? "border-primary/40 bg-surface-card ring-1 ring-primary/20"
                            : "border-border bg-surface-card/50 hover:border-border-strong hover:bg-surface-card",
                        )}
                      >
                        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border", meta.tile)}>
                          <Icon className={cn("size-4.5", meta.icon)} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">{product.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{product.detail}</span>
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </span>
                      </button>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                      No products match “{productSearch}”.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-surface-subtle/40 px-6 py-4 sm:justify-between">
            <span className="text-xs text-muted-foreground">
              {selected.length} {selected.length === 1 ? "product" : "products"} selected
            </span>
            <div className="flex items-center gap-2">
              {step === 0 ? (
                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              )}
              {step === 0 ? (
                <Button type="button" onClick={() => setStep(1)}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting || selected.length === 0}>
                  {submitting ? "Creating…" : "Create project"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// A single product, rendered as a launch tile.
// ---------------------------------------------------------------------------
function ProductTile({ product }) {
  const meta = productMeta(product.id);
  const Icon = meta.Icon;
  return (
    <Link
      href={launchHref(product)}
      aria-label={`Open ${product.name}`}
      className="group/tile flex items-center gap-2.5 rounded-lg border border-border bg-surface-card px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-surface-hover"
    >
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md border", meta.tile)}>
        <Icon className={cn("size-4", meta.icon)} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{product.detail}</span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-tertiary opacity-0 transition-opacity group-hover/tile:opacity-100" />
    </Link>
  );
}

function EmptyProducts() {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border bg-black/20 py-6 text-center">
      <Boxes className="size-5 text-tertiary" />
      <p className="text-xs text-muted-foreground">No products in this project</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rename / delete dialogs (real server actions).
// ---------------------------------------------------------------------------
function RenameProjectDialog({ project, name, organizationId, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="geiger-flow-palette max-w-md border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>Give this project a clearer name.</DialogDescription>
        </DialogHeader>
        <form action={renameProjectAction} className="space-y-4">
          <input type="hidden" name="organization_id" value={organizationId} />
          <input type="hidden" name="plan_id" value={project.planId || ""} />
          <input type="hidden" name="project_id" value={project.projectId || ""} />
          <div className="space-y-2">
            <Label htmlFor={`rename-${project.id}`} className="text-xs font-medium text-muted-foreground">
              Project name
            </Label>
            <Input
              id={`rename-${project.id}`}
              name="title"
              defaultValue={project.title || name}
              autoFocus
              required
              className="bg-surface-card"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!project.planId}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProjectDialog({ project, name, organizationId, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="geiger-flow-palette max-w-md border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Delete {name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and unlinks its {project.products.length}{" "}
            {project.products.length === 1 ? "product" : "products"}. This cannot be undone.
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

function ProjectActions({ project, name, organizationId }) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={() => {
              if (project.projectId) {
                void navigator.clipboard?.writeText(project.projectId);
                toast.success("Project ID copied");
              }
            }}
          >
            <Copy className="size-4" />
            Copy project ID
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            <PenLine className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameProjectDialog
        project={project}
        name={name}
        organizationId={organizationId}
        open={renameOpen}
        onOpenChange={setRenameOpen}
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

function ProjectHeader({ project, name }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <FolderKanban className="size-4.5" />
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] text-tertiary">
            {shortId(project.projectId)}
          </span>
          Added {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
}

// Grid card.
function ProjectCard({ project, name, organizationId }) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-strong">
      <div className="mb-4 flex items-start justify-between gap-2">
        <ProjectHeader project={project} name={name} />
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant={project.products.length ? "success" : "secondary"} className="text-[10px]">
            {project.products.length} {project.products.length === 1 ? "product" : "products"}
          </Badge>
          <ProjectActions project={project} name={name} organizationId={organizationId} />
        </div>
      </div>

      {project.products.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {project.products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyProducts />
      )}
    </div>
  );
}

// Compact list row (expand/collapse).
function ProjectRow({ project, name, organizationId }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ProjectHeader project={project} name={name} />
        </button>
        <Badge variant={project.products.length ? "success" : "secondary"} className="text-[10px]">
          {project.products.length}
        </Badge>
        <ProjectActions project={project} name={name} organizationId={organizationId} />
      </div>
      {open && (
        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
          {project.products.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {project.products.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ organizationId }) {
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

export function OrganizationProjectsClient({ organizationId, projects, notificationParams }) {
  const router = useRouter();
  const notifiedRef = useRef(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Stable display names independent of sort/filter order.
  const nameById = useMemo(() => {
    const map = new Map();
    projects.forEach((project, index) => {
      map.set(project.id, project.title?.trim() || project.name?.trim() || `Project ${index + 1}`);
    });
    return map;
  }, [projects]);

  useEffect(() => {
    if (notifiedRef.current || !notificationParams) return;
    const { projectCreated, projectError, projectRenamed, projectDeleted } = notificationParams;
    if (!projectCreated && !projectError && !projectRenamed && !projectDeleted) return;

    notifiedRef.current = true;
    if (projectCreated) toast.success("Project created.");
    else if (projectRenamed) toast.success("Project renamed.");
    else if (projectDeleted) toast.success("Project deleted.");
    else if (projectError) toast.error(ERROR_MESSAGES[projectError] || projectError);
    router.replace(`/org/${organizationId}`, { scroll: false });
  }, [notificationParams, organizationId, router]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const name = (nameById.get(project.id) || "").toLowerCase();
      const productText = project.products.map((p) => p.name).join(" ").toLowerCase();
      const idText = `${project.projectId || ""} ${project.title || ""}`.toLowerCase();
      const matchesSearch = !query || name.includes(query) || productText.includes(query) || idText.includes(query);
      const matchesStatus = statusFilter === "all" || projectStatus(project) === statusFilter;
      const matchesProduct = productFilter === "all" || project.products.some((p) => p.id === productFilter);
      return matchesSearch && matchesStatus && matchesProduct;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "products") return b.products.length - a.products.length;
      if (sort === "name") return (nameById.get(a.id) || "").localeCompare(nameById.get(b.id) || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [projects, search, sort, statusFilter, productFilter, nameById]);

  const hasFilters = search.trim() || statusFilter !== "all" || productFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setProductFilter("all");
  }

  if (!projects.length) {
    return <EmptyState organizationId={organizationId} />;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-surface-card pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger size="sm" className="w-[120px] bg-surface-card">
              <SlidersHorizontal className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="empty">Empty</SelectItem>
            </SelectContent>
          </Select>

          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger size="sm" className="w-[150px] bg-surface-card">
              <SelectValue placeholder="All products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {PRODUCT_APPS.map((product) => {
                const meta = productMeta(product.id);
                const Icon = meta.Icon;
                return (
                  <SelectItem key={product.id} value={product.id}>
                    <span className="flex items-center gap-2">
                      <Icon className={cn("size-4", meta.icon)} />
                      {product.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger size="sm" className="w-[140px] bg-surface-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="products">Most products</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-0.5 rounded-md border border-border bg-surface-card p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={cn("hover:bg-surface-hover", viewMode === "grid" && "bg-surface-active text-foreground")}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn("hover:bg-surface-hover", viewMode === "list" && "bg-surface-active text-foreground")}
            >
              <List className="size-3.5" />
            </Button>
          </div>

          <CreateProjectDialog
            organizationId={organizationId}
            trigger={
              <Button type="button" size="sm">
                <Plus className="size-4" />
                New project
              </Button>
            }
          />
        </div>
      </div>

      {/* Result meta */}
      <div className="flex items-center justify-between px-0.5 text-xs text-muted-foreground">
        <span>
          {visibleProjects.length} of {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {!visibleProjects.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-card py-14 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-black/20 text-muted-foreground">
            <Rocket className="size-6" />
          </span>
          <p className="text-sm font-medium text-foreground">No projects match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search or clear the filters.</p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              name={nameById.get(project.id)}
              organizationId={organizationId}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
          {visibleProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              name={nameById.get(project.id)}
              organizationId={organizationId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
