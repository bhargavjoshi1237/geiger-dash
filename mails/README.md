# Geiger Email System

`geiger-dash` is the **mother project** of the suite, so it hosts the entire
email stack: every transactional template, the admin editing surface, the
sending pipeline, and a cross-app API. Other apps (geiger-flow, geiger-notes, …)
don't bundle their own email setup — they call this project's API.

## Architecture

```
mails/                          # The template library (React Email)
  theme.js                      # Brand tokens (colours, fonts)
  interpolate.js                # {{variable}} substitution
  components/
    Layout.jsx                  # Branded shell (header / card / footer)
    ui.jsx                      # Heading, Paragraph, Button, DataPanel, Quote…
  templates/<project>/*.jsx     # One component per email
  registry.js                   # JSX-free metadata (source of truth for seeding)
  index.js                      # key -> component map (runtime only)
  render.jsx                    # renderTemplate({ key, content, subject, data })

lib/email/                      # Server feature layer
  service.js                    # service-role client scoped to schema `email`
  queries.js                    # reads (templates, messages, api_keys)
  actions.js                    # server actions for the admin UI
  render.js                     # DB content -> mails/render.jsx
  send.js                       # render -> log -> Resend -> update log
  keys.js / auth.js             # API key generation + verification

app/admin/emails/page.js        # Admin surface (directory view)
components/admin/emails/*        # Tree + preview/editor + logs + keys UI
app/api/email/send/route.js     # Cross-app send API (Bearer key auth)

supabase/migrations/0001_email.sql   # `email` schema, tables, RLS, grants
scripts/run-email-migrations.mjs     # npm run email:migrate
scripts/seed-email-templates.mjs     # npm run email:seed
```

## Data model (`email` schema)

- **templates** — one row per email. `content` holds the editable text slots,
  `fields` is the editor schema, `sample_data` drives previews, `variables`
  documents the runtime data the caller must supply.
- **messages** — append-only send log.
- **api_keys** — hashed keys for cross-app authentication.

## Editable content + dynamic data

A template renders from two inputs:

- **content** — admin-editable text slots stored on the template row. Slot
  values may contain `{{variables}}`.
- **data** — runtime values supplied per-send (recipient name, issue title,
  links, …).

At render time the stored subject + content are merged with the registry
defaults, `{{variables}}` are interpolated against `data`, and the React
component is rendered to HTML.

## Setup

1. `npm run email:migrate` — create the `email` schema and tables.
2. In Supabase → **API → Exposed schemas**, add `email`.
3. `npm run email:seed` — push the template library into `email.templates`.
4. Set `RESEND_API_KEY` and `EMAIL_FROM` in the environment.
5. Open `/admin/emails` to edit, preview, and send tests.

## Adding a template

1. Add the component under `mails/templates/<project>/`.
2. Register it in `mails/index.js` (key → component).
3. Add its metadata entry to `mails/registry.js`.
4. `npm run email:seed`.

## Sending from another suite app

Create a key in `/admin/emails → API keys`, then:

```bash
curl -X POST https://geiger.studio/api/email/send \
  -H "Authorization: Bearer gk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "flow.issue_assigned",
    "to": "person@example.com",
    "data": { "recipientName": "Alex", "issueTitle": "Login bug", "issueUrl": "https://..." }
  }'
```
