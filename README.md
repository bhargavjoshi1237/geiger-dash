<div align="center">

# Geiger Dash

**The front door to the Geiger suite.**

The marketing site, the account system, and the routing hub that stitches every Geiger product into one experience at one domain.

Part of the [Geiger](#the-geiger-suite) suite.

</div>

---

## Overview

Geiger Dash is the parent application of the Geiger suite. It owns everything that is shared rather than product-specific:

- the **public site** — home, product and feature pages, solutions, pricing, blog, changelog, docs, tools, and legal;
- the **account layer** — login, signup, onboarding, invites, organisations, roles, usage, and Stripe billing;
- the **routing hub** — rewrites that serve every product app under a path on the same origin (`/flow`, `/notes`, `/events`, `/forms`, `/content`, `/campaign`, `/chat`, `/canvas`, `/assets`, `/office`, `/property`, `/audio`), so the suite shares one domain and one session.

Because every product is proxied through Dash and every product app runs under its own base path on that origin, a user signs in once and moves between applications without another handshake.

## Highlights

| Area | What it does |
| --- | --- |
| **Public site** | Home, product and per-product feature pages, solutions, pricing, contact, privacy and terms, rendered with SEO metadata and OpenGraph images. |
| **Blog & changelog** | Published posts and release notes with their own routes, widgets, and a daily automation job that drafts posts from search plus an LLM. |
| **Docs** | Suite documentation served from `/docs/[...slug]`. |
| **Auth & onboarding** | Login, signup, OAuth with PKCE, an auth callback, onboarding, and token-based invites. |
| **Organisations** | Org creation and settings, membership, roles, and per-org usage. |
| **Billing** | Stripe subscriptions, checkout, and a webhook endpoint for lifecycle events. |
| **Studio** | Internal authoring tools — a content studio, a pages studio, and post management. |
| **Admin** | Email template management, built on React Email and delivered via Resend. |
| **Free tools** | Public utilities — image converter, crop, and resize — used as top-of-funnel surfaces. |
| **Analytics** | PostHog instrumentation across the public site and app. |
| **SEO** | Generated `sitemap.xml` and `robots.txt`, refreshed daily by a cron job. |

## Tech stack

- **Framework** — Next.js 16 (App Router, SSR/SSG) and React 19
- **Styling** — Tailwind CSS v4 and shadcn/ui, with the shared [`@geiger/ui`](https://github.com/bhargavjoshi1237/geiger-ui) component library
- **Icons** — Lucide
- **Data** — Supabase (Postgres, Auth) and Prisma (`@prisma/adapter-pg`)
- **Payments** — Stripe
- **Email** — React Email and Resend
- **Storage** — Vercel Blob
- **Analytics** — PostHog
- **Content & canvas** — Tiptap, React Flow (`@xyflow/react`), Excalidraw, Mermaid
- **Charts** — Recharts

## Getting started

### Prerequisites

- Node.js 20 or later
- A Supabase project, a Stripe account, and a Resend account

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```bash
# Site
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=geiger.studio
NEXT_PUBLIC_COOKIE_DOMAIN=.geiger.studio

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Postgres (Prisma)
DATABASE_URL=your-pooled-postgres-url
DIRECT_URL=your-direct-postgres-url

# Stripe
GEIGER_STRIPE_SECRET_KEY=your-stripe-secret-key
GEIGER_STRIPE_WEBHOOK_SECRET=your-stripe-webhook-signing-secret

# Email
EMAIL_FROM=your-sender-address

# Analytics
NEXT_PUBLIC_GEIGER_POSTHOG_PROJECT_TOKEN=your-posthog-token
NEXT_PUBLIC_GEIGER_POSTHOG_HOST=your-posthog-host

# Cron (server-only)
CRON_SECRET=your-vercel-cron-secret

# Blog automation (optional)
BLOG_LLM_BASE_URL=...
BLOG_LLM_API_KEY=...
BLOG_LLM_MODEL=...
BLOG_SEARCH_API_URL=...
BLOG_SEARCH_API_KEY=...
```

### Database

```bash
npm run db:push          # run pending SQL migrations
npm run db:push:all      # re-run every migration
npm run db:generate      # generate the Prisma client
npm run db:migrate       # apply Prisma migrations
npm run db:studio        # open Prisma Studio
```

Email templates have their own commands:

```bash
npm run email:migrate
npm run email:seed
```

### Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scheduled jobs

Two Vercel cron jobs are declared in [`vercel.json`](vercel.json), both authenticated with `CRON_SECRET`:

| Schedule | Endpoint | Purpose |
| --- | --- | --- |
| `0 5 * * *` | `/api/cron/refresh-sitemap` | Regenerates `sitemap.xml` from the permanent public routes and published blog posts (cached for one day). |
| `0 0 * * *` | `/api/cron/blog-automation` | Drafts and publishes automated blog content. |

To refresh the sitemap manually:

```powershell
$env:CRON_SECRET="your-vercel-cron-secret"
npm run sitemap:refresh
```

Set `SITE_URL` when refreshing a preview or local deployment instead of `https://geiger.studio`.

## Project structure

```
app/
  page.js, product/, features/, solutions/, pricing/   Public marketing site
  blog/, changelog/, docs/, tools/, contact/, legal    Content and utility surfaces
  login/, signup/, auth/, onboarding/, invite/         Account flows
  org/[ORGID]/, billing/                               Organisations and billing
  studio/, admin/                                      Internal authoring and email admin
  api/                                                 Cron, email, OAuth, Stripe, studio endpoints
lib/
  product-routes.mjs   Product rewrites — the suite routing table
  org/, billing/       Organisation and subscription logic
  oauth/               PKCE, providers, session
  email/, blog-*/      Email delivery and blog automation
  sitemap/, seo        SEO generation
  prisma.js            Prisma client
prisma/                Prisma schema and migrations
supabase/sqls/         SQL migrations
scripts/               Migration, sitemap, and email seed runners
docs/                  Automation and pricing documentation
```

## Deployment

Dash is linked to Vercel auto-deploy, and its rewrites depend on the deployed product apps. Pushing to `main` triggers builds across the linked repositories, so land work on a branch and merge deliberately.

Adding a new product to the suite means adding its rewrite pair to `lib/product-routes.mjs` — that also registers it as a valid post-login redirect target.

## Conventions

This codebase follows a consistent set of patterns. Read these before contributing:

- [`MODULE_CONVENTIONS.md`](MODULE_CONVENTIONS.md) — how to build a workspace screen
- [`SUPABASE_CONVENTIONS.md`](SUPABASE_CONVENTIONS.md) — the data-layer playbook
- [`crafting.md`](crafting.md) — UI craft and quality bar
- [`docs/blog-automation.md`](docs/blog-automation.md) — how the blog automation job works

## The Geiger suite

Geiger Dash is the parent app of the Geiger suite. The products it serves — Flow, Notes, Events, Forms, Content, Campaign, Chat, Comms, Docs, Property, Assets, Office, Canvas — each live in their own repository, share one Supabase project, and use the [`@geiger/ui`](https://github.com/bhargavjoshi1237/geiger-ui) component library so the whole suite feels like one product.

## License

Private and unpublished. All rights reserved.
