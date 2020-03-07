import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../utils.js";

const init = async () => {
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
    case "generic":
      processValidator(ctx, validator.keys);
      processValidator(ctx, validator.values);
      break;
  }
  return validator;
}
