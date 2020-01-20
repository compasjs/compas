export type ValidatorBuilder = {
  toSchema(): Validator;
};

export type ValidatorLike = Validator | ValidatorBuilder;

export type Validator =
  | NumberValidator
  | StringValidator
  | BooleanValidator
  | ObjectValidator
  | ArrayValidator
  | OneOfValidator
  | ReferenceValidator;

export interface MixedValidator {
  // name to use for hooks and ts types
  name?: string;
  // validation hooks are only possible when a name is provided
  withValidationHooks?: true;
  optional?: true;
}

export interface ConvertibleValidator extends MixedValidator {
  convert?: true;
}

export interface NumberValidator extends ConvertibleValidator {
  type: "number";
  min?: number;
  max?: number;
  integer?: true;
  oneOf?: number[];
}

export interface BooleanValidator extends ConvertibleValidator {
  type: "boolean";
  oneOf?: [boolean];
}

export interface StringValidator extends ConvertibleValidator {
  type: "string";
  min?: number;
  max?: number;
  pattern?: RegExp;
  trim?: true;
  lowerCase?: true;
  upperCase?: true;
  oneOf?: string[];
}

export interface ObjectValidator extends MixedValidator {
  type: "object";
  strict?: true;
  keys?: { [s: string]: Validator };
}

export interface ArrayValidator extends ConvertibleValidator {
  type: "array";
  values: Validator;
}

export interface OneOfValidator extends MixedValidator {
  type: "oneOf";
  validators: Validator[];
}

export interface ReferenceValidator extends MixedValidator {
  type: "reference";
  ref: string;
}
