import { Schema, type Connection, type Model } from "mongoose";
import { collectionDefinitions } from "../database/schema.js";

// Collection-specific strict models are derived from the same definitions as MongoDB validators.
// Explicit collection names preserve all existing records and IDs.
export type Models = Record<string, Model<any>>;

function alignRequiredStrings(schema: Schema): void {
  // MongoDB's `required` checks presence; minLength separately controls empty strings.
  // Match that behavior so editing a migrated document with an empty bio remains valid.
  schema.eachPath((_name, path) => {
    if (path.instance === "String") {
      Object.assign(path, {
        checkRequired: (value: unknown) => typeof value === "string",
      });
    }
  });
}

function field(rule: Record<string, any>): Record<string, any> {
  const types = Array.isArray(rule.bsonType) ? rule.bsonType : [rule.bsonType];
  let type: any = Schema.Types.Mixed;
  if (types.includes("array")) type = [field(rule.items ?? {}).type];
  else if (types.includes("objectId")) type = Schema.Types.ObjectId;
  else if (types.includes("date")) type = Date;
  else if (types.includes("object") && rule.properties) {
    const properties = Object.fromEntries(
      Object.entries(rule.properties).map(([key, value]) => [
        key,
        {
          ...field(value as Record<string, any>),
          required: rule.required?.includes(key) ?? false,
        },
      ]),
    );
    type = new Schema(properties, {
      _id: false,
      strict: "throw",
      versionKey: false,
      suppressReservedKeysWarning: true,
    });
    alignRequiredStrings(type);
  } else if (
    types.includes("string") &&
    !types.some((t: string) => ["int", "long", "double"].includes(t))
  )
    type = String;
  else if (
    types.some((t: string) =>
      ["int", "long", "double", "decimal"].includes(t),
    ) &&
    !types.includes("string")
  )
    type = Number;
  else if (rule.enum) type = typeof rule.enum[0] === "number" ? Number : String;
  return {
    type,
    ...(types.includes("array") ? { default: undefined } : {}),
    ...(rule.enum ? { enum: rule.enum } : {}),
    ...(rule.pattern ? { match: new RegExp(rule.pattern) } : {}),
    ...(rule.minLength !== undefined ? { minlength: rule.minLength } : {}),
    ...(rule.maxLength !== undefined ? { maxlength: rule.maxLength } : {}),
    ...(rule.minimum !== undefined ? { min: rule.minimum } : {}),
    ...(rule.maximum !== undefined ? { max: rule.maximum } : {}),
  };
}

export function createModels(connection: Connection): Models {
  const models: Models = {};
  for (const definition of collectionDefinitions()) {
    if (connection.models[definition.name]) {
      models[definition.name] = connection.models[definition.name];
      continue;
    }
    const document = definition.validator.$jsonSchema;
    const fields = Object.fromEntries(
      Object.entries(document.properties as Record<string, Record<string, any>>)
        .filter(([key, rule]) => key !== "_id" || rule.bsonType === "string")
        .map(([key, rule]) => [
          key,
          {
            ...field(rule),
            required: document.required.includes(key),
            ...(["createdAt", "updatedAt"].includes(key)
              ? { default: Date.now }
              : {}),
          },
        ]),
    );
    if (definition.name === "users") {
      Object.assign(fields.role, { default: "customer" });
      Object.assign(fields.status, { default: "active" });
      Object.assign(fields.passwordVersion, { default: 2 });
      Object.assign(fields.sessionVersion, { default: 0 });
      Object.assign(fields.passwordHash, { select: false });
      Object.assign(fields.passwordSalt, { select: false });
    }
    if (fields.revision) Object.assign(fields.revision, { default: 0 });
    const schema = new Schema(fields, {
      collection: definition.name,
      strict: "throw",
      strictQuery: "throw",
      versionKey: false,
      id: false,
      autoIndex: false,
      autoCreate: false,
      bufferCommands: false,
      timestamps: Boolean(fields.createdAt && fields.updatedAt),
    });
    alignRequiredStrings(schema);
    for (const index of definition.indexes) {
      const { key, ...options } = index;
      schema.index(key as Record<string, 1 | -1>, options);
    }
    models[definition.name] = connection.model(
      definition.name,
      schema,
      definition.name,
    );
  }
  return models;
}
