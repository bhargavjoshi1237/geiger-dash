-- Help comms routing and slas page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/routing-and-slas draft outline from
-- 20261024191800_help_comms_structure with the full Routing rules & SLAs guide. Comms isn't deployed yet, so the page
-- stays a draft. Left out: the SLA policy's Next response target, which the dialog says the inbox clock doesn't track.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/automation/routing_rules.jsx,
-- routing_rule_dialog.jsx, sla_policies.jsx, sla_policy_dialog.jsx, rule_fields.jsx, constants.js,
-- components/internal/screens/inbox/sla_timer.jsx, availability_toggle.jsx, lib/automation/events.js, tick.js,
-- supabase/migrations/20261021103040_adopt_routing_engine.sql, 20261021103039_adopt_business_hours_and_sla.sql,
-- 20261021105041_automation_engine.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Routing rules & SLAs',
    description = 'Decide who gets new conversations with routing rules, and set first response and resolution targets with SLA policies.'
where slug = 'comms/routing-and-slas' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/routing-and-slas' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-routing-rule',
      'Basics',
      'Creating a routing rule',
      $html$<p>A routing rule decides who a new conversation is assigned to. To create one, go to <strong>Automation → Routing Rules</strong> and choose <strong>New rule</strong>.</p><ul><li><strong>Rule name</strong>: required.</li><li><strong>Channel</strong>, <strong>Priority</strong> and <strong>Tags</strong>: which conversations the rule catches. Leave a group with nothing selected to match everything; with several selected, any one of them matches.</li><li><strong>Strategy</strong>: how it picks someone. It starts as Round robin.</li><li><strong>Team</strong> (for Round robin and Balanced): <strong>All available teammates</strong>, or one of the groups set up under <strong>Settings → Teammates</strong>. For Direct, pick the <strong>Teammate</strong> instead; it's required.</li><li><strong>Enabled</strong>: on by default. Disabled rules keep their place but are skipped.</li></ul><p>Choose <strong>Create rule</strong>. Creating and changing routing rules needs the <strong>Manage settings</strong> permission, which the Owner and Admin roles have. Without it, you can open rules to view them.</p>$html$,
      '[]',
      10
    ),
    (
      'how-routing-works',
      'Concepts',
      'How auto-assignment works',
      $html$<p>When a customer starts a conversation, live workflows run first. If the conversation is still unassigned after that, Comms checks the enabled routing rules from top to bottom. The first rule that matches it and has someone available assigns it. If a matching rule has nobody available, Comms moves on to the next rule. A conversation that's already assigned is left alone.</p><p>Offline teammates never get conversations from routing, and away teammates get them only while their office hours are open. Each teammate sets their own availability at the top of the inbox.</p><p>Messenger conversations are assigned as the first message arrives. Conversations from other channels are assigned on the automation engine's next scheduled run.</p>$html$,
      '[]',
      20
    ),
    (
      'strategies',
      'Reference',
      'Routing strategies',
      $html$<ul><li><strong>Round robin</strong>: rotates through the available teammates in the team, in turn.</li><li><strong>Balanced</strong>: gives the conversation to whoever has the fewest open conversations.</li><li><strong>Direct</strong>: always assigns to one teammate, skipped while they're offline, or away outside their hours.</li></ul><p>Routing rules only assign new conversations. To reassign later, for example when a teammate goes quiet, use a workflow; see <a href="/help/comms/workflows">Workflows</a>.</p>$html$,
      '[]',
      30
    ),
    (
      'managing-routing-rules',
      'Routing Rules',
      'Ordering and managing rules',
      $html$<p>Because the first match wins, order matters. Use the up and down arrows in the <strong>#</strong> column to move a rule. The arrows are disabled while a search or filter is on.</p><p>The list shows each rule's strategy, who it assigns to and whether it's enabled. The figures across the top count rules, round robin rules, teammates available now and teams with their own rule. Narrow the list by strategy or by <strong>Enabled</strong> and <strong>Disabled</strong>, or search it.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Disable</strong> (or <strong>Enable</strong>) and <strong>Delete</strong>. Deleting asks you to confirm first, and conversations already assigned keep their assignee.</p>$html$,
      '[]',
      40
    ),
    (
      'creating-an-sla-policy',
      'SLA Policies',
      'Creating an SLA policy',
      $html$<p>An SLA policy sets targets for answering and resolving conversations. To create one, go to <strong>Automation → SLA Policies</strong> and choose <strong>New policy</strong>.</p><ul><li><strong>Policy name</strong>: required.</li><li><strong>Channels</strong> and <strong>Priorities</strong>: which conversations it covers. Leave either empty to cover all of them.</li><li><strong>First response</strong>: the time to the first teammate reply.</li><li><strong>Resolution</strong>: the time until the conversation is closed.</li><li><strong>Business hours</strong>: 24/7 calendar time (the default), or one of your business-hours schedules, so only open hours count toward the targets.</li><li>Enabled: on by default.</li></ul><p>Set each target in minutes, hours or days. A policy needs at least a first response or a resolution target. Creating and changing SLA policies needs the <strong>Manage settings</strong> permission. Business-hours schedules are set under <strong>Settings → Business Hours</strong>; see <a href="/help/comms/settings">Settings</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'how-slas-apply',
      'Concepts',
      'How SLA policies apply',
      $html$<p>When a conversation starts, Comms gives it the first enabled policy, from the top of the list, that covers its channel and priority, and starts the clocks. A workflow's <strong>Apply SLA</strong> action can switch it to a different policy.</p><ul><li>The first response target is met by the first reply from a teammate.</li><li>Closing the conversation stops the clock. If the resolution time had already passed, the conversation counts as breached.</li><li>Snoozing pauses the clock, and the due times move back by the time it spent snoozed.</li><li>Assigning it to someone else, or reopening it, restarts the clock on its policy from that moment.</li></ul><p>A conversation's SLA state is <strong>On track</strong>, <strong>Approaching</strong> (less than 25% of the time left), <strong>Breached</strong> or <strong>Paused</strong>.</p>$html$,
      '[]',
      60
    ),
    (
      'managing-sla-policies',
      'SLA Policies',
      'Ordering and managing policies',
      $html$<p>Policies are checked top to bottom, so put the narrowest ones first. Use the up and down arrows in the <strong>#</strong> column to move a policy.</p><p>The list shows each policy's targets, business hours, how many open conversations it covers right now (and how many of those are breached) and whether it's enabled. The figures across the top count active policies and the open conversations that are on track, approaching and breached.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Disable</strong> (or <strong>Enable</strong>) and <strong>Delete</strong>. Deleting asks you to confirm first. Conversations already on its clock keep their due times, and new ones fall through to the next matching policy.</p>$html$,
      '[]',
      70
    ),
    (
      'sla-timer',
      'Inbox',
      'SLA timers in the inbox',
      $html$<p>When a conversation has an SLA policy, the top of its thread shows a timer for the next target: "First response in 2h", then "Resolution in 1d" once someone has replied. The timer turns amber when less than 25% of the time is left, and red with how long it's been overdue once the target passes. While the conversation is snoozed, it shows "SLA paused". Hover over the timer to see the policy's name and the exact due time.</p><p>Closed conversations and conversations no policy covers show no timer. The <strong>Reports → Analytics</strong> screen has an SLA section with compliance over time; see <a href="/help/comms/reports">Reports</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"Workflow","label":"Workflows","href":"/help/comms/workflows"},{"icon":"Settings","label":"Settings","href":"/help/comms/settings"},{"icon":"UserCog","label":"Teammates & roles","href":"/help/comms/teammates"},{"icon":"ChartColumn","label":"Reports","href":"/help/comms/reports"},{"icon":"Zap","label":"Macros","href":"/help/comms/macros"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/routing-and-slas' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Routing rules & SLAs',
    description = 'Route new conversations to the right teammates and set response-time targets.'
where slug = 'comms/routing-and-slas' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/routing-and-slas' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Routing rules</li><li>Round robin</li><li>SLA policies</li><li>SLA timers in the inbox</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/routing-and-slas' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
