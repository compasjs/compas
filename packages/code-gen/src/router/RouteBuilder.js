const { merge } = require("@lbu/stdlib");
const utils = require("../utils");

/**
 * Create a new RouteBuilder
 * @param {string} name
 * @param {string} path
 * @constructor
 */
function R(name, path) {
  const namePart = utils.upperCaseFirst(name);
  return {
    get: () => new GetBuilder("GET", "get" + namePart, path),
    post: () => new PostBuilder("GET", "post" + namePart, path),
    put: () => new PutBuilder("GET", "put" + namePart, path),
    delete: () => new DeleteBuilder("GET", "delete" + namePart, path),
    head: () => new DeleteBuilder("GET", "head" + namePart, path),
  };
}

R.types = {
  RouteBuilder,
  GetBuilder,
  PostBuilder,
  PutBuilder,
  DeleteBuilder,
  HeadBuilder,
};

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
      result.name = `${utils.upperCaseFirst(this.item.name)}Params`;
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
      result.name = `${utils.upperCaseFirst(this.item.name)}Query`;
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
      result.name = `${utils.upperCaseFirst(this.item.name)}Body`;
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
      result.name = `${utils.upperCaseFirst(this.item.name)}Response`;
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

module.exports = {
  R,
};
