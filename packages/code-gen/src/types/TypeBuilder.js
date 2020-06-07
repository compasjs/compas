import { isNil, isPlainObject, merge } from "@lbu/stdlib";
import { lowerCaseFirst } from "../utils.js";

/**
 * Provide base properties for types
 * This includes the 'type', optional, docs and default value.
 * Also contains group and name information
 */
export class TypeBuilder {
  static baseData = {
    type: undefined,
    group: undefined,
    name: undefined,
    docString: "",
    isOptional: false,
    defaultValue: undefined,
  };

  /**
   * Create a new TypeBuilder for the provided group
   *
   * @param {string} type
   * @param {string} [group]
   * @param {string} [name]
   */
  constructor(type, group, name) {
    this.data = {
      ...TypeBuilder.baseData,
      type,
      group,
      name,
    };
  }

  /**
   * Add a doc comment, some generators / types may support rendering this
   *
   * @param docValue
   * @returns {this}
   */
  docs(docValue) {
    this.data.docString = docValue;

    return this;
  }

  /**
   * Value can be undefined
   *
   * @returns {this}
   */
  optional() {
    this.data.isOptional = true;

    return this;
  }

  /**
   * Set a raw default value, also makes the type optional
   * Can be reverted by calling this function with undefined or null
   *
   * @param rawString
   * @returns {this}
   */
  default(rawString) {
    this.data.defaultValue = rawString;
    this.data.isOptional = !isNil(rawString);

    return this;
  }

  /**
   * Returns a shallow copy of the data object
   *
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
 * @name TypePlugin
 *
 * @typedef {object}
 * @property {string} name
 * @property {Class} class
 */

/**
 * Create new instances of registered types and manages grups
 * Also keeps a Map of registered types on TypeCreator.types
 *
 * @class
 */
export class TypeCreator {
  /** @type {Map<string, TypePlugin|object<string, TypePlugin|Class>>} */
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
   *
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
 * Check if value may be output object from a TypeBuilder
 *
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
 * Check if value is a reference with a specified reference field
 *
 * @param value
 * @returns {boolean}
 */
export function isReferenceTypeWithField(value) {
  if (!isPlainObject(value) || value?.type !== "reference") {
    return false;
  }

  return isPlainObject(value.reference) && !isNil(value.reference.field);
}
