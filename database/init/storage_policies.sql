-- Storage bucket + RLS policies for blog/changelog image uploads.
-- Run this in Supabase SQL editor after blog/changelog table setup.

-- Ensure the bucket exists and is public for direct object URLs.
insert into storage.buckets (id, name, public)
values ('pfp', 'pfp', true)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

-- Replace existing policies so this script is repeatable.
drop policy if exists "PFP public read" on storage.objects;
drop policy if exists "PFP auth insert own folder" on storage.objects;
drop policy if exists "PFP auth update own folder" on storage.objects;
drop policy if exists "PFP auth delete own folder" on storage.objects;

-- Public read: required because app stores public URLs in DB.
create policy "PFP public read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'pfp');

-- Upload/create files only under: {auth.uid()}/...
create policy "PFP auth insert own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'pfp'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- Upsert requires update permissions on existing objects.
create policy "PFP auth update own folder"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'pfp'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'pfp'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "PFP auth delete own folder"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'pfp'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
