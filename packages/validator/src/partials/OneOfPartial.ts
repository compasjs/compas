import { Schema, schemaBuildSymbol, SchemaLike } from "../types";
import { toSchema } from "../util";
import { MixedPartial } from "./MixedPartial";

export class OneOfPartial extends MixedPartial {
  private _schemas: Schema[] = [];

  constructor(...s: SchemaLike[]) {
    super();

    this.add(...s);
  }

  add(...s: SchemaLike[]): this {
    this._schemas.push(...s.map((it: SchemaLike) => toSchema(it)));
    return this;
  }

  [schemaBuildSymbol](): Schema {
    return {
      ...super.partialBuild(),
      type: "oneOf",
      schemas: this._schemas,
    };
  }
}
