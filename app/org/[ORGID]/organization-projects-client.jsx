"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  Copy,
  FolderKanban,
  FolderPlus,
  GitBranch,
  Images,
  LayoutGrid,
  List,
  Loader2,
  Lock,
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
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PRODUCT_APPS } from "@/lib/org/product-apps";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
  updateProjectAvatarAction,
} from "./actions";

const DEFAULT_SELECTED_PRODUCT_IDS = ["flow"];

// Per-project avatar fallback colors — full class strings so Tailwind's JIT keeps them.
const PROJECT_AVATAR_COLORS = [
  { bg: "bg-blue-500/15", border: "border-blue-500/25", text: "text-blue-400" },
  { bg: "bg-violet-500/15", border: "border-violet-500/25", text: "text-violet-400" },
  { bg: "bg-emerald-500/15", border: "border-emerald-500/25", text: "text-emerald-400" },
  { bg: "bg-orange-500/15", border: "border-orange-500/25", text: "text-orange-400" },
  { bg: "bg-pink-500/15", border: "border-pink-500/25", text: "text-pink-400" },
  { bg: "bg-cyan-500/15", border: "border-cyan-500/25", text: "text-cyan-400" },
  { bg: "bg-amber-500/15", border: "border-amber-500/25", text: "text-amber-400" },
  { bg: "bg-rose-500/15", border: "border-rose-500/25", text: "text-rose-400" },
];
function projectAvatarColor(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffff;
  return PROJECT_AVATAR_COLORS[h % PROJECT_AVATAR_COLORS.length];
}

// Entitlements (which products are unlocked by the org's plan) are provided once
// and read by the deep launch/create components without prop-threading.
export const EntitlementsContext = createContext(null);
function useEntitlements() {
  return useContext(EntitlementsContext);
}

// null unlockedProducts => everything unlocked (grandfathered / no plan).
function productLocked(entitlements, productId) {
  const unlocked = entitlements?.unlockedProducts;
  if (unlocked == null) return false;
  return !unlocked.includes(productId);
}

// Returns true when a product is already allocated to another project.
// Pass ownIds (the current project's products) to exempt them in the edit dialog.
function productUsedElsewhere(entitlements, productId, ownIds = []) {
  const used = entitlements?.usedProductIds;
  if (!used || !used.length) return false;
  if (ownIds.includes(productId)) return false;
  return used.includes(productId);
}

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

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function launchHref(product) {
  if (product.projectId) return `${product.href}/project/${product.projectId}`;
  return product.href;
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
  project_update_failed: "The project could not be updated.",
  project_delete_failed: "The project could not be deleted.",
  plan_product_locked: "One or more selected products aren't in your plan.",
  plan_limit_projects: "You've reached your plan's project limit. Upgrade to add more.",
};

