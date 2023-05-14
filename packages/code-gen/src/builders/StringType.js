import { AppError, isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";

export class StringType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      allowNull: false,
      trim: false,
      lowerCase: false,
      upperCase: false,
      min: 1,
      max: undefined,
      pattern: undefined,
      disallowedCharacters: undefined,
    },
  };

  build() {
    const result = super.build();

    if (
      Array.isArray(result.validator.disallowedCharacters) &&
      isNil(result.validator.max)
    ) {
      throw new Error(
        `T.string().max() is required when '.disallowCharacters()' is used.`,
      );
    }

    return result;
  }

  constructor(group, name) {
    super("string", group, name);

    this.data = {
      ...this.data,
      ...StringType.getBaseData(),
    };
  }

  /**
   * @param {...string} values
   * @returns {StringType}
   */
  oneOf(...values) {
    if (values.length === 0) {
      throw AppError.serverError({
        message: "`.oneOf()` requires at least a single value.",
      });
    }

    this.data.oneOf = values;

    for (const value of values) {
      if (isNil(value) || value.length === 0) {
        throw AppError.serverError({
          message:
            "Values in 'oneOf' should be at least 1 character. Found 'null', 'undefined' or an empty string",
        });
      }
    }

    return this;
  }

  /**
   * @returns {StringType}
   */
  trim() {
    this.data.validator.trim = true;

    return this;
  }

  /**
   * @returns {StringType}
   */
  upperCase() {
    this.data.validator.upperCase = true;

    return this;
  }

  /**
   * @returns {StringType}
   */
  lowerCase() {
    this.data.validator.lowerCase = true;

    return this;
  }

  /**
   * @param {number} min
   * @returns {StringType}
   */
  min(min) {
    this.data.validator.min = min;

    return this;
  }

  /**
   * @param {number} max
   * @returns {StringType}
   */
  max(max) {
    this.data.validator.max = max;

    return this;
  }

  /**
   * @param {RegExp} pattern
   * @returns {StringType}
   */
  pattern(pattern) {
    this.data.validator.pattern = `/${pattern.source}/${pattern.flags}`;

    return this;
  }

  /**
   * @param {string[]} characterArray
   * @returns {StringType}
   */
  disallowCharacters(characterArray) {
    if (!Array.isArray(characterArray) || characterArray.length === 0) {
      throw new TypeError(
        `Expects 'characterArray' to be an array with at least a single value.`,
      );
    }

    for (const char of characterArray) {
      if (char.length === 0 || char.length > 2) {
        throw new TypeError(
          `T.string().disallowCharacters() needs an array with single character strings as values. Found '${char}' with length ${char.length}.`,
        );
      }
    }

    this.data.validator.disallowedCharacters = characterArray;

    return this;
  }
}
