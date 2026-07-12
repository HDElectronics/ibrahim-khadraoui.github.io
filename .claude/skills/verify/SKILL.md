---
name: verify
description: Build/launch/drive recipe for this Next.js portfolio
---

Cold-start recipe (no test suite in this repo — verify by driving the running app):

1. `npm install` (no bun/pnpm needed; plain npm works despite the `bun.lock` file).
2. `npm run dev` in background, logs to a scratch file. Server is ready almost
   immediately (Turbopack, ~150ms) — a 1s poll loop is enough, no long sleep needed.
3. Drive routes with `curl`:
   - Static routes: `/`, `/about`, `/projects`, `/articles`, `/contact`, `/settings`.
   - Dynamic detail routes: `/projects/<slug>` and `/articles/<slug>` (slugs come from
     `data/projects.ts` / `data/articles.ts`) — also curl an unknown slug to confirm
     `notFound()` 404s cleanly.
   - `/github` does a live fetch to `api.github.com/users/$NEXT_PUBLIC_GITHUB_USERNAME`
     (env var must be set in `.env.local`, gitignored) — 500s if unset/network-blocked.
   - Static assets under `/public` (project/article images, logos) — curl directly,
     and once through `/_next/image?url=...` to confirm Next's image optimizer can
     actually decode the file (not just that the file exists).
4. Kill the dev server with `pkill -f "next dev"` when done.

Gotcha: `DEV_TO_API_KEY` / `GITHUB_API_KEY` in old `.env.example` are dead — the
articles page now reads local data (`data/articles.ts`), not the dev.to API.
