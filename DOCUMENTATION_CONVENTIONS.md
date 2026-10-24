# Documentation Conventions (Help Center)

How to research, write, update and ship Geiger's end-user documentation: the
**Help Center** at `/help`. This file is written so an LLM agent can do that job
with no other context. Read all of it before you write or change a help page.

Reference pages, which show these rules applied:

- **Area guide:** Flow Tasks, `/help/flow/tasks`, written by
  `supabase/migrations/20261024124814_help_flow_tasks_page.sql`
- **Product overview + sidebar group:** Flow, `/help/flow`, written by
  `supabase/migrations/20261023200049_help_flow_guide.sql` (also rewrites the home page)

Every Flow area has a guide, written in `20261024142436_help_flow_structure.sql`
through `20261024143901_help_flow_tasks_related_guides.sql`; the Flow overview was
brought in line with this file in `20261024142451_help_flow_overview_page.sql`.
One older part still doesn't follow it. Don't copy it, and fix it the next time
you touch the page:

- Welcome's "How Geiger fits together" and "Apps in the suite" feature tiles hold
  facts no section text repeats (§2.3).

Related playbooks: `MIGRATION_CONVENTIONS.md` (content ships as migrations),
`SUPABASE_CONVENTIONS.md`, `crafting.md` (UI work on the Help Center itself).

---

## 0. The rules, in one place

1. **The product code is the source of truth.** Every factual claim (a label, a
   default, an option list, a limit, a shortcut, a behavior) must trace to code in
   the product's repo. If you can't find it in the code, it doesn't go in the docs.
2. **Read the live page before you replace it.** Run
   `node --env-file=.env scripts/help-snapshot.mjs <slug>`. If an editor changed the
   page in Studio, your migration starts from the live HTML, not from an old file.
3. **One page covers one product area. One section answers one question.** Sections
   are what the TOC, ⌘K search, Ask AI and `#anchors` work with, so each one has to
   make sense read on its own.
4. **Every fact lives in section `content`.** Cards, features, links and showcases
   never reach search or Ask AI, so they can't be the only place a fact appears.
5. **Write to the reader, plainly.** Second person, present tense, active voice,
   American English, sentence case. No hype, no filler, no em dashes.
6. **Name the UI exactly as it appears on screen, and give each concept one name.**
   Labels go in `<strong>`, menu paths use `→`, keys go in `<code>`. The terms
   table is in §5.3.
7. **Write only the HTML in §6.** Studio's editor drops tables, `div`, `span` and
   `style` the next time someone saves the page. `h1` and `h2` would survive, but
   they clash with the page and section headings, so don't use them either.
8. **Count the components before you write, then place each one where it fits.**
   Run `scripts/help-snapshot.mjs --components` and plan which section gets which
   showcase, cards, features or links (§7). Use every showcase that matches a
   section, at most one per section. Keep the whole-app preview for home and
   overview pages.
9. **Ship content as a one-time content migration.** Never use a seed, and never
   run SQL by hand. `db:push` writes straight to the live Help Center.
10. **Treat slugs and anchors as permanent URLs.** Once a page is published, don't
    rename it. If you have to, add a redirect and fix every link to it.
11. **Publish only finished pages.** Drafts carry an outline. Published pages carry
    no placeholders, no "coming soon", and no claims you haven't checked.
12. **Docs ship with the feature.** A user-visible product change isn't done until
    the help page describing it is right.

---

## 1. What counts as documentation

The Help Center is for **people using the suite**: members and admins of an
organization, signed in or evaluating. It explains what they can do and how to do
it. It isn't the place to sell, announce or explain internals.

| Surface | URL | Written for | Lives in | Rules |
|---|---|---|---|---|
| **Help Center** | `/help`, `/help/<slug>` | users and admins | `public.docs_*` tables | **this file** |
| Changelog | `/changelog` | customers following releases | changelog pipeline | `lib/changelog/prompts.js` |
| Blog | `/blog` | prospects, search | blog tables | `docs/blog-automation.md` |
| Feature / SEO pages | `/features/…`, `/solutions/…` | prospects | `public.dash_seo_pages` | `lib/pages-studio/skills/*` |
| Repo conventions | `*.md` in a repo | engineers and agents | git | per file |
| **Geiger Docs (a product)** | `/docs/*` | document signing users | another app | not documentation |

- `/docs` is **not** the docs. `next.config` rewrites `/docs/*` to the Geiger Docs
  product (document signing), so a page there can never render from this app.
  Documentation lives at `/help`.
- Help pages don't date themselves ("new in October", "recently added", version
  numbers). That's the changelog's job. Describe how things work now.
- Help pages describe the product, not the code: no table names, routes, component
  names, environment variables or library names, unless a user actually types or
  sees them.

---

## 2. How the Help Center works

### 2.1 Map

