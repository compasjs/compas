import { isNil, isPlainObject } from "@lbu/stdlib";
import { upperCaseFirst } from "../../utils.js";

export function transform({ models, validators }) {
  const ctx = {
    counter: 0,
    mapping: {},
    models: {},
  };

  for (const validatorName of validators) {
    addToMapping(ctx, validatorName, models[validatorName].type);
  }

  for (const validatorName of validators) {
    let result = buildValidator(ctx, models[validatorName]);
    ctx.models[result.typeName] = result;
  }

  return Object.values(ctx.models);
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
  validator.validator = validator.validator || {};

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
      if (!isNil(validator.referenceField)) {
        validator.reference =
          ctx.models[validator.referenceModel].validator.keys[
            validator.referenceField
          ].functionName;
      }
      break;
    case "generic":
      processValidator(ctx, validator.keys);
      processValidator(ctx, validator.values);
      break;
  }
  return validator;
}

/**
 * Recursively adds referenced models to result.
 * This is needed because of the way we generate the validators, and reuse the referenced
 * models instead of generating all over again
 */
export function extractValidatorsToGenerate(models, value, result) {
  // skip non objects and arrays
  if (!value || (!isPlainObject(value) && !Array.isArray(value))) {
    return;
  }

  if (value.type && value.name) {
    // named item, should be top level
    if (result.indexOf(value.name) === -1) {
      result.push(value.name);
    } else {
      // already this this variant
      return;
    }
  } else if (value.type && value.referenceModel) {
    // reference
    if (result.indexOf(value.referenceModel) === -1) {
      extractValidatorsToGenerate(models, models[value.referenceModel], result);
    }

    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      extractValidatorsToGenerate(models, value[key], result);
    }
  } else if (Array.isArray(value)) {
    for (const v of value) {
      extractValidatorsToGenerate(models, v, result);
    }
  }
}
