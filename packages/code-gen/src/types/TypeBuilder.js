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
    this.data.defaultValue = rawString;
    this.data.isOptional = !isNil(rawString);

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
