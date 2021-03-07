import { TypeBuilder } from "./TypeBuilder.js";

export class DateType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super("date", group, name);

    this.data = {
      ...this.data,
      ...DateType.getBaseData(),
    };
  }

  /**
   * Set as optional and default to new Date()
   *
   * @public
   * @returns {DateType}
   */
  defaultToNow() {
    return this.default("(new Date())");
  }

  /**
   * Set the minimum date value
   *
   * @param {number|string|Date} value
   * @returns {DateType}
   */
  min(value) {
    if (typeof value === "string" || typeof value === "number") {
      value = new Date(value);
    }

    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TypeError(
        `Expected 'Date', 'string' or 'number', got '${value}'`,
      );
    }

    this.data.validator.min = value;

    return this;
  }

  /**
   * Set the max date value
   *
   * @param {number|string|Date} value
   * @returns {DateType}
   */
  max(value) {
    if (typeof value === "string" || typeof value === "number") {
      value = new Date(value);
    }

    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TypeError(
        `Expected 'Date', 'string' or 'number', got '${value}'`,
      );
    }

    this.data.validator.max = value;

    return this;
  }

  /**
   * Only allow dates in the future
   *
   * @returns {DateType}
   */
  inTheFuture() {
    this.data.validator.inFuture = true;

    if (this.data.validator.inPast) {
      throw new TypeError(
        "Supports either 'inTheFuture' or 'inThePast', but not both.",
      );
    }

    return this;
  }

  /**
   * Only allow dates in the past
   *
   * @returns {DateType}
   */
  inThePast() {
    this.data.validator.inPast = true;

    if (this.data.validator.inFuture) {
      throw new TypeError(
        "Supports either 'inTheFuture' or 'inThePast', but not both.",
      );
    }

    return this;
  }
}
