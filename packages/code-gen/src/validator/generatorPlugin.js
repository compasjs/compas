import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../utils.js";

/**
 * Generate validator functions with support for pre & post-validate hooks
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 */
export function getValidatorPlugin(opts = {}) {
  return {
    name: "validator",
    init: init.bind(undefined, opts),
    generate: generate.bind(undefined, opts),
  };
}

async function init() {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
}

function generate(opts, data) {
  data.validators = data.validators.map((it) => upperCaseFirst(it));

  const validatorsToGenerate = extractValidatorsToGenerate(
    data.models,
    data.validators,
  );

  const validatorFunctions = transform({
    models: data.models,
    validators: validatorsToGenerate,
  });

  return {
    path: "./validators.js",
    content: executeTemplate("validatorsFile", {
      models: data.models,
      validatorFunctions,
      opts,
    }),
  };
}

function transform({ models, validators }) {
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
function extractValidatorsToGenerate(models, validators, result = []) {
  for (const validator of validators) {
    if (!models[validator] || result.indexOf(validator) !== -1) {
      continue;
    }

    recursiveExtract(models, models[validator], result);

    result.push(validator);
  }

  return result;
}

function recursiveExtract(models, model, result) {
  switch (model.type) {
    case "object":
      for (const key of Object.keys(model.keys)) {
        recursiveExtract(models, model.keys[key], result);
      }
      break;
    case "array":
      recursiveExtract(models, model.values, result);
      break;
    case "anyOf":
      for (const value of model.values) {
        recursiveExtract(models, value, result);
      }
      break;
    case "reference":
      extractValidatorsToGenerate(models, [model.referenceModel], result);
      break;
    case "generic":
      recursiveExtract(models, model.keys, result);
      recursiveExtract(models, model.values, result);
      break;
  }
}
