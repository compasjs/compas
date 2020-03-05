import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../utils.js";

const init = async () => {
  addBuildErrorUtil();
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
};

const generate = data => {
  const validatorFunctions = transform(data);
  return {
    path: "./validators.js",
    content: executeTemplate("validatorsFile", { validatorFunctions }),
  };
};

/**
 * Generate validator functions with support for pre & post-validate hooks
 */
export const getValidatorPlugin = () => ({
  name: "validator",
  init,
  generate,
});

function addBuildErrorUtil() {
  // Note when using variables, you have to bring them in scope your self
  const errors = {
    /**
     * BOOLEAN
     */
    "boolean.undefined": "Expected '${propertyPath}' to be a boolean",
    "boolean.type": "Expected '${propertyPath}' to be a boolean",
    "boolean.oneOf": "Expected '${propertyPath}' to be '${oneOf}'",
    /**
     * NUMBER
     */
    "number.undefined": "Expected '${propertyPath}' to be a number",
    "number.type": "Expected '${propertyPath}' to be a number",
    "number.integer": "Expected '${propertyPath}' to be an integer",
    "number.min": "Expected '${propertyPath}' to be greater than '${min}'",
    "number.max": "Expected '${propertyPath}' to be smaller than '${max}'",
    "number.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    /**
     * STRING
     */
    "string.undefined": "Expected '${propertyPath}' to be a string",
    "string.type": "Expected '${propertyPath}' to be a string",
    "string.oneOf": "Expected '${propertyPath}' to be one of: '${oneOf}'",
    "string.min":
      "Expected '${propertyPath}' length to be greater than '${min}'",
    "string.max":
      "Expected '${propertyPath}' length to be smaller than '${max}'",
    "string.pattern": "Expected '${propertyPath}' to match pattern",
    /**
     * OBJECT
     */
    "object.undefined": "Expected '${propertyPath}' to be an object",
    "object.type": "Expected '${propertyPath}' to be an object",
    "object.strict":
      "Object at '${propertyPath}' has too many keys: [${extraKeys}]",
    /**
     * ARRAY
     */
    "array.undefined": "Expected '${propertyPath}' to be an array",
    "array.type": "Expected '${propertyPath}' to be an array",
    "array.min": "Expected '${propertyPath}' to be longer than '${min}'",
    "array.max": "Expected '${propertyPath}' to be shorter than '${max}'",
    /**
     * ANY OF
     */
    "anyOf.undefined": "Expected '${propertyPath}' to have a value",
    "anyOf.type": "'${stringErrors.join(\"' OR '\")}'",
    /**
     * REFERENCE
     */
    "reference.undefined": "Expected '${propertyPath}' to be defined",
  };

  addToTemplateContext("buildError", errorName => {
    if (!errors[errorName]) {
      throw new Error(`Missing ${errorName} in defined errors.`);
    }

    return (
      "throw new ValidationError(`" +
      errorName +
      "`, `" +
      errors[errorName] +
      "`);"
    );
  });
}

function transform({ models, validators }) {
  const result = [];
  const ctx = {
    counter: 0,
    mapping: {},
  };

  for (const validatorName of validators) {
    addToMapping(ctx, validatorName, models[validatorName].type);
  }

  for (const validatorName of validators) {
    result.push(buildValidator(ctx, models[validatorName]));
  }

  return result;
}

/**
 * Add provided name + type to the mapping, so all names have a mapped item before
 * starting to resolve references
 * @param ctx
 * @param name
 * @param type
 */
function addToMapping(ctx, name, type) {
  ctx.mapping[name] = `${type}Validator${ctx.counter++}`;
}

function buildValidator(ctx, data) {
  const { name: typeName, docs, ...validator } = data;
  if (!isNil(ctx.mapping[typeName])) {
    validator.functionName = ctx.mapping[typeName];
  }

  return {
    typeName,
    docs,
    validatorName: `validate${typeName}`,
    preValidateHook: `preValidate${typeName}`,
    postValidateHook: `postValidate${typeName}`,
    validator: processValidator(ctx, validator),
  };
}

function processValidator(ctx, validator) {
  if (isNil(validator.functionName)) {
    validator.functionName = `${validator.type}Validator${ctx.counter++}`;
  }
  Object.assign(validator, validator.validator);
  delete validator.validator;

  switch (validator.type) {
    case "object":
      for (const key of Object.keys(validator.keys)) {
        processValidator(ctx, validator.keys[key]);
      }
      break;
    case "array":
      processValidator(ctx, validator.values);
      break;
    case "anyOf":
      for (const v of validator.values) {
        processValidator(ctx, v);
      }
      break;
    case "reference":
      validator.reference =
        ctx.mapping[upperCaseFirst(validator.referenceModel)];
      break;
  }
  return validator;
}
