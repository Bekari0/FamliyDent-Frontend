import assert from "node:assert/strict";
import test from "node:test";
import { ObjectId } from "mongodb";
import {
  flattenLegacyContent,
  migrationDate,
  resolveLegacyMediaReference,
} from "../src/database/migration.js";
import {
  assertWebsiteDatabase,
  collectionDefinitions,
  contentDefinitions,
} from "../src/database/schema.js";
import { replaceMedia } from "../src/modules/content/service.js";
import { calendarDate } from "../src/lib/calendar-date.js";
import { hashPassword, verifyPassword } from "../src/modules/auth/password.js";

test("migration creates a flat document, preserving IDs, ordering, and BSON dates", () => {
  const id = new ObjectId();
  const migrated = flattenLegacyContent({
    _id: id,
    contentType: "doctors",
    contentId: "legacy-doc",
    order: 4,
    syncedAt: { $date: "2026-10-20T00:00:00Z" },
    data: {
      id: "doc-1",
      slug: "doctor",
      name: "Doctor",
      specialty: "Dentist",
      internalSecret: "private",
    },
  });
  assert.equal(migrated._id, id);
  assert.equal(migrated.id, "doc-1");
  assert.equal(migrated.sortOrder, 4);
  assert.equal(migrated.publicationStatus, "published");
  assert.equal(migrated.createdAt.toISOString(), "2026-10-20T00:00:00.000Z");
  assert.equal(migrated.data, undefined);
  assert.equal(migrated.internalSecret, undefined);
});

test("team job position is not overwritten by document ordering", () => {
  const migrated = flattenLegacyContent({
    _id: new ObjectId(),
    contentType: "team",
    contentId: "team-1",
    order: 3,
    data: {
      id: "team-1",
      slug: "member",
      name: "Member",
      category: "doctors",
      position: "Dentist",
    },
  });
  assert.equal(migrated.position, "Dentist");
  assert.equal(migrated.sortOrder, 3);
  assert.equal(migrated.shortBio, "");
});

test("unknown legacy content and invalid dates stop migration", () => {
  assert.throws(
    () => flattenLegacyContent({ contentType: "patients", data: {} }),
    /Unrecognized/,
  );
  assert.throws(
    () => migrationDate("invalid timestamp"),
    /Invalid legacy timestamp/,
  );
});

test("legacy media references using display names resolve to the actual document ID", () => {
  const documents = [
    {
      contentType: "tourismPlaces",
      contentId: "душанбе",
      data: { name: "Душанбе" },
    },
  ];
  assert.deepEqual(
    resolveLegacyMediaReference(
      { contentType: "tourismPlaces", contentId: "Душанбе", field: "image" },
      documents,
    ),
    {
      collection: "tourism_places",
      documentId: "душанбе",
      field: "image",
    },
  );
  assert.throws(() =>
    resolveLegacyMediaReference(
      { contentType: "tourismPlaces", contentId: "missing" },
      documents,
    ),
  );
});

test("the old clinical database cannot be used as a write target", () => {
  for (const name of [
    "FamilyDent",
    "family_dent",
    "admin",
    "test",
    "familydent_web.other",
  ]) {
    assert.throws(() => assertWebsiteDatabase(name));
  }
  assert.equal(assertWebsiteDatabase("familydent_web"), "familydent_web");
  assert.equal(
    assertWebsiteDatabase("familydent_web_test"),
    "familydent_web_test",
  );
});

test("domain collections are distinct and declare all required fields", () => {
  const definitions = collectionDefinitions();
  assert.equal(
    new Set(definitions.map((d) => d.name)).size,
    definitions.length,
  );
  assert.equal(Object.keys(contentDefinitions).length, 18);
  for (const { validator } of definitions) {
    const schema = validator.$jsonSchema;
    assert.equal(new Set(schema.required).size, schema.required.length);
    for (const field of schema.required)
      assert.ok(schema.properties[field], `Missing schema for ${field}`);
  }
});

test("cloud media substitution preserves nested content and local fallbacks", () => {
  const input = {
    image: "/images/a.webp",
    items: [{ poster: "/images/b.webp" }],
    value: 2,
  };
  assert.deepEqual(
    replaceMedia(
      input,
      new Map([["/images/a.webp", "https://cdn.example/a.webp"]]),
    ),
    {
      image: "https://cdn.example/a.webp",
      items: [{ poster: "/images/b.webp" }],
      value: 2,
    },
  );
  assert.equal(input.image, "/images/a.webp");
});

test("booking dates reject impossible calendar values", () => {
  assert.equal(
    calendarDate.parse("2028-02-29").toISOString(),
    "2028-02-29T00:00:00.000Z",
  );
  assert.throws(() => calendarDate.parse("2026-02-30"));
});

test("passwords use salted hashes and reject incorrect credentials", async () => {
  const first = await hashPassword("example password");
  const second = await hashPassword("example password");
  assert.notEqual(first.passwordSalt, second.passwordSalt);
  assert.notEqual(first.passwordHash, second.passwordHash);
  assert.equal(
    await verifyPassword(
      "example password",
      first.passwordSalt,
      first.passwordHash,
    ),
    true,
  );
  assert.equal(
    await verifyPassword("incorrect", first.passwordSalt, first.passwordHash),
    false,
  );
});
