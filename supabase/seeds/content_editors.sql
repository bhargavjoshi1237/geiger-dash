-- Content editors: accounts allowed to edit the Help Center in Studio (/studio/help).
-- Re-runnable: matches accounts by email and skips anyone already listed. Add an email to grant access,
-- then run `npm run db:seed -- content_editors`. Accounts that haven't signed up yet are skipped.

insert into public.content_editors (user_id, note)
select id, 'Help Center editor'
from auth.users
where lower(email) in (
  'bhargavjoshi1237@gmail.com'
)
on conflict (user_id) do nothing;
