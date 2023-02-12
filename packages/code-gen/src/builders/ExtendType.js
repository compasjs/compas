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
    result.relations = [];

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = buildOrInfer(this.internalKeys[k]);
    }

    for (const r of this.internalRelations) {
      result.relations.push(buildOrInfer(r));
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
    this.internalRelations = [];

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

  /**
   * Add relations to the type
   *
   * @param {...import("./RelationType.js").RelationType} relations
   * @returns {ExtendType}
   */
  relations(...relations) {
    this.internalRelations.push(...relations);

    return this;
  }
}
