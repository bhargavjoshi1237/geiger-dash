-- Help forms sharing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/sharing draft outline (from
-- 20261024191600_help_forms_structure) with the full Publishing & sharing guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/forms/publish-dialog.jsx, components/forms/builder/builder-topbar.jsx,
-- doc-checks.js, components/internal/screens/forms/forms/sections/sharing.jsx, overview.jsx, qr_code.jsx,
-- forms_screen.jsx, app/api/forms/[id]/signed-link/route.js, app/api/forms/[id]/invite/route.js, lib/server/public-form.js
-- (evaluateGate), lib/server/forms.js (loadPublishedForm), lib/forms/i18n.js, components/forms/filler/gates.jsx,
-- public/embed.js, geiger-rbac.config.js).
-- Left out on purpose: Workspace Settings' embedding domain list, which nothing enforces yet.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Publishing & sharing',
    description = 'Publish a form, then share its link or QR code, embed it on your site, or send personal signed links and email invitations.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/sharing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/sharing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'publishing-a-form',
      'Basics',
      'Publishing a form',
      $html$<p>A form collects responses only once it's published. To publish from the builder:</p><ol><li>Choose <strong>Publish</strong> at the top right of the builder.</li><li>Read the list of things to check, if there is one. <strong>Fix</strong> next to a problem takes you to the field.</li><li>Choose <strong>Publish</strong>, or <strong>Publish anyway</strong> when there are still problems to check.</li></ol><p>The button then reads <strong>Live</strong>, and the dialog shows the form's public link, ready to copy. You can also publish with <strong>Publish</strong> in the form's row menu in All Forms, or under <strong>Sharing → Publish</strong> in its settings, where the <strong>Draft</strong>, <strong>Published</strong> and <strong>Archived</strong> tabs change the status straight away, without Save changes.</p><p>Publishing needs a role that can publish forms: Owner, Admin or Manager. For other roles the switch is disabled.</p>$html$,
      '[]',
      10
    ),
    (
      'taking-a-form-offline',
      'Concepts',
      'Taking a form offline',
      $html$<p>To stop collecting responses, choose <strong>Live</strong> in the builder and turn off the switch, choose <strong>Unpublish</strong> in the form's row menu, or pick <strong>Draft</strong> or <strong>Archived</strong> under <strong>Sharing → Publish</strong>. The form keeps its responses and its public link. While it isn't published, anyone who opens the link sees <strong>Form not available</strong>, and embedded copies show the same notice.</p><p>Publishing again reopens the same link. To close a form on a date or after a number of responses instead, use its submission rules: see <a href="/help/forms/form-settings#schedule-and-limits">Form settings</a>.</p>$html$,
      '[]',
      20
    ),
    (
      'the-public-link',
      'Sharing',
      'The public link',
      $html$<p>Every form has one public link. It ends with the form's slug, which Forms makes from the form's name when you create it, and renaming the form doesn't change it. <strong>Sharing → Publish</strong> in the form's settings shows the slug, when the form was first published and <strong>Open public form</strong>.</p><p>Copy the link from the copy icon in the builder's top bar, from the publish dialog or from the form's <strong>Overview</strong> or <strong>Share & Send</strong> settings. Who can open it depends on the form's access setting, such as a password or sign-in: see <a href="/help/forms/form-settings#who-can-respond">Form settings</a>.</p><p>You can add to the link to track or prefill responses: UTM tags like <code>?utm_source=newsletter</code> are covered in <a href="/help/forms/analytics#source-and-attribution">Analytics</a>, and prefill keys in <a href="/help/forms/builder#advanced-field-settings">Form builder</a>.</p>$html$,
      '[]',
      30
    ),
    (
      'qr-code-and-social-sharing',
      'Sharing',
      'QR code and social sharing',
      $html$<p><strong>Sharing → Share & Send</strong> in a form's settings starts with its <strong>Public link</strong>:</p><ul><li>The copy button copies the link.</li><li><strong>X</strong>, <strong>LinkedIn</strong> and <strong>Facebook</strong> open a post with the link in a new tab, and <strong>Email</strong> starts an email in your mail app with the form's name and link.</li><li>The QR code opens the link when scanned. <strong>Download PNG</strong> saves it as an image for print or slides.</li></ul><p>The same QR code is on the form's <strong>Overview</strong>. Until the form is published, the page warns that the link shows a closed notice.</p>$html$,
      '[]',
      40
    ),
    (
      'embedding-a-form',
      'Sharing',
      'Embedding a form',
      $html$<p>To put a form on your own website, open its settings, go to <strong>Sharing → Embed</strong>, pick an <strong>Embed type</strong>, then copy the <strong>Embed code</strong> and paste it into your page.</p><ul><li><strong>Inline</strong>: sits in the page and grows with the form.</li><li><strong>Popup</strong>: a centered dialog over the page.</li><li><strong>Slider</strong>: a panel that slides in from the edge of the screen.</li><li><strong>Side tab</strong>: a tab pinned to the screen edge that opens a slider.</li><li><strong>Popover</strong>: a corner bubble that opens a compact panel.</li><li><strong>Full screen</strong>: covers the whole screen, for longer forms.</li><li><strong>Plain iframe</strong>: a fixed-height frame that works without Forms' script. Set its <strong>Height (px)</strong>, 640 to start with.</li></ul><p>Popup, slider, side tab and popover embeds have a launcher you can style: its <strong>Button text</strong> (or <strong>Tab text</strong> or <strong>Bubble label</strong>), its color and its <strong>Position</strong>, left or right. <strong>Width (px)</strong> sets the panel's width, at least 280. On phones panels fill the width. The embed code shows the same Form not available notice until the form is published.</p>$html$,
      '[]',
      50
    ),
    (
      'display-rules',
      'Sharing',
      'Display rules for embedded forms',
      $html$<p>Popup, slider, side tab, popover and full screen embeds have <strong>Display rules</strong> in <strong>Sharing → Embed</strong>:</p><ul><li><strong>Opens</strong>: <strong>On click</strong>, <strong>After a delay</strong> (5 seconds to start with), <strong>At a scroll depth</strong> (50% to start with), or <strong>On exit intent</strong>, which works on desktop only, when the pointer leaves through the top of the window. A side tab or popover always shows its launcher too.</li><li><strong>Your own button (optional)</strong>: a CSS selector, like <code>#open-form</code>, for elements on your page that open the form instead of the generated button.</li><li><strong>Show</strong>: for forms that open on their own, <strong>Every page view</strong>, <strong>Once per session</strong> or <strong>Once every few days</strong> (7 to start with). It's remembered in each visitor's browser.</li><li><strong>Close after submit (seconds)</strong>: closes the form after the thank-you screen. Leave it empty to keep it open.</li><li><strong>Stop after a response</strong>: visitors who have responded aren't shown the form on their own again.</li></ul><p>Under <strong>Embed code</strong>, <strong>Page URL parameters</strong> passes <strong>UTM tags only</strong> or <strong>All parameters</strong> from your page's address on to the form, for tracking and prefilled fields. If the form has hidden fields, fill in their values in the code's <code>data-param-</code> attributes.</p>$html$,
      '[]',
      60
    ),
    (
      'signed-links',
      'Sharing',
      'Signed links',
      $html$<p>A signed link is a personal link to a form that stops working after a set time. A form set to <strong>Signed links only</strong> accepts no other link. To make one, open the form's settings and go to <strong>Sharing → Share & Send</strong>:</p><ol><li>Under <strong>Signed link</strong>, type a <strong>Recipient email</strong> to tie the response to that person. It's optional.</li><li>Set <strong>Expires in (hours)</strong>: 72 to start with, and up to 2,160 (90 days).</li><li>Choose <strong>Generate</strong>, then copy the link. Forms shows when it expires.</li></ol><p>Someone who opens an expired or altered link sees <strong>This link isn't valid</strong>. Making signed links needs a role that can edit forms, and link signing set up for your deployment.</p>$html$,
      '[]',
      70
    ),
    (
      'sending-a-form-by-email',
      'Sharing',
      'Sending a form by email',
      $html$<p>To email a form to people, open its settings and go to <strong>Sharing → Share & Send → Send to people</strong>.</p><ol><li>Under <strong>Recipients</strong>, type email addresses and press <code>Enter</code>. One send reaches up to 200 people.</li><li>Optional: write a <strong>Message</strong>. Without one, the email says you invited them to fill out the form.</li><li>Leave <strong>Personal signed links</strong> on to give each recipient their own link tied to their email, valid for 30 days. Use it when you're collecting signatures. Turn it off to send the public link.</li><li>Choose <strong>Send</strong>.</li></ol><p>With signed links, the email asks recipients to review and sign, with a <strong>Review & sign</strong> button. Otherwise it invites them, with an <strong>Open form</strong> button. Replies come back to you. The form has to be published first, and sending needs email set up for your deployment. Forms tells you how many emails went out.</p>$html$,
      '[]',
      80
    ),
    (
      'messages-respondents-see',
      'Reference',
      'Messages respondents see',
      $html$<p>When a form can't take a response, respondents see one of these instead:</p><ul><li><strong>Form not available</strong>: the form isn't published, was deleted or the link is wrong.</li><li><strong>Not open yet</strong>: the form's open date hasn't come, with the date it opens.</li><li><strong>This form is closed</strong>: the close date has passed.</li><li><strong>Response limit reached</strong>: the form is full.</li><li><strong>Password required</strong>: the form needs its password.</li><li><strong>Sign in to respond</strong>: the form needs a signed-in Geiger account.</li><li><strong>Restricted to your organization</strong>: the form only takes accounts on one email domain.</li><li><strong>This link isn't valid</strong>: a signed link has expired or is wrong.</li></ul><p>A form set to one response per person tells a returning respondent "You've already responded to this form."</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"},{"icon":"ChartColumn","label":"Analytics","href":"/help/forms/analytics"},{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/sharing' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Publishing & sharing',
    description = 'Publish a form, then share its link or QR code, embed it on your site, or send personal links and email invites.',
    status = 'draft',
    published_at = null
where slug = 'forms/sharing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/sharing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Publishing a form</li><li>The public link</li><li>Embedding a form</li><li>QR code</li><li>Signed links and email invites</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/sharing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
