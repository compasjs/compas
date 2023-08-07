import { AppError, isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class OmitType extends TypeBuilder {
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
        message: `T.omit() should have a valid 'T.omit().object()`,
      });
    }

    result.reference = buildOrInfer(this.internalReference);

    return result;
  }

  constructor(group, name) {
    super("omit", group, name);

    this.internalReference = undefined;

    this.data = {
      ...this.data,
      ...OmitType.getBaseData(),
    };
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} builder
   * @returns {OmitType}
   */
  object(builder) {
    this.internalReference = builder;

    return this;
  }

  /**
   * @param {...string} keys
   * @returns {OmitType}
   */
  keys(...keys) {
    this.data.keys.push(...keys);

    return this;
  }

  /**
   * @returns {OmitType}
   */
  loose() {
    this.data.validator.strict = false;

    return this;
  }
}
