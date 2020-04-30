import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const genericType = {
  name: "generic",
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

class GenericType extends TypeBuilder {
  constructor(group, name) {
    super(genericType.name, group, name);

    this.internalKeys = undefined;
    this.internalValues = undefined;
  }

  /**
   * @param {TypeBuilder} [key]
   * @return {GenericType}
   */
  keys(key) {
    this.internalKeys = key;
    return this;
  }

  /**
   * @param {TypeBuilder} [value]
   * @return {GenericType}
   */
  values(value) {
    this.internalValues = value;
    return this;
  }

  build() {
    const result = super.build();

    result.keys = this.internalKeys.build();
    result.values = this.internalValues.build();

    return result;
  }
}

/**
 * @name TypeCreator#generic
 * @param {string} [name]
 * @return {GenericType}
 */
TypeCreator.prototype.generic = function (name) {
  return new GenericType(this.group, name);
};

TypeCreator.types[genericType.name] = GenericType;
