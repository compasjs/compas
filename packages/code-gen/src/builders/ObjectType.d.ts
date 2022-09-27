export class ObjectType extends TypeBuilder {
  static baseData: {
    validator: {
      allowNull: boolean;
      strict: boolean;
    };
    shortName: undefined;
  };
  constructor(group: any, name: any);
  internalKeys: {};
  internalRelations: any[];
  /**
   * @param {Record<string, import("../../types/advanced-types").TypeBuilderLike>} obj
   * @returns {ObjectType}
   */
  keys(
    obj: Record<string, import("../../types/advanced-types").TypeBuilderLike>,
  ): ObjectType;
  /**
   * @returns {ObjectType}
   */
  loose(): ObjectType;
  /**
   * Specify shortName used in the query builders
   *
   * @param {string} value
   * @returns {ObjectType}
   */
  shortName(value: string): ObjectType;
  /**
   * @param {{
   *   withSoftDeletes?: boolean,
   *   withDates?: boolean,
   *   withPrimaryKey?: boolean,
   *   isView?: boolean,
   *   schema?: string
   * }} [options = {}]
   * @returns {ObjectType}
   */
  enableQueries(
    options?:
      | {
          withSoftDeletes?: boolean | undefined;
          withDates?: boolean | undefined;
          withPrimaryKey?: boolean | undefined;
          isView?: boolean | undefined;
          schema?: string | undefined;
        }
      | undefined,
  ): ObjectType;
  /**
   * @param {...RelationType} relations
   * @returns {ObjectType}
   */
  relations(...relations: RelationType[]): ObjectType;
}
import { TypeBuilder } from "./TypeBuilder.js";
import { RelationType } from "./RelationType.js";
//# sourceMappingURL=ObjectType.d.ts.map
