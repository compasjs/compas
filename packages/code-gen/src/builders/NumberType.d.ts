export class NumberType extends TypeBuilder {
  static baseData: {
    oneOf: undefined;
    validator: {
      allowNull: boolean;
      floatingPoint: boolean;
      min: undefined;
      max: undefined;
    };
  };
  constructor(group: any, name: any);
  /**
   * @param {...number} values
   * @returns {NumberType}
   */
  oneOf(...values: number[]): NumberType;
  /**
   * @returns {NumberType}
   */
  float(): NumberType;
  /**
   * @param {number} min
   * @returns {NumberType}
   */
  min(min: number): NumberType;
  /**
   * @param {number} max
   * @returns {NumberType}
   */
  max(max: number): NumberType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=NumberType.d.ts.map
