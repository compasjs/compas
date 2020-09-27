import { isNil, isPlainObject, merge } from "@lbu/stdlib";
import { lowerCaseFirst } from "../utils.js";

export class TypeBuilder {
  static baseData = {
    type: undefined,
    group: undefined,
    name: undefined,
    docString: "",
    isOptional: false,
    defaultValue: undefined,
  };

  static getBaseData() {
    return merge({}, this.baseData);
  }

  /**
   * @param {string} type
   * @param {string} [group]
   * @param {string} [name]
   */
  constructor(type, group, name) {
    this.data = {
      ...TypeBuilder.getBaseData(),
      type,
      group,
      name,
    };
  }

  /**
   * @param docValue
   * @returns {this}
   */
  docs(docValue) {
    this.data.docString = docValue;

    return this;
  }

  /**
   * @returns {this}
   */
  optional() {
    this.data.isOptional = true;

    return this;
  }

  /**
   * @param rawString
   * @returns {this}
   */
  default(rawString) {
    this.data.isOptional = !isNil(rawString);
    if (this.data.isOptional) {
      this.data.defaultValue = rawString.toString();
    }

    return this;
  }

  /**
   * @returns {object}
   */
  build() {
    if (isNil(this.data.name)) {
      this.data.group = undefined;
    } else {
      this.data.name = lowerCaseFirst(this.data.name);
      this.data.group = lowerCaseFirst(this.data.group);
    }

    return merge({}, this.data);
  }
}

/**
 *
 * @class
 */
export class TypeCreator {
  /** @type {Map<string, TypePlugin>} */
  static types = new Map();

  constructor(group) {
    this.group = group || "app";

    if (this.group.indexOf(".") !== -1) {
      throw new Error(
        `The '.' is reserved for later use when creating nested groups`,
      );
    }
  }

  /**
   * @param {string} property
   * @returns {TypePlugin[]}
   */
  static getTypesWithProperty(property) {
    const result = [];
    for (const type of TypeCreator.types.values()) {
      if (property in type) {
        result.push(type);
      }
    }

    return result;
  }
}

/**
 * @param value
 * @returns {boolean}
 */
export function isNamedTypeBuilderLike(value) {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.type === "string" &&
    typeof value.group === "string" &&
    typeof value.name === "string"
  );
}

/**
 * Either calls TypeBuilder#build or infers one of the following types:
 * - boolean oneOf
 * - number oneOf
 * - string oneOf
 * - array
 * - object
 * @param {TypeBuilderLike} value
 * @return {*}
 */
export function buildOrInfer(value) {
  if (value.build && typeof value.build === "function") {
    return value.build();
  }

  if (typeof value === "boolean") {
    return new (TypeCreator.types.get("boolean").class)().oneOf(value).build();
  } else if (typeof value === "number") {
    return new (TypeCreator.types.get("number").class)().oneOf(value).build();
  } else if (typeof value === "string") {
    return new (TypeCreator.types.get("string").class)().oneOf(value).build();
  } else if (isPlainObject(value)) {
    return new (TypeCreator.types.get("object").class)().keys(value).build();
  } else if (Array.isArray(value) && value.length !== 0) {
    return new (TypeCreator.types.get("array").class)()
      .values(value[0])
      .build();
  }
  throw new Error(`Could not infer type of '${value}'`);
}
