import { ValidatorSchema, ValidatorLikeSchema } from "../types";
import { validatorLikeToValidator } from "../util";
import { ConvertibleValidator } from "./ConvertibleValidator";

export class ArrayValidator extends ConvertibleValidator {
  private _values?: ValidatorLikeSchema;

  values(validator: ValidatorLikeSchema): this {
    this._values = validator;
    return this;
  }

  toSchema(): ValidatorSchema {
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
