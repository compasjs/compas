import { apiClientGenerator } from "./apiClient/index.js";
import { mockGenerator } from "./mocks/index.js";
import { reactQueryGenerator } from "./reactQuery/index.js";
import { routerGenerator } from "./router/index.js";
import { sqlGenerator } from "./sql/index.js";
import { typeGenerator } from "./types/index.js";
import { validatorGenerator } from "./validator/index.js";

/**
 * The core provided generators.
 *
 * @example  Use specific generators
 *   new App({ generators: [generators.type, generators.validator]});
 * @example  Use all generators
 *   new App({ generators: Object.values(generators) })
 *
 */
export const generators = {
  /**
   * Generate JSDoc or Typescript types
   *
   * @type {GeneratorPlugin}
   */
  type: typeGenerator,

  /**
   * Generate pure JS validators
   *
   * @type {GeneratorPlugin}
   */
  validator: validatorGenerator,

  /**
   * Generate customizable mocks
   *
   * @type {GeneratorPlugin}
   */
  mock: mockGenerator,

  /**
   * Generate a common prefix based router, supporting tag & group middleware
   *
   * @type {GeneratorPlugin}
   */
  router: routerGenerator,

  /**
   * Generate an Axios based api client
   *
   * @type {GeneratorPlugin}
   */
  apiClient: apiClientGenerator,

  /**
   * Generate basic CRUD queries
   *
   * @type {GeneratorPlugin}
   */
  sql: sqlGenerator,

  /**
   * Generate react-query based hooks wrapped around the apiClient
   *
   * @type {GeneratorPlugin}
   */
  reactQuery: reactQueryGenerator,
};
