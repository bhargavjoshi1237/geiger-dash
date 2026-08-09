import {
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  GitBranch,
  Images,
  Megaphone,
  MessageSquare,
  Mic,
  NotebookPen,
  PenLine,
  PenTool,
  Radio,
  Sparkles,
} from "lucide-react";

export const DEFAULT_SELECTED_PRODUCT_IDS = ["flow"];

// Full class strings so Tailwind's JIT keeps them.
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

export function projectAvatarColor(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffff;
  return PROJECT_AVATAR_COLORS[h % PROJECT_AVATAR_COLORS.length];
}

const PRODUCT_META = {
  campaign: { Icon: Megaphone, icon: "text-pink-400", tile: "bg-pink-500/10 border-pink-500/20", hover: "group-hover/row:text-pink-400" },
  flow: { Icon: GitBranch, icon: "text-blue-400", tile: "bg-blue-500/10 border-blue-500/20", hover: "group-hover/row:text-blue-400" },
  events: { Icon: CalendarDays, icon: "text-orange-400", tile: "bg-orange-500/10 border-orange-500/20", hover: "group-hover/row:text-orange-400" },
  assets: { Icon: Images, icon: "text-violet-400", tile: "bg-violet-500/10 border-violet-500/20", hover: "group-hover/row:text-violet-400" },
  comms: { Icon: Radio, icon: "text-cyan-400", tile: "bg-cyan-500/10 border-cyan-500/20", hover: "group-hover/row:text-cyan-400" },
  forms: { Icon: ClipboardList, icon: "text-teal-400", tile: "bg-teal-500/10 border-teal-500/20", hover: "group-hover/row:text-teal-400" },
  grey: { Icon: Sparkles, icon: "text-indigo-400", tile: "bg-indigo-500/10 border-indigo-500/20", hover: "group-hover/row:text-indigo-400" },
  office: { Icon: Building2, icon: "text-amber-400", tile: "bg-amber-500/10 border-amber-500/20", hover: "group-hover/row:text-amber-400" },
  docs: { Icon: BookOpen, icon: "text-sky-400", tile: "bg-sky-500/10 border-sky-500/20", hover: "group-hover/row:text-sky-400" },
  content: { Icon: PenLine, icon: "text-rose-400", tile: "bg-rose-500/10 border-rose-500/20", hover: "group-hover/row:text-rose-400" },
  pods: { Icon: Mic, icon: "text-purple-400", tile: "bg-purple-500/10 border-purple-500/20", hover: "group-hover/row:text-purple-400" },
  chat: { Icon: MessageSquare, icon: "text-green-400", tile: "bg-green-500/10 border-green-500/20", hover: "group-hover/row:text-green-400" },
  notes: { Icon: NotebookPen, icon: "text-yellow-400", tile: "bg-yellow-500/10 border-yellow-500/20", hover: "group-hover/row:text-yellow-400" },
  canvas: { Icon: PenTool, icon: "text-emerald-400", tile: "bg-emerald-500/10 border-emerald-500/20", hover: "group-hover/row:text-emerald-400" },
};

export function productMeta(id) {
  return (
    PRODUCT_META[id] || {
      Icon: Boxes,
      icon: "text-muted-foreground",
      tile: "bg-surface-strong border-border",
      hover: "group-hover/row:text-foreground",
    }
  );
}

export function formatDate(value) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function launchHref(product) {
  if (product.projectId) return `${product.href}/project/${product.projectId}`;
  return product.href;
}

export const ERROR_MESSAGES = {
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
