import { isNil } from "@lbu/stdlib";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class OptionalType extends TypeBuilder {
  static baseData = {};

  build() {
    if (isNil(this.builder)) {
      // Force an error
      this.value(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.name(`${buildResult.name}Optional`);
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
    super(optionalType.name, group, name);

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

const optionalType = {
  name: "optional",
  class: OptionalType,
};

/**
 * @name TypeCreator#optional
 * @param {string} [name]
 * @returns {OptionalType}
 */
TypeCreator.prototype.optional = function (name) {
  return new OptionalType(this.group, name);
};

TypeCreator.types.set(optionalType.name, optionalType);
