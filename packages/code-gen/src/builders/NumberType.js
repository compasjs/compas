import { AppError, isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";

export class NumberType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      allowNull: false,
      floatingPoint: false,
      min: undefined,
      max: undefined,
    },
  };

  constructor(group, name) {
    super("number", group, name);

    this.data = {
      ...this.data,
      ...NumberType.getBaseData(),
    };
  }

  build() {
    const result = super.build();

    if (
      !result.validator.floatingPoint &&
      isNil(result.validator.min) &&
      isNil(result.validator.max)
    ) {
      // Add default integer sizes when no min & max is specified
      result.validator.min = -2_147_483_647;
      result.validator.max = 2_147_483_647;
    }

    return result;
  }

  /**
   * @param {...number} values
   * @returns {NumberType}
   */
  oneOf(...values) {
    if (values.length === 0) {
      throw AppError.serverError({
        message: "`.oneOf()` requires at least a single value.",
      });
    }

    this.data.oneOf = values;

    return this;
  }

  /**
   * @returns {NumberType}
   */
  float() {
    this.data.validator.floatingPoint = true;

    return this;
  }

  /**
   * @param {number} min
   * @returns {NumberType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @returns {NumberType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }
}
