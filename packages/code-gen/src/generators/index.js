import { apiClientGenerator } from "./apiClient/index.js";
import { mockGenerator } from "./mocks/index.js";
import { reactQueryGenerator } from "./reactQuery/index.js";
import { routerGenerator } from "./router/index.js";
import { sqlGenerator } from "./sql/index.js";
import { typeGenerator } from "./types/index.js";
import { validatorGenerator } from "./validator/index.js";

/**
 * @name GeneratorPlugin
 *
 * @typedef {object}
 * @property {string} name Generator name
 * @property {function(): void|Promise<void>} [init] Compile static templates and do
 *   other static checks
 * @property {function(App, object, GenerateOpts): void|Promise<void>} [preGenerate] Can be
 *   called multiple times, add dynamic types
 * @property {function(App, object, GenerateOpts):
 *   GeneratedFile[]|GeneratedFile|Promise<GeneratedFile[]|GeneratedFile>} [generate]
 *   Compile dynamic templates, execute template and return file
 */

/**
 * The core provided generators.
 *
 * @type {Map<string, GeneratorPlugin>}
 */
export const generators = new Map([
  ["type", typeGenerator],
  ["validator", validatorGenerator],
  ["mock", mockGenerator],
  ["router", routerGenerator],
  ["apiClient", apiClientGenerator],
  ["sql", sqlGenerator],
  ["reactQuery", reactQueryGenerator],
]);

export { generatorTemplates } from "./templates.js";
