import { isNil, merge } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";

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
      uniqueName: undefined,
      docString: "",
      isOptional: false,
      defaultValue: undefined,
    };

    this.setNameAndGroup();
  }

  /**
   * Add a doc comment, some generators / types may support rendering this
   * @param docValue
   * @return {TypeBuilder}
   */
  docs(docValue) {
    this.data.docString = docValue;

    return this;
  }

  /**
   * Value can be undefined
   * @return {TypeBuilder}
   */
  optional() {
    this.data.isOptional = true;

    return this;
  }

  /**
   * Set a raw default value, also makes the type optional
   * Can be reverted by calling this function with undefined or null
   * @param rawString
   * @return {TypeBuilder}
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
    this.setNameAndGroup();

    return merge({}, this.data);
  }

  setNameAndGroup() {
    if (isNil(this.data.name)) {
      this.data.group = undefined;
    }

    if (!isNil(this.data.group) && !isNil(this.data.name)) {
      this.data.uniqueName =
        upperCaseFirst(this.data.group) + upperCaseFirst(this.data.name);
    }
  }
}

/**
 * Create new instances of registered types
 * @class
 * @name TypeCreator
 */
export class TypeCreator {
  constructor(group) {
    this.group = group || "app";

    if (this.group.indexOf(".") !== -1) {
      throw new Error(
        `The '.' is reserved for later use when creating nested groups`,
      );
    }
  }
}
