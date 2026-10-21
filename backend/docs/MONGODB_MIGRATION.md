# Independent website database

The website uses `familydent_web`, a database alongside `FamilyDent` on the current
Atlas cluster. It has its own collections, validators, indexes, and database users.
`website_content` and `website_media` in the old database are read-only migration
sources; the application does not query them.

## Credentials

Use two Atlas users scoped to the current cluster:

| User                       | Database         | Roles                           |
| -------------------------- | ---------------- | ------------------------------- |
| `familydent_web_app`       | `familydent_web` | `readWrite`                     |
| `familydent_web_migration` | `familydent_web` | `readWrite`, `dbAdmin`          |
| `familydent_web_migration` | `FamilyDent`     | `read` for the migration source |

Put `MONGODB_URI` and `MONGODB_DATABASE=familydent_web` in `backend/.env` for the app.
Put `MONGODB_MIGRATION_URI` and `MONGODB_LEGACY_DATABASE=FamilyDent` in
`backend/.env.migration.local` for provisioning. Real credentials are never committed.
If the local DNS resolver cannot resolve Atlas SRV records, use the standard
replica-set URI from Atlas with TLS, `authSource=admin`, and the replica-set name.

## Migrate the existing website

Run:

```bash
npm run db:migrate
npm run db:verify
npm run db:smoke
```

The migration:

1. Rejects write targets outside `familydent_web` / `familydent_web_*`.
2. Creates the domain collections, strict validators, unique indexes, and session TTL.
3. Splits each legacy content type into its own collection. It preserves document
   `_id` and public `id`, converts migration timestamps to BSON Dates, and moves
   public fields out of the old `data` wrapper.
4. Transfers media URLs and converts media references to collection/document IDs.
5. Copies only website accounts/sessions and explicitly website-sourced requests.
   Bookings require `source=website`; tourism requests require
   `source=website-tourism`. Old clinical bookings and clinical users are excluded.
6. Checks inserted IDs/counts before recording the completed migration.

An interrupted run can resume using insert-only upserts. Existing destination
records are preserved. A completed migration refuses to run again, preventing an
old snapshot from becoming the source of truth after website edits.

The source database is never modified or dropped. The migration user has only
read access to it. Provisioning needs migration privileges; the running API checks
readiness without performing schema changes with application credentials.

## Initialize a fresh environment

For a new empty `familydent_web_*` database, provision users with equivalent roles
for that exact database and run:

```bash
npm run content:seed
npm run db:verify
```

Bootstrap content is in `backend/scripts/seeds/`, outside the frontend dependency graph.
The seed command refuses initialized/nonempty databases. An interrupted seed is
resumed using insert-only upserts; an initialization marker is required before the
API starts. Bootstrap records include legacy demonstration content; review and
approve it before using a newly seeded environment publicly.

## Media handoff

Upload referenced local media, then register each uploaded HTTPS URL with
`npm run media:set-url -- "/images/path.webp" "https://cdn.example/path.webp"`.
Only ready media URLs are substituted in public responses. Keep referenced local
files until their fallbacks are deliberately retired.
