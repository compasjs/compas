import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const referenceType = {
  name: "reference",
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
    return readFileSync(directory + "/type.tmpl", { encoding: "ut-8" });
  },
};

class ReferenceType extends TypeBuilder {
  constructor() {
    super(referenceType.name, undefined, undefined);

    this.data.reference = {
      uniqueName: undefined,
    };
  }

  /**
   * @param {string|TypeBuilder} uniqueName
   * @return {ReferenceType}
   */
  set(uniqueName) {
    this.data.reference.uniqueName = uniqueName;
    if (uniqueName instanceof TypeBuilder) {
      this.data.reference.uniqueName = uniqueName.data.uniqueName;
    }

    return this;
  }
}

/**
 * @name TypeCreator#reference
 * @param {string|TypeBuilder} [other]
 * @return {ReferenceType}
 */
TypeCreator.prototype.reference = function (other) {
  if (other) {
    return new ReferenceType().set(other);
  } else {
    return new ReferenceType();
  }
};

TypeCreator.types[referenceType.name] = ReferenceType;
