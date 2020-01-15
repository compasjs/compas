import { Schema, schemaBuildSymbol } from "../types";
import { ConvertiblePartial } from "./ConvertiblePartial";

export class BooleanPartial extends ConvertiblePartial {
  private _oneOf?: [boolean];

  oneOf(value: boolean): this {
    this._oneOf = [value];
    return this;
  }

  [schemaBuildSymbol](): Schema {
    return {
      ...super.partialBuild(),
      type: "boolean",
      oneOf: this._oneOf,
    };
  }
}
