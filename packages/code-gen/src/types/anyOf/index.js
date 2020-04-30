import { dirnameForModule, isNil } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

const directory = dirnameForModule(import.meta);

export const anyOfType = {
  name: "anyOf",
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

class AnyOfType extends TypeBuilder {
  constructor(group, name, items) {
    super(anyOfType.name, group, name);

    this.internalValues = undefined;

    if (items.length !== 0) {
      this.values(...items);
    }
  }

  /**
   * @param {...TypeBuilder} [items]
   * @return {AnyOfType}
   */
  values(...items) {
    if (isNil(this.internalValues)) {
      this.internalValues = [];
    }

    this.internalValues.push(...items);

    return this;
  }

  build() {
    const result = super.build();

    result.values = [];
    for (const v of this.internalValues) {
      result.values.push(v.build());
    }

    return result;
  }
}

/**
 * @name TypeCreator#anyOf
 * @param {string|TypeBuilder[]} [name]
 * @param {...TypeBuilder} [values]
 * @return {AnyOfType}
 */
TypeCreator.prototype.anyOf = function (name, ...values) {
  if (Array.isArray(name)) {
    return new AnyOfType(this.group, undefined, name);
  } else {
    return new AnyOfType(this.group, name, values);
  }
};

TypeCreator.types[anyOfType.name] = AnyOfType;
