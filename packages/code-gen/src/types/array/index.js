import { dirnameForModule, isNil } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class ArrayType extends TypeBuilder {
  static baseData = {
    validator: {
      convert: false,
      min: undefined,
      max: undefined,
    },
  };

  build() {
    const result = super.build();

    result.values = this.internalValues.build();

    return result;
  }

  constructor(group, name, value) {
    super(arrayType.name, group, name);

    this.internalValues = undefined;

    this.data = {
      ...this.data,
      ...ArrayType.baseData,
    };

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @param {TypeBuilder} [value]
   * @return {ArrayType}
   */
  values(value) {
    this.internalValues = value;

    return this;
  }

  /**
   * @return {ArrayType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @param {number} min
   * @return {ArrayType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @return {ArrayType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }
}

const arrayType = {
  name: "array",
  class: ArrayType,
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

/**
 * @name TypeCreator#array
 * @param {string|TypeBuilder} [name]
 * @param {TypeBuilder} [value]
 * @return {ArrayType}
 */
TypeCreator.prototype.array = function (name, value) {
  if (name instanceof TypeBuilder) {
    return new ArrayType(this.group, undefined, name);
  } else {
    return new ArrayType(this.group, name, value);
  }
};

TypeCreator.types.set(arrayType.name, arrayType);
