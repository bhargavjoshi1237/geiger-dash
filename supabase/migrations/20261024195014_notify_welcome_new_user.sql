-- Notify welcome new user
--
-- Sends every new account a "Welcome to Geiger" notification that opens the Quickstart guide. It fires from a trigger on
-- auth.users, so it covers every way an account is made: email, Google, GitHub, passkey, SSO and invites. GoTrue's insert
-- carries no JWT, so notify.is_trusted() lets it send to the new user. Deduped per user, so it can only arrive once.
-- A failure is logged as a warning and never blocks the sign-up. Accounts made before this migration don't get one.
-- Owns notify.welcome_new_user() and the notify_welcome_new_user trigger on auth.users.

-- @up
create or replace function notify.welcome_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    perform notify.send(jsonb_build_object(
      'app', 'dash',
      'type', 'account.welcome',
      'category', 'general',
      'title', 'Welcome to Geiger',
      'body', 'Start with the Quickstart: set up your organization, invite your team and open your first project.',
      'url', '/help/quickstart',
      'icon', 'Sparkles',
      'tone', 'success',
      'dedupe_key', 'account:welcome:' || new.id,
      'on_conflict', 'skip',
      'to', jsonb_build_object('user', new.id)
    ));
  exception when others then
    raise warning 'notify.welcome_new_user: % (user %)', sqlerrm, new.id;
  end;
  return new;
end;
$$;

drop trigger if exists notify_welcome_new_user on auth.users;
create trigger notify_welcome_new_user
after insert on auth.users
for each row execute function notify.welcome_new_user();

-- @down
drop trigger if exists notify_welcome_new_user on auth.users;
drop function if exists notify.welcome_new_user();
