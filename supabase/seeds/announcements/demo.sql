-- Demo announcement for Studio > Announcements. Seeded as a draft so it never reaches real users until an
-- editor publishes it; re-running refreshes it only while nobody has edited it (updated_at = created_at).
-- Image: John Frederick Kensett, "Passing off of the Storm" (1872), The Met, Open Access (CC0), resized to 1600px.

insert into public.announcements (id, name, format, status, priority, slides, design, audience, frequency, apps, routes, exclude_routes)
values (
  'a0c1e5d2-3b4f-4a6e-9d71-5e2f8c0b9a11',
  'Demo: Suite welcome',
  'modal',
  'draft',
  0,
  $json$[
    {
      "id": "6f1d2c3b-8e4a-4b5c-9a7d-1e2f3a4b5c6d",
      "imageUrl": "https://dyjiyzcsdaeuxtueslqr.supabase.co/storage/v1/object/public/pfp/announcements/demo/kensett-passing-off-of-the-storm.jpg",
      "imageAlt": "Calm water under a clearing sky with distant sailboats, after John Frederick Kensett",
      "badge": "New in Geiger",
      "title": "Every app in the suite, one sign-in away",
      "body": "Open Flow, Notes, Events and the rest straight from your organization. Your projects, people and plan follow you everywhere.",
      "primaryLabel": "Explore the apps",
      "primaryUrl": "/apps",
      "primaryNewTab": false,
      "secondaryLabel": "Learn more",
      "secondaryUrl": "https://geiger.studio/help",
      "secondaryNewTab": true,
      "nextLabel": ""
    }
  ]$json$::jsonb,
  '{"size":"md","position":"bottom-right","align":"left","imageAspect":"banner","imageFit":"cover","imageBackground":"muted","badgeTone":"info","primaryStyle":"default","dismissible":true,"closeOnOutside":true,"delaySeconds":1,"autoAdvanceSeconds":0,"showProgress":true}'::jsonb,
  '{"plans":[],"planStates":[],"products":[],"roles":[],"orgIds":[],"userIds":[],"excludeUserIds":[],"account":{"mode":"any","days":14},"labels":{}}'::jsonb,
  '{"mode":"once","times":3,"days":7,"stopOnClick":true}'::jsonb,
  array['dash'],
  array['/org/**', '/apps', '/profile'],
  '{}'
)
on conflict (id) do update set
  slides = excluded.slides,
  design = excluded.design
where public.announcements.updated_at = public.announcements.created_at;
