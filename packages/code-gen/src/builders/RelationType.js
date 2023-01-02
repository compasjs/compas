import { buildOrInfer } from "./utils.js";

export class RelationType {
  constructor(subType, ownKey, reference, referencedKey) {
    this.data = {
      type: "relation",
      subType,
      ownKey,
      referencedKey,
      isOptional: false,
    };

    this.reference = reference;
  }

  /**
   * @returns {RelationType}
   */
  optional() {
    this.data.isOptional = true;

    return this;
  }

  /**
   * @returns {Record<string, any>}
   */
  build() {
    const result = { ...this.data };
    result.reference = buildOrInfer(this.reference);

    return result;
  }
}
