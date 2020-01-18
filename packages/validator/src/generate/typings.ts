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
      return createNamedNumberType(s);
    case "string":
      return createNamedStringType(s);
    case "boolean":
      return createNamedBooleanType(s);
    case "object":
      return createNamedObjectType(s);
    case "array":
      return createNamedArrayType(s);
    case "oneOf":
      return createNamedOneOfType(s);
    case "reference":
      return createNamedReferenceType(s);
    default:
      return "";
  }
}

export function createTypeForSchema(s: Schema): string {
  switch (s.type) {
    case "number":
      return createNumberType(s);
    case "string":
      return createStringType(s);
    case "boolean":
      return createBooleanType(s);
    case "object":
      return createObjectType(s);
    case "array":
      return createArrayType(s);
    case "oneOf":
      return createOneOfType(s);
    case "reference":
      return createReferenceType(s);
    default:
      return "";
  }
}

export function createNamedNumberType(schema: NumberSchema): string {
  return `export type ${schema.name!} = ${createNumberType(schema)};`;
}

export function createNamedStringType(schema: StringSchema): string {
  return `export type ${schema.name!} = ${createStringType(schema)};`;
}

export function createNamedBooleanType(schema: BooleanSchema): string {
  return `export type ${schema.name!} = ${createBooleanType(schema)};`;
}

export function createNamedObjectType(schema: ObjectSchema): string {
  return `export type ${schema.name!} = ${createObjectType(schema)};`;
}

export function createNamedArrayType(schema: ArraySchema): string {
  return `export type ${schema.name!} = ${createArrayType(schema)};`;
}

export function createNamedOneOfType(schema: OneOfSchema): string {
  return `export type ${schema.name!} = ${createOneOfType(schema)};`;
}

export function createNamedReferenceType(schema: ReferenceSchema): string {
  return `export type ${schema.name!} = ${createReferenceType(schema)};`;
}

export function createNumberType(schema: NumberSchema): string {
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

export function createStringType(schema: StringSchema): string {
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

export function createBooleanType(schema: BooleanSchema): string {
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

export function createObjectType(schema: ObjectSchema): string {
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

export function createArrayType(schema: ArraySchema): string {
  let result = `(${createTypeForSchema(schema.values)})[]`;

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createOneOfType(schema: OneOfSchema): string {
  let result = schema.schemas
    .map(it => createTypeForSchema(it))
    .map(it => `(${it})`)
    .join(" | ");

  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}

export function createReferenceType(schema: ReferenceSchema): string {
  let result = `${schema.ref}`;
  if (schema.optional) {
    result += " | undefined";
  }

  return result;
}
