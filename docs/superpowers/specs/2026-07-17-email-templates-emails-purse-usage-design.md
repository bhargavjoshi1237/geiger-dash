# Email templates + emails purse + org usage page — Design

Date: 2026-07-17

## Goal

Three connected additions, built on the existing pricing → checkout → entitlements pattern:

1. A **$10/mo "Custom email templates"** add-on on the pricing page, gated as an
   entitlement, with a **full builder** to create/manage branded email templates
   per org.
2. A **"Monthly emails"** slider ($0.35 per 1,000, pay-as-you-go from 0) that funds
   a **global org-wide email purse** usable for any purpose across products.
3. A new **`/org/[ORGID]/usage`** page (reached from the org menu) mirroring
   geiger-flow's usage screen, showing purchased allowances vs. usage and
   showcasing everything purchasable on the pricing screen.

## Non-goals

- A real email send/metering pipeline. The usage page shows the purse
  (allowance) accurately; "used" reads 0 until sending is wired later. The page is
  structured so real usage is a drop-in.

## 1. Pricing model — `lib/pricing/plans.js`

- New category `email`: `{ id: "email", name: "Email & messaging", description:
  "Design and manage your own branded email templates.", rate: 10 }`.
- New product: `{ id: "emailTemplate", name: "Custom email templates", detail:
  "Create and manage branded emails for your events", category: "email", price: 10 }`.
- Every plan's `productAllowances` gains `email: 0` (no free include). Every plan
  gains `emailAllowance: 0`.
- New metric appended to `metricConfig`: `{ id: "emails", label: "Monthly emails",
  min: 0, max: 200000, step: 1000, suffix: "emails" }`.
- `EMAIL_RATE_PER_1000 = 0.35`.
- `computeEstimate()` adds `emails` to the sanitized metrics (floor
  `plan.emailAllowance`), computes `emailCost = (emails / 1000) * EMAIL_RATE_PER_1000`,
  folds it into `total`, and returns `emailCost` in the breakdown.

The checkout action (`app/pricing/actions.js`) and downgrade guard iterate
generically over categories/metrics, so they need **no changes** — the
`emailTemplate` product flows through `purchasableProducts`, the `emails` metric
flows through `metrics`, and both persist via the existing store into
`organizations.metadata.subscription`.

## 2. Entitlements — `lib/billing/entitlements.js`

`getOrgEntitlements().currentMetrics` gains `emails: storedMetrics.emails ??
plan.emailAllowance ?? 0` so the calculator floor and the usage page can read it.

## 3. Calculator UI — `components/pricing/plan_cards.jsx`

- Add `emailTemplate: MailPlus` (Lucide) to `PRODUCT_ICONS`.
- The `email` category and `emails` slider render through existing loops.
- Add `emails` to every metrics object: `DEFAULT_CONFIG.metrics`, `selectPlan`'s
  `setMetrics`, and `metricFloor` (returns `selectedPlan.emailAllowance` floored by
  owned).
- Add a **"Monthly emails"** breakdown row (with `estimate.emailCost`) in the
  summary sidebar.
- Add a **callout under the emails slider** explaining these are a global org-wide
  email purse — usable for any purpose across products, drawn down as products
  send. Slider left-label: "$0.35 per 1,000 emails".

## 4. Email-templates module (full builder), gated on `emailTemplate`

Mirrors the OAuth/Domain add-on pattern.

- **Migration** `supabase/migrations/0010_org_email_templates.sql` —
  `public.org_email_templates`: `id`, `organization_id` FK → `organizations(id)`
  on delete cascade, `name`, `event_name`, `subject`, `body`, `status`
  (draft|active), `created_by`, `metadata jsonb`, `created_at`/`updated_at`
  (touch trigger), `deleted_at`. Index on `organization_id`. RLS on:
  org members select; owner/creator insert/update/delete (demo-open policy
  consistent with existing migrations if member helpers absent — matches repo's
  current RLS posture).
- **Data layer** `lib/email/store.js` — service-role admin client (mirrors
  `lib/domains/store.js`): `normalizeEmailTemplate`/`toRow`,
  `listOrgEmailTemplates`, `getOrgEmailTemplate`, `createOrgEmailTemplate`,
  `updateOrgEmailTemplate`, `softDeleteEmailTemplate`. Pure: null/false/[] on
  failure, `console.error`, never throws.
- **Server actions** `app/org/email-actions.js` — `authorizeOrgOwner` verifying
  membership (RLS-scoped select) AND `isProductUnlocked(entitlements,
  'emailTemplate')`, then call the store. Returns `{ ok, ... }`/`{ ok:false,
  error }`.
- **UI** — `EmailTemplatesTab` inside the existing org **Settings dialog** (same
  surface OAuth & Domain tabs use), shown only when `hasEmailTemplateAddon`:
  list of templates (name, event, status, edit/delete) + a create/edit form
  (name, event, subject, body). Optimistic + toasts, consistent with the other
  add-on tabs.

## 5. Usage page — `/org/[ORGID]/usage`

- Server page (`force-dynamic`) fetches the org, computes entitlements, and passes
  a client-safe shape (plan name, per-metric allowances incl. emails purse, owned
  product ids). Reuses `getOrganizationProjects` for the org row + project count.
- Client `UsageScreen` mirrors geiger-flow
  (`components/internal/screens/dashboard/usage/usage.jsx`): header with a
  billing-period bar, summary metric cards with progress meters, and recharts bar
  charts (`recharts` + `components/ui/chart|card|progress` already present in
  geiger-dash). Each purchased allowance (projects, seats, storage, bandwidth,
  edge, AI credits, **emails purse**) shows used (0 for now) vs. purchased.
- A **"What you can add"** section lists every purchasable item from the pricing
  screen (products + allowances) with a **"Go to pricing"** CTA.
- Reached via a new **"Usage"** item in both the org **dropdown and context
  menus** (`app/org/organizations-client.jsx`), under the manage section near
  Settings (icon `Gauge`), navigating with `useRouter` to
  `/org/${organization.id}/usage`.

## Verification

- `npx eslint` clean on all changed files.
- Apply `0010_org_email_templates.sql` via the raw-SQL/`pg` over `DIRECT_URL` path
  if DB creds are available; otherwise leave for the user to run (`npm run db:push`
  equivalent for this repo).
