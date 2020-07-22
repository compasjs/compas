import { apiClientGenerator } from "./apiClient/index.js";
import { reactQueryGenerator } from "./reactQuery/index.js";
import { routerGenerator } from "./router/index.js";
import { sqlGenerator } from "./sql/index.js";
import { typeGenerator } from "./types/index.js";
import { validatorGenerator } from "./validator/index.js";

/**
 * @type {Map<string, GeneratorPlugin>}
 */
export const generators = new Map([
  ["type", typeGenerator],
  ["validator", validatorGenerator],
  ["router", routerGenerator],
  ["apiClient", apiClientGenerator],
  ["sql", sqlGenerator],
  ["reactQuery", reactQueryGenerator],
]);

export { generatorTemplates } from "./templates.js";
