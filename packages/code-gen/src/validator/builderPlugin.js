import { isNil } from "@lbu/stdlib";
import { M } from "../model/index.js";
import { upperCaseFirst } from "../utils.js";

const store = new Set();

const init = app => {
  store.clear();
  app.hooks.addValidator = validator => {
    if (!M.instanceOf(validator)) {
      throw new Error(
        "Validator only accepts instances of ModelBuilder. See M",
      );
    }

    if (!validator.item.name) {
      throw new Error("Registered validators should have a name.");
    }

    store.add(validator);
  };
};

const build = result => {
  result.validators = [];

  const validators = {};
  for (const validator of store.values()) {
    const build = validator.build();
    build.name = upperCaseFirst(build.name);
    validators[build.name] = build;
  }

  for (const validatorName of Object.keys(validators)) {
    replaceReferences(validators, validators[validatorName]);
  }

  const ctx = {
    counter: 0,
    mapping: {},
  };

  for (const validatorName of Object.keys(validators)) {
    addToMapping(ctx, validatorName, validators[validatorName].type);
  }

  for (const validatorName of Object.keys(validators)) {
    result.validators.push(buildValidator(ctx, validators[validatorName]));
  }
};

export const plugin = {
  init,
  build,
};

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

/**
 * Registered nested named validators & replace others with references to them
 * @param validators
 * @param validator
 */
function replaceReferences(validators, validator) {
  if (!isNil(validator.name)) {
    validator.name = upperCaseFirst(validator.name);
  }

  if (!validators[validator.name]) {
    validators[validator.name] = validator;
  }

  switch (validator.type) {
    case "object":
      for (const key of Object.keys(validator.keys)) {
        replaceReferences(validators, validator.keys[key]);
        if (!isNil(validator.keys[key].name)) {
          validator.keys[key] = {
            type: "reference",
            docs: undefined,
            optional: false,
            referenceModel: validator.keys[key].name,
          };
        }
      }
      break;
    case "array":
      replaceReferences(validators, validator.values);
      if (!isNil(validator.values.name)) {
        validator.values = {
          type: "reference",
          docs: undefined,
          optional: false,
          referenceModel: validator.values.name,
        };
      }
      break;
    case "anyOf":
      for (let i = 0; i < validator.values.length; ++i) {
        const innerValidator = validator.values[i];
        replaceReferences(validators, innerValidator);
        if (!isNil(innerValidator.name)) {
          validator.values[i] = {
            type: "reference",
            docs: undefined,
            optional: false,
            referenceModel: innerValidator.name,
          };
        }
      }
      break;
  }
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
