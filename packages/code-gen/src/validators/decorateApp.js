const { App } = require("../core");
const utils = require("../utils");

App.withPlugin(appPluginCallback);

/**
 * @name App#validator
 * @function
 * @param {ModelBuilder} model
 * @return {App}
 */
App.prototype.validator = function(model) {
  if (!this.store.validators) {
    this.store.validators = {};
  }
  const result = model.build();
  if (!result.name) {
    throw new Error("Registered validators should have a name.");
  }

  this.store.validators[result.name] = result;

  return this;
};

function appPluginCallback(result, store) {
  result.validators = [];

  const ctx = {
    counter: 0,
    mapping: {},
  };

  store.processValidator = (key, data) => {
    result.validators.push(buildValidator(ctx, key, data));
  };

  for (const key of Object.keys(store.validators)) {
    store.processValidator(key, store.validators[key]);
  }
}

function buildValidator(ctx, key, data) {
  const { docs, ...validator } = data;
  const typeName = utils.upperCaseFirst(key);

  const result = {
    typeName,
    docs,
    validatorName: `validate${typeName}`,
    preValidateHook: `preValidate${typeName}`,
    postValidateHook: `postValidate${typeName}`,
    validator: processValidator(ctx, validator),
  };
  ctx.mapping[typeName] = result.validator.functionName;

  return result;
}

function processValidator(ctx, validator) {
  validator.functionName = `${validator.type}Validator${ctx.counter++}`;
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
        ctx.mapping[utils.upperCaseFirst(validator.referenceType)];
      break;
  }

  return validator;
}
