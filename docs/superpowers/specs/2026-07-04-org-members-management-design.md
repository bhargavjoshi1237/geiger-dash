# Organization Members Management — Design

- **Date:** 2026-07-04
- **Status:** Draft, awaiting user approval
- **Area:** `/org` (organization settings) + `/org/[orgid]` (project visibility)

## Summary

Turn the **Organization Settings → Members** tab (in `app/org/organizations-client.jsx`)
from a static summary into a real management surface:

- A **scrollable list of members** (avatar, name/email, role badge, "you"/owner markers).
- A per-row **options menu** (owner/admin only): **Kick** and **Edit permissions**.
- **Edit permissions** dialog: a **role** picker (Owner / Admin / Member) plus a
  **project-access** checklist (grant/revoke which projects the member can reach).
- Access is **enforced at the database (RLS)**, not just hidden in the UI: a
  regular Member can only read/edit/launch projects they've been granted; Owner
  and Admin see all.

## Decisions

| # | Decision | Source |
|---|----------|--------|
| 1 | Project access is **fully enforced via RLS** (not advisory). | User |
| 2 | Assignable roles: **Owner / Admin / Member**, including ownership transfer. | User |
| 3 | **Admins see all projects** (bypass grants, like Owner). Only Members are limited. | Default (flagged) |
| 4 | Members can still create projects; **the creator is auto-granted** access to it. | Default (flagged) |
| 5 | Member-management + ownership transfer go through **SECURITY DEFINER RPCs** that authorize internally (not table-RLS ability grants), matching the existing `join_organization`/`accept_invite` pattern. | Design |

Decisions 3 and 4 were my defaults (the user stepped away); both are easy to flip.

## Out of scope (YAGNI)

- Inviting new members (already exists via the onboarding wizard + `invite_to_organization`).
- Bulk member actions, audit log, email-on-kick notifications.
- Wiring up the Settings **General/Security** tabs' "Save" (currently stubbed to a
  toast) — untouched by this work.

## Data model — migration `supabase/migrations/0006_org_member_access.sql`

Applied via `npm run db:push -- --all` (see Tooling). Idempotent + self-contained.

### Open item — the `public."Role"` enum

The codebase only demonstrably uses `'Owner'` and `'User'`. This feature needs
`'Admin'`. **Verify the enum's values first.** If `'Admin'` is missing, add it —
but `ALTER TYPE ... ADD VALUE` cannot be used in the same transaction that then
*uses* the new value, and `run-sqls.mjs` wraps each file in one transaction. So
the enum change ships as its **own** migration file
(`0006a_add_admin_role.sql`, `alter type public."Role" add value if not exists
'Admin'`) that runs before `0006`. If verification shows roles are stored as
plain text (not an enum) this step is dropped.

### New table `public.organization_user_project`

The per-member project ACL.

```
id           uuid pk default gen_random_uuid()
organization uuid not null references organizations(id) on delete cascade
"user"       uuid not null references auth.users(id)    on delete cascade
project      uuid not null references projects(id)       on delete cascade
created_at   timestamptz not null default now()
unique (organization, "user", project)
```

`project` is `projects.id` — the key the projects RLS filters on. RLS:
- `select`: `"user" = auth.uid()` **or** owner/admin of the org.
- `insert/update/delete`: owner/admin of the org (mutations happen through the
  definer RPCs below, which is the sanctioned path).

### New helper `can_access_project(target_org, target_project) → boolean`

```
auth.uid() is not null AND (
  public.org_role(target_org) in ('owner','admin')
  OR exists (select 1 from organization_user_project up
             where up.organization = target_org
               and up."user" = auth.uid()
               and up.project = target_project)
)
```
`SECURITY DEFINER, stable`.

### Fix `org_role` — single-owner semantics

Today `org_role` returns `'owner'` when `created_by = uid` **OR** `owner = uid`,
so the historical creator is permanently an owner and ownership can't be
transferred. Change it to make the `organizations.owner` column authoritative:

- if `owner is not null and owner = uid` → `'owner'`
- else if `owner is null and created_by = uid` → `'owner'` (legacy safety)
- else the `organization_users.role` (lowercased), else `metadata.members` → `'user'`, else null.

Blast radius is contained: `is_org_member`, `user_has_org`, and the find/join
RPCs are unchanged, so a demoted previous owner keeps membership (still
`created_by`) — they just lose owner privilege. `has_org_ability` and
`can_access_project` pick up the corrected role.

### Rewrite RLS on `projects`, `organization_project`, `plan`

Replace the blanket `is_org_member(...)` checks on `select/update/delete` with
access-aware checks so Members only see granted projects:

- `projects`: `select/update/delete using can_access_project(organization_id, id)`.
  `insert` unchanged (`has_org_ability(organization_id, 'projects.create')` — open
  module, so Members may create).
- `organization_project`: `select/update/delete using can_access_project(organisition, project)`.
  `insert` unchanged.
- `plan`: gate `select/update/delete` by whether an accessible `organization_project`
  references the plan:
  `org_role(organisation) in ('owner','admin') OR exists (select 1 from organization_project op where op.plan = plan.id and can_access_project(op.organisition, op.project))`.
  `insert` unchanged.

