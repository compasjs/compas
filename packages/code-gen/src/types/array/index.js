import { readFileSync } from "fs";
import { dirnameForModule } from "@lbu/stdlib";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

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

    result.values = buildOrInfer(this.internalValues);

    return result;
  }

  constructor(group, name) {
    super(arrayType.name, group, name);

    this.internalValues = undefined;

    this.data = {
      ...this.data,
      ...ArrayType.getBaseData(),
    };
  }

  /**
   * @param {TypeBuilderLike} [value]
   * @returns {ArrayType}
   */
  values(value) {
    this.internalValues = value;

    return this;
  }

  /**
   * @returns {ArrayType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }

  /**
   * @param {number} min
   * @returns {ArrayType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @returns {ArrayType}
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
    return readFileSync(`${directory}/validator.tmpl`, "utf-8");
  },
  mock: () => {
    return readFileSync(`${directory}/mock.tmpl`, "utf-8");
  },
  jsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  tsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
};

/**
 * @name TypeCreator#array
 * @param {string} [name]
 * @returns {ArrayType}
 */
TypeCreator.prototype.array = function (name) {
  return new ArrayType(this.group, name);
};

TypeCreator.types.set(arrayType.name, arrayType);
