export class PickType extends TypeBuilder {
  static baseData: {
    keys: never[];
  };
  constructor(group: any, name: any);
  build(): any;
  /**
   * @param {ObjectType|Record<string, import("../../types/advanced-types").TypeBuilderLike>} builder
   * @returns {PickType}
   */
  object(
    builder:
      | ObjectType
      | Record<string, import("../../types/advanced-types").TypeBuilderLike>,
  ): PickType;
  builder: ObjectType | Record<string, any> | undefined;
  /**
   * @param {...string} keys
   * @returns {PickType}
   */
  keys(...keys: string[]): PickType;
}
import { TypeBuilder } from "./TypeBuilder.js";
import { ObjectType } from "./ObjectType.js";
//# sourceMappingURL=PickType.d.ts.map
