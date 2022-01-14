export class RouteBuilder extends TypeBuilder {
  constructor(method: any, group: any, name: any, path: any);
  invalidates: any[];
  queryBuilder: any;
  paramsBuilder: any;
  bodyBuilder: any;
  filesBuilder: any;
  responseBuilder: any;
  /**
   * @param {...string} values
   * @returns {RouteBuilder}
   */
  tags(...values: string[]): RouteBuilder;
  /**
   * Guarantee to the client that this call does not have any side-effects.
   * Can only be used for "POST" requests. Doesn't do anything to the generated router,
   * but some clients may use it to their advantage like the react-query generator.
   *
   * @returns {RouteBuilder}
   */
  idempotent(): RouteBuilder;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  query(builder: any): RouteBuilder;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  params(builder: any): RouteBuilder;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  body(builder: any): RouteBuilder;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  files(builder: any): RouteBuilder;
  /**
   * Specify routes that can be invalidated when this route is called.
   *
   * @param {...import("./RouteInvalidationType.js").RouteInvalidationType} invalidates
   * @returns {RouteBuilder}
   */
  invalidations(
    ...invalidates: import("./RouteInvalidationType.js").RouteInvalidationType[]
  ): RouteBuilder;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  response(builder: any): RouteBuilder;
}
export class RouteCreator {
  constructor(group: any, path: any);
  data: {
    group: any;
    path: any;
  };
  /** @type {string[]} */
  defaultTags: string[];
  queryBuilder: any;
  paramsBuilder: any;
  bodyBuilder: any;
  filesBuilder: any;
  responseBuilder: any;
  /**
   * @param {...string} values
   * @returns {RouteCreator}
   */
  tags(...values: string[]): RouteCreator;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteCreator}
   */
  query(builder: any): RouteCreator;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteCreator}
   */
  params(builder: any): RouteCreator;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteCreator}
   */
  body(builder: any): RouteCreator;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteCreator}
   */
  files(builder: any): RouteCreator;
  /**
   * @param {import("../../index").TypeBuilderLike} builder
   * @returns {RouteCreator}
   */
  response(builder: any): RouteCreator;
  /**
   * Generate `queryClient.invalidateQueries` calls in the react-query generator, which
   * can be executed when the generated hook is called.
   *
   * @param {string} group
   * @param {string} [name]
   * @param {import("../generated/common/types").CodeGenRouteInvalidationTypeInput["properties"]} [properties]
   * @returns {RouteInvalidationType}
   */
  invalidates(
    group: string,
    name?: string | undefined,
    properties?:
      | {
          useSharedParams?: boolean | undefined;
          useSharedQuery?: boolean | undefined;
          specification?:
            | {
                params?:
                  | {
                      [key: string]: string[];
                    }
                  | undefined;
                query?:
                  | {
                      [key: string]: string[];
                    }
                  | undefined;
              }
            | undefined;
        }
      | undefined,
  ): RouteInvalidationType;
  /**
   * @param {string} name
   * @param {string} path
   * @returns {RouteCreator}
   */
  group(name: string, path: string): RouteCreator;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  get(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  post(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  put(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  patch(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  delete(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  head(path?: string | undefined, name?: string | undefined): RouteBuilder;
  /**
   * Create a new RouteBuilder and add the defaults if exists.
   *
   * @private
   *
   * @param {string} method
   * @param {string} group
   * @param {string} name
   * @param {string} path
   * @returns {RouteBuilder}
   */
  private create;
}
import { TypeBuilder } from "./TypeBuilder.js";
import { RouteInvalidationType } from "./RouteInvalidationType.js";
//# sourceMappingURL=RouteBuilder.d.ts.map
