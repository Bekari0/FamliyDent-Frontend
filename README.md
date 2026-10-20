# Family Dent

React/Vite website with an Express API backed by MongoDB Atlas.

## Local development

Use Node.js 22.12+ (or 24 LTS) and npm.

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies with `npm ci`.
3. Run the frontend and API together with `npm run dev:all`.

The frontend is available on port `3000`; Vite proxies `/api` to the API on port `8787`.

## Checks

- `npm run lint` — TypeScript checks for the frontend, API, and scripts.
- `npm test` — existing component regression tests.
- `npm run build` — production frontend build.
- `npm run clean` — remove the generated frontend build.

## Repository

- `src/` — website pages, components, API client, and public seed content.
- `server/` — Express API, database connection, and authentication.
- `scripts/` — local development and content/media migration commands.
- `public/` — local media used by the website.
- `docs/` — project documentation and [content migration](docs/MONGODB_MIGRATION.md).

Local environment files, credentials, database exports, source uploads, and tool
settings are excluded by `.gitignore`. Only placeholder configuration belongs in
`.env.example`.

## Data model

Public website content lives in `FamilyDent.website_content`. Each document contains:

- `contentType` and `contentId` — a unique content key;
- `order` and `data` — display order and public payload;
- `media[]` — media migration metadata with `localPath`, `cloudUrl`, and `status`;
- `schemaVersion`, `source`, and `syncedAt` — migration metadata.

The API substitutes a populated `media.cloudUrl` into the matching `data` field automatically. Until then, local files under `public/` remain valid fallbacks.

After uploading a file, register its URL with:

```bash
npm run media:set-url -- "/images/path.webp" "https://cdn.example/path.webp"
```

Run `npm run content:migrate` after editing the local seed data. The migration uses upserts and can be run repeatedly. It does not modify clinical or account collections.

## API

- `GET /api/health` — MongoDB connectivity check.
- `GET /api/content/:type` — ordered public content.
- `POST /api/bookings` — booking request.
- `POST /api/tourism-consultations` — international-patient request.
- `POST /api/auth/register`, `/api/auth/login`, `/api/auth/logout` — website account sessions.

Website accounts are isolated in `website_users`; passwords are salted and hashed with `scrypt`. Session tokens are stored as SHA-256 hashes in `website_sessions` and sent only in HttpOnly cookies. The legacy clinical `users` collection is not reused.

Never expose `MONGODB_URI` through a `VITE_` variable. Production should run `npm run build` and `npm start` in the same service, or set `VITE_API_URL` when the API is deployed separately.
