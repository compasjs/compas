import { merge } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";

class RouteBuilder {
  constructor(method, group, name, path) {
    this.queryValidator = undefined;
    this.paramsValidator = undefined;
    this.bodyValidator = undefined;
    this.responseModel = undefined;

    this.item = {
      method,
      group,
      name,
      path,
      tags: [],
      docs: "",
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
    if (this.paramsValidator !== undefined && !this.paramsValidator.item.name) {
      this.paramsValidator.item.name = `${this.createModelName()}Params`;
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
    if (this.queryValidator !== undefined && !this.queryValidator.item.name) {
      this.queryValidator.item.name = `${this.createModelName()}Query`;
    }
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} model
   * @return {RouteBuilder}
   */
  body(model) {
    if (["POST", "PUT", "DELETE"].indexOf(this.item.method) === -1) {
      throw new Error("Can only use body on POST, PUT or DELETE routes");
    }

    this.bodyValidator = model;
    if (this.bodyValidator !== undefined && !this.bodyValidator.item.name) {
      this.bodyValidator.item.name = `${this.createModelName()}Body`;
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
    if (this.responseModel !== undefined && !this.responseModel.item.name) {
      this.responseModel.item.name = `${this.createModelName()}Response`;
    }
    return this;
  }

  /**
   * @private
   */
  createModelName() {
    return upperCaseFirst(this.item.group) + upperCaseFirst(this.item.name);
  }

  /**
   * @public
   */
  build() {
    return merge({}, this.item);
  }
}

class RouteConstructor {
  constructor(group, path) {
    this.item = {
      group,
      path,
    };
  }

  /**
   * Create a new route group
   * Path will be concatenated with the current path of this group
   * @param {string} name
   * @param {string} path
   * @return {RouteConstructor}
   */
  group(name, path) {
    return new RouteConstructor(
      name,
      concatenateRoutePaths(this.item.path, path),
    );
  }

  /**
   * GET route
   * @param {string} [path]
   * @param {string} [name]
   * @return {RouteBuilder}
   */
  get(path, name) {
    return new RouteBuilder(
      "GET",
      this.item.group,
      name || "get",
      concatenateRoutePaths(this.item.path, path || "/"),
    );
  }

  /**
   * POST route
   * @param {string} [path]
   * @param {string} [name]
   * @return {RouteBuilder}
   */
  post(path, name) {
    return new RouteBuilder(
      "POST",
      this.item.group,
      name || "post",
      concatenateRoutePaths(this.item.path, path || "/"),
    );
  }

  /**
   * PUT route
   * @param {string} [path]
   * @param {string} [name]
   * @return {RouteBuilder}
   */
  put(path, name) {
    return new RouteBuilder(
      "PUT",
      this.item.group,
      name || "put",
      concatenateRoutePaths(this.item.path, path || "/"),
    );
  }

  /**
   * DELETE route
   * @param {string} [path]
   * @param {string} [name]
   * @return {RouteBuilder}
   */
  delete(path, name) {
    return new RouteBuilder(
      "DELETE",
      this.item.group,
      name || "delete",
      concatenateRoutePaths(this.item.path, path || "/"),
    );
  }

  /**
   * HEAD route
   * @param {string} [path]
   * @param {string} [name]
   * @return {RouteBuilder}
   */
  head(path, name) {
    return new RouteBuilder(
      "HEAD",
      this.item.group,
      name || "get",
      concatenateRoutePaths(this.item.path, path || "/"),
    );
  }
}

/**
 * @param {string} path1
 * @param {string} path2
 * @return {string}
 */
function concatenateRoutePaths(path1, path2) {
  if (!path1.endsWith("/")) {
    path1 += "/";
  }
  if (path2.startsWith("/")) {
    path2 = path2.substring(1);
  }

  return path1 + path2;
}

export const R = new RouteConstructor("root", "/");

R.types = {
  RouteBuilder,
};
