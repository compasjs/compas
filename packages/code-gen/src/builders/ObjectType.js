import { isNil } from "@compas/stdlib";
import { RelationType } from "./RelationType.js";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ObjectType extends TypeBuilder {
  static baseData = {
    validator: {
      allowNull: false,
      strict: true,
    },
    shortName: undefined,
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
   * @param {Record<string, import("../../types/advanced-types").TypeBuilderLike>} obj
   * @returns {ObjectType}
   */
  keys(obj) {
    this.internalKeys = {
      ...this.internalKeys,
      ...obj,
    };

    return this;
  }

  /**
   * TODO(depr): add jsdoc tag
   *
   * @returns {ObjectType}
   */
  loose() {
    this.data.validator.strict = false;

    return this;
  }

  /**
   * Specify shortName used in the query builders
   *
   * @param {string} value
   * @returns {ObjectType}
   */
  shortName(value) {
    this.data.shortName = value;
    return this;
  }

  /**
   * @param {{
   *   withSoftDeletes?: boolean,
   *   withDates?: boolean,
   *   withPrimaryKey?: boolean,
   *   isView?: boolean,
   *   schema?: string
   * }} [options = {}]
   * @returns {ObjectType}
   */
  enableQueries(options = {}) {
    this.data.enableQueries = true;
    this.data.queryOptions = options;
    this.data.queryOptions.withPrimaryKey = options.withPrimaryKey ?? true;

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

    if (isNil(this.data.name)) {
      throw new Error(
        `Can't call '.relations()' when 'T.object([name])' is called without a name.`,
      );
    }

    return this;
  }
}
