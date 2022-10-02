import { TypeBuilder } from "./TypeBuilder.js";

export class AnyType extends TypeBuilder {
  static baseData = {
    validator: {
      allowNull: false,
    },
    rawValue: undefined,
    rawValueImport: {
      javaScript: undefined,
      typeScript: undefined,
    },
    rawValidator: undefined,
    rawValidatorImport: {
      javaScript: undefined,
      typeScript: undefined,
    },
  };

  constructor(group, name) {
    super("any", group, name);

    this.data = {
      ...this.data,
      ...AnyType.getBaseData(),
    };
  }

  /**
   * Add raw type string instead of any.
   *
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
   * @returns {AnyType}
   */
  raw(value, importValue = {}) {
    this.data.rawValue = value.toString();
    this.data.rawValueImport = importValue;

    return this;
  }

  /**
   * Add raw validator instead of only undefined check.
   * This is validator is called with a value and should return a boolean.
   *
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
   * @returns {AnyType}
   */
  validator(value, importValue = {}) {
    this.data.rawValidator = value.toString();
    this.data.rawValidatorImport = importValue;

    return this;
  }
}
