import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class AnyOfType extends TypeBuilder {
  static baseData = {
    validator: {},
  };

  build() {
    const result = super.build();

    const set = new Set();
    result.values = [];

    for (const v of this.internalValues) {
      const buildValue = buildOrInfer(v);
      const stringValueOfBuild = JSON.stringify(buildValue);

      if (!set.has(stringValueOfBuild)) {
        set.add(stringValueOfBuild);
        result.values.push(buildValue);
      }
    }

    return result;
  }

  constructor(group, name) {
    super("anyOf", group, name);

    this.data = {
      ...this.data,
      ...AnyOfType.getBaseData(),
    };

    this.internalValues = [];
  }

  /**
   * Note that if duplicate types are found, they are deduplicated.
   *
   * @param {...import("../../types/advanced-types.js").TypeBuilderLike} items
   * @returns {AnyOfType}
   */
  values(...items) {
    this.internalValues.push(...items);

    return this;
  }

  /**
   * Set the discriminant for faster validators and concise validator errors
   *
   * @param {string} value
   * @returns {AnyOfType}
   */
  discriminant(value) {
    this.data.validator.discriminant = value;

    return this;
  }
}
