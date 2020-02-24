const utils = require("./utils");

const processValidators = validators => {
  const ctx = {
    result: [],
    input: validators,
    counter: 0,
    mapping: {},
  };

  for (const key of Object.keys(validators)) {
    const { docs, ...validator } = validators[key];
    const typeName = utils.upperCaseFirst(key);

    ctx.result.push({
      typeName,
      docs,
      validatorName: `validate${typeName}`,
      preValidateHook: `preValidate${typeName}`,
      postValidateHook: `postValidate${typeName}`,
      validator: processValidator(ctx, validator),
    });

    ctx.mapping[typeName] =
      ctx.result[ctx.result.length - 1].validator.functionName;
  }

  return ctx.result;
};

function processValidator(ctx, validator) {
  validator.functionName = `${validator.type}Validator${ctx.counter++}`;

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

module.exports = {
  processValidators,
};
