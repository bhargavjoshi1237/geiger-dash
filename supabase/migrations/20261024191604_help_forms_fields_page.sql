-- Help forms fields page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/fields draft outline (from
-- 20261024191600_help_forms_structure) with the full Field types reference and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (lib/forms/field-types.js, components/forms/builder/field-palette.jsx,
-- type-settings.jsx, options-editor.jsx, field-defaults.js, field-settings.jsx, components/forms/fields/*,
-- components/forms/form-field-renderer.jsx, components/forms/image-input.jsx, lib/supabase/storage.js, lib/forms/logic.js
-- (validateField), lib/forms/i18n.js, lib/server/booking.js, app/api/public/forms/[slug]/upload/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Field types',
    description = 'Every field you can add to a form, from text and choices to ratings, bookings, file uploads and signatures, and the settings each one has.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/fields' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/fields' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'kinds-of-fields',
      'Concepts',
      'Questions, layout blocks and computed fields',
      $html$<p>The builder's <strong>Add fields</strong> list groups field types as <strong>Basic</strong>, <strong>Choice</strong>, <strong>Date & time</strong>, <strong>Survey</strong>, <strong>Contact</strong>, <strong>Advanced</strong>, <strong>Payments</strong> and <strong>Layout</strong>. They come in three kinds:</p><ul><li><strong>Questions</strong> collect an answer. They're numbered on the canvas and can be required, validated and used in conditions.</li><li><strong>Layout blocks</strong> (headings, text, statements, images, videos and page breaks) show something to respondents but collect nothing.</li><li><strong>Calculated</strong> and <strong>Order total</strong> work out a value from other answers.</li></ul><p>A field's own settings are on its <strong>Question</strong> tab in the builder, under its wording. To change a field's type, pick another under <strong>Field type</strong>. Its wording and shared settings stay, and its choices stay when both types have choices. The settings every field shares are covered in <a href="/help/forms/builder#field-settings">Form builder</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'basic-fields',
      'Reference',
      'Basic fields',
      $html$<ul><li><strong>Short text</strong>: one line. Its <strong>Browser autofill</strong> setting lets browsers fill in saved details such as a name or company.</li><li><strong>Long text</strong>: several lines.</li><li><strong>Email</strong>: checks that the answer looks like an email address.</li><li><strong>Phone</strong>: needs at least 7 digits.</li><li><strong>Website URL</strong>: needs a full address that starts with <code>http://</code> or <code>https://</code>.</li><li><strong>Number</strong>: accepts numbers only. Set a <strong>Minimum</strong> and <strong>Maximum</strong> on the <strong>Validation</strong> tab.</li><li><strong>Currency</strong>: a number shown as money. Type a three-letter <strong>Currency</strong> code such as <code>eur</code>, or leave it blank to use the form's payment currency.</li></ul><p>Text, email, phone and website fields also take a minimum and maximum length and a pattern on the <strong>Validation</strong> tab. Email, phone and website fields fill in from the browser's saved details on their own.</p>$html$,
      '[]',
      20
    ),
    (
      'choice-fields',
      'Reference',
      'Choice fields',
      $html$<ul><li><strong>Single choice</strong>: one answer from a list.</li><li><strong>Dropdown</strong>: one answer from a menu.</li><li><strong>Multiple choice</strong>: any number of answers. Set <strong>Min selections</strong> and <strong>Max selections</strong> on the <strong>Validation</strong> tab.</li><li><strong>Picture choice</strong> and <strong>Multiple picture choice</strong>: choices shown as pictures.</li><li><strong>Checkbox (yes/no)</strong>: one box to tick, next to a <strong>Statement</strong> such as "I agree to the terms and conditions".</li><li><strong>Ranking</strong>: respondents put the options in order, by dragging or with the arrows.</li></ul><p>New choice fields start with three options. Under <strong>Choices</strong>, type to rename an option, choose <strong>Add choice</strong> for another and remove the ones you don't need. With scoring on, a <strong>Points</strong> box appears next to each option (except on ranking), and with a quiz on, a <strong>Correct</strong> toggle. See <a href="/help/forms/logic#scoring-responses">Logic and scoring</a>.</p><p>On picture choices, the image button next to each option adds a picture and its <strong>Alt text</strong>. Upload a JPG, PNG, WebP, GIF or AVIF image of up to 5 MB, or paste an image link. <strong>Columns</strong> sets 2, 3 (the default) or 4 pictures across, and phones always show two. <strong>Hide labels</strong> shows the pictures alone, while screen readers still read the labels.</p>$html$,
      '[]',
      30
    ),
    (
      'date-and-time-fields',
      'Reference',
      'Date and time fields',
      $html$<ul><li><strong>Date</strong>, <strong>Time</strong> and <strong>Date & time</strong>: pickers for a day, a time of day or both.</li><li><strong>Booking slot</strong>: respondents pick a day, then a free time.</li></ul><p>A booking slot's settings:</p><ul><li><strong>Available days</strong>: Monday to Friday to start with.</li><li><strong>Day starts</strong> and <strong>Day ends</strong>: 09:00 and 17:00 to start with.</li><li><strong>Slot length (min)</strong>: 30 to start with, in steps of 5.</li><li><strong>Bookings per slot</strong>: how many responses can take the same time. 1 to start with.</li><li><strong>Bookable days ahead</strong>: 30 to start with.</li><li><strong>Minimum notice (h)</strong>: how soon a slot can start. 2 hours to start with.</li><li><strong>Timezone</strong>: the zone slots are set in, your browser's to start with.</li></ul><p>Respondents see times in their own timezone, and a full slot isn't offered. Forms checks again that the slot is free when the response is submitted. Slots only load on the published form.</p>$html$,
      '[]',
      40
    ),
    (
      'survey-fields',
      'Reference',
      'Survey fields',
      $html$<ul><li><strong>Star rating</strong>: <strong>Number of stars</strong> from 3 to 10, 5 to start with.</li><li><strong>Linear scale</strong>: a row of numbers from <strong>Lowest value</strong> (1) to <strong>Highest value</strong> (10), with a <strong>Low label</strong> and <strong>High label</strong> at the ends. Not likely and Very likely to start with.</li><li><strong>NPS (0–10)</strong>: the Net Promoter Score question, from 0 to 10, with its own low and high labels.</li><li><strong>Opinion scale</strong>: 3 to 7 <strong>Steps</strong> (5 to start with), shown as faces or as worded steps under <strong>Style</strong>. Each step has a label, from Very unhappy to Very happy to start with. Changing the number of steps resets the labels.</li><li><strong>Matrix / Likert</strong>: a grid where respondents pick one column for each row. New matrices start with the rows Quality, Speed and Support and the columns Poor, Fair, Good and Excellent. A required matrix needs an answer in every row.</li></ul><p>Survey answers are summarized question by question in each form's survey report. See <a href="/help/forms/analytics#survey-report">Analytics</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'contact-fields',
      'Reference',
      'Contact fields',
      $html$<ul><li><strong>Full name</strong>: <strong>First name</strong> and <strong>Last name</strong> boxes. When it's required, respondents have to fill in both.</li><li><strong>Address</strong>: <strong>Street address</strong>, <strong>Apartment, suite, etc.</strong>, <strong>City</strong>, <strong>State / Province</strong>, <strong>ZIP / Postal code</strong> and <strong>Country</strong>. When it's required, respondents have to fill in at least the street and city.</li></ul><p>Both fill in from the browser's saved details, and they read as one answer in responses and exports.</p>$html$,
      '[]',
      60
    ),
    (
      'files-signatures-and-consent',
      'Reference',
      'File uploads, signatures and consent',
      $html$<ul><li><strong>File upload</strong>: respondents choose files or drag them in. <strong>Max files</strong> runs from 1 (the default) to 20, and <strong>Max size (MB)</strong> from 1 to 50 (10 to start with). <strong>Accepted types</strong> limits the files, like <code>.pdf,image/*</code>. Leave it empty to accept any file.</li><li><strong>Signature</strong>: respondents draw their signature, or choose <strong>Type instead</strong> and type their full name. <strong>Clear</strong> starts again.</li><li><strong>Consent</strong>: a checkbox next to your consent wording, with an optional <strong>Policy link</strong> and its <strong>Link text</strong>, which opens in a new tab. Each response records when consent was given and a fingerprint of the wording and link, so a later change to the wording shows.</li></ul><p>File uploads only work on the published form: in the builder's preview, the field says it's preview only. To make consent a must, turn on <strong>Required</strong> for the field.</p>$html$,
      '[]',
      70
    ),
    (
      'repeating-hidden-and-calculated',
      'Reference',
      'Repeating groups, hidden fields and calculated fields',
      $html$<ul><li><strong>Repeating group</strong>: a set of <strong>Sub-fields</strong> that respondents fill in once per entry, like one row per guest. Sub-fields can be Short text, Long text, Email, Phone, Number, Date or Dropdown, and each can be required. Set <strong>Min entries</strong> (0 to start with), <strong>Max entries</strong> (10) and the <strong>Add button</strong> label (Add another).</li><li><strong>Hidden field</strong>: never shown to respondents. It takes its value from the form's link, through its <strong>Prefill key</strong> on the <strong>Advanced</strong> tab, or from its <strong>Default value</strong>. Use it to record where a respondent came from, for example.</li><li><strong>Calculated</strong>: shows respondents a value worked out from other answers as they fill in the form. See <a href="/help/forms/logic#calculated-fields">Logic and scoring</a>.</li></ul>$html$,
      '[]',
      80
    ),
    (
      'payment-fields',
      'Reference',
      'Payment fields',
      $html$<ul><li><strong>Product</strong>: something respondents can buy, with a <strong>Price</strong> in the form's currency (10 to start with) and a <strong>Description</strong>. Under <strong>Quantity</strong>, choose <strong>Respondent picks a quantity</strong>, up to a <strong>Max quantity</strong> (10 to start with), or <strong>Single item (add / skip)</strong>.</li><li><strong>Order total</strong>: the running total of the form's products, after any coupon.</li></ul><p>Respondents only pay at checkout when payments are turned on in the form's settings. See <a href="/help/forms/payments">Payments</a>.</p>$html$,
      '[]',
      90
    ),
    (
      'layout-blocks',
      'Reference',
      'Layout blocks',
      $html$<ul><li><strong>Section heading</strong>: a <strong>Heading</strong> and an optional <strong>Subheading</strong>.</li><li><strong>Text block</strong>: a paragraph of <strong>Text</strong>. Merge tags like <code>{Full name}</code> work in it.</li><li><strong>Statement</strong>: a <strong>Headline</strong> and <strong>Details</strong>. In conversational forms it gets its own screen, with a <strong>Button label</strong> (Continue to start with).</li><li><strong>Image</strong>: upload a JPG, PNG, WebP, GIF or AVIF image of up to 5 MB, or paste a link. Add <strong>Alt text</strong> for screen readers, and a <strong>Caption</strong>.</li><li><strong>Video</strong>: a <strong>Video link</strong> to YouTube or Vimeo, or an https link to an .mp4 or .webm file. Embed code isn't accepted. YouTube and Vimeo videos play in their privacy-enhanced players.</li><li><strong>Page break</strong>: starts a new page. See <a href="/help/forms/builder#pages">Form builder</a>.</li></ul><p>An image or video block without a usable link is hidden from respondents.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"GitFork","label":"Logic & scoring","href":"/help/forms/logic"},{"icon":"CreditCard","label":"Payments","href":"/help/forms/payments"}]',
      110
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/fields' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Field types',
    description = 'Every field you can add to a form, from short text and choices to ratings, file uploads, signatures and layout blocks.',
    status = 'draft',
    published_at = null
where slug = 'forms/fields' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/fields' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Basic fields</li><li>Choice fields</li><li>Date and time</li><li>Survey fields</li><li>Contact fields</li><li>Advanced fields</li><li>Payment fields</li><li>Layout blocks</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/fields' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
