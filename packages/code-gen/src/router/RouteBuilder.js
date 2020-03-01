import { merge } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";

/**
 * Create a new RouteBuilder
 * @param {string} name
 * @param {string} path
 */
export function R(name, path) {
  const namePart = upperCaseFirst(name);
  return {
    get: () => new GetBuilder("GET", "get" + namePart, path),
    post: () => new PostBuilder("POST", "post" + namePart, path),
    put: () => new PutBuilder("PUT", "put" + namePart, path),
    delete: () => new DeleteBuilder("DELETE", "delete" + namePart, path),
    head: () => new HeadBuilder("HEAD", "head" + namePart, path),
  };
}

/**
 * Internal delegate for providing a fluent route building experience
 */
class RouteBuilder {
  constructor(method, name, path) {
    this.item = {
      name,
      method,
      path,
      tags: undefined,
      docs: undefined,
      queryValidator: undefined,
      paramsValidator: undefined,
      bodyValidator: undefined,
      responseModel: undefined,
    };
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  params(model) {
    const result = model.build();
    if (!result.name) {
      result.name = `${upperCaseFirst(this.item.name)}Params`;
      result._addValidator = true;
    }
    this.item.paramsValidator = result;
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  query(model) {
    const result = model.build();
    if (!result.name) {
      result.name = `${upperCaseFirst(this.item.name)}Query`;
      result._addValidator = true;
    }
    this.item.queryValidator = result;
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  body(model) {
    const result = model.build();
    if (!result.name) {
      result.name = `${upperCaseFirst(this.item.name)}Body`;
      result._addValidator = true;
    }
    this.item.bodyValidator = result;
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  response(model) {
    const result = model.build();
    if (!result.name) {
      result.name = `${upperCaseFirst(this.item.name)}Response`;
    }
    this.item.responseModel = result;
  }

  /**
   * @public
   */
  build() {
    if (this.item === undefined) {
      throw new Error("Not implemented");
    }
    return merge({}, this.item);
  }
}

class GetBuilder extends RouteBuilder {}

class PostBuilder extends RouteBuilder {}

class PutBuilder extends RouteBuilder {}

class DeleteBuilder extends RouteBuilder {}

class HeadBuilder extends RouteBuilder {}

R.types = {
  RouteBuilder,
  GetBuilder,
  PostBuilder,
  PutBuilder,
  DeleteBuilder,
  HeadBuilder,
};
