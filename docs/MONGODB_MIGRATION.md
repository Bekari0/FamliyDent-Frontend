# Website content migration

Configure `MONGODB_URI` and `MONGODB_DATABASE` in a local `.env` file using
`.env.example`. Keep connection strings, database exports, and operational audit
inventories outside this repository.

Run `npm run content:migrate` to synchronize the public seed content from
`src/lib/data/` with MongoDB. The script upserts `website_content` by
`(contentType, contentId)` and `website_media` by `localPath`, so repeated runs do
not create duplicate entries. It only writes those two website collections.

Local media under `public/` remain fallbacks until their uploaded URLs are set.
After uploading an asset, run:

```bash
npm run media:set-url -- "/images/path.webp" "https://cdn.example/path.webp"
```

This sets the matching `website_media` entry to `ready`. Public content responses
then substitute the uploaded URL automatically. Keep every referenced local asset
until its fallback is deliberately retired from the seed content and consumers.
