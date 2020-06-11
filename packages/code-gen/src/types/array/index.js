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
      ...ArrayType.getBaseData(),
    };

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @param {TypeBuilder} [value]
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
};

/**
 * @name TypeCreator#array
 * @param {string|TypeBuilder} [name]
 * @param {TypeBuilder} [value]
 * @returns {ArrayType}
 */
TypeCreator.prototype.array = function (name, value) {
  if (name instanceof TypeBuilder) {
    return new ArrayType(this.group, undefined, name);
  } else {
    return new ArrayType(this.group, name, value);
  }
};

TypeCreator.types.set(arrayType.name, arrayType);
