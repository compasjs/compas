import { AppError, isNil } from "@compas/stdlib";
import { validateCodeGenNamePart } from "../generated/codeGen/validators.js";
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
    sql: {},
  };

  /**
   * @param {string} type
   * @param {string|undefined} [group]
   * @param {string|undefined} [name]
   */
  constructor(type, group, name) {
    if (group) {
      const groupValidatorResult = validateCodeGenNamePart(group);
      if (groupValidatorResult.error) {
        throw AppError.serverError({
          message: `Specified group name '${group}' is not valid. Expects only lowercase and uppercase characters.`,
        });
      }
    }

    if (name) {
      const nameValidatorResult = validateCodeGenNamePart(name);
      if (nameValidatorResult.error) {
        throw AppError.serverError({
          message: `Specified type name '${name}' is not valid. Expects only lowercase and uppercase characters.`,
        });
      }
    }

    this.data = {
      ...TypeBuilder.getBaseData(),
      type,
      group,
      name,
    };
  }

  static getBaseData() {
    return JSON.parse(JSON.stringify(this.baseData));
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

      if (this.data.defaultValue.length === 0) {
        throw new Error(
          "'.default()' is called with a value resolving to an empty string. This is not allowed. If you need an empty string as the default value please use: `''`.",
        );
      }
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

    // TODO: Auto set `sql.hasDefaultValue -> true` and remove options around
    //  'withPrimaryKey'.

    return this;
  }

  /**
   * @returns {this}
   */
  sqlDefault() {
    this.data.sql = this.data.sql || {};
    this.data.sql.hasDefaultValue = true;

    return this;
  }

  /**
   * @returns {any}
   */
  build() {
    if (isNil(this.data.name)) {
      this.data.group = undefined;
    } else {
      this.data.name = lowerCaseFirst(this.data.name);
      this.data.group = lowerCaseFirst(this.data.group);
    }

    return JSON.parse(JSON.stringify(this.data));
  }
}
