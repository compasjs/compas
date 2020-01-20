import { MixedValidator } from "./MixedValidator";

export abstract class ConvertibleValidator extends MixedValidator {
  protected _convert?: true;

  convert(): this {
    this._convert = true;
    return this;
  }

  protected partialBuild() {
    return {
      ...super.partialBuild(),
      convert: this._convert,
    };
  }
}
