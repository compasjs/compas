import { ValidatorSchema, ValidatorLikeSchema } from "../types";
import { validatorLikeToValidator } from "../util";
import { MixedValidator } from "./MixedValidator";

export class ObjectValidator extends MixedValidator {
  private _keys: { [s: string]: ValidatorLikeSchema } = {};
  private _strict?: true;

  constructor(obj?: { [k: string]: ValidatorLikeSchema }) {
    super();

    if (obj) {
      this.keys(obj);
    }
  }

  key(name: string, value: ValidatorLikeSchema): this {
    this._keys[name] = value;
    return this;
  }

  keys(obj: { [k: string]: ValidatorLikeSchema }): this {
    for (const [k, v] of Object.entries(obj)) {
      this._keys[k] = v;
    }

    return this;
  }

  strict(): this {
    this._strict = true;
    return this;
  }

  toSchema(): ValidatorSchema {
    const keys: { [k: string]: ValidatorSchema } = {};

    for (const key in this._keys) {
      keys[key] = validatorLikeToValidator(this._keys[key]);
    }

    return {
      ...super.partialBuild(),
      type: "object",
      keys,
      strict: this._strict,
    };
  }
}
