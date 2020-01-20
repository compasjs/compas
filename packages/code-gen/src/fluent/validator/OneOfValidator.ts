import { Validator, ValidatorLike } from "../../types";
import { validatorLikeToValidator } from "../../validator";
import { MixedValidator } from "./MixedValidator";

export class OneOfValidator extends MixedValidator {
  private _validators: ValidatorLike[] = [];

  constructor(...s: ValidatorLike[]) {
    super();

    this.add(...s);
  }

  add(...validators: ValidatorLike[]): this {
    this._validators.push(...validators);
    return this;
  }

  toSchema(): Validator {
    if (this._validators.length === 0) {
      throw new TypeError("call .add() with some schema is mandatory");
    }
    return {
      ...super.partialBuild(),
      type: "oneOf",
      validators: this._validators.map(it => validatorLikeToValidator(it)),
    };
  }
}
