import { readFileSync } from "fs";
import { dirnameForModule, isNil } from "@lbu/stdlib";
import { lowerCaseFirst, upperCaseFirst } from "../../utils.js";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class ReferenceType extends TypeBuilder {
  static baseData = {
    reference: {
      group: undefined,
      name: undefined,
      uniqueName: undefined,
    },
  };

  build() {
    if (isNil(this.ref) && isNil(this.data.reference.group)) {
      throw new Error(
        "Call .set() with either another named TypeBuilder or a valid group and name",
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
   * @returns {ReferenceType}
   */
  constructor(group, name) {
    super(referenceType.name, undefined, undefined);

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

const referenceType = {
  name: "reference",
  class: ReferenceType,
  validator: () => {
    return readFileSync(`${directory}/validator.tmpl`, "utf-8");
  },
  jsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  tsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  sql: () => `{{= JSONB }}`,
};

/**
 * @param {string|TypeBuilder} [groupOrOther]
 * @param {string} [name]
 * @returns {ReferenceType}
 */
TypeCreator.prototype.reference = function (groupOrOther, name) {
  return new ReferenceType(groupOrOther, name);
};

TypeCreator.types.set(referenceType.name, referenceType);
