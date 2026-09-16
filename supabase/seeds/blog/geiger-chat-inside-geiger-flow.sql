-- Blog post announcing the Geiger Chat workspace shipping inside Geiger Flow.
-- Re-runnable: fixed UUID, upserts on re-seed. Content is HTML — the blog
-- renderer passes HTML through and only paragraph-wraps plain text.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  'a7c53e81-4d60-4f92-9b3e-6d81c4f2a905',
  'Geiger Chat now lives inside Geiger Flow',
  'geiger-chat-inside-geiger-flow',
  'The full Geiger Chat workspace — messages, channels, calls, files and inbox — now runs inside a Flow project''s Grounding tab, scoped to the project instead of the organization.',
  $html$
<p>Flow has always had a Grounding tab. Until now it was a modest thing: a list of channels, a list of messages, and not much else. If a conversation needed a call, a file, a thread, or anyone outside the room, it left Flow and continued somewhere else — which is exactly where project context goes to die.</p>

<p>So we stopped maintaining two answers to the same question. <strong>Geiger Chat now runs inside Geiger Flow</strong>, in full, as the Grounding tab of every project.</p>

<h2>The whole workspace, not a widget</h2>

<p>This is not a chat panel bolted onto a project screen. It is the entire Geiger Chat product, rehosted, with its own navigation rail:</p>

<ul>
  <li><strong>Messages</strong> — direct messages, with threaded replies, quoted replies, emoji reactions, attachments and read receipts.</li>
  <li><strong>Channels</strong> — topic-scoped rooms with their own member list, pinning and details sheet.</li>
  <li><strong>Contacts</strong> — everyone in the project, plus the people you have reached outside it.</li>
  <li><strong>Calls</strong> — call history, scheduled calls, and the meeting stage itself.</li>
  <li><strong>Files</strong> — every file shared in the project, in one place, alongside a per-conversation files panel.</li>
  <li><strong>Inbox</strong> — what happened while you were away, with a live unread badge on the rail.</li>
  <li><strong>Settings</strong> — presence, notification preferences and your chat identity.</li>
</ul>

<p>The rail is styled to the same tokens as the project sidebar, at the same row height, so the two read as one navigation system rather than a product inside a product.</p>

<h2>Scoped to a project, not an organization</h2>

<p>The interesting part of the port was not the UI — it was the scope. In Geiger Chat, "who belongs here" came from the organization roster. In Flow, the unit of work is the project, and a project has its own members.</p>

<p>So conversations now carry a <code>project_id</code>, and every other record reaches a project through its parent conversation. Row-level security is expressed with the same ability checks the rest of Grounding already used, which means chat access follows project access automatically — no second permission model to keep in sync.</p>

<p>The roster does one more job. When you start a conversation with someone who is not a member of the project, they are flagged as <strong>external</strong> and you are asked to confirm before the thread opens. Reaching outside the project is allowed; doing it by accident is not.</p>

<h2>Calls that actually connect</h2>

<p>Voice and video run peer-to-peer over WebRTC in a mesh — one connection per participant, so a one-to-one DM and a small channel call use the same engine. Signalling rides Supabase broadcast on two surfaces: a per-user ring channel, so an incoming call reaches you even with no conversation open, and a per-conversation channel carrying the offer, answer and ICE traffic once the call is live.</p>

<p>The meeting stage has the controls you expect — mic, camera, screen share, participants, raise hand — and every call posts an event card back into the conversation it came from, so the thread keeps the record. Calls can also be scheduled ahead of time, with reminders that fire when they are due.</p>

<h2>Files and the inbox</h2>

<p>Shared files land in a dedicated storage bucket and are indexed per project, so the Files screen answers "where is that spec" without anyone scrolling a thread. Attachments are typed by extension, so images, PDFs, sheets, slides and archives all render with the right affordance.</p>

<p>The Inbox tracks what arrived while you were elsewhere. Messages you wrote, and messages in conversations you are not a member of, are ignored. If you opt in, anything that arrives while the tab is in the background also raises a desktop notification.</p>

<h2>Pop it out when you need the room</h2>

<p>A chat tab inside a project shell is the right default and the wrong shape for a long conversation. The pop-out button hands the same workspace the full window at <code>/chat/&lt;projectId&gt;</code> — same screens, same data, the rail as the only navigation.</p>

<h2>What happened to the old Grounding data</h2>

<p>Nothing was thrown away. Existing Grounding channels became conversations and existing Grounding messages became chat messages, migrated in place. The legacy tables are still there, untouched, and will stay for one release before we retire them.</p>

<h2>Where this goes next</h2>

<p>Merging Chat into Flow is the first of these consolidations, not the last. The pattern — take a product, rescope it from the organization to the project, and host it where the work already is — applies to more of the suite than chat. Grounding is where we proved it.</p>

<p>It is live now in every Flow project. Open a project, click Grounding, and start talking.</p>
  $html$,
  'Geiger Team',
  'Product Updates',
  ARRAY['geiger-flow', 'geiger-chat', 'collaboration', 'product-updates'],
  true,
  true,
  '2026-09-16 00:00:00+00',
  6
)
on conflict (id) do update set
  title                = excluded.title,
  slug                 = excluded.slug,
  excerpt              = excluded.excerpt,
  content              = excluded.content,
  author_name          = excluded.author_name,
  category             = excluded.category,
  tags                 = excluded.tags,
  is_published         = excluded.is_published,
  is_featured          = excluded.is_featured,
  published_at         = excluded.published_at,
  reading_time_minutes = excluded.reading_time_minutes;
