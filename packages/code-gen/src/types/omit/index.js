import { isNil, isPlainObject } from "@lbu/stdlib";
import { ObjectType } from "../object/index.js";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class OmitType extends TypeBuilder {
  static baseData = {
    keys: [],
  };

  build() {
    if (isNil(this.builder)) {
      // Force an error
      this.object(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.name(`${buildResult.name}Omit`);
    }

    const thisResult = super.build();

    // Overwrite name, even if it may be undefined
    buildResult.uniqueName = thisResult.uniqueName;
    buildResult.group = thisResult.group;
    buildResult.name = thisResult.name;

    // also copy over default value, as that is most likely the expected behaviour
    buildResult.defaultValue =
      thisResult.defaultValue ?? buildResult.defaultValue;

    for (const key of thisResult.keys) {
      delete buildResult.keys[key];
    }

    return buildResult;
  }

  constructor(group, name) {
    super(omitType.name, group, name);

    this.data = {
      ...this.data,
      ...OmitType.getBaseData(),
    };
  }

  /**
   * @param {ObjectType|TypeBuilderLikeObject} builder
   * @returns {OmitType}
   */
  object(builder) {
    if (
      isNil(builder) ||
      (!(builder instanceof ObjectType) && !isPlainObject(builder))
    ) {
      throw new TypeError(
        `T.omit() expects a ObjectType or plain Javascript object as the first argument`,
      );
    }

    this.builder = builder;

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
}

const omitType = {
  name: "omit",
  class: OmitType,
};

/**
 * @name TypeCreator#omit
 * @param {string} [name]
 * @returns {OmitType}
 */
TypeCreator.prototype.omit = function (name) {
  return new OmitType(this.group, name);
};

TypeCreator.types.set(omitType.name, omitType);
