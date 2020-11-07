import { TypeBuilder } from "./TypeBuilder.js";

export class AnyType extends TypeBuilder {
  static baseData = {
    rawValue: undefined,
    importRaw: {
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
   * Add raw string instead of any
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }=} importValue
   * @returns {AnyType}
   */
  raw(value, importValue = {}) {
    this.data.rawValue = value.toString();
    this.data.importRaw = importValue;

    return this;
  }
}
