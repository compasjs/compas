import { readFileSync } from "fs";
import { dirnameForModule, isNil } from "@lbu/stdlib";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

class AnyOfType extends TypeBuilder {
  static baseData = {};

  build() {
    const result = super.build();

    result.values = [];
    for (const v of this.internalValues) {
      result.values.push(buildOrInfer(v));
    }

    return result;
  }

  constructor(group, name) {
    super(anyOfType.name, group, name);

    this.data = {
      ...this.data,
      ...AnyOfType.getBaseData(),
    };

    this.internalValues = undefined;
  }

  /**
   * @param {...TypeBuilderLike} [items]
   * @returns {AnyOfType}
   */
  values(...items) {
    if (isNil(this.internalValues)) {
      this.internalValues = [];
    }

    this.internalValues.push(...items);

    return this;
  }
}

const anyOfType = {
  name: "anyOf",
  class: AnyOfType,
  validator: () => {
    return readFileSync(`${directory}/validator.tmpl`, {
      encoding: "utf-8",
    });
  },
  jsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
  tsType: () => {
    return readFileSync(`${directory}/type.tmpl`, "utf-8");
  },
};

/**
 * @name TypeCreator#anyOf
 * @param {string} [name] Optional name or array of values that this type
 *   can represent
 * @returns {AnyOfType}
 */
TypeCreator.prototype.anyOf = function (name) {
  return new AnyOfType(this.group, name);
};

TypeCreator.types.set(anyOfType.name, anyOfType);
