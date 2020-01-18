import { Schema, schemaBuildSymbol } from "../types";
import { MixedPartial } from "./MixedPartial";

export class RefPartial extends MixedPartial {
  private _ref?: string;

  constructor(ref?: string) {
    super();

    if (ref) {
      this.set(ref);
    }
  }

  set(ref: string): this {
    this._ref = ref;
    return this;
  }

  [schemaBuildSymbol](): Schema {
    if (this._ref === undefined) {
      throw new TypeError("Call .set() to set a reference");
    }
    return {
      ...super.partialBuild(),
      type: "reference",
      ref: this._ref,
    };
  }
}
