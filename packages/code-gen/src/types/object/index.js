import { readFileSync } from "fs";
import { dirnameForModule, merge } from "@lbu/stdlib";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

// This class is exported and used by Omit and Pick
export class ObjectType extends TypeBuilder {
  static baseData = {
    validator: {
      strict: false,
    },
  };

  build() {
    const result = super.build();

    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = buildOrInfer(this.internalKeys[k]);
    }

    return result;
  }

  constructor(group, name) {
    super(objectType.name, group, name);

    this.internalKeys = {};

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
  strict() {
    this.data.validator.strict = true;

    return this;
  }
}

const objectType = {
  name: "object",
  class: ObjectType,
  validator: () => {
    return readFileSync(`${directory}/validator.tmpl`, "utf-8");
  },
  jsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  tsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
};

/**
 * @name TypeCreator#object
 * @param {string} [name]
 * @returns {ObjectType}
 */
TypeCreator.prototype.object = function (name) {
  return new ObjectType(this.group, name);
};

TypeCreator.types.set(objectType.name, objectType);
