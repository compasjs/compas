import { isNil, isPlainObject, merge } from "@lbu/stdlib";
import { lowerCaseFirst } from "../utils.js";

/**
 * Provide base properties for types
 */
export class TypeBuilder {
  /**
   * Create a new TypeBuilder for the provided group
   * @param {string} type
   * @param {string} [group]
   * @param {string} [name]
   */
  constructor(type, group, name) {
    this.data = {
      type,
      group,
      name,
      docString: "",
      isOptional: false,
      defaultValue: undefined,
    };
  }

  /**
   * Add a doc comment, some generators / types may support rendering this
   * @param docValue
   * @return {this}
   */
  docs(docValue) {
    this.data.docString = docValue;

    return this;
  }

  /**
   * Value can be undefined
   * @return {this}
   */
  optional() {
    this.data.isOptional = true;

    return this;
  }

  /**
   * Set a raw default value, also makes the type optional
   * Can be reverted by calling this function with undefined or null
   * @param rawString
   * @return {this}
   */
  default(rawString) {
    this.data.defaultValue = rawString;
    this.data.isOptional = !isNil(rawString);

    return this;
  }

  /**
   * Returns a shallow copy of the data object
   * @return {object}
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
 * @typedef {object} TypePlugin
 * @property {string} name
 * @property {Class} class
 */

/**
 * Create new instances of registered types
 * @class
 * @name TypeCreator
 */
export class TypeCreator {
  /** @type {Map<string, TypePlugin|Object<string, TypePlugin|Class>>} */
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
   * Return a list of types that have the specified property
   * @param {string} property
   * @return {TypePlugin[]}
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
 * Check if value may be output object from a TypeBuilder
 * @param value
 * @return {boolean}
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
