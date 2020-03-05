import { isNil, merge } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";

/**
 * Create a new RouteBuilder
 * @param {string} name
 * @param {string} path
 */
export function R(name, path) {
  return new RouteBuilder(upperCaseFirst(upperCaseFirst(name)), path);
}

/**
 * Internal delegate for providing a fluent route building experience
 */
class RouteBuilder {
  constructor(name, path) {
    this.queryValidator = undefined;
    this.paramsValidator = undefined;
    this.bodyValidator = undefined;
    this.responseModel = undefined;

    this.item = {
      name,
      path,
      method: undefined,
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
      this.paramsValidator.item.name = `${this.item.name}Params`;
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
      this.queryValidator.item.name = `${this.item.name}Query`;
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
      this.bodyValidator.item.name = `${this.item.name}Body`;
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
      this.responseModel.item.name = `${this.item.name}Response`;
    }

    return this;
  }

  /**
   * @public
   * @return {GetBuilder}
   */
  get() {
    return this.constructBuilder(GetBuilder);
  }

  /**
   * @public
   * @return {PostBuilder}
   */
  post() {
    return this.constructBuilder(PostBuilder);
  }

  /**
   * @public
   * @return {PutBuilder}
   */
  put() {
    return this.constructBuilder(PutBuilder);
  }

  /**
   * @public
   * @return {DeleteBuilder}
   */
  delete() {
    return this.constructBuilder(DeleteBuilder);
  }

  /**
   * @public
   * @return {HeadBuilder}
   */
  head() {
    return this.constructBuilder(HeadBuilder);
  }

  /**
   * @private
   * @param {typeof RouteBuilder} Builder
   * @return {*}
   */
  constructBuilder(Builder) {
    const b = new Builder(this.item.name, this.item.path);
    if (!isNil(this.item.tags)) {
      b.tags(...this.item.tags);
    }
    if (!isNil(this.docs)) {
      b.docs(this.item.docs);
    }
    if (!isNil(this.queryValidator)) {
      b.query(this.queryValidator);
    }
    if (!isNil(this.paramsValidator)) {
      b.params(this.paramsValidator);
    }
    if (!isNil(this.bodyValidator)) {
      b.body(this.bodyValidator);
    }
    if (!isNil(this.responseModel)) {
      b.response(this.responseModel);
    }

    return b;
  }

  /**
   * @public
   */
  build() {
    throw new Error("You forgot to call .get() / .post() / ...");
  }
}

class GetBuilder extends RouteBuilder {
  constructor(name, path) {
    super(`get${name}`, path);
    this.item.method = "GET";
  }

  build() {
    return merge({}, this.item);
  }
}

class PostBuilder extends RouteBuilder {
  constructor(name, path) {
    super(`post${name}`, path);
    this.item.method = "POST";
  }

  build() {
    return merge({}, this.item);
  }
}

class PutBuilder extends RouteBuilder {
  constructor(name, path) {
    super(`put${name}`, path);
    this.item.method = "PUT";
  }

  build() {
    return merge({}, this.item);
  }
}

class DeleteBuilder extends RouteBuilder {
  constructor(name, path) {
    super(`delete${name}`, path);
    this.item.method = "DELETE";
  }

  build() {
    return merge({}, this.item);
  }
}

class HeadBuilder extends RouteBuilder {
  constructor(name, path) {
    super(`head${name}`, path);
    this.item.method = "HEAD";
  }

  build() {
    return merge({}, this.item);
  }
}

R.types = {
  RouteBuilder,
  GetBuilder,
  PostBuilder,
  PutBuilder,
  DeleteBuilder,
  HeadBuilder,
};
