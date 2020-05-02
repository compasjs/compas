import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const stringType = JSON.stringify(
  {
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
{{ const num = ctx.counter; }}
{{ ctx.addFunc(validatorsAnonFn({ model: ${stringType}, ctx })); }}

return stringValidator{{= num }}(value, propertyPath);
`,
  mock: () => `_mocker.guid({version: 4})`,
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
