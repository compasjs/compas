import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const stringType = {
  name: "string",
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", { encoding: "utf-8" });
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", { encoding: "utf-8" });
  },
  jsType: () => {
    return readFileSync(directory + "/type.tmpl", { encoding: "utf-8" });
  },
  tsType: () => {
    return readFileSync(directory + "/type.tmpl", { encoding: "utf-8" });
  },
};

class StringType extends TypeBuilder {
  constructor(group, name) {
    super(stringType.name, group, name);

    this.data.oneOf = undefined;
    this.data.validator = {
      convert: false,
      trim: false,
      lowerCase: false,
      upperCase: false,
      min: undefined,
      max: undefined,
      pattern: undefined,
    };
  }

  /**
   * @param {...string} values
   * @return {StringType}
   */
  oneOf(...values) {
    this.data.oneOf = values;

    return this;
  }

  /**
   * @return {StringType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @return {StringType}
   */
  trim() {
    this.data.validator.trim = true;

    return this;
  }

  /**
   * @return {StringType}
   */
  upperCase() {
    this.data.validator.upperCase = true;

    return this;
  }

  /**
   * @return {StringType}
   */
  lowerCase() {
    this.data.validator.lowerCase = true;

    return this;
  }

  /**
   * @param {number} min
   * @return {StringType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @return {StringType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }

  /**
   * @param {RegExp} pattern
   * @return {StringType}
   */
  pattern(pattern) {
    this.data.validator.pattern = `/${pattern.source}/${pattern.flags}`;

    return this;
  }
}

/**
 * @name TypeCreator#string
 * @param {string} [name]
 * @return {StringType}
 */
TypeCreator.prototype.string = function (name) {
  return new StringType(this.group, name);
};

TypeCreator.types[stringType.name] = StringType;
