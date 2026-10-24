-- Help content personalization page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/personalization draft outline
-- with the full Personalization guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/personalization/*, lib/decide-core.js,
-- app/api/decide/route.js, lib/delivery/core.mjs, lib/supabase/{variants,slots,recommend,topics}.js,
-- supabase/migrations/20261001081041_project_scoped_rls.sql).
-- Left out: Edge Decisions (it posts to /api/decide without the /content prefix, so it fails in production), Frequency
-- Caps (stored, but no decision reads them), Topic Journey Stages (nothing creates stage rows, so the screen stays empty),
-- the in operator (the rule editor saves its value as text, so it never matches), and the screens' how-it-works claims
-- the decision code doesn't bear out (context clauses matched first, locale read from Accept-Language).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Personalization',
    description = 'Show different entries to different people: attach variants to content slots, target them with rules, and boost or exclude entries in rankings.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/personalization' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/personalization' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-variant',
      'Basics',
      'Adding a variant to a slot',
      $html$<p>A variant is one entry a content slot can show. To add one, choose <strong>Personalization → Content Variants</strong> in the sidebar, then <strong>Create variant</strong>:</p><ul><li><strong>Slot</strong>: required. Slots are set up under <strong>Content → Content Slots</strong>.</li><li><strong>Entry</strong>: the entry the variant shows.</li><li><strong>Priority</strong>: 0 to start. Higher wins first.</li><li><strong>Weight</strong>: 1 to start. It sets the variant's share when variants tie on priority.</li></ul><p>Choose <strong>Create variant</strong>. New variants are Active and have no targeting rules, so they match everyone until you add rules under <strong>Targeting Rules</strong>.</p><p>Each row shows the variant's entry, slot, priority and weight, and its status: Active, Paused or Archived. Filter by status and search slots and entries. The <strong>⋯</strong> menu has <strong>Pause</strong> or <strong>Activate</strong>, <strong>Duplicate</strong>, which makes a Paused copy, and <strong>Delete</strong>, which removes the variant straight away, without asking. Changing variants needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-a-slot-decides',
      'Concepts',
      'How a slot picks what to show',
      $html$<p>When your app asks a content slot what to show a visitor, Content decides like this:</p><ol><li>It takes the slot's Active variants whose entries are published.</li><li>It keeps those whose targeting rules all match the profile and context your app sent. A variant with no rules matches everyone.</li><li>It keeps the matches with the highest priority.</li><li>If several tie, it picks one in proportion to their weights. The pick is keyed to the visitor, so the same visitor gets the same variant while the tied set stays the same.</li><li>If nothing matches, it serves the slot's fallback entry, as long as that entry is published. Otherwise it returns no entry.</li></ol><p>Every answer comes with a plain-language reason, such as which rules matched and why the variant won. When a visitor has denied personalization consent, Content only considers variants without rules for them and doesn't record the decision.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'targeting-rules',
      'Targeting Rules',
      'Writing targeting rules',
      $html$<p>Targeting rules decide who a variant is for. Choose <strong>Personalization → Targeting Rules</strong> and click a variant in the list. In the <strong>Rule editor</strong>, each clause has a <strong>Key</strong>, an <strong>Operator</strong> and a <strong>Value</strong>:</p><ul><li><strong>Key</strong>: the name of a value your app sends with the request, in the visitor's profile or the context, like <code>segment</code>, <code>locale</code> or <code>device</code>. A dotted key, like <code>plan.tier</code>, reads a nested value.</li><li><strong>Operator</strong>: equals (the default), not_equals, contains, gt or lt. equals, not_equals and contains compare text; gt and lt compare numbers.</li><li><strong>Value</strong>: what to compare with.</li></ul><p><strong>Add clause</strong> adds a row and the trash icon removes one. Choose <strong>Save rules</strong> to keep them. Clauses without a key or a value are dropped when you save. A variant matches only when all its clauses match, and a variant without clauses is a default that matches everyone.</p><p>The list shows each variant's slot and its clauses, and the figures across the top count <strong>Variants</strong>, those <strong>With rules</strong> and <strong>Defaults</strong>. Search by slot name. Changing rules needs the Manage settings permission.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'targeting-overviews',
      'Personalization',
      'Segment, context, component and behavior targeting',
      $html$<p>Four screens show your targeting from different angles. They read the clauses on your variants and don't change anything; you edit clauses under <strong>Targeting Rules</strong>.</p><ul><li><strong>Segment Targeting</strong> lists variants with a <code>segment</code> clause and the segment each serves. Your app passes the visitor's segment name in the request: segments built under <strong>Audiences → Segments</strong> aren't applied automatically.</li><li><strong>Context Targeting</strong> lists variants with <code>locale</code>, <code>device</code>, <code>country</code> or <code>timezone</code> clauses.</li><li><strong>Component Targeting</strong> lists every content slot with its number of variants, its highest priority and whether it's personalized. A slot without variants serves only its fallback entry.</li><li><strong>Behavior Targeting</strong> lists variants with <code>stage</code>, <code>topic</code>, <code>visits</code>, <code>last_seen</code> or <code>converted</code> clauses.</li></ul><p>Each screen has a search box, and figures across the top that count what it lists.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'boosts-and-exclusions',
      'Boosts & Exclusions',
      'Boosting and excluding entries',
      $html$<p>Boosts and exclusions adjust recommendation rankings by hand. To add one, choose <strong>Personalization → Boosts & Exclusions</strong>, then <strong>Create rule</strong>. Pick the <strong>Entry</strong> (required) and the <strong>Rule type</strong>:</p><ul><li><strong>Boost</strong> multiplies the entry's ranking score by its <strong>Weight</strong>, which is 1.5 to start.</li><li><strong>Exclude</strong> removes the entry from rankings.</li></ul><p>Choose <strong>Create rule</strong>. New rules are Active. Each rule's <strong>⋯</strong> menu has <strong>Pause</strong> or <strong>Activate</strong> and <strong>Delete</strong>, which removes it straight away, without asking. The figures across the top count active <strong>Boosts</strong> and <strong>Exclusions</strong> and the <strong>Entries affected</strong>.</p><p>Active rules apply to the rankings in <a href="/help/content/recommendations">Recommendations</a>. Changing rules needs the Manage settings permission.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'asking-a-slot',
      'Reference',
      'Asking a slot what to show',
      $html$<p>Your website or app asks a content slot for its entry with a POST request to <code>/content/api/decide</code>, on the domain you open Content on. The body is JSON:</p><ul><li><code>projectId</code> and <code>slotKey</code>: required. The slot key is the one shown on the slot, like <code>homepage_hero</code>.</li><li><code>profile</code>: optional facts about the visitor that rules can match, like <code>{ "segment": "pro" }</code>. Include <code>id</code> or <code>anonymousId</code> so the same visitor gets the same pick and their consent applies.</li><li><code>context</code>: optional facts about the request, like <code>{ "locale": "de", "device": "mobile" }</code>.</li></ul><p>The answer is <code>{ "entryId": …, "variantId": …, "reason": "…" }</code>, with <code>entryId</code> null when nothing applies. Fetch the entry itself from the delivery API; see <a href="/help/content/developers">Developer tools</a>. Requests with a missing project or slot key get status 400, an unknown project or slot gets 404, and bodies over 20,000 bytes are refused.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"UsersRound","label":"Audiences","href":"/help/content/audiences"},{"icon":"ChartNoAxesCombined","label":"Content intelligence","href":"/help/content/intelligence"},{"icon":"BrainCircuit","label":"Recommendations","href":"/help/content/recommendations"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/personalization' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Personalization',
    description = 'Show different content to different people with variants, targeting rules, caps and boosts.',
    status = 'draft',
    published_at = null
where slug = 'content/personalization' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/personalization' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Content Variants</li><li>Targeting Rules</li><li>Segment, context, component and behavior targeting</li><li>Edge Decisions</li><li>Frequency Caps</li><li>Boosts and exclusions</li><li>Topic Journey Stages</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/personalization' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
