import { ValidatorSchema, ValidatorLikeSchema } from "../types";
import { validatorLikeToValidator } from "../util";
import { MixedValidator } from "./MixedValidator";

export class OneOfValidator extends MixedValidator {
  private _validators: ValidatorLikeSchema[] = [];

  constructor(...s: ValidatorLikeSchema[]) {
    super();

    this.add(...s);
  }

  add(...validators: ValidatorLikeSchema[]): this {
    this._validators.push(...validators);
    return this;
  }

  toSchema(): ValidatorSchema {
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
