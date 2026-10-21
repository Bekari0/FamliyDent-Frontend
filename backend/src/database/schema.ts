import { extendPlatformCollections } from "./platform-schema.js";
import type { Db, Document, IndexDescription } from "mongodb";

export const SCHEMA_VERSION = "001_domain_collections";
export const PLATFORM_VERSION = "004_backend_platform";
export const DEFAULT_DATABASE = "familydent_web";

const string = { bsonType: "string" };
const strings = { bsonType: "array", items: string };
const number = { bsonType: ["int", "long", "double", "decimal"] };
const date = { bsonType: "date" };
const objectId = { bsonType: "objectId" };
const nullableString = { bsonType: ["string", "null"] };

interface ContentDefinition {
  collection: string;
  required: string[];
  fields: Record<string, Document>;
}

export const contentDefinitions = {
  doctors: {
    collection: "doctors",
    required: ["slug", "name", "specialty", "bio", "education", "specialties"],
    fields: {
      slug: string,
      name: string,
      specialty: string,
      qualification: string,
      experienceYears: string,
      bio: strings,
      image: string,
      imagePosition: string,
      education: strings,
      specialties: strings,
      training: strings,
      highlights: strings,
      commonQuestions: strings,
      branches: strings,
    },
  },
  services: {
    collection: "services",
    required: [
      "slug",
      "title",
      "shortTitle",
      "category",
      "description",
      "priceFrom",
      "image",
    ],
    fields: {
      slug: string,
      title: string,
      shortTitle: string,
      category: string,
      description: string,
      priceFrom: string,
      duration: string,
      details: strings,
      image: string,
      imagePosition: string,
      mobileImagePosition: string,
    },
  },
  reviews: {
    collection: "reviews",
    required: ["authorName", "source"],
    fields: {
      authorName: string,
      source: {
        enum: ["google", "yandex", "2gis", "instagram", "whatsapp", "video"],
      },
      rating: { ...number, minimum: 1, maximum: 5 },
      text: string,
      videoUrl: string,
      videoPoster: string,
      publishedAt: string,
      branch: string,
      sourceUrl: string,
    },
  },
  blogPosts: {
    collection: "articles",
    required: [
      "slug",
      "title",
      "excerpt",
      "content",
      "date",
      "author",
      "category",
      "image",
    ],
    fields: {
      slug: string,
      title: string,
      excerpt: string,
      content: string,
      date: string,
      author: string,
      category: string,
      image: string,
    },
  },
  clinicSpaces: {
    collection: "clinic_spaces",
    required: ["slug", "title", "description", "image", "order"],
    fields: {
      slug: string,
      title: string,
      description: string,
      image: string,
      order: number,
      panoramaUrl: string,
    },
  },
  concerns: {
    collection: "patient_concerns",
    required: ["title", "serviceHref"],
    fields: {
      title: string,
      serviceHref: string,
      shortDescription: string,
    },
  },
  equipment: {
    collection: "equipment",
    required: ["slug", "name", "description", "patientBenefit", "image"],
    fields: {
      slug: string,
      name: string,
      description: string,
      patientBenefit: string,
      image: string,
    },
  },
  faq: {
    collection: "faqs",
    required: ["question", "answer"],
    fields: {
      question: string,
      answer: string,
      category: string,
    },
  },
  metrics: {
    collection: "clinic_metrics",
    required: ["label", "value"],
    fields: {
      label: string,
      value: number,
      prefix: string,
      suffix: string,
      description: string,
    },
  },
  pricing: {
    collection: "prices",
    required: ["category", "name", "price"],
    fields: {
      category: string,
      name: string,
      price: string,
      description: string,
    },
  },
  team: {
    collection: "team_members",
    required: ["slug", "name", "category", "position", "shortBio", "image"],
    fields: {
      slug: string,
      name: string,
      category: {
        enum: [
          "doctors",
          "nurses",
          "administrators",
          "management",
          "technical",
        ],
      },
      position: string,
      shortBio: string,
      image: string,
      experienceYears: { bsonType: ["string", "int", "long", "double"] },
      specialties: strings,
      education: strings,
    },
  },
  treatmentCases: {
    collection: "treatment_cases",
    required: [
      "slug",
      "title",
      "category",
      "shortDescription",
      "beforeImage",
      "afterImage",
      "disclaimer",
    ],
    fields: {
      slug: string,
      title: string,
      category: string,
      shortDescription: string,
      beforeImage: string,
      afterImage: string,
      disclaimer: string,
    },
  },
  academyPrograms: {
    collection: "academy_programs",
    required: ["title", "description"],
    fields: {
      title: string,
      description: string,
    },
  },
  tourismFeatures: {
    collection: "tourism_features",
    required: ["title", "description"],
    fields: {
      title: string,
      description: string,
    },
  },
  tourismRoadmap: {
    collection: "tourism_steps",
    required: ["number", "title", "description"],
    fields: {
      number: string,
      title: string,
      description: string,
    },
  },
  tourismComparison: {
    collection: "tourism_comparisons",
    required: [
      "service",
      "tajikistan",
      "russia",
      "kazakhstan",
      "europe",
      "usa",
    ],
    fields: {
      service: string,
      tajikistan: string,
      russia: string,
      kazakhstan: string,
      europe: string,
      usa: string,
    },
  },
  tourismPackages: {
    collection: "tourism_packages",
    required: [
      "number",
      "name",
      "duration",
      "audience",
      "description",
      "image",
      "imageAlt",
    ],
    fields: {
      number: string,
      name: string,
      duration: string,
      audience: string,
      description: string,
      image: string,
      imageAlt: string,
    },
  },
  tourismPlaces: {
    collection: "tourism_places",
    required: ["name", "meta", "image", "className"],
    fields: {
      name: string,
      meta: string,
      image: string,
      className: string,
    },
  },
} satisfies Record<string, ContentDefinition>;

