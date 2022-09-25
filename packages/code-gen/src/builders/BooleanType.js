import { TypeBuilder } from "./TypeBuilder.js";

export class BooleanType extends TypeBuilder {
  static baseData = {
    oneOf: undefined,
    validator: {
      convert: false,
      allowNull: false,
    },
  };

  constructor(group, name) {
    super("boolean", group, name);

    this.data = {
      ...this.data,
      ...BooleanType.getBaseData(),
    };
  }

  /**
   * @param {boolean} value
   * @returns {BooleanType}
   */
  oneOf(value) {
    this.data.oneOf = value;

    return this;
  }

  /**
   * @returns {BooleanType}
   */
  convert() {
    this.data.validator.convert = true;

    return this;
  }
}
