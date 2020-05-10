import { dirnameForModule, isNil } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { lowerCaseFirst, upperCaseFirst } from "../../utils.js";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class ReferenceType extends TypeBuilder {
  /**
   * @param {string|TypeBuilder} group
   * @param {string} [name]
   * @return {ReferenceType}
   */
  constructor(group, name) {
    super(referenceType.name, undefined, undefined);

    this.data.reference = {
      group: undefined,
      name: undefined,
      uniqueName: undefined,
    };

    this.ref = undefined;

    this.set(group, name);
  }

  /**
   * @param {string|TypeBuilder} group
   * @param {string} [name]
   * @return {ReferenceType}
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

  /**
   * @api public
   * @param {string} referencing
   * @param {string} [replacement]
   * @return {ReferenceType}
   */
  field(referencing, replacement) {
    this.data.reference.field = {
      referencing,
      replacement,
    };

    return this;
  }

  build() {
    if (isNil(this.ref) && isNil(this.data.reference.group)) {
      throw new Error(
        "Call .set() with either another named TypeBuilder or a valid group and name",
      );
    }

    const result = super.build();

    if (!isNil(this.ref)) {
      const refBuild = this.ref.build();
      result.reference = {
        group: refBuild.group,
        name: refBuild.name,
        field: this.data.reference.field,
      };
    }

    result.reference.uniqueName =
      upperCaseFirst(result.reference.group) +
      upperCaseFirst(result.reference.name);

    return result;
  }
}

const referenceType = {
  name: "reference",
  class: ReferenceType,
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", { encoding: "utf-8" });
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", { encoding: "utf-8" });
  },
  jsType: () => {
    return readFileSync(directory + "/type.tmpl", { encoding: "utf-8" });
  },
  tsType: () => {
    return readFileSync(directory + "/type.tmpl", { encoding: "utf-8" });
  },
};

/**
 * @param {string|TypeBuilder} [groupOrOther]
 * @param {string} [name]
 * @return {ReferenceType}
 */
TypeCreator.prototype.reference = function (groupOrOther, name) {
  return new ReferenceType(groupOrOther, name);
};

TypeCreator.types.set(referenceType.name, referenceType);
