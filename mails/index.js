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
import TicketPurchaseConfirmation from "./templates/geiger-events/ticket-purchase-confirmation.jsx";
import RentReminder from "./templates/geiger-property/rent-reminder.jsx";
import RentReceipt from "./templates/geiger-property/rent-receipt.jsx";
import LateNotice from "./templates/geiger-property/late-notice.jsx";
import LeaseExpiring from "./templates/geiger-property/lease-expiring.jsx";
import RenewalOffer from "./templates/geiger-property/renewal-offer.jsx";
import WorkOrderUpdate from "./templates/geiger-property/work-order-update.jsx";
import PropertyAnnouncement from "./templates/geiger-property/announcement.jsx";
import PropertyMessage from "./templates/geiger-property/message.jsx";
import PortalInvite from "./templates/geiger-property/portal-invite.jsx";
import OwnerStatement from "./templates/geiger-property/owner-statement.jsx";
import DocumentExpiring from "./templates/geiger-property/document-expiring.jsx";
import ScheduledReport from "./templates/geiger-property/scheduled-report.jsx";
import TextOnly from "./templates/geiger/text-only.jsx";
import BetaRequest from "./templates/geiger/beta-request.jsx";

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
  "events.ticket_purchase_confirmation": TicketPurchaseConfirmation,
  "property.rent_reminder": RentReminder,
  "property.rent_receipt": RentReceipt,
  "property.late_notice": LateNotice,
  "property.lease_expiring": LeaseExpiring,
  "property.renewal_offer": RenewalOffer,
  "property.work_order_update": WorkOrderUpdate,
  "property.announcement": PropertyAnnouncement,
  "property.message": PropertyMessage,
  "property.portal_invite": PortalInvite,
  "property.owner_statement": OwnerStatement,
  "property.document_expiring": DocumentExpiring,
  "property.scheduled_report": ScheduledReport,
  "geiger.text_only": TextOnly,
  "geiger.beta_request": BetaRequest,
};

export function getComponent(key) {
  return COMPONENTS[key] || null;
}
