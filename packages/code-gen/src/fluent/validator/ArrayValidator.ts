import { Validator, ValidatorLike } from "../../types";
import { validatorLikeToValidator } from "../../validator";
import { ConvertibleValidator } from "./ConvertibleValidator";

export class ArrayValidator extends ConvertibleValidator {
  private _values?: ValidatorLike;

  values(validator: ValidatorLike): this {
    this._values = validator;
    return this;
  }

  toSchema(): Validator {
    if (this._values === undefined) {
      throw new TypeError("call .values() is mandatory.");
    }
    return {
      ...super.partialBuild(),
      type: "array",
      values: validatorLikeToValidator(this._values),
    };
  }
}
