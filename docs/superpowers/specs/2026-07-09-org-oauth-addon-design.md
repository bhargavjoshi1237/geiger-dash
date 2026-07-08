# Per-Org OAuth (SSO) Add-On — Design

**Date:** 2026-07-09
**Status:** Approved, implementing

## Summary

A purchasable, per-organization OAuth/SSO add-on. An org buys the "$10 OAuth /
SSO" add-on on the pricing page. Once owned, org owners/admins get an **OAuth**
tab in the org settings dialog where they configure a generic OAuth2/OIDC
provider (client id/secret, endpoints, scopes, attribute mapping). Members (and
new users) can then log in through that provider: the app runs the OAuth
auth-code flow itself, finds-or-creates a Supabase auth user, auto-joins them to
the org, and mints a real Supabase session by reusing the existing
`/auth/callback` verifyOtp path.

**Why app-managed (not Supabase-managed):** Supabase auth/provider config is
project-global, so it cannot be per-organization. Per-org is the whole premise of
a sellable add-on, so the OAuth client is implemented in our own routes while
Supabase remains the identity/session store.

## 1. Pricing — the $10 add-on

- New catalog product `oauth` ("OAuth / SSO login") in a new `security` category
  (rate `$10`) in `lib/pricing/plans.js`.
- Add `security: 0` to every plan's `productAllowances` (and `betaPlan` has no
  allowances object, unaffected) so the add-on is never free — selecting it
  always adds exactly `$10/mo` (`×10` = `$100/yr`). `computeEstimate` reads
  `productAllowances[category.id]`, so the `0` allowance is required to avoid
  `NaN`.
- The pricing calculator (`components/pricing/plan_cards.jsx`) renders
  `productCategories` generically, so the add-on appears automatically as a
  toggle in a "Security & SSO" section. Billed as a delta through the existing
  Stripe checkout — no new billing code.
- "Org has OAuth" is derived through the existing entitlements plumbing:
  `metadata.subscription.products` → `getOrgEntitlements().unlockedProducts` →
  `isProductUnlocked(entitlements, 'oauth')`.

## 2. Provider storage

`supabase/migrations/0007_org_oauth_providers.sql`:

- Table `org_oauth_providers`: `id uuid pk`, `organization_id uuid` (FK →
  `organizations(id)`, unique — one provider per org), `provider_name text`,
  `provider_type text` (`oidc`|`oauth2`), `client_id text`,
  `client_secret text`, `issuer text`, `discovery_url text`,
  `authorization_url text`, `token_url text`, `userinfo_url text`,
  `scopes text[]` default `{openid,email,profile}`,
  `attribute_mapping jsonb` (keys: `email`, `name`, `avatar`),
  `pkce_enabled bool default true`, `enabled bool default false`,
  `created_at`/`updated_at timestamptz default now()`, `deleted_at timestamptz`.
- `updated_at` trigger reusing `public.flow_touch_updated_at()` if present, else a
  locally-defined touch function (idempotent).
- RLS on. Policy: org owner/creator (via existing `organizations.owner` /
  `created_by`) can select/insert/update/delete their org's row. `client_secret`
  is only ever read server-side through the service-role client and never sent to
  the browser (management UI receives a masked value).

## 3. Data layer + server actions

- `lib/oauth/providers.js` (server-only): admin-client CRUD +
  `normalizeProvider`/`toRow`, discovery resolution helper
  (`resolveDiscovery(url)` → fetch `.well-known/openid-configuration`), and a
  `maskProvider` that strips `client_secret` for client consumption.
- `app/org/oauth-actions.js` (`"use server"`, mirrors `app/org/actions.js`):
  - `getOrgOAuthProviderAction(orgId)` → masked provider or null.
  - `saveOrgOAuthProviderAction(orgId, config)` — verifies ownership via the
    user's RLS client AND re-derives entitlements from org metadata server-side
    (`isProductUnlocked`) so the add-on must be owned; upserts via admin client.
  - `setOrgOAuthEnabledAction(orgId, enabled)`.
  - `deleteOrgOAuthProviderAction(orgId)` (soft delete).
  - `resolveOAuthDiscoveryAction(discoveryUrl)` — for the "Fetch endpoints" button.
  - Return plain result objects (`{ ok, ... }` / `{ ok:false, error }`); the
    client owns toasts.

## 4. OAuth flow routes

- `GET /app/api/oauth/[orgId]/start/route.js`: load enabled provider (admin
  client); generate `state` + PKCE `code_verifier`/`code_challenge`; store
  `state` + verifier in short-lived httpOnly cookies; redirect to the provider's
  `authorization_url` with `redirect_uri = {origin}/api/oauth/{orgId}/callback`,
  `response_type=code`, scopes, `state`, and (if `pkce_enabled`) the challenge.
  Accepts `?next=` (default `/org/{orgId}`).
- `GET /app/api/oauth/[orgId]/callback/route.js`: verify `state` cookie; exchange
  `code` at `token_url` (client_id/secret + `code_verifier`); fetch `userinfo_url`
  with the access token; map claims → `{ email, name, avatar }` via
  `attribute_mapping`. On any failure redirect to
  `/login?error=oauth_failed`.

## 5. Session + user + auto-join

In the callback, via the service-role admin client:

1. Find-or-create the Supabase auth user by email
   (`admin.createUser({ email, email_confirm:true, user_metadata:{ name, avatar_url } })`
   when new — **auto-provision**). Lookup by listing/filtering users by email.
2. **Auto-join**: idempotently ensure a membership — insert
   `organization_users (user_id, organization_id, role)` if absent and append the
   user id to `organizations.metadata.members`.
3. Mint a session: `admin.generateLink({ type:'magiclink', email })` → redirect to
   the existing `/auth/callback?token_hash=<hashed_token>&type=magiclink&next=<next>`,
   which already calls `verifyOtp` and sets Supabase session cookies. Clear the
   PKCE/state cookies.

## 6. Login / signup entry

- Add a "Continue with SSO" button on `app/login/auth-form.jsx` and
  `app/signup/signup-form.jsx`: opens a small prompt for the organization ID/slug,
  then navigates to `/api/oauth/{org}/start?next=…`. The setup/management UI also
  surfaces the direct shareable SSO link.
- Existing decorative Google/GitHub/Apple buttons stay out of scope.

## Trade-offs / notes

- `client_secret` stored as text (as Supabase's own `custom_oauth_providers`
  does), read only server-side. App-key encryption is a possible follow-up.
- Requires `SUPABASE_SERVICE_ROLE_KEY` (already used by billing). All new surfaces
  degrade gracefully when env/DB is absent.
- Provider resolution prefers explicit endpoint URLs; a discovery/issuer URL is a
  convenience that populates them on save.

## Build order

1. Pricing catalog (`plans.js`).
2. Migration (`0007_org_oauth_providers.sql`).
3. Data layer (`lib/oauth/providers.js`) + server actions (`app/org/oauth-actions.js`).
4. Flow routes (`start`, `callback`) + auto-provision/join + session mint.
5. Org settings OAuth tab (`organizations-client.jsx`).
6. Login/signup SSO entry.
7. Lint clean (`npx eslint` on changed files).
