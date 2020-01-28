import { AppSchema, ValidatorSchema } from "../fluent/types";
import {
  AbstractValidatorMap,
  AbstractValidatorUnion,
  NamedAbstractValidator,
} from "../types";
import { upperCaseFirst } from "../util";

export function extractValidators(schema: AppSchema): AbstractValidatorMap {
  const result: AbstractValidatorMap = {};

  for (const validator of schema.validators) {
    const item = convertNamedToAbstractValidator(validator);
    result[item.name] = item;
  }

  return result;
}

function convertNamedToAbstractValidator(
  validator: ValidatorSchema,
): NamedAbstractValidator {
  const result: NamedAbstractValidator = convertToAbstractValidator(
    validator,
  ) as NamedAbstractValidator;
  result.name = upperCaseFirst(validator.name!);
  return result;
}

function convertToAbstractValidator(
  validator: ValidatorSchema,
): AbstractValidatorUnion {
  switch (validator.type) {
    case "number":
      return {
        ...validator,
        type: "number",
        convert: !!validator.convert,
        integer: !!validator.integer,
        optional: !!validator.optional,
      };
    case "string":
      return {
        ...validator,
        type: "string",
        convert: !!validator.convert,
        trim: !!validator.trim,
        lowerCase: !!validator.lowerCase,
        upperCase: !!validator.upperCase,
        optional: !!validator.optional,
      };
    case "boolean":
      return {
        ...validator,
        type: "boolean",
        convert: !!validator.convert,
        optional: !!validator.optional,
      };
    case "object":
      const keys: any = {};
      if (validator.keys) {
        for (const [key, entry] of Object.entries(validator.keys)) {
          keys[key] = convertToAbstractValidator(entry);
        }
      }

      return {
        ...validator,
        type: "object",
        strict: !!validator.strict,
        optional: !!validator.optional,
        keys,
      };
    case "array":
      return {
        ...validator,
        type: "array",
        convert: !!validator.convert,
        optional: !!validator.optional,
        values: convertToAbstractValidator(validator.values),
      };
    case "oneOf":
      return {
        ...validator,
        type: "oneOf",
        optional: !!validator.optional,
        oneOf: validator.validators.map(it => convertToAbstractValidator(it)),
      };
    case "reference":
      return {
        ...validator,
        type: "ref",
        optional: !!validator.optional,
        ref: upperCaseFirst(validator.ref),
      };
  }
}
