import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const booleanType = {
  name: "boolean",
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

class BooleanType extends TypeBuilder {
  constructor(group, name) {
    super(booleanType.name, group, name);

    this.data.oneOf = undefined;
    this.data.validator = {
      convert: false,
    };
  }

  /**
   * @param {boolean} value
   * @return {BooleanType}
   */
  oneOf(value) {
    this.data.oneOf = value;

    return this;
  }

  /**
   * @return {BooleanType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }
}

/**
 * @name TypeCreator#bool
 * @param {string} [name]
 * @return {BooleanType}
 */
TypeCreator.prototype.bool = function (name) {
  return new BooleanType(this.group, name);
};

TypeCreator.types[booleanType.name] = BooleanType;