| Concern | Location |
|---|---|
| Public routes | `app/help/page.js` (home, at bare `/help`), `app/help/[...slug]/page.js` |
| Reads | `lib/docs/queries.js` |
| Rendering | `components/help/help_center.jsx` |
| URLs | `lib/docs/paths.js`: `helpHref(slug, { anchor, preview })`, `HELP_HOME_SLUG = "welcome"` |
| Slug and anchor rules | `lib/docs/text.js`: `slugify`, `normalizeHelpSlug`, `htmlToText` |
| Showcase registry | `lib/docs/showcases.js`: `HELP_SHOWCASES`, `HELP_APP_VIEWPORT` |
| Whole-app preview apps | `SANDBOX_APP_IDS` in `components/why-geiger/why_geiger_content.js` |
| ⌘K search | `getDocsSearchEntries()` in `lib/docs/queries.js` |
| Ask AI | `lib/docs/ask.js` (signed-in users, published pages only) |
| Studio editor | `/studio/help`: `components/help-studio/*`, `app/studio/help/actions.js` |
| Atomic save | `public.docs_save_page(p_page, p_sections)` RPC, which replaces all of a page's sections |
| Who can edit | `public.content_editors` allowlist, `supabase/seeds/content_editors.sql` |
| Sitemap | `lib/sitemap/generate-sitemap.js` (published pages except home, refreshed daily) |
| Fallback | `lib/docs/default-content.js` (only renders when the tables can't be read) |
| Live snapshot and component inventory | `scripts/help-snapshot.mjs` (read-only) |
| Schema and content history | `supabase/migrations/*docs*.sql`, `*help*.sql` |

### 2.2 Data model

**`public.docs_nav_groups`**: the sidebar groups.

| Column | Meaning |
|---|---|
| `title` | Group heading in the sidebar |
| `slug` | Unique key (`get-started`, `workspace`, `flow`, `products`) |
| `sort_order` | Lower comes first. Today: Get Started 10, Workspace 20, Flow 25, Products 30 |

A group with no visible pages is hidden. Groups have no soft delete: only an
empty group can be deleted.

**`public.docs_pages`**: one row per page.

| Column | Meaning and rules |
|---|---|
| `slug` | The URL, `/help/<slug>`. Segments are lowercase and dash-separated, joined by `/`. Unique among live pages. `welcome` is the home page and always renders at bare `/help` |
| `title` | The page `<h1>` and the browser title (`<title> - Geiger Help Center`). The home page's browser title and meta description are fixed in `app/help/page.js` |
| `nav_label` | Sidebar label. Leave it null to reuse the title; set it when the title is long or repeats the group (`Overview`) |
| `description` | The lead paragraph under the `<h1>`, the `<meta name="description">`, and match text for ⌘K search |
| `status` | `draft` (editors only), `published` (public), `archived` (hidden, kept) |
| `nav_group_id` | Its sidebar group |
| `parent_id` | Optional parent, one level deep. The parent must be a top-level page in the same group. Studio enforces this but a migration doesn't, and the sidebar only draws one level, so a grandchild page silently disappears |
| `sort_order` | Order within the group or parent. Use 10, 20, 30 |
| `preview` | App id whose whole live sandbox fills the hero (`flow`). Only for home and overview pages (§8). Studio can't edit it, so only a migration sets it |
| `published_at` | Set the first time a page is published, and kept after that |
| `deleted_at` | Soft delete. Frees the slug |
| `created_by`, `metadata` | Set by Studio, and an unused expansion bag |
| `toc`, `has_children` | Legacy and ignored. "On this page" is built from section titles |

**`public.docs_content_blocks`**: a page's sections, in `sort_order`.

| Column | Renders as |
|---|---|
| `anchor_id` | `<section id>`, so `/help/<slug>#<anchor_id>`. Unique per page, short, and already in `slugify` form (lowercase, dashes), because Studio re-slugifies it on save. Usually the title's key words: `task-list`, `status-priority-stage`, `shortcuts` |
| `eyebrow` | Small label above the heading (§3.3) |
| `title` | The section `<h2>`, its "On this page" entry and its ⌘K entry. A section without a title is left out of all three. The column is `not null`, so an untitled section is `''` |
| `content` | Section body, as HTML (§6) |
| `cards` | `[{ icon, title, body, href }]`: large linked tiles, three per row |
| `features` | `[{ icon, text }]`: icon plus a short line, two per row |
| `links` | `[{ icon, label, href }]`: compact link buttons, three per row |
| `showcase` | A showcase id from `lib/docs/showcases.js` (§8) |
| `sort_order` | 10, 20, 30. Studio rewrites it as 10 × position on every save |
| `body`, `block_type` | Legacy and ignored |

A page renders in this order: group title (as an eyebrow), `title`, `description`,
the `preview` hero, then each section. A section renders its eyebrow, title,
content, cards, features, links and showcase, in that order.

**Visibility.** RLS shows published, non-deleted pages to everyone; content editors
see everything. An editor previews a draft at `/help/<slug>?preview=1`, which is
noindexed and shows a "Draft preview" banner.

### 2.3 What each field reaches

| | Page | ⌘K search | Ask AI | Copy page | Search engines |
|---|---|---|---|---|---|
| Page `title` | `<h1>` | page entry | heading match | yes | `<title>` |
| Page `description` | lead | page keywords | **no** | yes | meta description |
| Section `title` | `<h2>`, TOC | section entry | heading match (weighted 4×) | yes | yes |
| Section `content` | body | first 160 characters, as match text | first 2,500 characters | yes | yes |
| `cards` / `features` / `links` | tiles | **no** | **no** | yes | yes |
| `showcase` / `preview` | live iframe | **no** | **no** | **no** | **no** |
| Drafts | preview only | no | no | n/a | noindex |

⌘K never shows the 160 characters; it only matches against them. Ask AI skips a
section whose `content` is empty, title and all, so a tiles-only section never
reaches it. Ask AI matches whole query words as substrings, so "create" doesn't
match "Creating".

What follows from this:

- **Put every fact in `content`.** A tile can summarize or link to something a
  section covers, here or on another page. A fact that appears only in a tile
  can't be found or answered.
- **Use the reader's words in section titles.** Ask AI ranks sections by keyword
  matches and weights the title most. "Inviting members" will be found;
  "Growing your crew" won't.
- **Lead each section with its most useful sentence**, and use the plain verb in it
  ("To create a task…", or the **Create Task** label). The first 160 characters are
  what ⌘K matches, and a gerund title alone won't match "create".
- **Keep a section to about 2,500 characters of text** (roughly 350 to 400 words).
  Ask AI cuts off the rest. If a section runs longer, split it.
- **Make each section self-contained.** Ask AI sees a section without its
  neighbors, its showcase or the page description. Name things outright; don't
  write "as described above", "this screen" or "the demo below".

---

## 3. Information architecture

### 3.1 Groups and slugs

| Group | Slug pattern | Holds |
|---|---|---|
| Get Started | `welcome`, `quickstart`, `core-concepts`, `plans-pricing` | Orientation for the whole suite |
| Workspace | `workspace/<topic>` | Features owned by Dash (this repo): organizations, members, projects, billing, add-ons, sign-in |
| *Product group* (Flow) | `<app>` for the overview, `<app>/<area>` for each area | A product with more than one page |
| Products | `products/<app>` | A single overview page for a product that has no group of its own yet |

- **Name pages after the product area, the way the product's sidebar names it**
  (`flow/tasks`, `flow/issues`, `workspace/members`), not after a verb or a feature
  pitch.
- A top-level page has at most two segments (`<group>/<page>`; a product overview
  is just `<app>`). A child page (`parent_id`) adds one to its parent's slug,
  `<parent-slug>/<child>`, the way Studio's auto-slug does.
- Nest only when one area genuinely has several sub-guides. Don't nest just to
  group pages together; that's what sidebar groups are for.
- Leave gaps in `sort_order` (10, 20, 30…) so a page can be added between two
  others without renumbering.

**Graduating a product** (what Flow did in `20261023200049_help_flow_guide`).
When a product is about to get its second page:

1. Create the group: slug = app id, title = product short name (`Flow`), and a
   `sort_order` between Workspace (20) and Products (30). Flow took 25.
2. Re-home `products/<app>` by **updating** its row, so it keeps its id: slug
   `<app>`, `nav_label` `Overview`, the new group, and `preview` set to the app id
   if the app is in `SANDBOX_APP_IDS`.
3. Add area pages as drafts with outlines, at `<app>/<area>`, following the
   product's own sidebar order.

Re-homing a *draft* breaks nothing. Re-homing a *published* page breaks its URL,
so follow §10.6.

### 3.2 Page types

Pages are organized the way users navigate the product (by area), not by document
type. Inside a page, each section has one job, and its eyebrow says which (§3.3).
This adapts the Diátaxis split (tutorial, how-to, reference, explanation) to a help
center: tasks and reference for one area sit on the same page, in separate sections.

| Type | Example | Purpose | Shape |
|---|---|---|---|
| **Home** | `welcome` | Orient a new reader to the suite | "Start here" cards; how the pieces fit (organization → projects → apps); the apps; getting help. Whole-app preview allowed |
| **Product overview** | `flow`, `products/<app>` | What the app is for and where everything is | "Start here" cards; how to open it; what's in it (a `features` list of areas, each also described in `content`); one section per headline capability, each linking to its area guide. Whole-app preview allowed |
| **Area guide** | `flow/tasks` | Everything a user does in one area | Basics (create the thing) → Concepts (the model: states, types) → one section per screen or panel → Reference (shortcuts, limits) → Troubleshooting if needed. Showcases on the component sections |
| **Concept page** | `core-concepts` | Explain how things relate | Explanation only, no procedures. Link out to the guides that act on each concept |
| **Workspace guide** | `workspace/members` | A Dash-owned area | Same shape as an area guide, researched in this repo |

### 3.3 Sections and eyebrows

Each section answers one question, and its eyebrow names the kind of answer:

| Eyebrow | Section job | Title style | Example |
|---|---|---|---|
| `Basics` | The first thing people do in the area | Gerund phrase | "Creating a task" |
| `Concepts` | The model behind it: states, types, how parts relate | Noun phrase | "Status, priority and stage" |
| *UI area* (`Tasks`, `Work Queue`, `Issues`) | One screen, panel or capability, and what you can do there | Noun phrase, or a gerund for an action | "The task list", "Task details", "Editing and deleting" |
| `Reference` | Lookup material: shortcuts, limits, option lists | Noun phrase | "Keyboard shortcuts" |
| `Troubleshooting` | One symptom, its cause and the fix | The symptom, stated plainly | "Invite email didn't arrive" |
| `Support` | Where to get more help | Noun phrase | "Getting help" |

This table is for area and workspace guides. On home and overview pages, the
eyebrow names the section's topic instead (`Concepts`, `Apps`, `Workspace`,
`Issues`, `Chat`, `Support`). Leave the eyebrow empty on a "Start here" cards
section. Don't invent eyebrows as teasers ("Pro tip", "Did you know?").

