import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class GenericType extends TypeBuilder {
  static baseData = {};

  build() {
    const result = super.build();

    result.keys = this.internalKeys.build();
    result.values = this.internalValues.build();

    return result;
  }

  constructor(group, name) {
    super(genericType.name, group, name);

    this.data = {
      ...this.data,
      ...GenericType.baseData,
    };

    this.internalKeys = undefined;
    this.internalValues = undefined;
  }

  /**
   * @param {TypeBuilder} [key]
   * @returns {GenericType}
   */
  keys(key) {
    this.internalKeys = key;
    return this;
  }

  /**
   * @param {TypeBuilder} [value]
   * @returns {GenericType}
   */
  values(value) {
    this.internalValues = value;
    return this;
  }
}

const genericType = {
  name: "generic",
  class: GenericType,
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", { encoding: "utf-8" });
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", { encoding: "utf-8" });
  },
  jsType: () => {
    return readFileSync(directory + "/js-type.tmpl", { encoding: "utf-8" });
  },
  tsType: () => {
    return readFileSync(directory + "/ts-type.tmpl", { encoding: "utf-8" });
  },
};

/**
 * @name TypeCreator#generic
 * @param {string} [name]
 * @returns {GenericType}
 */
TypeCreator.prototype.generic = function (name) {
  return new GenericType(this.group, name);
};

TypeCreator.types.set(genericType.name, genericType);
