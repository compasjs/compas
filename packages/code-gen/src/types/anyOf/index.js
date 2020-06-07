import { dirnameForModule, isNil } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class AnyOfType extends TypeBuilder {
  static baseData = {};

  build() {
    const result = super.build();

    result.values = [];
    for (const v of this.internalValues) {
      result.values.push(v.build());
    }

    return result;
  }

  constructor(group, name, items) {
    super(anyOfType.name, group, name);

    this.data = {
      ...this.data,
      ...AnyOfType.baseData,
    };

    this.internalValues = undefined;

    if (items.length !== 0) {
      this.values(...items);
    }
  }

  /**
   * @param {...TypeBuilder} [items]
   * @returns {AnyOfType}
   */
  values(...items) {
    if (isNil(this.internalValues)) {
      this.internalValues = [];
    }

    this.internalValues.push(...items.flat(2));

    return this;
  }
}

const anyOfType = {
  name: "anyOf",
  class: AnyOfType,
  validator: () => {
    return readFileSync(directory + "/validator.tmpl", {
      encoding: "utf-8",
    });
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
 * @name TypeCreator#anyOf
 * @param {string|TypeBuilder[]} [name]
 * @param {...TypeBuilder} [values]
 * @returns {AnyOfType}
 */
TypeCreator.prototype.anyOf = function (name, ...values) {
  if (Array.isArray(name)) {
    return new AnyOfType(this.group, undefined, name);
  } else {
    return new AnyOfType(this.group, name, values);
  }
};

TypeCreator.types.set(anyOfType.name, anyOfType);
