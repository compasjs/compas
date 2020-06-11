import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class BooleanType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      convert: false,
    },
  };

  constructor(group, name) {
    super(booleanType.name, group, name);

    this.data = {
      ...this.data,
      ...BooleanType.getBaseData(),
    };
  }

  /**
   * @param {boolean} value
   * @returns {BooleanType}
   */
  oneOf(value) {
    this.data.oneOf = value;

    return this;
  }

  /**
   * @returns {BooleanType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }
}

const booleanType = {
  name: "boolean",
  class: BooleanType,
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
    `BOOL {{= model?.isOptional && !model?.defaultValue ? "NULL" : "NOT NULL" }}`,
};

/**
 * @name TypeCreator#bool
 * @param {string} [name]
 * @returns {BooleanType}
 */
TypeCreator.prototype.bool = function (name) {
  return new BooleanType(this.group, name);
};

TypeCreator.types.set(booleanType.name, booleanType);
