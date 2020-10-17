import { isNil } from "@lbu/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class AnyOfType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super("anyOf", group, name);

    this.data = {
      ...this.data,
      ...AnyOfType.getBaseData(),
    };
  }

  build() {
    const result = super.build();

    result.values = [];
    for (const v of this.internalValues) {
      result.values.push(buildOrInfer(v));
    }

    return result;
  }

  /**
   * @param {...TypeBuilderLike} [items]
   * @returns {AnyOfType}
   */
  values(...items) {
    if (isNil(this.internalValues)) {
      this.internalValues = [];
    }

    this.internalValues.push(...items);

    return this;
  }
}
