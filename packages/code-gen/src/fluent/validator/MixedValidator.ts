import { Validator, ValidatorBuilder } from "../../types";

export abstract class MixedValidator implements ValidatorBuilder {
  protected _name?: string;
  protected _optional?: true;

  abstract toSchema(): Validator;

  name(name: string): this {
    this._name = name;
    return this;
  }

  optional(): this {
    this._optional = true;
    return this;
  }

  protected partialBuild() {
    return {
      name: this._name,
      optional: this._optional,
    };
  }
}
