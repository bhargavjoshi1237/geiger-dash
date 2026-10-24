// The size a full-app playground renders at before scaling down to the article column (a 16:10 laptop screen).
export const HELP_APP_VIEWPORT = { width: 1280, height: 800 };

// A whole screen of an app (its main area, without the sidebar and topbar).
const SCREEN_VIEWPORT = { width: 1152, height: 740 };

const flowScreen = (component, label) => ({
  id: `flow/${component}`,
  app: "Flow",
  label,
  src: `/flow/playground/${component}`,
  viewport: SCREEN_VIEWPORT,
});

// Live components a help section can embed, each streamed from its app's /<app>/playground/<component> route.
// `viewport` is the size the component renders at; the frame scales it to the column so it stays to scale.
// `floating` components (dialogs) render on a transparent page and sit straight on the painted backdrop, with no app window around them.
export const HELP_SHOWCASES = [
  flowScreen("tasks", "Tasks"),
  { id: "flow/add-task", app: "Flow", label: "New task", src: "/flow/playground/add-task", viewport: { width: 800, height: 700 }, floating: true },
  { id: "flow/task-details", app: "Flow", label: "Task details", src: "/flow/playground/task-details", viewport: { width: 672, height: 760 } },
  flowScreen("work-queue", "Work Queue"),
  flowScreen("overview", "Overview"),
  // The issue tracker, each held to one view without its sidebar.
  flowScreen("issues", "Issues"),
  flowScreen("issue-details", "Issue details"),
  flowScreen("issues-inbox", "Inbox"),
  flowScreen("issues-triage", "Triage"),
  flowScreen("issues-views", "Views"),
  flowScreen("issues-members", "Members"),
  flowScreen("issues-settings", "Tracker settings"),
  flowScreen("issues-cycles", "Cycles"),
  flowScreen("issues-divisions", "Divisions"),
  flowScreen("issues-initiatives", "Initiatives"),
  flowScreen("grounding", "Grounding"),
  flowScreen("planning", "Planning"),
  flowScreen("projections", "Projections"),
  flowScreen("milestones", "Milestones"),
  flowScreen("goals", "Goals"),
  flowScreen("objectives", "Objectives"),
  flowScreen("reporting", "Reporting"),
  flowScreen("assets", "Assets"),
  flowScreen("logs", "Logs"),
  flowScreen("team", "Team"),
  flowScreen("resource-allocation", "Resource Allocation"),
  flowScreen("vault", "Vault"),
  flowScreen("security", "Security"),
  flowScreen("settings-general", "General settings"),
  flowScreen("settings-navigation", "Navigation settings"),
  flowScreen("settings-add-ons", "Add-ons settings"),
  flowScreen("settings-usage", "Usage settings"),
  flowScreen("system-architecture", "System Architecture"),
  flowScreen("budget-tracker", "Budget Tracker"),
];

export function getHelpShowcase(id) {
  return HELP_SHOWCASES.find((showcase) => showcase.id === id) || null;
}
