import { dirnameForModule, isNil, isPlainObject, merge } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const objectType = {
  name: "object",
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

class ObjectType extends TypeBuilder {
  constructor(group, name, obj) {
    super(objectType.name, group, name);

    this.internalKeys = {};

    this.data.validator = {
      strict: false,
    };

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @param {Object<string, TypeBuilder>} obj
   * @return {ObjectType}
   */
  keys(obj) {
    this.internalKeys = merge(this.internalKeys, obj);

    return this;
  }

  /**
   * @return {ObjectType}
   */
  strict() {
    this.data.validator.strict = true;

    return this;
  }

  build() {
    const result = super.build();

    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = this.internalKeys[k].build();
    }

    return result;
  }
}

/**
 * @name TypeCreator#object
 * @param {string|Object<string, TypeBuilder>} [name]
 * @param {Object<string, TypeBuilder>} [obj]
 * @return {ObjectType}
 */
TypeCreator.prototype.object = function (name, obj) {
  if (isPlainObject(name)) {
    return new ObjectType(this.group, undefined, name);
  } else {
    return new ObjectType(this.group, name, obj);
  }
};

TypeCreator.types[objectType.name] = ObjectType;
