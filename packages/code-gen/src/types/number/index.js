import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class NumberType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      convert: false,
      integer: false,
      min: undefined,
      max: undefined,
    },
  };

  constructor(group, name) {
    super(numberType.name, group, name);

    this.data = {
      ...this.data,
      ...NumberType.getBaseData(),
    };
  }

  /**
   * @param {...number} values
   * @returns {NumberType}
   */
  oneOf(...values) {
    this.data.oneOf = values;

    return this;
  }

  /**
   * @returns {NumberType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @returns {NumberType}
   */
  integer() {
    this.data.validator.integer = true;

    return this;
  }

  /**
   * @param {number} min
   * @returns {NumberType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @returns {NumberType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }
}

const numberType = {
  name: "number",
  class: NumberType,
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", "utf-8");
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", "utf-8");
  },
  jsType: () => {
    return readFileSync(directory + "/type.tmpl", "utf-8");
  },
  tsType: () => {
    return readFileSync(directory + "/type.tmpl", "utf-8");
  },
  sql: () =>
    `{{= model?.validator?.integer ? "INT" : "FLOAT" }} {{= model?.isOptional && !model?.defaultValue ? "NULL" : "NOT NULL" }}`,
};

/**
 * @name TypeCreator#number
 * @param {string} [name]
 * @returns {NumberType}
 */
TypeCreator.prototype.number = function (name) {
  return new NumberType(this.group, name);
};

TypeCreator.types.set(numberType.name, numberType);
