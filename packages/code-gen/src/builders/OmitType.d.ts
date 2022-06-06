export class OmitType extends TypeBuilder {
  static baseData: {
    keys: never[];
    validator: {
      strict: boolean;
    };
  };
  constructor(group: any, name: any);
  internalReference:
    | import("../../types/advanced-types").TypeBuilderLike
    | undefined;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} builder
   * @returns {OmitType}
   */
  object(
    builder: import("../../types/advanced-types").TypeBuilderLike,
  ): OmitType;
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
