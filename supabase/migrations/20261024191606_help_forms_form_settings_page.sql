-- Help forms form settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/form-settings draft outline (from
-- 20261024191600_help_forms_structure) with the full Form settings guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/forms/form_detail.jsx, form_sections.jsx,
-- constants.js, sections/* (overview, details, themes, screens, branding, localization, structure.jsx PagesSection,
-- save_resume, submission, notifications, access, security, kit), components/internal/shared/editor_shell.jsx,
-- components/forms/theme-gallery.jsx, theme-preview.jsx, font-picker.jsx, lib/forms/fonts.js, lib/forms/theme.js,
-- lib/forms/i18n.js, lib/forms/schema.js (defaultSettings), components/forms/filler/* (form-runner, conversational-view,
-- save-resume-dialog, gates, filler-shell, form-hero, thank-you), lib/server/submit.js, lib/server/public-form.js,
-- lib/server/side-effects.js, lib/server/flow.js (notifyFlowUsers), app/api/cron/reminders/route.js, vercel.json).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Form settings',
    description = 'Set up a form''s design, welcome and thank-you screens, schedule and limits, emails, and who can respond, then save your changes.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/form-settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/form-settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-and-saving',
      'Basics',
      'Opening and saving form settings',
      $html$<p>To open a form's settings, click the form in <strong>All Forms</strong>, or choose <strong>Edit settings</strong> in its row menu. The settings open on the form's <strong>Overview</strong>, with the list of sections alongside.</p><p>Changes in form settings aren't saved until you choose <strong>Save changes</strong>. While you have unsaved changes, the form shows an <strong>Unsaved changes</strong> badge, and <strong>Discard</strong> puts the saved settings back. If you leave with unsaved changes, Forms asks "Discard unsaved changes?": choose <strong>Keep editing</strong>, or <strong>Discard & leave</strong>. Once everything is saved, the button reads <strong>Saved</strong>.</p><p>Before saving, Forms checks that the form has a name and that a few settings are complete, such as a password for password access or a code for every coupon. If one isn't, it says what's missing and opens that section.</p><p>Saving needs a role that can edit forms: Owner, Admin, Manager or Member. For a Viewer, the button explains "Your role can't edit forms." At the top, <strong>Preview</strong> opens the form's public link in a new tab and <strong>Open builder</strong> opens the builder.</p>$html$,
      '[]',
      10
    ),
    (
      'sections-in-form-settings',
      'Concepts',
      'Sections in form settings',
      $html$<p>Form settings are grouped into sections. This guide covers <strong>Overview</strong> and <strong>Details</strong>, the <strong>Design</strong> and <strong>Flow</strong> groups, and <strong>Notifications</strong>, <strong>Access & Sharing</strong> and <strong>Security & Compliance</strong> in the <strong>Settings</strong> group. The other groups have their own guides:</p><ul><li><strong>Build</strong> sums up the form's fields, layout and logic. You change them in the builder: see <a href="/help/forms/builder">Form builder</a> and <a href="/help/forms/logic">Logic and scoring</a>.</li><li><strong>Payments</strong>: see <a href="/help/forms/payments">Payments</a>.</li><li><strong>Sharing</strong>: see <a href="/help/forms/sharing">Publishing and sharing</a>.</li><li><strong>Workflow</strong>: see <a href="/help/forms/workflow">Approvals and automations</a>.</li><li><strong>Integrations</strong>: see <a href="/help/forms/integrations">Integrations and API</a>.</li></ul><p>The builder's <strong>Design</strong>, <strong>Schedule & limits</strong> and <strong>Submission</strong> sections change some of the same settings, and there they save on their own.</p>$html$,
      '[]',
      20
    ),
    (
      'overview-and-details',
      'Form settings',
      'Overview and details',
      $html$<p>A form's <strong>Overview</strong> shows its <strong>Responses</strong> (all time), and its <strong>Views</strong>, <strong>Starts</strong> and <strong>Completion</strong> rate for the last 30 days. Under <strong>Public link</strong> are the form's address with a copy button, a QR code and shortcuts to <strong>Open builder</strong>, <strong>Preview</strong>, <strong>Responses</strong>, <strong>Share</strong>, <strong>Embed</strong> and <strong>Publish</strong>. <strong>At a glance</strong> lists its status, folder, fields, tags, description and when it was last edited and published.</p><p><strong>Details</strong> holds:</p><ul><li><strong>Form name</strong>: required.</li><li><strong>Description</strong>: shown under the form's title, and in the template gallery when the form is saved as a template.</li><li><strong>Folder / category</strong>: the folder the form is in, or No folder.</li><li><strong>Tags</strong>: type a tag and press <code>Enter</code> or choose <strong>Add</strong>. Tags are saved in lowercase, with dashes for spaces. Remove one with the × beside it.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'themes',
      'Design',
      'Themes',
      $html$<p>A theme is a ready-made look for a form. Under <strong>Design → Themes & Colors</strong>, <strong>Themes</strong> shows 10 <strong>Presets</strong> (Geiger, Daylight, Midnight, Ocean, Forest, Editorial, Studio, Blossom, Poster and Terminal) and the project's <strong>Workspace themes</strong>. Click one to apply it. Applying copies the theme's look into the form, so later changes to the theme don't affect it. Choose <strong>Save changes</strong> to keep it.</p><p>A workspace theme saves a form's colors, fonts, images and logo so any form in the project can use them. To save one, choose <strong>Save current</strong>, type a <strong>Theme name</strong>, then <strong>Save theme</strong>. It's saved straight away. Each workspace theme's <strong>⋯</strong> menu has <strong>Rename</strong> and <strong>Delete</strong>. Deleting a theme doesn't change the forms that used it. Only the Owner and Admin roles can save, rename or delete workspace themes.</p>$html$,
      '[]',
      40
    ),
    (
      'colors-fonts-and-background',
      'Design',
      'Colors, fonts and background',
      $html$<p>The rest of <strong>Design → Themes & Colors</strong> fine-tunes the look, with a <strong>Live preview</strong> beside it:</p><ul><li><strong>Colour mode</strong>: <strong>Dark</strong> (the default), <strong>Light</strong> or <strong>Device</strong>, which follows each respondent's device.</li><li><strong>Accent colour</strong>: used for buttons, selections and the progress bar. Pick a swatch, <strong>Default</strong> or your own color as a 6-digit hex value like <code>#6366f1</code>.</li><li><strong>Corner radius</strong>: <strong>Square</strong>, <strong>Small</strong>, <strong>Medium</strong> (the default), <strong>Large</strong> or <strong>Round</strong>.</li><li><strong>Body font</strong> for questions, answers and buttons, and <strong>Heading font</strong> for titles (Same as body to start with). Search 100 fonts in four groups: Sans serif, Serif, Display and Monospace. Fonts load from Bunny Fonts, so respondents' IP addresses never reach Google.</li><li><strong>Background</strong>: <strong>Plain</strong> (the default), <strong>Gradient</strong> (a glow tinted by the accent color) or <strong>Image</strong>, which shows the <strong>Cover image</strong> behind the form.</li></ul><p>In the builder's <strong>Design</strong> section, the <strong>Header</strong> settings also add a cover at the top of the form, from a gradient or an image.</p>$html$,
      '[]',
      50
    ),
    (
      'welcome-and-ending-screens',
      'Design',
      'Welcome and ending screens',
      $html$<p><strong>Design → Welcome & Ending</strong> sets what respondents see before and after the form.</p><ul><li><strong>Show a welcome screen</strong> adds an intro before the first question, with a <strong>Title</strong>, a <strong>Body</strong> and a <strong>Button label</strong> (Start to start with). The body can recall values from the form's link, like <code>Hi {Name}</code>.</li><li><strong>After submission</strong> shows a <strong>Thank-you message</strong> with a <strong>Title</strong> and <strong>Message</strong> (Response submitted, to start with), or <strong>Redirect to URL</strong>, which sends respondents to another page. Merge tags work in both, including in the redirect's query string.</li><li><strong>Show score</strong> shows the response's score, or the quiz result, on the thank-you screen.</li><li><strong>Allow another submission</strong> adds a <strong>Submit another response</strong> button.</li></ul><p>When the form uses named outcomes, <strong>Outcome endings</strong> lists each one and whether it has its own ending, redirects or uses the default. Outcome endings are set on their branch in the builder. See <a href="/help/forms/logic#branches-and-outcomes">Logic and scoring</a>.</p>$html$,
      '[]',
      60
    ),
    (
      'branding-and-language',
      'Design',
      'Branding and language',
      $html$<p><strong>Design → Branding</strong> holds the form's <strong>Logo</strong>: upload an image, or link a PNG or SVG. It shows above the form's title only while <strong>Show form icon</strong> is on (in the builder's Design section, the same switch is called <strong>Show logo</strong>). Add <strong>Logo alt text</strong> for screen readers, unless the title already names your brand. Turn off <strong>"Powered by Geiger Forms" footer</strong> to remove Geiger branding from the public form.</p><p><strong>Design → Localization</strong> sets the <strong>Language</strong> of the form's built-in text, such as buttons, validation messages and dates: English (the default), Español, Français, Deutsch, Português, हिन्दी (Hindi) or العربية (Arabic). An Arabic form reads right to left. Your own questions and texts aren't translated, so write them in the same language.</p>$html$,
      '[]',
      70
    ),
    (
      'pages-and-conversational-mode',
      'Flow',
      'Pages and conversational mode',
      $html$<p><strong>Flow → Multi-step Pages</strong> sets how respondents move through the form.</p><ul><li><strong>Conversational mode</strong>: shows one question per screen. Respondents press <code>Enter</code> to move on (<code>Shift Enter</code> adds a new line in long text), and can press a letter key to pick a choice. When it's off, each page shows all of its questions.</li><li><strong>Progress bar</strong>: shows respondents how far along they are. It's on to start with.</li></ul><p>The <strong>Pages</strong> list shows each page with its number of fields, and marks pages that are skipped by conditions as <strong>Conditional</strong>. You add page breaks in the builder: <strong>Open builder</strong> takes you there. See <a href="/help/forms/builder#pages">Form builder</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'save-and-resume',
      'Flow',
      'Save and resume',
      $html$<p>While respondents fill in a form, Forms saves their progress as they go, so their unfinished answers show under <strong>Responses → Partial / Abandoned</strong>. <strong>Flow → Save & Resume</strong> controls how that works:</p><ul><li><strong>Save & resume</strong> (off to start with): adds a <strong>Save & continue later</strong> button. It gives respondents a link to pick up where they left off on any device, and can email it to them.</li><li><strong>Offline drafts</strong> (on to start with): keeps answers on the respondent's device, so a refresh or a lost connection doesn't lose work. A respondent who comes back is asked "Restore your draft?", and a response submitted offline is sent once the connection returns.</li><li><strong>Ask before saving progress</strong> (off to start with): respondents see <strong>Save my progress as I go</strong>, and nothing is stored on the server until they tick it. Unticking it deletes what was saved. Respondents who don't opt in never appear in Partial / Abandoned or the drop-off reports.</li></ul><p>Emailing a resume link needs email to be set up for your deployment.</p>$html$,
      '[]',
      90
    ),
    (
      'schedule-and-limits',
      'Flow',
      'Schedule and response limits',
      $html$<p><strong>Flow → Submission Rules</strong> starts with when the form accepts responses.</p><ul><li><strong>Opens on</strong> and <strong>Closes after</strong>: the form accepts responses between these dates, including both days, which start and end at midnight UTC. Before the start, respondents see <strong>Not open yet</strong> with the opening date. After the end, they see <strong>This form is closed</strong>.</li><li><strong>Closed message</strong>: what respondents read once the form has closed or is full.</li><li><strong>Maximum responses</strong>: the most responses the form takes. Leave it empty for no limit. Once it's reached, respondents see <strong>Response limit reached</strong>.</li><li><strong>Show remaining spots</strong>: shows respondents how many places are left, like "12 of 50 spots left".</li></ul><p>The same settings are under <strong>Schedule & limits</strong> in the builder. A published form that closes within the week or nears its limit is counted on the project overview.</p>$html$,
      '[]',
      100
    ),
    (
      'review-editing-and-attestation',
      'Flow',
      'Review, editing and attestation',
      $html$<p>The rest of <strong>Flow → Submission Rules</strong> sets how respondents confirm and change what they send.</p><ul><li><strong>Minimum review time (seconds)</strong>: blocks a response submitted faster than this. Respondents see a countdown before they can submit.</li><li><strong>Respondent edit link</strong>: after submitting, respondents get a private link to change their answers, on the thank-you screen and in their confirmation email. Choose how long it works: <strong>Off</strong> (the default), <strong>1 hour</strong>, <strong>24 hours</strong>, <strong>7 days</strong>, <strong>30 days</strong> or <strong>Always</strong>.</li><li><strong>Allow submitting on behalf of someone</strong>: signed-in respondents can tick "I'm submitting on behalf of someone else" and give that person's name and email.</li><li><strong>Require attestation</strong>: a required checkbox with your <strong>Statement</strong> right before the submit button.</li><li><strong>Require policy acknowledgement</strong>: respondents read a policy, from its <strong>Policy title</strong> and <strong>Policy text</strong> or a link to it, and confirm before the form opens. <strong>Must scroll to the end</strong> and <strong>Type full name to acknowledge</strong> are on to start with. The form's report lists who acknowledged it.</li></ul>$html$,
      '[]',
      110
    ),
    (
      'duplicate-detection',
      'Flow',
      'Duplicate detection',
      $html$<p>Duplicate detection spots a respondent submitting the same form twice. Under <strong>Flow → Submission Rules</strong>, turn on <strong>Detect duplicates</strong>, then:</p><ul><li>Under <strong>Match on</strong>, select the fields to compare: short text, email, phone, full name, number, website and hidden fields. A response is a duplicate when every selected field matches an earlier response.</li><li><strong>Look back (days)</strong>: how far back to compare, 30 days to start with.</li><li><strong>When a duplicate arrives</strong>: <strong>Accept and flag it</strong> (the default) saves it with the status Needs review, and <strong>Block the submission</strong> turns it away with "It looks like you've already submitted this form."</li></ul><p>Fields marked as sensitive are never compared.</p>$html$,
      '[]',
      120
    ),
    (
      'notifications',
      'Settings',
      'Notifications',
      $html$<p><strong>Settings → Notifications</strong> sets the emails a form sends. These need email to be set up for your deployment, and the section warns you when it isn't.</p><ul><li><strong>Email respondents a confirmation</strong>: sends the respondent a <strong>Subject</strong> and <strong>Body</strong> of your choosing, with a copy of their answers, right after they submit. It goes to the first email answer, so the form needs an Email field. Merge tags work in both.</li><li><strong>Email these people on every new response</strong>: type addresses and press <code>Enter</code>. Each new response sends them its answers and a link to open it, with sensitive answers hidden. Replying goes to the respondent.</li><li><strong>Notify in Geiger Flow</strong>: puts a notification in the bell at the top of Forms for the form's creator and everyone with a role in the project.</li><li><strong>Weekly report</strong>: the people who get the form's weekly digest. See <a href="/help/forms/analytics#weekly-digests">Analytics</a>.</li></ul><p><strong>Add follow-up</strong> schedules a later email to each respondent, with <strong>Send after (hours)</strong> (24 to start with), a <strong>Subject</strong> and a <strong>Body</strong>. Forms sends follow-ups once a day, so each goes out on the first daily run after its delay. It's sent once per response, only while the form is published and never for responses marked Spam.</p>$html$,
      '[]',
      130
    ),
    (
      'who-can-respond',
      'Settings',
      'Who can respond',
      $html$<p><strong>Settings → Access & Sharing</strong> starts with <strong>Who can respond</strong>:</p><ul><li><strong>Anyone with the link</strong> (the default): no sign-in.</li><li><strong>Password</strong>: respondents enter a shared password. Type at least 4 characters and choose <strong>Set password</strong> (or <strong>Change</strong>), then <strong>Save changes</strong>. <strong>Remove</strong> clears it.</li><li><strong>Signed-in users</strong>: respondents sign in with their Geiger account.</li><li><strong>Organisation domain</strong>: only people signed in with an email on the <strong>Allowed email domain</strong>, like <code>company.com</code>.</li><li><strong>Signed links only</strong>: only personal signed links made under <strong>Share & Send</strong> work. See <a href="/help/forms/sharing#signed-links">Publishing and sharing</a>.</li></ul><p><strong>One response per person</strong> asks respondents to sign in, then accepts one response from each account. Someone who has already responded sees "You've already responded to this form."</p>$html$,
      '[]',
      140
    ),
    (
      'spam-protection-and-privacy',
      'Settings',
      'Spam protection and privacy',
      $html$<p>The rest of <strong>Settings → Access & Sharing</strong> covers spam and privacy for one form:</p><ul><li><strong>Honeypot field</strong> (on to start with): a field people can't see but bots fill in. Forms quietly discards those responses.</li><li><strong>CAPTCHA challenge</strong> (off to start with): respondents pass a check before submitting. It needs captcha to be set up for your deployment.</li><li><strong>Rate limit</strong>: the most submissions per hour from one network, 20 to start with.</li><li><strong>Anonymous responses</strong>: doesn't store the respondent's IP hash, browser details or signed-in account.</li><li><strong>Delete responses after</strong>: responses older than this many days are erased automatically. Leave it empty to keep them.</li></ul><p><strong>Team access</strong> records who you've shared the form with, as <strong>Can view</strong>, <strong>Can edit</strong> or <strong>Admin</strong>. It's a record only: what each person can do comes from their role. The <a href="/help/forms/security">Security and compliance</a> guide covers spam, retention and roles across the project.</p>$html$,
      '[]',
      150
    ),
    (
      'sensitive-fields-and-access-log',
      'Settings',
      'Sensitive fields and the access log',
      $html$<p><strong>Settings → Security & Compliance</strong> counts the form's sensitive fields and recent access events, and shows its HIPAA readiness score.</p><ul><li><strong>Sensitive fields</strong> lists the fields marked as sensitive in the builder. Their answers are encrypted before they're stored, masked in the Response Inbox and shown only when a teammate reveals them. If encryption isn't set up for your deployment, a warning says so, and sensitive answers are stored unencrypted.</li><li><strong>HIPAA readiness</strong> is a checklist of seven safeguards: sensitive fields marked, encryption set up, restricted access, a retention period, no answers in plain-text alerts, the access log and a Business Associate Agreement with your providers. Forms provides the controls, and compliance also depends on your own agreements and processes.</li><li><strong>Access log</strong> lists the latest 25 times someone viewed, revealed, exported, printed or edited a response to this form, with who it was and which field.</li></ul>$html$,
      '[]',
      160
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"GitFork","label":"Logic & scoring","href":"/help/forms/logic"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"CreditCard","label":"Payments","href":"/help/forms/payments"},{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"},{"icon":"ShieldCheck","label":"Security & compliance","href":"/help/forms/security"}]',
      170
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/form-settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Form settings',
    description = 'Change a form''s details, design, pages, submission rules, notifications and access from its settings.',
    status = 'draft',
    published_at = null
where slug = 'forms/form-settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/form-settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening and saving form settings</li><li>Details</li><li>Themes and colors</li><li>Welcome and ending screens</li><li>Branding and language</li><li>Multi-step pages</li><li>Save and resume</li><li>Submission rules</li><li>Notifications</li><li>Access</li><li>Security and compliance</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/form-settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
