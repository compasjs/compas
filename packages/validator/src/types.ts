export const schemaBuildSymbol = Symbol("buildSchema");

export interface SchemaBuilder {
  [schemaBuildSymbol](): Schema;
}

export type SchemaLike = Schema | SchemaBuilder;

export type Schema =
  | NumberSchema
  | StringSchema
  | BooleanSchema
  | ObjectSchema
  | ArraySchema
  | OneOfSchema
  | ReferenceSchema;

export interface MixedSchema {
  // name to use for hooks and ts types
  name?: string;
  // validation hooks are only possible when a name is provided
  withValidationHooks?: true;
  optional?: true;
}

export interface ConvertibleSchema extends MixedSchema {
  convert?: true;
}

export interface NumberSchema extends ConvertibleSchema {
  type: "number";
  min?: number;
  max?: number;
  integer?: true;
  oneOf?: number[];
}

export interface BooleanSchema extends ConvertibleSchema {
  type: "boolean";
  oneOf?: [boolean];
}

export interface StringSchema extends ConvertibleSchema {
  type: "string";
  min?: number;
  max?: number;
  pattern?: RegExp;
  trim?: true;
  lowerCase?: true;
  upperCase?: true;
  oneOf?: string[];
}

export interface ObjectSchema extends MixedSchema {
  type: "object";
  keys?: { [s: string]: Schema };
}

export interface ArraySchema extends ConvertibleSchema {
  type: "array";
  values: Schema;
}

export interface OneOfSchema extends MixedSchema {
  type: "oneOf";
  schemas?: Schema[];
}

export interface ReferenceSchema extends MixedSchema {
  type: "reference";
  ref: string;
}
