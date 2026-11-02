-- Drop unused public tables
--
-- Removes public tables no suite app reads or writes: the old Prisma ledger, pre-schema Notes canvas boards,
-- the legacy Flow copies (now flow.issues / flow.tasks / flow.forms / flow.project_members) and the retired
-- Office library (now flow.office_*), plus the functions that only served them.
-- office_files, office_file_shares and _prisma_migrations had RLS off, so this also closes that exposure.
-- Rolling back rebuilds the structure only (rows are not restored) and turns RLS on for every table.

-- @up
-- flow_create_task / flow_update_task return the flow_tasks row type, so they go before the table.
drop function if exists public.flow_create_task(uuid, text, text, text, text, text, text, numeric, text[], uuid[], text, date, date, text, text, jsonb, text, text);
drop function if exists public.flow_update_task(uuid, text, text, text, text, text, text, numeric, text[], uuid[], text, date, date, text, text, jsonb, text, text);
drop function if exists public.flow_delete_task(uuid);

drop table if exists
  public._prisma_migrations,
  public.canvas_boards,
  public.flow_issue_comments,
  public.flow_issues,
  public.flow_tasks,
  public.flow_forms,
  public.flow_teams,
  public.flow_workspace_roles,
  public.office_file_shares,
  public.office_files,
  public.office_folders;

drop function if exists public.can_view_file(uuid);
drop function if exists public.can_edit_file(uuid);
drop function if exists public.office_file_role(uuid);
drop function if exists public.update_canvas_boards_updated_at();
drop function if exists public.update_office_files_updated_at();
drop function if exists public.update_office_folders_updated_at();

notify pgrst, 'reload schema';

-- @down
create extension if not exists pgcrypto;

create or replace function public.update_canvas_boards_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.update_office_files_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.update_office_folders_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public._prisma_migrations (
  id varchar(36) primary key,
  checksum varchar(64) not null,
  finished_at timestamptz,
  migration_name varchar(255) not null,
  logs text,
  rolled_back_at timestamptz,
  started_at timestamptz not null default now(),
  applied_steps_count integer not null default 0
);

create table if not exists public.canvas_boards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Board',
  description text not null default '',
  elements jsonb not null default '[]'::jsonb,
  app_state jsonb not null default '{}'::jsonb,
  files jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists canvas_boards_updated_at_idx on public.canvas_boards (updated_at desc);
create index if not exists canvas_boards_project_id_idx on public.canvas_boards (project_id);
create index if not exists canvas_boards_user_id_idx on public.canvas_boards (user_id);

create table if not exists public.flow_forms (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'archived')),
  schema jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists flow_forms_project_idx on public.flow_forms (project_id, created_at desc);

create table if not exists public.flow_issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  title text not null,
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled')),
  priority text not null default 'none' check (priority in ('none', 'low', 'medium', 'high', 'urgent')),
  labels text[] not null default array[]::text[],
  assignee_ids uuid[] not null default array[]::uuid[],
  due_date date,
  deleted_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists flow_issues_labels_idx on public.flow_issues using gin (labels);
create index if not exists flow_issues_project_status_priority_idx on public.flow_issues (project_id, status, priority) where deleted_at is null;
create index if not exists flow_issues_due_date_idx on public.flow_issues (project_id, due_date) where deleted_at is null and due_date is not null;
create index if not exists flow_issues_project_idx on public.flow_issues (project_id, created_at desc) where deleted_at is null;

create table if not exists public.flow_issue_comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.flow_issues(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists flow_issue_comments_issue_idx on public.flow_issue_comments (issue_id, created_at desc);

create table if not exists public.flow_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done', 'draft', 'cancelled', 'archived', 'in_review')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  stage text not null default 'backlog',
  type text not null default 'task' check (type in ('task', 'issue', 'bug', 'feature', 'improvement')),
  progress numeric(3, 0) default 0 check (progress >= 0 and progress <= 100),
  labels text[] not null default array[]::text[],
  assignee_ids uuid[] not null default array[]::uuid[],
  parent_link text,
  start_date date,
  due_date date,
  deadline_tracking text default 'not_set' check (deadline_tracking in ('on_track', 'at_risk', 'overdue', 'not_set')),
  git_branch text,
  reminders jsonb not null default '[]'::jsonb,
  role_visibility text not null default 'team' check (role_visibility in ('team', 'pm_tl', 'dev_only', 'private')),
  latest_update text,
  custom_fields jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  completed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);
create index if not exists flow_tasks_project_status_priority_idx on public.flow_tasks (project_id, status, priority) where deleted_at is null;
create index if not exists flow_tasks_assignee_ids_idx on public.flow_tasks using gin (assignee_ids);
create index if not exists flow_tasks_project_idx on public.flow_tasks (project_id, created_at desc) where deleted_at is null;
create index if not exists flow_tasks_due_date_idx on public.flow_tasks (project_id, due_date) where deleted_at is null and due_date is not null;
create index if not exists flow_tasks_labels_idx on public.flow_tasks using gin (labels);

