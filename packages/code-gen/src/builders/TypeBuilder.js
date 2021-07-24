import { isNil, merge } from "@compas/stdlib";
import { lowerCaseFirst } from "../utils.js";

export class TypeBuilder {
  /**
   * @type {any}
   */
  static baseData = {
    type: undefined,
    group: undefined,
    name: undefined,
    docString: "",
    isOptional: false,
    defaultValue: undefined,
    validator: {},
  };

  /**
   * @param {string} type
   * @param {string|undefined} [group]
   * @param {string|undefined} [name]
   */
  constructor(type, group, name) {
    this.data = {
      ...TypeBuilder.getBaseData(),
      type,
      group,
      name,
    };
  }

  static getBaseData() {
    return merge({}, this.baseData);
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
   * @returns {this}
   */
  allowNull() {
    this.data.isOptional = true;
    this.data.validator.allowNull = true;

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
   * @returns {this}
   */
  searchable() {
    this.data.sql = this.data.sql || {};
    this.data.sql.searchable = true;

    return this;
  }

  /**
   * @returns {this}
   */
  primary() {
    this.data.sql = this.data.sql || {};
    this.data.sql.searchable = true;
    this.data.sql.primary = true;

    return this;
  }

  /**
   * @returns {Record<string, any>}
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
