import { readFileSync } from "fs";
import { dirnameForModule } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class StringType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      convert: false,
      trim: false,
      lowerCase: false,
      upperCase: false,
      min: 1,
      max: undefined,
      pattern: undefined,
    },
  };

  constructor(group, name) {
    super(stringType.name, group, name);

    this.data = {
      ...this.data,
      ...StringType.getBaseData(),
    };
  }

  /**
   * @param {...string} values
   * @returns {StringType}
   */
  oneOf(...values) {
    this.data.oneOf = values;

    return this;
  }

  /**
   * @returns {StringType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @returns {StringType}
   */
  trim() {
    this.data.validator.trim = true;

    return this;
  }

  /**
   * @returns {StringType}
   */
  upperCase() {
    this.data.validator.upperCase = true;

    return this;
  }

  /**
   * @returns {StringType}
   */
  lowerCase() {
    this.data.validator.lowerCase = true;

    return this;
  }

  /**
   * @param {number} min
   * @returns {StringType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @returns {StringType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }

  /**
   * @param {RegExp} pattern
   * @returns {StringType}
   */
  pattern(pattern) {
    this.data.validator.pattern = `/${pattern.source}/${pattern.flags}`;

    return this;
  }
}

const stringType = {
  name: "string",
  class: StringType,
  validator: () => {
    return readFileSync(`${directory}/validator.tmpl`, "utf-8");
  },
  jsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  tsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  sql: () =>
    `VARCHAR {{= model?.isOptional && !model?.defaultValue ? "NULL" : "NOT NULL" }}`,
};

/**
 * @name TypeCreator#string
 * @param {string} [name]
 * @returns {StringType}
 */
TypeCreator.prototype.string = function (name) {
  return new StringType(this.group, name);
};

TypeCreator.types.set(stringType.name, stringType);
