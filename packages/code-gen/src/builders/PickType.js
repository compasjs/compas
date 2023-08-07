import { AppError, isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class PickType extends TypeBuilder {
  static baseData = {
    keys: [],
    validator: {
      allowNull: false,
      strict: true,
    },
  };

  build() {
    const result = super.build();

    if (isNil(this.internalReference)) {
      throw AppError.serverError({
        message: `T.pick() should have a valid 'T.pick().object()`,
      });
    }

    result.reference = buildOrInfer(this.internalReference);

    return result;
  }

  constructor(group, name) {
    super("pick", group, name);

    this.internalReference = undefined;

    this.data = {
      ...this.data,
      ...PickType.getBaseData(),
    };
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} builder
   * @returns {PickType}
   */
  object(builder) {
    this.internalReference = builder;

    return this;
  }

  /**
   * @param {...string} keys
   * @returns {PickType}
   */
  keys(...keys) {
    this.data.keys.push(...keys);

    return this;
  }

  /**
   * @returns {PickType}
   */
  loose() {
    this.data.validator.strict = false;

    return this;
  }
}
