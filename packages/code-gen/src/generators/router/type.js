import { isNil } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { lowerCaseFirst } from "../../utils.js";

export class RouteBuilder extends TypeBuilder {
  constructor(method, group, name, path) {
    super("route", group, name);

    this.data.method = method;
    this.data.path = path;
    this.data.tags = [];

    this.queryBuilder = undefined;
    this.paramsBuilder = undefined;
    this.bodyBuilder = undefined;
    this.responseBuilder = undefined;
  }

  /**
   * @param {string} values
   * @returns {RouteBuilder}
   */
  tags(...values) {
    for (const v of values) {
      this.data.tags.push(lowerCaseFirst(v));
    }

    return this;
  }

  /**
   * @param {TypeBuilder} builder
   * @returns {RouteBuilder}
   */
  query(builder) {
    this.queryBuilder = builder;

    if (isNil(this.queryBuilder.data.name)) {
      this.queryBuilder.data.group = this.data.group;
      this.queryBuilder.data.name = this.data.name + "Query";
    }

    return this;
  }

  /**
   * @param {TypeBuilder} builder
   * @returns {RouteBuilder}
   */
  params(builder) {
    this.paramsBuilder = builder;

    if (isNil(this.paramsBuilder.data.name)) {
      this.paramsBuilder.data.group = this.data.group;
      this.paramsBuilder.data.name = this.data.name + "Params";
    }

    return this;
  }

  /**
   * @param {TypeBuilder} builder
   * @returns {RouteBuilder}
   */
  body(builder) {
    if (["POST", "PUT", "DELETE"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use body on POST, PUT or DELETE routes");
    }

    this.bodyBuilder = builder;

    if (isNil(this.bodyBuilder.data.name)) {
      this.bodyBuilder.data.group = this.data.group;
      this.bodyBuilder.data.name = this.data.name + "Body";
    }

    return this;
  }

  /**
   * @param {TypeBuilder} builder
   * @returns {RouteBuilder}
   */
  response(builder) {
    this.responseBuilder = builder;

    if (isNil(this.responseBuilder.data.name)) {
      this.responseBuilder.data.group = this.data.group;
      this.responseBuilder.data.name = this.data.name + "Response";
    }

    return this;
  }

  build() {
    const result = super.build();

    if (this.queryBuilder) {
      result.query = this.queryBuilder.build();
    }
    if (this.paramsBuilder) {
      result.params = this.paramsBuilder.build();
    }
    if (this.bodyBuilder) {
      result.body = this.bodyBuilder.build();
    }
    if (this.responseBuilder) {
      result.response = this.responseBuilder.build();
    }

    return result;
  }
}

class RouteCreator {
  constructor(group, path) {
    this.data = {
      group,
      path,
    };

    if (this.data.path.startsWith("/")) {
      this.data.path = this.data.path.slice(1);
    }
  }

  /**
   * Create a new route group
   * Path will be concatenated with the current path of this group
   *
   * @param {string} name
   * @param {string} path
   * @returns {RouteCreator}
   */
  group(name, path) {
    return new RouteCreator(name, concatenateRoutePaths(this.data.path, path));
  }

  /**
   * GET route
   *
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  get(path, name) {
    return new RouteBuilder(
      "GET",
      this.data.group,
      name || "get",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * POST route
   *
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  post(path, name) {
    return new RouteBuilder(
      "POST",
      this.data.group,
      name || "post",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * PUT route
   *
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  put(path, name) {
    return new RouteBuilder(
      "PUT",
      this.data.group,
      name || "put",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * DELETE route
   *
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  delete(path, name) {
    return new RouteBuilder(
      "DELETE",
      this.data.group,
      name || "delete",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * HEAD route
   *
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  head(path, name) {
    return new RouteBuilder(
      "HEAD",
      this.data.group,
      name || "get",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }
}

const routeType = {
  name: "route",
  class: {
    builder: RouteBuilder,
    Creator: RouteCreator,
  },
};

/**
 * @name TypeCreator#router
 * @param {string} path
 * @returns {RouteCreator}
 */
TypeCreator.prototype.router = function (path) {
  return new RouteCreator(this.group, path);
};

TypeCreator.types.set(routeType.name, routeType);

/**
 * @param {string} path1
 * @param {string} path2
 * @returns {string}
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
