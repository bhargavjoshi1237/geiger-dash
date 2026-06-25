// Maps template keys to their React components.
//
// This pulls in JSX, so it is only safe to import from the Next.js runtime
// (admin preview action, send API) — never from plain Node scripts. Scripts use
// ./registry.js, which is JSX-free.

import Welcome from "./templates/geiger-flow/welcome.jsx";
import PasswordReset from "./templates/geiger-flow/password-reset.jsx";
import MagicLink from "./templates/geiger-flow/magic-link.jsx";
import OrgInvite from "./templates/geiger-flow/org-invite.jsx";
import RoleChanged from "./templates/geiger-flow/role-changed.jsx";
import IssueAssigned from "./templates/geiger-flow/issue-assigned.jsx";
import IssueStatusChanged from "./templates/geiger-flow/issue-status-changed.jsx";
import IssueComment from "./templates/geiger-flow/issue-comment.jsx";
import TaskAssigned from "./templates/geiger-flow/task-assigned.jsx";
import TaskDueReminder from "./templates/geiger-flow/task-due-reminder.jsx";
import TaskCompleted from "./templates/geiger-flow/task-completed.jsx";
import ProjectAdded from "./templates/geiger-flow/project-added.jsx";

export const COMPONENTS = {
  "account.welcome": Welcome,
  "account.password_reset": PasswordReset,
  "account.magic_link": MagicLink,
  "org.invite": OrgInvite,
  "org.role_changed": RoleChanged,
  "flow.issue_assigned": IssueAssigned,
  "flow.issue_status_changed": IssueStatusChanged,
  "flow.issue_comment": IssueComment,
  "flow.task_assigned": TaskAssigned,
  "flow.task_due_reminder": TaskDueReminder,
  "flow.task_completed": TaskCompleted,
  "flow.project_added": ProjectAdded,
};

export function getComponent(key) {
  return COMPONENTS[key] || null;
}
