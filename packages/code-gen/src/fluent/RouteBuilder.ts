import { ValidatorLike } from "../types";
import { HttpMethod, Route } from "../types/router";
import { validatorLikeToValidator } from "../validator";

export class RouteBuilder {
  private _path = "";
  private _query?: ValidatorLike;
  private _params?: ValidatorLike;
  private _body?: ValidatorLike;
  private _response?: ValidatorLike;

  constructor(private name: string, private method: HttpMethod) {}

  path(path: string): this {
    this._path = path;

    return this;
  }

  query(validator: ValidatorLike): this {
    this._query = validator;
    return this;
  }

  params(validator: ValidatorLike): this {
    this._params = validator;
    return this;
  }

  body(validator: ValidatorLike): this {
    this._body = validator;
    return this;
  }

  response(validator: ValidatorLike): this {
    this._response = validator;
    return this;
  }

  toSchema(): Route {
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

  query(validator: ValidatorLike): this {
    for (const r of this.routes) {
      r.query(validator);
    }

    return this;
  }

  params(validator: ValidatorLike): this {
    for (const r of this.routes) {
      r.params(validator);
    }

    return this;
  }

  body(validator: ValidatorLike): this {
    for (const r of this.routes) {
      r.body(validator);
    }

    return this;
  }

  response(validator: ValidatorLike): this {
    for (const r of this.routes) {
      r.response(validator);
    }

    return this;
  }
}
