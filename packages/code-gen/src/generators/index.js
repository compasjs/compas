import { apiClientGenerator } from "./apiClient/index.js";
import { mockGenerator } from "./mocks/index.js";
import { routerGenerator } from "./router/index.js";
import { typeGenerator } from "./types/index.js";
import { validatorGenerator } from "./validator/index.js";

export const generators = {
  type: typeGenerator,
  validator: validatorGenerator,
  mock: mockGenerator,
  router: routerGenerator,
  apiClient: apiClientGenerator,
};
