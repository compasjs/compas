import { AppError, uuid } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ExtendType extends TypeBuilder {
  static baseData = {
    keys: {},
  };

  build() {
    const result = super.build();

    result.reference = buildOrInfer(this.internalReference);
    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = buildOrInfer(this.internalKeys[k]);
    }

    return result;
  }

  constructor(group, ref) {
    super("extend", group, `x${uuid().substring(0, 6)}`);

    if (ref.data.type !== "reference") {
      throw AppError.serverError({
        message: "T.extend() should be called with a T.reference()",
      });
    }

    this.internalReference = ref;
    this.internalKeys = {};

    this.data = {
      ...this.data,
      ...ExtendType.getBaseData(),
    };
  }

  /**
   * @param {Record<string, import("../../types/advanced-types").TypeBuilderLike>} obj
   * @returns {ExtendType}
   */
  keys(obj) {
    this.internalKeys = {
      ...this.internalKeys,
      ...obj,
    };

    return this;
  }
}
