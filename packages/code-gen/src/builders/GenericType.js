import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class GenericType extends TypeBuilder {
  static baseData = {};

  build() {
    const result = super.build();

    result.keys = buildOrInfer(this.internalKeys);
    result.values = buildOrInfer(this.internalValues);

    return result;
  }

  constructor(group, name) {
    super("generic", group, name);

    this.data = {
      ...this.data,
      ...GenericType.getBaseData(),
    };

    this.internalKeys = undefined;
    this.internalValues = undefined;
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} [key]
   * @returns {GenericType}
   */
  keys(key) {
    this.internalKeys = key;
    return this;
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} [value]
   * @returns {GenericType}
   */
  values(value) {
    this.internalValues = value;
    return this;
  }
}
