import { ValidatorSchema } from "../types";
import { MixedValidator } from "./MixedValidator";

export class RefValidator extends MixedValidator {
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

  toSchema(): ValidatorSchema {
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
