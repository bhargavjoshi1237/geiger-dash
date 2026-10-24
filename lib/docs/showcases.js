// The size a full-app playground renders at before scaling down to the article column (a 16:10 laptop screen).
export const HELP_APP_VIEWPORT = { width: 1280, height: 800 };

// Live components a help section can embed, each streamed from its app's /<app>/playground/<component> route.
// `viewport` is the size the component renders at; the frame scales it to the column so it stays to scale.
// `floating` components (dialogs) render on a transparent page and sit straight on the painted backdrop, with no app window around them.
export const HELP_SHOWCASES = [
  { id: "flow/tasks", app: "Flow", label: "Tasks", src: "/flow/playground/tasks", viewport: { width: 1152, height: 740 } },
  { id: "flow/add-task", app: "Flow", label: "New task", src: "/flow/playground/add-task", viewport: { width: 800, height: 700 }, floating: true },
  { id: "flow/task-details", app: "Flow", label: "Task details", src: "/flow/playground/task-details", viewport: { width: 672, height: 760 } },
  { id: "flow/work-queue", app: "Flow", label: "Work Queue", src: "/flow/playground/work-queue", viewport: { width: 1152, height: 740 } },
];

export function getHelpShowcase(id) {
  return HELP_SHOWCASES.find((showcase) => showcase.id === id) || null;
}
