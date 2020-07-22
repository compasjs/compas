import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const stringType = JSON.stringify(
  {
    ...TypeBuilder.getBaseData(),
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
  static baseData = {};

  constructor(group, name) {
    super(dateType.name, group, name);

    this.data = {
      ...this.data,
      ...DateType.getBaseData(),
    };
  }

  /**
   * Set as optional and default to new Date()
   *
   * @public
   * @returns {DateType}
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
{{ const fnNumber = ctx.anonFn(${stringType}); }}

const interim = stringValidator{{= fnNumber }}(value, propertyPath, errorList, parentType);
let d;
try {
  d = new Date(interim);
  if (!isNaN(d.getTime())) {
    return d
  }
} catch {
  return buildError(\`validator.\${parentType}.invalid\`, { propertyPath }, errorList);
}
return buildError(\`validator.\${parentType}.invalid\`, { propertyPath }, errorList);
`,
  sql: () =>
    `TIMESTAMPTZ {{= model?.isOptional && !model?.defaultValue ? "NULL" : "NOT NULL" }} {{= model?.defaultValue === "(new Date())" ? "DEFAULT now()" : "" }}`,
};

/**
 * @name TypeCreator#date
 * @param {string} [name]
 * @returns {DateType}
 */
TypeCreator.prototype.date = function (name) {
  return new DateType(this.group, name);
};

TypeCreator.types.set(dateType.name, dateType);
