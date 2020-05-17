import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const stringType = JSON.stringify(
  {
    ...TypeBuilder.baseData,
    type: "string",
    validator: {
      min: 36,
      max: 36,
      lowerCase: true,
      trim: true,
      pattern:
        "/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$/gi",
    },
  },
  undefined,
  1,
).replace(/\n/g, " ");

class UuidType extends TypeBuilder {
  constructor(group, name) {
    super(uuidType.name, group, name);
  }
}

const uuidType = {
  name: "uuid",
  class: UuidType,
  jsType: () => `string`,
  tsType: () => `string`,
  validator: () => `
{{ const fnNumber = ctx.anonFn(${stringType}); }}

return stringValidator{{= fnNumber }}(value, propertyPath, parentType);
`,
  mock: () => `_mocker.guid({version: 4}),\n`,
};

/**
 * @name TypeCreator#uuid
 * @param {string} [name]
 * @return {UuidType}
 */
TypeCreator.prototype.uuid = function (name) {
  return new UuidType(this.group, name);
};

TypeCreator.types.set(uuidType.name, uuidType);