create table if not exists public.flow_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  project_id uuid,
  name text not null default 'Core Team',
  members jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists flow_teams_project_idx on public.flow_teams (project_id);
create index if not exists flow_teams_org_idx on public.flow_teams (organization_id);

create table if not exists public.flow_workspace_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role_key text not null,
  name text not null,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, role_key)
);
create index if not exists flow_workspace_roles_org_idx on public.flow_workspace_roles (organization_id, created_at);

create table if not exists public.office_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled folder',
  color text not null default '#4285f4',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists office_folders_user_idx on public.office_folders (user_id, updated_at desc);

create table if not exists public.office_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('document', 'spreadsheet', 'presentation')),
  name text not null default 'Untitled',
  content jsonb not null default '{}'::jsonb,
  thumbnail text,
  starred boolean not null default false,
  trashed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  visibility text not null default 'restricted' check (visibility in ('restricted', 'link')),
  link_role text not null default 'viewer' check (link_role in ('viewer', 'commenter', 'editor')),
  folder_id uuid references public.office_folders(id) on delete set null,
  project_id text
);
create index if not exists office_files_user_type_idx on public.office_files (user_id, type);
create index if not exists office_files_folder_idx on public.office_files (user_id, folder_id);
create index if not exists office_files_user_starred_idx on public.office_files (user_id, starred);
create index if not exists office_files_user_updated_idx on public.office_files (user_id, trashed, updated_at desc);

create table if not exists public.office_file_shares (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.office_files(id) on delete cascade,
  email text not null,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('viewer', 'commenter', 'editor')),
  created_at timestamptz not null default now(),
  unique (file_id, email)
);
create index if not exists office_file_shares_email_idx on public.office_file_shares (lower(email));
create index if not exists office_file_shares_file_idx on public.office_file_shares (file_id);
create index if not exists office_file_shares_user_idx on public.office_file_shares (user_id);

create or replace function public.office_file_role(f_id uuid)
returns text
language sql
stable security definer
set search_path to 'public'
as $$
  select case
    when f.user_id = auth.uid()                            then 'owner'
    when s.role is not null                                then s.role
    when f.visibility = 'link' and auth.uid() is not null  then f.link_role
    else null
  end
  from public.office_files f
  left join public.office_file_shares s
    on s.file_id = f.id
   and (s.user_id = auth.uid() or lower(s.email) = lower(auth.jwt() ->> 'email'))
  where f.id = f_id
  order by (s.role is not null) desc
  limit 1;
$$;

create or replace function public.can_view_file(f_id uuid)
returns boolean
language sql
stable security definer
set search_path to 'public'
as $$
  select public.office_file_role(f_id) is not null;
$$;

create or replace function public.can_edit_file(f_id uuid)
returns boolean
language sql
stable security definer
set search_path to 'public'
as $$
  select public.office_file_role(f_id) in ('owner', 'editor');
$$;

create or replace function public.flow_create_task(p_project_id uuid, p_title text, p_description text default null, p_status text default 'todo', p_priority text default 'medium', p_stage text default 'backlog', p_type text default 'task', p_progress numeric default 0, p_labels text[] default array[]::text[], p_assignee_ids uuid[] default array[]::uuid[], p_parent_link text default null, p_start_date date default null, p_due_date date default null, p_deadline_tracking text default 'not_set', p_git_branch text default null, p_reminders jsonb default '[]'::jsonb, p_role_visibility text default 'team', p_latest_update text default null)
returns public.flow_tasks
language plpgsql
security definer
set search_path to 'public', 'auth'
as $$
declare
  current_user_id uuid := auth.uid();
  new_task        public.flow_tasks;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if not public.flow_can_access_project(p_project_id) then
    raise exception 'You do not have permission to add tasks to this project'
      using errcode = '42501';
  end if;

  insert into public.flow_tasks (
    project_id, title, description, status, priority, stage, type, progress,
    labels, assignee_ids, parent_link, start_date, due_date, deadline_tracking,
    git_branch, reminders, role_visibility, latest_update, created_by
  )
  values (
    p_project_id, p_title, p_description,
    coalesce(p_status, 'todo'), coalesce(p_priority, 'medium'),
    coalesce(p_stage, 'backlog'), coalesce(p_type, 'task'), coalesce(p_progress, 0),
    coalesce(p_labels, array[]::text[]), coalesce(p_assignee_ids, array[]::uuid[]),
    p_parent_link, p_start_date, p_due_date, coalesce(p_deadline_tracking, 'not_set'),
    p_git_branch, coalesce(p_reminders, '[]'::jsonb),
    coalesce(p_role_visibility, 'team'), p_latest_update, current_user_id
  )
  returning * into new_task;

  return new_task;
