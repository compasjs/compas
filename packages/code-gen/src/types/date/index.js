import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const stringType = JSON.stringify(
  {
    type: "string",
    validator: {
      min: 24,
      max: 29,
      pattern:
        "/^(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))$/gi",
    },
  },
  undefined,
  1,
).replace(/\n/g, " ");

class DateType extends TypeBuilder {
  constructor(group, name) {
    super(dateType.name, group, name);
  }

  /**
   * @public
   * Set as optional and default to new Date()
   * @return {DateType}
   */
  defaultToNow() {
    return this.default("(new Date())");
  }
}

const dateType = {
  name: "date",
  class: DateType,
  jsType: () => `{{ if (it.isInputType) { }}string{{ } else { }}Date{{ } }}`,
  tsType: () => `{{ if (it.isInputType) { }}string{{ } else { }}Date{{ } }}`,
  validator: () => `
{{ const num = ctx.counter; }}
{{ ctx.addFunc(validatorsAnonFn({ model: ${stringType}, ctx })); }}

const interim = stringValidator{{= num }}(value, propertyPath, parentType);
let d;
try {
  d = new Date(interim);
  if (!isNaN(d.getTime())) {
    return d
  }
} catch {
  throw _errorFn(\`validator.\${parentType}.invalid\`, { propertyPath });
}
throw _errorFn(\`validator.\${parentType}.invalid\`, { propertyPath });
`,
  mock: () => `_mocker.date(),\n`,
};

/**
 * @name TypeCreator#date
 * @param {string} [name]
 * @return {DateType}
 */
TypeCreator.prototype.date = function (name) {
  return new DateType(this.group, name);
};

TypeCreator.types.set(dateType.name, dateType);
