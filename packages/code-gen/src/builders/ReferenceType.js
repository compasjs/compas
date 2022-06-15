import { isNil } from "@compas/stdlib";
import { lowerCaseFirst, upperCaseFirst } from "../utils.js";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ReferenceType extends TypeBuilder {
  static baseData = {
    reference: {
      group: undefined,
      name: undefined,
      uniqueName: undefined,
    },
  };

  build() {
    if (
      isNil(this.ref) &&
      (isNil(this.data.reference.group) || isNil(this.data.reference.name))
    ) {
      throw new Error(
        "Call T.reference() with either a named TypeBuilder or a valid group and name",
      );
    }

    const result = super.build();

    if (!isNil(this.ref)) {
      const refBuild = buildOrInfer(this.ref);
      result.reference = {
        group: refBuild.group,
        name: refBuild.name,
      };
    }

    result.reference.uniqueName =
      upperCaseFirst(result.reference.group) +
      upperCaseFirst(result.reference.name);

    return result;
  }

  /**
   * @param {string|TypeBuilder} group
   * @param {string} [name]
   */
  constructor(group, name) {
    super("reference", undefined, undefined);

    this.data = {
      ...this.data,
      ...ReferenceType.getBaseData(),
    };

    this.ref = undefined;

    this.set(group, name);
  }

  /**
   * @param {string|TypeBuilder} group
   * @param {string} [name]
   * @returns {ReferenceType}
   */
  set(group, name) {
    if (group instanceof TypeBuilder) {
      this.ref = group;

      return this;
    }

    this.data.reference.group = lowerCaseFirst(group);
    this.data.reference.name = lowerCaseFirst(name);

    return this;
  }
}
