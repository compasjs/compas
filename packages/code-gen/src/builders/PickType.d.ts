export class PickType extends TypeBuilder {
  static baseData: {
    keys: never[];
    validator: {
      strict: boolean;
    };
  };
  constructor(group: any, name: any);
  internalReference: any;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} builder
   * @returns {PickType}
   */
  object(builder: any): PickType;
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
