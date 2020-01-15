import { Schema, schemaBuildSymbol, SchemaLike } from "../types";
import { toSchema } from "../util";
import { ConvertiblePartial } from "./ConvertiblePartial";

export class ArrayPartial extends ConvertiblePartial {
  private _values?: Schema;

  values(schema: SchemaLike): this {
    this._values = toSchema(schema);
    return this;
  }

  [schemaBuildSymbol](): Schema {
    if (this._values === undefined) {
      throw new TypeError("call .values() is mandatory.");
    }
    return {
      ...super.partialBuild(),
      type: "array",
      values: this._values,
    };
  }
}
