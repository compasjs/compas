import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ArrayType extends TypeBuilder {
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
    super("array", group, name);

    this.internalValues = undefined;

    this.data = {
      ...this.data,
      ...ArrayType.getBaseData(),
    };
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} [value]
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
