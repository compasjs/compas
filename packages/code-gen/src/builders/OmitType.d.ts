export class OmitType extends TypeBuilder {
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
   * @returns {OmitType}
   */
  object(builder: any): OmitType;
  /**
   * @param {...string} keys
   * @returns {OmitType}
   */
  keys(...keys: string[]): OmitType;
  /**
   * @returns {OmitType}
   */
  loose(): OmitType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=OmitType.d.ts.map
