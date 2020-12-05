import { inspect } from "util";
import { isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class AnyOfType extends TypeBuilder {
  static baseData = {};

  build() {
    const result = super.build();

    const set = new Set();
    result.values = [];

    for (const v of this.internalValues) {
      const buildValue = buildOrInfer(v);
      const stringValueOfBuild = inspect(buildValue, {
        colors: false,
        pretty: false,
        depth: 18, // About 5 levels of object types
      });

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
