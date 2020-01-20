import { Schema, schemaBuildSymbol } from "../types";
import { ConvertiblePartial } from "./ConvertiblePartial";

export class NumberPartial extends ConvertiblePartial {
  private _min?: number;
  private _max?: number;
  private _integer?: true;
  private _oneOf?: number[];

  min(min: number): this {
    this._min = min;
    return this;
  }

  max(max: number): this {
    this._max = max;
    return this;
  }

  integer(): this {
    this._integer = true;
    return this;
  }

  oneOf(...numbers: number[]): this {
    this._oneOf = numbers;
    return this;
  }

  [schemaBuildSymbol](): Schema {
    return {
      ...super.partialBuild(),
      type: "number",
      min: this._min,
      max: this._max,
      integer: this._integer,
      oneOf: this._oneOf,
    };
  }
}
