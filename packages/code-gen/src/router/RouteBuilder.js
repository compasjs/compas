import { isNil, merge } from "@lbu/stdlib";
import { lowerCaseFirst, upperCaseFirst } from "../utils.js";

/**
 * Create a new RouteBuilder
 * @param {string} name
 * @param {string} path
 */
export function R(name, path) {
  const rb = new RouteBuilder(path);
  rb.item.name = lowerCaseFirst(name);

  return rb;
}

/**
 * Internal delegate for providing a fluent route building experience
 */
class RouteBuilder {
  constructor(path) {
    this.queryValidator = undefined;
    this.paramsValidator = undefined;
    this.bodyValidator = undefined;
    this.responseModel = undefined;

    this.item = {
      path,
      name: undefined,
      method: undefined,
      tags: undefined,
      docs: undefined,
    };
  }

  /**
   * @public
   * @param {string} path
   * @return {RouteBuilder}
   */
  path(path) {
    if (this.item.path.endsWith("/") && path.startsWith("/")) {
      path = path.substring(1);
    }
    this.item.path += path;

    return this;
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
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {GetBuilder}
   */
  get(name) {
    return this.constructBuilder(GetBuilder, name || "Get");
  }

  /**
   * @public
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {GetBuilder}
   */
  getList(name) {
    return this.constructBuilder(GetBuilder, name || "GetList");
  }

  /**
   * @public
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {PostBuilder}
   */
  post(name) {
    return this.constructBuilder(PostBuilder, name || "Post");
  }

  /**
   * @public
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {PutBuilder}
   */
  put(name) {
    return this.constructBuilder(PutBuilder, name || "Put");
  }

  /**
   * @public
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {DeleteBuilder}
   */
  delete(name) {
    return this.constructBuilder(DeleteBuilder, name || "Delete");
  }

  /**
   * @public
   * @param {string} [name] Optional name, concat-ed with the possible RouteBuilderName
   * @return {HeadBuilder}
   */
  head(name) {
    return this.constructBuilder(HeadBuilder, name || "Head");
  }

  /**
   * @private
   * @param {typeof RouteBuilder} Builder
   * @param {string} name
   * @return {*}
   */
  constructBuilder(Builder, name) {
    const b = new Builder(this.item.path);

    b.item.name = this.item.name + upperCaseFirst(name);

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
  constructor(path) {
    super(path);
    this.item.method = "GET";
  }

  build() {
    return merge({}, this.item);
  }
}

class PostBuilder extends RouteBuilder {
  constructor(path) {
    super(path);
    this.item.method = "POST";
  }

  build() {
    return merge({}, this.item);
  }
}

class PutBuilder extends RouteBuilder {
  constructor(path) {
    super(path);
    this.item.method = "PUT";
  }

  build() {
    return merge({}, this.item);
  }
}

class DeleteBuilder extends RouteBuilder {
  constructor(path) {
    super(path);
    this.item.method = "DELETE";
  }

  build() {
    return merge({}, this.item);
  }
}

class HeadBuilder extends RouteBuilder {
  constructor(path) {
    super(path);
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
