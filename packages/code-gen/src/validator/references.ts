import {
  ArrayValidator,
  ObjectValidator,
  OneOfValidator,
  ReferenceValidator,
  Validator,
} from "../types";
import { ValidatorMapping } from "./types";

export function createSchemaMapping(schemas: Validator[]): ValidatorMapping {
  const m: any = {};
  for (const s of schemas) {
    m[s.name!] = s;
  }

  return m;
}

export function checkReferences(mapping: ValidatorMapping) {
  for (const s of Object.values(mapping)) {
    checkSchemaReferences(mapping, s, s.name!);
  }
}

export function checkSchemaReferences(
  mapping: ValidatorMapping,
  schema: Validator,
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
  mapping: ValidatorMapping,
  schema: ObjectValidator,
  name: string,
) {
  if (schema.keys) {
    for (const [key, value] of Object.entries(schema.keys)) {
      checkSchemaReferences(mapping, value, `${name}.${key}`);
    }
  }
}

export function checkArray(
  mapping: ValidatorMapping,
  schema: ArrayValidator,
  name: string,
) {
  if (schema.values) {
    checkSchemaReferences(mapping, schema.values, `${name}[n]`);
  }
}

export function checkOneOf(
  mapping: ValidatorMapping,
  schema: OneOfValidator,
  name: string,
) {
  if (schema.validators) {
    for (let i = 0; i < schema.validators.length; ++i) {
      checkSchemaReferences(mapping, schema.validators[i], `${name}[${i}]`);
    }
  }
}

export function checkReference(
  mapping: ValidatorMapping,
  schema: ReferenceValidator,
  name: string,
) {
  if (!(schema.ref in mapping)) {
    throw new TypeError(
      `${schema.ref} is referenced by ${name} but is not provided.`,
    );
  }
}
