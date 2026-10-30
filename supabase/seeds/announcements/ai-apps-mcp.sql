-- Announces connecting AI apps to Geiger Events. Seeded as a draft: publish it in Studio once the MCP server is deployed.
-- Re-running refreshes it only while nobody has edited it (updated_at = created_at).

insert into public.announcements (id, name, format, status, priority, slides, design, audience, frequency, apps, routes, exclude_routes)
values (
  'c7d4e1a9-2f6b-4e83-a5c1-8b3d9f0e7a24',
  'AI apps for Geiger Events',
  'modal',
  'draft',
  0,
  $json$[
    {
      "id": "e2b6f0c4-7a1d-4c39-8f52-3d9a6b1e0c77",
      "imageUrl": "",
      "imageAlt": "",
      "badge": "New in Events",
      "title": "Run your events from your AI app",
      "body": "Connect Claude, ChatGPT, Codex, Cursor or your own app to Geiger Events. Ask it to find an event, check sales, draft a new event or work through pending registrations. You choose which projects it can reach and whether it can make changes, and your role still applies. Find it in Events under Settings, then AI Apps.",
      "primaryLabel": "Open Events",
      "primaryUrl": "/events/project",
      "primaryNewTab": false,
      "secondaryLabel": "",
      "secondaryUrl": "",
      "secondaryNewTab": true,
      "nextLabel": ""
    }
  ]$json$::jsonb,
  '{"size":"md","position":"bottom-right","align":"left","imageAspect":"banner","imageFit":"cover","imageBackground":"muted","badgeTone":"info","primaryStyle":"default","dismissible":true,"closeOnOutside":true,"delaySeconds":1,"autoAdvanceSeconds":0,"showProgress":true}'::jsonb,
  '{"plans":[],"planStates":[],"products":["events"],"roles":[],"orgIds":[],"userIds":[],"excludeUserIds":[],"account":{"mode":"any","days":14},"labels":{}}'::jsonb,
  '{"mode":"once","times":3,"days":7,"stopOnClick":true}'::jsonb,
  array['dash'],
  array['/org/**', '/apps', '/profile'],
  '{}'
)
on conflict (id) do update set
  slides = excluded.slides,
  design = excluded.design,
  audience = excluded.audience
where public.announcements.updated_at = public.announcements.created_at;
