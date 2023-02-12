export class ExtendType extends TypeBuilder {
  static baseData: {
    keys: {};
  };
  constructor(group: any, ref: any);
  internalReference: any;
  internalKeys: {};
  internalRelations: any[];
  /**
   * @param {Record<string, import("../../types/advanced-types").TypeBuilderLike>} obj
   * @returns {ExtendType}
   */
  keys(
    obj: Record<string, import("../../types/advanced-types").TypeBuilderLike>,
  ): ExtendType;
  /**
   * Add relations to the type
   *
   * @param {...import("./RelationType.js").RelationType} relations
   * @returns {ExtendType}
   */
  relations(
    ...relations: import("./RelationType.js").RelationType[]
  ): ExtendType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=ExtendType.d.ts.map
