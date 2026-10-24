-- Help comms macros page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/macros draft outline from
-- 20261024191800_help_comms_structure with the full Macros guide. Comms isn't deployed yet, so the page stays a draft.
-- Left out: the Uses column and Total uses figure, which nothing ever increments (macros.usage_count is never written).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/automation/macros.jsx, macro_dialog.jsx,
-- macro_detail.jsx, constants.js, components/internal/screens/inbox/composer.jsx, use_inbox_shell.js, constants.js,
-- lib/supabase/macros.js, supabase/migrations/20261021114846_automation_write_hardening.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Macros',
    description = 'Save replies your team sends often, fill them with the customer''s details, attach actions, and use them from the inbox composer.'
where slug = 'comms/macros' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/macros' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-macro',
      'Basics',
      'Creating a macro',
      $html$<p>A macro is a saved reply your team can drop into a conversation, optionally with actions such as assigning or closing it. To create one, go to <strong>Automation → Macros</strong> and choose <strong>New macro</strong>.</p><ul><li><strong>Name</strong>: required. It's how teammates find the macro, and <strong>Create macro</strong> stays disabled until there is one.</li><li><strong>Available to</strong>: <strong>Everyone</strong> (the default) or <strong>Only me</strong>.</li><li><strong>Reply</strong>: the text it inserts. Optional: a macro can be actions only.</li></ul><p>Choose <strong>Create macro</strong>. The macro opens in its editor, where you can add actions.</p>$html$,
      '[]',
      10
    ),
    (
      'who-can-use-macros',
      'Concepts',
      'Shared and personal macros',
      $html$<p>A macro available to <strong>Everyone</strong> shows up for every teammate in the project. One set to <strong>Only me</strong> is personal: only you see it and use it, and the inbox marks it with a lock icon.</p><p>Anyone can create and change their own personal macros. Sharing a macro with everyone, making a shared one private, and changing or deleting a shared macro need the <strong>Manage settings</strong> permission, which the Owner and Admin roles have. Without it, new macros are always <strong>Only me</strong>, and shared macros open read-only.</p>$html$,
      '[]',
      20
    ),
    (
      'variables',
      'Reference',
      'Variables',
      $html$<p>Variables fill in from the conversation when a teammate uses the macro. In the reply box, click a variable's name to insert it where your cursor is, or type it:</p><ul><li><code>{{contact.name}}</code>: <strong>Contact name</strong></li><li><code>{{contact.email}}</code>: <strong>Contact email</strong></li><li><code>{{contact.company}}</code>: <strong>Company</strong></li><li><code>{{contact.plan}}</code>: <strong>Plan</strong>, from the contact's plan attribute</li><li><code>{{teammate.name}}</code>: <strong>Your name</strong>, the teammate using the macro</li><li><code>{{conversation.subject}}</code>: <strong>Conversation subject</strong></li><li><code>{{ticket.title}}</code>: <strong>Ticket title</strong>, from the conversation's ticket</li></ul><p>When a value is missing, such as a customer with no company, the variable stays in the draft and Comms won't send the reply until you replace it.</p>$html$,
      '[]',
      30
    ),
    (
      'actions',
      'Reference',
      'Macro actions',
      $html$<p>Actions run when a teammate uses the macro, in the order you added them. In the macro's editor, go to <strong>Actions</strong> and choose <strong>Add action</strong>:</p><ul><li><strong>Assign to</strong>: a teammate.</li><li><strong>Add tag</strong> and <strong>Remove tag</strong>: one of the project's tags. These two can be added more than once.</li><li><strong>Set priority</strong>: Urgent, Normal or Low.</li><li><strong>Snooze</strong>: 1 hour, 3 hours, Tomorrow 9am or Next week.</li><li><strong>Close</strong> or <strong>Reopen</strong> the conversation.</li><li><strong>Set ticket state</strong>: moves the conversation's ticket to Submitted, In progress, Waiting or Resolved.</li></ul><p>Every action except the tag actions can be added once per macro. Remove one with the × on its row. A macro with no actions is <strong>Reply only</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'editing-a-macro',
      'Macros',
      'Editing a macro',
      $html$<p>Click a macro to open its editor. It has these sections:</p><ul><li><strong>Reply</strong>: the <strong>Name</strong> and <strong>Reply text</strong>, with a <strong>Preview</strong> that shows the variables filled with sample values.</li><li><strong>Actions</strong>: what else the macro does.</li><li><strong>Availability</strong>: <strong>Who can use it</strong>.</li><li><strong>Danger zone</strong>: <strong>Delete macro</strong>.</li></ul><p>Changes stay in the editor until you choose <strong>Save</strong>. Comms won't save a macro without a name, or with an action that isn't finished, such as Assign to with no teammate picked: it names the action to finish or remove.</p>$html$,
      '[]',
      50
    ),
    (
      'using-a-macro',
      'Inbox',
      'Using a macro in a conversation',
      $html$<p>In a conversation's composer, type <code>#</code> or choose <strong>Macro</strong>, then type to narrow the list and pick a macro. Its reply text goes into your draft with the variables filled in, and you can edit it before you send.</p><p>If the macro has actions, they show as <strong>On send</strong> chips under the draft and run once your reply or note is saved. Remove any you don't want with its ×. A macro with no reply text runs its actions as soon as you pick it.</p><p>Comms then confirms the macro was applied, or lists each action it couldn't apply: one that failed, one you don't have permission for (closing, snoozing and reopening need <strong>Close a conversation</strong>, and assigning needs <strong>Assign a conversation</strong>), or one whose teammate, tag or ticket no longer exists. See <a href="/help/comms/inbox">Inbox</a> for the composer.</p>$html$,
      '[]',
      60
    ),
    (
      'macro-list',
      'Macros',
      'The macro list',
      $html$<p><strong>Macros</strong> lists the macros you can use, with who each is available to, its actions and when it was last updated. Narrow it to <strong>Shared with everyone</strong> or <strong>Only mine</strong>, or search it.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong> (or <strong>View</strong> for a macro you can't change), <strong>Duplicate</strong>, <strong>Share with everyone</strong> or <strong>Make private</strong>, and <strong>Delete</strong>. A duplicate is named "(copy)". Deleting asks you to confirm first, and removes the macro for everyone. Replies already sent with it stay in their conversations.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"Workflow","label":"Workflows","href":"/help/comms/workflows"},{"icon":"Ticket","label":"Tickets","href":"/help/comms/tickets"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/macros' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Macros',
    description = 'Save canned replies, with optional actions, and use them from the inbox.'
where slug = 'comms/macros' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/macros' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a macro</li><li>Variables</li><li>Actions</li><li>Using a macro in a conversation</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/macros' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
