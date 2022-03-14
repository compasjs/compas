export class OmitType extends TypeBuilder {
  static baseData: {
    keys: never[];
  };
  constructor(group: any, name: any);
  build(): any;
  /**
   * @param {ObjectType|Record<string, import("../../types/advanced-types").TypeBuilderLike>} builder
   * @returns {OmitType}
   */
  object(
    builder:
      | ObjectType
      | Record<string, import("../../types/advanced-types").TypeBuilderLike>,
  ): OmitType;
  builder: ObjectType | Record<string, any> | undefined;
  /**
   * @param {...string} keys
   * @returns {OmitType}
   */
  keys(...keys: string[]): OmitType;
}
import { TypeBuilder } from "./TypeBuilder.js";
import { ObjectType } from "./ObjectType.js";
//# sourceMappingURL=OmitType.d.ts.map
