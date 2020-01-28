import { ValidatorLikeSchema } from "./types";
import { HttpMethod, RouteSchema } from "./types";
import { validatorLikeToValidator } from "./util";

export class RouteBuilder {
  private _path = "";
  private _query?: ValidatorLikeSchema;
  private _params?: ValidatorLikeSchema;
  private _body?: ValidatorLikeSchema;
  private _response?: ValidatorLikeSchema;

  constructor(private name: string, private method: HttpMethod) {}

  path(path: string): this {
    this._path = path;

    return this;
  }

  query(validator: ValidatorLikeSchema): this {
    this._query = validator;
    return this;
  }

  params(validator: ValidatorLikeSchema): this {
    this._params = validator;
    return this;
  }

  body(validator: ValidatorLikeSchema): this {
    this._body = validator;
    return this;
  }

  response(validator: ValidatorLikeSchema): this {
    this._response = validator;
    return this;
  }

  toSchema(): RouteSchema {
    if (this._path === "") {
      throw new TypeError(`call .path("/path/:param") on ${this.name}`);
    }

    return {
      path: this._path,
      method: this.method,
      name: this.name,
      queryValidator: this._query
        ? validatorLikeToValidator(this._query)
        : undefined,
      paramsValidator: this._params
        ? validatorLikeToValidator(this._params)
        : undefined,
      bodyValidator: this._body
        ? validatorLikeToValidator(this._body)
        : undefined,
      response: this._response
        ? validatorLikeToValidator(this._response)
        : undefined,
    };
  }
}

export class RouteBuilderDelegate {
  constructor(private routes: RouteBuilder[]) {}

  path(path: string): this {
    for (const r of this.routes) {
      r.path(path);
    }

    return this;
  }

  query(validator: ValidatorLikeSchema): this {
    for (const r of this.routes) {
      r.query(validator);
    }

    return this;
  }

  params(validator: ValidatorLikeSchema): this {
    for (const r of this.routes) {
      r.params(validator);
    }

    return this;
  }

  body(validator: ValidatorLikeSchema): this {
    for (const r of this.routes) {
      r.body(validator);
    }

    return this;
  }

  response(validator: ValidatorLikeSchema): this {
    for (const r of this.routes) {
      r.response(validator);
    }

    return this;
  }
}
