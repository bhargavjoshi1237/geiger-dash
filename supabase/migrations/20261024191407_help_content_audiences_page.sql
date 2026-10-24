-- Help content audiences page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/audiences draft outline with
-- the full Audiences guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/audiences/*, lib/supabase/{profiles,
-- segments,events,consent,data_connections}.js, app/api/content/v1/collect/route.js, app/api/consent/route.js,
-- lib/delivery/server.js, app/api/decide/route.js, supabase/migrations/20261001081041_project_scoped_rls.sql).
-- Left out: changing consent from the Consent State screen (its save posts to /api/consent without the /content prefix,
-- so it fails in production; the page points to Governance's Consent & Privacy, which works), and any syncing by data
-- connections (they're records with a status you set by hand, which the page says).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Audiences',
    description = 'Know who reads your content: create and merge profiles, set traits, see the events each visitor sends, and group people into segments.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/audiences' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/audiences' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-profile',
      'Basics',
      'Creating a profile',
      $html$<p>A profile is one person your project knows about. To create one, choose <strong>Audiences → Profiles</strong> in the sidebar, then <strong>Create profile</strong>, type the person's <strong>Primary identifier</strong>, such as a user id or an email address, and choose <strong>Create profile</strong>. The identifier is the only field, and it's required.</p><p>Each row shows the profile's identifier, how many aliases it has, the date it was created, its first three aliases, and when it was last active. The figures across the top count <strong>Total profiles</strong>, <strong>Anonymous</strong> ones (with a single alias), <strong>Merged</strong> ones and those <strong>New this week</strong>. Search matches any identifier.</p><p>To remove a profile, choose <strong>Delete</strong> in its <strong>⋯</strong> menu and confirm. Its traits and consent records go with it. Changing profiles needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-audiences-fit',
      'Concepts',
      'Profiles, aliases, events and consent',
      $html$<ul><li>A <strong>profile</strong> is a person, known by one or more identifiers, called <strong>aliases</strong>: a browser's anonymous id, a user id, an email address. A profile with a single alias counts as an anonymous visitor.</li><li><strong>Merging</strong> joins an anonymous profile into a known one, for example after the visitor signs in on your site.</li><li><strong>Events</strong> are things a visitor did, like viewing a page, sent to Content by your website or app. Each event carries the visitor's anonymous id, user id or both.</li><li><strong>Traits</strong> are facts you store on a profile, like its plan.</li><li><strong>Segments</strong> group profiles by their traits and event counts.</li><li><strong>Consent</strong> is recorded per profile and purpose. Only an explicit Denied holds a purpose back: with analytics denied, Content drops that visitor's events, and with personalization denied, slots show them only variants without targeting rules.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'anonymous-visitors',
      'Anonymous Visitors',
      'Anonymous visitors',
      $html$<p><strong>Audiences → Anonymous Visitors</strong> lists the profiles that have only one alias, with when each was first seen and last active. The figures across the top count <strong>Anonymous visitors</strong> (with their share of all profiles), <strong>Known profiles</strong> and those <strong>New this week</strong>. Search by anonymous id.</p><p>When you learn who a visitor is, choose <strong>Resolve into known…</strong> in their <strong>⋯</strong> menu, type the <strong>Known identifier</strong> and choose <strong>Merge profiles</strong>. Content joins the two: the known profile gets every alias, the traits it lacks and the visitor's events, and the anonymous profile is removed. Content creates the known profile if it doesn't exist yet.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'merging-profiles',
      'Identity Resolution',
      'Merging profiles',
      $html$<p>To merge an anonymous visitor into a known profile, choose <strong>Audiences → Identity Resolution</strong> and fill in both fields of the <strong>Merge tool</strong>: the <strong>Anonymous identifier</strong> and the <strong>Known identifier</strong>. <strong>Preview</strong> shows each side as Found or New, with its aliases and traits. <strong>Merge profiles</strong> does the merge:</p><ul><li>The known profile gets every alias of both.</li><li>Traits the known profile doesn't have are copied from the anonymous one. Where both have a trait, the known value stays.</li><li>The anonymous visitor's events are attributed to the known identifier.</li><li>The anonymous profile is removed.</li></ul><p>Either profile is created first if it doesn't exist. Both identifiers are required and must differ. The list shows each resolved identity with its merged aliases, and the figures across the top count <strong>Resolved identities</strong> (with their share of all profiles), <strong>Pending anonymous</strong> profiles and <strong>Total profiles</strong>. Merging needs the Manage settings permission.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'traits',
      'Traits',
      'Setting traits',
      $html$<p>Traits are key and value pairs on a profile, like a plan or a lifecycle stage, that segments can match on. Choose <strong>Audiences → Traits</strong>, pick the profile from the menu, then choose <strong>Set trait</strong>:</p><ul><li><strong>Key</strong>: required, like <code>plan</code>. It can't be changed once the trait exists.</li><li><strong>Value (JSON or plain text)</strong>: <code>"pro"</code>, <code>42</code>, <code>true</code> and <code>["a","b"]</code> keep their type. Anything that isn't valid JSON is stored as text.</li></ul><p>Choose <strong>Save trait</strong>. Setting a key the profile already has replaces its value. Each trait's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>, which asks you to confirm first; segments that match on a deleted trait stop matching. Changing traits needs the Manage settings permission.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'calculated-attributes',
      'Calculated Attributes',
      'Calculated attributes',
      $html$<p><strong>Audiences → Calculated Attributes</strong> counts each profile's events: <strong>Page views</strong>, <strong>Total events</strong>, <strong>Conversions</strong> and when the profile was <strong>Last active</strong>. Content works them out from the events each time you open the screen, so there's nothing to edit. The figures across the top show <strong>Total events</strong>, <strong>Active profiles</strong> (with at least one event), <strong>Avg. events / profile</strong> and <strong>Conversions</strong>. Search by profile.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'behavior-events',
      'Behavior Events',
      'Behavior events',
      $html$<p><strong>Audiences → Behavior Events</strong> lists every event the project has received, newest first. Each row shows the event type (Page view, Conversion, Session start, Click or Signup; other types show their own name), the actor (the user id, or the anonymous id), the first characters of the entry's id, and the time. Events can't be added, changed or deleted here.</p><p>Filter by type, which starts on <strong>All Types</strong>, and search actors, entries and types. The figures across the top count <strong>Total events</strong>, <strong>Page views</strong>, <strong>Conversions</strong> and <strong>Unique actors</strong>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'sending-events',
      'Reference',
      'Sending events to Content',
      $html$<p>Your website or app sends events with a POST request to Content's collect endpoint, <code>/content/api/content/v1/collect</code>, on the domain you open Content on. The body is JSON:</p><ul><li><code>projectId</code>: required, the project's id.</li><li><code>anonymousId</code> or <code>userId</code>: at least one is required, each up to 200 characters.</li><li><code>type</code>: the event type, in lowercase letters, numbers and underscores, like <code>page_view</code> (the default) or <code>conversion</code>.</li><li><code>entryId</code>: optional, the id of a published entry the event is about.</li><li><code>context</code>: optional, an object of extra details.</li></ul><p>The endpoint accepts requests from any website. It answers <code>{ "ok": true }</code> with the event's id when it records the event, and <code>{ "ok": true, "suppressed": true }</code> when the visitor has denied analytics consent. Bodies over 20,000 bytes are refused.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'segments',
      'Segments',
      'Building a segment',
      $html$<p>A segment is a group of profiles defined by rules. To create one, choose <strong>Audiences → Segments</strong>, then <strong>Create segment</strong>, type a <strong>Name</strong> and choose <strong>Create segment</strong>. Then click the segment, or choose <strong>Edit rules</strong> in its <strong>⋯</strong> menu, to open the rule builder:</p><ol><li>Pick <strong>ALL</strong> or <strong>ANY</strong> in <strong>Match … of these rules</strong>.</li><li>For each rule, set the <strong>Field</strong>: <code>trait.plan</code> or <code>plan</code> for a trait, or <code>events.page_view</code> for how many events of a type the profile has. The box suggests fields found in your data.</li><li>Pick the <strong>Operator</strong>: equals, not_equals, contains, not_contains, gt, gte, lt, lte, exists or not_exists.</li><li>Type the <strong>Value</strong>, as text or JSON. exists and not_exists don't need one.</li><li>Use <strong>Add rule</strong> for more rules and the × to remove one, then choose <strong>Save rules</strong>.</li></ol><p><strong>Member preview</strong> shows how many profiles match as you edit. A segment with no rules matches everyone. <strong>All segments</strong> goes back to the list, which shows each segment's match mode and number of rules. <strong>Delete</strong> asks you to confirm first. Changing segments needs the Manage settings permission.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'consent-state',
      'Consent State',
      'Consent state',
      $html$<p><strong>Audiences → Consent State</strong> shows one profile's consent for each purpose: analytics, personalization and marketing. Pick the profile from the menu. A purpose nobody has answered shows as Pending, which counts as allowed: only Denied holds a purpose back. The figures across the top count <strong>Granted</strong>, <strong>Denied</strong> and <strong>Pending</strong> answers across every profile, and the <strong>Profiles covered</strong>.</p><p>To record a profile's consent for analytics or personalization, use <strong>Governance → Consent & Privacy</strong>, which only project owners can save. See <a href="/help/content/governance">Governance</a>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'profile-history',
      'Profile History',
      'Profile history',
      $html$<p><strong>Audiences → Profile History</strong> shows every event of one profile, across all its aliases, newest first. Pick the profile from the menu. Each row shows the time, the event type, the first characters of the entry's id and up to three details from the event's context. The figures across the top show the profile's <strong>Events</strong>, <strong>Entries touched</strong>, <strong>Conversions</strong> and <strong>Span (days)</strong> from its first event to its last.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'data-connections',
      'Data Connections',
      'Data connections',
      $html$<p><strong>Audiences → Data Connections</strong> keeps a list of the outside systems that feed your audience data. To add one, choose <strong>Create connection</strong>, type a <strong>Name</strong> (required), pick a <strong>Type</strong>, which is Webhook (the default), Warehouse, CDP, CSV import or API, and choose <strong>Create connection</strong>. New connections are Active.</p><p>A connection's status is Active, Paused or Error, and you set it by hand: <strong>Pause</strong> and <strong>Activate</strong> are in its <strong>⋯</strong> menu, along with <strong>Delete</strong>, which asks you to confirm first. Filter by status, and search names and types. The figures across the top count <strong>Total connections</strong>, <strong>Active</strong>, <strong>Paused</strong> and <strong>Error</strong>. Only project owners can change connections.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Target","label":"Personalization","href":"/help/content/personalization"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"ChartNoAxesCombined","label":"Content intelligence","href":"/help/content/intelligence"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/audiences' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Audiences',
    description = 'Profiles, anonymous visitors, identity, traits, behavior events, segments and consent.',
    status = 'draft',
    published_at = null
where slug = 'content/audiences' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/audiences' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Profiles</li><li>Anonymous Visitors</li><li>Identity Resolution</li><li>Traits</li><li>Calculated Attributes</li><li>Behavior Events</li><li>Segments</li><li>Consent State</li><li>Profile History</li><li>Data Connections</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/audiences' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
