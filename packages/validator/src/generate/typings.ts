import {
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  ObjectSchema,
  OneOfSchema,
  ReferenceSchema,
  Schema,
  StringSchema,
} from "../types";
import { SchemaMapping } from "./types";

export function createTypesForSchemas(mapping: SchemaMapping): string {
  const result: string[] = [];

  for (const s of Object.values(mapping)) {
    result.push(createNamedTypeForSchema(s));
  }

  return result.join("\n");
}

export function createNamedTypeForSchema(s: Schema): string {
  switch (s.type) {
    case "number":
      return createNamedNumberSchema(s);
    case "string":
      return createNamedStringSchema(s);
    case "boolean":
      return createNamedBooleanSchema(s);
    case "object":
      return createNamedObjectSchema(s);
    case "array":
      return createNamedArraySchema(s);
    case "oneOf":
      return createNamedOneOfSchema(s);
    case "reference":
      return createNamedReferenceSchema(s);
    default:
      return "";
  }
}

export function createTypeForSchema(s: Schema): string {
  switch (s.type) {
    case "number":
      return createNumberSchema(s);
    case "string":
      return createStringSchema(s);
    case "boolean":
      return createBooleanSchema(s);
    case "object":
      return createObjectSchema(s);
    case "array":
      return createArraySchema(s);
    case "oneOf":
      return createOneOfSchema(s);
    case "reference":
      return createReferenceSchema(s);
    default:
      return "";
  }
}

export function createNamedNumberSchema(schema: NumberSchema): string {
  return `export type ${schema.name!} = ${createNumberSchema(schema)};`;
}

export function createNamedStringSchema(schema: StringSchema): string {
  return `export type ${schema.name!} = ${createStringSchema(schema)};`;
}

export function createNamedBooleanSchema(schema: BooleanSchema): string {
  return `export type ${schema.name!} = ${createBooleanSchema(schema)};`;
}

export function createNamedObjectSchema(schema: ObjectSchema): string {
  return `export interface ${schema.name!} ${createObjectSchema(schema)}`;
}

export function createNamedArraySchema(schema: ArraySchema): string {
  return `export type ${schema.name!} = ${createArraySchema(schema)};`;
}

export function createNamedOneOfSchema(schema: OneOfSchema): string {
  return `export type ${schema.name!} = ${createOneOfSchema(schema)};`;
}

export function createNamedReferenceSchema(schema: ReferenceSchema): string {
  return `export type ${schema.name!} = ${createReferenceSchema(schema)};`;
}

export function createNumberSchema(schema: NumberSchema): string {
  let result = "";
  if (schema.oneOf) {
    result += schema.oneOf.join(" | ");
  } else {
    result += "number";
  }
  if (schema.optional) {
    result += " | undefined";
  }
  return result;
}

export function createStringSchema(schema: StringSchema): string {
  let result = "";
  if (schema.oneOf) {
    result += schema.oneOf.map(it => `"${it}"`).join(" | ");
  } else {
    result += "string";
  }
  if (schema.optional) {
    result += " | undefined";
  }
  return result;
}

export function createBooleanSchema(schema: BooleanSchema): string {
  let result = "";
  if (schema.oneOf) {
    result += String(schema.oneOf[0]);
  } else {
    result += "boolean";
  }

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createObjectSchema(schema: ObjectSchema): string {
  let result = "{\n";

  if (schema.keys) {
    for (const [key, value] of Object.entries(schema.keys)) {
      result += `${key}: ${createTypeForSchema(value)};\n`;
    }
  }

  result += "}";

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createArraySchema(schema: ArraySchema): string {
  let result = `(${createTypeForSchema(schema.values)})[]`;

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createOneOfSchema(schema: OneOfSchema): string {
  let result = "";
  if (schema.schemas) {
    result += schema.schemas
      .map(it => createTypeForSchema(it))
      .map(it => `(${it})`)
      .join(" | ");
  }

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createReferenceSchema(schema: ReferenceSchema): string {
  let result = `${schema.ref}`;
  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}
