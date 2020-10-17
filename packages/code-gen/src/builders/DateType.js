import { TypeBuilder } from "./TypeBuilder.js";

export class DateType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super("date", group, name);

    this.data = {
      ...this.data,
      ...DateType.getBaseData(),
    };
  }

  /**
   * Set as optional and default to new Date()
   *
   * @public
   * @returns {DateType}
   */
  defaultToNow() {
    return this.default("(new Date())");
  }
}
