Geiger Dash (Parent App) -------- Handles Dashboard/Homepage. (https://github.com/bhargavjoshi1237/geiger-dash) JS/JSX 

Geiger Assets (Assets Manager) -------- Handles Assets Up-Down, GoogleDrive Link, RemoteDownload, AssetMigrations, Management. (https://github.com/bhargavjoshi1237/geiger-assets) TS/TSX

Geiger Notes (Canvas/Board Notes) -------- Visual, Free-Form Canvas, Drag & Drop and Visual Organisation. (https://github.com/bhargavjoshi1237/geiger) JS,JSX

Geiger Content -------- Served through the parent app at `/content` and proxied to `https://geigercontent.vercel.app/content`.

Do Not Commit In Main Branch, Linked TO Auto Deploy Vercel Triggers Build For All 3 Repositorys, Costs Build Munites!

## Sitemap refresh

`/sitemap.xml` is generated from the permanent public routes and published
`dash_blog_posts` records. It is cached for one day.

Vercel calls `/api/cron/refresh-sitemap` every day at `05:00 UTC`. Add a
server-only `CRON_SECRET` environment variable to the Vercel project so the
scheduled request can be authenticated.

To trigger the same refresh manually:

```powershell
$env:CRON_SECRET="your-vercel-cron-secret"
npm run sitemap:refresh
```

Set `SITE_URL` when refreshing a preview or local deployment instead of
`https://geiger.studio`.

