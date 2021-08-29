import { isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */

export class OptionalType extends TypeBuilder {
  static baseData = {};

  build() {
    if (isNil(this.builder)) {
      // Force an error
      this.value(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.data.name = `${buildResult.name}Optional`;
    }

    const thisResult = super.build();

    // Overwrite name, even if it may be undefined
    buildResult.uniqueName = thisResult.uniqueName;
    buildResult.group = thisResult.group;
    buildResult.name = thisResult.name;

    buildResult.isOptional = true;
    // also copy over default value, as that is most likely the expected behaviour
    buildResult.defaultValue =
      thisResult.defaultValue ?? buildResult.defaultValue;

    return buildResult;
  }

  constructor(group, name) {
    super("optional", group, name);

    this.data = {
      ...this.data,
      ...OptionalType.getBaseData(),
    };
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {OptionalType}
   */
  value(builder) {
    if (isNil(builder)) {
      throw new TypeError(
        `T.optional() expects a TypeBuilderLike as the first argument`,
      );
    }

    this.builder = builder;

    return this;
  }
}
