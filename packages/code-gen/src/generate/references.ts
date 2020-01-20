import {
  ArraySchema,
  ObjectSchema,
  OneOfSchema,
  ReferenceSchema,
  Schema,
} from "../types";
import { SchemaMapping } from "./types";

export function createSchemaMapping(schemas: Schema[]): SchemaMapping {
  const m: any = {};
  for (const s of schemas) {
    m[s.name!] = s;
  }

  return m;
}

export function checkReferences(mapping: SchemaMapping) {
  for (const s of Object.values(mapping)) {
    checkSchemaReferences(mapping, s, s.name!);
  }
}

export function checkSchemaReferences(
  mapping: SchemaMapping,
  schema: Schema,
  name: string,
) {
  switch (schema.type) {
    case "object":
      checkObject(mapping, schema, name);
      break;
    case "array":
      checkArray(mapping, schema, name);
      break;
    case "oneOf":
      checkOneOf(mapping, schema, name);
      break;
    case "reference":
      checkReference(mapping, schema, name);
  }
}

export function checkObject(
  mapping: SchemaMapping,
  schema: ObjectSchema,
  name: string,
) {
  if (schema.keys) {
    for (const [key, value] of Object.entries(schema.keys)) {
      checkSchemaReferences(mapping, value, `${name}.${key}`);
    }
  }
}

export function checkArray(
  mapping: SchemaMapping,
  schema: ArraySchema,
  name: string,
) {
  if (schema.values) {
    checkSchemaReferences(mapping, schema.values, `${name}[n]`);
  }
}

export function checkOneOf(
  mapping: SchemaMapping,
  schema: OneOfSchema,
  name: string,
) {
  if (schema.schemas) {
    for (let i = 0; i < schema.schemas.length; ++i) {
      checkSchemaReferences(mapping, schema.schemas[i], `${name}[${i}]`);
    }
  }
}

export function checkReference(
  mapping: SchemaMapping,
  schema: ReferenceSchema,
  name: string,
) {
  if (!(schema.ref in mapping)) {
    throw new TypeError(
      `${schema.ref} is referenced by ${name} but is not provided.`,
    );
  }
}
