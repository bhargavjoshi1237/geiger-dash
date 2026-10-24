-- Help comms project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/project-overview draft outline
-- from 20261024191800_help_comms_structure with the full guide to the Overview screen (header "Comms Overview").
-- Comms isn't deployed yet, so the page stays a draft. Left out: the demo dataset (demo_data.js, landing page only)
-- and the Overall Stats and Top Conversations buttons, which have no action.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/overview/comms_overview.jsx,
-- conversations_trend_widget.jsx, channel_mix_widget.jsx, lifecycle_funnel_widget.jsx, gauge_widget.jsx,
-- channel_scope_select.jsx, top_conversations_table.jsx, general_stats_card.jsx, data_helpers.js, constants.js,
-- lib/supabase/comms.js, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'The Overview screen sums up a project''s conversations: volume, unread and waiting counts, channel mix, resolution rate, backlog and what needs attention.'
where slug = 'comms/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the overview',
      $html$<p><strong>Overview</strong>, at the top of the sidebar, opens <strong>Comms Overview</strong>: a summary of every conversation in the project, across all channels. It always counts the project's whole history as it stands when the screen loads, and nothing on it changes the conversations.</p><p>Every role can see it: Overview is part of the Owner, Admin, Manager, Member and Viewer roles. For figures over a chosen date range, use <strong>Reports → Analytics</strong>; see <a href="/help/comms/reports">Reports</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'headline-figures',
      'Overview',
      'Headline figures',
      $html$<p>Beside the title, three counts show <strong>Conversations</strong> (all of them), <strong>Unread</strong> and <strong>Waiting on Us</strong>: open or snoozed conversations whose latest message is from the customer.</p><p>Under the title, four figures repeat them in more detail:</p><ul><li><strong>Conversations</strong>: the total, with the change in new conversations over the last 30 days compared with the 30 days before.</li><li><strong>Unread</strong>.</li><li><strong>Awaiting Reply</strong>: the same count as Waiting on Us.</li><li><strong>Resolved</strong>: conversations that are closed.</li></ul>$html$,
      '[]',
      20
    ),
    (
      'trend-and-channel-mix',
      'Overview',
      'Conversations over time and channel mix',
      $html$<p><strong>Conversations Over Time</strong> charts the last 12 weeks, one point per week starting on Monday. Switch it between <strong>New conversations</strong> (by the week they started) and <strong>Last activity</strong> (by the week of their latest message), and narrow it to some channels.</p><p><strong>Channel Mix</strong> shows how the conversations split across channels, such as Chat for the Messenger and Email.</p>$html$,
      '[]',
      30
    ),
    (
      'resolution-and-backlog',
      'Overview',
      'Support lifecycle, resolution and backlog',
      $html$<ul><li><strong>Support Lifecycle</strong>: conversations received (all of them), still active (open or snoozed) and resolved (closed).</li><li><strong>Resolution Rate</strong>: the share of all conversations that are closed.</li><li><strong>Response Backlog</strong>: the share of active conversations that are waiting on your team, because the customer wrote last.</li></ul><p>Both rates can be narrowed to some channels with their channel picker.</p>$html$,
      '[]',
      40
    ),
    (
      'what-needs-attention',
      'Overview',
      'What needs attention',
      $html$<p><strong>Top Conversations</strong> lists the five conversations that most need attention, with each one's status, last activity and priority. Sort it by <strong>Recent activity</strong> (the default) or <strong>Priority</strong>, and narrow it to some channels.</p><p><strong>Overall Stats</strong> counts the signals waiting on the team, grouped as Urgent, Soon and Routine:</p><ul><li>Urgent: <strong>Unread conversations</strong> and <strong>Awaiting our reply</strong>.</li><li>Soon: <strong>Urgent priority threads</strong> and <strong>Unassigned threads</strong>, among open and snoozed conversations.</li><li>Routine: <strong>Snoozed conversations</strong>.</li></ul><p>To act on them, go to the inbox; see <a href="/help/comms/inbox">Inbox</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ChartColumn","label":"Reports","href":"/help/comms/reports"},{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"Radio","label":"Channels","href":"/help/comms/channels"}]',
      60
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    description = 'The project''s dashboard: conversation volume, response load and resolutions across every channel.'
where slug = 'comms/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Headline figures</li><li>Conversation trend and channel mix</li><li>Resolution and backlog</li><li>What needs attention</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
