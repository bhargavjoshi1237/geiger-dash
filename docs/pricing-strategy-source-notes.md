# Geiger Studio Pricing Strategy - Source Notes

Generated: June 13, 2026

## Decision

Recommend a hybrid workspace-plus-usage pricing model:

- Free
- Starter: $29/month or $290/year
- Team: $79/month or $790/year
- Studio: $179/month or $1,790/year
- Custom: monthly only, starting at $19/month

Annual discounts apply only to fixed plan fees. Variable usage remains billed monthly.

## Repository Inventory

Reviewed the projects under `C:\Pro`:

- `geiger-dash`
- `geiger-flow`
- `geiger-notes`
- `geiger-canvas`
- `geiger-assets`
- `geiger-forms`
- `geiger-office`
- `geiger-docs`
- `geiger-events`
- `geiger-campaign`
- `geiger-chat`
- `geiger-content`
- `geiger-grey`

The dashboard is the suite shell. The other 12 are treated as customer-facing products.

## Primary Local Evidence

- Current plan logic: `C:\Pro\geiger-dash\components\pricing\plan_cards.jsx`
- Product routes: `C:\Pro\geiger-dash\lib\product-routes.mjs`
- Flow billing mock: `C:\Pro\geiger-flow\components\internal\screens\dashboard\billing\upgrade_plan_dialouge.jsx`
- Flow usage mock: `C:\Pro\geiger-flow\components\internal\screens\dashboard\usage\usage.jsx`
- Flow Prisma foundation: `C:\Pro\geiger-flow\prisma\schema.prisma`
- Notes board/collaboration data: `C:\Pro\geiger-notes\database\init\boards.sql`, `collab.sql`
- Notes realtime: `C:\Pro\geiger-notes\lib\collab\hooks\useRealtime.js`
- Canvas persisted editor state: `C:\Pro\geiger-canvas\supabase\schema.sql`
- Assets scope and future cost drivers: `C:\Pro\geiger-assets\DAM_FEATURES.md`
- Forms persistence and future integrations: `C:\Pro\geiger-forms\supabase\sqls\forms.sql`, `FEATURES_SUITE.md`, `FEATURES_STANDALONE.md`
- Office storage and file behavior: `C:\Pro\geiger-office\database\README.md`, `database\init\storage.sql`
- Events feature and transaction scope: `C:\Pro\geiger-events\docs\feature-list.md`
- Campaign feature and send-volume scope: `C:\Pro\geiger-campaign\docs\campaign-management-competitive-research.md`
- Content edge, audience, experiment, and recommendation scope: `C:\Pro\geiger-content\Aim.md`
- Docs signing scope: `C:\Pro\geiger-docs\docs\product-research\document-sign-competitive-research.md`
- Chat text, file, call, and meeting scope: `C:\Pro\geiger-chat\components\internal`

## External Price Signals

Official pages reviewed:

- Supabase: https://supabase.com/pricing
- Supabase billing: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase egress: https://supabase.com/docs/guides/platform/manage-your-usage/egress
- Vercel: https://vercel.com/pricing
- Vercel Pro: https://vercel.com/docs/plans/pro-plan
- Cloudflare R2: https://developers.cloudflare.com/r2/pricing/
- Cloudflare RealtimeKit: https://developers.cloudflare.com/realtime/realtimekit/pricing/
- Cloudflare Stream: https://developers.cloudflare.com/stream/pricing/
- Resend: https://resend.com/pricing
- OpenAI API: https://developers.openai.com/api/docs/pricing
- Stripe: https://stripe.com/pricing
- Stripe Connect: https://stripe.com/connect/pricing

## Assumptions

- One shared multi-tenant production database is used initially.
- Product deployments remain separate, but share identity, billing, entitlement, and usage records.
- Large files move to object storage and are not stored as Postgres blobs or embedded canvas JSON.
- Payment processing fees are passed through or displayed separately.
- Support, labor, compliance, and taxes are not included in raw infrastructure estimates.
- Proposed prices target about 75% gross margin at ordinary usage.

## Omitted Quantitative Visuals

No chart was created because there is no observed customer usage, cost history, conversion data, or product attachment data. A chart based only on proposed assumptions would imply more precision than the evidence supports. Tables are used for exact plan and meter recommendations.

## Report Structure Mapping

- Title: `Geiger Studio Pricing Strategy`
- Executive summary: direct recommendation
- Key findings: current model mismatch, cost families, plan design, overages, provider signals, architecture
- Recommended next steps: six-step implementation and validation sequence
- Further questions: unresolved commercial and operational decisions
- Caveats and assumptions: prototype status and missing actual usage data
