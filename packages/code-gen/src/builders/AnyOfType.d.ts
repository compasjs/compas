export class AnyOfType extends TypeBuilder {
  static baseData: {
    validator: {};
  };
  constructor(group: any, name: any);
  internalValues: any[];
  /**
   * @param {...TypeBuilderLike} items
   * @returns {AnyOfType}
   */
  values(...items: TypeBuilderLike[]): AnyOfType;
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
