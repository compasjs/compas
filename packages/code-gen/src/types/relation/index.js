import { lowerCaseFirst, upperCaseFirst } from "../../utils.js";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class RelationType extends TypeBuilder {
  static baseData = {
    relationType: undefined,
    left: undefined,
    right: undefined,
    leftKey: undefined,
    rightKey: undefined,
    substituteKey: undefined,
  };

  constructor(group) {
    super(relationType.name, group, undefined);

    this.data = {
      ...this.data,
      ...RelationType.getBaseData(),
    };

    // We only accept TypeBuilders, but we still need to build them separately in our
    // build()
    this.left = undefined;
    this.right = undefined;
  }

  /**
   * @param {TypeBuilder} left
   * @param {string} leftKey
   * @param {TypeBuilder} right
   * @param {string} rightKey
   * @param {string} substituteKey
   * @returns {this}
   */
  oneToOne(left, leftKey, right, rightKey, substituteKey) {
    return this.create(
      "oneToOne",
      left,
      leftKey,
      right,
      rightKey,
      substituteKey,
    );
  }

  /**
   * @param {TypeBuilder} left
   * @param {string} leftKey
   * @param {TypeBuilder} right
   * @param {string} rightKey
   * @param {string} substituteKey
   * @returns {this}
   */
  oneToMany(left, leftKey, right, rightKey, substituteKey) {
    return this.create(
      "oneToMany",
      left,
      leftKey,
      right,
      rightKey,
      substituteKey,
    );
  }

  /**
   * @param {TypeBuilder} left
   * @param {string} leftKey
   * @param {TypeBuilder} right
   * @param {string} rightKey
   * @param {string} substituteKey
   * @returns {this}
   */
  manyToOne(left, leftKey, right, rightKey, substituteKey) {
    return this.create(
      "manyToOne",
      left,
      leftKey,
      right,
      rightKey,
      substituteKey,
    );
  }

  /**
   * @private
   */
  create(type, left, leftKey, right, rightKey, substituteKey) {
    this.data.relationType = type;
    this.left = left;
    this.right = right;
    this.data.leftKey = leftKey;
    this.data.rightKey = rightKey;
    this.data.substituteKey = substituteKey;

    if (
      !(this.left instanceof TypeBuilder) ||
      (this.left.data.type !== "object" && this.left.data.type !== "reference")
    ) {
      throw new Error(
        "Relation only accepts a named object type or a reference type",
      );
    }

    if (
      !(this.right instanceof TypeBuilder) ||
      (this.right.data.type !== "object" &&
        this.right.data.type !== "reference")
    ) {
      throw new Error(
        "Relation only accepts a named object type or a reference type",
      );
    }

    return this;
  }

  build() {
    const l = this.left.build();
    const r = this.right.build();

    this.data.name = `${lowerCaseFirst(
      l.name || l.reference?.name,
    )}${upperCaseFirst(this.data.leftKey)}To${upperCaseFirst(
      r.name || r.reference?.name,
    )}${upperCaseFirst(this.data.rightKey)}`;
    const result = super.build();

    result.left = this.left.build();
    result.right = this.right.build();

    return result;
  }
}

const relationType = {
  name: "relation",
  class: RelationType,
};

/**
 * @name TypeCreator#relation
 * @returns {RelationType}
 */
TypeCreator.prototype.relation = function () {
  return new RelationType(this.group);
};

TypeCreator.types.set(relationType.name, relationType);
