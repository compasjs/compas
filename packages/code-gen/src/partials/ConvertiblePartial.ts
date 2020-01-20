import { MixedPartial } from "./MixedPartial";

export abstract class ConvertiblePartial extends MixedPartial {
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
