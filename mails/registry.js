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

  // ---- Geiger Events ------------------------------------------------------
  {
    key: "events.ticket_purchase_confirmation",
    project: "geiger-events",
    category: "Tickets",
    name: "Ticket purchase confirmation",
    description:
      "Full receipt sent to the buyer once a paid ticket order completes — entry pass, order summary and pre-event notes.",
    subject: "Your tickets for {{eventName}}",
    content: {
      eyebrow: "Order confirmed",
      heading: "You're in, {{buyerName}}.\nYour tickets are yours.",
      intro:
        "Payment for {{eventName}} has gone through and your tickets are issued. Bring the QR code below — on your phone or printed — and we'll scan you in at the door.",
      cta_label: "View my tickets",
      calendar_cta_label: "Add to calendar",
      details_label: "Event details",
      pass_heading: "Your entry pass",
      pass_note:
        "One scan admits every guest on this order. Each ticket also carries its own code inside Geiger Events if you're arriving separately.",
      summary_label: "Order summary",
      notes_label: "Before you go",
      checkin_note:
        "Arrive from doors open with photo ID matching the name on the order. Queues are shortest in the first half hour.",
      guest_note:
        "Assign spare tickets to your guests so they receive their own pass — up to 24 hours before doors.",
      changes_note:
        "Refunds follow the organiser's policy. Tickets remain transferable after the refund window closes.",
      travel_note:
        "Check the venue page for parking, transit and accessible entry before you set off.",
      outro:
        "Need to change something on this order? Reply to this email — a human answers.",
      legal_note:
        "This confirmation was sent to {{buyerEmail}} because a ticket was purchased on Geiger Events. Transactional receipts are always delivered.",
      address:
        "© Geiger Studio · A suite of tools for teams to plan, create, and collaborate.",
    },
    fields: [
      text("eyebrow", "Eyebrow (above the headline)"),
      area("heading", "Headline (one line per row)"),
      area("intro", "Intro paragraph"),
      text("cta_label", "Primary button label"),
      text("calendar_cta_label", "Secondary button label"),
      text("details_label", "Event details heading"),
      text("pass_heading", "Entry pass heading"),
      area("pass_note", "Entry pass note"),
      text("summary_label", "Order summary heading"),
      text("notes_label", "Pre-event notes heading"),
      area("checkin_note", "Note — Check-in"),
      area("guest_note", "Note — Guest ticket"),
      area("changes_note", "Note — Changes"),
      area("travel_note", "Note — Getting there"),
      area("outro", "Closing note"),
      area("legal_note", "Footer legal note"),
      text("address", "Footer address / note"),
    ],
    sampleData: {
      buyerName: "Alex Mercer",
      buyerEmail: "alex@example.com",
      eventName: "Founders Summer Mixer",
      eventDate: "Thursday 24 September 2026",
      eventTime: "Doors 9:00 AM · Programme 10:00 AM – 6:00 PM (PDT)",
      venueName: "Pier 27, The Embarcadero",
      venueAddress: "San Francisco, CA 94111",
      directionsUrl: "https://events.geiger.studio/venue/demo",
      orderId: "GE-48192",
      paidOn: "1 Aug 2026",
      ticketType: "General Admission",
      seatNote: "Seats unassigned",
      quantity: "2",
      unitPrice: "349.00",
      subtotal: "698.00",
      serviceFee: "21.00",
      tax: "61.35",
      orderTotal: "780.35",
      paymentNote: "Visa ending 4242 · charged 1 Aug 2026",
      eventUrl: "https://events.geiger.studio/e/demo",
      ticketsUrl: "https://events.geiger.studio/tickets/demo",
      calendarUrl: "https://events.geiger.studio/tickets/demo/calendar",
      receiptUrl: "https://events.geiger.studio/orders/demo/receipt",
      transferUrl: "https://events.geiger.studio/orders/demo/transfer",
      qrUrl:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=GE-48192",
    },
    variables: [
      "buyerName",
      "buyerEmail",
      "eventName",
      "eventDate",
      "eventTime",
      "venueName",
      "venueAddress",
      "directionsUrl",
      "orderId",
      "paidOn",
      "ticketType",
      "seatNote",
      "quantity",
      "unitPrice",
      "subtotal",
      "serviceFee",
      "tax",
      "orderTotal",
      "paymentNote",
      "eventUrl",
      "ticketsUrl",
      "calendarUrl",
      "receiptUrl",
      "transferUrl",
      "qrUrl",
    ],
  },

  // ---- Suite / General ---------------------------------------------------
  {
    key: "geiger.text_only",
    project: "geiger",
    category: "General",
    name: "Text-only notice",
    description:
      "Plain, image-light layout for concise product notes, receipts, and account updates. Ported from React Email's Barebones / text-only template.",
    subject: "A quick note from Geiger Studio",
    content: {
      eyebrow: "Product Note",
      heading: "A quick note from Geiger Studio",
      intro:
        "Hi {{recipientName}}, this is the text-only layout — no hero image and no big call-to-action. Use it for concise product notes, receipts, and account updates where the message stays front and center.",
      body:
        "Keep paragraphs short and easy to scan on mobile. Every word of this email is editable from the Geiger Studio admin — change the copy here without touching code.",
      cta_label: "Open your dashboard",
      signoff: "Thanks,\nThe Geiger Studio Team",
      slogan: "Built to manage. Designed to create.",
      address: "Geiger Studio · A suite of tools for teams to plan, create, and collaborate.",
    },
    fields: [
      text("eyebrow", "Eyebrow (top-right label)"),
      text("heading", "Heading"),
      area("intro", "Intro paragraph"),
      area("body", "Second paragraph"),
      text("cta_label", "Link label"),
      area("signoff", "Sign-off"),
      text("slogan", "Footer slogan"),
      area("address", "Footer address / note"),
    ],
    sampleData: {
      recipientName: "Alex",
      ctaUrl: "https://geiger.studio",
    },
    variables: ["recipientName", "ctaUrl"],
  },
];

export function getTemplateMeta(key) {
  return TEMPLATES.find((t) => t.key === key) || null;
}
