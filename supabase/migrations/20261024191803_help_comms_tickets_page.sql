-- Help comms tickets page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/tickets draft outline from
-- 20261024191800_help_comms_structure with the full Tickets guide. Comms isn't deployed yet, so the page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/inbox/tickets.jsx, ticket_dialog.jsx,
-- ticket_detail.jsx, ticket_sections.jsx, constants.js, contact_panel.jsx, conversation_thread.jsx, use_inbox_shell.js,
-- lib/supabase/tickets.js, app/api/widget/tickets/route.js, lib/widget/data.js, components/internal/shared/pagination.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Tickets',
    description = 'Track the work behind customer requests as customer, back-office and tracker tickets, linked to the conversations they came from.'
where slug = 'comms/tickets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/tickets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-ticket',
      'Basics',
      'Creating a ticket',
      $html$<p>A ticket tracks work that outlives a single reply. To create one from a conversation, open the <strong>⋯</strong> menu at the top of the thread and choose <strong>Create ticket from thread</strong>, or choose <strong>Create ticket</strong> in the details panel. To create one on its own, choose <strong>Tickets</strong> under Inbox in the sidebar, then <strong>New ticket</strong>.</p><ul><li><strong>Type</strong>: Customer, Back-office or Tracker. New tickets are Customer.</li><li><strong>Title</strong>: required. <strong>Create</strong> stays disabled until there is one.</li><li><strong>Description</strong>: optional. You can fill it in later in the ticket's editor.</li></ul><p>Every new ticket starts as Submitted, with nobody assigned. A ticket created from a conversation is linked to it, and that conversation becomes its origin. A ticket created on the Tickets screen opens in its editor.</p>$html$,
      '[]',
      10
    ),
    (
      'types-and-states',
      'Concepts',
      'Ticket types and states',
      $html$<p>All tickets share one queue, and the type decides how each one behaves:</p><ul><li><strong>Customer</strong>: a customer's request. When it was created from the customer's conversation, the customer sees it, with its title, description and state, in the <strong>Tickets</strong> space of their Messenger.</li><li><strong>Back-office</strong>: internal work behind a request. Customers never see it.</li><li><strong>Tracker</strong>: one problem that many customers report. Link each of their conversations to the same tracker ticket. Customers never see it.</li></ul><p>A ticket's state is <strong>Submitted</strong>, <strong>In progress</strong>, <strong>Waiting</strong> or <strong>Resolved</strong>. Every state except Resolved counts as open. In the customer's Messenger, Waiting shows as "Waiting on you".</p>$html$,
      '[]',
      20
    ),
    (
      'ticket-list',
      'Tickets',
      'The ticket list',
      $html$<p>The figures across the top of the Tickets screen count every ticket in the project: <strong>Open</strong> (with the total), <strong>In progress</strong>, <strong>Resolved</strong> (with its share of the queue) and <strong>Avg age</strong>, the average age in days of the open tickets. Search and filters don't change them.</p><p>The list shows each ticket's title, type, state, assignee and when it was last updated, with the most recently updated first. Narrow it by type, state or assignee (<strong>Assigned to me</strong>, <strong>Unassigned</strong> or a teammate), or search titles, descriptions and assignee names. It shows 25 tickets a page; switch to 10, 50 or 100 at the bottom.</p><p>Clicking a customer or back-office ticket opens its conversation in <strong>All Conversations</strong>: the origin conversation, or the only linked one. Clicking a tracker ticket, or a ticket without a single conversation, opens the ticket's editor.</p>$html$,
      '[]',
      30
    ),
    (
      'editing-a-ticket',
      'Tickets',
      'Editing a ticket',
      $html$<p>To open a ticket's editor, choose <strong>Edit ticket</strong> in its row's <strong>⋯</strong> menu. The editor has four sections:</p><ul><li><strong>Overview</strong>: the ticket's state, assignee, origin conversation and creation date.</li><li><strong>Details</strong>: <strong>Title</strong>, <strong>Description</strong>, <strong>Type</strong>, <strong>State</strong> and <strong>Assignee</strong>.</li><li><strong>Conversations</strong>: the conversations linked to the ticket.</li><li><strong>Advanced</strong>: the <strong>Resolved</strong> switch and <strong>Delete ticket</strong>.</li></ul><p>Everything saves on its own, so there is no Save button. Title and description save shortly after you stop typing, and type, state and assignee save as soon as you pick them.</p>$html$,
      '[]',
      40
    ),
    (
      'linking-conversations',
      'Tickets',
      'Linking conversations',
      $html$<p>To link conversations to a ticket, open its editor, go to <strong>Conversations</strong> and choose <strong>Link conversation</strong>. Search by subject or message and pick a conversation. The dialog stays open, so you can link several in a row.</p><p>Each linked conversation shows its subject, customer and status. The external-link icon opens it in the inbox, and the unlink icon removes it from the ticket. Unlinking the origin conversation clears it, so a customer ticket no longer shows in that customer's Messenger.</p>$html$,
      '[]',
      50
    ),
    (
      'resolving-and-deleting',
      'Tickets',
      'Resolving, reopening and deleting',
      $html$<p>Each row's <strong>⋯</strong> menu has <strong>Edit ticket</strong>, <strong>Open conversation</strong> (when the ticket has an origin conversation), <strong>Mark resolved</strong> and <strong>Delete</strong>. On a resolved ticket, <strong>Reopen</strong> replaces Mark resolved and moves it back to In progress. The <strong>Resolved</strong> switch under <strong>Advanced</strong> in the editor does the same.</p><p><strong>Delete</strong>, in the row menu or as <strong>Delete ticket</strong> in the editor, asks you to confirm first. Deleting removes the ticket from the queue, and linked conversations keep their history.</p><p>A macro can set the state of the open conversation's ticket, and workflows can start when a ticket is created or changes state; see <a href="/help/comms/macros">Macros</a> and <a href="/help/comms/workflows">Workflows</a>.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"},{"icon":"Workflow","label":"Workflows","href":"/help/comms/workflows"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/tickets' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Tickets',
    description = 'Track customer, back-office and tracker tickets in one queue.'
where slug = 'comms/tickets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/tickets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a ticket</li><li>Ticket types and states</li><li>The ticket list</li><li>Ticket details</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/tickets' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
