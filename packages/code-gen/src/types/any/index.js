import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class AnyType extends TypeBuilder {
  static baseData = {
    typeOf: undefined,
    instanceOf: undefined,
  };

  constructor(group, name) {
    super(anyType.name, group, name);

    this.data = {
      ...this.data,
      ...AnyType.baseData,
    };
  }

  /**
   * @param {string} value
   * @returns {AnyType}
   */
  typeOf(value) {
    this.data.typeOf = value;
    return this;
  }

  /**
   * @param {string} value
   * @returns {AnyType}
   */
  instanceOf(value) {
    this.data.instanceOf = value;
    return this;
  }
}

const anyType = {
  name: "any",
  class: AnyType,
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", { encoding: "utf-8" });
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", { encoding: "utf-8" });
  },
  jsType: () => {
    return "*";
  },
  tsType: () => {
    return "any";
  },
};

/**
 * @name TypeCreator#any
 * @param {string} [name]
 * @returns {AnyType}
 */
TypeCreator.prototype.any = function (name) {
  return new AnyType(this.group, name);
};

TypeCreator.types.set(anyType.name, anyType);