export type ContentType = keyof typeof contentDefinitions;
export function isContentType(value: string): value is ContentType {
  return Object.hasOwn(contentDefinitions, value);
}

export function assertWebsiteDatabase(name: string): string {
  if (!/^familydent_web(?:_[a-z0-9_]+)?$/.test(name)) {
    throw new Error(
      "MONGODB_DATABASE must be familydent_web or a familydent_web_* environment database; legacy databases are not valid targets",
    );
  }
  return name;
}

interface CollectionDefinition {
  name: string;
  validator: Document;
  indexes: IndexDescription[];
}

function schema(
  required: string[],
  fields: Record<string, Document>,
): Document {
  return {
    $jsonSchema: {
      bsonType: "object",
      additionalProperties: false,
      required: [...new Set(["_id", ...required])],
      properties: { _id: objectId, ...fields },
    },
  };
}

export function collectionDefinitions(): CollectionDefinition[] {
  const timestamps = { createdAt: date, updatedAt: date };
  const content = Object.values(contentDefinitions).map<CollectionDefinition>(
    (definition) => ({
      name: definition.collection,
      validator: schema(
        [
          "id",
          "sortOrder",
          "publicationStatus",
          "createdAt",
          "updatedAt",
          ...definition.required,
        ],
        {
          id: { ...string, minLength: 1 },
          sortOrder: { ...number, minimum: 0 },
          publicationStatus: { enum: ["draft", "published", "archived"] },
          ...timestamps,
          ...definition.fields,
        },
      ),
      indexes: [
        { key: { id: 1 }, name: "id_unique", unique: true },
        {
          key: { publicationStatus: 1, sortOrder: 1, _id: 1 },
          name: "published_order",
        },
        ...("slug" in definition.fields
          ? [{ key: { slug: 1 }, name: "slug_unique", unique: true }]
          : []),
      ] as IndexDescription[],
    }),
  );
  const definitions: CollectionDefinition[] = [
    ...content,
    {
      name: "media_assets",
      validator: schema(["localPath", "status", "createdAt", "updatedAt"], {
        localPath: { ...string, pattern: "^/(images|videos|icons)/" },
        cloudUrl: nullableString,
        status: { enum: ["pending_upload", "ready", "orphaned"] },
        ...timestamps,
        references: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["collection", "documentId", "field"],
            additionalProperties: false,
            properties: {
              collection: string,
              documentId: string,
              field: string,
            },
          },
        },
      }),
      indexes: [
        { key: { localPath: 1 }, name: "local_path_unique", unique: true },
        { key: { status: 1 }, name: "media_status" },
      ],
    },
    {
      name: "users",
      validator: schema(
        [
          "name",
          "email",
          "passwordHash",
          "passwordSalt",
          "createdAt",
          "updatedAt",
        ],
        {
          name: { ...string, minLength: 1, maxLength: 120 },
          email: {
            ...string,
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            maxLength: 200,
          },
          passwordHash: { ...string, pattern: "^[a-f0-9]{128}$" },
          passwordSalt: { ...string, pattern: "^[a-f0-9]{32}$" },
          ...timestamps,
        },
      ),
      indexes: [{ key: { email: 1 }, name: "email_unique", unique: true }],
    },
    {
      name: "sessions",
      validator: schema(["tokenHash", "userId", "createdAt", "expiresAt"], {
        tokenHash: { ...string, pattern: "^[a-f0-9]{64}$" },
        userId: objectId,
        createdAt: date,
        expiresAt: date,
      }),
      indexes: [
        { key: { tokenHash: 1 }, name: "token_unique", unique: true },
        { key: { userId: 1 }, name: "session_user" },
        {
          key: { expiresAt: 1 },
          name: "session_expiry",
          expireAfterSeconds: 0,
        },
      ],
    },
    ...["bookings", "tourism_consultations"].map<CollectionDefinition>(
      (name) => ({
        name,
        validator: schema(
          [
            "name",
            "phone",
            "status",
            "source",
            "createdAt",
            "updatedAt",
            ...(name === "tourism_consultations"
              ? ["email", "country", "service"]
              : []),
          ],
          {
            name: { ...string, minLength: 1, maxLength: 120 },
            phone: { ...string, minLength: 1, maxLength: 40 },
            email: string,
            doctor: string,
            doctorId: string,
            service: string,
            serviceId: string,
            preferredDate: date,
            telegram: string,
            country: string,
            message: string,
            status: { enum: ["new", "confirmed", "completed", "cancelled"] },
            source: string,
            requestIp: string,
            ...timestamps,
          },
        ),
        indexes: [
          { key: { status: 1, createdAt: -1 }, name: "status_created" },
          { key: { phone: 1, createdAt: -1 }, name: "phone_created" },
        ] as IndexDescription[],
      }),
    ),
    {
      name: "schema_migrations",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["_id", "completedAt"],
          properties: {
            _id: string,
            completedAt: date,
            sourceDatabase: string,
            counts: { bsonType: "object" },
          },
        },
      },
      indexes: [],
    },
  ];
  return extendPlatformCollections(definitions);
}

export async function setupDatabase(database: Db): Promise<void> {
  assertWebsiteDatabase(database.databaseName);
  const existing = new Set(
    (await database.listCollections({}, { nameOnly: true }).toArray()).map(
      (c) => c.name,
    ),
  );
  for (const definition of collectionDefinitions()) {
    const validation = {
      validator: definition.validator,
      validationLevel: "strict" as const,
      validationAction: "error" as const,
    };
    if (existing.has(definition.name)) {
      await database.command({ collMod: definition.name, ...validation });
    } else {
      await database.createCollection(definition.name, validation);
    }
    if (definition.indexes.length)
      await database
        .collection(definition.name)
        .createIndexes(definition.indexes);
  }
  for (const version of [SCHEMA_VERSION, PLATFORM_VERSION]) {
    await database
      .collection<{ _id: string; completedAt: Date }>("schema_migrations")
      .updateOne(
        { _id: version },
        { $set: { completedAt: new Date() } },
        { upsert: true },
      );
  }
}
