import { apiClientGenerator } from "./apiClient/index.js";
import { mockGenerator } from "./mocks/index.js";
import { modelGenerator } from "./model/index.js";
import { R, routerGenerator } from "./router/index.js";
import { validatorGenerator } from "./validator/index.js";

export const generators = {
  model: modelGenerator,
  validator: validatorGenerator,
  mock: mockGenerator,
  router: routerGenerator,
  apiClient: apiClientGenerator,
};

export { R };