// ---------------------------------------------------------------------------
// Create project — two-step dialog (details → products) with search + select-all.
// ---------------------------------------------------------------------------
export function CreateProjectDialog({ organizationId, trigger }) {
  const entitlements = useEntitlements();
  // Products selectable in this dialog: in the plan AND not used in another project.
  const selectableProducts = useMemo(
    () => PRODUCT_APPS.filter(
      (p) => !productLocked(entitlements, p.id) && !productUsedElsewhere(entitlements, p.id),
    ),
    [entitlements],
  );
  const defaultSelected = useMemo(
    () => DEFAULT_SELECTED_PRODUCT_IDS.filter(
      (id) => !productLocked(entitlements, id) && !productUsedElsewhere(entitlements, id),
    ),
    [entitlements],
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selected, setSelected] = useState(defaultSelected);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep(0);
    setTitle("");
    setProductSearch("");
    setSelected([...defaultSelected]);
    setSubmitting(false);
  }

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) reset();
  }

  function toggle(id) {
    if (productLocked(entitlements, id)) return;
    if (productUsedElsewhere(entitlements, id)) return;
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return PRODUCT_APPS;
    return PRODUCT_APPS.filter((p) => `${p.name} ${p.detail}`.toLowerCase().includes(q));
  }, [productSearch]);

  const allSelected = selectableProducts.length > 0 && selected.length === selectableProducts.length;

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
          onSubmit={(e) => {
            if (step === 0) { e.preventDefault(); setStep(1); return; }
            setSubmitting(true);
          }}
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
                    onClick={() => setSelected(allSelected ? [] : selectableProducts.map((p) => p.id))}
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </Button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {filteredProducts.map((product) => {
                    const meta = productMeta(product.id);
                    const Icon = meta.Icon;
                    const locked = productLocked(entitlements, product.id);
                    const usedElsewhere = !locked && productUsedElsewhere(entitlements, product.id);
                    const isBlocked = locked || usedElsewhere;
                    const isSelected = selected.includes(product.id);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => toggle(product.id)}
                        disabled={isBlocked}
                        aria-pressed={isSelected}
                        title={
                          locked
                            ? `${product.name} isn't in your plan`
                            : usedElsewhere
                              ? `${product.name} is already in another project`
                              : undefined
                        }
                        className={cn(
                          "group flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                          isBlocked
                            ? "cursor-not-allowed border-dashed border-border bg-surface-subtle opacity-60"
                            : isSelected
                              ? "border-primary/40 bg-surface-card ring-1 ring-primary/20"
                              : "border-border bg-surface-card/50 hover:border-border-strong hover:bg-surface-card",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                            isBlocked ? "border-border bg-surface-card" : meta.tile,
                          )}
                        >
                          {locked ? (
                            <Lock className="size-4 text-tertiary" />
                          ) : usedElsewhere ? (
                            <FolderKanban className="size-4 text-tertiary" />
                          ) : (
                            <Icon className={cn("size-4.5", meta.icon)} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">{product.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                            {locked
                              ? "Not in your plan"
                              : usedElsewhere
                                ? "Already in another project"
                                : product.detail}
                          </span>
                        </span>
                        {isBlocked ? (
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                            {locked ? (
                              <Lock className="size-3 text-tertiary" />
                            ) : (
                              <FolderKanban className="size-3 text-tertiary" />
                            )}
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
                            )}
                          >
                            {isSelected && <Check className="size-3" />}
                          </span>
                        )}
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
// Edit dialog — name + product selector, pre-filled from current state.
// Inner form is keyed by open state so it remounts fresh on each open.
// ---------------------------------------------------------------------------
function EditProjectForm({ project, name, organizationId, onClose }) {
  const entitlements = useEntitlements();
  // IDs of products already in THIS project — exempt from the "used elsewhere" check.
  const ownProductIds = useMemo(() => project.products.map((p) => p.id), [project.products]);
  // Products selectable in this dialog: in the plan AND (own OR not used in another project).
  const selectableProducts = useMemo(
    () => PRODUCT_APPS.filter(
      (p) =>
        !productLocked(entitlements, p.id) &&
        !productUsedElsewhere(entitlements, p.id, ownProductIds),
    ),
    [entitlements, ownProductIds],
  );

  const [title, setTitle] = useState(name || "");
  const [productSearch, setProductSearch] = useState("");
  const [selected, setSelected] = useState(() => project.products.map((p) => p.id));
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(project.avatarUrl || null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const [, startTransition] = useTransition();

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append("project_id", project.projectId || "");
    fd.append("organization_id", organizationId);
    fd.append("avatar", file);
    startTransition(async () => {
      const result = await updateProjectAvatarAction(fd);
      setAvatarUploading(false);
      if (result?.ok) {
        setAvatarPreview(result.url);
        toast.success("Avatar updated");
      } else {
        setAvatarPreview(project.avatarUrl || null);
        toast.error(result?.error || "Upload failed");
      }
    });
  }

  const avatarColor = projectAvatarColor(project.projectId || project.id);

  function toggle(id) {
    if (productLocked(entitlements, id)) return;
    if (productUsedElsewhere(entitlements, id, ownProductIds)) return;
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return PRODUCT_APPS;
    return PRODUCT_APPS.filter((p) => `${p.name} ${p.detail}`.toLowerCase().includes(q));
  }, [productSearch]);

  const allSelected = selectableProducts.length > 0 && selected.length === selectableProducts.length;

  return (
    <form
      action={updateProjectAction}
      onSubmit={() => setSubmitting(true)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <input type="hidden" name="organization_id" value={organizationId} />
      <input type="hidden" name="plan_id" value={project.planId || ""} />
      <input type="hidden" name="project_id" value={project.projectId || ""} />
      <input type="hidden" name="title" value={title} />
      {selected.map((id) => (
        <input key={id} type="hidden" name="products" value={id} />
      ))}

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Upload project avatar"
            className="group relative flex size-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border text-lg font-semibold transition-opacity hover:opacity-90"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                avatarPreview ? "bg-surface-subtle" : cn(avatarColor.bg),
              )}
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="" fill className="object-cover" unoptimized />
              ) : (
                <span className={cn("text-lg font-semibold", avatarColor.text)}>
                  {(title || name || "P")[0].toUpperCase()}
                </span>
              )}
            </span>
            {avatarUploading ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="size-4 animate-spin text-white" />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-4 text-white" />
              </span>
            )}
          </button>
          <div>
            <p className="text-sm font-medium text-foreground">Project avatar</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WebP · Max 2 MB</p>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Name */}
        <div className="space-y-2">
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
        </div>

        {/* Products */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Products</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelected(allSelected ? [] : selectableProducts.map((p) => p.id))}
            >
              {allSelected ? "Clear all" : "Select all"}
            </Button>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products"
              className="bg-surface-card pl-8"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {filteredProducts.map((product) => {
              const meta = productMeta(product.id);
              const Icon = meta.Icon;
              const locked = productLocked(entitlements, product.id);
              const usedElsewhere = !locked && productUsedElsewhere(entitlements, product.id, ownProductIds);
              const isBlocked = locked || usedElsewhere;
              const isSelected = selected.includes(product.id);
              return (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => toggle(product.id)}
                  disabled={isBlocked}
                  aria-pressed={isSelected}
                  title={
                    locked
                      ? `${product.name} isn't in your plan`
                      : usedElsewhere
                        ? `${product.name} is already in another project`
                        : undefined
                  }
                  className={cn(
                    "group flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                    isBlocked
                      ? "cursor-not-allowed border-dashed border-border bg-surface-subtle opacity-60"
                      : isSelected
                        ? "border-primary/40 bg-surface-card ring-1 ring-primary/20"
                        : "border-border bg-surface-card/50 hover:border-border-strong hover:bg-surface-card",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                      isBlocked ? "border-border bg-surface-card" : meta.tile,
                    )}
                  >
                    {locked ? (
                      <Lock className="size-4 text-tertiary" />
                    ) : usedElsewhere ? (
                      <FolderKanban className="size-4 text-tertiary" />
                    ) : (
                      <Icon className={cn("size-4.5", meta.icon)} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{product.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {locked
                        ? "Not in your plan"
                        : usedElsewhere
                          ? "Already in another project"
                          : product.detail}
                    </span>
                  </span>
                  {isBlocked ? (
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                      {locked ? (
                        <Lock className="size-3 text-tertiary" />
                      ) : (
                        <FolderKanban className="size-3 text-tertiary" />
                      )}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border-strong",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredProducts.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No products match &ldquo;{productSearch}&rdquo;.
              </p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-surface-subtle/40 px-6 py-4 sm:justify-between">
        <span className="text-xs text-muted-foreground">
          {selected.length} {selected.length === 1 ? "product" : "products"} selected
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || selected.length === 0}>
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function EditProjectDialog({ project, name, organizationId, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="geiger-flow-palette flex max-h-[88vh] max-w-2xl flex-col gap-0 overflow-hidden border-border bg-background p-0 text-foreground">
        <DialogHeader className="border-b border-border bg-surface-subtle/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <PenLine className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-base">Edit project</DialogTitle>
              <DialogDescription className="text-xs">
                Update the name and products for this project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
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
  const entitlements = useEntitlements();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const launchableProducts = project.products.filter(
    (p) => !productLocked(entitlements, p.id),
  );

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
        <DropdownMenuContent align="end" className="w-52">
          {launchableProducts.map((product) => {
            const { Icon } = productMeta(product.id);
            return (
              <DropdownMenuItem key={product.id} asChild>
                <Link href={launchHref(product)}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface-subtle">
                    <Icon className="size-3.5 text-muted-foreground" />
                  </span>
                  <span className="flex-1">{product.name}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            );
          })}
          {launchableProducts.length > 0 && <DropdownMenuSeparator />}
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
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <PenLine className="size-4" />
            Edit
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

function ProjectHeader({ project, name }) {
  const color = projectAvatarColor(project.projectId || project.id);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-sm font-semibold",
          project.avatarUrl ? "border-border bg-surface-subtle" : cn(color.bg, color.border, color.text),
        )}
      >
        {project.avatarUrl ? (
          <Image src={project.avatarUrl} alt="" fill className="object-cover" unoptimized />
        ) : (
          (name || "P")[0].toUpperCase()
        )}
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
        <p className="truncate text-xs text-muted-foreground">
          Added {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
}

// Grid card.
function ProjectCard({ project, name, organizationId }) {
  return (
    <div className="group flex items-start justify-between gap-2 rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-strong">
      <ProjectHeader project={project} name={name} />
      <ProjectActions project={project} name={name} organizationId={organizationId} />
    </div>
  );
}

// List row.
function ProjectRow({ project, name, organizationId }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-surface-hover/40">
      <div className="min-w-0 flex-1">
        <ProjectHeader project={project} name={name} />
      </div>
      <ProjectActions project={project} name={name} organizationId={organizationId} />
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

export function OrganizationProjectsClient({ organizationId, projects, notificationParams, entitlements = null }) {
  const router = useRouter();
  const notifiedRef = useRef(false);
  const [search, setSearch] = useState("");
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
    const { projectCreated, projectError, projectRenamed, projectDeleted, projectUpdated } = notificationParams;
    if (!projectCreated && !projectError && !projectRenamed && !projectDeleted && !projectUpdated) return;

    notifiedRef.current = true;
    if (projectCreated) toast.success("Project created.");
    else if (projectRenamed) toast.success("Project renamed.");
    else if (projectDeleted) toast.success("Project deleted.");
    else if (projectUpdated) toast.success("Project updated.");
    else if (projectError) toast.error(ERROR_MESSAGES[projectError] || projectError);
    router.replace(`/org/${organizationId}`, { scroll: false });
  }, [notificationParams, organizationId, router]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const name = (nameById.get(project.id) || "").toLowerCase();
      const productText = project.products.map((p) => p.name).join(" ").toLowerCase();
      const idText = `${project.projectId || ""} ${project.title || ""}`.toLowerCase();
      return !query || name.includes(query) || productText.includes(query) || idText.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "products") return b.products.length - a.products.length;
      if (sort === "name") return (nameById.get(a.id) || "").localeCompare(nameById.get(b.id) || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [projects, search, sort, nameById]);

  const hasFilters = !!search.trim();

  function clearFilters() {
    setSearch("");
  }

  if (!projects.length) {
    return (
      <EntitlementsContext.Provider value={entitlements}>
        <EmptyState organizationId={organizationId} />
      </EntitlementsContext.Provider>
    );
  }

  return (
    <EntitlementsContext.Provider value={entitlements}>
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 -mx-1 flex items-center gap-2 bg-background/95 px-1 py-2 backdrop-blur">
        <div className="relative w-[300px] shrink-0 mr-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-surface-card pl-9"
          />
        </div>

        <div className="flex h-9 items-center gap-0.5 rounded-md border border-border bg-surface-card p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            className={cn("size-7 hover:bg-surface-hover", viewMode === "grid" && "bg-surface-active text-foreground")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => setViewMode("list")}
            className={cn("size-7 hover:bg-surface-hover", viewMode === "list" && "bg-surface-active text-foreground")}
          >
            <List className="size-4" />
          </Button>
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
    </EntitlementsContext.Provider>
  );
}
