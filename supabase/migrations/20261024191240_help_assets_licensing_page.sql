-- Help assets licensing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/licensing draft outline
-- (20261024191200_help_assets_structure) with the full Licensing guide and publishes it. No section showcases exist
-- for Assets yet. A licence's Auto-renew flag is described as a flag only: nothing renews a licence by itself.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/licensing/* (all screens,
-- license_detail, license_certificate, licensing_kit, constants, conflicts.js, pricing_engine.js,
-- renewal_actions.js, royalty_engine.js), lib/supabase/licensing.js, rights.js, royalties.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Licensing',
    description = 'Record the rights you hold, price and issue licenses from templates, print certificates, handle renewals, and track royalties owed to rights holders.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/licensing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/licensing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'issuing-a-license',
      'Basics',
      'Issuing a license',
      $html$<p>A license grants a licensee the right to use your material, in a set scope and term. To issue one, open a project in Assets, choose <strong>Licensing → Issued Licenses</strong> in the sidebar, then <strong>Issue licence</strong>.</p><ol><li>Pick the <strong>Licensee</strong>, or add one with their name, kind, contact and email.</li><li>Pick a <strong>Template</strong>, or <strong>Bespoke (no template)</strong>. A template fills in the scope.</li><li>Give it a <strong>Licence title</strong>, and set the <strong>Usage type</strong>, <strong>Territories</strong>, <strong>Channels</strong>, <strong>Exclusivity</strong>, <strong>Duration</strong> and <strong>Start date</strong>.</li><li>Add what it covers: <strong>Library assets</strong>, <strong>Collections</strong> or <strong>External material</strong> held outside Assets.</li><li>Check the <strong>Fee</strong>, calculated from your rate card. Type a <strong>Fee override</strong> if the deal differs.</li><li>Choose <strong>Issue licence</strong>.</li></ol><p>While you fill it in, the <strong>Conflict check</strong> warns about clashes with exclusive licenses already issued. Licenses also arrive from gallery sales of license products; see <a href="/help/assets/galleries/store">Store and orders</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-licensing-fits',
      'Concepts',
      'Rights, templates and licenses',
      $html$<p>Licensing in Assets has two sides. <strong>Rights</strong> are what you hold: material you own or licensed in, recorded in Rights Inventory. <strong>Licenses</strong> are what you grant to others, recorded in Issued Licenses. A <strong>template</strong> is a reusable starting point for a license, and the <strong>rate card</strong> on License Pricing turns a requested scope into a fee.</p><p>A license's status is Draft, Pending, Active, Expiring, Expired, Terminated or Renewed. Licenses from a template that requires approval start as Pending until someone marks them active.</p><p>Every license keeps the price breakdown it was issued with, so its fee can always be explained, even after the rate card changes.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'rights-inventory',
      'Rights Inventory',
      'Recording rights you hold',
      $html$<p><strong>Licensing → Rights Inventory</strong> records the rights you own or control. To add one, choose <strong>New right</strong>.</p><ul><li><strong>Subject</strong>: a <strong>Library asset</strong>, or a <strong>Title</strong> and <strong>External reference</strong> for material not in the library.</li><li><strong>Rights holder</strong> and <strong>Acquisition</strong>: who it came from, and whether it's Owned, Licensed in, Commissioned, Public domain or Unknown, with your <strong>Ownership share (%)</strong>.</li><li><strong>Coverage</strong>: <strong>Territories held</strong>, <strong>Channels held</strong>, <strong>Exclusivity</strong>, and a <strong>Window start</strong> and <strong>Window end</strong> (blank for no end).</li><li><strong>Paperwork</strong>: a <strong>Document URL</strong> and <strong>Notes</strong>, and a <strong>Status</strong>: Draft, Active, Expiring, Expired or Disputed.</li></ul><p><strong>Rights holders</strong> lists the people and organizations royalties are paid to. Add one with a <strong>Name</strong>, <strong>Kind</strong>, <strong>Email</strong>, <strong>Default royalty (%)</strong> and <strong>Payment terms</strong>. The figures across the top count <strong>Rights records</strong>, <strong>Windows closing</strong> within 90 days, <strong>Rights holders</strong> and <strong>Disputed</strong> records.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'license-templates',
      'License Templates',
      'License templates',
      $html$<p><strong>Licensing → License Templates</strong> keeps reusable grants. To add one, choose <strong>New template</strong>.</p><ul><li><strong>Identity</strong>: <strong>Template name</strong> (required), <strong>Description</strong> and <strong>Status</strong> (Draft, Active or Archived).</li><li><strong>Default grant</strong>: <strong>Usage type</strong>, <strong>Exclusivity</strong>, <strong>Default territories</strong>, <strong>Default channels</strong> and <strong>Default duration</strong>. A license from the template starts with these and can change them.</li><li><strong>Terms</strong>: the <strong>Restrictions</strong> and the <strong>Terms body</strong> carried onto every license. The tokens <code>{{exclusivity}}</code>, <code>{{usage}}</code>, <code>{{territories}}</code>, <code>{{channels}}</code> and <code>{{duration}}</code> are filled in on the certificate.</li><li><strong>Requires approval</strong>: licenses from the template start as Pending.</li></ul><p>Choose <strong>Create template</strong>. <strong>Duplicate & bump version</strong> in a template's menu copies it as the next version, so licenses issued from the old one keep their terms.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'license-pricing',
      'License Pricing',
      'Pricing licenses',
      $html$<p><strong>Licensing → License Pricing</strong> holds the rate card that prices licenses. Start with <strong>Create starter card</strong> for sensible fees and multipliers, then tune them, or add rules one by one.</p><ul><li><strong>Base fee</strong>: the starting fee, globally or for one template. A template's own rule wins over the global one.</li><li><strong>Territory</strong> and <strong>Channel</strong>: a <strong>Multiplier</strong> for each one licensed. These compound, so each territory and channel multiplies the running total.</li><li><strong>Duration</strong>: a multiplier for the term, using the closest rule at or under the requested length.</li><li><strong>Exclusivity</strong>: a premium for exclusive or sole grants.</li></ul><p>Any flat amounts on rules are added after the multipliers. The <strong>Quote calculator</strong> prices a requested scope and shows every factor that moved the price; <strong>Log as a quote request</strong> keeps the figure for a licensee. Quote requests move through Requested, Quoted, Accepted, Declined and Converted, with <strong>Mark accepted</strong> and <strong>Mark declined</strong> in their menu.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'license-details',
      'Issued Licenses',
      'License details and certificates',
      $html$<p>Click a license on Issued Licenses to open it. The figures across the top of Issued Licenses count <strong>Licences</strong>, <strong>Licence revenue</strong>, those <strong>Expiring soon</strong> (within 30 days) and <strong>Exclusive grants</strong>, and each row's menu can <strong>Mark active</strong> or <strong>Mark expired</strong>.</p><ul><li><strong>Scope & terms</strong>: what the licensee may do, where and for how long, the dates and grace days, and the restrictions.</li><li><strong>Licensed items</strong>: the assets, collections and external material it covers. <strong>Add item</strong> adds more.</li><li><strong>Financials & royalties</strong>: the fee and the factors frozen in when it was issued, and the royalties owed onward from it.</li><li><strong>Renewals & history</strong>: <strong>Renew term</strong>, <strong>Extend grace 30 days</strong>, <strong>Mark lapsed</strong> and <strong>Terminate</strong>, each recorded in the history. Terminate happens straight away, without asking.</li><li><strong>Certificate</strong>: the grant as the licensee receives it. <strong>Print</strong> opens it for printing or saving as a PDF.</li></ul><p><strong>Auto-renew</strong> marks a license as auto-renewing on Expirations & Renewals; renewing it is still up to you.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'conflict-and-coverage-checks',
      'Concepts',
      'Conflict and coverage checks',
      $html$<p>Assets checks every license against the rest of your licensing and shows what it finds as warnings. Nothing blocks a save: you decide.</p><ul><li><strong>Conflicts</strong>: the license covers the same material as another live license where either one is exclusive.</li><li><strong>Coverage</strong>: whether your rights back the grant. Assets warns when an item has no rights record, when its rights are expired or disputed, when the license runs past the rights window, when it grants a territory or channel you don't hold, and when it's exclusive on rights you hold non-exclusively.</li></ul><p>Add the licensed items first, so the checks have material to compare. Live licenses are those that are Pending, Active or Expiring.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'expirations-and-renewals',
      'Expirations & Renewals',
      'Expirations and renewals',
      $html$<p><strong>Licensing → Expirations & Renewals</strong> shows the license windows that are closing. Pick how far ahead to look (<strong>Next 30 days</strong>, <strong>Next 60 days</strong>, <strong>Next 90 days</strong> or <strong>Next 12 months</strong>), then switch between <strong>Expiring</strong>, <strong>In grace</strong> (past the end date but inside the grace days), <strong>Expired</strong>, <strong>Auto-renewing</strong> and <strong>History</strong>.</p><p>The figures across the top include the <strong>Revenue at risk</strong> in licenses about to expire and the <strong>Renewal rate</strong> of decided licenses.</p><p>Each license's menu has <strong>Renew…</strong>, <strong>Extend grace 30 days</strong> and <strong>Mark lapsed</strong>. To renew, choose the <strong>Renewal style</strong>: <strong>Extend this licence</strong>, which moves its end date, or <strong>Issue a successor licence</strong>, which keeps the original on file and links the two. Set the <strong>New term</strong>, the <strong>Renewal fee</strong> and an optional <strong>Note</strong>, then choose <strong>Renew</strong>. Every decision is listed under History.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'revenue-and-royalties',
      'Revenue & Royalties',
      'Revenue and royalties',
      $html$<p><strong>Licensing → Revenue & Royalties</strong> shows license income and what you owe rights holders from it.</p><ul><li><strong>Revenue</strong>: fees issued over the last 12 months, by usage type, territory and channel, and the biggest fees on file.</li><li><strong>Royalty rules</strong>: what each <strong>Rights holder</strong> earns, as a <strong>Rate (%)</strong> or a <strong>Flat per licence</strong> amount, for all license revenue or a specific asset, collection, rights record or template. The most specific matching rule wins for each holder, and a lower <strong>Priority</strong> wins ties. A rule can carry a <strong>Minimum guarantee</strong>, which is <strong>Recoupable</strong> when it's an advance to earn back.</li><li><strong>Accruals</strong>: royalties owed from each license fee. They're added from a license's Financials & royalties tab once a rule covers the holder.</li><li><strong>Statements</strong>: choose a holder and a period and <strong>Generate</strong> a statement from their open accruals, with the guarantee and recoupment applied. Then <strong>Mark issued</strong> and <strong>Mark paid</strong>.</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Store","label":"Store & orders","href":"/help/assets/galleries/store"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"},{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/licensing' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Licensing',
    description = 'Record the rights you hold, issue licenses from templates and prices, and track renewals and royalties.',
    status = 'draft',
    published_at = null
where slug = 'assets/licensing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/licensing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Rights inventory</li><li>License templates</li><li>License pricing</li><li>Issued licenses</li><li>Expirations and renewals</li><li>Revenue and royalties</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/licensing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
