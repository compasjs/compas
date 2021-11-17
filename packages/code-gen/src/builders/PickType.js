import { isNil, isPlainObject } from "@compas/stdlib";
import { ObjectType } from "./ObjectType.js";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */

export class PickType extends TypeBuilder {
  static baseData = {
    keys: [],
  };

  build() {
    if (isNil(this.builder)) {
      // Force an error
      // @ts-ignore
      this.object(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.data.name = `${buildResult.name}Pick`;
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
    super("pick", group, name);

    this.data = {
      ...this.data,
      ...PickType.getBaseData(),
    };
  }

  /**
   * @param {ObjectType|Record<string, TypeBuilderLike>} builder
   * @returns {PickType}
   */
  object(builder) {
    if (
      isNil(builder) ||
      (!(builder instanceof ObjectType) && !isPlainObject(builder))
    ) {
      throw new TypeError(
        `T.pick() expects a ObjectType or plain Javascript object as the first argument`,
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
