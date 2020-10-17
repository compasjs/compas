import { TypeBuilder } from "./TypeBuilder.js";

export class NumberType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      convert: false,
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

  /**
   * @param {...number} values
   * @returns {NumberType}
   */
  oneOf(...values) {
    this.data.oneOf = values;

    return this;
  }

  /**
   * @returns {NumberType}
   */
  convert() {
    this.data.validator.convert = true;

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
