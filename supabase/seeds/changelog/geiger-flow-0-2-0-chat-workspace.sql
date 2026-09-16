-- Geiger Flow 0.2.0 — the Geiger Chat workspace ported into Flow's Grounding tab.
-- Re-runnable: fixed UUID, upserts the release, and rebuilds its item list.

insert into public.dash_changelog (
  id, version, title, description, category, product, release_date, is_featured
) values (
  'b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10',
  '0.2.0',
  'Geiger Chat, built into Flow',
  'The whole Geiger Chat workspace — messages, channels, contacts, calls, files and inbox — now runs inside a project''s Grounding tab, scoped to the project instead of the organization. Grounding''s old channel-and-message surface has been migrated into the new model.',
  'feature',
  'geiger-flow',
  '2026-09-16 00:00:00+00',
  true
)
on conflict (id) do update set
  version      = excluded.version,
  title        = excluded.title,
  description  = excluded.description,
  category     = excluded.category,
  product      = excluded.product,
  release_date = excluded.release_date,
  is_featured  = excluded.is_featured;

delete from public.dash_changelog_items
where changelog_id = 'b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10';

insert into public.dash_changelog_items (changelog_id, type, description) values
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Grounding is now a full chat workspace: Messages, Channels, Contacts, Calls, Files, Inbox and Settings, behind their own navigation rail.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Direct messages and channels with threaded replies, emoji reactions, quoted replies, attachments and read receipts.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Peer-to-peer voice and video calls over WebRTC, with ring, accept and decline signalling on Supabase broadcast, and a meeting stage with mic, camera and screen-share controls.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Scheduled calls with reminders, and call events posted into the conversation they belong to.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'File sharing on the public chat bucket, with a Files screen and a per-conversation files panel.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'An Inbox with a live unread badge, plus optional desktop notifications for messages that arrive while the tab is in the background.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Anyone outside the project roster is flagged as external, and confirmed, before a conversation with them opens.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'added',   'Pop the workspace out of the tab and run it full-window at /chat/<projectId>.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'changed', 'Chat is scoped to a project rather than an organization: conversations carry a project_id and row-level security reuses the same grounding ability checks as the rest of Flow.'),
('b1f4c0de-9a27-4d31-8f65-2c0a7e5d1b10', 'changed', 'Existing Grounding channels and messages were migrated into the new flow.chat_* tables. The legacy tables are left in place, untouched, for one release.');
