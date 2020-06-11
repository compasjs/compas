import { dirnameForModule, isNil, isPlainObject, merge } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class ObjectType extends TypeBuilder {
  static baseData = {
    validator: {
      strict: false,
    },
  };

  build() {
    const result = super.build();

    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = this.internalKeys[k].build();
    }

    return result;
  }

  constructor(group, name, obj) {
    super(objectType.name, group, name);

    this.internalKeys = {};

    this.data = {
      ...this.data,
      ...ObjectType.getBaseData(),
    };

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @param {object<string, TypeBuilder>} obj
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
    return readFileSync(directory + "/validator.tmpl", "utf-8");
  },
  mock: () => {
    return readFileSync(directory + "/mock.tmpl", "utf-8");
  },
  jsType: () => {
    return readFileSync(directory + "/type.tmpl", "utf-8");
  },
  tsType: () => {
    return readFileSync(directory + "/type.tmpl", "utf-8");
  },
};

/**
 * @name TypeCreator#object
 * @param {string|object<string, TypeBuilder>} [name]
 * @param {object<string, TypeBuilder>} [obj]
 * @returns {ObjectType}
 */
TypeCreator.prototype.object = function (name, obj) {
  if (isPlainObject(name)) {
    return new ObjectType(this.group, undefined, name);
  } else {
    return new ObjectType(this.group, name, obj);
  }
};

TypeCreator.types.set(objectType.name, objectType);
