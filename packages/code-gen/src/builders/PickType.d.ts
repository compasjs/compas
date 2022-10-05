export class PickType extends TypeBuilder {
  static baseData: {
    keys: never[];
    validator: {
      allowNull: boolean;
      strict: boolean;
    };
  };
  constructor(group: any, name: any);
  internalReference:
    | import("../../types/advanced-types").TypeBuilderLike
    | undefined;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} builder
   * @returns {PickType}
   */
  object(
    builder: import("../../types/advanced-types").TypeBuilderLike,
  ): PickType;
  /**
   * @param {...string} keys
   * @returns {PickType}
   */
  keys(...keys: string[]): PickType;
  /**
   * @returns {PickType}
   */
  loose(): PickType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=PickType.d.ts.map
