export class GenericType extends TypeBuilder {
  static baseData: {};
  constructor(group: any, name: any);
  internalKeys:
    | import("../../types/advanced-types").TypeBuilderLike
    | undefined;
  internalValues:
    | import("../../types/advanced-types").TypeBuilderLike
    | undefined;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} [key]
   * @returns {GenericType}
   */
  keys(
    key?: import("../../types/advanced-types").TypeBuilderLike | undefined,
  ): GenericType;
  /**
   * @param {import("../../types/advanced-types").TypeBuilderLike} [value]
   * @returns {GenericType}
   */
  values(
    value?: import("../../types/advanced-types").TypeBuilderLike | undefined,
  ): GenericType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=GenericType.d.ts.map