Order sections the way a reader meets the area: create → understand → work with
it → look things up. On an area guide, the first section is usually `Basics`.

A troubleshooting section opens with the symptom as the reader would describe it,
says why it happens, then gives the fix as steps. Once a page has five or more,
move them to their own page.

### 3.4 Page titles and descriptions

- **Title:** the area's name as the product's sidebar shows it ("Tasks", "Members
  & roles"). Use a fuller name only when the sidebar's would be unclear out of
  context: Flow's "Issues" becomes "Issue tracker". At most about 40 characters. The browser title adds
  " - Geiger Help Center", and anything past about 60 characters gets cut off in
  search results.
- **Description:** one or two sentences, at most 160 characters, naming the tasks
  the page covers in the reader's words. It's the lead paragraph, the search
  snippet and the meta description, so it starts with the point: "Plan a
  project's work as tasks: set status, priority and stage, assign people, talk it
  through in comments, and work through it all in the Work Queue." Never "This
  page explains…".
- **Nav label:** set it only when the sidebar needs something shorter than the
  title ("Overview" for "Geiger Flow").

---

## 4. Research: get the facts from the code

The Flow pages were written from a survey of `C:\Pro\geiger-flow`. Every page works
that way. **Never write a help page from memory, from marketing copy, from the
changelog, or from what the feature "probably" does.**

### 4.1 Where each app lives

| App | id (slug, `preview`, showcase prefix) | Repo | Whole-app sandbox | Component showcases |
|---|---|---|---|---|
| Dash (organization, members, projects, billing, add-ons, sign-in) | n/a | this repo | n/a | n/a |
| Flow | `flow` | `C:\Pro\geiger-flow` | yes | yes |
| Notes | `notes` | `C:\Pro\geiger-notes` | yes | not yet |
| Events | `events` | `C:\Pro\geiger-events` | yes | not yet |
| Assets | `assets` | `C:\Pro\geiger-assets` | yes | not yet |
| Campaign | `campaign` | `C:\Pro\geiger-campaign` | yes | not yet |
| Content | `content` | `C:\Pro\geiger-content` | yes | not yet |
| Pods | `pods` | `C:\Pro\geiger-pods` | yes | not yet |
| Forms | `forms` | `C:\Pro\geiger-forms` | no | no |
| Grey | `grey` | `C:\Pro\geiger-grey` | no | no |
| Comms | `comms` | `C:\Pro\geiger-comms` | no | no |
| Property | `property` | `C:\Pro\geiger-property` | no | no |
| Office, Docs | `office`, `docs` | not checked out here | no | no |

"Whole-app sandbox" means the app id is in `SANDBOX_APP_IDS`. Property serves a
`/property/playground` page but isn't in that list, so a help page can't use it
until it's added. If a repo isn't on disk, ask the user for it. Don't write the
page from guesses.

### 4.2 The survey

1. **Find the area.** Start from the product's sidebar, the way a user would. In
   Flow, the labels and their order are `projectNav` in
   `components/internal/sidebar/projects/sidebar_data.js`. Other apps differ:
   search the repo for the sidebar label you expect, or for
   `sidebar_nav.jsx` / `registry.jsx` where they exist. Then open the screen, its
   dialogs, its detail panel and its settings.
2. **Copy labels exactly.** Button text, field labels, menu items, tab names, column
   headers, empty states and confirmation text, with their case. Use the label the
   user sees, even when the code calls it something else.
3. **Record behavior, not intent.** For each control, note:
   - what's required (`disabled` until…) and what the defaults are (initial state,
     column defaults);
   - the option sets, from the `*_MAP` / `*_OPTIONS` constants, in the UI's order;
   - how things sort and filter (read the comparator, not the label);
   - whether a change saves on its own or needs a Save button;
   - whether a delete asks first, whether it's soft, and whether the user can
     restore it;
   - who can do it (role checks), and only when the code actually gates it;
   - side effects the user notices: emails, notifications, toasts;
   - limits: page sizes, steps, maximums.
4. **Check that it ships.** Behind a flag, on a "Coming soon" screen, or only on a
   branch: leave it out.
5. **Look at it running.** If a playground exists, open `/<app>/playground` (or the
   component route) and confirm what you read in the code.
6. **When the code is ambiguous, ask or leave it out.** Don't paper over doubt with
   "may", "might", "typically" or "should".
