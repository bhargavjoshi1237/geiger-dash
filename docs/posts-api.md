# Posts API and MCP

Read and write blog posts (`dash_blog_posts`) from an AI app or script. Both surfaces run the same operations in `lib/posts/operations.js`, so they share the same checks.

## Authentication

Content editors create `gp_live_` keys at `/studio/api-keys`. A key is shown once and only its hash is stored. Send it as `Authorization: Bearer <key>`. The REST API also accepts `x-api-key`.

A key stops working when it is revoked or when its owner leaves `content_editors`. New posts are credited to the key's owner unless `authorSlug` names an author profile.

| Access | Allows |
|---|---|
| `read` | List and read posts, including drafts, and list categories |
| `draft` | Also create drafts and edit unpublished posts |
| `publish` | Also edit live posts, publish and unpublish |

## MCP

Stateless endpoint at `/api/mcp`.

```
claude mcp add --transport http geiger-posts https://geiger.studio/api/mcp --header "Authorization: Bearer YOUR_KEY"
```

Clients that only support OAuth, such as claude.ai connectors, can't connect yet.

## Operations

| MCP tool | REST | Access |
|---|---|---|
| `list_posts` | `GET /api/posts?status=&query=&limit=&offset=` | read |
| `get_post` | `GET /api/posts/:id` | read |
| `list_categories` | `GET /api/posts/categories` | read |
| `list_authors` | `GET /api/posts/authors` | read |
| `create_draft` | `POST /api/posts` | draft |
| `update_post` | `PATCH /api/posts/:id` | draft (publish if the post is live) |
| `publish_post` | `POST /api/posts/:id/publish` | publish |
| `unpublish_post` | `POST /api/posts/:id/unpublish` | publish |

Post fields: `title`, `excerpt`, `content`, `category`, and optionally `slug`, `tags`, `featuredImage` and `authorSlug`. Deleting and featuring posts stay in Studio, and author profiles are managed at `/studio/authors`.

REST returns `{ "data": ... }`, or `{ "error": { "code", "message" } }` with one of these statuses:

| Status | Code |
|---|---|
| 400 | `invalid_input` |
| 401 | `unauthorized` |
| 403 | `forbidden` |
| 404 | `not_found` |
| 409 | `conflict`, `invalid_state` |
| 429 | `rate_limited` |
| 500 | `internal` |

## Rules worth knowing

- **HTML is sanitized on every save and again on publish.** `/blog/[slug]` renders post content as raw HTML, so `lib/posts/content.js` keeps only an allowlist of tags and attributes. Add to that list before using a new tag.
- **Title, excerpt and tags can't contain `<` or `>`.** They reach a JSON-LD script tag on the public page.
- **`featuredImage` must be HTTPS**, because `next/image` only allows HTTPS hosts here.
- **`category` must already exist.** Create new categories in Studio.
- **A live post can't change its slug**, since that would break its link. Unpublish it first.
- **Unpublishing clears `published_at`**, so publishing again gives the post a new date.

## Limits and audit

Each key gets 60 calls in a rolling minute. Every call is written to `mcp_audit_log` with `product = 'posts'` and `client_id` set to the key id. These calls use the service role, because a key isn't a Supabase session and RLS can't apply. The checks in `verifyPostKey` and `runOperation` are the only access control, so any new operation must go through `runOperation`.

Run the tests with `node --test lib/posts/operations.test.js`.
