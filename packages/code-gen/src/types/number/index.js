import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const numberType = {
  name: "number",
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

class NumberType extends TypeBuilder {
  constructor(group, name) {
    super(numberType.name, group, name);

    this.data.oneOf = undefined;
    this.data.validator = {
      convert: false,
      integer: false,
      min: undefined,
      max: undefined,
    };
  }

  /**
   * @param {...number} values
   * @return {NumberType}
   */
  oneOf(...values) {
    this.data.oneOf = values;

    return this;
  }

  /**
   * @return {NumberType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @return {NumberType}
   */
  integer() {
    this.data.validator.integer = true;

    return this;
  }

  /**
   * @param {number} min
   * @return {NumberType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @return {NumberType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }
}

/**
 * @name TypeCreator#number
 * @param {string} [name]
 * @return {NumberType}
 */
TypeCreator.prototype.number = function (name) {
  return new NumberType(this.group, name);
};

TypeCreator.types[numberType.name] = NumberType;
