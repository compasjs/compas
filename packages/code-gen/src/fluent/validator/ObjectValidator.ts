import { Validator, ValidatorLike } from "../../types";
import { validatorLikeToValidator } from "../../validator";
import { MixedValidator } from "./MixedValidator";

export class ObjectValidator extends MixedValidator {
  private _keys: { [s: string]: ValidatorLike } = {};
  private _strict?: true;

  constructor(obj?: { [k: string]: ValidatorLike }) {
    super();

    if (obj) {
      this.keys(obj);
    }
  }

  key(name: string, value: ValidatorLike): this {
    this._keys[name] = value;
    return this;
  }

  keys(obj: { [k: string]: ValidatorLike }): this {
    for (const [k, v] of Object.entries(obj)) {
      this._keys[k] = v;
    }

    return this;
  }

  strict(): this {
    this._strict = true;
    return this;
  }

  toSchema(): Validator {
    const keys: { [k: string]: Validator } = {};

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
