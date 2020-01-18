import { Schema, schemaBuildSymbol, SchemaLike } from "../types";
import { toSchema } from "../util";
import { MixedPartial } from "./MixedPartial";

export class ObjectPartial extends MixedPartial {
  private _keys: { [s: string]: Schema } = {};
  private _strict?: true;

  constructor(obj?: { [k: string]: SchemaLike }) {
    super();

    if (obj) {
      this.keys(obj);
    }
  }

  key(name: string, value: SchemaLike): this {
    this._keys[name] = toSchema(value);
    return this;
  }

  keys(obj: { [k: string]: SchemaLike }): this {
    for (const [k, v] of Object.entries(obj)) {
      this._keys[k] = toSchema(v);
    }

    return this;
  }

  strict(): this {
    this._strict = true;
    return this;
  }

  [schemaBuildSymbol](): Schema {
    return {
      ...super.partialBuild(),
      type: "object",
      keys: this._keys,
      strict: this._strict,
    };
  }
}
