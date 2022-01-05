import { isNil } from "@compas/stdlib";
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
   * Make it a date only type.
   *
   * @public
   *
   * @return {DateType}
   */
  dateOnly() {
    this.data.specifier = "dateOnly";

    if (
      !isNil(this.data.validator.min) ||
      !isNil(this.data.validator.max) ||
      !isNil(this.data.validator.inFuture) ||
      !isNil(this.data.validator.inPast)
    ) {
      throw new Error(
        `Can't specify 'dateOnly' with any of 'min', 'max', 'inTheFuture' or 'inThePast'.`,
      );
    }

    return this;
  }

  /**
   * Make it a time only type.
   *
   * @public
   *
   * @return {DateType}
   */
  timeOnly() {
    this.data.specifier = "timeOnly";

    if (
      !isNil(this.data.validator.min) ||
      !isNil(this.data.validator.max) ||
      !isNil(this.data.validator.inFuture) ||
      !isNil(this.data.validator.inPast)
    ) {
      throw new Error(
        `Can't specify 'timeOnly' with any of 'min', 'max', 'inTheFuture' or 'inThePast'.`,
      );
    }

    return this;
  }

  /**
   * Set as optional and default to new Date()
   *
   * @public
   * @returns {DateType}
   */
  defaultToNow() {
    if (this.data.specifier) {
      throw new Error(
        `Can't set the default to now if '${this.data.specifier}' is used.`,
      );
    }

    return this.default("(new Date())");
  }

  /**
   * Set the minimum date value
   *
   * @param {number|string|Date} value
   * @returns {DateType}
   */
  min(value) {
    if (!isNil(this.data.specifier)) {
      throw new Error(`Can't set 'min' if '${this.data.specifier}' is called.`);
    }

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
    if (!isNil(this.data.specifier)) {
      throw new Error(`Can't set 'max' if '${this.data.specifier}' is called.`);
    }

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
    if (!isNil(this.data.specifier)) {
      throw new Error(
        `Can't set 'inTheFuture' if '${this.data.specifier}' is called.`,
      );
    }

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
    if (!isNil(this.data.specifier)) {
      throw new Error(
        `Can't set 'inThePast' if '${this.data.specifier}' is called.`,
      );
    }

    this.data.validator.inPast = true;

    if (this.data.validator.inFuture) {
      throw new TypeError(
        "Supports either 'inTheFuture' or 'inThePast', but not both.",
      );
    }

    return this;
  }
}