`'projects'` stays an open module (so `projects.create` still passes for Members).

## Server-side authorization RPCs (all `SECURITY DEFINER`, authorize internally)

- `list_org_members(p_org) → (user_id, email, name, avatar_url, role, is_owner, project_ids uuid[])`
  Unions members from `organization_users` + owner/creator + legacy
  `metadata.members`, joins `auth.users` for profile, and aggregates each
  member's grants. Readable by any org member (`is_org_member(p_org)` guard).
  `role` resolves via the corrected `org_role` logic per user.
- `org_transfer_ownership(p_org, p_new_user)` — caller **must be the current
  owner**. Sets `organizations.owner = p_new_user`; upserts the new owner's
  `organization_users` row to `'Owner'`; demotes the previous owner to `'Admin'`.
- `org_set_member_role(p_org, p_user, p_role)` — caller owner or admin. Sets
  target to `'Admin'` or `'User'`. Rules: cannot target the owner; an **admin**
  may only manage Members (not other admins/owner); `'Owner'` is rejected here
  (use transfer). Upserts the `organization_users` row.
- `org_remove_member(p_org, p_user)` — caller owner or admin. Cannot remove the
  owner; an admin cannot remove another admin. Deletes the `organization_users`
  row, removes the user from `metadata.members`, deletes their grant rows.
- `org_set_member_access(p_org, p_user, p_projects uuid[])` — caller owner or
  admin. Replaces that member's grant rows to exactly match `p_projects`.

All granted to `authenticated, service_role`.

## Application layer

### Server actions — `app/org/member-actions.js` (new)

Thin wrappers over the RPCs (the RPCs are the real guard); each returns
`{ ok, ... }` / `{ ok:false, error }` for the client to toast:

- `getOrgMembersAction(orgId)` → `list_org_members`.
- `getOrgProjectsForAccessAction(orgId)` → `[{ id, name }]` (reuses
  `getOrganizationProjects`; owner/admin see all projects, which is who calls it).
- `removeMemberAction(orgId, userId)` → `org_remove_member`.
- `updateMemberRoleAction(orgId, userId, role)` → `org_set_member_role`, or
  `org_transfer_ownership` when `role === 'Owner'`.
- `setMemberAccessAction(orgId, userId, projectIds)` → `org_set_member_access`.

### `createProjectAction` change (auto-grant)

After a project is created, insert an `organization_user_project` grant for the
creator via the **admin client** (`createAdminClient()`, bypassing RLS — the
project id and creator are server-controlled, not user-forgeable). Harmless for
owner/admin (who bypass grants anyway), and keeps a Member's own new project
visible to them.

### UI — `app/org/organizations-client.jsx`, Members tab

- On dialog open, load members + projects (loading → list, with empty state).
- **Member list:** scrollable (`max-h` + `overflow-y-auto`), each row: avatar,
  name/email, `StatusPill`-style role badge, "You"/"Owner" markers, and a
  right-aligned `DropdownMenu` (rendered only when the viewer is owner/admin and
  the row isn't the owner / isn't self for kick).
- **Kick:** confirm dialog → `removeMemberAction`, optimistic removal + toast.
- **Edit permissions dialog:** role `Select` (Owner / Admin / Member) + a
  scrollable project checklist seeded from the member's current `project_ids`.
  Selecting **Owner** swaps to an ownership-transfer confirm. Save calls
  `updateMemberRoleAction` and/or `setMemberAccessAction`; optimistic + toast +
  reconcile on failure.
- Menus/actions are hidden for non-owner/admin viewers (advisory); the RPCs +
  RLS are the hard backstop.
- Semantic color tokens only; shadcn primitives; Sonner toasts (per `crafting.md`).

## Tooling

`scripts/run-sqls.mjs` now takes `--all`: `npm run db:push` applies
`supabase/sqls/` only; `npm run db:push -- --all` (or `npm run db:push:all`)
applies `supabase/sqls/` then `supabase/migrations/` (base tables before the
RLS/RPC layer), each in filename order. So `0005` and `0006` are applied by
`db:push -- --all`. **This is the one command the user must run** for enforcement
to go live. *(This change is already implemented.)*

## Risks & behavior changes

- **Behavior change:** regular Members now see **only granted projects** on
  `/org/[orgid]` (previously all members saw everything). Intended.
- **Ownership transfer** is the sharpest edge; the `org_role` fix is what makes
  "exactly one owner" hold. Guarded to the current owner inside the RPC.
- The RLS rewrite is the security boundary — until `db:push -- --all` runs, the
  UI works but enforcement isn't live.
- Runs against the **shared** Supabase project; all DDL is idempotent and scoped
  to this app's own tables/functions.

## Verification plan

1. Apply `db:push -- --all`; confirm all files apply clean.
2. As owner: see all members + all projects; kick a member; change a member to
   Admin and back; grant/revoke a project and confirm the member's `/org/[orgid]`
   view changes accordingly.
3. As a regular member: confirm only granted projects are visible/launchable, and
   the members options menu is hidden.
4. Transfer ownership; confirm the old owner becomes Admin and the new owner has
   full control, with exactly one owner.
5. `npx eslint` clean on all changed JS/JSX.
