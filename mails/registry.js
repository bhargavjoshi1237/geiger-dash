// Template registry — the single source of truth for every email's metadata.
//
// This file is intentionally JSX-free so plain Node scripts (seeding,
// migrations) can import it. The matching React components are wired up by `key`
// in ./index.js, which is only imported from the Next.js runtime.
//
// Each entry describes:
//   key         - stable identifier, also the DB primary lookup (project-scoped)
//   project     - owning suite app
//   category    - grouping in the admin directory tree
//   subject     - default subject line ({{var}} interpolation supported)
//   content     - default editable text slots (admin-editable)
//   fields      - editor schema describing each slot in `content`
//   sampleData  - values used to render the admin preview
//   variables   - runtime variables the calling app must supply when sending

const text = (key, label) => ({ key, label, type: "text" });
const area = (key, label) => ({ key, label, type: "textarea" });

export const TEMPLATES = [
  // ---- Account -----------------------------------------------------------
  {
    key: "account.welcome",
    project: "geiger-flow",
    category: "Account",
    name: "Welcome / Confirm email",
    description: "Sent right after sign-up to confirm the address.",
    subject: "Confirm your email for Geiger Flow",
    content: {
      heading: "Welcome to Geiger Flow",
      intro:
        "Hi {{recipientName}}, thanks for signing up. Confirm your email address to activate your account and start collaborating.",
      cta_label: "Confirm email",
      outro: "If you didn't create this account, you can ignore this email.",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
      area("outro", "Footer note"),
    ],
    sampleData: {
      recipientName: "Alex",
      confirmUrl: "https://flow.geiger.studio/auth/confirm?token=demo",
    },
    variables: ["recipientName", "confirmUrl"],
  },
  {
    key: "account.password_reset",
    project: "geiger-flow",
    category: "Account",
    name: "Password reset",
    description: "Sent when a user requests a password reset.",
    subject: "Reset your Geiger Flow password",
    content: {
      heading: "Reset your password",
      intro:
        "Hi {{recipientName}}, we received a request to reset your password. Click below to choose a new one.",
      cta_label: "Reset password",
      expiry_note: "This link expires in {{expiresIn}}.",
      ignore_note:
        "If you didn't request this, you can safely ignore this email — your password won't change.",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
      text("expiry_note", "Expiry note"),
      area("ignore_note", "Ignore note"),
    ],
    sampleData: {
      recipientName: "Alex",
      resetUrl: "https://flow.geiger.studio/auth/reset?token=demo",
      expiresIn: "1 hour",
    },
    variables: ["recipientName", "resetUrl", "expiresIn"],
  },
  {
    key: "account.magic_link",
    project: "geiger-flow",
    category: "Account",
    name: "Magic link sign-in",
    description: "Passwordless sign-in link with a fallback code.",
    subject: "Your Geiger Flow sign-in link",
    content: {
      heading: "Sign in to Geiger Flow",
      intro:
        "Hi {{recipientName}}, use the button below to sign in. No password needed.",
      cta_label: "Sign in",
      code_note: "Or enter this one-time code:",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
      text("code_note", "Code note"),
    ],
    sampleData: {
      recipientName: "Alex",
      magicUrl: "https://flow.geiger.studio/auth/magic?token=demo",
      code: "481209",
      expiresIn: "10 minutes",
    },
    variables: ["recipientName", "magicUrl", "code", "expiresIn"],
  },

  // ---- Organization ------------------------------------------------------
  {
    key: "org.invite",
    project: "geiger-flow",
    category: "Organization",
    name: "Team invitation",
    description: "Invites a person to join an organization.",
    subject: "{{inviterName}} invited you to {{orgName}}",
    content: {
      heading: "You've been invited",
      intro:
        "{{inviterName}} invited you to join {{orgName}} on Geiger Flow. Accept the invitation to get started.",
      cta_label: "Accept invitation",
      role_note: "You'll join as {{role}}. This invite expires in 7 days.",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
      text("role_note", "Role note"),
    ],
    sampleData: {
      inviterName: "Jordan Lee",
      orgName: "Northwind Studio",
      role: "Member",
      acceptUrl: "https://flow.geiger.studio/invite/demo",
    },
    variables: ["inviterName", "orgName", "role", "acceptUrl"],
  },
  {
    key: "org.role_changed",
    project: "geiger-flow",
    category: "Organization",
    name: "Role changed",
    description: "Notifies a member their organization role changed.",
    subject: "Your role in {{orgName}} changed",
    content: {
      heading: "Your role was updated",
      intro:
        "Hi {{recipientName}}, your role in {{orgName}} has been updated.",
      outro: "If this looks wrong, contact an organization admin.",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      area("outro", "Footer note"),
    ],
    sampleData: {
      recipientName: "Alex",
      orgName: "Northwind Studio",
      oldRole: "Member",
      newRole: "Admin",
      changedBy: "Jordan Lee",
    },
    variables: ["recipientName", "orgName", "oldRole", "newRole", "changedBy"],
  },

  // ---- Issues ------------------------------------------------------------
  {
    key: "flow.issue_assigned",
    project: "geiger-flow",
    category: "Issues",
    name: "Issue assigned",
    description: "Sent when an issue is assigned to a user.",
    subject: "You were assigned: {{issueTitle}}",
    content: {
      heading: "New issue assigned to you",
      intro:
        "Hi {{recipientName}}, {{assignerName}} assigned you an issue in {{projectName}}.",
      cta_label: "View issue",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      issueTitle: "Login fails on Safari",
      assignerName: "Jordan Lee",
      priority: "High",
      dueDate: "Jun 30, 2026",
      projectName: "Web App",
      issueUrl: "https://flow.geiger.studio/issues/demo",
    },
    variables: [
      "recipientName",
      "issueTitle",
      "assignerName",
      "priority",
      "dueDate",
      "projectName",
      "issueUrl",
    ],
  },
  {
    key: "flow.issue_status_changed",
    project: "geiger-flow",
    category: "Issues",
    name: "Issue status changed",
    description: "Sent when an issue's status changes.",
    subject: "{{issueTitle}} is now {{newStatus}}",
    content: {
      heading: "Issue status updated",
      intro:
        "Hi {{recipientName}}, the status of an issue you're following changed.",
      cta_label: "View issue",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      issueTitle: "Login fails on Safari",
      oldStatus: "In progress",
      newStatus: "Resolved",
      changedBy: "Jordan Lee",
      projectName: "Web App",
      issueUrl: "https://flow.geiger.studio/issues/demo",
    },
    variables: [
      "recipientName",
      "issueTitle",
      "oldStatus",
      "newStatus",
      "changedBy",
      "projectName",
      "issueUrl",
    ],
  },
  {
    key: "flow.issue_comment",
    project: "geiger-flow",
    category: "Issues",
    name: "Issue comment / mention",
    description: "Sent when someone comments on or mentions you in an issue.",
    subject: "{{commenterName}} commented on {{issueTitle}}",
    content: {
      heading: "New comment on an issue",
      intro:
        "Hi {{recipientName}}, {{commenterName}} left a comment on {{issueTitle}}.",
      cta_label: "Reply in Geiger Flow",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      issueTitle: "Login fails on Safari",
      commenterName: "Jordan Lee",
      comment: "I can reproduce this on iOS too — bumping the priority.",
      projectName: "Web App",
      issueUrl: "https://flow.geiger.studio/issues/demo",
    },
    variables: [
      "recipientName",
      "issueTitle",
      "commenterName",
      "comment",
      "projectName",
      "issueUrl",
    ],
  },

  // ---- Tasks -------------------------------------------------------------
  {
    key: "flow.task_assigned",
    project: "geiger-flow",
    category: "Tasks",
    name: "Task assigned",
    description: "Sent when a task is assigned to a user.",
    subject: "New task: {{taskTitle}}",
    content: {
      heading: "New task assigned to you",
      intro:
        "Hi {{recipientName}}, {{assignerName}} assigned you a task in {{projectName}}.",
      cta_label: "View task",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      taskTitle: "Draft the Q3 launch checklist",
      assignerName: "Jordan Lee",
      priority: "Medium",
      dueDate: "Jul 3, 2026",
      projectName: "Marketing",
      taskUrl: "https://flow.geiger.studio/tasks/demo",
    },
    variables: [
      "recipientName",
      "taskTitle",
      "assignerName",
      "priority",
      "dueDate",
      "projectName",
      "taskUrl",
    ],
  },
  {
    key: "flow.task_due_reminder",
    project: "geiger-flow",
    category: "Tasks",
    name: "Task due reminder",
    description: "Reminds an assignee that a task is due soon.",
    subject: "Reminder: {{taskTitle}} is due {{dueDate}}",
    content: {
      heading: "A task is due soon",
      intro:
        "Hi {{recipientName}}, this is a reminder that a task assigned to you is due {{dueDate}}.",
      cta_label: "View task",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      taskTitle: "Draft the Q3 launch checklist",
      dueDate: "tomorrow",
      projectName: "Marketing",
      taskUrl: "https://flow.geiger.studio/tasks/demo",
    },
    variables: ["recipientName", "taskTitle", "dueDate", "projectName", "taskUrl"],
  },
  {
    key: "flow.task_completed",
    project: "geiger-flow",
    category: "Tasks",
    name: "Task completed",
    description: "Sent when a task is marked complete.",
    subject: "{{taskTitle}} was completed",
    content: {
      heading: "Task completed",
      intro:
        "Hi {{recipientName}}, {{completedBy}} marked a task complete in {{projectName}}.",
      cta_label: "View task",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
    ],
    sampleData: {
      recipientName: "Alex",
      taskTitle: "Draft the Q3 launch checklist",
      completedBy: "Jordan Lee",
      projectName: "Marketing",
      taskUrl: "https://flow.geiger.studio/tasks/demo",
    },
    variables: ["recipientName", "taskTitle", "completedBy", "projectName", "taskUrl"],
  },

  // ---- Projects ----------------------------------------------------------
  {
    key: "flow.project_added",
    project: "geiger-flow",
    category: "Projects",
    name: "Added to project",
    description: "Sent when a user is added to a project.",
    subject: "You were added to {{projectName}}",
    content: {
      heading: "You've been added to a project",
      intro:
        "Hi {{recipientName}}, {{addedBy}} added you to {{projectName}} on Geiger Flow.",
      cta_label: "Open project",
      outro: "You can manage your notifications from your account settings.",
    },
    fields: [
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Button label"),
      area("outro", "Footer note"),
    ],
    sampleData: {
      recipientName: "Alex",
      projectName: "Web App",
      addedBy: "Jordan Lee",
      role: "Editor",
      projectUrl: "https://flow.geiger.studio/projects/demo",
    },
    variables: ["recipientName", "projectName", "addedBy", "role", "projectUrl"],
  },
];

export function getTemplateMeta(key) {
  return TEMPLATES.find((t) => t.key === key) || null;
}
