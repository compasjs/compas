export class BooleanType extends TypeBuilder {
  static baseData: {
    oneOf: undefined;
    validator: {
      convert: boolean;
      allowNull: boolean;
    };
  };
  constructor(group: any, name: any);
  /**
   * @param {boolean} value
   * @returns {BooleanType}
   */
  oneOf(value: boolean): BooleanType;
  /**
   * @returns {BooleanType}
   */
  convert(): BooleanType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=BooleanType.d.ts.map