7. **Leave a trail.** Name the repo and the surveyed paths in the migration header
   (§9.3), so the next agent can re-check the page against the same code.

### 4.3 Keeping pages true

- When you change user-visible behavior in any product, search the Help Center for
  that area (`scripts/help-snapshot.mjs`, or grep `supabase/migrations/*help*`) and
  update the page in the same piece of work.
- When you find a page that disagrees with the code, the code wins: fix the page.
  If the code looks like the bug, tell the user instead of documenting it.
- Removed features come off the page entirely. Don't leave "no longer available"
  notes; the changelog records removals.

---

## 5. Writing style

### 5.1 Voice

- **Talk to the reader as "you".** Refer to the product by name ("Flow asks you to
  confirm first"). Don't write "we", "our" or "the system".
- **Present tense, active voice.** "Flow saves each change as you make it", not
  "Changes will be saved". Passive is fine when who does it doesn't matter
  ("Edited comments are marked *edited*").
- **Calm and precise, like a teammate who built it.** Say what happens. Don't
  praise it.
- **Contractions are fine** (can't, doesn't, there's), and the published pages use
  them.
- **No hype, filler or AI tells.** No emojis, exclamation marks or rhetorical
  questions. See §5.7 and §5.8.
- **Start with the point.** Don't write about the page ("This page explains…", "In
  this guide…"), don't open the description by repeating the page title, and
  don't end a section with a summary of what it just said. Inside a section, do
  name its subject in the first sentence ("Grounding is the project's own chat"),
  because the section may be read alone.

### 5.2 Mechanics

- **American English**: organization, color, canceled, prioritize.
- **Sentence case** for page titles, section titles, eyebrows, cards and labels you
  write: "Creating a task", "Keyboard shortcuts". UI labels keep whatever case the UI
  uses. (The `Get Started` group title predates this rule; leave it as it is.)
- **No serial comma** in a simple list: "status, priority and stage". When the
  items are clauses that carry commas of their own, add one before the last "and"
  so the list stays readable ("set status, priority and stage, assign people, and
  work through it all in the Work Queue").
- **No em dashes.** Use a colon, a comma, parentheses or a new sentence. The
  published help copy has none, and GitLab's style guide bans them for the same
  reason: they're the most common AI tell.
- **Short sentences.** Aim for under 25 words. Keep paragraphs to four sentences
  at most; one is fine.
- **`&` only in page titles and nav labels** ("Members & roles", "Milestones &
  goals"). In body copy, write "and".
- **Numbers.** Spell out zero to nine in ordinary prose ("three markers"). Use
  numerals for 10 and up, and for every setting, limit, measurement or value the UI
  shows: "10 tasks a page", "steps of 5%", "25, 50 or 100", "from 0% to 100%".
- **Product names.** "Geiger Flow" as the overview page title and in a first
  mention where the suite context matters; "Flow" everywhere else. Feature names
  match the UI: Work Queue, Grounding, Ask AI.
- **Headings carry no end punctuation** and aren't questions, except a
  troubleshooting symptom. Section titles are gerunds for actions ("Creating a
  task", "Inviting members") and noun phrases for things ("Task details"). That's
  the house choice, which the published pages and outlines already use, so don't
  mix in imperative titles ("Create a task"). On a published page, never title a
  section "Overview", "Introduction" or "How it works": say what it covers.
- **Lists:** punctuate every item in a list the same way. When any item runs to a
  second sentence, end them all with a period. Short one-line items, like a
  shortcut list, can go without.

### 5.3 Terminology

Use one name for each concept, everywhere. Ask AI and readers both get confused
when one thing has several names.

| Use | Not | Meaning |
|---|---|---|
| organization | org, workspace, team, company, account | The top-level container for members, billing, add-ons and settings. The "Workspace" sidebar group is the one exception: it names the group of organization guides, never the organization itself |
| project | workspace, space | The shared home for a piece of work, opened in any app |
| member | user, seat (except on billing pages) | A person in an organization. "Teammates" is fine in a friendly sentence |
| app | product, module, tool | Flow, Notes, Events and the rest, in body copy. The sidebar group is still called "Products" |
| the suite, Geiger | the platform, the system | Everything together |
| Dash | dashboard, the admin | Where organizations and projects are managed |
| sign in, sign up, sign out | log in, login, register | The account actions |
| Help Center | docs, documentation site, knowledge base | This site |
| Ask AI, search | chatbot, assistant | The Help Center's own tools |

When an app has its own terms (Flow's tasks, issues, cycles, divisions), use the
app's UI names exactly. When a feature is renamed in the product, rename it on every
page and add the old name to this table's "Not" column.

Studio, content editors, migrations and tables are invisible to readers. Never
mention them in help copy.

### 5.4 Referring to the UI

| Thing | How to write it | Example |
|---|---|---|
| A labeled control (button, menu item, tab, sidebar entry, field, sort option) | Exact label in `<strong>`, no quotes, no trailing `…` or `:`. Add "button" or "field" only when it's ambiguous without it | `choose <strong>Create Task</strong>` |
| A path through menus or settings | One `<strong>`, steps joined by ` → ` | `<strong>Settings → General → Default rows per page</strong>` |
| An unlabeled icon | Describe its look and position | "the pencil at the top", "the trash icon", "each row's <strong>⋯</strong> menu", "the × beside their name" |
| A state or option value in prose | Plain text, UI case | "new tasks start as To Do with Medium priority" |
| Keys | `<code>`, keys separated by a space, Windows first and Mac in parentheses | `<code>Ctrl K</code> (<code>⌘ K</code> on Mac)`, `<code>Esc</code>` |
| Text the user types | `<code>` | `separate them with commas, like <code>frontend, release</code>` |

Verbs:

| Action | Verb |
|---|---|
| Buttons, menu items, sidebar entries, options | **choose** |
| A row, card or item without a label | **click** |
| Keyboard | **press** |
| Text fields | **type**, or **write** for longer text |
| Sliders, reordering | **drag** |
| Pointer reveal | **hover over** |
| Switches | **turn on**, **turn off** |
| Checkboxes | **select**, **clear** |

- Name surfaces the way the UI behaves: a **dialog** (not pop-up or modal), the
  **details** panel, a **menu**, the **sidebar**. Things are *in* a dialog, panel,
  menu or field, and *on* a page or tab.
- Don't turn a label into a verb: "In **Labels**, type…", not "**Label** the task…".
- Never describe a control by color or position alone ("the green button on the
  right"). Name its label, or its icon and place.

### 5.5 What precise help copy always says

Good pages answer the questions a reader would otherwise have to test for. For
every task and control, cover whichever of these the code shows:

- **What's required, and what the defaults are.** "Only the title is required." /
  "New tasks start as To Do with Medium priority."
- **Whether it saves on its own.** "Everything here saves as you change it, so
  there is no Save button."
- **What's permanent, and whether Flow asks first.** "Flow asks you to confirm
  first, and a deleted task can't be restored from Flow." / "**Delete** here
  removes the task straight away, without asking."
- **Scope: who it affects.** "That only changes your own sidebar."
- **What doesn't change.** "Search and filters don't change them."
- **Exact sets and limits.** "Switch to 25, 50 or 100 at the bottom."
- **How two similar things differ.** "Status and stage are set separately, so a
  task can be In Progress while it sits in Testing."
- **Who can do it, when the code limits it.** A role or plan requirement goes in
  the section itself, not only at the top of the page, because a section is often
  read alone.

### 5.6 Procedures

- For a sequence, use `<ol>` with one action per step, and about eight steps at
  most. Put the place first, then the action: "In the task's details, choose
  **Assign**", not "Choose **Assign** in the task's details". A goal can lead too:
  "To clear the stage, choose **No stage**."
- A two-step path can stay in a sentence: "Choose **Tasks** in the sidebar, then
  **Create Task**."
- Include the step that finishes the job (**Create Task**, **Save**, `Enter`), and
  state the result when it isn't obvious: "The task opens in its details."
- Start an optional step with "Optional:".
- Document the one recommended way to do something. If a second way matters (the
  ⋯ menu and the trash icon both delete), mention it in a sentence; don't write a
  second procedure.
- Each procedure lives on one page. Elsewhere, link to its anchor instead of
  repeating it.
- Don't number things that aren't a sequence. Properties and options go in a `<ul>`
  as `<strong>Label</strong>: what it does, and its default`.
- Put a warning right where the action is, as a plain sentence that leads with the
  consequence. There's no callout component, and notes collected at the end of a
  page get skipped.

### 5.7 Words to avoid

| Avoid | Why | Write instead |
|---|---|---|
| seamless, powerful, robust, effortless, intuitive, best-in-class, game-changing, cutting-edge | hype; tells the reader nothing | what it actually does |
| simply, just, easily, quickly, of course, obviously | condescending, and wrong when the reader is stuck | drop the word |
| unlock, supercharge, empower, elevate, leverage, harness, streamline | marketing verbs | use, set, add, open |
| delve, dive into, navigate the world of, in today's… | AI tells | say the thing |
| it's worth noting, notably, furthermore, moreover, additionally, importantly | filler connectives | start with the fact |
| may, might, typically, generally, should (about product behavior) | uncertainty dressed up as fact | check the code, then state it, or leave it out |
| please | unnecessary in instructions | the imperative |
| click here, learn more, this link | link text says nothing | name the destination |
| new, now, recently, soon, coming soon, when describing a feature ("the new Work Queue") | dates the page | describe current behavior. "New tasks start as To Do" is fine: there, "new" describes the task |
| we, our, the system | wrong voice | the product's name, or "you" |
| above, below, the following (pointing at other sections or the demo) | breaks once a section is read alone | name the thing |
| allows you to, enables you to, gives you the ability to | wordy | lets you, or start with the verb |
| in order to, via, e.g., i.e., etc., and/or | stiff or vague | to, through, for example, that is, or list the items |
| since (meaning because) | ambiguous | because |
| navigate to | wordy | go to, open |
| log in, login | wrong term (§5.3) | sign in |
| pop-up, modal | wrong term | dialog |

### 5.8 AI tells to cut

Machine-written docs have recognizable habits. Each one costs the reader time and
makes the page harder to trust, so check every draft for them:

- **Puffery and inflated significance:** "serves as", "boasts", "a testament to",
  "plays a pivotal role", "at its core". Write "is" and "has".
- **Trailing -ing phrases** that add a claim nobody checked: "…, ensuring your team
  stays aligned", "…, making collaboration effortless". Cut them.
- **Formula sentences:** "not only X but Y", "it's not X, it's Y", and lists of three
  added for rhythm rather than because there are three things.
- **Restating and summarizing:** a section that repeats its own first sentence at
  the end, or a closing "Key takeaways".
- **Mechanical formatting:** bold on anything that isn't a UI label or a term at
  the point it's defined, and every paragraph turned into bullets.
- **Hedges and vague attribution:** "typically", "in most cases", "many teams find".
- **Invented specifics:** a plausible label, limit or menu path that isn't in the
  code. This is the worst one, and §4 exists to prevent it.

---

## 6. Section HTML

Section `content` is HTML from Studio's Tiptap editor (StarterKit + Image). A content
migration has to write HTML that survives being opened and saved in Studio,
because Tiptap silently drops anything it doesn't understand.

| Use | For |
|---|---|
| `<p>` | Paragraphs, of four sentences at most |
| `<strong>` | UI labels (§5.4), and a term at the point it's defined ("A task is **overdue** once…"). Keep a trailing colon outside it: `<strong>Status</strong>:` |
| `<em>` | Only for text the UI shows in italics (`<em>edited</em>`) |
| `<code>` | Keys, typed values, literal strings |
| `<ul>`, `<ol>`, `<li>` | Options and properties, and steps |
| `<a href>` | Links (rules below) |
| `<h3>` | Rarely. If a section needs sub-headings, it's usually two sections |
| `<pre><code>` | Literal multi-line values only, which help pages rarely need |
| `<blockquote>`, `<hr>`, `<img>` | Avoid. Use `<img>` only when nothing live can show it (§8). Its `alt` says what the image shows in at most 155 characters, without "Image of", and the text around it still carries every fact |

**Never write** `<table>`, `<div>`, `<span>`, `<kbd>` (use `<code>`), `<mark>`,
`<iframe>`, `<script>`, `<details>`, or `class`, `style` or `id` attributes: Studio
drops them on its next save, and the article styles in `help_center.jsx` don't
cover them. Don't write `<h1>` or `<h2>` either. Studio keeps them, but the page
title is the `<h1>` and each section title is an `<h2>`.

Links:

- Help pages: root-relative `helpHref` shape, `/help/<slug>` or
  `/help/<slug>#<anchor>`. The home page is `/help`.
- Other pages on the site: `/pricing`, `/changelog`, `/signup`, `/login` (the sign-in
  page: there is no `/signin`), `/org`. Products: `/<app>/…`.
- External: full `https://` URLs.
- Link text names the destination: `see the <a href="/changelog">changelog</a>`.
- Don't link a published page to a draft. Readers get a 404.
- Write plain `<a href="…">`. When Studio saves a page it adds `target="_blank"`,
  `rel` and a `class` to every link, which is the one `class` you'll see in a
  snapshot. Leave those attributes as they are when you build on a snapshot.

Write characters directly (`→`, `⌘`, `×`, `⋯`), not as HTML entities, and use
straight apostrophes and quotes.

---

## 7. Components: inventory first, then placement

A section can carry more than text: cards, features, links and a live showcase,
and an overview page can carry the whole app as its hero. Use them wherever they
help the reader, and only where they fit. To do that you have to know what exists,
so **count what's available before you write a word.**

### 7.1 Take the inventory

```bash
node --env-file=.env scripts/help-snapshot.mjs --components   # everything embeddable, and where each piece is used
node --env-file=.env scripts/help-snapshot.mjs <slug>         # the page, plus its app's showcases marked used or unused
```

Write down, for the app you're documenting:

1. **Whole-app preview:** whether the app has one (it's in `SANDBOX_APP_IDS`).
2. **Registered showcases:** how many the app has in `HELP_SHOWCASES`, which
   screen, panel or dialog each one shows, and which pages already use them.
3. **Unregistered components:** ids the product serves under
   `/<app>/playground/<component>` that Dash hasn't registered yet.
4. **Gaps:** screens your page will describe that have no component at all.

Then plan the page with that list next to the outline. Decide, section by section,
which component it gets, before you write the HTML.

### 7.2 Put each component where it belongs

| The section… | Gets | Notes |
|---|---|---|
| States any fact | `content` | Always. Every other component sits alongside the text, never instead of it |
| Explains a screen, panel or dialog that has a registered showcase | that **showcase** | Always use it. A matching showcase left unused is a missed demo |
| Explains a component the product serves but Dash hasn't registered | register it (§8 step 2), then the **showcase** | A small Dash change. Include it in the same piece of work |
| Explains a component with no route anywhere | `content` only | Tell the user which showcase would help. Adding one is product work (§8 step 1), so don't start it unasked |
| Is the top of a home or product overview page | the whole-app **preview** (`docs_pages.preview`) | Never on an area guide, even when it's available |
| Opens a home or overview page | **cards**, exactly 3 | The three places a newcomer goes first. Flow's: open a project, track issues, try the playground |
| Lists the areas of an app, or the apps in the suite | **features** | On overview pages. Each item is also described in a section's `content` |
| Ends an area guide that has related published guides | **links**, 3 or 6 | Title it "Related guides". Skip it when nothing related is published yet |
| Lists shortcuts, options or limits | `content` (`<ul>`) | No component. Tiles are for navigation and summary |

Placement rules:

- **One showcase per section, and each showcase once per page**, on the section
  that explains its component best. Two sections about the same screen share one
  showcase: put it on the first.
- **Match exactly.** A showcase goes on a section only if the section describes
  what it shows. Never add one for decoration.
- **Re-check the inventory after an app ships new component routes.** Published
  pages may now have a showcase they should use.

### 7.3 Cards, features and links

These render under a section's content. They're navigation and summary, never the
only home of a fact (§2.3).

| Kind | Use it for | Shape | Copy rules |
|---|---|---|---|
| `cards` | The "Start here" row on home and overview pages | Exactly 3: `{ icon, title, body, href }` | Title 2 to 4 words, sentence case. Body is one fragment of up to about 8 words, with no period ("Sign up and set up your organization") |
| `features` | Overview inventories: the areas in a product, the apps in the suite | `{ icon, text }`, ideally an even number so the two-column grid has no gap | Usually `"Name: what it is"` ("Tasks: status, priority, type and delivery stage") |
| `links` | Next steps at the end of a page: related guides | 3 or 6: `{ icon, label, href }` | The label is the destination page's title |

- `icon` is a Lucide icon name in PascalCase (`FolderKanban`). Unknown names fall
  back to a default icon without any warning, so check yours:
  `node -e "console.log(!!require('lucide-react').icons.FolderKanban)"`.
- A section that only holds tiles has `content = ''`. Give it a `title` anyway, so it
  appears in "On this page".
- Card `href`s can point to anchors on the same page (`#issue-tracker`).

---

## 8. Showcases and previews

Help pages embed the real product, live and scoped, instead of screenshots that go
stale. There are two kinds:

| | Whole-app preview | Section showcase |
|---|---|---|
| Set by | `docs_pages.preview = '<app>'` | `docs_content_blocks.showcase = '<app>/<component>'` |
| Shows | The app's full sandbox (`/<app>/playground`) at 1280 × 800 | One component (`/<app>/playground/<component>`) |
| Where | **Only** home and product overview pages | Any section that describes that component |
| Requires | App id in `SANDBOX_APP_IDS` | Id in `HELP_SHOWCASES` |

Rules:

- **Place showcases from the inventory (§7).** At most one per section, on the
  section whose text explains that component, rendered after the text. Not every
  section has a component to show: the Tasks page has 4 showcases across 8
  sections, and uses every Flow showcase that matches.
- **The text must stand alone.** Showcases never reach search, Ask AI or Copy page.
  Write the section as if the iframe weren't there, and never "try it below".
- Showcases are interactive demos with sample data. A visitor's changes reset on
  reload, and the component can't navigate anywhere else. Don't document anything
  that only exists in the demo, such as its sample names or numbers.
- Pick a showcase from the registry (`lib/docs/showcases.js`). An id that isn't
  registered renders nothing, without an error.

**Adding a new showcase** (Flow is the only product with component routes today):

1. **Product repo:** add the component id to `PLAYGROUND_COMPONENT_IDS` (and to
   `FLOATING_PLAYGROUND_COMPONENT_IDS` for a dialog) in
   `components/landing/playground/playground_components.js`, and add
   `{ title, render }` for it to the `COMPONENTS` map in
   `flow_component_embed.jsx`. `FlowComponentEmbed` already wraps every entry in
   `PlaygroundSession` and `ScreenErrorBoundary`; the component itself must offer
   no way to navigate out. It's served at `/<app>/playground/<component>`. For a
   product that has only the whole-app playground, port Flow's
   `app/playground/[component]` pattern first.
2. **Dash:** add `{ id: "<app>/<component>", app, label, src: "/<app>/playground/<component>", viewport }`
   to `HELP_SHOWCASES`. `viewport` is the size the component renders at before
   scaling: about 1152 × 740 for a full screen, 672 × 760 for a detail panel, and
   800 × 700 plus `floating: true` for a dialog.
3. **Content:** set the section's `showcase` in the content migration.
4. **Deploy order:** the product deploy, then the Dash deploy that registers the id,
   then the content `db:push`. Content pushed earlier isn't broken (the section
   renders without its showcase), but a Studio save in that window strips the
   unregistered id, so you'd have to set it again. A *schema* migration is
   different: it always pushes before the code that reads its columns.

---

## 9. Shipping content

### 9.1 Choose the route

| Situation | Route |
|---|---|
| A person editing in the browser | Studio, `/studio/help` (content editors only) |
| An agent writing or updating pages | A **content migration** (this section) |
| Changing how help pages render | A normal code change in this repo |
| Re-runnable demo data | **Never** for help content: a re-run would overwrite Studio edits |
| Granting someone Studio access | Add their email to `supabase/seeds/content_editors.sql`, then `npm run db:seed -- content_editors` |

Content migrations are "one-time content moves": they run once, through the ledger.
From then on, the page belongs to whoever edits it next, in Studio or in a later
migration.

### 9.2 Snapshot the live page first

```bash
node --env-file=.env scripts/help-snapshot.mjs                # every page, its status, and what last wrote it
node --env-file=.env scripts/help-snapshot.mjs flow/tasks     # one page: full section HTML, and its app's showcases
node --env-file=.env scripts/help-snapshot.mjs --components   # the component inventory (§7.1)
```

The script is read-only. A migration's rows carry its exact `applied_at`, so the
script can tell which migration last wrote each page; anything else is reported as
**Studio**.

- **Last written by a migration:** that file is current. Build on it.
- **Last edited in Studio:** someone changed the live page. Start from the
  snapshot's HTML, keep their edits unless they're wrong, and make your `@down`
  restore the snapshot, not the old file.

Two cases also show as **Studio**: a page last changed by a `db:rollback`, and one
written by a `@no-transaction` migration. Check `npm run db:status` if that seems
likely. `written_by` names the last migration that touched any of the page's rows,
which isn't always the one holding its current HTML, so read the snapshot's HTML
rather than trusting a file.

A migration that replaces a page's sections replaces them wholesale. Skipping the
snapshot is how a Studio edit gets lost without anyone noticing.

### 9.3 Writing the migration

Scaffold it: `npm run db:new -- help_<app>_<page>_page --template raw`. Use one
migration per page, or per coherent move (a product graduating with its outlines).
Everything in `MIGRATION_CONVENTIONS.md` applies.

Header template (the survey line is required from now on, so later audits know
what to re-check):

```sql
-- Help flow tasks page
--
-- One-time content move: replaces the flow/tasks draft outline with the full Tasks guide and publishes it.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/tasks/*, work_queue/*).
-- Later edits happen in Studio, so this must never re-run.
```

Comments above `-- @up` aren't part of the checksum, so a missing survey line can be
added to an applied migration's header without causing drift.

`@up` patterns:

```sql
-- @up
-- Page fields. published_at keeps its first value.
update public.docs_pages
set title = 'Tasks',
    description = 'Plan a project''s work as tasks: set status, priority and stage, assign people, and work through it all in the Work Queue.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/tasks' and deleted_at is null;

-- Create a page only where it's missing (live slugs are unique among non-deleted pages).
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, 'flow/issues', 'Issue tracker', 'Triage, prioritize and ship issues…', 'draft', 20
from public.docs_nav_groups g where g.slug = 'flow'
on conflict (slug) where deleted_at is null do nothing;

-- Replace the sections wholesale.
delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.showcase, v.sort_order
from (
  values
    ('creating-a-task', 'Basics', 'Creating a task', $html$<p>Open a project in Flow, choose <strong>Tasks</strong> in the sidebar, then <strong>Create Task</strong>.</p>$html$, 'flow/add-task', 10),
    ('shortcuts', 'Reference', 'Keyboard shortcuts', $html$<ul><li><code>Esc</code> clears and closes the search box</li></ul>$html$, null, 20)
) as v(anchor_id, eyebrow, title, content, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null) p;
```

- Wrap every HTML body in `$html$ … $html$` dollar quotes. Inside ordinary `'…'`
  strings, double any apostrophe (`project''s`).
- Address pages by `slug … and deleted_at is null`, never by a hard-coded id.
- Groups use `insert … on conflict (slug) do update set title = excluded.title, sort_order = excluded.sort_order`.
- Pass `cards`, `features` and `links` as JSON text cast with `::jsonb`.
- Don't write the legacy `toc`, `has_children` or `body` columns.
- Every `showcase` value must exist in `HELP_SHOWCASES` by the time the content is
  pushed (§8, deploy order).
- An untitled section's `title` is `''`, never null.
- Only set `parent_id` to a top-level page in the same group.
- Publish (`status = 'published'`) only when the page passes §11. Otherwise leave it
  as a `draft`.

`@down` restores exactly what was live before: the previous description and status,
and the previous sections (the draft outline, or the snapshot's HTML). Mirror the
`@up` statement by statement.

A **draft outline** is a single `overview` section:
`<p><em>Draft outline. Replace before publishing.</em></p><ul><li>…</li></ul>`,
one `<li>` per planned section. Base the list on the product's actual screens.

If a migration was ledgered while still a blank scaffold (a concurrent push), leave
it as a documented no-op and write a new one, as
`20261024123200_help_flow_tasks_guide.sql` does.

### 9.4 Push and verify

`db:push` writes to the shared, live database. A page with `status = 'published'`
goes public the moment the push lands. **Confirm with the user before pushing**,
unless they've already asked you to ship it.

```bash
npm run db:status
npm run db:push -- --dry-run
npm run db:push
npm run db:status
node --env-file=.env scripts/help-snapshot.mjs <slug>   # written_by should name your migration
```

Then open `/help/<slug>` (or `?preview=1` for a draft, as an editor) and check:

- the "On this page" list matches the sections, and each anchor scrolls to its section;
- each showcase loads and shows the component its section describes;
- every link resolves, and none goes to a draft;
- ⌘K finds the page and its section titles.

No cache needs clearing: help pages render on each request. The sitemap picks up
new pages within a day.

---

## 10. Workflows

### 10.1 Write a page from its draft outline

1. Snapshot the page (§9.2). Read its outline and the product's sidebar.
2. Take the component inventory (§7.1): what this app has, and how much of it is
   unused.
3. Survey the area in the product repo (§4.2).
4. Plan the sections (§3.3): titles in the reader's words, eyebrows, and the
   component each section gets (§7.2).
5. Write the description and the sections (§5, §6), then check each against §11.
6. Write the migration (§9.3), publishing only if the page is complete.
7. Confirm with the user, then push and verify (§9.4).

### 10.2 Update a page after a product change

1. Find every page that mentions the area: run the snapshot list, then read each
   page's HTML. Grep the migrations for labels you changed, too.
2. Snapshot each affected page.
3. Change only what the product change made wrong. Keep anchors and section titles,
   so existing links and search entries survive. If the change added a component
   route, re-run the inventory (§7.1) and place the new showcase.
4. Write one migration for the update, with the snapshot as `@down`. Push it with
   the product change, or right after it deploys.

### 10.3 Add a page

First check the page doesn't already exist: list every page with the snapshot
script, and look at the draft outlines, which cover most planned topics. Extend a
page that covers the area rather than starting a second one, and don't give a
single option or term a page of its own. Then pick the group and slug (§3.1) and
the page type (§3.2). If the product hasn't graduated and this is its second page,
graduate it first. Then follow §10.1.

### 10.4 Publish a draft

Only when the page passes §11. Set `status = 'published'` and
`published_at = coalesce(published_at, now())`. Check that nothing on published
pages still links to a slug that's a draft, and add links to the new page from its
overview where readers will look for it.

### 10.5 Retire a page

- **Feature removed:** archive the page (`status = 'archived'`) or soft-delete it
  (`deleted_at = now()`), remove links to it from other pages, and redirect its URL
  to the closest live page, usually the app's overview (§10.6).
- **Content merged into another page:** move the content, redirect the old URL to
  the section that now holds it, then soft-delete the old page.
- Never hard-delete a page. Groups have no soft delete, so delete a group only
  once it's empty. Section rows are different: replacing them wholesale is how
  every save works.

### 10.6 Move or rename a published page

Avoid it: a slug is a public URL that search engines, bookmarks, emails and other
pages use. If you have to:

1. Add a permanent redirect from `/help/<old>` to `/help/<new>` (an `async redirects()`
   entry in `next.config.mjs`). Keep it forever, and point any older redirect for
   the same page straight at the new URL, so no redirect leads to another.
2. Update the slug in a migration, and update every link to the old slug in other
   pages' `content`, `cards` and `links`.
3. Keep section anchors unchanged, so `#anchor` links still land.

### 10.7 Audit a published page

Run this when asked to check the docs, after a big release in an app, or whenever
you touch a page that hasn't been checked in a while:

1. Snapshot the page and read it as a newcomer would.
2. Re-run the survey (§4.2) against the repo's current code, starting from the
   paths in the page's migration header.
3. List each claim that's wrong, missing or no longer true. Fix them through
   §10.2, or report them to the user if they asked only for a check.

---

## 11. Review checklist

Run through this for every page before you publish or push it.

**Accuracy**
- [ ] Every label, default, option, limit and shortcut was checked against the code
- [ ] Nothing unshipped, flagged, demo-only or guessed is in the page
- [ ] The migration header names the repo and paths you surveyed

**Structure**
- [ ] The slug, group and page type follow §3. The page covers one area
- [ ] Each section answers one question, has a title in the reader's words and an
      eyebrow from §3.3
- [ ] No section runs over about 2,500 characters of text
- [ ] Each section makes sense read alone, with no "above", "below" or "this screen"

**Style**
- [ ] Second person, present tense, active voice, American English, sentence case
- [ ] No em dashes, no serial commas in simple lists, nothing from §5.7 or §5.8
- [ ] UI labels are exact and in `<strong>`, paths use `→`, keys are in `<code>`
- [ ] Required fields, defaults, autosave, permanence and scope are all stated
      where they apply

**HTML and extras**
- [ ] Only §6 tags. No `h1`/`h2`, tables, `div`, `class` or `style`
- [ ] Links point at live, published pages; link text names the destination
- [ ] Icons exist in Lucide. Every fact in a tile is also in some section's `content`

**Components**
- [ ] You ran `--components` before writing, and planned a component per section (§7)
- [ ] Every registered showcase that matches a section is used, once per page
- [ ] At most one showcase per section, each on the section that describes it
- [ ] The whole-app preview is only on a home or overview page
- [ ] Overview pages have their cards and features; area guides end with links when
      related guides are published
- [ ] The text stands alone without any of them

**Shipping**
- [ ] You snapshotted the live page, and no Studio edit was lost
- [ ] The `@up` is scoped by slug and the `@down` restores the previous live state
- [ ] `status` is `published` only if every box above is ticked
- [ ] The user agreed to the push; `db:status` is clean; the page renders correctly

---

## 12. Anti-patterns

| Don't | Do |
|---|---|
| Write from the feature's name, the marketing page or memory | Survey the code (§4) |
| "Easily manage your tasks with powerful filters" | "Narrow the list by status and priority" |
| Put a fact only in a feature tile or a showcase | Put it in `content`; tiles summarize |
| One long section with `<h3>`s inside | Several titled sections |
| "Click the button below to try it" | Describe the control by its label |
| Screenshots of the product | A section showcase, or plain text |
| A whole-app preview on an area guide | A section showcase on the matching section |
| Write the page, then look for showcases to sprinkle in | Inventory first, then plan a component per section (§7) |
| Leave a matching showcase unused, or put one on an unrelated section | Every match used, each on its own section |
| Re-run content as a seed, or edit it in the SQL editor | A one-time content migration |
| Replace a page without checking it | `scripts/help-snapshot.mjs` first |
| Rename a published slug or anchor | Keep it, or redirect it (§10.6) |
| Document `/docs/...` URLs | Help lives at `/help` |
| Tables, `div`s, `class`/`style` in content | §6 tags only |
| "Note:" blocks, tips and warnings collected at the end | The warning in the step where it applies |
| Publish with "Draft outline" or "TBD" text | Keep it as a draft until it's finished |
| "This feature may also support…" | Check, then state it or leave it out |
| Announce changes ("New!", "Now you can…") | Describe how it works; the changelog announces |

---

## 13. Rewrite examples

**Vague and promotional**

> Flow makes task management effortless. Simply click the button to create a task
> and fill in the details — you can customize everything!

**Precise**

> Open a project in Flow, choose **Tasks** in the sidebar, then **Create Task**.
> Only the title is required: **Create Task** stays disabled until there is one.

**Hedged**

> Deleted tasks may be recoverable depending on your settings.

**Checked and stated**

> Flow asks you to confirm first, and a deleted task can't be restored from Flow.

**Points at the page instead of saying the thing**

> As shown in the demo below, the list can be sorted in several ways.

**Self-contained**

> Sort the task list by **Newest** (the default), **Oldest**, **Priority**, **Due
> date** (earliest first, undated last) or **Progress** (furthest along first).

---

## 14. Changing this convention

- This file is the single source of truth for help writing. When a rule changes,
  change it here first, then bring the published pages in line in a migration.
- Add a rule when the same mistake turns up twice, and write down why it exists.
- If a published page and this file disagree, don't guess which one is right: ask
  the user, then fix the other one.

The rules draw on the Diátaxis framework, the Google developer documentation style
guide, the Microsoft Writing Style Guide, GitLab's documentation style guide and
its `doc/AGENTS.md`, the Good Docs Project templates, Intercom's guidance on
writing for its Fin AI agent, kapa.ai's and ReadMe's writing for retrieval,
Wikipedia's "Signs of AI writing", and the published Flow pages. Where those sources
disagree (click or select, `>` or `→`, em dashes, imperative or gerund titles,
`<kbd>` or code), this file follows what the published Help Center already does.
