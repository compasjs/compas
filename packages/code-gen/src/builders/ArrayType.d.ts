export class ArrayType extends TypeBuilder {
  static baseData: {
    validator: {
      convert: boolean;
      min: undefined;
      max: undefined;
    };
  };
  constructor(group: any, name: any);
  internalValues:
    | import("../../types/advanced-types").TypeBuilderLike
    | undefined;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} [value]
   * @returns {ArrayType}
   */
  values(
    value?: import("../../types/advanced-types").TypeBuilderLike | undefined,
  ): ArrayType;
  /**
   * @returns {ArrayType}
   */
  convert(): ArrayType;
  /**
   * @param {number} min
   * @returns {ArrayType}
   */
  min(min: number): ArrayType;
  /**
   * @param {number} max
   * @returns {ArrayType}
   */
  max(max: number): ArrayType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=ArrayType.d.ts.map
