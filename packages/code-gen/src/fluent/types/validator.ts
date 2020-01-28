export type ValidatorSchemaBuilder = {
  toSchema(): ValidatorSchema;
};

export type ValidatorLikeSchema = ValidatorSchema | ValidatorSchemaBuilder;

export type ValidatorSchema =
  | NumberValidatorSchema
  | StringValidatorSchema
  | BooleanValidatorSchema
  | ObjectValidatorSchema
  | ArrayValidatorSchema
  | OneOfValidatorSchema
  | ReferenceValidatorSchema;

export interface MixedValidator {
  // name to use for hooks and ts types
  name?: string;
  optional?: true;
}

export interface ConvertibleValidator extends MixedValidator {
  convert?: true;
}

export interface NumberValidatorSchema extends ConvertibleValidator {
  type: "number";
  min?: number;
  max?: number;
  integer?: true;
  oneOf?: number[];
}

export interface BooleanValidatorSchema extends ConvertibleValidator {
  type: "boolean";
  oneOf?: [boolean];
}

export interface StringValidatorSchema extends ConvertibleValidator {
  type: "string";
  min?: number;
  max?: number;
  pattern?: RegExp;
  trim?: true;
  lowerCase?: true;
  upperCase?: true;
  oneOf?: string[];
}

export interface ObjectValidatorSchema extends MixedValidator {
  type: "object";
  strict?: true;
  keys?: { [s: string]: ValidatorSchema };
}

export interface ArrayValidatorSchema extends ConvertibleValidator {
  type: "array";
  values: ValidatorSchema;
}

export interface OneOfValidatorSchema extends MixedValidator {
  type: "oneOf";
  validators: ValidatorSchema[];
}

export interface ReferenceValidatorSchema extends MixedValidator {
  type: "reference";
  ref: string;
}
