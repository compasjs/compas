import { isNil, isPlainObject } from "@lbu/stdlib";
import { ObjectType } from "../object/index.js";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class PickType extends TypeBuilder {
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
      this.name(`${buildResult.name}Pick`);
    }

    const thisResult = super.build();

    // Overwrite name, even if it may be undefined
    buildResult.uniqueName = thisResult.uniqueName;
    buildResult.group = thisResult.group;
    buildResult.name = thisResult.name;

    // also copy over default value, as that is most likely the expected behaviour
    buildResult.defaultValue =
      thisResult.defaultValue ?? buildResult.defaultValue;

    const existingKeys = Object.keys(buildResult.keys);
    for (const key of existingKeys) {
      if (thisResult.keys.indexOf(key) === -1) {
        delete buildResult.keys[key];
      }
    }

    return buildResult;
  }

  constructor(group, name) {
    super(pickType.name, group, name);

    this.data = {
      ...this.data,
      ...PickType.getBaseData(),
    };
  }

  /**
   * @param {ObjectType|TypeBuilderLikeObject} builder
   * @returns {PickType}
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
   * @returns {PickType}
   */
  keys(...keys) {
    this.data.keys.push(...keys);

    return this;
  }
}

const pickType = {
  name: "pick",
  class: PickType,
};

/**
 * @name TypeCreator#pick
 * @param {string} [name]
 * @returns {PickType}
 */
TypeCreator.prototype.pick = function (name) {
  return new PickType(this.group, name);
};

TypeCreator.types.set(pickType.name, pickType);
