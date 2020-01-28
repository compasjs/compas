import { ValidatorSchema } from "../types";
import { ConvertibleValidator } from "./ConvertibleValidator";

export class BooleanValidator extends ConvertibleValidator {
  private _oneOf?: [boolean];

  oneOf(value: boolean): this {
    this._oneOf = [value];
    return this;
  }

  toSchema(): ValidatorSchema {
    return {
      ...super.partialBuild(),
      type: "boolean",
      oneOf: this._oneOf,
    };
  }
}
