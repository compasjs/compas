import { merge } from "@lbu/stdlib";
import { RelationType } from "./RelationType.js";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ObjectType extends TypeBuilder {
  static baseData = {
    validator: {
      strict: true,
    },
  };

  build() {
    const result = super.build();

    result.keys = {};
    result.relations = [];

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = buildOrInfer(this.internalKeys[k]);
    }

    for (const relation of this.internalRelations) {
      result.relations.push(buildOrInfer(relation));
    }

    return result;
  }

  constructor(group, name) {
    super("object", group, name);

    this.internalKeys = {};
    this.internalRelations = [];

    this.data = {
      ...this.data,
      ...ObjectType.getBaseData(),
    };
  }

  /**
   * @param {object<string, TypeBuilderLike>} obj
   * @returns {ObjectType}
   */
  keys(obj) {
    this.internalKeys = merge(this.internalKeys, obj);

    return this;
  }

  /**
   * @returns {ObjectType}
   */
  loose() {
    this.data.validator.strict = false;

    return this;
  }

  /**
   * @param {object} [options={}]
   * @param {boolean} [options.withSoftDeletes]
   * @param {boolean} [options.withDates]
   * @returns {ObjectType}
   */
  enableQueries(options = {}) {
    this.data.enableQueries = true;
    this.data.queryOptions = options;
    return this;
  }

  /**
   * @param {...RelationType} relations
   * @returns {ObjectType}
   */
  relations(...relations) {
    this.internalRelations = relations;

    for (const relation of relations) {
      if (!(relation instanceof RelationType)) {
        throw new Error(
          "Only accepts relations created via T.oneToMany, T.manyToOne and T.oneToOne.",
        );
      }
    }

    return this;
  }
}