end;
$$;

create or replace function public.flow_update_task(p_task_id uuid, p_title text default null, p_description text default null, p_status text default null, p_priority text default null, p_stage text default null, p_type text default null, p_progress numeric default null, p_labels text[] default null, p_assignee_ids uuid[] default null, p_parent_link text default null, p_start_date date default null, p_due_date date default null, p_deadline_tracking text default null, p_git_branch text default null, p_reminders jsonb default null, p_role_visibility text default null, p_latest_update text default null)
returns public.flow_tasks
language plpgsql
security definer
set search_path to 'public', 'auth'
as $$
declare
  current_user_id uuid := auth.uid();
  updated_task    public.flow_tasks;
  marking_done    boolean;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  marking_done := (p_status is not null and p_status = 'done');

  update public.flow_tasks t
  set title             = coalesce(p_title, t.title),
      description       = coalesce(p_description, t.description),
      status            = coalesce(p_status, t.status),
      priority          = coalesce(p_priority, t.priority),
      stage             = coalesce(p_stage, t.stage),
      type              = coalesce(p_type, t.type),
      progress          = coalesce(p_progress, t.progress),
      labels            = coalesce(p_labels, t.labels),
      assignee_ids      = coalesce(p_assignee_ids, t.assignee_ids),
      parent_link       = coalesce(p_parent_link, t.parent_link),
      start_date        = coalesce(p_start_date, t.start_date),
      due_date          = coalesce(p_due_date, t.due_date),
      deadline_tracking = coalesce(p_deadline_tracking, t.deadline_tracking),
      git_branch        = coalesce(p_git_branch, t.git_branch),
      reminders         = coalesce(p_reminders, t.reminders),
      role_visibility   = coalesce(p_role_visibility, t.role_visibility),
      latest_update     = coalesce(p_latest_update, t.latest_update),
      completed_at      = case when marking_done then now() else t.completed_at end,
      completed_by      = case when marking_done then current_user_id else t.completed_by end
  where t.id = p_task_id
    and t.deleted_at is null
  returning * into updated_task;

  if not found then
    raise exception 'Task not found' using errcode = 'P0002';
  end if;

  return updated_task;
end;
$$;

