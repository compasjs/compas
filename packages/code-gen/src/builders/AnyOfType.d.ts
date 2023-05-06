export class AnyOfType extends TypeBuilder {
  static baseData: {
    validator: {};
  };
  constructor(group: any, name: any);
  internalValues: any[];
  /**
   * Note that if duplicate types are found, they are deduplicated.
   *
   * @param {...import("../../types/advanced-types.js").TypeBuilderLike} items
   * @returns {AnyOfType}
   */
  values(
    ...items: import("../../types/advanced-types.js").TypeBuilderLike[]
  ): AnyOfType;
  /**
   * Set the discriminant for faster validators and concise validator errors
   *
   * @param {string} value
   * @returns {AnyOfType}
   */
  discriminant(value: string): AnyOfType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=AnyOfType.d.ts.map
