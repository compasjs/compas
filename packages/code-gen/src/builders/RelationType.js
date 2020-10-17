import { merge } from "@lbu/stdlib";
import { buildOrInfer } from "./utils.js";

export class RelationType {
  constructor(subType, ownKey, reference, referencedKey) {
    this.data = {
      type: "relation",
      subType,
      ownKey,
      referencedKey,
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
   * @returns {object}
   */
  build() {
    const result = merge({}, this.data);
    result.reference = buildOrInfer(this.reference);

    return result;
  }
}