create or replace function public.flow_delete_task(p_task_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public', 'auth'
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  update public.flow_tasks
  set deleted_at = now(), updated_at = now()
  where id = p_task_id;

  if not found then
    raise exception 'Task not found' using errcode = 'P0002';
  end if;
end;
$$;

drop trigger if exists canvas_boards_updated_at on public.canvas_boards;
create trigger canvas_boards_updated_at before update on public.canvas_boards
  for each row execute function public.update_canvas_boards_updated_at();
drop trigger if exists flow_forms_set_updated_at on public.flow_forms;
create trigger flow_forms_set_updated_at before update on public.flow_forms
  for each row execute function public.flow_set_updated_at();
drop trigger if exists flow_issues_set_updated_at on public.flow_issues;
create trigger flow_issues_set_updated_at before update on public.flow_issues
  for each row execute function public.flow_set_updated_at();
drop trigger if exists flow_issue_comments_set_updated_at on public.flow_issue_comments;
create trigger flow_issue_comments_set_updated_at before update on public.flow_issue_comments
  for each row execute function public.flow_set_updated_at();
drop trigger if exists flow_tasks_set_updated_at on public.flow_tasks;
create trigger flow_tasks_set_updated_at before update on public.flow_tasks
  for each row execute function public.flow_set_updated_at();
drop trigger if exists flow_teams_set_updated_at on public.flow_teams;
create trigger flow_teams_set_updated_at before update on public.flow_teams
  for each row execute function public.flow_set_updated_at();
drop trigger if exists flow_workspace_roles_set_updated_at on public.flow_workspace_roles;
create trigger flow_workspace_roles_set_updated_at before update on public.flow_workspace_roles
  for each row execute function public.flow_set_updated_at();
drop trigger if exists office_folders_updated_at on public.office_folders;
create trigger office_folders_updated_at before update on public.office_folders
  for each row execute function public.update_office_folders_updated_at();
drop trigger if exists office_files_updated_at on public.office_files;
create trigger office_files_updated_at before update on public.office_files
  for each row execute function public.update_office_files_updated_at();

alter table public._prisma_migrations enable row level security;
alter table public.canvas_boards enable row level security;
alter table public.flow_forms enable row level security;
alter table public.flow_issues enable row level security;
alter table public.flow_issue_comments enable row level security;
alter table public.flow_tasks enable row level security;
alter table public.flow_teams enable row level security;
alter table public.flow_workspace_roles enable row level security;
alter table public.office_folders enable row level security;
alter table public.office_files enable row level security;
alter table public.office_file_shares enable row level security;

drop policy if exists "Users can create own boards" on public.canvas_boards;
create policy "Users can create own boards" on public.canvas_boards for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own boards" on public.canvas_boards;
create policy "Users can delete own boards" on public.canvas_boards for delete using (auth.uid() = user_id);
drop policy if exists "Users can update own boards" on public.canvas_boards;
create policy "Users can update own boards" on public.canvas_boards for update using (auth.uid() = user_id);
drop policy if exists "Users can view own boards" on public.canvas_boards;
create policy "Users can view own boards" on public.canvas_boards for select using (auth.uid() = user_id);

drop policy if exists flow_forms_project_access on public.flow_forms;
create policy flow_forms_project_access on public.flow_forms for all
  using (auth.uid() is not null and public.flow_can_access_project(project_id))
  with check (auth.uid() is not null and public.flow_can_access_project(project_id));
drop policy if exists flow_issues_authenticated on public.flow_issues;
create policy flow_issues_authenticated on public.flow_issues for all
  using (auth.uid() is not null and public.flow_can_access_project(project_id))
  with check (auth.uid() is not null and public.flow_can_access_project(project_id));
drop policy if exists flow_issue_comments_authenticated on public.flow_issue_comments;
create policy flow_issue_comments_authenticated on public.flow_issue_comments for all
  using (auth.uid() is not null and exists (
    select 1 from public.flow_issues i
    where i.id = flow_issue_comments.issue_id and public.flow_can_access_project(i.project_id)))
  with check (auth.uid() is not null and exists (
    select 1 from public.flow_issues i
    where i.id = flow_issue_comments.issue_id and public.flow_can_access_project(i.project_id)));
drop policy if exists flow_tasks_authenticated on public.flow_tasks;
create policy flow_tasks_authenticated on public.flow_tasks for all
  using (auth.uid() is not null and public.flow_can_access_project(project_id))
  with check (auth.uid() is not null and public.flow_can_access_project(project_id));
drop policy if exists flow_teams_member on public.flow_teams;
create policy flow_teams_member on public.flow_teams for all
  using (auth.uid() is not null and (public.flow_can_access_project(id)
    or (project_id is not null and public.flow_can_access_project(project_id))
    or (organization_id is not null and organization_id = public.flow_current_org())))
  with check (auth.uid() is not null and (public.flow_can_access_project(id)
    or (project_id is not null and public.flow_can_access_project(project_id))
    or (organization_id is not null and organization_id = public.flow_current_org())));
drop policy if exists flow_workspace_roles_org on public.flow_workspace_roles;
create policy flow_workspace_roles_org on public.flow_workspace_roles for all
  using (auth.uid() is not null and organization_id = public.flow_current_org())
  with check (auth.uid() is not null and organization_id = public.flow_current_org());

drop policy if exists "Users can create own folders" on public.office_folders;
create policy "Users can create own folders" on public.office_folders for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own folders" on public.office_folders;
create policy "Users can delete own folders" on public.office_folders for delete using (auth.uid() = user_id);
drop policy if exists "Users can update own folders" on public.office_folders;
create policy "Users can update own folders" on public.office_folders for update using (auth.uid() = user_id);
drop policy if exists "Users can view own folders" on public.office_folders;
create policy "Users can view own folders" on public.office_folders for select using (auth.uid() = user_id);

drop policy if exists "Update editable files" on public.office_files;
create policy "Update editable files" on public.office_files for update
  using (public.can_edit_file(id)) with check (public.can_edit_file(id));
drop policy if exists "Users can create own files" on public.office_files;
create policy "Users can create own files" on public.office_files for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own files" on public.office_files;
create policy "Users can delete own files" on public.office_files for delete using (auth.uid() = user_id);
drop policy if exists "View accessible files" on public.office_files;
create policy "View accessible files" on public.office_files for select using (public.can_view_file(id));

drop policy if exists "Invitee views own share" on public.office_file_shares;
create policy "Invitee views own share" on public.office_file_shares for select
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
drop policy if exists "Owner manages shares" on public.office_file_shares;
create policy "Owner manages shares" on public.office_file_shares for all
  using (exists (select 1 from public.office_files f where f.id = office_file_shares.file_id and f.user_id = auth.uid()))
  with check (exists (select 1 from public.office_files f where f.id = office_file_shares.file_id and f.user_id = auth.uid()));

grant all on table public._prisma_migrations, public.flow_forms, public.flow_issues, public.flow_issue_comments,
  public.flow_tasks, public.flow_teams, public.flow_workspace_roles to anon, authenticated, service_role;
grant all on table public.canvas_boards, public.office_folders, public.office_files, public.office_file_shares
  to authenticated, service_role;
revoke all on table public.canvas_boards, public.office_folders, public.office_files, public.office_file_shares from anon;

notify pgrst, 'reload schema';
