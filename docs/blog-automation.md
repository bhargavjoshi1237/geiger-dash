# Geiger Blog Automation

The automation runs a people-first content pipeline:

1. Select and score a non-duplicate topic from seed topics, existing posts, and changelogs.
2. Gather web research through an optional Tavily-compatible search endpoint.
3. Produce a research brief and an independent critique.
4. Write a structured SEO/GEO article with an OpenAI-compatible model.
5. Run a strict editorial review and save the article as a draft.
6. Publish only when `BLOG_AUTOMATION_AUTO_PUBLISH=true` and the review score
   reaches `BLOG_AUTOMATION_QUALITY_THRESHOLD`.
7. Store runs, topics, sources, model roles, latency, tokens, failures, and
   estimated cost in Supabase.

## Setup

1. Run `database/init/blog_automation.sql` in the Supabase SQL editor.
2. Configure the variables documented in `.env.example`.
3. Set `BLOG_AUTOMATION_ENABLED=true` after testing a manual run.
4. Keep `BLOG_AUTOMATION_AUTO_PUBLISH=false` until editorial output is trusted.

The cron endpoint is `GET /api/cron/blog-automation` and requires:

```text
Authorization: Bearer <CRON_SECRET>
```

Vercel invokes it every two hours. The database-backed daily limit defaults to
10, so the last two invocations each UTC day are skipped.

Authenticated Studio users can inspect recent usage with
`GET /api/studio/blog-automation` and trigger a manual run with
`POST /api/studio/blog-automation`.

## Multi-model profiles

For one provider, set `BLOG_LLM_BASE_URL`, `BLOG_LLM_API_KEY`, and
`BLOG_LLM_MODELS`. Models rotate across strategist, researcher, critic, writer,
and reviewer roles.

For separate providers or role assignments, use `BLOG_LLM_PROFILES`. Each
profile supports `id`, `roles`, `baseUrl`, `apiKey`, `model`,
`inputPricePerMillion`, and `outputPricePerMillion`.

API keys are server-only. Do not prefix them with `NEXT_PUBLIC_`.

