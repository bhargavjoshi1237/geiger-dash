-- Help comms reports page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/reports draft outline from
-- 20261024191800_help_comms_structure with the full Reports guide (Analytics and Quality & CSAT). Comms isn't deployed
-- yet, so the page stays a draft. Left out: QA scorecards (not built) and Custom Dashboards (a coming-soon screen).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/reports/analytics.jsx, quality_csat.jsx,
-- report_filters.jsx, report_section.jsx, conversations_report.jsx, responsiveness_report.jsx, sla_report.jsx,
-- csat_report.jsx, teammates_report.jsx, constants.js, lib/supabase/reports.js, components/widget/rating.jsx,
-- supabase/migrations/20261021104932_report_analytics.sql, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Reports',
    description = 'Report on conversation volume, response times, SLA hit rates, customer satisfaction and teammate performance for any date range.'
where slug = 'comms/reports' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/reports' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-reports',
      'Basics',
      'Opening reports',
      $html$<p>Under <strong>Reports</strong> in the sidebar, <strong>Analytics</strong> holds the prebuilt reports on conversations, responsiveness, SLAs, satisfaction and teammates, and <strong>Quality & CSAT</strong> holds the customer satisfaction report in full.</p><p>Reports is part of the Owner, Admin, Manager and Viewer roles. The Member role doesn't include it, so Reports doesn't show in a Member's sidebar.</p>$html$,
      '[]',
      10
    ),
    (
      'filters-and-date-ranges',
      'Reports',
      'Date ranges and filters',
      $html$<p>The toolbar at the top of both screens sets what every report on the screen covers:</p><ul><li>The date range: <strong>Last 7 days</strong>, <strong>Last 30 days</strong> (the default), <strong>Last 90 days</strong> or <strong>Custom range</strong>, which you pick on a calendar. Ranges are whole days and include today.</li><li>The channel: <strong>All channels</strong>, or one.</li><li>The team: <strong>All teams</strong>, or one of your teammate groups. This filter shows only when you have groups.</li><li>The teammate: <strong>All teammates</strong>, or one.</li></ul><p>Charts group the range per day, per week or per month, depending on how long it is. Tables with an <strong>Export CSV</strong> button download their rows, named with the dates they cover.</p>$html$,
      '[]',
      20
    ),
    (
      'conversations-report',
      'Analytics',
      'Conversations',
      $html$<p>The <strong>Conversations</strong> report shows volume in the range and the backlog as it stands now:</p><ul><li><strong>New</strong>: conversations started in the range.</li><li><strong>Closed</strong>: conversations closed in the range.</li><li><strong>Open</strong> and <strong>Snoozed</strong>: right now, whatever the range.</li></ul><p><strong>Volume over time</strong> charts new and closed conversations across the range, and <strong>By channel</strong> lists new and closed conversations per channel, with each channel's share.</p>$html$,
      '[]',
      30
    ),
    (
      'responsiveness-report',
      'Analytics',
      'Responsiveness',
      $html$<p>The <strong>Responsiveness</strong> report measures how fast your team answers and closes conversations:</p><ul><li><strong>Median first response</strong>: from the customer's first message to the first reply from your team, with the <strong>90th percentile</strong> beside it.</li><li><strong>Median time to close</strong>: from the start of the conversation to its close.</li><li><strong>Unanswered</strong>: conversations still waiting on a first reply.</li></ul><p><strong>Response trend</strong> charts either <strong>First response</strong> or <strong>Time to close</strong> across the range.</p>$html$,
      '[]',
      40
    ),
    (
      'sla-report',
      'Analytics',
      'SLA compliance',
      $html$<p>The SLA report grades the conversations that started in the range with an SLA policy, against the due times the policy set:</p><ul><li><strong>On an SLA</strong>: how many conversations had a policy.</li><li><strong>First response hit rate</strong> and <strong>Resolution hit rate</strong>: the share of targets met on time.</li><li><strong>Pending</strong>: targets that aren't due.</li></ul><p>A table breaks the figures down by policy, with each policy's status (Enabled, Disabled or Deleted) and its met, missed and pending counts. With no SLA policies, the report points you to <strong>Automation → SLA Policies</strong>; see <a href="/help/comms/routing-and-slas">Routing rules and SLAs</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'teammates-report',
      'Analytics',
      'Teammate performance',
      $html$<p><strong>Teammate performance</strong> lists each teammate, sorted by conversations closed:</p><ul><li><strong>Assigned</strong>: conversations started in the range that are theirs now.</li><li><strong>Closed</strong>: conversations they closed in the range while assigned to them.</li><li><strong>Replies</strong>, and <strong>Median first response</strong> for the conversations they answered first.</li><li><strong>CSAT</strong>: the average rating on their conversations.</li></ul><p>Use <strong>Export CSV</strong> to download the table.</p>$html$,
      '[]',
      60
    ),
    (
      'quality-and-csat',
      'Quality & CSAT',
      'Customer satisfaction',
      $html$<p>When a conversation is closed, the customer can rate it from one to five stars in the Messenger and add a comment. Those ratings feed the <strong>Customer satisfaction</strong> report, on both Analytics and <strong>Quality & CSAT</strong>:</p><ul><li><strong>CSAT score</strong>: the average rating out of 5.</li><li><strong>Positive</strong>: the share rated 4 or 5.</li><li><strong>Negative</strong>: the share rated 1 or 2.</li><li><strong>Ratings</strong>: how many were given in the range.</li></ul><p><strong>Rating distribution</strong> counts conversations per score, and <strong>CSAT over time</strong> charts the average across the range. <strong>Quality & CSAT</strong> adds <strong>Rated conversations</strong>: the most recent 50 ratings in the range, with each one's comment, teammate, contact and subject. Use <strong>Export CSV</strong> to download them.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Project overview","href":"/help/comms/project-overview"},{"icon":"Route","label":"Routing rules & SLAs","href":"/help/comms/routing-and-slas"},{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/reports' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Reports',
    description = 'Analytics on volume, responsiveness, SLAs, satisfaction and teammate performance.'
where slug = 'comms/reports' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/reports' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Analytics</li><li>Filters and date ranges</li><li>Quality & CSAT</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/reports' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
