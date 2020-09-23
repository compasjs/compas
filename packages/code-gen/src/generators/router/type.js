import { isNil } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { buildOrInfer } from "../../types/TypeBuilder.js";
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
    this.filesBuilder = undefined;
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
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  query(builder) {
    this.queryBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  params(builder) {
    this.paramsBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  body(builder) {
    if (["POST", "PUT", "DELETE"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use body on POST, PUT or DELETE routes");
    }

    this.bodyBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  files(builder) {
    if (["POST", "PUT"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use files on POST or PUT routes");
    }

    this.filesBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  response(builder) {
    this.responseBuilder = builder;

    return this;
  }

  build() {
    const result = super.build();

    if (this.bodyBuilder && this.filesBuilder) {
      throw new Error(
        `Route ${result.group} - ${result.name} can't have both body and files.`,
      );
    }

    if (this.queryBuilder) {
      result.query = buildOrInfer(this.queryBuilder);

      if (isNil(result.query.name)) {
        result.query.group = result.group;
        result.query.name = `${result.name}Query`;
      }
    }

    if (this.bodyBuilder) {
      result.body = buildOrInfer(this.bodyBuilder);

      if (isNil(result.body.name)) {
        result.body.group = result.group;
        result.body.name = `${result.name}Body`;
      }
    }

    if (this.filesBuilder) {
      result.files = buildOrInfer(this.filesBuilder);

      if (isNil(result.files.name)) {
        result.files.group = result.group;
        result.files.name = `${result.name}Files`;
      }
    }

    if (this.responseBuilder) {
      result.response = buildOrInfer(this.responseBuilder);

      if (isNil(result.response.name)) {
        result.response.group = result.group;
        result.response.name = `${result.name}Response`;
      }
    }

    const pathParamKeys = collectPathParams(result.path);

    if (this.paramsBuilder || pathParamKeys.length > 0) {
      const paramsResult = buildOrInfer(this.paramsBuilder) ?? buildOrInfer({});
      paramsResult.group = result.group;
      paramsResult.name = `${result.name}Params`;

      for (const param of pathParamKeys) {
        if (isNil(paramsResult.keys?.[param])) {
          throw new Error(
            `Route ${result.group}->${result.name} is missing a type definition for '${param}' parameter.`,
          );
        }
      }

      for (const key of Object.keys(paramsResult.keys ?? {})) {
        if (pathParamKeys.indexOf(key) === -1) {
          throw new Error(
            `Route ${result.group}->${result.name} has type definition for '${key}' but is not found in the path: ${result.path}`,
          );
        }
      }

      result.params = paramsResult;
    }

    return result;
  }
}

/**
 * Collect all path params
 *
 * @param {string} path
 * @returns {string[]}
 */
function collectPathParams(path) {
  const keys = [];

  for (const part of path.split("/")) {
    if (part.startsWith(":")) {
      keys.push(part.substring(1));
    }
  }

  return keys;
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
   * @param {string} name
   * @param {string} path
   * @returns {RouteCreator}
   */
  group(name, path) {
    return new RouteCreator(name, concatenateRoutePaths(this.data.path, path));
  }

  /**
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
    Builder: RouteBuilder,
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
