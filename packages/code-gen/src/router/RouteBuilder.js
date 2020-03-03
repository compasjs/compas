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
    this.queryValidator = undefined;
    this.paramsValidator = undefined;
    this.bodyValidator = undefined;
    this.responseModel = undefined;

    this.item = {
      name,
      method,
      path,
      tags: undefined,
      docs: undefined,
    };
  }

  /**
   * @public
   * @param {...string} tags
   * @return {RouteBuilder}
   */
  tags(...tags) {
    this.item.tags = tags;
    return this;
  }

  /**
   * @public
   * @param {string} docs
   * @return {RouteBuilder}
   */
  docs(docs) {
    this.item.docs = docs;
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  params(model) {
    this.paramsValidator = model;
    if (!this.paramsValidator.item.name) {
      this.paramsValidator.item.name = `${upperCaseFirst(
        this.item.name,
      )}Params`;
    }

    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  query(model) {
    this.queryValidator = model;
    if (!this.queryValidator.item.name) {
      this.queryValidator.item.name = `${upperCaseFirst(this.item.name)}Query`;
    }

    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  body(model) {
    this.bodyValidator = model;
    if (!this.bodyValidator.item.name) {
      this.bodyValidator.item.name = `${upperCaseFirst(this.item.name)}Body`;
    }

    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  response(model) {
    this.responseModel = model;
    if (!this.responseModel.item.name) {
      this.responseModel.item.name = `${upperCaseFirst(
        this.item.name,
      )}Response`;
    }

    return this;
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
