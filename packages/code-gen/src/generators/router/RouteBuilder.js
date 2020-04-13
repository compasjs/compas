import { merge } from "@lbu/stdlib";
import { upperCaseFirst } from "../../utils.js";

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
   * @param {TypeBuilder} model
   * @return {RouteBuilder}
   */
  params(model) {
    this.paramsValidator = model;
    if (this.paramsValidator !== undefined && !this.paramsValidator.data.name) {
      this.paramsValidator.data.group = this.item.group;
      this.paramsValidator.data.name = `${this.createModelName()}Params`;
      this.paramsValidator.setNameAndGroup();
    }
    return this;
  }

  /**
   * @public
   * @param {TypeBuilder} model
   * @return {RouteBuilder}
   */
  query(model) {
    this.queryValidator = model;
    if (this.queryValidator !== undefined && !this.queryValidator.data.name) {
      this.queryValidator.data.group = this.item.group;
      this.queryValidator.data.name = `${this.createModelName()}Query`;
      this.queryValidator.setNameAndGroup();
    }
    return this;
  }

  /**
   * @public
   * @param {TypeBuilder} model
   * @return {RouteBuilder}
   */
  body(model) {
    if (["POST", "PUT", "DELETE"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use body on POST, PUT or DELETE routes");
    }

    this.bodyValidator = model;
    if (this.bodyValidator !== undefined && !this.bodyValidator.data.name) {
      this.bodyValidator.data.group = this.item.group;
      this.bodyValidator.data.name = `${this.createModelName()}Body`;
      this.bodyValidator.setNameAndGroup();
    }
    return this;
  }

  /**
   * @public
   * @param {TypeBuilder} model
   * @return {RouteBuilder}
   */
  response(model) {
    this.responseModel = model;
    if (this.responseModel !== undefined && !this.responseModel.data.name) {
      this.responseModel.data.group = this.item.group;
      this.responseModel.data.name = `${this.createModelName()}Response`;
      this.responseModel.setNameAndGroup();
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
