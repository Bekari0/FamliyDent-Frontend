import type { Models } from "../../models/index.js";
import { contentDefinitions, type ContentType } from "../../database/schema.js";
import { isPublicMediaUrl } from "../../lib/media-url.js";

function mediaPaths(value: unknown, paths = new Set<string>()): Set<string> {
  if (typeof value === "string" && /^\/(images|videos|icons)\//.test(value))
    paths.add(value);
  else if (Array.isArray(value))
    value.forEach((item) => mediaPaths(item, paths));
  else if (value && typeof value === "object")
    Object.values(value).forEach((item) => mediaPaths(item, paths));
  return paths;
}
export function replaceMedia(
  value: unknown,
  urls: Map<string, string>,
): unknown {
  if (typeof value === "string") return urls.get(value) ?? value;
  if (Array.isArray(value))
    return value.map((item) => replaceMedia(item, urls));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceMedia(v, urls)]),
    );
  return value;
}
export async function readPublicContent(models: Models, type: ContentType) {
  const definition = contentDefinitions[type];
  const projection = Object.fromEntries(
    ["id", ...Object.keys(definition.fields)].map((key) => [key, 1]),
  );
  const documents = await models[definition.collection]
    .find({ publicationStatus: "published" })
    .select({ ...projection, _id: 0 })
    .sort({ sortOrder: 1, _id: 1 })
    .limit(500)
    .maxTimeMS(5_000)
    .lean();
  const paths = [...mediaPaths(documents)];
  if (!paths.length) return documents;
  const assets = await models.media_assets
    .find({
      localPath: { $in: paths },
      status: "ready",
      cloudUrl: { $regex: "^https://" },
    })
    .select("localPath cloudUrl")
    .lean();
  return replaceMedia(
    documents,
    new Map(
      assets
        .filter((asset) => isPublicMediaUrl(asset.cloudUrl))
        .map((asset) => [asset.localPath, asset.cloudUrl]),
    ),
  );
}
