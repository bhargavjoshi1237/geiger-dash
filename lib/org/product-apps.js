export const PRODUCT_APPS = [
  {
    id: "campaign",
    name: "Campaign",
    detail: "Campaign planning and delivery",
    projectColumn: null,
    href: "/campaign",
  },
  {
    id: "flow",
    name: "Flow",
    detail: "Projects and delivery",
    // Geiger Flow resolves a project by public.projects.id (its tasks/issues and
    // RLS all key off that PK), so launch it with the project's id, not the
    // separate flow_project_id column.
    projectColumn: "id",
    href: "/flow",
  },
  {
    id: "events",
    name: "Events",
    detail: "Event operations and registration",
    projectColumn: "events_project_id",
    href: "/events",
  },
  {
    id: "assets",
    name: "Assets",
    detail: "Creative asset control",
    projectColumn: "dam_project_id",
    href: "/assets",
  },
  {
    id: "comms",
    name: "Comms",
    detail: "Broadcast communications",
    projectColumn: "comms_project_id",
    href: "/comms",
  },
  {
    id: "forms",
    name: "Forms",
    detail: "Intake and feedback",
    projectColumn: "forms_project_id",
    href: "/forms",
  },
  {
    id: "grey",
    name: "Grey",
    detail: "AI project assistant",
    projectColumn: "grey_project_id",
    href: "/grey",
  },
  {
    id: "office",
    name: "Office",
    detail: "Workspace operations",
    projectColumn: "office_project_id",
    href: "/office",
  },
  {
    id: "docs",
    name: "Docs",
    detail: "Published documentation",
    projectColumn: "docs_project_id",
    href: "/docs",
  },
  {
    id: "content",
    name: "Content",
    detail: "Publishing workflows",
    projectColumn: "content_project_id",
    href: "/content",
  },
  {
    id: "pods",
    name: "Pods",
    detail: "Audio publishing workflows",
    projectColumn: "pods_project_id",
    href: "/pods",
  },
  {
    id: "chat",
    name: "Chat",
    detail: "Project conversations",
    projectColumn: "chat_project_id",
    href: "/chat",
  },
  {
    id: "notes",
    name: "Notes",
    detail: "Docs and knowledge",
    // Geiger Notes resolves a project by public.projects.id — its project_boards
    // FK and RLS (can_access_project) both key off that PK — so launch it with
    // the project's id, not a separate notes_project_id column.
    projectColumn: "id",
    href: "/notes",
  },
  {
    id: "canvas",
    name: "Canvas",
    detail: "Visual collaboration",
    projectColumn: "canvas_project_id",
    href: "/canvas",
  },
]