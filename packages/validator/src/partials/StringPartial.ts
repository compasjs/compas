import { Schema, schemaBuildSymbol } from "../types";
import { ConvertiblePartial } from "./ConvertiblePartial";

export class StringPartial extends ConvertiblePartial {
  private _min?: number;
  private _max?: number;
  private _pattern?: RegExp;
  private _trim?: true;
  private _lowerCase?: true;
  private _upperCase?: true;
  private _oneOf?: string[];

  min(min: number): this {
    this._min = min;
    return this;
  }

  max(max: number): this {
    this._max = max;
    return this;
  }

  pattern(pattern: RegExp): this {
    this._pattern = pattern;
    return this;
  }

  trim(): this {
    this._trim = true;
    return this;
  }

  lowerCase(): this {
    this._lowerCase = true;
    return this;
  }

  upperCase(): this {
    this._upperCase = true;
    return this;
  }

  oneOf(...strings: string[]): this {
    this._oneOf = strings;
    return this;
  }

  [schemaBuildSymbol](): Schema {
    return {
      ...super.partialBuild(),
      type: "string",
      min: this._min,
      max: this._max,
      pattern: this._pattern,
      trim: this._trim,
      lowerCase: this._lowerCase,
      upperCase: this._upperCase,
      oneOf: this._oneOf,
    };
  }
}
